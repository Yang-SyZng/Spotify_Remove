# Quantumult X configuration

[简体中文](配置.md) | English

[Back to the plugin catalog](README.en.md)

1. Add the English URL from the catalog as a rewrite resource, enable the resource, and update its contents.
2. Enable rewrites and MitM, then generate and install a certificate in the MitM settings. In iOS Settings → General → VPN & Device Management, install the downloaded profile. Then open Settings → General → About → Certificate Trust Settings and enable full trust for the root certificate you just installed.
3. Confirm that the resource’s MitM hostnames are loaded and the JavaScript file has downloaded. Script rules run as part of the rewrite resource.
4. Enable the client connection so the target app uses the active configuration. Confirm that the script has downloaded without errors. Fully quit and reopen the target app after changing the configuration.

Replace old subscriptions with the URL in the catalog, and disable older rewrite resources that handle the same requests.

References: [Quantumult X sample configuration](https://github.com/crossutility/Quantumult-X/blob/master/sample.conf), [iOS certificate trust](https://support.apple.com/en-us/102390).
