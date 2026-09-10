import { useRef } from "react";
import { UtensilsCrossed } from "lucide-react";
import { useLang } from "../i18n/LangContext";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { seedItems, type CategoryItems } from "./MealGuide";

interface Props {
  onOpenGuide: () => void;
}

// A permanent, non-dismissible fixture (unlike NotesNudge/PersonalizedTip) — the whole point
// is that "what to eat" should sit somewhere visible without having to remember to check it,
// not disappear once seen once. Picked once per mount rather than tied to the date, same
// reasoning as PersonalizedTip's tip pick: a date-keyed index only changes once every 24
// hours, which reads as "stuck" long before a day is up.
export function MealSnapshot({ onOpenGuide }: Props) {
  const t = useLang();
  const [itemsByCategory] = useLocalStorage<CategoryItems[]>("steady-meal-guide-items-v3", seedItems(t));

  const pickRef = useRef<number | null>(null);
  const categoryCount = t.mealGuide.categories.length;
  if (pickRef.current === null || pickRef.current >= categoryCount) {
    pickRef.current = categoryCount > 0 ? Math.floor(Math.random() * categoryCount) : 0;
  }
  const index = pickRef.current;
  const category = t.mealGuide.categories[index];
  const greenItems = itemsByCategory[index]?.green ?? [];

  if (!category || greenItems.length === 0) return null;

  return (
    <div className="rounded-2xl p-4 border border-border" style={{ backgroundColor: "var(--blue-bg)" }}>
      <div className="flex items-start gap-2.5">
        <UtensilsCrossed size={18} style={{ color: "var(--blue-text)", flexShrink: 0, marginTop: 2 }} aria-hidden="true" />
        <div className="flex-1 min-w-0">
          <p style={{ fontWeight: 700, color: "var(--blue-text)", marginBottom: 2 }}>{t.overview.mealSnapshot.heading}</p>
          <p style={{ color: "var(--blue-text)", fontSize: "0.88rem", lineHeight: 1.5 }}>
            <span style={{ fontWeight: 600 }}>{category.name}: </span>
            {greenItems.map((item) => item.text).join(", ")}
          </p>
          <button
            onClick={onOpenGuide}
            className="mt-2 hover:opacity-80"
            style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--blue-text)", textDecoration: "underline", transition: "opacity 0.15s" }}
          >
            {t.overview.mealSnapshot.seeGuide}
          </button>
        </div>
      </div>
    </div>
  );
}
