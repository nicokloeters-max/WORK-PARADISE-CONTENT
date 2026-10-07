from _dsl import *
# 21 · In 0,5 Sekunden · Kurz (Frame-Sektion)
IDENT={'mode':'short','dur':2.2,'sfx':[('scroll',0,.55),('stopp',.5),('click',.78),('logo',.8)]}
def strip(hi,on): return {'type':'strip','n':13,'hiAt':[[0,hi]] if hi is not None else [],'onAt':[[0,on]] if on is not None else [],'at':0}
def ph(extra=None):
    s={'kind':'clip','handle':'@daumenstopp','ui':False,'caption':'*Weggewischt','capAt':.3,'capStep':.1}
    if extra: s.update(extra)
    return {'type':'phone','screen':s,'scale':.5,'shift':[0,0],'mode':'rise'}
def build():
    beats=[
        B("Ein Hook ist kein Schnitt. Er ist zwölf gebaute Frames.",
          T(L('In 0,5 Sekunden','cap'), K('Kein Schnitt.'), A('12 Frames')),
          obj=[{'type':'strip','n':13,'at':.3},ph({'frozen':True,'caption':None})],
          objGap=30, layout='textTop', sfx=SFX(('hit',0))+[{'name':'tick','at':.3+i*.04} for i in range(13)]),
        B("Frame null. Das Bild ist schon in Bewegung. Zoom-Punch startet, nicht aus dem Stand.",
          T(line(D('F00','cap'),A('Bild')), P('schon in Bewegung'), size='m'), punch=.08,
          obj=[strip(0,0),ph({'caption':None})],
          cursors=[{'name':'Editor','path':[[.8,900,1500],[1.3,640,1200]],'clicks':[1.35]}],
          objGap=30, layout='textTop', sfx=SFX(('hit',0),('click',1.35))),
        B("Frame drei. Der Text schlägt ein. Ein Wort, nicht ein Satz.",
          T(line(D('F03','cap'),A('Text')), P('ein Wort, nicht ein Satz'), size='m'),
          obj=[strip(3,3),ph({'capAt':.2})],
          abs=[{'type':'panel','kind':'graph','x':700,'y':1560,'w':320,'at':.6}],
          objGap=30, layout='textTop', sfx=SFX(('hit',0),('hit',.2))),
        B("Frame fünf. Der Sound. Sub-Thud plus Klick, auf den Textschlag gelegt.",
          T(line(D('F05','cap'),A('Ton')), D('Sub + Klick'), size='m'),
          obj=[strip(5,5),{'type':'wave','bars':56,'h':200,'spikeAt':.3,'freq':9}],
          objGap=30, layout='textTop', sfx=SFX(('hit',0),('stopp',.3),('click',.32))),
        B("Frame zwölf. Eine halbe Sekunde. Alle drei haben gezündet. Der Daumen steht.",
          T(line(D('F12','cap'),A('0,5 s')), F('der Daumen steht', extra=.1), size='m'),
          obj=[strip(12,12)],
          abs=[{'type':'thumb','size':520,'x':540-260+200,'y':1100,'at':.9,'dur':.26,'fromX':600,'fromY':900,'selfEnter':True}],
          hud={'tcbar':{'start':.1,'dur':1.7,'stopAt':.294}},
          layout='textTop', sfx=SFX(('hit',0),('stopp',1.16),('click',1.3))),
        B("Gebaut, nicht geschnitten. Schick uns dein Video, wir zerlegen deine ersten zwölf Frames.",
          T(A('Gebaut'), P('schick uns dein Video per DM'), size='l'),
          obj={'type':'phone','screen':{'kind':'dm','title':'Daumenstopp','items':[{'name':'du','text':'Hier mein Video: …'},{'name':'Daumenstopp','text':'F00 Bild · F03 Text · F05 Ton …'}],'at':.4},'scale':.52,'shift':[0,20],'mode':'rise'},
          layout='textTop', sfx=SFX(('hit',0),('pling',.6),('pling',1.2))),
    ]
    return {'slug':'in-0-5-sekunden','fps':25,'beats':beats,'ident':IDENT}
