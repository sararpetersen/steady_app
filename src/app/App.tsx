import { useEffect, useState } from "react";
import { MoodCheck } from "./components/MoodCheck";
import { TaskList, type Task } from "./components/TaskList";
import { Routines } from "./components/Routines";
import { HabitTracker } from "./components/HabitTracker";
import { FocusTimer } from "./components/FocusTimer";
import { DailyNote } from "./components/DailyNote";
import { Profile, DEFAULT_PROFILE, type ProfileData } from "./components/Profile";
import { PersonalizedTip } from "./components/PersonalizedTip";
import { Onboarding } from "./components/Onboarding";
import { SettingsPage } from "./components/SettingsPage";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { LangContext } from "./i18n/LangContext";
import { translations } from "./i18n/translations";
import { DEFAULT_A11Y } from "./components/AccessibilityPanel";
import { LayoutDashboard, ClipboardList, Repeat2, Flame, UserCircle2, Timer, NotebookPen, Settings } from "lucide-react";
import { SteadyLogo } from "./components/SteadyLogo";

{/* MARKER-MAKE-KIT-INVOKED */}


export default function App() {
  const [onboarded, setOnboarded] = useLocalStorage("steady-onboarded", false);
  const [activeTab, setActiveTab] = useLocalStorage("steady-active-tab", "overview");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [rawProfile, setProfile] = useLocalStorage<ProfileData>("steady-profile", DEFAULT_PROFILE);
  const [profilePhoto, setProfilePhoto] = useLocalStorage<string | null>("steady-profile-photo", null);

  // Task state lifted here so Overview stats stay in sync with the TaskList
  const [tasks, setTasks] = useLocalStorage<Task[]>("steady-tasks", []);
  const [nextId, setNextId] = useLocalStorage<number>("steady-task-nextid", 1);

  // Habit done count — re-read from localStorage when tab changes (habits live in HabitTracker)
  const [habitsDone, setHabitsDone] = useState(0);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("steady-habits");
      if (!raw) return;
      const data = JSON.parse(raw);
      if (Array.isArray(data)) return; // old format, ignore
      setHabitsDone(Object.values(data as Record<string, { doneToday: boolean }>).filter((h) => h.doneToday).length);
    } catch { /* ignore */ }
  }, [activeTab]);

  const profile: ProfileData = {
    ...DEFAULT_PROFILE,
    ...rawProfile,
    a11y: { ...DEFAULT_A11Y, ...(rawProfile.a11y ?? {}) },
  };

  const t = translations[profile.a11y.language ?? "en"];

  // Migrate old localStorage profile missing required fields
  useEffect(() => {
    if (!rawProfile.sensory || !rawProfile.support || !rawProfile.a11y) {
      setProfile(profile);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Apply all accessibility settings globally
  useEffect(() => {
    const root = document.documentElement;
    const a11y = profile.a11y;
    const fontSizes = { normal: "17px", large: "20px", xlarge: "24px" };
    root.style.setProperty("--font-size", fontSizes[a11y.fontSize]);
    const readable = a11y.font === "readable";
    root.style.setProperty("--app-font-body", readable ? "'Atkinson Hyperlegible', sans-serif" : "'Nunito Sans', 'Nunito', sans-serif");
    root.style.setProperty("--app-font-heading", readable ? "'Atkinson Hyperlegible', sans-serif" : "'Nunito', sans-serif");
    root.style.setProperty("--app-line-height", a11y.lineSpacing === "spacious" ? "1.9" : "1.5");
    root.classList.toggle("reduce-motion", a11y.reduceMotion);
    root.classList.toggle("dark", a11y.darkMode);
    if (a11y.highContrast) {
      root.style.setProperty("--foreground", a11y.darkMode ? "#FFFFFF" : "#111111");
      root.style.setProperty("--muted-foreground", a11y.darkMode ? "#CCCCCC" : "#444444");
      root.style.setProperty("--border", a11y.darkMode ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)");
    } else {
      root.style.removeProperty("--foreground");
      root.style.removeProperty("--muted-foreground");
      root.style.removeProperty("--border");
    }
  }, [profile.a11y]);

  const clearAllData = () => {
    setTasks([]);
    setNextId(1);
    localStorage.setItem("steady-habits-v2", JSON.stringify([]));
    localStorage.setItem("steady-mood-history", JSON.stringify([]));
    localStorage.setItem("steady-notes", JSON.stringify([]));
    localStorage.setItem("steady-notes-nextid", JSON.stringify(1));
    localStorage.setItem("steady-routines-done", JSON.stringify([]));
    localStorage.setItem("steady-routines-custom", JSON.stringify({ morning: [], afternoon: [], evening: [] }));
    localStorage.setItem("steady-routines-nextid", JSON.stringify(100));
  };

  const handleOnboardingComplete = (newProfile: ProfileData) => {
    setProfile(newProfile);
    clearAllData();
    setOnboarded(true);
  };

  if (!onboarded) {
    return (
      <LangContext.Provider value={t}>
        <style>{`.reduce-motion * { transition: none !important; animation: none !important; } body { line-height: var(--app-line-height, 1.5); }`}</style>
        <Onboarding onComplete={handleOnboardingComplete} onSkip={() => setOnboarded(true)} />
      </LangContext.Provider>
    );
  }

  const tasksLeft = tasks.filter((t) => !t.done).length;

  const TABS = [
    { key: "overview", label: t.nav.overview, icon: LayoutDashboard },
    { key: "tasks", label: t.nav.tasks, icon: ClipboardList },
    { key: "routines", label: t.nav.routines, icon: Repeat2 },
    { key: "habits", label: t.nav.habits, icon: Flame },
    { key: "focus", label: t.nav.focus, icon: Timer },
    { key: "note", label: t.nav.note, icon: NotebookPen },
    { key: "profile", label: t.nav.profile, icon: UserCircle2 },
  ];

  // Consistent circular avatar button — photo fills circle, emoji sits on tinted background
  const AvatarButton = () => (
    <button
      onClick={() => { setActiveTab("profile"); setSettingsOpen(false); }}
      className="rounded-full flex items-center justify-center overflow-hidden hover:opacity-80"
      style={{
        width: 44,
        height: 44,
        backgroundColor: profilePhoto ? "transparent" : "var(--green-bg)",
        border: "2px solid var(--primary)",
        flexShrink: 0,
        transition: "opacity 0.15s",
      }}
      aria-label="Open profile"
    >
      {profilePhoto
        ? <img src={profilePhoto} alt="Your profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        : <span style={{ fontSize: "1.3rem", lineHeight: 1 }}>{profile.avatar}</span>
      }
    </button>
  );

  const greeting = (() => {
    const h = new Date().getHours();
    const base = h < 12 ? t.greeting.morning : h < 17 ? t.greeting.afternoon : t.greeting.evening;
    return profile.name ? `${base}, ${profile.name}` : base;
  })();

  const dateStr = new Date().toLocaleDateString(t.dateLocale, { weekday: "short", day: "numeric", month: "short" });

  return (
    <LangContext.Provider value={t}>
      <style>{`
        .reduce-motion * { transition: none !important; animation: none !important; }
        body { line-height: var(--app-line-height, 1.5); }
        .steady-card { box-shadow: var(--shadow-card); }
        .nav-tab { transition: background-color 0.15s, color 0.15s; }
        .nav-tab-active { background-color: var(--green-bg); }
        .nav-tab-inactive:hover { background-color: var(--muted); }
        .nav-scroll { scrollbar-width: none; -ms-overflow-style: none; }
        .nav-scroll::-webkit-scrollbar { display: none; }
      `}</style>

      <div className="min-h-screen bg-background" style={{ fontFamily: "var(--app-font-body, 'Nunito Sans', sans-serif)" }}>

        {/* ── Desktop sidebar (lg+) ─────────────────────────────────── */}
        <aside
          className="hidden lg:flex flex-col fixed top-0 left-0 h-screen w-60 border-r border-border z-20"
          style={{ backgroundColor: "var(--card)" }}
        >
          {/* Brand */}
          <div className="px-4 py-5 border-b border-border">
            <button
              onClick={() => { setActiveTab("overview"); setSettingsOpen(false); }}
              className="flex items-center gap-2.5 hover:opacity-80 rounded-xl w-full"
              style={{ transition: "opacity 0.15s" }}
              aria-label="Go to Overview"
            >
              <SteadyLogo size={30} />
              <div className="text-left min-w-0">
                <span style={{ fontFamily: "var(--app-font-heading, Nunito)", fontWeight: 800, fontSize: "1.2rem", color: "var(--primary)", letterSpacing: "-0.02em", display: "block" }}>
                  Steady
                </span>
                <p className="text-muted-foreground truncate" style={{ fontSize: "0.75rem", lineHeight: 1.3 }}>
                  {greeting}
                </p>
              </div>
            </button>
          </div>

          {/* Vertical nav */}
          <nav className="flex-1 overflow-y-auto p-2 py-3 space-y-0.5">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.key && !settingsOpen;
              return (
                <button
                  key={tab.key}
                  onClick={() => { setActiveTab(tab.key); setSettingsOpen(false); }}
                  className={`nav-tab w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left ${active ? "nav-tab-active" : "nav-tab-inactive"}`}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon
                    size={18}
                    style={{ color: active ? "var(--primary)" : "var(--muted-foreground)", flexShrink: 0 }}
                    strokeWidth={active ? 2.5 : 1.8}
                  />
                  <span style={{
                    fontSize: "0.9rem",
                    fontWeight: active ? 700 : 500,
                    color: active ? "var(--primary)" : "var(--muted-foreground)",
                    fontFamily: "var(--app-font-heading, Nunito)",
                    whiteSpace: "nowrap",
                  }}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Bottom: date + settings + avatar */}
          <div className="p-4 border-t border-border space-y-3">
            <p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>
              {dateStr}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSettingsOpen((o) => !o)}
                className={`nav-tab flex-1 flex items-center justify-center gap-2 rounded-xl py-2 ${settingsOpen ? "nav-tab-active" : "nav-tab-inactive"}`}
                style={{ color: settingsOpen ? "var(--primary)" : "var(--muted-foreground)" }}
                aria-label="Open settings"
                aria-pressed={settingsOpen}
              >
                <Settings size={18} />
                <span style={{ fontSize: "0.88rem", fontWeight: settingsOpen ? 700 : 500, fontFamily: "var(--app-font-heading, Nunito)" }}>
                  {t.settings.title}
                </span>
              </button>
              <AvatarButton />
            </div>
          </div>
        </aside>

        {/* ── Content area (offset on lg) ──────────────────────────── */}
        <div className="lg:pl-60 flex flex-col min-h-screen">

          {/* Mobile / tablet header — hidden on lg */}
          <header className="sticky top-0 z-10 border-b border-border px-5 py-3 lg:hidden" style={{ backgroundColor: "var(--card)" }}>
            <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
              {/* Logo — clickable, goes to Overview */}
              <button
                onClick={() => { setActiveTab("overview"); setSettingsOpen(false); }}
                className="flex items-center gap-2.5 hover:opacity-80 rounded-xl"
                style={{ transition: "opacity 0.15s" }}
                aria-label="Go to Overview"
              >
                <SteadyLogo size={30} />
                <div className="text-left">
                  <span style={{ fontFamily: "var(--app-font-heading, Nunito)", fontWeight: 800, fontSize: "1.25rem", color: "var(--primary)", letterSpacing: "-0.02em" }}>
                    Steady
                  </span>
                  <p className="text-muted-foreground" style={{ fontSize: "0.78rem", marginTop: 0, lineHeight: 1.2 }}>
                    {greeting} · {dateStr}
                  </p>
                </div>
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSettingsOpen((o) => !o)}
                  className="rounded-xl p-2 hover:bg-muted"
                  style={{ transition: "background-color 0.15s", color: settingsOpen ? "var(--primary)" : "var(--muted-foreground)" }}
                  aria-label="Open settings"
                  aria-pressed={settingsOpen}
                >
                  <Settings size={20} />
                </button>
                <AvatarButton />
              </div>
            </div>
          </header>

          {/* Mobile / tablet tab navigation — hidden on lg */}
          <nav className="sticky top-[61px] z-10 border-b border-border lg:hidden" style={{ backgroundColor: "var(--card)" }}>
            <div className="nav-scroll overflow-x-auto">
              <div className="flex px-3 py-2 gap-1 max-w-2xl mx-auto">
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  const active = activeTab === tab.key && !settingsOpen;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => { setActiveTab(tab.key); setSettingsOpen(false); }}
                      className={`nav-tab flex-1 flex flex-col items-center gap-0.5 py-2 px-1 rounded-xl min-w-[44px] ${active ? "nav-tab-active" : "nav-tab-inactive"}`}
                      aria-current={active ? "page" : undefined}
                    >
                      <Icon
                        size={18}
                        style={{ color: active ? "var(--primary)" : "var(--muted-foreground)" }}
                        strokeWidth={active ? 2.5 : 1.8}
                      />
                      <span style={{
                        fontSize: "0.65rem",
                        fontWeight: active ? 700 : 500,
                        color: active ? "var(--primary)" : "var(--muted-foreground)",
                        fontFamily: "var(--app-font-heading, Nunito)",
                        whiteSpace: "nowrap",
                      }}>
                        {tab.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* Main content */}
          <main className="flex-1 w-full max-w-xl sm:max-w-2xl lg:max-w-3xl mx-auto px-4 pt-5 pb-8 space-y-4">

            {settingsOpen ? (
              <SettingsPage
                settings={profile.a11y}
                onChange={(a11y) => setProfile({ ...profile, a11y })}
                onClose={() => setSettingsOpen(false)}
                onResetOnboarding={() => { setOnboarded(false); setSettingsOpen(false); }}
                onClearData={() => { clearAllData(); setProfile({ ...DEFAULT_PROFILE, a11y: profile.a11y }); }}
              />
            ) : (
              <>
                {activeTab === "overview" && (
                  <>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: t.overview.tasksLeft, value: String(tasksLeft), bg: "var(--green-bg)", fg: "var(--green-text)" },
                        { label: t.overview.habitsDone, value: `${habitsDone} / 4`, bg: "var(--purple-bg)", fg: "var(--purple-text)" },
                        { label: t.overview.streakDays, value: "🔥", bg: "var(--yellow-bg)", fg: "var(--yellow-text)" },
                      ].map((stat) => (
                        <div key={stat.label} className="steady-card rounded-2xl p-4 flex flex-col items-center text-center border border-border" style={{ backgroundColor: stat.bg }}>
                          <span style={{ fontWeight: 800, fontSize: "1.4rem", color: stat.fg, lineHeight: 1.2 }}>{stat.value}</span>
                          <span style={{ fontSize: "0.75rem", color: stat.fg, fontWeight: 600, marginTop: 4 }}>{stat.label}</span>
                        </div>
                      ))}
                    </div>
                    <MoodCheck />
                    <PersonalizedTip support={profile.support} sensory={profile.sensory} />
                    <TaskList tasks={tasks} setTasks={setTasks} nextId={nextId} setNextId={setNextId} />
                  </>
                )}
                {activeTab === "tasks" && <TaskList tasks={tasks} setTasks={setTasks} nextId={nextId} setNextId={setNextId} />}
                {activeTab === "routines" && <Routines />}
                {activeTab === "habits" && <HabitTracker />}
                {activeTab === "focus" && <FocusTimer />}
                {activeTab === "note" && <DailyNote />}
                {activeTab === "profile" && (
                  <Profile profile={profile} onChange={setProfile} photo={profilePhoto} onPhotoChange={setProfilePhoto} />
                )}
              </>
            )}

          </main>

        </div>
      </div>
    </LangContext.Provider>
  );
}
