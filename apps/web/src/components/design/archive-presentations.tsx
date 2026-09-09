import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { ReactNode } from "react";
import { KindIcon, Lock } from "./shared";
export function MemoryCard({
  kind,
  title,
  body,
  author,
  date,
  onOpen,
  media,
  player,
}: {
  kind: string;
  title: string;
  body?: string;
  author: string;
  date: string;
  onOpen: () => void;
  media?: ReactNode;
  player?: ReactNode;
}) {
  const visual = kind === "photo" || kind === "video";
  return (
    <Card className={`memory-card memory-${kind} ${visual ? "has-photo" : ""}`}>
      {kind === "video" && <div className="art photo-art video-card-media">{media}</div>}
      <Button
        variant="ghost"
        className="card-open"
        type="button"
        onClick={onOpen}
        aria-label={`Open memory: ${title}`}
      >
        {kind === "photo" ? (
          <div className="art photo-art">{media}</div>
        ) : kind !== "video" ? (
          <KindIcon kind={kind.charAt(0).toUpperCase() + kind.slice(1)} size={64} />
        ) : null}
        <div className="card-copy">
          <h3>{title}</h3>
          {!visual && kind !== "voice" && body ? <p>{body}</p> : null}
          <small>
            {author} · {date}
          </small>
        </div>
      </Button>
      {player && <div className="card-player">{player}</div>}
    </Card>
  );
}
export function SealedCapsuleCard({
  title,
  date,
  author,
  audience,
  children,
}: {
  title: string;
  date: string;
  author: string;
  audience: string;
  children?: ReactNode;
}) {
  return (
    <Card className="sealed-card">
      <KindIcon kind="Letter" size={74} />
      <div>
        <h3>{title}</h3>
        <p>
          <Lock size={14} />
          Opens {date}
        </p>
        <small>
          {author} · {audience}
        </small>
        {children}
      </div>
    </Card>
  );
}
export function FamilyPerson({
  name,
  description,
  children,
}: {
  name: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <article className="person-row">
      <span className="initial-avatar">
        {name
          .split(" ")
          .map((n) => n[0])
          .slice(0, 2)
          .join("")}
      </span>
      <div className="member-identity">
        <h3>{name}</h3>
        <small>{description}</small>
      </div>
      {children}
    </article>
  );
}
