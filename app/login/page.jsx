"use client";
import { useState, useEffect, Suspense } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";

const C = {
  navy: "#0F2442", navyMid: "#1A3F6F", blue: "#2471A3",
  green: "#16A34A", red: "#DC2626",
  surface: "#F7F9FC", border: "#E4EAF4", muted: "#8A96B0", text: "#1C2B4A",
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [rolle, setRolle] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
  const rolleParam = searchParams.get("rolle");
  if (rolleParam === "fachkraft") setRolle("fachkraft");
  if (rolleParam === "kita") setRolle("kita");
  if (rolleParam === "arbeitgeber") setRolle("kita");

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        const redirect = searchParams.get("redirect");
        supabase.from("arbeitgeber").select("id").eq("email", session.user.email).single()
          .then(({ data }) => {
            if (redirect) router.replace(redirect);
            else if (data) router.replace("/arbeitgeber/dashboard");
            else router.replace("/fachkraft/dashboard");
          });
      } else {
        setChecking(false);
      }
    });
  }, []);

  const handleLogin = async () => {
    if (!email || !password) { setError("Bitte E-Mail und Passwort eingeben."); return; }
    setLoading(true);
    setError("");
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) { setError("E-Mail oder Passwort falsch."); setLoading(false); return; }

    // ── Nach Login: redirect-Parameter prüfen ────────────────────────────
    const redirect = searchParams.get("redirect");
    if (redirect) {
      router.replace(redirect);
      return;
    }
    if (rolle === "kita") router.replace("/arbeitgeber/dashboard");
    else router.replace("/fachkraft/dashboard");
  };

  if (checking) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      <div style={{ width: 36, height: 36, border: `3px solid ${C.border}`, borderTopColor: C.navyMid, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <span style={{ fontSize: "0.84rem", color: C.muted, fontWeight: 600 }}>Einen Moment...</span>
    </div>
  );

  return (
    <div style={{ width: "100%", maxWidth: 420 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Fraunces:wght@700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { -webkit-font-smoothing: antialiased; }
        input:focus { border-color: ${C.blue} !important; box-shadow: 0 0 0 3px rgba(36,113,163,0.12) !important; outline: none; }
        .rolle-btn { width: 100%; padding: 18px 20px; background: white; border: 1.5px solid ${C.border}; border-radius: 16px; cursor: pointer; display: flex; align-items: center; gap: 16px; transition: all 0.15s; text-align: left; font-family: 'Sora', sans-serif; }
        .rolle-btn:hover { border-color: ${C.navyMid}; box-shadow: 0 4px 16px rgba(26,63,111,0.1); transform: translateY(-1px); }
        .btn-back { background: none; border: none; color: ${C.muted}; font-size: 0.82rem; cursor: pointer; font-family: 'Sora', sans-serif; font-weight: 600; display: flex; align-items: center; gap: 6px; padding: 0; margin-bottom: 24px; transition: color 0.15s; }
        .btn-back:hover { color: ${C.navyMid}; }
        .input-field { width: 100%; padding: 12px 16px; border: 1.5px solid ${C.border}; border-radius: 11px; font-size: 0.9rem; font-family: 'Sora', sans-serif; color: ${C.text}; background: white; outline: none; transition: all 0.15s; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <a href="/" style={{ textDecoration: "none" }}>
          <span style={{ fontFamily: "'Fraunces', serif", fontSize: "2rem", fontWeight: 800, color: C.navy }}>Kita</span>
          <span style={{ fontFamily: "'Fraunces', serif", fontSize: "2rem", fontWeight: 800, color: C.green }}>Bridge</span>
        </a>
        <div style={{ fontSize: "0.78rem", color: C.muted, fontWeight: 600, marginTop: 4, letterSpacing: "0.5px" }}>
          Die Plattform für pädagogische Fachkräfte
        </div>
      </div>

      {/* Card */}
      <div style={{ background: "white", borderRadius: 24, padding: "32px 28px", border: `1.5px solid ${C.border}`, boxShadow: "0 8px 40px rgba(15,36,66,0.1)" }}>

        {/* Rollenauswahl */}
        {!rolle && (
          <div>
            <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "1.6rem", fontWeight: 800, color: C.text, marginBottom: 6 }}>Willkommen</h1>
            <p style={{ color: C.muted, fontSize: "0.84rem", marginBottom: 28, fontWeight: 500 }}>Wie möchtest du dich anmelden?</p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button className="rolle-btn" onClick={() => setRolle("kita")}>
                <div style={{ width: 46, height: 46, borderRadius: 13, background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", flexShrink: 0 }}>🏫</div>
                <div>
                  <div style={{ fontWeight: 700, color: C.text, fontSize: "0.95rem", marginBottom: 2 }}>Als Kita / Einrichtung</div>
                  <div style={{ color: C.muted, fontSize: "0.79rem" }}>Fachkräfte finden und kontaktieren</div>
                </div>
                <div style={{ marginLeft: "auto", color: C.muted }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              </button>

              <button className="rolle-btn" onClick={() => setRolle("fachkraft")}>
                <div style={{ width: 46, height: 46, borderRadius: 13, background: "#ECFDF5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", flexShrink: 0 }}>👩‍🍼</div>
                <div>
                  <div style={{ fontWeight: 700, color: C.text, fontSize: "0.95rem", marginBottom: 2 }}>Als Fachkraft</div>
                  <div style={{ color: C.muted, fontSize: "0.79rem" }}>Mein Profil verwalten</div>
                </div>
                <div style={{ marginLeft: "auto", color: C.muted }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              </button>
            </div>

            <div style={{ marginTop: 24, padding: "16px", background: C.surface, borderRadius: 12, fontSize: "0.79rem", color: C.muted, textAlign: "center" }}>
              <div style={{ marginBottom: 10, fontWeight: 600 }}>Noch kein Konto?</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <a href="/arbeitgeber/registrieren" style={{ display: "block", padding: "9px 14px", background: "white", border: `1.5px solid ${C.border}`, borderRadius: 10, color: C.navyMid, fontWeight: 700, textDecoration: "none", fontSize: "0.82rem" }}>
                  🏫 Als Kita registrieren
                </a>
                <a href="/Registrieren" style={{ display: "block", padding: "9px 14px", background: "white", border: `1.5px solid ${C.border}`, borderRadius: 10, color: C.green, fontWeight: 700, textDecoration: "none", fontSize: "0.82rem" }}>
                  👩‍🍼 Als Fachkraft registrieren
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Login Form */}
        {rolle && (
          <div>
            <button className="btn-back" onClick={() => { setRolle(null); setError(""); }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
              Zurück
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: rolle === "kita" ? "#EFF6FF" : "#ECFDF5", borderRadius: 12, marginBottom: 26, border: `1px solid ${rolle === "kita" ? "#BFDBFE" : "#A7F3D0"}` }}>
              <span style={{ fontSize: "1.1rem" }}>{rolle === "kita" ? "🏫" : "👩‍🍼"}</span>
              <span style={{ fontWeight: 700, color: C.text, fontSize: "0.88rem" }}>
                {rolle === "kita" ? "Anmeldung als Kita" : "Anmeldung als Fachkraft"}
              </span>
            </div>

            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "1.4rem", fontWeight: 800, color: C.text, marginBottom: 22 }}>Einloggen</h2>

            {error && (
              <div style={{ marginBottom: 16, padding: "12px 15px", background: "#FFF5F5", border: "1px solid #FED7D7", borderRadius: 10, color: "#9B1C1C", fontSize: "0.84rem", fontWeight: 500 }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 800, color: C.muted, textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: 7 }}>E-Mail</label>
              <input
                className="input-field"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                placeholder="deine@email.de"
                autoComplete="email"
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 800, color: C.muted, textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: 7 }}>Passwort</label>
              <div style={{ position: "relative" }}>
                <input
                  className="input-field"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleLogin()}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  style={{ paddingRight: 44 }}
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: C.muted, padding: 0, display: "flex", alignItems: "center" }}
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              style={{ width: "100%", padding: "13px", background: loading ? C.border : rolle === "kita" ? C.navyMid : C.green, color: loading ? C.muted : "white", border: "none", borderRadius: 12, fontWeight: 700, fontSize: "0.95rem", cursor: loading ? "not-allowed" : "pointer", fontFamily: "'Sora', sans-serif", transition: "all 0.15s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
            >
              {loading ? (
                <>
                  <div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                  Wird eingeloggt...
                </>
              ) : "Einloggen"}
            </button>

            <div style={{ marginTop: 18, textAlign: "center" }}>
              <a href="/passwort-vergessen" style={{ color: C.blue, fontSize: "0.82rem", textDecoration: "none", fontWeight: 600 }}>
                Passwort vergessen?
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", marginTop: 24, fontSize: "0.75rem", color: C.muted }}>
        <a href="/datenschutz" style={{ color: C.muted, textDecoration: "none", marginRight: 12 }}>Datenschutz</a>
        <a href="/impressum" style={{ color: C.muted, textDecoration: "none", marginRight: 12 }}>Impressum</a>
        <a href="/agb" style={{ color: C.muted, textDecoration: "none" }}>AGB</a>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #EEF2F8 0%, #F7F9FC 50%, #EAF0F8 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Sora', sans-serif", padding: "24px 16px", position: "relative" }}>
      <div style={{ position: "fixed", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(36,113,163,0.06), transparent)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: -100, left: -100, width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(22,163,74,0.05), transparent)", pointerEvents: "none" }} />
      <Suspense fallback={
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <div style={{ width: 36, height: 36, border: "3px solid #E4EAF4", borderTopColor: "#1A3F6F", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}