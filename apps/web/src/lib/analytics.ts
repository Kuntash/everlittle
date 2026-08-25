export function analyticsPath(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return "/";
  const publicRoutes = new Set([
    "invite",
    "onboarding",
    "pricing",
    "reset-password",
    "sign-in",
    "sign-up",
  ]);
  if (publicRoutes.has(parts[0])) return `/${parts[0]}`;
  if (parts[0] === "share") return "/share/:token";
  const familySections = new Set(["capsules", "child", "family", "settings", "timeline"]);
  const section = familySections.has(parts[1]) ? parts[1] : "home";
  return `/:familySlug/${section}`;
}
