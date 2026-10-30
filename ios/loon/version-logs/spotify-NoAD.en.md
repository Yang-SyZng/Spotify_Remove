# spotify-NoAD.en.plugin

[简体中文](spotify-NoAD.md) | English

## Spotify options

| Option | Default | Behavior |
| --- | --- | --- |
| Create button (legacy) | Follow App | Only affects existing legacy navigation experiments. In newer Spotify versions, use Settings and privacy → Content and display → Create button. |
| Spotify Connect entry points | On | Controls the device-switching entry points. It does not end existing sessions or change server-side permissions. |

Fully quit and reopen Spotify after changing an option. Changing client attributes does not change the server-side subscription.

This document covers the Loon `.plugin` configuration. Shadowrocket modules and Quantumult X rewrite resources have their own files and changelogs.

English import/update URL:

https://raw.githubusercontent.com/Yang-SyZng/plugin-hub/main/ios/loon/spotify-NoAD.en.plugin

After updating, confirm that `SpotifyCache` and `SpotifyCustomize` have downloaded, enable HTTPS decryption, trust the certificate, and fully quit and reopen Spotify. Avoid enabling multiple plugins that handle bootstrap/customize responses, as the same response could be rewritten repeatedly.

## 2026.10.30-r9 Chinese and English editions

- Documentation and client configurations have separate Chinese and English editions, with language switches and English indexes.
- The English configuration is `spotify-NoAD.en.plugin`; English import links point to that file.
- Both editions share the same JavaScript file and screenshots. The Chinese display name is `spotify去广告`; the English display name is `Spotify Ad Blocker`. The shared script maps English option values to the same behavior as their Chinese equivalents.

## 2026.10.30-r8 New Script configuration syntax

- `desc` describes the purpose only; `date` records `2026.10.30-r8` separately. Changes are documented here.
- Migrated Loon’s three Script directives to `request/response if ... then script(...) with ...`.
- Renamed the body options to `requires_body` and `binary_body_mode`. Plugin parameters are passed as an object through `{${createButton}, ${connectEnabled}}`.
- Declared a minimum Loon version of `3.5.1(983)`. URL matching, binary handling, and option behavior remain the same.
- This migration only affects Loon Script configuration. The shared JavaScript, Quantumult X configuration, and Shadowrocket module retain their existing interfaces and formats.
- Reference: [Loon’s new Script syntax](https://nsloon.app/en/docs/Script/script_v2/). Import and runtime behavior still need on-device verification.

## 2026.10.30-r7 Consistent naming and repository-maintained scripts

- Renamed the three client configurations and shared script to use `spotify-NoAD`, and updated download URLs.
- The shared script is `ios/js/spotify/spotify-NoAD.js`. It preserves Loon’s options and supports Shadowrocket binary responses and Quantumult X `bodyBytes`.
- Implemented empty local gabo responses in this repository, replacing the external script.
- Shadowrocket and Quantumult X also use this repository’s implementations for cache headers and album/artist request parameters. Client configurations no longer reference external JavaScript.
- Retained the protocol-structure reference as attribution; its script is not downloaded at runtime.
- Replace old subscriptions with the addresses in the client READMEs, disable older configurations, and restart Spotify.
- r7 validation: 30 offline checks passed, covering gabo response formats, cache headers, request parameters, binary responses, unknown-field preservation, error passthrough, documentation links, and script references. The three clients still need on-device testing.

## 2026.10.30-r2 Search compatibility fix

After reports that Search displayed “Something went wrong. Try again.” following an update, the old Search, Home, and scrolling-ad response scripts were disabled. These page responses now pass through unchanged; bootstrap/customize client-attribute handling remains enabled.

The old Search script did not enable binary mode, yet wrote the response back through `$done({body})`. It scanned the first 666 bytes and treated matching byte patterns as ad fields. Replaying a supplied Home Protobuf response through the text-writeback path changed its size from 89,899 to 92,121 bytes. A nested-field fixture also reproduced incorrect modifications. The Home and scrolling scripts used similar byte scanning and could write the unsupported Protobuf wire type 7; enabling binary mode alone would not fix them.

After updating, confirm that the response rules for `spot-NoSearchAd.js`, `spot-NoHomeAd.js`, and `spot-NoScrollAd.js` are gone, then fully quit and reopen Spotify. Promotional cards may reappear on those pages.

The original HAR did not contain browsita requests or the failed Search request, so it could not establish the sole cause of the reported failure. If the error persists, capture the process from opening Search until the error appears so the failing endpoint can be checked.

## 2026.10.30-r1 Fixes

- Enabled `binary-body-mode=true` for bootstrap/customize and supported regional hosts, explicit port 443, and query parameters.
- Hosted the core script in this repository. Conditional cache headers are removed case-insensitively to avoid a 304 response with no modifiable body.
- Modified account attributes and five observed promotional settings according to the Protobuf field structure, preserving other fields and unknown fields. The previous script replaced the entire configuration with a fixed list.
- Removed the rule rejecting all of `googleusercontent.com`; domain blocking cannot selectively disable Spotify QUIC at the protocol level.
- Preserved the original response on exceptions, empty responses, or unknown structures, rather than fabricating a successful result.

Protocol-structure reference: https://github.com/app2smile/rules/blob/master/js/spotify-proto.js

At that time, gabo still used an external script. It was replaced by this repository’s implementation in r7.

## Validation and limitations

Early versions were validated with offline Node.js tests. That test directory has since been removed.

In the user-supplied HAR from 2026-10-30, the customize response was 110,746 bytes and contained 1,132 configuration entries. Offline replay retained all 1,132 entries and changed only five selected promotional flags. Synthetic bootstrap responses, cache headers, unknown-field preservation, and exception handling were also tested. The HAR, login credentials, and account data were not added to the repository.

This has not yet been validated in a real iPhone/Loon session. Changing client attributes does not change the server-side subscription and does not guarantee offline downloads, high-quality audio, or other server-side Premium features. If the plugin still does not work after updating, provide Loon script logs and a cold-start bootstrap/customize capture to check whether the script ran and whether the client used the modified attributes.
