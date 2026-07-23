import { useState } from "react";
import { X, Check } from "lucide-react";
import { useLang } from "../i18n/LangContext";
import { IconButton } from "./ui/IconButton";

interface Props {
  open: boolean;
  onClose: () => void;
}

function encodeFormData(data: Record<string, string>) {
  return Object.keys(data)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join("&");
}

export function FeedbackForm({ open, onClose }: Props) {
  const t = useLang();
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  if (!open) return null;

  const handleClose = () => {
    onClose();
    // Reset after the dialog is gone, not while it's still visible closing.
    setTimeout(() => {
      setMessage("");
      setEmail("");
      setStatus("idle");
    }, 200);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setStatus("sending");
    try {
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encodeFormData({ "form-name": "feedback", message: message.trim(), email: email.trim() }),
      });
      if (!res.ok) throw new Error("Form submission failed");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-dialog-title"
        className="w-full max-w-md rounded-2xl border border-border flex flex-col"
        style={{ backgroundColor: "var(--card)", maxHeight: "85vh" }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
          <h3 id="feedback-dialog-title" className="text-foreground" style={{ fontFamily: "var(--app-font-heading, Nunito)" }}>
            {t.feedback.title}
          </h3>
          <IconButton size="md" onClick={handleClose} aria-label={t.feedback.close}>
            <X size={18} />
          </IconButton>
        </div>

        <div className="overflow-y-auto px-6 py-5">
          {status === "sent" ? (
            <div className="text-center py-6 space-y-2">
              <div
                className="mx-auto rounded-full flex items-center justify-center"
                style={{ width: 44, height: 44, backgroundColor: "var(--green-bg)" }}
              >
                <Check size={20} style={{ color: "var(--green-text)" }} />
              </div>
              <p className="text-foreground" style={{ fontWeight: 700 }}>{t.feedback.thanksTitle}</p>
              <p className="text-muted-foreground" style={{ fontSize: "0.9rem" }}>{t.feedback.thanksBody}</p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <p className="text-muted-foreground" style={{ fontSize: "0.88rem", lineHeight: 1.6 }}>
                {t.feedback.subtitle}
              </p>
              <div>
                <label className="text-foreground" style={{ display: "block", marginBottom: 6, fontSize: "0.9rem" }}>
                  {t.feedback.messageLabel}
                </label>
                <textarea
                  autoFocus
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t.feedback.messagePlaceholder}
                  rows={4}
                  className="w-full rounded-xl px-4 py-3 border border-border bg-input-background text-foreground placeholder:text-muted-foreground outline-none focus:border-primary resize-none"
                  style={{ transition: "border-color 0.15s" }}
                />
              </div>
              <div>
                <label className="text-foreground" style={{ display: "block", marginBottom: 6, fontSize: "0.9rem" }}>
                  {t.feedback.emailLabel}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.feedback.emailPlaceholder}
                  className="w-full rounded-xl px-4 py-3 border border-border bg-input-background text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
                  style={{ transition: "border-color 0.15s" }}
                />
              </div>
              {status === "error" && (
                <p style={{ color: "var(--destructive)", fontSize: "0.85rem" }}>{t.feedback.error}</p>
              )}
              <button
                type="submit"
                disabled={status === "sending" || !message.trim()}
                className="w-full rounded-xl py-3 bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50"
                style={{ fontWeight: 700, transition: "opacity 0.15s" }}
              >
                {status === "sending" ? t.feedback.sending : t.feedback.send}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
