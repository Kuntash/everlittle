"""Convert whisper.cpp full JSON token offsets to the caption script's words format.
Uses recognized speech and observed timestamps; does not fabricate script alignment.
"""
import json,re,sys
from pathlib import Path
src,dst=map(Path,sys.argv[1:3]);j=json.loads(src.read_text());words=[]
for segment in j['transcription']:
    for token in segment.get('tokens',[]):
        t=token['text']
        if t.startswith('[_') or token.get('id',0)>=50256:continue
        o=token.get('offsets',{})
        start=o.get('from',0)/1000;end=o.get('to',0)/1000
        if not t.strip():continue
        if t[0].isspace() or not words:
            words.append({'word':t.strip(),'start':start,'end':max(start,end)})
        else:
            words[-1]['word']+=t
            words[-1]['end']=max(words[-1]['end'],end)
# Separate punctuation-only tokens are attached to the preceding word.
merged=[]
for w in words:
    if not re.search(r'[A-Za-z0-9]',w['word']) and merged:
        merged[-1]['word']+=w['word'];merged[-1]['end']=max(merged[-1]['end'],w['end'])
    else:merged.append(w)
result={'text':' '.join(s['text'].strip() for s in j['transcription']),'words':merged,'source':'Local whisper.cpp base.en, token offsets','source_file':str(src)}
dst.write_text(json.dumps(result,indent=2))
print(result['text']);print('Recognized words:',len(merged));print('Speech span:',merged[0]['start'],merged[-1]['end'])
