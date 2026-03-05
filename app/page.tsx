"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const NAVY = "#1A3F6F";
const GREEN = "#1E8449";
const BLUE = "#2471A3";

export default function LoginPage() {
  const router = useRouter();
  const [rolle, setRolle] = useState(null); // "kita" oder "fachkraft"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) { setError("E-Mail oder Passwort falsch."); setLoading(false); return; }
    if (rolle === "fachkraft") {
      router.push("/fachkraft/einstellungen");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #F0F4F9, #E8EEF8)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif", padding: "24px 16px" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&family=Playfair+Display:wght@700&display=swap');`}</style>
      <div style={{ width: "100%", maxWidth: 440 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <a href="/" style={{ textDecoration: "none", fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 700 }}>
            <span style={{ color: NAVY }}>Kita</span><span style={{ color: GREEN }}>Bridge</span>
          </a>
        </div>

        <div style={{ background: "white", borderRadius: 24, padding: "36px 32px", boxShadow: "0 4px 32px rgba(26,63,111,0.12)" }}>

          {/* Rollenauswahl */}
          {!rolle ? (
            <div>
              <h1 style={{ fontSize: "1.5rem", color: NAVY, marginBottom: 8, fontFamily: "'Playfair Display', serif" }}>Willkommen zurück</h1>
              <p style={{ color: "#9BA8C0", fontSize: "0.9rem", marginBottom: 28 }}>Wie möchtest du dich anmelden?</p>

              <button onClick={() => setRolle("kita")} style={{ width: "100%", padding: "18px 20px", background: "white", border: `2px solid #E2E8F0`, borderRadius: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 16, marginBottom: 12, transition: "all 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = NAVY}
                onMouseLeave={e => e.currentTarget.style.borderColor = "#E2E8F0"}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: "linear-gradient(135deg, #EEF2FF, #E0E7FF)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", flexShrink: 0 }}>🏫</div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontWeight: 700, color: NAVY, fontSize: "1rem" }}>Als Kita / Einrichtung</div>
                  <div style={{ color: "#9BA8C0", fontSize: "0.82rem" }}>Fachkräfte finden und kontaktieren</div>
                </div>
              </button>

              <button onClick={() => setRolle("fachkraft")} style={{ width: "100%", padding: "18px 20px", background: "white", border: `2px solid #E2E8F0`, borderRadius: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 16, transition: "all 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = GREEN}
                onMouseLeave={e => e.currentTarget.style.borderColor = "#E2E8F0"}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: "linear-gradient(135deg, #EAF7EF, #D1FAE5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", flexShrink: 0 }}>👩‍🍼</div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontWeight: 700, color: NAVY, fontSize: "1rem" }}>Als Fachkraft</div>
                  <div style={{ color: "#9BA8C0", fontSize: "0.82rem" }}>Mein Profil verwalten</div>
                </div>
              </button>
            </div>

          ) : (
            <div>
              {/* Zurück Button */}
              <button onClick={() => { setRolle(null); setError(""); }} style={{ background: "none", border: "none", color: "#9BA8C0", fontSize: "0.85rem", cursor: "pointer", marginBottom: 20, padding: 0, display: "flex", alignItems: "center", gap: 6 }}>
                ← Zurück
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24, padding: "12px 16px", background: rolle === "kita" ? "#EEF2FF" : "#EAF7EF", borderRadius: 12 }}>
                <span style={{ fontSize: "1.3rem" }}>{rolle === "kita" ? "🏫" : "👩‍🍼"}</span>
                <span style={{ fontWeight: 700, color: NAVY, fontSize: "0.9rem" }}>{rolle === "kita" ? "Anmeldung als Kita" : "Anmeldung als Fachkraft"}</span>
              </div>

              {error && <div style={{ marginBottom: 16, padding: "12px 16px", background: "#FFF5F5", borderRadius: 10, color: "#9B1C1C", fontSize: "0.88rem" }}>⚠️ {error}</div>}

              <form onSubmit={handleLogin}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#9BA8C0", marginBottom: 6, textTransform: "uppercase" }}>E-Mail</label>
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    style={{ width: "100%", padding: "12px 16px", border: "1.5px solid #D1DAE8", borderRadius: 12, fontSize: "0.95rem", boxSizing: "border-box", fontFamily: "'DM Sans', sans-serif" }} />
                </div>
                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#9BA8C0", marginBottom: 6, textTransform: "uppercase" }}>Passwort</label>
                  <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                    style={{ width: "100%", padding: "12px 16px", border: "1.5px solid #D1DAE8", borderRadius: 12, fontSize: "0.95rem", boxSizing: "border-box", fontFamily: "'DM Sans', sans-serif" }} />
                </div>
                <button type="submit" disabled={loading}
                  style={{ width: "100%", padding: "14px", background: loading ? "#9BA8C0" : rolle === "kita" ? `linear-gradient(135deg, ${NAVY}, ${BLUE})` : `linear-gradient(135deg, ${GREEN}, #27AE60)`, color: "white", border: "none", borderRadius: 12, fontWeight: 700, fontSize: "1rem", cursor: loading ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                  {loading ? "Wird eingeloggt..." : "Einloggen"}
                </button>
              </form>

              <div style={{ marginTop: 16, textAlign: "center" }}>
                <a href="/passwort-vergessen" style={{ color: BLUE, fontSize: "0.85rem", textDecoration: "none" }}>Passwort vergessen?</a>
              </div>
            </div>
          )}
        </div>

        <p style={{ textAlign: "center", marginTop: 20, color: "#9BA8C0", fontSize: "0.85rem" }}>
          Noch kein Konto?{" "}
          <a href="/Registrieren" style={{ color: BLUE, fontWeight: 600, textDecoration: "none" }}>Jetzt registrieren</a>
        </p>
      </div>
    </div>
  );
}