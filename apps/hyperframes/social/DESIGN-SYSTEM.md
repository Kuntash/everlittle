# Everlittle social system

Editable source: `content.json` for copy and layout choices; `tokens.json` records the palette. `../scripts/build-posts.mjs` owns the reusable HTML/CSS layouts. Run `node scripts/build-posts.mjs` from the HyperFrames project to rebuild. Export each layout with `npx hyperframes@0.8.34 snapshot social/<id> --at 0 --no-end` after its check passes.

## Visual rules

1080 × 1350 portrait posts. Keep text 76 px from either side. Cream #fffbf4, ink #382d28, terracotta #bf4e35, sage #e8ebde, peach #f2dccd. Nunito Sans matches the current live product; use its local variable font. Headlines 90–106 px, body 34–38 px, labels 23–25 px. Headlines use sentence case and one terracotta phrase. No gradients, fabricated product UI, fake reviews, stock badges, or decorative emojis.

The real Everlittle sprout mark anchors the top left. A small series identifier anchors the top right. An understated rule and footer repeat in every layout. Use sage for personal writing prompts, cream for guidance, terracotta only for emphasis or the CTA. Photos retain their natural colours.

## Layouts

- `00-launch`: ready launch image, brand promise + family photograph + actual responsive app capture.
- `01-cover`: reusable carousel cover. Change the headline to match the actual content, and make sure every promised item exists in the carousel.
- `02-prompt`: one practical memory prompt. Keep the body to two lines and the action to one sentence.
- `03-checklist`: three rows; each row one short idea. Duplicate this slide rather than squeezing six items into one.
- `04-note`: a writing prompt, explicitly labelled as such. Do not present invented writing as a customer's testimonial.
- `05-cta`: one action, always the canonical domain and link-in-bio instruction.

These are six layout examples, not a preassembled carousel. Mix 01 → 02/03/04 → 05 for a cohesive post. For a carousel, replace the top-right identifiers with its actual page numbers. Keep paid-plan claims accurate; account creation is free, adding memories requires a plan.

## Social-skill review

Goal: qualified Instagram visitors and family-archive signups, using the Everlittle company voice. Audience: parents and relatives who want to preserve photos, familiar voices, family stories and letters. Tone: warm, concrete, practical. Avoid parental guilt, mortality pressure, political memes as the brand introduction, invented testimonials and exaggerated performance claims.

Keep the current brand colours, readable contrast, generous spacing and real product captures. Changes made: the cover now says “Little things worth keeping” and sends readers to three useful ideas in its caption. It no longer uses regret as the hook or tells someone to swipe on a single image. Copy-ready captions and alt text accompany every PNG in exports/ and in the review gallery.

One post, one primary action: save a practical prompt; follow/engage with a family story; visit the bio link for a product introduction. Do not stack “like, comment, save, share, follow, click” on one post. Caption first lines add a concrete reason to care instead of repeating the graphic verbatim. Three relevant hashtags are included as optional descriptors, not a growth guarantee.

These six designs are a template library, not a six-slide carousel. A published carousel should choose a framework before copy. Use Value-Stack for practical memory prompts: cover promises exactly three ideas → one idea on each of three identically styled interior slides → a save CTA. Use Demo Walkthrough for a future product carousel: finished archive → reason to keep context → short process overview → actual UI steps → result. Keep the same interior template, type scale and palette within each carousel. Alternate templates between posts, not randomly within one carousel. A writing prompt remains clearly labelled; it is not a customer quote.

Reels remain music-only as requested. Their meaning must work muted. Subtitle advice about two lines applies if narration is added; these versions use graphic headings rather than speech captions. Test one selected launch Reel first, not all three near-identical variants in succession. Use an outcome and a clear visual in the first second, with the CTA after real product proof. No invented promise of virality or a universal optimal length.

## Sustainable content pillars

Starting mix across a month (planning choices, not proven performance ratios): 40% practical memory prompts; 25% family voices and stories; 20% letters for later; 15% product proof and invitations. The launch fortnight can include two introductory product posts, then return to useful content. Build an app brand; founder stories can explain why the product exists without making the account a personal lifestyle feed.

## Revised first two weeks

Relative days, publish manually once ready; no posts have been scheduled. Three feed posts per week is a sustainable starting experiment for this account. Use audience activity data for timing when enough exists, rather than assuming the creator’s timezone is the audience’s timezone.

| Day | Feed post | Purpose and primary CTA | Companion Story |
|---|---|---|---|
| 1 | Launch image 00-launch | Explain Everlittle; bio-link visit | Reshare with a labelled link sticker |
| 3 | Single memory prompt 02-prompt | Deliver one useful idea; save | Optional poll: words / photos / voices |
| 5 | Selected HyperFrames product Reel, first Reel | Show what the app does; bio-link visit; pin | Reshare the Reel |
| 8 | Grandma’s-stories UGC draft, shortened | Family-voice inspiration; save the prompt | Ask which story they would record |
| 10 | Checklist 03-checklist, or a completed Value-Stack carousel | Give practical ideas; save | Show one concrete example |
| 12 | Future-letter UGC draft, shortened | Give a writing starting point; save | Share the labelled letter prompt |

Pin the chosen product Reel and launch image. Use a useful prompt as the third pin if it earns saves. Hold the political green-screen meme for later because it distracts from the product’s family-focused identity. Stock or AI presenter footage must not imply the actor is an actual customer describing a real experience. The current long UGC paragraphs need shortening; put detail in the caption. Suggested hooks: “Save the way Grandma tells it” and “A letter for who they are today.”

Spend 10–15 minutes on posting days replying thoughtfully to comments and participating where family-memory topics are already welcome. Do not cold-DM parents, automate generic comments, or solicit children’s identifying details. Stories and comment questions should be easy to answer without sharing private family information. This is a participation routine, not an automatic outreach instruction.

## Captions and measurement

POST-CAPTIONS.md and captions.json are the source of truth for all six captions and alt text. Each exported PNG has a matching -caption.txt and -alt.txt file. Run `node scripts/add-review-captions.mjs` after caption edits to update the gallery and sidecars. The gallery includes Copy caption buttons.

Review weekly: saves/shares relative to reach for useful posts; average watch time relative to Reel length for hooks; profile visits; Instagram-attributed site sessions and signups for business impact. Compare a few posts over time rather than declaring a winner from one small sample. Change one major variable at a time. Meta explains its watch-time metrics here: https://about.fb.com/news/2023/04/instagram-reels-trending-audio-and-gifts-updates/ . Skill frequency tables and performance percentages are heuristics, not verified predictions for Everlittle.

Bio URL: https://geteverlittle.com/?utm_source=instagram&utm_medium=organic_social&utm_campaign=launch_202609&utm_content=bio

A shared bio link attributes visits to the bio, not to individual Reels. For each direct Story link, use a distinct utm_content such as launch_image_story or grandma_prompt_story. Pair PostHog attribution with Instagram’s native post insights. No individual-post conversion claims from the shared bio URL alone.
