import type { PostHog, PostHogConfig } from "posthog-js";

type Call = (client: PostHog) => void;

/** Calls made before PostHog has loaded. Null once analytics has started or is known to be off. */
let waiting: Call[] | null = [];
let client: PostHog | null = null;
/** No page makes this many calls before the settings are known. The limit only bounds memory. */
const WAITING_LIMIT = 100;

function send(call: Call) {
  if (client) call(client);
  else if (waiting && waiting.length < WAITING_LIMIT) waiting.push(call);
}

/**
 * Product analytics for the browser. PostHog is a large library, so it loads only on an installation that
 * has analytics configured, and only after the page has rendered. Calls made before that are kept and sent
 * once it has loaded. On an installation without analytics every call does nothing.
 */
export const productAnalytics = {
  capture(event: string, properties?: Record<string, unknown>) {
    send((posthog) => posthog.capture(event, properties));
  },
  identify(userId: string) {
    send((posthog) => posthog.identify(userId));
  },
  register(properties: Record<string, unknown>) {
    send((posthog) => posthog.register(properties));
  },
  reset() {
    send((posthog) => posthog.reset());
  },
};

/**
 * Wait until the page has loaded and the browser has a free moment. PostHog then does not compete with
 * the page's own styles, fonts and images for the connection. Calls made before that wait in the queue.
 */
function afterPageLoad(): Promise<void> {
  return new Promise((resolve) => {
    const whenIdle = () => {
      if ("requestIdleCallback" in window)
        window.requestIdleCallback(() => resolve(), { timeout: 2000 });
      else setTimeout(resolve, 200);
    };
    if (document.readyState === "complete") whenIdle();
    else window.addEventListener("load", whenIdle, { once: true });
  });
}

/**
 * Load and start PostHog. `prepare` runs after `init` and before the waiting calls are sent,
 * so the properties it registers are on those calls too.
 */
export async function startProductAnalytics(
  token: string,
  config: Partial<PostHogConfig>,
  prepare: (posthog: PostHog) => void,
) {
  if (client) return;
  await afterPageLoad();
  const { default: posthog } = await import("posthog-js");
  if (client) return;
  posthog.init(token, config);
  prepare(posthog);
  client = posthog;
  const calls = waiting ?? [];
  waiting = null;
  for (const call of calls) call(posthog);
}

/** This installation has no analytics. Drop the waiting calls and keep no more. */
export function disableProductAnalytics() {
  if (!client) waiting = null;
}
