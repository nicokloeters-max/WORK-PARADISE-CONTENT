from _dsl import *
# 24 · Safe Zones · Kurz
IDENT={'mode':'short','dur':2.2,'sfx':[('scroll',0,.55),('stopp',.5),('click',.78),('logo',.8)]}
UI=lambda **kw: dict({'type':'uiov','abs':True,'x':0,'y':0,'enter':False,'at':0},**kw)
def build():
    beats=[
        B("Dein Text liegt unter dem Like-Button. Also liest ihn keiner.",
          T(K('Unter dem Button'), A('liest ihn keiner'), size='m'),
          obj=UI(zoneAt={'right':1.0}), layout='textTop', sfx=SFX(('hit',0),('buzz',1.0))),
        B("Drei Zonen sind tabu.",
          T(A('Drei Zonen'), P('sind tabu'), size='l'),
          obj=UI(zoneAt={'top':.4,'bottom':.6,'right':.8}), layout='textTop', sfx=SFX(('hit',0),('tick',.4),('tick',.6),('tick',.8))),
        B("Oben: Statusleiste und Titel. Rund zweihundertfünfzig Pixel.",
          T(line(K('Oben'),A('≈ 250 px')), size='m'),
          obj=UI(zoneAt={'top':0},measAt={'top':.3}), layout='center', sfx=SFX(('hit',0),('click',.3))),
        B("Unten: Caption, Handle, Sound. Rund vierhundertzwanzig Pixel.",
          T(line(K('Unten'),A('≈ 420 px')), size='m'),
          obj=UI(zoneAt={'top':0,'bottom':0},measAt={'bottom':.3}), layout='center', sfx=SFX(('hit',0),('click',.3))),
        B("Rechts: Like, Kommentar, Share. Und seitlich sechzig Pixel Rand.",
          T(line(K('Rechts'),A('Buttons · 60 px')), size='m'),
          obj=UI(zoneAt={'top':0,'bottom':0,'right':0},measAt={'right':.3}), layout='center', sfx=SFX(('hit',0),('click',.3))),
        B("Alles dazwischen ist deine Bühne. Unsere Richtwerte bei tausendachtzig mal neunzehnhundertzwanzig.",
          T(A('Deine Bühne'), D('1080 × 1920'), L('Richtwerte'), size='m'),
          obj=UI(zoneAt={'top':0,'bottom':0,'right':0},safeAt=.3), layout='center', sfx=SFX(('hit',0),('haken',.4))),
        B("Speicher dir die Maße.",
          T(A('Speichern'), size='xl'),
          obj={'type':'icobox','icon':'save','size':280,'pulse':True}, layout='textTop', sfx=SFX(('hit',0),('pling',.3))),
    ]
    return {'slug':'safe-zones','fps':25,'beats':beats,'ident':IDENT}
