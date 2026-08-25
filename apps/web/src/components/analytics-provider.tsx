import { PostHogProvider } from "@posthog/react";
import { useRouterState } from "@tanstack/react-router";
import posthog from "posthog-js";
import { useEffect, useRef, useState } from "react";

import { authClient } from "@/lib/auth-client";
import { analyticsPath } from "@/lib/analytics";

type AnalyticsConfig = {
  analytics?: { posthog?: { host?: string; token?: string } } | null;
};

let initialized = false;

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const session = authClient.useSession();
  const identifiedUser = useRef<string | null>(null);
  const [ready, setReady] = useState(initialized);

  useEffect(() => {
    let active = true;
    void fetch("/api/platform", { cache: "no-store" })
      .then(async (response) => (response.ok ? ((await response.json()) as AnalyticsConfig) : null))
      .then((platform) => {
        const config = platform?.analytics?.posthog;
        if (!active || initialized || !config?.token || !config.host) return;
        posthog.init(config.token, {
          api_host: config.host,
          autocapture: false,
          before_send: (event) => {
            if (!event) return null;
            const safePath = analyticsPath(window.location.pathname);
            return {
              ...event,
              properties: {
                ...event.properties,
                $current_url: safePath,
                $pathname: safePath,
                $referrer: undefined,
              },
            };
          },
          capture_exceptions: false,
          capture_pageleave: false,
          capture_pageview: false,
          defaults: "2026-05-30",
          disable_session_recording: true,
          person_profiles: "identified_only",
          persistence: "localStorage",
        });
        initialized = true;
        setReady(true);
      })
      .catch(() => {
        // Analytics must never interfere with the archive experience.
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    posthog.capture("$pageview", { $current_url: analyticsPath(pathname) });
  }, [pathname, ready]);

  useEffect(() => {
    const userId = session.data?.user.id ?? null;
    if (!ready) return;
    if (userId && identifiedUser.current !== userId) {
      posthog.identify(userId);
      identifiedUser.current = userId;
    } else if (!userId && identifiedUser.current) {
      posthog.reset();
      identifiedUser.current = null;
    }
  }, [ready, session.data?.user.id]);

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
