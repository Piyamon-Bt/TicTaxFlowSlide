# TicTaxFlow — Visual & Motion Specification

Visual world: **"Ledger."** Deep navy rather than black, because black reads consumer-tech and
navy reads balance sheet — and this deck is pitched on a business-and-finance track. The product's
own violet is the working accent, the logo's pink-to-orange gradient is spent in exactly two
places, and everything else is neutral with a great deal of space around it.

Two references informed this deck, both structurally only. apple.com/th/macbook-pro gave the
pacing and the motion model: full-bleed opening, pinned scenes that scrub with scroll, ground
alternation as the section transition, product-first composition. The team's own shipped
TicTaxFlow UI gave the palette — the violet, the paper ground and the card treatment are matched
to the real product so the pitch and the thing being pitched look like the same company. No Apple
artwork, copy, colour value, font file or code is used anywhere.

---

## 1. Palette

Navy ground, the product's violet, and one gradient held in reserve.

| Token | Value | Role |
|---|---|---|
| `--black` | `#05060d` | Deepest surface — keycaps, overlay scrim |
| `--near` | `#0b0d1a` | The dark ground |
| `--near-2` | `#141830` | Raised dark surface — presenter panel, float card, help box |
| `--near-3` | `#1e2437` | The dark card on a light ground — the paid plinth, the "ours" column |
| `--paper` | `#f8fafc` | The light ground — matched to the product's own background |
| `--paper-2` / `--paper-3` | `#ffffff` / `#eef1f7` | Raised light surface / light fill |
| `--on-dark` | `#eef0f8` | Primary text on dark |
| `--on-dark-2` | `#99a0bc` | Secondary text on dark |
| `--on-light` | `#0f172a` | Primary text on light |
| `--on-light-2` | `#475569` | Secondary text on light |
| `--accent` | `#5b4be8` | The product's primary. Strokes, fills, focus rings, active states |
| `--accent-lt` | `#a99df7` | The accent as *text* on the dark ground |
| `--accent-dk` | `#4433c7` | The accent as *text* on the light ground |
| `--brand-a` / `--brand-b` | `#ff2d8e` / `#ffa13c` | The logo gradient's two stops |
| `--mint` | `#10b981` | Verified / running, taken from the product's own dashboard |
| `--silver` | 5-stop gradient | MacBook chrome |

`#5b4be8` is the shipped product's primary and is used throughout for strokes and fills, but as
text it only reaches 3.2:1 on the dark ground. Each ground therefore gets its own legible variant
rather than the raw brand value being pushed somewhere it cannot be read.

Contrast (WCAG AA needs 4.5:1 for normal text, 3:1 for focus rings and other non-text):

| Pair | Ratio | Verdict |
|---|---|---|
| `--on-dark` on `--near` | 15.0 : 1 | AAA |
| `--on-dark-2` on `--near` | 7.1 : 1 | AAA |
| `--on-light` on `--paper` | 17.1 : 1 | AAA |
| `--on-light-2` on `--paper` | 7.2 : 1 | AAA |
| `--accent-lt` on `--near` | 7.8 : 1 | AAA |
| `--accent-dk` on `--paper` | 7.9 : 1 | AAA |
| `--brand-a` on `--near` | 5.3 : 1 | AA |
| `--brand-b` on `--near` | 9.2 : 1 | AAA |
| `--mint` on `--near` | 7.2 : 1 | AAA |
| `--accent` focus ring on either ground | 3.2 : 1 / 5.6 : 1 | passes non-text |

**Nothing is dimmed with `opacity` to make it secondary** — secondary text uses a secondary token,
so the measured ratios above are the ratios that actually ship. The only exceptions are decorative
`aria-hidden` chrome: the scroll hint and the inactive rail ticks.

### Where the gradient is allowed

The pink-to-orange gradient is the logo's. It appears in exactly three places, and its scarcity is
what makes it read as the brand rather than as decoration:

1. the progress line across the top of the deck,
2. the ฿ glyph and the accumulation track on chapter 03 — the threshold moment,
3. the rule under the wordmark on chapter 06 — the product reveal.

Its pink stop, `--brand-a`, also carries the alert state wherever the threshold is in play: the
"฿157,650 remaining" line, the ⚠ mark, the second filing window on the chapter-05 year bar, and
the risk column on chapter 13. Nothing else in the deck is pink.

### Chapter grounds

| Ch | Ground | Reason |
|---|---|---|
| 01 | dark | the seller's desk at the end of the day; the screen is the only lit thing |
| 02 | dark | converging streams read best on navy |
| 03 | dark | the problem moment |
| 04 | dark | overwhelm |
| 05 | dark | urgency — the last and heaviest beat of the problem act |
| 06 | **light** | the exhale; product reveal |
| 07 | light | explanatory, calm |
| 08 | dark | the product glows; hero moment |
| 09 | light | the screenshots are light UI |
| 10 | light | the competitive read — clear-eyed, not dramatic |
| 11 | dark | funnel, focus |
| 12 | light | premium pricing |
| 13 | dark | feasibility and risk |
| 14 | dark | three words land like type on a poster |
| 15 | light | resolution, the people |

Chapters 01–05 are all dark on purpose: the entire problem act is one unbroken night, and the
ground flip at chapter 06 *is* the product reveal.

Each stage paints its own ground rather than trusting the WebGL clear colour, so a dark chapter
arriving after a light one is navy from its very first frame. Dark stages sit at 76 % opacity over
the canvas, which is what lets the depth layer read through them.

---

## 2. Typography

One family, no second voice. The editorial serif has been retired: Apple-grade pages set
everything in one grotesque and get their variety from size and weight, not from mixing faces.

**Sans** — `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue",
"Inter", "Segoe UI", Roboto, Arial, sans-serif`.

**Thai** — `"Noto Sans Thai", "IBM Plex Sans Thai", "Sarabun", Thonburi, "Leelawadee UI",
"Sukhumvit Set"`, line-height 1.4, never letter-spaced. Used for the presenter script and the
chapter-01 phone notifications.

**Mono** — `"SF Mono", ui-monospace, Menlo, Consolas` for the chapter counter and the ฿ marks
under the chapter-03 track.

All fonts are system fonts. No web font is fetched, so the deck opens offline with zero network
requests and cannot 404 on stage. Documented trade-off: exact glyph shapes vary by machine; the
scale is designed to survive that.

**Weight discipline:** headlines are **600**, not 800–900. Semibold with `-0.028em` tracking at
display size is the signature of the reference; heavy weights read as a different, louder deck.

### Type scale (fluid, clamped)

| Token | Size | Use |
|---|---|---|
| `--fs-mega` | `clamp(3.4rem, 13.5vw, 15rem)` | ฿1,800,000 |
| `--fs-hero` | `clamp(2.6rem, 7.4vw, 7.6rem)` | full-bleed chapter headlines (03, 04, 05, 07, 10, 13, 14) |
| `--fs-h2` | `clamp(1.9rem, 4.2vw, 4.2rem)` | headlines beside a device or a list (02, 08, 09, 11, 12, 15) |
| `--fs-lead` | `clamp(1.02rem, 1.5vw, 1.62rem)` | supporting lines |
| `--fs-eyebrow` | `clamp(.86rem, 1.05vw, 1.22rem)` | the gold label above each headline |
| `--fs-body` | `clamp(.92rem, 1.02vw, 1.12rem)` | card copy |
| `--fs-kicker` | `clamp(.64rem, .74vw, .8rem)` | captions, tags, disclosure notes |

Headlines use `text-wrap: balance` and cap at 16ch (22ch for `.wide`), so no headline is cropped
or orphaned at 16:9, laptop, tablet or 390 × 844. Below 900 px the three content-dense chapters
(05, 10, 13) carry `.inner.dense`, which drops their headline to `--fs-h2` — a hero-size headline
and three stacked columns cannot both fit a phone.

**Figures are tabular everywhere.** Every money value, counter and percentage in the deck sets
`font-variant-numeric: tabular-nums`, so a scrubbed number never jitters as its digits change
width. It is the one typographic detail that has to be right in a finance pitch.

### Platform logos

The four channel marks are the presenter's own files, packed by `tools/brand2assets.py` into
`src/js/brand-assets.js` as base64 PNGs at a common 96 px height and published to CSS as
`--logo-<name>` / `--logoar-<name>` at boot. On a dark ground each mark gets a white bed
(`background-color` + a 5 px `box-shadow` ring) so a dark wordmark still separates; inside the
white chips of chapter 02 that bed is switched off because the chip already provides it. LINE,
already a square app icon, fills its chip edge to edge. Marks are never recoloured, cropped into
new marks, or set beside the TicTaxFlow mark as a lockup.

---

## 3. Texture and edges

- **Paper grain** — one inline SVG `feTurbulence` data-URI at 3 % opacity over everything. One
  shared asset, no per-chapter cost.
- **Device chrome** — every mockup in the deck is the same MacBook: lid and base are a five-stop
  `--silver` gradient with an inset white hairline, plus a `drop-shadow()`. No image assets, and
  no second device language. The 3D iPhone that used to open the deck has been removed; its
  sources (`src/js/phone.js`, `src/js/phone-model.js`) are kept out of the build but left in the
  repository, which is also where the ~400 KB the payload lost went.
- **Cut-out edge** — the chapter-02 seller photograph is a transparent PNG with a soft
  `drop-shadow()` in CSS, not baked into the file, so the photograph can be swapped in one
  command.
- **Photographs keep their own colours.** The palette rule governs the deck's own graphics; the
  three team portraits, the chapter-02 seller, the four platform marks and the product
  screenshots are shown as supplied.

Retired in this revision, because they belong to the previous editorial world and fight the
reference: torn-paper SVG boundaries, halftone dot lattices, print crop marks, gold hairline
rules under kickers, and the display serif. Section transitions are now the ground change itself
(see §5).

Still deliberately avoided: blue SaaS gradients, glassmorphism as decoration, cartoon styling,
glowing AI brains, robots, and any floating object that doesn't mean something.

---

## 4. Three.js environmental layer

One fixed full-screen `<canvas>` behind all content (`position: fixed; inset: 0; z-index: 0`),
one `WebGLRenderer`, one `PerspectiveCamera` (fov 48), one `Scene`. Three.js r149 UMD is
**inlined into `index.html`**, so there is no CDN dependency and no network request.

### Camera

The camera never cuts. It eases between per-chapter target positions with a critically damped
spring (`ζ = 1`, `ω = 4.5`), plus pointer parallax. On top of that, **the chapter's own scroll
progress dollies the camera** (`setProgress`): the opening pushes in 16 world units across its
scene, other chapters 4–8. Canvas and DOM therefore read the same number and can never disagree
about how far into a chapter the audience is.

### Performance rules

- `requestAnimationFrame` drives everything. **No render work is bound to scroll events** —
  scroll only schedules one frame, which writes normalised progress into CSS custom properties.
- Pixel ratio capped at `min(devicePixelRatio, 1.5)`; on screens wider than 2560 px, 1.25.
- Particle systems for chapters more than one step away are `visible = false`; hidden systems
  skip their update.
- Draw calls at any moment: **≤ 6**. Total points alive: ≤ 2,400.
- The render loop pauses entirely when the document is hidden (`visibilitychange`) and when the
  Motion toggle is off.
- The loop self-throttles (halves the pixel ratio once) after a run of frames over 32 ms.

---

## 5. Motion model

**Everything is scrubbed, nothing is timed.** Each chapter is a tall `<section class="scene">`
whose `.stage` is `position: sticky` for the length of the scene. Every frame, the engine
publishes that scene's own scroll progress as `--p` (0 → 1) and, from it, a per-element entry
`--t` and exit `--x`. One CSS rule composes opacity, translate, scale and blur out of those two
numbers.

```
opacity   = t · (1 − x)
translateY = (1 − t)·--ty + x·--tyx
scale      = 1 − (1 − t)·--sc − x·--scx
blur       = (1 − t)·--bl
```

Because a frame is a pure function of scroll position, **scrubbing backwards is identical to
scrubbing forwards** — there is no animation state to get out of sync, and a presenter can hold
any moment simply by stopping.

Elements declare their window in markup: `data-r="in0 in1"` fades in, `data-r="in0 in1 out0 out1"`
also fades back out. Entry is eased `easeOutCubic`, exit `smoothstep`.

Named variants: `.a-soft` (short rise), `.a-far` (long rise), `.a-in` (scale-up out of a defocus —
the signature product-name arrival), `.a-hold` (cross-fade in place), `.a-l` / `.a-r` (slide in
from a side), `.a-mask` (clip-path wipe for imagery).

**Section transition:** sticky stages *tile* the viewport rather than overlapping — when one
scene's pinned range ends, its stage scrolls up exactly as the next slides in beneath it. That
push, plus the ground change, is the transition. There is no crossfade and no torn edge.

Scene lengths (in viewport heights) and the scroll-driven beat of each:

| Ch | `--len` | What scroll drives |
|---|---|---|
| 01 | 2.4 | Order rows land on the MacBook one at a time; the two counters are the running sum of what is on screen (11 orders, ฿12,970) |
| 02 | 2.4 | Seller scales in → four channel chips fly in from the frame edges → ratio, headline, lead |
| 03 | 3.0 | **The count.** ฿0 → 420K → 870K → 1.34M → 1.72M → 1.80M, tied to the scrollbar; the track fills and each ฿ mark lights as it is passed; at 1.80M one flash fires; then the headline and the two facts |
| 04 | 2.8 | Three questions cross-fade in place, one at a time, centre screen; receipts drift; the headline resolves last |
| 05 | 2.8 | **The year passes.** Fifteen month cells sweep in left to right, so the two filing windows arrive in the order the seller meets them; then the three facts |
| 06 | 2.0 | Ground flips to paper; the wordmark arrives out of a 14 px defocus at 0.91 scale; the gradient rule; supporting line |
| 07 | 2.2 | Headline, then the three assistant cards stagger in; each card's own vignette animates while the stage is live |
| 08 | 2.8 | The machine rises and scales 0.72 → 1.0 → the stat card fades up → revenue counts to ฿1,642,350, the bar fills to 91 %, ฿157,650 remaining |
| 09 | 3.0 | Scroll position **picks the screen** (1 → 2 → 3) and the matching step highlights; clicking a step scrolls to that screen's position |
| 10 | 2.4 | Headline, then the two columns land — solved on the left, still-manual on the right |
| 11 | 2.2 | The three funnel tiers narrow to 100 % / 78 % / 56 % → headline → the ฿200K–฿1.8M band |
| 12 | 2.2 | "Start Free." cross-fades to "Pay when you grow." → three plinths rise → closing line |
| 13 | 2.6 | Running / next / planned-for land in sequence, so the risks arrive last and on purpose |
| 14 | 2.6 | Three words, one at a time, replacing each other at display size |
| 15 | 2.0 | Headline → the bento cards rise in sequence → wordmark |

Total scroll length: **37.4 viewport heights** across fifteen chapters.

### The signature: the seller's year

Chapter 05 is built around one drawn object — fifteen month cells with the two Thai filing windows
lit, `ภ.ง.ด.94` in violet across Jul–Sep and `ภ.ง.ด.90` in the brand pink across Jan–Mar of the
year after. It is the deck's only bespoke diagram and it exists because "you file twice a year,
not once" is the single fact this audience most reliably has wrong, and a sentence does not fix
that. The cells sweep in left to right with scroll, so the year passes rather than appearing.

It also does structural work later: chapter 12 prices per filing round rather than per month, and
that decision only makes sense once the audience has seen these two windows.

### Presenting on top of a scrubbed page

Chapters declare **beat stops** (`data-stops="0.2 0.42 0.64 0.95"` on chapter 03). `→` glides to
the next stop — inside the current chapter if it has one left, otherwise the first stop of the
next chapter — so a live pitch keeps precise, repeatable control while the page still scrolls
freely for anyone reading it alone.

**A stop is a moment worth holding, never the blank entry frame.** Chapter 03's first stop is
0.20, not 0, because at 0 the number has not arrived yet; chapter 06's is 0.42, where the product
name has landed. The reveal plays *during the glide into* the stop, which is why pressing `5` on
stage shows the name arriving and then resting, rather than dropping the presenter onto an empty
slide. Chapter 01 is the only scene whose first stop is 0, because that is where the deck opens. The glide is a hand-rolled `requestAnimationFrame` tween on `easeInOutCubic`
(520–1150 ms, scaled by distance), not the browser's smooth scroll, so it has the same curve as
everything else. Any wheel or touch input cancels it immediately: the hand always wins.

### Reduced motion

`prefers-reduced-motion: reduce`, or the Motion toggle set to off:

- The WebGL canvas is not created; a flat `--near` ground stands in.
- **Every scene collapses to exactly one screen** (`--len` is ignored), so the deck becomes 15
  plain pages and the total scroll length drops from 37.4 viewport heights to 15.
- Scene progress is pinned at 1, so every element renders in its finished state and the scrub
  hooks print their final values (11 orders / ฿12,970, ฿1,800,000, ฿1,642,350, 91 %, ฿157,650),
  and the chapter-05 year bar shows all fifteen months.
- Beat stops collapse to one per chapter, so `→` steps chapter-to-chapter.
- The chapter-03 threshold flash does not fire; the chapter-07 scan line and the chapter-02 flow
  dashes do not animate; the chapter-01 rows appear without their entrance.
- **Nothing is removed from the page. Every fact stays present.**

---

## 6. Layout system

- Each scene is `calc(var(--len) * 100svh)`; each stage is `100svh` and `position: sticky`. `svh`
  rather than `vh` so mobile browser chrome cannot crop a headline.
- Content max-width 1440 px, gutters `clamp(22px, 5vw, 96px)`, spacious spacing scale.
- Primary target 16:9 (1920 × 1080, 1280 × 720). Secondary: 1440 × 900 laptop, 1024 × 768 tablet,
  390 × 844 phone.
- At ≤ 1180 px the two-column chapters collapse to one column in narrative order. `.split.rev` is
  named explicitly in that rule — it is more specific than `.split` and would otherwise keep its
  columns on a phone.
- At ≤ 900 px the chapter rail is hidden, chapter 02's radial diagram becomes a **row of the four
  marks under the seller** (a four-way radial cannot survive a phone), chapter 09 shows the
  description of only the step currently on screen, chapter 07's cards put their vignette beside
  their own copy, and chapters 05 / 10 / 13 take `.inner.dense` for a smaller headline. The
  chapter-05 year strip keeps all fifteen cells — that the year is long and the two windows are
  far apart is the whole point — and only its labels stack.
- Landscape phones under 560 px tall get `--scale: .82` so key numbers stay on screen.

---

## 7. Navigation & presentation chrome

- **Persistent rail** (right edge, desktop): 12 ticks with chapter names on hover/focus,
  `aria-current="true"` on the active one, the active tick gold and wider.
- **Progress readout**: `03 / 15` top-right (the total is written from `S.chapters.length`, so
  adding a chapter cannot leave a stale number in the chrome), plus a thin gold progress line across the top which
  tracks *continuous* scroll position, not chapter index.
- **Keyboard**: `→ ↓ PageDown Space` next beat; `← ↑ PageUp` previous beat; `Home`/`End`
  first/last; `1–9` and `0` + digit jump to a chapter; `P` presenter panel; `F` presentation mode;
  `M` motion toggle; `?` shortcut help; `Esc` closes overlays / exits presentation mode.
- **Presentation mode**: requests fullscreen, hides the rail and hint, raises the type scale one
  step (`--scale: 1.08`), dims the top bar until hovered, and starts the 10-minute timer.
- **Presenter panel**: a slide-over holding this chapter's Thai script, its target time, the live
  elapsed clock, an on-pace / behind indicator, and the next chapter's headline. Opt-in, never
  visible to the audience unless opened, never rendered into the chapter itself.
- **Touch**: vertical swipe scrolls natively (and therefore scrubs); a horizontal swipe steps a
  beat; tap targets ≥ 44 px.
- **Accessibility**: `<main>` with 12 `<section role="region" aria-labelledby>`; a skip link; a
  visually-hidden live region announcing "Chapter 3 of 15: Invisible number"; visible focus rings;
  the rail is a real `<nav>` with buttons. The chapter-03 count is `aria-hidden` with a static
  screen-reader sentence beside it, so assistive tech is not read a number that changes on every
  frame.
