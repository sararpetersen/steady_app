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

// Only Breakfast (1) and Lunch & dinner (2) are actually meal-shaped — featuring Drinks,
// Protein, or Snacks on their own (as the first version did) made "Today's meal idea" read
// as nonsense, since a drink or a protein source alone isn't something you'd call a meal.
// Drinks (0) is instead paired in as a side, below, so the card still varies which of the
// two feels like more than a single flat category list.
const MEAL_CATEGORY_INDICES = [1, 2];
const DRINKS_CATEGORY_INDEX = 0;

// Chip/badge backgrounds are a fixed light tint (rather than the theme-flipping var(--card))
// with fixed dark text — var(--card) is warm neutral in both themes, which visually clashed
// against --blue-bg's cool navy in dark mode specifically, reading as a muddy mismatch even
// though the contrast math was fine. A light chip with dark text sits cleanly on top of the
// blue container regardless of how dark or light that container itself currently is.
const CHIP_BG = "rgba(255,255,255,0.55)";
const CHIP_TEXT = "#2d2a26";

// A permanent, non-dismissible fixture (unlike NotesNudge/PersonalizedTip) — the whole point
// is that "what to eat" should sit somewhere visible without having to remember to check it.
// The category is picked from the day-of-month, not per mount: a card that visibly changes
// its answer on every refresh reads as arbitrary noise rather than "today's idea," and with
// 2 meal categories to alternate between (unlike PersonalizedTip's old date-based bug, where
// a size-1 tip pool never changed) it still varies day to day.
export function MealSnapshot({ onOpenGuide }: Props) {
  const t = useLang();
  const today = useToday();
  const [itemsByCategory] = useLocalStorage<CategoryItems[]>("steady-meal-guide-items-v3", seedItems(t));

  const dayOfMonth = Number(today.split("-")[2]);
  const mainIndex = MEAL_CATEGORY_INDICES[dayOfMonth % MEAL_CATEGORY_INDICES.length];
  const category = t.mealGuide.categories[mainIndex];
  const mainItems = itemsByCategory[mainIndex]?.green ?? [];

  const drinkItems = itemsByCategory[DRINKS_CATEGORY_INDEX]?.green ?? [];
  const drink = drinkItems.length > 0 ? drinkItems[dayOfMonth % drinkItems.length] : null;

  if (!category || mainItems.length === 0) return null;

  return (
    <div className="rounded-2xl p-4 border" style={{ backgroundColor: "var(--blue-bg)", borderColor: "var(--blue-text)" }}>
      <div className="flex items-center gap-3 mb-2.5">
        <div
          className="rounded-full flex items-center justify-center flex-shrink-0"
          style={{ width: 40, height: 40, backgroundColor: CHIP_BG, fontSize: "1.3rem" }}
          aria-hidden="true"
        >
          {CATEGORY_EMOJIS[mainIndex] ?? "🍽️"}
        </div>
        <div className="flex-1 min-w-0">
          <p style={{ fontWeight: 800, color: "var(--blue-text)", fontSize: "1.02rem" }}>{t.overview.mealSnapshot.heading}</p>
          <p style={{ color: "var(--blue-text)", fontSize: "0.78rem", fontWeight: 600, opacity: 0.85 }}>{category.name}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 mb-2.5">
        {mainItems.map((item) => (
          <span
            key={item.id}
            className="rounded-full px-2.5 py-1"
            style={{ backgroundColor: CHIP_BG, color: CHIP_TEXT, fontSize: "0.8rem", fontWeight: 600 }}
          >
            {item.text}
          </span>
        ))}
        {drink && (
          <span
            className="rounded-full px-2.5 py-1"
            style={{ backgroundColor: CHIP_BG, color: CHIP_TEXT, fontSize: "0.8rem", fontWeight: 600 }}
          >
            🥤 {drink.text}
          </span>
        )}
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
