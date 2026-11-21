/* 美蘭 MV — 場景與角色動畫（Canvas 2D，全部由程式繪製，t＝音樂秒數）*/
const W=1280,H=720,TAU=Math.PI*2,PI=Math.PI;
const INK='#3B2A24',CREAM='#FFF7E8',RED='#D8523F',PINK='#F9A2B8',HOT='#E8708F',TEAL='#5FA8A0',GOLD='#F0B340',GOLD2='#FBE29A',SKIN='#FDD0A8',ORCHID='#9B6BB5',PLUMD='#8E3F5A';
const BEAT=0.496, BEAT0=0.366;               // 拍點：每 0.496 秒一拍
const FONT='"JF OpenHuninn","WenQuanYi Zen Hei","Noto Sans CJK TC",sans-serif';   // 內文：粉圓體（圓潤，呼應 Q 版角色）
const SERIF='"Noto Serif TC","Songti TC",serif';                                        // 標題：思源宋體 Black（高對比、優雅）
const cv=document.getElementById('c'), c=cv.getContext('2d');

/* ---------- 小工具 ---------- */
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const ease=x=>{x=clamp(x);return x*x*(3-2*x)};
const easeOut=x=>{x=clamp(x);return 1-Math.pow(1-x,3)};
const back=x=>{x=clamp(x);const s=1.70158;return 1+(s+1)*Math.pow(x-1,3)+s*Math.pow(x-1,2)};
const lerp=(a,b,x)=>a+(b-a)*x;
const hash=i=>{const s=Math.sin(i*127.1+311.7)*43758.5453;return s-Math.floor(s)};
const beatPh=t=>(t-BEAT0)/BEAT;              // 拍相位（整數＝剛好踩拍）
const pulse=t=>{const p=beatPh(t);const f=p-Math.floor(p);return Math.exp(-f*5)}; // 每拍重擊後衰減 1→0
function inkStyle(w=5){c.lineWidth=w;c.strokeStyle=INK;c.lineJoin='round';c.lineCap='round'}
function fillStroke(f,w=5){c.fillStyle=f;c.fill();if(w){inkStyle(w);c.stroke()}}
function circle(x,y,r,f,w=5){c.beginPath();c.arc(x,y,r,0,TAU);fillStroke(f,w)}
function ell(x,y,rx,ry,rot,f,w=5){c.beginPath();c.ellipse(x,y,rx,ry,rot,0,TAU);fillStroke(f,w)}
function rrect(x,y,w,h,r,f,sw=5){c.beginPath();c.roundRect(x,y,w,h,r);fillStroke(f,sw)}
function txt(s,x,y,size,fill,o={}){c.save();c.font=`${o.weight||'normal'} ${size}px ${o.font||FONT}`;if(o.ls)c.letterSpacing=o.ls+'px';c.textAlign=o.align||'center';c.textBaseline=o.base||'middle';
  if(o.rot){c.translate(x,y);c.rotate(o.rot);x=0;y=0}
  if(o.stroke){c.lineWidth=o.sw||8;c.strokeStyle=o.stroke;c.lineJoin='round';c.strokeText(s,x,y)}
  c.fillStyle=fill;c.fillText(s,x,y);c.restore()}
function grad(y0,y1,a,b){const g=c.createLinearGradient(0,y0,0,y1);g.addColorStop(0,a);g.addColorStop(1,b);return g}
function mix(a,b,x){const p=s=>[1,3,5].map(i=>parseInt(s.slice(i,i+2),16));const A=p(a),B=p(b);return '#'+A.map((v,i)=>Math.round(lerp(v,B[i],x)).toString(16).padStart(2,'0')).join('')}

/* ---------- 素材載入：把圖層先轉成點陣（加速）---------- */
const RS=0.7, LAY={};
const OUTFITS=['daily','hakka','apron','redtang','mint','stripe','dress'];
async function rasterURL(key,url,w,h){
  const img=new Image(); img.src=url; await img.decode();
  const o=document.createElement('canvas'); o.width=Math.round(w*RS); o.height=Math.round(h*RS);
  o.getContext('2d').drawImage(img,0,0,o.width,o.height); LAY[key]=o;
}
async function loadAll(){
  const jobs=[rasterURL('head','rig3/head.png',1103,1426)];
  for(const k of OUTFITS) jobs.push(rasterURL('body_'+k,`rig3/body_${k}.png`,1103,1426));
  for(const sd of ['L','R']) for(const h of ['fist','open','thumb']) jobs.push(rasterURL(`arm${sd}_${h}`,`rig3/arm${sd}_${h}.svg`,340,760));
  await Promise.all(jobs);
  if(document.fonts){const all=SECS.map(x=>x.L.join('')).join('')+'獻給最愛的媽！開飯囉對啊真的是喔好～';await Promise.all([document.fonts.load(`40px ${FONT}`,all),document.fonts.load(`900 40px ${SERIF}`,'美蘭，我愛你獻給最愛的媽福！'),document.fonts.load(`900 40px ${SERIF}`,'嗓門超嘹亮')]).catch(()=>{});await document.fonts.ready}
}

/* ---------- 美蘭（媽媽角色）：灰白捲髮、白花髮夾；服裝可換 ---------- */
// 圖層座標（1103×1426 畫布）：肩膀＝袖口下緣、脖子、腳底
const PV={L:[377,750],R:[733,750],neck:[555,540],feet:[555,1391]};
const SCALE_ADJ=0.95;
let CUR_OUTFIT='daily';
const FACE={eyeL:[479,374],eyeR:[638,374],browL:[477,318],browR:[638,318],nose:[559,406],mouth:[559,464]};
const FACE_INK='#1b120b',BROW='#8a644f';
// 表情：eyes(arc|round|wow)、brow(偏移/傾斜)、mouth(open 0..1 / frown / o)
const EXPR={
  smile:{eyes:'arc',curve:26,brow:[0,0],open:.16,ticks:true},
  happy:{eyes:'arc',curve:30,brow:[-2,0],open:.5,ticks:true},
  laugh:{eyes:'arc',curve:36,brow:[-8,0],open:1,ticks:true},
  shy:{eyes:'arc',curve:16,brow:[5,0],open:.1,ticks:false,blush:true},
  sad:{eyes:'round',brow:[-2,12],open:0,frown:true},
  wow:{eyes:'wow',brow:[-12,0],open:0,mo:true}
};
function faceDraw(name,mopen){
  const E=EXPR[name]||EXPR.smile,F=FACE;
  c.save();c.lineCap='round';c.lineJoin='round';
  // 眼睛
  for(const [i,[x,y]] of [[0,F.eyeL],[1,F.eyeR]]){
    if(E.eyes==='arc'){c.beginPath();c.moveTo(x-40,y+13);c.quadraticCurveTo(x,y+13-E.curve*1.9,x+40,y+13);c.lineWidth=13;c.strokeStyle=FACE_INK;c.stroke()}
    else{const rx=E.eyes==='wow'?15:11,ry=E.eyes==='wow'?18:13;c.beginPath();c.ellipse(x,y+8,rx,ry,0,0,TAU);c.fillStyle=FACE_INK;c.fill();c.beginPath();c.arc(x-4,y+2,4.2,0,TAU);c.fillStyle='#fff';c.fill()}
  }
  // 眉毛
  const [by,tilt]=E.brow;c.strokeStyle=BROW;c.lineWidth=14;
  for(const [i,[x,y]] of [[0,F.browL],[1,F.browR]]){
    const sd=i?1:-1;                                // 左眉 sd=-1：外側在左
    const outerY=y+10+by+tilt, innerY=y+10+by-tilt*.7;
    c.beginPath();c.moveTo(x+sd*36,outerY);c.quadraticCurveTo(x,y-14+by,x-sd*36,innerY);c.stroke();
  }
  // 鼻
  c.beginPath();c.moveTo(F.nose[0]-14,F.nose[1]);c.quadraticCurveTo(F.nose[0],F.nose[1]+16,F.nose[0]+14,F.nose[1]);c.lineWidth=8;c.strokeStyle=FACE_INK;c.stroke();
  // 嘴
  const [mx,my]=F.mouth;const open=(mopen!=null&&E.open>0)?mopen:E.open;
  if(E.mo){c.beginPath();c.ellipse(mx,my+8,15,19,0,0,TAU);c.fillStyle='#c4444f';c.fill();c.lineWidth=7;c.strokeStyle=FACE_INK;c.stroke()}
  else if(E.frown){c.beginPath();c.moveTo(mx-26,my+16);c.quadraticCurveTo(mx,my-6,mx+26,my+16);c.lineWidth=9;c.strokeStyle=FACE_INK;c.stroke()}
  else if(open<.14){c.beginPath();c.moveTo(mx-34,my-2);c.quadraticCurveTo(mx,my+26,mx+34,my-2);c.lineWidth=9;c.strokeStyle=FACE_INK;c.stroke()}
  else{
    const w=40+16*open,d=10+54*open,y0=my-8;
    c.beginPath();c.moveTo(mx-w,y0);c.quadraticCurveTo(mx,y0+7,mx+w,y0);c.bezierCurveTo(mx+w*.95,y0+d*1.25,mx-w*.95,y0+d*1.25,mx-w,y0);c.closePath();
    c.fillStyle='#cf4f5d';c.fill();
    c.save();c.clip();
    c.beginPath();c.ellipse(mx,y0+d*.95,w*.7,d*.4,0,0,TAU);c.fillStyle='#ef7f88';c.fill();
    c.fillStyle='#fff';c.beginPath();c.moveTo(mx-w+4,y0);c.quadraticCurveTo(mx,y0+7,mx+w-4,y0);c.lineTo(mx+w-8,y0+Math.min(17,d*.36));c.quadraticCurveTo(mx,y0+Math.min(24,d*.5),mx-w+8,y0+Math.min(17,d*.36));c.closePath();c.fill();
    c.restore();
    c.beginPath();c.moveTo(mx-w,y0);c.quadraticCurveTo(mx,y0+7,mx+w,y0);c.bezierCurveTo(mx+w*.95,y0+d*1.25,mx-w*.95,y0+d*1.25,mx-w,y0);c.closePath();c.lineWidth=6;c.strokeStyle='#7a2a34';c.stroke();
    if(E.ticks){c.lineWidth=8;c.strokeStyle=FACE_INK;for(const sd of[-1,1]){c.beginPath();c.moveTo(mx+sd*(w+14),y0-6);c.quadraticCurveTo(mx+sd*(w+22),y0+4,mx+sd*(w+14),y0+14);c.stroke()}}
  }
  if(E.blush){c.fillStyle='rgba(250,120,130,.35)';c.beginPath();c.ellipse(447,418,44,32,0,0,TAU);c.fill();c.beginPath();c.ellipse(671,418,44,32,0,0,TAU);c.fill()}
  c.restore();
}
function mom(o){
  const s=(o.s||0.42)*SCALE_ADJ, x=o.x, y=o.y, outfit=o.outfit||CUR_OUTFIT;
  c.save();
  if(o.shadow!==false){c.fillStyle='rgba(60,40,20,.18)';c.beginPath();c.ellipse(x,y+4,175*s*(o.sx||1),22*s*1.1,0,0,TAU);c.fill()}
  c.translate(x,y);c.scale(s*(o.flip?-1:1)*(o.sx||1),s*(o.sy||1));c.rotate((o.rot||0)*PI/180);c.translate(-PV.feet[0],-PV.feet[1]);
  const k=1/RS, draw=(n)=>c.drawImage(LAY[n],0,0,LAY[n].width*k,LAY[n].height*k);
  for(const side of ['L','R']){                       // 手臂在身體後面（從袖子下面伸出來）
    const a=o[side]||[0,'fist']; c.save(); c.translate(PV[side][0],PV[side][1]); c.rotate((side==='L'?a[0]:-a[0])*PI/180);
    c.drawImage(LAY[`arm${side}_${a[1]}`],-170,-110,340,760); c.restore();
  }
  draw('body_'+outfit);
  c.save();c.translate(PV.neck[0],PV.neck[1]);c.rotate((o.tilt||0)*PI/180);c.translate(-PV.neck[0],-PV.neck[1]);
  draw('head');faceDraw(o.expr||'smile',o.mopen);c.restore();
  c.restore();
}
// 唱歌嘴型：依歌詞逐字開合
function mouth(t,base){
  const a=activeLyric(t); if(!a) return base;
  const chars=[...a.text].filter(ch=>!'，。！？、 '.includes(ch)); const n=chars.length;
  const per=(a.b-a.a-0.15)/n, k=Math.floor((t-a.a)/per), f=((t-a.a)/per)-k;
  if(k<0||k>=n) return 'smile';
  if(base==='wow') return f<.7?'wow':'smile';
  return f<.72 ? (k%3===1?'happy':'laugh') : 'smile';
}
// 基本動作：踩拍彈跳
function bounce(t,amp=9){return -Math.abs(Math.sin(PI*beatPh(t)))*amp}
function sway(t,period=2){return Math.sin(TAU*t/(BEAT*period))}

/* ---------- 道具：花、星、錢幣 ---------- */
function orchid(x,y,r,rot=0,tone=0){
  c.save();c.translate(x,y);c.rotate(rot);
  const W1=tone? '#F6E3FF':'#FFFFFF', P='#E96BC4';
  ell(-r*.55,-r*.1,r*.6,r*.5,-.35,W1,r*.07);ell(r*.55,-r*.1,r*.6,r*.5,.35,W1,r*.07);
  ell(0,-r*.62,r*.32,r*.55,0,W1,r*.07);ell(-r*.38,r*.5,r*.3,r*.52,.5,W1,r*.07);ell(r*.38,r*.5,r*.3,r*.52,-.5,W1,r*.07);
  c.beginPath();c.moveTo(0,-r*.1);c.quadraticCurveTo(-r*.35,r*.2,-r*.1,r*.6);c.quadraticCurveTo(0,r*.75,r*.1,r*.6);c.quadraticCurveTo(r*.35,r*.2,0,-r*.1);fillStroke(P,r*.06);
  circle(0,-r*.05,r*.1,GOLD,r*.04);
  c.restore();
}
function plum(x,y,r,rot=0){
  c.save();c.translate(x,y);c.rotate(rot);
  for(let i=0;i<5;i++){c.rotate(TAU/5);ell(0,-r*.55,r*.42,r*.5,0,i%2?'#F58AA8':'#F7A0B8',r*.06)}
  circle(0,0,r*.22,'#E0476E',r*.04);
  c.strokeStyle=INK;c.lineWidth=r*.04;for(let i=0;i<7;i++){const a=i*TAU/7;c.beginPath();c.moveTo(Math.cos(a)*r*.2,Math.sin(a)*r*.2);c.lineTo(Math.cos(a)*r*.42,Math.sin(a)*r*.42);c.stroke();circle(Math.cos(a)*r*.44,Math.sin(a)*r*.44,r*.05,GOLD,0)}
  c.restore();
}
function daisy(x,y,r,col='#FFFFFF',mid=GOLD,rot=0){c.save();c.translate(x,y);c.rotate(rot);for(let i=0;i<8;i++){c.rotate(TAU/8);ell(0,-r*.6,r*.22,r*.42,0,col,r*.07)}circle(0,0,r*.32,mid,r*.07);c.restore()}
function sunflower(x,y,r,rot=0){c.save();c.translate(x,y);c.rotate(rot);for(let i=0;i<12;i++){c.rotate(TAU/12);ell(0,-r*.68,r*.2,r*.38,0,'#FFC928',r*.06)}circle(0,0,r*.42,'#7A4A22',r*.07);c.restore()}
function heart(x,y,s,f=HOT,rot=0,w=4){c.save();c.translate(x,y);c.rotate(rot);c.scale(s,s);c.beginPath();c.moveTo(0,8);c.bezierCurveTo(-24,-8,-14,-26,0,-12);c.bezierCurveTo(14,-26,24,-8,0,8);c.lineWidth=w/s;c.fillStyle=f;c.fill();c.strokeStyle=INK;c.stroke();c.restore()}
function note(x,y,s,f=INK,rot=0,dbl=false){c.save();c.translate(x,y);c.rotate(rot);c.scale(s,s);c.fillStyle=f;c.strokeStyle=f;c.lineWidth=4;
  c.beginPath();c.ellipse(0,0,9,7,-.4,0,TAU);c.fill();c.beginPath();c.moveTo(8,-2);c.lineTo(8,-34);c.stroke();
  if(dbl){c.beginPath();c.ellipse(-24,6,9,7,-.4,0,TAU);c.fill();c.beginPath();c.moveTo(-16,4);c.lineTo(-16,-28);c.stroke();c.beginPath();c.moveTo(8,-34);c.lineTo(-16,-28);c.lineWidth=7;c.stroke()}
  else{c.beginPath();c.moveTo(8,-34);c.quadraticCurveTo(22,-26,18,-14);c.stroke()}c.restore()}
function sparkle(x,y,r,f='#FFF6B0',rot=0){c.save();c.translate(x,y);c.rotate(rot);c.beginPath();for(let i=0;i<8;i++){const a=i*PI/4,rr=i%2?r*.28:r;c.lineTo(Math.cos(a)*rr,Math.sin(a)*rr)}c.closePath();c.fillStyle=f;c.fill();c.restore()}
function coin(x,y,r,t,f=0){c.save();c.translate(x,y);const w=Math.cos(t*5+f);c.scale(Math.abs(w)*.85+.15,1);circle(0,0,r,GOLD,r*.12);circle(0,0,r*.72,GOLD2,r*.07);c.beginPath();c.rect(-r*.22,-r*.22,r*.44,r*.44);c.fillStyle='#E49B1B';c.fill();c.restore()}
function ingot(x,y,s,rot=0){c.save();c.translate(x,y);c.rotate(rot);c.scale(s,s);
  c.beginPath();c.moveTo(-44,-14);c.quadraticCurveTo(-42,12,-26,22);c.lineTo(26,22);c.quadraticCurveTo(42,12,44,-14);c.quadraticCurveTo(0,8,-44,-14);c.closePath();fillStroke(GOLD,4);
  ell(0,-12,24,16,0,GOLD2,4);c.strokeStyle='#C98A12';c.lineWidth=3;c.beginPath();c.arc(0,-12,10,PI*1.1,PI*1.9);c.stroke();c.restore()}
function cloud(x,y,s,f='#FFFFFF',a=1){c.save();c.globalAlpha*=a;c.translate(x,y);c.scale(s,s);c.beginPath();c.arc(-40,6,28,0,TAU);c.arc(-8,-8,38,0,TAU);c.arc(32,2,32,0,TAU);c.arc(60,12,22,0,TAU);c.rect(-60,6,120,28);c.fillStyle=f;c.fill();c.restore()}
function lantern(x,y,s,t){c.save();c.translate(x,y);c.rotate(Math.sin(t*1.5+x)*.06);c.scale(s,s);c.strokeStyle=INK;c.lineWidth=4;c.beginPath();c.moveTo(0,-60);c.lineTo(0,-40);c.stroke();
  rrect(-8,-42,16,8,3,GOLD,3);ell(0,0,34,42,0,RED,4);c.strokeStyle='rgba(74,50,38,.5)';c.lineWidth=2;c.beginPath();c.ellipse(0,0,14,42,0,0,TAU);c.stroke();rrect(-10,38,20,8,3,GOLD,3);
  c.strokeStyle=GOLD;c.lineWidth=3;for(let i=-2;i<=2;i++){c.beginPath();c.moveTo(i*4,46);c.lineTo(i*4+Math.sin(t*3+i)*3,70);c.stroke()}circle(0,0,12,GOLD2,3);circle(0,0,5,RED,0);c.restore()}
function bird(x,y,s,t,col=INK){c.save();c.translate(x,y);c.scale(s,s);const f=Math.sin(t*14+x)*.8;c.strokeStyle=col;c.lineWidth=5;c.lineCap='round';c.beginPath();c.moveTo(-26,-10*f-4);c.quadraticCurveTo(-12,-18-6*f,0,0);c.quadraticCurveTo(12,-18-6*f,26,-10*f-4);c.stroke();c.restore()}
function confetti(t,n,t0=0,cols=[HOT,GOLD,TEAL,ORCHID,'#FFFFFF',RED]){for(let i=0;i<n;i++){const sp=120+hash(i)*160,x=hash(i+7)*W+Math.sin(t*2+i)*40,y=((t-t0)*sp+hash(i+3)*H*2)%(H+80)-40;c.save();c.translate(x,y);c.rotate(t*3+i);c.fillStyle=cols[i%cols.length];c.fillRect(-6,-3,12,6);c.restore()}}
function petalsFall(t,n,cols,speed=60,sz=1){for(let i=0;i<n;i++){const sp=speed*(.6+hash(i)),x=(hash(i+9)*W+Math.sin(t*1.2+i)*60+t*18)%(W+80)-40,y=(t*sp+hash(i+4)*H*3)%(H+80)-40;
  c.save();c.translate(x,y);c.rotate(t*1.5+i);c.scale(sz,sz);const col=cols[i%cols.length];ell(0,0,9,5,0,col,2);c.restore()}}
function steam(x,y,t,n=3,h=140,col='rgba(255,255,255,.75)'){c.save();c.strokeStyle=col;c.lineWidth=9;c.lineCap='round';
  for(let i=0;i<n;i++){const ph=(t*.9+i/n)%1,yy=y-ph*h,a=Math.sin(ph*PI);c.globalAlpha=a*.85;c.beginPath();for(let k=0;k<=12;k++){const yk=yy-k*4,xk=x+(i-1)*22+Math.sin(k*.6+t*3+i*2)*(6+k*.8);k?c.lineTo(xk,yk):c.moveTo(xk,yk)}c.stroke()}c.restore()}
function ring(x,y,t,t0,n=4,col='#FFFFFF',maxR=260,w=7){for(let i=0;i<n;i++){const p=((t-t0)*1.6-i*.3);if(p<0||p>1)continue;c.save();c.globalAlpha=1-p;c.strokeStyle=col;c.lineWidth=w;c.beginPath();c.arc(x,y,20+p*maxR,-.9,.9);c.stroke();c.beginPath();c.arc(x,y,20+p*maxR,PI-.9,PI+.9);c.stroke();c.restore()}}
function bubble(x,y,w,h,s,tail=1,f='#FFFFFF'){c.save();c.translate(x,y);rrect(-w/2,-h/2,w,h,h/2,f,5);c.beginPath();c.moveTo(tail*-30,h/2-3);c.lineTo(tail*-48,h/2+34);c.lineTo(tail*-4,h/2-3);c.fillStyle=f;c.fill();c.strokeStyle=INK;c.lineWidth=5;c.beginPath();c.moveTo(tail*-30,h/2);c.lineTo(tail*-48,h/2+34);c.lineTo(tail*-4,h/2);c.stroke();
  c.fillStyle=f;c.fillRect(Math.min(tail*-30,tail*-4)+1,h/2-5,26,8);txt(s,0,2,h*.55,INK,{});c.restore()}
function burst(x,y,r,f,rot=0,pts=14){c.save();c.translate(x,y);c.rotate(rot);c.beginPath();for(let i=0;i<pts*2;i++){const a=i*PI/pts,rr=i%2?r*.72:r;c.lineTo(Math.cos(a)*rr,Math.sin(a)*rr)}c.closePath();fillStroke(f,5);c.restore()}
function rays(x,y,t,n,col,inner=120,len=1400,spd=.1){c.save();c.translate(x,y);c.rotate(t*spd);c.fillStyle=col;for(let i=0;i<n;i++){const a=i*TAU/n;c.beginPath();c.moveTo(0,0);c.arc(0,0,len,a,a+TAU/n/2);c.closePath();c.fill()}c.restore()}
function sunFace(x,y,r,t,mood=1){circle(x,y,r,'#F5B93E',6);for(let i=0;i<14;i++){const a=i*TAU/14+t*.4;c.save();c.translate(x,y);c.rotate(a);c.beginPath();c.moveTo(r*1.12,-r*.1);c.lineTo(r*1.45+Math.sin(t*4+i)*r*.04,0);c.lineTo(r*1.12,r*.1);c.closePath();fillStroke('#F5B93E',5);c.restore()}
  circle(x,y,r,'#FAD064',6);circle(x-r*.5,y+r*.2,r*.14,'#FF9AA9',0);circle(x+r*.5,y+r*.2,r*.14,'#FF9AA9',0);
  inkStyle(6);c.beginPath();c.arc(x-r*.3,y-r*.1,r*.14,PI*1.1,PI*1.9);c.stroke();c.beginPath();c.arc(x+r*.3,y-r*.1,r*.14,PI*1.1,PI*1.9);c.stroke();
  c.beginPath();c.arc(x,y+r*.05,r*.34,.15,PI-.15);c.stroke()}
function moonFace(x,y,r){circle(x,y,r*1.25,'rgba(255,245,200,.25)',0);circle(x,y,r*1.1,'rgba(255,245,200,.35)',0);circle(x,y,r,'#FFF4C2',0)}

/* ---------- 標題字型排版 ---------- */
function titleText(str,x,y,size,cols,depth,shade,outline,outW=.07){c.save();c.font=`900 ${size}px ${SERIF}`;c.textAlign='center';c.textBaseline='middle';const ls=size*.16;c.letterSpacing=ls+'px';x+=ls/2;
  for(let k=depth;k>=1;k--){c.fillStyle=shade;c.fillText(str,x+k*.8,y+k*1.2)}
  c.lineWidth=size*outW;c.strokeStyle=outline;c.lineJoin='round';c.strokeText(str,x,y);
  const g=c.createLinearGradient(0,y-size*.5,0,y+size*.5);g.addColorStop(0,cols[0]);g.addColorStop(1,cols[1]);c.fillStyle=g;c.fillText(str,x,y);c.restore()}
function ornament(x,y,w,col){c.save();c.strokeStyle=col;c.lineWidth=3;c.lineCap='round';c.beginPath();c.moveTo(x-w/2,y);c.lineTo(x-30,y);c.moveTo(x+30,y);c.lineTo(x+w/2,y);c.stroke();c.restore();plum(x,y,15,0)}

/* ---------- 背景元素 ---------- */
function hills(base,amp,col,ph,freq=.004,step=8){c.beginPath();c.moveTo(0,H);for(let x=0;x<=W+step;x+=step)c.lineTo(x,base+Math.sin(x*freq+ph)*amp+Math.sin(x*freq*2.3+ph*1.7)*amp*.4);c.lineTo(W,H);c.closePath();c.fillStyle=col;c.fill()}
function mountain(x,y,w,h,col){c.beginPath();c.moveTo(x-w/2,y);c.bezierCurveTo(x-w*.25,y-h*.9,x-w*.1,y-h,x,y-h);c.bezierCurveTo(x+w*.15,y-h,x+w*.3,y-h*.6,x+w/2,y);c.closePath();c.fillStyle=col;c.fill()}
function riceFields(y0,t,tone=0){ // 稻田梯形條
  const cols=['#B7D783','#A3C97A','#C4E093','#92BF6E'];for(let i=0;i<5;i++){const yy=y0+i*i*7+i*30;c.beginPath();c.moveTo(0,yy);for(let x=0;x<=W;x+=16)c.lineTo(x,yy+Math.sin(x*.01+i+t*.6)*3);c.lineTo(W,H);c.lineTo(0,H);c.closePath();c.fillStyle=mix(cols[i%4],'#8FA27E',tone);c.fill()}}
function grassBlades(y,t,amp=12,n=60,col='#6AA46A',wind=1){c.strokeStyle=col;c.lineWidth=5;c.lineCap='round';for(let i=0;i<n;i++){const x=i*(W/n)+hash(i)*14;const sw=Math.sin(t*3*wind+i*.7)*amp*wind;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+sw*.4,y-26,x+sw,y-44-hash(i+2)*18);c.stroke()}}
function umbrella(x,y,s,rot,col,t){c.save();c.translate(x,y);c.rotate(rot);c.scale(s,s);
  c.beginPath();c.arc(0,0,60,PI,0);c.lineTo(60,0);c.quadraticCurveTo(0,14,-60,0);c.closePath();fillStroke(col,5);
  c.strokeStyle=INK;c.lineWidth=3;for(let i=-2;i<=2;i++){c.beginPath();c.moveTo(0,-60);c.quadraticCurveTo(i*14,-30,i*24,6);c.stroke()}
  c.beginPath();c.arc(0,-30,10,0,TAU);c.fillStyle='#FFE7A8';c.fill();c.beginPath();c.moveTo(0,0);c.lineTo(0,70);c.lineWidth=5;c.stroke();c.restore()}
function brickWall(x,y,w,h,t){rrect(x,y,w,h,6,'#D98A62',5);c.save();c.beginPath();c.rect(x,y,w,h);c.clip();inkStyle(3);for(let r=0;r<h/28;r++){c.beginPath();c.moveTo(x,y+r*28);c.lineTo(x+w,y+r*28);c.stroke();for(let k=0;k<w/56+1;k++){const bx=x+k*56+(r%2?28:0);c.beginPath();c.moveTo(bx,y+r*28);c.lineTo(bx,y+r*28+28);c.stroke()}}c.restore()}
function pot(x,y,s,t,col=RED,lid=0,soup=false){c.save();c.translate(x,y);c.scale(s,s);
  rrect(-92,-8,40,18,8,col,5);rrect(52,-8,40,18,8,col,5);
  c.beginPath();c.moveTo(-70,-10);c.lineTo(70,-10);c.quadraticCurveTo(76,70,40,86);c.lineTo(-40,86);c.quadraticCurveTo(-76,70,-70,-10);c.closePath();fillStroke(col,5);
  c.fillStyle='rgba(255,255,255,.25)';c.beginPath();c.ellipse(-36,30,8,26,.2,0,TAU);c.fill();
  c.save();c.translate(0,-10-lid);c.rotate(lid*.02);c.beginPath();c.moveTo(-76,0);c.quadraticCurveTo(0,-52,76,0);c.closePath();fillStroke(mix(col,'#FFFFFF',.15),5);circle(0,-36,9,GOLD,4);c.restore();
  c.restore()}
function table(x,y,w,col='#C98B52'){rrect(x,y,w,26,10,col,5);inkStyle(5);c.beginPath();c.moveTo(x+30,y+26);c.lineTo(x+22,y+120);c.moveTo(x+w-30,y+26);c.lineTo(x+w-22,y+120);c.stroke()}
function bowl(x,y,s,rice=true,col='#FFFFFF'){c.save();c.translate(x,y);c.scale(s,s);if(rice){c.beginPath();c.arc(0,-8,34,PI,0);c.closePath();fillStroke('#FFFDF4',4)}c.beginPath();c.moveTo(-40,-8);c.lineTo(40,-8);c.quadraticCurveTo(34,34,0,36);c.quadraticCurveTo(-34,34,-40,-8);c.closePath();fillStroke(col,5);c.strokeStyle=TEAL;c.lineWidth=4;c.beginPath();c.moveTo(-34,6);c.lineTo(34,6);c.stroke();c.restore()}
function trotter(x,y,sc,rot=0){c.save();c.translate(x,y);c.rotate(rot);c.scale(sc,sc);
  c.beginPath();c.moveTo(-46,-6);c.bezierCurveTo(-48,-40,-6,-52,24,-40);c.bezierCurveTo(52,-30,56,6,40,24);c.bezierCurveTo(22,44,-36,40,-46,-6);c.closePath();fillStroke('#A75A2E',4);
  c.beginPath();c.moveTo(-34,14);c.quadraticCurveTo(0,40,34,16);c.quadraticCurveTo(0,26,-34,14);c.fillStyle='#7B3F20';c.fill();
  c.beginPath();c.ellipse(-8,-26,20,7,-.3,0,TAU);c.fillStyle='rgba(255,220,180,.65)';c.fill();
  c.save();c.translate(48,-6);c.rotate(.3);rrect(-4,-10,24,20,6,'#FFF3DC',4);circle(22,-9,8,'#FFF3DC',4);circle(22,9,8,'#FFF3DC',4);c.restore();c.restore()}
function trotterBowl(x,y,sc,t){c.save();c.translate(x,y);c.scale(sc,sc);
  c.beginPath();c.moveTo(-104,-14);c.lineTo(104,-14);c.quadraticCurveTo(94,72,42,86);c.lineTo(-42,86);c.quadraticCurveTo(-94,72,-104,-14);c.closePath();fillStroke('#FFF9EC',5);
  c.save();c.clip();plum(-52,34,16,.2);plum(0,52,16,0);plum(52,34,16,-.2);c.restore();
  c.beginPath();c.moveTo(-104,-14);c.lineTo(104,-14);c.quadraticCurveTo(94,72,42,86);c.lineTo(-42,86);c.quadraticCurveTo(-94,72,-104,-14);c.closePath();inkStyle(5);c.stroke();
  ell(0,-14,104,18,0,'#7B3F20',5);
  trotter(-36,-30,1,-.1);trotter(34,-34,1.05,.18);
  for(const [px,py] of [[-78,-18],[78,-16],[8,-6]]){circle(px,py,7,'#8CC47A',3)}
  c.fillStyle='#5A2D17';c.beginPath();for(let k=0;k<8;k++){const a=k*PI/4,r=k%2?4:10;c.lineTo(-4+Math.cos(a)*r,-4+Math.sin(a)*r)}c.closePath();c.fill();
  c.restore()}
function plate(x,y,sc,t){trotterBowl(x,y-26,sc*.6,t)}
function seal(x,y,sc,rot,t){c.save();c.translate(x,y);c.rotate(rot+Math.sin(t*1.6)*.04);c.scale(sc,sc);
  c.strokeStyle=GOLD;c.lineWidth=5;c.beginPath();c.moveTo(0,-118);c.lineTo(0,-72);c.stroke();circle(0,-118,8,GOLD,3);
  rrect(-70,-70,140,140,22,'#B8322B',5);c.strokeStyle=GOLD2;c.lineWidth=3;c.beginPath();c.roundRect(-58,-58,116,116,14);c.stroke();
  for(const [qx,qy] of [[-58,-58],[58,-58],[-58,58],[58,58]])circle(qx,qy,5,GOLD2,0);
  txt('福',0,5,90,'#FFF1D0',{font:SERIF,weight:900});
  c.strokeStyle='#E8A83A';c.lineWidth=4;for(let i=-2;i<=2;i++){c.beginPath();c.moveTo(i*8,80);c.lineTo(i*10+Math.sin(t*3+i)*3,126);c.stroke()}circle(0,76,9,GOLD,3);c.restore()}
function neighbor(x,y,s,t,k,talk){c.save();c.translate(x,y+Math.sin(t*4+k)*3*talk);c.scale(s,s);
  const body=k?'#7DA8C4':'#EE9A6E',hair=k?'#8A8A8A':'#3A2A22';
  rrect(-46,10,92,110,30,body,5);circle(0,-28,44,SKIN,5);
  if(k){c.beginPath();c.moveTo(-60,-34);c.lineTo(0,-98);c.lineTo(60,-34);c.closePath();fillStroke('#E8C26A',5);ell(0,-34,62,10,0,'#E8C26A',5)}else{circle(0,-64,18,hair,5);c.beginPath();c.arc(0,-34,46,PI*1.05,PI*1.95);fillStroke(hair,5)}
  circle(-15,-26,4.5,INK,0);circle(15,-26,4.5,INK,0);circle(-26,-14,7,'#FFA3A8',0);circle(26,-14,7,'#FFA3A8',0);
  inkStyle(4);c.beginPath();c.arc(0,-16,12,.15,PI-.15);c.stroke();c.restore()}
function caishen(x,y,s,t,arms=0){c.save();c.translate(x,y);c.scale(s,s);
  // 身體
  rrect(-70,20,140,150,50,RED,6);c.fillStyle=GOLD;c.fillRect(-70,60,140,12);inkStyle(5);c.strokeRect(-70,60,140,12);
  circle(0,110,26,GOLD,5);circle(0,110,12,GOLD2,3);
  // 頭
  circle(0,-30,70,'#FFE0BC',6);
  // 帽
  rrect(-48,-124,96,70,18,'#1F1B1A',6);ell(-76,-90,40,12,-.15,'#1F1B1A',6);ell(76,-90,40,12,.15,'#1F1B1A',6);rrect(-48,-80,96,10,3,GOLD,4);
  // 鬍
  c.beginPath();c.moveTo(-48,0);c.quadraticCurveTo(-46,84,0,100);c.quadraticCurveTo(46,84,48,0);c.quadraticCurveTo(30,24,0,22);c.quadraticCurveTo(-30,24,-48,0);c.closePath();fillStroke('#2E2623',5);
  // 臉
  inkStyle(5);c.beginPath();c.arc(-26,-34,12,PI*1.1,PI*1.9);c.stroke();c.beginPath();c.arc(26,-34,12,PI*1.1,PI*1.9);c.stroke();
  circle(-40,-14,10,'#FFA3A8',0);circle(40,-14,10,'#FFA3A8',0);
  const mo=Math.abs(Math.sin(t*9));c.beginPath();c.ellipse(0,18,18,8+mo*6,0,0,TAU);c.fillStyle='#8C2A22';c.fill();c.stroke();
  ingot(-80+Math.sin(t*3)*3,150,1.2,-.2);
  c.restore()}

/* ---------- 場景 ---------- */
let CAMX=0,CAMY=0;
const SC={};
// 共用：取目前句
const LN=(t,k)=>lineAt(t,SECS.findIndex(s=>s.k===k));

SC.intro=function(t){
  const L=LN(t,'intro'),I=SECS[0];
  c.fillStyle=grad(0,H,'#FFF6E4','#F8D9D0');c.fillRect(0,0,W,H);
  rays(W/2,330,t,18,'rgba(255,255,255,.35)',0,1500,.05);
  // 左右花枝
  const grow=ease((t-5)/2.5),grow2=ease((t-9)/2.5);
  for(const sd of[-1,1]){c.save();c.translate(sd<0?0:W,0);c.scale(sd,1);
    inkStyle(9);c.strokeStyle='#7A5236';c.beginPath();c.moveTo(0,640);c.bezierCurveTo(120,520,220,500,260,300);c.stroke();c.beginPath();c.moveTo(120,540);c.bezierCurveTo(220,500,320,520,360,420);c.stroke();
    for(let i=0;i<5;i++){const lx=[120,220,250,330,350][i],ly=[540,500,330,470,430][i];c.save();c.translate(lx,ly);c.rotate(.5+i);ell(0,-24,12,28,0,'#7FC66B',4);c.restore()}
    c.restore()}
  const sway1=Math.sin(t*1.4)*.08;
  // 蘭花（左）
  [[150,300,60,-.3],[250,210,48,.2],[330,430,52,.1],[90,470,44,-.1]].forEach(([x,y,r,rot],i)=>{const a=ease((t-6.0-i*.35)/.8);if(a>0)orchid(x,y+Math.sin(t*1.5+i)*4,r*back(a),rot+sway1,i%2)});
  // 梅花（右）
  [[1130,300,52,0],[1030,220,44,.4],[950,430,50,.2],[1190,470,42,.7],[1060,360,38,.3]].forEach(([x,y,r,rot],i)=>{const a=ease((t-9.8-i*.3)/.8);if(a>0)plum(x,y+Math.sin(t*1.5+i)*4,r*back(a),rot+sway1)});
  petalsFall(t,18,['#FFFFFF','#F7A0B8','#F6E3FF','#F58AA8'],45,1);
  // 標題
  const ta=ease((t-.6)/1.4), tb=ease((t-3.0)/1.4);
  c.save();c.globalAlpha=ta;const ty=lerp(320,108,tb),ts=lerp(1,.42,tb);
  titleText('美蘭',W/2,ty-40*ts,230*ts,['#EE7B8E','#B83F6A'],9*ts,PLUMD,CREAM,.1);
  c.globalAlpha=ta*(1-tb);ornament(W/2,ty+100*ts,420,ORCHID);txt('獻給最愛的媽媽',W/2,ty+150*ts,38*ts,INK,{ls:10});c.restore();
  // 美蘭入場
  const en=easeOut((t-3.8)/2.4); const mx=lerp(W+200,W/2,en);
  const exp=mouth(t,'happy')==='smile'&&activeLyric(t)==null?'happy':mouth(t,'happy');
  const wave=Math.sin(t*5)*14;
  mom({x:mx,y:612+bounce(t,10*en),s:.36,expr:t<3.8?'smile':exp,L:[8,'fist'],R:[en>.9?130+wave:20,'open'],tilt:sway(t,2)*4});
  // 愛心
  if(L.l>=0&&t>1.6){for(let i=0;i<4;i++){const a=((t-1.6)*.5+i/4)%1;heart(W/2+Math.sin(i*2+t)*260,690-a*420,.8+.5*hash(i),HOT);}}
};

SC.v1=function(t){
  const L=LN(t,'v1'),k=L.l;
  // 天色：L2 變黃昏有月亮
  const dusk=ease((t-SECS[1].t[1]+.3)/.6)*(1-ease((t-SECS[1].t[2]+.2)/.6));
  c.fillStyle=grad(0,H*.7,mix('#BFE3EA','#6A5E9C',dusk),mix('#FFF4DC','#F4B8A0',dusk));c.fillRect(0,0,W,H);
  if(dusk>.05){c.globalAlpha=dusk;for(let i=0;i<30;i++)sparkle(hash(i)*W,hash(i+5)*300,4+hash(i+2)*6);c.globalAlpha=1}
  mountain(300,430,560,230,mix('#9CC5AF','#4A5A8E',dusk));mountain(780,430,640,160,mix('#B3D6BD','#56679E',dusk));mountain(1130,430,520,260,mix('#86B79F','#44548A',dusk));
  cloud(220+t*10%1400*0,120,1.2,mix('#FFFFFF','#E9B8C8',dusk),.9);cloud((t*14+700)%1500-100,170,1,mix('#FFFFFF','#E9B8C8',dusk),.9);
  riceFields(430,t,dusk*.6);
  // 月亮（L2）：就在她頭後面
  const mx=1040+Math.sin(t*.8)*3,my=170;
  if(dusk>.02){c.globalAlpha=dusk;const r=92+Math.sin(t*3)*2;moonFace(mx,my,r);c.globalAlpha=1}
  // 風
  const windA=k===0?ease((t-SECS[1].t[0]+.2)/.3)*(1-ease((t-SECS[1].t[1]+.5)/.4)):0;
  const wf=k===0?1.7:.5;
  grassBlades(660,t,14,64,'#6AA46A',wf);
  // 美濃紙傘
  if(k>=2){const a=ease((t-SECS[1].t[2])/.8);[[200,230,.8,-.4,'#E4604A'],[1070,240,.9,.4,'#5C9BC4'],[330,380,.6,-.15,'#F0B340'],[950,380,.65,.2,ORCHID]].forEach(([x,y,s,r,col],i)=>{umbrella(x,y+Math.sin(t*2+i)*8+(1-a)*-300,s*a,r+Math.sin(t*1.5+i)*.08,col,t)})}
  // 招牌
  if(k===2){const a=back((t-SECS[1].t[2]-.4)/.5);c.save();c.translate(1000,560);c.scale(a,a);rrect(-110,-70,220,80,12,'#E9B876',5);rrect(-12,10,24,90,6,'#B07C44',5);txt('美濃',0,-30,54,INK,{});c.restore()}
  // 風線
  if(windA>0||k===0){c.save();c.strokeStyle='rgba(255,255,255,.9)';c.lineWidth=6;c.lineCap='round';for(let i=0;i<6;i++){const x=((t*500+i*260)%1700)-300,y=170+i*70;c.beginPath();c.moveTo(x,y);c.bezierCurveTo(x+60,y-30,x+120,y+30,x+180,y-6);c.stroke()}c.restore()}
  // 葉子飄
  petalsFall(t,k===0?24:8,['#7FC66B','#A5DE7A','#F0B340'],70,1.1);
  // 美蘭
  const base=k===3?'wow':'happy';let ex=mouth(t,base);
  let o={x:640,y:612+bounce(t,9),s:.42,expr:ex,L:[10+sway(t,2)*6,'fist'],R:[10-sway(t,2)*6,'fist'],tilt:sway(t,4)*4};
  if(k===0){o.tilt=Math.sin(t*3)*6;o.L=[14+Math.sin(t*3)*10,'open'];o.R=[14+Math.sin(t*3+1)*10,'open'];o.rot=Math.sin(t*1.8)*2}
  if(k===1){o.tilt=Math.sin(t*2)*5;o.expr=ex==='smile'?'shy':ex}
  if(k===2){const sp=ease((t-SECS[1].t[2])/.5);o.sx=Math.cos(t*4)*0+1;o.L=[110,'open'];o.R=[35,'open'];o.tilt=Math.sin(t*4)*6;}
  if(k===3){const wob=Math.sin(t*22)*1.5;o.rot=wob;o.L=[55+Math.sin(t*20)*6,'open'];o.R=[55-Math.sin(t*20)*6,'open'];o.s=.46*(1+pulse(t)*.03)}
  mom(o);
  if(k===3){ring(640,175,t,SECS[1].t[3],5,'#FFFFFF',420,9);ring(640,175,t,SECS[1].t[3]+.4,5,'#FFE27A',420,9);
    for(let i=0;i<5;i++){const a=((t-SECS[1].t[3])*.9+i*.2)%1;bird(200+i*220+a*(i%2?-1:1)*300,300-a*260+Math.sin(i)*40,.9,t)}
    for(let i=0;i<6;i++){const a=((t-SECS[1].t[3])*1.1+i/6)%1;sparkle(640+Math.cos(i*1.3)*(160+a*200),175+Math.sin(i*1.9)*(60+a*90),20*(1-a)+4,'#FFF6B0',t*2+i)}}
  // 月光暈（L2）加粉紅臉紅
};

function kitchenBG(t,warm=0){
  c.fillStyle=grad(0,H,mix('#FFEBD2','#FFD3A6',warm),mix('#FFE0BA','#F5B88A',warm));c.fillRect(0,0,W,H);
  // 磁磚牆
  c.save();c.globalAlpha=.55;for(let y=0;y<420;y+=70)for(let x=(y/70%2)*35-35;x<W;x+=70){c.strokeStyle='#FFF7E6';c.lineWidth=4;c.strokeRect(x,y,70,70)}c.restore();
  // 窗
  rrect(70,70,260,230,16,'#CFE8EE',6);inkStyle(5);c.beginPath();c.moveTo(200,70);c.lineTo(200,300);c.moveTo(70,185);c.lineTo(330,185);c.stroke();
  cloud(150,140,.5,'#FFFFFF');
  // 窗外蘭花盆
  rrect(110,292,180,28,6,'#C46A46',5);orchid(160,262,28,.1,0);orchid(215,252,32,-.1,1);orchid(268,266,26,.2,0);
  // 掛鍋鏟
  rrect(980,90,180,30,8,'#C98B52',5);for(let i=0;i<3;i++){c.save();c.translate(1010+i*60,118);c.rotate(Math.sin(t*2+i)*.04);inkStyle(5);c.beginPath();c.moveTo(0,0);c.lineTo(0,90);c.stroke();ell(0,110,20,26,0,['#E8E0D0','#F2A65A','#B9D9EB'][i],5);c.restore()}
  // 地
  c.fillStyle='#E4B58A';c.fillRect(0,640,W,80);
}
function counter(t,dark=0){ // 前景流理台（擋住身體下半）
  rrect(-20,520,W+40,220,0,'#F6E7CC',6);c.fillStyle='#D6B58A';c.fillRect(-20,520,W+40,26);inkStyle(6);c.beginPath();c.moveTo(-20,546);c.lineTo(W+20,546);c.stroke();
  for(let i=0;i<7;i++){rrect(i*190-10,580,170,130,12,'#E9D3AE',5)}
}
SC.v2=function(t,rep=false){
  const key=rep?'v2r':'v2',L=LN(t,key),k=L.l,T=SECS[rep?6:2].t;
  kitchenBG(t,rep?.5:0);
  const my=800+(rep?0:0);
  // 磚牆 + 飄香（L2）
  if(k===1||rep){ }
  // 美蘭
  const base=k===3?'laugh':'happy';let ex=mouth(t,base);
  const o={x:640,y:815+bounce(t,8),s:.56,expr:ex,L:[30+sway(t,2)*8,'fist'],R:[30-sway(t,2)*8,'fist'],tilt:sway(t,4)*4};
  if(k===0){o.R=[125,'thumb'];o.L=[20,'fist'];o.tilt=sway(t,2)*5}
  if(k===1){o.L=[60+Math.sin(t*4)*12,'open'];o.R=[60-Math.sin(t*4)*12,'open'];}
  if(k===2){o.L=[45+Math.sin(t*5)*8,'fist'];o.R=[40-Math.sin(t*5)*8,'fist'];o.tilt=Math.sin(t*3)*7}
  if(k===3){o.L=[95,'open'];o.R=[95,'open'];o.expr=mouth(t,'laugh');o.rot=Math.sin(t*20)*1.2;o.s=.5*(1+pulse(t)*.03)}
  mom(o);
  counter(t);
  // 爐上鍋子
  const lid=Math.abs(Math.sin(t*10))*4*(k===2?1.4:.8);
  pot(430,508,1,t,RED,lid);
  pot(850,508,1,t,TEAL,k===2?lid*1.5:lid*.6,true);
  steam(430,430,t,3,180);steam(850,430,t,3,180);
  // 湯泡泡（L3）
  if(k===2){for(let i=0;i<8;i++){const a=((t*1.2+i/8)%1);circle(850+Math.sin(i*3)*50,440-a*110,5+hash(i)*7,'rgba(255,255,255,.8)',2)}}
  // 飄香：波浪香氣線往右飄過牆（L2）
  if(k===1||k===0&&rep){const a=ease((t-T[1])/.5);c.save();c.globalAlpha=a;c.strokeStyle='#FF9E4A';c.lineWidth=9;c.lineCap='round';for(let j=0;j<4;j++){c.beginPath();for(let x=760;x<=1280;x+=12){const y=300+j*30-(x-760)*.14+Math.sin(x*.03-t*5+j)*12;x===760?c.moveTo(x,y):c.lineTo(x,y)}c.stroke()}c.restore();
    if(k===1){const pa=back((t-T[1]-.2)/.5);trotterBowl(1075,350,1.05*pa,t);steam(1075,300,t,3,110)}}
  // 桌上菜（L4 開飯）
  if(k===3){const a=ease((t-T[3])/.4);c.save();c.globalAlpha=a;plate(1080,540+Math.sin(t*12)*3,1.5,t);bowl(960,512+Math.sin(t*12+1)*4,1);bowl(1200,512+Math.sin(t*12+2)*4,1);c.restore();
    ring(640,275,t,T[3],5,'#FFFFFF',450,9);const b=back((t-T[3])/.3);c.save();c.translate(340,140);c.scale(b,b);bubble(0,0,260,100,'開飯囉！',1,'#FFFFFF');c.restore()}
  // 熱氣小心心
  if(k===0||k===2){for(let i=0;i<3;i++){const a=((t*.5+i/3)%1);heart(980+i*60,300-a*140,.7,HOT)}}
};

function stageBG(t,pal){
  c.fillStyle=grad(0,H,pal[0],pal[1]);c.fillRect(0,0,W,H);
  rays(W/2,360,t,pal[3]||16,pal[2],0,1500,.12);
}
SC.chorus=function(t,variant=0){
  const key=['chorus','chorus2','final'][variant],L=LN(t,key),k=L.l,T=SECS[SECS.findIndex(s=>s.k===key)].t;
  const pal=[['#FFF0C8','#F9CE98','rgba(255,255,255,.42)'],['#FCDCD6','#F5B5C4','rgba(255,255,255,.42)'],['#FFF2C6','#F6BC8E','rgba(255,255,255,.45)']][variant];
  stageBG(t,pal);
  // 草地/花田
  hills(560,16,variant===1?'#C4DE9C':'#B4D68E',t*.3);hills(610,14,variant===1?'#A9CC88':'#9CC67F',1+t*.2);
  if(variant===1){for(let i=0;i<12;i++){sunflower(60+i*108+hash(i)*30,560+(i%3)*20,34+hash(i+1)*10,Math.sin(t*2+i)*.1)}}
  else if(variant===2){for(let i=0;i<14;i++){heart(40+i*92,600+(i%3)*15+Math.sin(t*3+i)*6,.9,i%2?HOT:'#FF8FA8')}}
  else{for(let i=0;i<14;i++){daisy(30+i*92+hash(i)*20,590+(i%3)*18,22+hash(i)*8,i%3?'#FFFFFF':'#FFE6F0',GOLD,Math.sin(t*2+i)*.2)}}
  // 大太陽（L2 升起）
  const sunA=variant===2?1:ease((t-T[1]+.2)/.9)+(k>=1?0:0);
  const sx=variant===1?W-210:W-200,sy=lerp(560,190,easeOut(sunA)) ;
  if(k>=1||variant>0){c.save();const s=1+pulse(t)*.03;c.translate(sx,sy);c.scale(s,s);sunFace(0,0,100,t);c.restore()}
  // 音符
  for(let i=0;i<10;i++){const a=((t*.35+i/10)%1);note(160+hash(i)*960,640-a*600,1.1,[HOT,TEAL,RED,ORCHID][i%4],Math.sin(t*2+i)*.3,i%3===0)}
  // 亮晃晃（L3）
  if(k===2){const f=Math.abs(Math.sin((t-T[2])*3))*.25*ease((t-T[2])/.2);c.fillStyle=`rgba(255,255,255,${f})`;c.fillRect(0,0,W,H)}
  // 美蘭
  const base=k===2||k===3?'laugh':'happy';let ex=mouth(t,base);
  const o={x:640,y:612+bounce(t,14),s:.44,expr:ex,L:[40+sway(t,2)*10,'open'],R:[40-sway(t,2)*10,'open'],tilt:sway(t,2)*5};
  if(k===0){o.L=[110+Math.sin(t*4)*10,'open'];o.R=[110-Math.sin(t*4)*10,'open']}
  if(k===1){o.L=[145+Math.sin(t*6)*8,'open'];o.R=[145-Math.sin(t*6)*8,'open']}
  if(k===2){o.L=[50,'thumb'];o.R=[130+Math.sin(t*7)*10,'open'];o.tilt=Math.sin(t*3)*6}
  if(k===3){o.L=[90,'open'];o.R=[90,'open'];o.tilt=Math.sin(t*2)*8}
  if(variant===2&&k===1){o.L=[160,'open'];o.R=[160,'open']}
  mom(o);
  if(k===0)ring(640,190,t,T[0],4,'#FFFFFF',380,8);
  if(k===3){for(let i=0;i<5;i++){const a=((t-T[3])*.8+i*.2)%1;heart(640+Math.sin(i*2.1)*300,400-a*360,1+.4*hash(i),HOT)}}
  if(k===2){for(let i=0;i<10;i++){const a=((t-T[2])*1.2+i*.1)%1;sparkle(640+Math.cos(i*TAU/10)*(150+a*320),300+Math.sin(i*TAU/10)*(120+a*220),22*(1-a)+4)}}
  if(variant===2){confetti(t,36)}
};
SC.chorus2=t=>SC.chorus(t,1);
SC.final=t=>SC.chorus(t,2);

SC.bridge=function(t,variant=0){
  const key=variant?'bridge2':'bridge',L=LN(t,key),k=L.l,T=SECS[SECS.findIndex(s=>s.k===key)].t;
  c.fillStyle=variant?grad(0,H,'#33224C','#873656'):grad(0,H,'#A93232','#DE6B3F');c.fillRect(0,0,W,H);
  rays(W/2,300,t,20,'rgba(255,214,102,.18)',0,1500,.1);
  for(let i=0;i<5;i++)lantern(120+i*260,70+(i%2)*10,1,t);
  if(variant){for(let i=0;i<14;i++){const a=((t*.5+hash(i)*2)%1.4);const fx=100+hash(i)*1080,fy=120+hash(i+3)*240;if(a<1){c.save();c.globalAlpha=1-a;for(let j=0;j<14;j++){const ang=j*TAU/14;sparkle(fx+Math.cos(ang)*a*90,fy+Math.sin(ang)*a*90,8*(1-a)+2,['#FFE27A','#FF8FA8','#8FE3FF'][i%3])}c.restore()}}}
  // 地面
  hills(612,10,'#6E2430',t*.4);c.fillStyle='#521A26';c.fillRect(0,650,W,80);
  // 財神：L2 探頭 → L3 登場鼓掌
  const ca=k===0?0:k===1?ease((t-T[1])/.7)*.7:1;
  if(k>=1){const cx=lerp(1280+120,980,easeOut((t-T[1])/(k===1?1.6:.8)));const cy=330+Math.sin(t*3)*8+(k===1?60:0)-(k>=2?0:0);
    c.save();cloud(cx,cy+190,2.4,'#FFF2D6',.95);caishen(cx,cy,1.05,t);c.restore()}
  // 金幣雨（L4 最盛）
  const rain=k===3?1:k===2?.35:0;
  const N=Math.floor(60*rain);
  for(let i=0;i<N;i++){const sp=260+hash(i)*220;const x=hash(i+11)*W,y=(((t-T[2])*sp+hash(i+5)*H*2)%(H+120))-60;if(i%4===0)ingot(x,y,.8+hash(i)*.4,Math.sin(t*3+i)*.4);else coin(x,y,16+hash(i)*10,t,i)}
  // 美蘭
  const ex=mouth(t,'laugh');
  const o={x:k>=1?430:640,y:612+bounce(t,12),s:.44,expr:ex,L:[60,'open'],R:[60,'open'],tilt:sway(t,2)*5};
  if(k===0){o.L=[150+Math.sin(t*8)*8,'open'];o.R=[150-Math.sin(t*8)*8,'open'];o.tilt=Math.sin(t*10)*4}
  if(k===1){o.L=[25,'fist'];o.R=[120,'open'];o.expr=mouth(t,'laugh');o.tilt=Math.sin(t*10)*5}
  if(k===2){o.L=[150+Math.sin(t*8)*10,'open'];o.R=[150-Math.sin(t*8)*10,'open']}
  if(k===3){o.L=[160,'open'];o.R=[160,'open'];o.tilt=Math.sin(t*3)*6}
  mom(o);
  // 福氣旺：哈哈字
  if(k===0){ring(640,190,t,T[0],4,'#FFE7A8',300,6);
    for(let i=0;i<8;i++){const a=((t-T[0])*.8+i/8)%1,an=i*TAU/8+t*.6;sparkle(640+Math.cos(an)*(150+a*120),215+Math.sin(an)*(110+a*70),16*(1-a)+3,GOLD2,t+i)}
    const a=back((t-T[0])/.5);seal(1010,330,.95*a,.06,t)}
  if(k===1){ring(430,190,t,T[1],4,'#FFE27A',320,8)}
  if(k===2){confetti(t,50,T[2]);}
  // 地上金山（L4）
  if(k===3){const h=ease((t-T[3])/3.2)*95;c.beginPath();c.moveTo(-20,720);for(let x=-20;x<=W+20;x+=20)c.lineTo(x,700-h*(.5+.5*Math.sin(x*.012+1))-Math.sin(x*.05)*6);c.lineTo(W+20,720);c.closePath();fillStroke(GOLD,5);
    for(let i=0;i<10;i++)ingot(80+i*125,704-h*.5,.9,Math.sin(i)*.2)}
};
SC.bridge2=t=>SC.bridge(t,1);
SC.refrain=function(t){
  // 終曲：結合煙火、金幣、五彩紙花
  const T=SECS[10].t;
  if(t<T[4]+.2){SC.bridge(t,1);confetti(t,24,T[0]);
    c.save();const a=ease((t-T[0])/1)*.0;c.restore();
    // 比讚金句
    if(t>T[3]){for(let i=0;i<8;i++){const a=((t-T[3])*.9+i/8)%1;sparkle(640+Math.cos(i*TAU/8)*(180+a*160),240+Math.sin(i*TAU/8)*(120+a*90),18*(1-a)+3,GOLD2,t+i)}}
  }else{ // 間奏：金色黃昏、揮手
    c.fillStyle=grad(0,H,'#FFE2A8','#EE9A7C');c.fillRect(0,0,W,H);rays(W/2,330,t,20,'rgba(255,255,255,.3)',0,1500,.06);hills(600,16,'#9BC96E',1);
    sunFace(1040,230,110,t);for(let i=0;i<10;i++)heart(100+i*120,640-((t*.3+i/10)%1)*400,1,HOT);
    mom({x:640,y:612+bounce(t,10),s:.44,expr:'happy',L:[30,'fist'],R:[120+Math.sin(t*5)*12,'open'],tilt:sway(t,2)*4});confetti(t,24)}
};
SC.v1r=function(t){
  const T=SECS[5].t,L=LN(t,'v1r'),k=L.l;
  c.fillStyle=grad(0,H,'#D4EAEE','#FFF6E2');c.fillRect(0,0,W,H);
  mountain(260,440,560,200,'#A9CDB4');mountain(900,440,700,170,'#B3D6BD');cloud((t*12)%1500-100,130,1.1);
  hills(470,18,'#B4D68E',t*.2);hills(560,14,'#9CC67F',2+t*.2);
  // 花叢
  for(let i=0;i<16;i++){const x=40+i*80,y=640+(i%4)*14,a=ease((t-T[0]-i*.06)/.5);if(a>0)[daisy,sunflower,plum][i%3](x,y+Math.sin(t*3+i)*3,26*a+8*a,'#FFFFFF')}
  // 熟人
  if(k>=1){const a=back((t-T[1])/.4);neighbor(150,470,1.0*a,t,0,1);neighbor(1130,470,1.0*a,t,1,1);
    const bt=Math.floor(t*3)%3;c.save();c.globalAlpha=a;bubble(240,330,150,64,['對啊','真的？','是喔'][bt],1);c.restore();c.save();c.globalAlpha=a;bubble(1040,330,150,64,['好啊','是啊','喔～'][(bt+1)%3],-1);c.restore()}
  const ex=mouth(t,'happy');
  const o={x:640,y:612+bounce(t,10),s:.42,expr:ex,L:[20+sway(t,2)*6,'fist'],R:[20-sway(t,2)*6,'fist'],tilt:sway(t,4)*4};
  if(k===0){const sp=Math.sin((t-T[0])*3);o.sx=1;o.rot=sp*3;o.L=[70+sp*20,'open'];o.R=[70-sp*20,'open']}
  if(k===1){o.L=[100+Math.sin(t*5)*10,'open'];o.R=[30,'fist'];o.tilt=Math.sin(t*3)*6}
  if(k===2){o.L=[35,'fist'];o.R=[35,'fist'];o.expr=mouth(t,'happy')}
  if(k===3){o.expr=mouth(t,'wow');o.L=[55,'open'];o.R=[55,'open'];o.rot=Math.sin(t*22)*1.4}
  mom(o);
  if(k===0){for(let i=0;i<14;i++){const a=((t-T[0])*.9+i/14)%1;const an=i*TAU/14+t;daisy(640+Math.cos(an)*(100+a*300),420+Math.sin(an)*(90+a*220),14+10*(1-a),['#FFFFFF','#FFB3C7','#FFE27A'][i%3],GOLD,t*3)}}
  if(k===2){const s=1+pulse(t)*.25+Math.sin((t-T[2])*2)*.05;heart(640,345,2.2*s,HOT,0,5);for(let i=0;i<6;i++){const a=((t-T[2])*.7+i/6)%1;heart(640+Math.sin(i*2.7)*200,360-a*280,.8,'#FF8FA8')}}
  if(k===3){ring(640,190,t,T[3],4,'#FFFFFF',360,8);for(let i=0;i<4;i++){const a=((t-T[3])*.9+i*.25)%1;bird(240+i*270+a*(i%2?-1:1)*240,260-a*180,.9,t)}}
};
SC.v2r=function(t){SC.v2(t,true)};

SC.outro=function(t){
  const T=SECS[11].t,L=LN(t,'outro');
  const dark=ease((t-T[0]+1)/3);
  const ox=lerp(640,330,ease((t-T[3]-.2)/1.4));
  c.fillStyle=grad(0,H,mix('#FFF3D6','#5A3F6E',dark*.85),mix('#FBD9C4','#E58C8A',dark*.7));c.fillRect(0,0,W,H);
  for(let i=0;i<40;i++){c.globalAlpha=dark*(.4+.6*Math.abs(Math.sin(t*2+i)));sparkle(hash(i)*W,hash(i+5)*360,3+hash(i+2)*7);c.globalAlpha=1}
  c.globalAlpha=dark;moonFace(150,130,62);c.globalAlpha=1;
  hills(600,14,mix('#B4D68E','#3C5A52',dark),t*.2);
  // 蘭花與梅花環繞
  const orb=(i,n)=>{const a=i*TAU/n+t*.25;return[ox+Math.cos(a)*(250+i%2*40),330+Math.sin(a)*(200+i%2*20)]};
  for(let i=0;i<10;i++){const[x,y]=orb(i,10);const a=ease((t-T[0]-i*.25)/.8);if(a>0)(i%2?plum:orchid)(x,y,40*a,t*.5+i,i%2)}
  petalsFall(t,20,['#FFFFFF','#F7A0B8','#F6E3FF'],40,1);
  const fin=ease((t-T[3]-.2)/1.2);
  const ex=mouth(t,'happy');
  mom({x:ox,y:612+bounce(t,t>T[4]?3:8),s:.42,expr:t>T[4]?'happy':ex,L:[10,'fist'],R:[t>T[4]?125+Math.sin(t*4)*12:100+Math.sin(t*4)*10,'open'],tilt:sway(t,2)*4});
  // 愛心
  for(let i=0;i<6;i++){const a=((t*.35+i/6)%1);heart(300+i*140,650-a*480,.9+.3*hash(i),HOT)}
  // 結語
  if(t>T[3]-.2){const a=ease((t-T[3])/.8);c.save();c.globalAlpha=a;titleText('美蘭，我愛你',925,250,66,['#FFFFFF','#FFE3EA'],6,'#5A2A44','#8E3F5A',.09);c.restore()}
  if(t>T[4]+.5){const a=ease((t-T[4]-.5)/1.2);c.save();c.globalAlpha=a;ornament(925,320,380,'#FFE3EA');txt('獻給最愛的媽媽',925,372,32,'#FFF4D6',{ls:10,stroke:'#5A2A44',sw:6});c.restore()}
};

/* ---------- 字幕 ---------- */
function subtitle(t){
  const a=activeLyric(t); let sec=-1,l=-1,line='',u=0;
  if(a){sec=a.i;l=a.l;line=a.text;u=clamp((t-a.a)/(a.b-a.a-.1))}
  else{
    for(let i=SECS.length-1;i>=0&&sec<0;i--)for(let j=3;j>=0;j--){const e=SECS[i].t[j+1]-0.25;if(t>=e&&t<e+.9){sec=i;l=j;line=SECS[i].L[j];u=1;break}}
    if(sec<0)return;
  }
  const alpha=a?clamp((t-a.a+.1)/.2):1-clamp((t-(SECS[sec].t[l+1]-.25)-.4)/.5);
  const rise=a?(1-easeOut((t-a.a+.1)/.3))*10:0;
  const fs=line.length>10?44:50;
  c.save();c.globalAlpha=alpha;c.translate(0,rise);c.font=`${fs}px ${FONT}`;c.letterSpacing='4px';c.textAlign='left';c.textBaseline='middle';
  const w=c.measureText(line).width-4,x0=W/2-w/2,y=H-50,ph=80,px=46;
  c.save();c.shadowColor='rgba(59,42,36,.28)';c.shadowBlur=22;c.shadowOffsetY=8;
  c.beginPath();c.roundRect(x0-px,y-ph/2,w+px*2,ph,ph/2);c.fillStyle='rgba(255,247,232,.96)';c.fill();c.restore();
  c.lineWidth=4;c.strokeStyle=INK;c.stroke();
  // 內描邊細線 + 兩端小花
  c.save();c.beginPath();c.roundRect(x0-px+8,y-ph/2+8,w+px*2-16,ph-16,(ph-16)/2);c.lineWidth=1.5;c.strokeStyle='rgba(155,107,181,.55)';c.stroke();c.restore();
  plum(x0-px+4,y,19,.3);plum(x0+w+px-4,y,19,-.3);
  c.fillStyle=INK;c.fillText(line,x0,y);
  c.save();c.beginPath();c.rect(x0-6,y-60,(w+12)*u,120);c.clip();c.fillStyle='#D9507A';c.fillText(line,x0,y);c.restore();
  c.restore();
}

/* ---------- 主繪製：換場 + 鏡頭 ---------- */
const OUTFIT_BY={intro:'daily',v1:'hakka',v2:'apron',chorus:'stripe',bridge:'redtang',v1r:'dress',v2r:'apron',chorus2:'mint',bridge2:'redtang',final:'dress',refrain:'redtang',outro:'daily'};
function drawScene(i,t){
  CUR_OUTFIT=OUTFIT_BY[SECS[i].k]||'daily';
  c.save();
  const key=SECS[i].k,T=SECS[i].t;
  // 輕微推鏡
  const z=1+ease((t-SCENE_START[i])/Math.max(4,(T[4]-T[0])))*.03;
  c.translate(W/2,H/2);c.scale(z,z);c.translate(-W/2,-H/2);
  SC[key](t);c.restore();
}
function renderFrame(t){
  const i=secAt(t);
  c.clearRect(0,0,W,H);
  drawScene(i,t);
  // 換場：淡入（前一場景仍繼續動）
  const dt=t-SCENE_START[i];
  if(i>0&&dt<.45){ /* 以奶油色花瓣擦拭：先畫前一幕再用圓形遮罩顯示新幕 */
    const p=ease(dt/.45);
    const tmp=renderFrame._tmp||(renderFrame._tmp=document.createElement('canvas'));tmp.width=W;tmp.height=H;
    const keep=c;// 重畫：先清，畫舊場景，再用圓形裁切畫新場景
    c.clearRect(0,0,W,H);drawScene(i-1,t);
    c.save();c.beginPath();c.arc(W/2,H/2,p*Math.hypot(W,H)/2+1,0,TAU);c.clip();drawScene(i,t);c.restore();
    c.save();c.lineWidth=10;c.strokeStyle='rgba(255,255,255,.9)';c.beginPath();c.arc(W/2,H/2,p*Math.hypot(W,H)/2,0,TAU);c.stroke();c.restore();
  }
  // 開場淡入 / 結尾淡出
  if(t<1){c.fillStyle=`rgba(251,245,230,${1-t})`;c.fillRect(0,0,W,H)}
  if(t>DURATION-2){c.fillStyle=`rgba(40,25,35,${clamp((t-(DURATION-2))/2)})`;c.fillRect(0,0,W,H)}
  // 暈角
  const g=c.createRadialGradient(W/2,H/2,H*.55,W/2,H/2,H*1.05);g.addColorStop(0,'rgba(60,30,20,0)');g.addColorStop(1,'rgba(59,42,36,.16)');c.fillStyle=g;c.fillRect(0,0,W,H);
  subtitle(t);
}
