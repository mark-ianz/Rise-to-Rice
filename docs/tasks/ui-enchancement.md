# UI Enhancement Task — Read First, Generate After

## STEP 1 — Read the codebase (do not skip)

Before writing a single line, read the following in order:

1. Find the file containing `createBrowserRouter` and read it entirely.
2. For each route's `element` or `lazy` import — open and read that component file.
3. Scan `src/assets/` (or equivalent) and list every image, logo, icon, and font file found.
4. Read any shared layout components (e.g. `Layout`, `Navbar`, `Sidebar`, `Header`, `Footer`).
5. Read the global CSS / Tailwind config / theme file (e.g. `tailwind.config`, `index.css`, `theme.ts`).
6. Check `package.json` for the UI library in use (Tailwind, MUI, Chakra, shadcn, etc.).

Do NOT assume file names, folder structures, component props, or asset paths.
Only use what you actually read from the codebase.

---

## STEP 2 — Inventory (output this before touching any file)

List the following as a quick summary before generating anything:

- Router file path
- All routes: path → component file → brief description of what it does
- All assets found (relative paths)
- Shared layout components used
- UI library / styling approach confirmed

---

## STEP 3 — Enhance each page (one at a time, in router order)

For EACH route found, generate an improved version of its component with these rules:

### Rules
- **No detail removal.** Every existing piece of state, prop, logic, handler, and UI element must be preserved.
- **Only add or improve.** You may: add visual hierarchy, improve spacing/typography, add loading skeletons, add empty states, improve button styles, add subtle transitions, improve responsiveness, or better structure sections.
- **Use existing assets.** Reference logos, images, and icons using the exact relative paths found in Step 1. Do not reference any asset you did not find.
- **Stay in the existing styling system.** If the project uses Tailwind, use Tailwind. If MUI, use MUI. Do not introduce a new library.
- **No made-up API endpoints, no invented props, no fake data.** All data references must come from the existing component.
- **Preserve all imports.** Keep all existing imports. Add new ones only if they are from packages already in `package.json`.
- **One file at a time.** Output the full enhanced file, then stop and confirm before moving to the next route.

### Per-page output format
```
Route: /your-path
File: src/pages/YourPage.tsx
Changes made: [bullet list of what was improved]
---
[full enhanced component code]
```

---

## STEP 4 — Prompt Stitch (via MCP) with the enhanced component

After generating each enhanced component, use the Stitch MCP tool to render a visual preview.

Pass it:
- The full JSX/TSX of the enhanced component
- The route path as context
- Actual asset paths found in Step 1 for any images/logos used

Do NOT ask Stitch to invent UI from scratch. You are handing it the already-written component to render.

---

## Constraints (hard stops)

- If you are uncertain about a file path, read the directory first.
- If an asset path is unclear, list what you found and ask before using it.
- If a component has a complex custom hook, read the hook file before touching the component.
- Do not batch multiple pages into one output — do them one at a time.
- Do not rename, relocate, or restructure files unless asked.