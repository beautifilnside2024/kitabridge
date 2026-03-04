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

    const { data: arbeitgeber } = await supabase
      .from("arbeitgeber")
      .select("id, status")
      .eq("email", session.user.email)
      .single();

    if (!arbeitgeber) {
      window.location.href = "/fachkraft/einstellungen";
      return;
    }

    if (arbeitgeber.status !== "aktiv" && arbeitgeber.status !== "bestaetigt") {
      window.location.href = "/dashboard";
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
      .eq("aktiv_suchend", true)        // ← NEU: nur aktiv suchende anzeigen
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
    if (filter.deutsch && !f.deutsch?.includes(filter.deutsch)) return false;
    if (filter.bundesland && f.bundesland !== filter.bundesland) return false;
    if (filter.arbeitszeit && !f.arbeitszeit?.includes(filter.arbeitszeit)) return false;
    if (filter.erfahrung && f.erfahrung_jahre !== filter.erfahrung) return false;
    return true;
  });

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
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <a href="/dashboard" style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem", textDecoration: "none" }}>Dashboard</a>
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
                <option value="Erzieherin">Erzieherin / Erzieher</option>
                <option value="Kinderpflegerin">Kinderpflegerin</option>
                <option value="Sozialpädagogin">Sozialpädagoge</option>
                <option value="Heilpädagogin">Heilpädagoge</option>
                <option value="Kindheitspädagogin">Kindheitspädagoge</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#9BA8C0", marginBottom: 6, textTransform: "uppercase" }}>Deutsch</label>
              <select style={selectStyle} value={filter.deutsch} onChange={e => setF("deutsch", e.target.value)}>
                <option value="">Alle</option>
                <option value="B1">B1</option>
                <option value="B2">B2</option>
                <option value="C1">C1</option>
                <option value="C2">C2</option>
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
                <option value="Vollzeit">Vollzeit</option>
                <option value="Teilzeit">Teilzeit</option>
                <option value="Minijob">Minijob</option>
                <option value="Vertretung">Vertretung</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#9BA8C0", marginBottom: 6, textTransform: "uppercase" }}>Erfahrung</label>
              <select style={selectStyle} value={filter.erfahrung} onChange={e => setF("erfahrung", e.target.value)}>
                <option value="">Alle</option>
                <option value="Berufseinsteiger">Einsteiger</option>
                <option value="1-2 Jahre">1-2 Jahre</option>
                <option value="2-5 Jahre">2-5 Jahre</option>
                <option value="5-10 Jahre">5-10 Jahre</option>
                <option value="Mehr als 10 Jahre">10+ Jahre</option>
              </select>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 380px" : "1fr", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, alignContent: "start" }}>
            {filtered.length === 0 && (
              <div style={{ background: "white", borderRadius: 16, padding: 40, textAlign: "center", color: "#9BA8C0", gridColumn: "1/-1" }}>
                <div style={{ fontSize: "2rem", marginBottom: 12 }}>🔍</div>
                Keine Fachkräfte gefunden. Versuche andere Filter.
              </div>
            )}
            {filtered.map(fk => (
              <div
                key={fk.id}
                onClick={() => setSelected(selected?.id === fk.id ? null : fk)}
                style={{ background: "white", borderRadius: 16, padding: 24, boxShadow: selected?.id === fk.id ? `0 0 0 2px ${NAVY}, 0 4px 20px rgba(26,63,111,0.15)` : "0 2px 12px rgba(26,63,111,0.08)", cursor: "pointer", transition: "all 0.2s" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: NAVY, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: "1rem", flexShrink: 0 }}>
                    {fk.vorname?.[0]}{fk.nachname?.[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: NAVY, fontSize: "0.95rem" }}>{fk.vorname} {fk.nachname}</div>
                    <div style={{ color: "#9BA8C0", fontSize: "0.8rem" }}>{fk.wohnort || fk.bundesland || "-"}</div>
                  </div>
                </div>
                <div style={{ fontSize: "0.82rem", color: "#444", marginBottom: 12, lineHeight: 1.4 }}>{fk.qualifikation}</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {fk.arbeitszeit && <span style={{ background: "#F0F4F9", color: NAVY, padding: "3px 10px", borderRadius: 50, fontSize: "0.75rem", fontWeight: 600 }}>{fk.arbeitszeit}</span>}
                  {fk.deutsch && <span style={{ background: "#EAF7EF", color: GREEN, padding: "3px 10px", borderRadius: 50, fontSize: "0.75rem", fontWeight: 600 }}>DE: {fk.deutsch}</span>}
                </div>
              </div>
            ))}
          </div>

          {selected && (
            <div style={{ background: "white", borderRadius: 16, padding: 28, boxShadow: "0 2px 12px rgba(26,63,111,0.08)", height: "fit-content", position: "sticky", top: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div>
                  <div style={{ fontWeight: 700, color: NAVY, fontSize: "1.1rem" }}>{selected.vorname} {selected.nachname}</div>
                  <div style={{ color: "#9BA8C0", fontSize: "0.82rem" }}>{selected.wohnort || selected.bundesland}</div>
                </div>
                <button onClick={() => setSelected(null)} style={{ background: "#F0F4F9", border: "none", cursor: "pointer", color: "#9BA8C0", fontSize: "1rem", width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
              </div>

              {[
                ["Qualifikation", selected.qualifikation],
                ["Deutschkenntnisse", selected.deutsch],
                ["Englischkenntnisse", selected.englisch],
                ["Weitere Sprachen", selected.weitere_sprachen],
                ["Erfahrung", selected.erfahrung_jahre],
                ["Verfügbar ab", selected.verfuegbar_ab],
                ["Arbeitszeit", selected.arbeitszeit],
                ["Wohnort", selected.wohnort],
                ["Bundesland", selected.bundesland],
              ].map(([k, v]) => v ? (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #F0F4F9", fontSize: "0.85rem" }}>
                  <span style={{ color: "#9BA8C0", fontWeight: 600 }}>{k}</span>
                  <span style={{ color: NAVY, fontWeight: 600, textAlign: "right", maxWidth: "60%" }}>{v}</span>
                </div>
              ) : null)}

              {selected.beschreibung && (
                <div style={{ marginTop: 16, padding: 14, background: "#F8FAFF", borderRadius: 10, fontSize: "0.85rem", color: "#444", lineHeight: 1.6 }}>
                  {selected.beschreibung}
                </div>
              )}

              <a
                href={`mailto:${selected.email}?subject=Anfrage über KitaBridge&body=Hallo ${selected.vorname},%0D%0A%0D%0Awir haben Ihr Profil auf KitaBridge gesehen und würden uns gerne vorstellen.`}
                style={{ display: "block", textAlign: "center", marginTop: 20, padding: "13px", borderRadius: 12, background: GREEN, color: "white", fontWeight: 700, textDecoration: "none", fontSize: "0.9rem" }}
              >
                ✉️ Jetzt kontaktieren
              </a>
              {selected.telefon && (
                <a href={`tel:${selected.telefon}`} style={{ display: "block", textAlign: "center", marginTop: 8, padding: "13px", borderRadius: 12, background: "#F0F4F9", color: NAVY, fontWeight: 700, textDecoration: "none", fontSize: "0.9rem" }}>
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