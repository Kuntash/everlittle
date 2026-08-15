type AuthEmailInput = {
  email: string;
  name: string;
  type: "password-reset" | "verification";
  url: string;
};

export async function sendAuthEmail(runtime: Env, input: AuthEmailInput): Promise<void> {
  const copy = buildAuthEmail(input);
  await runtime.EMAIL.send({
    to: input.email,
    from: { name: runtime.APP_NAME, email: runtime.INVITATION_FROM_EMAIL },
    subject: copy.subject,
    html: copy.html,
    text: copy.text,
  });
}

export function buildAuthEmail(input: AuthEmailInput) {
  const isVerification = input.type === "verification";
  const subject = isVerification
    ? "Verify your Everlittle email"
    : "Reset your Everlittle password";
  const heading = isVerification ? "Verify your email" : "Choose a new password";
  const action = isVerification ? "Verify email" : "Reset password";
  const explanation = isVerification
    ? "Confirm this email address to open your private family archive."
    : "Use this private link to choose a new password. Resetting it signs out your other sessions.";
  const safety = isVerification
    ? "If you did not create an Everlittle account, you can ignore this email."
    : "If you did not request a password reset, your current password still works and you can ignore this email.";
  const safeName = escapeHtml(input.name || "there");
  const safeUrl = escapeHtml(input.url);
  const text = `Hello ${input.name || "there"},\n\n${explanation}\n\n${action}: ${input.url}\n\n${safety}`;
  const html = `<!doctype html><html><body style="margin:0;background:#eef1ed;color:#1f3028;font-family:Arial,sans-serif"><table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td style="padding:32px 16px"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;margin:auto;background:#f9faf7;border:1px solid #ccd5ce;border-radius:16px"><tr><td style="padding:38px 32px"><p style="margin:0 0 22px;color:#426553;font-size:13px;font-weight:700;letter-spacing:1.6px;text-transform:uppercase">Everlittle | Private family archive</p><h1 style="margin:0 0 16px;font-family:Georgia,serif;font-size:35px;font-weight:500;line-height:1.1">${heading}</h1><p style="margin:0 0 14px;font-size:17px;line-height:1.6">Hello ${safeName},</p><p style="margin:0 0 28px;color:#56635c;font-size:15px;line-height:1.65">${explanation}</p><a href="${safeUrl}" style="display:inline-block;background:#294f3c;border-radius:10px;color:#f9faf7;font-size:15px;font-weight:700;padding:14px 22px;text-decoration:none">${action}</a><p style="margin:28px 0 0;color:#6d746f;font-size:13px;line-height:1.6">${safety}</p></td></tr></table></td></tr></table></body></html>`;
  return { html, subject, text };
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    };
    return entities[character];
  });
}
