import { MemoryIllustration } from "@/components/design/memory-illustrations";
import type {
  ArchiveState,
  FamilyRole,
  Memory,
  MemoryKind,
  View,
} from "@/features/archive/archive-types";

export function apiFetch(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  if (!headers.has("content-type")) headers.set("content-type", "application/json");
  return fetch(scopedApiPath(path), { ...init, headers });
}

export function scopedApiPath(path: string) {
  const slug = currentFamilySlug();
  if (!slug || !path.startsWith("/api/")) return path;
  if (!path.startsWith("/api/archive") && !path.startsWith("/api/media")) return path;
  return `/api/families/${encodeURIComponent(slug)}${path.slice(4)}`;
}

export function currentFamilySlug() {
  if (typeof window === "undefined") return "";
  const [first = ""] = window.location.pathname.split("/").filter(Boolean);
  return first;
}

export function currentArchiveView(): View {
  if (typeof window === "undefined") return "parent";
  const [, section = ""] = window.location.pathname.split("/").filter(Boolean);
  if (section === "timeline" || section === "capsules" || section === "child") return section;
  if (section === "family" || section === "settings") return "family";
  return "parent";
}

export function requestedRedirect() {
  if (typeof window === "undefined") return "/";
  const value = new URLSearchParams(location.search).get("redirect") ?? "/";
  return value.startsWith("/") && !value.startsWith("//") ? value : "/";
}

export async function responseError(response: Response) {
  try {
    return ((await response.json()) as { error?: string }).error ?? "Something went wrong.";
  } catch {
    return "Something went wrong.";
  }
}

export function roleLabel(role: FamilyRole) {
  return role.charAt(0).toUpperCase() + role.slice(1);
}

export function roleDescription(role: FamilyRole) {
  if (role === "parent") return "Parents can manage the archive and add memories.";
  if (role === "contributor") return "Contributors can add memories to the child’s story.";
  if (role === "viewer") return "Viewers can see family memories shared with them.";
  return "Owners manage the family archive.";
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(value));
}

export function billingStatusTitle(billing: ArchiveState["billing"]) {
  if (!billing.canManage) return "No paid subscription";
  if (billing.cancelAtPeriodEnd) return "Cancellation scheduled";
  if (billing.status === "past_due") return "Payment needs attention";
  if (billing.status === "canceled") return "Subscription ended";
  if (billing.status === "trialing") return "Trial active";
  const price = billing.interval === "monthly" ? "$6 monthly" : "$60 yearly";
  return billing.interval ? `${price} · Active` : "Subscription active";
}

export function billingStatusDetail(billing: ArchiveState["billing"]) {
  if (!billing.canManage) return "No charges or invoices. Choose a plan when you’re ready.";
  if (billing.cancelAtPeriodEnd && billing.currentPeriodEndsAt) {
    return `Access continues until ${formatDate(billing.currentPeriodEndsAt)}.`;
  }
  if (billing.status === "active" && billing.currentPeriodEndsAt) {
    return `Renews ${formatDate(billing.currentPeriodEndsAt)}. Dodo handles invoices and cancellation.`;
  }
  if (billing.status === "trialing" && billing.trialEndsAt) {
    return `Trial ends ${formatDate(billing.trialEndsAt)}.`;
  }
  return "Open Dodo’s secure portal for invoices, payment methods, and plan controls.";
}

export function formatDateTime(value: string) {
  const normalized = value.includes("T") ? value : `${value.replace(" ", "T")}Z`;
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(
    new Date(normalized),
  );
}

export function formatMemoryDate(value: string) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(value));
}

export function formatMediaTime(value: number) {
  if (!Number.isFinite(value) || value < 0) return "0:00";
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export async function createVideoThumbnail(file: File): Promise<Blob | null> {
  const objectUrl = URL.createObjectURL(file);
  const video = document.createElement("video");
  video.muted = true;
  video.playsInline = true;
  video.preload = "auto";
  video.src = objectUrl;

  try {
    video.load();
    await waitForVideoEvent(video, "loadeddata");
    if (Number.isFinite(video.duration) && video.duration > 0.12) {
      video.currentTime = 0.1;
      await waitForVideoEvent(video, "seeked");
    }

    if (!video.videoWidth || !video.videoHeight) return null;
    const scale = Math.min(1, 960 / video.videoWidth, 720 / video.videoHeight);
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(video.videoWidth * scale));
    canvas.height = Math.max(1, Math.round(video.videoHeight * scale));
    const context = canvas.getContext("2d");
    if (!context) return null;
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    return await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.84));
  } finally {
    video.removeAttribute("src");
    video.load();
    URL.revokeObjectURL(objectUrl);
  }
}

export function waitForVideoEvent(video: HTMLVideoElement, eventName: "loadeddata" | "seeked") {
  return new Promise<void>((resolve, reject) => {
    const timeout = window.setTimeout(() => finish(new Error("Video frame timed out.")), 12_000);
    const onEvent = () => finish();
    const onError = () => finish(new Error("This video format cannot provide a thumbnail."));
    function finish(error?: Error) {
      window.clearTimeout(timeout);
      video.removeEventListener(eventName, onEvent);
      video.removeEventListener("error", onError);
      if (error) reject(error);
      else resolve();
    }
    video.addEventListener(eventName, onEvent, { once: true });
    video.addEventListener("error", onError, { once: true });
  });
}

export function currentLocalDateTime() {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

export function defaultCapsuleDate() {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 1);
  date.setMinutes(0, 0, 0);
  return toLocalDateTime(date.toISOString());
}

export function toLocalDateTime(value: string) {
  const date = new Date(value);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
}

export function kindLabel(kind: MemoryKind) {
  return kind.charAt(0).toUpperCase() + kind.slice(1);
}

export function audienceLabel(audience: Memory["audience"]) {
  if (audience === "all") return "Everyone";
  if (audience === "child") return "For child";
  if (audience === "parents") return "Parents only";
  return "Family";
}

export function memoryIcon(kind: MemoryKind, size = 64) {
  return <MemoryIllustration kind={kind.charAt(0).toUpperCase() + kind.slice(1)} size={size} />;
}

export function memoryTitlePlaceholder(kind: MemoryKind) {
  if (kind === "photo") return "That sleepy afternoon smile";
  if (kind === "voice") return "The sound they made today";
  if (kind === "video") return "A little moment in motion";
  if (kind === "milestone") return "They reached for us";
  if (kind === "letter") return "For the day you wonder…";
  return "A small moment worth keeping";
}

export function memoryBodyPlaceholder(kind: MemoryKind) {
  if (kind === "letter") return "Dear you…";
  if (kind === "milestone") return "What happened, and how did it feel?";
  return "Write the detail a photograph or recording cannot hold…";
}

export function formatFileSize(bytes: number) {
  if (bytes === 0) return "0 KB";
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  if (bytes >= 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024 * 1024)).toFixed(0)} GB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
