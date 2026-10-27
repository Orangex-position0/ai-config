---
name: poszero-specify
description: "Create or revise an approvable feature specification."
disable-model-invocation: true
---

# PosZero Specify

Create or revise the active `change.md` or `spec.md` under `.sdd/<feature-slug>/`.

## Contract

- Preconditions: Approved Constitution and a user problem or requirement input.
- Inputs: Constitution, user goals, existing or external requirement material.
- Branches: Bounded Change, New Spec, Revise Existing, Import External Input, Blocked Upstream.
- Allowed mutations: the selected feature `change.md` or `spec.md`; a new feature directory only after slug confirmation.
- Handoff: entry decision, revision/status, Review Packet, unresolved questions, next skill.

## Steps

1. Resolve project and feature using `references/protocol/core-protocol.md` and `references/protocol/workflow-profile.md`. Read `references/protocol/risk-classification.md` when no entry decision exists, `references/protocol/specify-protocol.md` for discussion, `references/spec-authoring.md` when drafting a Spec, and `references/protocol/review-protocol.md` when preparing review.
   Complete when root, feature, and requirement input are unique and valid.
2. Select or read the entry decision and required risk gates.
   Complete when the active contract records entry, reason, risk triggers, required review, and required checks; a risk trigger selects `spec.md`.
3. Check for a conflicting active contract. For `change.md`, cover applicable discussion stages, combining straightforward stages only while naming their boundaries and waiting for explicit user confirmation; then record Goal, Non-Goals, Scope, Acceptance Criteria, Verification, Result, and Handoff.
   Complete when one active contract remains and the bounded change can proceed to Implement without unresolved design choices.
4. For `spec.md`, run discussion stages 1–3 in `references/protocol/specify-protocol.md`. Name each stage and its boundary; summarize settled, unresolved, and deferred items before waiting for the user's explicit confirmation to end it. Record requirements, edge cases, inherited constraints, assumptions, and unresolved decisions.
   Complete when the product path, scope, business meaning, and observable behavior are clear without prescribing implementation design.
5. Run stage 4: derive verifiable acceptance, link requirements to relevant scenarios, and present the document revision, Review Packet, and Readiness Check. Leave batch boundaries, slice order, and architecture to Plan.
   Complete when the handoff identifies contract scope and the user explicitly confirms stage closure.
6. Request direct approval of the specific Spec revision separately from stage closure.
   Complete when decision-relevant items are resolved or explicitly accepted and Approval is recorded; otherwise status remains In Review.

## Gate

- Keep the SDD lifecycle intact.
- Use the Spec Readiness Check for review.
- Move implementation detail to Plan unless needed to make the observable contract testable.
- Keep one Spec per feature unless a separate contract manages a real coordination boundary.
