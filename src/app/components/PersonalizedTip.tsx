import { useRef } from "react";
import { Sparkles, X } from "lucide-react";
import { useLang } from "../i18n/LangContext";
import { IconButton } from "./ui/IconButton";

interface Props {
  support: string[];
  sensory: string[];
  onPersonalize: () => void;
  suppressNudge?: boolean;
  dismissed: boolean;
  onDismiss: () => void;
}

export function PersonalizedTip({ support, sensory, onPersonalize, suppressNudge, dismissed, onDismiss }: Props) {
  const t = useLang();

  // Sensory and support tips used to render as two separate cards even though they're the
  // same idea (a bit of static, personalized advice) just drawn from two different profile
  // questions — that read as redundant rather than as two distinct features. Pooling them
  // into one rotating tip means there's only ever one "tip" card, whichever kind it is.
  const sensoryTips = sensory.filter((s) => t.sensoryTips[s]).map((s) => t.sensoryTips[s]);
  const supportTips = support.filter((s) => t.supportTips[s]).map((s) => t.supportTips[s]);
  const allTips = [...sensoryTips, ...supportTips];

  // Was previously keyed off the day of month, which meant checking this card twice in the
  // same day (the normal way anyone would notice whether it "works") always showed the exact
  // same tip — reads as broken even though it was technically rotating, just once every 24h.
  // Picking a fresh index per mount instead means every visit to Home can show something
  // different, without needing to wait for a day to roll over. Stored in a ref (not state) so
  // it stays fixed for the lifetime of this mount rather than reshuffling on every re-render.
  const pickRef = useRef<number | null>(null);
  if (pickRef.current === null || pickRef.current >= allTips.length) {
    pickRef.current = allTips.length > 0 ? Math.floor(Math.random() * allTips.length) : 0;
  }
  const tip = allTips.length > 0 ? allTips[pickRef.current] : null;

  // No sensory/support answers on file — likely skipped onboarding (e.g. guest
  // "skip setup"). Don't show a generic fallback tip alongside the nudge to
  // personalize — that reads as "you already gave me a tip, why ask again?"
  const hasPersonalization = support.length > 0 || sensory.length > 0;

  return (
    <div className="space-y-3">
      {tip && (
        <div
          className="rounded-2xl p-4 border border-border"
          style={{ backgroundColor: "var(--purple-bg)" }}
        >
          <p style={{ fontWeight: 700, color: "var(--purple-text)", marginBottom: 4 }}>
            {t.overview.tipForYou}
          </p>
          <p style={{ color: "var(--purple-text)", fontSize: "0.95rem", lineHeight: 1.6 }}>
            {tip}
          </p>
        </div>
      )}
      {!hasPersonalization && !dismissed && !suppressNudge && (
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
              className="rounded-lg px-3 py-1.5 hover:opacity-90"
              style={{ fontSize: "0.82rem", fontWeight: 700, backgroundColor: "var(--foreground)", color: "var(--background)" }}
            >
              {t.overview.personalizeButton}
            </button>
          </div>
          <IconButton size="sm" onClick={onDismiss} aria-label={t.overview.personalizeDismiss}>
            <X size={14} />
          </IconButton>
        </div>
      )}
    </div>
  );
}
