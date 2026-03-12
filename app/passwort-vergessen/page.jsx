"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

const C = {
  navy: "#0F2442", navyMid: "#1A3F6F", blue: "#2471A3",
  green: "#16A34A", surface: "#F7F9FC", border: "#E4EAF4", muted: "#8A96B0", text: "#1C2B4A",
};

export default function PasswortVergessen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!email) { setError("Bitte gib deine E-Mail Adresse ein."); return; }
    setLoading(true); setError("");
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://www.kitabridge.de/passwort-reset",
    });
    setLoading(false);
    if (resetError) { setError("Fehler: " + resetError.message); return; }
    setSent(true);
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #EEF2F8 0%, #F7F9FC 50%, #EAF0F8 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Sora', sans-serif", padding: "24px 16px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Fraunces:wght@700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { -webkit-font-smoothing: antialiased; }
        input:focus { border-color: ${C.blue} !important; box-shadow: 0 0 0 3px rgba(36,113,163,0.12) !important; outline: none; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pop { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>

      <div style={{ width: "100%", maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <a href="/" style={{ textDecoration: "none" }}>
            <span style={{ fontFamily: "'Fraunces', serif", fontSize: "1.8rem", fontWeight: 800, color: C.navy }}>Kita</span>
            <span style={{ fontFamily: "'Fraunces', serif", fontSize: "1.8rem", fontWeight: 800, color: C.green }}>Bridge</span>
          </a>
        </div>

        <div style={{ background: "white", borderRadius: 24, padding: "32px 28px", border: `1.5px solid ${C.border}`, boxShadow: "0 8px 40px rgba(15,36,66,0.1)", animation: "pop 0.3s ease-out" }}>
          {sent ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#EFF6FF", border: "2px solid #BFDBFE", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px", fontSize: "1.8rem" }}>📧</div>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "1.4rem", fontWeight: 800, color: C.text, marginBottom: 10 }}>E-Mail gesendet!</h2>
              <p style={{ color: C.muted, fontSize: "0.87rem", lineHeight: 1.7, marginBottom: 18 }}>
                Wir haben einen Link an <strong style={{ color: C.text }}>{email}</strong> gesendet. Klicke darauf um dein Passwort zurückzusetzen.
              </p>
              <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 10, padding: "11px 14px", marginBottom: 24, fontSize: "0.82rem", color: "#92400E", textAlign: "left" }}>
                ⚠️ Bitte prüfe auch deinen Spam-Ordner.
              </div>
              <a href="/login" style={{ display: "block", padding: "12px", background: C.navyMid, color: "white", borderRadius: 11, fontWeight: 700, fontSize: "0.9rem", textDecoration: "none", fontFamily: "'Sora', sans-serif" }}>
                Zurück zum Login
              </a>
            </div>
          ) : (
            <>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "1.4rem", fontWeight: 800, color: C.text, marginBottom: 8 }}>Passwort vergessen?</h2>
              <p style={{ color: C.muted, fontSize: "0.86rem", lineHeight: 1.65, marginBottom: 24 }}>
                Gib deine E-Mail Adresse ein und wir senden dir einen Link zum Zurücksetzen.
              </p>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 800, color: C.muted, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 7 }}>E-Mail Adresse</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(""); }}
                  onKeyDown={e => e.key === "Enter" && handleSubmit()}
                  placeholder="deine@email.de"
                  style={{ width: "100%", padding: "11px 14px", border: `1.5px solid ${C.border}`, borderRadius: 11, fontSize: "0.9rem", color: C.text, background: "white", outline: "none", fontFamily: "'Sora', sans-serif" }}
                />
              </div>

              {error && (
                <div style={{ marginBottom: 16, padding: "11px 14px", background: "#FFF5F5", border: "1px solid #FED7D7", borderRadius: 10, color: "#9B1C1C", fontSize: "0.84rem", fontWeight: 500 }}>
                  {error}
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading || !email}
                style={{ width: "100%", padding: "12px", background: loading || !email ? C.border : C.navyMid, color: loading || !email ? C.muted : "white", border: "none", borderRadius: 11, fontWeight: 700, fontSize: "0.9rem", cursor: loading || !email ? "not-allowed" : "pointer", fontFamily: "'Sora', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 16, transition: "all 0.15s" }}
              >
                {loading ? (
                  <><div style={{ width: 15, height: 15, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />Wird gesendet...</>
                ) : "Link senden"}
              </button>

              <a href="/login" style={{ display: "block", textAlign: "center", color: C.muted, fontSize: "0.83rem", fontWeight: 600, textDecoration: "none" }}>
                ← Zurück zum Login
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}