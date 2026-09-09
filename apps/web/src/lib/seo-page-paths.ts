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
export const SEO_PAGE_PATHS = [
  ...SEO_PAGE_LINKS.map(({ path }) => path),
  "/sharing-photos-with-grandparents",
] as const;
