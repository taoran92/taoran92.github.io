# Ran Tao · 个人主页

轻量静态个人主页，包含个人介绍、技术方向、工作经历、开源社区经历和联系方式。

使用原生 HTML、CSS 和 SVG，无 JavaScript、第三方字体、外部依赖或构建步骤。采用宽版个人简介、双列社区项目卡片和紧凑工作经历；移动端切换为单列。支持键盘导航，无动画效果。

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
- `assets/logos/`：四个 Apache 项目的官方图标，本地加载。
- `.nojekyll`：将页面作为静态文件发布，跳过 Jekyll 处理。

个人信息来自原 `pages/about.md`，联系方式统一为 `chucheng.tr@gmail.com`。更新工作经历时直接编辑 `index.html`。

## 社区经历与图标来源

社区经历于 2026-10-29 根据 GitHub 公开 PR 的作者、说明和合并状态核实。页面精选 `taoran92` 已合并的贡献，不包含尚未合并的 PR；“全部 PR”链接包含该项目下所有状态的个人 PR。未将内部增强清单作为已完成的社区贡献。

- Flink：[#22903](https://github.com/apache/flink/pull/22903)、[#22179](https://github.com/apache/flink/pull/22179)、[#19827](https://github.com/apache/flink/pull/19827)。
- Flink CDC：[#4422](https://github.com/apache/flink-cdc/pull/4422)、[#4400](https://github.com/apache/flink-cdc/pull/4400)。
- Calcite：[#3459](https://github.com/apache/calcite/pull/3459)、[#3320](https://github.com/apache/calcite/pull/3320)、[#3644](https://github.com/apache/calcite/pull/3644)；Committer 身份见[官方成员页](https://calcite.apache.org/community/#project-members)中的 Ran Tao / taoran。
- Paimon：[#10547](https://github.com/apache/paimon/pull/10547)、[#10135](https://github.com/apache/paimon/pull/10135)、[#10481](https://github.com/apache/paimon/pull/10481)。

图标原样下载自项目官网：

- `flink.png`：[Flink 官方图标](https://flink.apache.org/img/logo/png/100/flink_squirrel_100_color.png)。
- Flink CDC：[官方文档站](https://nightlies.apache.org/flink/flink-cdc-docs-stable/)使用同一 Flink 松鼠标识，页面复用高清 `flink.png`，避免放大其 16×16 favicon。
- `calcite.ico`：[Calcite 官方图标](https://calcite.apache.org/favicon.ico)。
- `paimon.svg`：[Paimon 官方图标](https://paimon.apache.org/favicon.svg)。

Apache 项目名称与图标归各自权利人所有，用于标识所参与的开源项目，不表示项目对本个人网站的背书。

## GitHub Pages

将这些文件发布到本仓库 GitHub Pages 配置使用的分支根目录即可，无需安装依赖。目标地址：https://taoran92.github.io/ 。本地修改不会自动更新线上页面，需提交并推送后由 GitHub Pages 发布。

原博客的文章、模板、生成目录和相关组件已移除，历史版本仍可通过 Git 查阅。
