# UI Playground

一个基于 Vite 的 UI 实验场：把每个实验放到 `sandboxs/<name>/` 文件夹下，然后通过 `/sandboxs/<name>/` 路由即可查看效果。

## 快速开始

1. 安装依赖：

```bash
npm install
```

2. 启动开发服务器：

```bash
npm run dev
```

服务器将在 `http://localhost:8030` 启动，并自动打开浏览器。

3. 创建一个新实验：

- 在 `sandboxs/` 下新建文件夹 `my-widget`
- 在 `sandboxs/my-widget/index.html` 写入页面
- 在浏览器打开 `http://localhost:8030/sandboxs/my-widget/`

## 可用命令

- `npm run dev` - 启动 Vite 开发服务器（支持热更新）
- `npm run build` - 构建生产版本到 `dist/` 目录
- `npm run preview` - 预览构建后的生产版本

## 特性

✅ 基于 Vite，启动速度快，支持热模块替换（HMR）  
✅ 自动扫描 `sandboxs/` 下的所有文件夹  
✅ 每个文件夹可以有独立的 HTML/CSS/JS  
✅ 支持现代 JavaScript 特性和 ES 模块  
✅ 首页自动列出所有可用示例

示例已包含在 `sandboxs/demo`。
