import { Check } from "lucide-react";
import { useLang } from "../i18n/LangContext";
import { useLocalStorage } from "../hooks/useLocalStorage";

export function StockChecklist() {
  const t = useLang();
  const [checked, setChecked] = useLocalStorage<string[]>("steady-stock-checklist", []);

  const toggle = (id: string) => {
    setChecked((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="mb-1 text-foreground text-lg">{t.stockChecklist.heading}</h2>
          <p className="text-muted-foreground" style={{ fontSize: "0.95rem" }}>{t.stockChecklist.description}</p>
        </div>
        {checked.length > 0 && (
          <button
            onClick={() => setChecked([])}
            className="flex-shrink-0 text-muted-foreground hover:text-foreground"
            style={{ fontSize: "0.8rem", fontWeight: 600 }}
          >
            {t.stockChecklist.resetLabel}
          </button>
        )}
      </div>

      <div className="space-y-3">
        {t.stockChecklist.locations.map((location) => {
          const itemIds = location.items.map((_, i) => `${location.name}-${i}`);
          const doneCount = itemIds.filter((id) => checked.includes(id)).length;
          return (
            <div key={location.name} className="rounded-2xl border border-border overflow-hidden">
              <div className="flex items-center justify-between p-3" style={{ backgroundColor: "var(--surface-1)" }}>
                <span className="text-foreground" style={{ fontWeight: 700, fontSize: "0.9rem" }}>{location.name}</span>
                <span
                  className="rounded-full px-2.5 py-0.5 flex-shrink-0 text-foreground"
                  style={{ backgroundColor: "rgba(128,128,128,0.25)", fontSize: "0.78rem", fontWeight: 700 }}
                >
                  {doneCount}/{itemIds.length}
                </span>
              </div>
              <div className="p-2 space-y-0.5 bg-card">
                {location.items.map((item, i) => {
                  const id = itemIds[i];
                  const done = checked.includes(id);
                  return (
                    <button
                      key={id}
                      onClick={() => toggle(id)}
                      aria-pressed={done}
                      className="w-full flex items-center gap-2.5 rounded-xl p-2 text-left hover:bg-muted"
                      style={{ backgroundColor: done ? "var(--surface-2)" : "transparent", transition: "background-color 0.15s" }}
                    >
                      <span
                        className="flex-shrink-0 rounded-full border-2 flex items-center justify-center"
                        style={{
                          width: 20, height: 20,
                          borderColor: done ? "var(--primary)" : "var(--muted-foreground)",
                          backgroundColor: done ? "var(--primary)" : "transparent",
                        }}
                      >
                        {done && <Check size={12} color="white" />}
                      </span>
                      <span
                        className="flex-1 min-w-0 text-foreground"
                        style={{ fontSize: "0.85rem", textDecoration: done ? "line-through" : "none", opacity: done ? 0.55 : 1 }}
                      >
                        {item}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
