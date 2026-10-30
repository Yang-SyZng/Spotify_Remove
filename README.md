# plugin-hub

按平台与客户端整理的插件汇聚中心。

作者：[@🐇Gardenia.💙](https://github.com/Yang-SyZng)

## 平台与插件列表

| 平台 | 分类 | 入口 |
| --- | --- | --- |
| Android | 暂未收录 | [预留目录](android/) |
| iOS | Loon | [插件聚合列表](ios/loon/README.md) |
| iOS | Shadowrocket | [插件聚合列表](ios/shadowrocket/README.md) |
| iOS | Quantumult X | [插件聚合列表](ios/quantumult_x/README.md) |

## 目录结构

```text
plugin-hub/
├── android/                       # 暂时留空
├── ios/
│   ├── js/                        # 脚本按应用归档
│   │   └── spotify/
│   │       └── spotify-customize.js
│   ├── loon/
│   │   ├── spot-NoAd.plugin
│   │   └── README.md              # Loon 插件聚合列表
│   ├── shadowrocket/
│   │   ├── Spotify_head.module
│   │   ├── spotify.md             # Spotify 安装教程
│   │   ├── img/                   # 教程配图
│   │   └── README.md              # Shadowrocket 插件聚合列表
│   └── quantumult_x/
│       ├── spotify_qx.conf
│       └── README.md              # Quantumult X 插件聚合列表
└── README.md                      # 总入口
```

## 使用

进入对应客户端的插件聚合列表，选择需要的插件并复制下载地址。三个客户端分别使用自己的配置文件；本仓库维护的 iOS 脚本统一放在 `ios/js/<应用名>/`，由插件按实际兼容情况引用。

## 从 Spotify_Remove 迁移

仓库现名为 `Yang-SyZng/plugin-hub`。原有 `plugins/` 路径已移除，请从各客户端列表获取新订阅地址。

Loon 插件引用的脚本现位于 `ios/js/spotify/spotify-customize.js`。已安装的 Loon 插件需更新配置并重新下载脚本。

## Android

暂未收录插件，目录仅作预留。

## 收录约定

- Loon、Shadowrocket、Quantumult X 的配置分别放入对应客户端目录。
- iOS 脚本按应用归入 `ios/js/<应用名>/`，不在客户端目录中重复存放。
- 每次收录或更新插件时，同步维护对应客户端的 `README.md` 聚合列表。
- 插件专属教程独立存放，通过聚合列表链接进入。
- 保留所引用项目要求的署名及许可证。

## 许可证

[MIT License](LICENSE)
