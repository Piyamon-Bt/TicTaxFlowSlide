const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--use-gl=swiftshader','--enable-unsafe-swiftshader'] });
  const p = await (await b.newContext({viewport:{width:1920,height:1080}})).newPage();
  await p.goto('file://'+process.cwd()+'/index.html'); await p.waitForTimeout(1200);
  const res = [];
  for (let i=1;i<=12;i++){
    if(i>1){ await p.keyboard.press('ArrowRight'); await p.waitForTimeout(1800); }
    const m = await p.evaluate(()=>new Promise(r=>{
      let n=0,t0=performance.now();
      (function f(){ n++; if(performance.now()-t0<1000) requestAnimationFrame(f); else r(n); })();
    }));
    res.push({ch:i, fps:m});
  }
  const mem = await p.evaluate(()=>performance.memory? Math.round(performance.memory.usedJSHeapSize/1048576):null);
  console.log(JSON.stringify({fps:res, heapMB:mem}));
  await b.close();
})();
