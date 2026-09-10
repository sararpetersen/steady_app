import { useLang } from "../i18n/LangContext";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useToday } from "../hooks/useToday";
import { seedItems, type CategoryItems } from "./MealGuide";

interface Props {
  onOpenGuide: () => void;
}

// Indexed to match t.mealGuide.categories (Drinks/Breakfast/Lunch & dinner/Protein/Snacks),
// same positional-correspondence convention MealGuide.tsx itself uses for editable items —
// these are purely decorative and don't need to survive a category being added/reordered.
const CATEGORY_EMOJIS = ["🥤", "🍳", "🍽️", "🍗", "🍎"];

// A permanent, non-dismissible fixture (unlike NotesNudge/PersonalizedTip) — the whole point
// is that "what to eat" should sit somewhere visible without having to remember to check it.
// The category is picked from the day-of-month, not per mount: a card that visibly changes
// its answer on every refresh reads as arbitrary noise rather than "today's idea," and with
// 5 categories to cycle through (unlike PersonalizedTip's tip pool, which could collapse to
// just one) a daily rotation still varies meaningfully across a week.
export function MealSnapshot({ onOpenGuide }: Props) {
  const t = useLang();
  const today = useToday();
  const [itemsByCategory] = useLocalStorage<CategoryItems[]>("steady-meal-guide-items-v3", seedItems(t));

  const categoryCount = t.mealGuide.categories.length;
  if (categoryCount === 0) return null;
  const dayOfMonth = Number(today.split("-")[2]);
  const index = dayOfMonth % categoryCount;
  const category = t.mealGuide.categories[index];
  const greenItems = itemsByCategory[index]?.green ?? [];

  if (!category || greenItems.length === 0) return null;

  return (
    <div className="rounded-2xl p-4 border-2" style={{ backgroundColor: "var(--blue-bg)", borderColor: "var(--blue-text)" }}>
      <div className="flex items-center gap-3 mb-2.5">
        <div
          className="rounded-full flex items-center justify-center flex-shrink-0"
          style={{ width: 40, height: 40, backgroundColor: "var(--card)", fontSize: "1.3rem" }}
          aria-hidden="true"
        >
          {CATEGORY_EMOJIS[index] ?? "🍽️"}
        </div>
        <div className="flex-1 min-w-0">
          <p style={{ fontWeight: 800, color: "var(--blue-text)", fontSize: "1.02rem" }}>{t.overview.mealSnapshot.heading}</p>
          <p style={{ color: "var(--blue-text)", fontSize: "0.78rem", fontWeight: 600, opacity: 0.85 }}>{category.name}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 mb-2.5">
        {greenItems.map((item) => (
          <span
            key={item.id}
            className="rounded-full px-2.5 py-1"
            style={{ backgroundColor: "var(--card)", color: "var(--blue-text)", fontSize: "0.8rem", fontWeight: 600 }}
          >
            {item.text}
          </span>
        ))}
      </div>
      <button
        onClick={onOpenGuide}
        className="hover:opacity-80"
        style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--blue-text)", textDecoration: "underline", transition: "opacity 0.15s" }}
      >
        {t.overview.mealSnapshot.seeGuide}
      </button>
    </div>
  );
}
