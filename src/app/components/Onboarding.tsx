import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Camera, X } from "lucide-react";
import { translations, type Lang } from "../i18n/translations";
import { type ProfileData, DEFAULT_PROFILE } from "./profileTypes";
import { DEFAULT_A11Y } from "./a11yTypes";
import { supabase } from "../lib/supabaseClient";
import { resizeImageToBase64 } from "../lib/image";
import { EmojiPicker } from "./ui/EmojiPicker";

const SENSORY_OPTIONS = [
  { key: "Noise-sensitive", emoji: "🔇" },
  { key: "Light-sensitive", emoji: "💡" },
  { key: "Need lots of movement", emoji: "🚶" },
  { key: "Need stillness", emoji: "🧘" },
  { key: "Texture-sensitive", emoji: "🤲" },
  { key: "Smell-sensitive", emoji: "👃" },
];

const SUPPORT_OPTIONS = [
  { key: "Gentle reminders", emoji: "🔔" },
  { key: "Checklists", emoji: "✅" },
  { key: "Quiet focus time", emoji: "🤫" },
  { key: "Written instructions", emoji: "📋" },
  { key: "Extra time to process", emoji: "⏳" },
  { key: "Visual cues", emoji: "👁️" },
];

const TOTAL_STEPS = 7;

interface Props {
  onComplete: (profile: ProfileData) => void;
  onSkip: () => void;
  isGuest?: boolean;
  onRegister?: (email: string, userId: string) => void;
  onPhotoChange?: (photo: string | null) => void;
}

export function Onboarding({ onComplete, onSkip, isGuest, onRegister, onPhotoChange }: Props) {
  const [step, setStep] = useState(0);
  const [lang, setLang] = useState<Lang>("en");
  const [name, setName] = useState("");
  const [pronoun, setPronoun] = useState("");
  const [avatar, setAvatar] = useState("🌱");
  const [photo, setPhoto] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(await resizeImageToBase64(file));
    e.target.value = "";
  };
  const [sensory, setSensory] = useState<string[]>([]);
  const [support, setSupport] = useState<string[]>([]);
  const [fontSize, setFontSize] = useState<"normal" | "large" | "xlarge">("normal");
  const [darkMode, setDarkMode] = useState(false);
  const [readableFont, setReadableFont] = useState(false);

  const t = translations[lang];

  const [signUpOpen, setSignUpOpen] = useState(false);
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpError, setSignUpError] = useState("");

  const [signingUp, setSigningUp] = useState(false);

  const registerAndFinish = async () => {
    setSignUpError("");
    if (!signUpEmail.trim()) { setSignUpError("Please enter your email."); return; }
    if (signUpPassword.length < 6) { setSignUpError("Password must be at least 6 characters."); return; }
    setSigningUp(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: signUpEmail.toLowerCase(),
        password: signUpPassword,
      });
      if (error) {
        setSignUpError(error.message === "User already registered" ? "That email is already in use." : error.message);
        return;
      }
      if (!data.user) { setSignUpError("Something went wrong. Please try again."); return; }
      onRegister?.(signUpEmail.toLowerCase(), data.user.id);
      finish();
    } finally {
      setSigningUp(false);
    }
  };

  const toggleSensory = (key: string) => {
    const isAdding = !sensory.includes(key);
    setSensory((prev) =>
      isAdding ? [...prev, key] : prev.filter((k) => k !== key)
    );
    if (key === "Light-sensitive" && isAdding) setDarkMode(true);
  };

  const toggleSupport = (key: string) =>
    setSupport((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );

  const finish = () => {
    const profile: ProfileData = {
      ...DEFAULT_PROFILE,
      name: name.trim() || DEFAULT_PROFILE.name,
      pronoun,
      avatar,
      sensory,
      support,
      a11y: {
        ...DEFAULT_A11Y,
        language: lang,
        fontSize,
        darkMode,
        font: readableFont ? "readable" : "standard",
      },
    };
    onPhotoChange?.(photo);
    onComplete(profile);
  };

  // Apply dark mode preview during onboarding
  if (darkMode) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "var(--background)", fontFamily: "var(--app-font-body, 'Nunito Sans', sans-serif)" }}
    >
      {/* Step 0: Welcome — no progress bar */}
      {step === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-6">
          <div
            className="rounded-3xl flex items-center justify-center"
            style={{ width: 96, height: 96, backgroundColor: "var(--green-bg)", border: "2px solid var(--border)" }}
          >
            <img src="/sprout1.webp" alt="Sprout, Steady's mascot" style={{ width: 80, height: 80, objectFit: "contain" }} />
          </div>
          <div>
            <h1 className="text-foreground" style={{ fontFamily: "var(--app-font-heading, Nunito)", fontSize: "2rem", fontWeight: 800, marginBottom: 12 }}>
              {t.onboarding.welcome.title}
            </h1>
            <p className="text-muted-foreground" style={{ fontSize: "1.05rem", lineHeight: 1.7, maxWidth: 320 }}>
              {t.onboarding.welcome.subtitle}
            </p>
          </div>
          <button
            onClick={() => setStep(1)}
            className="w-full max-w-xs rounded-2xl py-4 bg-primary text-primary-foreground hover:opacity-90"
            style={{ fontWeight: 700, fontSize: "1.05rem", transition: "opacity 0.15s" }}
          >
            {t.onboarding.welcome.start}
          </button>
          <div className="flex items-center gap-3 w-full max-w-xs">
            <div className="flex-1 h-px" style={{ backgroundColor: "var(--border)" }} />
            <span className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>or</span>
            <div className="flex-1 h-px" style={{ backgroundColor: "var(--border)" }} />
          </div>
          <button onClick={onSkip} className="text-muted-foreground hover:text-foreground" style={{ fontSize: "0.88rem", transition: "color 0.15s" }}>
            {isGuest ? t.onboarding.welcome.skipGuest : t.onboarding.welcome.returning}
          </button>
        </div>
      )}

      {/* Steps 1–7 */}
      {step >= 1 && (
        <>
          {/* Progress bar */}
          <div className="px-6 pt-6 pb-2 flex items-center gap-3 max-w-lg mx-auto w-full">
            <button onClick={() => setStep((s) => Math.max(1, s - 1))} aria-label={t.lang === "en" ? "Go back" : "Gå tilbage"} className="text-muted-foreground hover:text-foreground p-3" style={{ transition: "color 0.15s" }}>
              <ArrowLeft size={20} />
            </button>
            <div className="flex-1 flex gap-1.5">
              {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-full"
                  style={{
                    height: 4,
                    backgroundColor: i < step ? "var(--primary)" : "var(--surface-2)",
                    transition: "background-color 0.3s",
                  }}
                />
              ))}
            </div>
            <span className="text-muted-foreground" style={{ fontSize: "0.8rem", minWidth: 40, textAlign: "right" }}>
              {t.onboarding.stepOf(step, TOTAL_STEPS)}
            </span>
          </div>

          <div className="flex-1 flex flex-col px-6 py-4 max-w-lg mx-auto w-full">

            {/* Step 1: Name */}
            {step === 1 && (
              <div className="flex flex-col gap-5 flex-1">
                <div>
                  <h2 className="text-foreground mb-2" style={{ fontFamily: "var(--app-font-heading, Nunito)", fontWeight: 800 }}>
                    {t.onboarding.name.title}
                  </h2>
                  <p className="text-muted-foreground" style={{ fontSize: "0.95rem" }}>{t.onboarding.name.subtitle}</p>
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.onboarding.name.namePlaceholder}
                  autoFocus
                  className="w-full rounded-2xl px-5 py-4 border border-border bg-card text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
                  style={{ fontSize: "1.1rem", transition: "border-color 0.15s" }}
                />
                <select
                  value={pronoun}
                  onChange={(e) => setPronoun(e.target.value)}
                  className="w-full rounded-2xl px-5 py-4 border border-border bg-card text-foreground outline-none focus:border-primary appearance-none"
                  style={{ fontSize: "1rem", transition: "border-color 0.15s", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236B6560' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 16px center", paddingRight: "3rem" }}
                >
                  <option value="">{t.onboarding.name.pronounPlaceholder}</option>
                  {t.profile.pronounsOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Step 2: Avatar */}
            {step === 2 && (
              <div className="flex flex-col gap-5 flex-1">
                <div>
                  <h2 className="text-foreground mb-2" style={{ fontFamily: "var(--app-font-heading, Nunito)", fontWeight: 800 }}>
                    {t.onboarding.avatar.title}
                  </h2>
                  <p className="text-muted-foreground" style={{ fontSize: "0.95rem" }}>{t.onboarding.avatar.subtitle}</p>
                </div>
                <div
                  className="rounded-2xl p-4 flex items-center justify-center border border-border bg-card overflow-hidden"
                  style={{ fontSize: "4rem", height: 100 }}
                >
                  {photo ? (
                    <img src={photo} alt="" style={{ width: 100, height: 100, objectFit: "cover", borderRadius: "inherit" }} />
                  ) : (
                    avatar
                  )}
                </div>
                <input ref={photoInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => photoInputRef.current?.click()}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-2 border border-border text-foreground hover:bg-muted"
                    style={{ fontSize: "0.85rem", fontWeight: 600, transition: "background-color 0.15s" }}
                  >
                    <Camera size={14} />{photo ? t.profile.changePhoto : t.profile.addPhoto}
                  </button>
                  {photo && (
                    <button onClick={() => setPhoto(null)} className="rounded-lg p-2 border border-border text-muted-foreground hover:text-destructive" aria-label={t.profile.removePhoto}>
                      <X size={14} />
                    </button>
                  )}
                </div>
                {photo && (
                  <p className="text-muted-foreground text-center" style={{ fontSize: "0.82rem" }}>
                    {t.onboarding.avatar.orPickEmoji}
                  </p>
                )}
                <EmojiPicker value={avatar} onChange={setAvatar} layout="grid" groupLabel={t.onboarding.avatar.title} />
              </div>
            )}

            {/* Step 3: Language */}
            {step === 3 && (
              <div className="flex flex-col gap-5 flex-1">
                <div>
                  <h2 className="text-foreground mb-2" style={{ fontFamily: "var(--app-font-heading, Nunito)", fontWeight: 800 }}>
                    {t.onboarding.language.title}
                  </h2>
                  <p className="text-muted-foreground" style={{ fontSize: "0.95rem" }}>{t.onboarding.language.subtitle}</p>
                </div>
                <div className="flex flex-col gap-3">
                  {(["en", "da"] as Lang[]).map((l) => (
                    <button
                      key={l}
                      onClick={() => setLang(l)}
                      className="flex items-center gap-4 rounded-2xl px-5 py-4 border-2 text-left hover:opacity-85"
                      style={{
                        backgroundColor: lang === l ? "var(--green-bg)" : "var(--card)",
                        borderColor: lang === l ? "var(--primary)" : "var(--border)",
                        transition: "all 0.15s",
                      }}
                    >
                      <span style={{ fontSize: "2rem" }}>{l === "en" ? "🇬🇧" : "🇩🇰"}</span>
                      <div>
                        <p className="text-foreground" style={{ fontWeight: 700 }}>{l === "en" ? "English" : "Dansk"}</p>
                        <p className="text-muted-foreground" style={{ fontSize: "0.85rem" }}>
                          {l === "en" ? "English" : "Danish"}
                        </p>
                      </div>
                      {lang === l && (
                        <div className="ml-auto rounded-full bg-primary flex items-center justify-center" style={{ width: 24, height: 24 }}>
                          <Check size={14} color="white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                <p className="text-muted-foreground text-center" style={{ fontSize: "0.8rem" }}>
                  {t.onboarding.language.moreComing}
                </p>
              </div>
            )}

            {/* Step 4: Sensory */}
            {step === 4 && (
              <div className="flex flex-col gap-5 flex-1">
                <div>
                  <h2 className="text-foreground mb-2" style={{ fontFamily: "var(--app-font-heading, Nunito)", fontWeight: 800 }}>
                    {t.onboarding.sensory.title}
                  </h2>
                  <p className="text-muted-foreground" style={{ fontSize: "0.95rem" }}>{t.onboarding.sensory.subtitle}</p>
                </div>
                <div className="flex flex-col gap-2">
                  {SENSORY_OPTIONS.map((opt) => {
                    const active = sensory.includes(opt.key);
                    const label = t.profile.sensory.options.find((o) => o.key === opt.key)?.label ?? opt.key;
                    return (
                      <button
                        key={opt.key}
                        onClick={() => toggleSensory(opt.key)}
                        className="flex items-center gap-4 rounded-2xl px-5 py-4 border-2 text-left hover:opacity-85"
                        style={{
                          backgroundColor: active ? "var(--green-bg)" : "var(--card)",
                          borderColor: active ? "var(--primary)" : "var(--border)",
                          transition: "all 0.15s",
                        }}
                        aria-pressed={active}
                      >
                        <span style={{ fontSize: "1.5rem", width: 32 }}>{opt.emoji}</span>
                        <span className="text-foreground flex-1" style={{ fontWeight: active ? 700 : 500 }}>{label}</span>
                        {active && (
                          <div className="rounded-full bg-primary flex items-center justify-center" style={{ width: 24, height: 24, flexShrink: 0 }}>
                            <Check size={14} color="white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 5: Support */}
            {step === 5 && (
              <div className="flex flex-col gap-5 flex-1">
                <div>
                  <h2 className="text-foreground mb-2" style={{ fontFamily: "var(--app-font-heading, Nunito)", fontWeight: 800 }}>
                    {t.onboarding.support.title}
                  </h2>
                  <p className="text-muted-foreground" style={{ fontSize: "0.95rem" }}>{t.onboarding.support.subtitle}</p>
                </div>
                <div className="flex flex-col gap-2">
                  {SUPPORT_OPTIONS.map((opt) => {
                    const active = support.includes(opt.key);
                    const label = t.profile.support.options.find((o) => o.key === opt.key)?.label ?? opt.key;
                    return (
                      <button
                        key={opt.key}
                        onClick={() => toggleSupport(opt.key)}
                        className="flex items-center gap-4 rounded-2xl px-5 py-4 border-2 text-left hover:opacity-85"
                        style={{
                          backgroundColor: active ? "var(--purple-bg)" : "var(--card)",
                          borderColor: active ? "var(--purple-vivid)" : "var(--border)",
                          transition: "all 0.15s",
                        }}
                        aria-pressed={active}
                      >
                        <span style={{ fontSize: "1.5rem", width: 32 }}>{opt.emoji}</span>
                        <span className="text-foreground flex-1" style={{ fontWeight: active ? 700 : 500 }}>{label}</span>
                        {active && (
                          <div className="rounded-full flex items-center justify-center" style={{ width: 24, height: 24, backgroundColor: "var(--purple-vivid)", flexShrink: 0 }}>
                            <Check size={14} color="white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 6: Quick setup */}
            {step === 6 && (
              <div className="flex flex-col gap-5 flex-1">
                <div>
                  <h2 className="text-foreground mb-2" style={{ fontFamily: "var(--app-font-heading, Nunito)", fontWeight: 800 }}>
                    {t.onboarding.setup.title}
                  </h2>
                  <p className="text-muted-foreground" style={{ fontSize: "0.95rem" }}>{t.onboarding.setup.subtitle}</p>
                </div>

                <div className="bg-card rounded-2xl p-5 border border-border space-y-4">
                  <div>
                    <p className="text-foreground mb-3" style={{ fontWeight: 700 }}>{t.onboarding.setup.textSize}</p>
                    <div className="flex gap-2">
                      {(["normal", "large", "xlarge"] as const).map((size) => {
                        const labels = { normal: t.a11y.fontSize.normal, large: t.a11y.fontSize.large, xlarge: t.a11y.fontSize.xlarge };
                        return (
                          <button
                            key={size}
                            onClick={() => setFontSize(size)}
                            className="flex-1 rounded-xl py-3 border-2"
                            style={{
                              backgroundColor: fontSize === size ? "var(--green-bg)" : "var(--surface-1)",
                              borderColor: fontSize === size ? "var(--primary)" : "transparent",
                              color: "var(--foreground)",
                              fontWeight: 600,
                              fontSize: size === "normal" ? "13px" : size === "large" ? "15px" : "17px",
                              whiteSpace: "nowrap",
                              transition: "all 0.15s",
                            }}
                          >
                            {labels[size]}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {[
                    { label: t.onboarding.setup.darkMode, value: darkMode, set: setDarkMode },
                    { label: t.onboarding.setup.font, value: readableFont, set: setReadableFont },
                  ].map(({ label, value, set }) => (
                    <button
                      key={label}
                      onClick={() => set(!value)}
                      className="w-full flex items-center justify-between rounded-xl p-4 border-2"
                      style={{
                        backgroundColor: value ? "var(--green-bg)" : "var(--surface-1)",
                        borderColor: value ? "var(--primary)" : "transparent",
                        transition: "all 0.15s",
                      }}
                      aria-pressed={value}
                    >
                      <span className="text-foreground" style={{ fontWeight: value ? 700 : 500 }}>{label}</span>
                      <div className="rounded-full relative" style={{ width: 44, height: 24, backgroundColor: value ? "var(--primary)" : "var(--muted-foreground)" }}>
                        <div className="absolute top-1 rounded-full bg-white" style={{ width: 16, height: 16, left: value ? 24 : 4, transition: "left 0.2s" }} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 7: Done */}
            {step === 7 && (
              <div className="flex flex-col items-center text-center gap-6 flex-1 justify-center">
                {photo ? (
                  <img src={photo} alt="" style={{ width: 96, height: 96, objectFit: "cover", borderRadius: "9999px" }} />
                ) : (
                  <div style={{ fontSize: "5rem", lineHeight: 1 }}>{avatar}</div>
                )}
                <div>
                  <h2 className="text-foreground mb-3" style={{ fontFamily: "var(--app-font-heading, Nunito)", fontWeight: 800, fontSize: "1.8rem" }}>
                    {name ? `${t.onboarding.done.title.replace("!", "")} ${name}! ✨` : t.onboarding.done.title}
                  </h2>
                  <p className="text-muted-foreground" style={{ fontSize: "1rem", lineHeight: 1.7 }}>
                    {t.onboarding.done.subtitle}
                  </p>
                </div>
                <div className="w-full space-y-2">
                  {[
                    name && `👋 ${name}${pronoun ? ` (${pronoun})` : ""}`,
                    lang === "da" ? "🇩🇰 Dansk" : "🇬🇧 English",
                    sensory.length > 0 && `🧠 ${sensory.length} sensory note${sensory.length > 1 ? "s" : ""}`,
                    support.length > 0 && `✨ ${support.length} support style${support.length > 1 ? "s" : ""}`,
                  ].filter(Boolean).map((line, i) => (
                    <div key={i} className="rounded-xl px-4 py-2 text-left" style={{ backgroundColor: "var(--surface-1)" }}>
                      <p className="text-foreground" style={{ fontSize: "0.9rem" }}>{line as string}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom buttons */}
            <div className="pt-6 pb-4 flex flex-col gap-3">
              {step === 7 ? (
                <>
                  {isGuest && onRegister && (
                    <div className="rounded-2xl border border-border overflow-hidden" style={{ backgroundColor: "var(--surface-1)" }}>
                      <button
                        onClick={() => { setSignUpOpen((o) => !o); setSignUpError(""); }}
                        className="w-full flex items-center justify-between px-4 py-3 text-left hover:opacity-85"
                        style={{ transition: "opacity 0.15s" }}
                      >
                        <div>
                          <p className="text-foreground" style={{ fontWeight: 700, fontSize: "0.95rem" }}>Save your setup</p>
                          <p className="text-muted-foreground" style={{ fontSize: "0.8rem" }}>Create a free account to keep your data</p>
                        </div>
                        <span className="text-muted-foreground" style={{ fontSize: "1.2rem", lineHeight: 1 }}>{signUpOpen ? "−" : "+"}</span>
                      </button>
                      {signUpOpen && (
                        <div className="px-4 pb-4 space-y-2.5 border-t border-border" style={{ paddingTop: 12 }}>
                          <input
                            type="email"
                            value={signUpEmail}
                            onChange={(e) => setSignUpEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full rounded-xl px-4 py-2.5 border border-border bg-input-background text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
                            style={{ fontSize: "0.9rem", transition: "border-color 0.15s" }}
                            autoComplete="email"
                          />
                          <input
                            type="password"
                            value={signUpPassword}
                            onChange={(e) => setSignUpPassword(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && registerAndFinish()}
                            placeholder="Password (6+ characters)"
                            className="w-full rounded-xl px-4 py-2.5 border border-border bg-input-background text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
                            style={{ fontSize: "0.9rem", transition: "border-color 0.15s" }}
                            autoComplete="new-password"
                          />
                          {signUpError && (
                            <p style={{ color: "var(--destructive)", fontSize: "0.82rem", fontWeight: 600 }}>{signUpError}</p>
                          )}
                          <button
                            onClick={registerAndFinish}
                            disabled={signingUp}
                            className="w-full rounded-xl py-3 bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-60"
                            style={{ fontWeight: 700, fontSize: "0.95rem", transition: "opacity 0.15s" }}
                          >
                            Create account &amp; enter Steady
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  <button onClick={finish} className="w-full rounded-2xl py-4 bg-primary text-primary-foreground hover:opacity-90" style={{ fontWeight: 700, fontSize: "1.05rem", transition: "opacity 0.15s" }}>
                    {t.onboarding.done.enter}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setStep((s) => s + 1)}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl py-4 bg-primary text-primary-foreground hover:opacity-90"
                    style={{ fontWeight: 700, fontSize: "1.05rem", transition: "opacity 0.15s" }}
                  >
                    {t.onboarding.next}
                    <ArrowRight size={18} />
                  </button>
                  {(step === 4 || step === 5) && (
                    <button onClick={() => setStep((s) => s + 1)} className="text-muted-foreground hover:text-foreground text-center py-1" style={{ fontSize: "0.9rem", transition: "color 0.15s" }}>
                      {step === 4 ? t.onboarding.sensory.skip : t.onboarding.support.skip}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
