"use client";
import { useState } from "react";

export default function Kontakt() {
  const [form, setForm] = useState({ name: "", email: "", telefon: "", betreff: "", nachricht: "" });
  const [status, setStatus] = useState(null);

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

  if (status === "success") {
    return (
      <div style={{ fontFamily: "'DM Sans', sans-serif", background: "linear-gradient(160deg, #F0F4F9 0%, #E8F4FD 50%, #EAF7EF 100%)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>
        <div style={{ textAlign: "center", padding: "40px", background: "white", borderRadius: 24, border: "1px solid #E8EDF4", boxShadow: "0 4px 20px rgba(26,63,111,0.08)", maxWidth: 480 }}>
          <div style={{ fontSize: "4rem", marginBottom: 20 }}>🎉</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#1A3F6F", fontSize: "2rem", marginBottom: 16 }}>
            Vielen Dank!
          </h2>
          <p style={{ color: "#6B7897", lineHeight: 1.8, marginBottom: 28, fontSize: "1rem" }}>
            Deine Nachricht ist bei uns angekommen.<br />
            Wir melden uns innerhalb von 24 Stunden bei dir. 😊
          </p>
          <button onClick={() => { setStatus(null); setForm({ name: "", email: "", telefon: "", betreff: "", nachricht: "" }); }} style={{ padding: "14px 32px", background: "linear-gradient(135deg, #1A3F6F, #2471A3)", color: "white", border: "none", borderRadius: 50, fontWeight: 700, cursor: "pointer", fontSize: "0.95rem" }}>
            Neue Nachricht senden
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "white", minHeight: "100vh" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>

      <div style={{ background: "linear-gradient(160deg, #F0F4F9 0%, #E8F4FD 50%, #EAF7EF 100%)", padding: "80px 20px 60px", textAlign: "center" }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.8rem", fontWeight: 900, color: "#1A3F6F", marginBottom: 16 }}>
          Schreib uns eine <span style={{ color: "#1E8449" }}>Nachricht</span>
        </h1>
        <p style={{ color: "#6B7897", fontSize: "1rem" }}>Wir melden uns innerhalb von 24 Stunden bei dir.</p>
      </div>

      <div style={{ maxWidth: 620, margin: "0 auto", padding: "60px 20px" }}>
        <div style={{ background: "white", borderRadius: 24, padding: 40, border: "1px solid #E8EDF4", boxShadow: "0 4px 20px rgba(26,63,111,0.08)" }}>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#6B7897", marginBottom: 6 }}>Name *</label>
              <input placeholder="Max Mustermann" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={{ width: "100%", padding: "12px 16px", marginBottom: 16, border: "1px solid #E8EDF4", borderRadius: 12, fontSize: "0.95rem", display: "block" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#6B7897", marginBottom: 6 }}>Telefon</label>
              <input placeholder="+49 123 456789" value={form.telefon} onChange={e => setForm({ ...form, telefon: e.target.value })} style={{ width: "100%", padding: "12px 16px", marginBottom: 16, border: "1px solid #E8EDF4", borderRadius: 12, fontSize: "0.95rem", display: "block" }} />
            </div>
          </div>

          <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#6B7897", marginBottom: 6 }}>E-Mail *</label>
          <input placeholder="deine@email.de" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={{ width: "100%", padding: "12px 16px", marginBottom: 16, border: "1px solid #E8EDF4", borderRadius: 12, fontSize: "0.95rem", display: "block" }} />

          <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#6B7897", marginBottom: 6 }}>Betreff</label>
          <input placeholder="Worum geht es?" value={form.betreff} onChange={e => setForm({ ...form, betreff: e.target.value })} style={{ width: "100%", padding: "12px 16px", marginBottom: 16, border: "1px solid #E8EDF4", borderRadius: 12, fontSize: "0.95rem", display: "block" }} />

          <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#6B7897", marginBottom: 6 }}>Nachricht *</label>
          <textarea placeholder="Deine Nachricht..." rows={5} value={form.nachricht} onChange={e => setForm({ ...form, nachricht: e.target.value })} style={{ width: "100%", padding: "12px 16px", marginBottom: 16, border: "1px solid #E8EDF4", borderRadius: 12, fontSize: "0.95rem", display: "block", resize: "vertical" }} />

          <button onClick={handleSubmit} disabled={status === "loading"} style={{ width: "100%", padding: "16px", background: "linear-gradient(135deg, #1A3F6F, #2471A3)", color: "white", border: "none", borderRadius: 50, fontWeight: 700, cursor: "pointer", fontSize: "1rem" }}>
            {status === "loading" ? "Wird gesendet..." : "Nachricht senden →"}
          </button>

          {status === "error" && (
            <div style={{ marginTop: 20, background: "#FEF2F2", borderRadius: 12, padding: "16px 20px", color: "#DC2626", fontWeight: 600 }}>
              Fehler – bitte versuche es erneut.
            </div>
          )}

        </div>
      </div>
    </div>
  );
}