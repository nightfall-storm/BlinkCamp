# BlinkCamp — Agent Guide

## Dev commands

```bash
pnpm install          # installs TypeScript + nodemon
pnpm exec tsc          # compile src/ -> public/
pnpm run dev           # watch mode: nodemon auto-recompiles on .ts change
# serve public/ with any static server (VS Code Live Server on :5501)
```

There are no tests (`pnpm test` is a placeholder).

## Architecture

**Zero runtime dependencies.** Pure TypeScript → ES6 modules loaded directly by the browser. No bundler, no framework.

**Game loop:** `src/Engine/GameLoop.ts` runs on `requestAnimationFrame`. Dispatches `GameLoop:Update` custom event on `window` each frame with `{ dTime: seconds }`. All game elements subscribe via the `GameElement` base class.

**Event-driven UI:** UI interactions dispatch `Game:*` custom events on `window`. Key events:

| Event | Detail |
|---|---|
| `Game:LeftArrowClick` / `Game:RightArrowClick` | — |
| `Game:VelocityValueChanged` | `{ velocity: string }` |
| `Game:RadiusValueChanged` | `{ radius: string }` |
| `Game:VsyncToggled` | `{ enabled: boolean, targetFps: number }` |
| `DotRoutineManager:RoutineChanged` | — |

**Dot positioning:** CSS custom properties `--x`, `--y`, `--radius` in `vw`/`vh` units. Coordinate system is `0`–`100` (left/top to right/bottom). The `Dot.Y` setter clamps to `safeAreaMaxY` to prevent overlapping the bottom UI overlay.

## Project structure

```
src/
  Engine/GameLoop.ts      # requestAnimationFrame loop, frame-skipping FPS cap
  Engine/GameElement.ts   # abstract base: X/Y via CSS custom props, subscribes to GameLoop:Update
  Engine/IGameElement.ts  # interface: Update(), X, Y
  Dot/Dot.ts              # the moving dot — safe area, velocity, calibration scale
  Dot/IDotRoutine.ts      # interface: Execute(dot), title, duration
  Dot/DotRoutineManager.ts# singleton: lists all routines, handles left/right arrow nav
  Dot/Routines/           # 12 movement patterns (see below for pattern)
  Game.ts                 # scene init: wires UI events to window custom events
  ThemeManager.ts         # toggles data-theme on <html>, persists to localStorage
  RoutineTitleFollower.ts # updates the .routinename element on routine change
```

```
public/                   # compiled output (served as web root)
  index.html, styles.css
  *.js mirrors src/
  Assets/                 # static SVGs
```

## How to add a new routine

1. Create `src/Dot/Routines/MyRoutine.ts` following this pattern:
   ```typescript
   import { Dot } from "../Dot.js";
   import { IDotRoutine } from "../IDotRoutine.js";

   const Amplitude = 25;
   let lastPhaseAngle = 0;

   export const MyRoutine: IDotRoutine = {
     Execute: function (dot: Dot) {
       const phase = dot.dTime * dot.velocity + lastPhaseAngle;
       dot.X = dot.halfScreen + Amplitude * Math.cos(phase);
       dot.Y = dot.halfScreen + Amplitude * Math.sin(phase);
       lastPhaseAngle = phase;
     },
     title: "My Routine",
     duration: 15,
   };
   ```
2. Register it in `src/Dot/DotRoutineManager.ts` — import + add to the `activeDotRoutines` array.

Position is in vw/vh units (0–100). `dot.halfScreen` returns `50` (viewport center). Routines that bounce or teleport should read `dot.safeAreaMaxY` instead of hardcoding `100`.

## How to add a new color theme

1. Add a `:root[data-theme="name"] { --background-color: ...; --dot-color: ...; }` block in `public/styles.css` (ensure ≥4.5:1 contrast ratio).
2. Add `<option value="name">Name</option>` to the `<select id="theme-selector">` in `public/index.html`.
3. No TypeScript changes needed — `ThemeManager.ts` generically applies whatever `value` the `<select>` emits.

## Style & conventions

- **Import paths** must include `.js` extension (e.g., `"../Dot.js"` not `"../Dot"`). TS compiles to ESM — the browser needs the extension at runtime.
- **All event listeners** on interactive UI elements use `pointerdown`, not `click`.
- **`GameElement` base class** uses a self-reference pattern: pass `null` to `super()`, then assign `this` to use polymorphism via `gameElementInstance?.Update?.(dTime)`.
- **FPS cap** uses frame-skipping inside `requestAnimationFrame` — never `setTimeout`.

## Known quirks

- `.gitignore` does NOT exclude `public/` — compiled JS is committed.
- Some stale `.js` files live in `public/` that have no corresponding `.ts` source. Run `pnpm exec tsc` to regenerate valid output.
- The original `README.md` TODOs ("mobile compatibility", "real-life length speed", "more themes", "VSync option") are partially addressed by the current code. Verify intent before assuming they are open work.
- `BackgroundVideo.ts` and `PushNotifications.ts` are built but not wired in the UI.
