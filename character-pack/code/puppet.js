/* puppet.js — 免函式庫的角色拼裝（純 DOM）。
   用法：
     <script src="code/puppet.js"></script>
     const p = createPuppet(document.body, 'girl', {scale:0.4, base:'rig/'});
     p.set({expr:'happy', left:[0,'fist'], right:[105,'thumb'], tilt:3, flip:false});
   角度慣例：0＝手自然下垂，90＝水平外伸，150＝高舉；左臂 +角、右臂 −角。 */
const PUPPET_DEF={
 girl:{W:1116,H:1410,neck:[440,590],piv:{L:[336,700],R:[544,700]},scarf:true},
 dad :{W:1056,H:1490,neck:[455,585],piv:{L:[262,762],R:[638,762]},scarf:false},
 mom :{W:1103,H:1426,neck:[560,565],piv:{L:[455,650],R:[665,650]},scarf:false}
};
function createPuppet(parent,key,opt){
 opt=opt||{};const D=PUPPET_DEF[key],sc=opt.scale||.4,base=opt.base||'rig/';
 const wrap=document.createElement('div');wrap.style.cssText=`position:relative;width:${D.W*sc}px;height:${D.H*sc}px;display:inline-block`;
 const root=document.createElement('div');root.style.cssText=`position:absolute;left:0;top:0;width:${D.W}px;height:${D.H}px;transform:scale(${sc});transform-origin:0 0`;
 wrap.appendChild(root);parent.appendChild(wrap);
 const img=(src,css)=>{const i=document.createElement('img');i.src=base+src;i.draggable=false;i.style.cssText='position:absolute;'+css;root.appendChild(i);return i};
 const body=img(`${key}_body.svg`,'left:0;top:0');
 const arms={};for(const side of['L','R']){const a=img(`${key}_arm${side}_fist.svg`,`left:${D.piv[side][0]-170}px;top:${D.piv[side][1]-110}px;transform-origin:170px 110px`);arms[side]=a}
 const scarf=D.scarf?img(`${key}_scarf.svg`,'left:0;top:0'):null;
 const headBox=document.createElement('div');headBox.style.cssText=`position:absolute;left:0;top:0;width:${D.W}px;height:${D.H}px;transform-origin:${D.neck[0]}px ${D.neck[1]}px`;root.appendChild(headBox);
 const mk=(src)=>{const i=document.createElement('img');i.src=base+src;i.draggable=false;i.style.cssText='position:absolute;left:0;top:0';headBox.appendChild(i);return i};
 mk(`${key}_head.svg`);const face=mk(`${key}_face_smile.svg`);
 const api={el:wrap,
  set(s){
   if(s.expr)face.src=`${base}${key}_face_${s.expr}.svg`;
   for(const [side,v] of [['L',s.left],['R',s.right]]){if(!v)continue;const [ang,hand]=v;
     if(hand)arms[side].src=`${base}${key}_arm${side}_${hand}.svg`;
     arms[side].style.transform=`rotate(${side==='L'?ang:-ang}deg)`}
   if(s.tilt!=null)headBox.style.transform=`rotate(${s.tilt}deg)`;
   if(s.flip!=null)wrap.style.transform=s.flip?'scaleX(-1)':'none';
   return api}};
 return api}
if(typeof module!=='undefined')module.exports={createPuppet,PUPPET_DEF};
