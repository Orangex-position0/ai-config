---
name: poszero-tasks
description: "Break an approved plan into executable tasks."
disable-model-invocation: true
---

# PosZero Tasks

Create or revise the executable task set for one feature.

## Contract

- Preconditions: Approved Constitution; a usable `change.md` or Approved Ready task, or Approved, non-Stale Spec and Plan.
- Inputs: active contract or task scope, relevant `REQ-*`, `SC-*`, `DEC-*`, Plan testing strategy, execution constraints.
- Branches: Task Set, Revise Task Set, Direct Handoff, External Plan, Coverage Blocked.
- Allowed mutations: selected feature `tasks.md`.
- Handoff: tasks status, Execution Packet, Ready set, blockers, next skill.

## Steps

1. Read the active contract and validate inputs with `references/protocol/core-protocol.md` and `references/protocol/tasks-protocol.md`. Read `references/protocol/review-protocol.md` when preparing step 5 review. For `change.md` or an Approved Ready task, return its execution scope without creating `tasks.md`.
   Complete when the direct scope is locatable, or all active requirements have stable IDs and sources.
2. Split minimal vertical tasks by independently verifiable outcomes.
   Complete when every task includes Outcome, Scope, and Verification.
3. Allocate `TASK-*`, Covers, and Depends On.
   Complete when active `REQ-*` are covered, relevant `SC-*` are traced, the dependency graph has no cycle, and no required task is orphaned.
4. Set new tasks to Pending and run the Tasks Ready Gate.
   Complete when every task boundary, dependency, and completion Evidence is checkable.
5. Present execution scope, dependencies, and checks via Review Packet and Execution Packet; then set `tasks.md` to In Review and ask for approval.
   Complete when user approval makes the document Approved; otherwise no executable Ready task is produced.

## Ready

Ready is derived, not persisted: a Pending task is Ready only when dependencies are Done or approved Cancelled, upstream Contracts are Approved and not Stale, and no blocker remains.
