"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const NAVY = "#1A3F6F";
const BLUE = "#2471A3";
const GREEN = "#1E8449";

const inputStyle = {
  width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #E2E8F0",
  fontSize: "0.9rem", outline: "none", fontFamily: "'DM Sans', sans-serif",
  color: "#1a1a2e", background: "white", marginBottom: 4
};

const selectStyle = { ...inputStyle, cursor: "pointer" };
const labelStyle = {
  display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#9BA8C0",
  textTransform: "uppercase", marginBottom: 6
};

export default function FachkraftEinstellungen() {
  const router = useRouter();
  const [fachkraft, setFachkraft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    loadProfil();
  }, []);

  const loadProfil = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push("/login");
      return;
    }

    const { data } = await supabase
      .from("fachkraefte")
      .select("*")
      .eq("email", session.user.email)
      .single();

    if (!data) {
      router.push("/dashboard");
      return;
    }

    setFachkraft(data);
    setForm(data);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("fachkraefte")
      .update({
        vorname: form.vorname,
        nachname: form.nachname,
        telefon: form.telefon,
        wohnort: form.wohnort,
        qualifikation: form.qualifikation,
        deutsch: form.deutsch,
        englisch: form.englisch,
        weitere_sprachen: form.weitere_sprachen,
        erfahrung_jahre: form.erfahrung_jahre,
        beschreibung: form.beschreibung,
        verfuegbar_ab: form.verfuegbar_ab,
        arbeitszeit: form.arbeitszeit,
        bundesland: form.bundesland,
      })
      .eq("email", fachkraft.email);

    setSaving(false);
    if (error) {
      alert("Fehler beim Speichern: " + error.message);
    } else {
      setFachkraft({ ...fachkraft, ...form });
      setEditMode(false);
      alert("Profil erfolgreich gespeichert!");
    }
  };

  const set = (key, value) => setForm(f => ({ ...f, [key]: value }));

  const handleDeleteAccount = async () => {
    const bestaetigung = window.confirm(
      "Bist du sicher? Dein Account und alle deine Daten werden unwiderruflich gelöscht."
    );
    if (!bestaetigung) return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const res = await fetch("/api/account/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: session.user.email, rolle: "fachkraft" }),
    });

    if (res.ok) {
      await supabase.auth.signOut();
      alert("Dein Account wurde erfolgreich gelöscht.");
      router.push("/");
    } else {
      alert("Fehler beim Löschen. Bitte kontaktiere uns unter kitabridge@protonmail.com");
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F0F4F9", fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ color: NAVY }}>Lädt...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4F9", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap'); * { box-sizing: border-box; }`}</style>

      <div style={{ background: NAVY, padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <a href="/" style={{ textDecoration: "none", fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700 }}>
          <span style={{ color: "white" }}>Kita</span><span style={{ color: "#4ADE80" }}>Bridge</span>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem" }}>{fachkraft?.vorname} {fachkraft?.nachname}</span>
          <button onClick={handleLogout} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "white", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: "0.85rem", fontFamily: "'DM Sans', sans-serif" }}>
            Ausloggen
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "40px 24px" }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", color: NAVY, marginBottom: 8 }}>
          Willkommen, {fachkraft?.vorname}! 👋
        </h1>
        <p style={{ color: "#9BA8C0", fontSize: "0.9rem", marginBottom: 32 }}>Hier kannst du dein Profil verwalten.</p>

        {/* Status Banner */}
        <div style={{ background: fachkraft?.status === "bestaetigt" ? "#EAF7EF" : "#FFF7ED", border: `1px solid ${fachkraft?.status === "bestaetigt" ? "#BBF7D0" : "#FED7AA"}`, borderRadius: 16, padding: 16, marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: "1.2rem" }}>{fachkraft?.status === "bestaetigt" ? "✅" : "⏳"}</span>
          <span style={{ color: fachkraft?.status === "bestaetigt" ? GREEN : "#92400E", fontWeight: 700, fontSize: "0.9rem" }}>
            {fachkraft?.status === "bestaetigt" ? "Profil freigegeben – Kitas können dich kontaktieren!" : "Profil wird geprüft – wir melden uns innerhalb von 24 Stunden."}
          </span>
        </div>

        {/* Profil */}
        <div style={{ background: "white", borderRadius: 20, padding: 28, boxShadow: "0 2px 12px rgba(26,63,111,0.08)", marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: NAVY, margin: 0 }}>Mein Profil</h2>
            {!editMode ? (
              <button onClick={() => setEditMode(true)} style={{ background: NAVY, color: "white", border: "none", padding: "8px 20px", borderRadius: 8, cursor: "pointer", fontSize: "0.85rem", fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>
                ✏️ Bearbeiten
              </button>
            ) : (
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => { setEditMode(false); setForm(fachkraft); }} style={{ background: "transparent", color: NAVY, border: `1px solid ${NAVY}`, padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: "0.85rem", fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>
                  Abbrechen
                </button>
                <button onClick={handleSave} disabled={saving} style={{ background: GREEN, color: "white", border: "none", padding: "8px 20px", borderRadius: 8, cursor: "pointer", fontSize: "0.85rem", fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>
                  {saving ? "Speichert..." : "💾 Speichern"}
                </button>
              </div>
            )}
          </div>

          {!editMode ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
              {[
                ["Name", `${fachkraft?.vorname} ${fachkraft?.nachname}`],
                ["E-Mail", fachkraft?.email],
                ["Telefon", fachkraft?.telefon],
                ["Wohnort", fachkraft?.wohnort],
                ["Qualifikation", fachkraft?.qualifikation],
                ["Deutsch", fachkraft?.deutsch],
                ["Englisch", fachkraft?.englisch],
                ["Weitere Sprachen", fachkraft?.weitere_sprachen],
                ["Erfahrung", fachkraft?.erfahrung_jahre],
                ["Verfügbar ab", fachkraft?.verfuegbar_ab],
                ["Arbeitszeit", fachkraft?.arbeitszeit],
                ["Bundesland", fachkraft?.bundesland],
              ].map(([k, v]) => v ? (
                <div key={k} style={{ padding: "12px 0", borderBottom: "1px solid #F0F4F9" }}>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#9BA8C0", textTransform: "uppercase", marginBottom: 4 }}>{k}</div>
                  <div style={{ color: NAVY, fontWeight: 600, fontSize: "0.92rem" }}>{v}</div>
                </div>
              ) : null)}
              {fachkraft?.beschreibung && (
                <div style={{ padding: "12px 0", borderBottom: "1px solid #F0F4F9", gridColumn: "1/-1" }}>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#9BA8C0", textTransform: "uppercase", marginBottom: 4 }}>Beschreibung</div>
                  <div style={{ color: NAVY, fontWeight: 600, fontSize: "0.92rem" }}>{fachkraft?.beschreibung}</div>
                </div>
              )}
            </div>
          ) : (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>Vorname</label>
                  <input style={inputStyle} value={form.vorname || ""} onChange={e => set("vorname", e.target.value)}/>
                </div>
                <div>
                  <label style={labelStyle}>Nachname</label>
                  <input style={inputStyle} value={form.nachname || ""} onChange={e => set("nachname", e.target.value)}/>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>Telefon</label>
                  <input style={inputStyle} value={form.telefon || ""} onChange={e => set("telefon", e.target.value)}/>
                </div>
                <div>
                  <label style={labelStyle}>Wohnort</label>
                  <input style={inputStyle} value={form.wohnort || ""} onChange={e => set("wohnort", e.target.value)}/>
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Qualifikation</label>
                <select style={selectStyle} value={form.qualifikation || ""} onChange={e => set("qualifikation", e.target.value)}>
                  <option value="">Bitte wählen</option>
                  {["Staatlich anerkannte Erzieherin / Erzieher","Kinderpflegerin / Kinderpfleger","Sozialpädagogin / Sozialpädagoge","Heilpädagogin / Heilpädagoge","Kindheitspädagogin / Kindheitspädagoge","Sonstige pädagogische Ausbildung"].map(q => <option key={q} value={q}>{q}</option>)}
                </select>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>Deutschkenntnisse</label>
                  <select style={selectStyle} value={form.deutsch || ""} onChange={e => set("deutsch", e.target.value)}>
                    <option value="">Bitte wählen</option>
                    {["A1 – Anfänger","A2 – Grundlagen","B1 – Mittelstufe","B2 – Gute Kenntnisse","C1 – Fortgeschritten","C2 – Muttersprachlich"].map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Englischkenntnisse</label>
                  <select style={selectStyle} value={form.englisch || ""} onChange={e => set("englisch", e.target.value)}>
                    <option value="">Keine</option>
                    {["A1 – Anfänger","A2 – Grundlagen","B1 – Mittelstufe","B2 – Gute Kenntnisse","C1 – Fortgeschritten","C2 – Muttersprachlich"].map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Weitere Sprachen</label>
                <input style={inputStyle} value={form.weitere_sprachen || ""} onChange={e => set("weitere_sprachen", e.target.value)} placeholder="z.B. Französisch B2"/>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Berufserfahrung</label>
                <select style={selectStyle} value={form.erfahrung_jahre || ""} onChange={e => set("erfahrung_jahre", e.target.value)}>
                  <option value="">Bitte wählen</option>
                  {["Berufseinsteiger (0-1 Jahre)","1-2 Jahre","2-5 Jahre","5-10 Jahre","Mehr als 10 Jahre"].map(j => <option key={j} value={j}>{j}</option>)}
                </select>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>Verfügbar ab</label>
                  <input style={inputStyle} type="date" value={form.verfuegbar_ab || ""} onChange={e => set("verfuegbar_ab", e.target.value)}/>
                </div>
                <div>
                  <label style={labelStyle}>Arbeitszeit</label>
                  <select style={selectStyle} value={form.arbeitszeit || ""} onChange={e => set("arbeitszeit", e.target.value)}>
                    <option value="">Bitte wählen</option>
                    {["Vollzeit (38-40h)","Teilzeit (20-30h)","Minijob","Vertretung / Aushilfe"].map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Gewünschtes Bundesland</label>
                <select style={selectStyle} value={form.bundesland || ""} onChange={e => set("bundesland", e.target.value)}>
                  <option value="">Egal / Flexibel</option>
                  {["Baden-Württemberg","Bayern","Berlin","Brandenburg","Bremen","Hamburg","Hessen","Mecklenburg-Vorpommern","Niedersachsen","Nordrhein-Westfalen","Rheinland-Pfalz","Saarland","Sachsen","Sachsen-Anhalt","Schleswig-Holstein","Thüringen"].map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Beschreibung</label>
                <textarea style={{ ...inputStyle, height: 100, resize: "vertical" }} value={form.beschreibung || ""} onChange={e => set("beschreibung", e.target.value)} placeholder="Kurze Beschreibung deiner Erfahrung..."/>
              </div>
            </div>
          )}
        </div>

        {/* Account löschen */}
        <div style={{ background: "white", borderRadius: 20, padding: 28, boxShadow: "0 2px 12px rgba(26,63,111,0.08)" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: NAVY, marginBottom: 20 }}>Konto-Einstellungen</h2>
          <div style={{ padding: 20, background: "#FFF5F5", border: "1px solid #FED7D7", borderRadius: 12 }}>
            <div style={{ fontWeight: 700, color: "#9B1C1C", marginBottom: 6, fontSize: "0.95rem" }}>⚠️ Account löschen</div>
            <div style={{ color: "#7F1D1D", fontSize: "0.84rem", marginBottom: 14 }}>
              Dein Account und alle deine Daten werden unwiderruflich gelöscht.
            </div>
            <button onClick={handleDeleteAccount} style={{ background: "#DC2626", color: "white", border: "none", padding: "10px 20px", borderRadius: 8, fontWeight: 700, fontSize: "0.88rem", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              Account unwiderruflich löschen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}