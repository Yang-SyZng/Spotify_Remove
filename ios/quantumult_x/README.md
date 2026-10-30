# Quantumult X 插件聚合列表

[返回 plugin-hub](../../README.md)

| 插件 | 说明 | 配置文件 | 下载地址 |
| --- | --- | --- | --- |
| spotify-NoAD | Spotify 重写配置 | [spotify-NoAD.conf](spotify-NoAD.conf) | [下载配置](https://raw.githubusercontent.com/Yang-SyZng/plugin-hub/main/ios/quantumult_x/spotify-NoAD.conf) |

## 安装与更新

将上表中的下载地址添加到 Quantumult X 重写资源，开启资源和对应的 HTTPS 解密。

全部脚本由本仓库维护，统一使用 [spotify-NoAD.js](../js/spotify/spotify-NoAD.js)，通过 `bodyBytes` 处理二进制响应。包含缓存头处理、专辑/歌手请求参数调整、账户配置响应修改与 gabo 本地空响应。

旧订阅需换成上表的新地址；停用旧重写资源，更新后重启 Spotify。客户端属性修改不代表服务端订阅状态改变；手机实际效果待验证。

各客户端配置独立维护；Loon 的自定义选项仅在 Loon 插件中提供。
