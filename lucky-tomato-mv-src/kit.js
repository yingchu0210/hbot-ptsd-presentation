// ===== MV kit: sprites + drawing helpers =====
const W=1920,H=1080;
const cv=document.getElementById('cv'),ctx=cv.getContext('2d');
const FONT='"WenQuanYi Zen Hei","Noto Sans CJK TC",sans-serif';
const cl=(x,a=0,b=1)=>Math.max(a,Math.min(b,x)),lerp=(a,b,t)=>a+(b-a)*t,prog=(t,a,b)=>cl((t-a)/(b-a));
const ease=x=>{x=cl(x);return x*x*(3-2*x)},easeOut=x=>{x=cl(x);return 1-Math.pow(1-x,3)},back=x=>{x=cl(x);const c1=1.70158,c3=c1+1;return 1+c3*Math.pow(x-1,3)+c1*Math.pow(x-1,2)};
const hash=n=>{const x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x)};
const TAU=Math.PI*2;
const INKC='#4a3226';

/* ---------- beat sync ---------- */
let BEATS=[];
function beatInfo(t){let lo=0,hi=BEATS.length-1;if(t<BEATS[0])return{ph:1,idx:-1};while(lo<hi){const m=(lo+hi+1)>>1;if(BEATS[m]<=t)lo=m;else hi=m-1}
 const b0=BEATS[lo],b1=BEATS[lo+1]||b0+.557;return{ph:(t-b0)/(b1-b0),idx:lo,dt:t-b0}}
const pulse=(t,k=7)=>{const b=beatInfo(t);return Math.exp(-k*Math.max(0,b.ph))};   // 1 on beat → 0
const sway=(t,sp=1)=>{const b=beatInfo(t);return Math.sin((b.idx+b.ph)*Math.PI*sp)};     // left-right per 2 beats

/* ---------- sprite loading ---------- */
function svgImg(inner,vx,vy,vw,vh){const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${vw}" height="${vh}" viewBox="${vx} ${vy} ${vw} ${vh}">${inner}</svg>`;
 return new Promise(r=>{const im=new Image();im.onload=()=>r({img:im,ox:-vx,oy:-vy,w:vw,h:vh});im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg)})}
const SPR={};
function armSVG(kind,type){const skin=SKIN[kind],glove=kind==='mom'?'#8d86a2':null;let items=[],wrist;
 if(kind==='dad'){items=[cap(0,-4,0,150,40,skin)];wrist=150}
 else if(kind==='mom'){items=[cap(0,95,0,215,42,'#2f66b4'),cap(0,0,0,108,48,'#37b4a2')];wrist=214}
 else{items=[cap(0,216,0,240,46,'#c8ccd6'),cap(0,0,0,222,50,'#e58aa0')];wrist=238}
 const hd=type==='relaxed'?`<g transform="translate(0,${wrist-6})">${hand('relaxed',skin,glove)}</g>`:`<g transform="translate(0,${wrist+34}) rotate(180)">${hand(type==='wave'?'wave':type,skin,glove)}</g>`;
 return hd+stack(items)}
function mascotSVG(kind,expr){const red=kind==='red',body=red?'#e8513d':'#f6a43a',dk=red?'#a62d22':'#c76a14',lt=red?'#ff8a74':'#ffd07a';
 const rx=red?62:70,ry=red?98:86,cy=176,cx=110;
 const d=`M ${cx},${cy-ry} C ${cx+rx*1.32},${cy-ry} ${cx+rx*1.32},${cy+ry} ${cx},${cy+ry} C ${cx-rx*1.32},${cy+ry} ${cx-rx*1.32},${cy-ry} ${cx},${cy-ry} Z`;
 let leaves='';for(const [a,l] of [[-1.15,40],[-.6,48],[0,54],[.6,48],[1.15,40]]){const x=cx+Math.sin(a)*8,y=cy-ry+8;leaves+=blob(`M ${x},${y} C ${x+Math.sin(a)*l*.9+10},${y-l*.3} ${x+Math.sin(a)*l+4},${y-l*.8} ${x+Math.sin(a)*l*.9},${y-l*.62} C ${x+Math.sin(a)*l*.6-10},${y-l*.2} ${x},${y} ${x},${y} Z`,'#5aab55',{ow:7}).fill.length?'':''}
 const leafItems=[[-1.2,44],[-.62,52],[0,58],[.62,52],[1.2,44]].map(([a,l])=>{const x=cx,y=cy-ry+10;const tx=x+Math.sin(a)*l*1.1,ty=y-Math.cos(a)*l*.55-6;return blob(`M ${x},${y} Q ${(x+tx)/2-8},${(y+ty)/2-14} ${tx},${ty} Q ${(x+tx)/2+10},${(y+ty)/2+4} ${x},${y} Z`,'#5aab55',{ow:8,sh:[],hl:[]})});
 let face='';const ey=cy-8;
 const eye=(x,open=true,wink=false)=>wink?ln(`M ${x-12},${ey+2} Q ${x},${ey-12} ${x+12},${ey+2}`,4.5):(open?`<ellipse cx="${x}" cy="${ey}" rx="11" ry="14" fill="#2b1d17"/><circle cx="${x+4}" cy="${ey-5}" r="4.4" fill="#fff"/><circle cx="${x-4}" cy="${ey+6}" r="2" fill="#fff" opacity=".8"/>`:ln(`M ${x-12},${ey} Q ${x},${ey+12} ${x+12},${ey}`,4.5));
 if(expr==='happy'){face+=eye(-28+cx,false,true).replace(/M [^"]+/,m=>m)}
 const hap=expr==='happy';
 face+=hap?ln(`M ${cx-40},${ey+4} Q ${cx-26},${ey-14} ${cx-12},${ey+4}`,5)+ln(`M ${cx+12},${ey+4} Q ${cx+26},${ey-14} ${cx+40},${ey+4}`,5):expr==='wink'?eye(cx-27)+eye(cx+27,true,true):eye(cx-27)+eye(cx+27);
 face+=`<ellipse cx="${cx-48}" cy="${ey+26}" rx="13" ry="8" fill="#ff7b86" opacity=".7"/><ellipse cx="${cx+48}" cy="${ey+26}" rx="13" ry="8" fill="#ff7b86" opacity=".7"/>`;
 const my=ey+28;
 if(expr==='sing'||expr==='wow')face+=`<ellipse cx="${cx}" cy="${my+8}" rx="${expr==='wow'?10:14}" ry="${expr==='wow'?14:17}" fill="#74292b" stroke="${INKC}" stroke-width="3.4"/><ellipse cx="${cx}" cy="${my+16}" rx="8" ry="6" fill="#ee8a94"/>`;
 else if(hap)face+=`<path d="M ${cx-20},${my-2} Q ${cx},${my+4} ${cx+20},${my-2} Q ${cx+16},${my+26} ${cx},${my+26} Q ${cx-16},${my+26} ${cx-20},${my-2} Z" fill="#74292b" stroke="${INKC}" stroke-width="3.4" stroke-linejoin="round"/><ellipse cx="${cx}" cy="${my+18}" rx="9" ry="5" fill="#ee8a94"/>`;
 else face+=ln(`M ${cx-14},${my} Q ${cx},${my+14} ${cx+14},${my}`,4.4);
 const main=blob(d,body,{ow:10,sh:[{d:`M ${cx+rx*.3},${cy-ry} C ${cx+rx*1.5},${cy-ry} ${cx+rx*1.5},${cy+ry} ${cx},${cy+ry} Z`,c:dk,o:.28},{d:`M ${cx-rx*1.3},${cy+ry*.55} C ${cx-rx*.6},${cy+ry*1.1} ${cx+rx*.6},${cy+ry*1.1} ${cx+rx*1.3},${cy+ry*.55} L ${cx+rx*1.3},${cy+ry*1.2} L ${cx-rx*1.3},${cy+ry*1.2} Z`,c:dk,o:.2}],hl:[{d:`M ${cx-rx*.75},${cy-ry*.55} C ${cx-rx*.75},${cy-ry*.85} ${cx-rx*.35},${cy-ry*.95} ${cx-rx*.1},${cy-ry*.88} C ${cx-rx*.4},${cy-ry*.78} ${cx-rx*.62},${cy-ry*.45} ${cx-rx*.75},${cy-ry*.55} Z`,c:'#fff',o:.65}]});
 return stack([main,...leafItems])+`<path d="M ${cx},${cy-ry+4} q 4,-18 10,-24" stroke="#3f8a4a" stroke-width="7" fill="none" stroke-linecap="round"/>`+face}
async function loadSprites(){
 const jobs=[];
 for(const k of ['dad','mom','girl']){
  jobs.push(svgImg(BODIES[k]({noArms:true,noHead:true}),0,300,500,580).then(s=>SPR[k+'_body']=s));
  for(const e of ['smile','laugh','shy','happy','sad','wow'])jobs.push(svgImg(HEADS[k](e),-190,-215,380,400).then(s=>SPR[k+'_'+e]=s));
  for(const h of ['relaxed','wave','thumbsup','hold'])jobs.push(svgImg(armSVG(k,h),-80,-40,160,380).then(s=>SPR[k+'_arm_'+h]=s));
 }
 for(const m of ['red','orange'])for(const e of ['smile','happy','wow','wink','sing'])jobs.push(svgImg(mascotSVG(m,e),0,0,220,300).then(s=>SPR['m_'+m+'_'+e]=s));
 await Promise.all(jobs)}
function spr(name,x,y,sc=1,rot=0,flip=1,alpha=1,anchor){const s=SPR[name];if(!s){return}ctx.save();ctx.translate(x,y);if(rot)ctx.rotate(rot);ctx.scale(sc*flip,sc);ctx.globalAlpha*=alpha;ctx.drawImage(s.img,-s.ox,-s.oy,s.w,s.h);ctx.restore()}

/* ---------- Q-version person rig ---------- */
const SHO={dad:[[130,466],[370,466]],mom:[[182,394],[318,394]],girl:[[180,394],[320,394]]};
function person(k,o){const {x,y,s=1,expr='smile',aL=[0,'relaxed'],aR=[0,'relaxed'],tilt=0,flip=1,bob=0,squash=0,hs=1.12}=o;
 ctx.save();ctx.translate(x,y);ctx.scale(s*flip,s);ctx.translate(0,bob);ctx.translate(-250,-866);
 ctx.save();ctx.translate(250,866);ctx.scale(1-squash*.5,1+squash);ctx.translate(-250,-866);
 spr(k+'_body',0,0);
 const [pl,pr]=SHO[k];
 ctx.save();ctx.translate(pl[0],pl[1]);ctx.rotate(aL[0]*Math.PI/180);spr(`${k}_arm_${aL[1]}`,0,0);ctx.restore();
 ctx.save();ctx.translate(pr[0],pr[1]);ctx.rotate(-aR[0]*Math.PI/180);ctx.scale(-1,1);spr(`${k}_arm_${aR[1]}`,0,0);ctx.restore();
 ctx.restore();
 ctx.save();ctx.translate(250,330+bob*.3);ctx.rotate(tilt);ctx.scale(hs,hs);ctx.translate(0,-116);spr(`${k}_${expr}`,0,0);ctx.restore();
 ctx.restore()}
// mascot with procedural arms/legs
function mascot(kind,o){const {x,y,s=1,expr='smile',rot=0,squash=0,armA=0,legA=0,flip=1}=o;
 ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.scale(s*flip,s);
 const body=kind==='red'?'#e8513d':'#f6a43a';const lw=14;
 const limb=(x1,y1,x2,y2,w)=>{ctx.lineCap='round';ctx.strokeStyle=INKC;ctx.lineWidth=w+7;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();ctx.strokeStyle=body;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke()};
 // legs (feet at origin bottom)
 limb(-24,-24,-30+Math.sin(legA)*16,10,12);limb(24,-24,30-Math.sin(legA)*16,10,12);
 ctx.fillStyle='#fff';ctx.strokeStyle=INKC;ctx.lineWidth=4;for(const dx of[-1,1]){ctx.beginPath();ctx.ellipse(dx*(30-dx*Math.sin(legA)*16)*1,14,16,9,0,0,TAU);ctx.fill();ctx.stroke()}
 ctx.save();ctx.translate(0,-18);ctx.scale(1-squash*.5,1+squash);
 // arms
 limb(-56,-100,-86-Math.sin(armA)*8,-100+Math.cos(armA)*40-20,11);limb(56,-100,86+Math.sin(armA)*8,-100+Math.cos(armA+1.2)*40-20,11);
 spr('m_'+kind+'_'+expr,0,0,1,0,1,1);
 ctx.restore();ctx.restore()}
// since mascot sprite origin: place so that feet are at (x,y): sprite height 300, bottom body at ~270
function mascotAt(kind,o){const oo=Object.assign({},o);ctx.save();ctx.translate(oo.x,oo.y);ctx.scale(oo.s||1,oo.s||1);ctx.rotate(oo.rot||0);
 const s=SPR['m_'+kind+'_'+(oo.expr||'smile')];const body=kind==='red'?'#e8513d':'#f6a43a';
 const limb=(x1,y1,x2,y2,w)=>{ctx.lineCap='round';ctx.strokeStyle=INKC;ctx.lineWidth=w+7;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();ctx.strokeStyle=body;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke()};
 const la=oo.legA||0,aa=oo.armA||0,sq=oo.squash||0,fl=oo.flip||1;ctx.scale(fl,1);
 // legs
 limb(-26,-30,-30+Math.sin(la)*18,6,12);limb(26,-30,30-Math.sin(la)*18,6,12);
 ctx.fillStyle='#fff';ctx.strokeStyle=INKC;ctx.lineWidth=4;
 for(const dx of[-1,1]){ctx.beginPath();ctx.ellipse(dx*30-dx*Math.sin(la)*18,10,17,9,0,0,TAU);ctx.fill();ctx.stroke()}
 ctx.save();ctx.translate(0,0);ctx.scale(1-sq*.5,1+sq);ctx.translate(0,-270+4);
 limb(-58,172,-96-Math.sin(aa)*6,172+46*Math.cos(aa)-8,11);limb(58,172,96+Math.sin(aa)*6,172+46*Math.cos(aa+1.4)-8,11);
 ctx.drawImage(s.img,-110,0,s.w,s.h);ctx.restore();ctx.restore()}

/* ---------- misc draw helpers ---------- */
function rr(x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()}
function outl(fill,lw=6,stroke=INKC){ctx.fillStyle=fill;ctx.fill();ctx.lineWidth=lw;ctx.strokeStyle=stroke;ctx.lineJoin='round';ctx.stroke()}
function text(s,x,y,o={}){const sz=o.size||60;ctx.save();ctx.translate(x,y);if(o.rot)ctx.rotate(o.rot);if(o.sc)ctx.scale(o.sc,o.sc);ctx.font=`bold ${sz}px ${FONT}`;ctx.textAlign=o.align||'center';ctx.textBaseline='middle';ctx.lineJoin='round';ctx.globalAlpha*=o.alpha??1;
 if(o.stroke!==false){ctx.strokeStyle=o.stroke||'#fff';ctx.lineWidth=o.sw||sz*.2;ctx.strokeText(s,0,0)}
 ctx.fillStyle=o.col||INKC;ctx.fillText(s,0,0);ctx.restore()}
function sparkle(x,y,r,col='#ffd84a',rot=0){ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.beginPath();for(let i=0;i<8;i++){const a=i*Math.PI/4,rad=i%2?r*.28:r;ctx.lineTo(Math.cos(a)*rad,Math.sin(a)*rad)}ctx.closePath();outl(col,3);ctx.restore()}
function heart(x,y,r,col='#ff6f86'){ctx.save();ctx.translate(x,y);ctx.beginPath();ctx.moveTo(0,r*.9);ctx.bezierCurveTo(-r*1.5,-r*.1,-r*.7,-r*1.2,0,-r*.4);ctx.bezierCurveTo(r*.7,-r*1.2,r*1.5,-r*.1,0,r*.9);ctx.closePath();outl(col,4);ctx.restore()}
function cloud(x,y,s,col='#fff',a=1){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.globalAlpha=a;ctx.fillStyle=col;ctx.beginPath();for(const[dx,dy,r]of[[-60,10,40],[-15,-14,52],[35,-6,46],[75,12,34],[10,16,50]]){ctx.moveTo(dx+r,dy);ctx.arc(dx,dy,r,0,TAU)}ctx.fill();ctx.restore()}
function sunDraw(x,y,r,t,face=true){ctx.save();ctx.translate(x,y);
 for(let i=0;i<14;i++){const a=i/14*TAU+t*.3,l=i%2?r*.45:r*.7;ctx.beginPath();ctx.moveTo(Math.cos(a)*(r+14),Math.sin(a)*(r+14));ctx.lineTo(Math.cos(a)*(r+14+l),Math.sin(a)*(r+14+l));ctx.lineWidth=12;ctx.lineCap='round';ctx.strokeStyle='#ffc93c';ctx.stroke()}
 ctx.beginPath();ctx.arc(0,0,r,0,TAU);outl('#ffd95a',6);
 if(face){ctx.fillStyle=INKC;ctx.beginPath();ctx.arc(-r*.3,-r*.08,r*.07,0,TAU);ctx.arc(r*.3,-r*.08,r*.07,0,TAU);ctx.fill();ctx.strokeStyle=INKC;ctx.lineWidth=5;ctx.lineCap='round';ctx.beginPath();ctx.arc(0,r*.12,r*.3,.2,Math.PI-.2);ctx.stroke();ctx.fillStyle='#ff9a8a';ctx.globalAlpha=.6;ctx.beginPath();ctx.ellipse(-r*.5,r*.2,r*.14,r*.09,0,0,TAU);ctx.ellipse(r*.5,r*.2,r*.14,r*.09,0,0,TAU);ctx.fill();ctx.globalAlpha=1}
 ctx.restore()}
function mountains(y,layers,t,cols){for(let L=0;L<layers;L++){ctx.beginPath();ctx.moveTo(0,H);const amp=140-L*30,base=y+L*70;for(let x=0;x<=W;x+=20){const yy=base-amp*(.5+.5*Math.sin(x*.0035+L*2.1+t*0.0))-amp*.3*Math.sin(x*.009+L*5.2);ctx.lineTo(x,yy)}ctx.lineTo(W,H);ctx.closePath();ctx.fillStyle=cols[L];ctx.fill()}}
function tomatoDraw(x,y,r,col,o={}){const long=o.long!==false,rot=o.rot||0;ctx.save();ctx.translate(x,y);ctx.rotate(rot);const rx=long?r*.72:r,ry=long?r*1.15:r;ctx.beginPath();ctx.ellipse(0,0,rx,ry,0,0,TAU);outl(col,Math.max(3,r*.14));
 ctx.fillStyle='rgba(255,255,255,.6)';ctx.beginPath();ctx.ellipse(-rx*.42,-ry*.35,rx*.16,ry*.28,.3,0,TAU);ctx.fill();
 ctx.fillStyle='#4f9e4a';ctx.strokeStyle=INKC;ctx.lineWidth=Math.max(2,r*.08);for(let k=-2;k<=2;k++){ctx.save();ctx.translate(0,-ry+r*.12);ctx.rotate(k*.55);ctx.beginPath();ctx.ellipse(0,-r*.2,r*.13,r*.3,0,0,TAU);ctx.fill();ctx.stroke();ctx.restore()}ctx.restore()}
function vine(x,y,h,t,o={}){const n=o.n||5,col=o.col||'#e8513d';ctx.save();ctx.translate(x,y);ctx.lineCap='round';
 ctx.strokeStyle='#3f8a4a';ctx.lineWidth=10;ctx.beginPath();ctx.moveTo(0,0);for(let i=1;i<=10;i++)ctx.lineTo(Math.sin(i*.9+x*.01+t*.8)*10*(i/10),-h*i/10);ctx.stroke();
 for(let i=1;i<10;i+=2){const yy=-h*i/10,xx=Math.sin(i*.9+x*.01+t*.8)*10*(i/10);ctx.save();ctx.translate(xx,yy);ctx.rotate((i%4?1:-1)*(.5+.1*Math.sin(t*1.5+i)));ctx.beginPath();ctx.ellipse(i%4?26:-26,0,28,12,0,0,TAU);outl('#6dbb62',4);ctx.restore()}
 for(let i=0;i<n;i++){const yy=-h*(.25+.65*hash(i+x))+ (o.drop||0),xx=(i%2?1:-1)*(12+10*hash(i*3+x));const rr=o.r||15;tomatoDraw(xx,yy+14,rr,Array.isArray(col)?col[i%col.length]:col,{rot:(i%2?.15:-.15)})}
 ctx.restore()}
function carton(x,y,s,o={}){ctx.save();ctx.translate(x,y);ctx.scale(s,s);if(o.rot)ctx.rotate(o.rot);
 ctx.beginPath();rr(-150,-80,300,150,12);outl('#f7b39a',6);
 ctx.beginPath();ctx.moveTo(-150,-80);ctx.lineTo(-110,-130);ctx.lineTo(110,-130);ctx.lineTo(150,-80);ctx.closePath();outl('#f48f78',6);
 ctx.beginPath();rr(-110,-150,220,30,12);ctx.fillStyle='#ff9d85';ctx.fill();ctx.strokeStyle=INKC;ctx.lineWidth=6;ctx.stroke();
 text('美濃',-60,-30,{size:54,col:'#2e9e5b',stroke:'#fffbe9'});text('小番茄',50,-30,{size:46,col:'#f5a623',stroke:'#fffbe9'});text('LUSCIOUS TOMATO',0,28,{size:22,col:'#8a3d22',stroke:false});
 for(let i=0;i<6;i++){tomatoDraw(-110+i*44,-104+(i%2)*6,18,i%2?'#e8513d':'#f6a43a',{rot:(i%2?.2:-.2)})}
 ctx.restore()}
function phoneDraw(x,y,s,rot=0){ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.scale(s,s);ctx.beginPath();rr(-48,-84,96,168,16);outl('#2b2b30',6);ctx.beginPath();rr(-38,-68,76,132,8);ctx.fillStyle='#06c755';ctx.fill();text('LINE',0,-12,{size:28,col:'#fff',stroke:false});heart(0,22,14,'#fff');ctx.restore()}
function infoCard(x,y,w,h,title,lines,p,o={}){if(p<=0)return;ctx.save();ctx.translate(x,y);const sc=back(p);ctx.scale(sc,sc);ctx.rotate(o.rot||0);
 ctx.shadowColor='rgba(74,50,38,.25)';ctx.shadowBlur=18;ctx.shadowOffsetY=8;ctx.beginPath();rr(-w/2,-h/2,w,h,26);outl('#fffaf0',5);ctx.shadowColor='transparent';
 ctx.beginPath();rr(-w/2,-h/2,w,64,26);ctx.fillStyle=o.col||'#f4a23a';ctx.fill();ctx.beginPath();ctx.rect(-w/2,-h/2+30,w,34);ctx.fill();ctx.strokeStyle=INKC;ctx.lineWidth=5;ctx.beginPath();rr(-w/2,-h/2,w,h,26);ctx.stroke();
 text(title,0,-h/2+34,{size:o.ts||38,col:'#fff',stroke:INKC,sw:9});
 lines.forEach((l,i)=>text(l,0,-h/2+(o.top||104)+i*(o.lh||46),{size:o.ls||32,stroke:false,col:INKC}));ctx.restore()}
function confetti(t,n,seed=0,cols=['#ff6f86','#ffd84a','#6dd3a0','#7bb6ff','#ff9a3c']){for(let i=0;i<n;i++){const x=hash(i+seed)*W,sp=80+hash(i*3+seed)*160,y=((hash(i*7+seed)*H+t*sp)%(H+60))-30;ctx.save();ctx.translate(x+Math.sin(t*2+i)*30,y);ctx.rotate(t*3+i);ctx.fillStyle=cols[i%cols.length];ctx.fillRect(-7,-4,14,8);ctx.restore()}}
function bokeh(t,n=18,seed=3,alpha=.3){for(let i=0;i<n;i++){const x=hash(i+seed)*W,y=hash(i*5+seed)*H,r=30+hash(i*9)*70;ctx.globalAlpha=alpha*(.5+.5*Math.sin(t*.8+i));ctx.fillStyle=['#fff6c9','#ffd6e0','#d6f3ff','#e3ffd6'][i%4];ctx.beginPath();ctx.arc(x,y+Math.sin(t*.4+i)*12,r,0,TAU);ctx.fill()}ctx.globalAlpha=1}
function stamp(x,y,r,p,col='#d8432f'){if(p<=0)return;ctx.save();ctx.translate(x,y);ctx.rotate(-.18);const sc=back(p);ctx.scale(sc,sc);ctx.globalAlpha=.95;ctx.beginPath();ctx.arc(0,0,r,0,TAU);ctx.fillStyle='#fff1c9';ctx.fill();ctx.strokeStyle=col;ctx.lineWidth=9;ctx.stroke();ctx.lineWidth=3.5;ctx.beginPath();ctx.arc(0,0,r*.84,0,TAU);ctx.stroke();text('好運來',0,-r*.06,{size:r*.62,col,stroke:false});text('LUCKY TOMATO',0,r*.56,{size:r*.17,col,stroke:false});ctx.restore()}
function clover(x,y,r,rot=0){ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.strokeStyle='#3f8a4a';ctx.lineWidth=7;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(0,r*.6);ctx.quadraticCurveTo(r*.2,r*1.4,-r*.1,r*2.1);ctx.stroke();
 for(let k=0;k<4;k++){const a=k*Math.PI/2+Math.PI/4;ctx.save();ctx.translate(Math.cos(a)*r*.55,Math.sin(a)*r*.55);ctx.rotate(a);ctx.beginPath();ctx.ellipse(0,0,r*.55,r*.42,0,0,TAU);outl('#7cc46a',4);ctx.restore()}ctx.restore()}
