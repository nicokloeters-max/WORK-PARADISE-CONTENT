from _dsl import *
# 25 · −14 LUFS · Kurz (der Ton ist der Beweis)
IDENT={'mode':'short','dur':2.2,'sfx':[('scroll',0,.55),('stopp',.5),('click',.78),('logo',.8)]}
def build():
    beats=[
        B("So klingt zu leise.",
          T(D('−22 LUFS','red'), K('Zu leise'), size='l'), voGain=.22, voLowpass=3000,
          obj={'type':'meter','keys':[[0,-22]],'target':-14}, layout='textTop', sfx=[]),
        B("Und so zu laut.",
          T(D('−8 LUFS','red'), A('Zu laut', cls='red'), size='l'), voDrive=7.0, punch=True,
          obj={'type':'meter','keys':[[0,-22],[.15,-7]],'target':-14}, layout='textTop', sfx=SFX(('buzz',.1))),
        B("Beides kostet. Leise: der Zuschauer dreht nicht auf, er wischt. Laut: die Plattform regelt runter, der Klang matscht.",
          T(A('Beides kostet'), size='l'),
          obj={'type':'split','items':[{'k':'leise','v':'wischt','cls':'r'},{'k':'laut','v':'matscht','cls':'r'}],'at':.5,'step':1.4},
          layout='textTop', sfx=SFX(('hit',0),('swipe',.9),('buzz',2.4))),
        B("Die meisten Plattformen pegeln auf etwa minus vierzehn LUFS.",
          T(P('die meisten Plattformen'), A('≈ −14 LUFS'), size='l'),
          obj={'type':'meter','keys':[[0,-22],[1.2,-14]],'target':-14}, layout='textTop', sfx=SFX(('hit',0),('riser',.3),('haken',1.3))),
        B("Wir mastern genau dorthin. True Peak minus eins. Dialog sechs dB über der Musik.",
          T(P('wir mastern genau dorthin'), size='m'),
          obj={'type':'pills','items':[{'s':'−14 LUFS','cls':'cap'},{'s':'−1 dBTP'},{'s':'Dialog +6 dB'}],'at':.4,'step':.4},
          layout='textTop', sfx=SFX(('hit',0),('click',.4),('click',.8),('click',1.2))),
        B("Dann klingt dein Video so, wie du es gemeint hast. Auf jedem Handy.",
          T(P('auf jedem Handy'), F('wie du es gemeint hast', extra=.1), size='m'),
          obj={'type':'wave','bars':64,'h':220,'freq':6}, layout='textTop', sfx=SFX(('hit',0),('pling',.4))),
    ]
    return {'slug':'minus-14-lufs','fps':25,'beats':beats,'ident':IDENT,'bedStart':4.0}
