import { z } from "zod";

export const familyRoleSchema = z.enum(["owner", "parent", "contributor", "viewer"]);
export const memoryKindSchema = z.enum(["photo", "story", "voice", "video", "milestone", "letter"]);
export const audienceSchema = z.enum(["parents", "family", "child", "all"]);

export const RESERVED_FAMILY_SLUGS = new Set([
  "about",
  "admin",
  "api",
  "help",
  "invite",
  "login",
  "logout",
  "onboarding",
  "pricing",
  "privacy",
  "settings",
  "share",
  "sign-in",
  "sign-up",
  "support",
  "terms",
]);

export const familySlugSchema = z
  .string()
  .min(3)
  .max(48)
  .regex(/^[a-z0-9](?:[a-z0-9-]{1,46}[a-z0-9])?$/)
  .refine((value) => !RESERVED_FAMILY_SLUGS.has(value), "This address is reserved.");

export const childSlugSchema = z
  .string()
  .min(2)
  .max(48)
  .regex(/^[a-z0-9](?:[a-z0-9-]{0,46}[a-z0-9])?$/);

export function slugify(value: string, fallback: string) {
  const slug = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48)
    .replace(/-+$/g, "");
  return slug.length >= 2 ? slug : fallback;
}

export type FamilyRole = z.infer<typeof familyRoleSchema>;
export type MemoryKind = z.infer<typeof memoryKindSchema>;
export type Audience = z.infer<typeof audienceSchema>;

export type ChildProfile = {
  id: string;
  slug: string;
  displayName: string;
  birthDate: string;
  avatarUrl?: string;
};

export type Memory = {
  id: string;
  childId: string;
  kind: MemoryKind;
  title: string;
  body?: string;
  happenedAt: string;
  audience: Audience;
  createdBy: string;
};
