---
name: risk-based-code-review
description: Use this skill when preparing a human code review checklist for AI-generated code, large diffs, risky PRs, or review planning. It identifies which code programmers must personally read, routes each change to the right reading depth, and outputs a strict checklist plus a compact review table.
---

# Risk-Based Code Review

Generate a human-facing review checklist before reviewing code. Optimize for deciding what a programmer must personally read, what can be validated by systems, and what should be decomposed before review.

## Strong Rules

Treat these rules as mandatory:

- Personally read code that touches auth, permission, identity, access control, session handling, secrets, encryption, payments, billing, money movement, pricing, irreversible data changes, deletion, migration, recovery, production incident paths, or core business rules.
- Do not replace personal reading of critical paths with tests, lint, typecheck, generated summaries, or AI confidence.
- If a change can cause security loss, money loss, permission escalation, data loss, legal/compliance exposure, or irreversible customer impact, route it to line-by-line reading.
- Separate writer and reviewer roles. Do not let the same agent or person who produced the change be the only checker for high-risk code.
- For repeated AI mistakes, record the pattern and the fix as a reusable rule, memory, regression test, or checklist item.

## Reading Depth

Assign exactly one reading depth to each changed area:

| Depth | Use When | Reviewer Action |
|---|---|---|
| Line-by-line read | Critical paths, irreversible effects, auth/money/permission/security/core business logic | Read every relevant line and caller/callee needed to understand behavior |
| Focused read | Shared modules, complex control flow, concurrency, transactions, cross-service boundaries, public APIs | Read entry points, invariants, edge cases, and affected callers |
| System verification | Low-risk config, style, generated code, mechanical glue, dependency metadata | Verify through tests, build, static checks, traces, or runtime behavior |
| Sample check | Repetitive mechanical edits, renames, migrations with many identical files | Inspect representative samples and verify automation covered the rest |

Escalate upward when uncertain. Never downgrade critical-path code because the diff looks small.

## Workflow

1. Map the change into changed areas: feature logic, API boundary, storage, auth, money, data mutation, UI, config, generated/mechanical files.
2. Mark every area that triggers a strong rule as `must personally read`.
3. Trace enough caller/callee context to understand real behavior for every `line-by-line read` and `focused read` area.
4. Decide whether the diff should be decomposed. Recommend splitting when unrelated risks, multiple business flows, schema plus behavior, or generated churn hide reviewable logic.
5. Choose verification for each area: tests, traces, evals, shadow mode, manual check, migration dry run, rollback drill, or production monitor.
6. Decide whether an independent reviewer is required. Require one for `line-by-line read` areas and production incident fixes.
7. Output the checklist and table below. Do not include long prose unless the user asks for rationale.

## Output Format

Use this format:

```markdown
## Must Personally Read

- [ ] `<file-or-symbol>` - `<reason>` - depth: `<line-by-line read|focused read>`

## Review Routing

| Area | Risk | Depth | Required Verification | Split PR? | Independent Reviewer? |
|---|---|---|---|---|---|
| `<area>` | `<risk>` | `<depth>` | `<verification>` | `<yes/no + reason>` | `<yes/no + reason>` |

## Checklist

- [ ] Critical-path code was personally read; tests did not substitute for reading.
- [ ] Auth, permission, money, data-loss, migration, and irreversible paths were checked if touched.
- [ ] Affected callers/callees were traced for every high-risk area.
- [ ] Repeated or mechanical changes were sampled and backed by automated verification.
- [ ] Required tests/traces/evals/shadow-mode/manual checks are named.
- [ ] Large or mixed-risk diffs are split or explicitly justified.
- [ ] Writer and reviewer are separated for high-risk areas.
- [ ] Repeated AI mistakes are captured as a rule, memory, regression test, or checklist item.
```

If no code must be personally read, state that explicitly and explain which verification makes review sufficient.
