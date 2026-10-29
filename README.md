# 梦回少年 · 个人主页

轻量静态个人主页，包含个人介绍、技术方向、工作经历和联系方式。

使用原生 HTML、CSS 和 SVG，无 JavaScript、第三方字体、外部依赖或构建步骤。采用简洁的技术履历排版，支持移动端和键盘导航，无动画效果。

## 本地预览

在仓库根目录运行：

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

访问 http://127.0.0.1:8000 。

## 内容与样式

- `index.html`：个人信息、工作经历、邮箱和 GitHub 链接。
- `styles.css`：配色、排版与响应式布局。
- `favicon.svg`：网站图标。
- `.nojekyll`：将页面作为静态文件发布，跳过 Jekyll 处理。

个人信息来自原 `pages/about.md`，联系方式统一为 `chucheng.tr@gmail.com`。更新工作经历时直接编辑 `index.html`。

## GitHub Pages

将这些文件发布到本仓库 GitHub Pages 配置使用的分支根目录即可，无需安装依赖。目标地址：https://taoran92.github.io/ 。本地修改不会自动更新线上页面，需提交并推送后由 GitHub Pages 发布。

原博客的文章、模板、生成目录和相关组件已移除，历史版本仍可通过 Git 查阅。
