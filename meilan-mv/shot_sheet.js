const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:2400,height:1500}});
p.on('pageerror',e=>console.error('ERR',e.message));
for(const n of [1,2,3]){await p.goto(`http://localhost:8765/sheet.html?sheet=${n}`);await p.waitForFunction('window.ready===true',null,{timeout:60000});await p.waitForTimeout(500);
 await p.locator('#c').screenshot({path:`/tmp/claude-0/work/sheet${n}.png`});}
await b.close()})()
