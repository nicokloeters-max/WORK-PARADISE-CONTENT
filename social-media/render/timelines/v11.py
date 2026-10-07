from _dsl import *
# 11 · Hook-Bank: Fünf Formeln · Mittel
IDENT={'mode':'short','dur':2.2,'sfx':[('scroll',0,.55),('stopp',.5),('click',.78),('logo',.8)]}
CARDS=[{'icon':'q','label':'Die Frage','n':1},{'icon':'bolt','label':'Die Behauptung','n':2},{'icon':'eye','label':'Das Visual','n':3},{'icon':'graph','label':'Die Zahl','n':4},{'icon':'tri','label':'Der Widerspruch','n':5}]
def cards(hi):
    items=[dict(c) for c in CARDS]
    for i,c in enumerate(items):
        if i==hi: c['hi']=True
        elif hi is not None: c['dimAt']=0
    return {'type':'cards','items':items,'at':0,'step':.04,'mode':'pop','width':960}
def build():
    beats=[
        B("Es gibt nur fünf Arten, einen Daumen zu stoppen.",
          T(P('es gibt nur'), A('Fünf Arten'), P('einen Daumen zu stoppen')),
          obj={'type':'cards','items':CARDS,'at':.8,'step':.12,'mode':'pop','width':960},
          abs=[{'type':'thumb','size':380,'x':700,'y':640,'at':.2,'dur':.26,'fromX':500,'fromY':-700,'selfEnter':True}],
          layout='textTop', sfx=SFX(('hit',0),('stopp',.45))+[{'name':'tick','at':.8+i*.12} for i in range(5)]),
        B("Eins. Die Frage.",
          T(line(D('1','cap'),A('Die Frage')), size='l'), obj=cards(0), layout='textTop', sfx=SFX(('hit',0))),
        B("„Warum sieht das keiner?“ Eine Frage, die der Zuschauer sich selbst stellt.",
          T(line(K('Warum sieht das'),A('keiner?')), F('stellt er sich selbst', extra=.1), size='m'),
          obj={'type':'phone','screen':{'kind':'clip','handle':'@marke','caption':'Warum sieht das *keiner?','capAt':.3},'scale':.56,'shift':[0,30],'mode':'rise'},
          hud={'tcbar':{'start':.2,'dur':1.7,'stopAt':.294}},
          layout='textTop', sfx=SFX(('hit',0),('stopp',.7))),
        B("Zwei. Die Behauptung.",
          T(line(D('2','cap'),A('Die Behauptung')), size='l'), obj=cards(1), layout='textTop', sfx=SFX(('hit',0))),
        B("„Hör auf, so zu posten.“ Eine Aussage, der man widersprechen will. Oder zustimmen. Beides hält.",
          T(line(K('Hör auf,'),A('so'),K('zu posten.')), P('widersprechen oder zustimmen · beides hält'), size='m'),
          obj={'type':'comments','items':[{'name':'tom_k','text':'Stimmt.','at':.9,'likes':'8'},{'name':'lisa.m','text':'Quatsch.','at':1.4,'likes':'5'}],'at':.9},
          layout='textTop', sfx=SFX(('hit',0),('whoosh',.9),('whoosh',1.4))),
        B("Drei. Das Visual.",
          T(line(D('3','cap'),A('Das Visual')), size='l'), obj=cards(2), layout='textTop', sfx=SFX(('hit',0))),
        B("Ein Bild, das die Frage ist. Vorher-Nachher-Regler, ein Zoom, eine Hand, die etwas aufdeckt.",
          T(F('das Bild ist die Frage', extra=0), P('Regler · Zoom · Hand'), size='m'),
          obj={'type':'slider','w':640,'h':600,'keys':[[0,.5],[.4,.5],[1.2,.6],[2.0,.4]],'caption':'Das Bild ist die *Frage','tc':False},
          layout='textTop', sfx=SFX(('hit',0),('whoosh',.4))),
        B("Vier. Die Zahl.",
          T(line(D('4','cap'),A('Die Zahl')), size='l'), obj=cards(3), layout='textTop', sfx=SFX(('hit',0))),
        B("„Eins Komma sieben Sekunden.“ Konkret, sofort lesbar, erzeugt die Frage: und dann?",
          T(line(N('1,7',**{'from':0,'to':1.7,'dec':1,'dur':.5}),A('Sekunden')), F('und dann?', extra=.1), size='m'),
          hud={'tcbar':{'start':.2,'dur':1.7}},
          sfx=SFX(('hit',0),('rattle',.1),('tick',.7),('tick',1.2),('tick',1.7))),
        B("Fünf. Der Widerspruch.",
          T(line(D('5','cap'),A('Der Widerspruch')), size='l'), obj=cards(4), layout='textTop', sfx=SFX(('hit',0))),
        B("„Follower sind egal.“ Ein Satz gegen die Erwartung. Er zwingt zum Weiterschauen, um ihn einzuordnen.",
          T(line(K('Follower sind'),A('egal.')), P('gegen die Erwartung'), size='m'),
          obj=[{'type':'counter','from':100000,'to':100000,'sm':True,'at':0,'dur':.1,'outAt':1.2,'outDur':.6},
               {'type':'bars','items':[{'k':'','v':82,'c':'t','label':'Watch-Time','at':1.4}],'at':1.4}],
          layout='textTop', sfx=SFX(('hit',0),('pitchdown',1.2),('rattle',1.4))),
        B("Fünf Formeln. Pro Video bauen wir drei davon und testen, welche stoppt.",
          T(A('5 Formeln'), P('drei davon pro Video'), D('A · B · C','cap'), size='m'),
          obj={'type':'cards','items':[{'icon':'q','label':'Die Frage','n':1,'hiAt':1.2},{'icon':'bolt','label':'Die Behauptung','n':2,'hiAt':1.35},{'icon':'eye','label':'Das Visual','n':3,'hiAt':1.5},{'icon':'graph','label':'Die Zahl','n':4},{'icon':'tri','label':'Der Widerspruch','n':5}],'at':.2,'step':.06,'mode':'pop','width':960},
          layout='textTop', sfx=SFX(('hit',0),('click',1.2),('click',1.35),('click',1.5))),
        B("Speicher dir die fünf. Und schreib uns, welche du als Nächstes testest.",
          T(A('Speichern'), P('welche testest du als Nächstes?'), size='l'),
          obj={'type':'comments','items':[{'name':'du','text':'Ich teste Formel 4.','typing':True,'typeDur':.9,'at':.5,'time':'jetzt'}],'at':.5},
          layout='textTop', sfx=SFX(('pling',0),('hit',.1))+[{'name':'type','at':.6+i*.1} for i in range(8)]),
    ]
    return {'slug':'hook-bank-fuenf-formeln','fps':25,'beats':beats,'ident':IDENT}
