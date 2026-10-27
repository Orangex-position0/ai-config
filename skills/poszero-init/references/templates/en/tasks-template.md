# Tasks: {{FEATURE_NAME}}

## Document Control

| Field | Value |
| --- | --- |
| Status | Draft |
| Revision | 0.1 |
| Approved By | Pending |
| Approved At | Pending |
| Approval Note | Pending |

## Inputs

- `spec.md`
- `plan.md`
- `research.md` if present
- `data-model.md` if present
- `contracts/` if present

Generated task documents must replace all placeholders and must not keep template-only guidance.

## Task Grain Rules

Each task must have a clear change scope, be verifiable when complete, avoid hidden dependency on unrelated layer work, avoid mechanical steps such as creating a file or importing a type, and avoid vague work such as implementing a whole subsystem.

Each implementation task must include the target file path when code, template, or documentation changes are expected.

## Task Quality Gate

| Slice | Task | Acceptance Check | Verification Command |
| --- | --- | --- | --- |

`Verification Command` may be `N/A - docs only`, but `Acceptance Check` must still be specific. Task-related tests and required local regression checks must pass before a task is Done or locally committed; record commands and results in Implementation Evidence.

## Tasks

| ID | Status | Slice | Task | Acceptance Check | Verification Command | Depends On | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |

`Status` values: `Pending`, `In Progress`, `Done`, `Blocked`, `Cancelled`.
`Depends On` must reference task IDs or be `None`.

## Slice Execution Order

| Order | Slice | Reason |
| --- | --- | --- |

## Parallel Opportunities

| Tasks | Reason |
| --- | --- |

## Implementation Evidence

| Task | Changed Files | Checks | Result | Notes |
| --- | --- | --- | --- | --- |

## Ready Analysis

## Execution Packet

- Current Batch / Slice:
- Goal and Acceptance Criteria:
- Non-Goals:
- Relevant Modules / Interfaces:
- Technical Decisions:
- Test Seam and Commands:
- Required Evidence:
- Source Documents and Revisions:

## Approval
