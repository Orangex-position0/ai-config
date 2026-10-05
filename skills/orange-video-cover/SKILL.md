---
name: orange-video-cover
description: "Create, critique, and adapt branded video covers and thumbnails. Use when the user asks for a new cover or thumbnail, a technical/programming cover, a cover prompt, a Figma-editable cover draft, cross-platform adaptation, thumbnail critique, or a reusable cover style system."
---

# Video Cover

Use this skill as a decision flow, not as a free-form image prompt. Every new cover must pass through these layers:

- **Brand Profile**: stable identity anchors or an explicitly marked `temporary-profile`.
- **Content Brief**: one core idea, audience, and visual metaphor.
- **Cover Type**: one content-led type selected from the existing catalog.
- **Composition Pair**: one Cover Template combined with one compatible People Reference or an explicit no-person choice.
- **Platform Adapter**: one platform, ratio, safe area, and density.
- **Style Recipe**: one visual treatment applied after the content structure is fixed.
- **Quality Gates**: pre-generation and post-generation checks.

## References

Load only what the selected branch needs:

- Cover Type definitions: [references/templates.md](references/templates.md)
- Type, template, and people compatibility: [references/template-selection.md](references/template-selection.md)
- People assets: [references/people/index.md](references/people/index.md)
- Cover visual references: [references/covers/index.md](references/covers/index.md)
- Style selection and prompt writing: [references/style-recipes.md](references/style-recipes.md)
- Platform composition: [references/platforms.md](references/platforms.md)
- Technical or programming concepts: [references/technical-covers.md](references/technical-covers.md)
- Brand onboarding or profile update: [references/onboarding.md](references/onboarding.md)
- Editable Figma draft: [references/figma-draft.md](references/figma-draft.md)

## Route

Classify the request before acting and state the selected route. Do not mix route contracts.

- `generate-cover`: run the full generation flow below.
- `critique-cover`: inspect an existing cover under Brand, Content, Platform, and Compliance; return the smallest revision plan. Do not enter the full generation flow unless requested.
- `adapt-platform`: preserve the confirmed Cover Type, Cover Template, People Reference, Style Recipe, and brand anchors; change only the Platform Adapter and affected composition decisions. This is one adaptation, not batch export.
- `figma-draft`: use the confirmed Cover Plan and [references/figma-draft.md](references/figma-draft.md) to return an editable layer specification.
- `update-profile`: use [references/onboarding.md](references/onboarding.md); propose exact Brand Profile changes and write them only after explicit confirmation.

## State model

Maintain these states internally for the current run:

- `pending`: not decided;
- `inferred`: derived from user input but not presented;
- `recommended`: presented as a recommendation;
- `confirmed`: user accepted or explicitly supplied;
- `blocked`: required information is missing or contradictory;
- `revision-needed`: a quality gate failed.

Do not generate while a required decision is `pending`, `recommended`, `blocked`, or `revision-needed`. Show the user only the current decision frontier, not hidden reasoning or the full state table.

User input has priority. When the user explicitly supplies a Cover Type, template, person, title, platform, or recipe, lock it as `confirmed` and check compatibility instead of recommending a replacement.

## Generation flow

### 1. Establish the Brand Profile

Look for `.video-cover/brand-profile.md` and use it when available. If it is missing or unusable, create an in-memory `temporary-profile`; state that it is temporary and do not write it without confirmation.

Use `assets/fixed/icon.png` as the primary personal mark on every cover. Keep it inside the safe area, visually subordinate to the title, and in a consistent default position such as the bottom-right corner. Scale it down when the composition is dense, but retain a visible mark unless the user explicitly overrides this rule.

**Completion criterion:** a usable Brand Profile or explicit `temporary-profile` exists, and the primary mark has a planned placement.

### 2. Build the Content Brief

Extract:

- topic and audience;
- the video's communication job;
- one problem, shift, mechanism, or surprise;
- one visual metaphor;
- supplied logos, screenshots, reference images, and exclusions.

Reduce competing ideas to one core concept. Ask only for missing information that can change the composition. Infer secondary details and mark the assumptions when useful.

**Completion criterion:** the brief names exactly one core concept, one audience, and one visual metaphor.

### 3. Run the pre-generation Quality Gate

Before selecting visual assets, check:

- exactly one core concept exists;
- the communication job is clear;
- a supplied title or topic is truthful;
- the platform has a value or an explicit `16:9` default;
- user constraints do not conflict.

If a conflict would change the composition, pause and ask one focused question. Otherwise continue with a stated assumption.

**Completion criterion:** no blocking pre-generation issue remains.

### 4. Select the Cover Type

Read [references/templates.md](references/templates.md) and [references/template-selection.md](references/template-selection.md). Select exactly one existing Cover Type based on what the viewer should understand first, not on a preferred color or aesthetic.

The available Cover Types are:

- `Concept Poster`
- `Problem Versus Solution`
- `Workbench`
- `Signal Focus`
- `Character Plus Concept`

Recommend one type with a short rationale. If two types are genuinely close, list no more than two alternatives. Wait for explicit user confirmation unless the user already specified the type.

**Completion criterion:** one Cover Type is `confirmed` with a content-based rationale.

### 5. Build the Composition Pair

Using the confirmed Cover Type, read [references/template-selection.md](references/template-selection.md) and [references/people/index.md](references/people/index.md).

1. Select exactly one compatible Cover Template.
2. Determine the People Reference policy: `required`, `optional`, or `forbidden`.
3. Select at most one matching people asset, or explicitly choose no person.
4. Use [references/covers/index.md](references/covers/index.md) only as a visual reference; do not copy its complete layout, text, silhouette, or logo system.

A Cover Type change invalidates the dependent template and people choice. A person choice must never force a previously unsuitable Cover Type.

**Completion criterion:** one Cover Template and one compatible person choice are `confirmed`.

### 6. Lock the title

Only after the Cover Type and Composition Pair are fixed:

- preserve a user-supplied final title;
- if only a topic exists, propose 1–3 short titles that fit the Cover Type;
- never silently rewrite a supplied final title;
- check truthfulness, length, and thumbnail readability.

Wait for explicit selection or acceptance when proposing titles.

**Completion criterion:** one title is `confirmed`.

### 7. Resolve the Platform Adapter

Choose or infer:

- platform and aspect ratio;
- output dimensions;
- safe area;
- title density and subject scale;
- platform-specific crop or emotional intensity.

When platform is missing, use a 16:9 long-form direction and state that default. Preserve the Cover Type, Cover Template, People Reference, and brand anchors while adapting the composition.

**Completion criterion:** every platform decision that affects composition has a value or explicit default.

### 8. Recommend and confirm the Style Recipe

Read [references/style-recipes.md](references/style-recipes.md). Recommend one visual treatment using the Brand Profile, confirmed Cover Type, Cover Template, People Reference, and Platform Adapter. Explain the trade-off briefly and wait for selection or acceptance.

A Style Recipe may change color, texture, typography treatment, and light direction. It must not replace the confirmed content structure or introduce a new template.

**Completion criterion:** one Style Recipe is `confirmed` and compatible with the Composition Pair.

### 9. Produce the Cover Plan

Present only the decisions that affect the composition:

- Cover Type and rationale;
- Cover Template;
- People Reference or no-person decision;
- final title;
- platform, dimensions, and safe area;
- focal subject and visual metaphor;
- title position and hierarchy;
- subject position and scale;
- background, color, light, and texture;
- fixed personal mark placement;
- supporting logo, screenshot, code, or diagram elements;
- known risks and the image-generation prompt draft.

Do not ask the user to approve every generation parameter. If a previous decision changes, roll back only its dependent decisions and re-run those steps.

**Completion criterion:** the user confirms the Cover Plan.

### 10. Confirm generation intent

A confirmed Cover Plan is not by itself permission to generate. Continue only when the user explicitly says to generate, or uses an unambiguous equivalent after all required decisions are confirmed.

**Completion criterion:** generation intent is explicit.

### 11. Generate one original image

Generate one direction and one original image by default. Do not generate multiple candidates or silently retry.

Select the text path by tool capability:

1. Reliable text rendering: generate with the confirmed title.
2. Unreliable text rendering: generate the subject/background without baked-in text and provide an overlay plan.
3. No image tool: return a complete Prompt Package with prompt, exclusions, dimensions, layer order, asset paths, and overlay instructions. Never create an empty image file.

When an image tool is available, write the result to:

```text
.video-cover/outputs/YYYY-MM-DD-topic-cover.png
```

**Completion criterion:** one image exists at the output path, or a complete executable Prompt Package has been returned.

### 12. Run the post-generation Quality Gate

Mark every check `PASS` or `FAIL` with one observable sentence of evidence.

#### Brand

- `assets/fixed/icon.png` is visible inside the safe area;
- the personal mark is subordinate but recognizable;
- content elements do not erase creator identity;
- third-party characters or logos are not used as the personal brand.

#### Content

- exactly one core concept is communicated;
- the title is truthful;
- the visual metaphor supports the Cover Type;
- decorative technical elements have a content reason.

#### Platform

- ratio and dimensions match;
- title and mark are inside the safe area;
- title is legible at thumbnail size;
- one focal path and appropriate density are present.

#### Compliance

- the cover does not reproduce a recognizable creator's complete system;
- personal portraits are user-provided or authorized;
- the image does not promise content absent from the video;
- reference images were used for principles, not copied as layouts.

If any check fails, set `revision-needed`, identify the single most serious problem, and propose the smallest revision. Wait for confirmation before one regeneration. If the revised result fails again, stop and report the remaining risk.

**Completion criterion:** all checks pass, or the user explicitly accepts the recorded risk.

## Output contracts

### New cover

Return:

- route;
- Cover Type and rationale;
- Cover Template;
- Style Recipe;
- People Reference or explicit no-person choice;
- final title;
- Platform Adapter and dimensions;
- generated image path or Prompt Package;
- post-generation Quality Gate results;
- remaining risks and overlay notes.

### Critique

Return findings under `Brand`, `Content`, `Platform`, and `Compliance`, then the smallest revision plan. Include the inferred Cover Type, Template, and People Reference only when they help explain a finding.

### Platform adaptation

Return the preserved decisions, changed Platform Adapter, revised composition, and platform-specific Quality Gate results. Do not silently create other platform variants.

### Figma draft

Return the confirmed Cover Plan as an editable layer specification following [references/figma-draft.md](references/figma-draft.md).

### Profile update

Propose exact changes first. Write `.video-cover/brand-profile.md` only after explicit confirmation. Keep one-off title, topic imagery, platform ratio, and episode decoration out of the profile.

## Positive guardrails

Keep the cover truthful, concept-led, and readable at small size. Keep brand anchors stable while varying content-specific elements. Use reference creators and `oil-cover` only for transferable principles, workflow, and quality checks; never copy their recognizable layout, characters, logo combinations, or brand assets.
