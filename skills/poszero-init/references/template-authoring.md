# Template Authoring

PosZero keeps four feature-level contract documents:

- `spec.md`
- `plan.md`
- `tasks.md`
- `validation.md`

Do not add `implementation.md` by default. `poszero-implement` records implementation evidence in `tasks.md`.

## Spec Template

Specs define Why, What, Observable Contract, and Constraints. Keep implementation design out of `spec.md`.

Use these spec sections:

- Problem Statement
- Success Metrics (Optional)
- User / Actor Scenarios
- Acceptance Criteria
- Non-Goals
- Constraints

Do not include types, method signatures, program layout, call graph, storage choice, or module interaction design in the spec.

## Plan Template

Plans define How, Architecture, Program Design, and Vertical Slice order.

Use these plan sections:

- Technical Context
- Implementation Approach
- Complexity Tracking, only when added complexity needs justification
- System Architecture, only when cross-boundary design changes are relevant
- Program Design, only when code structure changes are relevant
- Project Structure, only when files or directories are added, moved, or redefined
- Protocol Check
- Vertical Slices

Use `NEEDS DECISION: [specific question]` only when missing information changes the implementation direction. Otherwise, proceed with a reasonable default.

Do not add default `research.md`, `data-model.md`, `quickstart.md`, or `contracts/` outputs.

## Tasks Template

Tasks expand vertical slices into executable work. Each task must have a clear change scope, be verifiable when complete, avoid hidden dependency on unrelated layer work, avoid mechanical steps such as creating a file or importing a type, and avoid vague work such as implementing a whole subsystem.

Use the Task Quality Gate columns:

- Slice
- Task
- Acceptance Check
- Verification Command

`Verification Command` may be `N/A - docs only`, but `Acceptance Check` must still be specific.

Use `Implementation Evidence` in `tasks.md` instead of a separate implementation document.

## Validation Template

Validation is contract-centered, not test-type-centered. Validate:

- Acceptance Criteria
- Vertical Slice outcomes
- Task Evidence
- Plan constraints and complexity decisions
