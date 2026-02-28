"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const NAVY = "#1A3F6F";
const BLUE = "#2471A3";
const GREEN = "#1E8449";

export default function PasswortReset() {
  const router = useRouter();
  const [passwort, setPasswort] = useState("");
  const [passwort2, setPasswort2] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleReset = async () => {
    if (!passwort || !passwort2) {
      setError("Bitte fülle alle Felder aus.");
      return;
    }
    if (passwort !== passwort2) {
      setError("Passwörter stimmen nicht überein.");
      return;
    }
    if (passwort.length < 6) {
      setError("Passwort muss mindestens 6 Zeichen lang sein.");
      return;
    }

    setLoading(true);
    setError("");

    const { error: updateError } = await supabase.auth.updateUser({
      password: passwort,
    });

    setLoading(false);

    if (updateError) {
      setError("Fehler: " + updateError.message);
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/login"), 3000);
  };

  if (success) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <a href="/" style={styles.logo}>
            <span style={{ color: NAVY }}>Kita</span><span style={{ color: GREEN }}>Bridge</span>
          </a>
          <div style={{ fontSize: "3rem", textAlign: "center", marginBottom: 16 }}>✅</div>
          <h2 style={styles.title}>Passwort geändert!</h2>
          <p style={styles.text}>Dein Passwort wurde erfolgreich geändert. Du wirst in 3 Sekunden zum Login weitergeleitet...</p>
          <a href="/login" style={styles.btn}>Zum Login</a>
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

        <h2 style={styles.title}>Neues Passwort</h2>
        <p style={styles.text}>Gib dein neues Passwort ein.</p>

        <div style={{ marginBottom: 16 }}>
          <label style={styles.label}>Neues Passwort</label>
          <input
            type="password"
            value={passwort}
            onChange={e => { setPasswort(e.target.value); setError(""); }}
            placeholder="Mindestens 6 Zeichen"
            style={styles.input}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={styles.label}>Passwort wiederholen</label>
          <input
            type="password"
            value={passwort2}
            onChange={e => { setPasswort2(e.target.value); setError(""); }}
            placeholder="Passwort wiederholen"
            style={styles.input}
          />
        </div>

        {passwort && passwort2 && passwort !== passwort2 && (
          <div style={{ color: "#DC2626", fontSize: "0.82rem", marginBottom: 12 }}>
            Passwörter stimmen nicht überein
          </div>
        )}

        {error && <div style={styles.error}>{error}</div>}

        <button
          onClick={handleReset}
          disabled={loading}
          style={{ ...styles.btn, opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer", border: "none", width: "100%" }}
        >
          {loading ? "Wird gespeichert..." : "Passwort ändern"}
        </button>
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
    marginTop: 16,
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
};
