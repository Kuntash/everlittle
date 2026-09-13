import { ShadButton } from "@/components/design/controls";
import { DateInput } from "@/components/design/date-input";
import { DesignSelect } from "@/components/design/design-select";
import { Button, KindIcon, Modal } from "@/components/design/shared";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Child, FamilyRole, MemoryKind } from "@/features/archive/archive-types";
import { MemoryStageLabel } from "@/features/archive/components/memory-stage-label";
import {
  apiFetch,
  createVideoThumbnail,
  currentLocalDateTime,
  kindLabel,
  responseError,
  scopedApiPath,
} from "@/features/archive/lib/archive-utils";
import { usePostHog } from "@posthog/react";
import type { FormEvent } from "react";
import { useState } from "react";

export function MemoryComposer({
  child,
  initialKind,
  onClose,
  onCreated,
  role,
}: {
  child: Child;
  initialKind: MemoryKind;
  onClose: () => void;
  onCreated: () => Promise<void>;
  role: FamilyRole;
}) {
  const posthog = usePostHog();
  const [kind, setKind] = useState<MemoryKind>(initialKind);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [happenedAt, setHappenedAt] = useState(currentLocalDateTime());
  const [audience, setAudience] = useState<"parents" | "family" | "child" | "all">("family");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [stage, setStage] = useState<"idle" | "saving" | "uploading">("idle");

  const needsMedia = kind === "photo" || kind === "voice" || kind === "video";

  function chooseKind(nextKind: MemoryKind) {
    setKind(nextKind);
    setFile(null);
    setError("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (needsMedia && !file) {
      setError(
        kind === "photo"
          ? "Choose a photograph to keep."
          : kind === "voice"
            ? "Choose an audio recording to keep."
            : "Choose a video to keep.",
      );
      return;
    }
    if (file && file.size > 50 * 1024 * 1024) {
      setError("Media files must be 50 MB or smaller.");
      return;
    }

    setError("");
    setStage("saving");
    const videoThumbnail =
      kind === "video" && file ? await createVideoThumbnail(file).catch(() => null) : null;
    const response = await apiFetch("/api/archive/memories", {
      method: "POST",
      body: JSON.stringify({
        childId: child.id,
        kind,
        title,
        body: body || undefined,
        happenedAt: new Date(happenedAt).toISOString(),
        audience,
      }),
    });
    if (!response.ok) {
      setError(await responseError(response));
      setStage("idle");
      return;
    }

    const created = (await response.json()) as { id: string };
    if (file) {
      setStage("uploading");
      posthog?.capture("upload_started", {
        memory_kind: kind,
        size_bucket:
          file.size < 1048576 ? "under_1mb" : file.size < 10485760 ? "1_to_10mb" : "10_to_50mb",
      });
      const upload = await fetch(scopedApiPath(`/api/archive/memories/${created.id}/media`), {
        method: "PUT",
        headers: {
          "content-type": file.type || "application/octet-stream",
          "x-everlittle-file-name": encodeURIComponent(file.name),
        },
        body: file,
      });
      if (!upload.ok) {
        posthog?.capture("upload_failed", {
          memory_kind: kind,
          reason: upload.status === 413 ? "too_large" : "request_rejected",
        });
        await apiFetch(`/api/archive/memories/${created.id}`, { method: "DELETE" });
        setError(await responseError(upload));
        setStage("idle");
        return;
      }
      posthog?.capture("upload_succeeded", { memory_kind: kind });
      if (videoThumbnail) {
        const thumbnailUpload = await fetch(
          scopedApiPath(`/api/archive/memories/${created.id}/media/thumbnail`),
          {
            method: "PUT",
            headers: { "content-type": videoThumbnail.type },
            body: videoThumbnail,
          },
        );
        if (!thumbnailUpload.ok) {
          console.warn("The video was saved without its generated thumbnail.");
        }
      }
    }

    posthog?.capture("memory_save_completed", {
      memory_kind: kind,
      has_media: Boolean(file),
      memory_audience: audience,
    });
    await onCreated();
    onClose();
  }

  return (
    <Modal open title="Add a memory" busy={stage !== "idle"} onClose={onClose}>
      <form className="editor-form" onSubmit={submit} aria-busy={stage !== "idle"}>
        <fieldset disabled={stage !== "idle"}>
          <div className="memory-kind-picker" role="group" aria-label="Memory type">
            {(["photo", "story", "voice", "video", "milestone", "letter"] as MemoryKind[]).map(
              (item) => (
                <ShadButton
                  variant="ghost"
                  type="button"
                  key={item}
                  aria-pressed={kind === item}
                  className={kind === item ? "selected" : ""}
                  onClick={() => chooseKind(item)}
                >
                  <KindIcon kind={kindLabel(item)} size={39} />
                  <span>{kindLabel(item)}</span>
                </ShadButton>
              ),
            )}
          </div>
          <label className={`attachment-area ${file ? "has-file" : ""}`} hidden={!needsMedia}>
            <KindIcon kind={kindLabel(kind)} size={76} />
            <span>
              {file
                ? file.name
                : `Add ${kind === "voice" ? "an audio recording" : kind === "photo" ? "a photo" : "a video"}`}
            </span>
            <small>{file ? "Choose a different file" : "Up to 50 MB"}</small>
            <Input
              type="file"
              aria-label={`Choose ${kind} file`}
              accept={
                kind === "photo"
                  ? "image/*,.heic,.heif"
                  : kind === "voice"
                    ? "audio/*,.m4a,.caf"
                    : "video/*,.mov,.m4v"
              }
              disabled={!needsMedia}
              required={needsMedia}
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />
          </label>
          <Input
            autoFocus
            className="writing-title"
            aria-label="Memory title"
            placeholder="Give it a title"
            required
            maxLength={160}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <Textarea
            className="writing-body"
            aria-label="Memory description"
            placeholder="What would you love to remember?"
            rows={5}
            maxLength={20000}
            value={body}
            onChange={(event) => setBody(event.target.value)}
          />
          <div className="editor-attributes">
            <DateInput
              aria-label="Memory date"
              max={currentLocalDateTime()}
              required
              type="datetime-local"
              value={happenedAt}
              onChange={(event) => setHappenedAt(event.target.value)}
            />
            <DesignSelect
              aria-label="Who can see this memory"
              value={audience}
              onChange={(event) => setAudience(event.target.value as typeof audience)}
            >
              <option value="family">Family archive</option>
              {child.profileKind !== "vault" && (
                <option value="all">Family and {child.displayName}</option>
              )}
              {(role === "owner" || role === "parent") && (
                <option value="parents">Parents only</option>
              )}
              {child.profileKind !== "vault" && (
                <option value="child">{child.displayName}’s view</option>
              )}
            </DesignSelect>
          </div>
        </fieldset>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <div className="form-footer">
          <Button secondary type="button" disabled={stage !== "idle"} onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={stage !== "idle"} aria-busy={stage !== "idle"}>
            <MemoryStageLabel stage={stage} />
          </Button>
        </div>
      </form>
    </Modal>
  );
}
