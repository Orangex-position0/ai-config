# Template Authoring

PosZero keeps a bounded-change contract or four feature-level design documents:

- `change.md` for one bounded change
- `spec.md`
- `plan.md`
- `tasks.md`
- `validation.md`

Do not add `implementation.md` by default. `poszero-implement` records implementation evidence in `tasks.md`. Each bootstrap template has equivalent English (`references/templates/en/*-template.md`) and Chinese (`references/templates/zh-CN/*-template.md`) variants. Init selects one language once in `.sdd/README.md` and copies files from that language directory into the flat `.sdd/templates/` directory without changing filenames; preserve project customizations. All later skills reuse the recorded language unless the user explicitly changes it before a document is created. Preserve machine-readable field names, IDs, and status values across languages.

Ownership: Spec states why/what and externally observable behavior; Plan decides how and architecture; Tasks order executable work and local checks; Validation records independent results and evidence. Downstream documents reference upstream item IDs and revisions instead of copying entire sections. Human discussion is risk-based: Spec needs goals, bounds, and acceptance approval; Plan needs approval of consequential design choices; Tasks need scope review; Validation reports actual findings, not hypothetical results.

## Spec Template

Specs define Why, What, Observable Contract, and Constraints. Keep implementation design out of `spec.md`.

Use these spec sections:

- Problem Statement
- Goals
- In Scope
- Success Metrics (Optional)
- User / Actor Scenarios
- External API Contract, only when a public API changes
- Acceptance Criteria
- Non-Goals
- Constraints

Include affected business boundaries and data semantics when relevant. For changed public APIs, define caller-visible request/response semantics, errors, and compatibility in Spec or link an approved contract artifact; Plan references that contract without copying it. For interactive scenarios, capture key user paths, feedback, failure or empty states, and outcomes without prescribing UI implementation. Cite approved technical boundaries; new technical choices, types, method signatures, program layout, call graph, storage choice, and module interaction design belong in Plan.

Use `SC-*` for scenario IDs and `REQ-*` for requirement IDs so downstream coverage can link directly to the Spec.
Existing approved documents with older IDs or task states require an explicit mapping and downstream impact review before migration; updating a bootstrap template alone does not migrate them.

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
Use the shared task states `Pending`, `In Progress`, `Done`, `Blocked`, and `Cancelled` in both language templates.

## Validation Template

Validation is contract-centered, not test-type-centered. Validate:

- Acceptance Criteria
- Vertical Slice outcomes
- Task Evidence
- Plan constraints and complexity decisions

Run project-level required checks independently here; an unrun required check cannot PASS.
