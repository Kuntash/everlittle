export type PublicMemory = {
  id: string;
  kind: string;
  title: string;
  body: string | null;
  happenedAt: string;
  childName: string;
  authorName: string | null;
  mediaId: string | null;
  objectKey: string | null;
  mediaType: "image" | "audio" | "video" | null;
  contentType: string | null;
};

const signupUrl =
  "/sign-up?utm_source=memory_share&amp;utm_medium=referral&amp;utm_campaign=shared_memory&amp;utm_content=signup_cta";
const brandMark = `<svg viewBox="0 0 64 70" fill="none" aria-hidden="true"><path d="M31 62V32" stroke="#6e8462" stroke-width="3" stroke-linecap="round"/><path d="M32 38Q29 10 57 7Q57 31 32 38Z" fill="#e99878"/><path d="M30 49Q9 49 6 27Q29 27 30 49Z" fill="#b2bea1"/><path d="M32 39Q40 23 50 15M30 49Q22 37 12 32" stroke="#896b50" stroke-width="1.4" stroke-linecap="round"/><path d="M24 3L26 11L33 13L26 15L24 22L22 15L15 13L22 11Z" fill="#d4a15b"/></svg>`;
export const publicMemoryStyles = `@font-face{font-family:Nunito;src:url('/fonts/nunito-sans-latin-wght-normal.woff2') format('woff2');font-weight:200 900;font-display:swap}*{box-sizing:border-box}body{margin:0;background:#fffaf3;color:#352c29;font-family:Nunito,"Avenir Next",sans-serif;line-height:1.6}a{color:inherit}button,a{-webkit-tap-highlight-color:transparent}button:focus-visible,a:focus-visible{outline:3px solid #285445;outline-offset:5px}.shell{max-width:1000px;padding:0 28px;margin:auto;min-height:100svh}.header{display:flex;justify-content:space-between;align-items:center;padding:24px 0;border-bottom:1px solid #ecddce;gap:16px}.brand{display:inline-flex;align-items:center;gap:8px;font-size:27px;font-weight:800;letter-spacing:-1px;text-decoration:none}.brand svg{width:34px;height:38px}.header-link{font-size:14px;font-weight:750;text-decoration:none;color:#285445}.intro{margin:40px 0 24px;color:#786356;font-size:14px}.card{background:#fffdf8;border:1px solid #ecddce;border-radius:28px;overflow:hidden;max-width:760px;margin:0 auto;box-shadow:0 12px 40px #896b5009}.copy{padding:32px 40px}.eyebrow{color:#786356;font-size:13px;font-weight:750;margin:0 0 12px}.copy h1{font-size:clamp(28px,5vw,44px);font-weight:800;letter-spacing:-1.2px;line-height:1.18;margin:0 0 22px;overflow-wrap:anywhere}.story{font-size:18px;line-height:1.8;white-space:normal;overflow-wrap:anywhere;margin:0 0 24px}.byline{font-size:13px;color:#786356;margin:24px 0 0}.media-frame{position:relative;background:#f5eadb}.memory-media{display:block;width:100%;max-height:650px;object-fit:contain}.watermark{display:flex;justify-content:flex-end;padding:8px 18px;color:#786356;font-size:12px;font-weight:800;letter-spacing:.04em}.memory-audio{display:block;width:100%;padding:16px}.memory-mark{display:flex;align-items:center;justify-content:center;min-height:160px;background:#f5eadb}.memory-mark svg{width:72px;height:80px}.actions{display:flex;flex-wrap:wrap;gap:10px;border-top:1px solid #ecddce;padding-top:24px;margin-top:26px}.actions a,.actions button,.cta-button{display:inline-flex;align-items:center;justify-content:center;gap:8px;border:1px solid #ecddce;border-radius:14px;background:#fffaf3;color:#352c29;font:inherit;font-weight:750;font-size:14px;min-height:46px;padding:10px 18px;text-decoration:none;cursor:pointer}.actions button:hover,.actions a:hover{background:#f5eadb}.privacy,.status{font-size:12px;color:#786356;line-height:1.6}.status{min-height:20px;margin:8px 0}.invite{max-width:760px;margin:32px auto 0;padding:32px 36px;border-radius:24px;background:#f4e9d9;display:grid;grid-template-columns:1fr auto;gap:24px;align-items:center}.invite h2{font-size:25px;letter-spacing:-.6px;line-height:1.25;margin:0 0 10px}.invite p{font-size:15px;max-width:44ch;margin:0;color:#6e594e}.cta-button{background:#c54f37;color:#fff;border-color:#c54f37;white-space:nowrap}.cta-button:hover{background:#ad422d}.invite small{display:block;font-size:12px;margin-top:10px;color:#6e594e;max-width:28ch}.footer{padding:28px 0 36px;text-align:center;font-size:12px;color:#786356}.footer a{margin:0 8px}.unavailable{padding:60px 0;max-width:650px;margin:auto}.unavailable h1{font-size:36px;line-height:1.2}.unavailable p{color:#786356}@media(max-width:600px){.shell{padding:0 16px}.header{padding:18px 0}.brand{font-size:24px}.header-link{font-size:12px}.intro{margin:24px 4px 18px}.card{border-radius:22px}.copy{padding:26px 22px}.story{font-size:17px}.invite{grid-template-columns:1fr;padding:26px 24px;gap:20px}.invite small{max-width:none}.cta-button{width:100%}.memory-media{max-height:65svh}}`;

export function publicMemoryPage(memory: PublicMemory, shareUrl: string, mediaUrl: string | null) {
  const title = escapeHtml(memory.title);
  const childName = escapeHtml(memory.childName);
  const authorName = escapeHtml(memory.authorName ?? "Family");
  const description = escapeHtml(
    memory.body?.slice(0, 180) || `A ${memory.kind} memory kept for ${memory.childName}.`,
  );
  const safeShareUrl = escapeHtml(shareUrl);
  const safeMediaUrl = mediaUrl ? escapeHtml(mediaUrl) : null;
  const happenedAt = new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(memory.happenedAt));
  const media =
    safeMediaUrl && memory.mediaType === "image"
      ? `<img class="memory-media" src="${safeMediaUrl}" alt="">`
      : safeMediaUrl && memory.mediaType === "video"
        ? `<video class="memory-media" src="${safeMediaUrl}" controls playsinline preload="metadata"></video>`
        : safeMediaUrl && memory.mediaType === "audio"
          ? `<audio class="memory-audio" src="${safeMediaUrl}" controls preload="metadata"></audio>`
          : `<div class="memory-mark" aria-hidden="true">${brandMark}</div>`;
  const ogMedia =
    safeMediaUrl && memory.mediaType === "image"
      ? `<meta property="og:image" content="${safeMediaUrl}">`
      : "";
  const story = memory.body
    ? `<p class="story">${escapeHtml(memory.body).replaceAll("\n", "<br>")}</p>`
    : "";
  const whatsappText = encodeURIComponent(`${memory.title} — ${shareUrl}`);

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${title} — Everlittle</title><meta name="description" content="${description}">
<meta property="og:type" content="article"><meta property="og:title" content="${title}">
<meta property="og:description" content="${description}"><meta property="og:url" content="${safeShareUrl}">${ogMedia}
<meta name="robots" content="noindex,nofollow,noarchive"><meta name="theme-color" content="#f7f1e7">
<style>${publicMemoryStyles}</style></head><body><main class="shell"><header class="header"><a class="brand" href="/?utm_source=memory_share&amp;utm_medium=referral&amp;utm_campaign=shared_memory&amp;utm_content=brand" aria-label="Everlittle home">${brandMark}everlittle</a><a class="header-link" href="${signupUrl}">Create your archive &rarr;</a></header><p class="intro">A little moment, shared with you.</p><article class="card"><div class="media-frame">${media}<div class="watermark" aria-label="Kept with Everlittle">kept with everlittle</div></div><div class="copy"><p class="eyebrow">A memory for ${childName} · ${escapeHtml(happenedAt)}</p><h1>${title}</h1>${story}<p class="byline">Kept with love by ${authorName}</p><div class="actions"><button id="share" type="button">Share to an app</button><a href="https://wa.me/?text=${whatsappText}" target="_blank" rel="noreferrer">WhatsApp</a><button class="secondary" id="copy" type="button">Copy link</button></div><p class="status" id="share-status" role="status" aria-live="polite"></p><p class="privacy">This private family chose to share this single memory. The rest of the archive remains protected.</p></div></article><section class="invite" aria-labelledby="invite-title"><div><h2 id="invite-title">Your family has stories worth keeping, too.</h2><p>A private home for your photos, voices and letters. Keep the little things together.</p></div><div><a class="cta-button" href="${signupUrl}">Create your family archive &rarr;</a><small>Account creation is free.<br>Paid plans enable adding memories.</small></div></section><footer class="footer">Made for your family’s little things.<br><a href="/pricing">Plans &amp; pricing</a><a href="/">Discover Everlittle</a></footer></main><script>const share=document.querySelector('#share'),copy=document.querySelector('#copy'),status=document.querySelector('#share-status');async function copyLink(){try{await navigator.clipboard.writeText(location.href);status.textContent='Link copied. Ready to share.'}catch{status.textContent='Could not copy the link. Copy the address from your browser instead.'}}share.addEventListener('click',async()=>{if(navigator.share){try{await navigator.share({url:location.href});status.textContent='Sharing opened.'}catch(error){if(error.name!=='AbortError')status.textContent='Sharing is unavailable. Try copying the link.'}}else{await copyLink()}});copy.addEventListener('click',copyLink);</script></body></html>`;
}

export function publicShareUnavailablePage() {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow,noarchive"><title>Memory unavailable — Everlittle</title><style>${publicMemoryStyles}</style></head><body><main class="shell"><header class="header"><a class="brand" href="/?utm_source=memory_share&amp;utm_medium=referral&amp;utm_campaign=shared_memory&amp;utm_content=brand" aria-label="Everlittle home">${brandMark}everlittle</a><a class="header-link" href="${signupUrl}">Create your archive &rarr;</a></header><section class="unavailable"><div class="memory-mark">${brandMark}</div><h1>This memory is no longer shared.</h1><p>The link may have expired or been disabled by its author. Ask the person who sent it for a new link.</p></section><section class="invite" aria-labelledby="invite-title"><div><h2 id="invite-title">Your family has stories worth keeping, too.</h2><p>A private home for your photos, voices and letters. Keep the little things together.</p></div><div><a class="cta-button" href="${signupUrl}">Create your family archive &rarr;</a><small>Account creation is free.<br>Paid plans enable adding memories.</small></div></section></main></body></html>`;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
