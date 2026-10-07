import numpy as np, wave
def write(path,x,sr):
    x=np.clip(x,-1,1); pcm=(x*32767).astype('<i2')
    with wave.open(path,'wb') as w:
        w.setnchannels(x.shape[1] if x.ndim>1 else 1); w.setsampwidth(2); w.setframerate(sr); w.writeframes(pcm.tobytes())
