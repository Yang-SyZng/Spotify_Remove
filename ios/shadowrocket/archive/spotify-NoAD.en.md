# Spotify · Shadowrocket

[简体中文](spotify-NoAD.md) | English

[Back to plugin-hub](../../../README.en.md)

# Listening to Spotify on iOS (archived guide)

This guide was assembled from material available online, with adjustments along the way. It documents the setup process to make it easier to follow and is not a commercial project.

This is an archived guide. For the current setup instructions, see [Shadowrocket configuration](../configuration.en.md). Both language editions share the original Chinese screenshots.

> **Links used in this guide (press and hold to copy)**
>
> Link 1: `https://raw.githubusercontent.com/Yang-SyZng/plugin-hub/main/ios/shadowrocket/spotify-NoAD.en.module`
>
> Link 2: `https://johnshall.github.io/Shadowrocket-ADBlock-Rules-Forever/lazy_group.conf`
>
> Link 3: `https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Loon/Spotify/Spotify.list`

Forked from [@app2smile](https://github.com/app2smile)

## Installing the module

**Make sure your proxy connection is already available before starting.**

### 1. Create the module — preparation

Open the Config tab at the bottom and tap Modules.

<div align="center">
<img src="./img/1.png" style="zoom:52%" alt="Step 1"/>
</div>

**At the time this guide was written, a Shadowrocket update prevented the “+” button in the Modules screen from importing a copied GitHub raw URL directly, so the guide used a manual method.**

Tap Create Module.

<div align="center">
<img src="./img/2.png" style="zoom:52%" alt="Step 2"/>
</div>

The following editor appears.

<div align="center">
<img src="./img/3.png" style="zoom:52%" alt="Step 3"/>
</div>

**Clear the existing content:**

`#!name=Name Here`

`#!desc=Description Here`

---

### 2. Import the module

> Link 1: `https://raw.githubusercontent.com/Yang-SyZng/plugin-hub/main/ios/shadowrocket/spotify-NoAD.en.module`

## Direct import later appeared to work again

<div align="center">
<img src="./img/25.jpg" style="zoom:10%" alt="Step 25"/>
</div>

If direct import still does not work, the original manual steps are preserved below.

~~Open the URL in Safari or another browser.~~

~~Select all and copy.~~

<div align="center">
<img src="./img/4.png" style="zoom:50.1%" alt="Step 4"/>
</div>

~~Paste the contents into Shadowrocket and save.~~

<div align="center">
<img src="./img/5.png" style="zoom:60%" alt="Step 5"/>
</div>

~~The module may download automatically after saving and display a success message.~~

~~If it reports a failure, tap the circled control to download the script again.~~

~~The original guide suggested checking each download control to make sure it had completed.~~

<div align="center">
<img src="./img/6.png" style="zoom:23.6%" alt="Step 6"/>
</div>

~~The module has now been imported.~~

---

### 3. Import a configuration file

Return to Config and tap “+” in the upper-right corner.

<div align="center">
<img src="./img/7.jpg" style="zoom:23.5%" alt="Step 7"/>
</div>

Paste the following URL and download the configuration.

> Link 2: `https://johnshall.github.io/Shadowrocket-ADBlock-Rules-Forever/lazy_group.conf`

<div align="center">
<img src="./img/8.jpg" style="zoom:23.5%" alt="Step 8"/>
</div>

Once lazy-group.conf appears, press and hold it and select Use Configuration. The orange selection dot should appear on that row.

---

> Why use this configuration?
>
> The original guide kept the proxy connected while using the Spotify client configuration. Some domestic apps or websites could then load slowly. This routing configuration sends domestic traffic directly and routes other traffic according to its rules.
>
> For other configurations, see [Shadowrocket-ADBlock-Rules-Forever](https://github.com/Johnshall/Shadowrocket-ADBlock-Rules-Forever), maintained by @Johnshall.

---

### 4. Install and trust the certificate

Tap the information (“i”) button next to the selected configuration.

<div align="center">
<img src="./img/9.png" style="zoom:165%" alt="Step 9"/>
</div>

Tap HTTPS Decryption.

<div align="center">
<img src="./img/10.png" style="zoom:50%" alt="Step 10"/>
</div>

Enable HTTPS Decryption.

<div align="center">
<img src="./img/11.png" style="zoom:80%" alt="Step 11"/>
</div>

Tap Generate New CA Certificate and confirm the same action in the dialog.

<div align="center">
<img src="./img/12.png" style="zoom:80%" alt="Step 12"/>
</div>

The certificate controls should now appear. Tap Install Certificate.

<div align="center">
<img src="./img/13.png" style="zoom:80%" alt="Step 13"/>
</div>

Allow the profile download.

<div align="center">
<img src="./img/14.png" style="zoom:80%" alt="Step 14"/>
</div>

Leave Shadowrocket and open iOS Settings. Tap Profile Downloaded near the top, or open General → VPN & Device Management and find the downloaded profile.

<div align="center">
<img src="./img/15.png" style="zoom:80%" alt="Step 15"/>
</div>

Open the profile and tap Install in the upper-right corner. Complete installation.

<div align="center">
<img src="./img/16.png" style="zoom:75%" alt="Step 16"/>
</div>

Open Settings → General → About, then scroll down to Certificate Trust Settings.

<div align="center">
<img src="./img/17.png" style="zoom:74%" alt="Step 17"/>
</div>

Enable trust for the certificate.

<div align="center">
<img src="./img/18.png" style="zoom:74%" alt="Step 18"/>
</div>

<div align="center">
<img src="./img/19.png" style="zoom:74%" alt="Step 19"/>
</div>

Return to Shadowrocket and confirm that the certificate is shown as trusted by the system.

<div align="center">
<img src="./img/20.png" style="zoom:74%" alt="Step 20"/>
</div>

---

### 5. Add Spotify routing rules, if needed

Tap the information (“i”) button next to the selected configuration.

<div align="center">
<img src="./img/9.png" style="zoom:165%" alt="Step 9"/>
</div>

**Search for “spotify”. If Spotify rules are already present, skip this step.**

<div align="center">
<img src="./img/21.jpg" style="zoom:74%" alt="Step 21"/>
</div>

If there are no Spotify rules, tap Rules.

<div align="center">
<img src="./img/22.png" style="zoom:165%" alt="Step 22"/>
</div>

Tap “+” in the upper-right corner.

<div align="center">
<img src="./img/23.png" style="zoom:165%" alt="Step 23"/>
</div>

The original guide pasted the following rule-list URL into the Domain field, left the other options at their defaults, and saved.

> Link 3: `https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Loon/Spotify/Spotify.list`

<div align="center">
<img src="./img/24.png" style="zoom:165%" alt="Step 24"/>
</div>

Return to the previous screen after saving.

### Shadowrocket setup is complete; reopen Spotify
