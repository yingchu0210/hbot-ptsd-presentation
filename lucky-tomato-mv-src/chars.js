// Detailed character library (SVG strings). Local coordinate systems documented per function.
const INK='#4a3226';
let UID=0;
const f=n=>Math.round(n*10)/10;
// layered shape: ink outline layer first (union outline), then fills, then shading
function blob(d,fill,o={}){const id='c'+(UID++),ow=o.ow||9;
 const sh=(o.sh||[]).map(s=>`<path d="${s.d}" fill="${s.c}" opacity="${s.o??.2}"/>`).join('');
 const hl=(o.hl||[]).map(s=>`<path d="${s.d}" fill="${s.c||'#fff'}" opacity="${s.o??.3}"/>`).join('');
 const detail=(o.line||[]).map(l=>`<path d="${l}" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" opacity=".75"/>`).join('');
 return {ink:`<path d="${d}" fill="${INK}" stroke="${INK}" stroke-width="${ow}" stroke-linejoin="round"/>`,
  fill:`<clipPath id="${id}"><path d="${d}"/></clipPath><path d="${d}" fill="${fill}"/><g clip-path="url(#${id})">${sh}${hl}</g>${detail}`}}
function cap(x1,y1,x2,y2,w,fill,ow=9){return {ink:`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${INK}" stroke-width="${w+ow}" stroke-linecap="round"/>`,fill:`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${fill}" stroke-width="${w}" stroke-linecap="round"/>`}}
const stack=items=>items.map(i=>i.ink).join('')+items.map(i=>i.fill).join('');
const ln=(d,w=3,c=INK,o=1)=>`<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" opacity="${o}"/>`;
const mirror=(s,cx=250)=>`<g transform="translate(${cx*2},0) scale(-1,1)">${s}</g>`;

const SKIN={dad:'#e3b088',mom:'#f0c29d',girl:'#f5cfae'};
const SKSH={dad:'#c28a60',mom:'#d79e78',girl:'#e3ac88'};

/* ---------- HANDS (origin at wrist, fingers point up (−y)) ---------- */
function hand(type,skin,glove){const col=glove||skin,items=[];
 if(type==='relaxed'){items.push(blob('M -17,-2 C -16,-10 16,-10 17,-2 C 22,24 20,40 14,56 C 4,66 -8,62 -16,52 C -22,36 -20,16 -17,-2 Z',col,{sh:[{d:'M 6,0 C 14,30 14,56 0,66 L 22,60 L 24,0 Z',c:SKSH.dad,o:.18}]}));
  items.push(blob('M -14,18 C -34,26 -34,46 -22,56 C -14,50 -12,40 -14,30 Z',col));
  return stack(items)+ln('M -4,40 L -4,58',2)+ln('M 6,38 L 6,60',2)}
 if(type==='wave'||type==='open'){
  items.push(cap(-18,-8,-30,-50,12,col,8),cap(-6,-12,-9,-60,12,col,8),cap(7,-12,10,-58,12,col,8),cap(19,-6,29,-46,11.5,col,8),cap(22,14,46,-6,13,col,8));
  items.push(blob('M -24,-4 C -28,20 -18,38 0,40 C 18,38 28,20 24,-4 C 12,-14 -12,-14 -24,-4 Z',col,{sh:[{d:'M 4,-4 C 24,10 24,34 0,42 L 30,30 L 30,-6 Z',c:SKSH.dad,o:.15}]}));
  return stack(items)}
 if(type==='thumbsup'){
  items.push(blob('M -24,-10 C -30,14 -26,40 -8,46 C 10,50 28,40 28,18 C 28,-4 22,-12 8,-14 C -6,-16 -20,-16 -24,-10 Z',col));
  items.push(cap(-20,-2,14,-2,12,col,7),cap(-20,12,14,12,12,col,7),cap(-18,26,12,26,11,col,7),cap(10,-6,12,-44,20,col,8));
  return stack(items)+ln('M -24,5 L 8,5',2.2)+ln('M -24,19 L 8,19',2.2)}
  if(type==='hold'){ // curled hand holding something (back view of fingers)
  items.push(blob('M -24,-8 C -30,14 -22,36 0,40 C 22,36 30,14 24,-8 C 12,-16 -12,-16 -24,-8 Z',col));
  items.push(cap(-16,-10,-14,-28,12,col,8),cap(-4,-12,-3,-32,12,col,8),cap(8,-12,10,-30,12,col,8),cap(19,-8,22,-24,11,col,8),cap(-22,12,-38,2,12,col,8));
  return stack(items)}
 return ''}

/* ---------- HEADS (origin at face centre; face ≈ 190w × 220h) ---------- */
function eyes(kind,expr){let s='';
 for(const sd of[-1,1]){const x=sd*38,y=-4;
  const lash=kind==='girl';
  if(expr==='happy'||expr==='laugh'){s+=ln(`M ${x-14},${y+5} Q ${x},${y-17} ${x+14},${y+5}`,4.5)+(lash?ln(`M ${x+sd*13},${y+1} l ${sd*7},-6`,3):'')}
  else if(expr==='wow'){s+=`<ellipse cx="${x}" cy="${y}" rx="14" ry="17" fill="#fff" stroke="${INK}" stroke-width="3"/><ellipse cx="${x}" cy="${y+1}" rx="8" ry="10" fill="#2e211b"/><circle cx="${x+3}" cy="${y-3}" r="3.4" fill="#fff"/>`}
  else if(expr==='sad'){s+=`<ellipse cx="${x}" cy="${y+3}" rx="10" ry="12" fill="#2e211b"/><circle cx="${x+3}" cy="${y-1}" r="3.3" fill="#fff"/><circle cx="${x-3}" cy="${y+8}" r="1.8" fill="#fff" opacity=".8"/>`+ln(`M ${x-14},${y-5} Q ${x},${y-17} ${x+14},${y-4}`,3.4)}
  else {const ry=kind==='girl'?12.5:12;s+=`<ellipse cx="${x}" cy="${y}" rx="${kind==='girl'?9.5:10}" ry="${ry}" fill="#2e211b"/><circle cx="${x+3.5}" cy="${y-4}" r="3.8" fill="#fff"/><circle cx="${x-3}" cy="${y+5}" r="1.6" fill="#fff" opacity=".8"/>`+ln(`M ${x-15},${y-7} Q ${x},${y-ry-9} ${x+15},${y-7}`,3.8)+(lash?ln(`M ${x+sd*14},${y-6} l ${sd*8},-6`,3.2)+ln(`M ${x+sd*12},${y-1} l ${sd*8},-1`,2.8):'')}
 }
 return s}
function brows(kind,expr){const c=kind==='dad'?'#8a8580':'#5b4030',w=kind==='dad'?7:(kind==='mom'?4.2:4);let s='';
 for(const sd of[-1,1]){const x=sd*38;let d;
  if(expr==='sad')d=`M ${x+sd*16},-32 Q ${x},-40 ${x-sd*15},-50`;
  else if(expr==='wow')d=`M ${x-16},-52 Q ${x},-62 ${x+16},-52`;
  else if(expr==='happy'||expr==='laugh')d=`M ${x-16},-38 Q ${x},-50 ${x+16},-40`;
  else d=`M ${x-16},-38 Q ${x},-47 ${x+16},-39`;
  s+=ln(d,w,c)}
 return s}
function mouth(kind,expr){const lip=kind==='girl'?'#e0707a':'#b4574f';
 if(expr==='laugh'){return `<path d="M -36,46 Q 0,54 36,46 Q 34,102 0,104 Q -34,102 -36,46 Z" fill="#74292b" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/><path d="M -32,48 Q 0,56 32,48 L 30,62 Q 0,70 -30,62 Z" fill="#fff"/><ellipse cx="0" cy="92" rx="17" ry="9" fill="#e9808a"/>`}
 if(expr==='smile'||expr==='happy')return ln('M -30,54 Q 0,86 30,54',4.4)+ln('M -33,52 l -4,-4',3)+ln('M 33,52 l 4,-4',3)+(kind==='girl'?`<path d="M -26,57 Q 0,80 26,57 Q 0,66 -26,57 Z" fill="#fff" opacity=".9"/>`+ln('M -30,54 Q 0,86 30,54',4.4):'');
 if(expr==='shy')return ln('M -18,60 Q 0,74 18,60',4)+ln('M 21,58 l 3,-4',2.6);
 if(expr==='sad')return ln('M -22,78 Q 0,58 22,78',4.2);
 if(expr==='wow')return `<ellipse cx="0" cy="70" rx="13" ry="17" fill="#74292b" stroke="${INK}" stroke-width="3.4"/><ellipse cx="0" cy="78" rx="7" ry="6" fill="#e9808a"/>`;
 return ''}
function nose(kind){return ln('M -9,26 Q 0,38 10,27',3.4)+ln('M -5,36 Q 0,40 5,36',2.2,INK,.7)}
function blush(expr,kind){const o=(expr==='shy'?.75:expr==='laugh'||expr==='happy'?.6:.4);
 return `<ellipse cx="-62" cy="38" rx="20" ry="12" fill="#ee7f78" opacity="${o}"/><ellipse cx="62" cy="38" rx="20" ry="12" fill="#ee7f78" opacity="${o}"/>`}

function headDad(expr='smile'){
 const SK=SKIN.dad,SS=SKSH.dad,GR='#d9d7d2',GD='#a9a7a3';
 const face='M -90,-34 C -94,-100 -54,-132 0,-132 C 54,-132 94,-100 90,-34 C 92,38 62,104 0,118 C -62,104 -92,38 -90,-34 Z';
 const earL='M -88,-16 C -118,-28 -122,38 -88,46 Z';
 const hairL='M -88,-72 C -110,-66 -118,-24 -108,14 C -104,28 -96,34 -92,22 C -86,-6 -84,-40 -88,-72 Z';
 const items=[];
 items.push(blob(earL,SK,{sh:[{d:'M -100,4 C -108,20 -102,36 -90,40 L -90,10 Z',c:SS,o:.35}],line:['M -104,8 Q -110,22 -98,34']}),blob(mirrorPath(earL),SK,{line:['M 104,8 Q 110,22 98,34']}));
 items.push(blob(hairL,GR,{sh:[{d:'M -118,10 L -90,10 L -90,36 L -118,36 Z',c:GD,o:.35}],line:['M -108,-48 Q -100,-30 -98,-12','M -112,-18 Q -102,-8 -100,8']}),blob(mirrorPath(hairL),GR,{line:['M 108,-48 Q 100,-30 98,-12','M 112,-18 Q 102,-8 100,8']}));
 items.push(blob(face,SK,{sh:[{d:'M 62,-122 C 102,-90 100,24 74,76 C 62,100 44,112 0,120 L 104,120 L 104,-122 Z',c:SS,o:.26},{d:'M -92,50 C -70,100 -34,114 0,118 L -92,122 Z',c:SS,o:.14}],hl:[{d:'M -54,-122 C -20,-136 22,-136 42,-124 C 10,-128 -30,-118 -54,-92 Z',o:.5},{d:'M -22,-24 C -6,-18 8,-18 22,-24 C 12,-4 -8,-4 -22,-24 Z',c:'#ffd9b8',o:.3}]}));
 let s=stack(items);
 // sparse silver strands at upper-left of head
 s+=ln('M -74,-106 Q -52,-126 -22,-128',3,GR,.95)+ln('M -80,-92 Q -56,-118 -30,-124',2.6,GR,.8)+ln('M -66,-112 Q -46,-124 -18,-124',2.4,GR,.6);
 // forehead wrinkles
 s+=ln('M -52,-98 Q 0,-110 52,-98',2.6,INK,.5)+ln('M -44,-86 Q 0,-96 44,-86',2.2,INK,.42)+ln('M -34,-74 Q 0,-82 34,-74',2,INK,.34);
 // eyes
 const hap=(expr==='happy'||expr==='laugh');
 for(const sd of[-1,1]){const x=sd*40,y=-6;
  if(hap){s+=ln(`M ${x-15},${y+4} Q ${x},${y-14} ${x+15},${y+4}`,4.6)}
  else if(expr==='sad'||expr==='wow'){s+=''}
  else{s+=`<ellipse cx="${x}" cy="${y+1}" rx="8.2" ry="7" fill="#2e211b"/><circle cx="${x+3}" cy="${y-2}" r="2.8" fill="#fff"/>`+ln(`M ${x-16},${y-1} Q ${x},${y-12} ${x+16},${y+1}`,3.4)}
  s+=ln(`M ${x-14},${y+14} Q ${x},${y+22} ${x+14},${y+14}`,2.4,INK,.5);
  s+=ln(`M ${x+sd*18},${y-3} l ${sd*10},-6`,2.4,INK,.6)+ln(`M ${x+sd*19},${y+3} l ${sd*11},0`,2.4,INK,.6)+ln(`M ${x+sd*18},${y+9} l ${sd*9},6`,2.4,INK,.55);
  const bd=`M ${x-sd*18},-38 Q ${x+sd*2},-44 ${x+sd*20},-28`;
  s+=ln(bd,5.4,'#8f8c88',.95)}
 if(expr==='sad'||expr==='wow')s+=eyes('dad',expr);
 // nose (wide, rounded)
 s+=ln('M -8,18 Q -6,34 -20,40 Q -10,50 0,46 Q 10,50 20,40 Q 6,34 8,18',3.2)+ln('M -15,44 Q -10,48 -6,46',2,INK,.6)+ln('M 15,44 Q 10,48 6,46',2,INK,.6);
 // nasolabial folds & cheek lines
 s+=ln('M -30,44 Q -52,70 -42,98',3,INK,.62)+ln('M 30,44 Q 52,70 42,98',3,INK,.62)+ln('M -56,22 Q -66,36 -62,50',2.2,INK,.4)+ln('M 56,22 Q 66,36 62,50',2.2,INK,.4);
 s+=`<ellipse cx="-62" cy="44" rx="16" ry="9" fill="#e0846c" opacity="${expr==='shy'?.5:.3}"/><ellipse cx="62" cy="44" rx="16" ry="9" fill="#e0846c" opacity="${expr==='shy'?.5:.3}"/>`;
 // mouth
 if(expr==='smile'||expr==='happy')s+=ln('M -28,70 Q 0,88 28,70',4.2)+ln('M -31,68 l -4,-5',3)+ln('M 31,68 l 4,-5',3)+ln('M -14,80 Q 0,86 14,80',2.2,INK,.4);
 else if(expr==='shy')s+=ln('M -20,74 Q 0,84 20,74',4)+ln('M 23,72 l 3,-4',2.6);
 else s+=mouth('dad',expr);
 // grey stubble
 for(let k=0;k<44;k++){const a=k*2.399,r=22+((k*37)%34);const x=Math.cos(a)*r*1.5,y=88+Math.abs(Math.sin(a))*24+((k*13)%14);if(Math.abs(x)<50&&y<106-Math.abs(x)*.25)s+=`<circle cx="${f(x)}" cy="${f(y)}" r="1.5" fill="#8d8a86" opacity=".5"/>`}
 return s}
function mirrorPath(d){return d.replace(/(-?\d+(\.\d+)?),(-?\d+(\.\d+)?)/g,(m,x,_a,y)=>`${-parseFloat(x)},${y}`)}

function headMom(expr='smile'){
 const face='M -94,-30 C -98,-84 -54,-112 0,-112 C 54,-112 98,-84 94,-30 C 94,40 58,98 0,106 C -58,98 -94,40 -94,-30 Z';
 const items=[];
 // neck flaps behind
 const flap='M -146,-80 C -168,-30 -176,50 -166,104 C -150,112 -120,100 -94,92 C -100,40 -104,-10 -102,-60 Z';
 items.push(blob(flap,'#e57a96',{sh:[{d:'M -176,60 L -84,60 L -84,100 L -176,100 Z',c:'#b85a78',o:.25}],line:['M -140,-40 Q -150,30 -128,120','M -124,-40 Q -134,30 -114,110']}));
 items.push(blob(mirrorPath(flap),'#e57a96',{sh:[{d:'M 176,60 L 84,60 L 84,100 L 176,100 Z',c:'#b85a78',o:.25}],line:['M 140,-40 Q 150,30 128,120','M 124,-40 Q 134,30 114,110']}));
 // curly hair
 const curls=[[-98,-34,28],[-108,2,30],[-100,38,26],[-86,68,22]];
 for(const [x,y,r] of curls){const d=`M ${x-r},${y} a ${r},${r} 0 1,0 ${2*r},0 a ${r},${r} 0 1,0 ${-2*r},0`;items.push(blob(d,'#c9985c',{sh:[{d:`M ${x},${y} a ${r},${r} 0 0,0 ${r},0 a ${r},${r} 0 0,1 ${-r},${r} Z`,c:'#8b5e2e',o:.3}],hl:[{d:`M ${x-r*.6},${y-r*.5} a ${r*.5},${r*.4} 0 1,0 ${r*.6},-${r*.1} Z`,o:.35}]}));
  items.push(blob(`M ${-x-r},${y} a ${r},${r} 0 1,0 ${2*r},0 a ${r},${r} 0 1,0 ${-2*r},0`,'#c9985c',{}))}
 items.push(blob('M -94,2 C -118,-6 -118,44 -94,46 Z',SKIN.mom,{}),blob('M 94,2 C 118,-6 118,44 94,46 Z',SKIN.mom,{}));
 items.push(blob(face,SKIN.mom,{sh:[{d:'M 62,-104 C 100,-70 98,30 70,72 C 60,90 40,102 0,108 L 100,110 L 100,-104 Z',c:SKSH.mom,o:.25},{d:'M -100,-70 L 100,-70 L 100,-48 C 40,-36 -40,-36 -100,-48 Z',c:'#8a4a40',o:.28}],hl:[{d:'M -16,-8 C -4,-2 6,-2 16,-8 C 8,10 -6,10 -16,-8 Z',c:'#ffe0c4',o:.4}]}));
 let s=stack(items);
 s+=ln('M -72,-2 l -12,-5',2.4,INK,.6)+ln('M -72,8 l -12,3',2.4,INK,.6)+ln('M 72,-2 l 12,-5',2.4,INK,.6)+ln('M 72,8 l 12,3',2.4,INK,.6);
 s+=ln('M -28,40 Q -44,64 -36,82',2.6,INK,.5)+ln('M 28,40 Q 44,64 36,82',2.6,INK,.5);
 for(const [x,y] of [[-64,22],[-52,30],[-70,36],[64,24],[54,32],[70,38]])s+=`<circle cx="${x}" cy="${y}" r="1.7" fill="#a8704c" opacity=".55"/>`;
 s+=blush(expr,'mom')+eyes('mom',expr)+brows('mom',expr)+nose('mom')+mouth('mom',expr);
 // hat
 const dome='M -116,-82 C -118,-156 -62,-196 0,-196 C 62,-196 118,-156 116,-82 Z';
 const brim='M -170,-76 C -160,-130 -80,-122 0,-122 C 80,-122 160,-130 170,-76 C 160,-30 80,-40 0,-40 C -80,-40 -160,-30 -170,-76 Z';
 s+=stack([blob(dome,'#f09aae',{sh:[{d:'M 40,-196 C 118,-170 124,-110 116,-82 L 60,-82 Z',c:'#b85a78',o:.28}],hl:[{d:'M -80,-170 C -40,-192 0,-194 20,-190 C -20,-176 -60,-150 -90,-110 Z',o:.4}],line:['M -112,-96 Q 0,-76 112,-96','M -100,-130 Q -50,-186 0,-190']}),
  blob(brim,'#f4a6b8',{sh:[{d:'M 0,-40 C 80,-40 160,-30 170,-76 L 170,-20 L 0,-20 Z',c:'#b85a78',o:.25},{d:'M -170,-76 C -160,-130 -80,-122 0,-122 L 0,-100 C -80,-100 -150,-90 -170,-76 Z',c:'#b85a78',o:.12}],hl:[{d:'M -150,-90 C -110,-120 -40,-124 0,-122 C -50,-112 -110,-100 -150,-70 Z',o:.4}],line:['M -150,-70 Q 0,-52 150,-70','M -120,-60 Q 0,-46 120,-60']})]);
 // strap
 s+=`<path d="M -124,-56 C -118,40 -76,98 0,108 C 76,98 118,40 124,-56" fill="none" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M -124,-56 C -118,40 -76,98 0,108 C 76,98 118,40 124,-56" fill="none" stroke="#fffaf0" stroke-width="5" stroke-linecap="round"/>`;
 return s}

function headGirl(expr='smile'){
 const HC='#3a2b27',HD='#2a1d1a',HL='#8a6a5e';
 const face='M -96,-34 C -98,-90 -56,-112 0,-112 C 56,-112 98,-90 96,-34 C 98,38 60,96 0,104 C -60,96 -98,38 -96,-34 Z';
 const back='M -124,-40 C -130,-142 -60,-162 0,-162 C 60,-162 130,-142 124,-40 C 130,10 128,60 136,94 C 122,106 92,102 76,84 L 70,40 L -70,40 L -76,84 C -92,102 -122,106 -136,94 C -128,60 -130,10 -124,-40 Z';
 const items=[];
 items.push(blob(back,HC,{sh:[{d:'M 50,-162 C 130,-142 130,0 136,94 L 150,100 L 150,-162 Z',c:'#000',o:.28}],hl:[{d:'M -96,-128 C -50,-152 0,-154 40,-146 C -10,-142 -56,-120 -100,-70 Z',c:HL,o:.5}],
  line:['M -104,-70 Q -116,0 -112,70','M -90,-92 Q -108,-20 -100,60','M 104,-70 Q 116,0 112,70','M 90,-92 Q 108,-20 100,60','M -118,60 Q -124,84 -130,92','M 118,60 Q 124,84 130,92']}));
 items.push(blob('M -94,0 C -116,-6 -114,44 -92,46 Z',SKIN.girl,{}),blob('M 94,0 C 116,-6 114,44 92,46 Z',SKIN.girl,{}));
 items.push(blob(face,SKIN.girl,{sh:[{d:'M 60,-104 C 98,-70 96,30 68,72 C 56,90 38,100 0,104 L 100,106 L 100,-104 Z',c:SKSH.girl,o:.2}],hl:[{d:'M -14,-4 C -4,2 6,2 14,-4 C 8,12 -6,12 -14,-4 Z',c:'#ffe5d0',o:.4}]}));
 let s=stack(items);
 s+=blush(expr,'girl')+eyes('girl',expr)+nose('girl');
 if(expr==='smile'||expr==='happy'||expr==='laugh'){
  s+=`<path d="M -32,52 Q 0,63 32,52 Q 30,94 0,96 Q -30,94 -32,52 Z" fill="#8f3238" stroke="${INK}" stroke-width="3.6" stroke-linejoin="round"/><path d="M -28,54 Q 0,64 28,54 L 26,68 Q 0,76 -26,68 Z" fill="#fff"/><ellipse cx="0" cy="86" rx="14" ry="7" fill="#e9808a"/>`+ln('M -34,50 Q 0,65 34,50',4.2,'#c94f5e');
 } else s+=mouth('girl',expr);
 // center-parted hair cap + wispy see-through bangs
 const cap='M -112,-58 C -112,-136 -58,-150 0,-150 C 58,-150 112,-136 112,-58 C 104,-86 76,-102 44,-108 C 26,-100 8,-98 0,-96 C -8,-98 -26,-100 -44,-108 C -76,-102 -104,-86 -112,-58 Z';
 s+=stack([blob(cap,HC,{hl:[{d:'M -84,-130 C -46,-146 -4,-148 24,-142 C -20,-138 -60,-118 -92,-84 Z',c:HL,o:.5}],line:['M -70,-130 Q -60,-112 -48,-104','M 70,-130 Q 60,-112 48,-104']})]);
 const L=[[-22,-58,-6],[-44,-66,-3],[-66,-74,0]],R=[[24,-60,6],[48,-68,3],[70,-76,0]];
 for(const [ex,ey,bend] of L.concat(R)){const sx=ex<0?-3:3,cx=ex*.3+bend*2,cy=-102+(ey+102)*.3;
  s+=`<path d="M ${sx},-100 Q ${cx},${cy} ${ex},${ey}" fill="none" stroke="${HC}" stroke-width="5.5" stroke-linecap="round" opacity=".92"/>`}
 s+=ln('M -2,-100 Q -22,-80 -40,-62',2.4,HL,.7)+ln('M 2,-100 Q 24,-82 44,-64',2.4,HL,.6);
 return s}
const HEADS={dad:headDad,mom:headMom,girl:headGirl};

/* ---------- BODIES (box 500×900; head centre at 250,215) ---------- */
function bodyDad(o={}){
 const skin=SKIN.dad;let s='';
 const shirtC='#4f7fa6',pantsC='#6f7468';
 const legL='M 172,584 L 247,590 C 248,660 246,760 242,832 L 178,834 C 176,760 172,660 172,584 Z';
 const legR='M 253,590 L 328,584 C 328,660 324,760 322,834 L 258,832 C 254,760 252,660 253,590 Z';
 const shoeL='M 166,826 C 144,834 140,862 170,866 L 246,866 C 250,848 246,834 244,826 Z';
 s+=stack([blob(legL,pantsC,{sh:[{d:'M 222,590 C 226,660 226,760 222,834 L 248,834 L 248,590 Z',c:'#000',o:.18}],line:['M 200,700 Q 208,712 204,730','M 190,780 Q 200,790 196,806']}),blob(legR,pantsC,{sh:[{d:'M 300,590 C 304,660 304,760 300,834 L 330,834 L 330,590 Z',c:'#000',o:.18}],line:['M 296,700 Q 288,712 292,730']}),
  blob(shoeL,'#6a5240',{sh:[{d:'M 150,852 L 250,852 L 250,868 L 150,868 Z',c:'#000',o:.3}],hl:[{d:'M 160,834 Q 190,826 220,830 Q 190,840 160,844 Z',o:.3}]}),blob(mirrorPath2(shoeL),'#6a5240',{sh:[{d:'M 250,852 L 350,852 L 350,868 L 250,868 Z',c:'#000',o:.3}]})]);
 // arms (back layer: forearm + hand) then sleeve
 const armL='M 100,452 C 86,510 84,568 96,626 L 134,622 C 140,566 142,508 140,462 Z';
 if(!o.noArms)s+=stack([blob(armL,skin,{sh:[{d:'M 120,452 C 126,510 126,568 122,626 L 136,626 L 144,452 Z',c:SKSH.dad,o:.3}],line:['M 100,540 Q 106,548 102,562']}),blob(mirrorPath2(armL),skin,{sh:[{d:'M 380,452 C 374,510 374,568 378,626 L 364,626 L 356,452 Z',c:SKSH.dad,o:.3}]})]);
 if(!o.noArms)s+=`<g transform="translate(115,628) rotate(4)">${hand('relaxed',skin)}</g><g transform="translate(385,628) scale(-1,1) rotate(4)">${hand('relaxed',skin)}</g>`;
 // neck
 s+=stack([blob('M 218,318 L 282,318 L 286,366 L 214,366 Z',skin,{sh:[{d:'M 218,318 L 282,318 L 282,344 C 260,356 240,356 218,344 Z',c:SKSH.dad,o:.5}]})]);
 // torso
 const tee='M 158,370 C 190,354 310,354 342,370 C 376,384 384,426 380,478 L 374,598 C 330,614 170,614 126,598 L 120,478 C 116,426 124,384 158,370 Z';
 const teeB=(blob(tee,shirtC,{sh:[{d:'M 300,360 C 372,384 384,426 380,478 L 374,598 C 346,610 320,610 300,612 Z',c:'#1d3a56',o:.28},{d:'M 130,520 C 200,540 300,540 372,520 L 374,598 C 330,614 170,614 126,598 Z',c:'#1d3a56',o:.18}],hl:[{d:'M 164,376 C 190,364 230,360 250,360 C 200,376 176,404 166,440 Z',o:.22}],line:['M 190,470 Q 220,490 214,540','M 310,470 Q 286,490 292,540','M 150,560 Q 250,580 350,560','M 236,372 L 236,400']}));
 // collar
 const collar=`<path d="M 208,364 C 228,386 272,386 292,364" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><path d="M 212,364 C 230,382 270,382 288,364" fill="none" stroke="#7fa6c6" stroke-width="3" stroke-linecap="round"/>`;
 // sleeves
 const slL='M 160,368 C 118,376 90,410 82,452 C 100,466 124,474 146,476 C 152,440 166,414 184,396 Z';
 s+=stack([teeB,blob(slL,shirtC,{sh:[{d:'M 82,452 C 100,466 124,474 146,476 L 150,448 L 90,430 Z',c:'#1d3a56',o:.3}],hl:[{d:'M 150,372 C 124,382 102,408 96,436 C 112,414 132,392 160,380 Z',o:.25}],line:['M 100,438 Q 126,446 150,444']}),blob(mirrorPath2(slL),shirtC,{sh:[{d:'M 418,452 C 400,466 376,474 354,476 L 350,448 L 410,430 Z',c:'#1d3a56',o:.3}],line:['M 400,438 Q 374,446 350,444']})]);
s+=collar+ln('M 184,398 C 168,424 154,450 148,478',3,INK,.8)+ln('M 316,398 C 332,424 346,450 352,478',3,INK,.8);
 // head
 s=`<g transform="translate(30,0) scale(.88,1)">${s}</g>`;
 if(!o.noHead)s+=`<g transform="translate(250,214)">${headDad(o.expr||'smile')}</g>`;
 return s}
function mirrorPath2(d){return d.replace(/(-?\d+(\.\d+)?),(-?\d+(\.\d+)?)/g,(m,x,_a,y)=>`${500-parseFloat(x)},${y}`)}

function bodyMom(o={}){
 const skin=SKIN.mom,teal='#37b4a2',blue='#2f66b4',glove='#8d86a2',leg='#a9d5ea';
 let s='';
 const legL='M 176,586 L 247,590 C 248,660 246,760 242,830 L 182,832 C 180,760 176,660 176,586 Z';
 const shoeL='M 170,824 C 150,832 148,860 174,864 L 246,864 C 250,848 246,834 244,824 Z';
 const leaf=(x,y,r)=>`<path d="M ${x},${y} q ${r},-${r*1.6} ${r*1.8},-${r*.4} q -${r*.4},${r*1.4} -${r*1.8},${r*.4} Z" fill="#4d9cc3" opacity=".8"/>`;
 s+=stack([blob(legL,leg,{sh:[{d:'M 222,590 C 226,660 226,760 222,832 L 248,832 L 248,590 Z',c:'#3b6f92',o:.22}]}),blob(mirrorPath2(legL),leg,{sh:[{d:'M 300,590 C 304,660 304,760 300,832 L 330,832 L 330,590 Z',c:'#3b6f92',o:.22}]}),
  blob(shoeL,'#f2ece0',{sh:[{d:'M 150,850 L 250,850 L 250,866 L 150,866 Z',c:'#7a6a50',o:.4}],hl:[{d:'M 160,830 Q 190,824 220,828 Q 190,838 160,842 Z',o:.5}],line:['M 196,830 l 10,-6','M 206,834 l 10,-6']}),blob(mirrorPath2(shoeL),'#f2ece0',{sh:[{d:'M 250,850 L 350,850 L 350,866 L 250,866 Z',c:'#7a6a50',o:.4}]})]);
 s+=[[196,640,9],[212,700,8],[200,760,9],[286,650,9],[300,716,8],[290,774,9]].map(([x,y,r])=>leaf(x,y,r)).join('')+ln('M 198,648 q 8,-10 14,-4',2,'#3b7ea6',.7);
 // arms full blue sleeves + gloves
 const armL='M 164,372 C 118,380 92,420 84,470 C 78,520 82,580 96,630 L 140,628 C 146,580 144,520 150,470 C 156,436 170,412 186,396 Z';
 const ARMS=([blob(armL,teal,{sh:[{d:'M 124,470 C 126,520 128,580 124,630 L 142,630 C 146,580 144,520 150,470 Z',c:'#0d2a5a',o:.3}],hl:[{d:'M 110,430 C 96,470 92,520 100,580 C 94,520 96,470 114,430 Z',o:.35}],line:['M 100,520 L 138,524','M 98,570 L 136,572']}),blob(mirrorPath2(armL),teal,{sh:[{d:'M 376,470 C 374,520 372,580 376,630 L 358,630 C 354,580 356,520 350,470 Z',c:'#0d2a5a',o:.3}],line:['M 400,520 L 362,524','M 402,570 L 364,572']})]);
 if(!o.noArms)s+=`<g transform="translate(118,632) rotate(4)">${hand('relaxed',skin,glove)}</g><g transform="translate(382,632) scale(-1,1) rotate(4)">${hand('relaxed',skin,glove)}</g>`;
 if(!o.noArms)s+=ln('M 100,648 q 10,10 22,4',2.4,'#5a5470',.8)+ln('M 400,648 q -10,10 -22,4',2.4,'#5a5470',.8);
 // neck
 s+=stack([blob('M 220,314 L 280,314 L 284,366 L 216,366 Z',skin,{sh:[{d:'M 220,314 L 280,314 L 280,342 C 260,354 240,354 220,342 Z',c:SKSH.mom,o:.5}]})]);
 // torso (teal) with butterfly print
 const top='M 160,370 C 190,354 310,354 340,370 C 374,384 380,428 376,478 L 372,596 C 330,610 170,610 128,596 L 124,478 C 120,428 126,384 160,370 Z';
 s+=stack([...(o.noArms?[]:ARMS),blob(top,teal,{sh:[{d:'M 300,360 C 372,384 380,428 376,478 L 372,596 C 346,606 320,606 300,608 Z',c:'#0e5e56',o:.28}],hl:[{d:'M 168,376 C 194,364 232,360 250,360 C 204,376 180,404 170,440 Z',o:.25}],line:['M 194,480 Q 222,500 216,552','M 306,480 Q 280,500 286,552']})]);
 const lowL='M 92,520 C 84,556 86,596 98,632 L 142,630 C 146,596 146,556 148,520 Z';
 if(!o.noArms)s+=stack([blob(lowL,blue,{sh:[{d:'M 124,520 C 126,560 128,600 124,632 L 144,630 C 148,596 148,556 148,520 Z',c:'#0d2a5a',o:.3}],hl:[{d:'M 98,530 C 94,566 96,600 104,628 C 98,596 98,566 104,530 Z',o:.4}],line:['M 94,560 L 144,562','M 96,598 L 144,600']}),blob(mirrorPath2(lowL),blue,{sh:[{d:'M 376,520 C 374,560 372,600 376,632 L 356,630 C 352,596 352,556 352,520 Z',c:'#0d2a5a',o:.3}],line:['M 406,560 L 356,562','M 404,598 L 356,600']})]);
 if(!o.noArms)s+=`<g transform="translate(118,632) rotate(4)">${hand('relaxed',skin,glove)}</g><g transform="translate(382,632) scale(-1,1) rotate(4)">${hand('relaxed',skin,glove)}</g>`;
 s+=`<path d="M 250,470 C 226,446 200,454 206,480 C 210,498 236,494 250,484 C 264,494 290,498 294,480 C 300,454 274,446 250,470 Z" fill="#1f7f72" opacity=".85" stroke="${INK}" stroke-width="2.4"/><path d="M 250,470 L 250,492" stroke="${INK}" stroke-width="3" stroke-linecap="round"/><circle cx="224" cy="474" r="4" fill="#bff0e6"/><circle cx="276" cy="474" r="4" fill="#bff0e6"/>`+ln('M 246,468 q -8,-14 -16,-12',2.4)+ln('M 254,468 q 8,-14 16,-12',2.4);
 for(const [x,y] of [[190,540],[300,530],[320,500],[180,500],[260,560]])s+=`<path d="M ${x},${y-6} l 2,5 l 5,2 l -5,2 l -2,5 l -2,-5 l -5,-2 l 5,-2 Z" fill="#d9fff4" opacity=".7"/>`;
 s+=`<path d="M 208,362 C 228,382 272,382 292,362" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`;
 s=`<g transform="translate(30,0) scale(.88,1)">${s}</g>`;
 if(!o.noHead)s+=`<g transform="translate(250,214)">${headMom(o.expr||'smile')}</g>`;
 return s}

function bodyGirl(o={}){
 const skin=SKIN.girl,pink='#e58aa0',pantsC='#403b47';
 let s='';
 const legL='M 178,600 L 247,604 C 248,670 244,770 240,830 L 188,832 C 184,770 178,670 178,600 Z';
 const shoeL='M 176,822 C 150,830 144,860 176,866 L 246,866 C 252,846 246,832 242,822 Z';
 s+=stack([blob(legL,pantsC,{sh:[{d:'M 218,600 C 224,670 222,770 220,832 L 246,832 L 248,600 Z',c:'#000',o:.25}],line:['M 206,700 Q 214,716 208,736']}),blob(mirrorPath2(legL),pantsC,{sh:[{d:'M 300,604 C 304,670 302,770 300,832 L 330,832 L 330,604 Z',c:'#000',o:.25}]}),
  blob(shoeL,'#ffffff',{sh:[{d:'M 150,850 L 250,850 L 250,868 L 150,868 Z',c:'#9aa0b0',o:.5},{d:'M 200,822 L 250,822 L 250,850 L 200,850 Z',c:'#9aa0b0',o:.18}],hl:[{d:'M 164,832 Q 196,822 226,826 Q 196,838 164,844 Z',c:'#e8ecf6',o:.9}],line:['M 214,828 l 10,-6','M 224,832 l 10,-6','M 150,856 L 246,856']}),blob(mirrorPath2(shoeL),'#ffffff',{sh:[{d:'M 250,850 L 350,850 L 350,868 L 250,868 Z',c:'#9aa0b0',o:.5}],line:['M 286,828 l -10,-6','M 276,832 l -10,-6','M 350,856 L 254,856']})]);
 // sleeves + cuffs
 const armL='M 166,372 C 120,382 92,424 86,474 C 80,530 86,582 100,618 L 144,614 C 148,570 146,520 150,474 C 156,438 170,414 188,398 Z';
 const ARMS=([blob(armL,pink,{sh:[{d:'M 126,470 C 130,520 132,580 128,616 L 146,614 C 150,570 148,520 152,474 Z',c:'#a0455f',o:.3}],hl:[{d:'M 112,430 C 98,470 94,520 102,580 C 96,520 98,470 116,430 Z',o:.4}],line:['M 92,500 Q 118,512 146,500','M 92,548 Q 118,560 146,548','M 96,592 Q 120,602 146,592']}),blob(mirrorPath2(armL),pink,{sh:[{d:'M 374,470 C 370,520 368,580 372,616 L 354,614 C 350,570 352,520 348,474 Z',c:'#a0455f',o:.3}],line:['M 408,500 Q 382,512 354,500','M 408,548 Q 382,560 354,548','M 404,592 Q 380,602 354,592']})]);
 if(!o.noArms)s+=stack([blob('M 96,610 L 146,606 L 146,632 L 98,636 Z','#c8ccd6',{line:['M 106,614 L 108,634','M 120,612 L 122,634','M 134,610 L 136,632']}),blob('M 404,610 L 354,606 L 354,632 L 402,636 Z','#c8ccd6',{line:['M 394,614 L 392,634','M 380,612 L 378,634','M 366,610 L 364,632']})]);
 if(!o.noArms)s+=`<g transform="translate(122,636) rotate(4)">${hand('relaxed',skin)}</g><g transform="translate(378,636) scale(-1,1) rotate(4)">${hand('relaxed',skin)}</g>`;
 s+=stack([blob('M 220,316 L 280,316 L 284,366 L 216,366 Z',skin,{sh:[{d:'M 220,316 L 280,316 L 280,344 C 260,356 240,356 220,344 Z',c:SKSH.girl,o:.5}]})]);
 // puffer torso
 const jk='M 152,364 C 190,350 310,350 348,364 C 392,382 398,432 392,484 L 374,606 C 334,622 166,622 126,606 L 108,484 C 102,432 108,382 152,364 Z';
 s+=stack([...(o.noArms?[]:ARMS),blob(jk,pink,{sh:[{d:'M 310,356 C 392,382 398,432 392,484 L 386,606 C 356,618 330,620 310,622 Z',c:'#a0455f',o:.3},{d:'M 120,540 C 200,560 300,560 380,540 L 374,606 C 334,622 166,622 126,606 Z',c:'#a0455f',o:.15}],hl:[{d:'M 160,368 C 196,356 236,354 252,354 C 206,372 180,404 170,444 Z',o:.35}],line:['M 108,428 Q 250,452 392,428','M 106,484 Q 250,508 394,484','M 108,540 Q 250,564 392,540','M 250,370 L 250,620']})]);
 // zipper pull
 s+=`<rect x="244" y="372" width="12" height="16" rx="3" fill="#c8ccd6" stroke="${INK}" stroke-width="2.2"/>`;
 // strap + bag
 s+=`<path d="M 332,368 C 290,430 220,520 168,596" fill="none" stroke="${INK}" stroke-width="16" stroke-linecap="round"/><path d="M 332,368 C 290,430 220,520 168,596" fill="none" stroke="#2b2b30" stroke-width="10" stroke-linecap="round"/>`;
 s+=stack([blob('M 108,570 C 108,556 124,552 140,552 L 206,552 C 222,552 226,566 226,580 L 226,636 C 226,650 214,654 200,654 L 134,654 C 118,654 108,648 108,634 Z','#2c2c32',{sh:[{d:'M 200,552 L 228,552 L 228,656 L 200,656 Z',c:'#000',o:.3}],hl:[{d:'M 114,562 C 140,554 190,554 214,558 L 214,566 C 180,562 140,562 114,570 Z',c:'#6a6a76',o:.55}],line:['M 114,590 L 222,590','M 160,590 L 160,606']}),blob('M 118,556 C 130,540 196,540 214,556 L 214,566 L 118,566 Z','#3a3a44',{})]);
 s+=`<circle cx="160" cy="610" r="6" fill="#c8ccd6" stroke="${INK}" stroke-width="2"/>`;
 // hood
 s+=stack([blob('M 168,352 C 190,318 310,318 332,352 C 350,376 340,402 302,408 L 198,408 C 160,402 150,376 168,352 Z','#cf6f88',{sh:[{d:'M 250,330 L 340,330 L 340,410 L 250,410 Z',c:'#7a2c44',o:.25}],hl:[{d:'M 180,350 C 200,328 250,324 270,326 C 220,336 196,352 186,372 Z',o:.4}],line:['M 190,380 Q 250,396 310,380']})]);
 s+=`<circle cx="204" cy="394" r="6" fill="#f3a9bc" stroke="${INK}" stroke-width="2.2"/><circle cx="296" cy="394" r="6" fill="#f3a9bc" stroke="${INK}" stroke-width="2.2"/>`;
 // scarf
 const ring='M 184,330 C 206,368 294,368 316,330 C 338,352 338,376 304,386 C 270,398 230,398 196,386 C 162,376 162,352 184,330 Z';
 const tail='M 288,380 L 342,392 L 330,540 L 284,530 Z';
 s+=stack([blob(tail,'#ef7b4a',{sh:[{d:'M 320,392 L 342,392 L 330,540 L 308,536 Z',c:'#9a2f12',o:.3}],line:['M 292,420 L 336,428','M 290,452 L 334,460','M 288,490 L 332,498']}),blob(ring,'#f08655',{sh:[{d:'M 250,372 C 290,372 320,360 316,330 C 338,352 338,376 304,386 C 280,394 260,396 250,396 Z',c:'#9a2f12',o:.3}],hl:[{d:'M 190,338 C 210,366 250,370 280,366 C 240,376 206,362 190,338 Z',o:.4}],line:['M 190,350 Q 250,380 312,350','M 200,372 Q 250,392 302,372']})]);
 s+=ln('M 292,536 l -2,22',3,'#c9482f')+ln('M 302,538 l 0,24',3,'#c9482f')+ln('M 312,540 l 2,22',3,'#c9482f')+ln('M 322,540 l 3,20',3,'#c9482f');
 s=`<g transform="translate(30,0) scale(.88,1)">${s}</g>`;
 if(!o.noHead)s+=`<g transform="translate(250,214)">${headGirl(o.expr||'smile')}</g>`;
 return s}
const BODIES={dad:bodyDad,mom:bodyMom,girl:bodyGirl};
