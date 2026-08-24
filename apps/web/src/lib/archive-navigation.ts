export type ArchiveEntry = { slug: string };

export function resolveArchiveEntry(
  archives: ArchiveEntry[],
  options: {
    defaultArchiveSlug: string | null;
    deploymentMode: "hosted" | "self-hosted";
    rememberedArchiveSlug: string | null;
  },
): string | null {
  const archive =
    archives.find(({ slug }) => slug === options.defaultArchiveSlug) ??
    archives.find(({ slug }) => slug === options.rememberedArchiveSlug) ??
    archives[0];

  if (archive) return `/${encodeURIComponent(archive.slug)}`;
  return options.deploymentMode === "hosted" ? "/onboarding" : null;
}
