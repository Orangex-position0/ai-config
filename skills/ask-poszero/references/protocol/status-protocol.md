# Status and Staleness Protocol

Derive workflow status from document facts. Persist user decisions, not duplicate derived state.

## Decision order

1. Missing `.sdd/` or Constitution → `poszero-init`.
2. When an Approved direct task exists with no risk trigger, Ready or failed/incomplete Verification → `poszero-implement`; Done with passed target Verification → Complete. A triggered task without linked Approved Spec, Plan, and Tasks → `poszero-specify`. For `change.md`, missing or incomplete scope → `poszero-specify`; complete scope with missing, failed, or stale Result / Verification → `poszero-implement`; passed target Verification and recorded Result → Complete.
3. For the Spec path, missing or unapproved Spec → `poszero-specify`.
4. Approved Spec with missing or stale Plan → `poszero-plan`.
5. Approved Plan with missing or stale Tasks → `poszero-tasks`.
6. Ready task exists → `poszero-implement`.
7. Failed validation → its recorded return stage, usually `poszero-implement` for an implementation defect.
8. All tasks done and validation missing, stale, or incomplete → `poszero-validate`.
9. Validation passed → Complete.

## Stale propagation

- A material Spec change invalidates only linked Plan sections, batches, Tasks, and Validation items.
- A material Plan change invalidates linked Tasks and Validation items.
- A material Task change invalidates its Evidence and linked Validation items.
- A direct change uses one change unit; any material change invalidates its Result and Verification.
- If impact cannot be determined, mark the downstream scope stale and request a full review rather than silently continuing.
