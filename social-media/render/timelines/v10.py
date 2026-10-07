from _dsl import *
# 10 · Roh → Edit · Mittel (Regler-Dramaturgie)
IDENT={'mode':'short','dur':2.2,'sfx':[('scroll',0,.55),('stopp',.5),('click',.78),('logo',.8)]}
MARKS=[.2,.36,.52,.68,.84]
def sl(keys,cap,markAt=None,extra=None):
    d={'type':'slider','w':720,'h':720,'keys':keys,'caption':cap,'marks':5,'markAt':markAt or [99]*5}
    if extra: d.update(extra)
    return d
def build():
    beats=[
        B("Links Rohmaterial. Rechts dasselbe Material.",
          T(line(D('ROH · S-LOG3'),K('·'),D('DAUMENSTOPP-EDIT','cap')), size='s'),
          obj=sl([[0,.5],[.3,.5],[1.0,.53],[1.8,.47]],'Dasselbe *Material'),
          layout='textTop', sfx=SFX(('hit',0))),
        B("Fünf Schritte dazwischen.",
          T(A('Fünf Schritte'), size='l'),
          obj=sl([[0,.5]],'Fünf *Schritte',[.3,.42,.54,.66,.78]),
          layout='textTop', sfx=SFX(('hit',0),('tick',.3),('tick',.42),('tick',.54),('tick',.66),('tick',.78))),
        B("Eins. Grading. Belichtung, Weißabgleich, Hauttöne. Dann der Look.",
          T(line(D('1','cap'),A('Grading')), P('Belichtung · Weißabgleich · Hauttöne'), size='m'),
          obj=sl([[0,.05],[1.2,.2]],'*Grading',[0,99,99,99,99]),
          abs=[{'type':'panel','kind':'values','rows':[['Lift','R −.02 · B +.03'],['Gamma','R +.04'],['Gain','B −.02']],'x':700,'y':1560,'w':320,'at':.8}],
          layout='textTop', sfx=SFX(('hit',0),('rattle',.5))),
        B("Zwei. Captions. Wort für Wort, in der Markenschrift.",
          T(line(D('2','cap'),A('Captions')), P('Wort für Wort'), size='m'),
          obj=sl([[0,.2],[1.0,.36]],'Wort für *Wort',[0,0,99,99,99]),
          layout='textTop', sfx=SFX(('hit',0),('type',.3),('type',.5),('type',.7))),
        B("Drei. Sound. Dialog gesäubert, Musik, Akzente, minus vierzehn LUFS.",
          T(line(D('3','cap'),A('Sound')), D('−14 LUFS'), size='m'),
          obj=[sl([[0,.36],[1.0,.52]],'*Sound',[0,0,0,99,99],{'h':520}),{'type':'wave','dirty':True,'cleanAt':.8,'bars':48,'h':160}],
          objGap=20, layout='textTop', sfx=SFX(('hit',0),('buzz',.3),('pling',1.0))),
        B("Vier. Motion. Lower Third, Logo, Übergänge. Gebaut, nicht Template.",
          T(line(D('4','cap'),A('Motion')), P('gebaut, nicht Template'), size='m'),
          obj=sl([[0,.52],[1.0,.68]],'*Motion',[0,0,0,0,99]),
          abs=[{'type':'panel','kind':'graph','x':700,'y':1560,'w':320,'at':.6}],
          layout='textTop', sfx=SFX(('hit',0),('click',.4),('click',.6),('click',.8))),
        B("Fünf. Der Hook. Die ersten null Komma fünf Sekunden werden neu gebaut.",
          T(line(D('5','cap'),A('Hook')), D('00:00:00:12','cap'), size='m'),
          obj=sl([[0,.68],[1.0,.84]],'Der *Hook',[0,0,0,0,0]),
          hud={'tcbar':{'start':.3,'dur':1.7,'stopAt':.294}},
          layout='textTop', sfx=SFX(('hit',0),('stopp',.8))),
        B("Dasselbe Material. Fünf Entscheidungen.",
          T(A('Fünf Entscheidungen'), F('dasselbe Material', extra=.1), size='m'),
          obj=sl([[0,.05],[2.6,.95]],'Fünf *Entscheidungen',[0,0,0,0,0]),
          layout='textTop', sfx=SFX(('hit',0),('whoosh',.6),('whoosh',1.6))),
        B("Speicher dir die fünf als Checkliste für dein nächstes Video.",
          T(A('Speichern'), P('Checkliste für dein nächstes Video'), size='l'),
          obj={'type':'checklist','items':[{'s':'Grading','at':.3},{'s':'Captions','at':.5},{'s':'Sound · −14 LUFS','at':.7},{'s':'Motion','at':.9},{'s':'Hook · 0,5 s','at':1.1}],'width':820},
          layout='textTop', sfx=SFX(('hit',0),('haken',.65),('haken',.85),('haken',1.05),('haken',1.25),('haken',1.45),('pling',1.6))),
    ]
    return {'slug':'roh-edit','fps':25,'beats':beats,'ident':IDENT}
