# QA report

> ## ⚠ This report predates two redesigns — re-run before relying on it
>
> The deck has since moved from **twelve snap-locked slides** to **fifteen pinned, scroll-scrubbed
> scenes** (see `visual-motion-spec.md` §5), changed palette from black-and-gold to the
> navy-and-violet "Ledger" system (§1), replaced the 3D iPhone with a MacBook so every mockup is
> the same device, and added chapters 05 (Why Now), 10 (The Gap) and 13 (Feasibility). Everything
> below was measured against the old structure, so the tables are historical, not current.
>
> **Re-checked by hand after the redesign** (Chromium, 1440 × 900 and 390 × 844):
>
> | Check | Result |
> |---|---|
> | All 15 scenes render, dark and light grounds correct | pass |
> | Chapter-03 count scrubs 0 → ฿1,800,000 and back | pass |
> | Chapter-07 card reaches ฿1,642,350 / 91 % / ฿157,650 | pass |
> | Chapter-08 screen follows scroll position, 1 → 2 → 3 | pass |
> | `→` steps beat-by-beat, then chapter-to-chapter | pass |
> | Motion off: scenes collapse to 12 screens, final values printed | pass |
> | Console errors | none |
> | 390 × 844: chapters 02, 05, 07, 09, 10, 13 recomposed for one column | pass |
> | Chapter-01 feed counters equal the sum of the rows shown (11 / ฿12,970) | pass |
> | Chapter-05 year strip sweeps; both filing windows legible at 390 px | pass |
> | Chapter counter reads `/ 15`, written from `S.chapters.length` | pass |
> | Chapter targets sum to exactly 600 s | pass |
> | No content taller than its stage at 390 / 1280 / 1440 / 1920 | pass |
>
> **Not re-run:** the Playwright suite in `test/`. Playwright is not installed in this
> environment, so `shoot.js`, `func.js`, `perf.js` and `summary.js` have **not** been executed
> against the redesign. Two of them also need updating first:
>
> - `func.js` asserts that one `PageDown` changes the chapter number. It now advances a *beat*,
>   which may stay inside the same chapter — the assertion needs to allow that.
> - `shoot.js` waits on `.chapter.is-active`; the class no longer exists. Scene progress is
>   published as `--p` on each `.scene` instead.
>
> Frame rate under the new model has **not** been measured on a real GPU. The engine does one
> `requestAnimationFrame` per scroll burst and writes only custom properties, but that claim is
> reasoned, not benchmarked.

---

Build tested: `index.html`, 2.00 MB (the current build is ~1.6 MB — the 3D phone mesh was
removed). Inlined binary payload at the time: the 3D phone
mesh (406 KB), the parcel and banknote prop meshes (41 KB), the four platform logos (94 KB), four
product screenshots (259 KB), the chapter-02 seller photograph (259 KB) and three chapter-12 team
photographs (202 KB), all base64.
Harness: Playwright + Chromium 1194, headless, software rendering (SwiftShader — **no GPU in the
test environment**). Scripts are in `test/`: `shoot.js` (per-viewport chapter sweep + content
audit), `func.js` (navigation, panels, modes, landmarks), `perf.js` (frame-rate probe),
`summary.js` (roll-up).

---

## 1. Viewport sweep — all 12 chapters visited in order

| Run | Viewport | Chapter sequence | Console errors / failed requests | Required facts missing | Headings cropped | Horizontal overflow | Chapters taller than the viewport |
|---|---|---|---|---|---|---|---|
| desktop | 1920 × 1080 | 1→12 ✅ | 0 | 0 | 0 | 0 | none |
| desktop, reduced motion | 1920 × 1080 | 1→12 ✅ | 0 | 0 | 0 | 0 | none |
| laptop | 1440 × 900 | 1→12 ✅ | 0 | 0 | 0 | 0 | none |
| 16:9 projector | 1280 × 720 | 1→12 ✅ | 0 | 0 | 0 | 0 | none |
| mobile | 390 × 844 | 1→12 ✅ | 0 | 0 | 0 | 0 | 06, 12 |
| mobile, reduced motion | 390 × 844 | 1→12 ✅ | 0 | 0 | 0 | 0 | 06, 07, 08 |

"Headings cropped" checks every `.headline`, `.mega`, `.revealtext` and `.q-line` against the
viewport rectangle on each chapter. "Required facts missing" checks that 21 specific strings —
every headline and every number in the content map — are present in the rendered text.

**Known and accepted:** on a 390 × 844 phone, chapter 06 (three stacked assistant cards) and
chapter 12 (three stacked team cards) are taller than the viewport and scroll inside the chapter. All key numbers in those chapters are above the fold; the overflow
is explanatory copy. On every presentation-sized screen (1280 × 720 and up) no chapter exceeds
the viewport.

## 2. Console, network and assets

- **0** JavaScript errors, **0** failed requests, across all six runs.
- **0** external requests of any kind: no CDN, no font service, no images. Everything — CSS,
  markup, Three.js r149 (UMD), the chapter-01 phone mesh, app scripts, favicon, paper-grain
  texture — is inlined into `index.html` as text or data URIs. Nothing can 404 on stage.
- Only console output is a SwiftShader performance notice from the software renderer, which does
  not occur on hardware.
- All inline scripts parse: `node --check` passes on each source file, and the assembled build
  runs without a syntax error in the browser.

## 3. Navigation and presentation controls

| Check | Result |
|---|---|
| `PageDown`, `Space`, `→`, `↓` advance | ✅ 01→02→03 |
| `↑`, `←`, `PageUp` go back | ✅ 03→02 |
| `Home` / `End` | ✅ →01 / →12 |
| Single-digit jump (`7`) | ✅ →07 |
| Two-digit jump (`1` `1`) | ✅ →11 |
| Presenter panel (`P`) opens with the right chapter, Thai script, target, pace chip | ✅ |
| `Esc` closes the panel | ✅ |
| Help overlay (`?`) opens, `Esc` closes | ✅ |
| Motion toggle (`M`) sets reduced + no-webgl, `aria-pressed` follows | ✅ |
| All facts still present with motion off | ✅ 0 missing |
| Motion toggle back on | ✅ |
| Chapter rail built with 12 buttons, `aria-current` tracks the active chapter | ✅ |
| Live region announces "Chapter 11 of 12: Why we win" | ✅ |
| Scroll wheel / trackpad with snap | ✅ manual |
| Horizontal swipe on touch; vertical swipe via native snap | ✅ code path exercised in the mobile run |
| Presentation mode (`F`) | ✅ styling applies; fullscreen itself cannot be asserted headless |
| Deep link `#ch-N` restores the chapter | ✅ |

## 4. Accessibility

| Check | Result |
|---|---|
| `<main>` landmark | ✅ |
| 12 × `<section role="region" aria-labelledby>` | ✅ |
| `<nav aria-label="Chapters">` with real buttons | ✅ |
| Skip link to the deck | ✅ |
| Polite live region announcing chapter changes | ✅ |
| Visible focus ring (gold, 2 px, offset) | ✅ |
| Decorative SVG/canvas marked `aria-hidden` | ✅ |
| Diagrams carry descriptive `role="img"` + `aria-label` (chapters 01, 02, 04, 07, 09, 12) | ✅ |
| Counters expose their final value via `aria-label` while animating | ✅ |
| `prefers-reduced-motion` honoured: no WebGL context created, entrances collapse, counters print, chapter-03 flash suppressed | ✅ |
| Contrast AA or better for every text/ground pair | ✅ computed table in `visual-motion-spec.md` |
| Thai text uses a Thai font stack with raised line-height, never letter-spaced | ✅ |

## 5. Performance

Frame-rate probe, one second of `requestAnimationFrame` per chapter, 1920 × 1080, **software
rendering with no GPU**:

| Ch | 01 | 02 | 03 | 04 | 05 | 06 | 07 | 08 | 09 | 10 | 11 | 12 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| fps | 8 | 24 | 37 | 36 | 39 | 38 | 18 | 25 | 38 | 40 | 39 | 27 |

The ceiling in this environment is ~34 fps even on the near-empty Chapter 05, so these numbers
measure the software rasterizer, not the page. JS heap stays at ~10 MB across the full deck.

**Chapter 01 (the 3D phone) is the one number to read carefully.** It costs 8 fps *in software*.
That cost was isolated: with the screen-texture upload switched off entirely the figure is still
8 fps, so it is not the canvas or the texture — it is per-pixel PBR shading with an environment
map, rasterised on the CPU across roughly a third of a 1920 × 1080 frame. That is precisely the
work a GPU does for free; on the presenting Mac the chapter should hold the display refresh rate.
**Verify it on the presenting machine before the pitch** (step 2 of §9), and if any venue laptop
struggles, `M` swaps the whole chapter for the static phone in one keystroke.

Chapters 07 and 12 sit at roughly 1.5–2× the baseline cost because of large soft sprites and the
dashboard glow — unchanged from the previous build.

Work done to keep the budget honest:

- No render work is bound to scroll events; scroll only writes a normalised value.
- Particle systems for inactive chapters are `visible = false` and skip their update; at most one
  feature system plus ambient dust is alive at a time (≤ 6 draw calls, ≤ 2,400 points).
- Pixel ratio capped at 1.5 (1.25 above 2560 px). The layer is soft blobs, so this is visually
  identical to 2× and roughly 45 % cheaper in fill.
- Loop stops on `visibilitychange` and when motion is off; a WebGL context-loss handler stops it
  cleanly instead of throwing.
- After a run of slow frames the renderer drops to 1× pixel ratio once, automatically.
- CSS `backdrop-filter` and a 34 px `filter: blur()` were removed during QA; the dashboard glow is
  now a plain radial gradient. That change alone recovered ~40 % on Chapter 07.

## 6. Content verification

- All 12 chapters present, in the source order, one message each.
- Every headline, number and story beat from the source outline appears in its chapter — checked
  programmatically against 21 required strings and by reading `content-map.md` against the source.
- Arithmetic re-checked: 91 % and ฿157,650 are both correct against ฿1,642,350 / ฿1,800,000.
- Chapter time targets total 9:40 within the 10:00 slot.
- **Chapter 12's three names are placeholders** (the photographs are all in place) and are flagged in three places
  (`content-map.md`, `factual-verification.md` §3.7, `presenter-guide.md`). Nothing about a real
  person was invented.
- Chapter 07 now shows the team's own live landing page; its product claims are flagged for
  confirmation in `factual-verification.md` §3.6.
- No invented market statistic, seller count, TAM/SAM/SOM, traction claim, partnership or
  integration anywhere. Roadmap items labelled on screen; pricing labelled proposed; market tiers
  carry visible placeholders. See `factual-verification.md`.
- No Shopify asset, text, image, font or code. Every illustration is either original SVG, generated at
  runtime, except the four platform logos, which are the presenter's own supplied files used
  unmodified and referentially (chapters 01, 02, 08) — see `factual-verification.md` §7 and §7a.

## 7. Chapter 01 rebuild — what was checked

The opening chapter was rebuilt around the presenter's own iPhone model: no copy at all, a 3D
phone, and a lock screen where order notifications keep arriving.

| Check | Result |
|---|---|
| OBJ converts without loss of the visible shell | ✅ 12,805 source faces → 25,511 triangles, 17,608 vertices, 5 material groups |
| The dropped 127k-face object is invisible in the result | ✅ it is the earpiece grille, 15 × 3.6 × 0.09 model units, and the screen plane covers that area |
| Screen plane aligns with the model's front glass | ✅ measured from the mesh: front face at z-min, screen rect 94.75 × 211.5 model units, corners rounded in the canvas |
| Notifications arrive, stack, and scroll off | ✅ one every 0.72–1.14 s; verified across an 8-second capture (counter went 38 → 42) |
| Thai renders on the canvas texture | ✅ (test box substitutes a Thai font; check on the presenting Mac) |
| No on-screen copy remains | ✅ the removed Thai and English lines are gone from the DOM; they live only in the presenter script |
| Chapter still announced to assistive tech | ✅ visually-hidden `<h1>` describes the scene; the phone carries a descriptive `role="img"` label |
| Motion off / no WebGL | ✅ an HTML phone with the same lock screen and six notifications replaces the 3D one |
| Fades cannot strand an expensive object | ✅ system opacity now eases on wall-clock time and snaps to zero more than one chapter away — before this fix a slow chapter-01 frame kept the phone rendering through chapters 02 and 03 |

## 7. Fixed during QA

| Issue found | Fix |
|---|---|
| `TypeError` on boot when the motion toggle ran before the first chapter was set | Guarded the chapter lookup |
| Chapter index computed from viewport height broke when a chapter was taller than the viewport (mobile skipped chapters 07, 09, 11) | Index now resolves to the nearest section `offsetTop` |
| Chapter-02 node centring was destroyed by the reveal transform, so connector lines missed their nodes | Reveal moved to an inner wrapper; connector endpoints recomputed |
| Chrome (brand, counter, rail, hint) invisible on ivory chapters | Chrome colour now follows the active chapter ground |
| Closed presenter panel's box-shadow bled a dark band down the right edge | Panel is `visibility: hidden` when closed |
| Default paragraph margins blew out spacing; Chapter 07's dashboard overflowed the phone frame | Global `p { margin: 0 }` plus explicit spacing rules |
| Chapter-03 revenue particles too dense, reading as noise | Halved the count, lowered opacity, confined to the lower band |
| Collage planes showed hard rectangle edges | Soft-edged generated texture |
| Rail label overlapped chapter content on the active chapter | Label now shows on hover/focus only |
| Brand and counter collided on a 390 px viewport | Compact top bar under 560 px |
| ฿ glyph collided with the following digit at display sizes | Padding and letter-spacing correction |
| Logo mark read as a grey box at 22 px | Redrawn as an outlined mark with a rising line |
| **Chapter 01 rebuild:** the phone's fade was frame-count based, so at 8 fps it kept rendering through chapters 02–03 (7 fps there) | Fades moved to wall-clock time plus a hard snap for distant chapters; chapters 02–12 back to baseline |
| Chapter-01 screen texture regenerated a full mip chain on every upload | `generateMipmaps = false`, `LinearFilter`; redraw capped at 24 fps |
| Keyboard navigation appeared to skip chapters | Symptom of the above frame-rate collapse, not a navigation bug; resolved with it and re-verified |
| Notification stack overlapped the "orders today" pill | List top and clip region moved down |
| Screen plane had square corners over the rounded glass | Canvas clipped to a 60 px-radius rounded rect and the plane inset slightly |
| **Chapter 07 rebuilt:** phone mockup → laptop showing the real product | A CSS MacBook (aluminium lid, glass screen, tapered base) carries the TicTaxFlow landing page, padded to 16:10 with the page's own white rather than cropping the nav off the sides; the source outline's numbers moved to a card floated over the corner, so nothing was lost |
| **Chapter 08 simplified:** two tall stacked columns → two horizontal flows | Five nodes became two rows of three; the roadmap row is dashed and greyed end to end. On a phone each row folds to a vertical flow with turned arrows. It also stopped being taller than the viewport at 390 × 844 |
| **Chapter 12, third photo card filled** | The pending `รอรูป` card is gone, its CSS with it; `p3` is packed by `tools/team2assets.py` like the other two |
| **Photographs restored to their original colours** at the presenter's request | The CSS `grayscale(1)` on the ch.12 cards and the `GREYSCALE` pass in `tools/seller2asset.py` are both off. The palette rule now covers only what the deck draws itself — photographs and brand marks are shown as supplied |
| **Chapter 12 rebuilt twice:** seller collage → three team cards → a bento grid in the style the presenter supplied | Three photo cards with white name badges interleaved with three pastel message cards, headline and wordmark on the left. Two of the team's own photographs are in place, cropped to a shared 3:4 frame and nothing else. **All three photographs are in place; the three names are still placeholders and must be filled in** |
| **Chapter 02 centre image, twice:** geometric avatar → drawn halftone sticker → the presenter's own photograph | The photograph is trimmed, resized and desaturated by `tools/seller2asset.py`; the drawn stand-in SVG was deleted. The figure is taller than the sticker was, so the node moved to 49 % and the frame narrowed to `clamp(150px, 17vw, 232px)` — otherwise the "One taxpayer" label collided with the LINE node below it. Glow retuned from a white sticker edge to a gold rim |
| A roadmap node kept the "built" border colour | Roadmap rows now override border colour as well as style |
| **Platform logos added:** the deck named channels in plain text | The four supplied logos now appear in chapters 01 (phone notifications and the fallback), 02 (channel nodes) and 08 (roadmap nodes), on white tiles; LINE's square icon fills its tile like an app icon. Marks trimmed and scaled only. |
| **White tiles removed from the logos** at the presenter's request | The Lazada file was supplied as a JPEG on white, so that white is now keyed out and the colours un-composited, giving a true transparent mark. Without the tile its navy wordmark disappeared on the dark chapters, so a 1.5 px white hairline glow sits behind every mark on ink grounds (CSS `drop-shadow` in the deck, `shadowBlur` on the chapter-01 canvas). The mark's own pixels are unchanged; only what is behind them differs |
| **Chapter 08 rebuilt again:** Today/Tomorrow flow diagram → three real screens on the chapter-07 laptop | The screens cross-fade every 4.2 s and the step list follows; a click holds one and stops the rotation for the session. Under reduced motion the timer never starts. The honesty beat the diagram carried moved into the line under the laptop, which now also says the on-screen figures are test data. On a phone the laptop moves above the steps so the visual still leads |
| **3D props added** (parcels on ch.02, banknote stacks on ch.03) | Two `InstancedMesh` systems — three parcels and four note stacks, in the corners of the frame, far back, at 30 % and 46 % opacity. Two extra draw calls, both faded out on every other chapter |
| The parcel model arrived at 9,008 triangles of subdivided flat panels | Welded onto a 64-cube grid and re-emitted flat-shaded: 724 triangles, same silhouette, asset 123 KB → 31 KB |
| The props cost 20 fps on chapter 02 in software | `MeshStandardMaterial` (full PBR + environment map) swapped for `MeshPhongMaterial`, and one parcel dropped. Recovered 10 of the 20; the rest is transparent-blend fill, which a real GPU absorbs. Ch.02 is 24 fps under SwiftShader against a ~42 fps ceiling — **verify on the presenting machine**, and `M` still removes the whole layer |
| **Palette rebuilt: black / white / gold** (the warm ivory read as cream and was rejected) | Every hardcoded colour in the CSS, the four HTML fragments, the lock-screen canvas and the WebGL layer was remapped. The ivory ground became a cool white `#FBFBFC`, the charcoal a near-black `#0B0B0C`, and magenta and lime were retired: the `--magenta` token now holds a bright gold `#F2CE6B` and `--lime` plain white, so several hundred existing rules kept working untouched. Team photographs are greyscaled in CSS (badge and tint unaffected); the bento pastels became neutral greys plus one pale gold; the "why we win" words are now white / gold / white. Re-verified on all six configurations: no contrast pair fell below AA, and all but one is AAA |
| Only remaining colour is deliberate | The four brand marks (their own colours, on white tiles) and the real product screenshot on the chapter-07 laptop. A scan of every source file confirms nothing else outside black, white, grey and the three golds |

## 8. Not covered by automated tests

- **Chapter 01's frame rate on real hardware** — the single most important thing to check, see §5.
- Real fullscreen behaviour and the projector itself — verify on the presenting machine.
- Actual touch gestures on a physical phone (the swipe handler was exercised, not finger-tested).
- Safari and Firefox rendering (built with standard features only: no `:has()`, no container
  queries, no individual transform properties; `svh` units and `text-wrap: balance` degrade
  gracefully).
- Thai glyph shaping on the presenting Mac. The test environment substituted a Thai font; macOS
  will use Thonburi or an installed Noto Sans Thai. Check Chapters 01 and 04 on the real machine.
- Screen-reader pass with VoiceOver.

## 9. Recommended pre-pitch checks on the presenting machine

1. Open `index.html`, press `F`, confirm Chapter 01 fills the projector with no cropping.
2. **Watch Chapter 01 for ten seconds.** The phone should float smoothly and notifications should
   arrive about once a second. If it stutters on that machine, present with `M` on.
3. Arrow through all 12 chapters once; watch Chapter 01's notification text and Chapter 04 for
   Thai typography.
4. Press `P`, confirm the script is readable and the clock runs; close it before the audience sees it.
5. Press `M` and arrow through once more — this is the fallback if the venue machine struggles.
6. Confirm the room's aspect ratio: the deck is optimised for 16:9.
