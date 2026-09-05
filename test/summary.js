const fs=require('fs');
for (const d of ['desktop','desktop-reduced','laptop','tv','mobile','mobile-reduced']) {
  const f='./shots/'+d+'/report.json';
  if(!fs.existsSync(f)){console.log(d+' | (not run)');continue;}
  const r=JSON.parse(fs.readFileSync(f,'utf8'));
  console.log([d,
   'seq='+r.report.map(x=>x.n).join(','),
   'problems='+r.problems.filter(p=>!/GL Driver/.test(p)).length,
   'missingFacts='+r.missingFacts.length,
   'croppedHeadings='+r.report.filter(x=>x.cropped.length).length,
   'overflowX='+r.report.filter(x=>x.overflowX).length,
   'tallerThanViewport='+(r.report.filter(x=>x.contentTaller).map(x=>x.n).join('/')||'none')
  ].join(' | '));
}
