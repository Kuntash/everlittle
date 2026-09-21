import { emailTemplate } from "./email-template";
import type { RuntimeEnv } from "./runtime-env";
type AuthEmailInput = {
  email: string;
  name: string;
  type: "password-reset" | "verification";
  url: string;
};

export async function sendAuthEmail(runtime: RuntimeEnv, input: AuthEmailInput): Promise<void> {
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
  const text = `Hello ${input.name || "there"},\n\n${explanation}\n\n${action}: ${input.url}\n\n${safety}`;
  const html = emailTemplate({
    heading,
    introduction: `Hello ${input.name || "there"},`,
    explanation,
    action,
    url: input.url,
    footer: safety,
  });
  return { html, subject, text };
}
