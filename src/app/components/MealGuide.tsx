import { useState } from "react";
import { Reorder } from "motion/react";
import { ChevronDown, ChevronUp, Check, Pencil, X, Plus } from "lucide-react";
import { useLang, type T } from "../i18n/LangContext";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { AnimatedCollapse } from "./AnimatedCollapse";
import { IconButton } from "./ui/IconButton";
import { ReorderRow } from "./ui/ReorderRow";

interface MealCategory {
  id: string;
  name: string;
  green: string[];
  yellow: string[];
  red: string[];
}

interface MealGuideData {
  tips: string[];
  categories: MealCategory[];
  hardDayTips: string[];
}

function seedMealGuide(t: T): MealGuideData {
  return {
    tips: [...t.mealGuide.tips],
    categories: t.mealGuide.categories.map((c, i) => ({
      id: `cat-${i}`,
      name: c.name,
      green: [...c.green],
      yellow: [...c.yellow],
      red: [...c.red],
    })),
    hardDayTips: [...t.mealGuide.hardDayTips],
  };
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

function CategoryCard({
  category,
  open,
  onToggleOpen,
  onUpdate,
  onDelete,
}: {
  category: MealCategory;
  open: boolean;
  onToggleOpen: () => void;
  onUpdate: (next: MealCategory) => void;
  onDelete: () => void;
}) {
  const t = useLang();
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(category.name);

  const saveName = () => {
    const trimmed = nameDraft.trim();
    if (trimmed) onUpdate({ ...category, name: trimmed });
    setEditingName(false);
  };

  const editColumn = (key: "green" | "yellow" | "red") => ({
    onAdd: (text: string) => onUpdate({ ...category, [key]: [...category[key], text] }),
    onEdit: (i: number, text: string) => onUpdate({ ...category, [key]: category[key].map((v, idx) => (idx === i ? text : v)) }),
    onDelete: (i: number) => onUpdate({ ...category, [key]: category[key].filter((_, idx) => idx !== i) }),
    onReorder: (next: string[]) => onUpdate({ ...category, [key]: next }),
  });

  return (
    <div className="rounded-2xl border border-border overflow-hidden">
      <div className="w-full flex items-center gap-2 p-3" style={{ backgroundColor: "var(--surface-1)" }}>
        {editingName ? (
          <>
            <input
              autoFocus
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveName();
                if (e.key === "Escape") { setEditingName(false); setNameDraft(category.name); }
              }}
              aria-label={t.mealGuide.categoryNameLabel}
              className="flex-1 min-w-0 rounded-lg px-2 py-1 border border-primary bg-input-background text-foreground outline-none"
              style={{ fontSize: "0.9rem", fontWeight: 700 }}
            />
            <IconButton size="sm" tone="primary" onClick={saveName} aria-label={t.common.save}>
              <Check size={14} />
            </IconButton>
          </>
        ) : (
          <button onClick={onToggleOpen} className="flex-1 flex items-center justify-between text-left" aria-expanded={open}>
            <span className="text-foreground" style={{ fontWeight: 700, fontSize: "0.9rem" }}>{category.name}</span>
            {open ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
          </button>
        )}
        {!editingName && (
          <>
            <IconButton size="sm" tone="default" onClick={() => { setEditingName(true); setNameDraft(category.name); }} aria-label={`${t.common.edit}: ${category.name}`}>
              <Pencil size={12} />
            </IconButton>
            <IconButton size="sm" tone="destructive" onClick={onDelete} aria-label={`${t.mealGuide.deleteCategoryLabel}: ${category.name}`}>
              <X size={12} />
            </IconButton>
          </>
        )}
      </div>
      <AnimatedCollapse open={open}>
        <div className="p-3 space-y-2 bg-card">
          <TrafficLightColumn label={t.mealGuide.green} hint={t.mealGuide.greenHint} items={category.green} bg="var(--green-bg)" text="var(--green-text)" addPlaceholder={t.mealGuide.addItemPlaceholder} {...editColumn("green")} />
          <TrafficLightColumn label={t.mealGuide.yellow} hint={t.mealGuide.yellowHint} items={category.yellow} bg="var(--yellow-bg)" text="var(--yellow-text)" addPlaceholder={t.mealGuide.addItemPlaceholder} {...editColumn("yellow")} />
          <TrafficLightColumn label={t.mealGuide.red} hint={t.mealGuide.redHint} items={category.red} bg="var(--orange-bg)" text="var(--orange-text)" addPlaceholder={t.mealGuide.addItemPlaceholder} {...editColumn("red")} />
        </div>
      </AnimatedCollapse>
    </div>
  );
}

export function MealGuide() {
  const t = useLang();
  const [data, setData] = useLocalStorage<MealGuideData>("steady-meal-guide", seedMealGuide(t));
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [nextCategoryId, setNextCategoryId] = useState(data.categories.length);
  const [newCategoryName, setNewCategoryName] = useState("");

  const listEditors = (key: "tips" | "hardDayTips") => ({
    onAdd: (text: string) => setData((prev) => ({ ...prev, [key]: [...prev[key], text] })),
    onEdit: (i: number, text: string) => setData((prev) => ({ ...prev, [key]: prev[key].map((v, idx) => (idx === i ? text : v)) })),
    onDelete: (i: number) => setData((prev) => ({ ...prev, [key]: prev[key].filter((_, idx) => idx !== i) })),
    onReorder: (next: string[]) => setData((prev) => ({ ...prev, [key]: next })),
  });

  const addCategory = () => {
    const trimmed = newCategoryName.trim();
    if (!trimmed) return;
    const id = `cat-new-${nextCategoryId}`;
    setNextCategoryId((n) => n + 1);
    setData((prev) => ({ ...prev, categories: [...prev.categories, { id, name: trimmed, green: [], yellow: [], red: [] }] }));
    setNewCategoryName("");
    setOpenCategory(id);
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="mb-1 text-foreground text-lg">{t.mealGuide.heading}</h2>
        <p className="text-muted-foreground" style={{ fontSize: "0.95rem" }}>{t.mealGuide.description}</p>
      </div>

      <div className="rounded-xl p-3 border border-border">
        <p className="mb-1.5 text-foreground" style={{ fontWeight: 700, fontSize: "0.85rem" }}>{t.mealGuide.tipsHeading}</p>
        <EditableList items={data.tips} addPlaceholder={t.mealGuide.addItemPlaceholder} {...listEditors("tips")} />
      </div>

      <div>
        <p className="mb-2 text-foreground" style={{ fontWeight: 700, fontSize: "0.85rem" }}>{t.mealGuide.trafficLightHeading}</p>
        <div className="space-y-2">
          {data.categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              open={openCategory === category.id}
              onToggleOpen={() => setOpenCategory(openCategory === category.id ? null : category.id)}
              onUpdate={(next) => setData((prev) => ({ ...prev, categories: prev.categories.map((c) => (c.id === category.id ? next : c)) }))}
              onDelete={() => setData((prev) => ({ ...prev, categories: prev.categories.filter((c) => c.id !== category.id) }))}
            />
          ))}
          <div className="flex items-center gap-1.5">
            <input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCategory()}
              placeholder={t.mealGuide.addCategoryPlaceholder}
              className="flex-1 min-w-0 rounded-lg px-3 py-2 border border-border bg-input-background text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
              style={{ fontSize: "0.85rem" }}
            />
            <button
              onClick={addCategory}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 border border-border text-muted-foreground hover:bg-muted flex-shrink-0"
              style={{ fontSize: "0.82rem", fontWeight: 600 }}
            >
              <Plus size={14} />
              {t.mealGuide.addCategoryButton}
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-xl p-3 border border-border">
        <p className="mb-1.5 text-foreground" style={{ fontWeight: 700, fontSize: "0.85rem" }}>{t.mealGuide.hardDayHeading}</p>
        <EditableList items={data.hardDayTips} addPlaceholder={t.mealGuide.addItemPlaceholder} {...listEditors("hardDayTips")} />
      </div>
    </div>
  );
}
