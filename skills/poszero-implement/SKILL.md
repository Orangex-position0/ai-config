---
name: poszero-implement
description: "Implement and test one ready task with recorded evidence."
disable-model-invocation: true
---

# PosZero Implement

Implement one bounded change or one Ready `TASK-*` at a time. Batch mode processes tasks one by one.

## Contract

- Preconditions: Approved Constitution; usable `change.md` or Approved Ready/correction task, or Approved, non-Stale `tasks.md` with a Ready/correction task.
- Inputs: active contract, selected change or task with linked `REQ-*`/`SC-*`/`DEC-*` where applicable, codebase, Version Control Policy.
- Branches: Bounded Change, Single Task, Correction Task, Explicit Batch, TDD, Approved TDD Exception, Blocked.
- Allowed mutations: selected code/tests/config and its `change.md` Result/Verification or task Status/Evidence; local commit when policy authorizes.
- Handoff: result, verification Evidence, changed files, relevant call path and deviations, commit status, remaining work.

## Steps

1. Read the active `change.md`, Approved Ready task, or Execution Packet using `references/protocol/core-protocol.md` and `references/protocol/implement-protocol.md`; select one change unit, Ready task, or task named by failed validation.
   Complete when the target and boundaries are unique and dependencies are satisfied, or failure Evidence identifies the correction.
2. Check the selected scope against the working tree.
   Complete when unrelated user changes are excluded and unsafe overlap is Blocked.
3. Identify acceptance, target verification, and any test seam or required test-first practice.
   Complete when each required check has an executable method or a recorded blocker; an exception to required TDD is approved before implementation.
4. Implement the smallest change or task result and run target tests plus required local regression checks; collect command-level Evidence.
   Complete when required task checks pass or the task is Blocked with concrete unblock conditions.
5. Update `change.md` Result/Verification or task Status and Implementation Evidence. Record changed files, checks, unresolved issues, and relevant module mapping, call path, or decision deviations.
   Complete when a passed Result or Done status has complete Evidence.
6. Output a code-structure Handoff with the entry, main path, and module ownership when relevant.
   Complete when the user can locate the changed code and understand its path without duplicating the Plan.
7. Apply Version Control Policy for local commit after required checks. A validation failure returns here for correction without resetting prior work; push or publish only after final verification and explicit authorization.
   Complete when the commit contains only current change or task files, or the failure/skipped reason is reported.
