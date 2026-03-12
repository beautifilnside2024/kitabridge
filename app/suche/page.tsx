"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const C = {
  navy: "#0F2442", navyMid: "#1A3F6F", blue: "#2471A3",
  green: "#16A34A", surface: "#F7F9FC", border: "#E4EAF4", muted: "#8A96B0", text: "#1C2B4A",
};

const selectStyle: React.CSSProperties = {
  width: "100%", padding: "9px 12px", border: `1.5px solid ${C.border}`, borderRadius: 10,
  fontSize: "0.83rem", color: C.text, background: "white", outline: "none",
  fontFamily: "'Sora', sans-serif", cursor: "pointer",
  appearance: "none" as const,
  backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238A96B0' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",
  backgroundRepeat: "no-repeat", backgroundPosition: "right 11px center", paddingRight: 32,
};

const BUNDESLAENDER = ["Baden-Württemberg","Bayern","Berlin","Brandenburg","Bremen","Hamburg","Hessen","Mecklenburg-Vorpommern","Niedersachsen","Nordrhein-Westfalen","Rheinland-Pfalz","Saarland","Sachsen","Sachsen-Anhalt","Schleswig-Holstein","Thüringen"];

export default function Suche() {
  const [loading, setLoading] = useState(true);
  const [fachkraefte, setFachkraefte] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState({ qualifikation: "", deutsch: "", bundesland: "", arbeitszeit: "", erfahrung: "" });
  const [nachrichtText, setNachrichtText] = useState("");
  const [gesendet, setGesendet] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);
  const [arbeitgeberId, setArbeitgeberId] = useState(null);
  const [arbeitgeberName, setArbeitgeberName] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => { checkAuth(); }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { window.location.href = "/login"; return; }
    const { data: ag } = await supabase.from("arbeitgeber").select("id, status, einrichtung_name").eq("email", session.user.email).single();
    if (!ag) { window.location.href = "/login"; return; }
    if (ag.status !== "aktiv" && ag.status !== "bestaetigt") { window.location.href = "/dashboard"; return; }
    setArbeitgeberId(ag.id);
    setArbeitgeberName(ag.einrichtung_name);
    const { data } = await supabase.from("fachkraefte").select("*").eq("status", "bestaetigt").eq("aktiv_suchend", true).order("created_at", { ascending: false });
    setFachkraefte(data || []);
    setLoading(false);
  };

  const handleLogout = async () => { await supabase.auth.signOut(); window.location.href = "/login"; };
  const setF = (key, value) => setFilter(f => ({ ...f, [key]: value }));

  const filtered = fachkraefte.filter(f => {
    if (filter.qualifikation && !f.qualifikation?.includes(filter.qualifikation)) return false;
    if (filter.deutsch && !f.deutsch?.includes(filter.deutsch)) return false;
    if (filter.bundesland && f.bundesland !== filter.bundesland) return false;
    if (filter.arbeitszeit && !f.arbeitszeit?.includes(filter.arbeitszeit)) return false;
    if (filter.erfahrung && f.erfahrung_jahre !== filter.erfahrung) return false;
    return true;
  });

  const activeFilters = Object.values(filter).filter(Boolean).length;

  const handleNachrichtSenden = async () => {
    if (!nachrichtText || !arbeitgeberId || !selected) return;
    setSendLoading(true);

    await fetch("/api/nachrichten", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        von_id: arbeitgeberId,
        an_id: selected.id,
        von_typ: "arbeitgeber",
        nachricht: nachrichtText,
        empfaenger_email: selected.email,
        empfaenger_name: selected.vorname,
        absender_name: arbeitgeberName,
        arbeitgeber_id: arbeitgeberId,
        fachkraft_id: selected.id,
        kita_name: arbeitgeberName,
      }),
    });

    setSendLoading(false);
    setGesendet(true);
    setNachrichtText("");
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C.surface, fontFamily: "'Sora', sans-serif" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <div style={{ width: 36, height: 36, border: `3px solid ${C.border}`, borderTopColor: C.navyMid, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <span style={{ fontSize: "0.84rem", color: C.muted, fontWeight: 600 }}>Lädt...</span>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: C.surface, fontFamily: "'Sora', sans-serif", display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Fraunces:wght@700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { -webkit-font-smoothing: antialiased; }
        select:focus, textarea:focus { border-color: ${C.blue} !important; box-shadow: 0 0 0 3px rgba(36,113,163,0.12) !important; outline: none; }
        .fk-card { background: white; border-radius: 16px; padding: 20px; border: 1.5px solid ${C.border}; cursor: pointer; transition: all 0.15s; }
        .fk-card:hover { border-color: ${C.navyMid}; box-shadow: 0 4px 20px rgba(15,36,66,0.1); transform: translateY(-1px); }
        .fk-card.active { border-color: ${C.navyMid}; box-shadow: 0 0 0 2px ${C.navyMid}, 0 4px 20px rgba(15,36,66,0.12); }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>

      {/* Header */}
      <header style={{ background: "rgba(247,249,252,0.9)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${C.border}`, padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50, flexShrink: 0 }}>
        <a href="/" style={{ textDecoration: "none" }}>
          <span style={{ fontFamily: "'Fraunces', serif", fontSize: "1.3rem", fontWeight: 800, color: C.navy }}>Kita</span>
          <span style={{ fontFamily: "'Fraunces', serif", fontSize: "1.3rem", fontWeight: 800, color: C.green }}>Bridge</span>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <a href="/dashboard" style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 9, border: `1.5px solid ${C.border}`, background: "white", color: C.muted, fontSize: "0.82rem", fontWeight: 600, textDecoration: "none" }}>
            ← Dashboard
          </a>
          <button onClick={handleLogout} style={{ padding: "7px 14px", borderRadius: 9, border: `1.5px solid ${C.border}`, background: "white", color: C.muted, fontSize: "0.82rem", fontWeight: 600, cursor: "pointer", fontFamily: "'Sora', sans-serif" }}>
            Ausloggen
          </button>
        </div>
      </header>

      <div style={{ flex: 1, maxWidth: 1280, width: "100%", margin: "0 auto", padding: "24px 20px", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Page title */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "1.6rem", fontWeight: 800, color: C.text, marginBottom: 2 }}>Fachkräfte suchen</h1>
            <p style={{ color: C.muted, fontSize: "0.84rem", fontWeight: 500 }}>
              <span style={{ color: C.navyMid, fontWeight: 700 }}>{filtered.length}</span> Fachkräfte gefunden
              {activeFilters > 0 && <span> · <button onClick={() => setFilter({ qualifikation: "", deutsch: "", bundesland: "", arbeitszeit: "", erfahrung: "" })} style={{ background: "none", border: "none", color: C.blue, fontSize: "0.84rem", cursor: "pointer", fontFamily: "'Sora', sans-serif", fontWeight: 600, padding: 0 }}>Filter zurücksetzen</button></span>}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div style={{ background: "white", borderRadius: 18, padding: "18px 20px", border: `1.5px solid ${C.border}` }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
            {[
              { label: "Qualifikation", key: "qualifikation", options: [["Erzieherin","Erzieherin / Erzieher"],["Kinderpflegerin","Kinderpflegerin"],["Sozialpädagogin","Sozialpädagoge"],["Heilpädagogin","Heilpädagoge"],["Kindheitspädagogin","Kindheitspädagoge"]] },
              { label: "Deutsch", key: "deutsch", options: [["B1","B1"],["B2","B2"],["C1","C1"],["C2","C2"]] },
              { label: "Arbeitszeit", key: "arbeitszeit", options: [["Vollzeit","Vollzeit"],["Teilzeit","Teilzeit"],["Minijob","Minijob"],["Vertretung","Vertretung"]] },
              { label: "Erfahrung", key: "erfahrung", options: [["Berufseinsteiger","Einsteiger"],["1-2 Jahre","1-2 Jahre"],["2-5 Jahre","2-5 Jahre"],["5-10 Jahre","5-10 Jahre"],["Mehr als 10 Jahre","10+ Jahre"]] },
            ].map(({ label, key, options }) => (
              <div key={key}>
                <label style={{ display: "block", fontSize: "0.65rem", fontWeight: 800, color: C.muted, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 6 }}>{label}</label>
                <select style={{ ...selectStyle, borderColor: filter[key] ? C.navyMid : C.border }} value={filter[key]} onChange={e => setF(key, e.target.value)}>
                  <option value="">Alle</option>
                  {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
            ))}
            <div>
              <label style={{ display: "block", fontSize: "0.65rem", fontWeight: 800, color: C.muted, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 6 }}>Bundesland</label>
              <select style={{ ...selectStyle, borderColor: filter.bundesland ? C.navyMid : C.border }} value={filter.bundesland} onChange={e => setF("bundesland", e.target.value)}>
                <option value="">Alle</option>
                {BUNDESLAENDER.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 360px" : "1fr", gap: 16, alignItems: "start" }}>

          {/* Cards grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14, alignContent: "start" }}>
            {filtered.length === 0 && (
              <div style={{ background: "white", border: `1.5px solid ${C.border}`, borderRadius: 18, padding: 48, textAlign: "center", gridColumn: "1/-1" }}>
                <div style={{ fontSize: "2rem", marginBottom: 12 }}>🔍</div>
                <div style={{ fontWeight: 700, color: C.text, marginBottom: 6 }}>Keine Ergebnisse</div>
                <div style={{ color: C.muted, fontSize: "0.84rem" }}>Versuche andere Filter.</div>
              </div>
            )}
            {filtered.map(fk => {
              const initials = `${fk.vorname?.[0] || ""}${fk.nachname?.[0] || ""}`.toUpperCase();
              const isActive = selected?.id === fk.id;
              return (
                <div key={fk.id} className={`fk-card${isActive ? " active" : ""}`}
                  onClick={() => { setSelected(isActive ? null : fk); setGesendet(false); setNachrichtText(""); }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 13, background: isActive ? C.navyMid : C.surface, border: `1.5px solid ${isActive ? C.navyMid : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: isActive ? "white" : C.muted, fontWeight: 800, fontSize: "0.9rem", flexShrink: 0, transition: "all 0.15s" }}>
                      {initials || "?"}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 700, color: C.text, fontSize: "0.9rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{fk.vorname} {fk.nachname}</div>
                      <div style={{ color: C.muted, fontSize: "0.77rem", fontWeight: 500 }}>{fk.wohnort || fk.bundesland || "–"}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "#4B5563", marginBottom: 12, fontWeight: 500 }}>{fk.qualifikation}</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {fk.arbeitszeit && <span style={{ background: C.surface, color: C.navyMid, padding: "3px 10px", borderRadius: 99, fontSize: "0.72rem", fontWeight: 700, border: `1px solid ${C.border}` }}>{fk.arbeitszeit}</span>}
                    {fk.deutsch && <span style={{ background: "#ECFDF5", color: C.green, padding: "3px 10px", borderRadius: 99, fontSize: "0.72rem", fontWeight: 700, border: "1px solid #A7F3D0" }}>DE: {fk.deutsch}</span>}
                    {fk.erfahrung_jahre && <span style={{ background: "#EFF6FF", color: C.blue, padding: "3px 10px", borderRadius: 99, fontSize: "0.72rem", fontWeight: 700, border: "1px solid #BFDBFE" }}>{fk.erfahrung_jahre}</span>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detail panel */}
          {selected && (
            <div style={{ background: "white", borderRadius: 20, border: `1.5px solid ${C.border}`, overflow: "hidden", position: "sticky", top: 80, animation: "slideIn 0.2s ease-out" }}>
              {/* Panel header */}
              <div style={{ background: `linear-gradient(135deg, ${C.navy} 0%, ${C.navyMid} 100%)`, padding: "20px 22px", color: "white" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 46, height: 46, borderRadius: 13, background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "white", fontSize: "0.9rem" }}>
                      {`${selected.vorname?.[0] || ""}${selected.nachname?.[0] || ""}`.toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 2 }}>{selected.vorname} {selected.nachname}</div>
                      <div style={{ fontSize: "0.77rem", color: "rgba(255,255,255,0.6)" }}>{selected.wohnort || selected.bundesland}</div>
                    </div>
                  </div>
                  <button onClick={() => setSelected(null)} style={{ background: "rgba(255,255,255,0.1)", border: "none", cursor: "pointer", color: "white", width: 28, height: 28, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
              </div>

              <div style={{ padding: "20px 22px" }}>
                {/* Info rows */}
                <div style={{ marginBottom: 18 }}>
                  {[
                    ["Qualifikation", selected.qualifikation],
                    ["Deutsch", selected.deutsch],
                    ["Englisch", selected.englisch && selected.englisch !== "Keine" ? selected.englisch : null],
                    ["Weitere Sprachen", selected.weitere_sprachen],
                    ["Erfahrung", selected.erfahrung_jahre],
                    ["Verfügbar ab", selected.verfuegbar_ab ? new Date(selected.verfuegbar_ab).toLocaleDateString("de-DE", { month: "long", year: "numeric" }) : null],
                    ["Arbeitszeit", selected.arbeitszeit],
                    ["Bundesland", selected.bundesland],
                  ].filter(([, v]) => v).map(([k, v]) => (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${C.border}`, fontSize: "0.83rem", gap: 10 }}>
                      <span style={{ color: C.muted, fontWeight: 600, flexShrink: 0 }}>{k}</span>
                      <span style={{ color: C.text, fontWeight: 700, textAlign: "right" }}>{v}</span>
                    </div>
                  ))}
                </div>

                {selected.beschreibung && (
                  <div style={{ padding: "12px 14px", background: C.surface, borderRadius: 11, border: `1px solid ${C.border}`, fontSize: "0.83rem", color: "#4B5563", lineHeight: 1.7, marginBottom: 18 }}>
                    {selected.beschreibung}
                  </div>
                )}

                {/* Message */}
                {!gesendet ? (
                  <div>
                    <label style={{ display: "block", fontSize: "0.65rem", fontWeight: 800, color: C.muted, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 8 }}>Nachricht senden</label>
                    <textarea
                      placeholder={`Hallo ${selected.vorname}, wir haben Ihr Profil auf KitaBridge gesehen...`}
                      rows={4}
                      value={nachrichtText}
                      onChange={e => setNachrichtText(e.target.value)}
                      style={{ width: "100%", padding: "11px 14px", border: `1.5px solid ${C.border}`, borderRadius: 11, fontSize: "0.85rem", resize: "vertical", fontFamily: "'Sora', sans-serif", color: C.text, outline: "none", marginBottom: 10 }}
                    />
                    <button
                      disabled={sendLoading || !nachrichtText}
                      onClick={handleNachrichtSenden}
                      style={{ width: "100%", padding: "12px", borderRadius: 11, background: !nachrichtText ? C.border : C.green, color: !nachrichtText ? C.muted : "white", fontWeight: 700, border: "none", cursor: !nachrichtText ? "not-allowed" : "pointer", fontSize: "0.88rem", fontFamily: "'Sora', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.15s" }}
                    >
                      {sendLoading ? (
                        <><div style={{ width: 15, height: 15, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />Wird gesendet...</>
                      ) : (
                        <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>Nachricht senden</>
                      )}
                    </button>
                  </div>
                ) : (
                  <div style={{ background: "#ECFDF5", border: "1.5px solid #A7F3D0", borderRadius: 12, padding: "16px", textAlign: "center" }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.green, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <div style={{ color: "#065F46", fontWeight: 800, fontSize: "0.9rem", marginBottom: 4 }}>Nachricht gesendet!</div>
                    <div style={{ color: "#6B7280", fontSize: "0.8rem", marginBottom: 12 }}>{selected.vorname} wird per E-Mail benachrichtigt.</div>
                    <button onClick={() => setGesendet(false)} style={{ background: "none", border: "none", color: C.green, cursor: "pointer", fontSize: "0.8rem", fontWeight: 700, fontFamily: "'Sora', sans-serif" }}>Weitere Nachricht senden</button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}