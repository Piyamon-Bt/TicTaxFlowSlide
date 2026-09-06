# TicTaxFlow — Interactive Pitch Website

A 15-chapter interactive pitch built to be presented live in ten minutes.

Every chapter is a **pinned scene**: a tall section whose stage sticks to the viewport while its
own scroll progress drives every animation inside it. Nothing runs on a timer, so a scene can be
scrubbed forwards and backwards by hand and holds wherever you stop. On top of that, each chapter
declares **beat stops**, and the arrow keys glide between them — so the same page is both a
free-scrolling site and a deck you can click through on stage. There is a presentation mode, a
presenter panel with the Thai speaker script and a pacing clock, and a restrained Three.js depth
layer behind the content.

---

## Run it

**Double-click `index.html`.** That's the whole procedure.

`index.html` is fully self-contained: the CSS, the markup, Three.js (r149, UMD) and all the
application JavaScript are inlined into the one file. It makes **zero network requests**, so it
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
| `→` `↓` `Space` `PageDown` | Next **beat** — the next step inside this chapter, or the next chapter |
| `←` `↑` `PageUp` | Previous beat |
| `Home` / `End` | First / last chapter |
| `1`–`9`, or two digits (`1` `3` → 13) | Jump to a chapter |
| `F` | Presentation mode — fullscreen, larger type, timer starts |
| `P` | Presenter panel — Thai script, chapter target, elapsed clock, on-pace indicator |
| `M` | Motion on / off (also drops the WebGL layer) |
| `?` | Keyboard help |
| `Esc` | Close a panel, or leave presentation mode |

Touch: swipe up and down to scroll (which scrubs the current scene); a horizontal swipe steps one
beat. Mouse: normal scrolling, or click a tick on the right-hand chapter rail. Scrolling by hand
and pressing `→` do the same thing — the keys just land on exact, repeatable positions.

**On a projector:** press `F` on the presenting display. The presenter panel (`P`) is a
slide-over on the same screen — it is for rehearsal and for a laptop screen that the audience
cannot see. If you are mirroring displays, keep it closed while presenting.

The URL carries the chapter (`index.html#ch-7`), so you can reopen straight to a chapter.

---

## What's in the folder

```
index.html                       the entire website, self-contained (~1.6 MB)
README.md                        this file
docs/content-map.md              all 15 chapters: every headline, number, fact, speaker note
docs/visual-motion-spec.md       art direction, palette, type, motion beats, Three.js budget
docs/capabilities-vs-roadmap.md  what exists today vs what is roadmap (used for slide labels)
docs/factual-verification.md     every claim on the site and what must be checked before public use
docs/presenter-guide.md          how to run the 10-minute pitch, timings, Q&A prep
docs/qa-report.md                what was tested, on what, and what is left
src/                             editable sources (CSS, chapter markup, JS) — optional
build.py                         re-assembles index.html from src/ + vendor/
vendor/                          Three.js r149 UMD build and its MIT licence
tools/obj2asset.py               converted the iPhone OBJ into a mesh asset (no longer built in)
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

- Chapter copy lives in `src/html/b_ch01_04.html` (chapters 01–05), `c_ch05_08.html` (06–10) and
  `d_ch09_12.html` (11–15). The filenames still carry their original ranges; renaming them means
  updating `build.py`, which is the only place they are listed.
- Speaker notes, chapter names and per-chapter time targets live in `src/js/content.js`.
- Design tokens (colours, type scale, spacing) are the custom properties at the top of
  `src/styles.css`.
- **Motion is declared in the markup.** Every animated element carries `data-r="in0 in1"` (fade in)
  or `data-r="in0 in1 out0 out1"` (fade in, then back out), where the numbers are positions in the
  chapter's own scroll, 0 → 1. Pair it with `a-soft`, `a-in`, `a-hold`, `a-l`/`a-r` for the
  flavour of the move. Scene length is `--len` (in viewport heights) and beat stops are
  `data-stops` on the `<section>`.
- The scroll engine, navigation and the presenter panel are `src/js/app.js`; the per-chapter
  scrub hooks (the chapter-03 count, the chapter-07 device, the chapter-08 screens, the
  chapter-09 funnel) are the `SCRUB` object in that file. The depth layer is
  `src/js/three-layer.js`.
- **Every mockup in the deck is the same MacBook.** Chapter 01's order feed is plain markup in
  `src/html/b_ch01_04.html` — each `<li class="frow">` carries `data-amt` and `data-ord`, and the
  two counters in the feed header are the running sum of the rows currently on screen, so they can
  never disagree with the list. Add or remove a row and the totals follow.
- The 3D iPhone that used to open the deck is **no longer built in**. `src/js/phone.js` and
  `src/js/phone-model.js` are still in the repository but are deliberately left out of `build.py`;
  restoring them is a two-line change there. Dropping them took ~400 KB off `index.html`.
- **Chapter 15's team names** are the `<b>` inside each `.bbadge` in `src/html/d_ch09_12.html`.
  To swap a photograph, edit its line in `MEMBERS` in `tools/team2assets.py` and run it, then
  rebuild.
- **Chapter 05's year strip** is the `.yearbar` block in `src/html/b_ch01_04.html`: fifteen `<i>`
  cells, with `class="on"` on the two filing windows (cells 7–9 and 13–15). The sweep that brings
  them in is `SCRUB.calendar` in `src/js/app.js`.
- **Chapter 09** shows three product screenshots on one laptop, and **scroll position picks which
  one** — stop anywhere to hold a screen. They are `step1`–`step3` in `src/js/ui-assets.js`
  (`python3 tools/ui2asset.py`); the step copy beside them is in `src/html/c_ch05_08.html`; the
  switch points are `SCRUB.screens` in `src/js/app.js` and the matching `data-stops` on the
  section. Clicking a step scrolls to that screen's position.
- **The 3D parcels and banknote stacks** (chapters 02 and 03) are `src/js/prop-models.js`. Rebuild
  them with `python3 tools/props2assets.py` after extracting the source archives to `/tmp/models`;
  their positions, sizes and opacity are `BOX_SLOTS` / `MONEY_SLOTS` and the `buildProp` calls in
  `src/js/three-layer.js`. They are scenery: keep them few, far back, and out of the copy column.
- The chapter-02 seller photograph lives in `src/js/seller-asset.js`. To swap it, drop the new
  cut-out PNG (transparent background) in and change `SRC` in `tools/seller2asset.py`, run it,
  then `python3 build.py`. Original colours are kept (`GREYSCALE` in that script switches it).
  The glow around it is CSS (`.node.center .sticker`), not baked into the image.
- The chapter-08 laptop screenshot lives in `src/js/ui-assets.js` (`python3 tools/ui2asset.py`
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
- Under reduced motion every scene collapses to exactly one screen, so the deck becomes fifteen
  plain pages; each chapter renders in its finished state, the counters print their final values
  (11 orders / ฿12,970, ฿1,642,350, 91 %, ฿157,650), the arrow keys step chapter-to-chapter, and
  the chapter-03 threshold flash does not fire.
- Semantic `<main>` with fifteen labelled `<section role="region">`, a real `<nav>` for the
  chapter rail, a skip link, visible focus rings, and a live region announcing each chapter.
- Contrast: every text/ground pair on the site meets WCAG AA or better (table in
  `docs/visual-motion-spec.md`). Secondary text uses a secondary colour token rather than being
  dimmed with `opacity`, so the measured ratios are the ratios that ship.

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
fonts, so no font files are fetched or embedded. No Shopify or Apple asset, image, text, colour
value or code is used anywhere in this project; the reference sites informed structure, pacing
and motion model only.
# TicTaxFlowSlide
