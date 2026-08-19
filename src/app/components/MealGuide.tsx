import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useLang } from "../i18n/LangContext";
import { AnimatedCollapse } from "./AnimatedCollapse";

function TrafficLightColumn({ label, hint, items, bg, text }: { label: string; hint: string; items: string[]; bg: string; text: string }) {
  return (
    <div className="rounded-xl p-3" style={{ backgroundColor: bg }}>
      <p style={{ fontWeight: 700, fontSize: "0.8rem", color: text }}>{label}</p>
      <p className="mb-2" style={{ fontSize: "0.72rem", color: text, opacity: 0.85 }}>{hint}</p>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item} style={{ fontSize: "0.82rem", color: text }}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export function MealGuide() {
  const t = useLang();
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="mb-1 text-foreground text-lg">{t.mealGuide.heading}</h2>
        <p className="text-muted-foreground" style={{ fontSize: "0.95rem" }}>{t.mealGuide.description}</p>
      </div>

      <div className="rounded-xl p-3 border border-border">
        <p className="mb-1.5 text-foreground" style={{ fontWeight: 700, fontSize: "0.85rem" }}>{t.mealGuide.tipsHeading}</p>
        <ul className="space-y-1 pl-4" style={{ listStyleType: "disc" }}>
          {t.mealGuide.tips.map((tip) => (
            <li key={tip} className="text-muted-foreground" style={{ fontSize: "0.85rem" }}>{tip}</li>
          ))}
        </ul>
      </div>

      <div>
        <p className="mb-2 text-foreground" style={{ fontWeight: 700, fontSize: "0.85rem" }}>{t.mealGuide.trafficLightHeading}</p>
        <div className="space-y-2">
          {t.mealGuide.categories.map((category) => {
            const open = openCategory === category.name;
            return (
              <div key={category.name} className="rounded-2xl border border-border overflow-hidden">
                <button
                  onClick={() => setOpenCategory(open ? null : category.name)}
                  className="w-full flex items-center justify-between p-3 text-left hover:bg-muted"
                  style={{ backgroundColor: "var(--surface-1)" }}
                  aria-expanded={open}
                >
                  <span className="text-foreground" style={{ fontWeight: 700, fontSize: "0.9rem" }}>{category.name}</span>
                  {open ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
                </button>
                <AnimatedCollapse open={open}>
                  <div className="p-3 space-y-2 bg-card">
                    <TrafficLightColumn label={t.mealGuide.green} hint={t.mealGuide.greenHint} items={category.green} bg="var(--green-bg)" text="var(--green-text)" />
                    <TrafficLightColumn label={t.mealGuide.yellow} hint={t.mealGuide.yellowHint} items={category.yellow} bg="var(--yellow-bg)" text="var(--yellow-text)" />
                    <TrafficLightColumn label={t.mealGuide.red} hint={t.mealGuide.redHint} items={category.red} bg="var(--orange-bg)" text="var(--orange-text)" />
                  </div>
                </AnimatedCollapse>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl p-3 border border-border">
        <p className="mb-1.5 text-foreground" style={{ fontWeight: 700, fontSize: "0.85rem" }}>{t.mealGuide.hardDayHeading}</p>
        <ul className="space-y-1 pl-4" style={{ listStyleType: "disc" }}>
          {t.mealGuide.hardDayTips.map((tip) => (
            <li key={tip} className="text-muted-foreground" style={{ fontSize: "0.85rem" }}>{tip}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
