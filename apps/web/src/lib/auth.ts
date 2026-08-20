import { betterAuth } from "better-auth";
import { tanstackStartCookies } from "better-auth/tanstack-start";

type AuthOptions = {
  appName?: string;
  sendAuthEmail: (input: {
    email: string;
    name: string;
    type: "password-reset" | "verification";
    url: string;
  }) => Promise<void>;
  database: D1Database;
  secret: string;
  baseURL: string;
  allowSignUp: boolean;
  requireEmailVerification: boolean;
};

export function createAuth({
  appName = "Everlittle",
  database,
  secret,
  baseURL,
  allowSignUp,
  requireEmailVerification,
  sendAuthEmail,
}: AuthOptions) {
  return betterAuth({
    appName,
    database,
    secret,
    baseURL,
    trustedOrigins: [baseURL],
    emailAndPassword: {
      enabled: true,
      disableSignUp: !allowSignUp,
      minPasswordLength: 10,
      requireEmailVerification,
      revokeSessionsOnPasswordReset: true,
      sendResetPassword: async ({ user, url }) => {
        await sendAuthEmail({ email: user.email, name: user.name, type: "password-reset", url });
      },
    },
    emailVerification: {
      autoSignInAfterVerification: true,
      expiresIn: 60 * 60 * 24,
      sendOnSignIn: true,
      sendOnSignUp: requireEmailVerification,
      sendVerificationEmail: async ({ user, url }) => {
        await sendAuthEmail({ email: user.email, name: user.name, type: "verification", url });
      },
    },
    session: {
      expiresIn: 60 * 60 * 24 * 30,
      updateAge: 60 * 60 * 24,
    },
    advanced: {
      cookiePrefix: "everlittle",
      useSecureCookies: baseURL.startsWith("https://"),
    },
    plugins: [tanstackStartCookies()],
  });
}
