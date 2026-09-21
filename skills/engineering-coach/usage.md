# Engineering Coach 使用说明

`engineering-coach` 用来把真实项目里的设计讨论变成工程能力训练。它不会把 AI 的方案当标准答案，而是帮你复盘“这次是怎么想的”、练习“换一个相似模块你会怎么想”，再用答辩和评分验证你是否真的掌握。

这份文档帮助用户理解用法；运行时行为以 `SKILL.md` 和 `references/` 为准。

## 快速开始

第一次使用先初始化：

```text
/engineering-coach init
```

你也可以自然语言触发：

```text
初始化 engineering-coach，把学习记录放到 D:/notes/engineering-coach
```

初始化会创建或使用这些文件：

```text
<root>/config.md
<root>/profile.md
<root>/practices/
```

`profile.md` 保存长期能力画像；`practices/` 里每个练习一份记录。它不要求你使用 Logseq、Obsidian 或任何特定笔记软件。

模板支持中文和英文。默认使用中文模板；如果初始化配置里的 `locale` 是英文，或你明确要求英文记录，AI 会使用 `templates/*.en.md`。能力 id、状态值和 frontmatter 枚举值始终保持英文 canonical form，方便长期检索和跨工具迁移。

## 常用自然语言

```text
用 engineering-coach 复盘刚才的设计
给我出一个边界设计练习
接下来讨论这个模块时顺便训练我的设计思路
评估我刚才的设计答案
继续上次没完成的工程能力训练
查看我的工程能力状态
engineering-coach 怎么用？
```

如果意图明确，AI 会直接进入对应模式；如果不明确，只会问一个澄清问题。

## 模式

完整行为由 skill 自动处理；你通常不需要记命令。

- `init`：配置本地 Markdown 存储。
- `help`：显示简短帮助。
- `coach`：在设计讨论过程中插入少量预测问题。
- `review`：从设计文档或对话中复盘设计思路。
- `practice`：生成迁移练习。
- `assess`：评分你的独立设计答案和答辩。
- `status`：查看长期能力画像。
- `resume`：继续最近一个未完成练习。

## 推荐流程

1. 先做真实项目设计讨论。
2. 让 `engineering-coach` 复盘其中 1-3 个高价值设计决策。
3. 让它生成一个迁移练习。
4. 你完整填写 independent design worksheet。
5. 进入 1-3 个问题的答辩。
6. 得到六维评分和一个优先改进项。
7. 选择是否写入 practice record 和长期 profile。

## 练习必须先独立作答

练习不是让你看参考答案。你需要先填写：

1. Problem Framing
2. Goals And Constraints
3. Assumptions
4. Boundaries
5. Data And State
6. Interfaces
7. Failure Modes
8. Alternatives And Trade-offs
9. Validation Plan

如果你只写一小段，AI 可以指出缺口，但不会替你把答案补完后再评分。

## 答辩可选，但验证等级不同

你可以选择：

- `review`：只要文档修改意见，最高 `initially_verified`。
- `standard`：默认，1-3 个目标问题。
- `defense`：更完整的交互答辩。

跳过答辩可以节省时间，但不能证明 mastery。因为工程能力的关键不是复述方法，而是在约束变化时仍然能重新权衡。

## 写入规则

默认需要你确认才写入。你不用记参数。

- `review` 默认只输出建议写入块。
- `practice` 和 `assess` 完成后会询问是否写入。
- 熟练用户可以用 `--write` 或 `--no-write`。

如果 AI 无法访问配置路径，它会输出一个 Markdown 更新块，你可以手动保存。

## 配置迁移

迁移到另一台机器时，复制你的学习目录，然后在新环境重新运行 `init` 或直接告诉 AI config 路径。不要把个人学习记录放进 skill 目录；skill 目录只保存通用工作流。

## 常见问题

### 为什么不一开始给参考答案？

因为目标是训练设计能力，不是背诵方案。参考方案会在评分后出现，用来对照 trade-off，而不是抢走你的思考过程。

### 评分是不是标准答案匹配？

不是。高分答案可以和 AI 参考方案不同，只要约束一致、边界清楚、风险处理合理、trade-off 真实、验证策略有效。

### 业务信息脱敏会不会变成应试题？

规则是“结构保真 + 敏感信息最小化”。会保留影响设计判断的业务约束，只移除客户名、密钥、内部路径等可识别或敏感信息。

### 什么时候用 coach？

当你希望边设计边学习时使用。默认 `standard` 只会问少量高价值预测问题；如果只是想完成设计，不需要开启。
