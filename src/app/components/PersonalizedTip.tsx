import { useLang } from "../i18n/LangContext";
import { useToday } from "../hooks/useToday";

interface Props {
  support: string[];
  sensory: string[];
}

export function PersonalizedTip({ support, sensory }: Props) {
  const t = useLang();
  const today = useToday();

  // Pick one sensory tip if any active sensory sensitivity applies
  const sensoryTip = sensory.find((s) => t.sensoryTips[s]);

  // Pick the support tip whose key matches a selection; rotate by day if multiple
  const matchedSupport = support.filter((s) => t.supportTips[s]);
  const supportTip =
    matchedSupport.length > 0
      ? t.supportTips[matchedSupport[new Date(`${today}T00:00:00`).getDate() % matchedSupport.length]]
      : t.supportTips["default"];

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
    </div>
  );
}
