"""Procedural sound design + VO mix for Daumenstopp videos.
All SFX are synthesized (no licensed assets). Master: -14 LUFS integrated, -1 dBTP via ffmpeg loudnorm.
"""
import numpy as np, subprocess, os, wave, math
SR=48000
def _env(n,a,d,s=0.0,r=0.0,hold=0.0):
    """ADSR-ish envelope in seconds"""
    t=np.arange(n)/SR
    e=np.ones(n)
    at=max(1,int(a*SR)); e[:at]=np.linspace(0,1,at)
    dt=int(d*SR); 
    if dt>0:
        seg=np.exp(-np.linspace(0,5,dt))*(1-s)+s
        e[at:at+dt]=seg[:max(0,min(dt,n-at))]
        e[at+dt:]=s
    if r>0:
        rt=int(r*SR); e[-rt:]*=np.linspace(1,0,rt)
    return e
def _noise(n,seed=1):
    rng=np.random.default_rng(seed); return rng.standard_normal(n)
def _lp(x,fc):
    # one-pole lowpass
    a=math.exp(-2*math.pi*fc/SR); y=np.empty_like(x); acc=0.0
    for i in range(len(x)):
        acc=(1-a)*x[i]+a*acc; y[i]=acc
    return y
def _lp_fast(x,fc):
    from scipy.signal import butter, lfilter
    b,a=butter(2,fc/(SR/2)); return lfilter(b,a,x)
def _hp_fast(x,fc):
    from scipy.signal import butter, lfilter
    b,a=butter(2,fc/(SR/2),btype='high'); return lfilter(b,a,x)
def _bp_fast(x,lo,hi):
    from scipy.signal import butter, lfilter
    b,a=butter(2,[lo/(SR/2),hi/(SR/2)],btype='band'); return lfilter(b,a,x)
def sine_sweep(dur,f0,f1,curve=3.0):
    n=int(dur*SR); t=np.arange(n)/SR
    f=f0+(f1-f0)*(1-np.exp(-curve*t/dur))/(1-np.exp(-curve))
    ph=2*np.pi*np.cumsum(f)/SR
    return np.sin(ph)

def sfx(name):
    if name=='hit':      # sub thud + click
        n=int(.45*SR); sub=sine_sweep(.45,120,48,4)*_env(n,.002,.4); click=_hp_fast(_noise(int(.03*SR),3),2500)*_env(int(.03*SR),.001,.025)
        x=sub*.62; x[:len(click)]+=click*.3; return x
    if name=='stopp':    # hard 60 Hz thud, longer decay, with transient
        n=int(.9*SR); sub=sine_sweep(.9,90,52,5)*_env(n,.001,.85); tr=_lp_fast(_noise(int(.02*SR),5),4000)*_env(int(.02*SR),.0005,.018)
        x=sub*1.0; x[:len(tr)]+=tr*.6; x=np.tanh(x*1.6)*.8; return x
    if name=='click':
        n=int(.04*SR); return _bp_fast(_noise(n,7),1800,6000)*_env(n,.0005,.03)*.5
    if name=='tick':
        n=int(.03*SR); return _bp_fast(_noise(n,11),3000,9000)*_env(n,.0005,.02)*.35
    if name=='type':     # keyboard tick (lower)
        n=int(.035*SR); return _bp_fast(_noise(n,13),1200,5000)*_env(n,.0005,.025)*.3
    if name=='whoosh':
        n=int(.5*SR); x=_bp_fast(_noise(n,17),300,3000); e=np.sin(np.linspace(0,np.pi,n))**2; return x*e*.35
    if name=='swipe':
        n=int(.35*SR); x=_bp_fast(_noise(n,19),600,6000); e=np.sin(np.linspace(0,np.pi,n))**1.5*np.linspace(1,.3,n); return x*e*.4
    if name=='drop':     # riser + impact
        n1=int(.6*SR); riser=_bp_fast(_noise(n1,23),200,4000)*np.linspace(0,1,n1)**2*.5
        n2=int(1.2*SR); imp=sine_sweep(1.2,110,40,5)*_env(n2,.001,1.1); 
        x=np.zeros(n1+n2); x[:n1]+=riser; x[n1:]+=np.tanh(imp*1.8)*.9; return x
    if name=='pling':
        n=int(.9*SR); t=np.arange(n)/SR; x=(np.sin(2*np.pi*1046*t)+.5*np.sin(2*np.pi*2093*t)+.25*np.sin(2*np.pi*3135*t))*_env(n,.002,.8); return x*.35
    if name=='rattle':   # counter rattling
        n=int(.6*SR); x=np.zeros(n)
        for i in range(0,n,int(.022*SR)):
            k=min(n-i,int(.015*SR)); x[i:i+k]+=_bp_fast(_noise(k,29+i),2000,8000)*_env(k,.0005,.012)*.3
        return x
    if name=='printer':
        n=int(1.4*SR); x=np.zeros(n)
        for i in range(0,n,int(.045*SR)):
            k=min(n-i,int(.03*SR)); x[i:i+k]+=_bp_fast(_noise(k,31+i),800,3500)*_env(k,.001,.025)*.25
        return x*np.linspace(1,.7,n)
    if name=='tear':
        n=int(.3*SR); return _bp_fast(_noise(n,37),1000,7000)*_env(n,.002,.25)*.45
    if name=='buzz':   # soft error buzz: lowpassed square wave (no hard edges -> no AAC overshoot)
        n=int(.35*SR); t=np.arange(n)/SR; sq=_lp_fast(np.sign(np.sin(2*np.pi*110*t)),1200); return sq*_env(n,.002,.3)*.22
    if name=='scroll':   # scroll rush noise 3.5 s
        n=int(3.5*SR); x=_bp_fast(_noise(n,41),400,5000); e=np.ones(n); e[-int(.2*SR):]=np.linspace(1,0,int(.2*SR)); 
        mod=.6+.4*np.sin(2*np.pi*6*np.arange(n)/SR); return x*e*mod*.11
    if name=='logo':     # soft tone pair
        n=int(1.6*SR); t=np.arange(n)/SR; x=np.sin(2*np.pi*523*t)*_env(n,.01,1.4)+np.sin(2*np.pi*784*t)*_env(n,.01,1.3)*.6+np.sin(2*np.pi*130*t)*_env(n,.005,1.2)*.5; return x*.3
    if name=='strike':
        n=int(.18*SR); return _bp_fast(_noise(n,43),1500,6000)*_env(n,.001,.15)*np.linspace(1,.2,n)*.4
    if name=='riser':
        n=int(.8*SR); return _bp_fast(_noise(n,47),300,5000)*np.linspace(0,1,n)**2*.4
    if name=='pitchdown':
        n=int(.5*SR); return sine_sweep(.5,440,110,3)*_env(n,.005,.45)*.25
    if name=='stamp':
        n=int(.3*SR); sub=sine_sweep(.3,200,70,4)*_env(n,.001,.25); cl=_bp_fast(_noise(int(.02*SR),53),2000,7000)*_env(int(.02*SR),.0005,.015); x=sub*.5; x[:len(cl)]+=cl*.4; return x
    if name=='haken':
        n=int(.25*SR); t=np.arange(n)/SR; return (np.sin(2*np.pi*880*t)*_env(n,.002,.2)+np.sin(2*np.pi*1320*t)*_env(n,.002,.15)*.5)*.25
    if name=='shutter':
        n=int(.12*SR); return _bp_fast(_noise(n,59),1500,8000)*_env(n,.0005,.1)*.4
    if name=='silence': return np.zeros(int(.1*SR))
    return sfx('tick')

def bed(total, bpm=90, drop_times=(), start=0.0):
    """Dark minimal bass bed: drone + soft kick on 1 & 3 + hat ticks, sidechained around drops."""
    n=int(total*SR)+SR; t=np.arange(n)/SR
    drone=(np.sin(2*np.pi*55*t)*.5+np.sin(2*np.pi*110*t)*.15+np.sin(2*np.pi*82.4*t)*.12)*(.6+.4*np.sin(2*np.pi*.08*t))
    drone=_lp_fast(drone,180)
    beat=60/bpm; kick=np.zeros(n); hat=np.zeros(n)
    k=sine_sweep(.35,140,45,5)*_env(int(.35*SR),.001,.3)
    h=_bp_fast(_noise(int(.03*SR),61),6000,12000)*_env(int(.03*SR),.0005,.02)
    i=0
    while i*beat<total:
        p=int(i*beat*SR)
        if i%2==0: kick[p:p+len(k)]+=k[:max(0,min(len(k),n-p))]
        if i%2==1: hat[p:p+len(h)]+=h[:max(0,min(len(h),n-p))]*.5
        i+=1
    x=drone*.55+kick*.5+hat*.25
    # gentle duck around drops
    for dt in drop_times:
        a=int(max(0,dt-.3)*SR); b_=int(min(total,dt+.9)*SR)
        if b_>a: x[a:b_]*=np.linspace(1,.35,b_-a)**.5*np.linspace(.35,1,b_-a)**.0+0
    if start>0:
        s=int(start*SR); x[:s]=0; f=min(int(.4*SR),n-s); x[s:s+f]*=np.linspace(0,1,f)
    return x*.28

def read_wav(path):
    with wave.open(path,'rb') as w:
        sr=w.getframerate(); fr=w.readframes(w.getnframes()); ch=w.getnchannels(); sw=w.getsampwidth()
    x=np.frombuffer(fr,dtype=np.int16).astype(np.float64)/32768.0
    if ch>1: x=x.reshape(-1,ch).mean(axis=1)
    if sr!=SR:
        from scipy.signal import resample_poly
        g=math.gcd(SR,sr); x=resample_poly(x,SR//g,sr//g)
    return x

def render_mix(spec,out_path):
    total=spec['_total']+0.3
    n=int(total*SR)
    mix=np.zeros(n)
    sfx_track=np.zeros(n); vo_track=np.zeros(n)
    drops=[]
    def place(track,x,at,gain=1.0,dur=None):
        if dur is not None and len(x)>int(dur*SR):
            k=int(dur*SR); x=x[:k].copy(); f=min(k,int(.04*SR)); x[-f:]*=np.linspace(1,0,f)
        p=int(max(0,at)*SR); k=min(len(x),n-p)
        if k>0: track[p:p+k]+=x[:k]*gain
    for b in spec['beats']:
        for s in b.get('sfx',[]) or []:
            at=b['t0']+(s.get('at',0) or 0)
            name=s['name']
            place(sfx_track,sfx(name),at,s.get('gain',1.0),s.get('dur'))
            if name=='drop': drops.append(at+.6)
        if b.get('_vo'):
            vo=read_wav(b['_vo'])
            # subtle VO polish: highpass 90 Hz, soft saturation
            vo=_hp_fast(vo,90); vo=np.tanh(vo*1.4)/1.4
            if b.get('voDrive'): vo=np.tanh(vo*b['voDrive'])/np.tanh(1.0)*.9
            if b.get('voLowpass'): vo=_lp_fast(vo,b['voLowpass'])
            place(vo_track,vo,b['t0']+b.get('voAt',0.12),b.get('voGain',1.0))
    ident=spec.get('ident')
    if ident:
        for s in ident.get('sfx',[]) or []:
            if isinstance(s,(list,tuple)): name,at=s[0],s[1]; dur=s[2] if len(s)>2 else None
            else: name,at,dur=s['name'],s.get('at',0),s.get('dur')
            place(sfx_track,sfx(name),ident['at']+at,1.0,dur)
    if spec.get('bed',True):
        mix+=bed(total,spec.get('bpm',90),drops,spec.get('bedStart',0.0))[:n]
    # sidechain bed under VO
    env=np.abs(vo_track); 
    from scipy.signal import lfilter
    env=lfilter([1-math.exp(-1/(0.05*SR))],[1,-math.exp(-1/(0.05*SR))],env)
    duck=1-np.clip(env*6,0,0.5)
    mix=mix*duck+sfx_track*0.9+vo_track*1.0
    # stereo: slight width for sfx via haas on right channel
    left=mix.copy(); right=mix.copy()
    d=int(.0007*SR); right[d:]+=sfx_track[:-d]*.15
    st=np.stack([left,right],axis=1)
    st=np.tanh(st*1.1)
    tmp=out_path+'.raw.wav'
    import soundfile_fallback as sf_
    sf_.write(tmp,st,SR)
    # loudness normalize to -14 LUFS / -1 dBTP (two-pass, linear)
    import json as _json, re as _re
    r=subprocess.run(['ffmpeg','-hide_banner','-nostats','-y','-i',tmp,'-af','loudnorm=I=-14:TP=-2.5:LRA=7:print_format=json','-f','null','-'],capture_output=True,text=True)
    m=_re.search(r'\{[^{}]*"input_i"[^{}]*\}',r.stderr,_re.S)
    if m:
        j=_json.loads(m.group(0))
        af=f"loudnorm=I=-14:TP=-2.5:LRA=7:measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}:measured_thresh={j['input_thresh']}:offset={j['target_offset']}:linear=true"
    else:
        af='loudnorm=I=-14:TP=-2.5:LRA=7'
    subprocess.run(['ffmpeg','-v','error','-y','-i',tmp,'-af',af,'-ar','48000',out_path],check=True)
    os.remove(tmp)
    return out_path
