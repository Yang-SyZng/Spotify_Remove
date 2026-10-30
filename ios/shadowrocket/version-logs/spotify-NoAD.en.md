# spotify-NoAD.en.module

[简体中文](spotify-NoAD.md) | English

## 2026.10.30-r8 Chinese and English editions

- Documentation and client configurations have separate Chinese and English editions, with language switches and English indexes.
- The English configuration is `spotify-NoAD.en.module`; English import links point to that file.
- Both editions share the same JavaScript file and screenshots.

## 2026.10.30-r7 Consistent naming and repository-maintained scripts

- Renamed the configuration to `spotify-NoAD.module` and updated its download URL.
- Uses Shadowrocket module syntax and binary mode for responses.
- Cache-header handling, album/artist request parameters, account-configuration responses, and empty local gabo responses all use this repository’s [spotify-NoAD.js](../../js/spotify/spotify-NoAD.js).
- Removed external JavaScript dependencies while retaining attribution for the protocol structure.
- `desc` describes the purpose; `date` records the version separately. Changes are documented here.
- Replace old subscriptions with the address in the [plugin catalog](../README.en.md). Disable the old configuration and restart Spotify after updating.

## Validation and limitations

r7 passed 30 offline checks covering request headers, parameter handling, binary responses, gabo response formats, unknown-field preservation, error passthrough, and links. On-device behavior still needs verification. Changing client attributes does not change the server-side subscription.
