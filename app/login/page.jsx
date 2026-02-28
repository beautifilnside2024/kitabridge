"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

const NAVY = "#1A3F6F";
const BLUE = "#2471A3";
const GREEN = "#1E8449";

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

  const handleLogin = async () => {
    if (!email || !passwort) {
      setError("Bitte alle Felder ausfüllen");
      return;
    }
    setLoading(true);
    setError("");

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password: passwort
    });

    setLoading(false);

    if (authError) {
      setError("E-Mail oder Passwort falsch");
      return;
    }

    window.location.href = "/suche";
  };

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(135deg, ${NAVY} 0%, #0F2340 100%)`, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap'); * { box-sizing: border-box; } input::placeholder { color: rgba(255,255,255,0.3); }`}</style>

      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <a href="/" style={{ textDecoration: "none", fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 700 }}>
            <span style={{ color: "white" }}>Kita</span><span style={{ color: "#4ADE80" }}>Bridge</span>
          </a>
          <p style={{ color: "rgba(255,255,255,0.5)", marginTop: 8, fontSize: "0.9rem" }}>Arbeitgeber Login</p>
        </div>

        <div style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 24, padding: 40 }}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "rgba(255,255,255,0.6)", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>E-Mail</label>
            <input
              style={inputStyle}
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="ihre@email.de"
              onKeyDown={e => e.key === "Enter" && handleLogin()}
            />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "rgba(255,255,255,0.6)", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Passwort</label>
            <input
              style={inputStyle}
              type="password"
              value={passwort}
              onChange={e => setPasswort(e.target.value)}
              placeholder="••••••••"
              onKeyDown={e => e.key === "Enter" && handleLogin()}
            />
          </div>

          {/* Passwort vergessen Link */}
          <div style={{ textAlign: "right", marginBottom: 20 }}>
            <a href="/passwort-vergessen" style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.82rem", textDecoration: "none" }}>
              Passwort vergessen?
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
            {loading ? "Einloggen..." : "Einloggen"}
          </button>

          <div style={{ textAlign: "center", marginTop: 20, fontSize: "0.85rem", color: "rgba(255,255,255,0.4)" }}>
            Noch kein Konto?{" "}
            <a href="/Arbeitgeber" style={{ color: "#4ADE80", textDecoration: "none", fontWeight: 600 }}>Jetzt registrieren</a>
          </div>
        </div>
      </div>
    </div>
  );
}
