from _dsl import *
# 27 · Drei Hooks, ein Video · Kurz (Abstimmung)
IDENT={'mode':'short','dur':2.2,'sfx':[('scroll',0,.55),('stopp',.5),('click',.78),('logo',.8)]}
HOOKS=[('A','red','[[Hook A: Frage]]'),('B','teal','[[Hook B: Behauptung]]'),('C','cap','[[Hook C: Visual]]')]
def row(mode='rise'):
    return [{'type':'phone','screen':{'kind':'clip','seed':i,'handle':'@test','tc':False,'ui':False,'cover':h},'w':300,'mode':mode,'at':.1+i*.12} for i,(h,c,t) in enumerate(HOOKS)]
def build():
    beats=[
        B(None, T(), dur=1.6, obj=row(), objDir='row', objGap=24, layout='center', sfx=SFX(('hit',.1),('hit',.22),('hit',.34))),
        B("Drei Hooks. Ein Video. Du entscheidest.",
          T(K('Drei Hooks. Ein Video.'), A('Du entscheidest'), size='m'),
          obj=row('pop'), objDir='row', objGap=24, layout='textTop', sfx=SFX(('hit',0))),
    ]
    for i,(h,c,t) in enumerate(HOOKS):
        beats.append(B(f"{h}.", T(A(h, cls=None if c=='cap' else c), size='xl'),
          obj={'type':'phone','screen':{'kind':'clip','seed':i,'handle':'@test','caption':t,'capAt':.3,'capSmall':True},'scale':.56,'shift':[0,30],'mode':'rise'},
          hud={'tcbar':{'start':.2,'dur':3.0,'stopAt':1.0,'tealLabel':'3 s'}},
          layout='textTop', min=3.2, sfx=SFX(('hit',0),('tick',1.0),('tick',1.8),('tick',2.6))))
    beats+=[
        B("Welcher hat dich gehalten? Kommentier A, B oder C.",
          T(A('A, B oder C?'), P('welcher hat dich gehalten?'), size='l'),
          obj={'type':'comments','items':[{'name':'du','text':'…','typing':True,'typeDur':.2,'at':.5,'time':'jetzt'}],'at':.5},
          layout='textTop', sfx=SFX(('hit',0),('type',.6))),
        B("Nächste Woche zeigen wir, welcher wirklich gewonnen hat. Mit Zahlen.",
          T(P('nächste Woche'), A('Mit Zahlen'), size='l'),
          obj={'type':'bars','items':[{'k':'A','v':40,'c':'grey','suffix':'','at':.3},{'k':'B','v':40,'c':'grey','suffix':'','at':.5},{'k':'C','v':40,'c':'grey','suffix':'','at':.7}],'label':'Auflösung folgt'},
          layout='textTop', sfx=SFX(('hit',0),('rattle',.3))),
        B("Testen statt raten.",
          T(A('Testen'), K('statt raten', strike=True, strikeAt=.6), size='xl'), bg='cap', punch=True, exit='fade',
          sfx=SFX(('drop',0),('strike',.6))),
    ]
    return {'slug':'drei-hooks-ein-video','fps':25,'beats':beats,'ident':IDENT}
