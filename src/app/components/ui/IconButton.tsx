import type { ButtonHTMLAttributes, CSSProperties } from "react";

type Tone = "none" | "default" | "primary" | "destructive";
type Size = "sm" | "md" | "pill" | "lg";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: Tone;
  size?: Size;
  /** Draws a 2px border and tints it (and the icon) primary when `active` — used for the round nav-level toggles. */
  bordered?: boolean;
  /** Tints the icon/text primary regardless of hover, e.g. a pressed/has-content state. */
  active?: boolean;
}

const SIZE_CLASSES: Record<Size, string> = {
  // Nudged up slightly from p-1.5/p-2 — closer to a comfortable tap target for an audience
  // where motor-coordination/tremor is a common co-occurring trait, without going all the
  // way to 44px, which would reintroduce the row-squishing this session already fixed.
  sm: "p-2 rounded-lg",
  md: "p-2.5 rounded-lg",
  pill: "px-2.5 py-1.5 rounded-lg",
  lg: "rounded-full flex-shrink-0",
};

const HOVER_TEXT: Record<Tone, string> = {
  none: "",
  default: "hover:text-foreground",
  primary: "hover:text-primary",
  destructive: "hover:text-destructive",
};

const LG_DIMENSION = 44;

export function IconButton({
  tone = "default",
  size = "sm",
  bordered = false,
  active = false,
  className = "",
  style,
  children,
  ...props
}: IconButtonProps) {
  const lgStyle: CSSProperties =
    size === "lg"
      ? {
          width: LG_DIMENSION,
          height: LG_DIMENSION,
          border: bordered ? `2px solid ${active ? "var(--primary)" : "var(--border)"}` : undefined,
        }
      : {};

  return (
    <button
      className={`${SIZE_CLASSES[size]} flex items-center justify-center hover:bg-muted ${HOVER_TEXT[tone]} ${className}`}
      style={{
        color: active ? "var(--primary)" : "var(--muted-foreground)",
        transition: "background-color 0.15s, border-color 0.15s, color 0.15s",
        ...lgStyle,
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
}
