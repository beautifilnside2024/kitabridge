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

    if (arbeitgeber.status !== "aktiv") {
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
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F0F4F9", fontFamily: "sans-serif" }}>
        <div style={{ color: NAVY }}>Laedt...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4F9", fontFamily: "sans-serif" }}>

      <div style={{ background: NAVY, padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/" style={{ textDecoration: "none", fontSize: "1.3rem", fontWeight: 700 }}>
          <span style={{ color: "white" }}>Kita</span><span style={{ color: "#4ADE80" }}>Bridge</span>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem" }}>{user?.email}</span>
          <button onClick={handleLogout} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "white", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: "0.85rem" }}>
            Ausloggen
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
        <h1 style={{ color: NAVY, fontSize: "1.8rem", marginBottom: 8 }}>Fachkraefte suchen</h1>
        <p style={{ color: "#9BA8C0", marginBottom: 32, fontSize: "0.9rem" }}>{filtered.length} Fachkraefte gefunden</p>

        <div style={{ background: "white", borderRadius: 16, padding: 24, marginBottom: 24, boxShadow: "0 2px 12px rgba(26,63,111,0.08)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#9BA8C0", marginBottom: 6 }}>QUALIFIKATION</label>
              <select style={selectStyle} value={filter.qualifikation} onChange={e => setF("qualifikation", e.target.value)}>
                <option value="">Alle</option>
                <option value="Staatlich anerkannte Erzieherin / Erzieher">Erzieherin / Erzieher</option>
                <option value="Kinderpflegerin / Kinderpfleger">Kinderpflegerin</option>
                <option value="Sozialpaedagogin / Sozialpaedagoge">Sozialpaedagoge</option>
                <option value="Heilpaedagogin / Heilpaedagoge">Heilpaedagoge</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#9BA8C0", marginBottom: 6 }}>DEUTSCH</label>
              <select style={selectStyle} value={filter.deutsch} onChange={e => setF("deutsch", e.target.value)}>
                <option value="">Alle</option>
                <option value="B1">B1</option>
                <option value="B2">B2</option>
                <option value="C1">C1</option>
                <option value="C2">C2</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#9BA8C0", marginBottom: 6 }}>BUNDESLAND</label>
              <select style={selectStyle} value={filter.bundesland} onChange={e => setF("bundesland", e.target.value)}>
                <option value="">Alle</option>
                <option value="Bayern">Bayern</option>
                <option value="Berlin">Berlin</option>
                <option value="Hessen">Hessen</option>
                <option value="Nordrhein-Westfalen">NRW</option>
                <option value="Hamburg">Hamburg</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#9BA8C0", marginBottom: 6 }}>ARBEITSZEIT</label>
              <select style={selectStyle} value={filter.arbeitszeit} onChange={e => setF("arbeitszeit", e.target.value)}>
                <option value="">Alle</option>
                <option value="Vollzeit (38-40h)">Vollzeit</option>
                <option value="Teilzeit (20-30h)">Teilzeit</option>
                <option value="Minijob">Minijob</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#9BA8C0", marginBottom: 6 }}>ERFAHRUNG</label>
              <select style={selectStyle} value={filter.erfahrung} onChange={e => setF("erfahrung", e.target.value)}>
                <option value="">Alle</option>
                <option value="Berufseinsteiger (0-1 Jahre)">Einsteiger</option>
                <option value="1-2 Jahre">1-2 Jahre</option>
                <option value="2-5 Jahre">2-5 Jahre</option>
                <option value="5-10 Jahre">5-10 Jahre</option>
                <option value="Mehr als 10 Jahre">10+ Jahre</option>
              </select>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 360px" : "1fr", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
            {filtered.length === 0 && (
              <div style={{ background: "white", borderRadius: 16, padding: 40, textAlign: "center", color: "#9BA8C0" }}>
                Keine Fachkraefte gefunden.
              </div>
            )}
            {filtered.map(fk => (
              <div key={fk.id} style={{ background: "white", borderRadius: 16, padding: 24, boxShadow: "0 2px 12px rgba(26,63,111,0.08)" }}>
                <div onClick={() => setSelected(selected?.id === fk.id ? null : fk)} style={{ cursor: "pointer", marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 10, background: NAVY, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700 }}>
                      {fk.vorname?.[0]}{fk.nachname?.[0]}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: NAVY }}>{fk.vorname} {fk.nachname}</div>
                      <div style={{ color: "#9BA8C0", fontSize: "0.8rem" }}>{fk.wohnort || fk.bundesland || "-"}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "#444", marginBottom: 8 }}>{fk.qualifikation}</div>
                </div>
                <a href={"/fachkraft/" + fk.id} style={{ display: "block", textAlign: "center", padding: "10px", borderRadius: 10, background: NAVY, color: "white", fontWeight: 700, textDecoration: "none", fontSize: "0.85rem" }}>
                  Profil ansehen
                </a>
              </div>
            ))}
          </div>

          {selected && (
            <div style={{ background: "white", borderRadius: 16, padding: 24, boxShadow: "0 2px 12px rgba(26,63,111,0.08)", height: "fit-content" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                <div style={{ fontWeight: 700, color: NAVY }}>{selected.vorname} {selected.nachname}</div>
                <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9BA8C0", fontSize: "1.2rem" }}>x</button>
              </div>
              {[
                ["Qualifikation", selected.qualifikation],
                ["Deutsch", selected.deutsch],
                ["Erfahrung", selected.erfahrung_jahre],
                ["Verfuegbar ab", selected.verfuegbar_ab],
                ["Arbeitszeit", selected.arbeitszeit],
                ["Wohnort", selected.wohnort],
                ["Bundesland", selected.bundesland],
              ].map(([k, v]) => v ? (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #F0F4F9", fontSize: "0.82rem" }}>
                  <span style={{ color: "#9BA8C0", fontWeight: 600 }}>{k}</span>
                  <span style={{ color: "#1a1a2e" }}>{v}</span>
                </div>
              ) : null)}
              <a href={"/fachkraft/" + selected.id} style={{ display: "block", textAlign: "center", marginTop: 16, padding: "12px", borderRadius: 12, background: NAVY, color: "white", fontWeight: 700, textDecoration: "none", fontSize: "0.9rem" }}>
                Vollstaendiges Profil
              </a>
              <a href={"mailto:" + selected.email} style={{ display: "block", textAlign: "center", marginTop: 8, padding: "12px", borderRadius: 12, background: "#EAF7EF", color: GREEN, fontWeight: 700, textDecoration: "none", fontSize: "0.9rem" }}>
                Kontaktieren
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}