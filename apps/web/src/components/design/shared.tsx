import {
  ArrowRight,
  Calendar,
  Check,
  ChevronDown,
  Lock,
  Pause,
  Play,
  Plus,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import React from "react";
import { Button as ShadButton } from "../ui/button";
import { SurfaceModal } from "./controls";
import { BrandMark, MemoryIllustration } from "./memory-illustrations";
export { ArrowRight, Calendar, Check, ChevronDown, Lock, Pause, Play, Plus, ShieldCheck, Users, X };
export const kinds = ["Photo", "Story", "Voice", "Video", "Milestone", "Letter"];
export function KindIcon({ kind, size = 38 }: { kind: string; size?: number }) {
  return <MemoryIllustration kind={kind} size={size} />;
}
export function Brand() {
  return (
    <span className="brand">
      <BrandMark />
      Everlittle
    </span>
  );
}
export function Art({ name, className = "" }: { name: string; className?: string }) {
  if (name === "box" || name === "camera")
    return (
      <div className={`art object-art ${className}`}>
        <MemoryIllustration kind={name === "box" ? "Keepsake" : "Photo"} size={180} />
      </div>
    );
  if (name !== "photo" && name !== "bike") return null;
  const src =
    name === "photo" ? "/design/apricot-a7c926732061.webp" : "/design/apricot-e0148af986ae.webp";
  const photo = name === "photo" || name === "bike";
  return (
    <div className={`art ${photo ? "photo-art" : "object-art"} ${className}`}>
      <img
        src={src}
        alt={
          photo
            ? name === "bike"
              ? "A first bike ride"
              : "Three generations sharing a family album"
            : ""
        }
      />
    </div>
  );
}
export function Button({
  children,
  secondary = false,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  secondary?: boolean;
}) {
  return (
    <ShadButton
      {...props}
      variant={secondary ? "outline" : "default"}
      className={`raised ${secondary ? "secondary" : ""} ${className}`}
    >
      {children}
    </ShadButton>
  );
}
export const Modal = SurfaceModal;
export function Wave() {
  return (
    <span className="wave" aria-hidden="true">
      {Array.from(
        {
          length: 38,
        },
        (_, i) => (
          <i
            key={i}
            style={{
              height: 8 + ((i * 17 + 13) % 25),
            }}
          />
        ),
      )}
    </span>
  );
}
