async function synth(){
 const SR=44100,D=30.6;const oc=new OfflineAudioContext(2,Math.ceil(SR*D),SR);
 const master=oc.createGain();master.gain.value=.85;const comp=oc.createDynamicsCompressor();master.connect(comp);comp.connect(oc.destination);
 const dly=oc.createDelay(1);dly.delayTime.value=.23;const fb=oc.createGain();fb.gain.value=.3;const wet=oc.createGain();wet.gain.value=.25;
 const lp=oc.createBiquadFilter();lp.type='lowpass';lp.frequency.value=3000;dly.connect(lp);lp.connect(fb);fb.connect(dly);lp.connect(wet);wet.connect(master);
 const send=(n,amt=1)=>{n.connect(master);const g=oc.createGain();g.gain.value=amt*.5;n.connect(g);g.connect(dly)};
 const fq=m=>440*Math.pow(2,(m-69)/12);
 let seed=5;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};
 const env=(g,t,a,d,peak)=>{g.gain.setValueAtTime(0.0001,t);g.gain.linearRampToValueAtTime(peak,t+a);g.gain.exponentialRampToValueAtTime(0.0008,t+a+d)};
 const NB=(()=>{const b=oc.createBuffer(1,SR*2,SR),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=rnd()*2-1;return b})();
 // pipa: plucked, bright
 function pipa(t,m,vel=.3,dur=.5,pan=.15){const o=oc.createOscillator(),o2=oc.createOscillator(),g=oc.createGain(),f=oc.createBiquadFilter(),p=oc.createStereoPanner();
  o.type='sawtooth';o.frequency.value=fq(m);o2.type='triangle';o2.frequency.value=fq(m)*2;f.type='lowpass';f.frequency.setValueAtTime(4200,t);f.frequency.exponentialRampToValueAtTime(600,t+dur*.8);
  env(g,t,.003,dur,vel);o.connect(f);o2.connect(f);f.connect(g);g.connect(p);p.pan.value=pan;send(p,.9);o.start(t);o2.start(t);o.stop(t+dur+.1);o2.stop(t+dur+.1)}
 // erhu: bowed, nasal, vibrato
 function erhu(t,m,dur,vel=.5){const o=oc.createOscillator(),g=oc.createGain(),f=oc.createBiquadFilter(),l=oc.createOscillator(),lg=oc.createGain(),f2=oc.createBiquadFilter();
  o.type='sawtooth';o.frequency.value=fq(m);l.frequency.value=5.5;lg.gain.value=fq(m)*.012;l.connect(lg);lg.connect(o.frequency);
  f.type='bandpass';f.frequency.value=Math.min(fq(m)*3,2600);f.Q.value=.8;f2.type='lowpass';f2.frequency.value=3200;
  g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(vel,t+.12);g.gain.setValueAtTime(vel,Math.max(t+.13,t+dur-.15));g.gain.linearRampToValueAtTime(.0001,t+dur);
  o.connect(f);f.connect(f2);f2.connect(g);send(g,1.1);o.start(t);l.start(t);o.stop(t+dur+.1);l.stop(t+dur+.1)}
 function wood(t,vel=.25,f0=900){const o=oc.createOscillator(),g=oc.createGain();o.type='sine';o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(f0*.7,t+.05);env(g,t,.001,.06,vel);o.connect(g);g.connect(master);o.start(t);o.stop(t+.12);
  const s=oc.createBufferSource();s.buffer=NB;const bp=oc.createBiquadFilter();bp.type='bandpass';bp.frequency.value=1800;const g2=oc.createGain();env(g2,t,.001,.03,vel*.6);s.connect(bp);bp.connect(g2);g2.connect(master);s.start(t,rnd());s.stop(t+.08)}
 function drum(t,vel=.5){const o=oc.createOscillator(),g=oc.createGain();o.type='sine';o.frequency.setValueAtTime(160,t);o.frequency.exponentialRampToValueAtTime(52,t+.2);env(g,t,.003,.28,vel);o.connect(g);g.connect(master);o.start(t);o.stop(t+.4)}
 function gong(t,m=43,vel=.35,dur=3){for(const[r,v]of[[1,1],[1.51,.6],[2.02,.5],[2.76,.4],[4.2,.25]]){const o=oc.createOscillator(),g=oc.createGain();o.type='sine';o.frequency.value=fq(m)*r*(1+(rnd()-.5)*.004);env(g,t,.01,dur/(r*.7),vel*v);o.connect(g);send(g,.8);o.start(t);o.stop(t+dur+.2)}
  const s=oc.createBufferSource();s.buffer=NB;const bp=oc.createBiquadFilter();bp.type='bandpass';bp.frequency.value=2500;const g=oc.createGain();env(g,t,.002,.15,vel*.4);s.connect(bp);bp.connect(g);g.connect(master);s.start(t,rnd());s.stop(t+.3)}
 function bell(t,m,vel=.25,dur=2){for(const[r,v]of[[1,1],[2.76,.4],[5.4,.2]]){const o=oc.createOscillator(),g=oc.createGain();o.type='sine';o.frequency.value=fq(m)*r;env(g,t,.003,dur/(r*.8),vel*v);o.connect(g);send(g,1.3);o.start(t);o.stop(t+dur+.2)}}
 function pop(t,f0=300,f1=900,vel=.22){const o=oc.createOscillator(),g=oc.createGain();o.type='sine';o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(f1,t+.09);env(g,t,.004,.12,vel);o.connect(g);send(g,.5);o.start(t);o.stop(t+.25)}
 function rain(t0,t1){const s=oc.createBufferSource();s.buffer=NB;s.loop=true;const f=oc.createBiquadFilter();f.type='bandpass';f.frequency.value=5200;f.Q.value=.7;const g=oc.createGain();
  g.gain.setValueAtTime(0.0001,t0);g.gain.linearRampToValueAtTime(.2,t0+.6);g.gain.setValueAtTime(.2,t1-.3);g.gain.linearRampToValueAtTime(0.0001,t1+.5);s.connect(f);f.connect(g);g.connect(master);s.start(t0);s.stop(t1+.6)}
 const phrase=(t0,notes,step,fn)=>notes.forEach((m,i)=>{if(m)fn(t0+i*step,m,i)});
 // ---- scene 1 (0-4): gong + ascending pipa run + woodblock
 gong(0,43,.4,3.5);
 phrase(.5,[60,64,67,69,72,76,79,81,84],.2,(t,m,i)=>pipa(t,m,.26,.5,-.2+i*.05));
 for(let t=1.2;t<3.9;t+=.3)wood(t,.12,t%.6<.3?900:700);
 bell(2.6,88,.25,1.6);drum(2.6,.4);
 // ---- scene 2 (4-9): cheerful theme, pipa + erhu
 gong(4,48,.25,2);
 const th1=[76,79,81,79,76,74,72,74, 76,79,76,74,72,69,72,0, 74,76,79,76,74,72,69,72, 74,76,74,72,69,67,69,0];
 phrase(4.3,th1.slice(0,16),.3,(t,m)=>pipa(t,m,.3,.55,.2));
 phrase(4.3+4.8,th1.slice(16,31),.3,(t,m)=>pipa(t,m,.3,.5,.2));
 [[4.3,76,1.2],[5.5,79,1.2],[6.7,81,1.2],[7.9,79,1.1]].forEach(([t,m,d])=>erhu(t,m-12,d,.28));
 for(let t=4.3;t<9;t+=1.2){drum(t,.28);}for(let t=4.45;t<9;t+=.6)wood(t,.1);
 pop(5.0,300,800);pop(6.5,450,1100);
 // ---- scene 3 (9-14): rain, minor feel, sparse
 gong(9,45,.22,2.5);rain(9,14);
 erhu(9.3,69,1.5,.5);erhu(10.8,72,1,.5);erhu(11.8,76,.7,.5);erhu(12.5,74,.7,.5);erhu(13.2,69,1.4,.5);
 for(let t=9.4;t<14;t+=1.2){pipa(t,57,.22,.8,-.3);pipa(t+.6,64,.16,.7,.2)}
 drum(9.6,.25);drum(12,.25);
 // ---- scene 4 (14-19): hopeful
 gong(14,48,.25,2);
 phrase(14.3,[67,69,72,74,76,74,72,69, 72,74,76,79,81,79,76,74],.3,(t,m)=>pipa(t,m,.3,.5,.1));
 erhu(14.4,60,2.2,.35);erhu(16.8,64,2.2,.35);
 for(let t=14.3;t<19;t+=1.2)drum(t,.22);
 pop(14.5,350,900);pop(15.9,400,950);pop(17.6,500,1200,.25);
 // ---- scene 5 (19-25): playful woodblock + pipa
 gong(19,48,.2,1.5);
 for(let c=0;c<2;c++)phrase(19.2+c*2.4,[72,76,79,76,72,76,79,84],.3,(t,m)=>pipa(t,m,.28,.4,.2));
 phrase(24,[79,81,84,0,81,79],.2,(t,m)=>pipa(t,m,.28,.4,.2));
 for(let t=19.2;t<25;t+=.3){wood(t,Math.round((t-19.2)/.3)%4===0?.22:.1,Math.round((t-19.2)/.3)%2?1100:800)}
 for(let t=19.2;t<25;t+=1.2)drum(t,.3);
 pop(19.8,260,700);bell(23.9,96,.2,1);pop(24.2,500,1300,.25);
 // ---- scene 6 (25-30): triumphant
 gong(25,48,.3,2);
 phrase(25.3,[79,81,84,81,79,76,79,81,84,88],.3,(t,m)=>pipa(t,m,.3,.5,.1));
 pop(26.7,400,1100,.25);bell(27.5,91,.2,1.2);bell(28,96,.2,1.2);
 for(let i=0;i<9;i++){const m=[60,64,67,72,76,79,84,88,91][i];pipa(28.3+i*.1,m,.3,.5,(i%2?.3:-.3))}
 gong(28.9,43,.45,3);bell(29.4,96,.3,3);
 erhu(28.9,72,1.5,.4);erhu(28.9,64,1.5,.3);erhu(28.9,67,1.5,.3);
 const buf=await oc.startRendering();
 const L=buf.getChannelData(0),R=buf.getChannelData(1);const n=Math.ceil(SR*30);
 const out=new Int16Array(n*2);let pk=0;for(let i=0;i<n;i++)pk=Math.max(pk,Math.abs(L[i]),Math.abs(R[i]));
 const k=.89/Math.max(pk,.01);
 for(let i=0;i<n;i++){let fade=i>SR*29.5?Math.max(0,(n-i)/(SR*.5)):1;if(i<SR*.03)fade=i/(SR*.03);
  out[2*i]=Math.max(-1,Math.min(1,L[i]*k*fade))*32767;out[2*i+1]=Math.max(-1,Math.min(1,R[i]*k*fade))*32767}
 const u8=new Uint8Array(out.buffer);let s='';for(let i=0;i<u8.length;i+=8192)s+=String.fromCharCode.apply(null,u8.subarray(i,i+8192));
 return btoa(s)}
window.synth=synth;
