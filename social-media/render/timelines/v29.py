from _dsl import *
# 29 · Kundenstimme [[Name]] · Kurz (Template, nur mit echtem Zitat)
IDENT={'mode':'short','dur':2.2,'sfx':[('scroll',0,.55),('stopp',.5),('click',.78),('logo',.8)]}
def build():
    beats=[
        B("[[Erster Satz des Zitats.]]",
          T(D('„','cap'), K('[[Erster Satz des Zitats.]]', size='m'), size='m'),
          sfx=SFX(('hit',0))),
        B("[[Name]], [[Rolle]] bei [[Firma]].",
          T(P('[[Name]] · [[Rolle]], [[Firma]]'), size='m'),
          obj={'type':'comments','items':[{'name':'[[Name]]','text':'[[Erster Satz des Zitats.]]','time':'[[Firma]]','at':.3,'likes':''}],'at':.3},
          layout='textTop', sfx=SFX(('hit',0),('whoosh',.3))),
        B("Vorher: [[Ausgangslage in einem Satz, Worte des Kunden.]]",
          T(P('vorher'), D('[[Ausgangslage]]'), size='m'),
          obj={'type':'slider','w':680,'h':680,'keys':[[0,.08],[.4,.08]],'caption':'[[Kunde]] *vorher','tc':False},
          layout='textTop', sfx=SFX(('hit',0))),
        B("[[Zweiter Satz des Zitats: was sich geändert hat.]]",
          T(K('[[Zweiter Satz des Zitats.]]', size='m'), size='m'),
          obj={'type':'slider','w':680,'h':680,'keys':[[0,.08],[2.0,.92]],'caption':'[[Kunde]] *nachher','tc':False},
          layout='textTop', sfx=SFX(('hit',0),('whoosh',.4),('whoosh',1.2))),
        B("Das Ergebnis: [[Kennzahl]] von [[xx]] auf [[yy]].",
          T(L('[[Kennzahl]]'), line(D('[[xx]]'),K('→'),A('[[yy]]')), size='m'),
          obj={'type':'bars','items':[{'k':'vor','v':30,'c':'r','at':.3,'suffix':''},{'k':'nach','v':60,'c':'t','at':.9,'hiAt':1.6,'suffix':''}],'label':'Platzhalter · echte Werte aus dem Report'},
          layout='textTop', sfx=SFX(('hit',0),('rattle',.3),('rattle',.9),('hit',1.6))),
        B("[[Dritter Satz des Zitats: wie sich die Zusammenarbeit anfühlt.]]",
          T(K('[[Dritter Satz des Zitats.]]', size='m'), F('[[Flourish-Wort]]', extra=.2), size='m'),
          obj={'type':'comments','items':[{'name':'[[Name]]','text':'[[Dritter Satz des Zitats.]]','time':'[[Firma]]','at':.4,'likes':'','liked':True}],'at':.4},
          layout='textTop', sfx=SFX(('hit',0),('whoosh',.4))),
        B("Mehr Projekte aus deiner Branche: Kommentier CASE.",
          T(A('CASE', size='xl'), P('in die Kommentare'), size='m'),
          obj={'type':'comments','items':[{'name':'du','text':'CASE','typing':True,'typeDur':.5,'at':.3,'time':'jetzt'}],'at':.3},
          layout='textTop', sfx=SFX(('hit',0),('type',.4),('type',.52),('type',.64),('type',.76))),
    ]
    return {'slug':'kundenstimme-name','fps':25,'beats':beats,'ident':IDENT}
