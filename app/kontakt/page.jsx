"use client";
import { useState } from "react";

const C = {
  navy: "#0F2442", navyMid: "#1A3F6F", blue: "#2471A3",
  green: "#16A34A", surface: "#F7F9FC", border: "#E4EAF4", muted: "#8A96B0", text: "#1C2B4A",
};

const fieldStyle = {
  width: "100%", padding: "11px 14px", border: `1.5px solid ${C.border}`, borderRadius: 11,
  fontSize: "0.9rem", color: C.text, background: "white", outline: "none",
  fontFamily: "'Sora', sans-serif",
};

const labelStyle = {
  display: "block", fontSize: "0.68rem", fontWeight: 800, color: C.muted,
  textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 7,
};

export default function Kontakt() {
  const [form, setForm] = useState({ name: "", email: "", telefon: "", betreff: "", nachricht: "" });
  const [status, setStatus] = useState(null);

  const set = (key, value) => setForm(f => ({ ...f, [key]: value }));

  async function handleSubmit() {
    setStatus("loading");
    const res = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "kontakt", data: form }),
    });
    if (res.ok) setStatus("success");
    else setStatus("error");
  }

  return (
    <div style={{ fontFamily: "'Sora', sans-serif", background: C.surface, minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Fraunces:wght@700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { -webkit-font-smoothing: antialiased; }
        input:focus, textarea:focus { border-color: ${C.blue} !important; box-shadow: 0 0 0 3px rgba(36,113,163,0.12) !important; outline: none; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pop { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>

      {/* Header */}
      <header style={{ background: "rgba(247,249,252,0.9)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${C.border}`, padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
        <a href="/" style={{ textDecoration: "none" }}>
          <span style={{ fontFamily: "'Fraunces', serif", fontSize: "1.3rem", fontWeight: 800, color: C.navy }}>Kita</span>
          <span style={{ fontFamily: "'Fraunces', serif", fontSize: "1.3rem", fontWeight: 800, color: C.green }}>Bridge</span>
        </a>
        <a href="/" style={{ fontSize: "0.82rem", color: C.muted, fontWeight: 600, textDecoration: "none" }}>← Startseite</a>
      </header>

      {status === "success" ? (
        <div style={{ minHeight: "calc(100vh - 60px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ background: "white", borderRadius: 24, padding: "44px 36px", border: `1.5px solid ${C.border}`, boxShadow: "0 8px 40px rgba(15,36,66,0.1)", maxWidth: 440, width: "100%", textAlign: "center", animation: "pop 0.3s ease-out" }}>
            <div style={{ width: 68, height: 68, borderRadius: "50%", background: "#ECFDF5", border: "2px solid #A7F3D0", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: "1.8rem" }}>🎉</div>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "1.6rem", fontWeight: 800, color: C.text, marginBottom: 10 }}>Vielen Dank!</h2>
            <p style={{ color: C.muted, lineHeight: 1.75, marginBottom: 28, fontSize: "0.9rem" }}>
              Deine Nachricht ist bei uns angekommen.<br />
              Wir melden uns innerhalb von 24 Stunden bei dir.
            </p>
            <button
              onClick={() => { setStatus(null); setForm({ name: "", email: "", telefon: "", betreff: "", nachricht: "" }); }}
              style={{ padding: "12px 28px", background: C.navyMid, color: "white", border: "none", borderRadius: 11, fontWeight: 700, cursor: "pointer", fontSize: "0.9rem", fontFamily: "'Sora', sans-serif" }}
            >
              Neue Nachricht senden
            </button>
          </div>
        </div>
      ) : (
        <div style={{ maxWidth: 580, margin: "0 auto", padding: "40px 20px" }}>

          {/* Page title */}
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "1.9rem", fontWeight: 800, color: C.text, marginBottom: 6 }}>
              Schreib uns eine <span style={{ color: C.green }}>Nachricht</span>
            </h1>
            <p style={{ color: C.muted, fontSize: "0.88rem", fontWeight: 500 }}>Wir melden uns innerhalb von 24 Stunden bei dir.</p>
          </div>

          {/* Contact info chips */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 24 }}>
            {[
              { icon: "✉️", text: "info@kitabridge.de" },
              { icon: "⏱", text: "Antwort in 24h" },
            ].map(item => (
              <div key={item.text} style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 14px", background: "white", border: `1.5px solid ${C.border}`, borderRadius: 99, fontSize: "0.82rem", color: C.text, fontWeight: 600 }}>
                <span>{item.icon}</span> {item.text}
              </div>
            ))}
          </div>

          {/* Form card */}
          <div style={{ background: "white", borderRadius: 22, padding: "28px 26px", border: `1.5px solid ${C.border}`, boxShadow: "0 8px 40px rgba(15,36,66,0.08)" }}>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div>
                <label style={labelStyle}>Name *</label>
                <input style={fieldStyle} placeholder="Max Mustermann" value={form.name} onChange={e => set("name", e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Telefon</label>
                <input style={fieldStyle} placeholder="+49 123 456789" value={form.telefon} onChange={e => set("telefon", e.target.value)} />
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>E-Mail *</label>
              <input style={fieldStyle} type="email" placeholder="deine@email.de" value={form.email} onChange={e => set("email", e.target.value)} />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Betreff</label>
              <input style={fieldStyle} placeholder="Worum geht es?" value={form.betreff} onChange={e => set("betreff", e.target.value)} />
            </div>

            <div style={{ marginBottom: 22 }}>
              <label style={labelStyle}>Nachricht *</label>
              <textarea style={{ ...fieldStyle, resize: "vertical" }} rows={5} placeholder="Deine Nachricht..." value={form.nachricht} onChange={e => set("nachricht", e.target.value)} />
            </div>

            {status === "error" && (
              <div style={{ marginBottom: 16, padding: "12px 15px", background: "#FFF5F5", border: "1px solid #FED7D7", borderRadius: 10, color: "#9B1C1C", fontSize: "0.84rem", fontWeight: 500 }}>
                Fehler beim Senden — bitte versuche es erneut.
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={status === "loading" || !form.name || !form.email || !form.nachricht}
              style={{ width: "100%", padding: "13px", background: status === "loading" || !form.name || !form.email || !form.nachricht ? C.border : C.navyMid, color: status === "loading" || !form.name || !form.email || !form.nachricht ? C.muted : "white", border: "none", borderRadius: 12, fontWeight: 700, cursor: status === "loading" || !form.name || !form.email || !form.nachricht ? "not-allowed" : "pointer", fontSize: "0.92rem", fontFamily: "'Sora', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.15s" }}
            >
              {status === "loading" ? (
                <><div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />Wird gesendet...</>
              ) : (
                <>Nachricht senden <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}