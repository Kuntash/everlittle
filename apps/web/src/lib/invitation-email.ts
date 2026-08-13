type InvitationEmailInput = {
  archiveName: string;
  expiresAt: string;
  invitationUrl: string;
  inviterEmail: string;
  inviterName: string;
  recipient: string;
  role: "parent" | "contributor" | "viewer";
};

const roleDescriptions = {
  parent: "help manage the archive and add family memories",
  contributor: "add memories and help preserve this family story",
  viewer: "view the family memories shared with you",
} as const;

export async function sendInvitationEmail(
  runtime: Env,
  input: InvitationEmailInput,
): Promise<string> {
  const copy = buildInvitationEmail(input);
  const result = await runtime.EMAIL.send({
    to: input.recipient,
    from: { name: runtime.APP_NAME, email: runtime.INVITATION_FROM_EMAIL },
    replyTo: input.inviterEmail,
    subject: `${input.inviterName} invited you to ${input.archiveName}`,
    html: copy.html,
    text: copy.text,
  });
  return result.messageId;
}

export function buildInvitationEmail(input: InvitationEmailInput) {
  const archiveName = escapeHtml(input.archiveName);
  const inviterName = escapeHtml(input.inviterName);
  const invitationUrl = escapeHtml(input.invitationUrl);
  const role = titleCase(input.role);
  const permission = roleDescriptions[input.role];
  const expiry = new Intl.DateTimeFormat("en", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(input.expiresAt));

  const text = `${input.inviterName} invited you to ${input.archiveName}\n\nYou have been invited as a ${role}. You will be able to ${permission}.\n\nAccept your invitation: ${input.invitationUrl}\n\nThis private link expires ${expiry} and is intended only for ${input.recipient}. If you were not expecting it, you can ignore this email.`;
  const html = `<!doctype html><html><body style="margin:0;background:#eef1ed;color:#1f3028;font-family:Arial,sans-serif"><table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td style="padding:32px 16px"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;margin:auto;background:#f9faf7;border:1px solid #ccd5ce;border-radius:16px"><tr><td style="padding:38px 32px"><p style="margin:0 0 22px;color:#426553;font-size:13px;font-weight:700;letter-spacing:1.6px;text-transform:uppercase">Everlittle | Private family archive</p><h1 style="margin:0 0 16px;font-family:Georgia,serif;font-size:35px;font-weight:500;line-height:1.1">An invitation to ${archiveName}</h1><p style="margin:0 0 14px;font-size:17px;line-height:1.6"><strong>${inviterName}</strong> has invited you to join as a <strong>${role}</strong>.</p><p style="margin:0 0 28px;color:#56635c;font-size:15px;line-height:1.65">You’ll be able to ${permission}.</p><a href="${invitationUrl}" style="display:inline-block;background:#294f3c;border-radius:10px;color:#f9faf7;font-size:15px;font-weight:700;padding:14px 22px;text-decoration:none">View invitation</a><p style="margin:28px 0 0;color:#6d746f;font-size:13px;line-height:1.6">This private link expires ${expiry} and is intended only for ${escapeHtml(input.recipient)}. If you weren’t expecting it, you can safely ignore this email.</p></td></tr></table></td></tr></table></body></html>`;
  return { html, text };
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

function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
