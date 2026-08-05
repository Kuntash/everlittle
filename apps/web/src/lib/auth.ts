import { betterAuth } from "better-auth";
import { tanstackStartCookies } from "better-auth/tanstack-start";

type AuthOptions = {
  database: D1Database;
  secret: string;
  baseURL: string;
  allowSignUp: boolean;
};

export function createAuth({ database, secret, baseURL, allowSignUp }: AuthOptions) {
  return betterAuth({
    appName: "Everlittle",
    database,
    secret,
    baseURL,
    trustedOrigins: [baseURL],
    emailAndPassword: {
      enabled: true,
      disableSignUp: !allowSignUp,
      minPasswordLength: 10,
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
