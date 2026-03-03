"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const NAVY = "#1A3F6F";
const BLUE = "#2471A3";
const GREEN = "#1E8449";
const ADMIN_PASSWORD = "kitabridge2024";

export default function AdminDashboard() {
  const [auth, setAuth] = useState(false);
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState(false);
  const [tab, setTab] = useState("arbeitgeber");
  const [arbeitgeber, setArbeitgeber] = useState([]);
  const [fachkraefte, setFachkraefte] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);

  const login = () => {
    if (pw === ADMIN_PASSWORD) { setAuth(true); loadData(); }
    else { setPwError(true); }
  };

  const loadData = async () => {
    setLoading(true);
    const { data: ag } = await supabase.from("arbeitgeber").select("*").order("created_at", { ascending: false });
    const { data: fk } = await supabase.from("fachkraefte").select("*").order("created_at", { ascending: false });
    setArbeitgeber(ag || []); setFachkraefte(fk || []); setLoading(false);
  };

  const updateStatus = async (table, id, status) => {
    await supabase.from(table).update({ status }).eq("id", id);
    if (table === "fachkraefte" && status === "bestaetigt" && selected?.email) {
      await fetch("/api/send-email", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: selected.email,
          subject: "🎉 Dein KitaBridge-Profil wurde freigeschaltet!",
          html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto"><div style="background:#1A3F6F;padding:24px 32px"><h1 style="color:white;margin:0;font-size:22px">KitaBridge</h1></div><div style="padding:32px;background:#fff"><h2 style="color:#1A3F6F">Hallo ${selected.vorname}!</h2><p style="color:#444;line-height:1.7">Dein Profil wurde <strong>freigeschaltet</strong>! 🎉</p><div style="background:#EAF7EF;border-radius:12px;padding:20px;margin:24px 0"><p style="color:#1E8449;font-weight:700;margin:0 0 8px">Was passiert jetzt?</p><p style="color:#444;margin:0;line-height:1.8">✓ Dein Profil ist für Kitas sichtbar<br/>✓ Einrichtungen können dich direkt kontaktieren<br/>✓ Einfach auf Kontaktanfragen warten</p></div><p style="color:#444">Viele Grüße,<br/><strong>Das KitaBridge-Team</strong></p></div></div>`
        })
      });
    }
    loadData(); setSelected(null);
  };

  const deleteEntry = async (table, id) => {
    if (!confirm("Wirklich löschen?")) return;
    await supabase.from(table).delete().eq("id", id);
    loadData(); setSelected(null);
  };

  const statusColor = (s) => {
    if (s === "bestaetigt") return { bg: "#EAF7EF", color: GREEN, label: "Bestätigt" };
    if (s === "abgelehnt") return { bg: "#FEF2F2", color: "#DC2626", label: "Abgelehnt" };
    return { bg: "#EEF2FF", color: "#4F46E5", label: "Neu" };
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString("de-DE") : "-";

  if (!auth) {
    return (
      <div style={{ minHeight: "100vh", background: `linear-gradient(135deg, ${NAVY} 0%, #0F2340 100%)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif", padding: "24px 16px" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap'); * { box-sizing: border-box; }`}</style>
        <div style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 24, padding: "40px 28px", width: "100%", maxWidth: 380, textAlign: "center" }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 700, marginBottom: 8 }}>
            <span style={{ color: "white" }}>Kita</span><span style={{ color: "#4ADE80" }}>Bridge</span>
          </div>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", marginBottom: 32 }}>Admin Dashboard</div>
          <input
            type="password" placeholder="Passwort" value={pw}
            onChange={e => { setPw(e.target.value); setPwError(false); }}
            onKeyDown={e => e.key === "Enter" && login()}
            style={{ width: "100%", padding: "14px 16px", borderRadius: 12, border: `1.5px solid ${pwError ? "#EF4444" : "rgba(255,255,255,0.15)"}`, background: "rgba(255,255,255,0.08)", color: "white", fontSize: "0.95rem", fontFamily: "'DM Sans', sans-serif", outline: "none", marginBottom: 8 }}
          />
          {pwError && <div style={{ color: "#EF4444", fontSize: "0.8rem", marginBottom: 12 }}>Falsches Passwort</div>}
          <button onClick={login} style={{ width: "100%", padding: "14px", borderRadius: 12, border: "none", background: `linear-gradient(135deg, ${BLUE}, #1A5C8A)`, color: "white", fontWeight: 700, fontSize: "0.95rem", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginTop: 8 }}>
            Einloggen
          </button>
        </div>
      </div>
    );
  }

  const data = tab === "arbeitgeber" ? arbeitgeber : fachkraefte;
  const table = tab === "arbeitgeber" ? "arbeitgeber" : "fachkraefte";

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4F9", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        @media (max-width: 768px) {
          .admin-header { padding: 12px 16px !important; flex-wrap: wrap !important; gap: 8px !important; }
          .admin-container { padding: 20px 16px !important; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
          .admin-layout { grid-template-columns: 1fr !important; }
          .detail-panel { position: fixed !important; bottom: 0 !important; left: 0 !important; right: 0 !important; max-height: 80vh !important; overflow-y: auto !important; border-radius: 20px 20px 0 0 !important; z-index: 50 !important; }
          .detail-overlay { display: block !important; }
          .tab-bar { overflow-x: auto !important; }
          .tab-bar button { white-space: nowrap !important; font-size: 0.82rem !important; padding: 8px 14px !important; }
          .admin-table th, .admin-table td { padding: 10px 8px !important; font-size: 0.78rem !important; }
          .hide-mobile { display: none !important; }
        }
        @media (max-width: 480px) {
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
          .stat-num { font-size: 1.5rem !important; }
        }
        .detail-overlay { display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 49; }
      `}</style>

      {/* Overlay for mobile detail panel */}
      {selected && <div className="detail-overlay" onClick={() => setSelected(null)} />}

      {/* Header */}
      <div className="admin-header" style={{ background: NAVY, padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700 }}>
          <span style={{ color: "white" }}>Kita</span><span style={{ color: "#4ADE80" }}>Bridge</span>
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem", fontWeight: 400, marginLeft: 12 }}>Admin</span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <button onClick={loadData} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "white", padding: "8px 14px", borderRadius: 8, cursor: "pointer", fontSize: "0.82rem", fontFamily: "'DM Sans', sans-serif" }}>
            ↻ Aktualisieren
          </button>
          <button onClick={() => setAuth(false)} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.6)", padding: "8px 14px", borderRadius: 8, cursor: "pointer", fontSize: "0.82rem", fontFamily: "'DM Sans', sans-serif" }}>
            Ausloggen
          </button>
        </div>
      </div>

      <div className="admin-container" style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>

        {/* Stats */}
        <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
          {[
            { label: "Arbeitgeber gesamt", value: arbeitgeber.length, color: NAVY },
            { label: "Fachkräfte gesamt", value: fachkraefte.length, color: BLUE },
            { label: "Neue Arbeitgeber", value: arbeitgeber.filter(a => a.status === "neu" || !a.status).length, color: "#4F46E5" },
            { label: "Neue Fachkräfte", value: fachkraefte.filter(f => f.status === "neu" || !f.status).length, color: GREEN },
          ].map(s => (
            <div key={s.label} style={{ background: "white", borderRadius: 16, padding: 20, boxShadow: "0 2px 12px rgba(26,63,111,0.08)" }}>
              <div className="stat-num" style={{ fontSize: "2rem", fontWeight: 700, color: s.color, fontFamily: "'Playfair Display', serif" }}>{s.value}</div>
              <div style={{ color: "#9BA8C0", fontSize: "0.78rem", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="tab-bar" style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {["arbeitgeber","fachkraefte"].map(t => (
            <button key={t} onClick={() => { setTab(t); setSelected(null); }} style={{ padding: "10px 20px", borderRadius: 50, border: "none", background: tab === t ? NAVY : "white", color: tab === t ? "white" : "#6B7897", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", boxShadow: "0 2px 8px rgba(26,63,111,0.08)", whiteSpace: "nowrap" }}>
              {t === "arbeitgeber" ? "Arbeitgeber" : "Fachkräfte"} ({(t === "arbeitgeber" ? arbeitgeber : fachkraefte).length})
            </button>
          ))}
        </div>

        <div className="admin-layout" style={{ display: "grid", gridTemplateColumns: selected ? "1fr 380px" : "1fr", gap: 20 }}>
          {/* Table */}
          <div style={{ background: "white", borderRadius: 20, boxShadow: "0 2px 12px rgba(26,63,111,0.08)", overflow: "hidden", overflowX: "auto" }}>
            {loading ? (
              <div style={{ padding: 40, textAlign: "center", color: "#9BA8C0" }}>Lädt...</div>
            ) : data.length === 0 ? (
              <div style={{ padding: 40, textAlign: "center", color: "#9BA8C0" }}>Keine Einträge vorhanden</div>
            ) : (
              <table className="admin-table" style={{ width: "100%", borderCollapse: "collapse", minWidth: 500 }}>
                <thead>
                  <tr style={{ background: "#F8FAFF" }}>
                    {tab === "arbeitgeber"
                      ? ["Einrichtung","Ansprechpartner","E-Mail","Datum","Status",""].map((h, i) => (
                          <th key={i} className={i === 1 || i === 2 ? "hide-mobile" : ""} style={{ padding: "12px 16px", textAlign: "left", fontSize: "0.75rem", fontWeight: 700, color: "#9BA8C0", textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
                        ))
                      : ["Name","E-Mail","Qualifikation","Datum","Status",""].map((h, i) => (
                          <th key={i} className={i === 1 || i === 2 ? "hide-mobile" : ""} style={{ padding: "12px 16px", textAlign: "left", fontSize: "0.75rem", fontWeight: 700, color: "#9BA8C0", textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
                        ))
                    }
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, i) => {
                    const sc = statusColor(row.status);
                    return (
                      <tr key={row.id} onClick={() => setSelected(selected?.id === row.id ? null : row)} style={{ borderTop: "1px solid #F0F4F9", cursor: "pointer", background: selected?.id === row.id ? "#F0F7FF" : i % 2 === 0 ? "white" : "#FAFBFF" }}>
                        {tab === "arbeitgeber" ? (
                          <>
                            <td style={{ padding: "12px 16px", fontSize: "0.88rem", fontWeight: 600, color: NAVY }}>{row.einrichtung_name || "-"}</td>
                            <td className="hide-mobile" style={{ padding: "12px 16px", fontSize: "0.85rem", color: "#444" }}>{row.ansprech_name || "-"}</td>
                            <td className="hide-mobile" style={{ padding: "12px 16px", fontSize: "0.85rem", color: "#444" }}>{row.email || "-"}</td>
                            <td style={{ padding: "12px 16px", fontSize: "0.82rem", color: "#9BA8C0" }}>{formatDate(row.created_at)}</td>
                          </>
                        ) : (
                          <>
                            <td style={{ padding: "12px 16px", fontSize: "0.88rem", fontWeight: 600, color: NAVY }}>{`${row.vorname || ""} ${row.nachname || ""}`.trim() || "-"}</td>
                            <td className="hide-mobile" style={{ padding: "12px 16px", fontSize: "0.85rem", color: "#444" }}>{row.email || "-"}</td>
                            <td className="hide-mobile" style={{ padding: "12px 16px", fontSize: "0.82rem", color: "#444" }}>{row.qualifikation || "-"}</td>
                            <td style={{ padding: "12px 16px", fontSize: "0.82rem", color: "#9BA8C0" }}>{formatDate(row.created_at)}</td>
                          </>
                        )}
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{ background: sc.bg, color: sc.color, padding: "3px 10px", borderRadius: 20, fontSize: "0.75rem", fontWeight: 700, whiteSpace: "nowrap" }}>{sc.label}</span>
                        </td>
                        <td style={{ padding: "12px 16px", fontSize: "0.85rem", color: BLUE }}>→</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Detail Panel */}
          {selected && (
            <div className="detail-panel" style={{ background: "white", borderRadius: 20, padding: 24, boxShadow: "0 2px 12px rgba(26,63,111,0.08)", height: "fit-content" }}>
              {/* Drag handle for mobile */}
              <div style={{ width: 40, height: 4, background: "#E8EDF4", borderRadius: 2, margin: "0 auto 16px" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h3 style={{ color: NAVY, fontSize: "1rem", fontWeight: 700, margin: 0, paddingRight: 8 }}>
                  {tab === "arbeitgeber" ? selected.einrichtung_name : `${selected.vorname} ${selected.nachname}`}
                </h3>
                <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9BA8C0", fontSize: "1.4rem", flexShrink: 0 }}>×</button>
              </div>

              <div style={{ marginBottom: 20 }}>
                {tab === "arbeitgeber" ? (
                  <>
                    {[
                      ["Einrichtungstyp", selected.einrichtungstyp],
                      ["Träger", selected.traeger],
                      ["Adresse", `${selected.strasse} ${selected.hausnummer}, ${selected.plz} ${selected.ort}`],
                      ["Bundesland", selected.bundesland],
                      ["Ansprechpartner", selected.ansprech_name],
                      ["E-Mail", selected.email],
                      ["Telefon", selected.telefon],
                      ["Offene Stellen", selected.stellen_anzahl],
                      ["Registriert am", formatDate(selected.created_at)],
                    ].map(([k, v]) => v ? (
                      <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #F0F4F9", fontSize: "0.82rem", gap: 8 }}>
                        <span style={{ color: "#9BA8C0", fontWeight: 600, flexShrink: 0 }}>{k}</span>
                        <span style={{ color: "#1a1a2e", textAlign: "right" }}>{v}</span>
                      </div>
                    ) : null)}
                  </>
                ) : (
                  <>
                    {[
                      ["E-Mail", selected.email],
                      ["Telefon", selected.telefon],
                      ["Wohnort", selected.wohnort],
                      ["Qualifikation", selected.qualifikation],
                      ["Deutsch", selected.deutsch],
                      ["Englisch", selected.englisch],
                      ["Weitere Sprachen", selected.weitere_sprachen],
                      ["Erfahrung", selected.erfahrung_jahre],
                      ["Verfügbar ab", selected.verfuegbar_ab],
                      ["Arbeitszeit", selected.arbeitszeit],
                      ["Bundesland", selected.bundesland],
                      ["Registriert am", formatDate(selected.created_at)],
                    ].map(([k, v]) => v ? (
                      <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #F0F4F9", fontSize: "0.82rem", gap: 8 }}>
                        <span style={{ color: "#9BA8C0", fontWeight: 600, flexShrink: 0 }}>{k}</span>
                        <span style={{ color: "#1a1a2e", textAlign: "right" }}>{v}</span>
                      </div>
                    ) : null)}
                  </>
                )}
              </div>

              {selected.beschreibung && (
                <div style={{ background: "#F8FAFF", borderRadius: 10, padding: 12, marginBottom: 20, fontSize: "0.82rem", color: "#444", lineHeight: 1.6 }}>
                  {selected.beschreibung}
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <button onClick={() => updateStatus(table, selected.id, "bestaetigt")} style={{ padding: "10px", borderRadius: 10, border: "none", background: "#EAF7EF", color: GREEN, fontWeight: 700, cursor: "pointer", fontSize: "0.85rem", fontFamily: "'DM Sans', sans-serif" }}>
                  ✓ Bestätigen
                </button>
                <button onClick={() => updateStatus(table, selected.id, "abgelehnt")} style={{ padding: "10px", borderRadius: 10, border: "none", background: "#FEF2F2", color: "#DC2626", fontWeight: 700, cursor: "pointer", fontSize: "0.85rem", fontFamily: "'DM Sans', sans-serif" }}>
                  ✗ Ablehnen
                </button>
                <button onClick={() => updateStatus(table, selected.id, "neu")} style={{ padding: "10px", borderRadius: 10, border: "none", background: "#EEF2FF", color: "#4F46E5", fontWeight: 700, cursor: "pointer", fontSize: "0.85rem", fontFamily: "'DM Sans', sans-serif" }}>
                  ↺ Auf Neu setzen
                </button>
                <button onClick={() => deleteEntry(table, selected.id)} style={{ padding: "10px", borderRadius: 10, border: "1px solid #FEE2E2", background: "white", color: "#DC2626", fontWeight: 700, cursor: "pointer", fontSize: "0.85rem", fontFamily: "'DM Sans', sans-serif" }}>
                  🗑 Löschen
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}