# engineering-coach 需求文档

## 背景

在 AI 编程中，常见的需求澄清或设计讨论 skill 能让 AI 像技术组长一样发现边界、风险和架构难点，并给出若干方案让用户选择。这能提升当前项目的交付质量，但不一定提升用户自己的工程能力。

核心问题是：如果 AI 已经完成了关键设计思考，用户只负责选择答案，那么即使做了很多项目，用户也可能没有学会如何识别问题边界、组织模块、权衡 trade-off、设计验证策略。

`engineering-coach` 的目标是把项目设计过程转化为工程能力训练：不仅复盘“这次怎么设计”，还要提炼“为什么这样思考”，再通过迁移练习验证用户是否真正理解。

## 目标

- 从真实设计讨论或设计文档中提取可学习的工程设计思路。
- 强制区分原始证据、事后推断和可迁移原则，避免 AI 脑补用户的思考过程。
- 通过独立作答、答辩和评分验证用户是否掌握设计方法。
- 训练重点放在软件工程通用能力：架构设计、模块组织、边界识别、状态与数据流、失败模式、验证策略和 trade-off。
- 维护跨项目的长期学习档案，用证据累计而不是单次印象更新能力状态。
- 支持自然语言触发，让用户不必记住命令和参数。
- 可被其他人下载使用，不依赖用户本机路径、Logseq、Obsidian 或特定知识库软件。

## 非目标

- 不替代普通需求讨论、PRD、ADR、code review 或实现类 skill。
- 不在所有设计讨论中强行教学；过程教学必须显式启用。
- 不追求输出标准答案，也不把 AI 的参考方案当成唯一正确方案。
- 不把个人路径写死在 skill 目录中。
- 不把每次普通 review 都自动写入长期档案。
- 不用大量模式名称包装常识，除非名称能帮助用户迁移思考。

## Skill 名称与目录

Skill 名称：`engineering-coach`

推荐目录：

```text
skills/engineering-coach/
├── SKILL.md
├── requirements.md
├── usage.md
├── config.example.md
├── references/
│   └── scoring-rubric.md
└── templates/
    ├── learning-profile.md
    ├── learning-profile.en.md
    ├── practice-record.md
    └── practice-record.en.md
```

`requirements.md` 是维护和生成 skill 的源需求文档，不应被 `SKILL.md` 作为运行时必读文件引用。`SKILL.md` 应保持精简，只放触发条件、模式路由和关键约束。评分细则、模板和长说明应放入 `references/`、`templates/`、`usage.md`。

`usage.md` 只解释用户如何使用，不作为运行时规则来源；运行时规则以 `SKILL.md` 和 `references/` 为准，避免同一行为在用户文档和运行时文档中产生两个事实源。

模板中直接供用户长期填写、复制或迁移的文件应提供中文默认版和英文版。默认中文模板保留原文件名，英文模板使用 `.en.md` 后缀。运行规则文档不做双语拆分，避免两个语言版本产生规则漂移。所有 locale 下，能力 id、状态值、评分维度、frontmatter key 和枚举值保持英文 canonical form。

## 核心模式

`engineering-coach` 使用一个 skill、多模式组织方式。

### init

首次使用时初始化本地存储。

行为：

- 说明将创建或使用哪些文件。
- 让用户输入一个根目录，主流程不要求分别输入每个路径。
- 根据根目录生成配置文件、长期学习档案和练习记录目录。
- 允许高级用户分别指定配置文件、profile 文件和练习记录目录。
- 不自动扫描 Logseq、Obsidian 或其他默认知识库路径。

默认路径生成规则：

```text
<root>/config.md
<root>/profile.md
<root>/practices/
```

初始化后写入 `config.md`，格式为 Markdown + YAML frontmatter：

```markdown
---
profile_path: "D:/notes/engineering-coach/profile.md"
practice_records_dir: "D:/notes/engineering-coach/practices"
practice_record_prefix: "practice"
default_write_policy: "ask"
default_teaching_mode: "standard"
locale: "zh-CN"
schema_version: 1
---

# Engineering Coach Config

Local configuration for the engineering-coach skill.
```

### help

展示运行时短帮助，支持自然语言触发。

触发示例：

```text
/engineering-coach help
engineering-coach 怎么用？
这个工程能力训练 skill 有哪些模式？
我想复盘设计但忘了命令
```

短帮助应包含：

- 这个 skill 解决什么问题。
- 常用自然语言触发方式。
- 可用模式：`init`、`help`、`coach`、`review`、`practice`、`assess`、`status`、`resume`。
- 当前是否已初始化。
- 下一步推荐操作。
- 写入规则：需要写入时会询问，不要求用户记参数。

完整用户文档放在 `usage.md`。`help` 不复述全文，只给当前可操作提示并指向 `usage.md`。

### coach

在当前设计讨论中启用过程教学。

限制：

- standalone skill 不能自动监听其他 skill 或所有对话。
- 过程教学必须由用户显式启用，例如 `/engineering-coach coach standard` 或自然语言“接下来用工程教练模式陪我讨论这个模块”。
- 如果未显式启用，默认只在事后 `review` 或 `practice` 阶段介入。

教学强度：

- `light`：不打断设计讨论，只在阶段结束后复盘。
- `standard`：默认模式，只提最高价值的预测问题。
- `intensive`：对边界、数据流、失败模式、演进约束做更细答辩。

标准模式预算：

- 每次设计讨论最多 3 个 pre-decision prediction questions。
- 每次只问一个最高价值问题。
- 其他学习点延后到复盘。
- 只有发现关键误解时才追问。
- 用户可以随时说“先推进”“暂停教学”“深入追问”。
- 紧急、机械、已明确决策的任务不触发教学。

### review

基于设计文档或设计对话复盘工程设计思路。

输入方式：

- 显式设计文档路径。
- 指定的当前设计对话片段。
- `recent` 或“复盘刚才”，但 AI 必须先重述复盘范围供用户确认。

输出要求：

- 只选择 1-3 个最高价值设计决策复盘。
- 每个学习点必须包含具体问题、原始证据、事后推断、关键约束、备选方案、trade-off、选择理由、失效条件、可迁移方法和常见误区。
- 不复盘低价值命名、框架惯例或没有真实权衡的选择。
- 默认不写入长期学习档案，只输出建议写入块。

### practice

基于一次真实设计复盘或指定能力维度生成迁移练习。

流程：

- 选择训练能力点，通常为 1-2 个。
- 选择练习贴近度：`same-domain`、`near-transfer`、`far-transfer`。
- 选择难度：`basic`、`standard`、`stretch`。
- 生成练习题和 `Evaluation Contract Summary`。
- 要求用户先完整提交 independent design worksheet。
- 用户提交前不得展示参考方案。
- 用户完成 worksheet 后进入答辩。

贴近度：

- `same-domain`：同业务域，换模块或换约束，最贴近实战。
- `near-transfer`：不同表面场景，但保留核心结构约束，默认。
- `far-transfer`：跨业务域，用于验证真正迁移。

默认规则不是“业务脱敏”，而是“结构保真 + 敏感信息最小化”。只有涉及隐私、商业机密、真实客户、密钥、内部路径或可识别项目细节时，才做最小必要脱敏。脱敏不得移除影响设计判断的业务约束。

难度：

- `basic`：验证是否掌握刚才的方法。
- `standard`：默认，增加一个关键约束变化。
- `stretch`：增加多个约束冲突，适合完整答辩。

如果原模块简单，不强行复杂化业务，而是增加工程约束，例如并发、回滚、权限、观测、演进。

### assess

评分用户的独立设计答案和答辩表现。

评分不是寻找标准答案，而是验证：

- 约束是否一致。
- 边界是否清楚。
- 风险是否覆盖。
- trade-off 是否真实。
- 验证策略是否能发现设计失效。
- 面对约束变化时是否能调整方案。

评分必须基于用户提交的 worksheet 和答辩回答，不基于 AI 对用户能力的猜测。

### status

读取长期学习档案，展示当前工程能力状态。

输出应包含：

- 各能力维度当前状态。
- 最近证据链接。
- 当前最优先训练项。
- 常见薄弱模式。
- 下一次建议练习类型。

### resume

继续最近一个未完成练习。

优先继续最近一个状态不是 `assessed` 或 `archived` 的练习记录。

## 自然语言触发

用户不需要记住完整命令。AI 应尽量从自然语言判断意图。

示例：

```text
用 engineering-coach 复盘刚才的设计
给我出一个边界设计练习
继续上次没完成的工程能力训练
查看我的工程能力状态
接下来讨论这个模块时顺便训练我的设计思路
```

如果能判断模式，直接执行。判断不出时，只问一个澄清问题。

Slash 命令和参数仍然保留，作为熟练用户的快捷方式：

```text
/engineering-coach init
/engineering-coach coach [light|standard|intensive]
/engineering-coach review <doc-path|conversation|recent>
/engineering-coach practice [ability] [same-domain|near-transfer|far-transfer] [basic|standard|stretch]
/engineering-coach assess <practice-record-path|current-answer>
/engineering-coach status
/engineering-coach resume
```

## 写入策略

用户不应被要求记住 `--write` 或 `--no-write`。

默认采用交互式写入确认：

- `review` 默认只输出建议写入块，不直接写入。
- `practice` 和 `assess` 完成评分后，询问是否写入。
- 用户显式提供 `--write` 时，按配置写入，不再追问。
- 用户显式提供 `--no-write` 时，只输出，不写入。
- 同一轮连续操作确认一次即可，不对每个小块重复询问。

如果用户确认写入，允许同时更新：

- 单次练习记录。
- 长期学习档案。

如果 AI 无法访问配置路径或目标路径，输出标准化更新块，供用户手动保存。

## 长期学习档案

`profile.md` 只保存长期索引和能力状态，不保存完整练习过程。

内容包括：

- 能力维度状态。
- 每个维度最近证据，链接到练习记录。
- 当前最优先训练项，只保留 1 个。
- 常见薄弱模式，最多 3 条。
- 下次建议练习类型。
- 最近更新时间。

能力状态：

```text
exposed
practicing
provisional
validated
transferred
```

升级规则：

- `exposed`：review 中出现过该能力点。
- `practicing`：做过至少 1 次相关练习。
- `provisional`：一次 `assessed` 达到 3 分以上。
- `validated`：两次不同场景达到 3 分以上，且答辩没有关键漏洞。
- `transferred`：一次 `far-transfer` 达到 3 分以上。

单次练习只能追加 evidence，不应直接覆盖长期画像。后续低分不立刻降级，而是记录 `regression_signal`；连续出现时再调整状态。

## 能力模型

固定能力模型，实际复盘时从中选择 2-4 个关键能力。

- Problem modeling：问题建模。
- Boundary identification：边界识别。
- Design order：设计顺序。
- Data/state：数据与状态。
- Interfaces/dependencies：接口与依赖。
- Failure modes：失败模式。
- Evolution/change：演进与变更。
- Validation strategy：验证策略。
- Trade-off articulation：trade-off 表达。

## 独立作答模板

练习阶段必须要求用户先提交完整 worksheet，再进入评分或参考方案。

```markdown
# Independent Design Worksheet

## 1. Problem Framing
这个模块/功能真正要解决什么问题？不解决什么问题？

## 2. Goals And Constraints
目标、硬约束、软约束分别是什么？

## 3. Assumptions
你做了哪些假设？哪些需要验证？

## 4. Boundaries
模块边界在哪里？它应该依赖谁？不应该知道什么？

## 5. Data And State
核心数据、状态流转、一致性要求是什么？

## 6. Interfaces
对外接口、内部协作接口、错误语义是什么？

## 7. Failure Modes
可能失败在哪里？失败后系统和用户分别看到什么？

## 8. Alternatives And Trade-offs
至少给出 2 个方案。各自赢在哪里、输在哪里、什么时候不适用？

## 9. Validation Plan
你如何验证设计是对的？包括测试、观测、回滚或演进策略。
```

如果用户只写一小段，AI 可以指出缺口，但不能直接代写答案。

## 答辩规则

标准模式：

- 最多 3 个答辩问题。
- 每个问题只验证一个风险点或一个 trade-off。
- 问题优先来自用户答案里“看似合理但没说明约束”的地方。
- 至少 1 个问题必须是 constraint-shift。
- 不追问纯记忆题，不问“你知道某模式吗”。
- 用户回答后，AI 只判断该问题是否提升或降低某个维度的证据。
- 答辩结束后统一评分和总结。

用户可以选择验证模式：

- `review`：只在原文档中添加修改意见，最高验证等级为 `initially_verified`。
- `standard`：默认，1-3 个目标问题。
- `defense`：完整交互答辩。

用户可以跳过答辩，但跳过后不能标记为 mastery。

## 评分机制

评分维度固定为 6 项，每项 0-4 分，不输出单一总分。

- Problem modeling。
- Decision order。
- Boundary design。
- Risk coverage。
- Trade-off。
- Validation。

评分锚点：

- 0：遗漏。
- 1：提示后才能补充。
- 2：主动提到但不完整。
- 3：独立、合理、能覆盖主要约束。
- 4：能处理反例或约束变化。

评分输出必须包含：

- 每个维度分数。
- 最强证据。
- 最弱证据。
- 一个优先改进项。
- 当前验证等级。
- 与历史记录的变化。
- 下一次挑战建议。

## Evaluation Contract

练习必须使用评分契约，避免 AI 事后移动靶子。

出题时展示 `Evaluation Contract Summary`：

- 本题主要考察的 1-2 个能力维度。
- 必须覆盖的关键风险。
- 至少需要比较的方案数。
- 明显不合格的缺陷类型。

不提前展示完整参考方案。

完整 `Evaluation Contract` 可写入 practice record。若是 AI 出题，应在用户作答前固定核心考点；若用户提交的是已有设计答案，评分前可以补全 contract，但不得根据用户答案改变核心考点。

## Practice Record

单次练习记录保存完整证据、答案、答辩和评分。

Frontmatter：

```markdown
---
schema_version: 1
type: engineering-coach-practice
date: 2026-09-04
topic: "<module or design topic>"
source_type: "design-doc | conversation-segment | recent-conversation | synthetic-practice"
practice_status: "draft | answered | assessed | archived"
verification_level: "unverified | initially_verified | verified | transfer_verified"
abilities: []
---
```

正文结构：

```markdown
# Practice Record

## Source Scope
本次复盘/练习引用的原始范围。

## Raw Evidence
从设计文档、对话、用户答案中摘出的事实证据。

## Post-hoc Inference
AI 根据证据重建的思考过程；必须标注不确定性。

## Transferable Principles
可迁移的工程设计方法。

## Practice Scenario
模拟练习题，包括目标、约束、变更风险、不可接受缺陷。

## User Design Answer
用户独立填写的设计答案。

## Evaluation Contract
评分前固定的判断标准，不得事后改。

## Defense Q&A
一问一答的追问记录。

## Assessment
六维评分、证据、优先改进项、验证等级。

## Reference Alternatives
评分完成后补充。列出 2-3 种可行方案、适用条件、主要 trade-off、失效条件。

## Profile Update
建议写入长期学习档案的最小更新块。
```

练习状态：

- `draft`：已生成练习题，但用户还没提交完整 worksheet。
- `answered`：用户已提交完整 worksheet，但还没完成答辩。
- `assessed`：已完成评分，可写入 profile，验证等级最高到 `verified`。
- `archived`：用户主动跳过或中止，不再等待继续。

只有 `assessed` 能更新长期能力状态。

## 证据规则

必须强制区分：

- `Raw Evidence`：来自设计文档、对话或用户答案的原始材料。
- `Post-hoc Inference`：AI 根据证据重建的思考过程。
- `Transferable Principles`：可迁移的一般工程方法。

上下文不足时必须降级输出：

- 缺少真实设计文档或对话证据时，`review` 只能输出可观察事实和待验证推断。
- 用户只给最终方案时，可以反推可能设计路径，但必须标记为 `Post-hoc Inference`。
- 证据不足以出练习题时，可以出“基于当前方案的模拟题”，但不能说它来自用户真实弱点。
- 长期 profile 更新必须引用 practice record 里的证据。

## 设计决策选择标准

每次复盘只选择 1-3 个高价值设计决策。

优先选择：

- 有跨模块影响。
- 代价高或难以回滚。
- 至少存在两个有效方案。
- 涉及边界、依赖、状态、一致性、失败或演进。
- 用户遗漏但对结果重要。
- 具有可迁移训练价值。

跳过：

- 低价值命名问题。
- 框架约定。
- 没有真实权衡的实现细节。
- 只适合当前项目、无法迁移的偶然细节。

## 迁移练习

迁移练习分三级：

- Near-transfer：改领域或实体名称，但保留同一结构挑战。
- Constraint-shift：改变一个关键约束，验证用户是否能重新权衡。
- Far-transfer：换业务域或模块形态，只保留同一工程原则。

默认第一次练习使用 `near-transfer`；标准答辩中至少包含一个 `constraint-shift`；只有后续 `far-transfer` 达标才能获得 `transferred`。

## Trade-off 原则

该 skill 必须强调 trade-off thinking。

要求：

- 不暗示存在银弹。
- 不把参考方案包装为唯一正确答案。
- 必须说明每个方案适用条件、代价和失效条件。
- 高分答案可以与 AI 参考方案不同，只要约束一致、风险处理合理、trade-off 清楚、验证策略有效。
- 相同架构但没有推理证据，不视为 mastery。

## 用户文档 usage.md

`usage.md` 面向用户，不面向运行时推理。

应包含：

- 快速开始：初始化、复盘、练习、查看状态。
- 自然语言触发示例。
- 模式说明。
- 文件会保存到哪里。
- 练习流程：出题、独立 worksheet、答辩、评分、写入。
- 如何跳过答辩。
- 如何只要文档修改意见。
- 如何迁移配置到另一台机器。
- 常见问题：上下文不足、评分不等于标准答案、为什么不直接给参考方案。

## 成功标准

- 用户能用自然语言触发，不必记住命令和参数。
- 每次复盘都能清楚区分 `Raw Evidence`、`Post-hoc Inference`、`Transferable Principles`。
- 每次练习都要求用户先独立完成 worksheet，再进入答辩和评分。
- 评分不是给标准答案，而是验证约束一致性、边界意识、trade-off、风险覆盖和验证策略。
- 长期 profile 只能基于 practice record 证据更新，不能凭 AI 印象更新。
- skill 能在没有 Logseq、Obsidian 的情况下工作，只依赖用户配置的 Markdown 路径。
- 用户可以选择轻量 review、标准答辩或完整 defense，但跳过答辩时不能标记为 mastery。

## 生成 Skill 时的实现提示

后续让 AI 基于本文档生成 skill 时，应要求：

- 先创建 `SKILL.md`、`usage.md`、`config.example.md`、`references/scoring-rubric.md`、`templates/learning-profile.md`、`templates/practice-record.md`。
- `SKILL.md` 只包含模式路由、初始化检查、关键约束和需要读取哪些支持文件。
- 详细评分锚点放入 `references/scoring-rubric.md`。
- 用户可读说明放入 `usage.md`。
- Markdown 模板放入 `templates/`。
- 个人配置和学习记录不放入 skill 目录。
- 初始化行为必须要求用户显式提供根目录或配置路径。

可直接给 AI 的生成提示：

```text
请基于 skills/engineering-coach/requirements.md 创建 engineering-coach skill。
要求保持 SKILL.md 精简，将评分细则、用户说明和记录模板分离到 references/、usage.md 和 templates/。
不要把个人路径写死到 skill 中；首次使用必须通过 init 让用户显式提供本地根目录或配置文件路径。
实现时必须支持自然语言触发、证据/推断/原则分离、独立作答、答辩、六维评分、长期 profile 证据累计更新。
```
