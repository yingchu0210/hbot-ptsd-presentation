const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();
for(const cs of ['c']){const p=await b.newPage({viewport:{width:1280,height:720}});
 await p.goto(`http://localhost:8765/mv.html?cs=${cs}`);await p.waitForFunction('window.ready===true');
 for(const t of [62,129.2]){await p.evaluate(t=>renderFrame(t),t);await p.locator('#c').screenshot({path:`/tmp/claude-0/work/cs_${cs}_${t}.png`})}
 await p.close()}
await b.close()})()
