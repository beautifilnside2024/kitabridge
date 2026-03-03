"use client";
import { useState } from "react";

const NAVY = "#1A3F6F";
const BLUE = "#2471A3";
const GREEN = "#1E8449";

export default function Kontakt() {
  const [form, setForm] = useState({ name: "", email: "", betreff: "", nachricht: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const set = (key, value) => setForm(f => ({ ...f, [key]: value }));

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.nachricht) {
      setError("Bitte fülle alle Pflichtfelder aus.");
      return;
    }
    setLoading(true);
    setError("");

    await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: "hallo@kitabridge.de",
        subject: `Kontaktanfrage: ${form.betreff || "Allgemeine Anfrage"} – von ${form.name}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
            <div style="background:#1A3F6F;padding:24px 32px">
              <h1 style="color:white;margin:0;font-size:20px">KitaBridge – Neue Kontaktanfrage</h1>
            </div>
            <div style="padding:32px;background:#fff">
              <table style="width:100%;font-size:15px">
                <tr><td style="color:#9BA8C0;padding:8px 0;width:140px">Name</td><td style="color:#1a1a2e;font-weight:600">${form.name}</td></tr>
                <tr><td style="color:#9BA8C0;padding:8px 0">E-Mail</td><td style="color:#1a1a2e;font-weight:600">${form.email}</td></tr>
                <tr><td style="color:#9BA8C0;padding:8px 0">Betreff</td><td style="color:#1a1a2e;font-weight:600">${form.betreff || "-"}</td></tr>
              </table>
              <div style="background:#F8FAFF;border-radius:12px;padding:20px;margin-top:20px">
                <p style="color:#1A3F6F;font-weight:700;margin:0 0 10px">Nachricht:</p>
                <p style="color:#444;line-height:1.8;margin:0">${form.nachricht.replace(/\n/g, "<br/>")}</p>
              </div>
              <p style="color:#9BA8C0;font-size:12px;margin-top:24px">Antworten an: <a href="mailto:${form.email}">${form.email}</a></p>
            </div>
          </div>
        `
      })
    });

    setLoading(false);
    setSent(true);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFF", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        input:focus, select:focus, textarea:focus { border-color: ${BLUE} !important; box-shadow: 0 0 0 3px rgba(36,113,163,0.1); outline: none; }
        @media (max-width: 768px) {
          .kontakt-grid { grid-template-columns: 1fr !important; }
          .form-grid { grid-template-columns: 1fr !important; }
          .kontakt-header h1 { font-size: 2rem !important; }
          .kontakt-pad { padding: 32px 16px !important; }
          .nav-pad { padding: 14px 20px !important; }
          .form-card { padding: 24px !important; }
          .footer-pad { padding: 24px 20px !important; }
        }
      `}</style>

      {/* Nav */}
      <div className="nav-pad" style={{ background: "white", borderBottom: "1px solid #E8EDF4", padding: "16px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/" style={{ textDecoration: "none", fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 700 }}>
          <span style={{ color: NAVY }}>Kita</span><span style={{ color: GREEN }}>Bridge</span>
        </a>
        <a href="/" style={{ color: "#6B7897", textDecoration: "none", fontSize: "0.88rem" }}>← Zurück</a>
      </div>

      <div className="kontakt-pad" style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 24px" }}>

        {/* Header */}
        <div className="kontakt-header" style={{ textAlign: "center", marginBottom: 60 }}>
          <div style={{ fontSize: "0.75rem", fontWeight: 700, color: GREEN, textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>Wir helfen gerne</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.6rem", fontWeight: 800, color: NAVY, marginBottom: 16 }}>Kontakt</h1>
          <p style={{ color: "#6B7897", fontSize: "1rem", maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>
            Hast du eine Frage oder Anliegen? Schreib uns – wir antworten innerhalb von 24 Stunden.
          </p>
        </div>

        <div className="kontakt-grid" style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 40, alignItems: "start" }}>

          {/* Kontaktformular */}
          <div className="form-card" style={{ background: "white", borderRadius: 24, padding: 40, boxShadow: "0 4px 24px rgba(26,63,111,0.08)" }}>
            {sent ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{ fontSize: "3.5rem", marginBottom: 16 }}>✅</div>
                <h2 style={{ fontFamily: "'Playfair Display', serif", color: NAVY, marginBottom: 12 }}>Nachricht gesendet!</h2>
                <p style={{ color: "#6B7897", lineHeight: 1.7, marginBottom: 28 }}>
                  Vielen Dank, {form.name}! Wir haben deine Nachricht erhalten und melden uns innerhalb von 24 Stunden.
                </p>
                <button onClick={() => { setSent(false); setForm({ name: "", email: "", betreff: "", nachricht: "" }); }} style={{ padding: "12px 28px", borderRadius: 50, border: `2px solid ${NAVY}`, background: "transparent", color: NAVY, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                  Neue Nachricht
                </button>
              </div>
            ) : (
              <div>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", color: NAVY, marginBottom: 28 }}>Nachricht senden</h2>

                <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={labelStyle}>Name *</label>
                    <input style={inputStyle} value={form.name} onChange={e => set("name", e.target.value)} placeholder="Dein Name"/>
                  </div>
                  <div>
                    <label style={labelStyle}>E-Mail *</label>
                    <input style={inputStyle} type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="deine@email.de"/>
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Betreff</label>
                  <select style={{ ...inputStyle, cursor: "pointer" }} value={form.betreff} onChange={e => set("betreff", e.target.value)}>
                    <option value="">Bitte wählen</option>
                    <option value="Frage als Arbeitgeber">Frage als Arbeitgeber</option>
                    <option value="Frage als Fachkraft">Frage als Fachkraft</option>
                    <option value="Technisches Problem">Technisches Problem</option>
                    <option value="Kündigung">Kündigung</option>
                    <option value="Sonstiges">Sonstiges</option>
                  </select>
                </div>

                <div style={{ marginBottom: 24 }}>
                  <label style={labelStyle}>Nachricht *</label>
                  <textarea
                    style={{ ...inputStyle, height: 140, resize: "vertical" }}
                    value={form.nachricht}
                    onChange={e => set("nachricht", e.target.value)}
                    placeholder="Schreib uns dein Anliegen..."
                  />
                </div>

                {error && (
                  <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", padding: "10px 14px", borderRadius: 8, fontSize: "0.85rem", marginBottom: 16 }}>
                    {error}
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  style={{ width: "100%", padding: "14px", borderRadius: 12, border: "none", background: `linear-gradient(135deg, ${NAVY}, ${BLUE})`, color: "white", fontWeight: 700, fontSize: "0.95rem", cursor: loading ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif", opacity: loading ? 0.7 : 1 }}
                >
                  {loading ? "Wird gesendet..." : "Nachricht senden →"}
                </button>
              </div>
            )}
          </div>

          {/* Kontakt Info */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Direktkontakt */}
            <div style={{ background: "white", borderRadius: 20, padding: 28, boxShadow: "0 4px 24px rgba(26,63,111,0.08)" }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: NAVY, marginBottom: 20 }}>Direktkontakt</h3>
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", flexShrink: 0 }}>✉</div>
                <div>
                  <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#9BA8C0", textTransform: "uppercase", marginBottom: 2 }}>E-Mail</div>
                  <a href="mailto:hallo@kitabridge.de" style={{ color: NAVY, fontWeight: 600, fontSize: "0.9rem", textDecoration: "none" }}>hallo@kitabridge.de</a>
                </div>
              </div>
            </div>

            {/* Reaktionszeit */}
            <div style={{ background: `linear-gradient(135deg, ${NAVY}, ${BLUE})`, borderRadius: 20, padding: 28, color: "white" }}>
              <div style={{ fontSize: "1.8rem", marginBottom: 12 }}>⚡</div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", marginBottom: 8 }}>Schnelle Antwort</h3>
              <p style={{ fontSize: "0.88rem", opacity: 0.8, lineHeight: 1.7, margin: 0 }}>
                Wir antworten auf alle Anfragen innerhalb von <strong style={{ color: "#4ADE80" }}>24 Stunden</strong> – auch am Wochenende.
              </p>
            </div>

            {/* FAQ Link */}
            <div style={{ background: "#F0F4F9", borderRadius: 20, padding: 24, textAlign: "center" }}>
              <p style={{ color: "#6B7897", fontSize: "0.88rem", marginBottom: 12 }}>Vielleicht ist deine Frage schon beantwortet?</p>
              <a href="/#faq" style={{ color: BLUE, fontWeight: 700, fontSize: "0.9rem", textDecoration: "none" }}>Zu den häufigen Fragen →</a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer-pad" style={{ background: "#0D1B2A", color: "rgba(255,255,255,0.6)", padding: "32px 40px", textAlign: "center", marginTop: 60 }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, marginBottom: 10 }}>
          <span style={{ color: "white" }}>Kita</span><span style={{ color: GREEN }}>Bridge</span>
        </div>
        <div>
          <a href="/impressum" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", margin: "0 12px", fontSize: "0.82rem" }}>Impressum</a>
          <a href="/datenschutz" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", margin: "0 12px", fontSize: "0.82rem" }}>Datenschutz</a>
          <a href="/agb" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", margin: "0 12px", fontSize: "0.82rem" }}>AGB</a>
        </div>
      </footer>
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "12px 16px", borderRadius: 10, border: "1.5px solid #E2E8F0",
  fontSize: "0.93rem", fontFamily: "'DM Sans', sans-serif", color: "#1a1a2e", background: "white"
};

const labelStyle = {
  display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#4A5568",
  marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5
};