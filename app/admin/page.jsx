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
    if (pw === ADMIN_PASSWORD) {
      setAuth(true);
      loadData();
    } else {
      setPwError(true);
    }
  };

  const loadData = async () => {
    setLoading(true);
    const { data: ag } = await supabase.from("arbeitgeber").select("*").order("created_at", { ascending: false });
    const { data: fk } = await supabase.from("fachkraefte").select("*").order("created_at", { ascending: false });
    setArbeitgeber(ag || []);
    setFachkraefte(fk || []);
    setLoading(false);
  };

  const updateStatus = async (table, id, status) => {
    await supabase.from(table).update({ status }).eq("id", id);

    // Freischaltungs-E-Mail an Fachkraft senden
    if (table === "fachkraefte" && status === "bestaetigt" && selected?.email) {
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: selected.email,
          subject: "🎉 Dein KitaBridge-Profil wurde freigeschaltet!",
          html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto">
            <div style="background:#1A3F6F;padding:24px 32px">
              <h1 style="color:white;margin:0;font-size:22px">KitaBridge</h1>
            </div>
            <div style="padding:32px;background:#fff">
              <h2 style="color:#1A3F6F">Hallo ${selected.vorname}!</h2>
              <p style="color:#444;line-height:1.7">Großartige Neuigkeiten – dein Profil wurde von unserem Team geprüft und <strong>freigeschaltet</strong>! 🎉</p>
              <div style="background:#EAF7EF;border-radius:12px;padding:20px;margin:24px 0">
                <p style="color:#1E8449;font-weight:700;margin:0 0 8px">Was passiert jetzt?</p>
                <p style="color:#444;margin:0;line-height:1.8">
                  ✓ Dein Profil ist jetzt für Kitas in ganz Deutschland sichtbar<br/>
                  ✓ Interessierte Einrichtungen können dich direkt per E-Mail kontaktieren<br/>
                  ✓ Du musst nichts weiter tun – einfach auf Kontaktanfragen warten
                </p>
              </div>
              <div style="background:#F8FAFF;border-radius:12px;padding:20px;margin:24px 0">
                <p style="color:#1A3F6F;font-weight:700;margin:0 0 8px">Dein Profil:</p>
                <p style="color:#444;font-size:14px;margin:0">
                  Name: ${selected.vorname} ${selected.nachname}<br/>
                  Qualifikation: ${selected.qualifikation}<br/>
                  Verfügbar ab: ${selected.verfuegbar_ab || "-"}<br/>
                  Arbeitszeit: ${selected.arbeitszeit || "-"}
                </p>
              </div>
              <p style="color:#444;line-height:1.7">Bei Fragen: <a href="mailto:kitabridge@protonmail.com" style="color:#2471A3">kitabridge@protonmail.com</a></p>
              <p style="color:#444">Viele Grüße,<br/><strong>Das KitaBridge-Team</strong></p>
            </div>
            <div style="background:#F8FAFF;padding:16px 32px;text-align:center">
              <p style="color:#9BA8C0;font-size:12px;margin:0">KitaBridge - Heusenstammer Weg 69 - 63071 Offenbach am Main</p>
            </div>
          </div>`
        })
      });
    }

    loadData();
    setSelected(null);
  };

  const deleteEntry = async (table, id) => {
    if (!confirm("Wirklich loeschen?")) return;
    await supabase.from(table).delete().eq("id", id);
    loadData();
    setSelected(null);
  };

  const statusColor = (s) => {
    if (s === "bestaetigt") return { bg: "#EAF7EF", color: GREEN, label: "Bestätigt" };
    if (s === "abgelehnt") return { bg: "#FEF2F2", color: "#DC2626", label: "Abgelehnt" };
    return { bg: "#EEF2FF", color: "#4F46E5", label: "Neu" };
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString("de-DE") : "-";

  // LOGIN SCREEN
  if (!auth) {
    return (
      <div style={{ minHeight: "100vh", background: `linear-gradient(135deg, ${NAVY} 0%, #0F2340 100%)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>
        <div style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 24, padding: 48, width: 380, textAlign: "center" }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 700, marginBottom: 8 }}>
            <span style={{ color: "white" }}>Kita</span><span style={{ color: "#4ADE80" }}>Bridge</span>
          </div>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", marginBottom: 32 }}>Admin Dashboard</div>
          <input
            type="password"
            placeholder="Passwort"
            value={pw}
            onChange={e => { setPw(e.target.value); setPwError(false); }}
            onKeyDown={e => e.key === "Enter" && login()}
            style={{ width: "100%", padding: "14px 16px", borderRadius: 12, border: `1.5px solid ${pwError ? "#EF4444" : "rgba(255,255,255,0.15)"}`, background: "rgba(255,255,255,0.08)", color: "white", fontSize: "0.95rem", fontFamily: "'DM Sans', sans-serif", outline: "none", marginBottom: 8, boxSizing: "border-box" }}
          />
          {pwError && <div style={{ color: "#EF4444", fontSize: "0.8rem", marginBottom: 12 }}>Falsches Passwort</div>}
          <button
            onClick={login}
            style={{ width: "100%", padding: "14px", borderRadius: 12, border: "none", background: `linear-gradient(135deg, ${BLUE}, #1A5C8A)`, color: "white", fontWeight: 700, fontSize: "0.95rem", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginTop: 8 }}>
            Einloggen
          </button>
        </div>
      </div>
    );
  }

  const data = tab === "arbeitgeber" ? arbeitgeber : fachkraefte;
  const table = tab === "arbeitgeber" ? "arbeitgeber" : "fachkraefte";
  const neuCount = data.filter(d => d.status === "neu" || !d.status).length;

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4F9", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap'); * { box-sizing: border-box; }`}</style>

      {/* Header */}
      <div style={{ background: NAVY, padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700 }}>
          <span style={{ color: "white" }}>Kita</span><span style={{ color: "#4ADE80" }}>Bridge</span>
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem", fontWeight: 400, marginLeft: 12 }}>Admin</span>
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <button onClick={loadData} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "white", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: "0.85rem", fontFamily: "'DM Sans', sans-serif" }}>
            ↻ Aktualisieren
          </button>
          <button onClick={() => setAuth(false)} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.6)", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: "0.85rem", fontFamily: "'DM Sans', sans-serif" }}>
            Ausloggen
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
          {[
            { label: "Arbeitgeber gesamt", value: arbeitgeber.length, color: NAVY },
            { label: "Fachkräfte gesamt", value: fachkraefte.length, color: BLUE },
            { label: "Neue Arbeitgeber", value: arbeitgeber.filter(a => a.status === "neu" || !a.status).length, color: "#4F46E5" },
            { label: "Neue Fachkräfte", value: fachkraefte.filter(f => f.status === "neu" || !f.status).length, color: GREEN },
          ].map(s => (
            <div key={s.label} style={{ background: "white", borderRadius: 16, padding: 20, boxShadow: "0 2px 12px rgba(26,63,111,0.08)" }}>
              <div style={{ fontSize: "2rem", fontWeight: 700, color: s.color, fontFamily: "'Playfair Display', serif" }}>{s.value}</div>
              <div style={{ color: "#9BA8C0", fontSize: "0.82rem", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {["arbeitgeber", "fachkraefte"].map(t => (
            <button key={t} onClick={() => { setTab(t); setSelected(null); }} style={{ padding: "10px 24px", borderRadius: 50, border: "none", background: tab === t ? NAVY : "white", color: tab === t ? "white" : "#6B7897", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", boxShadow: "0 2px 8px rgba(26,63,111,0.08)" }}>
              {t === "arbeitgeber" ? "Arbeitgeber" : "Fachkräfte"} ({(t === "arbeitgeber" ? arbeitgeber : fachkraefte).length})
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 380px" : "1fr", gap: 20 }}>
          {/* Table */}
          <div style={{ background: "white", borderRadius: 20, boxShadow: "0 2px 12px rgba(26,63,111,0.08)", overflow: "hidden" }}>
            {loading ? (
              <div style={{ padding: 40, textAlign: "center", color: "#9BA8C0" }}>Lädt...</div>
            ) : data.length === 0 ? (
              <div style={{ padding: 40, textAlign: "center", color: "#9BA8C0" }}>Keine Einträge vorhanden</div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#F8FAFF" }}>
                    {tab === "arbeitgeber"
                      ? ["Einrichtung", "Ansprechpartner", "E-Mail", "Stellen", "Datum", "Status", ""].map(h => (
                          <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "0.75rem", fontWeight: 700, color: "#9BA8C0", textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
                        ))
                      : ["Name", "E-Mail", "Qualifikation", "Deutsch", "Verfügbar", "Status", ""].map(h => (
                          <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "0.75rem", fontWeight: 700, color: "#9BA8C0", textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
                        ))
                    }
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, i) => {
                    const sc = statusColor(row.status);
                    return (
                      <tr key={row.id} onClick={() => setSelected(selected?.id === row.id ? null : row)} style={{ borderTop: "1px solid #F0F4F9", cursor: "pointer", background: selected?.id === row.id ? "#F0F7FF" : i % 2 === 0 ? "white" : "#FAFBFF", transition: "background 0.15s" }}>
                        {tab === "arbeitgeber" ? (
                          <>
                            <td style={{ padding: "12px 16px", fontSize: "0.88rem", fontWeight: 600, color: NAVY }}>{row.einrichtung_name || "-"}</td>
                            <td style={{ padding: "12px 16px", fontSize: "0.85rem", color: "#444" }}>{row.ansprech_name || "-"}</td>
                            <td style={{ padding: "12px 16px", fontSize: "0.85rem", color: "#444" }}>{row.email || "-"}</td>
                            <td style={{ padding: "12px 16px", fontSize: "0.85rem", color: "#444" }}>{row.stellen_anzahl || "-"}</td>
                            <td style={{ padding: "12px 16px", fontSize: "0.82rem", color: "#9BA8C0" }}>{formatDate(row.created_at)}</td>
                          </>
                        ) : (
                          <>
                            <td style={{ padding: "12px 16px", fontSize: "0.88rem", fontWeight: 600, color: NAVY }}>{`${row.vorname || ""} ${row.nachname || ""}`.trim() || "-"}</td>
                            <td style={{ padding: "12px 16px", fontSize: "0.85rem", color: "#444" }}>{row.email || "-"}</td>
                            <td style={{ padding: "12px 16px", fontSize: "0.82rem", color: "#444" }}>{row.qualifikation || "-"}</td>
                            <td style={{ padding: "12px 16px", fontSize: "0.82rem", color: "#444" }}>{row.deutsch || "-"}</td>
                            <td style={{ padding: "12px 16px", fontSize: "0.82rem", color: "#9BA8C0" }}>{row.verfuegbar_ab || "-"}</td>
                          </>
                        )}
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{ background: sc.bg, color: sc.color, padding: "3px 10px", borderRadius: 20, fontSize: "0.75rem", fontWeight: 700 }}>{sc.label}</span>
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
            <div style={{ background: "white", borderRadius: 20, padding: 24, boxShadow: "0 2px 12px rgba(26,63,111,0.08)", height: "fit-content" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h3 style={{ color: NAVY, fontSize: "1rem", fontWeight: 700, margin: 0 }}>
                  {tab === "arbeitgeber" ? selected.einrichtung_name : `${selected.vorname} ${selected.nachname}`}
                </h3>
                <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9BA8C0", fontSize: "1.2rem" }}>×</button>
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
                      ["Rolle", selected.ansprech_rolle],
                      ["E-Mail", selected.email],
                      ["Telefon", selected.telefon],
                      ["Offene Stellen", selected.stellen_anzahl],
                      ["Berufe gesucht", selected.fachrichtungen?.join(", ")],
                      ["Beschäftigungsart", selected.positionen?.join(", ")],
                      ["Addons", selected.addons?.join(", ") || "Keine"],
                      ["Registriert am", formatDate(selected.created_at)],
                    ].map(([k, v]) => v ? (
                      <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #F0F4F9", fontSize: "0.82rem" }}>
                        <span style={{ color: "#9BA8C0", fontWeight: 600 }}>{k}</span>
                        <span style={{ color: "#1a1a2e", maxWidth: 180, textAlign: "right" }}>{v}</span>
                      </div>
                    ) : null)}
                  </>
                ) : (
                  <>
                    {[
                      ["E-Mail", selected.email],
                      ["Telefon", selected.telefon],
                      ["Geburtsland", selected.geburtsland],
                      ["Wohnort", selected.wohnort],
                      ["Qualifikation", selected.qualifikation],
                      ["Deutschkenntnisse", selected.deutsch],
                      ["Englischkenntnisse", selected.englisch],
                      ["Weitere Sprachen", selected.weitere_sprachen],
                      ["Erfahrung", selected.erfahrung_jahre],
                      ["Altersgruppen", selected.kita_alter?.join(", ")],
                      ["Verfügbar ab", selected.verfuegbar_ab],
                      ["Arbeitszeit", selected.arbeitszeit],
                      ["Bundesland", selected.bundesland],
                      ["Registriert am", formatDate(selected.created_at)],
                    ].map(([k, v]) => v ? (
                      <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #F0F4F9", fontSize: "0.82rem" }}>
                        <span style={{ color: "#9BA8C0", fontWeight: 600 }}>{k}</span>
                        <span style={{ color: "#1a1a2e", maxWidth: 180, textAlign: "right" }}>{v}</span>
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

              {/* Status Buttons */}
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
