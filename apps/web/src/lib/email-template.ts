/** Shared, table-based layout for clients that do not support application CSS. */
export function emailTemplate(input: {
  heading: string;
  introduction: string;
  explanation: string;
  action: string;
  url: string;
  footer: string;
}) {
  const safe = Object.fromEntries(
    Object.entries(input).map(([key, value]) => [key, escapeHtml(value)]),
  );
  const home = escapeHtml(new URL(input.url).origin);
  return `<!doctype html><html lang="en"><head><meta name="viewport" content="width=device-width, initial-scale=1"><meta charset="utf-8"><title>${safe.heading}</title></head><body style="margin:0;background:#fffaf3;color:#352c29;font-family:Arial,sans-serif"><table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td align="center" style="padding:32px 16px"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;text-align:left;background:#fffdf8;border:1px solid #ecddce;border-radius:20px"><tr><td style="padding:32px 24px"><a href="${home}/" style="color:#352c29;font-size:23px;font-weight:700;text-decoration:none">Everlittle</a><h1 style="margin:32px 0 20px;font-size:28px;font-weight:600;line-height:1.2">${safe.heading}</h1><p style="margin:0 0 12px;font-size:16px;line-height:1.6">${safe.introduction}</p><p style="margin:0 0 24px;color:#786459;font-size:15px;line-height:1.6">${safe.explanation}</p><table role="presentation" cellspacing="0" cellpadding="0"><tr><td bgcolor="#c54f37" style="border:1px solid #a03c29;border-radius:10px;text-align:center"><a href="${safe.url}" style="display:inline-block;padding:15px 24px;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none">${safe.action}</a></td></tr></table><p style="margin:24px 0 8px;color:#786459;font-size:12px;line-height:1.6">Button not working? Copy this link into your browser:</p><p style="margin:0;word-break:break-all;overflow-wrap:anywhere;font-size:12px;line-height:1.6"><a href="${safe.url}" style="color:#795333">${safe.url}</a></p><p style="margin:28px 0 0;padding-top:20px;border-top:1px solid #ecddce;color:#786459;font-size:12px;line-height:1.6">${safe.footer}</p></td></tr></table></td></tr></table></body></html>`;
}

function escapeHtml(value: string) {
  const entities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  };
  return value.replace(/[&<>'"]/g, (character) => entities[character]);
}
