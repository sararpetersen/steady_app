import { useEffect, useState } from "react";
import { MoodCheck } from "./components/MoodCheck";
import { TaskList, type Task } from "./components/TaskList";
import { Routines } from "./components/Routines";
import { HabitTracker, type Habit } from "./components/HabitTracker";
import { FocusTimer } from "./components/FocusTimer";
import { DailyNote } from "./components/DailyNote";
import { Profile } from "./components/Profile";
import { DEFAULT_PROFILE, type ProfileData } from "./components/profileTypes";
import { PersonalizedTip } from "./components/PersonalizedTip";
import { Onboarding } from "./components/Onboarding";
import { SettingsPage } from "./components/SettingsPage";
import { AuthPage, type AuthState } from "./components/AuthPage";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useToday } from "./hooks/useToday";
import { LangContext } from "./i18n/LangContext";
import { translations } from "./i18n/translations";
import { DEFAULT_A11Y } from "./components/a11yTypes";
import { LayoutDashboard, ClipboardList, Repeat2, Sprout, UserCircle2, Timer, NotebookPen, Settings, CalendarDays, Sun, Moon } from "lucide-react";
import { SteadyWordmark } from "./components/SteadyWordmark";

{
  /* MARKER-MAKE-KIT-INVOKED */
}

export default function App() {
  const [authState, setAuthState] = useLocalStorage<AuthState | null>("steady-auth-state", null);
  const [forceAuth, setForceAuth] = useState(() => new URLSearchParams(window.location.search).has("start"));
  const [onboarded, setOnboarded] = useLocalStorage("steady-onboarded", false);
  const [activeTab, setActiveTab] = useLocalStorage("steady-active-tab", "overview");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [rawProfile, setProfile] = useLocalStorage<ProfileData>("steady-profile", DEFAULT_PROFILE);
  const [profilePhoto, setProfilePhoto] = useLocalStorage<string | null>("steady-profile-photo", null);

  const today = useToday();

  // Task state lifted here so Overview stats stay in sync with the TaskList
  const [tasks, setTasks] = useLocalStorage<Task[]>("steady-tasks", []);
  const [nextId, setNextId] = useLocalStorage<number>("steady-task-nextid", 1);
  const [tasksDate, setTasksDate] = useLocalStorage<string | null>("steady-tasks-date", null);

  // Tasks are a daily list, not a persistent backlog — the whole list clears at rollover,
  // done or not, so nothing from a previous day lingers.
  useEffect(() => {
    if (tasksDate !== today) {
      setTasks([]);
      setTasksDate(today);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [today]);

  // Reset habits' doneToday when the day rolls over. Done here (always mounted) rather than
  // inside HabitTracker, since HabitTracker only mounts when its tab is active and would
  // otherwise leave stale doneToday flags until the user happens to visit that tab.
  useEffect(() => {
    try {
      const raw = localStorage.getItem("steady-habits-v2");
      if (!raw) return;
      const data = JSON.parse(raw) as Habit[];
      if (!Array.isArray(data)) return;
      let changed = false;
      const next = data.map((h) => {
        if (h.doneToday && h.lastCompletedDate !== today) {
          changed = true;
          return { ...h, doneToday: false };
        }
        return h;
      });
      if (changed) localStorage.setItem("steady-habits-v2", JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, [today]);

  // Same rollover reset for routine steps checked off for the day.
  useEffect(() => {
    try {
      const doneDate = localStorage.getItem("steady-routines-done-date");
      if (doneDate !== today) {
        localStorage.setItem("steady-routines-done", JSON.stringify([]));
        localStorage.setItem("steady-routines-done-date", today);
      }
    } catch {
      /* ignore */
    }
  }, [today]);

  // Habit stats — re-read from localStorage when tab or day changes (habits live in HabitTracker)
  const [habitsDone, setHabitsDone] = useState(0);
  const [habitsTotal, setHabitsTotal] = useState(0);
  const [habitGrowth, setHabitGrowth] = useState(0);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("steady-habits-v2");
      if (!raw) return;
      const data = JSON.parse(raw) as Habit[];
      if (!Array.isArray(data)) return;
      setHabitsDone(data.filter((h) => h.doneToday).length);
      setHabitsTotal(data.length);
      setHabitGrowth(data.reduce((sum, h) => sum + (h.totalCompletions ?? 0), 0));
    } catch {
      /* ignore */
    }
  }, [activeTab, today]);

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
    document.documentElement.lang = a11y.language ?? "en";
    root.classList.toggle("reduce-motion", a11y.reduceMotion);
    root.classList.toggle("dark", a11y.darkMode);
    root.style.colorScheme = a11y.darkMode ? "dark" : "light";
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

  const handleSignOut = () => {
    setSettingsOpen(false);
    setActiveTab("overview");
    setAuthState(null);
  };

  const handleAuthUpdate = (newEmail: string) => {
    setAuthState({ email: newEmail, isGuest: false });
  };

  const clearAllData = () => {
    setTasks([]);
    setNextId(1);
    localStorage.setItem("steady-habits-v2", JSON.stringify([]));
    localStorage.setItem("steady-mood-history", JSON.stringify([]));
    localStorage.setItem("steady-notes", JSON.stringify([]));
    localStorage.setItem("steady-notes-nextid", JSON.stringify(1));
    localStorage.setItem("steady-routines-done", JSON.stringify([]));
    localStorage.setItem("steady-routines-custom", JSON.stringify({ morning: [], noon: [], afternoon: [], evening: [], late: [] }));
    localStorage.setItem("steady-routines-nextid", JSON.stringify(100));
  };

  const handleOnboardingComplete = (newProfile: ProfileData) => {
    setProfile(newProfile);
    clearAllData();
    setOnboarded(true);
  };

  if (!authState || forceAuth) {
    return (
      <AuthPage
        onAuth={(s) => {
          setSettingsOpen(false);
          setAuthState(s);
          if (forceAuth) {
            setForceAuth(false);
            window.history.replaceState({}, "", window.location.pathname);
          }
        }}
      />
    );
  }

  if (!onboarded) {
    return (
      <LangContext.Provider value={t}>
        <style>{`.reduce-motion * { transition: none !important; animation: none !important; } body { line-height: var(--app-line-height, 1.5); }`}</style>
        <Onboarding
          onComplete={handleOnboardingComplete}
          onSkip={() => setOnboarded(true)}
          isGuest={authState.isGuest}
          onRegister={(email) => setAuthState({ email, isGuest: false })}
        />
      </LangContext.Provider>
    );
  }

  const tasksLeft = tasks.filter((t) => !t.done).length;

  const TABS = [
    { key: "overview", label: t.nav.overview, icon: LayoutDashboard },
    { key: "tasks", label: t.nav.tasks, icon: ClipboardList },
    { key: "routines", label: t.nav.routines, icon: Repeat2 },
    { key: "habits", label: t.nav.habits, icon: Sprout },
    { key: "focus", label: t.nav.focus, icon: Timer },
    { key: "note", label: t.nav.note, icon: NotebookPen },
    { key: "profile", label: t.nav.profile, icon: UserCircle2 },
  ];

  // Consistent circular avatar button — photo fills circle, emoji sits on tinted background
  const AvatarButton = () => (
    <button
      onClick={() => {
        setActiveTab("profile");
        setSettingsOpen(false);
      }}
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
      {profilePhoto ? (
        <img src={profilePhoto} alt="Your profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <span style={{ fontSize: "1.3rem", lineHeight: 1 }}>{profile.avatar}</span>
      )}
    </button>
  );

  const greeting = (() => {
    const h = new Date().getHours();
    const base = h < 12 ? t.greeting.morning : h < 17 ? t.greeting.afternoon : t.greeting.evening;
    return profile.name ? `${base}, ${profile.name}` : base;
  })();

  const dateStr = new Date(`${today}T00:00:00`).toLocaleDateString(t.dateLocale, { weekday: "short", day: "numeric", month: "short" });

  return (
    <LangContext.Provider value={t}>
      <style>{`
        .reduce-motion * { transition: none !important; animation: none !important; }
        body { line-height: var(--app-line-height, 1.5); }
        .steady-card { box-shadow: var(--shadow-card); }
        .nav-tab { transition: background-color 0.18s, color 0.18s; }
        .nav-tab-active { background-color: var(--green-bg); }
        .nav-tab-inactive:hover { background-color: var(--muted); }
        .nav-scroll { scrollbar-width: none; -ms-overflow-style: none; }
        .nav-scroll::-webkit-scrollbar { display: none; }

        @media (max-width: 360px) {
          .mood-label { display: none; }
        }
        @media (max-width: 320px) {
          .nav-tab-label { display: none; }
          .nav-tabs-row { padding-left: 4px; padding-right: 4px; gap: 0; }
        }
      `}</style>

      <div className="min-h-screen bg-background" style={{ fontFamily: "var(--app-font-body, 'Nunito Sans', sans-serif)" }}>
        {/* ── Desktop sidebar (lg+) ─────────────────────────────────── */}
        <aside
          aria-label="Sidebar navigation"
          className="hidden lg:flex flex-col fixed top-0 left-0 h-screen w-60 border-r border-border z-20"
          style={{ backgroundColor: "var(--card)" }}
        >
          {/* Brand */}
          <div className="px-4 pt-5 pb-4 border-b border-border space-y-3">
            <button
              onClick={() => {
                setActiveTab("overview");
                setSettingsOpen(false);
              }}
              className="group flex flex-col items-start gap-1.5 rounded-xl w-full p-2 hover:bg-muted"
              style={{ transition: "background-color 0.15s" }}
              aria-label="Go to Overview"
            >
              <SteadyWordmark height={26} className="transition-transform group-hover:scale-[1.04]" />
              <p className="text-muted-foreground truncate" style={{ fontSize: "0.75rem", lineHeight: 1.3 }}>
                {greeting}
              </p>
            </button>

            {/* Prominent date chip */}
            <div
              className="flex items-center gap-2.5 rounded-2xl px-3 py-2.5 w-full"
              style={{ backgroundColor: "var(--green-bg)", border: "1.5px solid var(--border)" }}
            >
              <CalendarDays size={18} style={{ color: "var(--primary)", flexShrink: 0 }} />
              <div className="min-w-0">
                <p
                  style={{
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    color: "var(--muted-foreground)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    lineHeight: 1,
                    marginBottom: 8,
                  }}
                >
                  Today
                </p>
                <p style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--green-text)", lineHeight: 1.3 }} className="truncate">
                  {dateStr}
                </p>
              </div>
            </div>
          </div>

          {/* Vertical nav */}
          <nav className="flex-1 overflow-y-auto p-2 py-3 space-y-0.5">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.key && !settingsOpen;
              return (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key);
                    setSettingsOpen(false);
                  }}
                  className={`nav-tab w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left ${active ? "nav-tab-active" : "nav-tab-inactive"}`}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon
                    size={18}
                    style={{ color: active ? "var(--primary)" : "var(--muted-foreground)", flexShrink: 0 }}
                    strokeWidth={active ? 2.5 : 1.8}
                  />
                  <span
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: active ? 700 : 500,
                      color: active ? "var(--primary)" : "var(--muted-foreground)",
                      fontFamily: "var(--app-font-heading, Nunito)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Bottom controls */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setProfile({ ...profile, a11y: { ...profile.a11y, darkMode: !profile.a11y.darkMode } })}
                className="nav-tab nav-tab-inactive rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ width: 44, height: 44, border: "2px solid var(--border)", color: "var(--muted-foreground)" }}
                aria-label={profile.a11y.darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {profile.a11y.darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button
                onClick={() => setSettingsOpen((open) => !open)}
                className={`nav-tab rounded-xl flex items-center justify-center flex-shrink-0 ${settingsOpen ? "nav-tab-active" : "nav-tab-inactive"}`}
                style={{
                  width: 44,
                  height: 44,
                  border: `2px solid ${settingsOpen ? "var(--primary)" : "var(--border)"}`,
                  color: settingsOpen ? "var(--primary)" : "var(--muted-foreground)",
                }}
                aria-label="Open settings"
                aria-pressed={settingsOpen}
              >
                <Settings size={18} />
              </button>
              <AvatarButton />
            </div>
          </div>
        </aside>

        {/* ── Content area (offset on lg) ──────────────────────────── */}
        <div className="lg:pl-60 flex flex-col min-h-screen">
          {/* Mobile / tablet header — hidden on lg */}
          <header className="sticky top-0 z-10 border-b border-border px-5 py-3 lg:hidden" style={{ backgroundColor: "var(--card)" }}>
            <div className="max-w-xl mx-auto flex items-center justify-between gap-4">
              {/* Logo — clickable, goes to Overview */}
              <button
                onClick={() => {
                  setActiveTab("overview");
                  setSettingsOpen(false);
                }}
                className="group flex flex-col items-start gap-1 rounded-xl min-w-0 p-2 hover:bg-muted"
                style={{ transition: "background-color 0.15s" }}
                aria-label="Go to Overview"
              >
                <SteadyWordmark height={24} className="flex-shrink-0 transition-transform group-hover:scale-[1.04]" />
                <p className="text-muted-foreground truncate" style={{ fontSize: "0.78rem", lineHeight: 1.2 }}>
                  {greeting}
                </p>
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSettingsOpen((o) => !o)}
                  className="rounded-xl flex items-center justify-center flex-shrink-0 hover:bg-muted"
                  style={{ width: 44, height: 44, transition: "background-color 0.15s", color: settingsOpen ? "var(--primary)" : "var(--muted-foreground)" }}
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
          <nav
            aria-label="Tab navigation"
            className="sticky top-[61px] z-10 border-b border-border lg:hidden"
            style={{ backgroundColor: "var(--card)" }}
          >
            <div className="nav-scroll overflow-x-auto">
              <div className="nav-tabs-row flex px-3 py-2 gap-1 max-w-xl mx-auto">
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  const active = activeTab === tab.key && !settingsOpen;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => {
                        setActiveTab(tab.key);
                        setSettingsOpen(false);
                      }}
                      className="flex-1 flex flex-col items-center gap-0.5 py-2 px-1 min-w-[44px]"
                      aria-current={active ? "page" : undefined}
                    >
                      <Icon size={18} style={{ color: active ? "var(--primary)" : "var(--muted-foreground)" }} strokeWidth={active ? 2.5 : 1.8} />
                      <span
                        className="nav-tab-label"
                        style={{
                          fontSize: "0.65rem",
                          fontWeight: active ? 700 : 500,
                          color: active ? "var(--primary)" : "var(--muted-foreground)",
                          fontFamily: "var(--app-font-heading, Nunito)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {tab.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* Main content */}
          <main className="flex-1 w-full max-w-xl lg:max-w-2xl mx-auto px-4 pt-5 pb-8">
            {settingsOpen ? (
              <SettingsPage
                settings={profile.a11y}
                onChange={(a11y) => setProfile({ ...profile, a11y })}
                onClose={() => setSettingsOpen(false)}
                onResetOnboarding={() => {
                  setOnboarded(false);
                  setSettingsOpen(false);
                }}
                onClearData={() => {
                  clearAllData();
                  setProfile({ ...DEFAULT_PROFILE, a11y: profile.a11y });
                }}
                auth={authState}
                onSignOut={handleSignOut}
                onAuthUpdate={handleAuthUpdate}
              />
            ) : (
              <div className="space-y-4">
                {activeTab === "overview" && (
                  <>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        {
                          label: t.overview.tasksLeft,
                          value: String(tasksLeft),
                          ariaLabel: undefined,
                          bg: "var(--green-bg)",
                          fg: "var(--green-text)",
                        },
                        {
                          label: t.overview.habitsDone,
                          value: habitsTotal > 0 ? `${habitsDone} / ${habitsTotal}` : "–",
                          ariaLabel: undefined,
                          bg: "var(--purple-bg)",
                          fg: "var(--purple-text)",
                        },
                        {
                          label: t.overview.habitGrowth,
                          value: habitGrowth > 0 ? `${habitGrowth} 🌱` : "–",
                          ariaLabel: habitGrowth > 0 ? `${habitGrowth} total habit check-ins` : "No habit check-ins yet",
                          bg: "var(--yellow-bg)",
                          fg: "var(--yellow-text)",
                        },
                      ].map((stat) => (
                        <div
                          key={stat.label}
                          className="steady-card rounded-2xl p-3 sm:p-4 flex flex-col items-center text-center border border-border"
                          style={{ backgroundColor: stat.bg }}
                        >
                          <span
                            aria-label={stat.ariaLabel}
                            style={{ fontWeight: 800, fontSize: "clamp(16px, 1.4rem, 20px)", color: stat.fg, lineHeight: 1.2 }}
                          >
                            {stat.value}
                          </span>
                          <span
                            style={{
                              fontSize: "11px",
                              color: stat.fg,
                              fontWeight: 600,
                              marginTop: 4,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              maxWidth: "100%",
                            }}
                          >
                            {stat.label}
                          </span>
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
                {activeTab === "profile" && <Profile profile={profile} onChange={setProfile} photo={profilePhoto} onPhotoChange={setProfilePhoto} />}
              </div>
            )}
          </main>
        </div>
      </div>
    </LangContext.Provider>
  );
}
