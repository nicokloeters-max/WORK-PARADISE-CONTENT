from _dsl import *
# 18 · Arbeitet ihr mit KI? · Mittel (Bevor du fragst)
IDENT={'mode':'short','dur':2.2,'sfx':[('scroll',0,.55),('stopp',.5),('click',.78),('logo',.8)]}
COLS=['Aufgabe','KI','Mensch']
def tbl(rows,**kw):
    d={'type':'table','cols':COLS,'rows':rows,'at':.2,'step':.2,'width':900}; d.update(kw); return d
R=lambda a,ki,me:[a,{'t':'chk'} if ki else {'t':'x'},{'t':'chk'} if me else {'t':'x'}]
def build():
    beats=[
        B("Ja, wir arbeiten mit KI. Und du siehst genau, wo.",
          T(L('Bevor du fragst','cap'), K('Ja.'), A('Und du siehst, wo'), size='l'),
          obj=tbl([]), layout='textTop', sfx=SFX(('hit',0),('click',.3))),
        B("Regel: KI dort, wo sie Qualität bringt. Nicht dort, wo sie Zeit spart und Qualität kostet.",
          T(P('die Regel'), A('Qualität, nicht nur Zeit'), size='m'),
          obj={'type':'cards','items':[{'icon':'bolt','label':'KI: wo sie Qualität bringt','hi':True},{'icon':'hand','label':'Nicht: wo sie Qualität kostet'}],'at':.4,'step':.3,'mode':'pop','wide':True},
          layout='textTop', sfx=SFX(('hit',0),('click',.4),('click',.7))),
        B("Transkription. KI. Sie hört besser zu als jeder Praktikant um dreiundzwanzig Uhr.",
          T(line(K('Transkription →'),A('KI')), size='m'),
          obj=[tbl([R('Transkription',1,0)],step=.1),{'type':'comments','items':[{'name':'Transkript','text':'„Dein Video hat eins Komma sieben Sekunden …“','typing':True,'typeDur':1.4,'at':.6,'time':'auto'}],'at':.6}],
          objGap=20, layout='textTop', sfx=SFX(('hit',0))+[{'name':'type','at':.7+i*.08} for i in range(14)]),
        B("Untertitel-Rohfassung. KI. Danach liest ein Mensch jedes Wort.",
          T(line(K('Untertitel →'),A('KI'),K('+ Mensch')), size='m'),
          obj=tbl([R('Transkription',1,0),R('Untertitel-Rohfassung',1,0),R('Korrektur',0,1)]),
          cursors=[{'name':'QC','path':[[1.2,900,1500],[1.8,760,1330]],'clicks':[1.85]}],
          layout='textTop', sfx=SFX(('hit',0),('haken',1.85))),
        B("Recherche. KI. Trends, Hooks anderer Branchen, Zahlen prüfen.",
          T(line(K('Recherche →'),A('KI')), P('Trends · Hooks · Zahlen prüfen'), size='m'),
          obj=tbl([R('Transkription',1,0),R('Untertitel-Rohfassung',1,0),R('Korrektur',0,1),R('Recherche',1,0)]),
          layout='textTop', sfx=SFX(('hit',0),('click',.8))),
        B("Und jetzt die andere Seite.",
          T(A('Die andere Seite'), size='l'), punch=True, flash=True,
          obj=tbl([R('Transkription',1,0),R('Untertitel-Rohfassung',1,0),R('Korrektur',0,1),R('Recherche',1,0)],hiCol=2),
          layout='textTop', sfx=SFX(('whoosh',0),('hit',.1))),
        B("Schnitt. Mensch.",
          T(line(K('Schnitt →'),A('Mensch')), size='l'),
          obj=tbl([R('Schnitt',0,1)],hiCol=2),
          cursors=[{'name':'Editor','path':[[.3,300,1150],[.7,520,1150]],'clicks':[.7]}],
          layout='textTop', sfx=SFX(('hit',0),('click',.7))),
        B("Animation. Mensch.",
          T(line(K('Animation →'),A('Mensch')), size='l'),
          obj=tbl([R('Schnitt',0,1),R('Animation',0,1)],hiCol=2),
          abs=[{'type':'panel','kind':'graph','x':700,'y':1560,'w':320,'at':.3}],
          layout='textTop', sfx=SFX(('hit',0),('click',.5))),
        B("Hook-Entscheidung, Taktung, Farbe, Ton. Mensch. Mensch. Mensch. Mensch.",
          T(P('Hook · Taktung · Farbe · Ton'), A('Mensch'), size='l'),
          obj=tbl([R('Schnitt',0,1),R('Animation',0,1),R('Hook-Entscheidung',0,1),R('Taktung',0,1),R('Farbe',0,1),R('Ton',0,1)],hiCol=2,step=.16),
          layout='textTop', sfx=SFX(('hit',0))+[{'name':'hit','at':.5+i*.16} for i in range(4)]),
        B("Warum? Weil man es sieht. Ein Template erkennt man in einer Sekunde. Eine Entscheidung nicht.",
          T(P('weil man es sieht'), line(K('Template'),A('≠ Entscheidung')), size='m'),
          obj={'type':'split','items':[{'k':'Template','v':'1 s','cls':'r','sub':'erkannt'},{'k':'Entscheidung','v':'∞','cls':'t','sub':'bleibt'}],'at':.5,'step':.6},
          layout='textTop', sfx=SFX(('hit',0),('buzz',.6),('pling',1.2))),
        B("Welche Frage sollen wir als Nächstes beantworten?",
          T(A('Nächste Frage?'), P('schreib sie in die Kommentare'), size='l'),
          obj={'type':'comments','items':[{'name':'du','text':'Frage: …','typing':True,'typeDur':.5,'at':.5,'time':'jetzt'}],'at':.5},
          layout='textTop', sfx=SFX(('hit',0))+[{'name':'type','at':.6+i*.09} for i in range(5)]),
    ]
    return {'slug':'arbeitet-ihr-mit-ki','fps':25,'beats':beats,'ident':IDENT}
