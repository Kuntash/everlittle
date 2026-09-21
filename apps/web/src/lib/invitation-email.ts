import { emailTemplate } from "./email-template";
import type { RuntimeEnv } from "./runtime-env";
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
  runtime: RuntimeEnv,
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
  const role = titleCase(input.role);
  const permission = roleDescriptions[input.role];
  const expiry = new Intl.DateTimeFormat("en", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(input.expiresAt));

  const text = `${input.inviterName} invited you to ${input.archiveName}\n\nYou have been invited as a ${role}. You will be able to ${permission}.\n\nAccept your invitation: ${input.invitationUrl}\n\nThis private link expires ${expiry} and is intended only for ${input.recipient}. If you were not expecting it, you can ignore this email.`;
  const html = emailTemplate({
    heading: `Join ${input.archiveName}`,
    introduction: `${input.inviterName} invited you as a ${role}.`,
    explanation: `You’ll be able to ${permission}.`,
    action: "View invitation",
    url: input.invitationUrl,
    footer: `This link expires ${expiry} and is intended for ${input.recipient}. If you weren’t expecting it, you can ignore this email.`,
  });
  return { html, text };
}

function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
