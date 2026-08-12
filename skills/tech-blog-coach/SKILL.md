---
name: tech-blog-coach
description: Turn a user's technical draft, notes, bug write-up, learning record, or rough outline into a publishable Hugo blog article for the user's technical blog. Use when the user asks to create, rewrite, polish, structure, or package a technical article for Hugo, especially when converting drafts into content/posts Markdown with TOML front matter, categories, tags, descriptions, and a clear Feynman-style explanation.
---

# Tech Blog Coach

将用户草稿整理为可发布的 Hugo 技术文章。目标不是泛泛润色，而是用费曼学习法把“作者掌握的知识”转成“读者能顺着理解的文章”。

## 工作流

1. 明确主题
   - 将主题压缩成一句话：`使用 xxx 处理 xxx`。
   - 优先从 Bug 复盘、框架学习、设计模式、性能优化、踩坑经历中提炼主题。

2. 明确读者
   - 默认面向比作者稍弱一级的开发者。
   - 常见概念简略说明，关键概念补足上下文。
   - 不假设读者已经知道文章的核心结论。

3. 设计结构
   - 默认使用：
     - `## 背景 & 问题`
     - `## 方案或原理`
     - `## 实现步骤`
     - `## 示例 / 踩坑`
     - `## 总结`
   - 根据草稿内容删掉空洞章节；不要为了模板硬凑内容。
   - 开头说明背景、问题和读者能学到什么。
   - 中间用标题、列表、表格、代码块、mermaid 图辅助理解。
   - 结尾总结结论，并可给出扩展方向。

4. 生成 Hugo 文章
   - 默认推荐使用 Leaf Bundle：`content/posts/<category>/<slug>/index.md`。
   - 只有确定不需要图片、附件或相对资源时，才使用单文件文章：`content/posts/<category>/<slug>.md`。
   - 将文章图片放在同一目录下，用相对路径引用：`![说明](image-name.png)`。
   - 使用 [article-template.md](article-template.md) 作为默认文章模板。
   - 非系列文章删除模板中的 `series` 和 `seriesWeight`。
   - front matter 维护 `lastmod`：文章发布后每次实质修改，同步更新为修改时间。利用主题对 `lastmod` 的原生显示（Stack 主题在文章页脚自动显示"最后更新于"），让读者快速判断内容时效。不要在正文手写版本表格；变更信息用开头的折叠更新记录承载（见"优化正文"），完整修改历史由 git 记录。

## Hugo 资源管理

- 优先使用 Hugo Page Bundle 管理文章资源。
- Leaf Bundle 用于单篇文章：一个目录包含 `index.md` 和图片、附件等资源。
- Branch Bundle 用于列表页或内容集合，通常使用 `_index.md`，不要把单篇文章图片放到 Branch Bundle 下。
- 需要管理文章或文件之间的链接时，使用 Hugo 内置引用生成链接，避免手写路径：
  - 绝对路径：`[标题]({{< ref "posts/xxx.md" >}})`。
  - 相对路径：`[标题]({{< relref "posts/xxx.md" >}})`。
  - 引用路径基于 `content/` 目录；让 Hugo 在构建时解析路径并校验死链。
- 推荐结构：

```text
content/posts/<category>/<slug>/
├── index.md
├── image1.png
└── image2.png
```

## 优化正文

- 检查是否跳过关键步骤。
- 检查是否假设过多前置知识。
- 检查代码块语言标记是否正确。
- 明确标注未经运行验证的代码，不编造执行结果。
- 优先保留作者自己的经历、判断和踩坑细节。
- 维护文章开头的折叠更新记录（`{{< details summary="更新记录" >}}`）：发布后每次实质修改，在列表顶部追加一行（日期倒序），只记录实质变更，并同步更新 front matter 的 `lastmod`。折叠块让首次读者不被打扰，回访读者点开即知"改了什么"。依赖博客项目的 `layouts/_shortcodes/details.html`；若缺失，回退为开头的普通 `## 更新记录` 列表。完整历史仍以 git 为准。
- 识别正文中适合配图的位置，并用表格列出：`位置`、`可以配什么图`、`生成图片 prompt`。
- 配图建议优先服务理解：架构图、流程图、对比图、时序图、界面截图、调试现场图；不要为了装饰硬塞图片。

## 写作风格

- 使用中文技术博客口吻：清晰、直接、少废话。
- 用类比解释抽象概念，但不要用类比替代精确定义。
- 每个核心结论尽量配一个原因、例子或代码片段。
- 避免营销式标题和空泛金句。
- 避免把草稿扩写成没有信息增量的长文。

## 封面图

- 文章输出后，用 AskUserQuestion 询问用户是否需要封面图；按用户决策，需要才生成封面图 prompt，不需要则跳过并说明可随时补。
- 封面图通过 Stack 主题 front matter `image` 字段引用：本地图放文章 Leaf Bundle 目录，`image = 'cover.jpg'`；或填远程 URL。
- 生成封面图 prompt 时基于文章主题定制，包含：主题（把文章核心结论压缩成一句话）、视觉元素（代码 / 架构 / 几何 / 数据流等与主题相关的抽象视觉）、风格（简洁现代技术风，避免花哨）、布局（横向宽幅 16:9，建议 1200×675）、无文字或极简标题（AI 生成文字易出错）、配色（与博客主题协调的低饱和配色）。
- 用户采用封面图后，提醒其确认 front matter `image` 字段与文件名一致。

## 输出要求

- 如果用户只要求改文章内容，直接输出完整 Markdown。
- 如果用户要求写入博客仓库，创建或更新对应 Hugo Markdown 文件。
- 如果分类、标签、slug 不明确，根据主题给出保守默认值。
- 输出文章后附上”配图建议”表格，列出位置、可以配什么图、生成图片 prompt。
- 输出文章后询问是否需要封面图，需要则按”封面图”一节生成封面图 prompt。
- 完成后说明文章路径、front matter 关键字段，以及未验证的代码或待补资料。
