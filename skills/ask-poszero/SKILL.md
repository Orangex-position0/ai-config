---
name: ask-poszero
description: "诊断 PosZero 状态、解释流程并推荐下一步。"
disable-model-invocation: true
---

# Ask PosZero

Read the project state and recommend one next user-invoked PosZero skill. Do not invoke another skill.

## Contract

- Preconditions: none; `.sdd/` may be missing or incomplete.
- Inputs: user path/slug, readable `.sdd/`, installed version and recommendation index if available.
- Branches: No Project, One Feature, Multiple Features, Blocked, Stale, Complete.
- Allowed mutations: none.
- Handoff: selected scope, derived status, evidence, blockers, one primary next step, optional recommendations.

## Steps

1. Resolve project root and scan candidate features using `references/common-protocol.md`.
   Complete when the target is unique; if multiple candidates exist, ask the user to choose.
2. Check Constitution, template compatibility, and document consistency.
   Complete when missing files, conflicts, Stale inputs, and version issues have file evidence.
3. Derive current status with the most conservative matching state.
   Complete when every conclusion traces to document facts.
4. Give one primary Handoff and read recommendation index only when useful.
   Complete when the next step is clear, non-blocking recommendations are no more than two, and no file changed.

## Decision Order

1. Missing `.sdd/` or Constitution: recommend `poszero-init`.
2. Missing or unapproved Spec: recommend `poszero-specify`.
3. Missing or unapproved Plan: recommend `poszero-plan`.
4. Missing or unapproved Tasks: recommend `poszero-tasks`.
5. Ready task exists: recommend `poszero-implement`.
6. All tasks done and validation missing, stale, failed, or incomplete: recommend `poszero-validate`.
7. Passed validation: report Complete.
