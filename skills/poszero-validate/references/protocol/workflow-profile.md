# Workflow Profile

A Feature has one persisted Workflow Profile in its active `change.md` or `spec.md`. Downstream skills reuse it instead of classifying work again.

## Required fields

```yaml
entry: change.md | spec.md
reason: <evidence for the selected contract>
risk_triggers: []
required_review: []
required_checks: []
```

## Entry and gates

- `change.md` is for one bounded change with clear acceptance and target verification, no unresolved design choice, and no risk trigger. An existing Approved Ready task may be executed directly when it has equivalent scope and checks and no risk trigger; a task with a trigger requires linked Approved Spec, Plan, and Tasks.
- `spec.md` starts the Spec → Plan → Tasks → Implement → Validate path when work needs product decisions, module design, coordinated tasks, or a risk trigger.
- Risk triggers require `spec.md`, direct approval of affected decisions, and independent validation. Risk acceptance may change the chosen solution but does not erase the trigger or evidence requirement.
- `required_review` names concrete human decisions or manual checks; `required_checks` names project quality gates and contract checks. Empty lists mean none beyond checks stated in the active contract.
- If work grows beyond `change.md`, preserve its evidence and migrate to `spec.md` with user approval. Keep one active contract per feature and review downstream Stale impact.
