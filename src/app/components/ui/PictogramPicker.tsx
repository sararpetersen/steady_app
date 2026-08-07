import { useLang } from "../../i18n/LangContext";

interface PictogramPickerProps {
  value: string;
  onChange: (value: string) => void;
  /** Context-specific suggestion grid — habits, routine steps, and important dates each
   * offer a different curated set, so this stays a prop rather than baked into the component. */
  suggestions: string[];
  labels: Record<string, string>;
  /** "md" (44px tiles) matches the Habit/Important-date "add new" forms; "sm" (40px tiles)
   * matches Routines' nested step-add form, which sits inside an already-indented section. */
  size?: "md" | "sm";
}

// Same "pick a suggestion or type your own" pattern previously duplicated across
// HabitTracker, Routines, and ImportantDates — each had its own copy of this JSX (and two
// of the three had never been localized for Danish at all). Consolidated here so there's
// one place to fix bugs or add languages.
export function PictogramPicker({ value, onChange, suggestions, labels, size = "md" }: PictogramPickerProps) {
  const t = useLang();
  const tile = size === "md" ? 44 : 40;
  const tileFont = size === "md" ? "1.3rem" : "1.2rem";
  const previewFont = size === "md" ? "1.8rem" : "1.5rem";
  const inputFont = size === "md" ? "1.2rem" : "1.1rem";

  return (
    <div>
      <p className="text-muted-foreground mb-2" style={{ fontSize: "0.82rem", fontWeight: 600 }}>
        {t.common.pickEmoji}
      </p>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {suggestions.map((e) => (
          <button
            key={e}
            type="button"
            onClick={() => onChange(e)}
            className="rounded-lg hover:scale-110"
            style={{
              width: tile,
              height: tile,
              fontSize: tileFont,
              backgroundColor: value === e ? "var(--green-bg)" : "transparent",
              border: value === e ? "2px solid var(--primary)" : "2px solid transparent",
              transition: "all 0.15s",
            }}
            aria-label={labels[e] ?? e}
            aria-pressed={value === e}
          >
            {e}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <span style={{ fontSize: previewFont }}>{value || "—"}</span>
        <span className="text-muted-foreground" style={{ fontSize: "0.82rem" }}>
          {t.common.orTypeOwnEmoji}
        </span>
        <input
          type="text"
          aria-label={t.common.pickEmoji}
          value={value}
          onChange={(e) => onChange(e.target.value.slice(-2) || e.target.value)}
          className="rounded-lg border border-border bg-input-background text-foreground outline-none focus:border-primary text-center"
          style={{ width: 48, height: 36, fontSize: inputFont }}
          maxLength={2}
        />
      </div>
    </div>
  );
}
