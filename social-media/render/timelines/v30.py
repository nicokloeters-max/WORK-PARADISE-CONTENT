from _dsl import *
# 30 · Ein Look, an dem man euch erkennt · Kurz
IDENT={'mode':'short','dur':2.2,'sfx':[('scroll',0,.55),('stopp',.5),('click',.78),('logo',.8)]}
def row(seeds,caps,hidden=True,mode='rise'):
    return [{'type':'phone','screen':{'kind':'clip','seed':s,'handle':'████' if hidden else '@eure_marke','tc':False,'ui':False,'caption':c,'capSmall':True,'capAt':.3,'capCls':'' if not hidden else 'plain'},'w':300,'mode':mode,'at':.1+i*.12} for i,(s,c) in enumerate(zip(seeds,caps))]
def build():
    beats=[
        B("Erkennt man eure Videos, bevor man liest, von wem sie sind?",
          T(P('bevor man liest'), A('Erkennt man euch?'), size='m'),
          obj=row([0,1,2],['Neu im Shop','Unser Team','Sale'],True), objDir='row', objGap=24, layout='textTop', sfx=SFX(('hit',0),('hit',.1),('hit',.22),('hit',.34))),
        B("Bei den meisten: nein. Jedes Video sieht anders aus. Andere Schrift, andere Farbe, andere Captions.",
          T(P('bei den meisten'), A('Nein', cls='red'), P('Schrift · Farbe · Captions'), size='m'),
          obj=row([3,0,2],['Neu im Shop','Unser Team','Sale'],True,'pop'), objDir='row', objGap=24,
          cursors=[{'name':'CD','path':[[1.2,200,1300],[1.7,540,1300],[2.2,880,1300]],'clicks':[1.2,1.7,2.2]}],
          layout='textTop', sfx=SFX(('hit',0),('click',1.2),('click',1.7),('click',2.2))),
        B("Deshalb bauen wir vor dem ersten Schnitt euren Look.",
          T(P('vor dem ersten Schnitt'), A('Euer Look'), size='l'),
          obj={'type':'cards','items':[{'icon':'type','label':'Schrift'},{'icon':'palette','label':'Farben'},{'icon':'text','label':'Captions'},{'icon':'motion','label':'Motion'}],'at':.6,'step':.0,'mode':'pop','width':940},
          layout='textTop', sfx=SFX(('hit',0),('whoosh',.6))),
        B("Schrift.", T(line(D('1','cap'),A('Schrift')), size='l'), min=1.4,
          obj={'type':'cards','items':[{'icon':'type','label':'[[Font]]','hiAt':.2},{'icon':'palette','label':'Farben'},{'icon':'text','label':'Captions'},{'icon':'motion','label':'Motion'}],'at':0,'step':0,'mode':'fade','width':940},
          layout='textTop', sfx=SFX(('click',.2))),
        B("Farben.", T(line(D('2','cap'),A('Farben')), size='l'), min=1.4,
          obj={'type':'cards','items':[{'icon':'type','label':'[[Font]]','hi':True},{'icon':'palette','label':'[[Hex]]','hiAt':.2},{'icon':'text','label':'Captions'},{'icon':'motion','label':'Motion'}],'at':0,'step':0,'mode':'fade','width':940},
          layout='textTop', sfx=SFX(('click',.2))),
        B("Caption-Stil.", T(line(D('3','cap'),A('Captions')), size='l'), min=1.4,
          obj={'type':'cards','items':[{'icon':'type','label':'[[Font]]','hi':True},{'icon':'palette','label':'[[Hex]]','hi':True},{'icon':'text','label':'Wort für Wort','hiAt':.2},{'icon':'motion','label':'Motion'}],'at':0,'step':0,'mode':'fade','width':940},
          layout='textTop', sfx=SFX(('click',.2))),
        B("Motion. Lower Third, Logo, Übergänge.", T(line(D('4','cap'),A('Motion')), P('Lower Third · Logo · Übergänge'), size='m'),
          obj={'type':'cards','items':[{'icon':'type','label':'[[Font]]','hi':True},{'icon':'palette','label':'[[Hex]]','hi':True},{'icon':'text','label':'Wort für Wort','hi':True},{'icon':'motion','label':'[[Logo]]','hiAt':.2}],'at':0,'step':0,'mode':'fade','width':940},
          abs=[{'type':'panel','kind':'graph','x':700,'y':1560,'w':320,'at':.5}],
          layout='textTop', sfx=SFX(('click',.2),('click',.6),('click',.9))),
        B("Du gibst den Style-Frame frei. Erst dann schneiden wir.",
          T(P('du gibst frei'), A('Erst dann'), size='l'),
          obj={'type':'checklist','items':[{'s':'Style-Frame freigegeben','at':.3,'checkDelay':.9}],'width':860},
          cursors=[{'name':'Du','path':[[.4,900,1400],[1.1,170,1130]],'clicks':[1.2]}],
          layout='textTop', sfx=SFX(('hit',0),('click',1.2),('haken',1.25))),
        B("Danach: drei verschiedene Videos. Ein Look.",
          T(A('Ein Look'), F('drei Videos', extra=.1), size='l'),
          obj=row([1,1,1],['Neu im *Shop','Unser *Team','*Sale'],False,'pop'), objDir='row', objGap=24, layout='textTop', sfx=SFX(('hit',0),('click',.1),('click',.22),('click',.34),('riser',.6))),
        B("Willst du sehen, wie euer Style-Frame aussähe? Schreib LOOK per DM.",
          T(A('LOOK', size='xl'), P('per DM'), size='m'),
          obj={'type':'phone','screen':{'kind':'dm','title':'Daumenstopp','items':[{'name':'du','text':'LOOK'},{'name':'Daumenstopp','text':'Schick uns Logo und Website …'}],'at':.4},'scale':.52,'shift':[0,20],'mode':'rise'},
          layout='textTop', sfx=SFX(('hit',0),('pling',.6),('pling',1.2))),
    ]
    return {'slug':'ein-look-an-dem-man-euch-erkennt','fps':25,'beats':beats,'ident':IDENT}
