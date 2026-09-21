---
name: poszero-plan
description: "基于已批准 Spec 制定 PosZero plan.md。"
disable-model-invocation: true
---

# PosZero Plan

Turn an Approved Spec into an implementation plan and developer orientation.

## Contract

- Preconditions: Approved Constitution; Approved and semantically complete Spec Contract.
- Inputs: actual Spec path and revision/fingerprint, current project state, applicable technical constraints.
- Branches: New Plan, Revise Existing, External Spec, Stale/Blocked Input.
- Allowed mutations: selected feature `plan.md` and clearly linked auxiliary files when needed.
- Handoff: plan revision/status, key `DEC-*`, Developer Orientation result, coverage gaps, optional Tasks path.

## Steps

1. Resolve feature and validate input Approval, semantic completeness, and freshness with `references/common-protocol.md`.
   Complete when Inputs are locatable and not Stale; otherwise return upstream.
2. Inspect codebase and technical context.
   Complete when the plan's current-state assumptions, boundaries, and constraints have evidence.
3. Define architecture, stack, modules, interfaces, data flow, error handling, test seams, and migrations.
   Complete when implementation direction can drive task breakdown without rewriting product requirements.
4. Allocate `DEC-*` for major hard-to-reverse decisions.
   Complete when each DEC records decision, reason, necessary alternatives, and consequences.
5. Complete Requirement Coverage and Constitution Check.
   Complete when every active `REQ-*` has implementation and verification direction, with zero unresolved conflicts.
6. Complete Developer Orientation.
   Complete when system boundaries, module responsibilities, dependency direction, key data flow, and organization rationale have been walked through and questions are resolved or recorded.
7. Run the Plan Ready Gate and ask for approval.
   Complete when open questions are resolved or accepted, Developer Orientation is complete, and Approval is recorded; otherwise status remains In Review.
