# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # dev server at http://localhost:5173
npm run build      # tsc -b + vite build → dist/
npm run preview    # serve dist/ locally
```

No test suite or linter is configured.

## Architecture

This is a single-page React app — no routing, no data fetching, no persistence.

**`src/lib/theory.ts`** is the sole logic module. It owns all music-theory types and functions:
- `SHAPES` — the five CAGED shape definitions (grid strings, anchor, homePc)
- `SHAPE_COLORS` — per-shape OKLCH accent colors
- `placeShape(shape, keyPc)` — maps a shape onto the fretboard for a given key, returning `PlacedNote[]` and `row0Fret`
- `pcAt`, `noteName`, `scaleDegree` — pitch-class utilities

**`src/App.tsx`** holds all state:
- `keyPc` (0–11), `soloShape`, `activeShapes`, `labelMode`, `showRootsOnly`, `useFlats`, `isNarrow`
- `visibleShapes` is derived: `soloShape ? [soloShape] : activeShapes`
- `isNarrow` (`window.innerWidth < 700`) drives vertical vs. horizontal fretboard orientation, updated on resize

**Components** are pure renderers; all state lives in App and is passed down as props:
- `KeySelector` — 12 key buttons + sharps/flats toggle
- `ShapeCard` — one CAGED card with `ShapeBox` diagram, fret label, solo pill, show checkbox
- `ShapeBox` — self-contained SVG chord-box diagram (5 fret rows × 6 strings)
- `FretboardSection` — fretboard card + legend row; delegates SVG drawing to `Fretboard`
- `Fretboard` — the SVG neck (horizontal ≥700px, vertical <700px); calls `placeShape` for each visible shape and renders dots as filled circles or pie slices when shapes overlap

## Styling

Tailwind CSS v4 with CSS-first config in `src/index.css` (`@theme { … }`). Custom tokens are registered there as `--color-*` and `--font-*` variables, making them available as Tailwind utilities (`text-ink`, `bg-surface`, `border-line`, etc.).

Layout classes that need media queries or complex grid rules (`.shapes-grid`, `.fretboard-scroll`, `.key-row`, `.fretboard-toolbar`) are defined as plain CSS in `index.css` rather than via Tailwind utilities.

## Key design constraints

- **Board theme is hardcoded to Rosewood** — Maple and Ebony themes exist in `Fretboard.tsx` but are not exposed in the UI.
- **No server, no API** — purely client-side.
- **Deployment target is Netlify** (`netlify.toml`): build command `npm run build`, publish dir `dist/`.
- `CAGED Practice.html` is the original interactive design prototype — open it in a browser to verify intended behavior before implementing anything.
- Full design spec (geometry, interactions, tokens, shape data) is in `docs/DESIGN.md`.
