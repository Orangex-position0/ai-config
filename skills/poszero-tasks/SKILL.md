---
name: poszero-tasks
description: "将已批准 Plan 拆解为 PosZero tasks.md。"
disable-model-invocation: true
---

# PosZero Tasks

Create or revise the executable task set for one feature.

## Contract

- Preconditions: Approved Constitution, Spec, and Plan; inputs are not Stale.
- Inputs: `REQ-*`, `SC-*`, `DEC-*`, Plan testing strategy, project execution constraints.
- Branches: New Task Set, Revise Task Set, External Plan, Coverage Blocked.
- Allowed mutations: selected feature `tasks.md`.
- Handoff: tasks document status, Ready set, dependency or coverage blockers, optional Implement path.

## Steps

1. Validate inputs and build or read the Imported Requirement Map with `references/common-protocol.md`.
   Complete when all requirements use stable local IDs and sources are locatable.
2. Split minimal vertical tasks by independently verifiable outcomes.
   Complete when every task includes Outcome, Scope, and Verification, not just file or layer work.
3. Allocate `TASK-*`, Covers, and Depends On.
   Complete when active `REQ-*`/`SC-*` are covered, the dependency graph has no cycle, and no required task is orphaned.
4. Set new tasks to Pending and run the Tasks Ready Gate.
   Complete when every task boundary, dependency, and completion Evidence is checkable.
5. Set `tasks.md` to In Review and ask for approval.
   Complete when user approval makes the document Approved; otherwise no executable Ready task is produced.

## Ready

Ready is derived, not persisted: a Pending task is Ready only when dependencies are Done or approved Cancelled, upstream Contracts are Approved and not Stale, and no blocker remains.
