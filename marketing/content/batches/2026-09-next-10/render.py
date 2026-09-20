from pathlib import Path
import subprocess,json,concurrent.futures
p=Path(__file__).resolve().parent
def render(i):
 d=p/i['id'];assert 'Check passed' in (d/'check.log').read_text()
 r=subprocess.run(['npx','hyperframes@0.8.40','render',str(d/'composition'),'--quality','high','--output',str(d/'reel.mp4')],capture_output=True,text=True);(d/'render.log').write_text(r.stdout+r.stderr);print(i['id'],r.returncode,(r.stdout+r.stderr)[-1000:],flush=True)
 if r.returncode==0:
  for sec,name in [(1,'cover'),(5,'middle'),(8.5,'end')]:subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-ss',str(sec),'-i',str(d/'reel.mp4'),'-frames:v','1',str(d/(name+'.jpg'))],check=True)
 return r.returncode
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as e:rs=list(e.map(render,[i for i in json.loads((p/'content.json').read_text()) if i['format']=='reel']))
raise SystemExit(any(rs))
