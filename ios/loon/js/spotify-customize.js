// Spotify bootstrap/customize response handler for Loon.
// Wire layout follows app2smile/rules/js/spotify-proto.js.
// Keep unrelated fields (including unknown protobuf fields) byte-for-byte.
(function () {
  var result = {};
  try {
    var options = readOptions();
    var path = $request.url.replace(/^https:\/\/[^/]+/, '').split('?')[0];
    var bootstrap = path === '/bootstrap/v1/bootstrap';
    if (bootstrap || path === '/user-customization-service/v1/customize') {
      if (typeof $response === 'undefined') {
        var headers = Object.assign({}, $request.headers);
        Object.keys(headers).forEach(function (key) {
          if (/^(if-none-match|if-modified-since)$/i.test(key)) delete headers[key];
        });
        result = { headers: headers };
      } else if (String($response.status || $response.statusCode) === '200' &&
                 $request.method.toUpperCase() === 'POST') {
        var body = $response.body;
        if (body instanceof ArrayBuffer) body = new Uint8Array(body);
        if (!(body instanceof Uint8Array)) throw new Error('Enable binary-body-mode=true');
        // BootstrapResponse.ucsResponseV0.success.customization is a UCS wrapper.
        var output = bootstrap ? atPath(body, [2, 1, 1], patchWrapper) : patchWrapper(body);
        result = { body: output };
        console.log('[Spotify] ' + (bootstrap ? 'bootstrap' : 'customize') + ' patched');
      }
    }
  } catch (error) {
    // Never replace an error, an unsupported schema, or a truncated response.
    console.log('[Spotify] Response unchanged: ' + error.message);
  }
  $done(result);

  function readOptions() {
    var args = typeof $argument === 'undefined' ? {} : $argument;
    if (typeof args === 'string') {
      try { args = JSON.parse(args); } catch (_) { args = {}; }
    }
    if (!args || typeof args !== 'object') args = {};
    var connect = args.connectEnabled;
    return {
      createButton: args.createButton === '隐藏' || args.createButton === '显示' ? args.createButton : '跟随App',
      // An older plugin without arguments must keep the server's Connect value.
      connectEnabled: connect === true || connect === 'true' ? true :
        connect === false || connect === 'false' ? false : null
    };
  }

  function concat(parts) {
    var size = parts.reduce(function (n, p) { return n + p.length; }, 0);
    var out = new Uint8Array(size), offset = 0;
    parts.forEach(function (p) { out.set(p, offset); offset += p.length; });
    return out;
  }

  function varint(value) {
    var bytes = [];
    do {
      var byte = value % 128;
      value = Math.floor(value / 128);
      bytes.push(byte | (value ? 128 : 0));
    } while (value);
    return new Uint8Array(bytes);
  }

  function readVarint(bytes, state, scalar) {
    var value = 0, factor = 1;
    for (var n = 0; n < 10; n++) {
      if (state.offset >= bytes.length) throw new Error('Truncated varint');
      var byte = bytes[state.offset++];
      if (n === 9 && byte > 1) throw new Error('Invalid varint');
      if (!scalar) value += (byte & 127) * factor;
      if (!(byte & 128)) {
        if (!scalar && !Number.isSafeInteger(value)) throw new Error('Oversized varint');
        return value;
      }
      factor *= 128;
    }
    throw new Error('Invalid varint');
  }

  function fields(bytes) {
    var out = [], state = { offset: 0 };
    while (state.offset < bytes.length) {
      var start = state.offset, tag = readVarint(bytes, state, false);
      var id = Math.floor(tag / 8), wire = tag % 8, data;
      if (!id || id > 536870911) throw new Error('Invalid field number');
      if (wire === 2) {
        var length = readVarint(bytes, state, false), begin = state.offset;
        state.offset += length;
        data = bytes.subarray(begin, state.offset);
      } else if (wire === 0) readVarint(bytes, state, true);
      else if (wire === 1) state.offset += 8;
      else if (wire === 5) state.offset += 4;
      else throw new Error('Unsupported wire type');
      if (state.offset > bytes.length) throw new Error('Truncated field');
      out.push({ id: id, wire: wire, data: data, raw: bytes.subarray(start, state.offset) });
    }
    return out;
  }

  function message(id, bytes) {
    return concat([varint(id * 8 + 2), varint(bytes.length), bytes]);
  }

  // Only identifiers and replacement values are ASCII; other strings stay raw.
  function ascii(value) {
    var out = new Uint8Array(value.length);
    for (var i = 0; i < value.length; i++) out[i] = value.charCodeAt(i);
    return out;
  }

  function text(bytes) {
    var out = '';
    for (var i = 0; i < bytes.length; i++) out += String.fromCharCode(bytes[i]);
    return out;
  }

  function atPath(bytes, path, transform) {
    if (!path.length) return transform(bytes);
    var found = false;
    var parts = fields(bytes).map(function (field) {
      if (field.id !== path[0] || field.wire !== 2) return field.raw;
      found = true;
      return message(field.id, atPath(field.data, path.slice(1), transform));
    });
    if (!found) throw new Error('Expected protobuf path missing');
    return concat(parts);
  }

  function patchWrapper(bytes) {
    return atPath(bytes, [1], function (success) {
      // Account attributes must exist; do not manufacture success on error responses.
      var withAttributes = atPath(success, [3], patchAttributes);
      return concat(fields(withAttributes).map(function (field) {
        if (field.id !== 1 || field.wire !== 2) return field.raw;
        return message(1, atPath(field.data, [1], patchConfiguration));
      }));
    });
  }

  function patchAttributes(bytes) {
    var values = {
      'type': 'premium', 'catalogue': 'premium', 'name': 'Spotify Premium',
      'player-license': 'premium', 'financial-product': 'pr:premium,tc:0',
      'ads': false, 'ab-ad-player-targeting': false,
      'allow-advertising-id-transmission': false,
      'restrict-advertising-id-transmission': true,
      'on-demand': true, 'unrestricted': true, 'shuffle': false,
      'nft-disabled': '1',
      'com.spotify.madprops.use.ucs.product.state': true,
      'com.spotify.madprops.delivered.by.ucs': true
    };
    // This account attribute is present in the supplied 9.1.94 capture.
    // It controls entry points, not server permissions or existing sessions.
    if (options.connectEnabled !== null) values['allow-connect-entry-points'] = options.connectEnabled;
    var seen = Object.create(null);
    var parts = fields(bytes).map(function (field) {
      if (field.id !== 1 || field.wire !== 2) return field.raw;
      var entry = fields(field.data);
      var keyField = entry.find(function (f) { return f.id === 1 && f.wire === 2; });
      if (!keyField) return field.raw;
      var key = text(keyField.data);
      if (!Object.prototype.hasOwnProperty.call(values, key)) return field.raw;
      seen[key] = true;
      var hasValue = false;
      var updated = entry.map(function (f) {
        if (f.id !== 2 || f.wire !== 2) return f.raw;
        hasValue = true;
        // AccountAttribute oneof: bool=2, int64=3, string=4.
        var unknown = fields(f.data).filter(function (v) {
          return v.id !== 2 && v.id !== 3 && v.id !== 4;
        }).map(function (v) { return v.raw; });
        return message(2, concat(unknown.concat([attribute(values[key])])));
      });
      if (!hasValue) updated.push(message(2, attribute(values[key])));
      return message(1, concat(updated));
    });
    Object.keys(values).forEach(function (key) {
      if (!seen[key]) parts.push(message(1, concat([
        message(1, ascii(key)), message(2, attribute(values[key]))
      ])));
    });
    return concat(parts);
  }

  function attribute(value) {
    return typeof value === 'boolean' ? new Uint8Array([16, value ? 1 : 0]) : message(4, ascii(value));
  }

  function patchConfiguration(bytes) {
    // These exact scope/name pairs are present in the 2026-10-30 capture.
    // Do not replace the user's full experiment configuration with a fixed list.
    var disabled = [
      'ios-settings-rootpage-impl/use_compact_upsell',
      'ios-reinventfree-contextualupsellpremiumpromo-impl/is_promo_cta_enabled',
      'ios-feature-premium-destination-badge/badge_enabled',
      'ios-reinventfree-controllerui-impl/enable_video_time_cap_upsell',
      'ios-reinventfree-timecappivot-impl/music_video_upsell_enabled'
    ];
    var navigationFound = false;
    var output = concat(fields(bytes).map(function (field) {
      if (field.id !== 3 || field.wire !== 2) return field.raw;
      var assigned = fields(field.data);
      var property = assigned.find(function (f) { return f.id === 1 && f.wire === 2; });
      if (!property) return field.raw;
      var identifier = fields(property.data), scope = '', name = '';
      identifier.forEach(function (f) {
        if (f.wire === 2 && f.id === 1) scope = text(f.data);
        if (f.wire === 2 && f.id === 2) name = text(f.data);
      });
      if (scope === 'ios-feature-navigation' && name === 'tab_configuration') {
        navigationFound = true;
        // Never inject this retired experiment into a new app configuration.
        // The 9.1.94 capture omits it; modern clients have a device-local setting.
        if (options.createButton === '隐藏') return new Uint8Array(0);
        if (options.createButton === '显示') {
          var previousEnum = assigned.find(function (f) { return f.id === 5 && f.wire === 2; });
          var enumFields = previousEnum ? fields(previousEnum.data).filter(function (f) {
            return f.id !== 1;
          }).map(function (f) { return f.raw; }) : [];
          var preserved = assigned.filter(function (f) { return f.id < 3 || f.id > 5; });
          return message(3, concat(preserved.map(function (f) { return f.raw; }).concat([
            message(5, concat(enumFields.concat([message(1, ascii('CreateRight'))])))
          ])));
        }
      }
      if (disabled.indexOf(scope + '/' + name) === -1) return field.raw;
      // AssignedValue oneof: BoolValue=3, IntValue=4, EnumValue=5.
      var oldBool = assigned.find(function (f) { return f.id === 3 && f.wire === 2; });
      var boolFields = oldBool ? fields(oldBool.data).filter(function (f) {
        return f.id !== 1;
      }).map(function (f) { return f.raw; }) : [];
      var kept = assigned.filter(function (f) { return f.id < 3 || f.id > 5; });
      return message(3, concat(kept.map(function (f) { return f.raw; }).concat([
        message(3, concat(boolFields.concat([new Uint8Array([8, 0])])))
      ])));
    }));
    if (!navigationFound && options.createButton !== '跟随App') {
      console.log('[Spotify] Create button: legacy navigation flag absent; use the in-app Content and display setting');
    }
    return output;
  }
})();
