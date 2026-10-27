---
name: orange-architecture-docs
description: "Create and maintain evidence-backed project architecture and module design docs; add C4/Mermaid views when useful, and keep proposals separate."
disable-model-invocation: true
---

# Orange Architecture Docs

Maintain the **current-state** `ARCHITECTURE.md` and `docs/design/*.md`, add focused C4 views when useful, or draft an unimplemented design in `docs/proposals/`. Work in any repository; `.sdd/` is optional.

## Route the request

- If the user explicitly asks for a project architecture map, choose **Architecture** (`ARCHITECTURE.md`). If they ask for a module/component design, choose **Design** (`docs/design/<module>.md`). If they request both, handle both, with separate proposed write items.
- If invoked without a clear document type (for example, `/skill:orange-architecture-docs` alone in Pi or “整理文档”), ask **before investigating or writing**: “这次要构建哪类文档？1. 项目架构文档 `ARCHITECTURE.md`；2. 模块设计文档 `docs/design/<module>.md`；3. 两者都需要。” Wait for the user's choice. Do not infer a default type from repository contents.
- Treat C4 as a view within the selected document route. If the user explicitly requests a standalone C4 page, use the Architecture route for a system-level view or the Design route for a module-level view; resolve the system or module, audience, question, and diagram scope.
- After **Design** is selected, resolve the target module with the user if it is not already specified; present discovered candidates if necessary. For either route, determine whether the content is implemented or proposed. Proposed architecture/design goes to `docs/proposals/<topic>.md`, not the current-state path.
- Inspect evidence and propose only documents within the chosen route. If investigation uncovers a need for the other document type, recommend it as a separate option; add it to the write list only after explicit user consent.

## Workflow

1. **Scope.** Apply the route above first. Resolve one project root, selected document type, requested module/changes, any C4 view, existing document paths, ADR links, language, template level, and whether the request concerns implemented behavior or an unimplemented proposal. Read applicable local `AGENTS.md` and repository conventions. Complete when the user's document target and mode are unambiguous; otherwise ask.
2. **Investigate.** Trace relevant entry points, module owners, dependencies, state/data flow, tests, and configuration. For C4, trace evidence for the proposed elements and relationships. Inspect existing docs and optional `.sdd/` Spec, Plan, `DEC-*`, tasks, and validation evidence for leads to verify against the implementation. Trace each material current-state claim to code, tests, or configuration; corroborate historical rationale with an ADR or the decision-maker. Determine the revision and any relevant uncommitted paths for the scope actually reviewed. Surface contradictions and missing evidence. Complete when every claim and diagram relationship proposed for a current-state document has locatable support; exclude unsupported claims from the write list and report them as questions. Label assumptions in proposals as needing validation, never as implemented behavior.
3. **Select documents.** Keep the user's selected document type as the write boundary; explain any related need for another output without silently expanding scope. Present a short proposed write list: target paths, new/update, purpose, supporting evidence, proposed verification scope, language and template level, plus any unresolved decisions. For a standalone C4 page, include its location and the navigation link from `ARCHITECTURE.md` when that guide exists; treat the page and link as one deliverable in the write list. If restructuring an existing document is worthwhile, offer it as a separate, reasoned option for approval. If the change is local, already documented, or insufficiently evidenced, report no write (or request evidence) instead. Complete when the user confirms the write list and all new file paths; do not write before confirmation.
4. **Edit.** For new current-state docs, start with the selected template, replacing prompts with verified information and removing inapplicable sections; a standalone C4 page uses the project's style with title, scope, diagram, and concise explanation rather than a fixed template. For existing docs, preserve useful headings, links, and project style; make focused updates unless the user approved a specific restructuring. Use links to code entry points, detailed design docs, and ADRs; put each explanation and diagram in one primary home. For proposals, label unimplemented behavior `Proposed` and keep it separate. Add or update verification metadata only for the scope actually checked. Complete when every approved target path and navigation link has been handled, new documents have no template placeholders, existing documents retain unrelated sections, and proposed content remains separate from current-state documents.
5. **Verify and hand off.** Recheck claims against code/tests/config, paths and links, current/proposed separation, verification metadata against the inspected revision and scope, and absence of unrelated edits. For C4, meet the reference's review gate and report any unverified rendering. Report changed files, evidence gaps and conflicting sources. If a consequential long-lived decision lacks a record, recommend the ADR skill with the decision subject and evidence. Complete when the user can locate every change and understand what remains unconfirmed.

## Template selection

Use the target project's existing document language; when unclear, ask whether to use `zh-CN` or `en`. Default to `simple`; use `full` only when requested. For a new current-state document, read the matching asset below as a starting point and omit unsupported or irrelevant sections. For an existing document, preserve its useful structure; if the template would materially improve navigation or maintenance, recommend a specific restructuring and its scope, then reorganize only with explicit user approval. Read the matching asset when comparing structures, not as an instruction to regenerate. For a proposal, use the `Proposed` outline below instead of a current-state template.

| Document | Simple (default) | Full (explicit request) |
| --- | --- | --- |
| Architecture, Chinese | `assets/zh-CN/architecture-simple.md` | `assets/zh-CN/architecture-full.md` |
| Architecture, English | `assets/en/architecture-simple.md` | `assets/en/architecture-full.md` |
| Module design, Chinese | `assets/zh-CN/design-simple.md` | `assets/zh-CN/design-full.md` |
| Module design, English | `assets/en/design-simple.md` | `assets/en/design-full.md` |

A proposal follows the project convention, or defaults to `docs/proposals/<topic>.md` with an explicit `Proposed` status and proposal date, plus scope, rationale/evidence, unresolved questions, and verification path. If informed by existing code, give its reference baseline and scope; otherwise name the user-provided requirements or discussion as its basis. Incorporate it into current-state docs only after checking implementation and receiving user approval.

## C4 views

For a C4 view or Mermaid architecture diagram, read `references/c4-model.md` during investigation. Keep `ARCHITECTURE.md` a short project guide: an optional overview may orient the reader, while detailed views go in `docs/architecture/c4-<subject>.md` when needed. A module-only diagram can live in its `docs/design/<module>.md`. Follow existing project locations and styles over these defaults.

## Verification metadata

For current-state docs, put a short visible list immediately below the title: **last verified date**, **code baseline**, and **verification scope** (the sections and module boundaries actually checked). Use the selected asset's language. This is the **latest scoped verification**, not a guarantee that every section or the current HEAD is covered; name sections not rechecked after a partial update. Follow an existing project's frontmatter or document-control convention instead.

- Record a full Git commit SHA for the code examined; add a release tag only if its relationship to that revision is verified. When Git or the revision is unavailable, say why rather than inventing a hash.
- If staged, unstaged, or untracked code relevant to the verified scope was examined, list its paths (summarize very large sets) and say the SHA alone cannot reproduce that state. Ignore unrelated working-tree changes for this purpose.
- Change the date and baseline only after checking the stated scope against the code. A new commit prompts a relevance check, not an automatic stale label or automatic baseline bump; editing prose alone does not refresh verification. The document's Git history carries earlier verification records.
- On existing documents without metadata, propose adding it in the write list only when that document is actually reviewed; do not bulk backfill or assert unverified coverage. Keep concrete source links and review triggers beside their relevant explanations in the body, rather than duplicating them in the header.

## Document maintenance principles

- **Code is the source of truth:** describe implemented behavior from code, tests, and configuration; treat older Spec/Plan as leads, not proof.
- **Document why, not just what:** capture evidenced design rationale, constraints, and non-obvious mechanisms rather than restating obvious code; ask when the reason is unknown.
- **Single source of documentation:** give each piece of knowledge one primary home and link to it elsewhere.
- **Update, don't regenerate:** preserve useful existing documentation and make focused changes.
- **Preserve decision history:** leave ADR writing, status changes, and supersession to the `adr` skill (Pi command: `/skill:adr`); link existing decisions and recommend that skill for missing long-lived decisions.

## Boundaries

- `ARCHITECTURE.md` is a short project map: purpose, entry points, key module responsibilities, API boundaries, and actual architecture invariants. Put deep module internals in `docs/design/`.
- `docs/design/*.md` explains non-obvious module mechanisms, lifecycle, failure/recovery, constraints, and extension points. File and symbol paths are navigation aids, not a line-by-line code manual.
- Distinguish observed behavior, approved intent, and inference; do not invent alternatives, performance thresholds, or architecture invariants.
- An existing project's location and language conventions take precedence over defaults. No extra Guidebook or `.sdd/` artifact is created by this skill.
