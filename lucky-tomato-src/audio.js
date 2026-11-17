async function synth(){
 const SR=44100,D=30.6;const oc=new OfflineAudioContext(2,Math.ceil(SR*D),SR);
 const master=oc.createGain();master.gain.value=.85;const comp=oc.createDynamicsCompressor();master.connect(comp);comp.connect(oc.destination);
 const dly=oc.createDelay(1);dly.delayTime.value=.27;const fb=oc.createGain();fb.gain.value=.28;const wet=oc.createGain();wet.gain.value=.22;
 const lp=oc.createBiquadFilter();lp.type='lowpass';lp.frequency.value=3500;dly.connect(lp);lp.connect(fb);fb.connect(dly);lp.connect(wet);wet.connect(master);
 const send=(n,amt=1)=>{n.connect(master);const g=oc.createGain();g.gain.value=amt*.6;n.connect(g);g.connect(dly)};
 const fq=m=>440*Math.pow(2,(m-69)/12);
 let seed=11;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};
 function env(g,t,a,d,peak){g.gain.setValueAtTime(0.0001,t);g.gain.linearRampToValueAtTime(peak,t+a);g.gain.exponentialRampToValueAtTime(0.0008,t+a+d)}
 function marimba(t,m,vel=.5,dur=.55,pan=0){const o=oc.createOscillator(),o2=oc.createOscillator(),g=oc.createGain(),g2=oc.createGain(),p=oc.createStereoPanner();
  o.type='sine';o.frequency.value=fq(m);o2.type='sine';o2.frequency.value=fq(m)*4.02;env(g,t,.004,dur,vel);env(g2,t,.002,.09,vel*.5);
  o.connect(g);o2.connect(g2);g.connect(p);g2.connect(p);p.pan.value=pan;send(p);o.start(t);o2.start(t);o.stop(t+dur+.1);o2.stop(t+.3)}
 function pluck(t,m,vel=.5,dur=.35){const o=oc.createOscillator(),g=oc.createGain(),f=oc.createBiquadFilter();o.type='triangle';o.frequency.value=fq(m);f.type='lowpass';f.frequency.setValueAtTime(900,t);f.frequency.exponentialRampToValueAtTime(200,t+dur);
  env(g,t,.006,dur,vel);o.connect(f);f.connect(g);g.connect(master);o.start(t);o.stop(t+dur+.1)}
 function noiseBuf(len){const b=oc.createBuffer(1,SR*len,SR),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=rnd()*2-1;return b}
 const NB=noiseBuf(2);
 function shaker(t,vel=.08){const s=oc.createBufferSource();s.buffer=NB;const f=oc.createBiquadFilter();f.type='highpass';f.frequency.value=6000;const g=oc.createGain();env(g,t,.003,.06,vel);s.connect(f);f.connect(g);g.connect(master);s.start(t,rnd());s.stop(t+.12)}
 function bell(t,m,vel=.3,dur=2.2){for(const[r,v]of[[1,1],[2.76,.4],[5.4,.2]]){const o=oc.createOscillator(),g=oc.createGain();o.type='sine';o.frequency.value=fq(m)*r;env(g,t,.003,dur/(r*.8),vel*v);o.connect(g);send(g,1.3);o.start(t);o.stop(t+dur+.2)}}
 function pop(t,f0=300,f1=900,vel=.25){const o=oc.createOscillator(),g=oc.createGain();o.type='sine';o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(f1,t+.09);env(g,t,.004,.12,vel);o.connect(g);send(g,.5);o.start(t);o.stop(t+.25)}
 function pad(t,notes,dur,vel=.06){for(const m of notes){const o=oc.createOscillator(),g=oc.createGain();o.type='triangle';o.frequency.value=fq(m);g.gain.setValueAtTime(0.0001,t);g.gain.linearRampToValueAtTime(vel,t+.4);g.gain.linearRampToValueAtTime(0.0001,t+dur);o.connect(g);g.connect(master);o.start(t);o.stop(t+dur+.1)}}
 function rain(t0,t1){const s=oc.createBufferSource();s.buffer=NB;s.loop=true;const f=oc.createBiquadFilter();f.type='bandpass';f.frequency.value=5200;f.Q.value=.7;const g=oc.createGain();
  g.gain.setValueAtTime(0.0001,t0);g.gain.linearRampToValueAtTime(.22,t0+.6);g.gain.setValueAtTime(.22,t1-.3);g.gain.linearRampToValueAtTime(0.0001,t1+.5);s.connect(f);f.connect(g);g.connect(master);s.start(t0);s.stop(t1+.6)}
 // harmony (2.4s per bar @100BPM)
 const BAR=2.4,EN=BAR/8;
 const CH={C:[60,64,67],F:[65,69,72],G:[67,71,74],Am:[57,60,64],Dm:[62,65,69],Em:[64,67,71]};
 const prog_=['C','F','C','G','Am','Dm','C','G','F','C','G','C','C'];
 const roots={C:36,F:41,G:43,Am:45,Dm:38,Em:40};
 const pent=[72,74,76,79,81,84];
 prog_.forEach((name,b)=>{
  const t0=b*BAR,tri=CH[name],minor=(b===4||b===5),sparse=(b===0),end=b>=11;
  // bass
  const r=roots[name];pluck(t0,r,.34);pluck(t0+BAR/2,r+7,.26);if(!minor||b===5)pluck(t0+BAR*.75,r+12,.18);
  // shaker
  for(let i=0;i<8;i++)shaker(t0+i*EN,i%2?.075:.04);
  // chord strum
  if(!sparse)for(let i=0;i<3;i++)marimba(t0+BAR/2+i*.03,tri[i]+0,.12,.4,-.3);
  // melody
  const pat=minor?[1,0,0,1,0,0,1,0]:sparse?[1,0,0,0,1,0,0,0]:[1,0,1,1,0,1,1,0];
  let last=0;
  for(let i=0;i<8;i++){if(!pat[i]||end&&i>1)continue;
   const cands=[tri[0]+12,tri[1]+12,tri[2]+12,tri[0]+24];if(!minor&&rnd()<.45)cands.push(pent[Math.floor(rnd()*pent.length)]);
   let m=i%4===0?tri[(b+i)%3]+12:cands[Math.floor(rnd()*cands.length)];if(m===last)m+=2;last=m;
   marimba(t0+i*EN,m,.38+(i===0?.1:0)+rnd()*.06,.5,.2)}
 });
 // whistle-ish lead from scene 2 (4.0s+) high pentatonic sparkles
 [[4.9,84],[5.3,88],[7.0,91],[7.3,88],[7.6,93]].forEach(([t,m])=>marimba(t,m,.28,.8,.4));
 // sfx
 pop(5.0,300,800);pop(6.5,450,1100);bell(2.6,88,.26,1.6);bell(2.62,96,.12,1.2);
 pop(14.5,350,900,.2);pop(15.9,400,950,.2);pop(17.6,500,1200,.25);
 pop(19.8,260,700,.2);bell(23.9,96,.22,1);pop(24.2,500,1300,.28);
 pop(26.7,400,1100,.28);bell(27.5,91,.2,1.2);bell(28.0,96,.2,1.2);
 rain(9,14);
 // minor-section underpad, bright pad later
 pad(9.6,[57,60,64],4.8,.05);pad(14.4,[60,64,67],4.8,.05);pad(24,[55,59,62],2.4,.05);
 // final rising arpeggio + bell
 [60,64,67,72,76,79,84].forEach((m,i)=>marimba(28.0+i*.14,m,.4,.7,(i%2?.3:-.3)));
 bell(29.4,96,.34,3);pad(28.8,[60,64,67,72],1.8,.07);pluck(28.8,36,.4,1.2);
 const buf=await oc.startRendering();
 const L=buf.getChannelData(0),R=buf.getChannelData(1);const n=Math.ceil(SR*30);
 const out=new Int16Array(n*2);let pk=0;for(let i=0;i<n;i++){pk=Math.max(pk,Math.abs(L[i]),Math.abs(R[i]))}
 const k=.89/Math.max(pk,.01);
 for(let i=0;i<n;i++){let fade=i>SR*29.5?Math.max(0,(n-i)/(SR*.5)):1;if(i<SR*.05)fade=i/(SR*.05);
  out[2*i]=Math.max(-1,Math.min(1,L[i]*k*fade))*32767;out[2*i+1]=Math.max(-1,Math.min(1,R[i]*k*fade))*32767}
 const u8=new Uint8Array(out.buffer);let s='';for(let i=0;i<u8.length;i+=8192)s+=String.fromCharCode.apply(null,u8.subarray(i,i+8192));
 return btoa(s)}
window.synth=synth;
