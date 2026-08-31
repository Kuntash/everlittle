import { PostHogProvider } from "@posthog/react";
import { useRouterState } from "@tanstack/react-router";
import posthog from "posthog-js";
import { useEffect, useRef, useState } from "react";

import { authClient } from "@/lib/auth-client";
import {
  MARKETING_ATTRIBUTION_STORAGE_KEY,
  analyticsPath,
  marketingAttribution,
  readMarketingAttribution,
} from "@/lib/analytics";
import type { MarketingAttribution } from "@/lib/analytics";

type AnalyticsConfig = {
  analytics?: { posthog?: { host?: string; token?: string } } | null;
};

let initialized = false;

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const session = authClient.useSession();
  const identifiedUser = useRef<string | null>(null);
  const capturedCampaignLanding = useRef<string | null>(null);
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
        const attribution = resolveMarketingAttribution(window.location.pathname);
        if (attribution) posthog.register(attribution);
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
    const safePath = analyticsPath(pathname);
    const directCampaign = marketingAttribution(window.location.search);
    const attribution = resolveMarketingAttribution(pathname);
    if (attribution) posthog.register(attribution);
    posthog.capture("$pageview", { $current_url: safePath });

    if (directCampaign) {
      const campaignKey = JSON.stringify({ ...directCampaign, campaign_landing_path: safePath });
      if (capturedCampaignLanding.current !== campaignKey) {
        posthog.capture("campaign_landing_view", {
          ...directCampaign,
          landing_path: safePath,
        });
        capturedCampaignLanding.current = campaignKey;
      }
    }
  }, [pathname, ready]);

  useEffect(() => {
    if (!ready) return;

    function captureMarketingClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest<HTMLAnchorElement>("a[href]");
      if (!link) return;
      const destination = new URL(link.href, window.location.origin);
      if (destination.origin !== window.location.origin || destination.pathname !== "/sign-up") {
        return;
      }
      posthog.capture("marketing_signup_cta_clicked", {
        source_path: analyticsPath(window.location.pathname),
        destination_path: "/sign-up",
      });
    }

    document.addEventListener("click", captureMarketingClick);
    return () => document.removeEventListener("click", captureMarketingClick);
  }, [ready]);

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

function resolveMarketingAttribution(pathname: string): MarketingAttribution | null {
  const direct = marketingAttribution(window.location.search);
  if (direct) {
    const attribution = {
      ...direct,
      campaign_landing_path: analyticsPath(pathname),
    };
    try {
      localStorage.setItem(MARKETING_ATTRIBUTION_STORAGE_KEY, JSON.stringify(attribution));
    } catch {
      // Attribution is optional and must not interfere with the app.
    }
    return attribution;
  }

  try {
    return readMarketingAttribution(localStorage.getItem(MARKETING_ATTRIBUTION_STORAGE_KEY));
  } catch {
    return null;
  }
}
