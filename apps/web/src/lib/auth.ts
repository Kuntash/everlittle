import { betterAuth } from "better-auth";

type AuthOptions = {
  appName?: string;
  onEmailVerified?: (userId: string) => Promise<void>;
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

/**
 * How long a browser may prove its session with the signed session cookie alone, in seconds: 5 minutes.
 * Inside this time a request reads no session row. After it, `/api/auth/get-session` reads the row and issues the
 * cookie again. The browser calls that on each page load and when the window gets focus.
 * A sign-out clears the cookie in the same browser at once. A session that is revoked elsewhere, by a password
 * reset or a sign-out on another device, keeps working in this browser until its cookie runs out.
 * Family membership and child PIN sessions are read from the database on every request, so removing a member
 * takes effect at once. Shorten this time if a revoked session must stop sooner.
 */
const SESSION_COOKIE_CACHE_SECONDS = 5 * 60;

export function createAuth({
  appName = "Everlittle",
  database,
  secret,
  baseURL,
  allowSignUp,
  requireEmailVerification,
  sendAuthEmail,
  onEmailVerified,
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
      afterEmailVerification: async (user) => {
        await onEmailVerified?.(user.id);
      },
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
      cookieCache: { enabled: true, maxAge: SESSION_COOKIE_CACHE_SECONDS },
    },
    advanced: {
      cookiePrefix: "everlittle",
      useSecureCookies: baseURL.startsWith("https://"),
    },
    /*
     * No `tanstackStartCookies` plugin. It sets cookies through a TanStack Start server function, and this app
     * has none: the browser signs in through `/api/auth`, and the API passes on refreshed cookies itself.
     */
  });
}
