import { useState, useRef } from "react";
import { Save, Camera, X } from "lucide-react";
import { useLang } from "../i18n/LangContext";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { MoodEntry } from "./MoodCheck";
import { type ProfileData } from "./profileTypes";

const avatarEmojis = ["🌱", "🌻", "🌊", "🍂", "⭐", "🌙", "🦋", "🐢", "🌈", "🎨", "🍵", "🐾"];

async function resizeImageToBase64(file: File, maxPx = 240): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(maxPx / img.width, maxPx / img.height, 1);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.src = e.target!.result as string;
    };
    reader.readAsDataURL(file);
  });
}

interface ProfileProps {
  profile: ProfileData;
  onChange: (p: ProfileData) => void;
  photo: string | null;
  onPhotoChange: (p: string | null) => void;
}

// Generate last 7 days in order (oldest → newest)
function last7Days() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });
}

export function Profile({ profile, onChange, photo, onPhotoChange }: ProfileProps) {
  const t = useLang();
  const p = t.profile;
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [moodHistory] = useLocalStorage<MoodEntry[]>("steady-mood-history", []);

  const update = (patch: Partial<ProfileData>) => onChange({ ...profile, ...patch });

  const toggleList = (field: "sensory" | "support" | "strengths", key: string) => {
    const prev = profile[field];
    const isAdding = !prev.includes(key);
    const newList = isAdding ? [...prev, key] : prev.filter((k) => k !== key);
    const patch: Partial<ProfileData> = { [field]: newList };
    if (field === "sensory" && key === "Light-sensitive" && isAdding) {
      patch.a11y = { ...profile.a11y, darkMode: true };
    }
    update(patch);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onPhotoChange(await resizeImageToBase64(file));
    e.target.value = "";
  };

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  const days = last7Days();
  const moods = t.mood.options;

  return (
    <div className="space-y-5">
      {/* Identity card */}
      <div className="steady-card bg-card rounded-2xl p-5 border border-border">
        <h3 className="mb-1 text-foreground">{p.heading}</h3>
        <p className="text-muted-foreground mb-5" style={{ fontSize: "0.95rem" }}>{p.description}</p>

        <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start mb-5">
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-full flex items-center justify-center overflow-hidden" style={{ width: 80, height: 80, backgroundColor: "var(--surface-2)", flexShrink: 0 }}>
              {photo
                ? <img src={photo} alt="Your profile" style={{ width: 80, height: 80, objectFit: "cover" }} />
                : <span style={{ fontSize: "3.5rem", lineHeight: 1 }}>{profile.avatar}</span>
              }
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            <div className="flex gap-1.5">
              <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 border border-border text-foreground hover:bg-muted" style={{ fontSize: "0.8rem", fontWeight: 600, transition: "background-color 0.15s" }}>
                <Camera size={13} />{photo ? p.changePhoto : p.addPhoto}
              </button>
              {photo && (
                <button onClick={() => onPhotoChange(null)} className="rounded-lg px-2 py-1.5 border border-border text-muted-foreground hover:text-destructive" style={{ fontSize: "0.8rem", transition: "color 0.15s" }} aria-label={p.removePhoto}>
                  <X size={13} />
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 w-full sm:w-auto">
            <p style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: 8 }} className="text-foreground">
              {p.emojiAvatar}{photo && <span className="text-muted-foreground" style={{ fontWeight: 500 }}> ({p.shownWhenNoPhoto})</span>}
            </p>
            <div role="group" aria-label={p.emojiAvatar} className="flex flex-wrap gap-2">
              {avatarEmojis.map((e) => (
                <button key={e} onClick={() => update({ avatar: e })} aria-label={e} aria-pressed={profile.avatar === e} className="rounded-xl flex items-center justify-center hover:scale-110 hover:opacity-85" style={{ width: 40, height: 40, fontSize: "1.4rem", backgroundColor: profile.avatar === e ? "var(--green-bg)" : "var(--surface-1)", border: profile.avatar === e ? "2px solid var(--primary)" : "2px solid transparent", transition: "all 0.15s" }}>{e}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div>
            <label className="text-foreground" style={{ display: "block", marginBottom: 6, fontSize: "0.9rem" }}>{p.namePlaceholder}</label>
            <input type="text" value={profile.name} onChange={(e) => update({ name: e.target.value })} className="w-full rounded-xl px-4 py-3 border border-border bg-input-background text-foreground outline-none focus:border-primary" style={{ transition: "border-color 0.15s" }} />
          </div>
          <div>
            <label className="text-foreground" style={{ display: "block", marginBottom: 6, fontSize: "0.9rem" }}>{p.pronounsLabel}</label>
            <select
              value={profile.pronoun}
              onChange={(e) => update({ pronoun: e.target.value })}
              className="w-full rounded-xl px-4 py-3 border border-border bg-input-background text-foreground outline-none focus:border-primary appearance-none"
              style={{ transition: "border-color 0.15s", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236B6560' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", paddingRight: "2.5rem" }}
            >
              <option value="">—</option>
              {p.pronounsOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="text-foreground" style={{ display: "block", marginBottom: 6, fontSize: "0.9rem" }}>{p.aboutLabel}</label>
          <textarea value={profile.about} onChange={(e) => update({ about: e.target.value })} rows={2} className="w-full rounded-xl px-4 py-3 border border-border bg-input-background text-foreground outline-none focus:border-primary resize-none" style={{ lineHeight: 1.6, transition: "border-color 0.15s" }} />
        </div>
      </div>

      {/* Preview card */}
      <div className="rounded-2xl p-5 border border-border flex items-center gap-4" style={{ backgroundColor: "var(--purple-bg)" }}>
        <div className="rounded-full overflow-hidden flex items-center justify-center flex-shrink-0" style={{ width: 60, height: 60, backgroundColor: "var(--surface-2)" }}>
          {photo ? <img src={photo} alt="Profile" style={{ width: 60, height: 60, objectFit: "cover" }} /> : <span style={{ fontSize: "2.2rem" }}>{profile.avatar}</span>}
        </div>
        <div>
          <p className="text-foreground" style={{ fontWeight: 800, fontSize: "1.15rem" }}>{profile.name || p.namePlaceholder}</p>
          {profile.pronoun && <p className="text-muted-foreground" style={{ fontSize: "0.85rem", marginBottom: 2 }}>{profile.pronoun}</p>}
          {profile.about && <p style={{ fontSize: "0.88rem", color: "var(--purple-text)", fontStyle: "italic" }}>"{profile.about}"</p>}
        </div>
      </div>

      {/* Mood History */}
      <div className="steady-card bg-card rounded-2xl p-5 border border-border">
        <h3 className="mb-1 text-foreground">{t.moodHistory.heading}</h3>
        <p className="text-muted-foreground mb-4" style={{ fontSize: "0.95rem" }}>{t.moodHistory.description}</p>
        {moodHistory.length === 0 ? (
          <p className="text-muted-foreground" style={{ fontSize: "0.9rem" }}>{t.moodHistory.noData}</p>
        ) : (
          <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(7, 1fr)" }}>
            {days.map((date) => {
              const entry = moodHistory.find((e) => e.date === date);
              const mood = entry !== undefined ? moods[entry.moodIndex] : null;
              const dayIndex = new Date(date).getDay();
              const dayLabel = t.moodHistory.days[(dayIndex + 6) % 7]; // Mon=0
              return (
                <div key={date} className="flex flex-col items-center gap-1.5">
                  <div className="rounded-full flex items-center justify-center" style={{ width: 40, height: 40, backgroundColor: mood ? "var(--surface-2)" : "var(--surface-1)", fontSize: "1.4rem" }}>
                    {mood ? mood.emoji : <span style={{ color: "var(--muted-foreground)", fontSize: "1rem" }}>·</span>}
                  </div>
                  <span className="text-muted-foreground" style={{ fontSize: "0.68rem", fontWeight: 600 }}>{dayLabel}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Strengths */}
      <div className="steady-card bg-card rounded-2xl p-5 border border-border">
        <h3 className="mb-1 text-foreground">{t.strengths.heading}</h3>
        <p className="text-muted-foreground mb-4" style={{ fontSize: "0.95rem" }}>{t.strengths.description}</p>
        <div className="flex flex-wrap gap-2">
          {t.strengths.options.map((opt) => {
            const active = profile.strengths.includes(opt.key);
            return (
              <button key={opt.key} onClick={() => toggleList("strengths", opt.key)} className="flex items-center gap-2 rounded-xl px-4 py-2.5 border-2 hover:opacity-85" style={{ borderColor: active ? "var(--primary)" : "transparent", backgroundColor: active ? "var(--green-bg)" : "var(--surface-1)", fontWeight: active ? 700 : 500, color: active ? "var(--green-text)" : "var(--foreground)", transition: "all 0.15s" }} aria-pressed={active}>
                <span>{opt.emoji}</span>
                <span style={{ fontSize: "0.9rem" }}>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sensory */}
      <div className="steady-card bg-card rounded-2xl p-5 border border-border">
        <h3 className="mb-1 text-foreground">{p.sensory.heading}</h3>
        <p className="text-muted-foreground mb-4" style={{ fontSize: "0.95rem" }}>{p.sensory.description}</p>
        <div className="flex flex-wrap gap-2">
          {p.sensory.options.map((opt) => {
            const active = profile.sensory.includes(opt.key);
            return (
              <button key={opt.key} onClick={() => toggleList("sensory", opt.key)} className="flex items-center gap-2 rounded-xl px-4 py-2.5 border-2 hover:opacity-85" style={{ borderColor: active ? "var(--primary)" : "transparent", backgroundColor: active ? "var(--green-bg)" : "var(--surface-1)", fontWeight: active ? 700 : 500, color: active ? "var(--green-text)" : "var(--foreground)", transition: "all 0.15s" }} aria-pressed={active}>
                <span>{opt.emoji}</span><span style={{ fontSize: "0.9rem" }}>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Support */}
      <div className="steady-card bg-card rounded-2xl p-5 border border-border">
        <h3 className="mb-1 text-foreground">{p.support.heading}</h3>
        <p className="text-muted-foreground mb-4" style={{ fontSize: "0.95rem" }}>{p.support.description}</p>
        <div className="flex flex-wrap gap-2">
          {p.support.options.map((opt) => {
            const active = profile.support.includes(opt.key);
            return (
              <button key={opt.key} onClick={() => toggleList("support", opt.key)} className="flex items-center gap-2 rounded-xl px-4 py-2.5 border-2 hover:opacity-85" style={{ borderColor: active ? "var(--purple-vivid)" : "transparent", backgroundColor: active ? "var(--purple-bg)" : "var(--surface-1)", fontWeight: active ? 700 : 500, color: active ? "var(--purple-text)" : "var(--foreground)", transition: "all 0.15s" }} aria-pressed={active}>
                <span>{opt.emoji}</span><span style={{ fontSize: "0.9rem" }}>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <button onClick={save} className="w-full flex items-center justify-center gap-2 rounded-2xl py-4 bg-primary text-primary-foreground hover:opacity-90" style={{ fontWeight: 700, fontSize: "1rem", transition: "opacity 0.15s" }}>
        {saved ? p.saved : <><Save size={18} /> {p.save}</>}
      </button>
    </div>
  );
}
