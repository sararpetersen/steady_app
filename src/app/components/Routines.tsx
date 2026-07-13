import { useState } from "react";
import { ChevronDown, ChevronUp, Sun, Coffee, Sunset, Moon, MoonStar, Plus, X, CheckCircle2 } from "lucide-react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useLang } from "../i18n/LangContext";

const SECTION_KEYS = ["morning", "noon", "afternoon", "evening", "late"] as const;
type SectionKey = typeof SECTION_KEYS[number];

const SECTION_ICONS: Record<SectionKey, React.ReactNode> = {
  morning: <Sun size={20} />,
  noon: <Coffee size={20} />,
  afternoon: <Sunset size={20} />,
  evening: <Moon size={20} />,
  late: <MoonStar size={20} />,
};

const SECTION_COLOR_VARS: Record<SectionKey, string> = {
  morning: "var(--morning-bg)",
  noon: "var(--noon-bg)",
  afternoon: "var(--afternoon-bg)",
  evening: "var(--evening-bg)",
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
  onDeleteCustom,
}: {
  sectionKey: SectionKey;
  doneIds: number[];
  onToggle: (id: number) => void;
  customItems: CustomItem[];
  onAddCustom: (text: string) => void;
  onDeleteCustom: (id: number) => void;
}) {
  const t = useLang();
  const section = t.routines.sections[sectionKey];
  const [open, setOpen] = useState(false);
  const [addingStep, setAddingStep] = useState(false);
  const [stepDraft, setStepDraft] = useState("");

  const allIds = customItems.map((c) => c.id);
  const doneCount = allIds.filter((id) => doneIds.includes(id)).length;

  const submitStep = () => {
    const trimmed = stepDraft.trim();
    if (!trimmed) return;
    onAddCustom(trimmed);
    setStepDraft("");
    setAddingStep(false);
  };

  const renderItem = (id: number, text: string, isCustom: boolean) => {
    const done = doneIds.includes(id);
    return (
      <div key={id} className="flex items-center gap-2 group">
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
            {done && (
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path d="M2.5 7L5.5 10L11.5 4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </span>
          <span className="text-foreground" style={{ textDecoration: done ? "line-through" : "none", opacity: done ? 0.45 : 1 }}>
            {text}
          </span>
        </button>
        {isCustom && (
          <button
            onClick={() => onDeleteCustom(id)}
            className="flex-shrink-0 p-2.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-muted sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
            style={{ transition: "all 0.15s" }}
            aria-label={t.routines.deleteStep}
          >
            <X size={14} />
          </button>
        )}
      </div>
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

      {open && (
        <div className="p-4 space-y-1 bg-card">
          {/* Custom items */}
          {customItems.length === 0 && !addingStep && (
            <p className="text-muted-foreground py-2 pl-1" style={{ fontSize: "0.88rem" }}>
              {t.routines.noSteps}
            </p>
          )}
          {customItems.map((item) => renderItem(item.id, item.text, true))}

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
      )}
    </div>
  );
}

export function Routines() {
  const t = useLang();
  const [doneIds, setDoneIds] = useLocalStorage<number[]>("steady-routines-done", []);
  const [custom, setCustom] = useLocalStorage<CustomMap>("steady-routines-custom", {
    morning: [], noon: [], afternoon: [], evening: [], late: [],
  });
  const [nextId, setNextId] = useLocalStorage<number>("steady-routines-nextid", CUSTOM_NEXT_ID_START);

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
            onDeleteCustom={(id) => deleteCustom(key, id)}
          />
        ))}
      </div>
    </div>
  );
}
