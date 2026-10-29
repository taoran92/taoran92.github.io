# Ran Tao · 个人主页

轻量英文静态个人主页，包含个人介绍、技术方向、工作经历、开源社区经历和联系方式。

使用原生 HTML、CSS 和 SVG，无 JavaScript、第三方字体、外部依赖或构建步骤。采用宽版个人简介、Paimon / Calcite / Flink 三列卡片和紧凑工作经历。每个项目保留 5 项精选贡献；项目下方列出社区活动，窄屏切换为单列。支持键盘导航，无动画效果。

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
- `assets/logos/`：Flink、Paimon、Calcite 三个社区的官方图标，本地加载。
- `.nojekyll`：将页面作为静态文件发布，跳过 Jekyll 处理。

个人信息基于原 `pages/about.md` 与用户更新：字节跳动（2023.06 至今，Flink 研发）、蚂蚁集团（2018.07–2023.06）、滴滴出行（2017.06–2018.07）。联系方式统一为 `chucheng.tr@gmail.com`。更新工作经历时直接编辑 `index.html`。

## 社区经历与图标来源

社区经历于 2026-10-29 根据 GitHub 公开 PR 的作者、说明和合并状态核实。页面精选 `taoran92` 已合并的贡献，不包含尚未合并的 PR；“全部 PR”链接包含该项目下所有状态的个人 PR。未将内部增强清单作为已完成的社区贡献。

- Paimon（含 Paimon Rust）：[#10547](https://github.com/apache/paimon/pull/10547)、[#10135](https://github.com/apache/paimon/pull/10135)、[#10481](https://github.com/apache/paimon/pull/10481)、[#10725](https://github.com/apache/paimon/pull/10725)；Rust [#1226](https://github.com/apache/paimon-rust/pull/1226)（2026-10-27 合并），将 #10547 的分组排序语义迁移至 Rust 实现。
- Calcite：ARRAY / MAP 元素类型转换 [#3395](https://github.com/apache/calcite/pull/3395)、MAP 子查询执行 [#3475](https://github.com/apache/calcite/pull/3475)、ARRAY 子查询排序 [#3644](https://github.com/apache/calcite/pull/3644)、MAP 空值类型推导 [#3463](https://github.com/apache/calcite/pull/3463)、InnoDB 索引条件处理 [#3304](https://github.com/apache/calcite/pull/3304)。示例聚焦类型系统与查询正确性，不展示新增函数支持。Committer 身份见[官方成员页](https://calcite.apache.org/community/#project-members)中的 Ran Tao / taoran。
- Flink（含 Flink CDC）：Flink [#22903](https://github.com/apache/flink/pull/22903)、[#22179](https://github.com/apache/flink/pull/22179)、[#19827](https://github.com/apache/flink/pull/19827)；Flink CDC [#4422](https://github.com/apache/flink-cdc/pull/4422)、[#4400](https://github.com/apache/flink-cdc/pull/4400)。

社区活动由用户提供：2018 年杭州 Spark Meetup、2019 年杭州 Flink Meetup、2021 年 Flink Forward Asia（Topic: Flink Hot Updates & Autoscaling at Ant Group）。页面不补写未提供的具体日期、活动角色或资料链接。Ant Group 与 ByteDance 的职位按用户要求统一为 Senior Flink Engineer。

图标原样下载自项目官网：

- `flink.png`：[Flink 官方图标](https://flink.apache.org/img/logo/png/100/flink_squirrel_100_color.png)。
- `calcite.ico`：[Calcite 官方图标](https://calcite.apache.org/favicon.ico)。
- `paimon.svg`：[Paimon 官方图标](https://paimon.apache.org/favicon.svg)。

Apache 项目名称与图标归各自权利人所有，用于标识所参与的开源项目，不表示项目对本个人网站的背书。

## GitHub Pages

将这些文件发布到本仓库 GitHub Pages 配置使用的分支根目录即可，无需安装依赖。目标地址：https://taoran92.github.io/ 。本地修改不会自动更新线上页面，需提交并推送后由 GitHub Pages 发布。

原博客的文章、模板、生成目录和相关组件已移除，历史版本仍可通过 Git 查阅。
