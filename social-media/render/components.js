/* Daumenstopp components · each returns a DOM node and registers animations/tweens on the beat */
(function(){
const C=DS.components, el=DS.el, lerp=DS.lerp, prog=DS.prog;

/* decorative "footage" for clip screens */
function clipArt(flat,seed){
  const a=el('div','clipart'+(flat?' flat':''));
  const cols=[['#2b3a5a','#1b2440'],['#5a3a2b','#2b1c14'],['#2b5a4a','#143028'],['#4a2b5a','#241428']];
  const c=cols[(seed||0)%cols.length];
  a.style.background=`linear-gradient(180deg,${c[0]} 0%,${c[1]} 100%)`;
  const s1=el('div','shape');s1.style.cssText=`left:-20%;top:-10%;width:90%;height:50%;background:rgba(255,212,59,.22)`;
  const s2=el('div','shape');s2.style.cssText=`right:-30%;bottom:10%;width:90%;height:60%;background:rgba(60,201,180,.18)`;
  const p=el('div','person');p.appendChild(el('div','head'));
  a.append(s1,s2,p);return a;
}
C._clipArt=clipArt;

/* ---------- phone ---------- */
C.phone=function(o,b){
  const ph=el('div','phone');
  const scr=el('div','screen');ph.appendChild(scr);
  ph.appendChild(el('div','notch'));
  const st=el('div','status','<span>9:24</span><span>●●● ▮</span>');ph.appendChild(st);
  if(o.w){ph.style.width=o.w+'px';ph.style.height=Math.round(o.w*1180/560)+'px';}
  if(o.tilt){ph.style.transform=`perspective(2400px) rotateY(${o.tilt}deg)`;}
  const s=o.screen||{kind:'clip'};
  const kind=s.kind||'clip';
  if(kind==='feed'){
    const fwrap=el('div');fwrap.style.cssText='position:absolute;inset:0;overflow:hidden;will-change:filter';scr.appendChild(fwrap);
    const feed=el('div','feed');fwrap.appendChild(feed);
    const titles=s.titles||['Neues Produkt','Behind the scenes','Unser Team','Angebot der Woche','So funktioniert es','Kundenstimme','Event Recap','Tutorial'];
    const n=s.cards||12;
    for(let i=0;i<n;i++){
      const c=el('div','fcard');c.appendChild(clipArt(false,i));
      c.appendChild(el('div','fhandle',`<i></i><span>@marke_${String(i+1).padStart(2,'0')}</span>`));
      if(s.labels!==false)c.appendChild(el('div','ftc','1,7 s'));
      c.appendChild(el('div','ftitle',titles[i%titles.length]));
      feed.appendChild(c);
    }
    const speed=s.speed||3;const stopAt=s.stopAt;const start=s.start||0;
    DS.tween(lt=>{
      let tt=Math.max(0,lt-start);
      if(stopAt!==undefined)tt=Math.min(tt,stopAt-start);
      const moving=stopAt===undefined||lt<stopAt;
      const y=-(tt*speed*1152);
      feed.style.transform=`translateY(${y}px)`;
      fwrap.style.filter=moving&&s.blur!==false?'blur(4px)':'none';
    });
  } else if(kind==='blank'){
    scr.style.background='#000';
  } else if(kind==='dm'){
    const list=el('div','dmlist');list.appendChild(el('div','dmhead',s.title||'Anfragen'));
    (s.items||[]).forEach((it,i)=>{const r=el('div','dmrow',`<i></i><div><div class="dn">${it.name}</div><div class="dt">${it.text}</div></div><span class="dd"></span>`);list.appendChild(r);DS.enter(r,{delay:(s.at||.2)+i*.12,mode:'left',dur:.4});});
    scr.appendChild(list);
  } else if(kind==='comments'){
    scr.appendChild(clipArt(false,2));
    const wrap=el('div');wrap.style.cssText='position:absolute;left:24px;right:24px;bottom:120px;display:flex;flex-direction:column;gap:18px';
    (s.items||[]).forEach((it,i)=>{const c=el('div','ccard',`<i class="av"></i><div class="cb"><div class="cn"><b>${it.name}</b> · ${it.time||'2 Wo.'}</div><div class="ct">${it.text}</div></div>`);c.style.width='auto';c.style.padding='24px 26px';c.querySelector('.ct').style.fontSize='28px';wrap.appendChild(c);DS.enter(c,{delay:(s.at||.3)+i*.3,mode:'rise',dur:.45});});
    scr.appendChild(wrap);
  } else if(kind==='insights'){
    scr.style.background='#0a0b0e';
    const head=el('div','dmhead',s.title||'Insights');head.style.cssText='position:absolute;left:0;right:0;top:110px;text-align:center';scr.appendChild(head);
    const box=el('div');box.style.cssText='position:absolute;left:30px;right:30px;top:220px;height:520px;border-radius:24px;background:#121419;border:1px solid var(--line-2);padding:30px';
    box.innerHTML=`<div class="label" style="font-size:22px">Retention</div>`;
    const svg=DS.svg(440,380,`<path id="rc" d="" fill="none" stroke="#3CC9B4" stroke-width="6" stroke-linecap="round"/><line x1="60" y1="0" x2="60" y2="380" stroke="rgba(238,236,230,.18)" stroke-dasharray="6 8"/><text x="68" y="24" fill="#9296A1" font-family="IBM Plex Mono" font-size="20">3 s</text><circle id="rd" cx="60" cy="0" r="12" fill="#FFD43B"/>`);
    svg.style.cssText='width:100%;height:380px;margin-top:20px';box.appendChild(svg);scr.appendChild(box);
    const path=svg.querySelector('#rc'),dot=svg.querySelector('#rd');
    const pts=[];for(let i=0;i<=40;i++){const x=i/40;const y=1-(0.98-0.62*Math.pow(x,.45));pts.push([x*440,y*340+20]);}
    DS.tween(lt=>{const p=prog(lt,.3,1.2);const k=Math.max(1,Math.round(p*40));path.setAttribute('d','M'+pts.slice(0,k+1).map(q=>q.join(',')).join(' L'));const q=pts[Math.round(40*60/440)];dot.setAttribute('cy',q[1]);dot.style.opacity=p>.2?1:0;});
    const val=el('div','data cap',s.value||'48 %');val.style.cssText='position:absolute;left:30px;bottom:140px;font-size:72px';scr.appendChild(val);
    const vl=el('div','label',s.valueLabel||'Hook-Rate');vl.style.cssText='position:absolute;left:30px;bottom:230px';scr.appendChild(vl);
  } else if(kind==='profile'){
    scr.style.background='#0a0b0e';
    const head=el('div');head.style.cssText='position:absolute;left:30px;right:30px;top:110px;display:flex;align-items:center;gap:24px';
    head.innerHTML=`<div style="width:120px;height:120px;border-radius:50%;background:var(--cap);display:flex;align-items:center;justify-content:center;color:#17140A"></div><div><div style="font:600 32px var(--f-body);color:var(--paper)">${s.handle||'daumenstopp'}</div><div style="font:500 22px var(--f-mono);color:var(--mute);margin-top:8px">${s.sub||'Content, der den Daumen stoppt.'}</div></div>`;
    head.firstChild.appendChild(DS.icon('thumb'));head.firstChild.firstChild.style.cssText='width:64px;height:64px';
    scr.appendChild(head);
    const grid=el('div');grid.style.cssText='position:absolute;left:12px;right:12px;top:290px;display:grid;grid-template-columns:repeat(3,1fr);gap:8px';
    for(let i=0;i<9;i++){const c=el('div');c.style.cssText='height:300px;border-radius:10px;overflow:hidden;position:relative;background:#121419';const a=clipArt(false,i);a.style.opacity=.6;c.appendChild(a);const t=el('div');t.style.cssText='position:absolute;left:14px;right:14px;bottom:16px;font:900 30px var(--f-display);font-stretch:88%;text-transform:uppercase;color:var(--paper);line-height:.95';t.innerHTML=(s.covers||['1,7 Sek.','STOPP.','Roh → Edit','5 Hooks','2–4 Sek.','Ohne Ton','72 Min.','0,00 €','A·B·C'])[i].replace(/\S+$/,m=>`<span style="color:var(--cap)">${m}</span>`);c.appendChild(t);grid.appendChild(c);DS.enter(c,{delay:(s.at||.2)+i*.05,mode:'pop',dur:.4});}
    scr.appendChild(grid);
  } else { // clip / review
    scr.appendChild(clipArt(!!s.flat,s.seed||0));
    if(s.handle!==false){const h=el('div','fhandle',`<i></i><span>${s.handle||'@marke'}</span>`);h.style.cssText='position:absolute;left:40px;top:120px;display:flex;align-items:center;gap:16px;font:400 26px var(--f-body);color:var(--paper);z-index:4';h.querySelector('i').style.cssText='width:54px;height:54px;border-radius:50%;background:var(--ink-3);border:2px solid var(--line-2);display:inline-block';scr.appendChild(h);}
    if(s.tc!==false){const tcd=el('div','ftc','00:00:00:00');tcd.style.cssText='position:absolute;right:40px;top:120px;font:500 26px var(--f-mono);color:var(--cap);background:rgba(0,0,0,.5);padding:8px 14px;border-radius:10px;z-index:4';scr.appendChild(tcd);DS.tween(lt=>{tcd.textContent=DS.tc(Math.max(0,lt-(s.tcStart||0)));});}
    if(s.ui!==false){
      const ui=el('div','ui');[['heart',s.likes||'1.2K'],['comment',s.comments||'84'],['share',s.shares||'310']].forEach(([ic,ct])=>{const w=el('div');w.style.cssText='display:flex;flex-direction:column;align-items:center;gap:8px';const i=el('div','ic');i.appendChild(DS.icon(ic));i.firstChild.style.color='var(--paper)';w.appendChild(i);w.appendChild(el('div','ct',ct));ui.appendChild(w);});
      scr.appendChild(ui);
    }
    if(s.muted){const m=el('div','mute-ico');m.appendChild(DS.icon('mute'));m.firstChild.style.color='var(--rec)';m.firstChild.style.width='64px';m.firstChild.style.height='64px';scr.appendChild(m);}
    if(s.caption){
      const cb=el('div','capbar'+(s.capCls?' '+s.capCls:''));
      const words=s.caption.split(/\s+/);
      words.forEach((w,i)=>{const hi=w.startsWith('*');const sp=el('span','cw'+(hi?' hi':''),w.replace(/^\*/,''));cb.appendChild(sp);const at=(s.capAt||.3)+i*(s.capStep||.18);if(s.capAnim!==false)DS.enter(sp,{delay:at,mode:'pop',dur:.3});});
      if(s.capSmall)cb.classList.add('small');
      scr.appendChild(cb);
    }
    if(s.scaption){scr.appendChild(el('div','scaption',`<b>${s.handle||'@marke'}</b>${s.scaption}`));}
    if(s.pin){
      const pin=C.pin(Object.assign({},s.pin),b);pin.style.position='absolute';pin.style.left=(s.pin.x||120)+'px';pin.style.top=(s.pin.y||520)+'px';pin.style.zIndex=8;scr.appendChild(pin);
    }
    if(s.cover){const cv=el('div');cv.style.cssText='position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.35);z-index:3';const t=el('div');t.style.cssText='font:900 110px var(--f-display);font-stretch:84%;text-transform:uppercase;color:var(--paper);text-align:center;line-height:.92;padding:0 30px';t.innerHTML=s.cover;cv.appendChild(t);scr.appendChild(cv);}
    if(s.frozen){scr.style.filter='contrast(1.05)';}
  }
  if(o.glow){ph.style.boxShadow='0 40px 90px rgba(0,0,0,.7),0 0 0 2px var(--cap),0 0 80px rgba(255,212,59,.25)';}
  return ph;
};

/* ---------- pin (review comment) ---------- */
C.pin=function(o,b){
  const p=el('div','pin');
  p.innerHTML=`<div class="dotp"></div><div class="pc">${o.tc?`<small>${o.tc}</small>`:''}${o.text||'Logo 10 % größer'}</div>`;
  if(o.at!==undefined&&!o.noAnim){DS.enter(p,{delay:o.at,mode:'pop',dur:.4});}
  return p;
};

/* ---------- cursors ---------- */
C.cursor=function(cs,b){
  const nodes=[];
  const c=el('div','cursor');
  c.appendChild(DS.svg(46,46,DS.icons.cursor,'0 0 24 24'));
  c.appendChild(el('div','tag',cs.name||'Editor'));
  const path=cs.path||[[0,540,960]];
  const clicks=cs.clicks||[];
  const hideAt=cs.hideAt;
  DS.tween(lt=>{
    if(lt<path[0][0]-.3||(hideAt!==undefined&&lt>hideAt)){c.style.opacity=0;return;}
    c.style.opacity=Math.min(1,(lt-(path[0][0]-.3))/.3);
    let x=path[0][1],y=path[0][2];
    for(let i=0;i<path.length-1;i++){
      const a=path[i],d=path[i+1];
      if(lt>=d[0]){x=d[1];y=d[2];continue;}
      if(lt>=a[0]){const p=DS.ease.io(DS.clamp01((lt-a[0])/Math.max(.01,d[0]-a[0])));x=lerp(a[1],d[1],p);y=lerp(a[2],d[2],p);break;}
    }
    c.style.transform=`translate(${x}px,${y}px)`;
    c.classList.toggle('clicking',clicks.some(t=>lt>=t&&lt<t+.14));
  });
  nodes.push(c);
  return nodes;
};

/* ---------- bars ---------- */
C.bars=function(o,b){
  const w=el('div','bars');
  const colors={r:'var(--clip-r)',t:'var(--clip-t)',v:'var(--clip-v)',cap:'var(--cap)',paper:'var(--paper)',grey:'#3a3e48'};
  (o.items||[]).forEach((it,i)=>{
    const row=el('div','bar');
    row.innerHTML=`<div class="bk">${it.k||''}</div><div class="bt"><div class="bf"></div>${it.label?`<div class="bl">${it.label}</div>`:''}</div><div class="bv"></div>`;
    const bf=row.querySelector('.bf'),bv=row.querySelector('.bv');
    bf.style.background=colors[it.c||'cap']||it.c;
    const at=it.at!==undefined?it.at:(o.at||.2)+i*(o.step||.5);const dur=it.dur||o.dur||.9;
    DS.enter(row,{delay:Math.max(0,at-.2),mode:'left',dur:.4});
    if(it.dimAt!==undefined)DS.anim(row,[{opacity:1},{opacity:.3}],{delay:it.dimAt,dur:.3});
    DS.tween(lt=>{const p=prog(lt,at,dur);bf.style.width=(it.v*p)+'%';bv.textContent=DS.fmt(it.v*p,it.dec||0)+(it.suffix!==undefined?it.suffix:' %');if(it.hiAt!==undefined&&lt>=it.hiAt){bf.style.boxShadow=`0 0 40px ${colors[it.c||'cap']}`;bv.style.color='var(--cap)';}});
    w.appendChild(row);
  });
  if(o.label){const l=el('div','label',o.label);l.style.cssText='text-align:center;margin-top:10px';w.appendChild(l);DS.enter(l,{delay:(o.at||.2)+.4,mode:'fade'});}
  return w;
};

/* ---------- slider (before/after) ---------- */
C.slider=function(o,b){
  const s=el('div','slider'+(o.w&&o.w<800?' small':''));
  if(o.w){s.style.width=o.w+'px';s.style.height=(o.h||Math.round(o.w*1.1))+'px';}
  const before=el('div','side before');before.appendChild(clipArt(true,o.seed||1));
  const after=el('div','side after');after.appendChild(clipArt(false,o.seed||1));
  const cap=el('div','capbar');cap.style.cssText='position:absolute;left:40px;right:40px;bottom:110px;display:flex;flex-wrap:wrap;gap:8px 14px;justify-content:center';
  (o.caption||'So stoppst du den *Scroll.').split(' ').forEach(w=>{cap.appendChild(el('span','cw'+(w.startsWith('*')?' hi':''),w.replace(/^\*/,'')));});
  after.appendChild(cap);
  const handle=el('div','handle');handle.appendChild(el('i'));
  s.append(before,after,handle);
  s.appendChild(el('div','tag l',o.left||'ROH · S-LOG3'));s.appendChild(el('div','tag r',o.right||'DAUMENSTOPP-EDIT'));
  if(o.tc!==false){const tc=el('div','tag');tc.style.cssText='position:absolute;left:50%;bottom:34px;transform:translateX(-50%);top:auto';tc.textContent=o.tcText||'00:00:04:17';s.appendChild(tc);}
  let marks=null;
  if(o.marks){marks=el('div','mark');for(let i=0;i<o.marks;i++)marks.appendChild(el('b'));s.appendChild(marks);}
  const keys=o.keys||[[0,.5],[o.dur||1.2,o.to!==undefined?o.to:.95]];
  DS.tween(lt=>{
    let p=keys[0][1];
    for(let i=0;i<keys.length-1;i++){const a=keys[i],d=keys[i+1];if(lt>=d[0]){p=d[1];continue;}if(lt>=a[0]){p=lerp(a[1],d[1],DS.ease.io(DS.clamp01((lt-a[0])/Math.max(.01,d[0]-a[0]))));break;}}
    handle.style.left=(p*100)+'%';after.style.clipPath=`inset(0 0 0 ${p*100}%)`;
    if(marks&&o.markAt){[...marks.children].forEach((m,i)=>m.classList.toggle('on',lt>=o.markAt[i]));}
  });
  return s;
};

/* ---------- cards ---------- */
C.cards=function(o,b){
  const w=el('div','cards');
  (o.items||[]).forEach((it,i)=>{
    const c=el('div','card'+(o.wide?' wide':'')+(o.row?' row':'')+(o.small?' sm':''));
    if(it.n!==undefined)c.appendChild(el('div','cn',String(it.n).padStart(2,'0')));
    if(it.icon){const ci=el('div','ci');ci.appendChild(DS.icon(it.icon));c.appendChild(ci);}
    if(it.big){const bg=el('div','num',it.big);bg.style.fontSize='120px';c.appendChild(bg);}
    c.appendChild(el('div','cl',it.label||''));
    const at=it.at!==undefined?it.at:(o.at||.1)+i*(o.step||.14);
    DS.enter(c,{delay:at,mode:o.mode||'rise',dur:.5});
    if(it.hiAt!==undefined||it.dimAt!==undefined||it.outAt!==undefined)DS.tween(lt=>{c.classList.toggle('hi',it.hiAt!==undefined&&lt>=it.hiAt);c.classList.toggle('dim',it.dimAt!==undefined&&lt>=it.dimAt);});
    if(it.outAt!==undefined)DS.anim(c,[{opacity:1,transform:'translateY(0) rotate(0deg)'},{opacity:0,transform:'translateY(300px) rotate(12deg)'}],{delay:it.outAt,dur:.4,easing:DS.css.io});
    else if(it.hi)c.classList.add('hi');
    w.appendChild(c);
  });
  if(o.width)w.style.width=o.width+'px';
  return w;
};

/* ---------- counter ---------- */
C.counter=function(o,b){
  const w=el('div','counter'+(o.sm?' sm':'')+(o.mono?' mono':''));
  if(o.prefix)w.appendChild(el('span','pre',o.prefix));
  const v=el('span','val','');w.appendChild(v);
  if(o.suffix)w.appendChild(el('span','suf',o.suffix));
  const at=o.at||.15,dur=o.dur||.9;
  DS.tween(lt=>{const p=prog(lt,at,dur,o.ease==='lin'?DS.ease.lin:DS.ease.out);v.textContent=DS.fmt(lerp(o.from||0,o.to,p),o.dec||0);if(o.stopPop&&lt>=at+dur&&lt<at+dur+.2){const q=1+.06*Math.sin(((lt-at-dur)/.2)*Math.PI);w.style.transform=`scale(${q})`;}else w.style.transform='';});
  return w;
};

/* ---------- receipt printer ---------- */
C.receipt=function(o,b){
  const w=el('div','receipt');
  const slot=el('div','slot');
  const pw=el('div','paperwrap');const paper=el('div','paper');
  paper.appendChild(el('div','rt',o.title||'DAUMENSTOPP · AUSZUG'));
  const lines=(o.lines||[]).map((ln,i)=>{const r=el('div','rl'+(ln.tot?' tot':'')+(ln.hi?' hi':''));r.innerHTML=`<span>${ln.k}</span><span class="${ln.red?'red':''}">${ln.v}</span>`;paper.appendChild(r);return {r,ln,i};});
  if(o.barcode!==false)paper.appendChild(el('div','bc'));
  paper.appendChild(el('div','tear'));
  pw.appendChild(paper);w.append(slot,pw);
  const at=o.at||.2,printDur=o.printDur||(lines.length*.6+.6);
  DS.tween(lt=>{
    const p=prog(lt,at,printDur,DS.ease.lin);
    const total=paper.offsetHeight||700;
    let y=-total+p*(total+20);
    if(o.tearAt!==undefined&&lt>=o.tearAt){const q=prog(lt,o.tearAt,.5,DS.ease.io);y+=q*900;paper.style.transform=`translateY(${y}px) rotate(${q*8}deg)`;paper.style.opacity=1-q;}
    else {paper.style.transform=`translateY(${y}px)`;paper.style.opacity=1;}
    lines.forEach(({r,ln,i})=>{const la=ln.at!==undefined?ln.at:at+.25+(i+1)/(lines.length+1)*printDur;r.classList.toggle('on',lt>=la);if(ln.hiAt!==undefined)r.classList.toggle('hi',lt>=ln.hiAt);});
  });
  return w;
};

/* ---------- table ---------- */
C.table=function(o,b){
  const t=el('div','table'+(o.cols&&o.cols.length>=4?' cols4':''));
  if(o.width)t.style.width=o.width+'px';
  const head=el('div','tr');(o.cols||[]).forEach((c,ci)=>{const h=el('div','th',c);if(o.hiCol===ci)h.classList.add('col-hi');head.appendChild(h);});t.appendChild(head);
  DS.enter(head,{delay:o.at||.1,mode:'fade'});
  (o.rows||[]).forEach((row,ri)=>{
    const tr=el('div','tr');
    row.forEach((cell,ci)=>{
      const td=el('div','td'+(ci===0?' k':''));
      if(o.hiCol===ci)td.classList.add('col-hi');
      if(cell&&typeof cell==='object'){
        if(cell.t==='chk'){const k=el('span','chk');k.appendChild(DS.icon('check'));k.firstChild.style.color='#0B0C0F';td.appendChild(k);}
        else if(cell.t==='x'){td.appendChild(el('span','x','×'));}
        else {td.textContent=cell.s||'';if(cell.cls)td.classList.add(cell.cls);}
      } else td.textContent=cell;
      tr.appendChild(td);
    });
    const at=(o.at||.1)+.15+ri*(o.step||.22);
    DS.enter(tr,{delay:at,mode:'left',dur:.4});
    if(o.hiRow===ri)tr.classList.add('hi');
    if(o.hiRowAt&&o.hiRowAt[ri]!==undefined)DS.tween(lt=>tr.classList.toggle('hi',lt>=o.hiRowAt[ri]));
    t.appendChild(tr);
  });
  return t;
};

/* ---------- comments stack ---------- */
C.comments=function(o,b){
  const w=el('div');w.style.cssText='display:flex;flex-direction:column;gap:26px;align-items:center';
  (o.items||[]).forEach((it,i)=>{
    const c=el('div','ccard'+(it.typing?' typing':''));
    c.innerHTML=`<i class="av"></i><div class="cb"><div class="cn"><b>${it.name||'nutzer'}</b> · ${it.time||'vor 2 Wo.'}</div><div class="ct"></div><div class="cm"><span>Antworten</span><span>Verbergen</span></div></div><div class="cl">${DS.icons.heart?'':''}<span>${it.likes||''}</span></div>`;
    const cl=c.querySelector('.cl');cl.insertBefore(DS.icon('heart'),cl.firstChild);cl.firstChild.style.color=it.liked?'var(--cap)':'var(--mute)';
    const ct=c.querySelector('.ct');
    const at=it.at!==undefined?it.at:(o.at||.2)+i*(o.step||.5);
    DS.enter(c,{delay:at,mode:it.mode||'rise',dur:.45});
    if(it.typing){const txt=it.text;const td=it.typeDur||Math.min(1.6,txt.length*.07);DS.tween(lt=>{const p=prog(lt,at+.2,td,DS.ease.lin);ct.textContent=txt.slice(0,Math.round(p*txt.length));});}
    else ct.textContent=it.text;
    if(it.replyAt!==undefined){const rp=el('div','pill cap sm',it.reply||'Antworten');rp.style.cssText='position:absolute;left:150px;bottom:-30px';c.appendChild(rp);DS.enter(rp,{delay:it.replyAt,mode:'pop',dur:.3});}
    w.appendChild(c);
  });
  return w;
};

/* ---------- calendar ---------- */
C.calendar=function(o,b){
  const days=o.days||['Mo','Di','Mi','Do','Fr','Sa','So'];
  const w=el('div','calendar'+(o.strip?' strip':''));
  if(o.strip)w.style.gridTemplateColumns=`repeat(${days.length},1fr)`;
  days.forEach(d=>w.appendChild(el('div','dn',d)));
  const rows=o.rows||1;const cells=[];
  for(let r=0;r<rows;r++)for(let i=0;i<days.length;i++){const c=el('div','cell');const f=el('div','fillc');c.appendChild(f);const k=el('div','ck','✓');c.appendChild(k);w.appendChild(c);cells.push({c,f,k});}
  DS.enter(w,{delay:o.at||0,mode:'rise',dur:.5});
  (o.fills||[]).forEach(fl=>{const cell=cells[fl.i];if(!cell)return;cell.f.className='fillc '+(fl.c||'cap');DS.tween(lt=>{const p=prog(lt,fl.at,fl.dur||.35,DS.ease.pop);cell.f.style.transform=`scaleY(${Math.max(0,p)})`;cell.k.style.opacity=fl.c==='cap'&&p>.9?1:0;if(fl.outAt!==undefined&&lt>=fl.outAt){const q=prog(lt,fl.outAt,.3);cell.f.style.transform=`scaleY(${1-q})`;}});});
  if(o.height){[...w.querySelectorAll('.cell')].forEach(c=>c.style.height=o.height+'px');}
  return w;
};

/* ---------- pipeline ---------- */
C.pipeline=function(o,b){
  const st=o.stations||['Upload','Schnitt','Review','Live'];
  const w=el('div','pipeline');
  w.appendChild(el('div','line'));const prog_=el('div','prog');w.appendChild(prog_);
  const n=st.length;const xs=st.map((s,i)=>60+(940-120)*i/(n-1));
  const nodes=st.map((s,i)=>{const c=el('div','st');c.style.left=xs[i]+'px';const l=el('div','sl',s);l.style.left=xs[i]+'px';w.append(c,l);return {c,l};});
  const dot=el('div','pd');w.appendChild(dot);
  const at=o.at||.2,dur=o.dur||2.2;
  DS.tween(lt=>{const p=prog(lt,at,dur,DS.ease.io);const x=lerp(xs[0],xs[n-1],p);dot.style.left=x+'px';prog_.style.width=(x-60)+'px';nodes.forEach((nd,i)=>{const on=x>=xs[i]-2;nd.c.classList.toggle('on',on);nd.l.classList.toggle('on',on);});});
  return w;
};

/* ---------- curves ---------- */
C.curves=function(o,b){
  const w=el('div','curves');
  if(o.h){w.style.height=o.h+'px';}
  const W=940,H=o.h||620;
  const series=o.series||[{c:'#FF6B8B',k:'fall',label:'Ohne System'},{c:'#3CC9B4',k:'hold',label:'Mit STOPP-Taktung'}];
  const pts=s=>{const arr=[];for(let i=0;i<=60;i++){const x=i/60;let y;if(s.k==='fall')y=0.95*Math.exp(-x*3.2)+0.03;else if(s.k==='hold')y=0.95-0.28*x;else if(s.k==='flat')y=0.95-0.9*Math.min(1,x*8);else y=s.fn?s.fn(x):0.5;arr.push([x*W,(1-y)*(H-40)+20]);}return arr;};
  let inner=`<line x1="0" y1="${H-20}" x2="${W}" y2="${H-20}" stroke="rgba(238,236,230,.18)" stroke-width="2"/>`;
  if(o.mark3!==false)inner+=`<line x1="${W*0.05}" y1="0" x2="${W*0.05}" y2="${H-20}" stroke="rgba(238,236,230,.18)" stroke-dasharray="8 10"/><text x="${W*0.05+10}" y="28" fill="#9296A1" font-family="IBM Plex Mono" font-size="24">3 s</text>`;
  series.forEach((s,i)=>{inner+=`<path id="ca${i}" d="" fill="${s.c}" opacity=".13"/><path id="cp${i}" d="" fill="none" stroke="${s.c}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>`;});
  const svg=DS.svg(W,H,inner);w.appendChild(svg);
  const leg=el('div','leg');series.forEach(s=>{leg.innerHTML+=`<span><i style="background:${s.c}"></i>${s.label||''}</span>`;});w.appendChild(leg);
  if(o.axis)w.appendChild(el('div','ax',`<span>${o.axis[0]}</span><span>${o.axis[1]||''}</span>`));
  if(o.schem!==false){const sc=el('div','label','schematisch');sc.style.cssText='position:absolute;left:0;top:-10px';w.appendChild(sc);}
  const P=series.map(pts);
  DS.tween(lt=>{series.forEach((s,i)=>{const at=s.at!==undefined?s.at:(o.at||.2)+i*(o.step||.35);const p=prog(lt,at,s.dur||o.dur||1.6,DS.ease.out);const k=Math.round(p*60);const path=svg.querySelector('#cp'+i),area=svg.querySelector('#ca'+i);if(k<1){path.setAttribute('d','');area.setAttribute('d','');return;}const pts_=P[i].slice(0,k+1).map(q=>q[0].toFixed(1)+','+q[1].toFixed(1));path.setAttribute('d','M'+pts_.join(' L'));area.setAttribute('d','M'+pts_.join(' L')+` L${P[i][k][0].toFixed(1)},${H-20} L0,${H-20} Z`);});});
  return w;
};

/* ---------- 3D letters ---------- */
C.letters=function(o,b){
  const w=el('div','letters'+(o.small?' small':''));
  const chars=(o.chars||'STOPP').split('');
  chars.forEach((ch,i)=>{
    const L=el('div','letter');
    L.innerHTML=`<span class="ext">${ch}</span><span class="face">${ch}</span>${o.subs&&o.subs[i]?`<span class="sub">${o.subs[i]}</span>`:''}`;
    const at=(o.at||.1)+i*(o.step||.12);
    DS.enter(L,{delay:at,mode:o.mode||'drop',dur:.5});
    if(o.hi!==undefined||o.hiAt){DS.tween(lt=>{const hiIdx=o.hiAt?o.hiAt.findIndex(([t,idx])=>lt>=t&&idx===i)>=0:o.hi===i;L.classList.toggle('dim',o.hiAt?!!(o.hiAt.some(([t])=>lt>=t))&&!o.hiAt.some(([t,idx])=>lt>=t&&idx===i&&!o.hiAt.some(([t2,idx2])=>t2>t&&lt>=t2)):o.hi!==i&&o.hi!==undefined);});}
    if(o.dim&&o.dim.includes(i))L.classList.add('dim');
    w.appendChild(L);
  });
  if(o.gatherAt!==undefined){DS.tween(lt=>{const p=prog(lt,o.gatherAt,.6,DS.ease.pop);w.style.gap=lerp(26,-6,p)+'px';});}
  return w;
};

/* ---------- timeline with markers ---------- */
C.timeline=function(o,b){
  const w=el('div','tlc');const W=940;const total=o.total||12;
  const clips=el('div','clips');const n=o.clips||6;
  const cl=[];for(let i=0;i<n;i++){const c=el('div','clip');c.appendChild(clipArt(false,i));clips.appendChild(c);cl.push(c);}
  w.appendChild(clips);
  const marks=o.marks||[2,5,7.5,10];
  const mks=marks.map((m,i)=>{const k=el('div','mk');k.style.left=(m/total*W)+'px';w.appendChild(k);if(o.markLabels){const l=el('div','lbl',o.markLabels[i]||'');l.style.left=(m/total*W)+'px';w.appendChild(l);}return k;});
  const ph=el('div','ph');w.appendChild(ph);
  w.appendChild(el('div','ruler',`<span>0 s</span><span>${total} s</span>`));
  DS.enter(w,{delay:o.at||0,mode:'rise',dur:.5});
  mks.forEach((k,i)=>DS.enter(k,{delay:(o.at||0)+.3+i*.12,mode:'drop',dur:.4}));
  const at=(o.at||0)+.4,dur=o.dur||3;
  DS.tween(lt=>{const p=prog(lt,at,dur,DS.ease.lin);const x=p*W;ph.style.left=x+'px';const tsec=p*total;cl.forEach((c,i)=>{const passed=marks.filter(m=>m<=tsec).length;c.classList.toggle('flip',(passed+i)%2===1&&passed>0);});
    if(o.punchOnMark){const near=marks.some(m=>Math.abs(m-tsec)<.08);w.style.transform=near?'scale(1.03)':'';}});
  return w;
};

/* ---------- loudness meter ---------- */
C.meter=function(o,b){
  const w=el('div','meter');
  const scale=el('div','scale');const marks=o.scale||[-6,-10,-14,-18,-22,-26,-30];
  const toY=v=>{const minV=-32,maxV=-4;return (1-(v-minV)/(maxV-minV))*900;};
  marks.forEach(m=>{const d=el('div',m===(o.target!==undefined?o.target:-14)?'tgt':'',`${m} LUFS`);d.style.top=(toY(m)-14)+'px';scale.appendChild(d);});
  const cols=[el('div','col'),el('div','col')];const lvs=cols.map(c=>{const l=el('div','lv');c.appendChild(l);return l;});
  const tl=el('div','tline');tl.className='tline';tl.style.cssText=`position:absolute;left:0;right:0;top:${toY(o.target!==undefined?o.target:-14)}px;height:3px;background:var(--cap);box-shadow:0 0 20px var(--cap);width:auto`;
  const colwrap=el('div');colwrap.style.cssText='position:relative;display:flex;gap:30px;height:900px';cols.forEach(c=>colwrap.appendChild(c));colwrap.appendChild(tl);
  w.append(scale,colwrap);
  const keys=o.keys||[[0,o.from!==undefined?o.from:-22],[o.dur||1,o.to!==undefined?o.to:-14]];
  DS.tween(lt=>{let v=keys[0][1];for(let i=0;i<keys.length-1;i++){const a=keys[i],d=keys[i+1];if(lt>=d[0]){v=d[1];continue;}if(lt>=a[0]){v=lerp(a[1],d[1],DS.ease.io(DS.clamp01((lt-a[0])/Math.max(.01,d[0]-a[0]))));break;}}
    const jit=o.jitter===false?0:Math.sin(lt*23)*0.6+Math.sin(lt*41)*0.4;lvs.forEach((l,i)=>{const h=900-toY(v+jit*(i?1:-1));l.style.height=Math.max(0,h)+'px';});});
  return w;
};

/* ---------- frame strip ---------- */
C.strip=function(o,b){
  const w=el('div','strip');const n=o.n||13;const fr=[];
  for(let i=0;i<n;i++){const f=el('div','f','F'+String(i).padStart(2,'0'));w.appendChild(f);fr.push(f);}
  DS.enter(w,{delay:o.at||0,mode:'rise',dur:.5});
  DS.tween(lt=>{fr.forEach((f,i)=>{const on=(o.onAt||[]).some(([t,idx])=>lt>=t&&idx>=i);const hi=(o.hiAt||[]).some(([t,idx])=>lt>=t&&idx===i&&!(o.hiAt||[]).some(([t2])=>t2>t&&lt>=t2));f.classList.toggle('on',on&&!hi);f.classList.toggle('hi',hi);});});
  return w;
};

/* ---------- slots ---------- */
C.slots=function(o,b){
  const w=el('div','slots');const n=o.n||2;
  for(let i=0;i<n;i++){const s=el('div','slot'+(o.grey&&o.grey.includes(i)?' grey':''));s.innerHTML=`<div class="sn">${i+1}</div><div>${(o.labels&&o.labels[i])||'Platz'}</div>`;if(o.w){s.style.width=o.w+'px';s.style.height=Math.round(o.w*1.33)+'px';}
    DS.enter(s,{delay:(o.at||.1)+i*(o.step||.12),mode:'pop',dur:.45});
    if(o.onAt&&o.onAt[i]!=null)DS.tween(lt=>s.classList.toggle('on',lt>=o.onAt[i]));
    if(o.outAt&&o.outAt[i]!=null)DS.anim(s,[{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(200px)'}],{delay:o.outAt[i],dur:.4,easing:DS.css.io});
    w.appendChild(s);}
  return w;
};

/* ---------- pills row ---------- */
C.pills=function(o,b){
  const w=el('div','pills');if(o.width)w.style.width=o.width+'px';
  (o.items||[]).forEach((it,i)=>{const s=typeof it==='string'?{s:it}:it;const p=el('span','pill'+(s.cls?' '+s.cls:''),s.s);const at=s.at!==undefined?s.at:(o.at||.1)+i*(o.step||.14);DS.enter(p,{delay:at,mode:s.mode||'pop',dur:.4});
    if(s.struckAt!==undefined)DS.tween(lt=>p.classList.toggle('struck',lt>=s.struckAt));
    if(s.onAt!==undefined)DS.tween(lt=>p.classList.toggle('on',lt>=s.onAt));
    if(s.outAt!==undefined)DS.anim(p,[{opacity:1,transform:'translateX(0)'},{opacity:0,transform:'translateX(-400px)'}],{delay:s.outAt,dur:.35,easing:DS.css.io});
    w.appendChild(p);});
  return w;
};

/* ---------- checklist ---------- */
C.checklist=function(o,b){
  const w=el('div','checklist');if(o.width)w.style.width=o.width+'px';
  (o.items||[]).forEach((it,i)=>{const s=typeof it==='string'?{s:it}:it;const r=el('div','chk-row'+(s.red?' red':''));const bx=el('div','box');bx.appendChild(DS.icon(s.red?'x':'check'));bx.firstChild.style.color=s.red?'var(--rec)':'#0B0C0F';r.appendChild(bx);r.appendChild(el('span','',s.s));if(s.val)r.appendChild(el('span','val',s.val));
    const at=s.at!==undefined?s.at:(o.at||.1)+i*(o.step||.3);DS.enter(r,{delay:at,mode:'left',dur:.4});DS.tween(lt=>r.classList.toggle('on',lt>=at+(s.checkDelay!==undefined?s.checkDelay:.35)));w.appendChild(r);});
  return w;
};

/* ---------- split ---------- */
C.split=function(o,b){
  const w=el('div','split');
  (o.items||[]).forEach((it,i)=>{const h=el('div','half '+(it.cls||'p'));h.innerHTML=`<div class="hk">${it.k||''}</div><div class="hv">${it.v||''}</div>${it.bar!==undefined?'<div class="hb"><i></i></div>':''}${it.sub?`<div class="label">${it.sub}</div>`:''}`;
    const at=it.at!==undefined?it.at:(o.at||.1)+i*(o.step||.4);DS.enter(h,{delay:at,mode:i?'right':'left',dur:.45});
    if(it.bar!==undefined){const bi=h.querySelector('.hb i');DS.tween(lt=>{const p=prog(lt,at+.2,it.dur||.9);bi.style.width=(it.bar*p*100)+'%';});}
    if(it.count){const hv=h.querySelector('.hv');DS.tween(lt=>{const p=prog(lt,at+.2,it.dur||.9);hv.textContent=DS.fmt(lerp(it.count[0],it.count[1],p),it.dec||0)+(it.suffix||'');});}
    w.appendChild(h);});
  return w;
};

/* ---------- waveform ---------- */
C.wave=function(o,b){
  const w=el('div','wave'+(o.dirty?' dirty':''));const n=o.bars||64;const bars=[];
  for(let i=0;i<n;i++){const i_=el('i');w.appendChild(i_);bars.push(i_);}
  if(o.w){w.style.width=o.w+'px';}
  DS.enter(w,{delay:o.at||0,mode:'fade',dur:.3});
  DS.tween(lt=>{const clean=o.cleanAt!==undefined?prog(lt,o.cleanAt,.8):(o.dirty?0:1);w.classList.toggle('dirty',clean<.5);bars.forEach((bar,i)=>{const base=Math.sin(i*.6+lt*(o.freq||6))*.5+.5;const noise=((i*7919+Math.floor(lt*25)*104729)%1000)/1000;const amp=lerp(noise,base,clean);const spike=o.spikeAt!==undefined&&lt>=o.spikeAt&&lt<o.spikeAt+.2?1.6:1;const h=lerp(14,o.h||260,amp)*spike*(o.level!==undefined?o.level:1);bar.style.height=h+'px';});});
  return w;
};

/* ---------- clock ---------- */
C.clock=function(o,b){
  const w=el('div','clock'+(o.sm?' sm':''));
  const keys=o.keys||[[o.at||0,o.from||0],[(o.at||0)+(o.dur||1),o.to||60]];
  DS.tween(lt=>{let v=keys[0][1];for(let i=0;i<keys.length-1;i++){const a=keys[i],d=keys[i+1];if(lt>=d[0]){v=d[1];continue;}if(lt>=a[0]){v=lerp(a[1],d[1],DS.ease.out(DS.clamp01((lt-a[0])/Math.max(.01,d[0]-a[0]))));break;}}
    const total=Math.round(v);const m=Math.floor(total/60),s=total%60;const p=n=>String(n).padStart(2,'0');
    if(o.fmt==='min')w.innerHTML=`<b>${total}</b><span style="font-size:.4em;color:var(--mute)"> min</span>`;
    else if(o.fmt==='h')w.innerHTML=`<b>${p(m)}</b>:${p(s)}`;
    else w.innerHTML=`<b>${p(m)}</b>:${p(s)}`;});
  return w;
};

/* ---------- document ---------- */
C.doc=function(o,b){
  const d=el('div','doc');if(o.w)d.style.width=o.w+'px';
  d.appendChild(el('div','dt',o.title||'Drehliste'));
  (o.lines||[]).forEach((ln,i)=>{const s=typeof ln==='string'?{s:ln}:ln;const r=el('div','dl');r.innerHTML=`<span class="bx ${s.nobox?'empty':''}"></span><span>${s.s}</span>`;d.appendChild(r);const at=s.at!==undefined?s.at:(o.at||.3)+i*(o.step||.5);DS.tween(lt=>r.classList.toggle('on',lt>=at));});
  return d;
};

/* ---------- icon box ---------- */
C.icobox=function(o,b){
  const w=el('div','icobox');if(o.size){w.style.width=o.size+'px';w.style.height=o.size+'px';}
  const ic=DS.icon(o.icon||'mute');ic.style.color=o.color||'var(--cap)';if(o.size){ic.style.width=(o.size*.55)+'px';ic.style.height=(o.size*.55)+'px';}w.appendChild(ic);
  if(o.pulse)DS.tween(lt=>{w.style.transform=`scale(${1+.05*Math.sin(lt*6)})`;});
  if(o.swapAt!==undefined){const ic2=DS.icon(o.icon2||'speaker');ic2.style.cssText=ic.style.cssText;ic2.style.color=o.color2||'var(--cap)';ic2.style.display='none';w.appendChild(ic2);DS.tween(lt=>{const sw=lt>=o.swapAt;ic.style.display=sw?'none':'';ic2.style.display=sw?'':'none';});}
  if(o.strike){const s=el('div');s.style.cssText='position:absolute;width:70%;height:8px;background:var(--rec);transform:rotate(-45deg);border-radius:4px';w.style.position='relative';w.appendChild(s);if(o.strikeAt!==undefined)DS.tween(lt=>{s.style.display=lt>=o.strikeAt?'':'none';});}
  return w;
};

/* ---------- thumb (3D-ish) ---------- */
let _tgid=0;
function thumbSVG(){
  const id='tg'+(_tgid++);
  return DS.svg(240,240,`<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFE27A"/><stop offset=".5" stop-color="#FFD43B"/><stop offset="1" stop-color="#D9AC1F"/></linearGradient></defs><g transform="translate(0,6)"><path d="${'M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z'}" fill="#8a6a0d" transform="translate(.6,.9)"/></g><path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" fill="url(#${id})"/>`,'0 0 24 24');
}
C.thumb=function(o,b){
  const w=el('div','thumb');const size=o.size||420;w.style.width=size+'px';w.style.height=size+'px';
  w.appendChild(thumbSVG());
  w.style.left=(o.x!==undefined?o.x:540-size/2)+'px';w.style.top=(o.y!==undefined?o.y:960-size/2)+'px';
  const at=o.at||0;
  DS.tween(lt=>{const p=prog(lt,at,o.dur||.28,DS.ease.out);const px=lerp(o.fromX!==undefined?o.fromX:600,0,p),py=lerp(o.fromY!==undefined?o.fromY:900,0,p);const sc=lerp(1.4,1,p);const press=lt>=at+(o.dur||.28)&&lt<at+(o.dur||.28)+.12?1-.06*Math.sin(((lt-at-(o.dur||.28))/.12)*Math.PI):1;w.style.transform=`translate(${px}px,${py}px) rotate(${lerp(-25,-8,p)}deg) scale(${sc*press})`;w.style.opacity=lt>=at-.02?1:0;});
  return w;
};

/* ---------- UI overlay (safe zones) ---------- */
C.uiov=function(o,b){
  const w=el('div');w.style.cssText='position:absolute;inset:0;pointer-events:none';
  const zones=[['top',0,0,1080,250],['bottom',0,1500,1080,420],['right',940,900,140,600]];
  const zs={};
  zones.forEach(([k,x,y,ww,hh])=>{const z=el('div');z.style.cssText=`position:absolute;left:${x}px;top:${y}px;width:${ww}px;height:${hh}px;background:rgba(255,69,58,.18);border:3px dashed rgba(255,69,58,.7);border-radius:20px;opacity:0`;w.appendChild(z);zs[k]=z;});
  const ui=el('div','ui');ui.style.cssText='position:absolute;right:50px;bottom:520px;display:flex;flex-direction:column;gap:46px;align-items:center';[['heart','12,4K'],['comment','318'],['share','1.204']].forEach(([ic,ct])=>{const g=el('div');g.style.cssText='display:flex;flex-direction:column;align-items:center;gap:8px';const i=el('div','ic');i.style.cssText='width:90px;height:90px;border-radius:50%;background:rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center';i.appendChild(DS.icon(ic));i.firstChild.style.cssText='width:50px;height:50px;color:var(--paper)';g.appendChild(i);g.appendChild(el('div','ct',ct));g.lastChild.style.cssText='font:500 26px var(--f-mono);color:var(--paper)';ui.appendChild(g);});
  const cap=el('div');cap.style.cssText='position:absolute;left:50px;right:200px;bottom:470px;font:400 30px var(--f-body);color:var(--paper);line-height:1.3';cap.innerHTML='<b style="font-weight:600">daumenstopp</b> Dein Text liegt unter dem Like-Button. Also liest ihn keiner … <span style="color:var(--mute)">mehr</span>';
  const bottom=el('div');bottom.style.cssText='position:absolute;left:0;right:0;bottom:0;height:420px;background:linear-gradient(180deg,transparent,rgba(0,0,0,.7))';
  w.append(bottom,cap,ui);
  const safe=el('div');safe.style.cssText='position:absolute;left:60px;top:250px;width:880px;height:1250px;border:4px solid var(--clip-t);border-radius:28px;opacity:0;box-shadow:0 0 60px rgba(60,201,180,.25)';w.appendChild(safe);
  const meas=[];
  [['top','≈ 250 px',540,125],['bottom','≈ 420 px',540,1710],['right','Buttons · 60 px Rand',700,1200]].forEach(([k,txt,x,y])=>{const m=el('div','data',txt);m.style.cssText=`position:absolute;left:${x}px;top:${y}px;transform:translate(-50%,-50%);font-size:44px;color:var(--rec);opacity:0;background:rgba(11,12,15,.8);padding:10px 24px;border-radius:14px`;w.appendChild(m);meas.push([k,m]);});
  DS.enter(ui,{delay:o.at||0,mode:'right',dur:.4});DS.enter(cap,{delay:(o.at||0)+.1,mode:'rise',dur:.4});
  DS.tween(lt=>{Object.entries(zs).forEach(([k,z])=>{const at=o.zoneAt&&o.zoneAt[k];z.style.opacity=at!==undefined&&lt>=at?prog(lt,at,.3):0;});meas.forEach(([k,m])=>{const at=o.measAt&&o.measAt[k];m.style.opacity=at!==undefined&&lt>=at?prog(lt,at,.3):0;});safe.style.opacity=o.safeAt!==undefined&&lt>=o.safeAt?prog(lt,o.safeAt,.4):0;});
  return w;
};

/* ---------- meta-editor panel ---------- */
C.panel=function(o,b){
  const p=el('div','panel');p.style.width=(o.w||300)+'px';
  const kind=o.kind||'graph';
  if(kind==='graph'){p.innerHTML=`<div class="ph"><span>Graph Editor</span><span>Speed</span></div>`;const svg=DS.svg(o.w?o.w-36:264,120,`<path d="M0 110 C 60 110, 80 10, ${o.w?o.w-36:264} 10" fill="none" stroke="#FFD43B" stroke-width="3"/><circle cx="60" cy="110" r="6" fill="#EEECE6"/><circle cx="${(o.w?o.w-36:264)-80}" cy="10" r="6" fill="#EEECE6"/><line x1="0" y1="110" x2="60" y2="110" stroke="#9296A1" stroke-width="2"/>`);p.appendChild(svg);}
  else if(kind==='stagger'){p.innerHTML=`<div class="ph"><span>Stagger</span><span>Distribute</span></div><div class="row"><span>Selected Order</span><b>▾</b></div><div class="row"><span>Offset</span><b>3 f</b></div><div class="row"><span>Ease</span><b>out</b></div>`;}
  else if(kind==='values'){p.innerHTML=`<div class="ph"><span>Values</span></div>${(o.rows||[['Scale','100'],['Opacity','100'],['Blur','0']]).map(r=>`<div class="row"><span>${r[0]}</span><b>${r[1]}</b></div>`).join('')}`;}
  else if(kind==='layers'){p.innerHTML=`<div class="ph"><span>Layers</span></div>${(o.rows||['Hook','Captions','B-Roll','Sound','Grade']).map(r=>`<div class="row"><span>${r}</span><b>●</b></div>`).join('')}`;}
  return p;
};

/* ---------- ident (Daumenstopp-Moment) ---------- */
C.ident=function(o,b){
  const w=el('div');w.style.cssText='position:absolute;inset:0;width:1080px;height:1920px';
  const mode=o.mode||'short';
  const T=mode==='short'?{scroll:0,stop:.5,logo:.78,end:o.dur||2.0}:mode==='logo'?{scroll:0,stop:-1,logo:o.logoAt!==undefined?o.logoAt:.1,end:o.dur||3}:(o.T||{scroll:0,stop:8.0,logo:10.8,end:o.dur||15});
  if(mode==='logo'){
    const logo=el('div','id-logo');const word=el('div','id-word');
    const ic=thumbSVG();ic.style.cssText='width:126px;height:126px;filter:drop-shadow(0 20px 40px rgba(0,0,0,.6))';word.appendChild(ic);
    const wm=el('div','wm');'Daumenstopp'.split('').forEach(ch=>wm.appendChild(el('span','w',ch)));word.appendChild(wm);logo.appendChild(word);
    logo.appendChild(el('div','id-claim',o.claim||'Content, der den Daumen stoppt.'));w.appendChild(logo);
    const url=el('div','id-url',o.url||'daumenstopp.de');w.appendChild(url);
    [...wm.children].forEach((s,i)=>DS.enter(s,{delay:T.logo+.05+i*.028,mode:'pop',dur:.42}));
    DS.enter(ic,{delay:T.logo,mode:'pop',dur:.5});DS.enter(logo.lastChild,{delay:T.logo+.42,mode:'fade',dur:.4});DS.enter(url,{delay:T.logo+.6,mode:'fade',dur:.4});
    return w;
  }
  // phone
  const phwrap=el('div');phwrap.style.cssText='position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) scale(.82);transform-origin:50% 50%';
  const ph=C.phone({screen:{kind:'feed',speed:mode==='short'?4:3.2,stopAt:T.stop,labels:true,cards:mode==='short'?8:60}},b);
  phwrap.appendChild(ph);w.appendChild(phwrap);
  // thumb
  const th=C.thumb({size:520,x:540-260+120,y:960-260+120,at:T.stop-.26,dur:.26,fromX:700,fromY:900},b);w.appendChild(th);
  // logo
  const logo=el('div','id-logo');
  const word=el('div','id-word');
  const ic=thumbSVG();ic.style.cssText='width:126px;height:126px;filter:drop-shadow(0 20px 40px rgba(0,0,0,.6))';word.appendChild(ic);
  const wm=el('div','wm');'Daumenstopp'.split('').forEach(ch=>wm.appendChild(el('span','w',ch)));word.appendChild(wm);
  logo.appendChild(word);
  logo.appendChild(el('div','id-claim',o.claim||'Content, der den Daumen stoppt.'));
  w.appendChild(logo);
  const url=el('div','id-url',o.url||'daumenstopp.de');w.appendChild(url);
  // animations
  [...wm.children].forEach((s,i)=>DS.enter(s,{delay:T.logo+.05+i*.028,mode:'pop',dur:.42}));
  DS.enter(ic,{delay:T.logo,mode:'pop',dur:.5});
  DS.enter(logo.lastChild,{delay:T.logo+.42,mode:'fade',dur:.4});
  DS.enter(url,{delay:T.logo+.6,mode:'fade',dur:.4});
  DS.tween(lt=>{
    // phone shrinks & fades after stop
    const p=prog(lt,T.logo-.1,.5,DS.ease.io);
    phwrap.style.transform=`translate(-50%,-50%) scale(${lerp(.82,.6,p)}) translateY(${lerp(0,-200,p)}px)`;phwrap.style.opacity=1-p;
    th.style.opacity=lt>=T.stop-.26?(1-p):0;
    const hudDot=document.querySelector('#rec .dot');if(hudDot)hudDot.classList.toggle('cap',lt>=T.stop);
  });
  b.spec.recCap=false;
  return w;
};

})();
