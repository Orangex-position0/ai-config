---
name: ppp-creator
description: Create concise PPP (Progress, Plans, Problems) work status updates from a user's notes, rough progress, project context, or daily/weekly report draft. Use when the user asks to write, polish, summarize, or structure work updates for managers or teams using the PPP format.
---

# PPP Creator

将用户的工作笔记、日报、周报或零散进展整理成 PPP（Progress, Plans, Problems）格式的工作同步内容。目标是让管理者或团队快速了解进展、下一步计划和阻碍风险。

## 输出结构

使用 [ppp-template.md](ppp-template.md) 作为默认模板：

- `Progress`：已经完成的工作、阶段性成果。
- `Plans`：下一步要做的短期可执行事项。
- `Problems`：当前遇到的阻碍、风险或需要协助的事项。

## 写作规则

- 每个部分保持简短，通常 1-3 个句子或 1-3 条 bullet。
- 优先写结果和风险，不展开冗长过程。
- 将模糊表述改成可判断的状态，例如“完成接口联调”优于“继续做接口相关内容”。
- `Plans` 写短期可执行动作，不写长期愿景。
- `Problems` 没有阻碍时写“暂无明显阻碍”，不要编造风险。
- 保留关键时间、范围、指标、负责人和依赖关系。

## 处理草稿

1. 从草稿中抽取已完成事项，放入 `Progress`。
2. 从草稿中抽取下一步动作，放入 `Plans`。
3. 从草稿中抽取阻碍、风险、依赖或待确认问题，放入 `Problems`。
4. 删除重复、情绪化或过细的过程描述。
5. 信息不足时使用保守措辞，不虚构进展。

## 输出要求

- 默认输出中文 Markdown。
- 如果用户指定日报、周报、项目例会或英文输出，按用户指定场景调整语气。
- 如果用户提供的信息太少，先给出可用版本，再列出最多 3 个需要补充的问题。
