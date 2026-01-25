# 部署到 GitHub Pages 指南

## 前提条件

1. 已创建 GitHub 仓库 `xingjianwang.github.io`
2. 拥有该仓库的推送权限
3. 本地已安装 Node.js 20+ 和 Bun

## 方式一：自动部署（推荐）

该项目已配置 GitHub Actions 工作流，每次推送到 `main` 分支时自动部署：

### 步骤

1. 在本地项目中添加远程仓库（如果尚未添加）：
```bash
git remote add github https://github.com/Themaoqiu/xingjianwang.github.io.git
```

2. 推送代码到 GitHub：
```bash
git push github main
```

3. GitHub Actions 会自动构建并部署，访问 https://xingjianwang.github.io 查看结果

### 工作流配置

工作流文件位于 `.github/workflows/deploy-github-pages.yml`，会在每次推送时：
- 安装依赖
- 使用 `DEPLOYMENT_PLATFORM=github` 环境变量构建项目
- 将生成的 `dist/` 目录上传到 GitHub Pages

## 方式二：本地手动构建

如果需要在本地测试：

### 1. 安装依赖
```bash
bun install
```

### 2. 构建项目
```bash
DEPLOYMENT_PLATFORM=github bun run build
```

### 3. 预览构建结果
```bash
bun run preview
```

### 4. 手动部署
完整构建后，`dist/` 文件夹中的内容就是要部署的静态文件。

## 配置说明

### site.config.ts
已更新以支持 GitHub Pages：
```typescript
domains: {
  main: 'xingjianwang.com',
  githubPages: 'xingjianwang.github.io',
}
```

### astro.config.ts
- `DEPLOYMENT_PLATFORM=github` 时，自动设置：
  - `site` URL 为 `https://xingjianwang.github.io/`
  - `output: 'static'`（静态生成）
  - 不使用 Vercel 适配器

## 故障排除

### 构建失败
- 检查 GitHub Actions 日志：仓库 → Actions → 最近的工作流
- 本地运行 `DEPLOYMENT_PLATFORM=github bun run build` 重现问题

### 页面未更新
- 清除浏览器缓存
- 检查 https://xingjianwang.github.io 是否为最新部署
- GitHub Pages 可能需要几秒钟才能更新

### TypeScript 错误
- 运行 `bun run check` 检查类型错误
- 运行 `bun run build` 完整构建

## 同时部署到多个位置

若要同时部署到 Vercel 和 GitHub Pages，可在推送时指定不同的远程：

```bash
# 推送到 Vercel（origin）
git push origin main

# 推送到 GitHub Pages（github）
git push github main
```

## 相关链接

- [Astro GitHub Pages 部署指南](https://docs.astro.build/guides/deploy/github/)
- [GitHub Pages 文档](https://docs.github.com/en/pages)
- [本项目 GitHub 仓库](https://github.com/Themaoqiu/xingjianwang.github.io)
