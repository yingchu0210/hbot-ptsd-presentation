const {chromium}=require('playwright');const {spawn}=require('child_process');const fs=require('fs');const path=require('path');
const dir=__dirname,out=process.argv[2]||path.join(dir,'out.mp4'),mode=process.argv[3]||'full';
(async()=>{
 const b=await chromium.launch();const pg=await b.newPage({viewport:{width:1920,height:1080}});
 pg.on('pageerror',e=>console.log('PAGEERR',e.message));pg.on('console',m=>{if(m.type()==='error')console.log('CONSOLE',m.text())});
 await pg.goto('file://'+dir+'/puppet.html');await pg.waitForFunction('window.READY');
 const qa=path.join(dir,'qa_puppet');fs.mkdirSync(qa,{recursive:true});
 if(mode==='frames'){ // test specific times
  const ts=process.argv.slice(4).map(Number);for(const t of ts){await pg.evaluate(t=>render(t),t);fs.writeFileSync(path.join(qa,`t${t}.png`),await pg.screenshot({type:'png'}))}await b.close();return}
 console.log('audio...');const b64=await pg.evaluate(()=>synth());const pcm=Buffer.from(b64,'base64');
 const hdr=Buffer.alloc(44);hdr.write('RIFF',0);hdr.writeUInt32LE(36+pcm.length,4);hdr.write('WAVEfmt ',8);hdr.writeUInt32LE(16,16);hdr.writeUInt16LE(1,20);hdr.writeUInt16LE(2,22);hdr.writeUInt32LE(44100,24);hdr.writeUInt32LE(44100*4,28);hdr.writeUInt16LE(4,32);hdr.writeUInt16LE(16,34);hdr.write('data',36);hdr.writeUInt32LE(pcm.length,40);
 fs.writeFileSync(path.join(dir,'audio_puppet.wav'),Buffer.concat([hdr,pcm]));
 const ff=spawn('ffmpeg',['-y','-loglevel','error','-f','image2pipe','-framerate','30','-vcodec','mjpeg','-i','-','-i',path.join(dir,'audio_puppet.wav'),'-c:v','libx264','-pix_fmt','yuv420p','-crf','20','-movflags','+faststart','-preset','medium','-r','30','-c:a','aac','-b:a','192k','-t','30',out],{stdio:['pipe','inherit','inherit']});
 const N=900;for(let f=0;f<N;f++){await pg.evaluate(t=>render(t),f/30);const buf=await pg.screenshot({type:'jpeg',quality:96});
  if(f%30===0)fs.writeFileSync(path.join(qa,`s${String(f/30).padStart(2,'0')}.jpg`),buf);
  if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r));if(f%90===0)console.log('frame',f)}
 ff.stdin.end();await new Promise(r=>ff.on('close',r));await b.close();console.log('done');
})();
