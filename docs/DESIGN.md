# Handoff: CAGED Practice

A single-page guitar-practice tool that visualizes the five CAGED major-scale shapes across the full neck, in any key. The five shape cards on top act as both a reference and a control surface — solo one, dim others, transpose the entire system to a new key with one click.

## About the Design Files

The file in this bundle (`CAGED Practice.html`) is a **design reference** built as a working HTML/React prototype — it is not the production artifact. Your job is to **recreate this design in your target codebase's existing environment** (React, Vue, SwiftUI, native, etc.), using whatever component library, styling conventions, and state-management patterns are already established there. If no environment exists yet, pick the framework that best fits the project and implement the design there.

The HTML reference is fully interactive — open it in a browser and click around to verify behavior before/while you build.

## Fidelity

**High-fidelity.** All colors, typography, spacing, fretboard geometry, and interactions are intended as final. Implement pixel-close to the reference. The only intentional flexibility is wood-grain / inlay texture on the fretboard — the prototype uses flat fills; if your platform has access to real wood textures, you may use them as long as contrast for the colored dots is preserved.

---

## Screens / Views

There is a single screen, vertically stacked into six bands within a centered `max-width: 1480px` column with `40px 32px 80px` padding.

### 1. App Header

A flex row, space-between, baseline-aligned, with a 28px bottom padding and a 1px hairline divider below it (`oklch(0.86 0.015 75)`). Below 1100px the row stacks vertically (brand on top, key display below), both left-aligned.

- **Brand block** (left): a 36×36 squared-off SVG mark (black rounded square with five horizontal "strings" in white and two red dots representing notes) paired with:
  - **Title** "CAGED Practice" — DM Serif Display 400, 36px, line-height 1, letter-spacing −0.01em
  - **Subtitle** "Five shapes of the major scale across the neck." — Plus Jakarta Sans 14px, color `oklch(0.40 0.01 70)`
- **Key Display card** (right): a small surface card showing the current key.
  - Container: white surface, 1px hairline border, 12px radius, padding `10px 22px 14px`
  - Three baseline-aligned spans: label `KEY` (11px, weight 600, uppercase, tracking 0.12em, muted), the note letter ("C") in DM Serif Display 44px, and the word "major" in DM Serif Display italic 18px (muted ink).

### 2. Key Section

A flex row (`align-items: flex-end`, 14px gap, wraps), 28px bottom margin. Contains the key group and the sharps toggle aligned to the bottom of the key group.

- **Key group**:
  - Section label "CHOOSE A KEY" — 11px, weight 700, uppercase, tracking 0.14em, muted, 10px below
  - 12 square buttons in a `flex-wrap` row (`key-row`), 6px gap. Each: 50×50, 12px radius, 1px line border, white surface, DM Serif Display 22px, line-height 1. Hover lifts 1px and darkens the border. Active state inverts: ink background, surface-white text.
  - Buttons render the 12 chromatic pitches (C, C#…B, or C, Db…B when flats is on).
- **Sharps/Flats toggle**: flush to the bottom of the key row. 1px line border, 10px radius, padding `9px 14px`, 13px font weight 600. Default: ink-soft text. Active (flats on): ink fill / white text. Label switches between "♯ Sharps" and "♭ Flats".

### 3. Shapes Row

A 5-column CSS grid (`grid-template-columns: repeat(5, 1fr)`, gap 16px) of one card per CAGED shape: C, A, G, E, D in that order. 36px bottom margin.

Each card (`.shape-card`):
- White surface, 1px hairline border, 14px radius, padding `16px 14px 14px`
- Flex column with 10px gap
- States:
  - **Default**: 1px line border, no shadow
  - **Solo**: `border-color: transparent`, replaced by a 2px-offset box-shadow ring in the shape's accent color, plus a soft 0–8–24 −10 drop shadow. Set `--shape-accent` on the card so descendants pick it up.
  - **Dim** (shape is hidden on the fretboard but not soloed): `opacity: 0.45`, rising to `0.85` on hover.

Card contents top-to-bottom:
1. **Shape position** (`.shape-position`): right-aligned italic fret label — DM Serif Display 15px italic, color = shape accent. Reads either `Open` (when shape starts at the open string) or `Fret N`.
2. **Shape diagram** (the `ShapeBox` SVG, see Components below).
3. **Range label**: centered JetBrains Mono 11px, weight 600, uppercase tracking 0.04em, muted. Reads `Frets X–Y`.
4. **Controls row** (`.shape-controls`): justify-between flex row.
   - **Solo pill** (left): pill-shaped button (`border-radius: 999px`, padding `5px 12px`, 12px font, weight 600). Default: 1px line border, ink-soft text. Active (`.is-on`): fills with the shape's accent color, white text. Text reads "Solo" / "Soloing".
   - **Show checkbox** (right): native checkbox + label "show" (12px ink-soft), `accent-color: var(--ink)`.

### 4. Fretboard Toolbar

A flex row (`fretboard-toolbar`), 8px gap, wraps, 16px bottom margin. Sits between the shapes row and the fretboard card.

- **Label segmented control**: a 1px-bordered, 10px-radius white container with 3px internal padding. Contains a "SHOW" label (11px, weight 700, uppercase, tracking 0.12em, muted) and three buttons "Off", "Notes", "Degrees". Active button: ink background, white text, 7px inner radius.
- **Roots only** toggle button: 1px line border, 10px radius, padding `9px 14px`, 13px font weight 600. Active = ink fill / white text.
- **Clear solo** (only shown when a solo is active): same shell but transparent background, accent-red border and text (`oklch(0.58 0.20 28)`).

### 5. Fretboard Section

A single white surface card, 1px hairline border, 16px radius, padding `20px 12px 16px`, 24px bottom margin.

- **Fretboard scroll container**: horizontally scrollable on wide viewports; thin 8px scrollbar styled with a `var(--line)` thumb and 4px radius. On narrow viewports (< 700px) switches to vertical scrolling (`overflow-y: auto`, `max-height: 78vh`) and the fretboard renders in vertical orientation (see Components → Fretboard → Vertical mode).
- **The fretboard** (see Components → Fretboard).
- **Legend row**: flex row, 32px gap, wraps, padding `16px 18px 4px`.
  - **Notes group**: title "NOTES" + three legend items:
    - Root: red dot (`oklch(0.58 0.20 28)`) with a 2px black ring, label "Root **C**" where the letter is bolded and updates with key.
    - Chord tone: red dot, label "Chord tone".
    - Scale note: black dot, label "Scale note".
  - **Shapes group**: title "SHAPES" + five clickable shape legend chips. Each chip is a pill (1px border, 999px radius, padding `4px 10px`) showing a colored dot + the shape letter in DM Serif Display 16px. Clicking toggles the solo for that shape; non-visible shapes get `opacity: 0.35`.

### 6. Footer

Centered muted text 13px: "Tap a shape to solo it on the fretboard. Tap a key to transpose all five shapes." 16px top margin.

### Tweaks Panel (not shipped)

The reference prototype embeds a small "Tweaks" floating panel for adjusting display options during iteration. **This panel is a prototyping affordance only — do not ship it.** The same controls exist inline in the Fretboard Toolbar.

---

## Components

### ShapeBox (CAGED shape diagram)

A self-contained SVG diagram of one CAGED shape as a 5-fret × 6-string grid, drawn as a chord box (nut on top, frets going down, strings left to right).

Geometry (default size 188 × 290):
- 14px horizontal padding, 18px top padding, 56px bottom padding to leave room for the big letter
- 5 columns (frets) × 5 rows (fret rows), with dot radius = `min(cellW, cellH) * 0.32`
- A thin colored accent ribbon (`6px` tall, 2px radius, shape's accent color) sits 4px from the top of the SVG
- A thick black "nut" bar (8px tall) sits directly above the box
- Box outline is 3px black; horizontal fret lines are 3px black; 6 vertical strings are 2px black
- Dots:
  - `R` cells = filled with `var(--accent-red)` = `oklch(0.58 0.20 28)`
  - `B` cells = filled with `#111`
  - `.` cells = no dot
- Bottom of the box, centered: the shape's letter (C/A/G/E/D) in DM Serif Display 700 at 40px.

The shape grids are encoded as 5 strings of 6 chars each. Strings indexed 0..5 = low-E to high-E. Row 0 = top of the diagram (closest to the nut for the shape's home key). The grids are listed in the [Design Tokens → Shape data](#shape-data) section below.

### Fretboard (long neck)

The fretboard renders in one of two orientations depending on viewport width. The board theme is hardcoded to **Rosewood**.

#### Horizontal mode (viewport ≥ 700px)

An SVG fretboard 18 fret positions wide (positions 0–17, where 0 is the nut). Geometry:

- Padding: left 56, right 24, top 28, bottom 36
- Fret cell width: 68px
- String row height: 34px
- Inner width: `(NUM_FRETS + 1) * 68` = `18 * 68` = `1224px`
- Inner height: `5 * 34` = `170px`
- Total: ~1304 × 234

Layout details:
- **Strings**: drawn top-to-bottom = high-e, B, G, D, A, low-E. Lower-pitched strings are slightly thicker (`1 + (5 − stringIndex) × 0.4` px stroke, where stringIndex 0 = low-E).
- **Nut**: 6px wide vertical bar at the left edge in the theme's `nut` color.
- **Fret wires**: 1.5px vertical lines in the theme's `fretWire` color, at every fret position 1 to NUM_FRETS + 1.
- **Inlay markers** (centered between fret wires): single dots at frets 3, 5, 7, 9, 15; double dots (at 32% and 68% of inner height) at fret 12. Inlay color, 0.35 opacity.
- **String labels** on the left: JetBrains Mono 11px, weight 600, color `#666`.
- **Fret numbers** below the board: JetBrains Mono 11px. Marker frets weight 700 / `#111`; others weight 500 / `#888`.
- **Shape brackets**: above the board, one per visible shape. A 3px round-capped line spanning the shape's fret range in the shape's accent color, with the shape letter in DM Serif Display 700 14px centered above it.

#### Vertical mode (viewport < 700px)

The nut is at the top; frets go downward; strings are columns (string 0 = low-E on the left, string 5 = high-e on the right). SVG is rendered at its natural pixel size so the container scrolls vertically.

Geometry:
- Padding: left 32, right 52, top 38, bottom 14
- String column width: 38px — inner width: `6 × 38` = `228px`
- Fret row height: 48px — inner height: `18 × 48` = `864px`
- Total: 312 × 916

Layout differences from horizontal:
- **Nut**: 6px tall horizontal bar at the top edge.
- **Fret wires**: horizontal lines.
- **String labels**: above the board (before the nut), centered over each column.
- **Fret numbers**: to the left of the board, centered beside each fret row.
- **Inlay markers**: single dots centered horizontally; double dots at 32% and 68% of inner width.
- **Shape brackets**: rendered on the right side — a vertical 3px line with the shape letter to its right, baseline-centered on the bracket.

#### Board theme

The board theme is locked to **Rosewood**: board `#3b2418`, fretWire `#9a8a73`, inlay `#d9cdb4`, string `#cfc8b7`, nut `#e8e2d2`. The Ebony and Maple themes remain defined in code but are not exposed in the UI.

#### Dot rendering on the fretboard

For each shape note placed on the neck:
- **Root** (the actual root pitch class of the key, inside an `R` cell): radius 14, filled with the shape's accent color, **plus a 2px black ring at radius 16**. Acts as the visual anchor.
- **Chord tone** (`R` cell that is not the root): radius 12, filled with the shape's accent color, no ring.
- **Scale note** (`B` cell): radius 11, filled with the shape's accent color, no ring.

If two shapes overlap on the same `(string, fret)`, draw the dot as **pie slices** — one wedge per overlapping shape — using each shape's accent color, with the highest-priority kind (root > chord > scale) determining the dot's size and whether it gets a ring.

#### Dot labels

When labels are enabled, render the text **inside the dot**, centered:
- `notes` mode: note name (C, C#, D, …) using sharps or flats per the user's setting
- `degrees` mode: scale degree (1, 2, 3, 4, 5, 6, 7) relative to the current key
- `off` mode: no label

Label typography: JetBrains Mono, weight 700, white. Font size 11 for roots, 10 for everything else.

---

## Interactions & Behavior

### Solo / show shape

- **Click a shape card's image, "Solo" pill, or the shape's legend chip**: toggles solo for that shape. When soloed, only that shape's dots and bracket render on the fretboard, regardless of the "show" checkboxes. The shape card gets the colored ring; the legend chip stays full opacity; all other legend chips dim to 0.35.
- **Click "show" checkbox**: toggles whether the shape appears on the fretboard when no shape is soloed. The card dims to 0.45 (0.85 hover) when unchecked.
- **Click "Clear solo"** (toggle row): exits solo mode.

### Key change

- **Click a key button**: sets the current key pitch class (0..11 where 0 = C). The header's key display updates, all five shape cards recompute their "Fret N" position, range labels update, and every dot on the long fretboard re-places using the algorithm in [State Management → placeShape](#shape-placement-algorithm).

### Label / accidentals toggles

- **"Off / Notes / Degrees"** segmented control: sets which text appears inside every dot.
- **"Roots only"**: when on, only root dots render on the fretboard; chord-tones and scale-notes are hidden.
- **"♯ Sharps / ♭ Flats"**: switches the note-name spelling for the key buttons, header note, root legend label, and dot labels.

### Hover / focus states

- Key buttons: hover lifts 1px and darkens border to ink.
- Pills/toggles: hover darkens border + text to ink.
- Shape legend chips: hover darkens border to ink.
- Dimmed shape cards: hover raises opacity from 0.45 to 0.85.
- All transitions: ~0.15s.

### Animations / transitions

Use 0.15s ease on border-color, transform (1px translateY lift for buttons), and opacity changes. There are no scroll-driven or entrance animations.

### Responsive behavior

Three breakpoints govern layout changes:

**≤ 1100px**
- Header stacks vertically (brand on top, key display below), both left-aligned.

**≤ 1099px**
- Shapes grid switches to 3 columns, center-aligned.

**≤ 699px**
- Shapes grid switches to 1 column, full-width.
- Key row (`key-row`) switches to a 6-column grid so the 12 key buttons form two compact rows.
- Fretboard toolbar stacks vertically; each control stretches to full width.
- Fretboard switches to vertical orientation (nut at top, vertically scrollable, 78vh max-height).

The fretboard is always in a scroll container — the neck never compresses to fit the viewport.

---

## State Management

State variables (at the App level):

| Variable | Type | Default | Notes |
|---|---|---|---|
| `keyPc` | number `0..11` | `0` (C) | Pitch class of the current key root |
| `activeShapes` | string[] | `['C','A','G','E','D']` | Names of shapes whose "show" checkbox is on |
| `soloShape` | string \| null | `null` | Name of the currently soloed shape, if any |
| `labelMode` | `'off' \| 'notes' \| 'degrees'` | `'notes'` | Dot label mode |
| `showRootsOnly` | boolean | `false` | Hide non-root dots on the fretboard |
| `useFlats` | boolean | `false` | Spell accidentals as flats instead of sharps |
| `isNarrow` | boolean | `window.innerWidth < 700` | Drives vertical fretboard mode; updated on window resize |

`boardTheme` is **not** a state variable — it is hardcoded to `'rosewood'` and passed as a static prop to the Fretboard component.

`visibleShapes` is derived: `soloShape ? [soloShape] : activeShapes`.

No persistence is required. No data fetching.

### Shape placement algorithm

For each of the five CAGED shapes, given the current `keyPc`:

1. Each shape has a hardcoded `homePc` (its open-position root: C=0, A=9, G=7, E=4, D=2) and an `anchor` = `{ string, row }` — the lowest-fretted root in the shape grid.
2. Compute `anchorFret = (keyPc − openPitchOf(anchor.string) + 12) mod 12`.
3. Compute `row0Fret = anchorFret − anchor.row`. This is the absolute fret of the shape's top row.
4. For each filled cell `(string, row)`:
   - `fret = row0Fret + row`
   - skip if `fret < 0` or `fret > NUM_FRETS` (17)
   - if cell is `R` and `pitchClassAt(string, fret) === keyPc` → kind = `root`; if cell is `R` otherwise → kind = `chord`; if cell is `B` → kind = `scale`

`pitchClassAt(string, fret) = (tuning[string] + fret) mod 12` where tuning = `[4, 9, 2, 7, 11, 4]` for strings 0..5 (low E, A, D, G, B, high E).

`scaleDegree(pc, keyPc)` maps an interval to its diatonic degree: `{0:'1', 2:'2', 4:'3', 5:'4', 7:'5', 9:'6', 11:'7'}` — any non-diatonic interval returns `''`.

For the per-shape "Fret N" label on the shape cards: take `row0Fret`, wrap it into positive range by adding 12 while negative, then display `Open` if 0, else `Fret N`. Range label is `Frets N–(N+4)`.

---

## Design Tokens

### Colors

```css
--bg:           oklch(0.97 0.008 75);   /* warm off-white page background */
--bg-2:         oklch(0.94 0.012 75);   /* slightly deeper warm tone */
--surface:      oklch(1 0 0);           /* card / surface white */
--ink:          oklch(0.18 0.005 70);   /* primary text and stroke */
--ink-soft:     oklch(0.40 0.01 70);    /* secondary text */
--muted:        oklch(0.60 0.012 70);   /* labels, fret numbers, footer */
--line:         oklch(0.86 0.015 75);   /* hairline borders */
--line-soft:    oklch(0.91 0.012 75);   /* even softer hairlines */
--accent-red:   oklch(0.58 0.20 28);    /* root / "Clear solo" / brand mark */
--accent-red-soft: oklch(0.72 0.16 30);
```

### Shape accent palette

```js
SHAPE_COLORS = {
  C: 'oklch(0.62 0.16 32)',   // warm orange-red
  A: 'oklch(0.68 0.14 85)',   // amber
  G: 'oklch(0.58 0.13 150)',  // green
  E: 'oklch(0.55 0.14 240)',  // blue
  D: 'oklch(0.50 0.16 305)',  // violet
}
```

These share a chroma band (~0.13–0.16) and step ~70° in hue per shape so the five colors read as a system. If your platform doesn't support OKLCH, convert to sRGB and verify hue-step / saturation parity rather than picking visually-close hex codes by eye.

### Typography

| Role | Family | Weight / Style | Size |
|---|---|---|---|
| Display (titles, key letter, big shape letters, fret labels) | DM Serif Display | 400 / italic | 14–44px |
| Body / UI | Plus Jakarta Sans | 400 / 500 / 600 / 700 / 800 | 11–15px |
| Mono (fret numbers, string labels, dot labels, ranges) | JetBrains Mono | 400 / 500 / 600 / 700 | 10–11px |

Base body: Plus Jakarta Sans 15px, line-height 1.45, antialiased.

Uppercase section labels and toggle labels use letter-spacing 0.12em–0.14em.

### Spacing scale

The design uses ad-hoc spacing rather than a strict scale. Common values: 4, 6, 8, 10, 12, 14, 16, 18, 22, 24, 28, 32, 36, 40, 80.

### Border radius

- Pills / "Solo" buttons / shape legend chips: `999px`
- Surface cards / sections: `14–16px`
- Buttons / inner toggle elements: `7–12px`

### Shadows

- Soloed shape card: `0 0 0 2px var(--shape-accent), 0 8px 24px -10px rgba(0,0,0,0.18)`
- Everything else uses borders, not shadows.

### Shape data

```js
SHAPES = [
  { name: 'C', homePc: 0, anchor: { string: 1, row: 3 },
    grid: ['BBBRBR', 'B...RB', '.BRB..', 'BRB.BB', '......'] },
  { name: 'A', homePc: 9, anchor: { string: 1, row: 1 },
    grid: ['.BBB..', 'BRB.BR', '...B..', 'BBRRRB', '....B.'] },
  { name: 'G', homePc: 7, anchor: { string: 0, row: 4 },
    grid: ['...B..', 'BBRRRB', '....B.', 'BRBB.B', 'RB..BR'] },
  { name: 'E', homePc: 4, anchor: { string: 0, row: 1 },
    grid: ['BBBB.B', 'RB..RR', '..BR..', 'BRRBBB', '......'] },
  { name: 'D', homePc: 2, anchor: { string: 2, row: 1 },
    grid: ['..BB..', 'BBRBBB', '......', 'BBBRBR', 'B...RB'] },
];
```

Grids are rows × 6-char strings. Each char: `R` = chord-tone (red in the small shape diagrams), `B` = scale-only note, `.` = empty.

---

## Assets

No external image, icon, or font binaries are required.

- **Fonts** are loaded from Google Fonts in the prototype (DM Serif Display, Plus Jakarta Sans, JetBrains Mono). Replace with your project's font-loading mechanism, but preserve the families.
- **All other visuals are SVG drawn inline** (the brand mark, shape diagrams, fretboard). No raster assets.
- The prototype uses React 18 + Babel via UNPKG for in-browser JSX — your production version should use your own build pipeline.

---

## Files

- `CAGED Practice.html` — the reference prototype. Single file containing the Theory module (note math + shape data), the `ShapeBox` and `Fretboard` SVG components, and the `App` orchestrator. All four "modules" in the file are separated by `// ═══` banners for easy navigation.
