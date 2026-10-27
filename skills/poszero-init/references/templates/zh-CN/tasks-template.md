# 任务：{{FEATURE_NAME}}

## 文档控制

| Field | Value |
| --- | --- |
| Status | Draft |
| Revision | 0.1 |
| Approved By | Pending |
| Approved At | Pending |
| Approval Note | Pending |

## 输入

- `spec.md`
- `plan.md`
- `research.md`（如有）
- `data-model.md`（如有）
- `contracts/`（如有）

生成的文档须替换所有占位符，并移除仅供模板阅读的提示。

## 任务粒度规则

每个任务应有明确变更范围、可独立验证、不隐含依赖无关层工作；避免仅创建文件／导入类型的机械步骤，或“实现整个子系统”的模糊步骤。代码、模板或文档变更任务必须注明目标路径。

## 任务质量门槛

| Slice | Task | Acceptance Check | Verification Command |
| --- | --- | --- | --- |

纯文档任务的命令可为 `N/A - docs only`，但验收检查仍须具体。任务相关测试及规定的本地回归检查通过后，才能标记 Done 或在本地提交；命令和结果记入实现证据。

## 任务列表

| ID | Status | Slice | Task | Acceptance Check | Verification Command | Depends On | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |

`Status` 可取 `Pending`、`In Progress`、`Done`、`Blocked`、`Cancelled`；`Depends On` 引用任务 ID 或填 `None`。

## 切片执行顺序

| Order | Slice | Reason |
| --- | --- | --- |

## 并行机会

| Tasks | Reason |
| --- | --- |

## 实现证据

| Task | Changed Files | Checks | Result | Notes |
| --- | --- | --- | --- | --- |

## 就绪分析

## 执行摘要

- Current Batch / Slice:
- Goal and Acceptance Criteria:
- Non-Goals:
- Relevant Modules / Interfaces:
- Technical Decisions:
- Test Seam and Commands:
- Required Evidence:
- Source Documents and Revisions:

## 批准
