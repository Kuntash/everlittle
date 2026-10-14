import type { PlatformState } from "@/features/archive/archive-types";

/**
 * What the server already knows when it renders a page: the installation's settings and which sign-in cookies
 * the browser sent. The page uses it for its first paint, so it does not wait for `/api/platform`.
 * The cookie flags are hints only. The server still checks every session.
 */
export type BootState = {
  platform: PlatformState;
  /** The browser sent an adult session cookie. False means nobody is signed in on this browser. */
  hasSession: boolean;
  /** The browser sent a child session cookie. */
  hasChildSession: boolean;
};

const BOOT_GLOBAL = "__EVERLITTLE_BOOT__";
/** The Worker entry keeps the boot state of the running request here, in an AsyncLocalStorage. */
export const BOOT_STORE_GLOBAL = "__everlittleBootStore";

type BootStore = { getStore(): BootState | undefined };

/**
 * Read the boot state: from the running request on the server, from the document in the browser.
 * Null when the page was not rendered by the Worker entry, for example in a component test.
 * Callers must then ask `/api/platform`.
 */
export function readBoot(): BootState | null {
  if (typeof window !== "undefined") {
    return (window as unknown as Record<string, BootState | undefined>)[BOOT_GLOBAL] ?? null;
  }
  const store = (globalThis as unknown as Record<string, BootStore | undefined>)[BOOT_STORE_GLOBAL];
  return store?.getStore() ?? null;
}

/** The inline script that hands the boot state to the browser. `<` is escaped so a value cannot close the script. */
export function bootScript(boot: BootState) {
  return `window.${BOOT_GLOBAL}=${JSON.stringify(boot).replace(/</g, "\\u003c")}`;
}
