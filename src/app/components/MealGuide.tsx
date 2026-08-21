import { useEffect, useState } from "react";
import { Reorder } from "motion/react";
import { ChevronDown, ChevronUp, Check, Pencil, X, Plus } from "lucide-react";
import { useLang, type T } from "../i18n/LangContext";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { AnimatedCollapse } from "./AnimatedCollapse";
import { IconButton } from "./ui/IconButton";
import { ReorderRow } from "./ui/ReorderRow";

interface MealItem {
  id: number;
  text: string;
}

interface CategoryItems {
  green: MealItem[];
  yellow: MealItem[];
  red: MealItem[];
}

// Indexed to match t.mealGuide.categories, rather than keyed by category name, so it stays
// aligned with the (fixed-order, always-present) static categories even across a language
// switch — the category names themselves are read straight from translations and aren't
// stored here, only the editable green/yellow/red items are.
//
// Each item carries a real, persistent id assigned once here and never recomputed from
// array position afterward — Reorder.Group's onReorder fires continuously while dragging
// (not just on drop), so an id derived from the item's current index would change on every
// one of those in-flight updates, remounting the dragged row's DOM node mid-gesture and
// killing the drag. A stable id (same pattern as Emergency Stock's items) avoids that.
function seedItems(t: T): CategoryItems[] {
  let id = 0;
  return t.mealGuide.categories.map((c) => ({
    green: c.green.map((text) => ({ id: id++, text })),
    yellow: c.yellow.map((text) => ({ id: id++, text })),
    red: c.red.map((text) => ({ id: id++, text })),
  }));
}

function seedNextId(t: T): number {
  return t.mealGuide.categories.reduce((sum, c) => sum + c.green.length + c.yellow.length + c.red.length, 0);
}

/** A bullet list where every item can be added, edited in place, deleted, or reordered. */
function EditableList({
  items,
  onAdd,
  onEdit,
  onDelete,
  onReorder,
  addPlaceholder,
}: {
  items: MealItem[];
  onAdd: (text: string) => void;
  onEdit: (id: number, text: string) => void;
  onDelete: (id: number) => void;
  onReorder: (items: MealItem[]) => void;
  addPlaceholder: string;
}) {
  const t = useLang();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState("");
  const [newText, setNewText] = useState("");

  const startEdit = (item: MealItem) => {
    setEditingId(item.id);
    setDraft(item.text);
  };
  const saveEdit = () => {
    if (editingId === null) return;
    const trimmed = draft.trim();
    if (trimmed) onEdit(editingId, trimmed);
    setEditingId(null);
  };
  const submitAdd = () => {
    const trimmed = newText.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setNewText("");
  };

  return (
    <div className="space-y-1">
      <Reorder.Group axis="y" values={items} onReorder={onReorder} className="space-y-1">
        {items.map((item) => (
          <ReorderRow
            key={item.id}
            value={item}
            values={items}
            onReorder={onReorder}
            moveUpLabel={t.common.moveUp}
            moveDownLabel={t.common.moveDown}
            dragDisabled={editingId === item.id}
            className="flex items-center gap-1.5"
            handleSize={14}
          >
            {editingId === item.id ? (
              <>
                <input
                  autoFocus
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveEdit();
                    if (e.key === "Escape") setEditingId(null);
                  }}
                  className="flex-1 min-w-0 rounded-lg px-2 py-1 border border-primary bg-input-background text-foreground outline-none"
                  style={{ fontSize: "0.82rem" }}
                />
                <IconButton size="sm" tone="primary" onClick={saveEdit} aria-label={t.common.save}>
                  <Check size={13} />
                </IconButton>
              </>
            ) : (
              <>
                <span className="flex-1 min-w-0" style={{ fontSize: "0.82rem" }}>{item.text}</span>
                <IconButton size="sm" tone="default" onClick={() => startEdit(item)} aria-label={`${t.common.edit}: ${item.text}`}>
                  <Pencil size={12} />
                </IconButton>
                <IconButton size="sm" tone="destructive" onClick={() => onDelete(item.id)} aria-label={`${t.common.delete}: ${item.text}`}>
                  <X size={12} />
                </IconButton>
              </>
            )}
          </ReorderRow>
        ))}
      </Reorder.Group>
      <div className="flex items-center gap-1.5">
        <input
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submitAdd()}
          placeholder={addPlaceholder}
          className="flex-1 min-w-0 rounded-lg px-2 py-1 border border-border bg-input-background text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
          style={{ fontSize: "0.82rem" }}
        />
        <IconButton size="sm" tone="default" onClick={submitAdd} aria-label={t.common.add}>
          <Plus size={13} />
        </IconButton>
      </div>
    </div>
  );
}

function TrafficLightColumn({
  label,
  hint,
  items,
  bg,
  text,
  onAdd,
  onEdit,
  onDelete,
  onReorder,
  addPlaceholder,
}: {
  label: string;
  hint: string;
  items: MealItem[];
  bg: string;
  text: string;
  onAdd: (text: string) => void;
  onEdit: (id: number, text: string) => void;
  onDelete: (id: number) => void;
  onReorder: (items: MealItem[]) => void;
  addPlaceholder: string;
}) {
  return (
    <div className="rounded-xl p-3" style={{ backgroundColor: bg }}>
      <p style={{ fontWeight: 700, fontSize: "0.8rem", color: text }}>{label}</p>
      <p className="mb-2" style={{ fontSize: "0.72rem", color: text }}>{hint}</p>
      <EditableList items={items} onAdd={onAdd} onEdit={onEdit} onDelete={onDelete} onReorder={onReorder} addPlaceholder={addPlaceholder} />
    </div>
  );
}

export function MealGuide() {
  const t = useLang();
  const [itemsByCategory, setItemsByCategory] = useLocalStorage<CategoryItems[]>("steady-meal-guide-items-v3", seedItems(t));
  const [nextItemId, setNextItemId] = useLocalStorage<number>("steady-meal-guide-next-id-v3", seedNextId(t));
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  // Categories are fixed (one per t.mealGuide.categories entry) — a user can edit or delete
  // individual items within a category, but never the categories themselves, so an empty
  // array here can only mean this device's local copy never got seeded in the first place
  // (e.g. a stray sync push before this tab ever mounted MealGuide, an empty-string legacy
  // key, or a bad remote overwrite) rather than a deliberate empty state. Self-heal it.
  useEffect(() => {
    if (itemsByCategory.length === 0) {
      setItemsByCategory(seedItems(t));
      setNextItemId(seedNextId(t));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const editColumn = (index: number, key: "green" | "yellow" | "red") => ({
    onAdd: (text: string) => {
      setItemsByCategory((prev) =>
        prev.map((c, i) => (i === index ? { ...c, [key]: [...c[key], { id: nextItemId, text }] } : c))
      );
      setNextItemId((n) => n + 1);
    },
    onEdit: (id: number, text: string) =>
      setItemsByCategory((prev) =>
        prev.map((c, i) => (i === index ? { ...c, [key]: c[key].map((v) => (v.id === id ? { ...v, text } : v)) } : c))
      ),
    onDelete: (id: number) =>
      setItemsByCategory((prev) => prev.map((c, i) => (i === index ? { ...c, [key]: c[key].filter((v) => v.id !== id) } : c))),
    onReorder: (next: MealItem[]) => setItemsByCategory((prev) => prev.map((c, i) => (i === index ? { ...c, [key]: next } : c))),
  });

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
          {t.mealGuide.categories.map((category, index) => {
            const open = openCategory === category.name;
            const items = itemsByCategory[index];
            if (!items) return null;
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
                    <TrafficLightColumn label={t.mealGuide.green} hint={t.mealGuide.greenHint} items={items.green} bg="var(--green-bg)" text="var(--green-text)" addPlaceholder={t.mealGuide.addItemPlaceholder} {...editColumn(index, "green")} />
                    <TrafficLightColumn label={t.mealGuide.yellow} hint={t.mealGuide.yellowHint} items={items.yellow} bg="var(--yellow-bg)" text="var(--yellow-text)" addPlaceholder={t.mealGuide.addItemPlaceholder} {...editColumn(index, "yellow")} />
                    <TrafficLightColumn label={t.mealGuide.red} hint={t.mealGuide.redHint} items={items.red} bg="var(--orange-bg)" text="var(--orange-text)" addPlaceholder={t.mealGuide.addItemPlaceholder} {...editColumn(index, "red")} />
                  </div>
                </AnimatedCollapse>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
