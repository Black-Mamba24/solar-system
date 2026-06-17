# Solar System Explorer Design Spec

Date: 2026-06-17
Status: Draft for review

## Goal

Build a high-quality interactive science education website for learning the Solar System. The first version should feel polished, beautiful, and smooth while staying practical: it should introduce major Solar System topics through a module-based home page, show approximate relative positions over time where useful, and explain selected astronomical events through guided interactive stories.

The product should support students, teachers, and astronomy-curious visitors. It should favor clarity and exploration over raw scientific completeness in the first version, while leaving a clean path for higher-precision ephemeris data and deeper simulations later.

## Non-Goals

- Do not attempt NASA-grade orbital precision in the first version.
- Do not build a full planetarium or professional astronomy planning tool.
- Do not make the first screen a marketing landing page. The first screen should be a visually rich Solar System module hub.
- Do not make every astronomical event fully simulated in version one. Use selected, well-explained guided modules first.

## Product Principles

1. Immersion first: users should immediately see a living Solar System scene and clear learning paths.
2. Explanation beside exploration: every interactive control should connect to a clear concept.
3. Progressive depth: casual users can skim; motivated learners can inspect details.
4. Performance over excess realism: visual effects must not compromise interaction.
5. Accessibility by default: keyboard navigation, readable contrast, reduced-motion support, and mobile-friendly controls are required.

## Target Users

- Middle school and high school students learning basic astronomy.
- Teachers who need a visual aid for classroom explanation.
- General users interested in Solar System motion, retrograde motion, eclipses, and comets.

## Information Architecture

The site has six primary areas:

1. **Home Module Hub**
   - First screen uses the Solar System as the background: Sun, planets, orbital paths, and subtle motion.
   - Displays learning modules as clear entry points over or alongside the space scene.
   - Initial modules:
     - Solar System overview
     - Solar eclipse
     - Lunar eclipse
     - Mercury retrograde
     - Asteroid belt
     - Jupiter and its moons
   - The module grid/list must support adding more topics later without redesigning the page.

2. **Live Orrery**
   - 3D Solar System view available from the overview module and as a supporting scene inside relevant modules.
   - Shows the Sun, eight planets, Earth's Moon, and selected small bodies when relevant.
   - Includes time controls, speed controls, labels, orbit paths, and camera presets.

3. **Body Encyclopedia**
   - Detail panel for each major body.
   - Includes physical facts, orbit facts, visual comparison, notable features, and learning notes.
   - Opens from clicking bodies in the 3D scene or from a searchable index.

4. **Topic Modules**
   - Guided explanations for Solar System overview, solar eclipse, lunar eclipse, Mercury retrograde, asteroid belt, and Jupiter's moons.
   - Each story combines scroll-driven narrative, diagrams, and interactive checkpoints.
   - Version one uses conceptual simulation and curated keyframes; later versions can use real ephemeris windows.
   - Each module owns its own scoped scene. For example, the lunar eclipse module focuses on Sun, Earth, Moon alignment rather than the whole Solar System.

5. **Learning Controls**
   - Time slider with date display.
   - Speed selector: paused, real-time concept mode, days per second, months per second.
   - View modes: realistic scale, compressed educational scale, top-down orbital view, Earth-centered view.
   - Layer toggles: labels, orbit trails, distance scale, axial tilt, moon orbit, event markers.
   - Controls appear only where they help the current module; the home page should stay visually clean.

6. **Teacher/Student Utilities**
   - Shareable scene links with selected body, date, view mode, and active lesson.
   - Short glossary for terms such as orbit, ecliptic, retrograde, umbra, penumbra, perihelion, and aphelion.
   - Lightweight quiz checkpoints in event stories as an optional second-phase feature.

## Version One Scope

Version one should include:

- A polished home page with a Solar System background and six module entrances.
- A polished 3D Solar System scene with educationally compressed distances inside the overview module.
- Clickable Sun and planets with information panels.
- Approximate orbital motion controlled by a date/time slider.
- Camera presets: full system, inner planets, Earth and Moon, outer planets.
- Six guided or semi-guided modules:
  - Solar System overview
  - Solar eclipse
  - Lunar eclipse
  - Mercury retrograde
  - Asteroid belt
  - Jupiter and its moons
- Responsive desktop and tablet layouts.
- Mobile layout with simplified controls and reduced visual density.
- Reduced-motion mode that replaces scroll-driven 3D choreography with static diagrams and simple fades.

## Later Scope

Later versions can add:

- Higher-precision ephemeris data from NASA/JPL Horizons, SPICE/WebGeocalc, or precomputed Skyfield outputs.
- Historical and future event search for eclipses and retrograde windows.
- More moons, dwarf planets, Kuiper Belt objects, comet catalog entries, and deeper asteroid belt object data.
- Additional modules such as Halley's Comet, seasons, tides, planetary rings, Mars exploration, and spacecraft missions.
- Classroom mode with guided lesson playlists.
- Interactive quizzes and teacher handouts.
- Multi-language content.

## Visual Design

The visual direction should be immersive and scientific without becoming dark, generic, or hard to read.

- Home background: deep space black with the Sun and planets arranged as an elegant Solar System composition, using subtle motion and orbit lines.
- Primary background: deep space black with subtle star fields, not heavy purple-blue gradients.
- Main accent colors: solar gold, orbital cyan, Mars rust, Earth blue-green, and neutral white/gray text.
- UI surfaces: restrained translucent panels with strong contrast and no nested card stacks.
- Typography: modern readable sans-serif. Use large display type only for true chapter titles; compact panels should use smaller, dense information hierarchy.
- Icons: use recognizable line icons for controls, not text-only buttons where an icon is clearer.
- Cards: use only for repeated encyclopedia entries or story checkpoints, with border radius at or below 8px unless the final design system requires otherwise.

## Interaction Model

The home interaction pattern is module selection:

- Users scan topic modules on top of a Solar System background.
- Hover/focus previews can gently highlight the relevant celestial bodies or region.
- Clicking a module opens a dedicated topic page with focused explanation and interaction.
- The module layout should be dense enough to expose multiple learning paths without feeling like a marketing card wall.

The module interaction pattern is direct manipulation:

- Drag to orbit the camera.
- Scroll or pinch to zoom.
- Click/tap a body to focus it and open details.
- Scrub the time slider to update orbital positions.
- Toggle layers without shifting layout.
- Use keyboard shortcuts only as enhancement, not as required functionality.

For guided stories:

- Scroll advances narrative sections.
- Key moments pin the 3D scene or diagram while explanatory text changes.
- Users can pause, replay, or jump between steps.
- Every story has a compact "what to notice" summary.

Example module behavior:

- Lunar eclipse opens a focused Sun-Earth-Moon scene.
- The first step defines the three bodies and their roles.
- Later steps show alignment, Earth's umbra and penumbra, and what observers see from Earth.
- The module avoids showing all planets unless needed for context.

## Motion Design

Motion should support understanding:

- Orbital movement is continuous and smooth, but speed changes must be gradual enough to preserve orientation.
- Camera transitions should use 400-700ms easing for large moves.
- Panel open/close transitions should stay within 200-300ms.
- Hover and press states should feel immediate, generally under 150ms.
- Scroll-driven story animation can be more cinematic, but individual transitions should not feel slow.
- `prefers-reduced-motion` must disable camera choreography, parallax, and long scrubbed animations.

## Data Model

Version one can use a local structured dataset:

- Body metadata:
  - id
  - name
  - type
  - radius
  - mass
  - average distance from Sun
  - orbital period
  - rotation period
  - axial tilt
  - short summary
  - facts
  - texture or material references

- Orbit approximation:
  - semi-major axis
  - eccentricity
  - inclination
  - orbital period
  - phase offset
  - display scale

- Story content:
  - story id
  - title
  - summary
  - steps
  - camera target
  - date or conceptual time marker
  - annotations
  - diagram overlays

- Module metadata:
  - id
  - title
  - short description
  - category
  - home visual focus
  - route
  - difficulty level
  - estimated reading time

The first version can use simplified orbital formulas or precomputed sample positions. The data layer should be isolated so later versions can swap in ephemeris-backed coordinates without rewriting UI components.

## Technical Architecture

Recommended stack:

- Next.js + React for the application shell. Use Vite only if the project intentionally becomes a lightweight single-page prototype.
- TypeScript for component and data safety.
- Three.js with React Three Fiber for 3D rendering.
- Drei for common Three.js helpers such as controls, loaders, labels, and environment utilities.
- GSAP ScrollTrigger for scroll-driven story chapters.
- Motion for UI micro-interactions.
- CSS modules, Tailwind, or a small design-token CSS layer for styling.
- Lucide React for interface icons.

Main modules:

1. **App Shell**
   - Routes, layout, responsive navigation, global theme, metadata.

2. **Home Hub**
   - Solar System background composition, module list/grid, hover/focus previews, and responsive layout.

3. **Orrery Engine**
   - Three.js scene, camera controls, lighting, body meshes, labels, orbit paths, picking, and render performance controls.

4. **Time System**
   - Current simulation date, speed, pause/play state, and derived body positions.

5. **Body Data**
   - Static metadata and orbital parameters.
   - Provides typed accessors for UI and scene components.

6. **Story Engine**
   - Loads story steps and maps them to scene annotations, camera states, and text.

7. **UI Components**
   - Panels, toolbars, sliders, segmented controls, toggles, search, story navigation, glossary, and responsive sheets.

8. **Persistence**
   - URL state for selected module, selected body, date, view mode, and active story step.

## Performance Requirements

- Maintain smooth interaction on modern laptops and tablets.
- Avoid loading all high-resolution textures at startup.
- Use compressed textures where practical.
- Cap device pixel ratio for 3D rendering on low-power devices.
- Lazy-load story modules and heavy assets.
- Degrade gracefully on mobile: fewer labels, simpler shadows, lower particle density.
- Never let dynamic labels or panels resize core controls unexpectedly.

## Accessibility Requirements

- All icon-only buttons must have accessible labels.
- Every control must be keyboard reachable.
- Focus states must be visible.
- Text contrast must meet at least WCAG AA for normal text.
- Motion-reduction mode must be functional, not only cosmetic.
- 3D-only information must also be available in text panels.
- Time slider and toggle states must be understandable to screen readers.

## Content Requirements

Tone should be accurate, concise, and student-friendly. Avoid oversimplifying in ways that become false.

Each body page should include:

- One-sentence identity.
- Key numbers with units.
- Scale comparison.
- Orbit and rotation notes.
- Three to five memorable facts.
- "Why it matters" learning note.

Each event story should include:

- What the event is.
- Why it happens.
- What geometry or timing creates it.
- What observers see from Earth.
- Common misconception correction.
- Optional replayable animation or diagram.

## Error Handling

- If WebGL is unavailable, show a static educational fallback with body index and diagrams.
- If a texture fails to load, use procedural material fallback and keep the scene usable.
- If a story asset fails, show text steps and static diagrams.
- If URL state is invalid, reset to default view without crashing.

## Testing Strategy

Initial verification:

- Unit tests for orbital position calculations and date/time state.
- Component tests for panels, controls, and story navigation.
- Browser checks for desktop, tablet, and mobile viewports.
- Visual inspection for layout overlap and text clipping.
- Performance smoke test with labels and orbit paths enabled.
- Reduced-motion test.
- WebGL fallback test if practical.

## Milestones

1. **Foundation**
   - Project setup, design tokens, layout shell, and the home module hub with a minimal working Solar System background.

2. **Overview Orrery MVP**
   - Sun and planets, approximate orbital motion, camera controls, labels, orbit paths.

3. **Body Encyclopedia**
   - Click selection, detail panel, searchable body index.

4. **Time Controls**
   - Date slider, play/pause, speed selector, view modes.

5. **Story Modules**
   - Solar System overview, solar eclipse, lunar eclipse, Mercury retrograde, asteroid belt, Jupiter and its moons.

6. **Polish and Accessibility**
   - Responsive layout, reduced motion, keyboard states, visual refinement.

7. **Verification**
   - Tests, screenshots, performance checks, bug fixes.

## Open Decisions

1. Final planet texture sourcing and licensing still need confirmation before implementation.
2. Exact lesson copy for each event story should be reviewed for educational accuracy.
3. The ephemeris provider for later high-precision versions should be selected after version one proves the interaction model.

## Recommendation

Use Next.js with React, Three.js, and React Three Fiber. Build version one as a polished Chinese-first module hub with a Solar System background, approximate orbital math where useful, hybrid realistic/educational visuals, a simplified mobile experience, and a strong story system. Keep the data layer isolated so high-precision ephemeris data and additional modules can be added later without rewriting the user interface.
