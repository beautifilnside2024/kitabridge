"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const NAVY = "#1A3F6F";
const BLUE = "#2471A3";
const GREEN = "#1E8449";
const RED = "#DC2626";

const inputStyle: any = {
  width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #E2E8F0",
  fontSize: "0.9rem", outline: "none", fontFamily: "'DM Sans', sans-serif",
  color: "#1a1a2e", background: "white", marginBottom: 4, boxSizing: "border-box"
};
const selectStyle = { ...inputStyle, cursor: "pointer" };
const labelStyle: any = { display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#9BA8C0", textTransform: "uppercase", marginBottom: 6 };

function NachrichtenTab({ arbeitgeber }: { arbeitgeber: any }) {
  const [nachrichten, setNachrichten] = useState<any[]>([]);
  const [akzeptierteAnfragen, setAkzeptierteAnfragen] = useState<any[]>([]);
  const [fachkraefteMap, setFachkraefteMap] = useState<any>({});
  const [antwort, setAntwort] = useState<any>({});
  const [gesendet, setGesendet] = useState<any>({});
  const [neueNachricht, setNeueNachricht] = useState<any>({});
  const [neuGesendet, setNeuGesendet] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [subTab, setSubTab] = useState<"konversationen" | "neu">("konversationen");

  useEffect(() => {
    if (!arbeitgeber?.id) return;
    loadAll();
  }, [arbeitgeber]);

  const loadAll = async () => {
    // Nachrichten laden
    const res = await fetch(`/api/nachrichten?user_id=${arbeitgeber.id}`);
    const msgs = await res.json();
    setNachrichten(msgs || []);

    // Akzeptierte Anfragen laden
    const { data: anfragen } = await supabase
      .from("anfragen")
      .select("*")
      .eq("kita_id", arbeitgeber.id)
      .eq("status", "akzeptiert");
    setAkzeptierteAnfragen(anfragen || []);

    // Fachkraft-Infos laden
    if (anfragen && anfragen.length > 0) {
      const ids = anfragen.map((a: any) => a.fachkraft_id);
      const { data: fachkraefte } = await supabase
        .from("fachkraefte")
        .select("id, vorname, nachname, username, email")
        .in("id", ids);
      const map: any = {};
      (fachkraefte || []).forEach((f: any) => { map[f.id] = f; });
      setFachkraefteMap(map);
    }

    setLoading(false);
  };

  const handleAntwort = async (msg: any) => {
    const text = antwort[msg.id];
    if (!text?.trim()) return;
    const fk = fachkraefteMap[msg.von_id] || fachkraefteMap[msg.an_id];
    await fetch("/api/nachrichten", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        von_id: arbeitgeber.id,
        an_id: msg.von_id === arbeitgeber.id ? msg.an_id : msg.von_id,
        von_typ: "arbeitgeber",
        nachricht: text,
        empfaenger_email: fk?.email || "",
        empfaenger_name: fk?.vorname || fk?.username || "Fachkraft",
        absender_name: arbeitgeber.einrichtung_name,
      }),
    });
    setGesendet({ ...gesendet, [msg.id]: true });
    setAntwort({ ...antwort, [msg.id]: "" });
    await loadAll();
  };

  const handleNeueNachricht = async (fachkraftId: string) => {
    const text = neueNachricht[fachkraftId];
    if (!text?.trim()) return;
    const fk = fachkraefteMap[fachkraftId];
    await fetch("/api/nachrichten", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        von_id: arbeitgeber.id,
        an_id: fachkraftId,
        von_typ: "arbeitgeber",
        nachricht: text,
        empfaenger_email: fk?.email || "",
        empfaenger_name: fk?.vorname || fk?.username || "Fachkraft",
        absender_name: arbeitgeber.einrichtung_name,
      }),
    });
    setNeuGesendet({ ...neuGesendet, [fachkraftId]: true });
    setNeueNachricht({ ...neueNachricht, [fachkraftId]: "" });
    await loadAll();
    setSubTab("konversationen");
  };

  // Nachrichten gruppiert nach GesprÃ¤chspartner
  const getKonversationen = () => {
    const map: any = {};
    nachrichten.forEach(msg => {
      const partnerId = msg.von_id === arbeitgeber.id ? msg.an_id : msg.von_id;
      if (!map[partnerId]) map[partnerId] = [];
      map[partnerId].push(msg);
    });
    return map;
  };

  if (loading) return <div style={{ color: NAVY, padding: 20 }}>LÃ¤dt...</div>;

  const konversationen = getKonversationen();

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
        <button onClick={() => setSubTab("konversationen")} style={{ flex: 1, padding: "10px", borderRadius: 9, border: "none", background: subTab === "konversationen" ? NAVY : "white", color: subTab === "konversationen" ? "white" : "#6B7897", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 2px 8px rgba(26,63,111,0.08)" }}>
          ðŸ’¬ Konversationen
        </button>
        <button onClick={() => setSubTab("neu")} style={{ flex: 1, padding: "10px", borderRadius: 9, border: "none", background: subTab === "neu" ? NAVY : "white", color: subTab === "neu" ? "white" : "#6B7897", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 2px 8px rgba(26,63,111,0.08)" }}>
          âœ‰ï¸ Neue Nachricht
        </button>
      </div>

      {/* KONVERSATIONEN */}
      {subTab === "konversationen" && (
        <div>
          {Object.keys(konversationen).length === 0 ? (
            <div style={{ background: "white", borderRadius: 20, padding: 40, textAlign: "center", color: "#9BA8C0" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>ðŸ“­</div>
              <p style={{ margin: 0 }}>Noch keine Nachrichten</p>
              <p style={{ fontSize: "0.85rem", marginTop: 8 }}>Schreibe einer Fachkraft die deine Anfrage akzeptiert hat.</p>
            </div>
          ) : Object.entries(konversationen).map(([partnerId, msgs]: any) => {
            const fk = fachkraefteMap[partnerId];
            const name = fk ? (fk.vorname ? `${fk.vorname} ${fk.nachname || ""}`.trim() : fk.username) : "Fachkraft";
            return (
              <div key={partnerId} style={{ background: "white", borderRadius: 16, padding: 20, marginBottom: 16, boxShadow: "0 2px 12px rgba(26,63,111,0.08)" }}>
                <div style={{ fontWeight: 700, color: NAVY, marginBottom: 14, fontSize: "0.95rem" }}>ðŸ‘¤ {name}</div>
                {msgs.sort((a: any, b: any) => new Date(a.erstellt_am).getTime() - new Date(b.erstellt_am).getTime()).map((msg: any) => (
                  <div key={msg.id} style={{ marginBottom: 10, display: "flex", justifyContent: msg.von_id === arbeitgeber.id ? "flex-end" : "flex-start" }}>
                    <div style={{ maxWidth: "80%", background: msg.von_id === arbeitgeber.id ? NAVY : "#F0F4F9", color: msg.von_id === arbeitgeber.id ? "white" : "#444", borderRadius: msg.von_id === arbeitgeber.id ? "16px 16px 4px 16px" : "16px 16px 16px 4px", padding: "10px 14px", fontSize: "0.88rem", lineHeight: 1.6 }}>
                      <div>{msg.nachricht}</div>
                      <div style={{ fontSize: "0.7rem", opacity: 0.6, marginTop: 4 }}>{new Date(msg.erstellt_am).toLocaleDateString("de-DE", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</div>
                    </div>
                  </div>
                ))}
                {!gesendet[partnerId] && (
                  <div style={{ marginTop: 12 }}>
                    <textarea
                      placeholder="Antwort schreiben..."
                      rows={2}
                      value={antwort[partnerId] || ""}
                      onChange={e => setAntwort({ ...antwort, [partnerId]: e.target.value })}
                      style={{ width: "100%", padding: "10px 14px", border: "1px solid #E8EDF4", borderRadius: 10, fontSize: "0.88rem", resize: "vertical", fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box" }}
                    />
                    <button onClick={() => {
                      const lastMsg = msgs[msgs.length - 1];
                      handleAntwort({ ...lastMsg, id: partnerId });
                    }} style={{ marginTop: 6, padding: "9px 20px", background: NAVY, color: "white", border: "none", borderRadius: 50, fontWeight: 700, cursor: "pointer", fontSize: "0.85rem", width: "100%", fontFamily: "'DM Sans', sans-serif" }}>
                      Senden â†’
                    </button>
                  </div>
                )}
                {gesendet[partnerId] && <div style={{ color: GREEN, fontWeight: 600, fontSize: "0.85rem", marginTop: 8 }}>âœ… Nachricht gesendet!</div>}
              </div>
            );
          })}
        </div>
      )}

      {/* NEUE NACHRICHT */}
      {subTab === "neu" && (
        <div>
          {akzeptierteAnfragen.length === 0 ? (
            <div style={{ background: "white", borderRadius: 20, padding: 40, textAlign: "center", color: "#9BA8C0" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>ðŸ”’</div>
              <div style={{ fontWeight: 700, color: NAVY, marginBottom: 8 }}>Keine akzeptierten Anfragen</div>
              <div style={{ fontSize: "0.85rem" }}>Du kannst nur FachkrÃ¤ften schreiben, die deine Anfrage akzeptiert haben.</div>
            </div>
          ) : akzeptierteAnfragen.map((anfrage: any) => {
            const fk = fachkraefteMap[anfrage.fachkraft_id];
            const name = fk ? (fk.vorname ? `${fk.vorname} ${fk.nachname || ""}`.trim() : fk.username) : "Fachkraft";
            return (
              <div key={anfrage.id} style={{ background: "white", borderRadius: 16, padding: 20, marginBottom: 12, boxShadow: "0 2px 8px rgba(26,63,111,0.06)" }}>
                <div style={{ fontWeight: 700, color: NAVY, marginBottom: 12 }}>ðŸ‘¤ {name}</div>
                {neuGesendet[anfrage.fachkraft_id] ? (
                  <div style={{ color: GREEN, fontWeight: 600, fontSize: "0.85rem" }}>âœ… Nachricht gesendet!</div>
                ) : (
                  <>
                    <textarea
                      placeholder={`Nachricht an ${name}...`}
                      rows={3}
                      value={neueNachricht[anfrage.fachkraft_id] || ""}
                      onChange={e => setNeueNachricht({ ...neueNachricht, [anfrage.fachkraft_id]: e.target.value })}
                      style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #E2E8F0", borderRadius: 10, fontSize: "0.88rem", resize: "vertical", fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box" }}
                    />
                    <button
                      onClick={() => handleNeueNachricht(anfrage.fachkraft_id)}
                      style={{ marginTop: 8, width: "100%", padding: "11px", background: `linear-gradient(135deg, ${NAVY}, ${BLUE})`, color: "white", border: "none", borderRadius: 10, fontWeight: 700, cursor: "pointer", fontSize: "0.88rem", fontFamily: "'DM Sans', sans-serif" }}
                    >
                      Nachricht senden â†’
                    </button>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FachkraefteTab({ arbeitgeber }: { arbeitgeber: any }) {
  const [fachkraefte, setFachkraefte] = useState<any[]>([]);
  const [gesendeteAnfragen, setGesendeteAnfragen] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [subTab, setSubTab] = useState<"suche" | "anfragen">("suche");
  const [filterQual, setFilterQual] = useState("");
  const [filterBundesland, setFilterBundesland] = useState("");
  const [filterArbeitszeit, setFilterArbeitszeit] = useState("");
  const [selectedFachkraft, setSelectedFachkraft] = useState<any>(null);
  const [nachricht, setNachricht] = useState("");
  const [sendingAnfrage, setSendingAnfrage] = useState(false);
  const [anfrageSuccess, setAnfrageSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadFachkraefte();
    loadGesendeteAnfragen();
  }, []);

  const loadFachkraefte = async (qual = "", land = "", zeit = "") => {
    setSearching(true);
    let query = supabase.from("fachkraefte")
      .select("id, username, vorname, nachname, anonym, email, telefon, qualifikation, erfahrung_jahre, bundesland, wohnort, arbeitszeit, deutsch, beschreibung, verfuegbar_ab, aktiv_suchend, kita_alter")
      .eq("aktiv_suchend", true);
    if (qual) query = query.eq("qualifikation", qual);
    if (land) query = query.eq("bundesland", land);
    if (zeit) query = query.eq("arbeitszeit", zeit);
    const { data } = await query.limit(50);
    setFachkraefte(data || []);
    setSearching(false);
  };

  const loadGesendeteAnfragen = async () => {
    const { data } = await supabase.from("anfragen").select("*").eq("kita_id", arbeitgeber.id).order("created_at", { ascending: false });
    setGesendeteAnfragen(data || []);
  };

  const getAnfrageStatus = (fachkraftId: string) => gesendeteAnfragen.find(a => a.fachkraft_id === fachkraftId)?.status;
  const hatBereitsAngefragt = (fachkraftId: string) => gesendeteAnfragen.some(a => a.fachkraft_id === fachkraftId);

  const handleAnfrageSenden = async () => {
    if (!selectedFachkraft) return;
    setSendingAnfrage(true);
    if (hatBereitsAngefragt(selectedFachkraft.id)) { setAnfrageSuccess("bereits"); setSendingAnfrage(false); return; }
    const { error } = await supabase.from("anfragen").insert([{
      kita_id: arbeitgeber.id, fachkraft_id: selectedFachkraft.id,
      kita_name: arbeitgeber.einrichtung_name, kita_email: arbeitgeber.email,
      kita_telefon: arbeitgeber.telefon,
      nachricht: nachricht.trim() || `Hallo! Wir sind ${arbeitgeber?.einrichtung_name} und suchen eine engagierte Fachkraft.`,
      status: "ausstehend"
    }]);
    if (error) { alert("Fehler: " + error.message); setSendingAnfrage(false); return; }
    try {
      await fetch("/api/send-email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "neue_anfrage", data: { fachkraft_id: selectedFachkraft.id, kita_name: arbeitgeber.einrichtung_name, nachricht: nachricht.trim() } }) });
    } catch (e) {}
    await loadGesendeteAnfragen();
    setAnfrageSuccess("ok");
    setSendingAnfrage(false);
  };

  const qualifikationen = ["Staatlich anerkannte/r Erzieher/in", "KindheitspÃ¤dagoge/in", "SozialpÃ¤dagoge/in", "HeilpÃ¤dagoge/in", "Kinderpflegerin / Kinderpfleger", "Sozialarbeiterin / Sozialarbeiter", "Kita-Leitung", "Sonstige pÃ¤dagogische Fachkraft"];
  const bundeslaender = ["Baden-WÃ¼rttemberg", "Bayern", "Berlin", "Brandenburg", "Bremen", "Hamburg", "Hessen", "Mecklenburg-Vorpommern", "Niedersachsen", "Nordrhein-Westfalen", "Rheinland-Pfalz", "Saarland", "Sachsen", "Sachsen-Anhalt", "Schleswig-Holstein", "ThÃ¼ringen"];
  const arbeitszeiten = ["Vollzeit", "Teilzeit", "Vollzeit & Teilzeit", "Minijob"];
  const akzeptierteAnfragen = gesendeteAnfragen.filter(a => a.status === "akzeptiert");

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
        <button onClick={() => setSubTab("suche")} style={{ flex: 1, minWidth: 130, padding: "10px 14px", borderRadius: 9, border: "none", background: subTab === "suche" ? NAVY : "white", color: subTab === "suche" ? "white" : "#6B7897", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 2px 8px rgba(26,63,111,0.08)" }}>
          ðŸ” FachkrÃ¤fte suchen
        </button>
        <button onClick={() => setSubTab("anfragen")} style={{ flex: 1, minWidth: 130, padding: "10px 14px", borderRadius: 9, border: "none", background: subTab === "anfragen" ? NAVY : "white", color: subTab === "anfragen" ? "white" : "#6B7897", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 2px 8px rgba(26,63,111,0.08)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          ðŸ“¤ Meine Anfragen
          {akzeptierteAnfragen.length > 0 && <span style={{ background: GREEN, color: "white", borderRadius: 50, padding: "1px 8px", fontSize: "0.72rem", fontWeight: 800 }}>{akzeptierteAnfragen.length} neu</span>}
        </button>
      </div>

      {subTab === "suche" && (
        <div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
            <select value={filterQual} onChange={e => setFilterQual(e.target.value)} style={{ ...selectStyle, marginBottom: 0 }}>
              <option value="">Alle Qualifikationen</option>
              {qualifikationen.map(q => <option key={q} value={q}>{q}</option>)}
            </select>
            <div style={{ display: "flex", gap: 8 }}>
              <select value={filterBundesland} onChange={e => setFilterBundesland(e.target.value)} style={{ ...selectStyle, flex: 1, marginBottom: 0 }}>
                <option value="">Alle BundeslÃ¤nder</option>
                {bundeslaender.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
              <select value={filterArbeitszeit} onChange={e => setFilterArbeitszeit(e.target.value)} style={{ ...selectStyle, flex: 1, marginBottom: 0 }}>
                <option value="">Alle Zeiten</option>
                {arbeitszeiten.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <button onClick={() => loadFachkraefte(filterQual, filterBundesland, filterArbeitszeit)} disabled={searching} style={{ padding: "12px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${NAVY}, ${BLUE})`, color: "white", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem" }}>
              {searching ? "Sucht..." : "ðŸ” Suchen"}
            </button>
          </div>
          {fachkraefte.length === 0 ? (
            <div style={{ background: "white", borderRadius: 20, padding: 40, textAlign: "center", color: "#9BA8C0" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>ðŸ”</div>
              <div style={{ fontWeight: 700, color: NAVY, marginBottom: 6 }}>Keine Ergebnisse</div>
            </div>
          ) : fachkraefte.map(fk => {
            const anonym = fk.anonym || fk.username;
            const name = anonym ? fk.username : `${fk.vorname || ""} ${fk.nachname || ""}`.trim();
            const status = getAnfrageStatus(fk.id);
            const bereitsAngefragt = hatBereitsAngefragt(fk.id);
            return (
              <div key={fk.id} style={{ background: "white", borderRadius: 16, padding: 16, marginBottom: 12, border: `1.5px solid ${status === "akzeptiert" ? "#86EFAC" : "#E8EDF4"}`, boxShadow: "0 2px 12px rgba(26,63,111,0.06)" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
                  <div style={{ width: 46, height: 46, borderRadius: 12, background: anonym ? `linear-gradient(135deg, ${NAVY}, ${BLUE})` : "#EAF7EF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: anonym ? "1.3rem" : "0.95rem", fontWeight: 800, color: anonym ? "white" : GREEN, flexShrink: 0 }}>
                    {anonym ? "ðŸ¦¸" : name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 800, color: NAVY, fontSize: "0.95rem" }}>{name}</div>
                    {anonym && <div style={{ fontSize: "0.7rem", color: BLUE, fontWeight: 700, textTransform: "uppercase" }}>Anonym</div>}
                    <div style={{ fontSize: "0.8rem", color: "#6B7897", marginTop: 2 }}>{fk.qualifikation}</div>
                  </div>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
                  {fk.bundesland && <span style={{ background: "#F0F4F9", borderRadius: 50, padding: "3px 10px", fontSize: "0.73rem", color: "#6B7897", fontWeight: 600 }}>ðŸ“ {fk.bundesland}</span>}
                  {fk.arbeitszeit && <span style={{ background: "#F0F4F9", borderRadius: 50, padding: "3px 10px", fontSize: "0.73rem", color: "#6B7897", fontWeight: 600 }}>â± {fk.arbeitszeit}</span>}
                  {fk.erfahrung_jahre && <span style={{ background: "#F0F4F9", borderRadius: 50, padding: "3px 10px", fontSize: "0.73rem", color: "#6B7897", fontWeight: 600 }}>â­ {fk.erfahrung_jahre} Jahre</span>}
                </div>
                {fk.beschreibung && <div style={{ fontSize: "0.82rem", color: "#6B7897", lineHeight: 1.6, borderTop: "1px solid #F0F4F9", paddingTop: 8, marginBottom: 10 }}>{fk.beschreibung.length > 120 ? fk.beschreibung.slice(0, 120) + "..." : fk.beschreibung}</div>}
                {bereitsAngefragt ? (
                  <div style={{ marginTop: 4 }}>
                    {status === "ausstehend" && <span style={{ display: "inline-block", background: "#EBF4FF", color: BLUE, borderRadius: 50, padding: "6px 14px", fontSize: "0.78rem", fontWeight: 700 }}>â³ Ausstehend</span>}
                    {status === "akzeptiert" && <span style={{ display: "inline-block", background: "#EAF7EF", color: GREEN, borderRadius: 50, padding: "6px 14px", fontSize: "0.78rem", fontWeight: 700 }}>âœ“ Akzeptiert</span>}
                    {status === "abgelehnt" && <span style={{ display: "inline-block", background: "#F8F8F8", color: "#9BA8C0", borderRadius: 50, padding: "6px 14px", fontSize: "0.78rem", fontWeight: 700 }}>âœ— Abgelehnt</span>}
                  </div>
                ) : (
                  <button onClick={() => { setSelectedFachkraft(fk); setNachricht(""); setAnfrageSuccess(null); }} style={{ width: "100%", padding: "11px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${GREEN}, #27AE60)`, color: "white", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem" }}>
                    Anfrage senden â†’
                  </button>
                )}
                {status === "akzeptiert" && (
                  <div style={{ marginTop: 10, background: "#EAF7EF", borderRadius: 10, padding: "12px 14px", fontSize: "0.85rem" }}>
                    <div style={{ fontWeight: 700, color: GREEN, marginBottom: 6 }}>âœ“ Kontaktdaten freigegeben</div>
                    {(fk.vorname || fk.nachname) && <div style={{ color: "#444", marginBottom: 2 }}>ðŸ‘¤ {fk.vorname} {fk.nachname}</div>}
                    {fk.email && <div style={{ color: "#444", marginBottom: 2, wordBreak: "break-all" }}>âœ‰ï¸ <a href={`mailto:${fk.email}`} style={{ color: BLUE }}>{fk.email}</a></div>}
                    {fk.telefon && <div style={{ color: "#444" }}>ðŸ“ž {fk.telefon}</div>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {subTab === "anfragen" && (
        <div>
          {gesendeteAnfragen.length === 0 ? (
            <div style={{ background: "white", borderRadius: 20, padding: 40, textAlign: "center", color: "#9BA8C0" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>ðŸ“¤</div>
              <div style={{ fontWeight: 700, color: NAVY, marginBottom: 6 }}>Noch keine Anfragen gesendet</div>
            </div>
          ) : gesendeteAnfragen.map(anfrage => (
            <div key={anfrage.id} style={{ background: "white", borderRadius: 14, padding: 16, marginBottom: 12, border: `1.5px solid ${anfrage.status === "akzeptiert" ? "#86EFAC" : anfrage.status === "abgelehnt" ? "#E2E8F0" : "#BFDBFE"}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, gap: 8, flexWrap: "wrap" }}>
                <div style={{ fontWeight: 700, color: NAVY, fontSize: "0.92rem" }}>Anfrage an Fachkraft</div>
                <span style={{ flexShrink: 0, background: anfrage.status === "akzeptiert" ? "#EAF7EF" : anfrage.status === "abgelehnt" ? "#F8F8F8" : "#EBF4FF", color: anfrage.status === "akzeptiert" ? GREEN : anfrage.status === "abgelehnt" ? "#9BA8C0" : BLUE, borderRadius: 50, padding: "4px 12px", fontSize: "0.75rem", fontWeight: 700 }}>
                  {anfrage.status === "akzeptiert" ? "âœ“ Akzeptiert" : anfrage.status === "abgelehnt" ? "âœ— Abgelehnt" : "â³ Ausstehend"}
                </span>
              </div>
              {anfrage.nachricht && <div style={{ fontSize: "0.82rem", color: "#6B7897", lineHeight: 1.6, marginBottom: 6 }}>"{anfrage.nachricht}"</div>}
              <div style={{ fontSize: "0.75rem", color: "#9BA8C0" }}>{new Date(anfrage.created_at).toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" })}</div>
              {anfrage.status === "akzeptiert" && (
                <div style={{ marginTop: 10, background: "#EAF7EF", borderRadius: 8, padding: "10px 14px", fontSize: "0.82rem", color: GREEN, fontWeight: 600 }}>
                  âœ“ Akzeptiert â€“ Du kannst dieser Fachkraft jetzt im Nachrichten-Tab schreiben.
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedFachkraft && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 1000 }} onClick={e => { if (e.target === e.currentTarget) { setSelectedFachkraft(null); setAnfrageSuccess(null); } }}>
          <div style={{ background: "white", borderRadius: "24px 24px 0 0", padding: "24px 20px", width: "100%", maxWidth: 560, maxHeight: "92vh", overflowY: "auto" }}>
            <div style={{ width: 40, height: 4, background: "#E2E8F0", borderRadius: 2, margin: "0 auto 20px" }} />
            {anfrageSuccess === "ok" ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: "3rem", marginBottom: 16 }}>âœ…</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", color: NAVY, marginBottom: 12 }}>Anfrage gesendet!</div>
                <button onClick={() => { setSelectedFachkraft(null); setAnfrageSuccess(null); }} style={{ width: "100%", padding: "14px", borderRadius: 50, border: "none", background: NAVY, color: "white", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>SchlieÃŸen</button>
              </div>
            ) : anfrageSuccess === "bereits" ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: "3rem", marginBottom: 16 }}>â„¹ï¸</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: NAVY, marginBottom: 12 }}>Bereits angefragt</div>
                <button onClick={() => { setSelectedFachkraft(null); setAnfrageSuccess(null); }} style={{ width: "100%", padding: "14px", borderRadius: 50, border: "none", background: NAVY, color: "white", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>SchlieÃŸen</button>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#9BA8C0", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Anfrage senden an</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 46, height: 46, borderRadius: 12, background: "#EAF7EF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", flexShrink: 0 }}>
                      {selectedFachkraft.username ? "ðŸ¦¸" : `${selectedFachkraft.vorname?.[0] || ""}${selectedFachkraft.nachname?.[0] || ""}`}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, color: NAVY }}>{selectedFachkraft.username || `${selectedFachkraft.vorname} ${selectedFachkraft.nachname}`}</div>
                      <div style={{ fontSize: "0.8rem", color: "#6B7897" }}>{selectedFachkraft.qualifikation}</div>
                    </div>
                  </div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#4A5568", marginBottom: 8, textTransform: "uppercase" as const }}>Nachricht (optional)</label>
                  <textarea value={nachricht} onChange={e => setNachricht(e.target.value)} rows={4} style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1.5px solid #E2E8F0", fontSize: "0.88rem", fontFamily: "'DM Sans', sans-serif", resize: "vertical", outline: "none", color: "#444", boxSizing: "border-box" }} />
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setSelectedFachkraft(null)} style={{ flex: 1, padding: "13px", borderRadius: 10, border: "2px solid #E2E8F0", background: "white", color: "#6B7897", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Abbrechen</button>
                  <button onClick={handleAnfrageSenden} disabled={sendingAnfrage} style={{ flex: 2, padding: "13px", borderRadius: 10, border: "none", background: sendingAnfrage ? "#ccc" : `linear-gradient(135deg, ${GREEN}, #27AE60)`, color: "white", fontWeight: 700, cursor: sendingAnfrage ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                    {sendingAnfrage ? "Wird gesendet..." : "Anfrage senden â†’"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const [arbeitgeber, setArbeitgeber] = useState<any>(null);
  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("uebersicht");
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => { loadDashboard(); }, []);

  const loadDashboard = async () => {
    let session = (await supabase.auth.getSession()).data.session;
    if (!session) { await new Promise(r => setTimeout(r, 500)); session = (await supabase.auth.getSession()).data.session; }
    if (!session) { router.push("/login"); return; }
    const { data } = await supabase.from("arbeitgeber").select("*").eq("email", session.user.email).single();
    setArbeitgeber(data); setForm(data); setLoading(false);
  };

  const handleLogout = async () => { await supabase.auth.signOut(); router.push("/login"); };
  const set = (key: string, value: any) => setForm((f: any) => ({ ...f, [key]: value }));

  const handleSave = async () => {
    setSaving(true); setSaveError(""); setSaveSuccess(false);
    const { error } = await supabase.from("arbeitgeber").update({
      einrichtung_name: form.einrichtung_name, einrichtungstyp: form.einrichtungstyp,
      traeger: form.traeger, beschreibung: form.beschreibung, strasse: form.strasse,
      hausnummer: form.hausnummer, plz: form.plz, ort: form.ort, bundesland: form.bundesland,
      ansprech_name: form.ansprech_name, ansprech_rolle: form.ansprech_rolle,
      telefon: form.telefon, stellen_anzahl: form.stellen_anzahl,
    }).eq("email", arbeitgeber.email);
    setSaving(false);
    if (error) { setSaveError("Fehler beim Speichern: " + error.message); }
    else { setArbeitgeber({ ...arbeitgeber, ...form }); setEditMode(false); setSaveSuccess(true); setTimeout(() => setSaveSuccess(false), 3000); }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Sind Sie sicher? Ihr Account und alle Daten werden unwiderruflich gelÃ¶scht.")) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const res = await fetch("/api/account/delete", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: session.user.email, rolle: "arbeitgeber" }) });
    if (res.ok) { await supabase.auth.signOut(); alert("Ihr Account wurde erfolgreich gelÃ¶scht."); router.push("/"); }
    else { alert("Fehler beim LÃ¶schen. Bitte kontaktieren Sie uns unter hallo@kitabridge.de"); }
  };

  const handleKuendigung = async () => {
    if (!window.confirm("MÃ¶chten Sie Ihr Abo wirklich kÃ¼ndigen?")) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const res = await fetch("/api/stripe/kuendigung", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: session.user.email }) });
    if (res.ok) { alert("Ihr Abo wurde erfolgreich gekÃ¼ndigt."); loadDashboard(); }
    else { alert("Fehler beim KÃ¼ndigen. Bitte kontaktieren Sie uns unter hallo@kitabridge.de"); }
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F0F4F9", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ color: NAVY }}>LÃ¤dt...</div>
    </div>
  );

  const isAktiv = arbeitgeber?.status === "aktiv" || arbeitgeber?.status === "bestaetigt";

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4F9", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        input:focus, select:focus, textarea:focus { border-color: #2471A3 !important; }
        .db-header { background: ${NAVY}; padding: 0 16px; display: flex; align-items: center; justify-content: space-between; height: 56px; position: sticky; top: 0; z-index: 50; }
        .db-header-name { display: none; }
        .db-container { padding: 16px; }
        .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
        .quick-grid { display: grid; grid-template-columns: 1fr; gap: 14px; }
        .plan-card { padding: 20px; }
        .tab-bar-wrapper { position: sticky; top: 56px; z-index: 40; background: #F0F4F9; padding: 10px 0 4px; margin-bottom: 16px; }
        .tab-bar { display: flex; gap: 4px; background: white; border-radius: 12px; padding: 4px; overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none; box-shadow: 0 2px 8px rgba(26,63,111,0.08); }
        .tab-bar::-webkit-scrollbar { display: none; }
        .tab-bar button { white-space: nowrap; padding: 8px 13px; border-radius: 9px; border: none; font-weight: 600; font-size: 0.82rem; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; flex-shrink: 0; }
        .profile-grid { display: grid; grid-template-columns: 1fr; gap: 0; }
        .two-col-grid { display: grid; grid-template-columns: 1fr; gap: 0; }
        .three-one-grid { display: grid; grid-template-columns: 1fr; gap: 0; }
        .one-two-grid { display: grid; grid-template-columns: 1fr; gap: 0; }
        .edit-btns { display: flex; flex-direction: column; gap: 8px; width: 100%; }
        .edit-btns button { width: 100%; }
        .profile-card { padding: 16px; }
        .inactive-banner { flex-direction: column !important; }
        .inactive-banner a { text-align: center; }
        @media (min-width: 600px) {
          .db-header { padding: 0 24px; height: 64px; }
          .db-header-name { display: inline; }
          .db-container { padding: 24px; }
          .stats-grid { grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 24px; }
          .quick-grid { grid-template-columns: 1fr 1fr; gap: 16px; }
          .tab-bar-wrapper { position: static; padding: 0; margin-bottom: 24px; }
          .tab-bar { width: fit-content; }
          .two-col-grid { grid-template-columns: 1fr 1fr; gap: 16px; }
          .three-one-grid { grid-template-columns: 3fr 1fr; gap: 16px; }
          .one-two-grid { grid-template-columns: 1fr 2fr; gap: 16px; }
          .edit-btns { flex-direction: row; width: auto; }
          .edit-btns button { width: auto; }
          .profile-card { padding: 28px; }
          .inactive-banner { flex-direction: row !important; }
          .profile-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (min-width: 1024px) {
          .db-header { padding: 0 32px; }
          .db-container { padding: 32px 24px; max-width: 1100px; margin: 0 auto; }
          .profile-card { padding: 32px; }
        }
      `}</style>

      <div className="db-header">
        <a href="/" style={{ textDecoration: "none", fontFamily: "'Playfair Display', serif", fontSize: "1.25rem", fontWeight: 700 }}>
          <span style={{ color: "white" }}>Kita</span><span style={{ color: "#4ADE80" }}>Bridge</span>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span className="db-header-name" style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.82rem" }}>{arbeitgeber?.einrichtung_name}</span>
          <button onClick={handleLogout} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "white", padding: "7px 14px", borderRadius: 8, cursor: "pointer", fontSize: "0.82rem", fontFamily: "'DM Sans', sans-serif" }}>Ausloggen</button>
        </div>
      </div>

      <div className="db-container">
        {!isAktiv && (
          <div className="inactive-banner" style={{ background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: 16, padding: 16, marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div>
              <div style={{ fontWeight: 700, color: "#92400E", marginBottom: 4, fontSize: "0.9rem" }}>âš ï¸ Konto noch nicht aktiv</div>
              <div style={{ color: "#78350F", fontSize: "0.85rem" }}>Ihr Account wird gerade geprÃ¼ft oder die Zahlung steht noch aus.</div>
            </div>
            <a href="/bezahlung" style={{ background: "#EA580C", color: "white", padding: "10px 18px", borderRadius: 10, fontWeight: 700, textDecoration: "none", fontSize: "0.88rem", whiteSpace: "nowrap", fontFamily: "'DM Sans', sans-serif" }}>Jetzt bezahlen â†’</a>
          </div>
        )}
        {isAktiv && (
          <div style={{ background: "#EAF7EF", border: "1px solid #BBF7D0", borderRadius: 14, padding: 14, marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
            <span>âœ…</span>
            <span style={{ color: GREEN, fontWeight: 700, fontSize: "0.88rem" }}>Konto aktiv â€“ Sie haben vollen Zugang zu allen FachkrÃ¤fte-Profilen</span>
          </div>
        )}
        {saveSuccess && (
          <div style={{ background: "#EAF7EF", border: "1px solid #BBF7D0", borderRadius: 12, padding: 12, marginBottom: 16, color: GREEN, fontWeight: 600, fontSize: "0.88rem" }}>âœ… Profil erfolgreich gespeichert!</div>
        )}

        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", color: NAVY, marginBottom: 4 }}>Willkommen, {arbeitgeber?.ansprech_name?.split(" ")[0] || ""}! ðŸ‘‹</h1>
          <p style={{ color: "#9BA8C0", fontSize: "0.85rem", margin: 0 }}>{arbeitgeber?.einrichtung_name} Â· {arbeitgeber?.ort}</p>
        </div>

        <div className="tab-bar-wrapper">
          <div className="tab-bar">
            {[
              { key: "uebersicht", label: "ðŸ“Š Ãœbersicht" },
              { key: "visitenkarte", label: "ðŸ‘ Visitenkarte" },
              { key: "profil", label: "ðŸ‘¤ Mein Profil" },
              { key: "fachkraefte", label: "ðŸ” FachkrÃ¤fte" },
              { key: "nachrichten", label: "ðŸ“© Nachrichten" },
            ].map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ background: activeTab === tab.key ? NAVY : "transparent", color: activeTab === tab.key ? "white" : "#6B7897" }}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "uebersicht" && (
          <div>
            <div className="stats-grid">
              {[
                { icon: "ðŸ‘¥", label: "Offene Stellen", value: arbeitgeber?.stellen_anzahl || "-" },
                { icon: "ðŸ“", label: "Standort", value: arbeitgeber?.ort || "-" },
                { icon: "ðŸ¢", label: "Einrichtungstyp", value: arbeitgeber?.einrichtungstyp || "-" },
              ].map(stat => (
                <div key={stat.label} style={{ background: "white", borderRadius: 14, padding: 16, boxShadow: "0 2px 12px rgba(26,63,111,0.08)" }}>
                  <div style={{ fontSize: "1.6rem", marginBottom: 6 }}>{stat.icon}</div>
                  <div style={{ fontSize: "0.72rem", color: "#9BA8C0", fontWeight: 700, textTransform: "uppercase", marginBottom: 3 }}>{stat.label}</div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 700, color: NAVY }}>{stat.value}</div>
                </div>
              ))}
            </div>
            <div className="quick-grid">
              <div style={{ background: "white", borderRadius: 18, padding: 20, boxShadow: "0 2px 12px rgba(26,63,111,0.08)" }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", color: NAVY, marginBottom: 14, marginTop: 0 }}>Schnellzugriff</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    { icon: "ðŸ”", label: "FachkrÃ¤fte suchen", tab: "fachkraefte" },
                    { icon: "ðŸ“©", label: "Nachrichten", tab: "nachrichten" },
                    { icon: "ðŸ‘", label: "Visitenkarte", tab: "visitenkarte" },
                    { icon: "âœï¸", label: "Profil bearbeiten", tab: "profil" },
                  ].map(item => (
                    <button key={item.tab} onClick={() => setActiveTab(item.tab)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 10, background: "#F8FAFF", border: "none", color: NAVY, fontWeight: 600, fontSize: "0.88rem", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", textAlign: "left" }}>
                      {item.icon} {item.label}
                    </button>
                  ))}
                  <a href="/kontakt" style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 10, background: "#F8FAFF", textDecoration: "none", color: NAVY, fontWeight: 600, fontSize: "0.88rem" }}>âœ‰ï¸ Support</a>
                </div>
              </div>
              <div className="plan-card" style={{ background: `linear-gradient(135deg, ${NAVY}, ${BLUE})`, borderRadius: 18, color: "white" }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", marginBottom: 10, marginTop: 0 }}>Ihr Plan</h3>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.9rem", fontWeight: 700, marginBottom: 2 }}>299 EUR</div>
                <div style={{ opacity: 0.7, fontSize: "0.8rem", marginBottom: 16 }}>pro Monat, zzgl. MwSt.</div>
                {arbeitgeber?.stripe_subscription_id && (
                  <button onClick={handleKuendigung} style={{ marginBottom: 14, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.3)", color: "white", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: "0.78rem", fontFamily: "'DM Sans', sans-serif", width: "100%" }}>Abo kÃ¼ndigen</button>
                )}
                {["Alle FachkrÃ¤fte-Profile", "Direktkontakt", "Keine Provision", "Monatlich kÃ¼ndbar"].map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7, fontSize: "0.84rem" }}>
                    <span style={{ color: "#4ADE80" }}>âœ“</span> {f}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "visitenkarte" && (
          <div style={{ background: "white", borderRadius: 18, overflow: "hidden", boxShadow: "0 2px 12px rgba(26,63,111,0.08)" }}>
            <div style={{ background: `linear-gradient(135deg, #0D1B2A 0%, ${NAVY} 60%, ${BLUE} 100%)`, padding: "28px 28px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -50, right: -50, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16, position: "relative" }}>
                <div style={{ width: 58, height: 58, borderRadius: 16, background: "rgba(255,255,255,0.12)", border: "2px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.6rem", flexShrink: 0 }}>ðŸ«</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "white", fontFamily: "'Playfair Display', serif" }}>{arbeitgeber?.einrichtung_name}</div>
                  <div style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.55)", marginTop: 2 }}>{arbeitgeber?.einrichtungstyp}</div>
                </div>
                <div style={{ background: isAktiv ? "rgba(39,174,96,0.3)" : "rgba(255,255,255,0.1)", border: `1px solid ${isAktiv ? "rgba(39,174,96,0.5)" : "rgba(255,255,255,0.2)"}`, borderRadius: 50, padding: "4px 12px", fontSize: "0.7rem", fontWeight: 800, color: "white", textTransform: "uppercase" as const, whiteSpace: "nowrap" }}>
                  {isAktiv ? "âœ“ Aktiv" : "â³ In PrÃ¼fung"}
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {arbeitgeber?.ort && <span style={{ background: "rgba(255,255,255,0.1)", borderRadius: 50, padding: "3px 11px", fontSize: "0.75rem", color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>ðŸ“ {arbeitgeber.ort}</span>}
                {arbeitgeber?.bundesland && <span style={{ background: "rgba(255,255,255,0.1)", borderRadius: 50, padding: "3px 11px", fontSize: "0.75rem", color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>ðŸ—º {arbeitgeber.bundesland}</span>}
                {arbeitgeber?.traeger && <span style={{ background: "rgba(255,255,255,0.1)", borderRadius: 50, padding: "3px 11px", fontSize: "0.75rem", color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>ðŸ¢ {arbeitgeber.traeger}</span>}
                {arbeitgeber?.stellen_anzahl && <span style={{ background: "rgba(255,255,255,0.1)", borderRadius: 50, padding: "3px 11px", fontSize: "0.75rem", color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>ðŸ’¼ {arbeitgeber.stellen_anzahl}</span>}
              </div>
            </div>
            <div style={{ padding: 20 }}>
              {arbeitgeber?.beschreibung && <p style={{ color: "#444", lineHeight: 1.75, fontSize: "0.9rem", margin: "0 0 16px" }}>{arbeitgeber.beschreibung}</p>}
              {arbeitgeber?.ansprech_name && (
                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px", background: "#F8FAFF", borderRadius: 12, marginBottom: 16 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: `linear-gradient(135deg, ${NAVY}, ${BLUE})`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 800 }}>{arbeitgeber.ansprech_name[0]}</div>
                  <div>
                    <div style={{ fontWeight: 700, color: NAVY, fontSize: "0.9rem" }}>{arbeitgeber.ansprech_name}</div>
                    {arbeitgeber.ansprech_rolle && <div style={{ fontSize: "0.78rem", color: "#9BA8C0" }}>{arbeitgeber.ansprech_rolle}</div>}
                  </div>
                </div>
              )}
              <a href={`/arbeitgeber/${arbeitgeber?.id}`} target="_blank" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 10, background: "#F0F4F9", color: NAVY, fontWeight: 600, fontSize: "0.85rem", textDecoration: "none" }}>
                ðŸ”— Ã–ffentliche Visitenkarte Ã¶ffnen â†’
              </a>
            </div>
          </div>
        )}

        {activeTab === "nachrichten" && <NachrichtenTab arbeitgeber={arbeitgeber} />}
        {activeTab === "fachkraefte" && <FachkraefteTab arbeitgeber={arbeitgeber} />}

        {activeTab === "profil" && (
          <div className="profile-card" style={{ background: "white", borderRadius: 18, boxShadow: "0 2px 12px rgba(26,63,111,0.08)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", color: NAVY, margin: 0 }}>Mein Profil</h2>
              {!editMode ? (
                <button onClick={() => setEditMode(true)} style={{ background: NAVY, color: "white", border: "none", padding: "9px 18px", borderRadius: 9, fontWeight: 700, fontSize: "0.86rem", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>âœï¸ Bearbeiten</button>
              ) : (
                <div className="edit-btns">
                  <button onClick={() => { setEditMode(false); setForm(arbeitgeber); }} style={{ background: "transparent", color: NAVY, border: `1px solid ${NAVY}`, padding: "9px 16px", borderRadius: 9, fontWeight: 700, fontSize: "0.86rem", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Abbrechen</button>
                  <button onClick={handleSave} disabled={saving} style={{ background: GREEN, color: "white", border: "none", padding: "9px 18px", borderRadius: 9, fontWeight: 700, fontSize: "0.86rem", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>{saving ? "Speichert..." : "ðŸ’¾ Speichern"}</button>
                </div>
              )}
            </div>
            {!editMode ? (
              <div className="profile-grid">
                {[
                  ["Einrichtung", arbeitgeber?.einrichtung_name], ["Einrichtungstyp", arbeitgeber?.einrichtungstyp],
                  ["TrÃ¤ger", arbeitgeber?.traeger], ["Ansprechpartner", arbeitgeber?.ansprech_name],
                  ["Rolle", arbeitgeber?.ansprech_rolle], ["E-Mail", arbeitgeber?.email],
                  ["Telefon", arbeitgeber?.telefon], ["Adresse", `${arbeitgeber?.strasse} ${arbeitgeber?.hausnummer}, ${arbeitgeber?.plz} ${arbeitgeber?.ort}`],
                  ["Bundesland", arbeitgeber?.bundesland], ["Offene Stellen", arbeitgeber?.stellen_anzahl], ["Status", arbeitgeber?.status],
                ].map(([k, v]) => v ? (
                  <div key={k} style={{ padding: "12px 0", borderBottom: "1px solid #F0F4F9" }}>
                    <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#9BA8C0", textTransform: "uppercase", marginBottom: 3 }}>{k}</div>
                    <div style={{ color: NAVY, fontWeight: 600, fontSize: "0.9rem", wordBreak: "break-word" }}>{v}</div>
                  </div>
                ) : null)}
              </div>
            ) : (
              <div>
                <div style={{ marginBottom: 6, fontWeight: 700, color: BLUE, fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: 1 }}>Einrichtung</div>
                <div style={{ height: 1, background: "#F0F4F9", marginBottom: 14 }} />
                <div style={{ marginBottom: 14 }}><label style={labelStyle}>Name der Einrichtung</label><input style={inputStyle} value={form.einrichtung_name || ""} onChange={e => set("einrichtung_name", e.target.value)} /></div>
                <div className="two-col-grid" style={{ marginBottom: 14 }}>
                  <div style={{ marginBottom: 14 }}><label style={labelStyle}>Einrichtungstyp</label><select style={selectStyle} value={form.einrichtungstyp || ""} onChange={e => set("einrichtungstyp", e.target.value)}><option value="">â€“ bitte wÃ¤hlen â€“</option>{["Krippe (0-3 Jahre)", "Kindergarten (3-6 Jahre)", "Kita (0-6 Jahre)", "Hort (6-12 Jahre)", "Integrationskita", "Waldkita", "Montessori Kita", "Betriebskita"].map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                  <div style={{ marginBottom: 14 }}><label style={labelStyle}>TrÃ¤ger</label><select style={selectStyle} value={form.traeger || ""} onChange={e => set("traeger", e.target.value)}><option value="">â€“ bitte wÃ¤hlen â€“</option>{["Ã–ffentlich (kommunal)", "AWO", "Caritas", "Diakonie", "DRK", "ParitÃ¤tischer Wohlfahrtsverband", "Privat / EigentrÃ¤ger", "Sonstiger freier TrÃ¤ger"].map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                </div>
                <div style={{ marginBottom: 14 }}><label style={labelStyle}>Beschreibung</label><textarea style={{ ...inputStyle, height: 88, resize: "vertical" }} value={form.beschreibung || ""} onChange={e => set("beschreibung", e.target.value)} /></div>
                <div style={{ marginTop: 4, marginBottom: 6, fontWeight: 700, color: BLUE, fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: 1 }}>Adresse</div>
                <div style={{ height: 1, background: "#F0F4F9", marginBottom: 14 }} />
                <div className="three-one-grid" style={{ marginBottom: 14 }}>
                  <div style={{ marginBottom: 14 }}><label style={labelStyle}>StraÃŸe</label><input style={inputStyle} value={form.strasse || ""} onChange={e => set("strasse", e.target.value)} /></div>
                  <div style={{ marginBottom: 14 }}><label style={labelStyle}>Nr.</label><input style={inputStyle} value={form.hausnummer || ""} onChange={e => set("hausnummer", e.target.value)} /></div>
                </div>
                <div className="one-two-grid" style={{ marginBottom: 14 }}>
                  <div style={{ marginBottom: 14 }}><label style={labelStyle}>PLZ</label><input style={inputStyle} value={form.plz || ""} onChange={e => set("plz", e.target.value)} /></div>
                  <div style={{ marginBottom: 14 }}><label style={labelStyle}>Ort</label><input style={inputStyle} value={form.ort || ""} onChange={e => set("ort", e.target.value)} /></div>
                </div>
                <div style={{ marginBottom: 14 }}><label style={labelStyle}>Bundesland</label><select style={selectStyle} value={form.bundesland || ""} onChange={e => set("bundesland", e.target.value)}><option value="">â€“ bitte wÃ¤hlen â€“</option>{["Baden-WÃ¼rttemberg", "Bayern", "Berlin", "Brandenburg", "Bremen", "Hamburg", "Hessen", "Mecklenburg-Vorpommern", "Niedersachsen", "Nordrhein-Westfalen", "Rheinland-Pfalz", "Saarland", "Sachsen", "Sachsen-Anhalt", "Schleswig-Holstein", "ThÃ¼ringen"].map(b => <option key={b} value={b}>{b}</option>)}</select></div>
                <div style={{ marginTop: 4, marginBottom: 6, fontWeight: 700, color: BLUE, fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: 1 }}>Ansprechpartner</div>
                <div style={{ height: 1, background: "#F0F4F9", marginBottom: 14 }} />
                <div className="two-col-grid" style={{ marginBottom: 14 }}>
                  <div style={{ marginBottom: 14 }}><label style={labelStyle}>Name</label><input style={inputStyle} value={form.ansprech_name || ""} onChange={e => set("ansprech_name", e.target.value)} /></div>
                  <div style={{ marginBottom: 14 }}><label style={labelStyle}>Rolle</label><select style={selectStyle} value={form.ansprech_rolle || ""} onChange={e => set("ansprech_rolle", e.target.value)}><option value="">â€“ bitte wÃ¤hlen â€“</option>{["Kita-Leitung", "Stellv. Leitung", "TrÃ¤ger-GeschÃ¤ftsfÃ¼hrung", "HR / Personal", "Sonstiges"].map(r => <option key={r} value={r}>{r}</option>)}</select></div>
                </div>
                <div style={{ marginBottom: 14 }}><label style={labelStyle}>Telefon</label><input style={inputStyle} value={form.telefon || ""} onChange={e => set("telefon", e.target.value)} /></div>
                <div style={{ marginBottom: 14 }}><label style={labelStyle}>Offene Stellen</label><select style={selectStyle} value={form.stellen_anzahl || ""} onChange={e => set("stellen_anzahl", e.target.value)}><option value="">â€“ bitte wÃ¤hlen â€“</option>{["1 Stelle", "2-3 Stellen", "4-5 Stellen", "6-10 Stellen", "Mehr als 10 Stellen"].map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                {saveError && <div style={{ padding: "12px 14px", background: "#FFF5F5", border: "1px solid #FED7D7", borderRadius: 10, color: "#9B1C1C", fontSize: "0.85rem", marginBottom: 14 }}>âš ï¸ {saveError}</div>}
              </div>
            )}
            <div style={{ marginTop: 28, padding: 16, background: "#FFF5F5", border: "1px solid #FED7D7", borderRadius: 12 }}>
              <div style={{ fontWeight: 700, color: "#9B1C1C", marginBottom: 6, fontSize: "0.92rem" }}>âš ï¸ Account lÃ¶schen</div>
              <div style={{ color: "#7F1D1D", fontSize: "0.83rem", marginBottom: 12 }}>Ihr Account und alle Ihre Daten werden unwiderruflich gelÃ¶scht.</div>
              <button onClick={handleDeleteAccount} style={{ background: RED, color: "white", border: "none", padding: "10px 20px", borderRadius: 8, fontWeight: 700, fontSize: "0.86rem", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", width: "100%" }}>Account unwiderruflich lÃ¶schen</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

