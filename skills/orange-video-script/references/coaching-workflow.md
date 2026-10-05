# Coaching Workflow

`coach` 的目标是把脚本判断能力迁移给用户，而不是替用户完成修改。只有用户明确表达教学、学习、脚本老师、获取优化建议后自己修改等意图时进入本流程。

## Coaching contract

- 先建立全局 Diagnostic Map，再每轮训练一个高杠杆问题；最多合并两个紧密相关的问题。
- 引用用户脚本中的具体证据，解释它对观众的影响。
- 给出 Principle、Revision Prompt 和可检查的 Success Criteria。
- 用户先修改；AI 默认不提供完整重写稿。
- 用户卡住时逐级增加 Hint，只提供解除当前阻塞所需的帮助。
- 每轮结束提炼一条可迁移到下一篇脚本的 Transfer Rule。

## 1. Establish the learning goal

确定 Audience、Target Duration，以及用户希望提升的能力。用户未指定能力时，扫描脚本并推荐一个最有杠杆的训练目标。

优先顺序：

1. Single Takeaway
2. Narrative Structure
3. Content Selection
4. Beat Clarity
5. Spoken Language
6. Local Polish

结构问题解决前，不把训练重点放在局部润色。

**完成条件：** 本轮只有一个明确的 Learning Goal。

## 2. Build the Diagnostic Map

检查：

- Single Takeaway
- Audience Promise 与 Hook
- Narrative Arc
- Section / Beat 结构
- 内容取舍与时间预算
- Spoken Language
- Example 与 Evidence
- Visual Attention
- Transition 与 Ending

将发现分为：

```text
High leverage：会改变整体理解或结构
Later：应处理，但不阻塞当前训练
```

Diagnostic Map 保持简洁，不在本步展开所有修改方法。

**完成条件：** 所有高杠杆问题已被识别，并选出本轮 Teaching Focus。

## 3. Teach one focus

使用以下结构：

```md
## Observation

[具体问题]

## Evidence

> [引用用户原文]

## Viewer Impact

[它如何影响理解、注意力或信任]

## Principle

[可迁移的脚本原则]

## Revision Prompt

[用户需要完成的具体修改]

## Success Criteria

- [observable criterion]
- [observable criterion]
```

Feedback 必须让用户知道“哪里有问题、为什么、应该练什么、怎样判断改好了”。

**完成条件：** 用户拥有一个边界明确、可以独立完成的修改任务。

## 4. Escalate hints only when needed

用户卡住时按顺序提供：

1. 指出问题位置；
2. 给出结构骨架；
3. 给出关键词或句式约束；
4. 给出一个局部示例。

用户明确要求参考答案时，可以提供当前局部的参考改写；完整重写应切换到 `revise` 或 `diagnose`，并先说明教学模式即将结束。

**完成条件：** Hint 只解除当前阻塞，没有替用户完成整项练习。

## 5. Review the user's revision

用户提交新版后，对比修改前后：

```md
## What Improved

- [change with before/after evidence]

## What Still Needs Work

- [remaining issue with evidence]

## Why

[principle-based explanation]

## Next Revision

[one bounded next action]
```

达到 Success Criteria 后结束当前 Focus；未达到时继续同一 Focus，不提前跳到低优先级问题。

## 6. Transfer

每轮结束输出：

```md
## Transfer Rule

[one reusable rule]

## Transfer Exercise

[a short exercise on a different topic]

## Your Turn

[exactly what the user should submit next]
```

迁移练习保持简短且默认可选。只有用户明确要求时，把已掌握原则、反复问题、当前训练重点和推荐练习写入 `.video-script-coach/profile.md`；不保存完整脚本和完整对话。

**完成条件：** 用户能说明本轮原则、完成或评估自己的修改，并知道下一步提交什么。

## First-round output

```md
# Script Coaching

## Learning Goal

## Diagnostic Map

### High Leverage

### Later

## This Round's Focus

## Observation

## Evidence

## Viewer Impact

## Principle

## Revision Prompt

## Success Criteria

## Transfer Rule

## Your Turn
```

## Trigger boundary

以下意图进入 `coach`：

- “作为脚本老师指导我”
- “只给建议，我自己修改”
- “我想学习怎么写脚本”
- “逐轮训练我的 Hook / 结构 / 口语表达”

以下意图进入其他 Task：

- “直接帮我改好” → `revise`
- “检查问题并给完整优化稿” → `diagnose`
- “根据这些 Slides 创建讲稿” → `create`

已有脚本本身不是 Coaching 意图。用户只提供脚本、没有说明目标时，先让用户选择诊断、直接修改或教学。
