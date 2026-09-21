---
name: poszero-validate
description: "独立验收 PosZero feature 的需求、约束和范围。"
disable-model-invocation: true
---

# PosZero Validate

Validate the approved Contract independently. Product code is read-only during this skill.

## Contract

- Preconditions: Approved Constitution and validation Contract; implementation result is readable.
- Inputs: Constitution, Spec, Plan, Tasks, implementation state, available Evidence.
- Branches: First Run, Rerun, Correction Run, Manual Evidence Blocked, Stale Contract.
- Allowed mutations: selected feature `validation.md` and explicitly agreed raw logs; product code stays read-only.
- Handoff: Current Result, complete `RUN-*`, Human Review path/status, FAIL/BLOCKED items and return stage.

## Steps

1. Independently read all Contracts and check freshness with `references/common-protocol.md`.
   Complete when the validation baseline is unique and Stale input is Blocked.
2. Create or update stable `VAL-*` Validation Set.
   Complete when every active `REQ-*`/`SC-*`, key `DEC-*`, Non-Goal, and required manual item is covered.
3. Run AI Validation.
   Complete when every required Contract item has PASS, FAIL, BLOCKED, or justified N/A backed by direct Evidence.
4. Select and hand off risk-based Human Review paths.
   Complete when each path, reason, steps, and expected result is clear; missing user result remains BLOCKED; no qualifying path is recorded as justified N/A.
5. Append a new `RUN-*` containing the complete required set.
   Complete when old RUNs are unchanged and AI/Human Evidence is locatable.
6. Derive Current Result and Handoff.
   Complete when PASS/FAIL/BLOCKED aggregation is strict, issues return to the correct stage, and product code was not modified.
