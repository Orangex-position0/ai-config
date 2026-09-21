---
name: poszero-implement
description: "按一个 Ready TASK 实现、测试并记录 PosZero Evidence。"
disable-model-invocation: true
---

# PosZero Implement

Implement one Ready `TASK-*` at a time. Batch mode still processes tasks one by one.

## Contract

- Preconditions: Approved Constitution and `tasks.md`; at least one task derives as Ready.
- Inputs: one selected `TASK-*`, linked `REQ-*`/`SC-*`/`DEC-*`, codebase, Version Control Policy.
- Branches: Single Task, Explicit Batch, TDD, Approved TDD Exception, Blocked.
- Allowed mutations: current task code/tests/config and that task's Status/Evidence; local commit only when policy authorizes it.
- Handoff: implementation result, verification Evidence, files mapped to Plan modules, entry and main call path, commit status, remaining Ready/Blocked tasks, optional next step.

## Steps

1. Derive the Ready set and select one task using `references/common-protocol.md`.
   Complete when the current `TASK-*` is unique and dependencies are satisfied.
2. Check task scope against the working tree.
   Complete when unrelated user changes are excluded and unsafe overlap is Blocked.
3. Get the confirmed test seam from Plan and task Verification.
   Complete when TDD is clear, or an approved exception is recorded before implementation; no extra TDD document is needed.
4. Implement the smallest task result and collect target plus regression Evidence.
   Complete when Verification passes, or the task is Blocked with concrete unblock conditions.
5. Update task Status and Implementation Evidence.
   Complete when Done only appears with complete Evidence and historical information is preserved.
6. Output code-structure Handoff.
   Complete when changed files map to Plan modules and entry, main call path, and deviations are explained.
7. Apply Version Control Policy for local commit.
   Complete when the commit contains only task files, or failure/skipped reason is reported.
