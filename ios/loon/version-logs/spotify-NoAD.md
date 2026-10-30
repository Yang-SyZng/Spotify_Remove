# spotify-NoAD.plugin

简体中文 | [English](spotify-NoAD.en.md)

## Spotify 选项

| 选项 | 默认值 | 作用 |
| --- | --- | --- |
| 创建按钮（旧版兼容） | 跟随 App | 仅处理已有的旧版导航实验；新版请到 Spotify「设置和隐私 → 内容和显示」设置创建按钮 |
| Spotify Connect 入口 | 开启 | 控制切换播放设备的入口；不会断开已有会话或改变服务端权限 |

修改选项后需完全退出并重新打开 Spotify。客户端属性修改不代表服务端订阅状态改变。

此文件使用 Loon 的 `.plugin` 配置格式。Shadowrocket 的 `.module` 文件和 Quantumult X 的配置是仓库中的其他文件，本次更新仅针对 `spotify-NoAD.plugin`。

导入/更新地址：

https://raw.githubusercontent.com/Yang-SyZng/plugin-hub/main/ios/loon/spotify-NoAD.plugin

更新插件后，确认 `SpotifyCache` 与 `SpotifyCustomize` 两个脚本已下载，开启 HTTPS 解密并信任证书，然后完全退出并重新打开 Spotify。避免同时启用多个处理 bootstrap/customize 的插件，以免响应被反复覆盖。

## 2026.10.30-r9 中英文版本

- 文档和客户端配置提供独立的中文、英文版本，各级文档加入语言切换和英文索引。
- 英文配置使用 `spotify-NoAD.en.plugin`，英文导入链接指向对应配置。
- JS 和配图由两版共用。中文显示名改为 `spotify去广告`，英文为 `Spotify Ad Blocker`；英文选项由共用脚本映射到相同的功能。

## 2026.10.30-r8 新版 Script 配置语法

- `desc` 仅描述用途，`date` 单独记录 `2026.10.30-r8`；更新说明集中维护于本文档。

- Loon 的三条 Script 指令迁移为 `request/response if ... then script(...) with ...`。
- Body 选项改为 `requires_body` 与 `binary_body_mode`；插件参数通过 `{${createButton}, ${connectEnabled}}` 作为对象传入。
- 声明最低 Loon 版本为 `3.5.1(983)`，URL 匹配范围、二进制处理和功能选项保持原有行为。
- 此次迁移仅涉及 Loon Script 配置；共用 JavaScript、Quantumult X 和 Shadowrocket 配置继续使用各自已有接口与格式。
- 迁移依据：[Loon 新版 Script 文档](https://nsloon.app/docs/Script/script_v2/)。实机导入与运行效果待验证。

## 2026.10.30-r7 统一命名与脚本维护

- 三个客户端的配置及共用脚本统一以 `spotify-NoAD` 命名，下载地址同步更新。
- 共用脚本位于 `ios/js/spotify/spotify-NoAD.js`；保留 Loon 的选项，并适配 Shadowrocket 二进制响应及 Quantumult X 的 `bodyBytes`。
- gabo 本地空响应由本仓库自行实现，不再加载外部脚本。
- Shadowrocket、Quantumult X 的缓存头、专辑/歌手请求参数处理同样改用本仓库实现，配置不再引用外部 JavaScript。
- Protobuf 协议字段参考来源保留，用于说明结构依据；运行时不下载其脚本。
- 旧订阅需换用各客户端 README 中的新地址，停用旧配置后重启 Spotify。
- r7 离线验证：30 项检查通过，覆盖 gabo 返回格式、请求缓存头、请求参数、二进制响应、未知字段保留、异常响应透传、文档链接及脚本引用；尚未在三个客户端实机验证。

## 2026.10.30-r2 搜索兼容性修复

收到更新后搜索页显示“出错了，再试一次”的反馈后，停用了旧的搜索、首页及滚动广告响应脚本，页面内容现在原样返回；bootstrap/customize 的去 pre 处理保留。

旧搜索脚本未启用二进制模式，却将取得的响应体通过 `$done({body})` 回写；它还扫描前 666 字节，把碰巧符合条件的位置当作广告字段。使用已提供的首页 Protobuf 响应验证文本回写路径时，89,899 字节变成了 92,121 字节；构造嵌套字段也复现了扫描误改。首页和滚动脚本采用类似字节扫描，还会写入 Protobuf 不支持的 wire type 7，不能仅靠打开二进制模式解决。

更新插件后，确认旧的 `spot-NoSearchAd.js`、`spot-NoHomeAd.js`、`spot-NoScrollAd.js` 三条响应规则已移除，然后完全退出并重启 Spotify。该调整可能使页面推广卡片重新出现。

原 HAR 没有 browsita 或搜索失败请求，尚不能据此确认手机上此次报错的唯一原因。如果更新后仍然报错，需要重新抓取从打开搜索页到出现错误的过程，以检查实际失败接口。

## 2026.10.30-r1 修复

- 为 bootstrap/customize 开启 `binary-body-mode=true`，支持地区域名、显式 443 端口和查询参数。
- 核心脚本由本仓库托管；删除条件缓存请求头时不区分大小写，避免 304 响应没有可修改的响应体。
- 按 Protobuf 字段结构修改客户端账户属性和五项已观察到的推广配置，保留其他字段及未知字段。旧脚本会将完整配置替换为固定列表。
- 移除原配置中针对整个 `googleusercontent.com` 的拒绝规则；这种域名屏蔽不能实现按协议禁用 Spotify 的 QUIC。
- 处理异常、空响应或未知结构时保留原响应，不生成伪造的成功结果。

结构参考： https://github.com/app2smile/rules/blob/master/js/spotify-proto.js

当时 gabo 脚本仍使用外部地址；r7 起已替换为本仓库实现。

## 验证与限制

早期版本使用 Node.js 离线测试验证；当时的测试目录已移除。

在用户提供的 2026-10-30 HAR 中，customize 响应为 110,746 字节，包含 1,132 项配置。离线回放后仍保留 1,132 项，只修改五项指定的推广开关。另通过合成 bootstrap 响应、缓存请求头、未知字段保留和异常响应测试。HAR、登录信息及账户数据均未加入仓库。

尚未在真实 iPhone/Loon 会话中验证。客户端属性修改不代表服务端订阅状态改变，也不保证离线下载、高音质或其他服务端 Premium 权益。若更新后仍失效，需要同时提供 Loon 脚本执行日志以及冷启动时的 bootstrap/customize 抓包，才能确认脚本是否命中及客户端是否采用修改后的属性。
