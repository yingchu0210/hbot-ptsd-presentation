s=open('index_pencil_backup.html').read()
def cut(s,a,b,new):
    i=s.index(a); j=s.index(b,i+1); return s[:i]+new+s[j:]
def rep(a,b):
    global s
    assert a in s,a
    s=s.replace(a,b)
s=s.replace('<script src="audio.js">','<script src="audio_puppet.js">').replace('<title>好運來小番茄</title>','<title>好運來小番茄・剪紙皮影戲</title>')
rep("const INK='#38332d'","const GLOW='#ffd98a',INK='#3a120a'")
s=cut(s,"/* ---------- paper ---------- */","/* ---------- pencil primitives ---------- */","""/* ---------- backlit cloth screen ---------- */
const cloth=document.createElement('canvas');cloth.width=W;cloth.height=H;
(function(){const p=cloth.getContext('2d');
 const g=p.createRadialGradient(W/2,H*.42,40,W/2,H*.5,H*1.1);g.addColorStop(0,'#fff0b8');g.addColorStop(.35,'#ffc968');g.addColorStop(.75,'#e2872e');g.addColorStop(1,'#9c4a14');p.fillStyle=g;p.fillRect(0,0,W,H);
 p.strokeStyle='rgba(120,60,10,.07)';p.lineWidth=1;for(let x=0;x<W;x+=4){p.beginPath();p.moveTo(x,0);p.lineTo(x,H);p.stroke()}for(let y=0;y<H;y+=4){p.beginPath();p.moveTo(0,y);p.lineTo(W,y);p.stroke()}
 let s=5;const r=()=>{s=(s*16807)%2147483647;return s/2147483647};
 for(let i=0;i<7000;i++){p.fillStyle=`rgba(110,50,10,${r()*.12})`;p.fillRect(r()*W,r()*H,1+r()*2,1+r()*2)}
 for(let i=0;i<260;i++){p.fillStyle=`rgba(255,235,170,${r()*.05})`;p.beginPath();p.ellipse(r()*W,r()*H,30+r()*120,20+r()*80,r()*3,0,7);p.fill()}})();

""")
s=cut(s,"function stroke(pts,o={})","function ell(","""const SH='rgba(70,22,6,.30)';
function stroke(pts,o={}){const w=o.w||4,c=o.c||INK;ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle=c;ctx.lineWidth=w;ctx.globalAlpha=o.al??1;smooth(jp(pts,.4),!!o.close);ctx.stroke();ctx.globalAlpha=1}
function fillS(pts,col,o={}){const q=jp(pts,.4);ctx.lineJoin='round';
 if(o.line!==false&&(o.w||4)>=3.5){ctx.save();ctx.translate(6,8);ctx.fillStyle=SH;smooth(q,true);ctx.fill();ctx.restore()}
 ctx.globalAlpha=o.alpha??.96;ctx.fillStyle=col;smooth(q,true);ctx.fill();ctx.globalAlpha=1;
 if(o.line!==false){ctx.strokeStyle=o.c||INK;ctx.lineWidth=o.w||4;smooth(q,true);ctx.stroke()}}
function hole(x,y,r){ctx.fillStyle=GLOW;ctx.strokeStyle=INK;ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();ctx.stroke()}
function ornament(x,y,r=8){hole(x,y,r);for(let k=0;k<6;k++){const a=k*Math.PI/3;hole(x+Math.cos(a)*r*2.2,y+Math.sin(a)*r*2.2,r*.6)}}
function holeRow(x,y,n,dx,r=6){for(let i=0;i<n;i++)hole(x+i*dx,y,r)}
""")
s=cut(s,"function txt(","function spark(","""function txt(s,x,y,o={}){const size=o.size||60;ctx.save();ctx.translate(x+J(.8),y+J(.8));ctx.rotate((o.rot||0)+J(.003));
 ctx.font=`bold ${size}px ${FONT}`;ctx.textAlign=o.align||'center';ctx.textBaseline='middle';ctx.globalAlpha=o.alpha??1;ctx.lineJoin='round';
 if(o.cut){ctx.strokeStyle='rgba(60,18,6,.35)';ctx.lineWidth=size*.12;ctx.strokeText(s,size*.05,size*.06);ctx.strokeStyle=o.col||INK;ctx.lineWidth=size*.12;ctx.strokeText(s,0,0);ctx.fillStyle='#fff1c9';ctx.fillText(s,0,0)}
 else{ctx.fillStyle=o.col||INK;ctx.fillText(s,0,0);ctx.strokeStyle=o.col||INK;ctx.lineWidth=size*0.03;ctx.strokeText(s,0,0)}ctx.restore()}
function limb(pts,w,col){const q=jp(pts,.3);ctx.lineCap='round';ctx.lineJoin='round';
 ctx.save();ctx.translate(6,8);ctx.strokeStyle=SH;ctx.lineWidth=w+7;smooth(q,false);ctx.stroke();ctx.restore();
 ctx.strokeStyle=INK;ctx.lineWidth=w+7;smooth(q,false);ctx.stroke();ctx.strokeStyle=col;ctx.lineWidth=w;smooth(q,false);ctx.stroke()}
""")
s=cut(s,"function grassLine(y)","/* ---------- tomato ---------- */","""function grassLine(y){
 ctx.globalAlpha=.5;ctx.fillStyle='#a8481a';ctx.beginPath();ctx.moveTo(0,y);for(let x=0;x<=W;x+=40)ctx.lineTo(x,y-60-Math.sin(x*.004)*45-Math.sin(x*.011)*18);ctx.lineTo(W,y);ctx.fill();ctx.globalAlpha=1;
 ctx.fillStyle='#3b1a0c';ctx.beginPath();ctx.moveTo(0,H);ctx.lineTo(0,y+6);
 for(let x=0;x<=W;x+=36){const h=(Math.round(x/36))%2?26:8+hash(x)*10;ctx.lineTo(x,y+6-h);ctx.lineTo(x+18,y+6)}
 ctx.lineTo(W,y+6);ctx.lineTo(W,H);ctx.fill();
 for(let x=40;x<W;x+=150)hole(x,y+60,5)}
""")
rep("#f6d3b0","#f3b98c")
rep("c:'#8fbf6a',a:3,al:.8","c:'#2f6b3a',a:.5")
rep("'#9bcc78',{w:2.5,a:1.5,alpha:.7}","'#3f8a4a',{w:2.5,a:1.5,alpha:.95}")
rep("col='#b8c0cc'","col='#56627c'");rep("'#a9b2bf'","'#4a5670'");rep("'#d5dae2'","'#8a96b0'")
rep("c:'#6a86a8',a:.8,al:.8","c:'#fff3cf',a:.3,al:.9");rep("{w:3,c:'#6a86a8',a:.5}","{w:3,c:'#fff3cf',a:.3}")
rep("c:'#4f8f48'","c:'#2f6b3a'")
rep("'#6aa55a'","'#2f6b3a'");rep("'#86bb68'","'#3f8a4a'");rep("'#7cc46a'","'#4fa152'")
rep("txt('好運來小番茄',960,210,{size:150,col:RED})","txt('好運來小番茄',960,210,{size:150,col:'#8e1b10',cut:true})")
rep("col:'#d9822b',alpha","col:'#8a3d0c',cut:true,alpha")
rep("txt('玉女',1340,810,{size:46,col:RED,alpha","txt('玉女',1340,810,{size:46,col:'#8e1b10',cut:true,alpha")
rep("{size:150,col:'#2f6fb0'}","{size:150,col:'#1f4f8a',cut:true}")
rep("{size:150,col:RED,alpha:cl(g*2)}","{size:150,col:'#8e1b10',cut:true,alpha:cl(g*2)}")
rep("{size:48,col:'#6a5a46',alpha:ease(prog(u,2.2,2.8))}","{size:48,col:'#5a2410',cut:true,alpha:ease(prog(u,2.2,2.8))}")
rep("{size:90,col:RED,rot:-.15}","{size:90,col:'#8e1b10',cut:true,rot:-.15}")
rep("stroke(ell(0,0,r,r,26),{w:8,c:RED","fillS(ell(0,0,r,r,26),'#fff1c9',{line:false,alpha:.95});stroke(ell(0,0,r,r,26),{w:8,c:RED")
rep("'#fff8e6',{w:4,a:1.4,alpha:.95,c:'#6b5a45'}","'#fff8e6',{w:5,alpha:.97,c:'#8e1b10'}")
rep("size:22,col:'#6a5a46'})","size:22,col:t<4?'#5a2410':'#ffe9b0'})") if "size:22,col:'#6a5a46'})" in s else rep("size:20,col:'#6a5a46'})","size:20,col:t<4?'#5a2410':'#ffe9b0'})")
rep("ctx.save();ctx.translate(o.x,o.y);ctx.scale(s*fl,s);","""ctx.save();ctx.translate(o.x,o.y);ctx.scale(s*fl,s);ctx.rotate(Math.sin(t*2.6+(o.ph||0))*.014);
 {const h0=o.hl||[-104,-185],h1=o.hr||[104,-185];ctx.strokeStyle='#5a2f12';ctx.lineCap='round';ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(0,-310);ctx.lineTo(0,1300);ctx.stroke();
 ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(h0[0],h0[1]);ctx.lineTo(h0[0]-50,1300);ctx.moveTo(h1[0],h1[1]);ctx.lineTo(h1[0]+50,1300);ctx.stroke()}""")
rep("if(kind==='mom'){fillS(ell(-8,-250,18,12,8,-.5),'#2a8a7c',{w:2.5,a:1,alpha:.7});fillS(ell(18,-250,18,12,8,.5),'#2a8a7c',{w:2.5,a:1,alpha:.7})}","")
rep("if(kind==='dad'){stroke([[-26,shY],[0,shY+22],[26,shY]],{w:3.5,a:1})}","if(kind==='dad'){stroke([[-26,shY],[0,shY+22],[26,shY]],{w:3.5})}ornament(0,-262,7);holeRow(-60,-200,5,30,5);")
rep("fillS(ell(hL[0],hL[1],19,19,8),hand,{w:3,a:1});fillS(ell(hR[0],hR[1],19,19,8),hand,{w:3,a:1});","fillS(ell(hL[0],hL[1],19,19,8),hand,{w:3});fillS(ell(hR[0],hR[1],19,19,8),hand,{w:3});hole(sL[0],sL[1],6);hole(sR[0],sR[1],6);{const e1=elb(sL,hL,-1),e2=elb(sR,hR,1);hole(e1[0],e1[1],5);hole(e2[0],e2[1],5)}")
s=cut(s,"/* ---------- render ---------- */","window.render=render;","""/* ---------- render ---------- */
const BOUND=[4,9,14,19,25];
function valance(){ctx.fillStyle='#9e1b12';ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(W,0);ctx.lineTo(W,54);for(let x=W;x>0;x-=96)ctx.quadraticCurveTo(x-48,118,x-96,54);ctx.closePath();ctx.fill();
 ctx.strokeStyle='#f2b705';ctx.lineWidth=5;ctx.stroke();
 for(let x=48;x<W;x+=96){ctx.fillStyle='#f2b705';ctx.beginPath();ctx.arc(x,72,8,0,7);ctx.fill();ctx.strokeStyle=INK;ctx.lineWidth=2;ctx.stroke();ctx.fillStyle=GLOW;ctx.beginPath();ctx.arc(x,26,6,0,7);ctx.fill()}}
function render(t){
 const T=Math.floor(t*12+1e-6)/12;FR=Math.floor(T*8);SC=0;
 ctx.globalAlpha=1;ctx.drawImage(cloth,0,0);ctx.fillStyle=`rgba(255,190,80,${.06*hash(Math.floor(t*10))})`;ctx.fillRect(0,0,W,H);
 if(T<4)scene1(T);else if(T<9)scene2(T-4,T);else if(T<14)scene3(T-9,T);else if(T<19)scene4(T-14,T);else if(T<25)scene5(T-19,T);else scene6(T-25,T);
 valance();
 for(const b of BOUND){const d=Math.abs(t-b);if(d<.18){ctx.globalAlpha=1-d/.18;ctx.fillStyle='#240b05';ctx.fillRect(0,0,W,H);ctx.globalAlpha=1}}
 if(t<.3){ctx.globalAlpha=1-t/.3;ctx.fillStyle='#240b05';ctx.fillRect(0,0,W,H);ctx.globalAlpha=1}
 subtitles(t);footer(t);
}
""")
open('puppet.html','w').write(s)
print('ok')
