#!/usr/bin/env python3
"""Daumenstopp render pipeline.

usage:
  python3 build.py preview 22 [--times 0,1,2]   # PNG frames + contact sheet into out/preview/
  python3 build.py render 22 [--draft]           # full MP4 (video + audio) into out/
  python3 build.py all [--draft]                 # all timelines

Timelines live in timelines/vNN.py and expose `build()` -> dict(spec).
Beat `vo` text is synthesized with Piper; the beat duration is derived from the VO length.
"""
import sys, os, json, subprocess, importlib.util, math, shutil, time, hashlib, wave, struct
HERE=os.path.dirname(os.path.abspath(__file__))
OUT=os.path.join(HERE,'out'); os.makedirs(OUT,exist_ok=True)
CACHE=os.path.join(OUT,'tts'); os.makedirs(CACHE,exist_ok=True)
FPS=25
CHROME=os.environ.get('DS_CHROME','/opt/pw-browsers/chromium-1194/chrome-linux/chrome')
PIPER=os.environ.get('DS_PIPER', os.path.join(HERE,'..','..','..','..','tmp-piper'))  # overridden below if scratch exists
SCRATCH='/tmp/claude-0/-home-user-WORK-PARADISE-CONTENT/7c6a889b-5b1d-5c15-93fe-f749216c237d/scratchpad/tts'
PIPER_BIN=os.environ.get('DS_PIPER_BIN', os.path.join(SCRATCH,'bin','piper','piper'))
PIPER_MODEL=os.environ.get('DS_PIPER_MODEL', os.path.join(SCRATCH,'voice','de-thorsten-low.onnx'))
VO_SPEED=float(os.environ.get('DS_VO_SPEED','1.0'))   # piper length_scale (lower = faster)
MIN_BEAT=1.6
TAIL=0.42

# ------------------------------------------------------------------ TTS
def wav_duration(path):
    with wave.open(path,'rb') as w: return w.getnframes()/float(w.getframerate())

def tts(text):
    """Synthesize German VO with Piper; returns (wav_path, duration)."""
    key=hashlib.sha1((text+'|'+str(VO_SPEED)).encode()).hexdigest()[:16]
    p=os.path.join(CACHE,key+'.wav')
    if not os.path.exists(p):
        if not os.path.exists(PIPER_BIN):
            raise SystemExit('piper not found at '+PIPER_BIN)
        subprocess.run([PIPER_BIN,'--model',PIPER_MODEL,'--output_file',p,'--length_scale',str(VO_SPEED),'--sentence_silence','0.18'],
                       input=text.encode('utf-8'),check=True,capture_output=True)
    return p, wav_duration(p)

# ------------------------------------------------------------------ timeline
def load_timeline(n):
    tl=os.path.join(HERE,'timelines')
    if tl not in sys.path: sys.path.insert(0,tl)
    path=os.path.join(HERE,'timelines',f'v{int(n):02d}.py')
    spec=importlib.util.spec_from_file_location(f'v{n}',path)
    m=importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
    return m.build()

def resolve(spec, use_tts=True):
    """Compute t0/dur per beat from VO durations. Returns spec + vo cue list."""
    t=0.0; cues=[]
    for b in spec['beats']:
        vo=b.get('vo')
        vod=0.0
        if vo and use_tts:
            p,vod=tts(vo); b['_vo']=p; b['_vodur']=vod
        mind=b.get('min',MIN_BEAT)
        dur=b.get('dur')
        if dur is None:
            dur=max(mind, vod+b.get('tail',TAIL)) if vo else mind
        else:
            dur=max(dur, vod+0.25) if vo else dur
        b['t0']=round(t,3); b['dur']=round(dur,3)
        voAt=b.get('voAt',0.12)
        if vo: cues.append({'t':round(t+voAt,3),'text':vo,'dur':round(vod,2)})
        t+=dur
    ident=spec.get('ident')
    if ident is not None:
        ident.setdefault('mode','short'); ident.setdefault('dur',2.0 if ident['mode']=='short' else 15.0)
        ident['at']=round(t+ident.get('gap',0.0),3)
        t=ident['at']+ident['dur']
    spec['_total']=round(t,3); spec['_cues']=cues
    # resolve cross-beat time references {'ref': beatIndex|'end', 'plus': x} -> local time of the containing beat
    beats=spec['beats']
    def walk(v, base):
        if isinstance(v,dict):
            if 'ref' in v and len(v)<=2:
                r=v['ref']; plus=v.get('plus',0.0)
                abs_t=(ident['at'] if (r=='end' and ident is not None) else (beats[-1]['t0']+beats[-1]['dur'] if r=='end' else beats[r]['t0']))+plus
                return round(abs_t-base,3)
            return {k:walk(x,base) for k,x in v.items()}
        if isinstance(v,list): return [walk(x,base) for x in v]
        return v
    for i,b in enumerate(beats):
        base=b['t0']
        for k in list(b.keys()):
            if k in('t0','dur','vo','_vo','_vodur'): continue
            b[k]=walk(b[k],base)
    return spec

# ------------------------------------------------------------------ browser
def open_page(pw, spec):
    b=pw.chromium.launch(executable_path=CHROME,args=['--disable-gpu','--hide-scrollbars','--force-device-scale-factor=1','--font-render-hinting=none'])
    pg=b.new_page(viewport={'width':1080,'height':1920},device_scale_factor=1)
    errs=[]
    pg.on('console',lambda m: errs.append(m.text) if m.type in('error','warning') else None)
    pg.on('pageerror',lambda e: errs.append(str(e)))
    pg.goto('file://'+os.path.join(HERE,'engine.html'))
    pg.evaluate('document.fonts.ready.then(()=>1)')
    pg.wait_for_function('document.fonts.status==="loaded"')
    # pre-render static background (grid + light sweep + vignette) to one image: 3x cheaper per frame
    import base64
    png=pg.locator('#bg').screenshot(type='png')
    pg.evaluate('''d=>{const bg=document.getElementById('bg');bg.style.backgroundImage=`url(${d})`;bg.style.backgroundSize='1080px 1920px';[...bg.children].forEach(c=>c.style.display='none');}''','data:image/png;base64,'+base64.b64encode(png).decode())
    # deep copy so the page spec can be stripped of private keys (_vo etc.) without touching the caller's spec
    clean=json.loads(json.dumps({k:v for k,v in spec.items() if not k.startswith('_')}))
    for bt in clean['beats']:
        for k in list(bt.keys()):
            if k.startswith('_'): del bt[k]
    pg.evaluate('spec=>DS.load(spec)',clean)
    return b,pg,errs

def preview(n, times=None, tag='preview'):
    from playwright.sync_api import sync_playwright
    spec=resolve(load_timeline(n))
    total=spec['_total']
    if times is None:
        times=[]
        for bt in spec['beats']:
            times.append(bt['t0']+min(0.9,bt['dur']*0.55))
            if bt['dur']>3.5: times.append(bt['t0']+bt['dur']-0.6)
        if spec.get('ident'): times+= [spec['ident']['at']+0.3, spec['ident']['at']+spec['ident']['dur']-0.2]
    d=os.path.join(OUT,tag,f'v{int(n):02d}'); shutil.rmtree(d,ignore_errors=True); os.makedirs(d)
    with sync_playwright() as pw:
        b,pg,errs=open_page(pw,spec)
        for i,t in enumerate(times):
            pg.evaluate('t=>DS.seek(t)',t)
            pg.screenshot(path=os.path.join(d,f'f{i:03d}_{t:06.2f}.png'))
        b.close()
    # contact sheet
    files=sorted(os.listdir(d))
    cols=4
    subprocess.run(['ffmpeg','-v','error','-y','-pattern_type','glob','-i',os.path.join(d,'f*.png'),'-vf',f'scale=270:-1,tile={cols}x{math.ceil(len(files)/cols)}:padding=6:margin=6',os.path.join(OUT,tag,f'v{int(n):02d}_sheet.png')],check=True)
    print(f'preview v{n}: {len(files)} frames, total {total}s, errors: {errs[:5]}')
    return errs

def render(n, draft=False):
    from playwright.sync_api import sync_playwright
    import audio
    spec=resolve(load_timeline(n))
    total=spec['_total']; nframes=int(math.ceil(total*FPS))
    vid=os.path.join(OUT,f'tmp_v{int(n):02d}.mp4')
    final=os.path.join(OUT,f'daumenstopp_{int(n):02d}_{spec.get("slug","video")}{"_draft" if draft else ""}.mp4')
    crf='28' if draft else '17'
    ff=subprocess.Popen(['ffmpeg','-v','error','-y','-f','image2pipe','-vcodec','png','-r',str(FPS),'-i','-','-an','-c:v','libx264','-preset','medium' if not draft else 'veryfast','-crf',crf,'-pix_fmt','yuv420p','-movflags','+faststart',vid],stdin=subprocess.PIPE)
    t0=time.time()
    with sync_playwright() as pw:
        b,pg,errs=open_page(pw,spec)
        step=2 if draft else 1
        for i in range(0,nframes,step):
            t=i/FPS
            pg.evaluate('t=>DS.seek(t)',t)
            png=pg.screenshot(type='png')
            for _ in range(step): ff.stdin.write(png)
            if i%(FPS*5)==0: print(f'  v{n}: {t:5.1f}/{total:.1f}s  {time.time()-t0:5.0f}s elapsed',flush=True)
        b.close()
    ff.stdin.close(); ff.wait()
    if errs: print('  page errors:',errs[:5])
    # audio
    mix=os.path.join(OUT,f'tmp_v{int(n):02d}.wav')
    audio.render_mix(spec,mix)
    subprocess.run(['ffmpeg','-v','error','-y','-i',vid,'-i',mix,'-c:v','copy','-c:a','aac','-b:a','192k','-shortest',final],check=True)
    os.remove(vid); os.remove(mix)
    # poster + cue sheet
    poster=os.path.join(OUT,f'poster_{int(n):02d}.jpg')
    pt=spec['beats'][0]['t0']+min(1.0,spec['beats'][0]['dur']*0.6)
    subprocess.run(['ffmpeg','-v','error','-y','-ss',str(pt),'-i',final,'-frames:v','1','-q:v','3',poster],check=True)
    with open(os.path.join(OUT,f'cues_{int(n):02d}.json'),'w',encoding='utf-8') as f: json.dump({'total':total,'cues':spec['_cues']},f,ensure_ascii=False,indent=1)
    print(f'done v{n}: {final} ({total:.1f}s, {time.time()-t0:.0f}s render)')
    return final

if __name__=='__main__':
    cmd=sys.argv[1] if len(sys.argv)>1 else 'preview'
    draft='--draft' in sys.argv
    args=[a for a in sys.argv[2:] if not a.startswith('--')]
    if cmd=='preview':
        times=None
        for a in sys.argv:
            if a.startswith('--times='): times=[float(x) for x in a.split('=')[1].split(',')]
        preview(args[0],times)
    elif cmd=='render':
        for a in args: render(a,draft)
    elif cmd=='all':
        for f in sorted(os.listdir(os.path.join(HERE,'timelines'))):
            if f.startswith('v') and f.endswith('.py'): render(f[1:3],draft)
    elif cmd=='remix':
        # regenerate audio mix for already rendered videos and remux (video stream copied)
        import audio, glob
        for a_ in args:
            spec=resolve(load_timeline(a_))
            f=[x for x in glob.glob(os.path.join(OUT,f'daumenstopp_{int(a_):02d}_*.mp4')) if not x.endswith('_draft.mp4')][0]
            mix=os.path.join(OUT,f'remix_{int(a_):02d}.wav'); tmp=f+'.tmp.mp4'
            audio.render_mix(spec,mix)
            subprocess.run(['ffmpeg','-v','error','-y','-i',f,'-i',mix,'-map','0:v','-map','1:a','-c:v','copy','-c:a','aac','-b:a','192k','-shortest',tmp],check=True)
            os.replace(tmp,f); os.remove(mix); print('remixed',f)
    elif cmd=='cues':
        spec=resolve(load_timeline(args[0])); print(json.dumps(spec['_cues'],ensure_ascii=False,indent=1)); print('total',spec['_total'])
