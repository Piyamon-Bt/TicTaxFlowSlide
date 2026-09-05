# TicTaxFlow — Visual & Motion Specification

Original visual world: **"Thai Digital Commerce Renaissance"** — the small online seller treated
as a modern entrepreneur, rendered in an editorial, print-inspired language: cool white paper,
near-black ink, torn-paper edges, halftone dots, gold leaf, and one metallic accent that
belongs to money and risk.

Nothing in this document is derived from Shopify assets. The reference site informed *structure
and pacing* (full-bleed opening, persistent chapter navigation, layered depth, scroll-driven
scene changes, torn section boundaries, modular cards) — not artwork, colour, copy or layout.

---

## 1. Palette

The deck is **black, white and gold**. There is one accent — gold — in three weights. Two
legacy token names (`--magenta`, `--lime`) survive so that several hundred existing rules keep
working; they now hold the bright-gold highlight and plain white respectively. Read the *role*
column, not the name.

| Token | Value | Role |
|---|---|---|
| `--ink` | `#0B0B0C` | Near-black ground for dramatic chapters |
| `--ink-2` | `#17171A` | Raised dark surface |
| `--ink-3` | `#232327` | Dark hairlines and borders |
| `--ivory` | `#FBFBFC` | Cool white ground for quiet chapters |
| `--ivory-2` | `#F0F0F3` | White surface / paper shadow |
| `--ivory-3` | `#E1E1E6` | Light hairlines and borders |
| `--gold` | `#D4AF37` | The accent — chapter numerals, rules, thresholds, "the number" |
| `--gold-2` | `#8A6B1E` | Gold as body text on white (contrast-safe) |
| `--magenta` *(= bright gold)* | `#F2CE6B` | Gold highlight on dark — alerts, emphasis |
| `--magenta-deep` *(= deep gold)* | `#8A6B1E` | The same highlight, safe as text on white |
| `--lime` *(= white)* | `#FFFFFF` | Positive signal — revenue, progress, "today" |
| `--lime-deep` *(= near-black)* | `#2B2B30` | The same signal as text on white |
| `--muted-ink` | `#9B9BA3` | Secondary text on black |
| `--muted-paper` | `#5F5F68` | Secondary text on white |

Grounds are translucent (`--ink-a` `rgba(11,11,12,.76)`, `--ivory-a` `rgba(251,251,252,.84)`)
so the WebGL layer reads through them. `body.no-webgl` swaps both for the opaque hex.

Contrast (WCAG AA, normal text):

| Pair | Ratio | Verdict |
|---|---|---|
| ivory `#FBFBFC` on ink `#0B0B0C` | 19.6 : 1 | AAA |
| muted-ink `#9B9BA3` on ink | 8.0 : 1 | AAA |
| ink on ivory | 19.6 : 1 | AAA |
| muted-paper `#5F5F68` on ivory | 7.4 : 1 | AAA |
| gold `#D4AF37` on ink | 8.8 : 1 | AAA |
| bright gold `#F2CE6B` on ink | 12.3 : 1 | AAA |
| gold-2 / magenta-deep `#8A6B1E` on ivory | 5.5 : 1 | AA |
| white `#FFFFFF` on ink | 20.1 : 1 | AAA |
| lime-deep `#2B2B30` on ivory | 15.0 : 1 | AAA |

Rule: `#D4AF37` and `#F2CE6B` are never used as body text on white; `#8A6B1E` is. Nothing on
the deck is coloured except gold — the only other colours anywhere are the third-party brand
marks (Shopee, Lazada, Facebook, LINE), which are reproduced in their own colours on white
tiles, and the product screenshot on the chapter-07 laptop, which is the real UI.

### Chapter grounds

| Ch | Ground | Reason |
|---|---|---|
| 01 | ink (painted by the canvas — the section itself is transparent) | night-time opening, the phone is the only lit object |
| 02 | ink | converging streams read best on dark |
| 03 | ink → hard gold flash at threshold | the problem moment |
| 04 | ink, dense | overwhelm |
| 05 | **ivory** | the exhale; product reveal |
| 06 | ivory | explanatory, calm |
| 07 | ink | the product glows; hero moment |
| 08 | ivory | the product itself; screenshots need a white ground |
| 09 | ink | funnel, focus |
| 10 | ivory | premium pricing |
| 11 | ink | three words land like type on a poster |
| 12 | ivory | resolution, the people |

The ink↔ivory alternation is itself the scene transition: a torn-paper edge (SVG path) wipes
between grounds as chapters change.

---

## 2. Typography

Two voices, no third.

**Expressive serif** — `"Big Caslon", "Didot", "Hoefler Text", "Iowan Old Style", Georgia,
"Times New Roman", serif`. Used only for: chapter kickers, the reveal line "Meet TicTaxFlow.",
the mission headline, and pull quotes. Italic where the source is emotional.

**Bold sans** — `-apple-system, "Helvetica Neue", "Inter", "Segoe UI", Roboto, sans-serif` at
weights 700–900, tracking −0.03em at display sizes. Used for headlines, numbers, UI.

**Thai** — `"Noto Sans Thai", "IBM Plex Sans Thai", Thonburi, "Leelawadee UI", "Sukhumvit Set",
sans-serif`, line-height raised to 1.35 (Thai ascenders/descenders need the room), never below
28 px on the presentation scale, never letter-spaced.

All fonts are system fonts. No web font is fetched, so the deck opens offline with zero network
requests and cannot 404 on stage. Documented trade-off: exact glyph shapes vary by machine; the
type scale is designed to survive that.

### Type scale (fluid, clamped)

| Token | Size | Use |
|---|---|---|
| `--fs-mega` | `clamp(3.2rem, 11vw, 13rem)` | ฿1,800,000, "4 Channels." |
| `--fs-display` | `clamp(2.4rem, 6.4vw, 6.6rem)` | chapter headlines |
| `--fs-lead` | `clamp(1.05rem, 1.9vw, 1.9rem)` | supporting lines |
| `--fs-body` | `clamp(0.95rem, 1.15vw, 1.2rem)` | card copy |
| `--fs-kicker` | `clamp(0.7rem, 0.9vw, 0.9rem)` | labels, 0.22em tracking, uppercase |

Headline blocks use `text-wrap: balance` and are capped at `max-width: 18ch` (Latin) so no
headline is ever cropped or orphaned at 16:9, laptop, tablet or 390 × 844.

---

### Platform logos

The four channel marks (Shopee, Lazada, Facebook, LINE) are the presenter's own files, packed by
`tools/brand2assets.py` into `src/js/brand-assets.js` as base64 PNGs at a common 96 px height and
published to CSS as `--logo-<name>` / `--logoar-<name>` at boot. They appear in two places:
chapter 01's notification cards (canvas) and its HTML fallback, and chapter 02's channel nodes.

Presentation rule: every mark sits **directly on the page**, at a fixed height, with no tile behind
it — the Lazada file arrived as a JPEG on white, so that white is keyed out and the colours
un-composited back. On the ink grounds a 1.5 px white hairline glow sits *behind* each mark so a
dark wordmark (Lazada's navy) still separates; the mark's own pixels are untouched. A mark that is already a square app
icon — LINE — fills its tile edge to edge instead, the way it looks on a home screen. Marks are
never recoloured, cropped into new marks, or set beside the TicTaxFlow mark as a lockup.

## 3. Texture and edges

- **Paper grain** — one inline SVG `feTurbulence` (fractalNoise, baseFrequency .8, 4 octaves) as
  a data-URI, applied at 4–7 % opacity over every chapter. One shared asset, no per-chapter cost.
- **Halftone** — `radial-gradient` dot lattice, 6 px pitch, used behind numbers and in the
  Ch.04 overwhelm field.
- **Cut-out edge** — the chapter-02 seller photograph is a transparent PNG lit from behind with
  stacked zero-offset `drop-shadow()` filters: a 1 px white hairline, then two gold blooms
  (18 px and 46 px), then one soft dark shadow. The glow lives in CSS, not in the file, so the
  photograph can be swapped without re-touching anything.
- **Photographs keep their own colours.** The palette rule governs the deck's own graphics; the
  three team portraits and the chapter-02 seller are the presenter's own pictures and are shown
  as taken. So are the four platform marks. Everything Claude draws stays black, white and gold.
- **Torn edges** — hand-authored SVG paths (irregular, non-repeating) used as `clip-path` on the
  boundary between ink and ivory chapters. Three distinct tear profiles, alternated so no two
  adjacent boundaries match.
- **Gold rules** — 1 px `--gold` hairlines at 40 % opacity under kickers.
- **Print registration marks** — small crop marks in chapter corners, decorative,
  `aria-hidden`.

Deliberately avoided: blue SaaS gradients, glassmorphism, cartoon styling, glowing AI brains,
robots, and any floating object that doesn't mean something.

---

## 4. Three.js environmental layer

One fixed full-screen `<canvas>` behind all content (`position: fixed; inset: 0; z-index: 0`),
one `WebGLRenderer`, one `PerspectiveCamera` (fov 48), one `Scene`. Three.js r149 UMD build is
**inlined into `index.html`**, so there is no CDN dependency and no network request.

The layer is decorative only. Every fact, number and diagram lives in HTML/CSS above it. Turning
the canvas off (WebGL unavailable, `prefers-reduced-motion`, or the in-page Motion toggle)
removes nothing but atmosphere.

### Objects

| Object | Construction | Chapters |
|---|---|---|
| `dust` | 900 `Points`, additive, slow drift, 3 depth bands | all |
| `streams` | 4 × 140 `Points` on bezier paths converging to origin | 02 |
| `revenue` | 1400 `Points` rising and packing into a bar volume | 03 |
| `clutter` | 90 textured `PlaneGeometry` quads (receipt shapes, canvas-drawn) tumbling | 04 |
| `dissolve` | reuse of `clutter` + `dust` with a scatter-and-fade shader uniform | 04 → 05 |
| `scanline` | single emissive plane sweeping a document quad | 06 |
| `glow` | radial sprite behind the dashboard, gentle breathing | 07 |
| `collage` | 4 depth-separated soft planes with parallax offsets | 01, 12 |
| `phone` | the supplied iPhone mesh (25.5k triangles) + a canvas-textured screen plane + a screen spill light | 01 |

Chapter 07's laptop is **not** WebGL: it is a CSS MacBook (aluminium gradients, a 16:10 glass
screen carrying the product screenshot as a background image, a tapered base). Drawn in CSS it
stays pin-sharp at any projector resolution and costs nothing to render, which matters on the
chapter that has to be readable.

All geometry except the phone is generated in code. The phone comes from the presenter's own
OBJ export, converted by `tools/obj2asset.py` into quantised uint16 positions, int8 normals and
uint16 indices (406 KB of base64, inlined). Its 127k-face earpiece-grille object is dropped —
sub-millimetre detail, invisible at pitch scale, and the screen plane covers that area. Five PBR
materials are assigned from the OBJ's material groups (body, frame, camera glass, lens, lens
ring); no bundled texture, so still no external files and no 404s.

Lighting for the phone: a warm key, a magenta rim, a lime fill, ambient, and a PMREM environment
built from a 256×128 canvas gradient. Those lights only affect the phone's standard materials —
the particle systems use unlit materials and are unchanged.

### Camera

The camera never cuts. It eases between per-chapter target positions with a critically damped
spring (`ζ = 1`, `ω = 4.5`), plus a ±12 px pointer parallax (±0.4° on device orientation for
touch). Total camera travel across all 12 chapters is under 40 world units — restrained by
design; a pitch audience should never notice the camera, only the depth.

### Performance rules

- `requestAnimationFrame` drives everything. **No render work is bound to scroll events** —
  scroll only writes a normalised progress value into a state object.
- Pixel ratio capped at `min(devicePixelRatio, 2)`; on screens wider than 2560 px, capped at 1.5.
- Particle systems for chapters more than one step away are `visible = false`; hidden systems
  skip their update.
- Draw calls at any moment: **≤ 6**. Total points alive: ≤ 2,400.
- The render loop pauses entirely when the document is hidden (`visibilitychange`) and when the
  Motion toggle is off.
- Target: 60 fps on a 2020-era laptop at 1920 × 1080; the loop self-throttles to 30 fps if it
  measures three consecutive frames over 32 ms.

---

## 5. Motion beats (per chapter)

Timings are the *entrance* sequence, triggered once when a chapter becomes active. All easing is
`cubic-bezier(.22,.61,.36,1)` unless noted. Everything is interruptible: navigating away mid-beat
cancels cleanly and the next visit replays from the start.

| Ch | Beat sequence |
|---|---|
| 01 | No copy, no entrance sequence: the phone is simply there, floating (±0.8 units, 0.5 Hz) and turning slowly (±5° yaw, ±2° pitch) with pointer parallax. On the screen a notification lands every 0.72–1.14 s, the stack eases upward (7/s spring), each card fades in over ~0.2 s, cards fade out as they pass the list top, and the "orders today" pill increments with every arrival. The screen canvas (560 × 1250) redraws at 30 fps, not 60. |
| 02 | Seller node scales in → four channel nodes fan out on an arc (staggered 120 ms) → particle streams begin flowing inward → "4 Channels. 1 Taxpayer." counts 4 → 1 with a numeral flip |
| 03 | Ivory number ฿1,800,000 draws in as outlined type, then fills → counter runs 420K → 870K → 1.34M → 1.72M with the accumulation bar packing behind it → at 1.80M the frame flashes gold once (120 ms, single flash, respects reduced motion) and the ⚠ badge locks |
| 04 | Question 1 lands (0.4 s), question 2 (1.4 s), question 3 (2.4 s) → the decision tree draws its branches with `stroke-dashoffset` → receipt clutter density ramps to full over 4 s. The chapter is designed to feel slightly too busy. |
| 05 | Everything from 04 scatters and dissolves (900 ms) → hard cut to ivory → "Meet TicTaxFlow." letters rise individually (staggered 28 ms) → **1.2 s of nothing** → supporting line fades in |
| 06 | READ card in → a document quad slides into it and a scan line sweeps → CHECK card in, rule chips tick green one by one → EXPLAIN card in, mini chart draws → the connecting arrows fill left to right |
| 07 | Laptop rises 14 px and settles (0.5 s) → a gold glow blooms behind it and breathes → the floated revenue card fades up at 1.15 s → revenue counts to ฿1,642,350 over 1.6 s → progress bar fills to 91 % (1.5 s ease-out) |
| 08 | Laptop settles at 0.45 s → the three steps stagger in at 0.55 / 0.7 / 0.85 s → the roadmap line last at 1.1 s. From then the screen cross-fades to the next step every 4.2 s (0.6 s fade), the active step and its dot following it. A click on any step stops the rotation for the rest of the session |
| 09 | Funnel tiers drop in top-to-bottom (staggered 180 ms), each narrowing → the ฿200K–฿1.8M band highlights last, gold rule sweeping left to right |
| 10 | "Start Free." large → crossfades to "Pay when you grow." (600 ms) → three price plinths rise in sequence → closing line fades under a gold rule |
| 11 | "Simple." (0 s) → "Automatic." (0.9 s) → "Accessible." (1.8 s), each replacing the last at display size → at 2.9 s the three collapse into a row and their meanings fade in beneath |
| 12 | Mission headline → three team cards rise in sequence (0.6 / 0.8 / 1.0 s), each with its own accent rule across the top → closing line at 1.25 s → wordmark at 1.45 s |

### Reduced motion

`prefers-reduced-motion: reduce` (or the Motion toggle set to off):

- The WebGL canvas is not created at all; a static CSS gradient + grain stands in.
- Every entrance beat becomes an immediate final state — no stagger, no transform, opacity only,
  ≤ 120 ms.
- Counters print their final value instantly (฿1,642,350, 91 %, ฿1,800,000).
- The gold flash in Ch.03 does not fire.
- Scroll-snap remains; nothing is removed from the page. **Every fact stays present.**

---

## 6. Layout system

- Each chapter is `min-height: 100svh` (svh, not vh, so mobile browser chrome cannot crop
  headlines), with `scroll-snap-align: start` inside a snapping scroll container.
- 12-column grid, `clamp(24px, 4vw, 96px)` gutters, content max-width 1600 px, centred.
- Primary optimisation target 16:9 (1920 × 1080 and 1280 × 720). Secondary: 1440 × 900 laptop,
  1024 × 768 tablet, 390 × 844 phone.
- At ≤ 820 px the grid collapses to one column, the mega numbers drop one scale step, and
  side-by-side diagrams stack in narrative order (never reordered away from reading order).
- Landscape phones under 480 px tall get a compressed scale so key numbers stay on screen
  without scrolling inside the chapter.

---

## 7. Navigation & presentation chrome

- **Persistent rail** (right edge, desktop): 12 ticks with chapter names on hover/focus,
  `aria-current="true"` on the active one.
- **Progress readout**: `03 / 12` top-right, plus a thin gold progress line across the top.
- **Keyboard**: `→ ↓ PageDown Space` next; `← ↑ PageUp` previous; `Home`/`End` first/last;
  `1–9` and `0` + digit jump; `P` presenter panel; `F` presentation mode; `M` motion toggle;
  `?` shortcut help; `Esc` closes overlays / exits presentation mode.
- **Presentation mode**: requests fullscreen, hides the rail and progress into a slim bottom bar,
  raises the type scale one step, starts the 10-minute timer, and locks free scrolling to
  chapter-to-chapter transitions.
- **Presenter panel**: a slide-over holding this chapter's Thai script, its target time, the live
  elapsed clock, an on-pace / behind indicator, and the next chapter's headline. It is
  opt-in, never visible to the audience unless opened, and never rendered into the chapter
  itself.
- **Touch**: vertical swipe changes chapter; horizontal swipe also works; tap targets ≥ 44 px.
- **Accessibility**: `<main>` with 12 `<section role="region" aria-labelledby>`; a skip link; a
  visually-hidden live region announcing "Chapter 3 of 12, The Invisible Number"; visible focus
  rings; the rail is a real `<nav>` with buttons, not divs.
