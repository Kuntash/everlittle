import fs from 'node:fs';import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');const captions=JSON.parse(fs.readFileSync(path.join(root,'social/captions.json')));
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
let html=fs.readFileSync(path.join(root,'review.html'),'utf8');
html=html.replace(/<!--CAPTION-START-->[\s\S]*?<!--CAPTION-END-->/g,'');
for(const c of captions){
const needle=`<a href="social/exports/${c.id}.png" download>Download PNG</a>`;
html=html.replace(needle,needle+`<!--CAPTION-START--><h3>Post caption</h3><div class="caption" id="caption-${c.id}">${esc(c.caption)}</div><button type="button" class="copy" data-copy="caption-${c.id}">Copy caption</button><details><summary>Alt text and posting note</summary><p class="alt">${esc(c.alt)}</p><p class="alt">${esc(c.use)}</p></details><!--CAPTION-END-->`);
fs.writeFileSync(path.join(root,'social/exports',c.id+'-caption.txt'),c.caption+'\n');fs.writeFileSync(path.join(root,'social/exports',c.id+'-alt.txt'),c.alt+'\n');
}
html=html.replace('</body>',`<!--CAPTION-START--><script>document.querySelectorAll('[data-copy]').forEach(b=>b.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(document.getElementById(b.dataset.copy).textContent);b.textContent='Copied';}catch{b.textContent='Select the caption above to copy';}}));document.querySelectorAll('video').forEach(v=>v.addEventListener('play',()=>document.querySelectorAll('video').forEach(other=>{if(other!==v)other.pause()})));</script><!--CAPTION-END--></body>`);
fs.writeFileSync(path.join(root,'review.html'),html);
fs.writeFileSync(path.join(root,'social/POST-CAPTIONS.md'),captions.map(c=>`## ${c.id}\n\nImage: exports/${c.id}.png\n\n${c.caption}\n\nAlt text: ${c.alt}\n\nPosting note: ${c.use}\n`).join('\n'));
