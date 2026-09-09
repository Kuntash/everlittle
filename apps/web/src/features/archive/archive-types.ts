export type PlatformState = {
  allowsPublicSignup: boolean;
  defaultArchiveSlug: string | null;
  deploymentMode: "hosted" | "self-hosted";
  needsSetup: boolean;
  childAccess: {
    displayName: string;
    childSlug: string;
    familySlug: string;
    enabled: boolean;
  } | null;
};

export type ChildSession = { signedIn: boolean; child?: { displayName: string } };

export type InvitationPreview = {
  archiveName: string;
  email: string;
  role: FamilyRole;
  expiresAt: string;
  inviterName: string;
};

export type FamilyRole = "owner" | "parent" | "contributor" | "viewer";

export type Member = {
  id: string;
  userId: string;
  role: FamilyRole;
  joinedAt: string;
  name: string;
  email: string;
  image?: string | null;
};

export type Child = {
  id: string;
  slug: string;
  displayName: string;
  birthDate: string;
  avatarAssetKey?: string | null;
  childAccessEnabled?: 0 | 1;
  childLastAccessAt?: string | null;
  childActiveDeviceCount?: number;
  profileKind?: "child" | "vault";
};

export type MemoryKind = "photo" | "story" | "voice" | "video" | "milestone" | "letter";

export type Memory = {
  id: string;
  childId: string;
  kind: MemoryKind;
  title: string;
  body: string | null;
  happenedAt: string;
  audience: "parents" | "family" | "child" | "all";
  createdAt: string;
  createdByUserId: string | null;
  authorName: string | null;
  mediaId: string | null;
  mediaType: "image" | "audio" | "video" | null;
  contentType: string | null;
  byteSize: number | null;
};

export type Capsule = {
  id: string;
  childId: string;
  title: string;
  body: string | null;
  unlocksAt: string;
  audience: "family" | "child";
  createdAt: string;
  createdByUserId: string | null;
  authorName: string | null;
  locked: 0 | 1;
};

export type PendingInvitation = {
  id: string;
  email: string;
  role: Exclude<FamilyRole, "owner">;
  expiresAt: string;
  createdAt: string;
  emailStatus: "not_sent" | "sent" | "failed";
  emailSentAt: string | null;
  emailAttemptCount: number;
};

export type ArchiveState = {
  archive: { id: string; name: string; slug: string; timezone: string; createdAt: string };
  currentMember: { id: string; role: FamilyRole; userId: string };
  members: Member[];
  children: Child[];
  memories: Memory[];
  capsules: Capsule[];
  invitations: PendingInvitation[];
  billing: {
    plan: "family" | "self-hosted";
    status: "active" | "canceled" | "complimentary" | "past_due" | "trialing";
    usedBytes: number;
    limitBytes: number | null;
    trialEndsAt: string | null;
    currentPeriodEndsAt: string | null;
    interval: "monthly" | "yearly" | null;
    cancelAtPeriodEnd: boolean;
    checkoutAvailable: boolean;
    canManage: boolean;
    canCreateContent: boolean;
    environment: "test_mode" | "live_mode" | null;
  };
};

export type ArchiveMembership = {
  id: string;
  name: string;
  slug: string;
  role: FamilyRole;
};

export type View = "parent" | "timeline" | "capsules" | "child" | "family";

export type BillingDestination = "monthly" | "yearly" | "portal";
