from _dsl import *
def build():
    beats=[
        # 0 · phone feed scrolls fast, kept as background layer; stops when the thumb lands in beat 2
        B(None, None,
          obj={'type':'phone','screen':{'kind':'feed','speed':3.2,'stopAt':{'ref':2,'plus':0.9},'cards':70},
               'scale':.7,'shift':[0,290],'mode':'depth','outAt':{'ref':'end','plus':0.0},'outDur':.6},
          offAt={'ref':'end','plus':0.7},
          layout='center', dur=3.2, keep=40, exit='none',
          sfx=SFX(('scroll',0.0))),
        # 1 · So sieht dein Feed aus
        B("So sieht dein Feed aus. Eins Komma sieben Sekunden pro Beitrag.",
          T(line(K('So sieht'),A('dein Feed'),K('aus')), D('Ø 1,7 s pro Beitrag','cap'), size='m'),
          layout='textTop', min=3.6, exit='up', hud={'tcbar':{'start':.3,'dur':1.7}},
          sfx=SFX(('hit',0.0),('tick',0.3),('tick',0.55),('tick',0.8),('tick',1.05),('tick',1.3),('tick',1.55),('swipe',2.05))),
        # 2 · Bis einer stoppt · thumb lands at local 0.9, feed freezes, REC dot turns yellow
        B("Bis einer stoppt.",
          T(line(K('Bis einer'),A('stoppt.')), size='m'),
          layout='textTop', min=3.2, exit='fade', recCap=True,
          abs=[{'type':'thumb','size':600,'x':540-300+190,'y':1250-300+200,'at':0.64,'dur':.26,'fromX':700,'fromY':900,'selfEnter':True}],
          sfx=SFX(('hit',0.0),('stopp',0.9),('click',1.05))),
    ]
    spec={'slug':'daumenstopp-moment','fps':25,'hud':{'rec':True},'beats':beats,
          'ident':{'mode':'logo','dur':4.2,'gap':0.0,'logoAt':0.5,'sfx':[('logo',0.5)]}}
    return spec
