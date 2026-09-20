from pathlib import Path
import json,shutil,html,subprocess,csv
P=Path(__file__).resolve().parent
reels=[
('01-memory-keeper','The family memory keeper','POV: your family says you take too many photos.','Also your family: “Send me that one.”','Send this to your family’s photographer.','Recognition + affectionate humour','Your family’s unofficial photographer deserves a little appreciation. The blurry breakfasts count too.\n\nKeep the photos and the stories behind them together in Everlittle. Link in bio.\n\nSend this to the person who always remembers to take the picture.'),
('02-grandmas-recipe','Grandma’s measurements','Grandma’s recipe says “a handful.”','Her hands are the instructions.','Record the way she makes it.','Concrete sensory detail + useful action','A pinch. A handful. “You’ll know when it’s ready.”\n\nNext time you cook together, ask if you can record the little details the recipe leaves out. Save the story behind the dish with your family’s memories in Everlittle.\n\nWhich family recipe would you start with?'),
('03-in-the-picture','Get the memory keeper in the picture','You’re in everyone’s life.','Are you in the photos?','Hand someone else the phone today.','Recognition + gentle challenge','For the person behind every birthday photo and every first-day picture: you belong in the memories too.\n\nHand the phone over for one ordinary moment today. Keep it with your family’s stories in Everlittle.\n\nSend this to someone who needs to get in the picture.'),
('04-little-words','Before the little words change','One day, “pasghetti” becomes spaghetti.','Write it down while it’s still “wrong.”','What word would you save?','Specific childhood detail + conversation','Their little words deserve a place beside the photos. Write down the phrase, their age and the moment it came from.\n\nKeep it as a story in your family’s Everlittle archive. Link in bio.\n\nWhat did your child call something before they learned the word?'),
('05-bedtime-across-miles','Bedtime across the miles','Different time zones.','Same favourite storyteller.','Save a little of their voice.','Long-distance family connection','A familiar voice can make a faraway person feel a little closer. Ask a grandparent to record a short story, a family memory or their favourite goodnight.\n\nKeep that voice with your family’s photos and stories in Everlittle.\n\nWho would you ask to record the first one?'),
('06-ordinary-tuesday','An ordinary Tuesday','No birthday. No first steps.','Just Tuesday. Still worth keeping.','Save an ordinary moment today.','Permission to preserve everyday life','The kitchen dances. The mismatched socks. The breakfast nobody finished.\n\nYour family’s story happens between the milestones too. Save one ordinary moment and a sentence about it in Everlittle.\n\nWhat would you save from today?')]
items=[]
for n,(id,title,a,b,c,angle,caption) in enumerate(reels):
 items.append(dict(id=id,title=title,format='reel',hook=a,beats=[a,b,c],angle=angle,caption=caption+'\n\n#Everlittle #FamilyMemories #MemoryKeeping',metric='Shares per viewer' if n in [0,2] else 'Saves and meaningful comments per viewer',alt=title+' — illustrative family scene with white captions.',duration=10))
cars=[
('07-ask-grandparents','Ask a better question','“Tell me about your life” is a big question.', 'Specific prompts reduce the effort of starting',[
('“Tell me about your life”\nis a big question.','Start with one of these instead.','START SMALL'),
('What did home\nsound like?','The radio in the kitchen. A familiar voice. The street outside.','01 / THE EVERYDAY'),
('Who taught you\nyour favourite recipe?','Then ask: what do you do differently now?','02 / THE HAND-ME-DOWN'),
('What made you laugh\nwhen you were my age?','Leave room for the detour. That may be the best part.','03 / THE SURPRISE'),
('One question.\nOne voice.\nA little more of them.','Ask before recording. Keep their story with your family’s memories in Everlittle.','SAVE FOR YOUR NEXT CALL')],
'You don’t need to interview a whole lifetime. Start with one small question and follow the story.\n\nSave these prompts for your next call. Ask permission before recording, then keep the memory with your family in Everlittle. Link in bio.'),
('08-first-letter','Your first letter in three sentences','A letter to your child can start with three sentences.','Practical template + product relevance',[
('A letter to your child\ncan start with\nthree sentences.','No grand speech required.','LETTERS FOR LATER'),
('“Right now, you…”','Keep one tiny detail: a favourite phrase, a small habit, the way they greet you.','01 / NOTICE'),
('“Today, I loved…”','Choose one moment. The smaller and more specific, the more it feels like them.','02 / REMEMBER'),
('“I hope you know…”','Finish with something you want them to carry into the future.','03 / SAY IT'),
('That’s enough\nfor a first letter.','Save it in an Everlittle time capsule for a date in their future. Link in bio.','SAVE THIS STARTING POINT')],
'A letter doesn’t need to sum up everything you feel. These three starts are enough for today.\n\nSave this template. Write one small letter, then keep it in an Everlittle time capsule for a future date. Link in bio.'),
('09-photo-needs-story','The photo needs one sentence','A photo shows what happened. A sentence saves what it meant.','Before-and-after utility',[
('A photo shows\nwhat happened.','A sentence saves what it meant.','KEEP A LITTLE MORE'),
('The photo:\na pair of muddy shoes.','The story: “You jumped into every puddle because you thought they were little oceans.”','AN EXAMPLE'),
('The photo:\na kitchen table.','The story: “This was where Grandpa taught you his very questionable card tricks.”','AN EXAMPLE'),
('Try this after\nyour next photo.','“I want to remember this because…”\nFinish the sentence. That’s the story.','YOUR TURN'),
('Keep the photo.\nKeep the why.','Add the little story beside it in Everlittle. Link in bio.','SAVE THIS PROMPT')],
'Future you might remember the place and still forget the joke.\n\nAdd one sentence to a photo today: “I want to remember this because…” Keep both together in Everlittle.\n\nThe examples in these slides are illustrative. What story would you add to your latest photo?'),
('10-seven-ordinary-things','Seven ordinary things','Seven things worth saving before they become “remember when?”','Saveable checklist',[
('7 things worth saving\nbefore they become\n“remember when?”','Your family’s ordinary is worth keeping.','THE LITTLE LIST'),
('01  A funny mispronunciation\n02  Their favourite song','Write down the words. Ask for a little performance if they’re in the mood.','THE WAY THEY SOUND'),
('03  A kitchen ritual\n04  The everyday walk','What always happens? What do they stop to notice?','THE THINGS YOU REPEAT'),
('05  A family nickname\n06  A grandparent’s saying\n07  An ordinary hug','Save the story behind it, not just the moment.','THE THINGS THAT FEEL LIKE HOME'),
('Pick one today.','A photo, a voice note or a few lines. Keep it with your family in Everlittle.','SAVE THE LIST')],
'You don’t need to collect everything. Start with one ordinary thing from this list.\n\nSave it for the days when “I should write that down” turns into “What was it again?”\n\nEverlittle keeps your family’s photos, voices, stories and letters together. Link in bio.')]
for id,title,hook,angle,slides,caption in cars:
 items.append(dict(id=id,title=title,format='carousel',hook=hook,angle=angle,slides=[dict(title=a,body=b,label=c) for a,b,c in slides],caption=caption+'\n\n#Everlittle #FamilyMemories #MemoryKeeping',metric='Saves per viewer; meaningful comments',alt=title+' — five cream and ink prompt cards.'))
order=['01-memory-keeper','07-ask-grandparents','02-grandmas-recipe','03-in-the-picture','08-first-letter','04-little-words','09-photo-needs-story','05-bedtime-across-miles','06-ordinary-tuesday','10-seven-ordinary-things']
for i in items:
 i['publish_order']=order.index(i['id'])+1
 d=P/i['id']; d.mkdir(exist_ok=True)
 (d/'caption.txt').write_text(i['caption']+'\n')
(P/'content.json').write_text(json.dumps(items,ensure_ascii=False,indent=2))
shutil.copy('apps/hyperframes/variants/06-first-night/assets/nunito-sans-latin-wght-normal.woff2',P/'assets/nunito.woff2')
with (P/'tracking.csv').open('w') as f:
 w=csv.writer(f);w.writerow(['order','id','format','hook','primary_metric','posted_at','url','24h_views','24h_viewers','24h_saves','24h_shares','24h_follows','72h_views','72h_viewers','72h_saves','72h_shares','72h_follows','7d_views','7d_viewers','notes'])
 for i in sorted(items,key=lambda i:i['publish_order']):w.writerow([i['publish_order'],i['id'],i['format'],i['hook'],i['metric']])
print('Prepared',len(items),'pieces')
