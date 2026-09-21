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

## Independent Design Worksheet

### 1. Problem Framing

这个模块/功能真正要解决什么问题？不解决什么问题？

### 2. Goals And Constraints

目标、硬约束、软约束分别是什么？

### 3. Assumptions

你做了哪些假设？哪些需要验证？

### 4. Boundaries

模块边界在哪里？它应该依赖谁？不应该知道什么？

### 5. Data And State

核心数据、状态流转、一致性要求是什么？

### 6. Interfaces

对外接口、内部协作接口、错误语义是什么？

### 7. Failure Modes

可能失败在哪里？失败后系统和用户分别看到什么？

### 8. Alternatives And Trade-offs

至少给出 2 个方案。各自赢在哪里、输在哪里、什么时候不适用？

### 9. Validation Plan

你如何验证设计是对的？包括测试、观测、回滚或演进策略。

## Evaluation Contract

评分前固定的判断标准。出题时先写完整 contract，只向用户展示 summary。

### Summary Shown To User

- Target abilities:
- Key risks:
- Minimum alternatives:
- Unacceptable flaw types:

### Full Contract

- Primary ability dimensions:
- Secondary ability dimensions:
- Constraints that must remain consistent:
- Required boundary decisions:
- Required data/state decisions:
- Required failure modes:
- Required trade-off comparison:
- Required validation evidence:
- Constraint-shift defense focus:
- Conditions for `initially_verified`:
- Conditions for `verified`:
- Conditions for `transfer_verified`:

## Defense Q&A

一问一答的追问记录。

## Assessment

六维评分、证据、优先改进项、验证等级。

## Reference Alternatives

评分完成后补充。列出 2-3 种可行方案、适用条件、主要 trade-off、失效条件。

## Profile Update

建议写入长期学习档案的最小更新块。
