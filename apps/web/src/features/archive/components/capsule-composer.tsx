import { DateField } from "@/components/design/controls";
import { DesignSelect } from "@/components/design/design-select";
import { Button, KindIcon, Modal } from "@/components/design/shared";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Child } from "@/features/archive/archive-types";
import {
  apiFetch,
  defaultCapsuleDate,
  responseError,
  toLocalDateTime,
} from "@/features/archive/lib/archive-utils";
import { LockKeyhole } from "lucide-react";
import type { FormEvent } from "react";
import { useState } from "react";

export function CapsuleComposer({
  child,
  onClose,
  onCreated,
}: {
  child: Child;
  onClose: () => void;
  onCreated: () => Promise<void>;
}) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [unlocksAt, setUnlocksAt] = useState(defaultCapsuleDate());
  const [audience, setAudience] = useState<"family" | "child">("child");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const response = await apiFetch("/api/archive/capsules", {
      method: "POST",
      body: JSON.stringify({
        childId: child.id,
        title,
        body,
        unlocksAt: new Date(unlocksAt).toISOString(),
        audience,
      }),
    });
    if (!response.ok) {
      setError(await responseError(response));
      setBusy(false);
      return;
    }
    await onCreated();
    onClose();
  }

  const eighteenth = new Date(`${child.birthDate}T09:00:00`);
  eighteenth.setFullYear(eighteenth.getFullYear() + 18);
  return (
    <Modal open title="A note for a future day" busy={busy} onClose={onClose}>
      <form className="editor-form" onSubmit={submit}>
        <fieldset disabled={busy}>
          <div className="capsule-editor-intro">
            <KindIcon kind="Letter" size={62} />
            <span>For {child.displayName}, when the time is right.</span>
          </div>
          <Input
            autoFocus
            required
            maxLength={160}
            className="writing-title"
            aria-label="Capsule title"
            placeholder="Give this capsule a title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <Textarea
            required
            maxLength={20000}
            className="writing-body"
            aria-label="Your note"
            placeholder={`Dear ${child.displayName},`}
            rows={7}
            value={body}
            onChange={(event) => setBody(event.target.value)}
          />
          <div className="editor-attributes">
            <DateField
              label="Opening date"
              value={unlocksAt}
              onChange={setUnlocksAt}
              withTime
              future
              preset={
                child.birthDate
                  ? {
                      label: `${child.displayName}’s 18th birthday`,
                      value: toLocalDateTime(eighteenth.toISOString()),
                    }
                  : undefined
              }
            />
            <DesignSelect
              aria-label="Who can read the capsule"
              value={audience}
              onChange={(event) => setAudience(event.target.value as typeof audience)}
            >
              <option value="child">{child.displayName}’s view</option>
              <option value="family">Family archive</option>
            </DesignSelect>
          </div>
          <p className="sealing-note">
            <LockKeyhole size={15} />
            Sealed until{" "}
            {new Date(unlocksAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
            . Only its title and opening date stay visible.
          </p>
        </fieldset>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <div className="form-footer">
          <Button secondary type="button" disabled={busy} onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={busy} aria-busy={busy}>
            {busy ? "Sealing…" : "Seal capsule"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
