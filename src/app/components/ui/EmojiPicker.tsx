export const AVATAR_EMOJIS = ["🌱", "🌻", "🌊", "🍂", "⭐", "🌙", "🦋", "🐢", "🌈", "🎨"];

interface EmojiPickerProps {
  value: string;
  onChange: (emoji: string) => void;
  /** "grid" — 6-column, aspect-square tiles (onboarding). "wrap" — fixed 40px tiles that flow inline (profile). */
  layout?: "grid" | "wrap";
  groupLabel?: string;
}

export function EmojiPicker({ value, onChange, layout = "wrap", groupLabel }: EmojiPickerProps) {
  const isGrid = layout === "grid";
  return (
    <div
      role="group"
      aria-label={groupLabel}
      className={isGrid ? "grid gap-3" : "flex flex-wrap gap-2"}
      style={isGrid ? { gridTemplateColumns: "repeat(6, 1fr)" } : undefined}
    >
      {AVATAR_EMOJIS.map((emoji) => (
        <button
          key={emoji}
          onClick={() => onChange(emoji)}
          aria-label={emoji}
          aria-pressed={value === emoji}
          className={`avatar-option flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${isGrid ? "rounded-2xl" : "rounded-xl"}`}
          style={{
            width: isGrid ? undefined : 40,
            height: isGrid ? undefined : 40,
            aspectRatio: isGrid ? "1" : undefined,
            fontSize: isGrid ? "1.8rem" : "1.4rem",
            backgroundColor: value === emoji ? "var(--green-bg)" : "var(--avatar-option-bg)",
            border: value === emoji ? "2px solid var(--primary)" : "1px solid var(--border)",
            transition: "background-color 0.15s, border-color 0.15s",
          }}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}
