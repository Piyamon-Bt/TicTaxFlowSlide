# TicTaxFlow — 12-Chapter Content Map

Source of truth: the shared ChatGPT conversation *"วางโครงการ Pitching"* (12-slide, 10-minute
pitch outline for TicTaxFlow, with Thai speaker scripts), plus the project brief supplied by the
presenter. Every headline, number and story beat below traces back to one of those two sources.
Nothing in this map is invented. Items that need external validation are flagged
**[VERIFY]** and are listed in `factual-verification.md`.

Language decision: **English-primary.** One headline stays in Thai because the source and the
brief specify it verbatim (Ch.04); the Thai notification copy on the Chapter 01 phone is Thai
because that is what a Thai seller's phone shows. Speaker notes are kept in the original Thai,
with a short English cue line, because the pitch is delivered in Thai.

Narrative spine: **Seller → Complexity → Risk → TicTaxFlow → Magic Moment → Vision → Market →
Business Model → Why Us → Mission**

Total target runtime: **10:00** (sum of chapter targets below = 9:40, leaving ~20 s of buffer for
pauses on Ch.05 and Ch.07).

---

## 01 — Opening · the seller's phone

| Field | Value |
|---|---|
| Chapter label | OPENING |
| On-screen copy | **None.** No kicker, no headline, no supporting line. |
| Target time | 0:30 |
| Product named? | **No.** TicTaxFlow must not appear yet. |

The whole chapter is one image: the seller's phone, filling up with order
notifications faster than anyone could keep track of. The 3D phone (from the supplied
model) floats centre-screen with a live lock screen; a new order notification lands every
0.7–1.1 s from Shopee, LINE, Lazada and Facebook, the stack pushes upward, and the
"orders today" pill keeps ticking up. Nothing is written on the slide, so the audience
watches the phone and listens to the presenter — the Apple-keynote opening the source
outline asked for.

The Thai headlines that used to sit here (ขายดีขึ้นทุกวัน / แต่คุณรู้ไหมว่า… ต้องเสียภาษีเท่าไร?)
are now **spoken**, not printed. They remain in the presenter script for chapter 01, so the
words still land — the slide simply does not compete with them.

Facts carried, entirely through the visual: four selling channels (Shopee, Lazada, Facebook,
LINE); orders arrive continuously through the day; the business is clearly growing.

Screen content is illustrative concept UI (see `factual-verification.md` §8): the order
amounts, the time, the date and the orders-today count are story props, not data.

Speaker note (TH, from source): ลองนึกภาพแม่ค้าออนไลน์คนหนึ่ง ทุกเช้าเธอเปิด Shopee ดูยอดขาย ตอนบ่ายมีลูกค้าจาก
Facebook ตอนเย็นมีเงินเข้าจาก LINE ธุรกิจกำลังโตขึ้นเรื่อย ๆ ซึ่งควรจะเป็นเรื่องที่ดี… จนกระทั่งมีคำถามหนึ่งเกิดขึ้น — ปีนี้เราต้องเสียภาษีเท่าไร?

---

## 02 — One Seller, Many Channels

| Field | Value |
|---|---|
| Chapter label | SITUATION |
| Headline | 4 Channels. 1 Taxpayer. |
| Sub-line | Revenue arrives in four places. Tax responsibility lands on one person. |
| Target time | 0:50 |

Visual: at the centre, the **presenter's own photograph** of an online seller sitting with her
parcels, holding a packed box ready to ship. Around her: the Shopee, Lazada, Facebook and LINE
marks, with dotted lines and a WebGL particle stream flowing inward to her.

The photograph is used as supplied. It is packed by `tools/seller2asset.py` into
`src/js/seller-asset.js` as a transparent PNG data URI; the only operations are trimming the empty
margin and resizing. The original colours are kept. Nothing is generated, retouched or composited,
and the face is never altered. A gold rim glow and a drop shadow are applied in CSS
(`.node.center .sticker`), not baked into the file, so the original can be swapped in one command.
**To replace the photo:** drop the new cut-out PNG in and change `SRC` in `tools/seller2asset.py`,
then `python3 build.py`.

This replaced a drawn halftone-collage sticker that stood in for the photograph while it was
being sourced; that SVG has been removed from `src/html/a_chrome.html`.

Key message: income is scattered across platforms, but at filing time it must be consolidated
back to one taxpayer — and today the person doing that consolidation is the shop owner herself.

Numbers: **4** channels, **1** taxpayer.

Speaker note (TH): ปัญหาคือรายได้ของคนขายออนไลน์ไม่ได้อยู่ในที่เดียว วันนี้ร้านหนึ่งอาจขายผ่าน Shopee, Lazada,
Facebook และ LINE พร้อมกัน แต่ตอนคำนวณภาษี รายได้ทั้งหมดต้องกลับมารวมอยู่ที่คนคนเดียว และปัจจุบันคนที่ต้องรวบรวมทั้งหมดก็คือเจ้าของร้านเอง

---

## 03 — The Invisible Number

| Field | Value |
|---|---|
| Chapter label | PROBLEM |
| Hero number | ฿1,800,000 |
| Label under hero number | VAT Registration Threshold **[VERIFY]** |
| Headline | The number nobody sees. |
| Target time | 1:00 |

Accumulation animation, in this exact order (from source):
**฿420K → ฿870K → ฿1.34M → ฿1.72M → ⚠ ฿1.80M**

Key message: sellers see a Shopee figure, a Lazada figure and a bank transfer figure — never one
continuously updated combined number. By the time the combined total is known, it can already be
too late to prepare. This is the first major problem moment of the pitch.

Wording care: the source says *"หากรายรับถึงเกณฑ์ที่กฎหมายกำหนด ผู้ประกอบการอาจมีหน้าที่เกี่ยวกับการจด VAT"* —
"may have a duty relating to VAT registration". The site keeps that conditional phrasing and
carries an on-slide micro-note that thresholds and duties must be confirmed against current
Revenue Department rules.

Speaker note (TH): และมีตัวเลขหนึ่งที่สำคัญมาก — 1.8 ล้านบาท หากรายรับถึงเกณฑ์ที่กฎหมายกำหนด ผู้ประกอบการอาจมีหน้าที่เกี่ยวกับการจด
VAT ปัญหาคือเจ้าของร้านไม่ได้เห็นตัวเลขนี้วิ่งอยู่ตรงหน้า เขาเห็นยอด Shopee ตัวหนึ่ง Lazada อีกตัวหนึ่ง เงินโอนอีกตัวหนึ่ง กว่าจะรู้ว่ารายได้รวมไปถึงไหนแล้ว บางครั้งก็สายเกินไป

---

## 04 — Tax Complexity · "หักตามจริง หรือ เหมา?"

| Field | Value |
|---|---|
| Chapter label | COMPLEXITY |
| Headline | หักตามจริง หรือ เหมา? |
| English support line | Actual expenses, or the standard deduction? |
| Target time | 0:50 |

Three supporting questions revealed one at a time (source order):
1. ต้องยื่นเมื่อไร? — *When do I file?*
2. ใบเสร็จนี้ใช้ได้ไหม? — *Does this receipt count?*
3. VAT ถึงหรือยัง? — *Am I at the VAT threshold yet?*

Also from the source's decision-tree sketch: the expense branch is **Actual cost** vs
**standard/lump-sum deduction (มาตรา 40(8) framing in the source)**. The site labels the branches
"Actual cost" and "Standard deduction" and marks the legal reference **[VERIFY]**.

Key message: even after revenue is combined, the seller still has to understand expenses,
deduction method, filing periods, document eligibility and VAT status. Normal for an accountant —
it should not be a prerequisite for someone who just wants to sell online.

Speaker note (TH): และแม้จะรวมรายได้ได้แล้ว ยังมีคำถามต่อมาอีก ค่าใช้จ่ายควรหักตามจริงหรือแบบเหมา? เอกสารนี้ใช้เป็นค่าใช้จ่ายได้ไหม?
ต้องยื่นภาษีรอบไหน? และตอนนี้เข้าใกล้ VAT แค่ไหน? สำหรับนักบัญชี คำถามเหล่านี้อาจเป็นเรื่องปกติ แต่สำหรับคนที่แค่อยากขายของออนไลน์ มันไม่ควรยากขนาดนี้

---

## 05 — Product Reveal

| Field | Value |
|---|---|
| Chapter label | THE PRODUCT |
| Headline | Meet TicTaxFlow. |
| Supporting line | Your AI Tax Assistant for Online Sellers |
| Target time | 0:45 |

Deliberately the quietest, most spacious chapter. Ivory ground, everything else dissolves away.
A visible pause (~1–2 s in the source) after the name lands before the supporting line appears.

Key message: TicTaxFlow turns fragmented selling information into a tax picture an ordinary
person can understand.

Speaker note (TH): นี่คือเหตุผลที่เราสร้าง TicTaxFlow — AI Tax Assistant ที่ช่วยเปลี่ยนข้อมูลการขายที่กระจัดกระจาย
ให้กลายเป็นภาพภาษีที่คนธรรมดาเข้าใจได้

---

## 06 — Three Assistants

| Field | Value |
|---|---|
| Chapter label | HOW IT WORKS |
| Headline | From receipts to tax insights. |
| Target time | 1:00 |

Three-stage flow — **READ → CHECK → EXPLAIN** (📷 → 🧠 → 📊 in the source):

| Stage | Meaning |
|---|---|
| READ | Extracts dates, amounts, sellers and other fields from receipts and documents using AI. |
| CHECK | Classifies each item and evaluates it against the tax and document rules we define. |
| EXPLAIN | Turns the result into a dashboard sellers understand without becoming tax experts. |

Framing: three assistants, not an architecture diagram. The seller is the hero; AI is the
invisible helper. The source is explicit: *"อย่า pitch ว่า AI คือพระเอก"*.

Speaker note (TH): TicTaxFlow ทำงานเหมือนมีผู้ช่วยสามคน — คนแรก Read อ่านข้อมูลจากใบเสร็จและเอกสาร เช่น วันที่ ยอดเงิน
หรือผู้ขาย ด้วย AI คนที่สอง Check ตรวจสอบว่ารายการนั้นอยู่ในประเภทใด และมีประเด็นอะไรที่ต้องระวังตามกฎที่เรากำหนดไว้ และคนสุดท้าย Explain
รวมทุกอย่างให้เป็น dashboard ที่คนขายเข้าใจได้ทันที แทนที่จะต้องเข้าใจภาษีก่อนถึงจะใช้ระบบได้ เราต้องการให้ระบบเป็นฝ่ายอธิบายภาษีให้ผู้ใช้เข้าใจ

---

## 07 — The Magic Moment

| Field | Value |
|---|---|
| Chapter label | THE MOMENT |
| Headline | Know before it's too late. |
| Target time | 1:00 (hold the laptop) |

The chapter now shows **the real product on a laptop**: a MacBook with the TicTaxFlow
landing page ("Tax Deductions, Simplified by AI") on screen, and one card floated over the
corner carrying the numbers from the source outline:

```
Revenue this year   ฿1,642,350
████████████████░   91%
VAT threshold       ฿1,800,000
⚠ ฿157,650 remaining
Threshold alerts    [Roadmap]
```

Arithmetic check: 1,642,350 / 1,800,000 = 91.24 % → "91%" is correct.
1,800,000 − 1,642,350 = 157,650 → "฿157,650 remaining" is correct.

Key message: not ten pages of tax tables — accumulated revenue, distance from the threshold,
and what to prepare next, understood at a glance. The laptop says the product exists; the card
says what it tells you.

Status labelling: the on-slide note reads "TicTaxFlow as it is today. Revenue figures on the card
are illustrative, and anything marked Roadmap is not built yet." The claims printed on the
landing page itself are the team's own and need the check in `factual-verification.md` §3.6.

Speaker note (TH): สิ่งที่เราอยากให้ผู้ใช้เห็น ไม่ใช่ตารางภาษีสิบหน้า แต่เป็นสิ่งนี้ครับ วันนี้คุณมีรายรับสะสมเท่าไร เข้าใกล้ threshold แค่ไหน
และมีอะไรที่คุณควรเตรียมตัว จากเรื่องที่เคยมองไม่เห็น กลายเป็นตัวเลขที่เห็นได้ทุกวัน (หยุดให้กรรมการดู UI)

---

## 08 — Inside the product

| Field | Value |
|---|---|
| Chapter label | INSIDE THE PRODUCT |
| Headline | From manual upload to automatic tax visibility. |
| Target time | 0:45 |

Three screenshots of the working build, on the same laptop as chapter 07, with a step beside each
one. The screens cross-fade every 4.2 s while the chapter is on; clicking a step shows that screen
and stops the timer, so the presenter can hold one as long as they like. Under reduced motion the
timer never starts and the steps are click-only. On a phone the laptop moves above the steps.

| # | Step (the product's own heading) | What the screen shows |
|---|---|---|
| 01 | AI-Powered Receipt Analysis | The features page: OCR pulling merchant, tax ID, date and amount out of a receipt |
| 02 | Quick Upload | The dashboard mid-run, processing `Donation.png`, totals still at zero |
| 03 | Deductions, and what is left | The same dashboard after: verified transactions, a running deduction total, a bar per category against its limit |

One line sits underneath: *"Screens from the working build; the amounts on them are test data.
Marketplace connections to Shopee, Lazada, Facebook or LINE are roadmap — no partnership or
integration is in place or announced."* **[VERIFY — no integration may be claimed, and the figures
on screen are the presenter's own test data, not traction.]**

Screenshots are packed by `tools/ui2asset.py` (`step1`–`step3`, plus `landing` for chapter 07).
Framing only: a 2 px border trim, the browser chrome cropped off screen 2 so all three match, and
white padding at the foot to reach the laptop's 16:10.

> This replaced a Today / Tomorrow flow diagram. The honesty beat it carried — what is built versus
> what is roadmap — moved into the line above, which is now the chapter's last word.

Speaker note (TH): นี่คือของจริงที่รันอยู่ตอนนี้ครับ — AI อ่านใบเสร็จเอง ลากไฟล์วางแล้วระบบจัดหมวดให้ทันที
และผลลัพธ์ออกมาเป็นยอดลดหย่อนพร้อมเพดานของแต่ละหมวด ตัวเลขบนจอเป็นข้อมูลทดสอบ ส่วนการเชื่อมกับ marketplace ยังเป็น roadmap

---

## 09 — Market Opportunity

| Field | Value |
|---|---|
| Chapter label | MARKET |
| Headline | Start where the pain is sharpest. |
| Target time | 1:00 |

Funnel (source): ONLINE SELLERS → MULTI-CHANNEL SELLERS → TAX-AWARE / VAT-APPROACHING SELLERS
Highlighted target band: **฿200K – ฿1.8M annual revenue**

Key message: TicTaxFlow does not start by trying to be accounting software for every business.
It starts with sellers whose revenue is growing, fragmented across channels, and who have no
accounting department watching the numbers daily.

**No TAM / SAM / SOM, seller counts or market values are stated.** Each funnel tier carries a
visible placeholder — "Sizing pending external validation" — and the chapter states that market
sizing requires third-party data before public use. The source says the same:
*"ไม่ควรสร้างตัวเลขขึ้นเอง"*.

Speaker note (TH): เราไม่ได้เริ่มจากการพยายามเป็นโปรแกรมบัญชีสำหรับทุกคน เราเริ่มจากกลุ่มที่ pain ชัดที่สุด คือผู้ขายออนไลน์ขนาดเล็กที่ขายหลาย
ช่องทาง มีรายได้เพิ่มขึ้นเรื่อย ๆ แต่ยังไม่มีฝ่ายบัญชีมาช่วยดูตัวเลขให้ทุกวัน โดยเฉพาะกลุ่มรายได้ประมาณ 200,000 ถึง 1.8 ล้านบาทต่อปี เพราะนี่คือช่วงที่ธุรกิจ
เริ่มโต และความซับซ้อนทางภาษีก็เริ่มโตตามไปด้วย

---

## 10 — Business Model

| Field | Value |
|---|---|
| Chapter label | BUSINESS MODEL |
| Headline (beat 1) | Start Free. |
| Headline (beat 2) | Pay when you grow. |
| Closing line | TicTaxFlow grows when our users grow. |
| Target time | 0:50 |

| Tier | Contents | Status |
|---|---|---|
| FREE | Tax calculation · Manual document upload | Proposed pricing |
| PAID | ฿199–299 per filing period **or** ฿400–600 per year | Proposed pricing |
| FUTURE / AUTOMATED | Multi-platform aggregation · Alerts · Tax dashboard automation | Roadmap |

Presented as a premium vertical progression, not a comparison table. All pricing is labelled
**proposed** — nothing is live. **[VERIFY before public use.]**

Speaker note (TH): ภาษีไม่ได้เป็นสิ่งที่ผู้ขายทุกคนอยากจ่าย subscription ทุกเดือน ดังนั้นเราจะให้ผู้ใช้เริ่มต้นฟรี และเมื่อธุรกิจโตขึ้น
ต้องยื่นภาษี หรือต้องการระบบรวมข้อมูลอัตโนมัติ จึงค่อย upgrade — In other words, TicTaxFlow grows when our users grow.

---

## 11 — Why We Can Win

| Field | Value |
|---|---|
| Chapter label | WHY US |
| Reveal sequence | "Simple." → "Automatic." → "Accessible." |
| Target time | 0:50 |

| Word | Meaning |
|---|---|
| SIMPLE | No accounting knowledge required. |
| AUTOMATIC | AI reads and organizes documents. |
| ACCESSIBLE | Built for small online sellers. |

Key message: not a complex enterprise accounting system — a tool for small sellers who are
starting to grow.

Speaker note (TH): สิ่งที่จะทำให้ TicTaxFlow เติบโตได้มีสามอย่าง — Simple ผู้ใช้ไม่จำเป็นต้องมีความรู้บัญชี, Automatic
ลดการกรอกและรวบรวมข้อมูลด้วยตัวเอง, และ Accessible เราไม่ได้สร้างระบบ enterprise ที่ซับซ้อน เราสร้างเครื่องมือสำหรับคนตัวเล็กที่กำลังเติบโต

---

## 12 — The Team

| Field | Value |
|---|---|
| Chapter label | THE TEAM |
| Headline | Growth shouldn't make tax scarier. |
| Closing line | So small businesses can focus on growing — not worrying. |
| Target time | 0:40 |

A bento grid in the style the presenter asked for: three photo cards, each with a white name
badge and a dark check mark, interleaved with three pastel message cards (mint, lilac, peach)
in a staggered 3 × 5 grid. Headline, one supporting line and the wordmark sit to the left.

| Card | Content |
|---|---|
| Photo 1 | Team member · badge: name + *Co-founder · Product* |
| Mint | "Three people, one product." |
| Photo 2 | Team member · badge: name + *Co-founder · Engineering* |
| Lilac | "Sell with confidence." / "Let TicTaxFlow handle the complexity." |
| Photo 3 | Team member · badge: name + *Co-founder · Tax & Ops* |
| Peach | "So small businesses can focus on growing — not worrying." |

The closing line therefore still lands last, in the bottom-right card.

> **One thing is still a placeholder: the three names**, which read *ชื่อ–นามสกุล*. Edit the
> `<b>` inside each `.bbadge` in `src/html/d_ch09_12.html`, then rebuild. All three
> photographs are in place.

Photographs are the team's own files. They are cropped to a shared 3:4 frame and resized, in
their original colours — nothing is generated, retouched or composited. To swap one, replace its
line in `MEMBERS` in `tools/team2assets.py` — `("p3", "<filename>", focus_x, focus_y, zoom)`,
where the focus point (0..1 of the original) marks the face and `zoom` tightens the crop — run
`python3 tools/team2assets.py`, then `python3 build.py`.

Speaker note (TH): คนขายออนไลน์ไม่ควรต้องกลัวว่าธุรกิจของตัวเองจะโต และไม่ควรต้องเป็นนักบัญชีเพื่อที่จะรู้ว่าวันนี้ตัวเองอยู่ตรงไหน
เราจึงสร้าง TicTaxFlow เพื่อเปลี่ยนภาษีจากเรื่องที่ผู้ขายต้องคอยกลัว ให้กลายเป็นเรื่องที่เขาสามารถมองเห็น เข้าใจ และเตรียมตัวได้ —
So small businesses can focus on growing, not worrying. ขอบคุณครับ

---

## Timing ledger

| # | Chapter | Target |
|---|---|---|
| 01 | Opening — phone, no copy | 0:30 |
| 02 | One Seller, Many Channels | 0:50 |
| 03 | The Invisible Number | 1:00 |
| 04 | Tax Complexity | 0:50 |
| 05 | Product Reveal | 0:45 |
| 06 | Three Assistants | 1:00 |
| 07 | The Magic Moment | 1:00 |
| 08 | Inside the product | 0:45 |
| 09 | Market Opportunity | 1:00 |
| 10 | Business Model | 0:50 |
| 11 | Why We Can Win | 0:50 |
| 12 | Mission and Ending | 0:40 |
| | **Total** | **9:40** |

## Complete inventory of numbers used on the site

| Number | Chapter | Source |
|---|---|---|
| Order notification amounts, orders-today count (chapter 1 phone screen) | 01 | Illustrative concept UI — story props, flagged in `factual-verification.md` |
| 4 channels / 1 taxpayer | 02 | Source slide 2 |
| ฿420K, ฿870K, ฿1.34M, ฿1.72M, ฿1.80M | 03 | Source slide 3 accumulation |
| ฿1,800,000 VAT threshold | 03, 07, 09 | Source slides 3, 7, 9 |
| ฿1,642,350 revenue this year | 07 | Source slide 7 mockup |
| 91% progress | 07 | Source slide 7 mockup |
| ฿157,650 remaining | 07 | Source slide 7 mockup |
| ฿200K – ฿1.8M target band | 09 | Source slide 9 |
| ฿199–299 per filing period | 10 | Source slide 10 |
| ฿400–600 per year | 10 | Source slide 10 |

No other quantitative claim appears anywhere on the site.
