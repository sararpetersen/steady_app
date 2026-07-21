import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Sun, Sunset, MoonStar, Plus, X, CheckCircle2, Check } from "lucide-react";
import { Reorder } from "motion/react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useToday } from "../hooks/useToday";
import { useLang } from "../i18n/LangContext";
import { AnimatedCollapse } from "./AnimatedCollapse";
import { ReorderRow } from "./ui/ReorderRow";
import { IconButton } from "./ui/IconButton";

const SECTION_KEYS = ["morning", "afternoon", "late"] as const;
type SectionKey = typeof SECTION_KEYS[number];

const SECTION_ICONS: Record<SectionKey, React.ReactNode> = {
  morning: <Sun size={20} />,
  afternoon: <Sunset size={20} />,
  late: <MoonStar size={20} />,
};

const SECTION_COLOR_VARS: Record<SectionKey, string> = {
  morning: "var(--morning-bg)",
  afternoon: "var(--afternoon-bg)",
  late: "var(--late-bg)",
};

interface CustomItem {
  id: number;
  text: string;
}

type CustomMap = Record<SectionKey, CustomItem[]>;

const CUSTOM_NEXT_ID_START = 100;

function SectionPanel({
  sectionKey,
  doneIds,
  onToggle,
  customItems,
  onAddCustom,
  onEditCustom,
  onReorderCustom,
  onDeleteCustom,
}: {
  sectionKey: SectionKey;
  doneIds: number[];
  onToggle: (id: number) => void;
  customItems: CustomItem[];
  onAddCustom: (text: string) => void;
  onEditCustom: (id: number, text: string) => void;
  onReorderCustom: (items: CustomItem[]) => void;
  onDeleteCustom: (id: number) => void;
}) {
  const t = useLang();
  const section = t.routines.sections[sectionKey];
  const [open, setOpen] = useState(false);
  const [addingStep, setAddingStep] = useState(false);
  const [stepDraft, setStepDraft] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState("");

  const allIds = customItems.map((c) => c.id);
  const doneCount = allIds.filter((id) => doneIds.includes(id)).length;

  const submitStep = () => {
    const trimmed = stepDraft.trim();
    if (!trimmed) return;
    onAddCustom(trimmed);
    setStepDraft("");
    setAddingStep(false);
  };

  const startEditing = (item: CustomItem) => {
    setEditingId(item.id);
    setEditDraft(item.text);
  };

  const saveEdit = (id: number) => {
    const trimmed = editDraft.trim();
    if (!trimmed) return;
    onEditCustom(id, trimmed);
    setEditingId(null);
    setEditDraft("");
  };

  const renderItem = (item: CustomItem) => {
    const { id, text } = item;
    const done = doneIds.includes(id);
    return (
      <ReorderRow key={id} value={item} dragDisabled={editingId === id} className="flex items-center gap-2 group relative" handleSize={18}>
        {editingId === id ? (
          <div className="flex-1 flex items-center gap-3 rounded-xl p-3 bg-muted">
            <span
              className="flex-shrink-0 rounded-full border-2 flex items-center justify-center"
              style={{
                width: 24, height: 24,
                borderColor: done ? "var(--primary)" : "var(--muted-foreground)",
                backgroundColor: done ? "var(--primary)" : "transparent",
              }}
              aria-hidden="true"
            >
              {done && <Check size={13} color="white" />}
            </span>
            <input
              autoFocus
              aria-label={`${t.routines.editStep}: ${text}`}
              value={editDraft}
              onChange={(event) => setEditDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") saveEdit(id);
                if (event.key === "Escape") setEditingId(null);
              }}
              className="flex-1 min-w-0 rounded-lg px-2 py-1 border border-primary bg-input-background text-foreground outline-none"
            />
          </div>
        ) : (
          <button
            onClick={() => onToggle(id)}
            aria-pressed={done}
            className="flex-1 flex items-center gap-3 rounded-xl p-3 text-left hover:bg-muted"
            style={{ backgroundColor: done ? "var(--surface-2)" : "transparent", transition: "background-color 0.15s" }}
          >
            <span
              className="flex-shrink-0 rounded-full border-2 flex items-center justify-center"
              style={{
                width: 24, height: 24,
                borderColor: done ? "var(--primary)" : "var(--muted-foreground)",
                backgroundColor: done ? "var(--primary)" : "transparent",
              }}
            >
              {done && <Check size={13} color="white" />}
            </span>
            <span className="text-foreground" style={{ textDecoration: done ? "line-through" : "none", opacity: done ? 0.45 : 1 }}>
              {text}
            </span>
          </button>
        )}
        <div className="flex items-center gap-0.5 flex-shrink-0">
          <IconButton
            size="md"
            tone="primary"
            onClick={() => editingId === id ? saveEdit(id) : startEditing(item)}
            aria-label={`${editingId === id ? t.routines.saveStep : t.routines.editStep}: ${text}`}
          >
            {editingId === id ? <Check size={15} /> : <span style={{ fontSize: "0.75rem", fontWeight: 700 }}>{t.routines.editLabel}</span>}
          </IconButton>
          <IconButton
            size="md"
            tone="destructive"
            onClick={() => onDeleteCustom(id)}
            aria-label={`${t.routines.deleteStep}: ${text}`}
          >
            <X size={14} />
          </IconButton>
        </div>
      </ReorderRow>
    );
  };

  return (
    <div className="rounded-2xl border border-border overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2 sm:gap-3 p-3 sm:p-4 text-left hover:opacity-90"
        style={{ backgroundColor: SECTION_COLOR_VARS[sectionKey], transition: "opacity 0.15s" }}
      >
        <span className="text-foreground flex-shrink-0">{SECTION_ICONS[sectionKey]}</span>
        <div className="flex-1 min-w-0">
          <p style={{ fontWeight: 700, fontSize: "1rem" }} className="text-foreground truncate">{section.label}</p>
          <p style={{ fontSize: "0.8rem" }} className="text-muted-foreground truncate">{section.time}</p>
        </div>
        {allIds.length > 0 && doneCount === allIds.length ? (
          <CheckCircle2
            size={22}
            className="mr-2 flex-shrink-0"
            style={{ color: "var(--primary)" }}
          />
        ) : (
          <span
            className="rounded-full px-2.5 py-0.5 mr-2 text-foreground"
            style={{ backgroundColor: "rgba(128,128,128,0.25)", fontSize: "0.8rem", fontWeight: 700 }}
          >
            {doneCount}/{allIds.length}
          </span>
        )}
        {open ? <ChevronUp size={18} className="text-muted-foreground" /> : <ChevronDown size={18} className="text-muted-foreground" />}
      </button>

      <AnimatedCollapse open={open}>
        <div className="p-4 space-y-1 bg-card">
          {/* Custom items */}
          {customItems.length === 0 && !addingStep && (
            <p className="text-muted-foreground py-2 pl-1" style={{ fontSize: "0.88rem" }}>
              {t.routines.noSteps}
            </p>
          )}
          <Reorder.Group axis="y" values={customItems} onReorder={onReorderCustom} className="space-y-1">
            {customItems.map(renderItem)}
          </Reorder.Group>

          {/* Add step */}
          {addingStep ? (
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={stepDraft}
                onChange={(e) => setStepDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitStep()}
                placeholder={t.routines.addStepPlaceholder}
                autoFocus
                className="flex-1 rounded-xl px-3 py-2.5 border border-border bg-input-background text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
                style={{ fontSize: "0.9rem", transition: "border-color 0.15s" }}
              />
              <button
                onClick={submitStep}
                className="rounded-xl px-4 py-2.5 bg-primary text-primary-foreground hover:opacity-90"
                style={{ fontWeight: 700, fontSize: "0.9rem", transition: "opacity 0.15s" }}
              >
                {t.routines.addStepButton}
              </button>
              <button
                onClick={() => { setAddingStep(false); setStepDraft(""); }}
                className="rounded-xl px-3 py-2.5 border border-border text-muted-foreground hover:bg-muted"
                style={{ transition: "background-color 0.15s" }}
                aria-label="Cancel"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAddingStep(true)}
              className="flex items-center gap-2 text-muted-foreground hover:text-primary mt-1 pl-1"
              style={{ fontSize: "0.88rem", fontWeight: 600, transition: "color 0.15s" }}
            >
              <Plus size={15} />
              {t.routines.addStepPlaceholder.replace("…", "")}
            </button>
          )}
        </div>
      </AnimatedCollapse>
    </div>
  );
}

export function Routines() {
  const t = useLang();
  const [doneIds, setDoneIds] = useLocalStorage<number[]>("steady-routines-done", []);
  const [doneDate, setDoneDate] = useLocalStorage<string | null>("steady-routines-done-date", null);
  const [custom, setCustom] = useLocalStorage<CustomMap>("steady-routines-custom", {
    morning: [], afternoon: [], late: [],
  });
  const [nextId, setNextId] = useLocalStorage<number>("steady-routines-nextid", CUSTOM_NEXT_ID_START);
  const today = useToday();

  // Reset checked-off steps when the day rolls over, so routines start fresh each day.
  useEffect(() => {
    if (doneDate !== today) {
      setDoneIds([]);
      setDoneDate(today);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [today]);

  const toggleDone = (id: number) => {
    setDoneIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const addCustom = (section: SectionKey, text: string) => {
    const id = nextId;
    setNextId((n) => n + 1);
    setCustom((prev) => ({
      ...prev,
      [section]: [...(prev[section] ?? []), { id, text }],
    }));
  };

  const deleteCustom = (section: SectionKey, id: number) => {
    setCustom((prev) => ({
      ...prev,
      [section]: (prev[section] ?? []).filter((item) => item.id !== id),
    }));
    setDoneIds((prev) => prev.filter((x) => x !== id));
  };

  const editCustom = (section: SectionKey, id: number, text: string) => {
    setCustom((prev) => ({
      ...prev,
      [section]: (prev[section] ?? []).map((item) => item.id === id ? { ...item, text } : item),
    }));
  };

  const reorderCustom = (section: SectionKey, items: CustomItem[]) => {
    setCustom((prev) => ({ ...prev, [section]: items }));
  };

  return (
    <div className="steady-card bg-card rounded-2xl p-5 border border-border">
      <h3 className="mb-1 text-foreground">{t.routines.heading}</h3>
      <p className="text-muted-foreground mb-4" style={{ fontSize: "0.95rem" }}>{t.routines.description}</p>
      <div className="space-y-3">
        {SECTION_KEYS.map((key) => (
          <SectionPanel
            key={key}
            sectionKey={key}
            doneIds={doneIds}
            onToggle={toggleDone}
            customItems={custom[key] ?? []}
            onAddCustom={(text) => addCustom(key, text)}
            onEditCustom={(id, text) => editCustom(key, id, text)}
            onReorderCustom={(items) => reorderCustom(key, items)}
            onDeleteCustom={(id) => deleteCustom(key, id)}
          />
        ))}
      </div>
    </div>
  );
}
