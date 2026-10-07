"""Tiny DSL for Daumenstopp timelines."""
def P(s,cls=None):   # pill
    d={'r':'pill','s':s}
    if cls: d['cls']=cls
    return d
def K(s,**kw):  d={'r':'kern','s':s}; d.update(kw); return d      # kern
def A(s,**kw):  d={'r':'akzent','s':s}; d.update(kw); return d    # akzent
def F(s,**kw):  d={'r':'flourish','s':s}; d.update(kw); return d  # flourish
def D(s,cls=None,**kw):
    d={'r':'data','s':s}; d.update(kw)
    if cls: d['cls']=cls
    return d
def L(s,cls=None):
    d={'r':'label','s':s}
    if cls: d['cls']=cls
    return d
def N(s=None,**kw): d={'r':'num'}; d.update(kw);
def N(s='',**kw):
    d={'r':'num','s':s}; d.update(kw); return d
def line(*parts,**kw):
    d={'parts':list(parts)}; d.update(kw); return d
def T(*lines,**kw):
    """text block: lines can be role dicts or line(...)"""
    d={'lines':list(lines)}; d.update(kw); return d
def B(vo=None,text=None,obj=None,**kw):
    d={}
    if vo: d['vo']=vo
    if text: d['text']=text
    if obj is not None: d['obj']=obj
    d.update(kw); return d
def SFX(*items):
    """items: (name, at) or name"""
    out=[]
    for i in items:
        if isinstance(i,dict): out.append(i)
        elif isinstance(i,tuple):
            d={'name':i[0],'at':i[1]}
            if len(i)>2: d['dur']=i[2]
            if len(i)>3: d['gain']=i[3]
            out.append(d)
        else: out.append({'name':i,'at':0})
    return out
