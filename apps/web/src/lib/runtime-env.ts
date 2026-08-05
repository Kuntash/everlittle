import { env } from "cloudflare:workers";

export function getRuntimeEnv() {
  const runtime = env as Env;

  if (!runtime.BETTER_AUTH_SECRET) {
    throw new Error(
      "BETTER_AUTH_SECRET is missing. Add it to .dev.vars locally or configure it with Wrangler.",
    );
  }

  return runtime;
}
