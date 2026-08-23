---
name: video-script
description: Write executable video scripts. User-invoked workflow for planning video type, structure, narration, visuals, production notes, and source material as an audio-visual script.
disable-model-invocation: true
---

# Video Script

Use this skill to turn a video idea or notes into a **声画脚本**: a script that can go directly into production, not just a record of what to say.

## Workflow

1. Run **脚本分流**.
2. Confirm enough source material for the selected type.
3. Build the type-specific structure.
4. Output a **声画脚本** table.
5. Check the completion criteria before finishing.

## 脚本分流

Before writing, determine the video's main type.

- **技术讲解类**：以知识点为中心，讲概念、工具、架构、方案、原理、方法论。
- **问题复盘类**：以具体事件为中心，讲 bug、故障、踩坑、排查、解决方案、经验教训。
- **观点表达类**：以判断为中心，讲立场、趋势、行业观察、反常识观点。
- **带货口播类**：以转化为中心，推荐产品、服务、课程、工具或方案。
- **故事案例类**：以情节为中心，通过人物、事件、项目经历、成功失败案例推进。
- **账号人设类**：以记忆点为中心，强化创作者身份、价值观、工作方式、生活方式或长期主张。

If the user has already named the type, use it. If the type is inferable but not explicit, state the inferred main type and ask for confirmation before writing the full script. If there is too little information, ask the user to choose from the six types.

Completion criterion: one main type is confirmed. If multiple types fit, choose the one carrying the video's primary communication goal and treat the others only as supporting techniques.

## 声画脚本

Default to a **声画脚本 / Audio-Visual Script**. Sound explains; visuals support understanding. The visual layer should carry a job the narration does not already carry: code, diagrams, operations, contrast, state change, result preview, or evidence.

Use this table unless the user requests another format:

| 时间 | 旁白 | 画面 | 制作说明 | 素材来源 |
| --- | --- | --- | --- | --- |
| 00:00-00:04 | ... | ... | ... | ... |

Field rules:

- **时间**：该段持续多久。
- **旁白**：这一段具体说什么。
- **画面**：观众此时看到什么。
- **制作说明**：画面如何出现、变化或切换。
- **素材来源**：现有素材、录屏、代码、截图、图示、额外制作等。

If the user explicitly asks for a pure narration script, write the narration first and add a short visual suggestion list after it.

Completion criterion: every narration segment has a corresponding visual plan, and every visual either helps understanding, provides evidence, creates contrast, or guides production.

## 技术讲解类

Use **解释链** for technical explanation videos: organize one technical problem into an easy-to-follow chain, then prove it with code, diagrams, demos, or comparisons.

When the user wants a reusable overview document for a technical video, use [assets/templates/technical-introduction.md](assets/templates/technical-introduction.md).

When the user already has HTML slides and wants slide-based narration, use [assets/templates/technical-slides-narration.md](assets/templates/technical-slides-narration.md). Treat the existing slides as the source of truth and write narration per slide, not by timestamp.

Before drafting, confirm:

- 目标观众
- 核心问题
- 看完后的结果
- 可展示证据
- 限制和反例

If key evidence is missing, ask for it or mark it as missing source material. Do not invent code demos, benchmark results, repository details, or screenshots.

Default structure:

| 阶段 | 作用 |
| --- | --- |
| Hook | 提出问题、反差或结果预览 |
| Context | 说明背景、使用场景和问题为什么存在 |
| Problem | 指出旧理解、旧方案或常见做法的不足 |
| Concept | 解释核心概念、设计思想或判断框架 |
| Demo | 用代码、图示、动画、命令输出或演示证明 |
| Trade-off | 说明优点、缺点、适用边界和反例 |
| Summary | 压缩成 3 个以内的记忆点 |
| CTA | 给出仓库、问题、下期预告或行动入口 |

When designing the Hook for a technical explanation video, read [opening-patterns.md](opening-patterns.md) and choose one main opening pattern. Use one dominant pattern instead of stacking several patterns into the same opening.

If the user does not specify length, assume a 6-12 minute technical video. If the user asks for a short video or a long tutorial, compress or expand the 解释链.

Completion criterion: the script forms a chain from problem to understanding, from understanding to evidence, and from evidence to boundaries. Key technical claims have supporting evidence. Limits and counterexamples are included when they affect the viewer's decision or implementation.

## Other Types

For 问题复盘类、观点表达类、带货口播类、故事案例类、账号人设类, only use the type definitions for routing until the user provides rules for that type. Do not force the 技术讲解类 解释链 onto these types.
