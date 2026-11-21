const grain=document.createElement('canvas');grain.width=W;grain.height=H;
(function(){const g=grain.getContext('2d');let s=9;const r=()=>{s=(s*16807)%2147483647;return s/2147483647};
 for(let i=0;i<14000;i++){g.fillStyle=`rgba(110,80,40,${r()*.10})`;g.fillRect(r()*W,r()*H,1+r()*2,1+r()*2)}
 for(let i=0;i<500;i++){g.strokeStyle=`rgba(130,100,60,${r()*.07})`;g.lineWidth=1;g.beginPath();const x=r()*W,y=r()*H,a=r()*6.28,l=8+r()*28;g.moveTo(x,y);g.lineTo(x+Math.cos(a)*l,y+Math.sin(a)*l);g.stroke()}
 const v=g.createRadialGradient(W/2,H/2,H*.5,W/2,H/2,H*1.0);v.addColorStop(0,'rgba(120,70,20,0)');v.addColorStop(1,'rgba(120,70,20,.20)');g.fillStyle=v;g.fillRect(0,0,W,H)})();
function lyricsOverlay(t){let cur=null;for(const l of TIMING.lyrics){if(t>=l.s-.18&&t<=l.e+.3){cur=l;break}}if(!cur)return;
 const a=Math.min(prog(t,cur.s-.18,cur.s+.05),prog(t,cur.e+.3,cur.e+.08));const p=cl((t-cur.s)/(cur.e-cur.s-.15));
 ctx.save();ctx.globalAlpha=ease(a)*.9;const sg=ctx.createLinearGradient(0,820,0,H);sg.addColorStop(0,'rgba(255,246,224,0)');sg.addColorStop(.55,'rgba(255,246,224,.62)');sg.addColorStop(1,'rgba(255,246,224,.9)');ctx.fillStyle=sg;ctx.fillRect(0,820,W,H-820);ctx.restore();
 ctx.save();ctx.globalAlpha=ease(a);ctx.translate(0,(1-ease(a))*16);
 const sz=Math.min(90,1500/cur.t.length);ctx.font=`${sz}px ${FONT}`;const w=ctx.measureText(cur.t).width,x0=960-w/2,pw=w+210,ph=126,px=960-pw/2,py=915;
 ctx.shadowColor='rgba(74,50,38,.28)';ctx.shadowBlur=22;ctx.shadowOffsetY=10;ctx.beginPath();rr(px,py,pw,ph,ph/2);ctx.fillStyle='#FFF9EA';ctx.fill();ctx.shadowColor='transparent';ctx.lineWidth=5;ctx.strokeStyle=INKC;ctx.stroke();
 ctx.save();ctx.translate(px+66,py+ph/2+2);ctx.scale(.62,.62);tomatoDraw(0,0,40,C.tomato,{rot:-.3});ctx.restore();ctx.save();ctx.translate(px+pw-66,py+ph/2+2);ctx.scale(.62,.62);tomatoDraw(0,0,40,C.orange,{rot:.3});ctx.restore();
 ctx.textAlign='left';ctx.textBaseline='middle';ctx.lineJoin='round';const ty=py+ph/2+3;ctx.font=`${sz}px ${FONT}`;
 ctx.fillStyle=INKC;ctx.strokeStyle=INKC;ctx.lineWidth=sz*.03;ctx.fillText(cur.t,x0,ty);ctx.strokeText(cur.t,x0,ty);
 ctx.save();ctx.beginPath();ctx.rect(x0-10,py,(w+20)*p,ph);ctx.clip();ctx.fillStyle=C.tomato;ctx.strokeStyle=C.tomato;ctx.fillText(cur.t,x0,ty);ctx.strokeText(cur.t,x0,ty);ctx.restore();
 ctx.restore()}
function render(t){ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.fillStyle='#fff3d6';ctx.fillRect(0,0,W,H);
 let sc=SCENES[SCENES.length-1];for(const s of SCENES){if(t>=s.a&&t<s.b){sc=s;break}}
 const u=t-sc.a,p=cl(u/(sc.b-sc.a));ctx.save();
 const iris=sc.iris!==false&&sc.a>0&&u<.4;
 if(iris){const R=easeOut(u/.4)*1250;ctx.beginPath();ctx.arc(W/2,H/2,R,0,TAU);ctx.clip()}
 const z=1+(sc.zoom??.03)*p;ctx.translate(W/2,H/2);ctx.scale(z,z);ctx.translate(-W/2,-H/2);
 sc.f(t,u,p);ctx.restore();
 if(iris){const R=easeOut(u/.4)*1250;ctx.strokeStyle='#FFF6E0';ctx.lineWidth=16;ctx.beginPath();ctx.arc(W/2,H/2,R,0,TAU);ctx.stroke()}
 ctx.globalAlpha=.55;ctx.drawImage(grain,0,0);ctx.globalAlpha=1;
 lyricsOverlay(t);
 if(t<.35){ctx.fillStyle=`rgba(255,243,214,${1-t/.35})`;ctx.fillRect(0,0,W,H)}
 if(t>119.8){ctx.fillStyle=`rgba(255,243,214,${cl((t-119.8)/1.0)})`;ctx.fillRect(0,0,W,H)}}
(async()=>{BEATS=TIMING.beats;await loadSprites();window.render=render;window.READY=true})();
