import { createRequire } from 'node:module';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const {createCanvas, loadImage, GlobalFonts} = require(process.env.CAROUSEL_CANVAS_MODULE || '/tmp/everlittle-carousel-render/node_modules/@napi-rs/canvas');
const root=dirname(fileURLToPath(import.meta.url));
for (const w of [500,700,850]) GlobalFonts.registerFromPath(join(root,`nunito-${w}.ttf`),`Nunito${w}`);
const content=JSON.parse(readFileSync(join(root,'content.json'),'utf8'));
const sheet=createCanvas(648,1350); const sx=sheet.getContext('2d');
const covers=createCanvas(1080,450); const cx=covers.getContext('2d');
let qa=[];
for(const [p,post] of content.entries()) {
  const photo=await loadImage(join(root,post.id,'photo.png'));
  const alt=[];
  for(const [i,slide] of post.slides.entries()) {
    const c=createCanvas(1080,1350),x=c.getContext('2d');
    const scale=Math.max(1080/photo.width,1350/photo.height);
    x.drawImage(photo,(1080-photo.width*scale)/2,(1350-photo.height*scale)/2,photo.width*scale,photo.height*scale);
    const g=x.createLinearGradient(0,0,0,1350);g.addColorStop(0,'rgba(0,0,0,.44)');g.addColorStop(.56,'rgba(0,0,0,.22)');g.addColorStop(1,'rgba(0,0,0,.24)');x.fillStyle=g;x.fillRect(0,0,1080,1350);
    x.textAlign='center';x.textBaseline='top';x.fillStyle='#fff';
    x.shadowColor='rgba(0,0,0,.7)';x.shadowBlur=5;x.shadowOffsetY=2;
    let size=68;x.font=`${size}px Nunito850`;
    while(size>44 && slide.lines.some(t=>x.measureText(t).width>950)){size--;x.font=`${size}px Nunito850`;}
    const start=220;
    slide.lines.forEach((line,n)=>x.fillText(line,540,start+n*size*1.18));
    let subSize=35;x.font=`${subSize}px Nunito700`;
    while(subSize>28 && x.measureText(slide.sub).width>950){subSize--;x.font=`${subSize}px Nunito700`;}
    x.fillText(slide.sub,540,Math.max(510,start+slide.lines.length*size*1.18+65));
    x.shadowBlur=0;x.shadowOffsetY=0;x.font='24px Nunito500';x.textBaseline='bottom';
    x.textAlign='left';x.fillText('everlittle',54,1305);x.textAlign='right';x.fillText(`${i+1} / 5`,1026,1305);
    const name=`slide-${String(i+1).padStart(2,'0')}.png`;
    writeFileSync(join(root,post.id,name),c.toBuffer('image/png'));
    sx.drawImage(c,p*216,i*270,216,270);
    if(i===0)cx.drawImage(c,p*360,0,360,450);
    alt.push(`${name}: ${post.photoAlt} Text: ${slide.lines.join(' ')} ${slide.sub} Footer: everlittle, ${i+1} / 5.`);
    qa.push({post:post.id,slide:i+1,width:1080,height:1350,headlineSize:size,subSize,maxHeadlineWidth:Math.max(...slide.lines.map(t=>{x.font=`${size}px Nunito850`;return x.measureText(t).width;}))});
  }
  writeFileSync(join(root,post.id,'caption.txt'),post.caption+'\n');
  writeFileSync(join(root,post.id,'alt-text.txt'),alt.join('\n\n')+'\n');
}
writeFileSync(join(root,'contact-sheet.jpg'),sheet.toBuffer('image/jpeg'));
writeFileSync(join(root,'covers.jpg'),covers.toBuffer('image/jpeg'));
writeFileSync(join(root,'qa.json'),JSON.stringify(qa,null,2));
console.log(`Rendered ${qa.length} slides. Minimum headline ${Math.min(...qa.map(r=>r.headlineSize))}px; minimum subtitle ${Math.min(...qa.map(r=>r.subSize))}px.`);
