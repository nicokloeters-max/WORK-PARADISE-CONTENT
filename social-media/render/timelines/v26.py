from _dsl import *
# 26 · Hook-Rate in 20 Sekunden · Kurz
IDENT={'mode':'short','dur':2.2,'sfx':[('scroll',0,.55),('stopp',.5),('click',.78),('logo',.8)]}
def build():
    beats=[
        B("Eine Zahl entscheidet, ob dein Video Reichweite bekommt.",
          T(A('Eine Zahl'), P('entscheidet über Reichweite')),
          obj={'type':'counter','from':0,'to':0,'suffix':' %','sm':True,'at':0,'dur':.1}, layout='textTop', sfx=SFX(('hit',0))),
        B("Die Hook-Rate. Der Anteil, der länger als drei Sekunden bleibt.",
          T(A('Hook-Rate'), L('Anteil, der länger als 3 s bleibt')),
          hud={'tcbar':{'start':.3,'dur':3.0,'stopAt':1.0,'tealLabel':'3 s · bleibt'}},
          sfx=SFX(('hit',0),('tick',1.0),('tick',1.8),('tick',2.6),('stopp',3.3))),
        B("Du findest sie in deinen Insights: Retention-Kurve, Wert bei Sekunde drei.",
          T(P('in deinen Insights'), D('Retention · 3 s','cap'), size='m'),
          obj={'type':'phone','screen':{'kind':'insights','value':'48 %','valueLabel':'Hook-Rate · Beispiel'},'scale':.56,'shift':[0,30],'mode':'rise'},
          cursors=[{'name':'CD','path':[[1.4,900,1500],[2.0,470,1030]],'clicks':[2.05]}],
          layout='textTop', sfx=SFX(('hit',0),('click',2.05))),
        B("Unser Richtwert: über vierzig Prozent. Darunter wird der Hook neu gebaut.",
          T(A('> 40 %'), L('Richtwert'), P('darunter: Hook neu bauen'), size='l'),
          obj={'type':'bars','items':[{'k':'','v':40,'c':'cap','label':'Richtwert','at':.3,'dur':1.0}]}, layout='textTop',
          sfx=SFX(('hit',0),('rattle',.3),('haken',1.3))),
        B("Prüf sie jede Woche. Nicht die Views. Die Hook-Rate.",
          T(A('Jede Woche'), K('Views', strike=True, strikeAt=.9), size='l'),
          obj={'type':'calendar','at':.2,'fills':[{'i':0,'c':'cap','at':.5}],'height':110}, layout='textTop',
          sfx=SFX(('hit',0),('tick',.5),('strike',.9))),
    ]
    return {'slug':'hook-rate-in-20-sekunden','fps':25,'beats':beats,'ident':IDENT}
