import { useLang } from "../i18n/LangContext";
import { type Lang } from "../i18n/translations";
import { type A11ySettings } from "./a11yTypes";

function ToggleRow({ label, description, value, onChange }: {
  label: string; description: string; value: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="w-full flex items-center justify-between rounded-xl p-4 text-left border-2 hover:opacity-85"
      style={{
        backgroundColor: value ? "var(--green-bg)" : "var(--surface-1)",
        borderColor: value ? "var(--primary)" : "transparent",
        transition: "all 0.15s",
      }}
      aria-pressed={value}
    >
      <div className="flex-1 mr-4">
        <p className="text-foreground" style={{ fontWeight: 700 }}>{label}</p>
        <p className="text-muted-foreground" style={{ fontSize: "0.85rem", marginTop: 2 }}>{description}</p>
      </div>
      <div
        className="flex-shrink-0 rounded-full relative"
        style={{ width: 44, height: 24, backgroundColor: value ? "var(--primary)" : "var(--muted-foreground)" }}
      >
        <div
          className="absolute top-1 rounded-full bg-white"
          style={{ width: 16, height: 16, left: value ? 24 : 4, transition: "left 0.2s" }}
        />
      </div>
    </button>
  );
}

function OptionGroup<V extends string>({ label, options, value, onChange }: {
  label: string;
  options: { value: V; label: string; hint?: string }[];
  value: V;
  onChange: (v: V) => void;
}) {
  return (
    <div>
      <p className="text-foreground mb-2" style={{ fontWeight: 700, fontSize: "0.95rem" }}>{label}</p>
      <div className="flex gap-2 flex-wrap">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className="rounded-xl px-4 py-2.5 border-2 text-left hover:opacity-85"
            style={{
              borderColor: value === opt.value ? "var(--primary)" : "transparent",
              backgroundColor: value === opt.value ? "var(--green-bg)" : "var(--surface-1)",
              color: value === opt.value ? "var(--green-text)" : "var(--foreground)",
              fontWeight: value === opt.value ? 700 : 500,
              transition: "all 0.15s",
            }}
            aria-pressed={value === opt.value}
          >
            <span style={{ fontSize: "0.9rem" }}>{opt.label}</span>
            {opt.hint && (
              <span className="block text-muted-foreground" style={{ fontSize: "0.75rem", marginTop: 1 }}>{opt.hint}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

interface Props {
  settings: A11ySettings;
  onChange: (s: A11ySettings) => void;
}

export function AccessibilityPanel({ settings, onChange }: Props) {
  const t = useLang();
  const a = t.a11y;
  const update = (patch: Partial<A11ySettings>) => onChange({ ...settings, ...patch });

  return (
    <div className="bg-card rounded-2xl p-5 border border-border space-y-5">
      <div>
        <h3 className="mb-1 text-foreground">{a.heading}</h3>
        <p className="text-muted-foreground" style={{ fontSize: "0.95rem" }}>{a.description}</p>
      </div>

      <OptionGroup
        label={a.fontSize.label}
        value={settings.fontSize}
        onChange={(v) => update({ fontSize: v })}
        options={[
          { value: "normal", label: a.fontSize.normal, hint: a.fontSize.normalHint },
          { value: "large", label: a.fontSize.large, hint: a.fontSize.largeHint },
          { value: "xlarge", label: a.fontSize.xlarge, hint: a.fontSize.xlargeHint },
        ]}
      />

      <OptionGroup
        label={a.font.label}
        value={settings.font}
        onChange={(v) => update({ font: v })}
        options={[
          { value: "standard", label: a.font.standard, hint: a.font.standardHint },
          { value: "readable", label: a.font.readable, hint: a.font.readableHint },
        ]}
      />

      <OptionGroup
        label={a.lineSpacing.label}
        value={settings.lineSpacing}
        onChange={(v) => update({ lineSpacing: v })}
        options={[
          { value: "normal", label: a.lineSpacing.normal },
          { value: "spacious", label: a.lineSpacing.spacious, hint: a.lineSpacing.spaciousHint },
        ]}
      />

      <div>
        <p className="text-foreground mb-2" style={{ fontWeight: 700, fontSize: "0.95rem" }}>{a.language.label}</p>
        <div className="flex gap-2">
          {(["en", "da"] as Lang[]).map((lang) => (
            <button
              key={lang}
              onClick={() => update({ language: lang })}
              className="rounded-xl px-5 py-2.5 border-2 hover:opacity-85"
              style={{
                borderColor: settings.language === lang ? "var(--purple-vivid)" : "transparent",
                backgroundColor: settings.language === lang ? "var(--purple-bg)" : "var(--surface-1)",
                color: settings.language === lang ? "var(--purple-text)" : "var(--foreground)",
                fontWeight: settings.language === lang ? 700 : 500,
                fontSize: "0.9rem",
                transition: "all 0.15s",
              }}
              aria-pressed={settings.language === lang}
            >
              {lang === "en" ? "🇬🇧 English" : "🇩🇰 Dansk"}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <ToggleRow label={a.reduceMotion.label} description={a.reduceMotion.description} value={settings.reduceMotion} onChange={(v) => update({ reduceMotion: v })} />
        <ToggleRow label={a.highContrast.label} description={a.highContrast.description} value={settings.highContrast} onChange={(v) => update({ highContrast: v })} />
        <ToggleRow label={a.darkMode.label} description={a.darkMode.description} value={settings.darkMode} onChange={(v) => update({ darkMode: v })} />
      </div>

      <p
        className="rounded-xl px-4 py-3"
        style={{ backgroundColor: "var(--purple-bg)", color: "var(--purple-text)", fontSize: "0.85rem", lineHeight: 1.6 }}
      >
        {a.instantNote}
      </p>
    </div>
  );
}
