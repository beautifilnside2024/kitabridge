"use client";
import { useState } from "react";

const NAVY = "#1A3F6F";
const BLUE = "#2471A3";
const GREEN = "#1E8449";

const t = {
  de: {
    back: "← Zurück",
    tag: "Wir helfen gerne",
    title: "Kontakt",
    desc: "Hast du eine Frage oder Anliegen? Schreib uns – wir antworten innerhalb von 24 Stunden.",
    formTitle: "Nachricht senden",
    name: "Name *", email: "E-Mail *", subject: "Betreff", message: "Nachricht *",
    namePh: "Dein Name", emailPh: "deine@email.de", messagePh: "Schreib uns dein Anliegen...",
    selectSubject: "Bitte wählen",
    subjects: ["Frage als Arbeitgeber","Frage als Fachkraft","Technisches Problem","Kündigung","Sonstiges"],
    send: "Nachricht senden →", sending: "Wird gesendet...",
    errorRequired: "Bitte fülle alle Pflichtfelder aus.",
    sentTitle: "Nachricht gesendet!",
    sentDesc: "Vielen Dank, {name}! Wir haben deine Nachricht erhalten und melden uns innerhalb von 24 Stunden.",
    newMessage: "Neue Nachricht",
    directContact: "Direktkontakt",
    fastReply: "Schnelle Antwort",
    faqQ: "Vielleicht ist deine Frage schon beantwortet?",
    faqLink: "Zu den häufigen Fragen →",
  },
  en: {
    back: "← Back",
    tag: "We're happy to help",
    title: "Contact",
    desc: "Do you have a question or concern? Write to us – we respond within 24 hours.",
    formTitle: "Send a message",
    name: "Name *", email: "Email *", subject: "Subject", message: "Message *",
    namePh: "Your name", emailPh: "your@email.com", messagePh: "Write us your concern...",
    selectSubject: "Please select",
    subjects: ["Question as employer","Question as professional","Technical problem","Cancellation","Other"],
    send: "Send message →", sending: "Sending...",
    errorRequired: "Please fill in all required fields.",
    sentTitle: "Message sent!",
    sentDesc: "Thank you, {name}! We have received your message and will get back to you within 24 hours.",
    newMessage: "New message",
    directContact: "Direct contact",
    fastReply: "Fast response",
    faqQ: "Maybe your question is already answered?",
    faqLink: "Go to FAQ →",
  }
};

const inputStyle = {
  width: "100%", padding: "12px 16px", borderRadius: 10, border: "1.5px solid #E2E8F0",
  fontSize: "0.93rem", fontFamily: "'DM Sans', sans-serif", color: "#1a1a2e", background: "white"
};
const labelStyle = {
  display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#4A5568",
  marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5
};

export default function Kontakt() {
  const [lang, setLang] = useState("de");
  const [form, setForm] = useState({ name: "", email: "", betreff: "", nachricht: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const tx = t[lang];

  const set = (key, value) => setForm(f => ({ ...f, [key]: value }));

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.nachricht) { setError(tx.errorRequired); return; }
    setLoading(true);
    setError("");
    await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: "hallo@kitabridge.de",
        subject: `Kontaktanfrage: ${form.betreff || "Allgemeine Anfrage"} - von ${form.name}`,
        html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto"><div style="background:#1A3F6F;padding:24px 32px"><h1 style="color:white;margin:0;font-size:20px">KitaBridge - Neue Kontaktanfrage</h1></div><div style="padding:32px;background:#fff"><p><strong>Name:</strong> ${form.name}</p><p><strong>Email:</strong> ${form.email}</p><p><strong>Betreff:</strong> ${form.betreff || "-"}</p><p><strong>Nachricht:</strong></p><p>${form.nachricht.replace(/\n/g, "<br/>")}</p></div></div>`
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
        .lang-btn { background: none; border: 1.5px solid #E8EDF4; border-radius: 8px; padding: 4px 10px; cursor: pointer; font-size: 0.8rem; font-weight: 700; font-family: 'DM Sans', sans-serif; display: inline-flex; align-items: center; gap: 5px; transition: all 0.2s; color: #444; }
        .lang-btn:hover { border-color: #1A3F6F; }
        .lang-btn.active { border-color: #1A3F6F; background: #EEF2FF; color: #1A3F6F; }
        .flag-img { width: 20px; height: 14px; border-radius: 2px; object-fit: cover; }
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

      <div className="nav-pad" style={{ background: "white", borderBottom: "1px solid #E8EDF4", padding: "16px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/" style={{ textDecoration: "none", fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 700 }}>
          <span style={{ color: NAVY }}>Kita</span><span style={{ color: GREEN }}>Bridge</span>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", gap: 4 }}>
            <button className={`lang-btn${lang === "de" ? " active" : ""}`} onClick={() => setLang("de")}>
              <img className="flag-img" src="https://flagcdn.com/w20/de.png" alt="DE" />DE
            </button>
            <button className={`lang-btn${lang === "en" ? " active" : ""}`} onClick={() => setLang("en")}>
              <img className="flag-img" src="https://flagcdn.com/w20/gb.png" alt="EN" />EN
            </button>
          </div>
          <a href="/" style={{ color: "#6B7897", textDecoration: "none", fontSize: "0.88rem" }}>{tx.back}</a>
        </div>
      </div>

      <div className="kontakt-pad" style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 24px" }}>
        <div className="kontakt-header" style={{ textAlign: "center", marginBottom: 60 }}>
          <div style={{ fontSize: "0.75rem", fontWeight: 700, color: GREEN, textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>{tx.tag}</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.6rem", fontWeight: 800, color: NAVY, marginBottom: 16 }}>{tx.title}</h1>
          <p style={{ color: "#6B7897", fontSize: "1rem", maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>{tx.desc}</p>
        </div>

        <div className="kontakt-grid" style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 40, alignItems: "start" }}>
          <div className="form-card" style={{ background: "white", borderRadius: 24, padding: 40, boxShadow: "0 4px 24px rgba(26,63,111,0.08)" }}>
            {sent ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{ fontSize: "3.5rem", marginBottom: 16 }}>✅</div>
                <h2 style={{ fontFamily: "'Playfair Display', serif", color: NAVY, marginBottom: 12 }}>{tx.sentTitle}</h2>
                <p style={{ color: "#6B7897", lineHeight: 1.7, marginBottom: 28 }}>{tx.sentDesc.replace("{name}", form.name)}</p>
                <button onClick={() => { setSent(false); setForm({ name: "", email: "", betreff: "", nachricht: "" }); }}
                  style={{ padding: "12px 28px", borderRadius: 50, border: `2px solid ${NAVY}`, background: "transparent", color: NAVY, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                  {tx.newMessage}
                </button>
              </div>
            ) : (
              <div>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", color: NAVY, marginBottom: 28 }}>{tx.formTitle}</h2>
                <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  <div><label style={labelStyle}>{tx.name}</label><input style={inputStyle} value={form.name} onChange={e => set("name", e.target.value)} placeholder={tx.namePh}/></div>
                  <div><label style={labelStyle}>{tx.email}</label><input style={inputStyle} type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder={tx.emailPh}/></div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>{tx.subject}</label>
                  <select style={{ ...inputStyle, cursor: "pointer" }} value={form.betreff} onChange={e => set("betreff", e.target.value)}>
                    <option value="">{tx.selectSubject}</option>
                    {tx.subjects.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom: 24 }}>
                  <label style={labelStyle}>{tx.message}</label>
                  <textarea style={{ ...inputStyle, height: 140, resize: "vertical" }} value={form.nachricht} onChange={e => set("nachricht", e.target.value)} placeholder={tx.messagePh}/>
                </div>
                {error && <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", padding: "10px 14px", borderRadius: 8, fontSize: "0.85rem", marginBottom: 16 }}>{error}</div>}
                <button onClick={handleSubmit} disabled={loading}
                  style={{ width: "100%", padding: "14px", borderRadius: 12, border: "none", background: `linear-gradient(135deg, ${NAVY}, ${BLUE})`, color: "white", fontWeight: 700, fontSize: "0.95rem", cursor: loading ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif", opacity: loading ? 0.7 : 1 }}>
                  {loading ? tx.sending : tx.send}
                </button>
              </div>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ background: "white", borderRadius: 20, padding: 28, boxShadow: "0 4px 24px rgba(26,63,111,0.08)" }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: NAVY, marginBottom: 20 }}>{tx.directContact}</h3>
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", flexShrink: 0 }}>✉</div>
                <div>
                  <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#9BA8C0", textTransform: "uppercase", marginBottom: 2 }}>Email</div>
                  <a href="mailto:hallo@kitabridge.de" style={{ color: NAVY, fontWeight: 600, fontSize: "0.9rem", textDecoration: "none" }}>hallo@kitabridge.de</a>
                </div>
              </div>
            </div>

            <div style={{ background: `linear-gradient(135deg, ${NAVY}, ${BLUE})`, borderRadius: 20, padding: 28, color: "white" }}>
              <div style={{ fontSize: "1.8rem", marginBottom: 12 }}>⚡</div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", marginBottom: 8 }}>{tx.fastReply}</h3>
              <p style={{ fontSize: "0.88rem", opacity: 0.8, lineHeight: 1.7, margin: 0 }}>
                {lang === "de"
                  ? <span>Wir antworten auf alle Anfragen innerhalb von <strong style={{ color: "#4ADE80" }}>24 Stunden</strong> – auch am Wochenende.</span>
                  : <span>We respond to all enquiries within <strong style={{ color: "#4ADE80" }}>24 hours</strong> – including weekends.</span>
                }
              </p>
            </div>

            <div style={{ background: "#F0F4F9", borderRadius: 20, padding: 24, textAlign: "center" }}>
              <p style={{ color: "#6B7897", fontSize: "0.88rem", marginBottom: 12 }}>{tx.faqQ}</p>
              <a href="/#faq" style={{ color: BLUE, fontWeight: 700, fontSize: "0.9rem", textDecoration: "none" }}>{tx.faqLink}</a>
            </div>
          </div>
        </div>
      </div>

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