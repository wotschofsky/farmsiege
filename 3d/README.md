# FarmSiege 3D

A standalone first-person reimagining of [Felix Wotschofsky's FarmSiege](https://github.com/wotschofsky/farmsiege).

The original 8 × 8 field, three starting tomato plants, 15-second crop growth, harvesting, rabbits, weeds, moles, molehills, lightning, scoring values, and last-crop game-over rule form the core loop. The original 2D game remains a separate project.

## Run locally

Requires Node.js 22 or newer and a browser supporting WebGL 2.

```sh
npm ci
npm run build
npx serve dist
```

Open the server URL. Serve over localhost or HTTPS for mouse pointer lock. Starting, resuming, or clicking the field captures the desktop mouse so movement turns the camera without dragging. Esc releases the mouse and pauses; click the resume button to capture it again. The game also supports touch controls and basic dual-stick gamepad movement.

If an embedded preview blocks pointer lock, open the game in its own browser tab using the on-screen link. Desktop gameplay waits for mouse capture, rather than continuing with drag controls. Both event-based Firefox pointer lock and promise-based APIs are supported.

## Controls

| Input | Action |
| --- | --- |
| WASD | Move |
| Mouse | Look |
| Shift | Sprint |
| E / Space | Contextual planting, harvesting, weeding, and catching moles |
| 1–4 / Mouse wheel | Select seeds, spade, mallet, or shotgun |
| Left click | Use selected tool |
| V | Plant with seeds |
| C | Select and fire shotgun |
| Arrow keys | Look without a mouse |
| Esc | Pause / resume |

Aim at soil within approximately five metres to tend it. Mature tomatoes score **15**, rabbits **5**, weeds **2**, and moles **50**. Harvesting the last crop ends the run too, so plant ahead. Immature crops cannot be accidentally harvested in this version. Shotgun shots have a 1.2-second pump delay and unlimited ammunition, matching the original pacing.

Survival mode accelerates pest pressure over time. Easygoing mode slows pests and spawns fewer rabbits. Both modes retain hazards and the last-crop rule. Best scores are stored separately by mode in localStorage. Preferences also stay in this browser; there is no remote leaderboard or backend.

## Visuals and assets

Three.js renders a warm, stylized countryside with detailed custom tomato plants, smooth rabbit and mole models, a timber barn, fencing, hay bales, barrels, windmill, and visible first-person tools. Custom meshes are merged by material to reduce draw calls. Grass uses instancing and vertex wind animation. All dependencies and models are served locally, without a runtime CDN.

The two imported livestock GLBs come from [3DAssets.dev's Farm Animals and Barnyard pack](https://3dassets.dev/packs/farm-livestock-and-barnyard), released under **CC0 1.0 Universal**. Source and license records are in `assets/*-source.json`. These are static decorative models; gameplay rabbit animation is implemented in this project. The 3DAssets.dev livestock models are identified by their publisher as AI-generated. The custom models in `src/models.js` are code-authored for this game.

Code is licensed under **AGPL-3.0**, preserving FarmSiege's original license. Three.js and esbuild are MIT-licensed dependencies.

## Validation

```sh
npm test
npm run build
```

Tests cover growth and scoring, harvesting the last crop, boundary-safe lightning, rabbit feeding and shotgun aim, restarts, difficulty, valid model geometry, binary GLB headers, and UI element references.

## Source structure

- `src/logic.js`: deterministic, renderer-independent gameplay simulation
- `src/models.js`: custom 3D models and mesh batching
- `src/world.js`: environment, lighting, animation, effects, and asset loading
- `src/main.js`: controls, UI, persistence, and game loop
- `src/audio.js`: browser-synthesized sound effects
- `index.html` / `style.css`: responsive menus, HUD, and dialogs
- `assets/`: imported, self-contained livestock GLBs and provenance
- `test/`: gameplay and asset checks
- `build.mjs`: bundles scripts and copies the static site to `dist/`
