import { env } from "cloudflare:workers";

import { getDeploymentConfig } from "@/lib/deployment";

export type RuntimeEnv = Env & {
  DODO_PAYMENTS_API_KEY?: string;
  DODO_PAYMENTS_WEBHOOK_KEY?: string;
  DODO_PAYMENTS_ENVIRONMENT?: string;
  DODO_PRODUCT_ID_MONTHLY?: string;
  DODO_PRODUCT_ID_YEARLY?: string;
  POSTHOG_PROJECT_TOKEN?: string;
  POSTHOG_HOST?: string;
};

export function getRuntimeEnv() {
  const runtime = env as RuntimeEnv;

  if (!runtime.BETTER_AUTH_SECRET) {
    throw new Error(
      "BETTER_AUTH_SECRET is missing. Add it to .dev.vars locally or configure it with Wrangler.",
    );
  }
  if (!runtime.CHILD_PIN_PEPPER) {
    throw new Error(
      "CHILD_PIN_PEPPER is missing. Generate a separate secret for child PIN derivation.",
    );
  }

  getDeploymentConfig(runtime);

  return runtime;
}
