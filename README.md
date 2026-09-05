# TicTaxFlow — Interactive Pitch Website

A 12-chapter, full-screen interactive pitch built to be presented live in about ten minutes.
Every pitch slide from the source outline is one full-viewport chapter, with scroll snapping,
keyboard/touch navigation, a presentation mode, a presenter panel with the Thai speaker script
and a pacing clock, and a restrained Three.js depth layer behind the content.

---

## Run it

**Double-click `index.html`.** That's the whole procedure.

`index.html` is fully self-contained: the CSS, the markup, Three.js (r149, UMD), the 3D phone
mesh and all the application JavaScript are inlined into the one file. It makes **zero network requests**, so it
opens from a USB stick, from a Downloads folder, or offline in a venue with no Wi-Fi, and there
is nothing that can 404 on stage. No build step, no server, no npm install.

If you prefer to serve it (any static server works):

```bash
cd TixTaxFlow
python3 -m http.server 8080     # then open http://localhost:8080/
```

Browsers: current Chrome, Safari, Edge or Firefox. Presentation mode uses the Fullscreen API; if
a browser blocks it, the presentation styling still applies and only the fullscreen part is
skipped.

---

## Presenting

| Key | Action |
|---|---|
| `→` `↓` `Space` `PageDown` | Next chapter |
| `←` `↑` `PageUp` | Previous chapter |
| `Home` / `End` | First / last chapter |
| `1`–`9`, `0` (=10), or two digits (`1` `1` → 11) | Jump to a chapter |
| `F` | Presentation mode — fullscreen, larger type, timer starts |
| `P` | Presenter panel — Thai script, chapter target, elapsed clock, on-pace indicator |
| `M` | Motion on / off (also drops the WebGL layer) |
| `?` | Keyboard help |
| `Esc` | Close a panel, or leave presentation mode |

Touch: swipe up and down to move between chapters; a horizontal swipe also works. Mouse: normal
scrolling, or click a tick on the right-hand chapter rail.

**On a projector:** press `F` on the presenting display. The presenter panel (`P`) is a
slide-over on the same screen — it is for rehearsal and for a laptop screen that the audience
cannot see. If you are mirroring displays, keep it closed while presenting.

The URL carries the chapter (`index.html#ch-7`), so you can reopen straight to a chapter.

---

## What's in the folder

```
index.html                       the entire website, self-contained (~1.4 MB)
README.md                        this file
docs/content-map.md              all 12 chapters: every headline, number, fact, speaker note
docs/visual-motion-spec.md       art direction, palette, type, motion beats, Three.js budget
docs/capabilities-vs-roadmap.md  what exists today vs what is roadmap (used for slide labels)
docs/factual-verification.md     every claim on the site and what must be checked before public use
docs/presenter-guide.md          how to run the 10-minute pitch, timings, Q&A prep
docs/qa-report.md                what was tested, on what, and what is left
src/                             editable sources (CSS, chapter markup, JS) — optional
build.py                         re-assembles index.html from src/ + vendor/
vendor/                          Three.js r149 UMD build and its MIT licence
tools/obj2asset.py               converts the iPhone OBJ into the inlined mesh asset
tools/brand2assets.py            packs the four platform logos into the inlined image asset
tools/ui2asset.py                packs the four product screenshots (ch.07 laptop, ch.08 steps)
tools/team2assets.py             crops and packs the chapter-12 team photographs
tools/seller2asset.py            trims and packs the chapter-02 seller photograph
tools/props2assets.py            converts the parcel and banknote OBJs into the inlined prop meshes
test/                            Playwright scripts used for the QA runs
```

`index.html` is the deliverable. `src/`, `build.py`, `vendor/` and `test/` are there so the deck
can be changed later; you never need them to present.

## Editing

Edit files under `src/`, then:

```bash
python3 build.py        # rewrites index.html
```

- Chapter copy lives in `src/html/b_ch01_04.html`, `c_ch05_08.html`, `d_ch09_12.html`.
- Speaker notes, chapter names and per-chapter time targets live in `src/js/content.js`.
- Design tokens (colours, type scale) are the custom properties at the top of `src/styles.css`.
- The depth layer is `src/js/three-layer.js`; navigation and the presenter panel are
  `src/js/app.js`.
- Chapter 01's phone — the 3D model, its materials and the animated lock screen — is
  `src/js/phone.js`; the mesh itself is `src/js/phone-model.js`, regenerated with
  `python3 tools/obj2asset.py <path-to.obj>` if the model ever changes. The notification
  feed (channels, Thai copy, amounts) is the `FEED` array at the top of `phone.js`.
- **Chapter 12 still needs the three names.** They are the `<b>` inside each `.bbadge` in
  `src/html/d_ch09_12.html`. All three photographs are in place; to swap one, edit its line in
  `MEMBERS` in `tools/team2assets.py` and run it. Rebuild after either change.
- **Chapter 08** cycles three product screenshots on one laptop. They are `step1`–`step3` in
  `src/js/ui-assets.js` (`python3 tools/ui2asset.py`); the step copy beside them is in
  `src/html/c_ch05_08.html`, and the 4.2 s rotation is `SHOT_MS` in `src/js/app.js`. Clicking a step
  stops the rotation for the session.
- **The 3D parcels and banknote stacks** (chapters 02 and 03) are `src/js/prop-models.js`. Rebuild
  them with `python3 tools/props2assets.py` after extracting the source archives to `/tmp/models`;
  their positions, sizes and opacity are `BOX_SLOTS` / `MONEY_SLOTS` and the `buildProp` calls in
  `src/js/three-layer.js`. They are scenery: keep them few, far back, and out of the copy column.
- The chapter-02 seller photograph lives in `src/js/seller-asset.js`. To swap it, drop the new
  cut-out PNG (transparent background) in and change `SRC` in `tools/seller2asset.py`, run it,
  then `python3 build.py`. Original colours are kept (`GREYSCALE` in that script switches it).
  The glow around it is CSS (`.node.center .sticker`), not baked into the image.
- The chapter-07 laptop screenshot lives in `src/js/ui-assets.js` (`python3 tools/ui2asset.py`
  regenerates it); the laptop itself is the `.macbook` block in `src/styles.css`.
- The platform logos live in `src/js/brand-assets.js`; regenerate with
  `python3 tools/brand2assets.py` after changing the source images. In markup they are used as
  `--src:var(--logo-shopee);--ar:var(--logoar-shopee)` on a `.brandlogo` span.

Re-run the checks with `node test/shoot.js desktop`, `node test/shoot.js mobile`,
`node test/func.js` (needs `npm i playwright`).

---

## Accessibility and fallbacks

- Works with the WebGL layer off: `prefers-reduced-motion: reduce`, the `M` toggle, or a browser
  with no WebGL all fall back to a static ground. **No information is lost** — every number,
  headline and diagram is HTML/CSS/SVG above the canvas.
- Reduced motion removes the staggered entrances, the counters print their final values, and the
  chapter-3 gold flash does not fire.
- Semantic `<main>` with twelve labelled `<section role="region">`, a real `<nav>` for the
  chapter rail, a skip link, visible focus rings, and a live region announcing each chapter.
- Contrast: every text/ground pair on the site meets WCAG AA or better (table in
  `docs/visual-motion-spec.md`).

## Content and factual integrity

All content comes from the source pitch outline and the project brief. No market statistic,
traction claim, partnership or product capability was invented. Roadmap features are labelled as
roadmap on the slides themselves, pricing is labelled as proposed, and market tiers carry a
visible "sizing pending external validation" placeholder. Read `docs/factual-verification.md`
before showing this to anyone outside the team.

## Third-party

Three.js r149 (MIT) — `vendor/three-LICENSE.txt`. The iPhone model and the four platform logos
were supplied by the presenter; the logos are used unmodified and referentially to name the
channels a seller sells through (see `docs/factual-verification.md` §7a). Nothing else is bundled. Type is set in system
fonts, so no font files are fetched or embedded. No Shopify asset, image, text or code is used
anywhere in this project; the reference site informed structure and pacing only.
# TicTaxFlowSlide
