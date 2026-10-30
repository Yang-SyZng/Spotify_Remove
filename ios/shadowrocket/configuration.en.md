# Shadowrocket configuration

[简体中文](配置.md) | English

[Back to the plugin catalog](README.en.md)

1. Open Config → Modules in Shadowrocket, add the English module URL from the catalog, and enable the module. Confirm that the active configuration loads it.
2. Enable HTTPS decryption (MitM) in the active configuration, then generate and install a certificate. In iOS Settings → General → VPN & Device Management, install the downloaded profile. Then open Settings → General → About → Certificate Trust Settings and enable full trust for the root certificate you just installed.
3. Confirm that rewrites are allowed, the module’s JavaScript scripts are enabled, and the required hostnames are in the HTTPS decryption list.
4. Enable the client connection so the target app uses the active configuration. Confirm that the script has downloaded without errors. Fully quit and reopen the target app after changing the configuration.

Replace old subscriptions with the URL in the catalog, and disable older modules that handle the same requests.

Historical Spotify installation guide and screenshots: [Archived guide](archive/spotify-NoAD.en.md).

References: [Shadowrocket features](https://apps.apple.com/app/shadowrocket/id932747118), [iOS certificate trust](https://support.apple.com/en-us/102390).
