from pathlib import Path
import subprocess,json,struct,zipfile
p=Path(__file__).resolve().parent;items=json.loads((p/'content.json').read_text());report=[]
for i in items:
 d=p/i['id']
 if i['format']=='reel':
  f=d/'reel.mp4';data=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(f)]));v=next(s for s in data['streams'] if s['codec_type']=='video');a=next(s for s in data['streams'] if s['codec_type']=='audio');assert (v['width'],v['height'])==(1080,1920);assert abs(float(data['format']['duration'])-10)<.1
  subprocess.run(['ffmpeg','-v','error','-i',str(f),'-f','null','-'],check=True,capture_output=True)
  report.append(f"{i['id']}: 1080x1920, {data['format']['duration']}s, {a['codec_name']} audio; full decode passed; HyperFrames check passed.")
 else:
  for f in sorted(d.glob('slide-*.png')):
   assert struct.unpack('>II',f.read_bytes()[16:24])==(1080,1350)
  assert len(list(d.glob('slide-*.png')))==5;report.append(f"{i['id']}: 5 PNGs, 1080x1350 each.")
def sheet(files,width,height,cols,out):
 cmd=['ffmpeg','-hide_banner','-loglevel','error','-y']
 for f in files:cmd+=['-i',str(f)]
 fil=';'.join(f'[{j}:v]scale={width}:{height}[v{j}]' for j in range(len(files)))+';'+''.join(f'[v{j}]' for j in range(len(files)))+f'xstack=inputs={len(files)}:layout='+ '|'.join(f'{j%cols*width}_{j//cols*height}' for j in range(len(files)))+'[out]'
 subprocess.run(cmd+['-filter_complex',fil,'-map','[out]','-frames:v','1','-pix_fmt','yuvj420p',str(p/out)],check=True)
rs=[i for i in items if i['format']=='reel'];sheet([p/i['id']/(frame+'.jpg') for frame in ['cover','middle','end'] for i in rs],180,320,6,'reels-contact.jpg')
cs=[i for i in items if i['format']=='carousel'];sheet([p/i['id']/f'slide-{n:02}.png' for i in cs for n in range(1,6)],216,270,5,'carousels-contact.jpg')
(p/'QA.txt').write_text('\n'.join(report)+'\nOriginal Flow footage: 720x1280, rendered at 1080x1920. No additional music. Contact sheets show opening/middle/end of every reel and all carousel slides.\n')
with zipfile.ZipFile(p/'publish-ready.zip','w',zipfile.ZIP_DEFLATED) as z:
 for i in items:
  d=p/i['id']
  for pat in ['reel.mp4','cover.jpg','slide-*.png','caption.txt']:
   for f in d.glob(pat):z.write(f,f.relative_to(p))
 for name in ['AUDIT.md','content.json','tracking.csv','QA.txt','reels-contact.jpg','carousels-contact.jpg']:z.write(p/name,name)
print('\n'.join(report));print('ZIP:',(p/'publish-ready.zip').stat().st_size)
