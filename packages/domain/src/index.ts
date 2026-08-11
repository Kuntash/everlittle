import { z } from "zod";

export const familyRoleSchema = z.enum(["owner", "parent", "contributor", "viewer"]);
export const memoryKindSchema = z.enum(["photo", "story", "voice", "video", "milestone", "letter"]);
export const audienceSchema = z.enum(["parents", "family", "child", "all"]);

export type FamilyRole = z.infer<typeof familyRoleSchema>;
export type MemoryKind = z.infer<typeof memoryKindSchema>;
export type Audience = z.infer<typeof audienceSchema>;

export type ChildProfile = {
  id: string;
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
