# CAGED Scale Shapes

A single-page guitar tool for visualising the five CAGED major-scale shapes across the full neck in any key. Pick a key, solo a shape, and see exactly where it sits on the fretboard.

## Features

- All five CAGED shapes (C, A, G, E, D) displayed as chord diagrams and on a full 17-fret neck
- Transpose to any of the 12 chromatic keys in one click
- Solo a single shape to isolate it on the fretboard
- Toggle dot labels between note names and scale degrees
- Roots-only view to focus on anchor notes
- Sharps / flats spelling toggle

## Stack

- **React 18** + **TypeScript**
- **Vite 6** (dev server + build)
- **Tailwind CSS v4** (CSS-first config, `@tailwindcss/vite`)
- Google Fonts — DM Serif Display, Plus Jakarta Sans, JetBrains Mono

## Commands

```bash
npm install        # install dependencies
npm run dev        # start dev server at http://localhost:5173
npm run build      # type-check + production build → dist/
npm run preview    # preview the production build locally
```

## Deployment

The project is configured for Netlify via `netlify.toml`. Connect the repo in the Netlify dashboard and it will build with `npm run build` and serve the `dist/` directory automatically.

## Design reference

See [`DESIGN.md`](./DESIGN.md) and [`CAGED Practice.html`](./CAGED%20Practice.html) for the original design spec and interactive prototype.
