# Loon configuration

[简体中文](配置.md) | English

[Back to the plugin catalog](README.en.md)

Use **Loon 3.5.1 (983) or later**. This plugin uses the new Script configuration syntax.

1. Open Configuration → Plugins in Loon, add the English import URL from the catalog, and enable the plugin.
2. Enable MitM in the configuration, then generate and install a certificate. In iOS Settings → General → VPN & Device Management, install the downloaded profile. Then open Settings → General → About → Certificate Trust Settings and enable full trust for the root certificate you just installed.
3. Enable rewrites and scripts. Confirm that the plugin’s rewrite rules, JavaScript scripts, and MitM hostnames are loaded.
4. Enable the client connection so the target app uses the active configuration. Confirm that the script has downloaded without errors. Fully quit and reopen the target app after changing the configuration.

Replace old subscriptions with the URL in the catalog, and disable older plugins that handle the same requests.

References: [Loon plugin documentation](https://nsloon.app/en/docs/Plugin/), [iOS certificate trust](https://support.apple.com/en-us/102390).
