from _dsl import *
# 23 · Mythos: Lange Videos funktionieren nicht · Kurz
IDENT={'mode':'short','dur':2.2,'sfx':[('scroll',0,.55),('stopp',.5),('click',.78),('logo',.8)]}
def build():
    beats=[
        B("Lange Videos funktionieren nicht. Sagt man.",
          T(L('Mythos der Woche','cap'), K('Lange Videos'), A('funktionieren nicht'), F('sagt man', extra=.1), size='m'),
          obj={'type':'cards','items':[{'icon':'clock','label':'Mythos','hi':True}],'at':.3,'mode':'pop','wide':True},
          layout='textTop', sfx=SFX(('hit',0),('stamp',.3))),
        B("Stimmt nicht. Was nicht funktioniert, sind tote Frames.",
          T(P('stimmt nicht'), A('Tote Frames'), size='l'),
          obj={'type':'phone','screen':{'kind':'clip','handle':'@marke','frozen':True,'ui':False},'scale':.5,'shift':[0,20],'mode':'rise'},
          cursors=[{'name':'CD','path':[[.3,300,1000],[.9,780,1000]],'clicks':[.35]}],
          layout='textTop', sfx=SFX(('hit',0),('tear',.35),('tick',1.0),('tick',2.0))),
        B("Schematisch: fünfzehn Sekunden, eine Einstellung, nichts passiert. Die Kurve fällt ab Sekunde drei.",
          T(line(D('15 s'),K('· eine Einstellung')), L('schematisch'), size='m'),
          obj={'type':'curves','series':[{'c':'#FF6B8B','k':'fall','label':'15 s · statisch'}],'at':.4,'dur':1.8,'h':440,'axis':['0 s','15 s']},
          layout='textTop', sfx=SFX(('hit',0),('pitchdown',.6))),
        B("Neunzig Sekunden, alle zwei bis vier Sekunden etwas Neues. Die Kurve hält.",
          T(line(D('90 s'),K('·'),A('2–4 s')), size='m'),
          obj={'type':'curves','series':[{'c':'#FF6B8B','k':'fall','label':'15 s · statisch','at':0,'dur':.05},{'c':'#3CC9B4','k':'hold','label':'90 s · Taktung','at':.4,'dur':1.8}],'h':440,'axis':['0 s','90 s']},
          layout='textTop', sfx=SFX(('hit',0),('riser',.4),('click',1.0),('click',1.5),('click',2.0))),
        B("Die Plattform misst nicht die Länge. Sie misst, wie lange Menschen bleiben.",
          T(P('nicht die Länge'), A('Wie lange sie bleiben'), size='m'),
          obj={'type':'split','items':[{'k':'Länge','v':'egal','cls':'p'},{'k':'Watch-Time','v':'zählt','cls':'t','bar':.9}],'at':.4,'step':.5},
          layout='textTop', sfx=SFX(('hit',0),('rattle',.9))),
        B("Fakt: Die Länge folgt dem Inhalt. Die Taktung folgt dem Hirn.",
          T(L('Fakt','cap'), A('Länge folgt Inhalt'), F('Taktung folgt Hirn', extra=.1), size='m'),
          obj={'type':'cards','items':[{'icon':'check','label':'Fakt','hi':True}],'at':.3,'mode':'pop','wide':True},
          layout='textTop', sfx=SFX(('hit',0),('stamp',.3))),
    ]
    return {'slug':'mythos-lange-videos','fps':25,'beats':beats,'ident':IDENT}
