"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } = from "next/navigation";

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

export default function Dashboard() {
  const router = useRouter();
  const [arbeitgeber, setArbeitgeber] = useState(null);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("uebersicht");
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => { loadDashboard(); }, []);

  const loadDashboard = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { router.push("/login"); return; }
    const { data } = await supabase.from("arbeitgeber").select("*").eq("email", session.user.email).single();
    setArbeitgeber(data);
    setForm(data);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const set = (key, value) => setForm(f => ({ ...f, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    setSaveError("");
    setSaveSuccess(false);
    const { error } = await supabase.from("arbeitgeber").update({
      einrichtung_name: form.einrichtung_name,
      einrichtungstyp: form.einrichtungstyp,
      traeger: form.traeger,
      beschreibung: form.beschreibung,
      strasse: form.strasse,
      hausnummer: form.hausnummer,
      plz: form.plz,
      ort: form.ort,
      bundesland: form.bundesland,
      ansprech_name: form.ansprech_name,
      ansprech_rolle: form.ansprech_rolle,
      telefon: form.telefon,
      stellen_anzahl: form.stellen_anzahl,
    }).eq("email", arbeitgeber.email);
    setSaving(false);
    if (error) {
      setSaveError("Fehler beim Speichern: " + error.message);
    } else {
      setArbeitgeber({ ...arbeitgeber, ...form });
      setEditMode(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleDeleteAccount = async () => {
    const bestaetigung = window.confirm("Sind Sie sicher? Ihr Account und alle Daten werden unwiderruflich gelöscht.");
    if (!bestaetigung) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const res = await fetch("/api/account/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: session.user.email, rolle: "arbeitgeber" }),
    });
    if (res.ok) {
      await supabase.auth.signOut();
      alert("Ihr Account wurde erfolgreich gelöscht.");
      router.push("/");
    } else {
      alert("Fehler beim Löschen. Bitte kontaktieren Sie uns unter kitabridge@protonmail.com");
    }
  };

  const handleKuendigung = async () => {
    const bestaetigung = window.confirm("Möchten Sie Ihr Abo wirklich kündigen?");
    if (!bestaetigung) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const res = await fetch("/api/stripe/kuendigung", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: session.user.email }),
    });
    if (res.ok) {
      alert("Ihr Abo wurde erfolgreich gekündigt.");
      loadDashboard();
    } else {
      alert("Fehler beim Kündigen. Bitte kontaktieren Sie uns unter kitabridge@protonmail.com");
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F0F4F9", fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ color: NAVY }}>Lädt...</div>
      </div>
    );
  }

  const isAktiv = arbeitgeber?.status === "aktiv" || arbeitgeber?.status === "bestaetigt";

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4F9", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap'); * { box-sizing: border-box; } input:focus, select:focus, textarea:focus { border-color: #2471A3 !important; }`}</style>

      <div style={{ background: NAVY, padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <a href="/" style={{ textDecoration: "none", fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700 }}>
          <span style={{ color: "white" }}>Kita</span><span style={{ color: "#4ADE80" }}>Bridge</span>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem" }}>{arbeitgeber?.einrichtung_name}</span>
          <button onClick={handleLogout} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "white", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: "0.85rem", fontFamily: "'DM Sans', sans-serif" }}>
            Ausloggen
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>

        {!isAktiv && (
          <div style={{ background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: 16, padding: 20, marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
            <div>
              <div style={{ fontWeight: 700, color: "#92400E", marginBottom: 4 }}>⚠️ Konto noch nicht aktiv</div>
              <div style={{ color: "#78350F", fontSize: "0.88rem" }}>Ihr Account wird gerade geprüft oder die Zahlung steht noch aus.</div>
            </div>
            <a href="/bezahlung" style={{ background: "#EA580C", color: "white", padding: "10px 20px", borderRadius: 10, fontWeight: 700, textDecoration: "none", fontSize: "0.88rem", whiteSpace: "nowrap", fontFamily: "'DM Sans', sans-serif" }}>
              Jetzt bezahlen
            </a>
          </div>
        )}

        {isAktiv && (
          <div style={{ background: "#EAF7EF", border: "1px solid #BBF7D0", borderRadius: 16, padding: 16, marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: "1.2rem" }}>✅</span>
            <span style={{ color: GREEN, fontWeight: 700, fontSize: "0.9rem" }}>Konto aktiv – Sie haben vollen Zugang zu allen Fachkräfte-Profilen</span>
          </div>
        )}

        {saveSuccess && (
          <div style={{ background: "#EAF7EF", border: "1px solid #BBF7D0", borderRadius: 12, padding: 14, marginBottom: 20, color: GREEN, fontWeight: 600, fontSize: "0.9rem" }}>
            ✅ Profil erfolgreich gespeichert!
          </div>
        )}

        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", color: NAVY, marginBottom: 4 }}>
            Willkommen, {arbeitgeber?.ansprech_name?.split(" ")[0] || ""}! 👋
          </h1>
          <p style={{ color: "#9BA8C0", fontSize: "0.9rem" }}>{arbeitgeber?.einrichtung_name} · {arbeitgeber?.ort}</p>
        </div>

        <div style={{ display: "flex", gap: 4, marginBottom: 28, background: "white", borderRadius: 12, padding: 4, width: "fit-content", boxShadow: "0 2px 8px rgba(26,63,111,0.08)" }}>
          {[
            { key: "uebersicht", label: "Übersicht" },
            { key: "profil", label: "Mein Profil" },
            { key: "suche", label: "Fachkräfte suchen" },
          ].map(tab => (
            <button key={tab.key} onClick={() => tab.key === "suche" ? router.push("/suche") : setActiveTab(tab.key)} style={{ padding: "9px 20px", borderRadius: 9, border: "none", background: activeTab === tab.key ? NAVY : "transparent", color: activeTab === tab.key ? "white" : "#6B7897", fontWeight: 600, fontSize: "0.88rem", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" }}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "uebersicht" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 28 }}>
              {[
                { icon: "👥", label: "Offene Stellen", value: arbeitgeber?.stellen_anzahl || "-" },
                { icon: "📍", label: "Standort", value: arbeitgeber?.ort || "-" },
                { icon: "🏢", label: "Einrichtungstyp", value: arbeitgeber?.einrichtungstyp || "-" },
              ].map(stat => (
                <div key={stat.label} style={{ background: "white", borderRadius: 16, padding: 24, boxShadow: "0 2px 12px rgba(26,63,111,0.08)" }}>
                  <div style={{ fontSize: "1.8rem", marginBottom: 8 }}>{stat.icon}</div>
                  <div style={{ fontSize: "0.78rem", color: "#9BA8C0", fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>{stat.label}</div>
                  <div style={{ fontSize: "1rem", fontWeight: 700, color: NAVY }}>{stat.value}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={{ background: "white", borderRadius: 20, padding: 28, boxShadow: "0 2px 12px rgba(26,63,111,0.08)" }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: NAVY, marginBottom: 16 }}>Schnellzugriff</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <a href="/suche" style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 10, background: "#F8FAFF", textDecoration: "none", color: NAVY, fontWeight: 600, fontSize: "0.9rem" }}>
                    <span>🔍</span> Fachkräfte suchen
                  </a>
                  <button onClick={() => setActiveTab("profil")} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 10, background: "#F8FAFF", border: "none", color: NAVY, fontWeight: 600, fontSize: "0.9rem", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", textAlign: "left" }}>
                    <span>✏️</span> Profil bearbeiten
                  </button>
                  <a href="/kontakt" style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 10, background: "#F8FAFF", textDecoration: "none", color: NAVY, fontWeight: 600, fontSize: "0.9rem" }}>
                    <span>✉️</span> Support kontaktieren
                  </a>
                </div>
              </div>

              <div style={{ background: `linear-gradient(135deg, ${NAVY}, ${BLUE})`, borderRadius: 20, padding: 28, color: "white" }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", marginBottom: 12 }}>Ihr Plan</h3>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 700, marginBottom: 4 }}>299 EUR</div>
                <div style={{ opacity: 0.7, fontSize: "0.82rem", marginBottom: 20 }}>pro Monat, zzgl. MwSt.</div>
                {arbeitgeber?.stripe_subscription_id && (
                  <button onClick={handleKuendigung} style={{ marginBottom: 16, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.3)", color: "white", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: "0.78rem", fontFamily: "'DM Sans', sans-serif", width: "100%" }}>
                    Abo kündigen
                  </button>
                )}
                {["Alle Fachkräfte-Profile","Direktkontakt","Keine Provision","Monatlich kündbar"].map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, fontSize: "0.85rem" }}>
                    <span style={{ color: "#4ADE80" }}>✓</span> {f}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "profil" && (
          <div style={{ background: "white", borderRadius: 20, padding: 32, boxShadow: "0 2px 12px rgba(26,63,111,0.08)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: NAVY, margin: 0 }}>Mein Profil</h2>
              {!editMode ? (
                <button onClick={() => setEditMode(true)} style={{ background: NAVY, color: "white", border: "none", padding: "9px 20px", borderRadius: 9, fontWeight: 700, fontSize: "0.88rem", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                  ✏️ Bearbeiten
                </button>
              ) : (
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => { setEditMode(false); setForm(arbeitgeber); }} style={{ background: "transparent", color: NAVY, border: `1px solid ${NAVY}`, padding: "9px 16px", borderRadius: 9, fontWeight: 700, fontSize: "0.88rem", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                    Abbrechen
                  </button>
                  <button onClick={handleSave} disabled={saving} style={{ background: GREEN, color: "white", border: "none", padding: "9px 20px", borderRadius: 9, fontWeight: 700, fontSize: "0.88rem", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                    {saving ? "Speichert..." : "💾 Speichern"}
                  </button>
                </div>
              )}
            </div>

            {!editMode ? (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
                {[
                  ["Einrichtung", arbeitgeber?.einrichtung_name],
                  ["Einrichtungstyp", arbeitgeber?.einrichtungstyp],
                  ["Träger", arbeitgeber?.traeger],
                  ["Ansprechpartner", arbeitgeber?.ansprech_name],
                  ["Rolle", arbeitgeber?.ansprech_rolle],
                  ["E-Mail", arbeitgeber?.email],
                  ["Telefon", arbeitgeber?.telefon],
                  ["Adresse", `${arbeitgeber?.strasse} ${arbeitgeber?.hausnummer}, ${arbeitgeber?.plz} ${arbeitgeber?.ort}`],
                  ["Bundesland", arbeitgeber?.bundesland],
                  ["Offene Stellen", arbeitgeber?.stellen_anzahl],
                  ["Status", arbeitgeber?.status],
                ].map(([k, v]) => v ? (
                  <div key={k} style={{ padding: "14px 0", borderBottom: "1px solid #F0F4F9" }}>
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#9BA8C0", textTransform: "uppercase", marginBottom: 4 }}>{k}</div>
                    <div style={{ color: NAVY, fontWeight: 600, fontSize: "0.92rem" }}>{v}</div>
                  </div>
                ) : null)}
              </div>
            ) : (
              <div>
                {/* Einrichtung */}
                <div style={{ marginBottom: 8, fontWeight: 700, color: BLUE, fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: 1 }}>Einrichtung</div>
                <div style={{ height: 1, background: "#F0F4F9", marginBottom: 16 }} />
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Name der Einrichtung</label>
                  <input style={inputStyle} value={form.einrichtung_name || ""} onChange={e => set("einrichtung_name", e.target.value)} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={labelStyle}>Einrichtungstyp</label>
                    <select style={selectStyle} value={form.einrichtungstyp || ""} onChange={e => set("einrichtungstyp", e.target.value)}>
                      <option value="">– bitte wählen –</option>
                      {["Krippe (0-3 Jahre)","Kindergarten (3-6 Jahre)","Kita (0-6 Jahre)","Hort (6-12 Jahre)","Integrationskita","Waldkita","Montessori Kita","Betriebskita"].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Träger</label>
                    <select style={selectStyle} value={form.traeger || ""} onChange={e => set("traeger", e.target.value)}>
                      <option value="">– bitte wählen –</option>
                      {["Öffentlich (kommunal)","AWO","Caritas","Diakonie","DRK","Paritätischer Wohlfahrtsverband","Privat / Eigenträger","Sonstiger freier Träger"].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Beschreibung</label>
                  <textarea style={{ ...inputStyle, height: 90, resize: "vertical" }} value={form.beschreibung || ""} onChange={e => set("beschreibung", e.target.value)} />
                </div>

                {/* Adresse */}
                <div style={{ marginTop: 8, marginBottom: 8, fontWeight: 700, color: BLUE, fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: 1 }}>Adresse</div>
                <div style={{ height: 1, background: "#F0F4F9", marginBottom: 16 }} />
                <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr", gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={labelStyle}>Straße</label>
                    <input style={inputStyle} value={form.strasse || ""} onChange={e => set("strasse", e.target.value)} />
                  </div>
                  <div>
                    <label style={labelStyle}>Hausnummer</label>
                    <input style={inputStyle} value={form.hausnummer || ""} onChange={e => set("hausnummer", e.target.value)} />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={labelStyle}>PLZ</label>
                    <input style={inputStyle} value={form.plz || ""} onChange={e => set("plz", e.target.value)} />
                  </div>
                  <div>
                    <label style={labelStyle}>Ort</label>
                    <input style={inputStyle} value={form.ort || ""} onChange={e => set("ort", e.target.value)} />
                  </div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Bundesland</label>
                  <select style={selectStyle} value={form.bundesland || ""} onChange={e => set("bundesland", e.target.value)}>
                    <option value="">– bitte wählen –</option>
                    {["Baden-Württemberg","Bayern","Berlin","Brandenburg","Bremen","Hamburg","Hessen","Mecklenburg-Vorpommern","Niedersachsen","Nordrhein-Westfalen","Rheinland-Pfalz","Saarland","Sachsen","Sachsen-Anhalt","Schleswig-Holstein","Thüringen"].map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>

                {/* Ansprechpartner */}
                <div style={{ marginTop: 8, marginBottom: 8, fontWeight: 700, color: BLUE, fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: 1 }}>Ansprechpartner</div>
                <div style={{ height: 1, background: "#F0F4F9", marginBottom: 16 }} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={labelStyle}>Name</label>
                    <input style={inputStyle} value={form.ansprech_name || ""} onChange={e => set("ansprech_name", e.target.value)} />
                  </div>
                  <div>
                    <label style={labelStyle}>Rolle</label>
                    <select style={selectStyle} value={form.ansprech_rolle || ""} onChange={e => set("ansprech_rolle", e.target.value)}>
                      <option value="">– bitte wählen –</option>
                      {["Kita-Leitung","Stellv. Leitung","Träger-Geschäftsführung","HR / Personal","Sonstiges"].map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Telefon</label>
                  <input style={inputStyle} value={form.telefon || ""} onChange={e => set("telefon", e.target.value)} />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Offene Stellen</label>
                  <select style={selectStyle} value={form.stellen_anzahl || ""} onChange={e => set("stellen_anzahl", e.target.value)}>
                    <option value="">– bitte wählen –</option>
                    {["1 Stelle","2-3 Stellen","4-5 Stellen","6-10 Stellen","Mehr als 10 Stellen"].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                {saveError && (
                  <div style={{ padding: "12px 16px", background: "#FFF5F5", border: "1px solid #FED7D7", borderRadius: 10, color: "#9B1C1C", fontSize: "0.88rem", marginBottom: 16 }}>
                    ⚠️ {saveError}
                  </div>
                )}
              </div>
            )}

            {/* Account löschen */}
            <div style={{ marginTop: 32, padding: 20, background: "#FFF5F5", border: "1px solid #FED7D7", borderRadius: 12 }}>
              <div style={{ fontWeight: 700, color: "#9B1C1C", marginBottom: 6, fontSize: "0.95rem" }}>⚠️ Account löschen</div>
              <div style={{ color: "#7F1D1D", fontSize: "0.84rem", marginBottom: 14 }}>
                Ihr Account und alle Ihre Daten werden unwiderruflich gelöscht.
              </div>
              <button onClick={handleDeleteAccount} style={{ background: "#DC2626", color: "white", border: "none", padding: "10px 20px", borderRadius: 8, fontWeight: 700, fontSize: "0.88rem", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                Account unwiderruflich löschen
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
