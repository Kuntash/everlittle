export const DEPLOYMENT_MODES = ["hosted", "self-hosted"] as const;

export type DeploymentMode = (typeof DEPLOYMENT_MODES)[number];

type DeploymentEnvironment = {
  APP_NAME?: string;
  DEFAULT_ARCHIVE_SLUG?: string;
  DEPLOYMENT_MODE?: string;
  PUBLIC_APP_URL?: string;
};

export type DeploymentConfig = {
  appName: string;
  defaultArchiveSlug: string | null;
  mode: DeploymentMode;
  publicAppUrl: string;
  capabilities: {
    allowsInitialOwnerBootstrap: boolean;
    allowsPublicSignup: boolean;
    requiresBilling: boolean;
    showsMarketingSite: boolean;
    supportsMultipleArchives: boolean;
  };
};

export function getDeploymentConfig(runtime: DeploymentEnvironment): DeploymentConfig {
  const mode = parseDeploymentMode(runtime.DEPLOYMENT_MODE);
  const publicAppUrl = parsePublicAppUrl(runtime.PUBLIC_APP_URL);
  const defaultArchiveSlug = runtime.DEFAULT_ARCHIVE_SLUG?.trim() || null;

  if (defaultArchiveSlug && !isValidSlug(defaultArchiveSlug)) {
    throw new Error(
      "DEFAULT_ARCHIVE_SLUG must contain 3-48 lowercase letters, numbers, or hyphens.",
    );
  }

  if (mode === "hosted" && defaultArchiveSlug) {
    throw new Error("DEFAULT_ARCHIVE_SLUG is only supported in self-hosted mode.");
  }

  return {
    appName: runtime.APP_NAME?.trim() || "Everlittle",
    defaultArchiveSlug,
    mode,
    publicAppUrl,
    capabilities: {
      allowsInitialOwnerBootstrap: mode === "self-hosted",
      allowsPublicSignup: mode === "hosted",
      requiresBilling: mode === "hosted",
      showsMarketingSite: mode === "hosted",
      supportsMultipleArchives: mode === "hosted",
    },
  };
}

export function getCanonicalHostedUrl(
  deployment: DeploymentConfig,
  requestUrl: string,
): string | null {
  if (deployment.mode !== "hosted") return null;

  const incoming = new URL(requestUrl);
  if (incoming.origin === deployment.publicAppUrl) return null;

  const canonical = new URL(deployment.publicAppUrl);
  canonical.pathname = incoming.pathname;
  canonical.search = incoming.search;
  return canonical.toString();
}

function parseDeploymentMode(value: string | undefined): DeploymentMode {
  if (value === "hosted" || value === "self-hosted") return value;
  throw new Error('DEPLOYMENT_MODE must be either "hosted" or "self-hosted".');
}

function parsePublicAppUrl(value: string | undefined) {
  if (!value) throw new Error("PUBLIC_APP_URL is required.");

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error("PUBLIC_APP_URL must be an absolute URL.");
  }

  const local = url.hostname === "localhost" || url.hostname === "127.0.0.1";
  if (url.protocol !== "https:" && !(local && url.protocol === "http:")) {
    throw new Error("PUBLIC_APP_URL must use HTTPS except on localhost.");
  }
  if (url.pathname !== "/" || url.search || url.hash) {
    throw new Error("PUBLIC_APP_URL must be an origin without a path, query, or hash.");
  }

  return url.origin;
}

function isValidSlug(value: string) {
  return value.length >= 3 && /^[a-z0-9](?:[a-z0-9-]{1,46}[a-z0-9])?$/.test(value);
}
