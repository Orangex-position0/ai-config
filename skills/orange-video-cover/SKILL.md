---
name: orange-video-cover
description: "Create, critique, and adapt branded video covers and thumbnails. Use when the user asks for a new cover or thumbnail, a technical/programming cover, a cover prompt, a Figma-editable cover draft, cross-platform adaptation, thumbnail critique, or a reusable cover style system."
---

# Video Cover

Run cover work through four layers:

- **Brand Profile**: stable identity anchors.
- **Content Brief**: one core idea, hook, and visual metaphor for this video.
- **Platform Adapter**: one target composition, ratio, safe area, and density.
- **Quality Gate**: observable checks before delivery.

Load only the reference needed by the selected branch:

- Technical or programming concept: [references/technical-covers.md](references/technical-covers.md)
- Platform-specific composition: [references/platforms.md](references/platforms.md)
- Style selection or prompt writing: [references/style-recipes.md](references/style-recipes.md)
- Confirmed composition skeletons and visual previews: `assets/templates/`
- Brand onboarding or profile update: [references/onboarding.md](references/onboarding.md)
- Editable Figma draft: [references/figma-draft.md](references/figma-draft.md)

## Route

Classify the request before acting:

- `generate-cover`: create one new cover image. Follow the generation loop below.
- `critique-cover`: review an existing cover under Brand, Content, Platform, and Compliance layers; return the smallest revision plan.
- `adapt-platform`: adapt an existing cover direction to one other platform; preserve brand anchors and core metaphor while changing crop, hierarchy, subject scale, and density. This is not batch export.
- `figma-draft`: read `references/figma-draft.md`, then create an editable draft or Figma-ready layer specification.
- `update-profile`: read `references/onboarding.md`; propose profile changes and write `.video-cover/brand-profile.md` only after confirmation.

Completion criterion: state the selected route and do not mix its output contract with another route.

## Generation loop

### 1. Establish the profile

Look for `.video-cover/brand-profile.md`, then use brand context in the current request. If neither is usable, declare a `temporary-profile` and continue; tell the user that it is temporary and offer to create a profile later. Read onboarding only when profile creation or update is needed.

Never write a temporary preference to the profile without confirmation.

Completion criterion: a usable Brand Profile or an explicitly declared temporary profile exists for this run.

### 2. Build the Content Brief

Extract:

- topic and audience;
- one problem, shift, mechanism, or surprise;
- one visual metaphor;
- available logos, screenshots, reference images, and exclusions.

If the request contains multiple possible core ideas, ask only the question needed to select one. Keep technical code, UI, and diagrams as small supporting evidence rather than the focal subject.

Completion criterion: the brief names exactly one core concept and one visual metaphor.

### 3. Lock the title

Use this branch:

- User supplied a final title: preserve it; check truthfulness, length, and readability, then ask for confirmation.
- User supplied only a topic: propose 1–3 short title candidates and wait for selection.
- User asked for title creation: propose 1–3 candidates and wait for selection.

Do not silently rewrite a user-supplied final title.

Completion criterion: one final title is confirmed or the user explicitly accepts the supplied title.

### 4. Resolve platform and missing decisions

Use the following order for blocking decisions:

1. one core concept;
2. final title;
3. Brand Profile or temporary profile;
4. target platform or ratio;
5. Style Recipe;
6. composition proposal.

When platform is missing, use a 16:9 long-form direction. A Platform Adapter affects the composition of this one original image; it does not produce multi-platform variants.

Completion criterion: every decision that changes the composition has a value or an explicit default.

### 5. Recommend and confirm a Style Recipe

Read [references/style-recipes.md](references/style-recipes.md). When the selected recipe has a matching file in `assets/templates/`, use its skeleton as a composition constraint and its preview as a visual reference. Recommend one recipe using the Brand Profile, Content Brief, and Platform Adapter. Explain the trade-off in one or two sentences.

A recommendation is not a selection. Wait for the user to explicitly choose or change the recipe.

Completion criterion: one Style Recipe is explicitly selected.

### 6. Propose the composition

Before generating, show a compact proposal containing:

- canvas ratio, dimensions, and safe area;
- focal subject and visual metaphor;
- final title, position, hierarchy, and approximate word count;
- background, color, light, and texture direction;
- retained brand anchors;
- technical logo, screenshot, or supporting elements;
- image-generation prompt draft and known risks.

Wait for confirmation. Apply requested changes before generation.

Completion criterion: the user confirms the composition proposal.

### 7. Generate one original image

Generate one direction and one original image by default. Generate multiple directions only when the user explicitly asks.

Select the text path by tool capability:

1. Reliable text rendering: generate the image with the final title.
2. Unreliable text rendering: generate the subject/background without baked-in text and provide an overlay plan.
3. No image tool: return the final prompt, negative prompt or exclusions, dimensions, layer plan, and overlay instructions. Do not create an empty image file.

When an image tool is available, write the result to:

```text
.video-cover/outputs/YYYY-MM-DD-topic-cover.png
```

Create the directory only when needed. Sanitize `topic` for the filename.

Completion criterion: an image exists at the output path, or a complete executable generation package has been returned.

### 8. Run the Quality Gate

Mark every check `PASS` or `FAIL` and include one observable sentence of evidence. Any `FAIL` enters `revision-needed`: explain the smallest change, wait for confirmation, then regenerate.

#### Brand Gate

- At least one stable brand anchor is visible and matches the Brand Profile.
- Content elements do not erase the creator identity.
- A third-party character or logo is not the personal brand identity.

#### Content Gate

- The cover communicates exactly one core concept.
- The title is truthful to the video.
- The visual metaphor supports that concept.
- Every prominent decorative technology element has a content reason.

#### Platform Gate

- Ratio and dimensions match the target context.
- Title and logo are inside the safe area.
- The title remains fully legible at thumbnail preview size.
- There is one dominant focal point.
- Information density matches the platform context.

#### Compliance Gate

- The result does not reproduce a recognizable creator's complete cover system.
- Personal portraits are user-provided or authorized.
- The image does not promise content the video does not contain.
- Third-party logos, characters, and screenshots serve a relevant content purpose.

Completion criterion: every check is `PASS`, or the user explicitly accepts the recorded risks.

## Output contracts

### New cover

Return:

- final title;
- selected Style Recipe;
- visual metaphor and focal subject;
- retained Brand anchors;
- Platform Adapter and dimensions;
- generated image path, or prompt package when no image tool is available;
- four Quality Gate results with `PASS`/`FAIL` evidence;
- overlay or polish notes when text rendering or compositing needs manual work.

### Critique

Return findings under `Brand`, `Content`, `Platform`, and `Compliance`, followed by the smallest actionable revision plan.

### Profile update

Propose the exact changes first. Write `.video-cover/brand-profile.md` only after explicit confirmation. Keep one-off title, topic imagery, platform ratio, and episode decoration out of the profile.

## Positive guardrails

Keep the cover truthful, concept-led, and readable at small size. Keep brand anchors stable while varying content-specific elements. Use reference creators and `oil-cover` only for transferable principles, workflow, and quality checks; never copy their recognizable layout, characters, logo combinations, or brand assets.
