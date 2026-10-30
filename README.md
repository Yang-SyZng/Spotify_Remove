# plugin-hub

按平台与客户端整理的插件汇聚中心。

作者：[@🐇Gardenia.💙](https://github.com/Yang-SyZng)

## 目录

```text
plugin-hub/
├── android/                     # 安卓，暂未收录插件
└── ios/
    ├── loon/                    # Loon 插件
    │   ├── spot-NoAd.plugin
    │   └── js/
    │       └── spotify-customize.js
    ├── shadowrocket/            # Shadowrocket 模块与教程
    │   ├── Spotify_head.module
    │   ├── README.md
    │   └── img/
    └── quantumult_x/            # Quantumult X 配置
        └── spotify_qx.conf
```

## iOS 插件

| 客户端 | 插件 | 订阅地址 |
| --- | --- | --- |
| Loon | [Spotify 去广告](ios/loon/spot-NoAd.plugin) | [下载 .plugin](https://raw.githubusercontent.com/Yang-SyZng/plugin-hub/main/ios/loon/spot-NoAd.plugin) |
| Shadowrocket | [Spotify](ios/shadowrocket/Spotify_head.module) | [下载 .module](https://raw.githubusercontent.com/Yang-SyZng/plugin-hub/main/ios/shadowrocket/Spotify_head.module) |
| Quantumult X | [Spotify](ios/quantumult_x/spotify_qx.conf) | [下载 .conf](https://raw.githubusercontent.com/Yang-SyZng/plugin-hub/main/ios/quantumult_x/spotify_qx.conf) |

### Loon

在「配置 → 插件」中添加上表中的 `.plugin` 地址。下载脚本后，开启 HTTPS 解密并信任证书，然后完全退出并重新打开 Spotify。

插件提供 Spotify Connect 入口开关和旧版创建按钮兼容选项。新版 Spotify 的创建按钮请在 App「设置和隐私 → 内容和显示」中设置。

### Shadowrocket

在「配置 → 模块」中添加上表中的 `.module` 地址。安装与证书配置步骤见 [Spotify 安装教程](ios/shadowrocket/README.md)。

### Quantumult X

将上表中的 `.conf` 地址添加到重写资源，并开启对应的 HTTPS 解密。

三个客户端使用各自的插件与脚本配置；Loon 的自定义选项仅在 Loon 插件中提供。

## 从 Spotify_Remove 迁移

仓库现名为 `Yang-SyZng/plugin-hub`。原有 `plugins/` 路径已移除，请将已安装的插件订阅地址替换为上表中的新地址，并重新下载相关脚本。

## Android

暂未收录插件，目录仅作预留。

## 收录约定

- 插件按 `平台/客户端/` 存放，脚本放在对应客户端的 `js/` 目录。
- 每次收录或更新插件时，同步更新本页的订阅地址。
- 保留所引用项目要求的署名及许可证。

## 许可证

[MIT License](LICENSE)
