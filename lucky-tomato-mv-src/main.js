const grain=document.createElement('canvas');grain.width=W;grain.height=H;
(function(){const g=grain.getContext('2d');let s=9;const r=()=>{s=(s*16807)%2147483647;return s/2147483647};
 for(let i=0;i<14000;i++){g.fillStyle=`rgba(110,80,40,${r()*.10})`;g.fillRect(r()*W,r()*H,1+r()*2,1+r()*2)}
 for(let i=0;i<500;i++){g.strokeStyle=`rgba(130,100,60,${r()*.07})`;g.lineWidth=1;g.beginPath();const x=r()*W,y=r()*H,a=r()*6.28,l=8+r()*28;g.moveTo(x,y);g.lineTo(x+Math.cos(a)*l,y+Math.sin(a)*l);g.stroke()}
 const v=g.createRadialGradient(W/2,H/2,H*.5,W/2,H/2,H*1.0);v.addColorStop(0,'rgba(120,70,20,0)');v.addColorStop(1,'rgba(120,70,20,.20)');g.fillStyle=v;g.fillRect(0,0,W,H)})();
function lyricsOverlay(t){let cur=null;for(const l of TIMING.lyrics){if(t>=l.s-.18&&t<=l.e+.3){cur=l;break}}if(!cur)return;
 const a=Math.min(prog(t,cur.s-.18,cur.s+.05),prog(t,cur.e+.3,cur.e+.08));const p=cl((t-cur.s)/(cur.e-cur.s-.15));
 ctx.save();ctx.globalAlpha=ease(a);ctx.translate(0,(1-ease(a))*16);
 ctx.beginPath();rr(150,900,1620,146,40);ctx.fillStyle='rgba(255,250,236,.9)';ctx.fill();ctx.lineWidth=5;ctx.strokeStyle=INKC;ctx.stroke();
 const sz=Math.min(92,1480/cur.t.length);ctx.font=`bold ${sz}px ${FONT}`;const w=ctx.measureText(cur.t).width,x0=960-w/2;
 ctx.textAlign='left';ctx.textBaseline='middle';ctx.lineJoin='round';
 ctx.strokeStyle='#fff';ctx.lineWidth=sz*.16;ctx.strokeText(cur.t,x0,975);ctx.fillStyle=INKC;ctx.fillText(cur.t,x0,975);
 ctx.save();ctx.beginPath();ctx.rect(x0-10,900,(w+20)*p,150);ctx.clip();ctx.strokeStyle='#fff';ctx.lineWidth=sz*.16;ctx.strokeText(cur.t,x0,975);ctx.fillStyle='#e8513d';ctx.fillText(cur.t,x0,975);ctx.restore();
 ctx.font=`bold 36px ${FONT}`;ctx.fillStyle='#f6a43a';ctx.fillText('♪',190,975);ctx.fillText('♪',1720,975);
 ctx.restore()}
function render(t){ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.fillStyle='#fff3d6';ctx.fillRect(0,0,W,H);
 let sc=SCENES[SCENES.length-1];for(const s of SCENES){if(t>=s.a&&t<s.b){sc=s;break}}
 const u=t-sc.a,p=cl(u/(sc.b-sc.a));ctx.save();
 const iris=sc.iris!==false&&sc.a>0&&u<.4;
 if(iris){const R=easeOut(u/.4)*1250;ctx.beginPath();ctx.arc(W/2,H/2,R,0,TAU);ctx.clip()}
 const z=1+(sc.zoom??.03)*p;ctx.translate(W/2,H/2);ctx.scale(z,z);ctx.translate(-W/2,-H/2);
 sc.f(t,u,p);ctx.restore();
 if(iris){const R=easeOut(u/.4)*1250;ctx.strokeStyle='#fffdf4';ctx.lineWidth=14;ctx.beginPath();ctx.arc(W/2,H/2,R,0,TAU);ctx.stroke()}
 ctx.globalAlpha=.55;ctx.drawImage(grain,0,0);ctx.globalAlpha=1;
 lyricsOverlay(t);
 if(t<.35){ctx.fillStyle=`rgba(255,243,214,${1-t/.35})`;ctx.fillRect(0,0,W,H)}
 if(t>119.8){ctx.fillStyle=`rgba(255,243,214,${cl((t-119.8)/1.0)})`;ctx.fillRect(0,0,W,H)}}
(async()=>{BEATS=TIMING.beats;await loadSprites();window.render=render;window.READY=true})();
