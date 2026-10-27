---
name: poszero-plan
description: "Create an implementation plan from an approved specification."
disable-model-invocation: true
---

# PosZero Plan

Turn an Approved Spec into an implementation plan and developer orientation; return an existing bounded change or Ready task scope unchanged.

## Contract

- Preconditions: Approved Constitution; a usable `change.md` or Approved Ready task, or an Approved and complete Spec.
- Inputs: active contract or task scope, Spec revision when applicable, project state, technical constraints.
- Branches: Plan, Revise Existing, External Spec, Direct Handoff, Stale/Blocked Input.
- Allowed mutations: selected feature `plan.md` and clearly linked auxiliary files when needed.
- Handoff: plan revision/status, Plan Handoff, key `DEC-*`, Developer Orientation, gaps, next skill.

## Steps

1. Resolve feature, read the active contract, and validate freshness with `references/protocol/core-protocol.md` and `references/protocol/plan-protocol.md`. Read `references/protocol/review-protocol.md` when preparing stage 4 review. For `change.md` or an Approved Ready task, return its Handoff without creating `plan.md`.
   Complete when inputs are locatable and current; otherwise return upstream.
2. Run discussion stage 1: inspect relevant code in an existing system, or map the boundary, external actors, and inherited constraints of a new system.
   Complete when assumptions have evidence, the user understands the change boundary, and explicitly confirms stage closure.
3. Run stage 2: resolve module ownership, responsibilities, and dependency direction with the user.
   Complete when major behaviors have owners, the user understands the rationale, and explicitly confirms stage closure.
4. Run stage 3: trace key data, value sources, and module interactions, including failure handling and migrations where relevant.
   Complete when necessary values have sources, key handoffs are clear, and the user explicitly confirms stage closure.
5. Run stage 4: record consequential `DEC-*` with reasons and consequences; complete Requirement Coverage, Constitution Check, verification direction, and Developer Orientation. Present the Plan revision, Review Packet, Plan Handoff, and Ready Gate.
   Complete when every active `REQ-*` has implementation and verification direction, open questions are resolved or accepted, the user understands the design, and explicitly confirms stage closure.
6. Request direct approval of the specific Plan revision separately from stage closure.
   Complete when Approval is recorded; otherwise status remains In Review.
