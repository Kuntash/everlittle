import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router";
import { Download, RefreshCw, Share, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, viewport-fit=cover",
      },
      { title: "Everlittle — Memories to grow into" },
      {
        name: "description",
        content: "A private family memory archive and time capsule.",
      },
      { name: "theme-color", content: "#f7f1e7" },
      { name: "color-scheme", content: "light" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "default" },
      { name: "apple-mobile-web-app-title", content: "Everlittle" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "icon", href: "/icon.svg", type: "image/svg+xml" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
    ],
  }),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <PwaExperience />
        <Scripts />
      </body>
    </html>
  );
}

type InstallPromptEvent = Event & {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const PWA_DISMISSED_KEY = "everlittle.pwa-install-dismissed";
const PWA_REMINDER_MS = 30 * 24 * 60 * 60 * 1000;

function PwaExperience() {
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [updateWorker, setUpdateWorker] = useState<ServiceWorker | null>(null);
  const [releaseAvailable, setReleaseAvailable] = useState(false);
  const [dismissed, setDismissed] = useState(true);
  const guideClose = useRef<HTMLButtonElement>(null);
  const guidePanel = useRef<HTMLElement>(null);
  const standalone =
    typeof window !== "undefined" &&
    (window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true);
  const isIos =
    typeof navigator !== "undefined" &&
    (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) &&
    !(window as Window & { MSStream?: unknown }).MSStream;

  useEffect(() => {
    const dismissedAt = Number(localStorage.getItem(PWA_DISMISSED_KEY) ?? 0);
    setDismissed(Date.now() - dismissedAt < PWA_REMINDER_MS);

    function capturePrompt(event: Event) {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
    }
    window.addEventListener("beforeinstallprompt", capturePrompt);

    if (!("serviceWorker" in navigator)) {
      return () => window.removeEventListener("beforeinstallprompt", capturePrompt);
    }

    let reloading = false;
    function reloadForUpdate() {
      if (reloading) return;
      reloading = true;
      window.location.reload();
    }
    navigator.serviceWorker.addEventListener("controllerchange", reloadForUpdate);
    let registration: ServiceWorkerRegistration | null = null;

    async function checkForRelease() {
      if (document.visibilityState === "hidden") return;
      try {
        const response = await fetch(`/version.json?check=${Date.now()}`, { cache: "no-store" });
        if (response.ok) {
          const release = (await response.json()) as { buildId?: string };
          if (release.buildId && release.buildId !== __EVERLITTLE_BUILD_ID__) {
            setReleaseAvailable(true);
          }
        }
        await registration?.update();
      } catch {
        // An offline PWA should continue quietly and check again when connectivity returns.
      }
    }

    function checkWhenVisible() {
      if (document.visibilityState === "visible") void checkForRelease();
    }

    void navigator.serviceWorker.register("/sw.js").then((nextRegistration) => {
      registration = nextRegistration;
      if (nextRegistration.waiting && navigator.serviceWorker.controller) {
        setUpdateWorker(nextRegistration.waiting);
      }
      nextRegistration.addEventListener("updatefound", () => {
        const worker = nextRegistration.installing;
        worker?.addEventListener("statechange", () => {
          if (worker.state === "installed" && navigator.serviceWorker.controller) {
            setUpdateWorker(worker);
          }
        });
      });
      void checkForRelease();
    });
    window.addEventListener("focus", checkForRelease);
    window.addEventListener("online", checkForRelease);
    document.addEventListener("visibilitychange", checkWhenVisible);

    return () => {
      window.removeEventListener("beforeinstallprompt", capturePrompt);
      window.removeEventListener("focus", checkForRelease);
      window.removeEventListener("online", checkForRelease);
      document.removeEventListener("visibilitychange", checkWhenVisible);
      navigator.serviceWorker.removeEventListener("controllerchange", reloadForUpdate);
    };
  }, []);

  function applyUpdate() {
    if (updateWorker) {
      updateWorker.postMessage({ type: "SKIP_WAITING" });
      return;
    }
    window.location.reload();
  }

  useEffect(() => {
    if (!showIosGuide) return;
    const scrollY = window.scrollY;
    const previous = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
    };
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    guideClose.current?.focus();
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") dismissInstall();
      if (event.key !== "Tab") return;
      const focusable = [
        ...(guidePanel.current?.querySelectorAll<HTMLButtonElement>("button") ?? []),
      ];
      const first = focusable.at(0);
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previous.overflow;
      document.body.style.position = previous.position;
      document.body.style.top = previous.top;
      document.body.style.width = previous.width;
      window.scrollTo(0, scrollY);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [showIosGuide]);

  function dismissInstall() {
    localStorage.setItem(PWA_DISMISSED_KEY, String(Date.now()));
    setDismissed(true);
    setShowIosGuide(false);
  }

  async function install() {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === "accepted") dismissInstall();
    setInstallPrompt(null);
  }

  const showInstall = !standalone && !dismissed && (Boolean(installPrompt) || isIos);

  return (
    <>
      {showInstall ? (
        <aside className="pwa-prompt" aria-label="Install Everlittle">
          <span className="pwa-prompt-icon">
            <Download />
          </span>
          <div>
            <strong>Keep Everlittle on your Home Screen</strong>
            <small>Open Diki’s archive like an app, without searching for the website.</small>
          </div>
          <button
            className="pwa-prompt-action"
            onClick={() => (isIos ? setShowIosGuide(true) : void install())}
            type="button"
          >
            {isIos ? "Show me" : "Install"}
          </button>
          <button className="pwa-prompt-close" aria-label="Not now" onClick={dismissInstall}>
            <X />
          </button>
        </aside>
      ) : null}

      {showIosGuide ? (
        <div className="pwa-guide-backdrop" role="presentation" onPointerDown={dismissInstall}>
          <section
            aria-labelledby="pwa-guide-title"
            aria-modal="true"
            className="pwa-guide"
            onPointerDown={(event) => event.stopPropagation()}
            ref={guidePanel}
            role="dialog"
          >
            <button
              className="pwa-guide-close"
              aria-label="Close"
              onClick={dismissInstall}
              ref={guideClose}
            >
              <X />
            </button>
            <span className="pwa-guide-share">
              <Share />
            </span>
            <p className="eyebrow">On iPhone or iPad</p>
            <h2 id="pwa-guide-title">Add Everlittle to your Home Screen</h2>
            <ol>
              <li>Tap the Share button in Safari.</li>
              <li>Scroll down and choose “Add to Home Screen.”</li>
              <li>Tap “Add” to open Everlittle like an app.</li>
            </ol>
            <button className="primary-button" onClick={dismissInstall} type="button">
              Got it
            </button>
          </section>
        </div>
      ) : null}

      {updateWorker || releaseAvailable ? (
        <aside className="pwa-update" role="status">
          <div>
            <strong>A new Everlittle is ready</strong>
            <small>Update now to use the latest version.</small>
          </div>
          <button onClick={applyUpdate} type="button">
            <RefreshCw /> Update
          </button>
        </aside>
      ) : null}
    </>
  );
}
