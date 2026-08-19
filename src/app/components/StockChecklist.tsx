import { useState } from "react";
import { Reorder } from "motion/react";
import { Check, Pencil, X, Plus } from "lucide-react";
import { useLang, type T } from "../i18n/LangContext";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { IconButton } from "./ui/IconButton";
import { ReorderRow } from "./ui/ReorderRow";

interface StockItem {
  id: string;
  text: string;
  checked: boolean;
}

interface StockLocation {
  id: string;
  name: string;
  items: StockItem[];
}

function seedStock(t: T): StockLocation[] {
  return t.stockChecklist.locations.map((loc, li) => ({
    id: `loc-${li}`,
    name: loc.name,
    items: loc.items.map((text, ii) => ({ id: `loc-${li}-item-${ii}`, text, checked: false })),
  }));
}

function LocationCard({
  location,
  onUpdate,
  onDelete,
}: {
  location: StockLocation;
  onUpdate: (next: StockLocation) => void;
  onDelete: () => void;
}) {
  const t = useLang();
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(location.name);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [itemDraft, setItemDraft] = useState("");
  const [newItemText, setNewItemText] = useState("");
  const [nextItemId, setNextItemId] = useState(location.items.length);

  const doneCount = location.items.filter((i) => i.checked).length;

  const saveName = () => {
    const trimmed = nameDraft.trim();
    if (trimmed) onUpdate({ ...location, name: trimmed });
    setEditingName(false);
  };

  const toggleItem = (id: string) => {
    onUpdate({ ...location, items: location.items.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i)) });
  };

  const startEditItem = (item: StockItem) => {
    setEditingItemId(item.id);
    setItemDraft(item.text);
  };

  const saveItem = () => {
    if (editingItemId === null) return;
    const trimmed = itemDraft.trim();
    if (trimmed) onUpdate({ ...location, items: location.items.map((i) => (i.id === editingItemId ? { ...i, text: trimmed } : i)) });
    setEditingItemId(null);
  };

  const deleteItem = (id: string) => {
    onUpdate({ ...location, items: location.items.filter((i) => i.id !== id) });
  };

  const addItem = () => {
    const trimmed = newItemText.trim();
    if (!trimmed) return;
    const id = `${location.id}-new-${nextItemId}`;
    setNextItemId((n) => n + 1);
    onUpdate({ ...location, items: [...location.items, { id, text: trimmed, checked: false }] });
    setNewItemText("");
  };

  return (
    <div className="rounded-2xl border border-border overflow-hidden">
      <div className="flex items-center gap-2 p-3" style={{ backgroundColor: "var(--surface-1)" }}>
        {editingName ? (
          <>
            <input
              autoFocus
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveName();
                if (e.key === "Escape") { setEditingName(false); setNameDraft(location.name); }
              }}
              aria-label={t.stockChecklist.locationNameLabel}
              className="flex-1 min-w-0 rounded-lg px-2 py-1 border border-primary bg-input-background text-foreground outline-none"
              style={{ fontSize: "0.9rem", fontWeight: 700 }}
            />
            <IconButton size="sm" tone="primary" onClick={saveName} aria-label={t.common.save}>
              <Check size={14} />
            </IconButton>
          </>
        ) : (
          <>
            <span className="flex-1 min-w-0 text-foreground" style={{ fontWeight: 700, fontSize: "0.9rem" }}>{location.name}</span>
            <span
              className="rounded-full px-2.5 py-0.5 flex-shrink-0 text-foreground"
              style={{ backgroundColor: "rgba(128,128,128,0.25)", fontSize: "0.78rem", fontWeight: 700 }}
            >
              {doneCount}/{location.items.length}
            </span>
            <IconButton size="sm" tone="default" onClick={() => { setEditingName(true); setNameDraft(location.name); }} aria-label={`${t.common.edit}: ${location.name}`}>
              <Pencil size={12} />
            </IconButton>
            <IconButton size="sm" tone="destructive" onClick={onDelete} aria-label={`${t.stockChecklist.deleteLocationLabel}: ${location.name}`}>
              <X size={12} />
            </IconButton>
          </>
        )}
      </div>
      <div className="p-2 space-y-0.5 bg-card">
        <Reorder.Group
          axis="y"
          values={location.items}
          onReorder={(next) => onUpdate({ ...location, items: next })}
          className="space-y-0.5"
        >
          {location.items.map((item) => (
            <ReorderRow
              key={item.id}
              value={item}
              values={location.items}
              onReorder={(next) => onUpdate({ ...location, items: next })}
              moveUpLabel={t.common.moveUp}
              moveDownLabel={t.common.moveDown}
              dragDisabled={editingItemId === item.id}
              className="flex items-center gap-1"
              handleSize={14}
            >
              {editingItemId === item.id ? (
                <>
                  <input
                    autoFocus
                    value={itemDraft}
                    onChange={(e) => setItemDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveItem();
                      if (e.key === "Escape") setEditingItemId(null);
                    }}
                    className="flex-1 min-w-0 rounded-lg px-2 py-1 border border-primary bg-input-background text-foreground outline-none"
                    style={{ fontSize: "0.85rem" }}
                  />
                  <IconButton size="sm" tone="primary" onClick={saveItem} aria-label={t.common.save}>
                    <Check size={13} />
                  </IconButton>
                </>
              ) : (
                <>
                  <button
                    onClick={() => toggleItem(item.id)}
                    aria-pressed={item.checked}
                    className="flex-1 min-w-0 flex items-center gap-2.5 rounded-xl p-2 text-left hover:bg-muted"
                    style={{ backgroundColor: item.checked ? "var(--surface-2)" : "transparent", transition: "background-color 0.15s" }}
                  >
                    <span
                      className="flex-shrink-0 rounded-full border-2 flex items-center justify-center"
                      style={{
                        width: 20, height: 20,
                        borderColor: item.checked ? "var(--primary)" : "var(--muted-foreground)",
                        backgroundColor: item.checked ? "var(--primary)" : "transparent",
                      }}
                    >
                      {item.checked && <Check size={12} color="white" />}
                    </span>
                    <span
                      className="flex-1 min-w-0 text-foreground"
                      style={{ fontSize: "0.85rem", textDecoration: item.checked ? "line-through" : "none", opacity: item.checked ? 0.55 : 1 }}
                    >
                      {item.text}
                    </span>
                  </button>
                  <IconButton size="sm" tone="default" onClick={() => startEditItem(item)} aria-label={`${t.common.edit}: ${item.text}`}>
                    <Pencil size={12} />
                  </IconButton>
                  <IconButton size="sm" tone="destructive" onClick={() => deleteItem(item.id)} aria-label={`${t.common.delete}: ${item.text}`}>
                    <X size={12} />
                  </IconButton>
                </>
              )}
            </ReorderRow>
          ))}
        </Reorder.Group>
        <div className="flex items-center gap-1.5 p-1">
          <input
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addItem()}
            placeholder={t.stockChecklist.addItemPlaceholder}
            className="flex-1 min-w-0 rounded-lg px-2 py-1.5 border border-border bg-input-background text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
            style={{ fontSize: "0.85rem" }}
          />
          <IconButton size="sm" tone="default" onClick={addItem} aria-label={t.common.add}>
            <Plus size={14} />
          </IconButton>
        </div>
      </div>
    </div>
  );
}

export function StockChecklist() {
  const t = useLang();
  const [locations, setLocations] = useLocalStorage<StockLocation[]>("steady-stock-locations", seedStock(t));
  const [nextLocationId, setNextLocationId] = useState(locations.length);
  const [newLocationName, setNewLocationName] = useState("");

  const anyChecked = locations.some((loc) => loc.items.some((i) => i.checked));

  const uncheckAll = () => {
    setLocations((prev) => prev.map((loc) => ({ ...loc, items: loc.items.map((i) => ({ ...i, checked: false })) })));
  };

  const addLocation = () => {
    const trimmed = newLocationName.trim();
    if (!trimmed) return;
    const id = `loc-new-${nextLocationId}`;
    setNextLocationId((n) => n + 1);
    setLocations((prev) => [...prev, { id, name: trimmed, items: [] }]);
    setNewLocationName("");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="mb-1 text-foreground text-lg">{t.stockChecklist.heading}</h2>
          <p className="text-muted-foreground" style={{ fontSize: "0.95rem" }}>{t.stockChecklist.description}</p>
        </div>
        {anyChecked && (
          <button
            onClick={uncheckAll}
            className="flex-shrink-0 text-muted-foreground hover:text-foreground"
            style={{ fontSize: "0.8rem", fontWeight: 600 }}
          >
            {t.stockChecklist.resetLabel}
          </button>
        )}
      </div>

      <div className="space-y-3">
        <Reorder.Group axis="y" values={locations} onReorder={setLocations} className="space-y-3">
          {locations.map((location) => (
            <ReorderRow
              key={location.id}
              value={location}
              values={locations}
              onReorder={setLocations}
              moveUpLabel={t.common.moveUp}
              moveDownLabel={t.common.moveDown}
              className="flex items-start gap-1"
              handleSize={18}
            >
              <div className="flex-1 min-w-0">
                <LocationCard
                  location={location}
                  onUpdate={(next) => setLocations((prev) => prev.map((l) => (l.id === location.id ? next : l)))}
                  onDelete={() => setLocations((prev) => prev.filter((l) => l.id !== location.id))}
                />
              </div>
            </ReorderRow>
          ))}
        </Reorder.Group>
        <div className="flex items-center gap-1.5">
          <input
            value={newLocationName}
            onChange={(e) => setNewLocationName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addLocation()}
            placeholder={t.stockChecklist.addLocationPlaceholder}
            className="flex-1 min-w-0 rounded-lg px-3 py-2 border border-border bg-input-background text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
            style={{ fontSize: "0.85rem" }}
          />
          <button
            onClick={addLocation}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 border border-border text-muted-foreground hover:bg-muted flex-shrink-0"
            style={{ fontSize: "0.82rem", fontWeight: 600 }}
          >
            <Plus size={14} />
            {t.stockChecklist.addLocationButton}
          </button>
        </div>
      </div>
    </div>
  );
}
