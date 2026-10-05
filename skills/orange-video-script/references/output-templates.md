# Output Templates

只使用当前 Task 和 Output 需要的模板。字段没有实际内容时直接省略。

## Beat Plan

仅在叙事方向存在决策风险时使用：

```md
# Video Beat Plan

## Brief

Primary Genre: [genre]
Modifiers: [Slides-based / Demo / Short-form]
Audience: [audience]
Target Duration: [duration]
Estimated Duration: [within ±10%]

Single Takeaway:

> [one memorable conclusion]

## Narrative Arc

[Section A] → [Section B] → [Section C]

## Section Budgets

| Section | Teaching Goal | Time | Source / Slide(s) |
| --- | --- | ---: | --- |
| Hook | ... | 0:20 | Slides 1–2 |

## Editorial Decisions

- [important cut, merge, reorder, or scope decision and why]

## Fact-check Requirements

- [claim requiring verification and why]

## Open Decisions

- [only decisions that block scripting]
```

省略没有内容的 `Fact-check Requirements` 和 `Open Decisions`。

## Speaking Notes

```md
# Video Script

## Overview

Primary Genre: [genre]
Modifiers: [modifiers]
Audience: [audience]
Target Duration: [duration]
Estimated Duration: [duration]

Single Takeaway:

> [one memorable conclusion]

Narrative Arc:

[Section A] → [Section B] → [Section C]

---

## 01 — [Section]

Time: [section duration]
Teaching Goal: [what the viewer should understand]
Slide(s): [page mapping, when applicable]

### Beat 01 — [beat name]

Time: [beat duration]

Speaking Beats:

- [one idea]
- [one idea]

Key Line:

> [precise sentence worth saying verbatim]

Visual: [what viewers should see]
Viewer Focus: [what to notice]
Pause: [duration and reason]
Transition:

> [causal, contrastive, or question-led bridge]
```

Section 持有 `Teaching Goal`。只有 Beat 的目标与 Section 不同时，才在 Beat 中增加 `Goal`。

## Verbatim Script

保持相同的 Section 和 Beat 层级，以以下字段替换 `Speaking Beats`：

```md
### Beat 02 — [beat name]

Time: 0:35
Estimated Word Count: [count]

Verbatim Script:

[short, speakable paragraphs]
```

全文末尾增加：

```md
## Timing Check

Spoken Language: [language]
Assumed Pace: [characters or words per minute]
Spoken Content: [count]
Non-speaking Time: [duration]
Estimated Total: [duration]
Target: [duration]
Variance: [percentage; within ±10%]
```

字数只计算实际口播，不包含标题、字段名和制作说明。

## Demo Beat

```md
### Beat 03 — Run the command

Time: 0:40

On Screen:

1. [visible action]
2. [visible result]

Say:

- [meaning added beyond the visible action]

Viewer Focus: [specific output or change]
Pause: 5s — [what viewers need time to observe]

Key Line:

> [the meaning of what just happened]
```

## Script Diagnosis and Rewrite

输入已有脚本时，在同一次交付中输出诊断和完整重写：

```md
# Script Diagnosis

## Summary

Single Takeaway: [clear / competing / missing]
Estimated Duration: [duration and assumptions]
Revision Scope: [what the rewrite changes]

## Critical

- [issue, evidence, consequence, fix applied]

## Important

- [issue, evidence, consequence, fix applied]

## Optional

- [polish opportunity]

---

# Rewritten Video Script

[Use Speaking Notes or Verbatim Script template according to Output.]
```

只输出有发现的优先级，不使用百分制评分。

## Fact Check Notes

仅在实际触发核查时添加：

```md
## Fact Check Notes

### [claim]

Status: Verified | Corrected | Uncertain
Change: [what changed or how wording was qualified]
Source: [primary-source title and URL]
```

## Constraint Conflict

```md
## Constraint Conflict

The current Must Know scope needs approximately [minimum duration], outside the [target ±10%] range.

1. Keep the duration: narrow the Single Takeaway to [proposal].
2. Keep the scope: increase the target to [minimum duration].
```
