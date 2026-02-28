"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

const NAVY = "#1A3F6F";
const BLUE = "#2471A3";
const GREEN = "#1E8449";

export default function PasswortVergessen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!email) {
      setError("Bitte gib deine E-Mail Adresse ein.");
      return;
    }
    setLoading(true);
    setError("");

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://kitabridge.vercel.app/passwort-reset",
    });

    setLoading(false);

    if (resetError) {
      setError("Fehler: " + resetError.message);
      return;
    }

    setSent(true);
  };

  if (sent) {
    return (
      <div style={styles.page}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>
        <div style={styles.card}>
          <a href="/" style={styles.logo}>
            <span style={{ color: NAVY }}>Kita</span><span style={{ color: GREEN }}>Bridge</span>
          </a>
          <div style={{ fontSize: "3rem", marginBottom: 16, textAlign: "center" }}>📧</div>
          <h2 style={styles.title}>E-Mail gesendet!</h2>
          <p style={styles.text}>
            Wir haben eine E-Mail an <strong>{email}</strong> gesendet. Klicke auf den Link in der E-Mail um dein Passwort zurückzusetzen.
          </p>
          <div style={{ background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: 10, padding: 14, marginBottom: 24, fontSize: "0.85rem", color: "#92400E" }}>
            ⚠️ Bitte prüfe auch deinen Spam-Ordner falls du keine E-Mail erhalten hast.
          </div>
          <a href="/login" style={styles.btn}>Zurück zum Login</a>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap'); * { box-sizing: border-box; }`}</style>
      <div style={styles.card}>
        <a href="/" style={styles.logo}>
          <span style={{ color: NAVY }}>Kita</span><span style={{ color: GREEN }}>Bridge</span>
        </a>

        <h2 style={styles.title}>Passwort vergessen?</h2>
        <p style={styles.text}>
          Gib deine E-Mail Adresse ein und wir senden dir einen Link zum Zurücksetzen deines Passworts.
        </p>

        <div style={{ marginBottom: 16 }}>
          <label style={styles.label}>E-Mail Adresse</label>
          <input
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setError(""); }}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            placeholder="deine@email.de"
            style={styles.input}
          />
        </div>

        {error && (
          <div style={styles.error}>{error}</div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{ ...styles.btn, opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer", border: "none", width: "100%", marginBottom: 16 }}
        >
          {loading ? "Wird gesendet..." : "Link senden"}
        </button>

        <a href="/login" style={styles.backLink}>← Zurück zum Login</a>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #F0F4F9, #EAF7EF)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'DM Sans', sans-serif",
    padding: 24,
  },
  card: {
    background: "white",
    borderRadius: 24,
    padding: 40,
    maxWidth: 420,
    width: "100%",
    boxShadow: "0 20px 60px rgba(26,63,111,0.12)",
  },
  logo: {
    display: "block",
    textAlign: "center",
    textDecoration: "none",
    fontFamily: "'Playfair Display', serif",
    fontSize: "1.5rem",
    fontWeight: 700,
    marginBottom: 28,
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "1.6rem",
    color: "#1A3F6F",
    marginBottom: 10,
    textAlign: "center",
  },
  text: {
    color: "#6B7897",
    fontSize: "0.9rem",
    lineHeight: 1.7,
    marginBottom: 24,
    textAlign: "center",
  },
  label: {
    display: "block",
    fontSize: "0.82rem",
    fontWeight: 700,
    color: "#4A5568",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: 10,
    border: "1.5px solid #E2E8F0",
    fontSize: "0.95rem",
    outline: "none",
    fontFamily: "'DM Sans', sans-serif",
    color: "#1a1a2e",
    background: "white",
  },
  btn: {
    display: "block",
    textAlign: "center",
    padding: "13px 28px",
    borderRadius: 50,
    background: `linear-gradient(135deg, #1A3F6F, #2471A3)`,
    color: "white",
    fontWeight: 700,
    fontSize: "0.95rem",
    textDecoration: "none",
    fontFamily: "'DM Sans', sans-serif",
    cursor: "pointer",
  },
  error: {
    background: "#FEF2F2",
    border: "1px solid #FECACA",
    color: "#DC2626",
    padding: "10px 14px",
    borderRadius: 8,
    fontSize: "0.85rem",
    marginBottom: 16,
  },
  backLink: {
    display: "block",
    textAlign: "center",
    color: "#6B7897",
    fontSize: "0.85rem",
    textDecoration: "none",
    marginTop: 8,
  },
};
