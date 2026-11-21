// rig2.js — draws the traced reference characters as layered, animatable puppets (replaces person())
const RIG={
 girl:{W:1116,H:1410,fx:440,fy:1410,f:.60,neck:[440,590],piv:{L:[336,700],R:[544,700]},scarf:true,bodyShadow:230},
 dad: {W:1056,H:1490,fx:450,fy:1441,f:.575,neck:[455,585],piv:{L:[262,762],R:[638,762]},bodyShadow:200},
 mom: {W:1103,H:1426,fx:560,fy:1384,f:.61,neck:[560,565],piv:{L:[455,650],R:[665,650]},bodyShadow:210}
};
const RS={}; // rasterised layers
const RIGSCALE=.66; // pre-raster scale (keeps drawImage fast)
function svgToCanvas(url,w,h,sc){return new Promise(res=>{const im=new Image();im.onload=()=>{const c=document.createElement('canvas');c.width=Math.ceil(w*sc);c.height=Math.ceil(h*sc);c.getContext('2d').drawImage(im,0,0,c.width,c.height);res(c)};im.onerror=()=>res(null);im.src=url})}
async function loadRig(){
 const jobs=[];
 for(const k of Object.keys(RIG)){const R=RIG[k];RS[k]={};
  jobs.push(svgToCanvas(`rig/${k}_body.svg`,R.W,R.H,RIGSCALE).then(c=>RS[k].body=c));
  jobs.push(svgToCanvas(`rig/${k}_head.svg`,R.W,R.H,RIGSCALE).then(c=>RS[k].head=c));
  if(R.scarf)jobs.push(svgToCanvas(`rig/${k}_scarf.svg`,R.W,R.H,RIGSCALE).then(c=>RS[k].scarf=c));
  for(const e of ['smile','happy','laugh','shy','sad','wow'])jobs.push(svgToCanvas(`rig/${k}_face_${e}.svg`,R.W,R.H,RIGSCALE).then(c=>RS[k]['f_'+e]=c));
  for(const side of ['L','R'])for(const h of ['fist','open','thumb'])jobs.push(svgToCanvas(`rig/${k}_arm${side}_${h}.svg`,340,760,RIGSCALE).then(c=>RS[k][`a${side}_${h}`]=c));
 }
 await Promise.all(jobs)}
const HANDMAP={relaxed:'fist',hold:'fist',wave:'open',thumbsup:'thumb'};
function personRig(k,o){const {x,y,s=1,expr='smile',aL=[0,'relaxed'],aR=[0,'relaxed'],tilt=0,flip=1,bob=0,squash=0}=o;
 const R=RIG[k],L=RS[k];if(!L||!L.body)return;const sc=RIGSCALE,F=R.f*s*1.12;
 // contact shadow
 ctx.save();ctx.translate(x,y);ctx.fillStyle='rgba(74,50,38,.17)';ctx.beginPath();ctx.ellipse(0,8*s,Math.max(60,R.bodyShadow*F*.55+bob*1.1)*1,22*s,0,0,TAU);ctx.fill();ctx.restore();
 ctx.save();ctx.translate(x,y);ctx.scale(F*flip,F);ctx.translate(0,bob/F);
 ctx.scale(1-squash*.5,1+squash);ctx.translate(-R.fx,-R.fy);
 const D=(c,ox=0,oy=0)=>{if(c)ctx.drawImage(c,ox,oy,c.width/sc,c.height/sc)};
 D(L.body);
 for(const side of ['L','R']){const a=side==='L'?aL:aR,pv=R.piv[side],hand=HANDMAP[a[1]]||'fist',c=L[`a${side}_${hand}`];if(!c)continue;
  ctx.save();ctx.translate(pv[0],pv[1]);ctx.rotate((side==='L'?1:-1)*a[0]*Math.PI/180);ctx.drawImage(c,-170,-110,340,760);ctx.restore()}
 if(L.scarf)D(L.scarf);
 ctx.save();ctx.translate(R.neck[0],R.neck[1]);ctx.rotate(tilt);ctx.translate(-R.neck[0],-R.neck[1]);
 D(L.head);D(L['f_'+(L['f_'+expr]?expr:'smile')]);ctx.restore();
 ctx.restore()}
