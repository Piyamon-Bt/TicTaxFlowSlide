const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--use-gl=swiftshader','--enable-unsafe-swiftshader'] });
  const ctx = await b.newContext({ viewport:{width:1920,height:1080} });
  const p = await ctx.newPage();
  const errs=[]; p.on('pageerror',e=>errs.push('PAGEERROR '+e.message));
  p.on('console',m=>{ if(m.type()==='error') errs.push('CONSOLE '+m.text()); });
  await p.goto('file://'+process.cwd()+'/index.html');
  await p.waitForTimeout(3500);
  await p.screenshot({path:'shots/hero-a.png'});
  await p.waitForTimeout(4000);
  await p.screenshot({path:'shots/hero-b.png'});
  const info = await p.evaluate(()=>({
    webgl: !document.body.classList.contains('no-webgl'),
    model: !!window.TTF_PHONE && window.TTF_PHONE.v,
    sysNames: (window.TTF && window.TTF.__debug) || null
  }));
  console.log(JSON.stringify({info, errs}, null, 1));
  await b.close();
})();
