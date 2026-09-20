import {createRequire} from 'node:module';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
const require=createRequire(import.meta.url);
const {createCanvas,loadImage,GlobalFonts}=require(process.env.CAROUSEL_CANVAS_MODULE || '/tmp/everlittle-carousel-render/node_modules/@napi-rs/canvas');
const root=dirname(fileURLToPath(import.meta.url));
for(const w of [500,700,850])GlobalFonts.registerFromPath(join(root,`nunito-${w}.ttf`),`Nunito${w}`);
const content=JSON.parse(readFileSync(join(root,'content.json'),'utf8'));
const sheet=createCanvas(1080,2250),sx=sheet.getContext('2d');
const covers=createCanvas(1620,675),cx=covers.getContext('2d');
const qa=[];
function wrap(x,text,max){
 const lines=[];let line='';
 for(const word of text.split(' ')){
  const candidate=line?`${line} ${word}`:word;
  if(x.measureText(candidate).width>max && line){lines.push(line);line=word;}else line=candidate;
 }
 if(line)lines.push(line);return lines;
}
for(const [p,post] of content.entries()){
 mkdirSync(join(root,post.id,'high-resolution'),{recursive:true});
 const alt=[];
 for(const [i,slide] of post.slides.entries()){
  const n=String(i+1).padStart(2,'0');
  const photo=await loadImage(join(root,post.id,'photos',`photo-${n}.png`));
  for(const res of [1,2]){
   const c=createCanvas(1080*res,1350*res),x=c.getContext('2d');x.scale(res,res);
   const scale=Math.max(1080/photo.width,1350/photo.height);
   x.drawImage(photo,(1080-photo.width*scale)/2,(1350-photo.height*scale)/2,photo.width*scale,photo.height*scale);
   const g=x.createLinearGradient(0,0,0,1350);
   g.addColorStop(0,'rgba(0,0,0,.64)');g.addColorStop(.43,'rgba(0,0,0,.48)');g.addColorStop(.68,'rgba(0,0,0,.08)');g.addColorStop(1,'rgba(0,0,0,.24)');
   x.fillStyle=g;x.fillRect(0,0,1080,1350);
   x.fillStyle='#fff';x.textAlign='center';x.textBaseline='top';
   // Live vector text at each output size; no shadow, blur, JPEG, or text upscaling.
   x.font='80px Nunito850';const lines=wrap(x,slide.lines.join(' '),928);
   const headY=164,lineHeight=94;
   for(const [j,line]of lines.entries())x.fillText(line,540,headY+j*lineHeight);
   const headlineBottom=headY+lines.length*lineHeight;
   x.font='42px Nunito700';const sub=wrap(x,slide.sub,860);
   const subY=headlineBottom+48;
   for(const[j,line]of sub.entries())x.fillText(line,540,subY+j*53);
   if(subY+sub.length*53>715)throw new Error(`Text too low: ${post.id}/${n}`);
   x.font='28px Nunito700';x.textBaseline='bottom';x.textAlign='left';x.fillText('everlittle',60,1298);
   x.textAlign='right';x.fillText(`${i+1} / 5`,1020,1298);
   const destination=res===1?join(root,post.id,`slide-${n}.png`):join(root,post.id,'high-resolution',`slide-${n}.png`);
   writeFileSync(destination,c.toBuffer('image/png'));
   if(res===1){
    sx.drawImage(c,p*360,i*450,360,450);if(i===0)cx.drawImage(c,p*540,0,540,675);
    qa.push({post:post.id,slide:i+1,width:1080,height:1350,headlinePx:80,subtitlePx:42,headlineLines:lines,subtitleLines:sub,textBottom:subY+sub.length*53});
   }
  }
  alt.push(`slide-${n}.png: ${slide.photoAlt} Text: ${slide.lines.join(' ')} ${slide.sub} Footer: everlittle, ${i+1} / 5.`);
 }
 writeFileSync(join(root,post.id,'caption.txt'),post.caption+'\n');
 writeFileSync(join(root,post.id,'alt-text.txt'),alt.join('\n\n')+'\n');
}
writeFileSync(join(root,'contact-sheet.png'),sheet.toBuffer('image/png'));
writeFileSync(join(root,'covers.png'),covers.toBuffer('image/png'));
writeFileSync(join(root,'qa.json'),JSON.stringify(qa,null,2));
console.log('Rendered 15 native 1080×1350 PNGs and 15 native 2160×2700 PNGs. Typography: 80px/42px, no shadow or blur.');
