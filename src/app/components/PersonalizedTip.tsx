import { Sparkles, X } from "lucide-react";
import { useLang } from "../i18n/LangContext";
import { useToday } from "../hooks/useToday";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { IconButton } from "./ui/IconButton";

interface Props {
  support: string[];
  sensory: string[];
  onPersonalize: () => void;
}

export function PersonalizedTip({ support, sensory, onPersonalize }: Props) {
  const t = useLang();
  const today = useToday();
  const [dismissed, setDismissed] = useLocalStorage("steady-personalize-dismissed", false);

  // Pick one sensory tip if any active sensory sensitivity applies
  const sensoryTip = sensory.find((s) => t.sensoryTips[s]);

  // Pick the support tip whose key matches a selection; rotate by day if multiple
  const matchedSupport = support.filter((s) => t.supportTips[s]);
  const supportTip =
    matchedSupport.length > 0
      ? t.supportTips[matchedSupport[new Date(`${today}T00:00:00`).getDate() % matchedSupport.length]]
      : t.supportTips["default"];

  // No sensory/support answers on file — likely skipped onboarding (e.g. guest
  // "skip setup"), so tips are stuck on the generic fallback until they opt in.
  const hasPersonalization = support.length > 0 || sensory.length > 0;

  return (
    <div className="space-y-3">
      {sensoryTip && (
        <div
          className="rounded-2xl px-4 py-3 border border-border"
          style={{ backgroundColor: "var(--surface-1)" }}
        >
          <p className="text-muted-foreground" style={{ fontSize: "0.9rem", lineHeight: 1.6 }}>
            {t.sensoryTips[sensoryTip]}
          </p>
        </div>
      )}
      <div
        className="rounded-2xl p-4 border border-border"
        style={{ backgroundColor: "var(--purple-bg)" }}
      >
        <p style={{ fontWeight: 700, color: "var(--purple-text)", marginBottom: 4 }}>
          {t.overview.tipForYou}
        </p>
        <p style={{ color: "var(--purple-text)", fontSize: "0.95rem", lineHeight: 1.6 }}>
          {supportTip}
        </p>
      </div>
      {!hasPersonalization && !dismissed && (
        <div
          className="rounded-2xl p-4 border border-border flex items-start gap-3"
          style={{ backgroundColor: "var(--yellow-bg)" }}
        >
          <Sparkles size={18} style={{ color: "var(--yellow-text)", flexShrink: 0, marginTop: 2 }} aria-hidden="true" />
          <div className="flex-1 min-w-0">
            <p style={{ fontWeight: 700, color: "var(--yellow-text)", marginBottom: 2 }}>
              {t.overview.personalizeTitle}
            </p>
            <p style={{ color: "var(--yellow-text)", fontSize: "0.88rem", lineHeight: 1.5, marginBottom: 10 }}>
              {t.overview.personalizeText}
            </p>
            <button
              onClick={onPersonalize}
              className="rounded-lg px-3 py-1.5 bg-primary text-primary-foreground hover:opacity-90"
              style={{ fontSize: "0.82rem", fontWeight: 700 }}
            >
              {t.overview.personalizeButton}
            </button>
          </div>
          <IconButton size="sm" onClick={() => setDismissed(true)} aria-label={t.overview.personalizeDismiss}>
            <X size={14} />
          </IconButton>
        </div>
      )}
    </div>
  );
}
