---
name: poszero-validate
description: "Check a feature's implementation against its approved contract."
disable-model-invocation: true
---

# PosZero Validate

Check implementation against its active Contract. Product code is read-only during this skill.

## Contract

- Preconditions: Approved Constitution and readable implementation result; a `change.md` or Approved direct task, or Approved, non-Stale Spec, Plan, and Tasks.
- Inputs: active contract, implementation state, available Evidence, required checks and review items.
- Branches: Direct Result Check, Contract Run, Incremental Rerun, Correction Run, Manual Evidence Blocked, Stale Contract.
- Allowed mutations: none for a direct result check; selected feature `validation.md` and agreed raw logs for a full contract; product code stays read-only.
- Handoff: result, `RUN-*` when applicable, Human Review, FAIL/BLOCKED items, return stage.

## Steps

1. Read the active contract using `references/protocol/core-protocol.md` and `references/protocol/validate-protocol.md`.
   Complete when the source documents and required check set are locatable.
2. For `change.md` or a direct Approved task, read Result/Status, target Verification, and Evidence. For Spec → Plan → Tasks, independently read Contracts and check freshness.
   Complete when the baseline is unique and stale or conflicting inputs are identified.
3. Define checks from Acceptance Criteria, active `REQ-*`/`SC-*`, key `DEC-*`, Non-Goals, task Evidence, and required manual items where applicable.
   Complete when every required item has a validation method.
4. For a direct change, verify recorded target-test Evidence and Result/Status; missing or stale Evidence is BLOCKED and returns to Implement. For the full contract, independently run selected contract and required project checks; task-local Evidence is an input, not a substitute.
   Complete when every required check has PASS, FAIL, BLOCKED, or justified N/A backed by Evidence.
5. Hand off risk-based Human Review paths when required.
   Complete when each path, reason, steps, and expected result is clear; missing user result remains BLOCKED.
6. For the full contract, append a `RUN-*` with the required set; a direct check remains read-only.
   Complete when prior runs are unchanged and required Evidence is locatable.
7. Derive Current Result and Handoff.
   Complete when aggregation is strict, issues return to the correct stage, and product code was not modified.
