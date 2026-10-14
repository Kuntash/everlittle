import type { PostHog, PostHogConfig } from "posthog-js";

type Properties = Record<string, unknown>;

/** A call made before PostHog has loaded. A capture keeps the moment it happened. */
type WaitingCall =
  | { kind: "capture"; event: string; properties?: Properties; at: string }
  | { kind: "identify"; userId: string }
  | { kind: "register"; properties: Properties }
  | { kind: "reset" };

/** Calls made before PostHog has loaded. Null once analytics has started or is known to be off. */
let waiting: WaitingCall[] | null = [];
let client: PostHog | null = null;
/** No page makes this many calls before the settings are known. The limit only bounds memory. */
const WAITING_LIMIT = 100;
/**
 * Captures that were still waiting when the visitor left the page, for example a click on "Start free" in the
 * first moment. The next page of this site sends them with their original time. The key is per tab.
 */
const CARRIED_KEY = "everlittle.analytics-carried.v1";
let carrying = false;

function apply(posthog: PostHog, call: WaitingCall) {
  if (call.kind === "capture") {
    /*
     * Sent at once with sendBeacon, not batched. Many events come just before the page changes: a signup
     * button, a checkout redirect. A batched event was lost when the page went away first.
     */
    posthog.capture(call.event, call.properties, {
      send_instantly: true,
      timestamp: new Date(call.at),
      transport: "sendBeacon",
    });
  } else if (call.kind === "identify") posthog.identify(call.userId);
  else if (call.kind === "register") posthog.register(call.properties);
  else posthog.reset();
}

function send(call: WaitingCall) {
  if (client) {
    apply(client, call);
    return;
  }
  if (!waiting || waiting.length >= WAITING_LIMIT) return;
  waiting.push(call);
  if (!carrying && typeof window !== "undefined") {
    carrying = true;
    window.addEventListener("pagehide", carryWaitingCaptures);
  }
}

/** Keep the captures that never left this page, so the next page can send them. */
function carryWaitingCaptures() {
  const captures = (waiting ?? []).filter((call) => call.kind === "capture");
  if (client || captures.length === 0) return;
  try {
    const earlier = readCarried();
    sessionStorage.setItem(
      CARRIED_KEY,
      JSON.stringify([...earlier, ...captures].slice(-WAITING_LIMIT)),
    );
  } catch {
    // Without storage the captures are lost, as they were before.
  }
}

function readCarried(): WaitingCall[] {
  try {
    const stored = JSON.parse(sessionStorage.getItem(CARRIED_KEY) ?? "[]") as unknown;
    return Array.isArray(stored)
      ? stored.filter(
          (call): call is WaitingCall =>
            typeof call === "object" &&
            call !== null &&
            call.kind === "capture" &&
            typeof call.event === "string" &&
            typeof call.at === "string",
        )
      : [];
  } catch {
    return [];
  }
}

/**
 * Product analytics for the browser. PostHog is a large library, so it loads only on an installation that
 * has analytics configured. Calls made before it has loaded are kept and sent once it has, with the time they
 * happened. On an installation without analytics every call does nothing.
 */
export const productAnalytics = {
  capture(event: string, properties?: Properties) {
    send({ kind: "capture", event, properties, at: new Date().toISOString() });
  },
  identify(userId: string) {
    send({ kind: "identify", userId });
  },
  register(properties: Properties) {
    send({ kind: "register", properties });
  },
  reset() {
    send({ kind: "reset" });
  },
};

/**
 * Load and start PostHog. `prepare` runs after `init` and before the waiting calls are sent,
 * so the properties it registers are on those calls too. Captures carried from the previous page go first.
 */
export async function startProductAnalytics(
  token: string,
  config: Partial<PostHogConfig>,
  prepare: (posthog: PostHog) => void,
) {
  if (client) return;
  const { default: posthog } = await import("posthog-js");
  if (client) return;
  posthog.init(token, config);
  prepare(posthog);
  client = posthog;
  const carried = readCarried();
  try {
    sessionStorage.removeItem(CARRIED_KEY);
  } catch {
    // Nothing was stored.
  }
  const calls = [...carried, ...(waiting ?? [])];
  waiting = null;
  window.removeEventListener("pagehide", carryWaitingCaptures);
  for (const call of calls) apply(posthog, call);
}

/** This installation has no analytics. Drop the waiting calls and keep no more. */
export function disableProductAnalytics() {
  if (client) return;
  waiting = null;
  if (typeof window !== "undefined") window.removeEventListener("pagehide", carryWaitingCaptures);
}
