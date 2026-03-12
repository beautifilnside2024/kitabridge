"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const NAVY = "#1A3F6F";
const BLUE = "#2471A3";
const GREEN = "#1E8449";
const RED = "#DC2626";

export default function FachkraftDashboard() {
  const router = useRouter();
  const [fachkraft, setFachkraft] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [anfragen, setAnfragen] = useState<any[]>([]);
  const [anfrageLoading, setAnfrageLoading] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"uebersicht" | "anfragen" | "nachrichten" | "profil" | "konto">("uebersicht");
  const [form, setForm] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");

  // Nachrichten state
  const [nachrichten, setNachrichten] = useState<any[]>([]);
  const [arbeitgeberMap, setArbeitgeberMap] = useState<any>({});
  const [antwort, setAntwort] = useState<any>({});
  const [sendingMsg, setSendingMsg] = useState<string | null>(null);
  const [msgSent, setMsgSent] = useState<any>({});

  useEffect(() => { loadDashboard(); }, []);

  const loadDashboard = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { router.push("/login?rolle=fachkraft"); return; }
    const { data } = await supabase.from("fachkraefte").select("*").eq("email", session.user.email).single();
    if (!data) { router.push("/login?rolle=fachkraft"); return; }
    setFachkraft(data);
    setForm(data);
    setLoading(false);
    loadAnfragen(data.id);
    loadNachrichten(data.id);
  };

  const loadAnfragen = async (id: string) => {
    const { data } = await supabase
      .from("anfragen")
      .select("*")
      .eq("fachkraft_id", id)
      .order("created_at", { ascending: false });
    setAnfragen(data || []);
  };

  const loadNachrichten = async (fachkraftId: string) => {
    const res = await fetch(`/api/nachrichten?user_id=${fachkraftId}`);
    const msgs = await res.json();
    setNachrichten(msgs || []);

    // Lade Arbeitgeber-Infos für alle Gesprächspartner
    const arbeitgeberIds = [...new Set((msgs || []).map((m: any) =>
      m.von_id === fachkraftId ? m.an_id : m.von_id
    ))].filter(id => id !== fachkraftId);

    if (arbeitgeberIds.length > 0) {
      const { data: arbeitgeber } = await supabase
        .from("arbeitgeber")
        .select("id, einrichtung_name, email")
        .in("id", arbeitgeberIds as string[]);
      const map: any = {};
      (arbeitgeber || []).forEach((a: any) => { map[a.id] = a; });
      setArbeitgeberMap(map);
    }
  };

  const handleAnfrage = async (anfrageId: string, action: "akzeptiert" | "abgelehnt") => {
    setAnfrageLoading(anfrageId);
    await supabase.from("anfragen").update({ status: action }).eq("id", anfrageId);
    const anfrage = anfragen.find(a => a.id === anfrageId);
    if (anfrage && action === "akzeptiert") {
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "anfrage_akzeptiert",
          data: {
            kita_email: anfrage.kita_email,
            kita_name: anfrage.kita_name,
            fachkraft_name: `${fachkraft.vorname || fachkraft.username} ${fachkraft.nachname || ""}`.trim(),
            fachkraft_email: fachkraft.email,
            fachkraft_telefon: fachkraft.telefon,
          }
        })
      });
    }
    await loadAnfragen(fachkraft.id);
    setAnfrageLoading(null);
  };

  const handleAntwort = async (partnerId: string) => {
    const text = antwort[partnerId];
    if (!text?.trim()) return;
    setSendingMsg(partnerId);
    const ag = arbeitgeberMap[partnerId];
    await fetch("/api/nachrichten", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        von_id: fachkraft.id,
        an_id: partnerId,
        von_typ: "fachkraft",
        nachricht: text,
        empfaenger_email: ag?.email || "",
        empfaenger_name: ag?.einrichtung_name || "Einrichtung",
        absender_name: fachkraft.vorname || fachkraft.username || "Fachkraft",
      }),
    });
    setAntwort({ ...antwort, [partnerId]: "" });
    setMsgSent({ ...msgSent, [partnerId]: true });
    setTimeout(() => setMsgSent((m: any) => ({ ...m, [partnerId]: false })), 2000);
    setSendingMsg(null);
    await loadNachrichten(fachkraft.id);
  };

  const handleSave = async () => {
    setSaving(true); setSaveError(""); setSaveSuccess(false);
    const { error } = await supabase.from("fachkraefte").update({
      vorname: form.vorname, nachname: form.nachname, telefon: form.telefon,
      wohnort: form.wohnort, bundesland: form.bundesland, qualifikation: form.qualifikation,
      zusatzqualifikation: form.zusatzqualifikation, uniabschluss: form.uniabschluss,
      deutsch: form.deutsch, englisch: form.englisch, weitere_sprachen: form.weitere_sprachen,
      erfahrung_jahre: form.erfahrung_jahre, kita_alter: form.kita_alter,
      beschreibung: form.beschreibung, verfuegbar_ab: form.verfuegbar_ab, arbeitszeit: form.arbeitszeit,
    }).eq("email", fachkraft.email);
    setSaving(false);
    if (error) setSaveError("Fehler beim Speichern.");
    else { setFachkraft({ ...fachkraft, ...form }); setSaveSuccess(true); setTimeout(() => setSaveSuccess(false), 3000); }
  };

  const handleLogout = async () => { await supabase.auth.signOut(); router.push("/login"); };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Bist du sicher? Dein Account wird unwiderruflich gelöscht.")) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const res = await fetch("/api/account/delete", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: session.user.email, rolle: "fachkraft" }) });
    if (res.ok) { await supabase.auth.signOut(); router.push("/"); }
    else alert("Fehler beim Löschen. Bitte kontaktiere uns unter hallo@kitabridge.de");
  };

  const inputStyle: any = { width: "100%", padding: "10px 14px", border: "1.5px solid #D1DAE8", borderRadius: 10, fontSize: "0.92rem", color: NAVY, fontFamily: "'DM Sans', sans-serif", background: "white", outline: "none", boxSizing: "border-box", marginBottom: 4 };
  const labelStyle: any = { fontSize: "0.75rem", fontWeight: 700, color: "#9BA8C0", textTransform: "uppercase", marginBottom: 6, display: "block", letterSpacing: "0.5px" };

  const offeneAnfragen = anfragen.filter(a => a.status === "ausstehend");
  const bearbeiteteAnfragen = anfragen.filter(a => a.status !== "ausstehend");
  const displayName = fachkraft?.username || `${fachkraft?.vorname || ""} ${fachkraft?.nachname || ""}`.trim() || "Fachkraft";

  // Nachrichten gruppiert nach Gesprächspartner
  const getKonversationen = () => {
    if (!fachkraft) return {};
    const map: any = {};
    nachrichten.forEach((msg: any) => {
      const partnerId = msg.von_id === fachkraft.id ? msg.an_id : msg.von_id;
      if (!map[partnerId]) map[partnerId] = [];
      map[partnerId].push(msg);
    });
    return map;
  };

  const konversationen = getKonversationen();
  const ungeleseneNachrichten = nachrichten.filter((m: any) => m.von_id !== fachkraft?.id && m.von_typ === "arbeitgeber").length;

  const fieldGroup = (label: string, name: string, type = "text", options?: string[]) => (
    <div style={{ marginBottom: 16 }}>
      <label style={labelStyle}>{label}</label>
      {options ? (
        <select name={name} value={form?.[name] || ""} onChange={e => setForm({ ...form, [name]: e.target.value })} style={inputStyle}>
          <option value="">– bitte wählen –</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} name={name} value={form?.[name] || ""} onChange={e => setForm({ ...form, [name]: e.target.value })} style={inputStyle} />
      )}
    </div>
  );

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F0F4F9", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ color: NAVY, fontWeight: 600 }}>Lädt...</div>
    </div>
  );

  const tabs = [
    { key: "uebersicht", label: "🏠 Übersicht" },
    { key: "anfragen", label: `📩 Anfragen${offeneAnfragen.length > 0 ? ` (${offeneAnfragen.length})` : ""}` },
    { key: "nachrichten", label: `💬 Nachrichten${ungeleseneNachrichten > 0 ? ` (${ungeleseneNachrichten})` : ""}` },
    { key: "profil", label: "✏️ Profil" },
    { key: "konto", label: "⚙️ Konto" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4F9", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        input:focus, select:focus, textarea:focus { border-color: #2471A3 !important; outline: none; }
        .tab-btn { flex: 1; background: none; border: none; padding: 12px 8px; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 0.82rem; font-weight: 600; color: #9BA8C0; border-bottom: 3px solid transparent; transition: all 0.2s; white-space: nowrap; }
        .tab-btn.active { color: ${NAVY}; border-bottom-color: ${NAVY}; }
        .tab-btn:hover { color: ${NAVY}; }
        .anfrage-card { background: white; border-radius: 16px; padding: 20px; margin-bottom: 12px; border: 1.5px solid #E8EDF4; box-shadow: 0 2px 8px rgba(26,63,111,0.06); }
        .stat-card { background: white; border-radius: 14px; padding: 16px; box-shadow: 0 2px 8px rgba(26,63,111,0.07); flex: 1; }
        @media (max-width: 600px) {
          .two-col { grid-template-columns: 1fr !important; }
          .stats-row { flex-direction: column !important; }
          .action-btns { flex-direction: column !important; }
          .header-inner { padding: 0 16px !important; }
          .main-pad { padding: 16px !important; }
          .tab-btn { font-size: 0.72rem; padding: 10px 4px; }
        }
      `}</style>

      {/* HEADER */}
      <div style={{ background: NAVY, position: "sticky", top: 0, zIndex: 50, boxShadow: "0 2px 16px rgba(0,0,0,0.2)" }}>
        <div className="header-inner" style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/" style={{ textDecoration: "none", fontFamily: "'Playfair Display', serif", fontSize: "1.25rem", fontWeight: 700 }}>
            <span style={{ color: "white" }}>Kita</span><span style={{ color: "#4ADE80" }}>Bridge</span>
          </a>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {offeneAnfragen.length > 0 && (
              <div style={{ background: RED, color: "white", borderRadius: 50, padding: "2px 9px", fontSize: "0.75rem", fontWeight: 800 }}>
                {offeneAnfragen.length} neu
              </div>
            )}
            <button onClick={handleLogout} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", color: "white", padding: "6px 14px", borderRadius: 8, cursor: "pointer", fontSize: "0.82rem", fontFamily: "'DM Sans', sans-serif" }}>
              Ausloggen
            </button>
          </div>
        </div>
      </div>

      <div className="main-pad" style={{ maxWidth: 760, margin: "0 auto", padding: "24px 24px" }}>

        {/* PROFIL-KARTE */}
        <div style={{ background: `linear-gradient(135deg, #0D1B2A 0%, ${NAVY} 60%, #1a5276 100%)`, borderRadius: 22, padding: "24px 28px", marginBottom: 20, position: "relative", overflow: "hidden", boxShadow: "0 16px 48px rgba(26,63,111,0.3)" }}>
          <div style={{ position: "absolute", top: -50, right: -50, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16, position: "relative" }}>
            <div style={{ width: 58, height: 58, borderRadius: 16, background: "rgba(255,255,255,0.12)", border: "2px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: fachkraft?.username ? "1.6rem" : "1.2rem", fontWeight: 800, color: "white", flexShrink: 0 }}>
              {fachkraft?.username ? "🦸" : `${fachkraft?.vorname?.[0] || ""}${fachkraft?.nachname?.[0] || ""}`.toUpperCase() || "👤"}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "white", fontFamily: "'Playfair Display', serif", lineHeight: 1.1 }}>{displayName}</div>
              {fachkraft?.username && <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.45)", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginTop: 2 }}>Anonym-Modus</div>}
              <div style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.55)", marginTop: 2 }}>{fachkraft?.qualifikation || "Pädagogische Fachkraft"}</div>
            </div>
            <div style={{ background: fachkraft?.status === "bestaetigt" ? "linear-gradient(135deg,#1E8449,#27AE60)" : "rgba(255,255,255,0.15)", borderRadius: 50, padding: "5px 14px", fontSize: "0.72rem", fontWeight: 800, color: "white", textTransform: "uppercase", letterSpacing: 1, whiteSpace: "nowrap", border: fachkraft?.status !== "bestaetigt" ? "1px solid rgba(255,255,255,0.2)" : "none" }}>
              {fachkraft?.status === "bestaetigt" ? "✓ Verifiziert" : "⏳ In Prüfung"}
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, position: "relative" }}>
            {fachkraft?.wohnort && <span style={{ background: "rgba(255,255,255,0.1)", borderRadius: 50, padding: "3px 12px", fontSize: "0.76rem", color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>📍 {fachkraft.wohnort}</span>}
            {fachkraft?.arbeitszeit && <span style={{ background: "rgba(255,255,255,0.1)", borderRadius: 50, padding: "3px 12px", fontSize: "0.76rem", color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>⏱ {fachkraft.arbeitszeit}</span>}
            {fachkraft?.erfahrung_jahre && <span style={{ background: "rgba(255,255,255,0.1)", borderRadius: 50, padding: "3px 12px", fontSize: "0.76rem", color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>⭐ {fachkraft.erfahrung_jahre} Jahre</span>}
            {fachkraft?.bundesland && <span style={{ background: "rgba(255,255,255,0.1)", borderRadius: 50, padding: "3px 12px", fontSize: "0.76rem", color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>🗺 {fachkraft.bundesland}</span>}
          </div>
        </div>

        {/* SICHTBARKEIT TOGGLE */}
        <div style={{ background: "white", borderRadius: 14, padding: "14px 18px", marginBottom: 20, boxShadow: "0 2px 8px rgba(26,63,111,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div>
            <div style={{ fontWeight: 700, color: NAVY, fontSize: "0.92rem" }}>Aktiv auf Jobsuche</div>
            <div style={{ fontSize: "0.78rem", color: "#9BA8C0", marginTop: 2 }}>
              {fachkraft?.aktiv_suchend ? "✅ Du bist sichtbar – Kitas können dich kontaktieren" : "⏸ Du bist gerade nicht sichtbar für Kitas"}
            </div>
          </div>
          <div
            onClick={async () => {
              const neu = !fachkraft.aktiv_suchend;
              await supabase.from("fachkraefte").update({ aktiv_suchend: neu }).eq("email", fachkraft.email);
              setFachkraft({ ...fachkraft, aktiv_suchend: neu });
            }}
            style={{ width: 50, height: 26, borderRadius: 50, background: fachkraft?.aktiv_suchend ? GREEN : "#D1DAE8", cursor: "pointer", position: "relative", transition: "background 0.3s", flexShrink: 0 }}
          >
            <div style={{ position: "absolute", top: 3, left: fachkraft?.aktiv_suchend ? 24 : 3, width: 20, height: 20, borderRadius: "50%", background: "white", boxShadow: "0 2px 6px rgba(0,0,0,0.2)", transition: "left 0.3s" }} />
          </div>
        </div>

        {/* TABS */}
        <div style={{ background: "white", borderRadius: 16, boxShadow: "0 2px 12px rgba(26,63,111,0.08)", overflow: "hidden" }}>
          <div style={{ display: "flex", borderBottom: "1px solid #E8EDF4", overflowX: "auto" }}>
            {tabs.map(tab => (
              <button
                key={tab.key}
                className={`tab-btn${activeTab === tab.key ? " active" : ""}`}
                onClick={() => setActiveTab(tab.key as any)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div style={{ padding: "20px 20px" }}>

            {/* ── ÜBERSICHT ── */}
            {activeTab === "uebersicht" && (
              <div>
                <div className="stats-row" style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                  {[
                    { icon: "📩", label: "Offene Anfragen", value: offeneAnfragen.length, color: offeneAnfragen.length > 0 ? RED : NAVY },
                    { icon: "✅", label: "Angenommen", value: anfragen.filter(a => a.status === "akzeptiert").length, color: GREEN },
                    { icon: "💬", label: "Nachrichten", value: nachrichten.length, color: BLUE },
                  ].map(stat => (
                    <div key={stat.label} className="stat-card">
                      <div style={{ fontSize: "1.4rem", marginBottom: 6 }}>{stat.icon}</div>
                      <div style={{ fontSize: "1.6rem", fontWeight: 800, color: stat.color, fontFamily: "'Playfair Display', serif", lineHeight: 1 }}>{stat.value}</div>
                      <div style={{ fontSize: "0.72rem", color: "#9BA8C0", fontWeight: 700, textTransform: "uppercase", marginTop: 4 }}>{stat.label}</div>
                    </div>
                  ))}
                </div>

                {offeneAnfragen.length > 0 ? (
                  <div style={{ background: "#FFF8ED", border: "1px solid #FED7AA", borderRadius: 14, padding: 16, marginBottom: 16 }}>
                    <div style={{ fontWeight: 700, color: "#92400E", marginBottom: 10, fontSize: "0.88rem" }}>
                      🔔 Du hast {offeneAnfragen.length} neue {offeneAnfragen.length === 1 ? "Anfrage" : "Anfragen"}!
                    </div>
                    {offeneAnfragen.slice(0, 2).map(a => (
                      <div key={a.id} style={{ background: "white", borderRadius: 10, padding: "10px 14px", marginBottom: 8, fontSize: "0.85rem", fontWeight: 600, color: NAVY }}>
                        🏫 {a.kita_name}
                      </div>
                    ))}
                    <button onClick={() => setActiveTab("anfragen")} style={{ width: "100%", padding: "10px", borderRadius: 10, border: "none", background: NAVY, color: "white", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginTop: 4 }}>
                      Alle Anfragen ansehen →
                    </button>
                  </div>
                ) : (
                  <div style={{ background: "#F8FAFF", borderRadius: 14, padding: 20, marginBottom: 16, textAlign: "center" }}>
                    <div style={{ fontSize: "2rem", marginBottom: 8 }}>📭</div>
                    <div style={{ fontWeight: 700, color: NAVY, marginBottom: 4, fontSize: "0.9rem" }}>Noch keine neuen Anfragen</div>
                    <div style={{ color: "#9BA8C0", fontSize: "0.82rem", lineHeight: 1.6 }}>
                      {fachkraft?.aktiv_suchend ? "Dein Profil ist sichtbar – Kitas können dich jetzt finden." : "Schalte die Jobsuche ein, damit Kitas dich finden können."}
                    </div>
                  </div>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <button onClick={() => setActiveTab("nachrichten")} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 10, background: "#F8FAFF", border: "none", color: NAVY, fontWeight: 600, fontSize: "0.88rem", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", textAlign: "left" }}>
                    💬 Nachrichten {nachrichten.length > 0 && <span style={{ background: NAVY, color: "white", borderRadius: 50, padding: "1px 8px", fontSize: "0.72rem" }}>{nachrichten.length}</span>}
                  </button>
                  <button onClick={() => setActiveTab("profil")} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 10, background: "#F8FAFF", border: "none", color: NAVY, fontWeight: 600, fontSize: "0.88rem", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", textAlign: "left" }}>
                    ✏️ Profil bearbeiten
                  </button>
                  <a href={`/fachkraft/${fachkraft?.id}`} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 10, background: "#F8FAFF", textDecoration: "none", color: NAVY, fontWeight: 600, fontSize: "0.88rem" }}>
                    👁 Meine Visitenkarte ansehen
                  </a>
                  <a href="/kontakt" style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 10, background: "#F8FAFF", textDecoration: "none", color: NAVY, fontWeight: 600, fontSize: "0.88rem" }}>
                    ✉️ Support kontaktieren
                  </a>
                </div>
              </div>
            )}

            {/* ── ANFRAGEN ── */}
            {activeTab === "anfragen" && (
              <div>
                {anfragen.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px 20px" }}>
                    <div style={{ fontSize: "3rem", marginBottom: 16 }}>📭</div>
                    <div style={{ fontWeight: 700, color: NAVY, marginBottom: 8 }}>Noch keine Anfragen</div>
                    <div style={{ color: "#9BA8C0", fontSize: "0.85rem", lineHeight: 1.7 }}>Sobald eine Kita Interesse hat, erscheint die Anfrage hier.</div>
                  </div>
                ) : (
                  <>
                    {offeneAnfragen.length > 0 && (
                      <div style={{ marginBottom: 24 }}>
                        <div style={{ fontSize: "0.75rem", fontWeight: 800, color: BLUE, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>
                          Neue Anfragen · {offeneAnfragen.length} offen
                        </div>
                        {offeneAnfragen.map(anfrage => (
                          <div key={anfrage.id} className="anfrage-card" style={{ borderLeft: `4px solid ${BLUE}` }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                              <div>
                                <div style={{ fontWeight: 800, color: NAVY, fontSize: "1rem", marginBottom: 3 }}>{anfrage.kita_name}</div>
                                <div style={{ fontSize: "0.76rem", color: "#9BA8C0" }}>{new Date(anfrage.created_at).toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" })}</div>
                              </div>
                              <span style={{ background: "#EBF4FF", color: BLUE, borderRadius: 50, padding: "4px 12px", fontSize: "0.72rem", fontWeight: 700 }}>Neu</span>
                            </div>
                            {anfrage.nachricht && (
                              <div style={{ background: "#F8FAFF", borderRadius: 10, padding: "10px 14px", marginBottom: 12, fontSize: "0.86rem", color: "#444", lineHeight: 1.7, borderLeft: `3px solid ${BLUE}` }}>
                                "{anfrage.nachricht}"
                              </div>
                            )}
                            <div style={{ background: "#FFF8ED", borderRadius: 10, padding: "9px 13px", marginBottom: 14, fontSize: "0.78rem", color: "#92400E", lineHeight: 1.6 }}>
                              🔒 Kontaktdaten der Kita werden erst nach deiner Zustimmung sichtbar.
                            </div>
                            <div className="action-btns" style={{ display: "flex", gap: 8 }}>
                              <button onClick={() => handleAnfrage(anfrage.id, "akzeptiert")} disabled={anfrageLoading === anfrage.id} style={{ flex: 1, padding: "11px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${GREEN}, #27AE60)`, color: "white", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem" }}>
                                {anfrageLoading === anfrage.id ? "..." : "✓ Annehmen"}
                              </button>
                              <button onClick={() => handleAnfrage(anfrage.id, "abgelehnt")} disabled={anfrageLoading === anfrage.id} style={{ flex: 1, padding: "11px", borderRadius: 10, border: "2px solid #E2E8F0", background: "white", color: "#6B7897", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem" }}>
                                {anfrageLoading === anfrage.id ? "..." : "✗ Ablehnen"}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {bearbeiteteAnfragen.length > 0 && (
                      <div>
                        <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "#9BA8C0", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Bearbeitet</div>
                        {bearbeiteteAnfragen.map(anfrage => (
                          <div key={anfrage.id} className="anfrage-card" style={{ borderLeft: `4px solid ${anfrage.status === "akzeptiert" ? GREEN : "#E2E8F0"}` }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <div>
                                <div style={{ fontWeight: 700, color: NAVY, fontSize: "0.92rem", marginBottom: 2 }}>{anfrage.kita_name}</div>
                                <div style={{ fontSize: "0.75rem", color: "#9BA8C0" }}>{new Date(anfrage.created_at).toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" })}</div>
                              </div>
                              <span style={{ background: anfrage.status === "akzeptiert" ? "#EAF7EF" : "#F8F8F8", color: anfrage.status === "akzeptiert" ? GREEN : "#9BA8C0", borderRadius: 50, padding: "4px 13px", fontSize: "0.72rem", fontWeight: 700 }}>
                                {anfrage.status === "akzeptiert" ? "✓ Angenommen" : "✗ Abgelehnt"}
                              </span>
                            </div>
                            {anfrage.status === "akzeptiert" && (
                              <div style={{ marginTop: 10, padding: "9px 13px", background: "#EAF7EF", borderRadius: 10, fontSize: "0.8rem", color: GREEN, fontWeight: 600 }}>
                                Die Kita hat deine Kontaktdaten erhalten. Du kannst ihr jetzt auch eine Nachricht schicken. 🎉
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* ── NACHRICHTEN ── */}
            {activeTab === "nachrichten" && (
              <div>
                {Object.keys(konversationen).length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px 20px" }}>
                    <div style={{ fontSize: "3rem", marginBottom: 16 }}>💬</div>
                    <div style={{ fontWeight: 700, color: NAVY, marginBottom: 8 }}>Noch keine Nachrichten</div>
                    <div style={{ color: "#9BA8C0", fontSize: "0.85rem", lineHeight: 1.7 }}>
                      Wenn eine Kita dir eine Nachricht schickt, erscheint sie hier.<br />
                      Du kannst nur mit Kitas schreiben, deren Anfrage du angenommen hast.
                    </div>
                  </div>
                ) : Object.entries(konversationen).map(([partnerId, msgs]: any) => {
                  const ag = arbeitgeberMap[partnerId];
                  const agName = ag?.einrichtung_name || "Einrichtung";
                  const sortedMsgs = [...msgs].sort((a: any, b: any) => new Date(a.erstellt_am).getTime() - new Date(b.erstellt_am).getTime());
                  return (
                    <div key={partnerId} style={{ background: "white", borderRadius: 16, padding: 20, marginBottom: 16, border: "1.5px solid #E8EDF4", boxShadow: "0 2px 8px rgba(26,63,111,0.06)" }}>
                      <div style={{ fontWeight: 700, color: NAVY, marginBottom: 14, fontSize: "0.95rem" }}>🏫 {agName}</div>

                      {/* Chat-Verlauf */}
                      <div style={{ marginBottom: 12 }}>
                        {sortedMsgs.map((msg: any) => (
                          <div key={msg.id} style={{ marginBottom: 8, display: "flex", justifyContent: msg.von_id === fachkraft.id ? "flex-end" : "flex-start" }}>
                            <div style={{ maxWidth: "80%", background: msg.von_id === fachkraft.id ? `linear-gradient(135deg, ${NAVY}, ${BLUE})` : "#F0F4F9", color: msg.von_id === fachkraft.id ? "white" : "#444", borderRadius: msg.von_id === fachkraft.id ? "16px 16px 4px 16px" : "16px 16px 16px 4px", padding: "10px 14px", fontSize: "0.88rem", lineHeight: 1.6 }}>
                              <div>{msg.nachricht}</div>
                              <div style={{ fontSize: "0.7rem", opacity: 0.6, marginTop: 4 }}>
                                {new Date(msg.erstellt_am).toLocaleDateString("de-DE", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Antwort-Box */}
                      {msgSent[partnerId] ? (
                        <div style={{ color: GREEN, fontWeight: 600, fontSize: "0.85rem", padding: "8px 0" }}>✅ Nachricht gesendet!</div>
                      ) : (
                        <div>
                          <textarea
                            placeholder={`Antwort an ${agName}...`}
                            rows={2}
                            value={antwort[partnerId] || ""}
                            onChange={e => setAntwort({ ...antwort, [partnerId]: e.target.value })}
                            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAntwort(partnerId); } }}
                            style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #E2E8F0", borderRadius: 10, fontSize: "0.88rem", resize: "none", fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box", outline: "none" }}
                          />
                          <button
                            onClick={() => handleAntwort(partnerId)}
                            disabled={sendingMsg === partnerId || !antwort[partnerId]?.trim()}
                            style={{ marginTop: 6, width: "100%", padding: "10px", background: sendingMsg === partnerId ? "#ccc" : `linear-gradient(135deg, ${NAVY}, ${BLUE})`, color: "white", border: "none", borderRadius: 9, fontWeight: 700, cursor: "pointer", fontSize: "0.85rem", fontFamily: "'DM Sans', sans-serif" }}
                          >
                            {sendingMsg === partnerId ? "Wird gesendet..." : "Senden →"}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── PROFIL BEARBEITEN ── */}
            {activeTab === "profil" && form && (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }} className="two-col">
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
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }} className="two-col">
                  {fieldGroup("Deutsch", "deutsch", "text", ["Muttersprache","Sehr gut (C1/C2)","Gut (B1/B2)","Grundkenntnisse (A1/A2)"])}
                  {fieldGroup("Englisch", "englisch", "text", ["Muttersprache","Sehr gut (C1/C2)","Gut (B1/B2)","Grundkenntnisse (A1/A2)","Keine"])}
                </div>
                {fieldGroup("Weitere Sprachen", "weitere_sprachen")}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }} className="two-col">
                  {fieldGroup("Verfügbar ab", "verfuegbar_ab", "date")}
                  {fieldGroup("Arbeitszeit", "arbeitszeit", "text", ["Vollzeit","Teilzeit","Vollzeit & Teilzeit","Minijob"])}
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Kurzbeschreibung</label>
                  <textarea name="beschreibung" value={form?.beschreibung || ""} onChange={e => setForm({ ...form, beschreibung: e.target.value })} rows={4} style={{ ...inputStyle, resize: "vertical" }} placeholder="Beschreibe dich kurz für potenzielle Arbeitgeber..." />
                </div>
                {saveError && <div style={{ marginBottom: 12, padding: "11px 14px", background: "#FFF5F5", borderRadius: 10, color: "#9B1C1C", fontSize: "0.85rem" }}>⚠️ {saveError}</div>}
                {saveSuccess && <div style={{ marginBottom: 12, padding: "11px 14px", background: "#EAF7EF", borderRadius: 10, color: GREEN, fontSize: "0.85rem", fontWeight: 600 }}>✓ Profil gespeichert!</div>}
                <button onClick={handleSave} disabled={saving} style={{ width: "100%", background: saving ? "#9BA8C0" : NAVY, color: "white", border: "none", padding: "13px", borderRadius: 12, fontWeight: 700, fontSize: "0.95rem", cursor: saving ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                  {saving ? "Wird gespeichert..." : "Änderungen speichern"}
                </button>
              </div>
            )}

            {/* ── KONTO ── */}
            {activeTab === "konto" && (
              <div>
                <div style={{ background: "white", borderRadius: 12, padding: 16, marginBottom: 16, border: "1px solid #E8EDF4" }}>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#9BA8C0", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>E-Mail</div>
                  <div style={{ color: NAVY, fontWeight: 600 }}>{fachkraft?.email}</div>
                </div>
                <div style={{ padding: 16, background: "#FFF5F5", border: "1px solid #FED7D7", borderRadius: 12 }}>
                  <div style={{ fontWeight: 700, color: "#9B1C1C", marginBottom: 4, fontSize: "0.9rem" }}>Account löschen</div>
                  <div style={{ color: "#7F1D1D", fontSize: "0.82rem", marginBottom: 14, lineHeight: 1.6 }}>Dein Account und alle deine Daten werden unwiderruflich gelöscht.</div>
                  <button onClick={handleDeleteAccount} style={{ background: RED, color: "white", border: "none", padding: "10px 20px", borderRadius: 8, fontWeight: 700, fontSize: "0.86rem", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", width: "100%" }}>
                    Account unwiderruflich löschen
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
