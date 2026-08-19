import { useState } from "react";
import { Reorder } from "motion/react";
import { ChevronDown, ChevronUp, Check, Pencil, X, Plus } from "lucide-react";
import { useLang, type T } from "../i18n/LangContext";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { AnimatedCollapse } from "./AnimatedCollapse";
import { IconButton } from "./ui/IconButton";
import { ReorderRow } from "./ui/ReorderRow";

interface CategoryItems {
  green: string[];
  yellow: string[];
  red: string[];
}

// Indexed to match t.mealGuide.categories, rather than keyed by category name, so it stays
// aligned with the (fixed-order, always-present) static categories even across a language
// switch — the category names themselves are read straight from translations and aren't
// stored here, only the editable green/yellow/red items are.
function seedItems(t: T): CategoryItems[] {
  return t.mealGuide.categories.map((c) => ({ green: [...c.green], yellow: [...c.yellow], red: [...c.red] }));
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
  items: string[];
  onAdd: (text: string) => void;
  onEdit: (index: number, text: string) => void;
  onDelete: (index: number) => void;
  onReorder: (items: string[]) => void;
  addPlaceholder: string;
}) {
  const t = useLang();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState("");
  const [newText, setNewText] = useState("");

  // Wrapping each string with its current index gives ReorderRow/Reorder.Group a stable
  // object identity to drag by — these are only used for the duration of one render (and
  // one continuous drag gesture), then translated back to plain strings via reorderRows.
  const rows = items.map((text, i) => ({ id: i, text }));
  const reorderRows = (next: { id: number; text: string }[]) => onReorder(next.map((r) => r.text));

  const startEdit = (i: number) => {
    setEditingIndex(i);
    setDraft(items[i]);
  };
  const saveEdit = () => {
    if (editingIndex === null) return;
    const trimmed = draft.trim();
    if (trimmed) onEdit(editingIndex, trimmed);
    setEditingIndex(null);
  };
  const submitAdd = () => {
    const trimmed = newText.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setNewText("");
  };

  return (
    <div className="space-y-1">
      <Reorder.Group axis="y" values={rows} onReorder={reorderRows} className="space-y-1">
        {rows.map((row) => (
          <ReorderRow
            key={row.id}
            value={row}
            values={rows}
            onReorder={reorderRows}
            moveUpLabel={t.common.moveUp}
            moveDownLabel={t.common.moveDown}
            dragDisabled={editingIndex === row.id}
            className="flex items-center gap-1.5"
            handleSize={14}
          >
            {editingIndex === row.id ? (
              <>
                <input
                  autoFocus
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveEdit();
                    if (e.key === "Escape") setEditingIndex(null);
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
                <span className="flex-1 min-w-0" style={{ fontSize: "0.82rem" }}>{row.text}</span>
                <IconButton size="sm" tone="default" onClick={() => startEdit(row.id)} aria-label={`${t.common.edit}: ${row.text}`}>
                  <Pencil size={12} />
                </IconButton>
                <IconButton size="sm" tone="destructive" onClick={() => onDelete(row.id)} aria-label={`${t.common.delete}: ${row.text}`}>
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
  items: string[];
  bg: string;
  text: string;
  onAdd: (text: string) => void;
  onEdit: (index: number, text: string) => void;
  onDelete: (index: number) => void;
  onReorder: (items: string[]) => void;
  addPlaceholder: string;
}) {
  return (
    <div className="rounded-xl p-3" style={{ backgroundColor: bg }}>
      <p style={{ fontWeight: 700, fontSize: "0.8rem", color: text }}>{label}</p>
      <p className="mb-2" style={{ fontSize: "0.72rem", color: text, opacity: 0.85 }}>{hint}</p>
      <EditableList items={items} onAdd={onAdd} onEdit={onEdit} onDelete={onDelete} onReorder={onReorder} addPlaceholder={addPlaceholder} />
    </div>
  );
}

export function MealGuide() {
  const t = useLang();
  const [itemsByCategory, setItemsByCategory] = useLocalStorage<CategoryItems[]>("steady-meal-guide-items", seedItems(t));
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const editColumn = (index: number, key: "green" | "yellow" | "red") => ({
    onAdd: (text: string) =>
      setItemsByCategory((prev) => prev.map((c, i) => (i === index ? { ...c, [key]: [...c[key], text] } : c))),
    onEdit: (itemIndex: number, text: string) =>
      setItemsByCategory((prev) =>
        prev.map((c, i) => (i === index ? { ...c, [key]: c[key].map((v, idx) => (idx === itemIndex ? text : v)) } : c))
      ),
    onDelete: (itemIndex: number) =>
      setItemsByCategory((prev) => prev.map((c, i) => (i === index ? { ...c, [key]: c[key].filter((_, idx) => idx !== itemIndex) } : c))),
    onReorder: (next: string[]) => setItemsByCategory((prev) => prev.map((c, i) => (i === index ? { ...c, [key]: next } : c))),
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
