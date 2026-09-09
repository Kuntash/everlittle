import { ShadButton } from "@/components/design/controls";
import { DateInput } from "@/components/design/date-input";
import { DesignSelect } from "@/components/design/design-select";
import { Button, KindIcon, Modal } from "@/components/design/shared";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Child, FamilyRole, Memory } from "@/features/archive/archive-types";
import { MemoryMedia } from "@/features/archive/components/memory-media";
import { MemoryPlayback } from "@/features/archive/components/memory-playback";
import { useConfirmation } from "@/features/archive/hooks/use-confirmation";
import {
  apiFetch,
  audienceLabel,
  currentLocalDateTime,
  formatMemoryDate,
  kindLabel,
  responseError,
  scopedApiPath,
  createVideoThumbnail,
  toLocalDateTime,
} from "@/features/archive/lib/archive-utils";
import { Lock } from "lucide-react";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { MemorySharingMenu } from "./memory-sharing-menu";

export function MemoryDetail({
  child,
  currentUserId,
  memory,
  onClose,
  onChanged,
  role,
  backLabel = "memories",
}: {
  child: Child;
  currentUserId: string;
  memory: Memory;
  onClose: () => void;
  onChanged: () => Promise<void>;
  role: FamilyRole;
  backLabel?: string;
}) {
  const { confirm, confirmation } = useConfirmation();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(memory.title);
  const [body, setBody] = useState(memory.body ?? "");
  const [happenedAt, setHappenedAt] = useState(toLocalDateTime(memory.happenedAt));
  const [audience, setAudience] = useState<Memory["audience"]>(memory.audience);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [shareBusy, setShareBusy] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [replacement, setReplacement] = useState<File | null>(null);
  const [removeAttachment, setRemoveAttachment] = useState(false);
  const [replacementUrl, setReplacementUrl] = useState("");
  const [currentMediaId, setCurrentMediaId] = useState(memory.mediaId);
  useEffect(() => {
    if (!replacement) {
      setReplacementUrl("");
      return;
    }
    const url = URL.createObjectURL(replacement);
    setReplacementUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [replacement]);
  const canEdit = memory.createdByUserId === currentUserId;

  function closeEditor() {
    setEditing(false);
    setReplacement(null);
    setRemoveAttachment(false);
    setTitle(memory.title);
    setBody(memory.body ?? "");
    setHappenedAt(toLocalDateTime(memory.happenedAt));
    setAudience(memory.audience);
    setError("");
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (removeAttachment && !replacement) {
      setError("Choose a replacement file, or restore the current attachment.");
      return;
    }
    if (replacement && replacement.size > 50 * 1024 * 1024) {
      setError("Media files must be 50 MB or smaller.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      if (replacement) {
        const upload = await fetch(scopedApiPath(`/api/archive/memories/${memory.id}/media`), {
          method: "PUT",
          headers: {
            "content-type": replacement.type || "application/octet-stream",
            "x-everlittle-file-name": encodeURIComponent(replacement.name),
            ...(currentMediaId ? { "x-everlittle-replace-media-id": currentMediaId } : {}),
          },
          body: replacement,
        });
        if (!upload.ok) throw new Error(await responseError(upload));
        const asset = (await upload.json()) as { id: string };
        setCurrentMediaId(asset.id);
        if (memory.kind === "video") {
          const thumbnail = await createVideoThumbnail(replacement).catch(() => null);
          if (thumbnail)
            await fetch(scopedApiPath(`/api/archive/memories/${memory.id}/media/thumbnail`), {
              method: "PUT",
              headers: { "content-type": thumbnail.type },
              body: thumbnail,
            }).catch(() => null);
        }
      }
      const response = await apiFetch(`/api/archive/memories/${memory.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          childId: child.id,
          kind: memory.kind,
          title,
          body: body || undefined,
          happenedAt: new Date(happenedAt).toISOString(),
          audience,
        }),
      });
      if (!response.ok) {
        setError(await responseError(response));
        setBusy(false);
        return;
      }
      await onChanged();
      onClose();
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "The memory could not be saved. Try again.",
      );
      setBusy(false);
    }
  }

  async function remove() {
    if (!(await confirm(`Delete “${memory.title}”? Its private media will also be removed.`)))
      return;
    setBusy(true);
    const response = await apiFetch(`/api/archive/memories/${memory.id}`, { method: "DELETE" });
    if (!response.ok) {
      setError(await responseError(response));
      setBusy(false);
      return;
    }
    await onChanged();
    onClose();
  }

  async function createShare() {
    setShareBusy(true);
    setError("");
    const response = await apiFetch(`/api/archive/memories/${memory.id}/share`, {
      method: "POST",
    });
    if (!response.ok) {
      setError(await responseError(response));
      setShareBusy(false);
      return;
    }
    const result = (await response.json()) as { shareUrl: string };
    setShareUrl(result.shareUrl);
    setShareBusy(false);
  }

  async function sharePublicLink() {
    if (!shareUrl) return;
    if (navigator.share) {
      await navigator.share({ title: memory.title, url: shareUrl });
      return;
    }
    await navigator.clipboard.writeText(shareUrl);
  }

  async function copyPublicLink() {
    if (shareUrl) await navigator.clipboard.writeText(shareUrl);
  }

  async function revokeShare() {
    setShareBusy(true);
    setError("");
    const response = await apiFetch(`/api/archive/memories/${memory.id}/share`, {
      method: "DELETE",
    });
    if (!response.ok) {
      setError(await responseError(response));
      setShareBusy(false);
      return;
    }
    setShareUrl("");
    setShareBusy(false);
  }

  return (
    <div className="memory-reader">
      {confirmation}
      <div className="detail-toolbar">
        <ShadButton variant="link" className="text-button back" onClick={onClose}>
          ← Back to {backLabel}
        </ShadButton>
        {canEdit && (
          <MemorySharingMenu
            url={shareUrl}
            busy={shareBusy}
            onEnable={createShare}
            onDisable={revokeShare}
            onCopy={copyPublicLink}
            onShare={sharePublicLink}
          />
        )}
      </div>
      <div className="detail-grid">
        <div>
          {memory.kind === "photo" || memory.kind === "video" ? (
            <MemoryMedia memory={memory} featured />
          ) : (
            <div className="detail-art">
              <KindIcon kind={kindLabel(memory.kind)} size={180} />
            </div>
          )}
          {memory.kind === "voice" && <MemoryPlayback memory={memory} />}
        </div>
        <div>
          <h1 className="detail-title">{memory.title}</h1>
          <p className="detail-body">{memory.body}</p>
          <small>
            Kept by {memory.authorName ?? "Family"} · {formatMemoryDate(memory.happenedAt)}
          </small>
          <div className="audience-meta">
            <Lock size={14} />
            {audienceLabel(memory.audience)}
          </div>
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          {canEdit && (
            <div className="detail-actions">
              <Button secondary onClick={() => setEditing(true)}>
                Edit memory
              </Button>
              <ShadButton
                variant="quiet"
                className="quiet-action"
                disabled={busy}
                onClick={() => void remove()}
              >
                Delete memory
              </ShadButton>
            </div>
          )}
        </div>
      </div>
      <Modal open={editing} title="Edit your memory" busy={busy} onClose={closeEditor}>
        <form className="editor-form" onSubmit={save}>
          <fieldset disabled={busy}>
            {["photo", "video", "voice"].includes(memory.kind) && (
              <>
                {(replacementUrl || (currentMediaId && !removeAttachment)) && (
                  <div className="attachment-area attached-preview">
                    {replacementUrl ? (
                      memory.kind === "photo" ? (
                        <img src={replacementUrl} alt="Replacement attachment" />
                      ) : memory.kind === "video" ? (
                        <video src={replacementUrl} controls />
                      ) : (
                        <audio src={replacementUrl} controls />
                      )
                    ) : memory.kind === "voice" ? (
                      <MemoryPlayback memory={{ ...memory, mediaId: currentMediaId }} />
                    ) : (
                      <MemoryMedia memory={{ ...memory, mediaId: currentMediaId }} featured />
                    )}
                  </div>
                )}
                <div className="attachment-actions">
                  <label className="button-quiet">
                    {removeAttachment ? "Choose replacement" : "Replace attachment"}
                    <Input
                      className="sr-only"
                      type="file"
                      aria-label="Choose replacement file"
                      accept={
                        memory.kind === "photo"
                          ? "image/*,.heic,.heif"
                          : memory.kind === "video"
                            ? "video/*,.mov,.m4v"
                            : "audio/*,.m4a,.caf"
                      }
                      onChange={(event) => {
                        setReplacement(event.target.files?.[0] ?? null);
                        setError("");
                      }}
                    />
                  </label>
                  {!removeAttachment && (
                    <ShadButton
                      variant="link"
                      type="button"
                      onClick={() => {
                        setRemoveAttachment(true);
                        setReplacement(null);
                      }}
                    >
                      Remove attachment
                    </ShadButton>
                  )}
                  {removeAttachment && (
                    <ShadButton
                      variant="link"
                      type="button"
                      onClick={() => {
                        setRemoveAttachment(false);
                        setReplacement(null);
                        setError("");
                      }}
                    >
                      Restore attachment
                    </ShadButton>
                  )}
                </div>
              </>
            )}
            <Input
              required
              className="writing-title"
              aria-label="Memory title"
              placeholder="Give it a title"
              maxLength={160}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
            <Textarea
              className="writing-body"
              aria-label="Memory description"
              placeholder="What would you love to remember?"
              maxLength={20000}
              rows={5}
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
                onChange={(event) => setAudience(event.target.value as Memory["audience"])}
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
            <Button secondary type="button" disabled={busy} onClick={closeEditor}>
              Cancel
            </Button>
            <Button disabled={busy}>{busy ? "Saving…" : "Save changes"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
