/* TicTaxFlow — chapter model, presenter notes and pacing targets.
   Speaker scripts are Thai, because the pitch is delivered in Thai; the cue
   line above each one is the English stage direction. Targets sum to exactly
   10:00 across fifteen chapters. */
(function () {
  var S = (window.TTF = window.TTF || {});

  S.chapters = [
    {
      n: 1, name: 'Opening', title: 'ออเดอร์เข้าทั้งวัน (จอเดียว ไม่มีข้อความ)', target: 25, ground: 'dark',
      cue: 'No words on screen — the order feed fills as you scroll. Let three or four rows land before you speak. Do NOT name the product yet.',
      script: 'ลองนึกภาพแม่ค้าออนไลน์คนหนึ่งครับ ทุกเช้าเธอเปิด Shopee ดูยอดขาย ตอนบ่ายมีลูกค้าจาก Facebook ตอนเย็นมีเงินเข้าจาก LINE ธุรกิจกำลังโตขึ้นเรื่อย ๆ ซึ่งควรจะเป็นเรื่องที่ดี... จนกระทั่งมีคำถามหนึ่งเกิดขึ้น — ปีนี้เราต้องเสียภาษีเท่าไร?'
    },
    {
      n: 2, name: 'Many channels', title: '4 Channels. 1 Taxpayer.', target: 40, ground: 'dark',
      cue: 'Revenue is scattered; responsibility is not. Let the four marks land before you say "one taxpayer".',
      script: 'ปัญหาคือ รายได้ของคนขายออนไลน์ไม่ได้อยู่ในที่เดียวครับ วันนี้ร้านหนึ่งอาจขายผ่าน Shopee, Lazada, Facebook และ LINE พร้อมกัน แต่ตอนคำนวณภาษี รายได้ทั้งหมดเหล่านี้ต้องกลับมารวมอยู่ที่คนคนเดียว และปัจจุบัน คนที่ต้องทำหน้าที่รวบรวมทั้งหมดก็คือเจ้าของร้านเอง'
    },
    {
      n: 3, name: 'Invisible number', title: '฿1,800,000', target: 45, ground: 'dark',
      cue: 'First problem moment. Scroll the counter to 1.80M, let the flash land, then pause before you speak again.',
      script: 'และมีตัวเลขหนึ่งที่สำคัญมาก — 1.8 ล้านบาท หากรายรับถึงเกณฑ์ที่กฎหมายกำหนด ผู้ประกอบการอาจมีหน้าที่เกี่ยวกับการจด VAT ปัญหาคือเจ้าของร้านไม่ได้เห็นตัวเลข 1.8 ล้านบาทนี้วิ่งอยู่ตรงหน้า เขาเห็นยอด Shopee ตัวหนึ่ง Lazada อีกตัวหนึ่ง เงินโอนอีกตัวหนึ่ง กว่าจะรู้ว่ารายได้รวมไปถึงไหนแล้ว บางครั้งก็สายเกินไป'
    },
    {
      n: 4, name: 'Complexity', title: 'Actual Expenses or Standard Deduction?', target: 40, ground: 'dark',
      cue: 'Three questions, one at a time. Read each one out loud and let it sit before you scroll on.',
      script: 'และแม้จะรวมรายได้ได้แล้ว ยังมีคำถามต่อมาอีกครับ ค่าใช้จ่ายควรหักตามจริงหรือแบบเหมา เอกสารใบนี้ใช้เป็นค่าใช้จ่ายได้ไหม ต้องยื่นภาษีรอบไหน และตอนนี้เข้าใกล้ VAT แค่ไหน สำหรับนักบัญชี คำถามเหล่านี้เป็นเรื่องปกติ แต่สำหรับคนที่แค่อยากขายของออนไลน์ มันไม่ควรยากขนาดนี้'
    },
    {
      n: 5, name: 'Why now', title: 'The quiet years are ending.', target: 45, ground: 'dark',
      cue: 'The urgency slide. Point at the two lit windows on the year bar — most people in the room think there is only one filing round. If asked, the 2026 platform-reporting change still needs confirming with the Revenue Department.',
      script: 'และตอนนี้จังหวะกำลังเปลี่ยนครับ ตั้งแต่ปี 2569 กรมสรรพากรเริ่มให้แพลตฟอร์มอีคอมเมิร์ซส่งข้อมูลรายได้ของผู้ขายเข้าระบบโดยตรง แปลว่าช่องทาง "ไม่รู้ก็เลยไม่ยื่น" กำลังปิดลงเรื่อย ๆ และสิ่งที่คนส่วนใหญ่ยังเข้าใจผิดคือ เงินได้ประเภท 40(8) ต้องยื่นปีละสองรอบ ไม่ใช่รอบเดียว รอบครึ่งปี ภ.ง.ด.94 ช่วงกรกฎาคมถึงกันยายน และรอบเต็มปี ภ.ง.ด.90 ช่วงมกราคมถึงมีนาคมปีถัดไป ยังต้องเลือกเองอีกว่าจะหักค่าใช้จ่ายตามจริง หรือแบบเหมา 40 ถึง 60 เปอร์เซ็นต์ และถ้ารายได้เกิน 1.8 ล้านบาท ต้องจด VAT แล้วยื่นทุกเดือน'
    },
    {
      n: 6, name: 'Product reveal', title: 'Meet TicTaxFlow.', target: 30, ground: 'light',
      cue: 'Say the name, then STOP for one to two seconds. Silence does the work here.',
      script: 'นี่คือเหตุผลที่เราสร้าง TicTaxFlow — AI Tax Assistant ที่ช่วยเปลี่ยนข้อมูลการขายที่กระจัดกระจาย ให้กลายเป็นภาพภาษีที่คนธรรมดาเข้าใจได้'
    },
    {
      n: 7, name: 'Three assistants', title: 'From receipts to tax insights.', target: 50, ground: 'light',
      cue: 'Three assistants, not an architecture diagram. The seller is the hero; AI stays in the background.',
      script: 'TicTaxFlow ทำงานเหมือนมีผู้ช่วยสามคนครับ คนแรก Read — อ่านข้อมูลจากใบเสร็จและเอกสาร วันที่ ยอดเงิน ชื่อผู้ออก เลขผู้เสียภาษี ด้วย AI คนที่สอง Check — ใช้ฐานความรู้จากคู่มือกรมสรรพากรตรวจว่ารายการนั้นหักลดหย่อนได้ประเภทไหน และเตือนทันทีถ้าเกินเพดานตามกฎหมาย และคนสุดท้าย Explain — รวมทุกอย่างให้เป็น dashboard ที่คนขายเข้าใจได้ทันที เราต้องการให้ระบบเป็นฝ่ายอธิบายภาษีให้ผู้ใช้ ไม่ใช่ให้ผู้ใช้ต้องเข้าใจภาษีก่อนถึงจะใช้ระบบได้'
    },
    {
      n: 8, name: 'Magic moment', title: "Know before it's too late.", target: 50, ground: 'dark',
      cue: 'The slide that sells. Let the judges read the screen, then point at the card: one number, the distance, the warning.',
      script: 'สิ่งที่เราอยากให้ผู้ใช้เห็น ไม่ใช่ตารางภาษีสิบหน้า แต่เป็นสิ่งนี้ครับ วันนี้คุณมีรายรับสะสมเท่าไร เข้าใกล้ threshold แค่ไหน และมีอะไรที่คุณควรเตรียมตัว จากเรื่องที่เคยมองไม่เห็น กลายเป็นตัวเลขที่เห็นได้ทุกวัน'
    },
    {
      n: 9, name: 'Inside the product', title: 'From manual upload to automatic', target: 45, ground: 'light',
      cue: 'Three real screens. Stop scrolling to hold one. End on the roadmap line — credibility is the point.',
      script: 'นี่คือของจริงที่รันอยู่ตอนนี้ครับ หน้าแรก AI อ่านใบเสร็จ ดึงชื่อร้าน เลขผู้เสียภาษี วันที่ และยอดเงินออกมาเอง ถ่ายรูปหรือเป็น PDF ก็ได้ ถัดมา ลากไฟล์วางบนแดชบอร์ด ระบบจัดหมวดและเช็คกับกฎลดหย่อนให้ทันที และสุดท้าย ผลลัพธ์ออกมาเป็นรายการที่ตรวจแล้ว ยอดลดหย่อนรวม และแถบบอกว่าแต่ละหมวดใช้สิทธิ์ไปเท่าไรจากเพดาน ตัวเลขบนจอเป็นข้อมูลทดสอบนะครับ'
    },
    {
      n: 10, name: 'The gap', title: 'Everyone calculates. Nobody consolidates.', target: 45, ground: 'light',
      cue: 'Name iTAX respectfully — we are not competing on calculation. The right-hand column is the whole argument. If a judge pushes, say the review is our own and needs re-checking.',
      script: 'แล้วทำไมยังไม่มีใครแก้ปัญหานี้ครับ เท่าที่เราสำรวจ เครื่องมือภาษีในไทยอย่าง iTAX ทำเรื่องคำนวณและยื่นภาษีได้ดีมาก แต่ยังไม่มีเจ้าไหนที่ดึงยอดขายจากหลายแพลตฟอร์มมารวมให้อัตโนมัติ ทุกเจ้ายังให้ผู้ขายกรอกเองทั้งหมด นั่นคือช่องว่างที่เราจะเข้าไปครับ — รวมยอดจากทุกช่องทาง แยกเงินได้ 40(8) ให้เอง เทียบให้ว่าหักแบบไหนคุ้มกว่า และเตือนก่อนถึงเส้น 1.8 ล้าน ไม่ใช่หลังจากเลยไปแล้ว'
    },
    {
      n: 11, name: 'Market', title: 'Start where the pain is sharpest', target: 40, ground: 'dark',
      cue: 'No invented market numbers. If a judge asks for TAM, say sizing needs external data and you have not fabricated it.',
      script: 'เราไม่ได้เริ่มจากการพยายามเป็นโปรแกรมบัญชีสำหรับทุกคน เราเริ่มจากกลุ่มที่ pain ชัดที่สุด คือผู้ขายออนไลน์ที่ขายหลายช่องทางพร้อมกัน มีรายได้ประมาณ 200,000 ถึง 1.8 ล้านบาทต่อปี เพราะนี่คือช่วงที่ธุรกิจเริ่มโต และความซับซ้อนทางภาษีก็โตตามไปด้วย'
    },
    {
      n: 12, name: 'Business model', title: 'Start Free. Pay when you grow.', target: 45, ground: 'light',
      cue: 'The pricing follows the two filing windows from chapter 05 — say that out loud, it is why we are not a monthly SaaS.',
      script: 'โมเดลรายได้ของเราออกแบบตามพฤติกรรมจริงครับ ผู้ขายออนไลน์ใช้งานเรื่องภาษีจริงจังแค่สองช่วงต่อปี ตามรอบยื่นที่เพิ่งเล่าไป การคิดเงินแบบ subscription รายเดือนจึงไม่ตรงกับการใช้งานจริง เราจึงคิดแบบจ่ายต่อรอบยื่น 199 ถึง 299 บาทต่อรอบ หรือประมาณ 400 ถึง 600 บาทต่อปี โดยมี Free Tier ให้เริ่มต้นฟรีก่อน แล้วค่อยอัปเกรดเมื่อธุรกิจโตขึ้น — TicTaxFlow โตเมื่อผู้ใช้ของเราโต'
    },
    {
      n: 13, name: 'Feasibility', title: 'Built first. Priced second.', target: 45, ground: 'dark',
      cue: 'The credibility slide. Green column is already running — say "we built and tested this ourselves". Do not skip the risk column; naming the two risks is what makes the rest believable.',
      script: 'เรื่องความเป็นไปได้ครับ ผู้ช่วยสามคนที่เล่าไปไม่ใช่แผนบนกระดาษ แต่รันอยู่จริงแล้ว หน้าจอที่กรรมการเพิ่งเห็นออกมาจากระบบนั้น ส่วนที่ยังไม่ได้ทำคือการรับไฟล์ยอดขายจาก Seller Centre แยก 40(8) อัตโนมัติ และแจ้งเตือนผ่าน LINE ซึ่งเราระบุชัดว่าเป็น roadmap ส่วนความเสี่ยงเราประเมินไว้สองข้อ ข้อแรก แพลตฟอร์มอาจไม่มีช่องทาง export อย่างเป็นทางการ เราจึงออกแบบให้อัปโหลดไฟล์ได้ตั้งแต่วันแรก ไม่ผูกกับ API และข้อสอง คำแนะนำภาษีที่คลาดเคลื่อนอาจสร้างความเสียหายให้ผู้ใช้ เราจึงระบุชัดในระบบว่าเป็นตัวเลขประมาณการเบื้องต้น ไม่ใช่คำแนะนำที่มีผลผูกพันทางกฎหมาย ให้ตรวจกับนักบัญชีหรือกรมสรรพากรอีกครั้งก่อนยื่นจริง'
    },
    {
      n: 14, name: 'Why we win', title: 'Simple. Automatic. Accessible.', target: 30, ground: 'dark',
      cue: 'One word, one beat. Do not rush the gaps between them.',
      script: 'สิ่งที่จะทำให้ TicTaxFlow เติบโตได้มีสามอย่างครับ Simple — ผู้ใช้ไม่จำเป็นต้องมีความรู้บัญชี Automatic — ลดการกรอกและรวบรวมข้อมูลด้วยตัวเอง และ Accessible — เราไม่ได้สร้างระบบ enterprise ที่ซับซ้อน เราสร้างเครื่องมือสำหรับคนตัวเล็กที่กำลังเติบโต'
    },
    {
      n: 15, name: 'Team', title: "Growth shouldn't make tax scarier.", target: 25, ground: 'light',
      cue: 'Name the three of you and what each owns — one line each, no CVs. Then land the final sentence and stop.',
      script: 'พ่อค้าแม่ค้าออนไลน์คือแรงงานกลุ่มที่โตเร็วที่สุดกลุ่มหนึ่งของเศรษฐกิจไทย แต่เป็นกลุ่มที่มองไม่เห็นในระบบภาษีมาตลอด เพราะไม่มีฝ่ายบัญชีเหมือนธุรกิจใหญ่ พวกเขาไม่ได้ตั้งใจหลบเลี่ยง แต่ไม่มีเครื่องมือที่เข้าใจวิธีทำมาหากินของเขาจริง ๆ เราจึงสร้าง TicTaxFlow เพื่อเปลี่ยนภาษีจากเรื่องที่ต้องคอยกลัว ให้เป็นเรื่องที่มองเห็น เข้าใจ และเตรียมตัวได้ — So small businesses can focus on growing, not worrying. ขอบคุณครับ'
    }
  ];
})();
