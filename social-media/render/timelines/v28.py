from _dsl import *
# 28 · [[Zwei]] Plätze im [[November]] · Kurz (nur mit echter Kapazität produzieren)
IDENT={'mode':'short','dur':2.2,'sfx':[('scroll',0,.55),('stopp',.5),('click',.78),('logo',.8)]}
def build():
    beats=[
        B("Im [[November]] nehmen wir [[zwei]] neue Marken. Nicht mehr.",
          T(P('im [[November]]'), A('[[Zwei]] neue Marken'), P('nicht mehr'), size='m'),
          obj={'type':'slots','n':2,'labels':['Marke','Marke'],'at':.3}, layout='textTop', sfx=SFX(('hit',0),('hit',.3),('hit',.42))),
        B("Nicht, weil sich das gut anhört.",
          T(P('nicht weil'), K('gut anhört', strike=True, strikeAt=1.0), size='l'),
          cursors=[{'name':'CD','path':[[.4,200,1000],[1.0,340,960],[1.5,800,960]],'clicks':[1.0]}],
          sfx=SFX(('hit',0),('strike',1.0))),
        B("Sondern weil jede Marke einen festen Editor bekommt. Und ein Editor schafft nur so viel, wie ein Editor schafft.",
          T(P('fester Editor'), A('pro Marke'), size='l'),
          obj={'type':'slots','n':2,'labels':['Editor 1','Editor 2'],'onAt':[.6,1.3],'at':.2},
          cursors=[{'name':'Editor','path':[[.3,120,1200],[.6,330,1200]],'clicks':[.6]},{'name':'Editor','path':[[1.0,960,1200],[1.3,750,1200]],'clicks':[1.3]}],
          layout='textTop', sfx=SFX(('hit',0),('click',.6),('click',1.3))),
        B("Lieber zwei Marken, bei denen jedes Video sitzt, als zehn, bei denen wir raten.",
          T(A('Zwei, die sitzen'), P('statt zehn, bei denen wir raten'), size='m'),
          obj={'type':'slots','n':10,'labels':['']*10,'grey':list(range(2,10)),'onAt':[0,0]+[None]*8,'outAt':[None,None]+[1.2+i*.06 for i in range(8)],'at':.2,'step':.05,'w':150},
          layout='textTop', sfx=SFX(('hit',0))+[{'name':'click','at':.2+i*.05} for i in range(10)]+[{'name':'whoosh','at':1.2}]),
        B("Wenn ihr dabei sein wollt: fünfzehn Minuten, Link im Profil.",
          T(A('15 min'), P('Link im Profil'), size='l'),
          obj={'type':'calendar','rows':1,'at':.3,'fills':[{'i':3,'c':'cap','at':.8}],'height':110}, layout='textTop', sfx=SFX(('hit',0),('pling',.8))),
    ]
    return {'slug':'zwei-plaetze-im-november','fps':25,'beats':beats,'ident':IDENT}
