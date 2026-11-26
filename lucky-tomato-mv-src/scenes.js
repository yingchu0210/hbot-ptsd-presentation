// ===== MV scenes (timed to the song) =====
const IMG={};const GY=800; // ground line for characters
const mixc=(a,b,t)=>{const pa=[1,3,5].map(i=>parseInt(a.substr(i,2),16)),pb=[1,3,5].map(i=>parseInt(b.substr(i,2),16));return '#'+pa.map((v,i)=>Math.round(v+(pb[i]-v)*t).toString(16).padStart(2,'0')).join('')};
function skyGrad(c1,c2){const g=ctx.createLinearGradient(0,0,0,H*.75);g.addColorStop(0,c1);g.addColorStop(1,c2);ctx.fillStyle=g;ctx.fillRect(0,0,W,H)}
function ground(col1='#bfe6a0',col2='#8fcf7a',y=790){const g=ctx.createLinearGradient(0,y,0,H);g.addColorStop(0,col1);g.addColorStop(1,col2);ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(0,y+8);for(let x=0;x<=W;x+=40)ctx.lineTo(x,y+Math.sin(x*.01)*8);ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.closePath();ctx.fill()}
function farm(t,o={}){skyGrad(o.sky1||'#A9DDFF',o.sky2||'#F4F8DD');
 if(o.sun!==false)sunDraw(o.sx||1500,o.sy||300,o.sr||80,t,true);
 cloud(300+((t*12)%2400)-300,170,1.2,'#fff',.9);cloud(1100+((t*8)%2400)-800,120,.9,'#fff',.85);
 mountains(510,3,t,o.mtn||['#9fc9d8','#86bfa6','#6fb38f']);ground(o.g1,o.g2,790);
 if(o.rows!==false){for(let r=0;r<2;r++){const y=806+r*74,sc=.55+r*.3;for(let x=-40+((r*90)%200);x<W+80;x+=200-r*30)vine(x,y+60,230*sc,t+r,{n:4,r:14*sc+3,col:o.vcol||[C.tomato,C.orange]})}}}
function dancer(k,x,y,s,t,o={}){const pl=pulse(t),sw=sway(t,1),ph=o.ph||0;
 person(k,{x,y,s,expr:o.expr||'laugh',aL:[o.aL??(65+28*Math.sin(t*5.2+ph)),o.handL||o.hand||'wave'],aR:[o.aR??(65+28*Math.cos(t*5.2+ph)),o.handR||o.hand||'wave'],tilt:sw*.08,bob:-pl*16,squash:pl*.04,flip:o.flip||1})}
function mdance(kind,x,y,s,t,o={}){const pl=pulse(t),sw=sway(t,1),ph=o.ph||0;ctx.save();ctx.translate(x,y);ctx.fillStyle='rgba(74,50,38,.17)';ctx.beginPath();ctx.ellipse(0,6*s,(72-pl*10)*s,13*s,0,0,TAU);ctx.fill();ctx.restore();mascotAt(kind,{x,y:y-pl*18*s,s,expr:o.expr||'happy',rot:sw*.14+(o.rot||0),squash:pl*.07,armA:Math.sin(t*6+ph)*1.2+1,legA:Math.sin(t*10+ph),flip:o.flip||1})}
function friend(x,y,s,o={}){const {skin='#f5cfae',hair='#3b2b24',shirt='#7bb6ff',kind=0,mouth='smile',bob=0,armA=0}=o;ctx.save();ctx.translate(x,y+bob);ctx.scale(s,s);
 ctx.strokeStyle=INKC;ctx.lineCap='round';ctx.lineWidth=15;ctx.beginPath();ctx.moveTo(-22,-30);ctx.lineTo(-22,0);ctx.moveTo(22,-30);ctx.lineTo(22,0);ctx.stroke();ctx.strokeStyle='#5c6b8c';ctx.lineWidth=9;ctx.beginPath();ctx.moveTo(-22,-30);ctx.lineTo(-22,-2);ctx.moveTo(22,-30);ctx.lineTo(22,-2);ctx.stroke();
 for(const dx of[-1,1]){ctx.beginPath();ctx.ellipse(dx*24,2,17,9,0,0,TAU);outl('#fff',4)}
 ctx.lineWidth=17;ctx.strokeStyle=INKC;for(const dx of[-1,1]){ctx.beginPath();ctx.moveTo(dx*44,-112);ctx.lineTo(dx*(70+Math.sin(armA)*10),-112+(dx>0?50-Math.cos(armA)*40:56));ctx.stroke()}
 ctx.lineWidth=10;ctx.strokeStyle=shirt;for(const dx of[-1,1]){ctx.beginPath();ctx.moveTo(dx*44,-112);ctx.lineTo(dx*(70+Math.sin(armA)*10),-112+(dx>0?50-Math.cos(armA)*40:56));ctx.stroke()}
 ctx.beginPath();rr(-48,-132,96,108,34);outl(shirt,6);
 ctx.beginPath();ctx.arc(0,-196,64,0,TAU);outl(skin,6);
 ctx.fillStyle=hair;ctx.strokeStyle=INKC;ctx.lineWidth=6;ctx.beginPath();
 if(kind===0){ctx.arc(0,-204,66,Math.PI*1.02,Math.PI*1.98);ctx.quadraticCurveTo(40,-232,0,-222);ctx.quadraticCurveTo(-40,-232,-66,-204)}
 else if(kind===1){ctx.arc(0,-208,66,Math.PI*1.0,Math.PI*2.0);ctx.fill();ctx.stroke();ctx.beginPath();ctx.arc(0,-272,24,0,TAU)}
 else if(kind===2){ctx.moveTo(-70,-190);ctx.bezierCurveTo(-76,-290,76,-290,70,-190);ctx.lineTo(70,-120);ctx.lineTo(48,-120);ctx.lineTo(50,-190);ctx.quadraticCurveTo(0,-250,-50,-190);ctx.lineTo(-48,-120);ctx.lineTo(-70,-120)}
 else{ctx.arc(0,-208,68,Math.PI*1.0,Math.PI*2.0);ctx.fill();ctx.stroke();ctx.beginPath();rr(-64,-212,128,18,8)}
 ctx.fill();ctx.stroke();
 ctx.fillStyle='#2b1d17';ctx.beginPath();ctx.ellipse(-24,-188,7,9,0,0,TAU);ctx.ellipse(24,-188,7,9,0,0,TAU);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(-22,-191,2.6,0,TAU);ctx.arc(26,-191,2.6,0,TAU);ctx.fill();
 ctx.fillStyle='rgba(255,123,134,.6)';ctx.beginPath();ctx.ellipse(-44,-172,11,7,0,0,TAU);ctx.ellipse(44,-172,11,7,0,0,TAU);ctx.fill();
 ctx.strokeStyle=INKC;ctx.lineWidth=4.4;if(mouth==='open'){ctx.beginPath();ctx.ellipse(0,-160,13,15,0,0,TAU);outl('#74292b',3.4)}else{ctx.beginPath();ctx.arc(0,-168,15,.2,Math.PI-.2);ctx.stroke()}
 ctx.restore()}
function curtains(open,t){const w=(1-open)*980+20;ctx.fillStyle='#c93a3a';for(const [x0,dir] of[[0,1],[W,-1]]){ctx.beginPath();ctx.moveTo(x0,0);ctx.lineTo(x0+dir*w,0);ctx.lineTo(x0+dir*w,H);ctx.lineTo(x0,H);ctx.fill();ctx.strokeStyle='rgba(120,20,20,.5)';ctx.lineWidth=8;for(let i=1;i<7;i++){const x=x0+dir*w*i/7;ctx.beginPath();ctx.moveTo(x,0);ctx.quadraticCurveTo(x+dir*10,H/2,x,H);ctx.stroke()}ctx.strokeStyle='#ffd84a';ctx.lineWidth=10;ctx.beginPath();ctx.moveTo(x0+dir*w,0);ctx.lineTo(x0+dir*w,H);ctx.stroke()}}
function spot(x,y,r,a=.35){const g=ctx.createRadialGradient(x,y,10,x,y,r);g.addColorStop(0,`rgba(255,250,200,${a})`);g.addColorStop(1,'rgba(255,250,200,0)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H)}
const STAGE={warm:['#FFE9A8','#FFD9B8'],mint:['#DDF3D2','#FFF3D6'],peach:['#FFDCC6','#FFF1CF'],sky:['#BDE7FF','#F4FBE8'],sunny:['#FFE9A8','#FFF6E0']};
const STAGEMAP={'#ffc7d6':'peach','#ffe1c4':'peach','#ffe7a8':'warm','#e7d6ff':'mint','#d9f6c9':'mint','#fff0a8':'warm','#ffb8d4':'warm','#b8e2ff':'sky','#d8f0ff':'sky','#ffd0e0':'warm'};
function dots(a=.3){ctx.fillStyle=`rgba(255,255,255,${a})`;for(let y=40,r=0;y<830;y+=90,r++)for(let x=(r%2)*45+30;x<W;x+=90){ctx.beginPath();ctx.arc(x,y,6,0,TAU);ctx.fill()}}
function stageBG(t,c1,c2){const pal=STAGE[STAGEMAP[c1]||'warm'];skyGrad(pal[0],pal[1]);dots();bokeh(t,16,2,.35);ctx.fillStyle='#EFC796';ctx.fillRect(0,830,W,250);ctx.fillStyle='#DDAA72';ctx.fillRect(0,830,W,14);ctx.strokeStyle='rgba(74,50,38,.18)';ctx.lineWidth=3;for(let x=0;x<W;x+=180){ctx.beginPath();ctx.moveTo(x,844);ctx.lineTo(x-60,1080);ctx.stroke()}}
function bigWord(s,x,y,p,col,sz=150,rot=0){if(p<=0)return;ctx.save();ctx.translate(x,y);ctx.rotate(rot);const sc=back(p);ctx.scale(sc,sc);text(s,0,0,{size:sz,col,stroke:'#fff',sw:sz*.2});ctx.restore()}
function windowFrame(x,y,w,h,active,pr){ctx.save();ctx.translate(x,y);ctx.beginPath();rr(-w/2,-h/2,w,h,28);ctx.fillStyle=active?'#fff6d8':'#ffe6c9';ctx.fill();ctx.lineWidth=active?10:6;ctx.strokeStyle=active?'#ff8a3d':INKC;ctx.stroke();ctx.restore()}

function logo(x,y,sc0,p,t,o={}){if(p<=0)return;ctx.save();ctx.translate(x,y);const sc=back(p)*sc0*(1+pulse(t)*.025);ctx.scale(sc,sc);
 if(o.title!==false)text('好運來小番茄',0,0,{size:150,col:C.tomato,sp:2});
 if(o.rib!==false){const tx=o.rib||'美濃・玉女 × 橙蜜香';ctx.font=`700 42px ${FONT}`;ctx.save();ctx.letterSpacing='5px';const w=ctx.measureText(tx).width+120;ctx.restore();ctx.save();ctx.translate(0,o.title===false?0:122);ctx.beginPath();rr(-w/2,-37,w,74,37);outl(C.leafTx,5);
  ctx.save();ctx.clip();const g=ctx.createLinearGradient(0,-37,0,37);g.addColorStop(0,'rgba(255,255,255,.22)');g.addColorStop(.5,'rgba(255,255,255,0)');ctx.fillStyle=g;ctx.fillRect(-w/2,-37,w,74);ctx.restore();
  text(tx,0,2,{size:42,col:C.paper,stroke:false,w:700,sp:5});ctx.restore()}ctx.restore()}
function basket(x,y,sc,n,t,fc){fc=fc||C.tomato;ctx.save();ctx.translate(x,y);ctx.scale(sc,sc);
 // back rim
 ctx.beginPath();ctx.ellipse(0,-6,150,34,0,0,TAU);outl('#9a6a38',6);
 // tomatoes heaped inside
 for(let i=0;i<n;i++){const a=i*2.4,rr_=Math.sqrt((i+.5)/Math.max(n,1))*98;tomatoDraw(Math.cos(a)*rr_,-14-Math.abs(Math.sin(a))*26+ (i%2)*6,32,i%3===0?mixc(fc,'#000000',.12):fc,{rot:(hash(i)-.5)*.9})}
 // front wicker body
 ctx.beginPath();ctx.moveTo(-150,-4);ctx.quadraticCurveTo(-140,84,-96,122);ctx.quadraticCurveTo(0,150,96,122);ctx.quadraticCurveTo(140,84,150,-4);ctx.quadraticCurveTo(0,34,-150,-4);ctx.closePath();outl('#d9a566',7);
 ctx.save();ctx.clip();ctx.strokeStyle='#a87136';ctx.lineWidth=5;for(let i=-4;i<=4;i++){ctx.beginPath();ctx.moveTo(i*36,10);ctx.quadraticCurveTo(i*36+Math.sign(i)*8,70,i*28,150);ctx.stroke()}
 for(let j=0;j<4;j++){ctx.beginPath();ctx.moveTo(-160,28+j*26);ctx.quadraticCurveTo(0,52+j*26,160,28+j*26);ctx.stroke()}ctx.restore();
 // front rim + handle arc
 ctx.beginPath();ctx.moveTo(-150,-4);ctx.quadraticCurveTo(0,34,150,-4);ctx.lineWidth=14;ctx.strokeStyle=INKC;ctx.stroke();ctx.lineWidth=8;ctx.strokeStyle='#b97c3c';ctx.stroke();
 ctx.restore()}
function flavorIcons(t,u,y,xs){
 xs=xs||[560,960,1360];
 // 香：香氣捲
 {const q=back(prog(u,0,.4));if(q>0){ctx.save();ctx.translate(xs[0],y);ctx.scale(q*.72,q*.72);ctx.strokeStyle='#F59E2B';ctx.lineWidth=16;ctx.lineCap='round';for(let k=-1;k<=1;k++){ctx.beginPath();for(let i=0;i<=24;i++){const f=i/24,yy=90-f*220,xx=k*56+Math.sin(f*8+t*3+k)*26;i?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy)}ctx.stroke()}ctx.restore()}}
 // Q：Q 彈的兩顆圓
 {const q=back(prog(u,.5,.9));if(q>0){ctx.save();ctx.translate(xs[1],y);ctx.scale(q*.72,q*.72);for(const [dx,r0,c] of [[-58,62,C.leaf],[52,48,C.leafLt]]){const sq=1+Math.sin(t*6+dx)*.07;ctx.save();ctx.translate(dx,Math.sin(t*5+dx)*10);ctx.scale(1/sq,sq);ctx.beginPath();ctx.arc(0,0,r0,0,TAU);outl(c,7);ctx.fillStyle='rgba(255,255,255,.7)';ctx.beginPath();ctx.ellipse(-r0*.35,-r0*.38,r0*.2,r0*.12,-.5,0,TAU);ctx.fill();ctx.restore()}ctx.restore()}}
 // 甜：蜜糖滴＋愛心
 {const q=back(prog(u,1.0,1.4));if(q>0){ctx.save();ctx.translate(xs[2],y);ctx.scale(q*.72,q*.72);ctx.beginPath();ctx.moveTo(0,-110);ctx.bezierCurveTo(70,-20,76,60,0,84);ctx.bezierCurveTo(-76,60,-70,-20,0,-110);outl('#FFC857',7);ctx.fillStyle='rgba(255,255,255,.6)';ctx.beginPath();ctx.ellipse(-26,-10,12,28,.4,0,TAU);ctx.fill();heart(46,-86+Math.sin(t*4)*8,20,'#FF6F86');ctx.restore()}}
}
/* ===== scene definitions ===== */
const SCENES=[];
const S=(a,b,f,o={})=>SCENES.push(Object.assign({a,b,f},o));

// 0 intro
S(0,2.04,(t,u,p)=>{farm(t,{sky1:'#9CC7F0',sky2:'#FFE0C2',sy:540-p*260,sx:1700,sr:70,rows:true,mtn:['#9CC4C8','#82B7A0','#6EAB84']});
 logo(960,330,1.05,prog(u,.4,1.2),t);
 mdance('red',420,GY+30,.9,t,{expr:'happy'});mdance('orange',1500,GY+30,.9,t,{expr:'happy',flip:-1,ph:1.5});},{zoom:.02,iris:false});

// 1a dawn wide
S(2.04,5.6,(t,u,p)=>{farm(t,{sy:620-p*140,sx:1400,sr:90,rows:true});
 for(let i=0;i<5;i++){const bx=((t*60+i*400)%2400)-200,by=180+i*40+Math.sin(t*3+i)*14;ctx.strokeStyle=INKC;ctx.lineWidth=5;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(bx-18,by);ctx.quadraticCurveTo(bx-8,by-14+Math.sin(t*12+i)*8,bx,by);ctx.quadraticCurveTo(bx+8,by-14+Math.sin(t*12+i)*8,bx+18,by);ctx.stroke()}
 const pin=back(prog(u,.7,1.2));if(pin>0){ctx.save();ctx.translate(560,280);ctx.scale(pin,pin);ctx.beginPath();ctx.moveTo(0,70);ctx.bezierCurveTo(-60,10,-52,-50,0,-50);ctx.bezierCurveTo(52,-50,60,10,0,70);outl('#ff5a5a',6);ctx.beginPath();ctx.arc(0,-14,17,0,TAU);outl('#fff',4);ctx.restore();text('高雄・美濃',560,372,{size:60,col:'#7a2a1a',alpha:pin})}
 const wake=prog(u,1.4,2);mdance('red',640,GY+30,.9,t,{expr:wake>0?'happy':'smile',ph:0});mdance('orange',1180,GY+30,.9,t,{expr:wake>0?'happy':'smile',ph:1.5,flip:-1});
 if(u<1.8){text('Zzz',700,640,{size:56,col:'#6a7bb0',alpha:1-prog(u,1.2,1.8)});}
 if(wake>0)text('！',650,560-wake*30,{size:70,col:C.tomato,alpha:1-prog(u,2.2,3)});});
// 1b dew close-up
S(5.6,9.5,(t,u,p)=>{skyGrad('#c8ecff','#fff5d6');bokeh(t,14,7,.4);
 ctx.save();ctx.translate(960,640);ctx.rotate(-.1+Math.sin(t*1.2)*.02);ctx.beginPath();ctx.moveTo(-760,40);ctx.bezierCurveTo(-500,-460,500,-460,760,40);ctx.bezierCurveTo(500,240,-500,240,-760,40);outl('#7cc86a',10);ctx.strokeStyle='#4f9e4a';ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(-720,40);ctx.quadraticCurveTo(0,-20,720,40);ctx.stroke();for(let i=-3;i<=3;i++){ctx.beginPath();ctx.moveTo(i*70,0);ctx.lineTo(i*160,-160+Math.abs(i)*30);ctx.stroke()}
 for(let i=0;i<11;i++){const x=-560+i*112+hash(i)*40,y=-80+Math.sin(i*1.3)*60+hash(i*4)*40,r=22+hash(i*7)*24,tw=.5+.5*Math.sin(t*3+i);ctx.beginPath();ctx.ellipse(x,y,r,r*1.25,0,0,TAU);ctx.fillStyle='rgba(190,235,255,.85)';ctx.fill();ctx.strokeStyle='#6aa6c8';ctx.lineWidth=4;ctx.stroke();ctx.fillStyle='rgba(255,255,255,.95)';ctx.beginPath();ctx.ellipse(x-r*.3,y-r*.4,r*.28,r*.4,.4,0,TAU);ctx.fill();if(tw>.9)sparkle(x+r,y-r,18,'#fff')}
 ctx.restore();
 const dr=((u*.5)%1);ctx.fillStyle='rgba(190,235,255,.9)';ctx.strokeStyle='#6aa6c8';ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(1250,520+dr*330,16,22,0,0,TAU);ctx.fill();ctx.stroke();
 mdance('red',420,GY+90,1.0,t,{expr:'smile'});mdance('orange',1500,GY+90,1.0,t,{expr:'smile',flip:-1,ph:2});text('✦',960,160,{size:1,alpha:0});});

// 2a mom waits
S(9.5,12.73,(t,u,p)=>{farm(t,{sx:1560,sy:240,sr:70,vcol:[C.tomato]});
 const ripe=prog(u,.4,3);const col=(c)=>c;ctx.save();ctx.translate(1380,860);
 for(let k=0;k<3;k++){vine(-k*70,20,520-k*40,t+k,{n:6,r:26,col:[ripe>.6?C.tomato:'#a9d46a',ripe>.3?C.tomato:'#c7dc6a']})}ctx.restore();
 person('mom',{x:700,y:GY+20,s:.82,expr:u>1.2?'happy':'smile',aL:[0,'relaxed'],aR:[u>1?95:20,'wave'],tilt:Math.sin(t*2)*.04,bob:-pulse(t)*8});
 text('等…',900,260,{size:70,col:'#6a5a46',alpha:1-prog(u,1.8,2.4)});
 infoCard(1500,420,640,290,'玉女',['長橢球形・果皮薄','糖度可達 10 度以上'],prog(u,1.0,1.5),{col:C.tomato,rot:.03,ts:50,ls:42,lh:58,top:104});});
// 2b dad waits
S(12.73,15.45,(t,u,p)=>{farm(t,{sx:360,sy:240,sr:70,vcol:[C.orange]});
 ctx.save();ctx.translate(520,860);for(let k=0;k<3;k++)vine(k*70,20,520-k*40,t+k,{n:6,r:26,col:[prog(u,0,2)>.5?C.orange:'#d8e068',C.orange]});ctx.restore();
 person('dad',{x:1020,y:GY+20,s:.86,expr:u>1?'happy':'smile',aL:[u>.8?95:20,'wave'],aR:[0,'relaxed'],tilt:Math.sin(t*2)*.04,bob:-pulse(t)*8,flip:-1});
 for(let i=0;i<4;i++){const q=prog(u,.5+i*.38,1.1+i*.38);if(q>0&&q<1)tomatoDraw(lerp(640,760,q),lerp(430,700,q)-Math.sin(q*Math.PI)*120,24,C.orange,{rot:q*5})}
 const nIn=[0,1,2,3].filter(i=>u>1.1+i*.38).length;basket(780,830,.88,Math.min(4,nIn),t,C.orange);
 infoCard(1560,430,640,290,'橙蜜香',['酸甜平衡','甜度 10–11 度・皮薄多汁'],prog(u,.9,1.4),{col:C.orange,rot:-.03,ts:50,ls:42,lh:58,top:104});});

// 3 pre-chorus quick scenes
S(15.45,16.64,(t,u,p)=>{skyGrad('#A9BDD1','#DCE6EE');for(let i=0;i<30;i++){const x=hash(i)*W,y=(hash(i+.5)*H+u*1400)%H;ctx.strokeStyle='#e6f2ff';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-10,y+40);ctx.stroke()}
 cloud(300,150,1.6,'#7b86a0');cloud(1620,140,1.6,'#6e7a96');ground('#9bbf9a','#7fa88a',790);
 /* umbrella sits ABOVE and BEHIND the two people so it never covers their faces */
 ctx.save();ctx.translate(0,Math.sin(t*3)*3-28);ctx.strokeStyle=INKC;ctx.lineWidth=9;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(960,150);ctx.lineTo(960,700);ctx.stroke();
 ctx.beginPath();ctx.moveTo(500,235);ctx.quadraticCurveTo(960,-70,1420,235);for(let i=0;i<5;i++)ctx.quadraticCurveTo(500+i*184+92,200,500+(i+1)*184,235);ctx.closePath();outl('#ff6f6f',8);
 for(const dx of[-300,-150,0,150,300]){ctx.beginPath();ctx.moveTo(960,52);ctx.quadraticCurveTo(960+dx*.9,110,960+dx*1.5,228);ctx.strokeStyle='#c24b4b';ctx.lineWidth=4;ctx.stroke()}ctx.restore();
 person('dad',{x:740,y:GY+20,s:.64,expr:'sad',aL:[0,'relaxed'],aR:[0,'relaxed']});person('mom',{x:1180,y:GY+20,s:.64,expr:'sad'});},{zoom:.04});
S(16.64,17.76,(t,u,p)=>{skyGrad('#FFE9A8','#FFF6E0');sunDraw(960,250,120,t);ground('#cfe8a0','#a8d57a',790);
 person('dad',{x:700,y:GY+20,s:.8,expr:'laugh',aL:[0,'relaxed'],aR:[0,'relaxed']});person('mom',{x:1220,y:GY+20,s:.8,expr:'laugh'});
 for(let i=0;i<4;i++){const y=520+((u*160+i*80)%260);ctx.fillStyle='#8fd3ff';ctx.beginPath();ctx.ellipse(640+i*18,y,8,12,0,0,TAU);ctx.fill()}
 mdance('orange',1600,GY+30,.9,t,{expr:'wow'});},{zoom:.04});
S(17.76,19.56,(t,u,p)=>{stageBG(t,'#ffe1c4','#fff3d6');
 person('mom',{x:560,y:GY+20,s:.9,expr:'happy',aL:[40,'relaxed'],aR:[40,'relaxed'],bob:-pulse(t)*8});
 carton(1180,720,1.5);
 for(let i=0;i<7;i++){const q=prog(u,.1+i*.18,.7+i*.18);if(q>0&&q<1){const x=lerp(760,1100+i*10,q),y=lerp(500,560,q)-Math.sin(q*Math.PI)*260;tomatoDraw(x,y,26,i%2?C.tomato:C.orange,{rot:q*6})}}
 const lid=prog(u,1.1,1.6);if(lid>0){ctx.save();ctx.translate(1390,560);ctx.globalAlpha=lid;stamp(0,0,76,lid);ctx.restore()}});
S(19.56,21.45,(t,u,p)=>{stageBG(t,'#d8f0ff','#fff6d8');
 carton(430+u*30,790,1.25,{rot:-.06});person('girl',{x:1330,y:GY+20,s:.9,expr:'happy',aL:[0,'relaxed'],aR:[70,'relaxed'],bob:-pulse(t)*8});phoneDraw(1130,640+Math.sin(t*3)*8,1.0,.2);
 for(let i=0;i<4;i++){const q=((u*.9+i*.25)%1);heart(620+q*360,540-Math.sin(q*Math.PI)*170,22+q*10,'#ff6f86');}
 bubble([['紅的',C.tomato],['橙的',C.orange],['都有喔！',INKC]],760,300,u,prog(u,.4,.9),'r')});
function bubble(s,x,y,t,p,side){if(p<=0)return;const segs=Array.isArray(s)?s:[[s,INKC]];ctx.save();ctx.font=`48px ${FONT}`;const tw=segs.reduce((a,[tx])=>a+ctx.measureText(tx).width,0),w=Math.max(420,tw+90),h=104;ctx.restore();
 ctx.save();ctx.translate(x,y);const sc=back(p);ctx.scale(sc,sc);ctx.beginPath();rr(-w/2,-h/2,w,h,40);outl('#fffdf4',6);
 if(side==='r'){const e=w/2;ctx.beginPath();ctx.moveTo(e-4,-18);ctx.lineTo(e+52,10);ctx.lineTo(e-4,24);outl('#fffdf4',6);ctx.fillStyle='#fffdf4';ctx.fillRect(e-14,-14,16,36)}
 else{ctx.beginPath();ctx.moveTo(-20,50);ctx.lineTo(0,96);ctx.lineTo(24,50);outl('#fffdf4',6);ctx.fillStyle='#fffdf4';ctx.fillRect(-18,46,40,10)}
 let cx=-tw/2;for(const [tx,col] of segs){ctx.save();ctx.font=`48px ${FONT}`;const sw=ctx.measureText(tx).width;ctx.restore();text(tx,cx+sw/2,0,{size:48,col,stroke:false});cx+=sw}
 ctx.restore()}

// 4 chorus 1
S(21.45,24.41,(t,u,p)=>{stageBG(t,'#ffc7d6','#ffe9b8');person('girl',{x:640,y:GY+30,s:.9,expr:u>1?'happy':'wow',aL:[0,'relaxed'],aR:[u>.6?100:60,'relaxed'],tilt:-.05+Math.sin(t*3)*.03,bob:-pulse(t)*8});
 tomatoDraw(880,430,40,C.tomato,{rot:-.6});
 const lens=back(prog(u,.7,1.3));if(lens>0){ctx.save();ctx.translate(1320,520);ctx.scale(lens,lens);ctx.beginPath();ctx.arc(0,0,250,0,TAU);outl('#fff7f0',12);ctx.save();ctx.beginPath();ctx.arc(0,0,236,0,TAU);ctx.clip();ctx.fillStyle='#ff9a86';ctx.fillRect(-250,-250,500,500);ctx.fillStyle=C.tomato;ctx.fillRect(-250,-250,500,60);ctx.fillStyle='#ffb5a6';ctx.fillRect(-250,-190,500,40);for(let i=0;i<9;i++){ctx.fillStyle='#ffe2dc';ctx.beginPath();ctx.arc(-200+i*50,-30+Math.sin(i)*40,20,0,TAU);ctx.fill()}ctx.restore();ctx.restore();ctx.strokeStyle=INKC;ctx.lineWidth=5;ctx.setLineDash([12,10]);ctx.beginPath();ctx.moveTo(900,470);ctx.lineTo(1100,500);ctx.stroke();ctx.setLineDash([])}
 mdance('red',1700,GY+30,.7,t,{expr:'happy'});},{zoom:.04});
S(24.41,26.68,(t,u,p)=>{stageBG(t,'#ffe7a8','#fff3d6');person('dad',{x:700,y:GY+30,s:.9,expr:'laugh',aL:[0,'relaxed'],aR:[u>.4?100:60,'relaxed'],tilt:.05,bob:-pulse(t)*10});tomatoDraw(985,440,38,C.orange,{rot:.5});
 const b=back(prog(u,.5,.9));ctx.save();ctx.translate(1300,480);ctx.rotate(Math.sin(t*14)*.04);ctx.scale(b*(1+pulse(t)*.1),b*(1+pulse(t)*.1));ctx.beginPath();for(let i=0;i<24;i++){const a=i/24*TAU,r=i%2?160:250;ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r)}ctx.closePath();outl('#ffd84a',8);tomatoDraw(0,6,74,C.orange,{rot:-.4});ctx.fillStyle='#FFF6E0';ctx.strokeStyle=INKC;ctx.lineWidth=5;ctx.beginPath();ctx.arc(46,-40,26,0,TAU);ctx.fill();ctx.stroke();for(let q=0;q<6;q++){const a=q*1.05+t*3;ctx.fillStyle=C.orange;ctx.beginPath();ctx.arc(Math.cos(a)*118,Math.sin(a)*118,6+q%2*3,0,TAU);ctx.fill()}ctx.restore();
 mdance('orange',1700,GY+30,.7,t,{expr:'sing',flip:-1});},{zoom:.04});
S(26.68,28.92,(t,u,p)=>{stageBG(t,'#e7d6ff','#ffe9d6');person('mom',{x:960,y:GY+30,s:.86,expr:'happy',aL:[70,'relaxed'],aR:[70,'relaxed'],tilt:Math.sin(t*2)*.05,bob:-pulse(t)*8});
 for(let k=0;k<3;k++){ctx.strokeStyle=['#ff9ab4','#ffd84a','#8fd3b0'][k];ctx.lineWidth=14;ctx.lineCap='round';ctx.beginPath();for(let i=0;i<=40;i++){const q=i/40,yy=500-q*360-((t*60)%0),xx=960+Math.sin(q*9+k*2+t*2)*(60+q*180)*(k-1?1:-1);i?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy)}ctx.globalAlpha=.8;ctx.stroke();ctx.globalAlpha=1}
 for(let i=0;i<8;i++){const q=((u*.5+i/8)%1);sparkle(960+Math.sin(i*2)*320,520-q*420,16+hash(i)*14,['#ffd84a','#ff9ab4','#fff'][i%3])}
 heart(1500,280,40);},{zoom:.04});
S(28.92,30.65,(t,u,p)=>{stageBG(t,'#d9f6c9','#fff6d8');mdance('red',640,GY+30,1.0,t,{expr:'happy'});mdance('orange',1280,GY+30,1.0,t,{expr:'happy',ph:2,flip:-1});
 const items=[['C','維他命 C',C.orange],['♥','健康','#ff6f86'],['葉','低熱量','#5aab55']];items.forEach(([s,l,c],i)=>{const q=back(prog(u,.1+i*.25,.6+i*.25));if(q<=0)return;ctx.save();ctx.translate(380+i*580,330+Math.sin(t*3+i)*12);ctx.scale(q,q);if(i===2&&IMG.kcal){const bw=IMG.kcal.width,k=(2*130+14)/(bw*.70);ctx.drawImage(IMG.kcal,-bw*k/2,-IMG.kcal.height*k/2+2,bw*k,IMG.kcal.height*k)}else{ctx.beginPath();ctx.arc(0,0,130,0,TAU);outl(c,8);text(s,0,-6,{size:130,col:'#fff',stroke:INKC})}ctx.restore();text(l,380+i*580,524,{size:62,col:INKT,alpha:q,stroke:false,w:900,sp:3})})});
S(30.65,33.1,(t,u,p)=>{stageBG(t,'#fff0a8','#ffd1b8');spot(960,500,800,.4);confetti(t,60,1);
 logo(960,210,.95,prog(u,0,.5),t,{title:false});clover(960,440,52,Math.sin(t*2)*.2);
 mdance('red',420,GY+30,1.05,t,{expr:'sing'});mdance('orange',1500,GY+30,1.05,t,{expr:'sing',flip:-1,ph:2});dancer('girl',700,GY+20,.57,t,{ph:1});dancer('mom',1220,GY+20,.57,t,{ph:2});stamp(1660,180,80,prog(u,.8,1.3));});
S(33.1,35.0,(t,u,p)=>{skyGrad('#BDE7FF','#F1F9DA');ground('#bfe6a0','#9fd58a',720);ctx.fillStyle='#ff9d85';ctx.beginPath();ctx.ellipse(960,850,760,120,0,0,TAU);ctx.fill();ctx.strokeStyle=INKC;ctx.lineWidth=6;ctx.stroke();
 dancer('dad',470,GY+20,.74,t,{aL:30,aR:30,ph:1,hand:'relaxed'});dancer('mom',740,GY+20,.74,t,{aL:30,aR:30,ph:2,hand:'relaxed'});dancer('girl',1190,GY+20,.74,t,{aL:30,aR:30,ph:3,hand:'relaxed'});mdance('red',1450,GY+30,.85,t,{expr:'happy'});mdance('orange',1650,GY+30,.85,t,{expr:'happy',ph:2,flip:-1});
 carton(960,720,.9);for(let i=0;i<5;i++){const q=((u*.6+i/5)%1);heart(960+Math.sin(i*2)*300,640-q*380,20+q*12,'#ff6f86')}});
S(35.0,37.8,(t,u,p)=>{stageBG(t,'#ffb8d4','#fff0a8');spot(960,520,900,.4);
  flavorIcons(t,u,175,[440,960,1480]);dancer('dad',540,GY+20,.6,t,{ph:0,expr:'happy',aL:30,aR:30,hand:'relaxed'});dancer('mom',800,GY+20,.6,t,{ph:1,expr:'laugh',aL:30,aR:30,hand:'relaxed'});dancer('girl',1120,GY+20,.6,t,{ph:2,expr:'happy',aL:30,aR:30,hand:'relaxed'});mdance('red',360,GY+40,.9,t,{expr:'sing'});mdance('orange',1560,GY+40,.9,t,{expr:'sing',flip:-1,ph:1});confetti(t,40,5);for(let i=0;i<6;i++)heart(200+i*300+Math.sin(t*2+i)*20,200+(i%2)*500,18+hash(i)*10,'#ff9ab4')});
S(37.8,40.2,(t,u,p)=>{const day=p;const c1=lerp(0,1,Math.sin(p*Math.PI));{const e=ease(prog(p,.2,.95));const a1=e<.5?mixc('#A9DDFF','#FFD9B8',e*2):mixc('#FFD9B8','#FFB38F',(e-.5)*2),a2=e<.5?mixc('#F4F8DD','#FFF1CF',e*2):mixc('#FFF1CF','#FFE9C2',(e-.5)*2);skyGrad(a1,a2)}const a=p*Math.PI;sunDraw(300+p*1300,700-Math.sin(a)*500,70,t);cloud(500,200,1.2);ground('#bfe6a0','#8fcf7a',790);
 ctx.fillStyle='#ffe0b0';ctx.beginPath();rr(640,720,640,40,10);outl('#ffcf8a',6);carton(960,690,.7);
 dancer('dad',500,GY+20,.6,t,{ph:1,aL:30,aR:30,hand:'relaxed'});dancer('girl',1420,GY+20,.6,t,{ph:2,aL:30,aR:30,hand:'relaxed',flip:-1});
 ctx.save();ctx.translate(960,250);ctx.beginPath();rr(-150,-110,300,220,20);outl('#fffdf4',6);ctx.beginPath();rr(-150,-110,300,60,20);outl(C.tomato,6);text(String(1+Math.floor(p*6)),0,30,{size:120,col:C.tomatoTx,stroke:false,w:900});ctx.restore()});

// 5 interlude: facts
S(40.2,45.5,(t,u,p)=>{skyGrad('#bfe9ff','#e8ffe0');const pc=back(prog(u,0,.6));
 if(IMG.tw){const h=780,w=IMG.tw.width/IMG.tw.height*h;ctx.save();ctx.translate(560,520);ctx.scale(.9+pc*.1,.9+pc*.1);ctx.shadowColor='rgba(74,50,38,.2)';ctx.shadowBlur=18;ctx.shadowOffsetY=8;ctx.drawImage(IMG.tw,-w/2,-h/2,w,h);ctx.restore()}
 text('高雄・美濃',1300,230,{size:100,col:C.tomato,alpha:prog(u,.9,1.4)});
 infoCard(1300,520,820,340,'美濃小檔案',['全高雄最大的小番茄產區','種植面積約 130 公頃'],prog(u,1.4,2),{col:C.leaf,ts:56,ls:46,lh:66,top:112});

 mdance('red',1240,GY+30,.9,t,{expr:'happy'});mdance('orange',1480,GY+30,.9,t,{expr:'happy',ph:1,flip:-1});},{zoom:.02});
S(45.5,50.5,(t,u,p)=>{skyGrad('#FFF0CC','#FFF9EA');bokeh(t,12,4,.35);mdance('orange',380,GY+60,1.9,t,{expr:'happy'});
 const pc=back(prog(u,.1,.6));ctx.save();ctx.translate(1180,470);ctx.scale(pc,pc);ctx.shadowColor='rgba(74,50,38,.22)';ctx.shadowBlur=20;ctx.shadowOffsetY=10;ctx.beginPath();rr(-560,-340,1120,720,44);outl('#FFF9EA',6);ctx.shadowColor='transparent';
 ctx.beginPath();rr(-270,-392,540,104,52);outl(C.orange,6);text('橙蜜香',0,-338,{size:78,col:C.paper,stroke:false,w:900,sp:6});ctx.restore();text('美濃招牌小番茄',1180,222,{size:42,col:C.brownTx,stroke:false,alpha:prog(u,.5,1),w:700,sp:2});
 const a1=prog(u,.6,1.1);text('盛產期　12月～4月',1180,288,{size:60,col:C.orangeTx,alpha:a1,stroke:false,w:900,sp:3});
 for(let i=0;i<12;i++){const m=String(i+1),q=back(prog(u,.8+i*.05,1.2+i*.05));if(q<=0)continue;const on=(i+1<=4)||(i+1===12);ctx.save();ctx.translate(lerp(690,1670,i/11),380);ctx.scale(q,q);ctx.beginPath();rr(-33,-33,66,66,15);outl(on?C.orange:'#f1e6d0',5);text(m,0,0,{size:34,col:on?C.paper:'#A8967A',stroke:false,w:on?900:700});ctx.restore()}
 const mq=prog(u,1.7,2.4);text('甜度 10–11 度',1180,490,{size:66,col:C.tomatoTx,alpha:mq,stroke:false,w:900,sp:2});
 ctx.beginPath();rr(700,540,960,56,28);outl('#fff4de',6);ctx.save();ctx.beginPath();rr(702,542,956*easeOut(mq)*.74,52,26);ctx.clip();const gg=ctx.createLinearGradient(700,0,1660,0);gg.addColorStop(0,'#ffd27a');gg.addColorStop(1,C.orange);ctx.fillStyle=gg;ctx.fillRect(700,540,960,56);ctx.restore();
 [['酸甜平衡',672],['皮薄多汁、果肉厚實',730],['富含維他命 C、熱量低',788]].forEach(([s2,y],i)=>{const q=prog(u,2.3+i*.4,2.8+i*.4);ctx.save();ctx.globalAlpha=q;ctx.translate(806,y-10);ctx.beginPath();ctx.arc(0,0,22,0,TAU);outl(C.leaf,4);ctx.strokeStyle=C.paper;ctx.lineWidth=6;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();ctx.moveTo(-9,1);ctx.lineTo(-2,9);ctx.lineTo(11,-8);ctx.stroke();ctx.restore();text(s2,846,y-10,{size:46,align:'left',col:INKT,alpha:q,stroke:false,w:700})});
},{zoom:.02});
S(50.5,55.2,(t,u,p)=>{skyGrad('#FFE3DA','#FFF6EE');bokeh(t,12,9,.35);mdance('red',380,GY+60,1.9,t,{expr:'happy'});
 const pc=back(prog(u,.1,.6));ctx.save();ctx.translate(1180,470);ctx.scale(pc,pc);ctx.shadowColor='rgba(74,50,38,.22)';ctx.shadowBlur=20;ctx.shadowOffsetY=10;ctx.beginPath();rr(-560,-340,1120,720,44);outl('#FFF9EA',6);ctx.shadowColor='transparent';
 ctx.beginPath();rr(-290,-392,580,104,52);outl(C.tomato,6);text('玉女小番茄',0,-338,{size:78,col:C.paper,stroke:false,w:900,sp:6});ctx.restore();text('皮薄香甜',1180,222,{size:42,col:C.brownTx,stroke:false,alpha:prog(u,.5,1),w:700,sp:2});
 [['農友種苗 2000 年選育',310],['長橢球形・果皮薄、肉質細緻',420],['糖度通常可達 10 度以上',530],['適合日夜溫差大的秋冬季',640]].forEach(([s2,y],i)=>{const q=back(prog(u,.7+i*.55,1.2+i*.55));if(q<=0)return;ctx.save();ctx.translate(1180,y+10);ctx.scale(q,q);ctx.beginPath();rr(-500,-44,1000,88,32);outl('#fff1ee',5);text(s2,0,0,{size:50,stroke:false});ctx.restore()});
 text('怕雨、容易裂果，所以更需要細心照顧',1180,760,{size:40,col:C.brownTx,alpha:prog(u,3.0,3.5),stroke:false,w:700});
},{zoom:.02});
S(55.2,58.0,(t,u,p)=>{stageBG(t,'#b8e2ff','#F4F8DD');spot(960,500,950,.45);confetti(t,50,11);curtains(prog(u,0,.8),t);
 mdance('red',420,GY+30,1.3,t,{expr:'sing'});mdance('orange',1500,GY+30,1.3,t,{expr:'sing',flip:-1,ph:2});dancer('dad',700,GY+20,.78,t,{ph:0});dancer('mom',960,GY+20,.78,t,{ph:1});dancer('girl',1220,GY+20,.78,t,{ph:2});},{zoom:.05});

// 6 verse 2
S(58.0,62.1,(t,u,p)=>{farm(t,{sx:900,sy:640-p*320,sr:110,sky1:'#a6dcff'});for(let i=0;i<6;i++){const bx=((t*70+i*380)%2400)-200,by=160+i*40+Math.sin(t*3+i)*14;ctx.strokeStyle=INKC;ctx.lineWidth=5;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(bx-18,by);ctx.quadraticCurveTo(bx-8,by-14+Math.sin(t*12+i)*8,bx,by);ctx.quadraticCurveTo(bx+8,by-14+Math.sin(t*12+i)*8,bx+18,by);ctx.stroke()}
 const wk=easeOut(prog(u,0,2.6));person('dad',{x:lerp(-200,560,wk),y:GY+20+Math.abs(Math.sin(u*9))*-10,s:.7,expr:'smile',aL:[20,'relaxed'],aR:[20,'relaxed']});person('mom',{x:lerp(-420,820,wk),y:GY+20+Math.abs(Math.sin(u*9+1))*-10,s:.7,expr:'smile'});person('girl',{x:lerp(-640,1080,wk),y:GY+20+Math.abs(Math.sin(u*9+2))*-10,s:.7,expr:'happy'});
 mdance('red',1400,GY+30,.8,t,{expr:'happy'});mdance('orange',1620,GY+30,.8,t,{expr:'happy',flip:-1,ph:1});},{zoom:.04});
S(62.1,65.8,(t,u,p)=>{skyGrad('#c8ecff','#fff5d6');bokeh(t,12,6,.4);const wp=prog(u,.4,2.2),ep=prog(u,2.2,2.8);
 // dewy leaf on the right: the lyric is 露水還在葉子上
 ctx.save();ctx.translate(1380,560);ctx.rotate(-.12+Math.sin(t*1.4)*.02);ctx.beginPath();ctx.moveTo(-300,40);ctx.bezierCurveTo(-180,-200,180,-200,300,40);ctx.bezierCurveTo(180,150,-180,150,-300,40);outl('#7cc86a',9);
 ctx.strokeStyle='#4f9e4a';ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(-280,40);ctx.quadraticCurveTo(0,0,280,40);ctx.stroke();
 for(let i=0;i<9;i++){const x=-210+i*52,y=-18+Math.sin(i*1.7)*42,r=13+hash(i)*11;ctx.beginPath();ctx.ellipse(x,y,r,r*1.25,0,0,TAU);ctx.fillStyle='rgba(205,240,255,.92)';ctx.fill();ctx.strokeStyle='#6aa6c8';ctx.lineWidth=3.5;ctx.stroke();ctx.fillStyle='#fff';ctx.beginPath();ctx.ellipse(x-r*.3,y-r*.4,r*.26,r*.4,.4,0,TAU);ctx.fill()}
 const dr=((u*.5)%1);ctx.fillStyle='rgba(205,240,255,.95)';ctx.strokeStyle='#6aa6c8';ctx.lineWidth=3.5;ctx.beginPath();ctx.ellipse(120,40+dr*210,13,18,0,0,TAU);ctx.fill();ctx.stroke();ctx.restore();
 person('dad',{x:760,y:GY+30,s:.9,expr:ep>0?'happy':'smile',aL:[0,'relaxed'],aR:[lerp(30,95,easeOut(ep>0?1:0)),'relaxed']});
 const hx=ep>0?lerp(930,850,ep):930+Math.sin(u*14)*(wp>0&&wp<1?30:0),hy=ep>0?lerp(520,330,ep):520;tomatoDraw(hx,hy,44,C.tomato,{rot:.4});
 if(u>1.2&&u<2.3){for(let i=0;i<3;i++)sparkle(hx+60+i*34,hy-50-i*18,13+3*Math.sin(u*14+i),'#fff')}
 mdance('orange',1620,GY+60,.9,t,{expr:'wink',flip:-1});},{zoom:.04});
S(65.8,68.84,(t,u,p)=>{farm(t,{sx:300,sy:220,vcol:[C.tomato],rows:true});
 ctx.save();ctx.translate(1300,900);for(let k=0;k<3;k++)vine(k*150,20,560-k*30,t+k,{n:6,r:28,col:[C.tomato]});ctx.restore();
 const caught=Math.min(5,Math.floor(Math.max(0,(u-.9))/.42)+ (u>.5?0:0));
 person('mom',{x:620,y:GY+30,s:.86,expr:'happy',aL:[0,'relaxed'],aR:[u%1<.5?80:60,'relaxed'],bob:-pulse(t)*8});
 for(let i=0;i<5;i++){const q=prog(u,.5+i*.42,1.15+i*.42);if(q>0&&q<1)tomatoDraw(lerp(1180,980,q),lerp(430,650,q)-Math.sin(q*Math.PI)*130,24,C.tomato,{rot:q*5})}
 const nIn=[0,1,2,3,4,5].filter(i=>u>1.15+i*.42).length;basket(990,700,.9+Math.sin(u*10)*.01*(nIn>0?1:0),Math.min(5,nIn),t);
 if(u>1.5)sparkle(1110,520,24,'#ffd84a',t);},{zoom:.04});
S(68.84,70.82,(t,u,p)=>{farm(t,{sx:1600,sy:220,vcol:[C.orange],rows:true});person('dad',{x:1240,y:GY+30,s:.9,expr:'laugh',aL:[u%.8<.4?85:60,'relaxed'],aR:[0,'relaxed'],flip:-1,bob:-pulse(t)*8});
 ctx.save();ctx.translate(560,900);for(let k=0;k<3;k++)vine(k*130,20,560-k*30,t+k,{n:6,r:28,col:[C.orange]});ctx.restore();
 for(let i=0;i<4;i++){const q=prog(u,.15+i*.3,.75+i*.3);if(q>0&&q<1)tomatoDraw(lerp(700,860,q),lerp(430,720,q)-Math.sin(q*Math.PI)*110,24,C.orange,{rot:q*5})}
 const nIn=[0,1,2,3].filter(i=>u>.75+i*.3).length;basket(880,830,.88,Math.min(4,nIn),t,C.orange);});
S(70.82,73.5,(t,u,p)=>{const rain=u<1.45;skyGrad(rain?'#A9BDD1':'#FFE9A8',rain?'#DCE6EE':'#FFF6E0');
 if(rain){cloud(960,190,2,'#7b86a0');for(let i=0;i<28;i++){const x=hash(i)*W,y=(hash(i+.5)*H+u*1400)%H;ctx.strokeStyle='#e6f2ff';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-10,y+40);ctx.stroke()}}else sunDraw(960,250,130,t);
 ground(rain?'#9bbf9a':'#cfe8a0',rain?'#7fa88a':'#a8d57a',790);
 if(rain){mdance('red',780,GY+30,1.25,t,{expr:'smile'});mdance('orange',1200,GY+30,1.25,t,{expr:'wow',flip:-1,ph:1});ctx.beginPath();ctx.moveTo(560,420);ctx.quadraticCurveTo(780,200,1000,420);for(let i=0;i<4;i++)ctx.quadraticCurveTo(560+i*110+55,390,560+(i+1)*110,420);outl('#ff6f6f',8);ctx.strokeStyle=INKC;ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(780,300);ctx.lineTo(780,520);ctx.stroke()}
 else{mdance('red',780,GY+30,1.25,t,{expr:'happy'});mdance('orange',1200,GY+30,1.25,t,{expr:'happy',flip:-1,ph:1})}},{zoom:.04});
S(73.5,77.0,(t,u,p)=>{stageBG(t,'#d8f0ff','#fff6d8');const sl=easeOut(prog(u,2.0,3.5));
 person('girl',{x:lerp(1500,1260,easeOut(prog(u,0,.8))),y:GY+20,s:.85,expr:'happy',aL:[0,'relaxed'],aR:[u>1.5?70:20,'relaxed'],bob:-pulse(t)*8});
 carton(lerp(640,2300,sl*sl),lerp(760,700,sl),1.3,{rot:sl*-.2});stamp(lerp(760,2440,sl*sl),lerp(600,520,sl),66,prog(u,.6,1));if(u>1.4)phoneDraw(1130,560,.9,.1);
 for(let i=0;i<5;i++){const q=((u*.8+i/5)%1);heart(lerp(1400,2000,q),420-q*200,16+q*14,'#ff6f86')}bubble([['想吃就 ',INKC],['LINE',  '#06a24a'],[' 我喔！',INKC]],800,300,u,prog(u,1.8,2.3),'r')},{zoom:.04});

// 7 final chorus
S(77.0,79.58,(t,u,p)=>{stageBG(t,'#ffd0e0','#fff0b8');spot(960,520,1000,.5);confetti(t,70,3);curtains(easeOut(prog(u,.1,.9)),t);
 mdance('red',420,GY+30,1.3,t,{expr:'sing'});mdance('orange',1500,GY+30,1.3,t,{expr:'sing',flip:-1,ph:2});dancer('girl',700,GY+20,.78,t,{ph:1});dancer('mom',960,GY+20,.78,t,{ph:2});dancer('dad',1220,GY+20,.78,t,{ph:3});
},{zoom:.04,iris:true});
function fcWindows(t,u,idx){skyGrad('#FFE9A8','#FFD9B8');bokeh(t,10,12,.3);const cfg=[[500,270,{hair:'#3b2b24',shirt:'#7bb6ff',kind:0,fruit:C.tomato}],[1420,270,{hair:'#8a5a3a',shirt:'#8fd3b0',kind:1,fruit:C.orange}],[500,640,{hair:'#c9a46a',shirt:'#ffb36b',kind:2,fruit:C.tomato}],[1420,640,{hair:'#2f2a30',shirt:'#c9b6f0',kind:3,fruit:C.orange}]];
 cfg.forEach(([x,y,o],i)=>{const act=i===idx;ctx.save();ctx.translate(x,y);const sc=act?1.03+pulse(t)*.03:.94;ctx.scale(sc,sc);windowFrame(0,0,780,360,act);ctx.save();ctx.beginPath();rr(-384,-174,768,348,24);ctx.clip();ctx.fillStyle=act?'#FFF9EA':'#F8EAD3';ctx.fillRect(-390,-180,780,360);ctx.fillStyle='rgba(255,255,255,.7)';for(let yy=-150,r=0;yy<90;yy+=46,r++)for(let xx=-360+(r%2)*23;xx<380;xx+=46){ctx.beginPath();ctx.arc(xx,yy,5,0,TAU);ctx.fill()}ctx.fillStyle='#EFC796';ctx.fillRect(-390,106,780,80);ctx.fillStyle='#DDAA72';ctx.fillRect(-390,106,780,8);ctx.fillStyle='#fff';ctx.strokeStyle=INKC;ctx.lineWidth=4;ctx.beginPath();rr(250,-130,110,84,10);ctx.fill();ctx.stroke();ctx.fillStyle=C.leafLt;ctx.fillRect(258,-122,94,68);heart(305,-88,16,'#FF8FA3');ctx.beginPath();ctx.moveTo(300,110);ctx.lineTo(310,70);ctx.lineTo(350,70);ctx.lineTo(360,110);ctx.closePath();outl('#E9A07A',4);ctx.beginPath();ctx.ellipse(330,56,34,16,.3,0,TAU);outl(C.leaf,4);ctx.beginPath();ctx.ellipse(304,48,20,10,-.5,0,TAU);outl('#7CC46A',4);
  friend(0,162,1.18,Object.assign({},o,{mouth:act?'open':'smile',bob:act?-pulse(t)*10:0,armA:act?Math.sin(t*8):0}));if(act){tomatoDraw(120,40,30,o.fruit,{rot:.5});carton(-250,130,.35)}
  if(act&&i===0){ctx.save();ctx.translate(-250,-70);tomatoDraw(0,0,46,C.tomato,{rot:-.3});sparkle(40,-46,18,'#fff');sparkle(-44,-36,12,'#ffd84a');ctx.restore()}if(act&&i===1){ctx.save();ctx.translate(-250,-70);ctx.beginPath();for(let k=0;k<12;k++){const a=k/12*TAU,r=k%2?44:76;ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r)}ctx.closePath();outl('#ffd84a',5);ctx.restore()}
  if(act&&i===2){ctx.strokeStyle='#ff9ab4';ctx.lineWidth=8;ctx.lineCap='round';ctx.beginPath();for(let q=0;q<=20;q++){const yy=40-q*10,xx=-260+Math.sin(q*.6+t*3)*40;q?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy)}ctx.stroke();heart(-206,-96,22,'#E04F7A');sparkle(-310,-70,14,'#ffd84a')}
  if(act&&i===3){ctx.beginPath();ctx.arc(-250,-70,54,0,TAU);outl(C.orange,5);text('C',-250,-72,{size:60,col:'#fff',stroke:INKC,sw:8});heart(-190,-18,18,'#ff6f86')}
  ctx.restore();ctx.restore()})}
S(79.58,82.5,(t,u,p)=>fcWindows(t,u,1),{zoom:.0});
S(82.5,84.3,(t,u,p)=>fcWindows(t,u,2),{zoom:.0,iris:false});
S(84.3,86.28,(t,u,p)=>fcWindows(t,u,3),{zoom:.0,iris:false});
S(86.28,88.36,(t,u,p)=>{stageBG(t,'#fff0a8','#ffd1b8');spot(960,500,800,.4);confetti(t,60,21);logo(960,210,.95,prog(u,0,.4),t,{title:false});clover(960,440,50,Math.sin(t*2)*.2);
 mdance('red',420,GY+30,1.05,t,{expr:'sing'});mdance('orange',1500,GY+30,1.05,t,{expr:'sing',flip:-1,ph:2});dancer('girl',700,GY+20,.57,t,{ph:1});dancer('dad',1220,GY+20,.57,t,{ph:2});stamp(1660,180,80,prog(u,.5,1))});
S(88.36,90.54,(t,u,p)=>{skyGrad('#BDE7FF','#F1F9DA');ground('#bfe6a0','#9fd58a',720);ctx.fillStyle='#ff9d85';ctx.beginPath();ctx.ellipse(960,850,860,120,0,0,TAU);ctx.fill();ctx.strokeStyle=INKC;ctx.lineWidth=6;ctx.stroke();
 const fr=[[300,{hair:'#3b2b24',shirt:'#7bb6ff',kind:0}],[560,{hair:'#8a5a3a',shirt:'#8fd3b0',kind:1}],[1360,{hair:'#c9a46a',shirt:'#ffb36b',kind:2}],[1620,{hair:'#2f2a30',shirt:'#d6a3ff',kind:3}]];fr.forEach(([x,o],i)=>friend(x,GY+20,.95,Object.assign({mouth:'open',bob:-pulse(t)*12,armA:Math.sin(t*7+i)},o)));
 dancer('mom',800,GY+20,.6,t,{aL:30,aR:30,hand:'relaxed'});dancer('girl',960,GY+20,.6,t,{aL:30,aR:30,hand:'relaxed',ph:2});dancer('dad',1120,GY+20,.6,t,{aL:30,aR:30,hand:'relaxed',ph:3});carton(960,700,.6);
 for(let i=0;i<6;i++){const q=((u*.6+i/6)%1);heart(300+i*260,600-q*380,18+q*10,'#ff6f86')}});
S(90.54,93.36,(t,u,p)=>{stageBG(t,'#ffb8d4','#fff0a8');spot(960,520,900,.45);const W3=[['香香',520,320,'#ff8a3d'],['QQ',960,520,'#5aab55'],['甜甜',1400,320,'#ff6f86']];
 flavorIcons(t,u,175,[440,960,1480]);dancer('dad',540,GY+20,.6,t,{ph:0,expr:'happy',aL:30,aR:30,hand:'relaxed'});dancer('mom',800,GY+20,.6,t,{ph:1,expr:'laugh',aL:30,aR:30,hand:'relaxed'});dancer('girl',1120,GY+20,.6,t,{ph:2,expr:'happy',aL:30,aR:30,hand:'relaxed'});mdance('red',340,GY+40,.9,t,{expr:'sing'});mdance('orange',1580,GY+40,.9,t,{expr:'sing',flip:-1,ph:1});confetti(t,60,7);for(let i=0;i<8;i++)sparkle(200+i*220+Math.sin(t*3+i)*20,180+(i%3)*300,16+hash(i)*10,['#ffd84a','#fff','#ff9ab4'][i%3])});
S(93.36,95.08,(t,u,p)=>{skyGrad('#ffd9a8','#ffeed0');sunDraw(1620,230,130,t);ground('#cfe8a0','#a8d57a',790);dancer('dad',400,GY+20,.7,t,{ph:0,hand:'relaxed',aL:40,aR:40,handR:'wave',aR:120+20*Math.sin(t*9)});dancer('mom',660,GY+20,.7,t,{ph:1,hand:'relaxed',aL:40,aR:40});dancer('girl',960,GY+20,.7,t,{ph:2,hand:'relaxed',aL:40,aR:100,handR:'thumbsup'});mdance('red',1240,GY+30,.8,t,{expr:'happy'});mdance('orange',1420,GY+30,.8,t,{expr:'happy',flip:-1,ph:1});for(let i=0;i<5;i++){const q=((u*.6+i/5)%1);heart(560+i*200,600-q*400,18+q*10,'#ff6f86')}});

// 8 outro
S(95.08,97.06,(t,u,p)=>{stageBG(t,'#fff0a8','#ffd1b8');spot(960,500,800,.4);clover(960,150,70,Math.sin(t*2)*.2);dancer('dad',640,GY+20,.62,t,{ph:0,hand:'relaxed',aL:30,aR:30,expr:'happy'});dancer('mom',930,GY+20,.62,t,{ph:1,hand:'relaxed',aL:30,aR:30,expr:'laugh'});dancer('girl',1220,GY+20,.62,t,{ph:2,hand:'relaxed',aL:30,aR:30,expr:'happy'});mdance('red',420,GY+30,1.0,t,{expr:'sing'});mdance('orange',1500,GY+30,1.0,t,{expr:'sing',flip:-1,ph:2});confetti(t,40,8)});
S(97.06,99.46,(t,u,p)=>{farm(t,{sx:1560,sy:240,rows:true});for(let i=0;i<14;i++){const q=((u*.4+i/14)%1);clover(120+(i*140+u*60)%1800,60+q*820,22+hash(i)*14,q*6)}
 const fly=(k,x,y,ph)=>{ctx.save();ctx.translate(x,y+Math.sin(t*5+ph)*18);for(const dx of[-1,1]){ctx.save();ctx.translate(dx*62,-10);ctx.rotate(dx*(.6+Math.sin(t*14+ph)*.35));ctx.beginPath();ctx.ellipse(dx*44,0,62,26,0,0,TAU);outl('#fff',4);ctx.restore()}mascotAt(k,{x:0,y:100,s:.9,expr:'happy'});ctx.restore()};
 fly('red',lerp(300,1100,easeOut(prog(u,0,2.2))),520,0);fly('orange',lerp(100,760,easeOut(prog(u,.3,2.4))),360,2);
 const hp=back(prog(u,.8,1.4));ctx.save();ctx.translate(1560,640);ctx.scale(hp,hp);ctx.beginPath();rr(-140,-40,280,220,12);outl('#ffe3b8',6);ctx.beginPath();ctx.moveTo(-170,-40);ctx.lineTo(0,-170);ctx.lineTo(170,-40);ctx.closePath();outl('#ff9d85',6);ctx.beginPath();rr(-30,70,60,110,8);outl('#a9703a',5);ctx.beginPath();rr(60,10,60,60,6);outl('#fff6c9',5);ctx.restore();});
S(99.46,102.02,(t,u,p)=>{stageBG(t,'#ffb8d4','#fff0a8');spot(960,520,900,.45);const W3=[['香香',560,360,'#ff8a3d'],['QQ',960,560,'#5aab55'],['甜甜',1360,360,'#ff6f86']];confetti(t,50,15);flavorIcons(t,u,175,[440,960,1480]);dancer('dad',540,GY+20,.6,t,{ph:0,expr:'happy',aL:30,aR:30,hand:'relaxed'});dancer('mom',800,GY+20,.6,t,{ph:1,expr:'laugh',aL:30,aR:30,hand:'relaxed'});dancer('girl',1120,GY+20,.6,t,{ph:2,expr:'happy',aL:30,aR:30,hand:'relaxed'});mdance('red',340,GY+40,.9,t,{expr:'sing'});mdance('orange',1580,GY+40,.9,t,{expr:'sing',flip:-1,ph:1});for(let i=0;i<10;i++)heart(160+i*180,200+hash(i)*600+Math.sin(t*2+i)*20,14+hash(i*3)*14,'#ff9ab4')});
S(102.02,104.7,(t,u,p)=>{skyGrad('#FFE3B8','#FFD3B5');sunDraw(1640,250,150,t,true);ground('#cfe8a0','#a8d57a',790);
 dancer('dad',380,GY+20,.8,t,{ph:0,hand:'relaxed',aL:100,handL:'thumbsup',aR:34,expr:'happy'});dancer('mom',700,GY+20,.8,t,{ph:1,hand:'relaxed',aL:30,aR:30,expr:'laugh'});dancer('girl',1020,GY+20,.8,t,{ph:2,hand:'relaxed',aL:34,aR:100,handR:'thumbsup',expr:'happy'});mdance('red',1330,GY+30,.9,t,{expr:'happy'});mdance('orange',1510,GY+30,.9,t,{expr:'happy',flip:-1,ph:1});for(let i=0;i<7;i++){const q=((u*.6+i/7)%1);heart(560+i*140,620-q*420,18+q*12,'#ff6f86')}});

// 9 credits
S(104.7,120.84,(t,u,p)=>{farm(t,{sky1:'#ff9a7a',sky2:'#ffe0a8',sx:960,sy:560+p*120,sr:130,mtn:['#E3B29B','#C9A08F','#9DAE8F'],rows:true});
 const dim=prog(u,14.6,16.1);
 dancer('dad',720,GY+20,.55,t,{ph:0});dancer('mom',910,GY+20,.55,t,{ph:1,expr:'happy'});dancer('girl',1100,GY+20,.55,t,{ph:2});mdance('red',1260,GY+30,.7,t,{expr:'happy'});mdance('orange',1410,GY+30,.7,t,{expr:'happy',flip:-1,ph:1});
 logo(960,160,.85,prog(u,.2,.9),t,{rib:'好運一直來'});
 const qp=back(prog(u,1.6,2.4));if(qp>0){const card=(cx,M,label,lc,l1)=>{ctx.save();ctx.translate(cx,640);ctx.scale(qp*.78,qp*.78);ctx.shadowColor='rgba(74,50,38,.25)';ctx.shadowBlur=16;ctx.beginPath();rr(-210,-300,420,560,26);outl('#fffdf4',5);ctx.shadowColor='transparent';text(label,0,-250,{size:36,col:lc,stroke:false,w:900,sp:1});const n=M.length,cell=290/n,ox=-145,oy=-195;ctx.fillStyle='#fff';ctx.fillRect(ox-12,oy-12,314,314);ctx.fillStyle='#1c1c1c';for(let r=0;r<n;r++)for(let c=0;c<n;c++)if(M[r][c])ctx.fillRect(ox+c*cell,oy+r*cell,cell+.6,cell+.6);text(l1,0,165,{size:30,stroke:false,w:700,col:INKT});ctx.restore()};
  card(290,QR,'LINE 官方帳號訂購','#06a24a','lin.ee/NIcBKDs');card(1630,QR2,'追蹤 Facebook 粉專','#1877f2','好運來蕃茄園');}
 const cr=0;if(cr>0){ctx.globalAlpha=cr*(1-dim);ctx.beginPath();rr(160,905,1600,130,26);ctx.fillStyle='rgba(255,250,236,.92)';ctx.fill();ctx.strokeStyle=INKC;ctx.lineWidth=4;ctx.stroke();ctx.globalAlpha=1;
  ctx.globalAlpha=cr*(1-dim);text('資料來源：好運來蕃茄園 Facebook 粉專／自由時報（美濃橙蜜香）／聯合新聞網・農糧署（玉女小番茄）',960,950,{size:26,stroke:false});text('歌曲：〈好運來小番茄〉　插畫與動畫：Claude',960,1000,{size:26,stroke:false,col:'#7a6a56'});ctx.globalAlpha=1}
 if(dim>0){ctx.fillStyle=`rgba(255,243,214,${dim})`;ctx.fillRect(0,0,W,H)}},{zoom:.0});
