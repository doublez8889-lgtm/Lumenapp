# Lumen 澄曜 · App

因人而异的学习节奏，可被记录的成长进程。

---

## 文件结构

| 文件 | 用途 |
|---|---|
| **`app.html`** | 真实用户入口（PWA · 全屏 App） |
| **`index.html`** | 设计展示页（含 Design Canvas + Tweaks，给你自己看的） |
| `manifest.webmanifest` | PWA 元数据 |
| `sw.js` | Service Worker（离线缓存） |
| `icons/` | App 图标 |
| `lumen-*.jsx` | 各页面的 React 组件 |

---

## 5 分钟发布到 Vercel（免费）

### Step 1 · 注册 Vercel
打开 [vercel.com](https://vercel.com) → 用 GitHub 账号登录（推荐），或邮箱注册。

### Step 2 · 上传项目
两种方式，任选其一：

**A. 拖拽（最简单）**
1. 在 Vercel 控制台点 **"Add New"** → **"Project"**
2. 把整个项目文件夹拖进去
3. 点 **"Deploy"**
4. 等 1 分钟，会给你一个 `https://lumen-xxx.vercel.app` 的网址

**B. GitHub（推荐长期使用）**
1. 在 [github.com](https://github.com) 创建一个新 repo（可以设为 private）
2. 把项目所有文件 push 上去
3. Vercel 控制台 → **"Add New"** → **"Project"** → 选这个 repo → Deploy
4. 之后每次你 push 代码，网站自动更新

### Step 3 · 设置主入口

Vercel 默认显示 `index.html`（你的设计展示页）。
真实用户应该看 **`app.html`**。

最简单的办法：在 Vercel 项目设置里加一条 **rewrite**：

打开项目根目录创建 **`vercel.json`**：

```json
{
  "rewrites": [
    { "source": "/", "destination": "/app.html" }
  ]
}
```

这样：
- `https://lumen.vercel.app/` → 用户看到 App
- `https://lumen.vercel.app/index.html` → 你看到设计展示页（仍可访问）

> 已经帮你写好 `vercel.json`，直接生效。

### Step 4 · 发给家长

把 Vercel 给的网址 + 一段说明短信／微信发出去：

> 你好，这是 Lumen 的家长 App，请用 **iPhone Safari** 打开链接：
> https://lumen-xxx.vercel.app
>
> 打开后，点底部的 **分享按钮 ⬆️** → 选 **"添加到主屏幕"** → 桌面会出现 Lumen 图标，点开就是全屏 App。

### Step 5（可选）· 绑定自有域名

1. 去 [Namecheap](https://namecheap.com)、[Gandi](https://gandi.net) 或 [GoDaddy](https://godaddy.com) 买一个域名（建议 `.fr` 或 `.education`，€10-30/年）
2. Vercel 项目设置 → **Domains** → 添加域名
3. 按 Vercel 提示在域名服务商处改 DNS（5 分钟生效）

---

## 测试 PWA

发布后用 iPhone 打开网址，验证：

- [ ] 加载时看到米色 splash + 蓝色"Lumen."logo
- [ ] App 全屏显示，没有浏览器地址栏
- [ ] 点底部 4 个 tab 可切换
- [ ] 点分享 → 添加到主屏幕 → 桌面有蓝色 L 图标
- [ ] 飞行模式下还能打开（Service Worker 离线缓存）

---

## 已知限制

- iOS PWA **不支持推送通知**（苹果限制，唯一原生 App 才能做）
- 某些 iOS 版本 PWA 不能后台播放音频
- Android Chrome PWA 体验更完整（有真正的"安装"按钮）

如果以后这些限制成了瓶颈，再考虑做正式 iOS App（Capacitor / React Native 套壳上 App Store）。

---

## 下一步：微信小程序

等中国主体 + AppID 拿到后，告诉 Claude，会用 Taro 框架把这套 React 代码迁移到小程序，保留约 70% 的设计和组件。
