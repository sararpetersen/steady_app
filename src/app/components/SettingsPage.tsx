import { useState } from "react";
import { X } from "lucide-react";
import { useLang } from "../i18n/LangContext";
import type { A11ySettings } from "./AccessibilityPanel";
import type { Lang } from "../i18n/translations";

interface Props {
  settings: A11ySettings;
  onChange: (s: A11ySettings) => void;
  onClose: () => void;
  onResetOnboarding: () => void;
  onClearData: () => void;
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--primary)", marginBottom: 8 }}>
      {children}
    </p>
  );
}

function ToggleRow({ label, description, value, onChange }: {
  label: string; description?: string; value: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="w-full flex items-center justify-between rounded-xl px-4 py-3 hover:opacity-85 border-2"
      style={{
        backgroundColor: value ? "var(--green-bg)" : "var(--surface-1)",
        borderColor: value ? "var(--primary)" : "transparent",
        transition: "all 0.15s",
      }}
      aria-pressed={value}
    >
      <div className="flex-1 mr-4 text-left">
        <p className="text-foreground" style={{ fontWeight: 600 }}>{label}</p>
        {description && <p className="text-muted-foreground" style={{ fontSize: "0.82rem" }}>{description}</p>}
      </div>
      <div className="flex-shrink-0 rounded-full relative" style={{ width: 44, height: 24, backgroundColor: value ? "var(--primary)" : "var(--muted-foreground)" }}>
        <div className="absolute top-1 rounded-full bg-white" style={{ width: 16, height: 16, left: value ? 24 : 4, transition: "left 0.2s" }} />
      </div>
    </button>
  );
}

function OptionRow<V extends string>({ label, options, value, onChange }: {
  label: string;
  options: { value: V; label: string }[];
  value: V;
  onChange: (v: V) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-1">
      <span className="text-foreground" style={{ fontWeight: 600 }}>{label}</span>
      <div className="flex gap-1.5">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className="rounded-lg px-3 py-1.5 border-2 hover:opacity-85"
            style={{
              borderColor: value === opt.value ? "var(--primary)" : "transparent",
              backgroundColor: value === opt.value ? "var(--green-bg)" : "var(--surface-1)",
              color: value === opt.value ? "var(--green-text)" : "var(--foreground)",
              fontWeight: value === opt.value ? 700 : 500,
              fontSize: "0.85rem",
              transition: "all 0.15s",
            }}
            aria-pressed={value === opt.value}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function SettingsPage({ settings, onChange, onClose, onResetOnboarding, onClearData }: Props) {
  const t = useLang();
  const s = t.settings;
  const [confirmClear, setConfirmClear] = useState(false);
  const [cleared, setCleared] = useState(false);
  const update = (patch: Partial<A11ySettings>) => onChange({ ...settings, ...patch });

  const handleClear = () => {
    onClearData();
    setConfirmClear(false);
    setCleared(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-foreground" style={{ fontFamily: "var(--app-font-heading, Nunito)" }}>{s.title}</h2>
        <button onClick={onClose} className="rounded-xl p-2 hover:bg-muted" style={{ transition: "background-color 0.15s" }} aria-label="Close settings">
          <X size={20} className="text-foreground" />
        </button>
      </div>

      {/* Appearance */}
      <div className="steady-card bg-card rounded-2xl p-5 border border-border space-y-3">
        <SectionHeading>{s.sections.appearance}</SectionHeading>
        <ToggleRow label={s.darkMode.label} description={s.darkMode.description} value={settings.darkMode} onChange={(v) => update({ darkMode: v })} />
        <OptionRow
          label={s.fontSize.label}
          value={settings.fontSize}
          onChange={(v) => update({ fontSize: v })}
          options={[
            { value: "normal", label: s.fontSize.normal },
            { value: "large", label: s.fontSize.large },
            { value: "xlarge", label: s.fontSize.xlarge },
          ]}
        />
      </div>

      {/* Readability */}
      <div className="steady-card bg-card rounded-2xl p-5 border border-border space-y-3">
        <SectionHeading>{s.sections.readability}</SectionHeading>
        <OptionRow
          label={s.font.label}
          value={settings.font}
          onChange={(v) => update({ font: v })}
          options={[
            { value: "standard", label: s.font.standard },
            { value: "readable", label: s.font.readable },
          ]}
        />
        <OptionRow
          label={s.lineSpacing.label}
          value={settings.lineSpacing}
          onChange={(v) => update({ lineSpacing: v })}
          options={[
            { value: "normal", label: s.lineSpacing.normal },
            { value: "spacious", label: s.lineSpacing.spacious },
          ]}
        />
        <ToggleRow label={s.reduceMotion.label} description={s.reduceMotion.description} value={settings.reduceMotion} onChange={(v) => update({ reduceMotion: v })} />
        <ToggleRow label={s.highContrast.label} description={s.highContrast.description} value={settings.highContrast} onChange={(v) => update({ highContrast: v })} />
      </div>

      {/* Language */}
      <div className="steady-card bg-card rounded-2xl p-5 border border-border space-y-3">
        <SectionHeading>{s.sections.language}</SectionHeading>
        <div className="flex gap-3">
          {(["en", "da"] as Lang[]).map((lang) => (
            <button
              key={lang}
              onClick={() => update({ language: lang })}
              className="flex-1 flex items-center gap-3 rounded-xl px-4 py-3 border-2 hover:opacity-85"
              style={{
                borderColor: settings.language === lang ? "var(--primary)" : "var(--border)",
                backgroundColor: settings.language === lang ? "var(--green-bg)" : "var(--surface-1)",
                transition: "all 0.15s",
              }}
              aria-pressed={settings.language === lang}
            >
              <span style={{ fontSize: "1.4rem" }}>{lang === "en" ? "🇬🇧" : "🇩🇰"}</span>
              <span className="text-foreground" style={{ fontWeight: settings.language === lang ? 700 : 500 }}>
                {lang === "en" ? "English" : "Dansk"}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Data */}
      <div className="steady-card bg-card rounded-2xl p-5 border border-border space-y-3">
        <SectionHeading>{s.sections.data}</SectionHeading>

        <button
          onClick={onResetOnboarding}
          className="w-full rounded-xl px-4 py-3 border border-border text-foreground hover:bg-muted text-left"
          style={{ fontWeight: 600, transition: "background-color 0.15s" }}
        >
          {s.resetOnboarding}
        </button>

        {!confirmClear && !cleared && (
          <button
            onClick={() => setConfirmClear(true)}
            className="w-full rounded-xl px-4 py-3 text-left hover:opacity-85"
            style={{ backgroundColor: "var(--destructive)", color: "white", fontWeight: 600, transition: "opacity 0.15s", borderRadius: "0.75rem" }}
          >
            {s.clearData}
          </button>
        )}

        {confirmClear && (
          <div className="rounded-xl p-4 border-2" style={{ borderColor: "var(--destructive)", backgroundColor: "var(--surface-1)" }}>
            <p className="text-foreground mb-3" style={{ fontSize: "0.9rem" }}>{s.clearConfirm}</p>
            <div className="flex gap-2">
              <button onClick={handleClear} className="flex-1 rounded-xl py-2 text-white hover:opacity-85" style={{ backgroundColor: "var(--destructive)", fontWeight: 700, transition: "opacity 0.15s" }}>
                {s.clearYes}
              </button>
              <button onClick={() => setConfirmClear(false)} className="flex-1 rounded-xl py-2 border border-border text-foreground hover:bg-muted" style={{ fontWeight: 600, transition: "background-color 0.15s" }}>
                {s.clearNo}
              </button>
            </div>
          </div>
        )}

        {cleared && (
          <p className="text-primary text-center" style={{ fontWeight: 600 }}>{s.dataCleared}</p>
        )}
      </div>
    </div>
  );
}
