# Shadowrocket 插件聚合列表

[返回 plugin-hub](../../README.md)

| 插件 | 说明 | 配置文件 | 下载地址 | 教程 |
| --- | --- | --- | --- | --- |
| spotify-NoAD | Spotify 模块配置 | [spotify-NoAD.module](spotify-NoAD.module) | [下载模块](https://raw.githubusercontent.com/Yang-SyZng/plugin-hub/main/ios/shadowrocket/spotify-NoAD.module) | [安装与证书配置](archive/spotify-NoAD.md) |

## 安装与更新

在 Shadowrocket「配置 → 模块」中添加上表中的下载地址。需要 HTTPS 解密的模块须安装并信任对应证书。

全部脚本由本仓库维护，统一使用 [spotify-NoAD.js](../js/spotify/spotify-NoAD.js)，包含缓存头处理、专辑/歌手请求参数调整、账户配置响应修改与 gabo 本地空响应。旧订阅需换成上表的新地址；停用旧模块，更新后重启 Spotify。

客户端属性修改不代表服务端订阅状态改变；手机实际效果待验证。

原有 Spotify 教程及配图保留在 [archive/spotify-NoAD.md](archive/spotify-NoAD.md) 和 [archive/img/](archive/img/) 中。
