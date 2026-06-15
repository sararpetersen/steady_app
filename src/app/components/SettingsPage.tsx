import { useState } from "react";
import { X, ChevronDown, ChevronUp, Eye, EyeOff } from "lucide-react";
import { useLang } from "../i18n/LangContext";
import type { A11ySettings } from "./AccessibilityPanel";
import type { Lang } from "../i18n/translations";
import type { AuthState } from "./AuthPage";

interface Props {
  settings: A11ySettings;
  onChange: (s: A11ySettings) => void;
  onClose: () => void;
  onResetOnboarding: () => void;
  onClearData: () => void;
  auth: AuthState | null;
  onSignOut: () => void;
  onAuthUpdate: (newEmail: string) => void;
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--primary)", marginBottom: 8 }}>
      {children}
    </p>
  );
}

function ToggleRow({ label, description, value, onChange }: {
  label: string; description?: string; value: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="w-full flex items-center justify-between rounded-xl px-4 py-3 hover:opacity-85 border-2"
      style={{
        backgroundColor: value ? "var(--green-bg)" : "var(--surface-1)",
        borderColor: value ? "var(--primary)" : "transparent",
        transition: "all 0.15s",
      }}
      aria-pressed={value}
    >
      <div className="flex-1 mr-4 text-left">
        <p className="text-foreground" style={{ fontWeight: 600 }}>{label}</p>
        {description && <p className="text-muted-foreground" style={{ fontSize: "0.82rem" }}>{description}</p>}
      </div>
      <div className="flex-shrink-0 rounded-full relative" style={{ width: 44, height: 24, backgroundColor: value ? "var(--primary)" : "var(--muted-foreground)" }}>
        <div className="absolute top-1 rounded-full bg-white" style={{ width: 16, height: 16, left: value ? 24 : 4, transition: "left 0.2s" }} />
      </div>
    </button>
  );
}

function OptionRow<V extends string>({ label, options, value, onChange }: {
  label: string;
  options: { value: V; label: string }[];
  value: V;
  onChange: (v: V) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 py-1">
      <span className="text-foreground" style={{ fontWeight: 600 }}>{label}</span>
      <div className="flex gap-1.5 flex-wrap">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className="rounded-lg px-3 py-1.5 border-2 hover:opacity-85"
            style={{
              borderColor: value === opt.value ? "var(--primary)" : "transparent",
              backgroundColor: value === opt.value ? "var(--green-bg)" : "var(--surface-1)",
              color: value === opt.value ? "var(--green-text)" : "var(--foreground)",
              fontWeight: value === opt.value ? 700 : 500,
              fontSize: "0.85rem",
              transition: "all 0.15s",
            }}
            aria-pressed={value === opt.value}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function getAccounts(): Record<string, { password: string }> {
  try { return JSON.parse(localStorage.getItem("steady-accounts") ?? "{}"); } catch { return {}; }
}
function saveAccounts(a: Record<string, { password: string }>) {
  localStorage.setItem("steady-accounts", JSON.stringify(a));
}

function AccountSection({ auth, onSignOut, onAuthUpdate }: {
  auth: AuthState | null;
  onSignOut: () => void;
  onAuthUpdate: (newEmail: string) => void;
}) {
  const t = useLang();
  const a = t.account;

  const [emailOpen, setEmailOpen] = useState(false);
  const [pwOpen, setPwOpen] = useState(false);

  const [newEmail, setNewEmail] = useState("");
  const [verifyPw, setVerifyPw] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailSaved, setEmailSaved] = useState(false);

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwSaved, setPwSaved] = useState(false);

  const isGuest = !auth || auth.isGuest;

  const saveEmail = () => {
    setEmailError("");
    if (!newEmail.trim()) { setEmailError(a.emailRequired); return; }
    const accounts = getAccounts();
    const stored = accounts[auth!.email];
    if (!stored || stored.password !== verifyPw) { setEmailError(a.wrongPassword); return; }
    if (accounts[newEmail.toLowerCase()] && newEmail.toLowerCase() !== auth!.email) {
      setEmailError(a.emailInUse); return;
    }
    // Move account to new email key
    accounts[newEmail.toLowerCase()] = stored;
    if (newEmail.toLowerCase() !== auth!.email) delete accounts[auth!.email];
    saveAccounts(accounts);
    onAuthUpdate(newEmail.toLowerCase());
    setEmailOpen(false);
    setNewEmail("");
    setVerifyPw("");
    setEmailSaved(true);
    setTimeout(() => setEmailSaved(false), 2500);
  };

  const savePassword = () => {
    setPwError("");
    const accounts = getAccounts();
    const stored = accounts[auth!.email];
    if (!stored || stored.password !== currentPw) { setPwError(a.wrongPassword); return; }
    if (newPw.length < 6) { setPwError(a.passwordTooShort); return; }
    if (newPw !== confirmPw) { setPwError(a.passwordsNoMatch); return; }
    accounts[auth!.email] = { password: newPw };
    saveAccounts(accounts);
    setPwOpen(false);
    setCurrentPw(""); setNewPw(""); setConfirmPw("");
    setPwSaved(true);
    setTimeout(() => setPwSaved(false), 2500);
  };

  const inputCls = "w-full rounded-xl px-4 py-2.5 border border-border bg-input-background text-foreground placeholder:text-muted-foreground outline-none focus:border-primary";
  const inputStyle = { fontSize: "0.9rem", transition: "border-color 0.15s" };

  // ── Guest: inline sign-up form ──────────────────────────────────────
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPw, setSignUpPw] = useState("");
  const [signUpConfirm, setSignUpConfirm] = useState("");
  const [signUpShowPw, setSignUpShowPw] = useState(false);
  const [signUpError, setSignUpError] = useState("");

  const registerFromGuest = () => {
    setSignUpError("");
    if (!signUpEmail.trim()) { setSignUpError(a.emailRequired); return; }
    if (signUpPw.length < 6) { setSignUpError(a.passwordTooShort); return; }
    if (signUpPw !== signUpConfirm) { setSignUpError(a.passwordsNoMatch); return; }
    const accounts = getAccounts();
    if (accounts[signUpEmail.toLowerCase()]) { setSignUpError(a.emailInUse); return; }
    accounts[signUpEmail.toLowerCase()] = { password: signUpPw };
    saveAccounts(accounts);
    onAuthUpdate(signUpEmail.toLowerCase());
  };

  if (isGuest) {
    return (
      <div className="space-y-3">
        <p className="text-muted-foreground" style={{ fontSize: "0.88rem" }}>{a.guestNote}</p>

        {/* Email */}
        <div>
          <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, marginBottom: 5, color: "var(--foreground)" }}>
            {a.emailLabel}
          </label>
          <input
            type="email"
            value={signUpEmail}
            onChange={(e) => setSignUpEmail(e.target.value)}
            placeholder="you@example.com"
            className={inputCls}
            style={inputStyle}
            autoComplete="email"
          />
        </div>

        {/* Password */}
        <div>
          <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, marginBottom: 5, color: "var(--foreground)" }}>
            {a.newPasswordLabel}
          </label>
          <div className="relative">
            <input
              type={signUpShowPw ? "text" : "password"}
              value={signUpPw}
              onChange={(e) => setSignUpPw(e.target.value)}
              placeholder="At least 6 characters"
              className={inputCls}
              style={{ ...inputStyle, paddingRight: "2.5rem" }}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setSignUpShowPw((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={signUpShowPw ? "Hide password" : "Show password"}
            >
              {signUpShowPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {/* Confirm */}
        <div>
          <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, marginBottom: 5, color: "var(--foreground)" }}>
            {a.confirmNewPasswordLabel}
          </label>
          <input
            type={signUpShowPw ? "text" : "password"}
            value={signUpConfirm}
            onChange={(e) => setSignUpConfirm(e.target.value)}
            placeholder="Repeat your password"
            className={inputCls}
            style={inputStyle}
            autoComplete="new-password"
          />
        </div>

        {signUpError && (
          <p className="rounded-xl px-3 py-2" style={{ backgroundColor: "rgba(192,57,43,0.1)", color: "var(--destructive)", fontSize: "0.82rem", fontWeight: 600 }}>
            {signUpError}
          </p>
        )}

        <button
          onClick={registerFromGuest}
          className="w-full rounded-xl px-4 py-3 bg-primary text-primary-foreground hover:opacity-90"
          style={{ fontWeight: 700, transition: "opacity 0.15s" }}
        >
          {a.createAccount}
        </button>

        <button
          onClick={onSignOut}
          className="w-full rounded-xl px-4 py-3 border border-border text-foreground hover:bg-muted text-center"
          style={{ fontWeight: 600, transition: "background-color 0.15s" }}
        >
          {a.signOut}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Current email display */}
      <div className="rounded-xl px-4 py-3" style={{ backgroundColor: "var(--surface-1)" }}>
        <p className="text-muted-foreground" style={{ fontSize: "0.78rem", fontWeight: 600, marginBottom: 2 }}>{a.emailLabel}</p>
        <p className="text-foreground" style={{ fontWeight: 600 }}>{auth!.email}</p>
      </div>

      {/* Change email */}
      <div className="rounded-xl border border-border overflow-hidden">
        <button
          onClick={() => { setEmailOpen((o) => !o); setEmailError(""); }}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted text-left"
          style={{ transition: "background-color 0.15s" }}
        >
          <span className="text-foreground" style={{ fontWeight: 600 }}>{emailSaved ? a.saved : a.changeEmail}</span>
          {emailOpen ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
        </button>
        {emailOpen && (
          <div className="px-4 pb-4 space-y-3 border-t border-border" style={{ paddingTop: 12 }}>
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, marginBottom: 5, color: "var(--foreground)" }}>{a.newEmailLabel}</label>
              <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder={a.newEmailPlaceholder} className={inputCls} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, marginBottom: 5, color: "var(--foreground)" }}>{a.verifyPasswordLabel}</label>
              <input type="password" value={verifyPw} onChange={(e) => setVerifyPw(e.target.value)} placeholder="••••••" className={inputCls} style={inputStyle} autoComplete="current-password" />
            </div>
            {emailError && <p style={{ color: "var(--destructive)", fontSize: "0.82rem", fontWeight: 600 }}>{emailError}</p>}
            <div className="flex gap-2">
              <button onClick={saveEmail} className="rounded-xl px-5 py-2.5 bg-primary text-primary-foreground hover:opacity-90" style={{ fontWeight: 700, fontSize: "0.88rem", transition: "opacity 0.15s" }}>{a.save}</button>
              <button onClick={() => setEmailOpen(false)} className="rounded-xl px-4 py-2.5 border border-border text-foreground hover:bg-muted" style={{ fontWeight: 600, fontSize: "0.88rem", transition: "background-color 0.15s" }}>{a.cancel}</button>
            </div>
          </div>
        )}
      </div>

      {/* Change password */}
      <div className="rounded-xl border border-border overflow-hidden">
        <button
          onClick={() => { setPwOpen((o) => !o); setPwError(""); }}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted text-left"
          style={{ transition: "background-color 0.15s" }}
        >
          <span className="text-foreground" style={{ fontWeight: 600 }}>{pwSaved ? a.saved : a.changePassword}</span>
          {pwOpen ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
        </button>
        {pwOpen && (
          <div className="px-4 pb-4 space-y-3 border-t border-border" style={{ paddingTop: 12 }}>
            {[
              { label: a.currentPasswordLabel, value: currentPw, set: setCurrentPw, autocomplete: "current-password" },
              { label: a.newPasswordLabel, value: newPw, set: setNewPw, autocomplete: "new-password" },
              { label: a.confirmNewPasswordLabel, value: confirmPw, set: setConfirmPw, autocomplete: "new-password" },
            ].map(({ label, value, set, autocomplete }) => (
              <div key={label}>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, marginBottom: 5, color: "var(--foreground)" }}>{label}</label>
                <input type="password" value={value} onChange={(e) => set(e.target.value)} placeholder="••••••" className={inputCls} style={inputStyle} autoComplete={autocomplete} />
              </div>
            ))}
            {pwError && <p style={{ color: "var(--destructive)", fontSize: "0.82rem", fontWeight: 600 }}>{pwError}</p>}
            <div className="flex gap-2">
              <button onClick={savePassword} className="rounded-xl px-5 py-2.5 bg-primary text-primary-foreground hover:opacity-90" style={{ fontWeight: 700, fontSize: "0.88rem", transition: "opacity 0.15s" }}>{a.save}</button>
              <button onClick={() => setPwOpen(false)} className="rounded-xl px-4 py-2.5 border border-border text-foreground hover:bg-muted" style={{ fontWeight: 600, fontSize: "0.88rem", transition: "background-color 0.15s" }}>{a.cancel}</button>
            </div>
          </div>
        )}
      </div>

      {/* Sign out */}
      <button
        onClick={onSignOut}
        className="w-full rounded-xl px-4 py-3 border border-border text-foreground hover:bg-muted text-center"
        style={{ fontWeight: 600, transition: "background-color 0.15s" }}
      >
        {a.signOut}
      </button>
    </div>
  );
}

export function SettingsPage({ settings, onChange, onClose, onResetOnboarding, onClearData, auth, onSignOut, onAuthUpdate }: Props) {
  const t = useLang();
  const s = t.settings;
  const [confirmClear, setConfirmClear] = useState(false);
  const [cleared, setCleared] = useState(false);
  const update = (patch: Partial<A11ySettings>) => onChange({ ...settings, ...patch });

  const handleClear = () => {
    onClearData();
    setConfirmClear(false);
    setCleared(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-foreground" style={{ fontFamily: "var(--app-font-heading, Nunito)" }}>{s.title}</h2>
        <button onClick={onClose} className="rounded-xl p-2 hover:bg-muted" style={{ transition: "background-color 0.15s" }} aria-label="Close settings">
          <X size={20} className="text-foreground" />
        </button>
      </div>

      {/* Account */}
      <div className="steady-card bg-card rounded-2xl p-5 border border-border space-y-3">
        <SectionHeading>{s.sections.account}</SectionHeading>
        <AccountSection auth={auth} onSignOut={onSignOut} onAuthUpdate={onAuthUpdate} />
      </div>

      {/* Appearance */}
      <div className="steady-card bg-card rounded-2xl p-5 border border-border space-y-3">
        <SectionHeading>{s.sections.appearance}</SectionHeading>
        <ToggleRow label={s.darkMode.label} description={s.darkMode.description} value={settings.darkMode} onChange={(v) => update({ darkMode: v })} />
        <OptionRow
          label={s.fontSize.label}
          value={settings.fontSize}
          onChange={(v) => update({ fontSize: v })}
          options={[
            { value: "normal", label: s.fontSize.normal },
            { value: "large", label: s.fontSize.large },
            { value: "xlarge", label: s.fontSize.xlarge },
          ]}
        />
      </div>

      {/* Readability */}
      <div className="steady-card bg-card rounded-2xl p-5 border border-border space-y-3">
        <SectionHeading>{s.sections.readability}</SectionHeading>
        <OptionRow
          label={s.font.label}
          value={settings.font}
          onChange={(v) => update({ font: v })}
          options={[
            { value: "standard", label: s.font.standard },
            { value: "readable", label: s.font.readable },
          ]}
        />
        <OptionRow
          label={s.lineSpacing.label}
          value={settings.lineSpacing}
          onChange={(v) => update({ lineSpacing: v })}
          options={[
            { value: "normal", label: s.lineSpacing.normal },
            { value: "spacious", label: s.lineSpacing.spacious },
          ]}
        />
        <ToggleRow label={s.reduceMotion.label} description={s.reduceMotion.description} value={settings.reduceMotion} onChange={(v) => update({ reduceMotion: v })} />
        <ToggleRow label={s.highContrast.label} description={s.highContrast.description} value={settings.highContrast} onChange={(v) => update({ highContrast: v })} />
      </div>

      {/* Language */}
      <div className="steady-card bg-card rounded-2xl p-5 border border-border space-y-3">
        <SectionHeading>{s.sections.language}</SectionHeading>
        <div className="flex flex-wrap gap-3">
          {(["en", "da"] as Lang[]).map((lang) => (
            <button
              key={lang}
              onClick={() => update({ language: lang })}
              className="flex items-center gap-3 rounded-xl px-4 py-3 border-2 hover:opacity-85"
              style={{
                borderColor: settings.language === lang ? "var(--primary)" : "var(--border)",
                backgroundColor: settings.language === lang ? "var(--green-bg)" : "var(--surface-1)",
                transition: "all 0.15s",
              }}
              aria-pressed={settings.language === lang}
            >
              <span style={{ fontSize: "1.4rem" }}>{lang === "en" ? "🇬🇧" : "🇩🇰"}</span>
              <span className="text-foreground" style={{ fontWeight: settings.language === lang ? 700 : 500 }}>
                {lang === "en" ? "English" : "Dansk"}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Data */}
      <div className="steady-card bg-card rounded-2xl p-5 border border-border space-y-3">
        <SectionHeading>{s.sections.data}</SectionHeading>

        <button
          onClick={onResetOnboarding}
          className="w-full rounded-xl px-4 py-3 border border-border text-foreground hover:bg-muted text-left"
          style={{ fontWeight: 600, transition: "background-color 0.15s" }}
        >
          {s.resetOnboarding}
        </button>

        {!confirmClear && !cleared && (
          <button
            onClick={() => setConfirmClear(true)}
            className="w-full rounded-xl px-4 py-3 text-left hover:opacity-85"
            style={{ backgroundColor: "var(--destructive)", color: "white", fontWeight: 600, transition: "opacity 0.15s", borderRadius: "0.75rem" }}
          >
            {s.clearData}
          </button>
        )}

        {confirmClear && (
          <div className="rounded-xl p-4 border-2" style={{ borderColor: "var(--destructive)", backgroundColor: "var(--surface-1)" }}>
            <p className="text-foreground mb-3" style={{ fontSize: "0.9rem" }}>{s.clearConfirm}</p>
            <div className="flex gap-2">
              <button onClick={handleClear} className="rounded-xl px-5 py-2 text-white hover:opacity-85" style={{ backgroundColor: "var(--destructive)", fontWeight: 700, transition: "opacity 0.15s" }}>
                {s.clearYes}
              </button>
              <button onClick={() => setConfirmClear(false)} className="rounded-xl px-5 py-2 border border-border text-foreground hover:bg-muted" style={{ fontWeight: 600, transition: "background-color 0.15s" }}>
                {s.clearNo}
              </button>
            </div>
          </div>
        )}

        {cleared && (
          <p className="text-primary text-center" style={{ fontWeight: 600 }}>{s.dataCleared}</p>
        )}
      </div>
    </div>
  );
}
