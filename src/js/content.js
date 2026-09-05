/* TicTaxFlow — chapter model, presenter notes and pacing targets.
   Speaker scripts are the Thai scripts from the source pitch outline. */
(function () {
  var S = (window.TTF = window.TTF || {});

  S.chapters = [
    {
      n: 1, name: 'Opening', title: 'ออเดอร์เข้าทั้งวัน (จอมือถือ ไม่มีข้อความ)', target: 30, ground: 'ink',
      cue: 'No words on screen — just the phone filling with orders. Let it run for a few seconds before you speak, then tell the story over it. Do NOT name the product yet.',
      script: 'ลองนึกภาพแม่ค้าออนไลน์คนหนึ่งครับ ทุกเช้าเธอเปิด Shopee ดูยอดขาย ตอนบ่ายมีลูกค้าจาก Facebook ตอนเย็นมีเงินเข้าจาก LINE ธุรกิจกำลังโตขึ้นเรื่อย ๆ ซึ่งควรจะเป็นเรื่องที่ดี... จนกระทั่งมีคำถามหนึ่งเกิดขึ้น — ปีนี้เราต้องเสียภาษีเท่าไร?'
    },
    {
      n: 2, name: 'Many channels', title: '4 Channels. 1 Taxpayer.', target: 50, ground: 'ink',
      cue: 'Revenue is scattered; responsibility is not. Let the streams converge before you say "one taxpayer".',
      script: 'ปัญหาคือ รายได้ของคนขายออนไลน์ไม่ได้อยู่ในที่เดียวครับ วันนี้ร้านหนึ่งอาจขายผ่าน Shopee, Lazada, Facebook และ LINE พร้อมกัน แต่ตอนคำนวณภาษี รายได้ทั้งหมดเหล่านี้ต้องกลับมารวมอยู่ที่คนคนเดียว และปัจจุบัน คนที่ต้องทำหน้าที่รวบรวมทั้งหมดก็คือเจ้าของร้านเอง'
    },
    {
      n: 3, name: 'Invisible number', title: '฿1,800,000', target: 60, ground: 'ink',
      cue: 'First problem moment. Let the counter run to 1.80M and pause on the warning before you speak again.',
      script: 'และมีตัวเลขหนึ่งที่สำคัญมาก — 1.8 ล้านบาท หากรายรับถึงเกณฑ์ที่กฎหมายกำหนด ผู้ประกอบการอาจมีหน้าที่เกี่ยวกับการจด VAT ปัญหาคือเจ้าของร้านไม่ได้เห็นตัวเลข 1.8 ล้านบาทนี้วิ่งอยู่ตรงหน้า เขาเห็นยอด Shopee ตัวหนึ่ง Lazada อีกตัวหนึ่ง เงินโอนอีกตัวหนึ่ง กว่าจะรู้ว่ารายได้รวมไปถึงไหนแล้ว บางครั้งก็สายเกินไป'
    },
    {
      n: 4, name: 'Complexity', title: 'หักตามจริง หรือ เหมา?', target: 50, ground: 'ink',
      cue: 'Three questions land one at a time. Let it feel slightly overwhelming — that is the point.',
      script: 'และแม้จะรวมรายได้ได้แล้ว ยังมีคำถามต่อมาอีก ค่าใช้จ่ายควรหักตามจริงหรือแบบเหมา? เอกสารนี้ใช้เป็นค่าใช้จ่ายได้ไหม? ต้องยื่นภาษีรอบไหน? และตอนนี้เข้าใกล้ VAT แค่ไหน? สำหรับนักบัญชี คำถามเหล่านี้อาจเป็นเรื่องปกติ แต่สำหรับคนที่แค่อยากขายของออนไลน์ มันไม่ควรยากขนาดนี้'
    },
    {
      n: 5, name: 'Product reveal', title: 'Meet TicTaxFlow.', target: 45, ground: 'ivory',
      cue: 'Say the name, then STOP for one to two seconds. Silence does the work here.',
      script: 'นี่คือเหตุผลที่เราสร้าง TicTaxFlow — AI Tax Assistant ที่ช่วยเปลี่ยนข้อมูลการขายที่กระจัดกระจาย ให้กลายเป็นภาพภาษีที่คนธรรมดาเข้าใจได้'
    },
    {
      n: 6, name: 'Three assistants', title: 'READ → CHECK → EXPLAIN', target: 60, ground: 'ivory',
      cue: 'Three assistants, not an architecture diagram. The seller is the hero; AI stays in the background.',
      script: 'TicTaxFlow ทำงานเหมือนมีผู้ช่วยสามคน คนแรก Read — อ่านข้อมูลจากใบเสร็จและเอกสาร เช่น วันที่ ยอดเงิน หรือผู้ขาย ด้วย AI คนที่สอง Check — ตรวจสอบว่ารายการนั้นอยู่ในประเภทใด และมีประเด็นอะไรที่ต้องระวังตามกฎที่เรากำหนดไว้ และคนสุดท้าย Explain — รวมทุกอย่างให้เป็น dashboard ที่คนขายเข้าใจได้ทันที แทนที่จะต้องเข้าใจภาษีก่อนถึงจะใช้ระบบได้ เราต้องการให้ระบบเป็นฝ่ายอธิบายภาษีให้ผู้ใช้เข้าใจ'
    },
    {
      n: 7, name: 'Magic moment', title: "Know before it's too late.", target: 60, ground: 'ink',
      cue: 'The real product on screen. Let the judges read the laptop, then point at the card: one number, the distance, the warning. This is the slide that sells.',
      script: 'สิ่งที่เราอยากให้ผู้ใช้เห็น ไม่ใช่ตารางภาษีสิบหน้า แต่เป็นสิ่งนี้ครับ วันนี้คุณมีรายรับสะสมเท่าไร เข้าใกล้ threshold แค่ไหน และมีอะไรที่คุณควรเตรียมตัว จากเรื่องที่เคยมองไม่เห็น กลายเป็นตัวเลขที่เห็นได้ทุกวัน'
    },
    {
      n: 8, name: 'Inside the product', title: 'From manual upload to automatic', target: 45, ground: 'ivory',
      cue: 'Three real screens. Let each one sit for a beat — the screens advance on their own, or click a step to hold one. End on the roadmap line: credibility is the point.',
      script: 'นี่คือของจริงที่รันอยู่ตอนนี้ครับ หน้าแรก AI อ่านใบเสร็จ ดึงชื่อร้าน เลขผู้เสียภาษี วันที่ และยอดเงินออกมาเอง — ถ่ายรูปหรือเป็น PDF ก็ได้ ถัดมา ลากไฟล์วางบนแดชบอร์ด ระบบจัดหมวดและเช็คกับกฎลดหย่อนให้ทันที และสุดท้าย ผลลัพธ์ออกมาเป็นรายการที่ตรวจแล้ว ยอดลดหย่อนรวม และแถบบอกว่าแต่ละหมวดใช้สิทธิ์ไปเท่าไรจากเพดาน — ตัวเลขบนจอเป็นข้อมูลทดสอบนะครับ ส่วนการเชื่อมกับ Shopee Lazada Facebook LINE ยังเป็น roadmap ยังไม่ได้เชื่อมต่อจริง'
    },
    {
      n: 9, name: 'Market', title: 'Start where the pain is sharpest', target: 60, ground: 'ink',
      cue: 'No invented market numbers. If a judge asks for TAM, say sizing needs external data and you have not fabricated it.',
      script: 'เราไม่ได้เริ่มจากการพยายามเป็นโปรแกรมบัญชีสำหรับทุกคน เราเริ่มจากกลุ่มที่ pain ชัดที่สุด คือผู้ขายออนไลน์ขนาดเล็กที่ขายหลายช่องทาง มีรายได้เพิ่มขึ้นเรื่อย ๆ แต่ยังไม่มีฝ่ายบัญชีมาช่วยดูตัวเลขให้ทุกวัน โดยเฉพาะกลุ่มรายได้ประมาณ 200,000 ถึง 1.8 ล้านบาทต่อปี เพราะนี่คือช่วงที่ธุรกิจเริ่มโต และความซับซ้อนทางภาษีก็เริ่มโตตามไปด้วย'
    },
    {
      n: 10, name: 'Business model', title: 'Start Free. Pay when you grow.', target: 50, ground: 'ivory',
      cue: 'Land the closing line cleanly: "TicTaxFlow grows when our users grow."',
      script: 'Business model ของเราออกแบบตามพฤติกรรมของผู้ใช้ ภาษีไม่ได้เป็นสิ่งที่ผู้ขายทุกคนอยากจ่าย subscription ทุกเดือน ดังนั้นเราจะให้ผู้ใช้เริ่มต้นฟรี และเมื่อธุรกิจโตขึ้น ต้องยื่นภาษี หรือต้องการระบบรวมข้อมูลอัตโนมัติ จึงค่อย upgrade — In other words, TicTaxFlow grows when our users grow.'
    },
    {
      n: 11, name: 'Why we win', title: 'Simple. Automatic. Accessible.', target: 50, ground: 'ink',
      cue: 'One word, one beat. Do not rush the gaps between them.',
      script: 'สิ่งที่จะทำให้ TicTaxFlow เติบโตได้มีสามอย่าง Simple — ผู้ใช้ไม่จำเป็นต้องมีความรู้บัญชี Automatic — ลดการกรอกและรวบรวมข้อมูลด้วยตัวเอง และ Accessible — เราไม่ได้สร้างระบบ enterprise ที่ซับซ้อน เราสร้างเครื่องมือสำหรับคนตัวเล็กที่กำลังเติบโต'
    },
    {
      n: 12, name: 'Team', title: "The team · Growth shouldn't make tax scarier.", target: 40, ground: 'ivory',
      cue: 'Name the three of you and what each owns — one sentence each, no CVs. Then land the final line and stop.',
      script: 'คนขายออนไลน์ไม่ควรต้องกลัวว่าธุรกิจของตัวเองจะโต และไม่ควรต้องเป็นนักบัญชีเพื่อที่จะรู้ว่าวันนี้ตัวเองอยู่ตรงไหน เราจึงสร้าง TicTaxFlow เพื่อเปลี่ยนภาษีจากเรื่องที่ผู้ขายต้องคอยกลัว ให้กลายเป็นเรื่องที่เขาสามารถมองเห็น เข้าใจ และเตรียมตัวได้ — So small businesses can focus on growing, not worrying. ขอบคุณครับ'
    }
  ];
})();
