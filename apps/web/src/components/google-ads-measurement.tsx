import type { AdvertisingPolicy } from "@/lib/advertising-policy";
import { useEffect, useState } from "react";
import {
  adsConsent,
  adsOptOutSignal,
  configureAdsPolicy,
  loadGoogleAds,
  sendGoogleConversion,
  setAdsConsent,
  type GoogleConversion,
} from "@/lib/google-ads";
import { analyticsPath } from "@/lib/analytics";
import { useRouterState } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";

export function GoogleAdsMeasurement() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const session = authClient.useSession();
  const [enabled, setEnabled] = useState(false);
  const [consent, setConsent] = useState<ReturnType<typeof adsConsent>>(null);
  const [open, setOpen] = useState(false);
  const safePath = analyticsPath(pathname);
  const publicPage =
    safePath === "/" ||
    (!safePath.includes(":") &&
      !["/invite", "/reset-password", "/onboarding", "/sign-in"].includes(safePath));
  useEffect(() => {
    void fetch("/api/platform", { cache: "no-store" })
      .then(
        (r) =>
          r.json() as Promise<{
            deploymentMode: string;
            advertising?: AdvertisingPolicy;
            analytics?: { posthog?: { environment?: string } };
          }>,
      )
      .then((p) => {
        configureAdsPolicy(p.advertising ?? { mode: "opt-in", globalPrivacyControl: false });
        refresh();
        setEnabled(
          p.deploymentMode === "hosted" && p.analytics?.posthog?.environment === "live_mode",
        );
      })
      .catch(() => {});
    const refresh = () => setConsent(adsConsent());
    refresh();
    const openPreferences = () => setOpen(true);
    window.addEventListener("everlittle-open-cookie-preferences", openPreferences);
    window.addEventListener("everlittle-ads-consent", refresh);
    window.addEventListener("storage", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      window.removeEventListener("everlittle-open-cookie-preferences", openPreferences);
      window.removeEventListener("everlittle-ads-consent", refresh);
      window.removeEventListener("storage", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, []);
  useEffect(() => {
    if (!enabled) return;
    if (consent !== "granted") {
      window.gtag?.("consent", "update", {
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
        analytics_storage: "denied",
      });
      return;
    }
    if (publicPage) void loadGoogleAds();
    if (!session.data?.user || safePath.includes("/child")) return;
    let stopped = false;
    const check = async () => {
      try {
        const response = await fetch("/api/measurement/conversions", { cache: "no-store" });
        if (!response.ok || stopped) return;
        const result = (await response.json()) as { conversions: GoogleConversion[] };
        for (const conversion of result.conversions)
          if (!stopped) await sendGoogleConversion(conversion);
      } catch {
        /* Measurement cannot interrupt the archive. */
      }
    };
    void check();
    const timer = window.setInterval(() => void check(), 15000);
    return () => {
      stopped = true;
      window.clearInterval(timer);
    };
  }, [enabled, consent, publicPage, safePath, session.data?.user?.id]);
  if (!enabled || (!publicPage && !safePath.endsWith("/settings"))) return null;
  if (consent === "granted" && !open) return null;
  if (consent === "denied" && !open)
    return (
      <button type="button" className="measurement-preferences" onClick={() => setOpen(true)}>
        Cookie preferences
      </button>
    );
  return (
    <aside className="measurement-consent" aria-label="Advertising measurement preferences">
      <p>
        <strong>{open ? "Advertising measurement" : "Help us find more families"}</strong>
        <br />
        {adsOptOutSignal()
          ? "Your browser’s privacy signal is respected. Google advertising measurement is off."
          : open
            ? `Google advertising measurement is ${consent === "granted" ? "on" : "off"}. You can change your choice here.`
            : "May we use Google advertising cookies to understand which ads lead to signups and purchases?"}{" "}
        Your photos, stories and family details aren’t shared.{" "}
        <a href="https://business.safety.google/privacy/" target="_blank" rel="noreferrer">
          How Google uses data
        </a>
      </p>
      <div>
        <button
          type="button"
          onClick={() => {
            setAdsConsent("denied");
            setOpen(false);
          }}
        >
          Not allow
        </button>
        <button
          type="button"
          disabled={adsOptOutSignal()}
          onClick={() => {
            setAdsConsent("granted");
            setOpen(false);
          }}
        >
          Allow
        </button>
      </div>
    </aside>
  );
}
