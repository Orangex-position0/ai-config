# Entry Decision

Use this procedure when a Feature has no active contract. Record the decision once in its Workflow Profile.

1. Check risk triggers: irreversible data change or migration; authentication, authorization, payment, or sensitive data; public API, SDK, or external contract change; production deployment, infrastructure, or compatibility migration. Any trigger selects `spec.md` and requires an explicit decision on the affected risk plus independent validation.
2. Check whether the change has one bounded outcome, known implementation location, acceptance, and target verification. If yes and no trigger or unresolved design choice exists, select `change.md`.
3. Otherwise select `spec.md`. Cross-module ownership, new dependencies, weak test seams, high rollback cost, or unclear architecture are evidence that design discussion is needed, not new workflow levels.
4. Record `entry`, reason, triggers, required human review, and required checks in the active contract. An existing Approved Ready task can serve as direct execution input only with sufficient scope and verification and no risk trigger; triggered work needs linked Approved Spec, Plan, and Tasks.

Reassess only when material scope or risk changes. Existing level-based documents remain under their approved contract until Init performs an explicit, linked migration; never silently reinterpret approval.
