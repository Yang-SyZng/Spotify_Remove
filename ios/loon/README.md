# Loon 插件聚合列表

[返回 plugin-hub](../../README.md)

| 插件 | 说明 | 配置文件 | 下载地址 |
| --- | --- | --- | --- |
| Spotify 去广告 | 客户端去广告配置、Spotify Connect 入口开关及旧版创建按钮兼容选项 | [spot-NoAd.plugin](spot-NoAd.plugin) | [下载插件](https://raw.githubusercontent.com/Yang-SyZng/plugin-hub/main/ios/loon/spot-NoAd.plugin) |

## 安装与更新

在 Loon「配置 → 插件」中添加上表中的下载地址。确认脚本下载完成，开启 HTTPS 解密并信任证书，然后完全退出并重新打开 Spotify。

Spotify 脚本：[ios/js/spotify/spotify-customize.js](../js/spotify/spotify-customize.js)。

## Spotify 选项

| 选项 | 默认值 | 作用 |
| --- | --- | --- |
| 创建按钮（旧版兼容） | 跟随 App | 仅处理已有的旧版导航实验；新版请到 Spotify「设置和隐私 → 内容和显示」设置创建按钮 |
| Spotify Connect 入口 | 开启 | 控制切换播放设备的入口；不会断开已有会话或改变服务端权限 |

修改选项后需完全退出并重新打开 Spotify。客户端属性修改不代表服务端订阅状态改变。
