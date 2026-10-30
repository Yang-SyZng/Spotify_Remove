# spot-NoAd.plugin

此文件使用 Loon 的 `.plugin` 配置格式。Shadowrocket 的 `.module` 文件和 Quantumult X 的配置是仓库中的其他文件，本次更新仅针对 `spot-NoAd.plugin`。

导入/更新地址：

https://raw.githubusercontent.com/Yang-SyZng/Spotify_Remove/main/plugins/spot-NoAd.plugin

更新插件后，确认 `SpotifyCache` 与 `SpotifyCustomize` 两个脚本已下载，开启 HTTPS 解密并信任证书，然后完全退出并重新打开 Spotify。避免同时启用多个处理 bootstrap/customize 的插件，以免响应被反复覆盖。

## 2026-10-30 修复

- 为 bootstrap/customize 开启 `binary-body-mode=true`，支持地区域名、显式 443 端口和查询参数。
- 核心脚本由本仓库托管；删除条件缓存请求头时不区分大小写，避免 304 响应没有可修改的响应体。
- 按 Protobuf 字段结构修改客户端账户属性和五项已观察到的推广配置，保留其他字段及未知字段。旧脚本会将完整配置替换为固定列表。
- 移除原配置中针对整个 `googleusercontent.com` 的拒绝规则；这种域名屏蔽不能实现按协议禁用 Spotify 的 QUIC。
- 处理异常、空响应或未知结构时保留原响应，不生成伪造的成功结果。

结构参考： https://github.com/app2smile/rules/blob/master/js/spotify-proto.js

gabo 脚本仍使用原地址。

## 2026-10-30-r2 搜索兼容性修复

收到更新后搜索页显示“出错了，再试一次”的反馈后，停用了旧的搜索、首页及滚动广告响应脚本，页面内容现在原样返回；bootstrap/customize 的去 pre 处理保留。

旧搜索脚本未启用二进制模式，却将取得的响应体通过 `$done({body})` 回写；它还扫描前 666 字节，把碰巧符合条件的位置当作广告字段。使用已提供的首页 Protobuf 响应验证文本回写路径时，89,899 字节变成了 92,121 字节；构造嵌套字段也复现了扫描误改。首页和滚动脚本采用类似字节扫描，还会写入 Protobuf 不支持的 wire type 7，不能仅靠打开二进制模式解决。

更新插件后，确认旧的 `spot-NoSearchAd.js`、`spot-NoHomeAd.js`、`spot-NoScrollAd.js` 三条响应规则已移除，然后完全退出并重启 Spotify。该调整可能使页面推广卡片重新出现。

原 HAR 没有 browsita 或搜索失败请求，尚不能据此确认手机上此次报错的唯一原因。如果更新后仍然报错，需要重新抓取从打开搜索页到出现错误的过程，以检查实际失败接口。

## 验证与限制

运行 `node --test tests/spotify-customize.test.cjs`，不需要安装依赖。

在用户提供的 2026-10-30 HAR 中，customize 响应为 110,746 字节，包含 1,132 项配置。离线回放后仍保留 1,132 项，只修改五项指定的推广开关。另通过合成 bootstrap 响应、缓存请求头、未知字段保留和异常响应测试。HAR、登录信息及账户数据均未加入仓库。

尚未在真实 iPhone/Loon 会话中验证。客户端属性修改不代表服务端订阅状态改变，也不保证离线下载、高音质或其他服务端 Premium 权益。若更新后仍失效，需要同时提供 Loon 脚本执行日志以及冷启动时的 bootstrap/customize 抓包，才能确认脚本是否命中及客户端是否采用修改后的属性。
