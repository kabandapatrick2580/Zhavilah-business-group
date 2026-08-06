// A reserved slot for artwork that has not been supplied yet.
//
// Placeholders are designed rather than blank: each one holds the exact space,
// aspect ratio and rounding of the final photograph, names the shot that
// belongs there and states the size to supply. Dropping in the real asset is
// then a one-line change with no layout shift and no re-design.
//
// The component fills its parent, so the parent owns the dimensions (an
// `aspect-[…]` box, a fixed height, or the `h-72` frames used by
// `ServiceHistory`).

import { Camera } from "lucide-react";
import { SERVICE_ICONS, type ServiceIconName } from "@/components/services/serviceIcons";

export default function ImagePlaceholder({
  label,
  spec,
  icon,
  tone = "light",
  className = "",
}: {
  /** The photograph that belongs here, written as a shot brief. */
  label: string;
  /** Delivery spec — dimensions and format. */
  spec?: string;
  icon?: ServiceIconName;
  /** `dark` for placement on navy surfaces. */
  tone?: "light" | "dark";
  className?: string;
}) {
  const Icon = icon ? SERVICE_ICONS[icon] : Camera;
  const dark = tone === "dark";

  return (
    <div
      className={`${dark ? "zbg-placeholder-dark" : "zbg-placeholder"} flex h-full w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 text-center ${
        dark
          ? "border-white/25 bg-brand-dark text-white"
          : "border-brand/25 bg-brand-tint/60 text-brand-ink"
      } ${className}`}
    >
      <span
        className={`flex size-12 items-center justify-center rounded-xl ${
          dark ? "bg-white/10 text-brand-sky" : "bg-white text-brand shadow-[0_6px_18px_rgba(11,38,74,0.08)]"
        }`}
      >
        <Icon className="size-5" />
      </span>

      <span className="max-w-[26ch] text-sm font-semibold leading-snug">{label}</span>

      {spec && (
        <span
          className={`font-mono text-[11px] font-semibold uppercase tracking-[0.16em] ${
            dark ? "text-white/50" : "text-brand-muted/70"
          }`}
        >
          {spec}
        </span>
      )}
    </div>
  );
}
