export const CONTENT_LOCALES = ["en", "es", "pt-br"] as const;

export type ContentLocale = (typeof CONTENT_LOCALES)[number];

// URL prefix and BCP 47 tag for each locale that has public guides.
export const LOCALE_PREFIX: Record<ContentLocale, string> = {
  en: "",
  es: "/es",
  "pt-br": "/pt-br",
};

export const LOCALE_LANG: Record<ContentLocale, string> = {
  en: "en",
  es: "es",
  "pt-br": "pt-BR",
};

export function localeFromPath(pathname: string): ContentLocale {
  const first = pathname.split("/").filter(Boolean)[0];
  return first === "es" || first === "pt-br" ? first : "en";
}
