# Figma Draft

Use Figma for editable cover drafts, reusable cover systems, multi-platform variants, and layouts that the user expects to refine manually. Do not make Figma the default path for quick visual exploration or final bitmap polish.

## Fit

Figma is strong for:

- Stable cover systems: typography, title position, brand marks, frames, color blocks, reusable components.
- Technical and programming covers: diagrams, UI fragments, simplified concept graphics, text hierarchy.
- A/B options: changing hooks, layouts, crops, and platform variants quickly.
- AI image workflows: placing generated bitmap visuals under editable text and brand layers.

Figma is weak for:

- Complex photo compositing.
- Precise masking, hair cutouts, skin retouching, and high-end color grading.
- Heavy lighting, texture, and cinematic polish.

When those are central, provide a `Polish Handoff` for Photoshop or manual editing instead of pretending Figma is the final tool.

## Draft Principles

Keep text editable. Do not bake title, creator ID, logo text, or platform labels into the background image.

Keep brand anchors reusable. Use stable layer groups or components for logo, ID, frame, recurring symbol, color blocks, and title treatment.

Use generated bitmap images only for the main visual, texture, or background subject. Keep composition-critical text and brand structure as editable Figma layers.

Create one frame per platform variant. Name frames by platform and ratio, such as `YouTube 16:9`, `Bilibili 16:9`, `Shorts 9:16`, or `Zhihu 16:9`.

## Layer Structure

Use clear layer names:

- `brand/id`
- `brand/logo`
- `brand/frame`
- `title/hook`
- `title/support`
- `visual/metaphor`
- `visual/generated-bitmap`
- `platform/safe-area`
- `notes/polish-handoff`

Completion criterion: the draft can be edited by changing text, moving the core visual, swapping the bitmap, and adapting the frame to another platform without rebuilding from scratch.

## Figma-Ready Spec

When Figma tools are unavailable, output a Figma-ready spec instead of claiming a file was created:

- Frame size and aspect ratio.
- Background and color tokens.
- Text layers with exact copy, font direction, size relationship, and placement.
- Brand layers and reusable components.
- Main visual layer, including image-generation prompt if a bitmap is needed.
- Safe margins and crop notes.
- Export target.

## Figma Tool Use

When connected Figma tools are available and the user asks for an actual Figma draft, follow the active Figma tool instructions for creating or editing files before calling Figma commands.

Use Figma to produce a modifiable first draft, not a final promise. Before final export, check small-size readability, platform crop, safe margins, contrast, and whether the technical concept remains clear.
