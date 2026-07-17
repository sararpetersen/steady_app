import { useState } from "react";
import { useLang } from "../i18n/LangContext";
import { Timer, CalendarHeart, ChevronLeft, ChevronRight } from "lucide-react";
import { FocusTimer } from "./FocusTimer";
import { ImportantDates } from "./ImportantDates";

type MoreSection = "focus" | "dates";

export function MorePage() {
  const t = useLang();
  const [section, setSection] = useState<MoreSection | null>(null);

  if (section === "focus") return <BackHeader onBack={() => setSection(null)}><FocusTimer /></BackHeader>;
  if (section === "dates") return <BackHeader onBack={() => setSection(null)}><ImportantDates /></BackHeader>;

  const items: { key: MoreSection; label: string; description: string; icon: React.ReactNode }[] = [
    { key: "focus", label: t.focus.heading, description: t.focus.description, icon: <Timer size={22} /> },
    { key: "dates", label: t.dates.heading, description: t.dates.description, icon: <CalendarHeart size={22} /> },
  ];

  return (
    <div className="steady-card bg-card rounded-2xl p-5 border border-border">
      <h3 className="mb-1 text-foreground">{t.more.heading}</h3>
      <p className="text-muted-foreground mb-4" style={{ fontSize: "0.95rem" }}>
        {t.more.description}
      </p>
      <div className="space-y-2">
        {items.map((item) => (
          <button
            key={item.key}
            onClick={() => setSection(item.key)}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:opacity-90 text-left"
            style={{ backgroundColor: "var(--surface-1)" }}
          >
            <span className="flex-shrink-0" style={{ color: "var(--primary)" }} aria-hidden="true">{item.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-foreground truncate" style={{ fontWeight: 700 }}>{item.label}</p>
              <p className="text-muted-foreground truncate" style={{ fontSize: "0.82rem" }}>{item.description}</p>
            </div>
            <ChevronRight size={18} className="text-muted-foreground flex-shrink-0" aria-hidden="true" />
          </button>
        ))}
      </div>
    </div>
  );
}

function BackHeader({ onBack, children }: { onBack: () => void; children: React.ReactNode }) {
  const t = useLang();
  return (
    <div className="space-y-3">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-muted-foreground hover:text-primary"
        style={{ fontSize: "0.9rem", fontWeight: 600 }}
      >
        <ChevronLeft size={18} />
        {t.more.back}
      </button>
      {children}
    </div>
  );
}
