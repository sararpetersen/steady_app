import { useState } from "react";
import { Reorder } from "motion/react";
import { Pencil, Trash2, Settings, Moon, Sun } from "lucide-react";
import { ReorderRow } from "./ReorderRow";
import { IconButton } from "./IconButton";
import { EmojiPicker } from "./EmojiPicker";
import { AnimatedCollapse } from "../AnimatedCollapse";

// Dev-only route (see main.tsx: only mounted when import.meta.env.DEV and
// the URL is /dev/gallery) — never reachable in a production build.

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 space-y-4">
      <div>
        <h2 className="text-foreground" style={{ fontSize: "1.1rem", fontWeight: 800 }}>{title}</h2>
        {description && <p className="text-muted-foreground" style={{ fontSize: "0.85rem" }}>{description}</p>}
      </div>
      {children}
    </section>
  );
}

function Swatch({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2 p-3 rounded-xl" style={{ backgroundColor: "var(--surface-1)" }}>
        {children}
      </div>
      <span className="text-muted-foreground" style={{ fontSize: "0.72rem" }}>{label}</span>
    </div>
  );
}

export function ComponentGallery() {
  const [items, setItems] = useState(["Morning walk", "Drink water", "Stretch"]);
  const [emoji, setEmoji] = useState("🌱");
  const [collapseOpen, setCollapseOpen] = useState(true);
  const [active, setActive] = useState(false);

  return (
    <div className="min-h-screen bg-background px-6 py-10" style={{ fontFamily: "var(--app-font-body, 'Nunito Sans', sans-serif)" }}>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-foreground" style={{ fontSize: "1.6rem", fontWeight: 800 }}>Steady component gallery</h1>
          <p className="text-muted-foreground" style={{ fontSize: "0.9rem" }}>
            Dev-only view of shared ui/ primitives. Not part of the shipped app.
          </p>
        </div>

        <Section title="ReorderRow" description="Drag-to-reorder wrapper used by Habits, Tasks, Routines, and Important Dates.">
          <Reorder.Group axis="y" values={items} onReorder={setItems} className="space-y-2">
            {items.map((item) => (
              <ReorderRow key={item} value={item} className="flex items-center gap-1 rounded-xl" style={{ backgroundColor: "var(--surface-1)" }}>
                <span className="flex-1 p-3 text-foreground">{item}</span>
              </ReorderRow>
            ))}
          </Reorder.Group>
        </Section>

        <Section title="IconButton" description="Every size × tone combination, plus the bordered/active round variant used for nav-level toggles.">
          <div className="flex flex-wrap gap-4">
            <Swatch label="sm / destructive"><IconButton size="sm" tone="destructive" aria-label="Delete"><Trash2 size={15} /></IconButton></Swatch>
            <Swatch label="md / primary"><IconButton size="md" tone="primary" aria-label="Edit"><Pencil size={15} /></IconButton></Swatch>
            <Swatch label="pill / primary"><IconButton size="pill" tone="primary" style={{ fontSize: "0.78rem", fontWeight: 700 }}>Edit</IconButton></Swatch>
            <Swatch label="lg / bordered">
              <IconButton size="lg" bordered active={active} onClick={() => setActive((a) => !a)} aria-label="Toggle theme" aria-pressed={active}>
                {active ? <Sun size={18} /> : <Moon size={18} />}
              </IconButton>
            </Swatch>
            <Swatch label="lg / bordered / active"><IconButton size="lg" bordered active aria-label="Settings"><Settings size={18} /></IconButton></Swatch>
          </div>
        </Section>

        <Section title="EmojiPicker" description="Shared avatar list, in both layouts used across Onboarding and Profile.">
          <div className="space-y-4">
            <div>
              <p className="text-muted-foreground mb-2" style={{ fontSize: "0.8rem", fontWeight: 700 }}>layout=&quot;grid&quot; (Onboarding)</p>
              <EmojiPicker value={emoji} onChange={setEmoji} layout="grid" groupLabel="Pick your avatar" />
            </div>
            <div>
              <p className="text-muted-foreground mb-2" style={{ fontSize: "0.8rem", fontWeight: 700 }}>layout=&quot;wrap&quot; (Profile)</p>
              <EmojiPicker value={emoji} onChange={setEmoji} layout="wrap" groupLabel="Emoji avatar" />
            </div>
          </div>
        </Section>

        <Section title="AnimatedCollapse" description="Shared open/close transition used by note editors, settings panels, and routine sections.">
          <IconButton size="pill" tone="primary" onClick={() => setCollapseOpen((o) => !o)} style={{ fontSize: "0.85rem", fontWeight: 700 }}>
            {collapseOpen ? "Collapse" : "Expand"}
          </IconButton>
          <AnimatedCollapse open={collapseOpen}>
            <div className="mt-2 p-4 rounded-xl border border-dashed border-border text-foreground">
              This panel animates open and closed.
            </div>
          </AnimatedCollapse>
        </Section>
      </div>
    </div>
  );
}
