"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const NAVY = "#1A3F6F";
const BLUE = "#2471A3";
const GREEN = "#1E8449";

export default function FachkraftEinstellungen() {
  const router = useRouter();
  const [fachkraft, setFachkraft] = useState(null);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { loadProfil(); }, []);

  const loadProfil = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { router.push("/login"); return; }
    const { data } = await supabase.from("fachkraefte").select("*").eq("email", session.user.email).single();
    if (!data) { router.push("/login"); return; }
    setFachkraft(data); setForm(data); setLoading(false);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setSaving(true); setError(""); setSuccess(false);
    const { error: err } = await supabase.from("fachkraefte").update({
      vorname: form.vorname, nachname: form.nachname, telefon: form.telefon,
      wohnort: form.wohnort, bundesland: form.bundesland, qualifikation: form.qualifikation,
      zusatzqualifikation: form.zusatzqualifikation, uniabschluss: form.uniabschluss,
      deutsch: form.deutsch, englisch: form.englisch, weitere_sprachen: form.weitere_sprachen,
      erfahrung_jahre: form.erfahrung_jahre, kita_alter: form.kita_alter,
      beschreibung: form.beschreibung, Verfügbar_ab: form.Verfügbar_ab, arbeitszeit: form.arbeitszeit,
    }).eq("email", fachkraft.email);
    setSaving(false);
    if (err) { setError("Fehler beim Speichern."); }
    else { setSuccess(true); setFachkraft(form); setTimeout(() => setSuccess(false), 3000); }
  };

  const handleLogout = async () => { await supabase.auth.signOut(); router.push("/login"); };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Bist du sicher? Dein Account wird unwiderruflich gelöscht.")) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const res = await fetch("/api/account/delete", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: session.user.email, rolle: "fachkraft" }) });
    if (res.ok) { await supabase.auth.signOut(); router.push("/"); }
    else { alert("Fehler beim löschen. Bitte kontaktiere uns unter kitabridge@protonmail.com"); }
  };

  const inputStyle = { width: "100%", padding: "10px 14px", border: "1.5px solid #D1DAE8", borderRadius: 10, fontSize: "0.92rem", color: NAVY, fontFamily: "'DM Sans', sans-serif", background: "white", outline: "none", boxSizing: "border-box" as const };
  const labelStyle = { fontSize: "0.75rem", fontWeight: 700, color: "#9BA8C0", textTransform: "uppercase" as const, marginBottom: 6, display: "block" };

  const fieldGroup = (label: string, name: string, type = "text", options?: string[]) => (
    <div style={{ marginBottom: 18 }}>
      <label style={labelStyle}>{label}</label>
      {options ? (
        <select name={name} value={form[name] || ""} onChange={handleChange} style={inputStyle}>
          <option value="">- bitte wählen -</option>
          {options.map((o: string) => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} name={name} value={form[name] || ""} onChange={handleChange} style={inputStyle} />
      )}
    </div>
  );

  if (loading || !form) {
    return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F0F4F9", fontFamily: "'DM Sans', sans-serif" }}><div style={{ color: NAVY }}>Lädt...</div></div>;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4F9", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap'); * { box-sizing: border-box; } input:focus, select:focus, textarea:focus { border-color: #2471A3 !important; }`}</style>

      <div style={{ background: NAVY, padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <a href="/" style={{ textDecoration: "none", fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700 }}>
          <span style={{ color: "white" }}>Kita</span><span style={{ color: "#4ADE80" }}>Bridge</span>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem" }}>{fachkraft?.vorname} {fachkraft?.nachname}</span>
          <button onClick={handleLogout} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "white", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: "0.85rem" }}>Ausloggen</button>
        </div>
      </div>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "40px 24px" }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", color: NAVY, marginBottom: 8 }}>Willkommen, {fachkraft?.vorname}!</h1>
        <p style={{ color: "#9BA8C0", fontSize: "0.9rem", marginBottom: 32 }}>Hier kannst du dein Profil bearbeiten und speichern.</p>

        <div style={{ background: "white", borderRadius: 20, padding: 20, boxShadow: "0 2px 12px rgba(26,63,111,0.08)", marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#9BA8C0", textTransform: "uppercase" }}>Profil-Status:</span>
          <span style={{ background: fachkraft?.status === "bestaetigt" ? "#EAF7EF" : "#FFF7ED", color: fachkraft?.status === "bestaetigt" ? GREEN : "#92400E", padding: "4px 14px", borderRadius: 50, fontSize: "0.82rem", fontWeight: 700 }}>
            {fachkraft?.status === "bestaetigt" ? "Freigegeben" : "In Prüfung"}
          </span>
        </div>

        <div style={{ background: "white", borderRadius: 20, padding: 28, boxShadow: "0 2px 12px rgba(26,63,111,0.08)", marginBottom: 24 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: NAVY, marginBottom: 24 }}>Mein Profil bearbeiten</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
            {fieldGroup("Vorname", "vorname")}
            {fieldGroup("Nachname", "nachname")}
            {fieldGroup("Telefon", "telefon", "tel")}
            {fieldGroup("Wohnort", "wohnort")}
          </div>
          {fieldGroup("Bundesland", "bundesland", "text", ["Baden-Württemberg","Bayern","Berlin","Brandenburg","Bremen","Hamburg","Hessen","Mecklenburg-Vorpommern","Niedersachsen","Nordrhein-Westfalen","Rheinland-Pfalz","Saarland","Sachsen","Sachsen-Anhalt","Schleswig-Holstein","Thüringen"])}
          {fieldGroup("Qualifikation", "qualifikation", "text", ["Staatlich anerkannte/r Erzieher/in","Kindheitspädagoge/in","Sozialpädagoge/in","Heilpädagoge/in","Sozialarbeiter/in","Pädagogische Fachkraft (ausländischer Abschluss)","Quereinstieg","Sonstiges"])}
          {fieldGroup("Zusatzqualifikation", "zusatzqualifikation")}
          {fieldGroup("Hochschulabschluss", "uniabschluss")}
          {fieldGroup("Berufserfahrung (Jahre)", "erfahrung_jahre", "number")}
          {fieldGroup("Altersgruppe Kita", "kita_alter", "text", ["Krippe (0-3 Jahre)","Kindergarten (3-6 Jahre)","Hort (6-12 Jahre)","Alle Altersgruppen"])}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
            {fieldGroup("Deutsch", "deutsch", "text", ["Muttersprache","Sehr gut (C1/C2)","Gut (B1/B2)","Grundkenntnisse (A1/A2)"])}
            {fieldGroup("Englisch", "englisch", "text", ["Muttersprache","Sehr gut (C1/C2)","Gut (B1/B2)","Grundkenntnisse (A1/A2)","Keine"])}
          </div>
          {fieldGroup("Weitere Sprachen", "weitere_sprachen")}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
            {fieldGroup("Verfügbar ab", "Verfügbar_ab", "date")}
            {fieldGroup("Arbeitszeit", "arbeitszeit", "text", ["Vollzeit","Teilzeit","Vollzeit & Teilzeit","Minijob"])}
          </div>
          <div>
            <label style={labelStyle}>Kurzbeschreibung</label>
            <textarea name="beschreibung" value={form.beschreibung || ""} onChange={handleChange} rows={4} style={{ ...inputStyle, resize: "vertical" }} placeholder="Beschreibe dich kurz" />
          </div>
          {error && <div style={{ marginTop: 16, padding: "12px 16px", background: "#FFF5F5", borderRadius: 10, color: "#9B1C1C", fontSize: "0.88rem" }}>{error}</div>}
          {success && <div style={{ marginTop: 16, padding: "12px 16px", background: "#EAF7EF", borderRadius: 10, color: "#1E8449", fontSize: "0.88rem", fontWeight: 600 }}>Profil gespeichert!</div>}
          <button onClick={handleSave} disabled={saving} style={{ marginTop: 24, width: "100%", background: saving ? "#9BA8C0" : NAVY, color: "white", border: "none", padding: "14px 24px", borderRadius: 12, fontWeight: 700, fontSize: "1rem", cursor: saving ? "not-allowed" : "pointer" }}>
            {saving ? "Wird gespeichert..." : "Änderungen speichern"}
          </button>
        </div>

        <div style={{ background: "white", borderRadius: 20, padding: 28, boxShadow: "0 2px 12px rgba(26,63,111,0.08)" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: NAVY, marginBottom: 20 }}>Konto-Einstellungen</h2>
          <div style={{ padding: 20, background: "#FFF5F5", border: "1px solid #FED7D7", borderRadius: 12 }}>
            <div style={{ fontWeight: 700, color: "#9B1C1C", marginBottom: 6 }}>Account löschen</div>
            <div style={{ color: "#7F1D1D", fontSize: "0.84rem", marginBottom: 14 }}>Dein Account und alle Daten werden unwiderruflich gelöscht.</div>
            <button onClick={handleDeleteAccount} style={{ background: "#DC2626", color: "white", border: "none", padding: "10px 20px", borderRadius: 8, fontWeight: 700, fontSize: "0.88rem", cursor: "pointer" }}>Account löschen</button>
          </div>
        </div>
      </div>
    </div>
  );
}


