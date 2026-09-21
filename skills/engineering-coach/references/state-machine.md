# Engineering Coach State Machine

Use this reference for practice records, verification levels, profile ability status, resume behavior, and profile updates.

## Practice status

Practice records use four statuses.

| Status | Meaning | Enters when | Normal next step |
| --- | --- | --- | --- |
| `draft` | The practice scenario and evaluation contract exist; the user has not submitted a complete worksheet. | `practice` creates a scenario. | Wait for the independent worksheet. |
| `answered` | The user has submitted a worksheet; validation is not complete. | The worksheet has all 9 sections with substantive content, or the user explicitly asks to assess the current partial answer. | Run `review`, `standard`, or `defense` validation. |
| `assessed` | Assessment is complete; the record may support profile updates. | The selected validation mode produces an assessment. | Ask whether to write profile updates. |
| `archived` | The user has skipped, stopped, or retired the practice. | The user explicitly asks to skip, stop, or archive the practice. | Exclude from default `resume`. |

Allowed transitions:

```text
draft -> answered
answered -> assessed
draft -> archived
answered -> archived
assessed -> archived
archived -> draft
archived -> answered
```

Resume an archived practice only when the user explicitly asks to reopen it. Reopen to `answered` if the record already contains a complete worksheet; otherwise reopen to `draft`.

If the user asks to assess a partial answer, allow `draft -> answered`, record the missing worksheet sections as weak evidence, and cap verification at `initially_verified`.

When reopening an archived practice, append a history note with the date, prior status, restored status, and user request that authorized reopening.

## Verification level

Verification level records how strong the practice evidence is. It is constrained by `practice_status`.

| Practice status | Allowed verification levels | Rule |
| --- | --- | --- |
| `draft` | `unverified` | A scenario without an independent answer cannot verify ability. |
| `answered` | `unverified`, `initially_verified` | A submitted answer can receive feedback, but full verification waits for assessment. |
| `assessed` | `initially_verified`, `verified`, `transfer_verified` | Only assessed records can carry verified evidence. |
| `archived` | keep previous level | Archiving changes lifecycle, not historical evidence. |

Level conditions:

- `unverified`: default for new practice, missing worksheet, or insufficient evidence.
- `initially_verified`: document/answer review, skipped defense, partial-answer assessment, or assessment evidence that supports the direction without enough constraint-change validation.
- `verified`: `assessed` record, `standard` or `defense` validation completed, target ability evidence reaches 3+, and defense shows no key hole.
- `transfer_verified`: `assessed` record, `far-transfer` scenario, target ability evidence reaches 3+, and defense shows no key hole.

`same-domain` and `near-transfer` scenarios can reach `verified`, not `transfer_verified`.

## Profile ability status

Profile status separates exposure from ability evidence.

| Status | Meaning | Enters when |
| --- | --- | --- |
| `exposed` | The user has reviewed or encountered the ability, but has not shown independent performance. | A confirmed `review` includes this ability and the user approves writing it, or a practice is created for this ability. |
| `practicing` | The user has attempted practice for the ability. | A practice reaches `answered` for this ability. |
| `provisional` | The user has one successful assessed performance. | One `assessed` practice reaches 3+ on the target ability without a key hole. |
| `validated` | The user has repeated performance across scenarios. | Two different assessed scenarios reach 3+ on the target ability without key holes. |
| `transferred` | The user has far-transfer evidence. | One `far-transfer` assessed scenario reaches 3+ on the target ability without a key hole. |

`review` can write only `exposed`. It records learning contact, not mastery. `practicing` and above require practice-record evidence; `provisional`, `validated`, and `transferred` require assessed practice-record evidence.

If the user only discusses a design without a confirmed review scope, leave the profile unchanged.

## Score-to-profile mapping

Assessments use six score dimensions for readability. The profile tracks nine longer-term abilities. Update profile status through this mapping.

| Profile ability | Primary score dimension | Supporting evidence |
| --- | --- | --- |
| `problem_modeling` | `problem_modeling` | goals, non-goals, actors, constraints |
| `design_order` | `decision_order` | design sequence, dependency order, assumption order |
| `boundary_identification` | `boundary_design` | ownership, responsibility, forbidden knowledge |
| `interfaces_dependencies` | `boundary_design` | API shape, dependency direction, error semantics |
| `data_state` | `boundary_design`, `risk_coverage` | state ownership, consistency, transitions |
| `failure_modes` | `risk_coverage` | failure impact, fallback, recovery |
| `evolution_change` | `tradeoff`, `validation` | invalidation conditions, future-change strategy |
| `validation_strategy` | `validation` | tests, observability, rollout, rollback |
| `tradeoff_articulation` | `tradeoff` | alternatives, costs, fit conditions |

Profile update rules:

- Each practice selects 1-2 target profile abilities before the user answers.
- Upgrade only target abilities.
- For non-target abilities, append an evidence note only when it is useful for future coaching.
- A target ability can upgrade when its primary score dimension reaches 3+ and the supporting evidence has no key hole.
- For abilities mapped to two primary dimensions, both dimensions must be at least 2 and the named supporting evidence must be present.
- `evolution_change` requires invalidation conditions or a concrete future-change strategy; generic extensibility claims are weak evidence.

## Resume, archive, and reopen

Resume selection order:

1. explicit practice path or topic from the user;
2. latest `answered` practice;
3. latest `draft` practice;
4. if no unfinished practice exists, offer to create a practice or show `status`.

Default `resume` excludes `assessed` and `archived` practices. If the user asks to write, inspect, or update the profile block of an assessed practice, open that record without changing `practice_status`.

Archiving changes lifecycle, not evidence. Keep the existing `verification_level` and evidence links. Archived assessed practices can still support historical profile evidence, but they do not appear in default `resume`.

Reopen archived practices only on explicit user request. Restore to `answered` when the worksheet is complete; otherwise restore to `draft`.

If the user sends a short design idea without explicitly asking for assessment, treat it as draft input and identify missing worksheet sections before changing status.
