# Style Recipes

Style Recipes are composition strategies. Blend one recipe with the user's `.video-cover/brand-profile.md`; never treat a recipe as a fixed creator template.

## Selection rule

Recommend one recipe from the table, explain the fit, and wait for explicit user selection before proposing the composition. When a recipe has a matching file in `../assets/templates/`, use the SVG skeleton to constrain placement and the preview SVG to communicate visual direction. Replace every placeholder before delivery.

| Recipe | Structure | Best fit |
| --- | --- | --- |
| `Editorial Poster` | Magazine/editorial hierarchy, series label, issue marker, collage or tactile texture | Series content, opinion pieces, retro or handmade identity |
| `Dark Technical Split` | Dark field, separated title and subject zones, technical mark or simplified diagram | Tutorials, tools, architecture, programming |
| `Human-Centered Tech` | Person or character as entry point, sparse technical evidence around it | Experience, opinion, personality-led video |
| `Minimal Concept` | Low density, one metaphor, strong title hierarchy, generous negative space | Abstract concepts, methods, high-signal topics |

## Recipe details

### Editorial Poster

- Use one strong headline and a secondary series/issue marker.
- Treat texture, collage, stickers, or small type as supporting rhythm.
- Keep the main metaphor and title readable before decorative editorial detail.
- Prefer when the Brand Profile already has a publication, zine, or series identity.

### Dark Technical Split

- Use `../assets/templates/dark-technical-split.svg` as the low-fidelity layout skeleton.
- Use `../assets/templates/dark-technical-split-preview.svg` as the original Orange visual reference.
- Reserve a clear title zone and a separate visual-subject zone.
- Use one technical logo, simplified diagram, or symbolic mechanism.
- Prefer high-contrast typography and restrained decoration.
- Keep the subject from competing with the title block.

### Human-Centered Tech

- Make the person or character the visual entry point only when personality supports the content.
- Add one technical proof point: logo, screenshot fragment, object, or metaphor.
- Keep the title and technical meaning visible at thumbnail size.
- Never let an unlicensed character become the creator's recurring identity.

### Minimal Concept

- Use one object, transformation, or visual metaphor as the focal subject.
- Keep the title short and the background quiet.
- Use color or light for hierarchy instead of extra labels.
- Prefer when the topic can be understood through a single symbolic image.

## Prompt shape

When a generation prompt is needed, include these fields in order:

1. target platform and aspect ratio;
2. stable brand anchors;
3. final hook text or an explicit no-text instruction;
4. main subject and visual metaphor;
5. composition and hierarchy;
6. typography direction;
7. color, light, and texture;
8. safe-area and thumbnail-readability requirements;
9. exclusions such as dense code, tiny labels, full diagrams, unrelated decoration, or copied creator style.

The prompt must preserve the selected recipe and the confirmed composition. Do not introduce a new visual direction during generation.
