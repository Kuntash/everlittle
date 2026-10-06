export const SEO_PAGE_LINKS = [
  { path: "/family-memory-app", label: "Family memory app" },
  { path: "/digital-time-capsule-for-kids", label: "Time capsules for kids" },
  { path: "/letters-to-your-future-child", label: "Letters to your child" },
  { path: "/private-family-photo-sharing", label: "Private photo sharing" },
  { path: "/baby-memory-journal", label: "Baby memory journal" },
  { path: "/grandparents-memory-project", label: "Grandparents memory project" },
] as const;

export type SeoPagePath = (typeof SEO_PAGE_LINKS)[number]["path"];

// Journal-only guides share crawler eligibility without requiring legacy landing-page content.
export const GUIDE_PAGE_PATHS = [
  "/time-capsule-letter-to-child-examples",
  "/first-birthday-time-capsule-letters",
  "/birthday-interview-questions-for-kids",
  "/letter-to-my-baby-on-first-birthday",
  "/letter-to-my-grandchild",
  "/18-letters-for-18th-birthday",
  "/baby-firsts-checklist",
  "/baby-book-alternatives",
  "/email-address-for-baby",
  "/long-distance-family-statistics",
  "/long-distance-grandparenting-ideas",
  "/first-birthday-time-capsule-ideas",
  "/tinybeans-alternatives",
  "/qeepsake-alternatives",
  "/storyworth-alternatives",
  "/familyalbum-vs-google-photos-vs-tinybeans",
  "/best-baby-book-apps",
] as const;

export const TOOL_PAGE_PATHS = [
  "/tools",
  "/tools/time-with-your-kids",
  "/tools/graduation-year-calculator",
  "/tools/birthday-interview-questions",
  "/tools/how-old-will-i-be",
  "/tools/baby-milestone-dates",
  "/tools/time-capsule-letter-prompts",
  "/tools/letter-to-future-self",
  "/tools/first-birthday-time-capsule-checklist",
] as const;

// Guides written natively for other languages, served under a locale prefix.
export const LOCALIZED_PAGE_PATHS = [
  "/es",
  "/es/carta-para-mi-hija-en-sus-15-anos",
  "/es/carta-para-mi-ahijado-de-bautizo",
  "/es/carta-para-mi-hijo-que-esta-lejos",
  "/es/carta-para-mi-nieto",
  "/es/capsula-del-tiempo-para-bebe",
  "/pt-br",
  "/pt-br/carta-para-meu-filho-ler-no-futuro",
  "/pt-br/mensagem-capsula-do-tempo-cha-de-bebe",
  "/pt-br/carta-para-meu-neto",
] as const;

export const SEO_PAGE_PATHS = [
  ...SEO_PAGE_LINKS.map(({ path }) => path),
  "/sharing-photos-with-grandparents",
  ...GUIDE_PAGE_PATHS,
  ...TOOL_PAGE_PATHS,
  ...LOCALIZED_PAGE_PATHS,
] as const;
