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

## Hugo 资源管理

- 优先使用 Hugo Page Bundle 管理文章资源。
- Leaf Bundle 用于单篇文章：一个目录包含 `index.md` 和图片、附件等资源。
- Branch Bundle 用于列表页或内容集合，通常使用 `_index.md`，不要把单篇文章图片放到 Branch Bundle 下。
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

## 写作风格

- 使用中文技术博客口吻：清晰、直接、少废话。
- 用类比解释抽象概念，但不要用类比替代精确定义。
- 每个核心结论尽量配一个原因、例子或代码片段。
- 避免营销式标题和空泛金句。
- 避免把草稿扩写成没有信息增量的长文。

## 输出要求

- 如果用户只要求改文章内容，直接输出完整 Markdown。
- 如果用户要求写入博客仓库，创建或更新对应 Hugo Markdown 文件。
- 如果分类、标签、slug 不明确，根据主题给出保守默认值。
- 完成后说明文章路径、front matter 关键字段，以及未验证的代码或待补资料。
