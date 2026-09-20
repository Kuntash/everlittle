from pathlib import Path
import json,html,subprocess,shutil
p=Path(__file__).resolve().parent
items=json.loads((p/'content.json').read_text())
for i in items:
 if i['format']!='reel':continue
 d=p/i['id']/'composition'
 if not (d/'hyperframes.json').exists():
  r=subprocess.run(['npx','hyperframes@0.8.40','init',str(d),'--non-interactive','--example=blank','--skill=general-video'],capture_output=True,text=True)
  if r.returncode:raise RuntimeError(r.stdout+r.stderr)
 (d/'assets').mkdir(exist_ok=True)
 for src,dest in [(p/'assets'/ (i['id']+'.mp4'),'footage.mp4'),(p/'assets/nunito.woff2','nunito.woff2'),(Path('apps/hyperframes/variants/06-first-night/assets/gsap.min.js'),'gsap.min.js')]:shutil.copy(src,d/'assets'/dest)
 (d/'BRIEF.md').write_text(f'''---
workflow: general-video
flow: automation
storyboard: no
---
# {i['title']}
Create a 10-second vertical Instagram reel for Everlittle. User requested Google Flow UGC, plain white text, short pacing and no added music. Deliver a finished draft for review, not publication. Angle: {i['angle']}. Three caption beats over one uninterrupted shot. No invented app UI, testimonials or interface claims. Source provenance in ../../flow-sources.json. Natural generated audio retained.
''')
 (d/'design.md').write_text('Use the established Everlittle Nunito Sans type at 850 weight, white captions with a dark outline for legibility. Full-frame portrait UGC is the focal element. Captions occupy the lower-middle safe area, 110px from left and 150px from right; small Everlittle credit below. No boxes, gradients, visual effects or extra music. Hard text changes preserve reading time; motion comes from the shot itself. Canvas 1080x1920.\n')
 captions=''.join(f'<section id="beat{j}" class="clip caption" data-start="{start}" data-duration="{dur}" data-track-index="1"><p>{html.escape(t)}</p></section>' for j,(start,dur,t) in enumerate(zip([0,3.8,7.3],[3.8,3.5,2.7],i['beats'])))
 (d/'index.html').write_text(f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><title>{html.escape(i['title'])}</title><script src="assets/gsap.min.js"></script><style>
@font-face{{font-family:Nunito;src:url(assets/nunito.woff2);font-weight:200 1000}}*{{box-sizing:border-box}}html,body{{margin:0;width:100%;height:100%;background:#222;font-family:Nunito,sans-serif}}#root{{position:relative;width:100%;height:100%;overflow:hidden}}.clip{{position:absolute;inset:0;width:100%;height:100%}}video{{object-fit:cover}}.caption{{display:flex;align-items:flex-start;justify-content:center;padding:1100px 150px 0 110px}}p{{margin:0;text-align:center;color:#fff;font-size:64px;font-weight:850;line-height:1.2;-webkit-text-stroke:5px #191919;paint-order:stroke fill;text-shadow:0 2px 3px #151515}}.brand{{position:absolute;left:110px;right:150px;top:1480px;font-size:32px;font-weight:750}}
</style></head><body><div id="root" data-composition-id="{i['id']}" data-width="1080" data-height="1920" data-duration="10"><video id="footage" class="clip" src="assets/footage.mp4" muted playsinline data-start="0" data-duration="10" data-track-index="0"></video>{captions}<p class="brand">everlittle · keep their little history</p><audio id="ambient" src="assets/footage.mp4" data-start="0" data-duration="10" data-volume="0.7" data-track-index="2"></audio></div><script>window.__timelines=window.__timelines||{{}};window.__timelines['{i['id']}']=gsap.timeline({{paused:true}});</script></body></html>''')
 subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-ss','2','-i',str(p/'assets'/(i['id']+'.mp4')),'-frames:v','1',str(p/'assets'/(i['id']+'.jpg'))],check=True)
 print('Built '+i['id'],flush=True)
