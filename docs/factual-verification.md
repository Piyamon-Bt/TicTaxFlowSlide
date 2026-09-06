# Factual verification checklist

Everything on the site traces to the source pitch outline or the project brief. Nothing was
invented. This checklist lists every claim that a judge, investor or regulator could challenge,
what it rests on, and what must be confirmed before the deck is used publicly.

**Status key:** ⬜ to verify · ✅ verified in-deck (self-labelled, no external check needed)

---

## 1. Tax and legal statements — verify before any public use

| # | Claim on screen | Chapter | Rests on | Status |
|---|---|---|---|---|
| 1.1 | ฿1,800,000 is the VAT registration threshold | 03, 05, 08, 11 | Source slide 3 | ⬜ Confirm the current threshold and its wording with the Revenue Department before public use. The site already labels it "figure as given in the pitch source" and carries an on-slide note to confirm current rules. |
| 1.2 | Reaching the threshold may create a VAT-registration duty | 03 | Source slide 3, which is itself conditional (*"อาจมีหน้าที่เกี่ยวกับการจด VAT"*) | ⬜ Keep the conditional phrasing. Do not upgrade "may" to "must" without a legal check. |
| 1.3 | Expenses can be deducted at actual cost or by a standard/lump-sum method | 04 | Source slide 4 (which frames the second branch as มาตรา 40(8)) | ⬜ The site says "Actual cost" / "Standard — rate by activity type" and cites no section number, deliberately. Confirm the correct legal reference before adding one. |
| 1.4 | Filing periods exist and matter | 04, 07 | Source slide 4 and 6 | ⬜ Generic and safe, but confirm before naming any specific date or period. |

| 1.5 | **From 2026, e-commerce platforms report seller income to the Revenue Department directly** | 05 | Project brief (ปี 2569) | ⬜ **The highest-risk claim in the deck.** It is the whole argument of chapter 05 and it names a year. Confirm the effective date, the scope (which platforms, which sellers, which data) and whether it is in force or announced, before any public use. The slide carries a visible caveat. If it cannot be confirmed in time, soften the headline to "the platforms are starting to report" and drop the year. |
| 1.6 | **Two filings a year: ภ.ง.ด.94 (Jul–Sep) and ภ.ง.ด.90 (Jan–Mar)** | 05 | Project brief, Revenue Code | ⬜ Named periods and named forms — exactly what §1.4 previously avoided. Confirm both form numbers and both windows with the Revenue Department. Chapter 12's pricing is argued from these two windows, so if they change, the business model slide changes with them. |
| 1.7 | **The standard deduction is 40–60 % by activity type** | 05 | Project brief, Revenue Code | ⬜ A specific numeric band. Confirm the rates and which activities they apply to. |
| 1.8 | **Online selling income is เงินได้ประเภท 40(8)** | 05, 10, 13 | Project brief, Revenue Code | ⬜ The site now names the section, where it previously avoided doing so (see §1.3). Confirm the classification is correct for the seller profile being described. |
| 1.9 | **Crossing ฿1.8M means a VAT filing every month** | 05 | Project brief | ⬜ Confirm the filing frequency and any exceptions. |

**Rule for the presenter:** the deck raises tax questions; it does not answer them on screen.
If asked for a legal position, say the product's rules are defined by the team and the legal
positions are pending professional review.

## 2. Market — nothing is claimed

| # | Item | Chapter | Status |
|---|---|---|---|
| 2.1 | Number of online sellers in Thailand | 09 | ✅ Not stated. Each funnel tier shows "Sizing pending external validation". |
| 2.2 | TAM / SAM / SOM, market value | 09 | ✅ Not stated. The chapter says on screen that sizing requires third-party data. |
| 2.3 | ฿200K – ฿1.8M target band | 09 | ✅ From source slide 9. It is a *targeting choice*, not a market measurement, and is presented as such. |

To add real sizing later, source it (NSO, ETDA, DBD, platform disclosures), cite it on the slide,
and delete the placeholder chips.

## 2a. Competitive claims — chapter 10

| # | Claim on screen | Rests on | Status |
|---|---|---|---|
| 2a.1 | "Thai tax tools, iTAX among them, do this well" (calculation, filing, deduction look-up) | Team's own review | ⬜ Fair and complimentary, but it names a real company. Keep the framing positive; never characterise a competitor's product as bad. |
| 2a.2 | **"Nobody consolidates" — no tool in the market pulls sales from multiple platforms automatically** | Team's own review of tools available today | ⬜ **The most challengeable claim in the deck after §1.5.** It is a negative claim about an entire market, which cannot be proven, only surveyed. The slide says "Based on our own review of the Thai tax tools available to sellers today" in as many words — keep that line visible. In Q&A, answer with what was checked and when, not with certainty. |

If either claim cannot be stood behind, chapter 10 still works with the right-hand column alone:
the four consolidation steps are hard whether or not a competitor has solved them.

---

## 3. Product capabilities

| # | Claim | Chapter | Status |
|---|---|---|---|
| 3.1 | READ / CHECK / EXPLAIN exist today | 06, 08 | ⬜ Confirm the built prototype actually does all three before presenting them as "built & tested". |
| 3.2 | Channel integrations | 08, 10 | ✅ Labelled roadmap, with an explicit on-screen denial of any partnership. Chapter 08 names the platforms in that sentence only — their logos are no longer on the slide. |
| 3.3 | Threshold alerts, bank-slip ingestion, dashboard automation | 07, 10 | ✅ Labelled **Roadmap** inline. |
| 3.4 | The Chapter 07 revenue card (฿1,642,350 / 91 % / ฿157,650) | 07 | ✅ On-slide note says the revenue figures are illustrative; the source outline's example numbers. |
| 3.5 | The Chapter 01 phone lock screen | 01 | ✅ Illustrative concept UI — see §8. |
| 3.6 | **The Chapter 07 laptop shows the real TicTaxFlow landing page** | 07 | ⬜ The page itself claims the AI agent will "analyze, categorize, and optimize your Thai personal income tax deductions in seconds". That is a product claim on your own site, shown to judges. Confirm the shipped product does it before presenting, or change the page. |
| 3.8 | **The Chapter 08 laptop shows three screens of the working build** | 08 | ⬜ These are the real product, so what they say is a claim. Two things to confirm: (a) the features page promises "duplicate detection to prevent double counting" and "automatic currency normalization" — confirm both ship; (b) the dashboard shows ฿35,000 of deductions from 2 verified documents and a Health Insurance limit at 100 %. The on-slide line calls these test data. Do not describe them as usage or traction. Note the third screen also renders a **"Infinity%"** progress label on the Donation row — a divide-by-zero in the build, visible to judges. Fix it or use a different capture. |
| 3.7 | Chapter 12 team cards | 12 | ⬜ **Names are placeholders** (*ชื่อ–นามสกุล*) — fill them in before presenting. All three photographs are in place and are the team's own files, cropped and resized only. |

## 4. Business model

| # | Claim | Chapter | Status |
|---|---|---|---|
| 4.1 | ฿199–299 per filing period | 10 | ✅ From source slide 10, labelled "Proposed pricing". ⬜ Confirm before quoting to a customer. |
| 4.2 | ฿400–600 per year | 10 | ✅ Same. |
| 4.3 | Free tier contents | 10 | ✅ From source slide 10, labelled "Proposed". |

## 5. Numbers used in the story — arithmetic checked

| Check | Result |
|---|---|
| 1,642,350 ÷ 1,800,000 = 91.24 % → shown as **91 %** | ✅ correct |
| 1,800,000 − 1,642,350 = **157,650** | ✅ correct |
| Ladder percentages: 420K→23 %, 870K→48 %, 1.34M→74 %, 1.72M→96 %, 1.80M→100 % | ✅ correct to the nearest percent |
| Chapter time targets sum | 9 min 40 s of a 10 min slot ✅ |

## 6. Traction and partnerships

The site claims **no** users, revenue, pilots, awards, advisors, partnerships, letters of intent
or press. If any exist, add them deliberately with evidence — do not let them appear by
implication.

## 7. Intellectual property

| Item | Status |
|---|---|
| Shopify assets (artwork, text, code, fonts, layout) | ✅ None used. The reference site informed structure and pacing only. |
| Platform logos / wordmarks (Shopee, Lazada, Facebook, LINE) | **Used, from files supplied by the presenter.** Referential use — they name the real channels a seller sells through. Each mark is used **unmodified**: trimmed of empty margin, scaled to a common height, and — for the Lazada file, which was supplied as a JPEG on white — that white backdrop keyed out so the mark sits on the page rather than on a tile. Colours are un-composited back to the original, so no mark is recoloured, redrawn, stretched, combined with another mark, or placed next to the TicTaxFlow mark in a way that suggests a lockup. On dark chapters a white hairline glow sits *behind* the mark for legibility; the mark itself is untouched. ⬜ See §7a before any public or commercial use. |
| Team photographs (ch.12) | **All three supplied by the presenter**, used as given — cropped to a shared 3:4 frame and resized, in their original colours. No face is generated, swapped or retouched. ⬜ Confirm each person consented to appear in the deck. |
| Chapter-02 seller photograph | Supplied by the presenter, used as given — trimmed of its transparent margin and resized, in its original colours. Not generated, retouched or composited. ⬜ Confirm you hold the right to use this image (own shoot, model release, or a licence that covers a public pitch) and that the person pictured consented. |
| Other images / photography | ✅ None. Every remaining illustration is original SVG or generated in canvas/WebGL. |
| 3D phone model | Supplied by the presenter (Cinema 4D / OBJ export). Converted to a compact mesh and re-materialled; no third-party texture is bundled. Confirm you hold the right to present it. |
| Chapter 07 laptop | Drawn in CSS — an original, generic aluminium laptop shape, not a traced or copied product rendering. The screen carries the presenter's own product screenshot. |
| Fonts | ✅ System fonts only; no font file is embedded or fetched. |
| Third-party code | Three.js r149, MIT, bundled with its licence in `vendor/`. |
| Emoji | 👋 and ⚠ are Unicode characters rendered by the OS, not images. |

### 7a. Using the platform logos — what to keep true

The marks belong to Shopee, Lazada, Meta and LY Corporation. On this deck they are used
*nominatively*: to say "this seller receives orders here", which is how a pitch deck normally
names the channels a business touches. That use is normal and expected, but it depends on three
things staying true, and all three are enforced in the build:

1. **No endorsement, partnership or integration is implied.** The logos appear only on chapters 01
   and 02, where they label where a seller's own orders arrive — never on a slide describing what
   TicTaxFlow does. Chapter 08 states on screen that no partnership or integration exists, and names
   the platforms in that sentence only. Never move a platform logo onto a slide that describes what
   TicTaxFlow already does.
2. **The marks are unaltered.** Trimming margin, scaling, and keying out the white JPEG backdrop the
   Lazada file arrived on are the only operations (`tools/brand2assets.py`); the un-composite step
   returns the mark's own colours, and nothing is recoloured, cropped into a new mark, or restyled.
   The white hairline used on dark grounds is drawn *behind* the mark, never over it.
3. **They never share a lockup with the TicTaxFlow mark**, and none appears larger or more
   prominent than TicTaxFlow's own branding.

⬜ Before publishing the deck outside a pitch room — putting it on a website, in an ad, on a
product page, or in printed marketing — check each platform's brand guidelines, since several ask
you to request permission for anything beyond editorial reference. Inside a competition pitch this
is ordinary practice.

## 8. Chapter 01 screen — illustrative props

The opening chapter carries no written claim: it is a MacBook with an order feed filling up.
Everything drawn on that screen is a story prop, not data:

| On the screen | Status |
|---|---|
| Order amounts (฿640 – ฿3,150) | Illustrative. Typical small-order values, not measured. |
| "11 orders" counter | Illustrative. It is the arithmetic sum of the `data-ord` values on the rows shown, so it can never disagree with the list beneath it. |
| "฿12,970" day total | Illustrative. Likewise the exact sum of the eight row amounts — checked: 2,380 + 1,180 + 860 + 2,450 + 790 + 640 + 1,520 + 3,150 = 12,970. |
| Relative times ("ตอนนี้", "6 นาที") | Illustrative, fixed. |
| Platform logos (Shopee, Lazada, Facebook, LINE) | The seller's real channels, as in the source story. The marks are the presenter's own supplied files, used unmodified on white — see §7a. Nothing on this screen claims a relationship with any of them. |

Nothing here is presented as traction, revenue or a platform integration, and the chapter
carries no on-screen text that could be read as a claim. Note that the feed is **concept UI for
the story**, not a TicTaxFlow screen — it is the seller's problem, not the product. The real
product screens are chapters 08 and 09. If a judge asks, the honest answer
is: an illustration of a normal selling day, not our numbers.

## 9. Before the deck leaves the room

- [ ] Item 1.1 and 1.2 confirmed against current Revenue Department rules
- [ ] Item 3.1 confirmed against the actual prototype
- [ ] Decide whether pricing stays visible to this audience
- [ ] If market numbers are added, sources cited on the slide
- [ ] Presenter has read `presenter-guide.md` §"If a judge pushes"
- [ ] §7a read if the deck will be used anywhere other than a live pitch
- [ ] **Chapter 12: the three placeholder names replaced, and the third photograph added**
- [ ] Everyone pictured on chapter 12 has agreed to appear
- [ ] Item 3.6: the landing-page claims shown on the Chapter 07 laptop are true today
- [ ] Item 3.8: the Chapter 08 screens — feature claims ship, figures described as test data, and
      the "Infinity%" label fixed or re-captured
