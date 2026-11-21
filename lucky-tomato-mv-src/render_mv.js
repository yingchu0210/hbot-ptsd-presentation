const {chromium}=require('playwright');const {spawn}=require('child_process');const fs=require('fs');const path=require('path');
const dir=__dirname,mode=process.argv[2],out=process.argv[3];
(async()=>{const b=await chromium.launch();const pg=await b.newPage({viewport:{width:1920,height:1080}});
 pg.on('pageerror',e=>console.log('PAGEERR',e.message,e.stack&&e.stack.split('\n')[1]));pg.on('console',m=>{if(m.type()==='error')console.log('CONSOLE',m.text())});
 await pg.goto('file://'+dir+'/site/mv.html');await pg.waitForFunction('window.READY',{timeout:60000});
 const chars=[...new Set((['kit.js','scenes.js','main.js','timing.js'].map(f=>fs.readFileSync(path.join(dir,'site',f),'utf8')).join('')).match(/[\u2e80-\u9fff\uff00-\uffef\u3000-\u303f]/g)||[])].join('')+'0123456789LINEQlin.ee/NIcBKDsfacebook.com';
 await pg.evaluate(async c=>{await document.fonts.load('40px Huninn',c);await document.fonts.ready},chars);
 if(mode==='frames'){const qa=path.join(dir,'qa');fs.mkdirSync(qa,{recursive:true});for(const t of process.argv.slice(4).map(Number)){await pg.evaluate(t=>render(t),t);fs.writeFileSync(path.join(qa,`t${String(t).padStart(6,'0')}.jpg`),await pg.screenshot({type:'jpeg',quality:80}))}await b.close();return}
 const fps=30,N=Math.round(120.84*fps);
 const ff=spawn('ffmpeg',['-y','-loglevel','error','-f','image2pipe','-framerate',String(fps),'-vcodec','mjpeg','-i','-','-i',path.join(dir,'site/song.mp3'),'-map','0:v','-map','1:a','-c:v','libx264','-pix_fmt','yuv420p','-crf','20','-preset','medium','-movflags','+faststart','-r',String(fps),'-c:a','aac','-b:a','192k','-t','120.84',out],{stdio:['pipe','inherit','inherit']});
 for(let f=0;f<N;f++){await pg.evaluate(t=>render(t),f/fps);const buf=await pg.screenshot({type:'jpeg',quality:92});if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r));if(f%300===0)console.log('frame',f,'/',N)}
 ff.stdin.end();await new Promise(r=>ff.on('close',r));await b.close();console.log('done')})();
