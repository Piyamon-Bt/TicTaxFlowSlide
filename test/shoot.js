const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const FILE = 'file://' + path.resolve(__dirname, '..', 'index.html');

(async () => {
  const args = process.argv.slice(2);
  const mode = args[0] || 'desktop';
  const size = mode === 'mobile' ? { width: 390, height: 844 }
    : mode === 'laptop' ? { width: 1440, height: 900 }
    : mode === 'tv' ? { width: 1280, height: 720 }
    : { width: 1920, height: 1080 };
  const reduced = args.includes('--reduced');
  const outDir = path.resolve(__dirname, '..', 'shots', mode + (reduced ? '-reduced' : ''));
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
  const ctx = await browser.newContext({
    viewport: size,
    deviceScaleFactor: 1,
    hasTouch: mode === 'mobile',
    isMobile: mode === 'mobile',
    reducedMotion: reduced ? 'reduce' : 'no-preference'
  });
  const page = await ctx.newPage();
  const problems = [];
  page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') problems.push('[' + m.type() + '] ' + m.text()); });
  page.on('pageerror', e => problems.push('[pageerror] ' + e.message));
  page.on('requestfailed', r => problems.push('[404/failed] ' + r.url().slice(0, 120)));

  await page.goto(FILE, { waitUntil: 'load' });
  await page.waitForTimeout(900);

  const report = [];
  for (let i = 1; i <= 12; i++) {
    if (i > 1) { await page.keyboard.press('ArrowRight'); }
    await page.waitForTimeout(i === 1 ? 4800 : 4200);
    await page.screenshot({ path: path.join(outDir, 'ch' + String(i).padStart(2, '0') + '.png') });
    const info = await page.evaluate(() => {
      const sec = document.querySelector('.chapter.is-active');
      const deck = document.getElementById('deck');
      const overflow = document.documentElement.scrollWidth > window.innerWidth + 1;
      const inner = sec ? sec.querySelector('.inner') : null;
      const r = inner ? inner.getBoundingClientRect() : null;
      const heads = sec ? [...sec.querySelectorAll('.headline,.mega,.revealtext,.q-line')] : [];
      const cropped = heads.filter(h => {
        const b = h.getBoundingClientRect();
        return b.top < -2 || b.bottom > window.innerHeight + 2 || b.left < -2 || b.right > window.innerWidth + 2;
      }).map(h => (h.textContent || '').trim().slice(0, 40));
      return {
        n: sec ? sec.dataset.ch : '?',
        counter: document.getElementById('chapNum').textContent,
        overflowX: overflow,
        innerTop: r ? Math.round(r.top) : null,
        innerBottom: r ? Math.round(r.bottom) : null,
        vh: window.innerHeight,
        contentTaller: r ? r.height > window.innerHeight - 40 : false,
        cropped
      };
    });
    report.push(info);
  }

  // reduced-motion content presence check
  const facts = await page.evaluate(() => {
    const t = document.body.innerText.replace(/\u00a0/g,' ');
    const want = ['1,800,000', '1,642,350', '157,650', '91%', '฿420K', '฿870K', '฿1.34M', '฿1.72M',
      '฿200K – ฿1.8M', '฿199–299', '฿400–600', '4 Channels. 1 Taxpayer.', 'Meet TicTaxFlow.',
      'หักตามจริง หรือ เหมา?', 'Know before it', 'Simple.', 'Automatic.', 'Accessible.',
      "Growth shouldn't make tax scarier.", 'So small businesses can focus on growing'];
    return want.filter(w => t.indexOf(w) === -1);
  });

  fs.writeFileSync(path.join(outDir, 'report.json'), JSON.stringify({ report, problems, missingFacts: facts }, null, 2));
  console.log(JSON.stringify({ mode, reduced, problems, missingFacts: facts, report }, null, 1));
  await browser.close();
})();
