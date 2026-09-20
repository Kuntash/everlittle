from pathlib import Path
import json,subprocess,concurrent.futures
p=Path(__file__).resolve().parent
items=[i for i in json.loads((p/'content.json').read_text()) if i['format']=='reel']
def check(i):
 d=p/i['id'];r=subprocess.run(['npx','hyperframes@0.8.40','check',str(d/'composition')],capture_output=True,text=True);(d/'check.log').write_text(r.stdout+r.stderr);print(i['id'],r.returncode,(r.stdout+r.stderr)[-1300:],flush=True);return r.returncode
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as e:results=list(e.map(check,items))
raise SystemExit(any(results))
