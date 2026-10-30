const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const source = fs.readFileSync(path.join(__dirname, '../plugins/js/spotify-customize.js'), 'utf8');
const url = 'https://gae2-spclient.spotify.com/user-customization-service/v1/customize';

function run(request, response) {
  const calls = [];
  vm.runInNewContext(source, {
    Uint8Array, ArrayBuffer,
    $request: { url, method: 'POST', ...request },
    $response: response,
    $done: result => calls.push(result),
    console: { log() {} }
  }, { timeout: 1000 });
  assert.equal(calls.length, 1, '$done must be called exactly once');
  return calls[0];
}

// Minimal fixture encoder; fixtures contain no account or capture data.
function integer(n) {
  const bytes = [];
  do { bytes.push((n & 127) | (n > 127 ? 128 : 0)); n = Math.floor(n / 128); } while (n);
  return Buffer.from(bytes);
}
function msg(id, content) {
  const bytes = typeof content === 'string' ? Buffer.from(content) : Buffer.concat(content);
  return Buffer.concat([integer(id * 8 + 2), integer(bytes.length), bytes]);
}
function attr(key, value, unknown = []) {
  const encoded = typeof value === 'boolean' ? Buffer.from([16, Number(value)]) : msg(4, value);
  return msg(1, [msg(1, key), msg(2, [...unknown, encoded])]);
}
function flag(scope, name, value) {
  return msg(3, [msg(1, [msg(1, scope), msg(2, name)]),
    msg(2, [Buffer.from([8, 1])]), msg(3, [Buffer.from([8, Number(value)])])]);
}
function fixture(attributes, flags = []) {
  return msg(1, [msg(1, [msg(1, flags)]), msg(3, attributes)]);
}
const expected = {
  type: 'premium', catalogue: 'premium', name: 'Spotify Premium',
  'player-license': 'premium', 'financial-product': 'pr:premium,tc:0',
  ads: false, 'ab-ad-player-targeting': false,
  'allow-advertising-id-transmission': false, 'restrict-advertising-id-transmission': true,
  'on-demand': true, unrestricted: true, shuffle: false, 'nft-disabled': '1',
  'com.spotify.madprops.use.ucs.product.state': true,
  'com.spotify.madprops.delivered.by.ucs': true
};

test('request removes conditional headers regardless of capitalization', () => {
  const result = run({ headers: {
    'if-none-match': 'etag', 'IF-MODIFIED-SINCE': 'date', 'Content-Type': 'application/protobuf'
  } });
  assert.deepEqual(Object.keys(result.headers), ['Content-Type']);
});

test('customize keeps unknown fields and unrelated config bytes', () => {
  const unknown = Buffer.from([0x98, 6, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 1]);
  const opaque = msg(99, [Buffer.from([0, 255, 128, 1])]);
  const originalFlags = [flag('unrelated', 'enabled', true), opaque];
  const input = Buffer.concat([
    fixture([attr('type', 'free', [unknown]), attr('unrelated', '原始值'), opaque], originalFlags), unknown
  ]);
  const result = run({}, { status: 200, body: input });
  const entries = Object.entries(expected).map(([key, value]) => attr(key, value));
  // Existing entries keep their positions, including unknown nested attribute fields.
  entries[0] = attr('type', 'premium', [unknown]);
  const want = Buffer.concat([fixture([
    entries[0], attr('unrelated', '原始值'), opaque, ...entries.slice(1)
  ], originalFlags), unknown]);
  assert.deepEqual(Buffer.from(result.body), want);
  // Applying the handler twice must not add duplicate account attributes.
  assert.deepEqual(Buffer.from(run({}, { status: 200, body: result.body }).body), want);
});

test('only the exact captured upsell flag is changed', () => {
  const scope = 'ios-feature-premium-destination-badge';
  const input = fixture([], [flag(scope, 'badge_enabled', true), flag('another-scope', 'badge_enabled', true)]);
  const result = run({}, { statusCode: 200, body: input.buffer.slice(input.byteOffset, input.byteOffset + input.length) });
  const want = fixture(Object.entries(expected).map(([k, v]) => attr(k, v)), [
    flag(scope, 'badge_enabled', false), flag('another-scope', 'badge_enabled', true)
  ]);
  assert.deepEqual(Buffer.from(result.body), want);
});

test('bootstrap preserves other services and accepts port/query string', () => {
  const otherService = msg(3, [msg(1, [Buffer.from([8, 1])])]);
  const wrap = inner => Buffer.concat([msg(2, [msg(1, [msg(1, [inner])])]), otherService]);
  const input = wrap(fixture([]));
  const result = run({ url: 'https://spclient.wg.spotify.com:443/bootstrap/v1/bootstrap?v=1' }, { status: 200, body: input });
  assert.deepEqual(Buffer.from(result.body), wrap(fixture(Object.entries(expected).map(([k, v]) => attr(k, v)))));
});

test('errors, missing bodies, nonbinary bodies and unexpected schemas pass through', () => {
  const cases = [
    { status: 304 }, { status: 500, body: fixture([]) },
    { status: 200, body: 'not binary' }, { status: 200 },
    { status: 200, body: new Uint8Array() },
    { status: 200, body: Buffer.from([10, 255]) },
    { status: 200, body: Buffer.from([10, 10, 0]) },
    { status: 200, body: Buffer.from([15]) },
    { status: 200, body: msg(2, [Buffer.from([8, 1])]) }
  ];
  for (const response of cases) assert.equal(Object.keys(run({}, response)).length, 0);
  assert.equal(Object.keys(run({ method: 'GET' }, { status: 200, body: fixture([]) })).length, 0);
  assert.equal(Object.keys(run({ url: 'https://example.com/other' }, { status: 200, body: fixture([]) })).length, 0);
});

test('plugin routes both endpoints, ports and queries with binary response mode', () => {
  const plugin = fs.readFileSync(path.join(__dirname, '../plugins/spot-NoAd.plugin'), 'utf8');
  const lines = plugin.split(/\r?\n/).filter(line => line.includes('tag=Spotify'));
  assert.equal(lines.length, 2);
  for (const line of lines) {
    const pattern = new RegExp(line.split(' ')[1]);
    for (const host of ['spclient.wg.spotify.com', 'gae2-spclient.spotify.com', 'gew1-spclient.spotify.com:443']) {
      for (const endpoint of ['bootstrap/v1/bootstrap', 'user-customization-service/v1/customize']) {
        assert(pattern.test(`https://${host}/${endpoint}`));
        assert(pattern.test(`https://${host}/${endpoint}?v=1`));
      }
    }
    assert(!pattern.test('https://spclient.wg.spotify.com.example.org/user-customization-service/v1/customize'));
    assert(!pattern.test(`${url}/other`));
    if (line.startsWith('http-response')) assert(line.includes('binary-body-mode=true'));
    assert(line.includes('Yang-SyZng/Spotify_Remove/main/plugins/js/spotify-customize.js'));
  }
});
