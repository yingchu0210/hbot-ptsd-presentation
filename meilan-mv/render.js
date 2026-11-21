// 用法：node render.js <起始秒> <結束秒> <fps> <輸出資料夾> [workerIndex workerCount]
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
(async()=>{
  const [a,b,fps,out,wi='0',wn='1']=process.argv.slice(2);
  fs.mkdirSync(out,{recursive:true});
  const br=await chromium.launch();const pg=await br.newPage({viewport:{width:1280,height:720}});
  pg.on('pageerror',e=>console.error('PAGEERR',e.message));
  await pg.goto('http://localhost:8765/mv.html');await pg.waitForFunction('window.ready===true',null,{timeout:60000});
  const n0=Math.round(+a*+fps),n1=Math.round(+b*+fps);
  for(let n=n0+ +wi;n<n1;n+=+wn){
    const t=n/ +fps;
    const d=await pg.evaluate(t=>{renderFrame(t);return document.getElementById('c').toDataURL('image/jpeg',0.92)},t);
    fs.writeFileSync(path.join(out,`f${String(n).padStart(5,'0')}.jpg`),Buffer.from(d.split(',')[1],'base64'));
  }
  await br.close();
})();
