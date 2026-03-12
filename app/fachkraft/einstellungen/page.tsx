"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const NAVY = "#1A3F6F";
const BLUE = "#2471A3";
const GREEN = "#1E8449";
const RED = "#DC2626";

export default function FachkraftEinstellungen() {
  const router = useRouter();
  const [fachkraft, setFachkraft] = useState<any>(null);
  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [anfragen, setAnfragen] = useState<any[]>([]);
  const [anfrageLoading, setAnfrageLoading] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"anfragen"|"profil"|"konto">("anfragen");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT") { router.push("/login"); return; }
      if (event === "INITIAL_SESSION" || event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        if (!session) { router.push("/login"); return; }
        const { data } = await supabase.from("fachkraefte").select("*").eq("email", session.user.email).single();
        if (!data) { router.push("/login"); return; }
        setFachkraft(data); setForm(data); setLoading(false);
        loadAnfragen(data.id);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const loadAnfragen = async (fachkraftId: string) => {
    const { data } = await supabase
      .from("anfragen")
      .select("*")
      .eq("fachkraft_id", fachkraftId)
      .order("created_at", { ascending: false });
    if (data) setAnfragen(data);
  };

  const handleAnfrage = async (anfrageId: string, action: "akzeptiert" | "abgelehnt") => {
    setAnfrageLoading(anfrageId);
    await supabase.from("anfragen").update({ status: action }).eq("id", anfrageId);
    const anfrage = anfragen.find(a => a.id === anfrageId);
    if (anfrage) {
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: action === "akzeptiert" ? "anfrage_akzeptiert" : "anfrage_abgelehnt",
          data: {
            kita_email: anfrage.kita_email,
            kita_name: anfrage.kita_name,
            fachkraft_name: action === "akzeptiert"
              ? `${fachkraft.vorname || fachkraft.username} ${fachkraft.nachname || ""}`.trim()
              : null,
            fachkraft_email: action === "akzeptiert" ? fachkraft.email : null,
            fachkraft_telefon: action === "akzeptiert" ? fachkraft.telefon : null,
          }
        })
      });
    }
    await loadAnfragen(fachkraft.id);
    setAnfrageLoading(null);
  };

  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setSaving(true); setError(""); setSuccess(false);
    const { error: err } = await supabase.from("fachkraefte").update({
      vorname: form.vorname, nachname: form.nachname, telefon: form.telefon,
      wohnort: form.wohnort, bundesland: form.bundesland, qualifikation: form.qualifikation,
      zusatzqualifikation: form.zusatzqualifikation, uniabschluss: form.uniabschluss,
      deutsch: form.deutsch, englisch: form.englisch, weitere_sprachen: form.weitere_sprachen,
      erfahrung_jahre: form.erfahrung_jahre, kita_alter: form.kita_alter,
      beschreibung: form.beschreibung, verfuegbar_ab: form.verfuegbar_ab, arbeitszeit: form.arbeitszeit,
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
    else { alert("Fehler beim Löschen. Bitte kontaktiere uns unter kitabridge@protonmail.com"); }
  };

  const inputStyle: any = { width: "100%", padding: "10px 14px", border: "1.5px solid #D1DAE8", borderRadius: 10, fontSize: "0.92rem", color: NAVY, fontFamily: "'DM Sans', sans-serif", background: "white", outline: "none", boxSizing: "border-box" };
  const labelStyle: any = { fontSize: "0.75rem", fontWeight: 700, color: "#9BA8C0", textTransform: "uppercase", marginBottom: 6, display: "block" };

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

  const offeneAnfragen = anfragen.filter(a => a.status === "ausstehend");
  const bearbeiteteAnfragen = anfragen.filter(a => a.status !== "ausstehend");
  const displayName = fachkraft?.username || `${fachkraft?.vorname || ""} ${fachkraft?.nachname || ""}`.trim();

  if (loading || !form) {
    return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F0F4F9", fontFamily: "'DM Sans', sans-serif" }}><div style={{ color: NAVY }}>Lädt...</div></div>;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4F9", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        input:focus, select:focus, textarea:focus { border-color: #2471A3 !important; }
        .tab-btn { background: none; border: none; padding: 10px 20px; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 0.88rem; font-weight: 600; color: #9BA8C0; border-bottom: 3px solid transparent; transition: all 0.2s; }
        .tab-btn.active { color: ${NAVY}; border-bottom-color: ${NAVY}; }
        .tab-btn:hover { color: ${NAVY}; }
        .anfrage-card { background: white; border-radius: 16px; padding: 20px 24px; margin-bottom: 14px; border: 1.5px solid #E8EDF4; box-shadow: 0 2px 12px rgba(26,63,111,0.06); }
        .anfrage-card.offen { border-left: 4px solid ${BLUE}; }
        .anfrage-card.akzeptiert { border-left: 4px solid ${GREEN}; }
        .anfrage-card.abgelehnt { border-left: 4px solid #D1DAE8; }
        @media (max-width: 600px) {
          .two-col { grid-template-columns: 1fr !important; }
          .action-btns { flex-direction: column !important; }
        }
      `}</style>

      {/* HEADER */}
      <div style={{ background: NAVY, padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <a href="/fachkraft/dashboard" style={{ textDecoration: "none", fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700 }}>
          <span style={{ color: "white" }}>Kita</span><span style={{ color: "#4ADE80" }}>Bridge</span>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <a href="/fachkraft/dashboard" style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem", textDecoration: "none" }}>← Dashboard</a>
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem" }}>{displayName}</span>
          {offeneAnfragen.length > 0 && (
            <div style={{ background: RED, color: "white", borderRadius: 50, padding: "2px 10px", fontSize: "0.78rem", fontWeight: 800 }}>
              {offeneAnfragen.length} neu
            </div>
          )}
          <button onClick={handleLogout} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "white", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: "0.85rem" }}>Ausloggen</button>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 24px" }}>

        {/* VISITENKARTE */}
        <div style={{ background: "linear-gradient(135deg,#0D1B2A 0%,#1A3F6F 60%,#1a5276 100%)", borderRadius: 24, padding: "28px 32px", marginBottom: 28, position: "relative", overflow: "hidden", boxShadow: "0 20px 60px rgba(26,63,111,0.35)" }}>
          <div style={{ position: "absolute", top: -60, right: -60, width: 220, height: 220, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }}/>
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 20 }}>
            <div style={{ width: 64, height: 64, borderRadius: 18, background: "rgba(255,255,255,0.12)", border: "2px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: fachkraft?.username ? "1.8rem" : "1.4rem", fontWeight: 800, color: "white", flexShrink: 0 }}>
              {fachkraft?.username ? "🦸" : `${fachkraft?.vorname?.[0] || ""}${fachkraft?.nachname?.[0] || ""}`}
            </div>
            <div>
              <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "white", lineHeight: 1.1, marginBottom: 4 }}>{displayName}</div>
              {fachkraft?.username && (
                <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.5)", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 2 }}>Superhelden-Modus · Anonym</div>
              )}
              <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.55)" }}>{fachkraft?.qualifikation || "Pädagogische Fachkraft"}</div>
            </div>
            <div style={{ marginLeft: "auto", background: fachkraft?.status === "bestaetigt" ? "linear-gradient(135deg,#1E8449,#27AE60)" : "linear-gradient(135deg,#B7950B,#D4AC0D)", borderRadius: 50, padding: "4px 14px", fontSize: "0.72rem", fontWeight: 800, color: "white", textTransform: "uppercase", letterSpacing: 1, whiteSpace: "nowrap" }}>
              {fachkraft?.status === "bestaetigt" ? "✓ Verifiziert" : "⏳ In Prüfung"}
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {fachkraft?.wohnort && <span style={{ background: "rgba(255,255,255,0.1)", borderRadius: 50, padding: "4px 12px", fontSize: "0.78rem", color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>📍 {fachkraft.wohnort}</span>}
            {fachkraft?.arbeitszeit && <span style={{ background: "rgba(255,255,255,0.1)", borderRadius: 50, padding: "4px 12px", fontSize: "0.78rem", color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>⏱ {fachkraft.arbeitszeit}</span>}
            {fachkraft?.erfahrung_jahre && <span style={{ background: "rgba(255,255,255,0.1)", borderRadius: 50, padding: "4px 12px", fontSize: "0.78rem", color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>⭐ {fachkraft.erfahrung_jahre}</span>}
          </div>
        </div>

        {/* VERFÜGBARKEIT TOGGLE */}
        <div style={{ background: "white", borderRadius: 16, padding: "16px 20px", marginBottom: 20, boxShadow: "0 2px 12px rgba(26,63,111,0.08)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontWeight: 700, color: NAVY, fontSize: "0.95rem", marginBottom: 2 }}>Aktiv auf Jobsuche</div>
            <div style={{ fontSize: "0.8rem", color: "#9BA8C0" }}>{fachkraft?.aktiv_suchend ? "Kitas können dich jetzt kontaktieren" : "Du bist gerade nicht sichtbar für Kitas"}</div>
          </div>
          <div onClick={async () => { const neu = !fachkraft.aktiv_suchend; await supabase.from("fachkraefte").update({ aktiv_suchend: neu }).eq("email", fachkraft.email); setFachkraft({ ...fachkraft, aktiv_suchend: neu }); }} style={{ width: 52, height: 28, borderRadius: 50, background: fachkraft?.aktiv_suchend ? GREEN : "#D1DAE8", cursor: "pointer", position: "relative", transition: "background 0.3s", flexShrink: 0 }}>
            <div style={{ position: "absolute", top: 3, left: fachkraft?.aktiv_suchend ? 26 : 3, width: 22, height: 22, borderRadius: "50%", background: "white", boxShadow: "0 2px 6px rgba(0,0,0,0.2)", transition: "left 0.3s" }}/>
          </div>
        </div>

        {/* TABS */}
        <div style={{ background: "white", borderRadius: 16, marginBottom: 24, boxShadow: "0 2px 12px rgba(26,63,111,0.08)", overflow: "hidden" }}>
          <div style={{ display: "flex", borderBottom: "1px solid #E8EDF4" }}>
            <button className={`tab-btn${activeTab === "anfragen" ? " active" : ""}`} onClick={() => setActiveTab("anfragen")}>
              Anfragen {offeneAnfragen.length > 0 && <span style={{ background: RED, color: "white", borderRadius: 50, padding: "1px 7px", fontSize: "0.72rem", marginLeft: 6 }}>{offeneAnfragen.length}</span>}
            </button>
            <button className={`tab-btn${activeTab === "profil" ? " active" : ""}`} onClick={() => setActiveTab("profil")}>Profil bearbeiten</button>
            <button className={`tab-btn${activeTab === "konto" ? " active" : ""}`} onClick={() => setActiveTab("konto")}>Konto</button>
          </div>

          <div style={{ padding: 24 }}>

            {activeTab === "anfragen" && (
              <div>
                {anfragen.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px 20px" }}>
                    <div style={{ fontSize: "3rem", marginBottom: 16 }}>📭</div>
                    <div style={{ fontWeight: 700, color: NAVY, marginBottom: 8 }}>Noch keine Anfragen</div>
                    <div style={{ color: "#9BA8C0", fontSize: "0.85rem", lineHeight: 1.7 }}>Sobald eine Kita Interesse hat, erscheint die Anfrage hier.</div>
                  </div>
                ) : (
                  <div>
                    {offeneAnfragen.length > 0 && (
                      <div style={{ marginBottom: 28 }}>
                        <div style={{ fontSize: "0.78rem", fontWeight: 800, color: BLUE, textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>Neue Anfragen — {offeneAnfragen.length} offen</div>
                        {offeneAnfragen.map(anfrage => (
                          <div key={anfrage.id} className="anfrage-card offen">
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                              <div>
                                <div style={{ fontWeight: 800, color: NAVY, fontSize: "1rem", marginBottom: 4 }}>{anfrage.kita_name}</div>
                                <div style={{ fontSize: "0.78rem", color: "#9BA8C0" }}>{new Date(anfrage.created_at).toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" })}</div>
                              </div>
                              <span style={{ background: "#EBF4FF", color: BLUE, borderRadius: 50, padding: "4px 12px", fontSize: "0.75rem", fontWeight: 700 }}>Neu</span>
                            </div>
                            {anfrage.nachricht && (
                              <div style={{ background: "#F8FAFF", borderRadius: 10, padding: "12px 16px", marginBottom: 16, fontSize: "0.88rem", color: "#444", lineHeight: 1.7, borderLeft: `3px solid ${BLUE}` }}>"{anfrage.nachricht}"</div>
                            )}
                            <div style={{ background: "#FFF8ED", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: "0.8rem", color: "#92400E" }}>
                              🔒 Kontaktdaten der Kita werden erst nach deiner Zustimmung sichtbar.
                            </div>
                            <div className="action-btns" style={{ display: "flex", gap: 10 }}>
                              <button onClick={() => handleAnfrage(anfrage.id, "akzeptiert")} disabled={anfrageLoading === anfrage.id} style={{ flex: 1, padding: "12px 20px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${GREEN}, #27AE60)`, color: "white", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem" }}>
                                {anfrageLoading === anfrage.id ? "..." : "✓ Annehmen"}
                              </button>
                              <button onClick={() => handleAnfrage(anfrage.id, "abgelehnt")} disabled={anfrageLoading === anfrage.id} style={{ flex: 1, padding: "12px 20px", borderRadius: 10, border: "2px solid #E2E8F0", background: "white", color: "#6B7897", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem" }}>
                                {anfrageLoading === anfrage.id ? "..." : "✗ Ablehnen"}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {bearbeiteteAnfragen.length > 0 && (
                      <div>
                        <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "#9BA8C0", textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>Bearbeitet</div>
                        {bearbeiteteAnfragen.map(anfrage => (
                          <div key={anfrage.id} className={`anfrage-card ${anfrage.status}`}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <div>
                                <div style={{ fontWeight: 700, color: NAVY, fontSize: "0.95rem", marginBottom: 2 }}>{anfrage.kita_name}</div>
                                <div style={{ fontSize: "0.78rem", color: "#9BA8C0" }}>{new Date(anfrage.created_at).toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" })}</div>
                              </div>
                              <span style={{ background: anfrage.status === "akzeptiert" ? "#EAF7EF" : "#F8F8F8", color: anfrage.status === "akzeptiert" ? GREEN : "#9BA8C0", borderRadius: 50, padding: "4px 14px", fontSize: "0.75rem", fontWeight: 700 }}>
                                {anfrage.status === "akzeptiert" ? "✓ Angenommen" : "✗ Abgelehnt"}
                              </span>
                            </div>
                            {anfrage.status === "akzeptiert" && (
                              <div style={{ marginTop: 12, padding: "10px 14px", background: "#EAF7EF", borderRadius: 10, fontSize: "0.82rem", color: GREEN, fontWeight: 600 }}>
                                Die Kita hat deine Kontaktdaten erhalten und wird sich bei dir melden.
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === "profil" && (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }} className="two-col">
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
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }} className="two-col">
                  {fieldGroup("Deutsch", "deutsch", "text", ["Muttersprache","Sehr gut (C1/C2)","Gut (B1/B2)","Grundkenntnisse (A1/A2)"])}
                  {fieldGroup("Englisch", "englisch", "text", ["Muttersprache","Sehr gut (C1/C2)","Gut (B1/B2)","Grundkenntnisse (A1/A2)","Keine"])}
                </div>
                {fieldGroup("Weitere Sprachen", "weitere_sprachen")}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }} className="two-col">
                  {fieldGroup("Verfügbar ab", "verfuegbar_ab", "date")}
                  {fieldGroup("Arbeitszeit", "arbeitszeit", "text", ["Vollzeit","Teilzeit","Vollzeit & Teilzeit","Minijob"])}
                </div>
                <div style={{ marginBottom: 18 }}>
                  <label style={labelStyle}>Kurzbeschreibung</label>
                  <textarea name="beschreibung" value={form.beschreibung || ""} onChange={handleChange} rows={4} style={{ ...inputStyle, resize: "vertical" }} placeholder="Beschreibe dich kurz"/>
                </div>
                {error && <div style={{ marginBottom: 12, padding: "12px 16px", background: "#FFF5F5", borderRadius: 10, color: "#9B1C1C", fontSize: "0.88rem" }}>{error}</div>}
                {success && <div style={{ marginBottom: 12, padding: "12px 16px", background: "#EAF7EF", borderRadius: 10, color: GREEN, fontSize: "0.88rem", fontWeight: 600 }}>✓ Profil gespeichert!</div>}
                <button onClick={handleSave} disabled={saving} style={{ width: "100%", background: saving ? "#9BA8C0" : NAVY, color: "white", border: "none", padding: "14px 24px", borderRadius: 12, fontWeight: 700, fontSize: "1rem", cursor: saving ? "not-allowed" : "pointer" }}>
                  {saving ? "Wird gespeichert..." : "Änderungen speichern"}
                </button>
              </div>
            )}

            {activeTab === "konto" && (
              <div>
                <div style={{ padding: 20, background: "#FFF5F5", border: "1px solid #FED7D7", borderRadius: 12 }}>
                  <div style={{ fontWeight: 700, color: "#9B1C1C", marginBottom: 6 }}>Account löschen</div>
                  <div style={{ color: "#7F1D1D", fontSize: "0.84rem", marginBottom: 14 }}>Dein Account und alle Daten werden unwiderruflich gelöscht.</div>
                  <button onClick={handleDeleteAccount} style={{ background: RED, color: "white", border: "none", padding: "10px 20px", borderRadius: 8, fontWeight: 700, fontSize: "0.88rem", cursor: "pointer" }}>Account löschen</button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
