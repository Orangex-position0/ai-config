---
name: video-cover
description: "Create and critique video covers and thumbnails through a three-layer cover workflow: brand profile, content metaphor, and platform composition. Use when the user asks for a video cover, thumbnail, YouTube thumbnail, Bilibili cover, Shorts/Reels/TikTok cover, technical video cover, programming tutorial cover, Figma-editable cover draft, cross-platform cover adaptation, thumbnail critique, or a reusable cover style system."
---

# Video Cover

Use the three-layer cover frame every run:

1. Brand layer: preserve stable visual anchors so repeated covers become recognizable.
2. Content layer: express one core idea through a visual metaphor and short hook.
3. Platform layer: adapt composition, density, and emotional intensity to the target platform.

## State Machine

Classify the request before producing cover work:

- `uninitialized`: no usable brand profile is available. Read [references/onboarding.md](references/onboarding.md), then create or update `.video-cover/brand-profile.md` in the current workspace when the user agrees.
- `profile-ready`: a brand profile exists or the user provided enough brand context in the prompt.
- `generate-cover`: the user wants a new cover for one video.
- `figma-draft`: the user wants an editable Figma draft, layout file, or cover system that can be manually refined.
- `adapt-platform`: the user wants an existing cover, direction, or prompt adapted across platforms.
- `critique-cover`: the user provides an existing cover or concept and asks for review.
- `update-profile`: the user wants to change recurring style, audience, colors, typography, logo, or layout anchors.

Completion criterion: the selected state is explicit, and the next action follows that state.

## Profile

Look for a brand profile in this order:

1. `.video-cover/brand-profile.md` in the current workspace.
2. Brand context supplied in the current conversation.

If no profile exists, do onboarding before final cover generation unless the user explicitly asks for a one-off cover. For one-off work, state the assumed temporary brand direction.

Use the profile as user data, not skill data. Do not store personal brand profiles inside this skill directory.

## Workflow

1. Determine the target platform, format, audience, and video topic. If the platform is missing, default to a 16:9 long-form video cover direction.
2. Preserve 60-70 percent stable brand elements from the profile, and vary 30-40 percent content-specific elements.
3. Extract one core concept from the video. Reject attempts to show the whole script, a full architecture diagram, or large code blocks on the cover.
4. Choose one visual metaphor for the core concept. For technical and programming content, read [references/technical-covers.md](references/technical-covers.md).
5. Choose a platform composition. Read [references/platforms.md](references/platforms.md) when a platform is named or cross-platform adaptation is requested.
6. Select a cover pattern. Read [references/templates.md](references/templates.md) when producing options, adapting a concept, or generating an image prompt.
7. Produce 2-4 distinct directions unless the user asks for a single final cover.
8. Choose the output path:
   - `Fast Concept`: return cover directions and image-generation prompts.
   - `Figma Draft`: read [references/figma-draft.md](references/figma-draft.md), then create an editable draft or Figma-ready spec.
   - `Raster Final`: call the available image generation tool when the user wants a final bitmap cover.
   - `Polish Handoff`: give Photoshop or manual editing notes when the cover needs advanced compositing, masking, retouching, lighting, or texture polish.

Completion criterion: every final direction names the brand anchors, content metaphor, platform composition, cover text, and selected output path.

## Output

For new covers, return:

- `Direction`: short name for the option.
- `Hook`: cover text, kept brief.
- `Visual`: the main metaphor and subject.
- `Brand anchors`: fixed elements retained from the profile.
- `Platform fit`: composition and density choices.
- `Prompt`: image-generation prompt when direct image generation is needed.
- `Editable draft`: Figma frame or Figma-ready layer spec when manual refinement is expected.
- `Polish notes`: Photoshop or manual editing handoff when final refinement is outside Figma's strengths.

For critique, return findings under `Brand layer`, `Content layer`, and `Platform layer`, then give the smallest actionable revision plan.

## Guardrails

Keep the cover truthful to the video. Do not create clickbait that contradicts the content.

Keep technical covers concept-led. Do not use dense code, full diagrams, tiny labels, unrelated futuristic decoration, or characters that overpower the technical idea.

Keep the brand distinct. Do not copy another creator's recognizable cover system, and do not make third-party anime characters or copyrighted mascots the core identity.
