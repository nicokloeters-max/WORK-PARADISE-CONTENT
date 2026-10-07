/* Daumenstopp Motion Engine · deterministic seek(t) renderer */
(function(){
const DS = window.DS = {
  fps:25, spec:null, beats:[], W:1080, H:1920,
  ease:{
    out:x=>1-Math.pow(1-x,3),
    io:x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2,
    pop:x=>{const c1=1.70158,c3=c1+1;return 1+c3*Math.pow(x-1,3)+c1*Math.pow(x-1,2);},
    lin:x=>x
  },
  css:{out:'cubic-bezier(.22,1,.36,1)',pop:'cubic-bezier(.34,1.56,.64,1)',io:'cubic-bezier(.65,0,.35,1)'},
  components:{},
  _cur:null
};
const clamp01=x=>Math.max(0,Math.min(1,x));
DS.clamp01=clamp01;
DS.lerp=(a,b,x)=>a+(b-a)*x;
DS.prog=(lt,at,dur,e)=>{const x=clamp01((lt-at)/Math.max(dur,1e-6));return (e||DS.ease.out)(x);};
DS.fmt=(v,dec)=>{dec=dec||0;let s=v.toFixed(dec).replace('.',',');let [i,f]=s.split(',');i=i.replace(/\B(?=(\d{3})+(?!\d))/g,'.');return f!==undefined?i+','+f:i;};
DS.tc=(t)=>{const f=Math.floor((t%1)*DS.fps);const s=Math.floor(t)%60;const m=Math.floor(t/60)%60;const h=Math.floor(t/3600);const p=n=>String(n).padStart(2,'0');return `${p(h)}:${p(m)}:${p(s)}:${p(f)}`;};
DS.el=(tag,cls,html)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(html!==undefined)e.innerHTML=html;return e;};
DS.svgNS='http://www.w3.org/2000/svg';
DS.svg=(w,h,inner,vb)=>{const s=document.createElementNS(DS.svgNS,'svg');s.setAttribute('viewBox',vb||`0 0 ${w} ${h}`);if(w)s.setAttribute('width',w);if(h)s.setAttribute('height',h);s.innerHTML=inner;return s;};

/* icons (24x24 stroke-based unless noted) */
DS.icons={
  check:'<path d="M4 12.5l5 5L20 6.5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>',
  x:'<path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>',
  heart:'<path d="M12 21s-7.5-4.6-9.5-9.3C1 8 3.4 4.5 7 4.5c2 0 3.6 1.1 5 2.7 1.4-1.6 3-2.7 5-2.7 3.6 0 6 3.5 4.5 7.2C19.5 16.4 12 21 12 21z" fill="currentColor"/>',
  comment:'<path d="M4 5h16v11H9l-5 4V5z" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/>',
  share:'<path d="M21 3L10 14M21 3l-7 18-4-7-7-4 18-7z" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/>',
  mute:'<path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>',
  speaker:'<path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16.5 8.5a5 5 0 010 7M19 6a8.5 8.5 0 010 12" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>',
  save:'<path d="M6 3h12v18l-6-4-6 4V3z" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/>',
  camera:'<rect x="3" y="7" width="13" height="11" rx="2" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M16 11l5-3v9l-5-3" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/>',
  play:'<path d="M7 4l13 8-13 8V4z" fill="currentColor"/>',
  thumb:'<path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" fill="currentColor"/>',
  q:'<path d="M9 9a3 3 0 115 2.4c-1 .7-2 1.3-2 2.6" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/><circle cx="12" cy="18" r="1.4" fill="currentColor"/>',
  bolt:'<path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/>',
  eye:'<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="2.2"/>',
  cal:'<rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>',
  upload:'<path d="M12 16V5m0 0l-4 4m4-4l4 4M4 17v3h16v-3" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>',
  scissors:'<circle cx="6" cy="6" r="3" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="6" cy="18" r="3" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M20 4L8.5 15.5M8.5 8.5L20 20" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>',
  film:'<rect x="3" y="4" width="18" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4" stroke="currentColor" stroke-width="2.2"/>',
  graph:'<path d="M3 20h18M5 16l4-5 4 3 6-8" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>',
  send:'<path d="M3 11l18-8-8 18-2-8-8-2z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/>',
  clock:'<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M12 7v5l3 2" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>',
  type:'<path d="M5 6V4h14v2M12 4v16M9 20h6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>',
  palette:'<path d="M12 3a9 9 0 100 18c1.5 0 2-1 2-2s-1-2 0-3 3 0 4-1 1-3 1-5a9 9 0 00-7-7z" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="8" cy="10" r="1.3" fill="currentColor"/><circle cx="12" cy="7" r="1.3" fill="currentColor"/><circle cx="16" cy="10" r="1.3" fill="currentColor"/>',
  sound:'<path d="M4 12h2M8 8v8M12 5v14M16 9v6M20 11v2" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/>',
  motion:'<path d="M4 18c4-10 8-10 16-12M4 12c3-5 6-5 12-6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><circle cx="20" cy="6" r="2" fill="currentColor"/>',
  stop:'<rect x="5" y="5" width="14" height="14" rx="3" fill="currentColor"/>',
  rays:'<path d="M12 20V9M8 20v-5M16 20v-7M4 20v-3M20 20v-9" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>',
  arc:'<path d="M4 18a8 8 0 0116 0M8 18a4 4 0 018 0" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><path d="M3 21h18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>',
  tri:'<path d="M12 4l9 16H3L12 4zM12 10l5 8H7l5-8z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/>',
  doc:'<path d="M6 3h8l4 4v14H6V3z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><path d="M9 12h6M9 16h6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>',
  phone:'<rect x="6" y="2" width="12" height="20" rx="3" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M10 18h4" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>',
  people:'<circle cx="9" cy="8" r="3.5" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M2.5 20a6.5 6.5 0 0113 0M16 9a3 3 0 110 0M15 13.5a5 5 0 016.5 6.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>',
  target:'<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/>',
  layers:'<path d="M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/>',
  mail:'<rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M3 7l9 6 9-6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/>',
  search:'<circle cx="11" cy="11" r="6" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M16 16l5 5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>',
  clap:'<path d="M3 10h18v10H3V10zM3 10l2-5 16 1-2 4" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><path d="M8 5l2 5M13 5.5l2 4.5" stroke="currentColor" stroke-width="2.2"/>',
  brain:'<path d="M9 4a3 3 0 00-3 3v1a3 3 0 00-2 3 3 3 0 002 3v1a3 3 0 003 3h1V4H9zM15 4a3 3 0 013 3v1a3 3 0 012 3 3 3 0 01-2 3v1a3 3 0 01-3 3h-1V4h1z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
  text:'<path d="M4 7h16M4 12h10M4 17h14" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/>',
  broll:'<rect x="3" y="6" width="12" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="2.2"/><rect x="9" y="3" width="12" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="2.2"/>',
  zoom:'<circle cx="11" cy="11" r="6" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M16 16l5 5M8.5 11h5M11 8.5v5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>',
  persp:'<path d="M4 20l5-14h6l5 14H4zM7.5 15h9" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/>',
  hand:'<path d="M7 11V6a1.5 1.5 0 013 0v5M10 11V4.5a1.5 1.5 0 013 0V11M13 11V6a1.5 1.5 0 013 0v7M16 13v-2a1.5 1.5 0 013 0v4a7 7 0 01-7 7h-1a7 7 0 01-5.6-2.8L3 15.5a1.6 1.6 0 012.5-2L7 15v-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>',
  mic:'<rect x="9" y="3" width="6" height="11" rx="3" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M6 11a6 6 0 0012 0M12 17v4M9 21h6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>',
  book:'<path d="M4 4h7a3 3 0 013 3v13a2 2 0 00-2-2H4V4zM20 4h-7a3 3 0 00-3 3v13a2 2 0 012-2h8V4z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/>',
  cursor:'<path d="M5 3l14 8-6 1.5L16 20l-3 1.5-3-7.5L5 17V3z" fill="#FFD43B" stroke="#17140A" stroke-width="1.5" stroke-linejoin="round"/>',
  euro:'<path d="M18 7a7 7 0 100 10M4 10h10M4 14h10" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>'
};
DS.icon=(name,cls)=>{const s=DS.svg(24,24,DS.icons[name]||DS.icons.q);if(cls)s.setAttribute('class',cls);return s;};

/* ---------- animation registration ---------- */
DS.anim=function(el,keyframes,o){
  o=o||{};
  const a=el.animate(keyframes,{delay:(o.delay||0)*1000,duration:(o.dur||.4)*1000,easing:o.easing||DS.css.out,fill:o.fill||'backwards'});
  a.pause();
  a._total=((o.delay||0)+(o.dur||.4))*1000;
  (o.beat||DS._cur).anims.push(a);
  return a;
};
DS.tween=function(fn,beat){(beat||DS._cur).updaters.push(fn);};
DS.enter=function(el,o){
  o=o||{};const d=o.dur||.42;const mode=o.mode||'up';let kf;
  switch(mode){
    case 'pop':kf=[{opacity:0,transform:'scale(.6)',filter:'blur(10px)'},{opacity:1,transform:'scale(1)',filter:'blur(0px)'}];return DS.anim(el,kf,{delay:o.delay,dur:o.dur||.5,easing:DS.css.pop,beat:o.beat});
    case 'drop':kf=[{opacity:0,transform:'translateY(-260px) scale(1.15)',filter:'blur(8px)'},{opacity:1,transform:'translateY(0) scale(1)',filter:'blur(0px)'}];return DS.anim(el,kf,{delay:o.delay,dur:o.dur||.5,easing:DS.css.io,beat:o.beat});
    case 'fade':kf=[{opacity:0},{opacity:1}];return DS.anim(el,kf,{delay:o.delay,dur:d,easing:'ease-out',beat:o.beat});
    case 'left':kf=[{opacity:0,transform:'translateX(-140px)',filter:'blur(8px)'},{opacity:1,transform:'translateX(0)',filter:'blur(0px)'}];return DS.anim(el,kf,{delay:o.delay,dur:d,beat:o.beat});
    case 'right':kf=[{opacity:0,transform:'translateX(140px)',filter:'blur(8px)'},{opacity:1,transform:'translateX(0)',filter:'blur(0px)'}];return DS.anim(el,kf,{delay:o.delay,dur:d,beat:o.beat});
    case 'rise':kf=[{opacity:0,transform:'translateY(160px)',filter:'blur(8px)'},{opacity:1,transform:'translateY(0)',filter:'blur(0px)'}];return DS.anim(el,kf,{delay:o.delay,dur:d,beat:o.beat});
    case 'depth':kf=[{opacity:0,transform:'scale(1.25)',filter:'blur(14px)'},{opacity:1,transform:'scale(1)',filter:'blur(0px)'}];return DS.anim(el,kf,{delay:o.delay,dur:o.dur||.55,beat:o.beat});
    case 'flourish':kf=[{opacity:0,transform:'rotate(-6deg) scale(.6) translateX(-40px)'},{opacity:1,transform:'rotate(-6deg) scale(1) translateX(0)'}];return DS.anim(el,kf,{delay:o.delay,dur:o.dur||.5,easing:DS.css.pop,beat:o.beat});
    default:kf=[{opacity:0,transform:'translateY(.35em) scale(.82)',filter:'blur(16px)'},{opacity:1,transform:'translateY(0) scale(1)',filter:'blur(0px)'}];return DS.anim(el,kf,{delay:o.delay,dur:d,beat:o.beat});
  }
};
DS.exit=function(el,mode,at,dur){
  dur=dur||.24;let kf;
  switch(mode){
    case 'none':case 'cut':return null;
    case 'down':kf=[{opacity:1,transform:'translateY(0)',filter:'blur(0px)'},{opacity:0,transform:'translateY(80px)',filter:'blur(8px)'}];break;
    case 'depth':kf=[{opacity:1,transform:'scale(1)',filter:'blur(0px)'},{opacity:0,transform:'scale(.9)',filter:'blur(12px)'}];break;
    case 'fade':kf=[{opacity:1},{opacity:0}];break;
    case 'zoom':kf=[{opacity:1,transform:'scale(1)',filter:'blur(0px)'},{opacity:0,transform:'scale(1.3)',filter:'blur(14px)'}];break;
    default:kf=[{opacity:1,transform:'translateY(0) scale(1)',filter:'blur(0px)'},{opacity:0,transform:'translateY(-70px) scale(1.04)',filter:'blur(8px)'}];
  }
  return DS.anim(el,kf,{delay:at,dur,easing:DS.css.io,fill:'both'});
};

/* ---------- typography ---------- */
const SIZES={xl:200,l:168,m:136,s:108,xs:84};
function splitWords(s){return s.split(/\s+/).filter(Boolean);}
function buildLine(line,ctx){
  const tl=DS.el('div','tline');
  const parts=line.parts||[Object.assign({},line)];
  const lineDelay=line.at!==undefined?line.at:ctx.delay;
  let wordIdx=0;
  parts.forEach(p=>{
    const role=p.r||'kern';
    if(role==='pill'){
      const e=DS.el('span','pill'+(p.cls?' '+p.cls:''),p.s);
      DS.enter(e,{delay:lineDelay,mode:'up',dur:.36});tl.appendChild(e);return;
    }
    if(role==='flourish'){
      const e=DS.el('span','flourish',p.s);
      DS.enter(e,{delay:lineDelay+(p.extra!==undefined?p.extra:.24),mode:'flourish'});tl.appendChild(e);return;
    }
    if(role==='data'||role==='label'){
      const e=DS.el('span',role+(p.cls?' '+p.cls:''),p.s);
      DS.enter(e,{delay:lineDelay,mode:role==='label'?'fade':'up',dur:.36});tl.appendChild(e);return;
    }
    if(role==='num'){
      const e=DS.el('span','num'+(p.cls?' '+p.cls:''),p.s||'');
      DS.enter(e,{delay:lineDelay,mode:'pop'});
      if(p.from!==undefined){const dur=p.dur||.6;DS.tween(lt=>{const x=DS.prog(lt,lineDelay+.1,dur);e.textContent=(p.prefix||'')+DS.fmt(DS.lerp(p.from,p.to,x),p.dec||0)+(p.suffix||'');});}
      tl.appendChild(e);return;
    }
    // kern / akzent
    const wrap=DS.el('span',role+(p.cls?' '+p.cls:''));
    const words=p.strike||p.nosplit?[p.s]:splitWords(p.s);
    words.forEach((w,i)=>{
      const e=DS.el('span','w'+(p.strike?' strike':''),w);
      const d=lineDelay+(role==='akzent'?.14:0)+wordIdx*.055;wordIdx++;
      DS.enter(e,{delay:d,mode:role==='akzent'?'pop':'up',dur:role==='akzent'?.5:.44});
      if(p.strike&&p.strikeAt!==undefined){e.classList.remove('strike');DS.tween(lt=>{e.classList.toggle('strike',lt>=p.strikeAt);});}
      wrap.appendChild(e);if(i<words.length-1)wrap.appendChild(document.createTextNode(' '));
    });
    if(p.size)wrap.style.fontSize=p.size+'px';
    tl.appendChild(wrap);
  });
  return tl;
}
function fitLine(tl,maxW){
  const kerns=[...tl.querySelectorAll('.kern,.akzent')];
  const others=[...tl.querySelectorAll('.pill,.flourish,.data,.label,.num')];
  const over=()=>tl.scrollWidth>maxW+2;
  let guard=0;
  if(kerns.length){
    let fs=parseFloat(getComputedStyle(kerns[0]).fontSize);
    let stretch=88;
    while(over()&&guard<40){
      guard++;
      if(stretch>72){stretch-=4;kerns.forEach(k=>k.style.fontStretch=stretch+'%');continue;}
      fs=Math.round(fs*.93);kerns.forEach(k=>k.style.fontSize=fs+'px');
      if(fs<92)break;
    }
  }
  guard=0;
  while(over()&&others.length&&guard<20){
    guard++;
    let minFs=999;
    others.forEach(o=>{const f=parseFloat(getComputedStyle(o).fontSize)*.93;o.style.fontSize=Math.round(f)+'px';minFs=Math.min(minFs,f);});
    if(minFs<30)break;
  }
  if(over())tl.classList.add('wrapok');
}
DS.buildText=function(spec,beat){
  const blk=DS.el('div','tblock');
  const base=SIZES[spec.size||'l'];
  let delay=spec.delay||0;
  (spec.lines||[]).forEach((line,i)=>{
    const tl=buildLine(line,{delay});
    if(line.gap!==undefined)tl.style.marginTop=line.gap+'px';
    blk.appendChild(tl);
    tl.querySelectorAll('.kern,.akzent').forEach(k=>{k.style.fontSize=(line.size?SIZES[line.size]||line.size:base)+'px';});
    if(line.at===undefined)delay+= (line.step!==undefined?line.step:.13);
    else delay=line.at+.13;
  });
  if(spec.width)blk.style.width=spec.width+'px';
  return blk;
};

/* ---------- beats ---------- */
DS.load=function(spec){
  DS.spec=spec;DS.fps=spec.fps||25;
  const scene=document.getElementById('scene');scene.innerHTML='';
  document.getElementById('ident').innerHTML='';
  DS.beats=[];
  const all=(spec.beats||[]).slice();
  if(spec.ident){all.push({t0:spec.ident.at,dur:spec.ident.dur||2.0,exit:'none',obj:{type:'ident',mode:spec.ident.mode||'short',dur:spec.ident.dur||2.0},isIdent:true,layout:'overlay'});}
  all.forEach((bs,idx)=>{
    const b={spec:bs,t0:bs.t0,dur:bs.dur,keep:bs.keep||0,anims:[],updaters:[],idx};
    DS._cur=b;
    const el=DS.el('div','beat layout-'+(bs.layout||(bs.obj?'textTop':'center'))+(bs.text&&bs.text.bg==='cap'||bs.bg==='cap'?' bg-cap':''));
    const inner=DS.el('div','inner');inner.style.cssText='position:absolute;inset:0';
    el.appendChild(inner);
    el.classList.add('on');scene.appendChild(el); // in DOM early so components can measure themselves
    if(bs.bg==='cap'){inner.style.background='var(--cap)';}
    const content=DS.el('div','content');inner.appendChild(content);
    if(bs.layout==='overlay'){content.style.display='none';}
    // text
    if(bs.text){const tb=DS.buildText(bs.text,b);content.appendChild(tb);b.textEl=tb;}
    // objects
    const objs=bs.obj?(Array.isArray(bs.obj)?bs.obj:[bs.obj]):[];
    if(objs.length){
      const area=DS.el('div','obj');
      area.style.flexDirection=bs.objDir||'column';area.style.gap=(bs.objGap!==undefined?bs.objGap:40)+'px';
      // attach before building so components can measure their real size
      if(bs.layout==='overlay'){area.style.cssText+=';position:absolute;inset:0;display:block';inner.appendChild(area);}
      else if(bs.layout==='textBottom')content.insertBefore(area,content.firstChild); else content.appendChild(area);
      objs.forEach(os=>{
        const f=DS.components[os.type];
        if(!f){console.warn('unknown component',os.type);return;}
        let node=f(os,b);
        if(node){
          if(node.parentNode===area){ /* already wrapped & appended */ }
          else if(os.abs){node.style.position='absolute';if(os.x!==undefined)node.style.left=os.x+'px';if(os.y!==undefined)node.style.top=os.y+'px';inner.appendChild(node);}
          else area.appendChild(node);
          if(os.shift||os.scale){
            const sc=os.scale||1;const wrap=DS.el('div');wrap.style.cssText='position:relative;flex:0 0 auto';
            area.appendChild(wrap);wrap.appendChild(node);
            const r=node.getBoundingClientRect();
            wrap.style.width=Math.round(r.width*sc)+'px';wrap.style.height=Math.round(r.height*sc)+'px';
            if(os.shift){wrap.style.marginLeft=(os.shift[0]||0)+'px';wrap.style.marginTop=(os.shift[1]||0)+'px';}
            node.style.position='absolute';node.style.left='50%';node.style.top='50%';
            node.style.transform=`translate(-50%,-50%) scale(${sc})`;node.style.transformOrigin='50% 50%';
            node=wrap;
          }
          if(os.enter!==false&&!os.selfEnter){DS.enter(node,{delay:os.at||0,mode:os.mode||'rise',dur:.5});}
          if(typeof os.outAt==='number'){DS.anim(node,[{opacity:1,filter:'blur(0px)',transform:'scale(1)'},{opacity:0,filter:'blur(12px)',transform:'scale(.94)'}],{delay:os.outAt,dur:os.outDur||.5,easing:DS.css.io});}
        }
      });
      if(!area.children.length)area.remove();
    }
    // absolute decorations
    (bs.abs||[]).forEach(as=>{const f=DS.components[as.type];if(!f)return;const node=f(as,b);if(!node)return;node.style.position='absolute';node.style.left=(as.x||0)+'px';node.style.top=(as.y||0)+'px';inner.appendChild(node);if(as.enter!==false&&!as.selfEnter)DS.enter(node,{delay:as.at||0,mode:as.mode||'pop',dur:.4});});
    // cursors
    (bs.cursors||[]).forEach(cs=>DS.components.cursor(cs,b).forEach(n=>inner.appendChild(n)));
    // tcbar
    if(bs.hud&&bs.hud.tcbar)b.tcbar=bs.hud.tcbar;
    // exit
    if(!bs.isIdent){const mode=bs.exit||'up';if(mode!=='none'&&mode!=='cut')DS.exit(inner,mode,Math.max(0,bs.dur-.24),.24);}
    b.el=el;b.inner=inner;
    DS.beats.push(b);
  });
  // measure & fit (all beats displayed)
  DS.beats.forEach(b=>{b.el.querySelectorAll('.tline').forEach(tl=>fitLine(tl,960));});
  DS.beats.forEach(b=>b.el.classList.remove('on'));
  DS._cur=null;
  DS.seek(0);
};
DS.duration=function(){let d=0;DS.beats.forEach(b=>{d=Math.max(d,b.t0+b.dur+(b.spec.hold||0));});return d;};

const rec=document.getElementById('rec'),rectc=document.getElementById('rectc'),recdot=rec.querySelector('.dot');
const tcbar=document.getElementById('tcbar'),tcfill=document.getElementById('tcfill'),tcdot=document.getElementById('tcdot'),tclbl=document.getElementById('tclbl');
const flash=document.getElementById('flash'),stage=document.getElementById('stage'),cam=document.getElementById('cam'),sweep=document.getElementById('sweep');

DS.seek=function(t){
  const spec=DS.spec||{};
  // camera drift
  const dx=Math.sin(t*.37)*10,dy=Math.cos(t*.29)*8,rot=Math.sin(t*.23)*.35;
  let camScale=1.02,punch=0,flashA=0,recCap=false,recOn=spec.hud?spec.hud.rec!==false:true;
  let tcState=null;
  DS.beats.forEach(b=>{
    const lt=t-b.t0;
    const on=lt>=0&&lt<b.dur+b.keep&&!(b.spec.offAt!==undefined&&lt>=b.spec.offAt);
    b.el.classList.toggle('on',on);
    if(!on)return;
    const ms=Math.max(0,lt*1000);
    b.anims.forEach(a=>{a.currentTime=ms;});
    b.updaters.forEach(u=>u(lt));
    if(b.spec.punch&&lt<.32)punch=Math.max(punch,(1-DS.ease.out(lt/.32))*(typeof b.spec.punch==='number'?b.spec.punch:.08));
    if(b.spec.flash&&lt<.09)flashA=Math.max(flashA,.9*(1-lt/.09));
    if(b.spec.cam==='push')camScale+=.05*DS.ease.io(DS.clamp01(lt/b.dur));
    if(b.spec.recCap)recCap=true;
    if(b.tcbar){
      const c=b.tcbar;const st=c.start||0;const dur=c.dur||1.7;
      let p=DS.clamp01((lt-st)/dur);
      if(c.stopAt!==undefined)p=Math.min(p,c.stopAt);
      let state='';if(c.stopAt!==undefined&&p>=c.stopAt-1e-6)state='teal';else if(p>=1&&c.red!==false)state='red';
      tcState={p,state,label:state==='red'?(c.redLabel||'1,7 s · weggewischt'):state==='teal'?(c.tealLabel||'0,5 s · Hook'):(c.label||''),vis:lt>=st-.3};
    }
  });
  cam.style.transform=`translate(${dx}px,${dy}px) rotate(${rot}deg) scale(${camScale})`;
  sweep.style.transform=`translate(${Math.sin(t*.11)*140}px,${Math.cos(t*.09)*120}px) rotate(${-28+Math.sin(t*.07)*6}deg)`;
  stage.style.transform=punch?`scale(${1+punch})`:'';
  flash.style.opacity=flashA;
  rec.style.opacity=recOn?.85:0;rectc.textContent=DS.tc(t);recdot.classList.toggle('cap',recCap);
  if(tcState&&tcState.vis){tcbar.style.opacity=1;tcfill.style.width=(tcState.p*100)+'%';tcdot.style.left=(tcState.p*100)+'%';tcbar.className=tcState.state;tclbl.textContent=tcState.label;}
  else{tcbar.style.opacity=0;}
};
})();
