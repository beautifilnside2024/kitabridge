"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const C = {
  navy: "#0F2442", navyMid: "#1A3F6F", blue: "#2471A3",
  green: "#16A34A", surface: "#F7F9FC", border: "#E4EAF4", muted: "#8A96B0", text: "#1C2B4A",
};

export default function PasswortReset() {
  const router = useRouter();
  const [passwort, setPasswort] = useState("");
  const [passwort2, setPasswort2] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [showP1, setShowP1] = useState(false);
  const [showP2, setShowP2] = useState(false);

  useEffect(() => {
    supabase.auth.onAuthStateChange((event) => {
      // PASSWORD_RECOVERY event aktiviert das Token
    });
  }, []);

  useEffect(() => {
    if (!success) return;
    const t = setInterval(() => {
      setCountdown(c => { if (c <= 1) { clearInterval(t); router.push("/login"); } return c - 1; });
    }, 1000);
    return () => clearInterval(t);
  }, [success]);

  const handleReset = async () => {
    if (!passwort || !passwort2) { setError("Bitte fülle alle Felder aus."); return; }
    if (passwort !== passwort2) { setError("Passwörter stimmen nicht überein."); return; }
    if (passwort.length < 6) { setError("Passwort muss mindestens 6 Zeichen lang sein."); return; }
    setLoading(true); setError("");
    const { error: updateError } = await supabase.auth.updateUser({ password: passwort });
    setLoading(false);
    if (updateError) { setError("Fehler: " + updateError.message); return; }
    setSuccess(true);
  };

  const mismatch = passwort && passwort2 && passwort !== passwort2;
  const inputStyle = { width: "100%", padding: "11px 14px", border: `1.5px solid ${C.border}`, borderRadius: 11, fontSize: "0.9rem", color: C.text, background: "white", outline: "none", fontFamily: "'Sora', sans-serif", paddingRight: 44 };
  const labelStyle = { display: "block", fontSize: "0.68rem", fontWeight: 800, color: C.muted, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 7 };

  const EyeIcon = ({ show }) => show ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
  );

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
          {success ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#ECFDF5", border: "2px solid #A7F3D0", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "1.4rem", fontWeight: 800, color: C.text, marginBottom: 10 }}>Passwort geändert!</h2>
              <p style={{ color: C.muted, fontSize: "0.87rem", lineHeight: 1.7, marginBottom: 24 }}>
                Dein Passwort wurde erfolgreich geändert. Du wirst in {countdown} Sekunden weitergeleitet...
              </p>
              <a href="/login" style={{ display: "block", padding: "12px", background: C.navyMid, color: "white", borderRadius: 11, fontWeight: 700, fontSize: "0.9rem", textDecoration: "none", fontFamily: "'Sora', sans-serif" }}>
                Zum Login
              </a>
            </div>
          ) : (
            <>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "1.4rem", fontWeight: 800, color: C.text, marginBottom: 8 }}>Neues Passwort</h2>
              <p style={{ color: C.muted, fontSize: "0.86rem", lineHeight: 1.65, marginBottom: 24 }}>
                Gib dein neues Passwort ein.
              </p>

              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Neues Passwort</label>
                <div style={{ position: "relative" }}>
                  <input type={showP1 ? "text" : "password"} value={passwort} onChange={e => { setPasswort(e.target.value); setError(""); }} placeholder="Mindestens 6 Zeichen" style={inputStyle} />
                  <button onClick={() => setShowP1(!showP1)} style={{ position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: C.muted, padding: 0, display: "flex" }}>
                    <EyeIcon show={showP1} />
                  </button>
                </div>
                {passwort && (
                  <div style={{ marginTop: 8, display: "flex", gap: 4 }}>
                    {[1,2,3,4].map(i => (
                      <div key={i} style={{ flex: 1, height: 3, borderRadius: 99, background: passwort.length >= i * 3 ? (passwort.length >= 10 ? C.green : C.blue) : C.border, transition: "background 0.2s" }} />
                    ))}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Passwort wiederholen</label>
                <div style={{ position: "relative" }}>
                  <input type={showP2 ? "text" : "password"} value={passwort2} onChange={e => { setPasswort2(e.target.value); setError(""); }} placeholder="Passwort wiederholen" style={{ ...inputStyle, borderColor: mismatch ? "#FCA5A5" : C.border }} />
                  <button onClick={() => setShowP2(!showP2)} style={{ position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: C.muted, padding: 0, display: "flex" }}>
                    <EyeIcon show={showP2} />
                  </button>
                </div>
                {mismatch && <div style={{ marginTop: 6, fontSize: "0.78rem", color: "#DC2626", fontWeight: 600 }}>Passwörter stimmen nicht überein</div>}
              </div>

              {error && (
                <div style={{ marginBottom: 16, padding: "11px 14px", background: "#FFF5F5", border: "1px solid #FED7D7", borderRadius: 10, color: "#9B1C1C", fontSize: "0.84rem", fontWeight: 500 }}>
                  {error}
                </div>
              )}

              <button
                onClick={handleReset}
                disabled={loading || !passwort || !passwort2 || mismatch}
                style={{ width: "100%", padding: "12px", background: loading || !passwort || !passwort2 || mismatch ? C.border : C.navyMid, color: loading || !passwort || !passwort2 || mismatch ? C.muted : "white", border: "none", borderRadius: 11, fontWeight: 700, fontSize: "0.9rem", cursor: loading || !passwort || !passwort2 || mismatch ? "not-allowed" : "pointer", fontFamily: "'Sora', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.15s" }}
              >
                {loading ? (
                  <><div style={{ width: 15, height: 15, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />Wird gespeichert...</>
                ) : "Passwort ändern"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}