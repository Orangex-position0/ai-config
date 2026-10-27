# Validate Protocol

- For `change.md` or a direct Approved task, check Result or Status against target-test Evidence without writing `validation.md`. Missing or stale Evidence is BLOCKED.
- For Spec → Plan → Tasks, independently validate active `REQ-*`/`SC-*`, Acceptance Criteria, key `DEC-*`, Non-Goals, and required manual items. Start a complete `RUN-*` baseline, then rerun incrementally when input fingerprints remain current.
- Independently run required project-level and contract checks; task-local test results from Implement are inputs, not substitutes. Record commands and evidence. Required checks not run or unavailable are BLOCKED, never PASS.
- Human Review focuses on FAIL, BLOCKED, manual evidence, and risk acceptance.
