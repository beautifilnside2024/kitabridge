"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const NAVY = "#1A3F6F";
const BLUE = "#2471A3";
const GREEN = "#1E8449";

const inputStyle = {
  width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #E2E8F0",
  fontSize: "0.9rem", outline: "none", fontFamily: "'DM Sans', sans-serif",
  color: "#1a1a2e", background: "white"
};

const selectStyle = { ...inputStyle, cursor: "pointer" };

export default function Suche() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fachkraefte, setFachkraefte] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState({
    qualifikation: "", deutsch: "", bundesland: "", arbeitszeit: "", erfahrung: ""
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      window.location.href = "/login";
      return;
    }
    setUser(session.user);
    loadFachkraefte();
  };

  const loadFachkraefte = async () => {
    const { data } = await supabase
      .from("fachkraefte")
      .select("*")
      .eq("status", "bestaetigt")
      .order("created_at", { ascending: false });
    setFachkraefte(data || []);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const setF = (key, value) => setFilter(f => ({ ...f, [key]: value }));

  const filtered = fachkraefte.filter(f => {
    if (filter.qualifikation && !f.qualifikation?.includes(filter.qualifikation)) return false;
    if (filter.deutsch && f.deutsch !== filter.deutsch) return false;
    if (filter.bundesland && f.bundesland !== filter.bundesland) return false;
    if (filter.arbeitszeit && f.arbeitszeit !== filter.arbeitszeit) return false;
    if (filter.erfahrung && f.erfahrung_jahre !== filter.erfahrung) return false;
    return true;
  });

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F0F4F9", fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ color: NAVY, fontSize: "1rem" }}>Lädt...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4F9", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap'); * { box-sizing: border-box; }`}</style>

      {/* Header */}
      <div style={{ background: NAVY, padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/" style={{ textDecoration: "none", fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700 }}>
          <span style={{ color: "white" }}>Kita</span><span style={{ color: "#4ADE80" }}>Bridge</span>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem" }}>{user?.email}</span>
          <button onClick={handleLogout} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "white", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: "0.85rem", fontFamily: "'DM Sans', sans-serif" }}>
            Ausloggen
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", color: NAVY, fontSize: "1.8rem", marginBottom: 8 }}>Fachkräfte suchen</h1>
        <p style={{ color: "#9BA8C0", marginBottom: 32, fontSize: "0.9rem" }}>{filtered.length} Fachkräfte gefunden</p>

        {/* Filter */}
        <div style={{ background: "white", borderRadius: 16, padding: 24, marginBottom: 24, boxShadow: "0 2px 12px rgba(26,63,111,0.08)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#9BA8C0", marginBottom: 6, textTransform: "uppercase" }}>Qualifikation</label>
              <select style={selectStyle} value={filter.qualifikation} onChange={e => setF("qualifikation", e.target.value)}>
                <option value="">Alle</option>
                {["Staatlich anerkannte Erzieherin / Erzieher","Kinderpflegerin / Kinderpfleger","Sozialpädagogin / Sozialpädagoge","Heilpädagogin / Heilpädagoge","Kindheitspädagogin / Kindheitspädagoge"].map(q => <option key={q} value={q}>{q}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#9BA8C0", marginBottom: 6, textTransform: "uppercase" }}>Deutsch</label>
              <select style={selectStyle} value={filter.deutsch} onChange={e => setF("deutsch", e.target.value)}>
                <option value="">Alle</option>
                {["A1 – Anfänger","A2 – Grundlagen","B1 – Mittelstufe","B2 – Gute Kenntnisse","C1 – Fortgeschritten","C2 – Muttersprachlich"].map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#9BA8C0", marginBottom: 6, textTransform: "uppercase" }}>Bundesland</label>
              <select style={selectStyle} value={filter.bundesland} onChange={e => setF("bundesland", e.target.value)}>
                <option value="">Alle</option>
                {["Baden-Württemberg","Bayern","Berlin","Brandenburg","Bremen","Hamburg","Hessen","Mecklenburg-Vorpommern","Niedersachsen","Nordrhein-Westfalen","Rheinland-Pfalz","Saarland","Sachsen","Sachsen-Anhalt","Schleswig-Holstein","Thüringen"].map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#9BA8C0", marginBottom: 6, textTransform: "uppercase" }}>Arbeitszeit</label>
              <select style={selectStyle} value={filter.arbeitszeit} onChange={e => setF("arbeitszeit", e.target.value)}>
                <option value="">Alle</option>
                {["Vollzeit (38-40h)","Teilzeit (20-30h)","Minijob","Vertretung / Aushilfe"].map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#9BA8C0", marginBottom: 6, textTransform: "uppercase" }}>Erfahrung</label>
              <select style={selectStyle} value={filter.erfahrung} onChange={e => setF("erfahrung", e.target.value)}>
                <option value="">Alle</option>
                {["Berufseinsteiger (0-1 Jahre)","1-2 Jahre","2-5 Jahre","5-10 Jahre","Mehr als 10 Jahre"].map(j => <option key={j} value={j}>{j}</option>)}
              </select>
            </div>
          </div>
          {(filter.qualifikation || filter.deutsch || filter.bundesland || filter.arbeitszeit || filter.erfahrung) && (
            <button onClick={() => setFilter({ qualifikation: "", deutsch: "", bundesland: "", arbeitszeit: "", erfahrung: "" })} style={{ marginTop: 12, background: "none", border: "none", color: BLUE, cursor: "pointer", fontSize: "0.85rem", fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
              Filter zurücksetzen
            </button>
          )}
        </div>

        {/* Results */}
        <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 380px" : "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr" : "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
            {filtered.length === 0 ? (
              <div style={{ background: "white", borderRadius: 16, padding: 40, textAlign: "center", color: "#9BA8C0", gridColumn: "1/-1" }}>
                Keine Fachkräfte gefunden. Filter anpassen?
              </div>
            ) : filtered.map(fk => (
              <div key={fk.id} style={{ background: "white", borderRadius: 16, padding: 24, boxShadow: "0 2px 12px rgba(26,63,111,0.08)", border: `2px solid ${selected?.id === fk.id ? BLUE : "transparent"}`, transition: "all 0.2s" }}>
                <div
                  onClick={() => setSelected(selected?.id === fk.id ? null : fk)}
                  style={{ cursor: "pointer" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: `linear-gradient(135deg, ${NAVY}, ${BLUE})`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: "1.1rem", fontFamily: "'Playfair Display', serif" }}>
                      {fk.vorname?.[0]}{fk.nachname?.[0]}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: NAVY, fontSize: "0.95rem" }}>{fk.vorname} {fk.nachname}</div>
                      <div style={{ color: "#9BA8C0", fontSize: "0.8rem" }}>{fk.wohnort || fk.bundesland || "-"}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "#444", marginBottom: 12, lineHeight: 1.5 }}>{fk.qualifikation}</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
                    {fk.deutsch && <span style={{ background: "#EEF2FF", color: "#4F46E5", padding: "3px 8px", borderRadius: 20, fontSize: "0.72rem", fontWeight: 600 }}>DE: {fk.deutsch}</span>}
                    {fk.arbeitszeit && <span style={{ background: "#EAF7EF", color: GREEN, padding: "3px 8px", borderRadius: 20, fontSize: "0.72rem", fontWeight: 600 }}>{fk.arbeitszeit}</span>}
                    {fk.verfuegbar_ab && <span style={{ background: "#FFF7ED", color: "#EA580C", padding: "3px 8px", borderRadius: 20, fontSize: "0.72rem", fontWeight: 600 }}>Ab {fk.verfuegbar_ab}</span>}
                  </div>
                </div>
                {/* Profil ansehen Button */}
                <a
                  href={`/fachkraft/${fk.id}`}
                  style={{ display: "block", textAlign: "center", padding: "10px", borderRadius: 10, background: `linear-gradient(135deg, ${NAVY}, ${BLUE})`, color: "white", fontWeight: 700, textDecoration: "none", fontSize: "0.85rem", fontFamily: "'DM Sans', sans-serif" }}
                  onClick={e => e.stopPropagation()}
                >
                  Vollständiges Profil ansehen →
                </a>
              </div>
            ))}
          </div>

          {/* Detail Panel */}
          {selected && (
            <div style={{ background: "white", borderRadius: 16, padding: 24, boxShadow: "0 2px 12px rgba(26,63,111,0.08)", height: "fit-content", position: "sticky", top: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: `linear-gradient(135deg, ${NAVY}, ${BLUE})`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: "1.1rem" }}>
                    {selected.vorname?.[0]}{selected.nachname?.[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: NAVY }}>{selected.vorname} {selected.nachname}</div>
                    <div style={{ color: "#9BA8C0", fontSize: "0.8rem" }}>{selected.qualifikation}</div>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9BA8C0", fontSize: "1.2rem" }}>×</button>
              </div>

              {[
                ["Qualifikation", selected.qualifikation],
                ["Deutschkenntnisse", selected.deutsch],
                ["Englischkenntnisse", selected.englisch],
                ["Weitere Sprachen", selected.weitere_sprachen],
                ["Erfahrung", selected.erfahrung_jahre],
                ["Altersgruppen", selected.kita_alter?.join(", ")],
                ["Verfügbar ab", selected.verfuegbar_ab],
                ["Arbeitszeit", selected.arbeitszeit],
                ["Wohnort", selected.wohnort],
                ["Bundesland", selected.bundesland],
              ].map(([k, v]) => v ? (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #F0F4F9", fontSize: "0.82rem" }}>
                  <span style={{ color: "#9BA8C0", fontWeight: 600 }}>{k}</span>
                  <span style={{ color: "#1a1a2e", maxWidth: 180, textAlign: "right" }}>{v}</span>
                </div>
              ) : null)}

              {selected.beschreibung && (
                <div style={{ background: "#F8FAFF", borderRadius: 10, padding: 12, margin: "16px 0", fontSize: "0.82rem", color: "#444", lineHeight: 1.6 }}>
                  {selected.beschreibung}
                </div>
              )}

              <a href={`/fachkraft/${selected.id}`} style={{ display: "block", textAlign: "center", marginTop: 16, padding: "12px", borderRadius: 12, background: `linear-gradient(135deg, ${NAVY}, ${BLUE})`, color: "white", fontWeight: 700, textDecoration: "none", fontSize: "0.9rem" }}>
                Vollständiges Profil ansehen →
              </a>
              <a href={`mailto:${selected.email}`} style={{ display: "block", textAlign: "center", marginTop: 8, padding: "12px", borderRadius: 12, background: "#EAF7EF", color: GREEN, fontWeight: 700, textDecoration: "none", fontSize: "0.9rem" }}>
                📧 Direkt kontaktieren
              </a>
              {selected.telefon && (
                <a href={`tel:${selected.telefon}`} style={{ display: "block", textAlign: "center", marginTop: 8, padding: "12px", borderRadius: 12, background: "#F0F4F9", color: NAVY, fontWeight: 700, textDecoration: "none", fontSize: "0.9rem" }}>
                  📞 {selected.telefon}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
