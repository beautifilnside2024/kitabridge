"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

const NAVY = "#1A3F6F";
const BLUE = "#2471A3";
const GREEN = "#1E8449";

const translations = {
  de: {
    subtitle: "Login für Arbeitgeber & Fachkräfte",
    emailLabel: "E-Mail",
    emailPlaceholder: "ihre@email.de",
    passwordLabel: "Passwort",
    forgotPassword: "Passwort vergessen?",
    loginBtn: "Einloggen",
    loginLoading: "Einloggen...",
    errorEmpty: "Bitte alle Felder ausfüllen",
    errorWrong: "E-Mail oder Passwort falsch",
    employerText: "Arbeitgeber?",
    registerNow: "Jetzt registrieren",
    proText: "Fachkraft?",
  },
  en: {
    subtitle: "Login for Employers & Professionals",
    emailLabel: "Email",
    emailPlaceholder: "your@email.com",
    passwordLabel: "Password",
    forgotPassword: "Forgot password?",
    loginBtn: "Log in",
    loginLoading: "Logging in...",
    errorEmpty: "Please fill in all fields",
    errorWrong: "Email or password incorrect",
    employerText: "Employer?",
    registerNow: "Register now",
    proText: "Professional?",
  },
};

const inputStyle = {
  width: "100%", padding: "14px 16px", borderRadius: 12, border: "1.5px solid rgba(255,255,255,0.15)",
  fontSize: "0.95rem", outline: "none", fontFamily: "'DM Sans', sans-serif",
  color: "white", background: "rgba(255,255,255,0.08)", marginBottom: 4, boxSizing: "border-box" 
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [passwort, setPasswort] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lang, setLang] = useState("de");
  const t = translations[lang];

  const handleLogin = async () => {
    if (!email || !passwort) {
      setError(t.errorEmpty);
      return;
    }
    setLoading(true);
    setError("");

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password: passwort
    });

    if (authError) {
      setLoading(false);
      setError(t.errorWrong);
      return;
    }

    const { data: arbeitgeber } = await supabase
      .from("arbeitgeber")
      .select("id")
      .eq("email", email)
      .single();

    if (arbeitgeber) {
      window.location.href = "/dashboard";
    } else {
      window.location.href = "/fachkraft/einstellungen";
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(135deg, ${NAVY} 0%, #0F2340 100%)`,
      display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        input::placeholder { color: rgba(255,255,255,0.3); }
        .lang-btn { background: none; border: 1.5px solid rgba(255,255,255,0.15); border-radius: 8px; padding: 5px 10px; cursor: pointer; font-size: 0.8rem; font-weight: 700; font-family: 'DM Sans', sans-serif; display: flex; align-items: center; gap: 6px; transition: all 0.2s; color: rgba(255,255,255,0.5); }
        .lang-btn:hover { border-color: rgba(255,255,255,0.4); }
        .lang-btn.active { border-color: #4ADE80; color: #4ADE80; }
        .flag-img { width: 20px; height: 14px; border-radius: 2px; object-fit: cover; }
        @media (max-width: 480px) {
          .login-box { padding: 28px 20px !important; border-radius: 18px !important; }
          .login-logo { font-size: 1.6rem !important; }
        }
      `}</style>

      <div style={{ width: "100%", maxWidth: 420 }}>

        {/* Lang switcher */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 24, gap: 6 }}>
          <button className={`lang-btn${lang === "de" ? " active" : ""}`} onClick={() => setLang("de")}>
            <img className="flag-img" src="https://flagcdn.com/w20/de.png" alt="DE" /> DE
          </button>
          <button className={`lang-btn${lang === "en" ? " active" : ""}`} onClick={() => setLang("en")}>
            <img className="flag-img" src="https://flagcdn.com/w20/gb.png" alt="EN" /> EN
          </button>
        </div>

        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <a href="/" style={{ textDecoration: "none", fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 700 }} className="login-logo">
            <span style={{ color: "white" }}>Kita</span><span style={{ color: "#4ADE80" }}>Bridge</span>
          </a>
          <p style={{ color: "rgba(255,255,255,0.5)", marginTop: 8, fontSize: "0.9rem" }}>{t.subtitle}</p>
        </div>

        <div className="login-box" style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 24, padding: 40 }}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "rgba(255,255,255,0.6)", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>{t.emailLabel}</label>
            <input
              style={inputStyle}
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={t.emailPlaceholder}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
            />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "rgba(255,255,255,0.6)", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>{t.passwordLabel}</label>
            <input
              style={inputStyle}
              type="password"
              value={passwort}
              onChange={e => setPasswort(e.target.value)}
              placeholder="••••••••"
              onKeyDown={e => e.key === "Enter" && handleLogin()}
            />
          </div>

          <div style={{ textAlign: "right", marginBottom: 20 }}>
            <a href="/passwort-vergessen" style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.82rem", textDecoration: "none" }}>
              {t.forgotPassword}
            </a>
          </div>

          {error && (
            <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: "10px 14px", marginBottom: 16, color: "#FCA5A5", fontSize: "0.85rem" }}>
              {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{ width: "100%", padding: "14px", borderRadius: 12, border: "none", background: `linear-gradient(135deg, ${BLUE}, #1A5C8A)`, color: "white", fontWeight: 700, fontSize: "0.95rem", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
            {loading ? t.loginLoading : t.loginBtn}
          </button>

          <div style={{ textAlign: "center", marginTop: 20, fontSize: "0.85rem", color: "rgba(255,255,255,0.4)" }}>
            {t.employerText}{" "}
            <a href="/Arbeitgeber" style={{ color: "#4ADE80", textDecoration: "none", fontWeight: 600 }}>{t.registerNow}</a>
          </div>
          <div style={{ textAlign: "center", marginTop: 10, fontSize: "0.85rem", color: "rgba(255,255,255,0.4)" }}>
            {t.proText}{" "}
            <a href="/Registrieren" style={{ color: "#4ADE80", textDecoration: "none", fontWeight: 600 }}>{t.registerNow}</a>
          </div>
        </div>
      </div>
    </div>
  );
}