"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

// ── Types ──────────────────────────────────────────────────────────────────────
interface Arbeitgeber {
  id: string; email: string; einrichtung_name?: string; einrichtungstyp?: string;
  traeger?: string; beschreibung?: string; strasse?: string; hausnummer?: string;
  plz?: string; ort?: string; bundesland?: string; ansprech_name?: string;
  ansprech_rolle?: string; telefon?: string; stellen_anzahl?: string;
  status?: string; stripe_subscription_id?: string;
}
interface Fachkraft {
  id: string; username?: string; vorname?: string; nachname?: string; anonym?: boolean;
  email?: string; telefon?: string; qualifikation?: string; erfahrung_jahre?: number;
  bundesland?: string; wohnort?: string; arbeitszeit?: string; deutsch?: string;
  beschreibung?: string; verfuegbar_ab?: string; aktiv_suchend?: boolean; kita_alter?: string;
}
interface Anfrage {
  id: string; fachkraft_id: string; kita_id: string; kita_name: string;
  kita_email: string; kita_telefon?: string; nachricht?: string;
  status: "ausstehend" | "akzeptiert" | "abgelehnt"; created_at: string;
}
interface Nachricht {
  id: string; von_id: string; an_id: string; von_typ: string; nachricht: string; erstellt_am: string;
}

type Tab = "uebersicht" | "fachkraefte" | "nachrichten" | "profil" | "visitenkarte";

const C = {
  navy: "#0F2442", navyMid: "#1A3F6F", blue: "#2471A3",
  green: "#16A34A", red: "#DC2626", amber: "#D97706",
  surface: "#F7F9FC", border: "#E4EAF4", muted: "#8A96B0", text: "#1C2B4A",
};

const formatStatus = (status?: string) => {
  if (status === "bestaetigt" || status === "bestätigt") return "Bestätigt";
  if (status === "aktiv") return "Aktiv";
  if (status === "inaktiv") return "Inaktiv";
  return status;
};

const Icon = {
  home: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  search: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  chat: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  user: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  eye: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  logout: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  check: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  checkSm: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  checkLg: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  send: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  pin: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  building: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
  edit: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  trash: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
};

// ── Nachrichten Tab ────────────────────────────────────────────────────────────
function NachrichtenTab({ arbeitgeber }: { arbeitgeber: Arbeitgeber }) {
  const [nachrichten, setNachrichten] = useState<Nachricht[]>([]);
  const [akzeptierteAnfragen, setAkzeptierteAnfragen] = useState<Anfrage[]>([]);
  const [fachkraefteMap, setFachkraefteMap] = useState<Record<string, Fachkraft>>({});
  const [antwort, setAntwort] = useState<Record<string, string>>({});
  const [gesendet, setGesendet] = useState<Record<string, boolean>>({});
  const [neueNachricht, setNeueNachricht] = useState<Record<string, string>>({});
  const [neuGesendet, setNeuGesendet] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [subTab, setSubTab] = useState<"konversationen" | "neu">("konversationen");

  useEffect(() => { if (arbeitgeber?.id) loadAll(); }, [arbeitgeber]);

  const loadAll = async () => {
    const res = await fetch(`/api/nachrichten?user_id=${arbeitgeber.id}`);
    const msgs = await res.json();
    setNachrichten(msgs || []);
    const { data: anfragen } = await supabase.from("anfragen").select("*").eq("kita_id", arbeitgeber.id).eq("status", "akzeptiert");
    setAkzeptierteAnfragen(anfragen || []);
    if (anfragen && anfragen.length > 0) {
      const ids = anfragen.map((a: Anfrage) => a.fachkraft_id);
      const { data: fk } = await supabase.from("fachkraefte").select("id, vorname, nachname, username, email").in("id", ids);
      const map: Record<string, Fachkraft> = {};
      (fk || []).forEach((f: Fachkraft) => { map[f.id] = f; });
      setFachkraefteMap(map);
    }
    setLoading(false);
  };

  const getFkName = (fk?: Fachkraft) => fk ? (fk.vorname ? `${fk.vorname} ${fk.nachname || ""}`.trim() : fk.username || "Fachkraft") : "Fachkraft";

  const handleAntwort = async (partnerId: string) => {
    const text = antwort[partnerId];
    if (!text?.trim()) return;
    const fk = fachkraefteMap[partnerId];
    await fetch("/api/nachrichten", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ von_id: arbeitgeber.id, an_id: partnerId, von_typ: "arbeitgeber", nachricht: text, empfaenger_email: fk?.email || "", empfaenger_name: getFkName(fk), absender_name: arbeitgeber.einrichtung_name }),
    });
    setGesendet(p => ({ ...p, [partnerId]: true }));
    setAntwort(p => ({ ...p, [partnerId]: "" }));
    await loadAll();
    setTimeout(() => setGesendet(p => ({ ...p, [partnerId]: false })), 2000);
  };

  const handleNeueNachricht = async (fachkraftId: string) => {
    const text = neueNachricht[fachkraftId];
    if (!text?.trim()) return;
    const fk = fachkraefteMap[fachkraftId];
    await fetch("/api/nachrichten", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ von_id: arbeitgeber.id, an_id: fachkraftId, von_typ: "arbeitgeber", nachricht: text, empfaenger_email: fk?.email || "", empfaenger_name: getFkName(fk), absender_name: arbeitgeber.einrichtung_name }),
    });
    setNeuGesendet(p => ({ ...p, [fachkraftId]: true }));
    setNeueNachricht(p => ({ ...p, [fachkraftId]: "" }));
    await loadAll();
    setSubTab("konversationen");
  };

  const handleKonversationLoeschen = async (partnerId: string) => {
    if (!window.confirm("Konversation wirklich löschen?")) return;
    await supabase.from("nachrichten").delete().or(
      `and(von_id.eq.${arbeitgeber.id},an_id.eq.${partnerId}),and(von_id.eq.${partnerId},an_id.eq.${arbeitgeber.id})`
    );
    await loadAll();
  };

  const getKonversationen = () => {
    const map: Record<string, Nachricht[]> = {};
    nachrichten.forEach(msg => {
      const pid = msg.von_id === arbeitgeber.id ? msg.an_id : msg.von_id;
      if (!map[pid]) map[pid] = [];
      map[pid].push(msg);
    });
    return map;
  };

  if (loading) return <div style={{ color: C.muted, padding: 20, fontSize: "0.85rem" }}>Lädt...</div>;
  const konversationen = getKonversationen();

  return (
    <div>
      <div style={{ marginBottom: 18 }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: C.text }}>Nachrichten</h2>
        <p style={{ fontSize: "0.82rem", color: C.muted, marginTop: 3 }}>Deine Unterhaltungen mit Fachkräften.</p>
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 16, background: "white", padding: 4, borderRadius: 12, border: `1.5px solid ${C.border}` }}>
        {[{ key: "konversationen", label: "Konversationen" }, { key: "neu", label: "Neue Nachricht" }].map(t => (
          <button key={t.key} onClick={() => setSubTab(t.key as any)} style={{ flex: 1, padding: "9px 8px", borderRadius: 9, border: "none", background: subTab === t.key ? C.navyMid : "transparent", color: subTab === t.key ? "white" : C.muted, fontWeight: 700, fontSize: "0.8rem", cursor: "pointer", fontFamily: "'Sora', sans-serif" }}>
            {t.label}
          </button>
        ))}
      </div>

      {subTab === "konversationen" && (
        Object.keys(konversationen).length === 0 ? (
          <div style={{ background: "white", border: `1.5px solid ${C.border}`, borderRadius: 18, padding: "40px 24px", textAlign: "center" }}>
            <div style={{ fontSize: "2rem", marginBottom: 12 }}>📭</div>
            <div style={{ fontWeight: 700, color: C.text, marginBottom: 6 }}>Noch keine Nachrichten</div>
            <div style={{ color: C.muted, fontSize: "0.84rem" }}>Schreibe einer Fachkraft die deine Anfrage akzeptiert hat.</div>
          </div>
        ) : Object.entries(konversationen).map(([partnerId, msgs]) => {
          const fk = fachkraefteMap[partnerId];
          const name = getFkName(fk);
          const sorted = [...msgs].sort((a, b) => new Date(a.erstellt_am).getTime() - new Date(b.erstellt_am).getTime());
          return (
            <div key={partnerId} style={{ background: "white", border: `1.5px solid ${C.border}`, borderRadius: 18, padding: 18, marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, paddingBottom: 12, borderBottom: `1px solid ${C.border}` }}>
                <span style={{ fontWeight: 800, color: C.text, fontSize: "0.92rem" }}>{name}</span>
                <button onClick={() => handleKonversationLoeschen(partnerId)} style={{ display: "flex", alignItems: "center", gap: 5, background: "#FFF5F5", border: "1.5px solid #FED7D7", color: C.red, borderRadius: 8, padding: "5px 10px", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Sora', sans-serif" }}>
                  <Icon.trash />Löschen
                </button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
                {sorted.map(msg => (
                  <div key={msg.id} style={{ display: "flex", justifyContent: msg.von_id === arbeitgeber.id ? "flex-end" : "flex-start" }}>
                    <div style={{ maxWidth: "80%", padding: "10px 13px", fontSize: "0.86rem", lineHeight: 1.6, background: msg.von_id === arbeitgeber.id ? C.navyMid : "white", color: msg.von_id === arbeitgeber.id ? "white" : C.text, borderRadius: msg.von_id === arbeitgeber.id ? "16px 16px 4px 16px" : "16px 16px 16px 4px", border: msg.von_id !== arbeitgeber.id ? `1.5px solid ${C.border}` : "none" }}>
                      <div>{msg.nachricht}</div>
                      <div style={{ fontSize: "0.68rem", opacity: 0.55, marginTop: 5 }}>{new Date(msg.erstellt_am).toLocaleString("de-DE", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</div>
                    </div>
                  </div>
                ))}
              </div>
              {gesendet[partnerId] ? (
                <div style={{ color: C.green, fontWeight: 700, fontSize: "0.83rem", display: "flex", alignItems: "center", gap: 6 }}><Icon.check /> Gesendet!</div>
              ) : (
                <div style={{ display: "flex", gap: 8 }}>
                  <textarea placeholder="Antwort schreiben..." rows={2} value={antwort[partnerId] || ""} onChange={e => setAntwort(p => ({ ...p, [partnerId]: e.target.value }))} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAntwort(partnerId); } }} style={{ flex: 1, padding: "10px 13px", border: `1.5px solid ${C.border}`, borderRadius: 11, fontSize: "0.86rem", resize: "none", fontFamily: "'Sora', sans-serif", outline: "none" }} />
                  <button onClick={() => handleAntwort(partnerId)} disabled={!antwort[partnerId]?.trim()} style={{ padding: "0 16px", background: C.navyMid, color: "white", border: "none", borderRadius: 11, cursor: "pointer", opacity: !antwort[partnerId]?.trim() ? 0.4 : 1 }}>
                    <Icon.send />
                  </button>
                </div>
              )}
            </div>
          );
        })
      )}

      {subTab === "neu" && (
        akzeptierteAnfragen.length === 0 ? (
          <div style={{ background: "white", border: `1.5px solid ${C.border}`, borderRadius: 18, padding: "40px 24px", textAlign: "center" }}>
            <div style={{ fontSize: "2rem", marginBottom: 12 }}>🔒</div>
            <div style={{ fontWeight: 700, color: C.text, marginBottom: 6 }}>Keine akzeptierten Anfragen</div>
            <div style={{ color: C.muted, fontSize: "0.84rem" }}>Du kannst nur Fachkräften schreiben, die deine Anfrage akzeptiert haben.</div>
          </div>
        ) : akzeptierteAnfragen.map(anfrage => {
          const fk = fachkraefteMap[anfrage.fachkraft_id];
          const name = getFkName(fk);
          return (
            <div key={anfrage.id} style={{ background: "white", border: `1.5px solid ${C.border}`, borderRadius: 18, padding: 18, marginBottom: 12 }}>
              <div style={{ fontWeight: 800, color: C.text, marginBottom: 12 }}>{name}</div>
              {neuGesendet[anfrage.fachkraft_id] ? (
                <div style={{ color: C.green, fontWeight: 700, fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 6 }}><Icon.check /> Gesendet!</div>
              ) : (
                <div style={{ display: "flex", gap: 8 }}>
                  <textarea placeholder={`Nachricht an ${name}...`} rows={3} value={neueNachricht[anfrage.fachkraft_id] || ""} onChange={e => setNeueNachricht(p => ({ ...p, [anfrage.fachkraft_id]: e.target.value }))} style={{ flex: 1, padding: "10px 13px", border: `1.5px solid ${C.border}`, borderRadius: 11, fontSize: "0.86rem", resize: "none", fontFamily: "'Sora', sans-serif", outline: "none" }} />
                  <button onClick={() => handleNeueNachricht(anfrage.fachkraft_id)} disabled={!neueNachricht[anfrage.fachkraft_id]?.trim()} style={{ padding: "0 16px", background: C.navyMid, color: "white", border: "none", borderRadius: 11, cursor: "pointer", opacity: !neueNachricht[anfrage.fachkraft_id]?.trim() ? 0.4 : 1 }}>
                    <Icon.send />
                  </button>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

// ── Fachkräfte Tab ─────────────────────────────────────────────────────────────
function FachkraefteTab({ arbeitgeber }: { arbeitgeber: Arbeitgeber }) {
  const [fachkraefte, setFachkraefte] = useState<Fachkraft[]>([]);
  const [gesendeteAnfragen, setGesendeteAnfragen] = useState<Anfrage[]>([]);
  const [searching, setSearching] = useState(false);
  const [subTab, setSubTab] = useState<"suche" | "anfragen">("suche");
  const [filterQual, setFilterQual] = useState("");
  const [filterBundesland, setFilterBundesland] = useState("");
  const [filterArbeitszeit, setFilterArbeitszeit] = useState("");
  const [selectedFachkraft, setSelectedFachkraft] = useState<Fachkraft | null>(null);
  const [nachricht, setNachricht] = useState("");
  const [sendingAnfrage, setSendingAnfrage] = useState(false);
  const [anfrageSuccess, setAnfrageSuccess] = useState<"ok" | "bereits" | null>(null);

  useEffect(() => { loadFachkraefte(); loadGesendeteAnfragen(); }, []);

  const loadFachkraefte = async (qual = "", land = "", zeit = "") => {
    setSearching(true);
    let query = supabase.from("fachkraefte").select("id, username, vorname, nachname, anonym, email, telefon, qualifikation, erfahrung_jahre, bundesland, wohnort, arbeitszeit, deutsch, beschreibung, verfuegbar_ab, aktiv_suchend, kita_alter").eq("aktiv_suchend", true);
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

  const handleAnfrageLoeschen = async (anfrageId: string) => {
    if (!window.confirm("Anfrage wirklich löschen?")) return;
    await supabase.from("anfragen").delete().eq("id", anfrageId);
    await loadGesendeteAnfragen();
  };

  const getAnfrageStatus = (id: string) => gesendeteAnfragen.find(a => a.fachkraft_id === id)?.status;
  const hatBereitsAngefragt = (id: string) => gesendeteAnfragen.some(a => a.fachkraft_id === id);

  const handleAnfrageSenden = async () => {
    if (!selectedFachkraft) return;
    setSendingAnfrage(true);
    if (hatBereitsAngefragt(selectedFachkraft.id)) { setAnfrageSuccess("bereits"); setSendingAnfrage(false); return; }
    const { error } = await supabase.from("anfragen").insert([{
      kita_id: arbeitgeber.id, fachkraft_id: selectedFachkraft.id,
      kita_name: arbeitgeber.einrichtung_name, kita_email: arbeitgeber.email,
      kita_telefon: arbeitgeber.telefon,
      nachricht: nachricht.trim() || `Hallo! Wir sind ${arbeitgeber.einrichtung_name} und suchen eine engagierte Fachkraft.`,
      status: "ausstehend",
    }]);
    if (error) { alert("Fehler: " + error.message); setSendingAnfrage(false); return; }
    try { await fetch("/api/send-email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "neue_anfrage", data: { fachkraft_id: selectedFachkraft.id, arbeitgeber_id: arbeitgeber.id, kita_name: arbeitgeber.einrichtung_name, nachricht: nachricht.trim() } }) }); } catch {}
    await loadGesendeteAnfragen();
    setAnfrageSuccess("ok");
    setSendingAnfrage(false);
  };

  const qualifikationen = ["Staatlich anerkannte/r Erzieher/in", "Kindheitspädagoge/in", "Sozialpädagoge/in", "Heilpädagoge/in", "Kinderpflegerin / Kinderpfleger", "Sozialarbeiterin / Sozialarbeiter", "Kita-Leitung", "Sonstige pädagogische Fachkraft"];
  const bundeslaender = ["Baden-Württemberg", "Bayern", "Berlin", "Brandenburg", "Bremen", "Hamburg", "Hessen", "Mecklenburg-Vorpommern", "Niedersachsen", "Nordrhein-Westfalen", "Rheinland-Pfalz", "Saarland", "Sachsen", "Sachsen-Anhalt", "Schleswig-Holstein", "Thüringen"];
  const arbeitszeiten = ["Vollzeit", "Teilzeit", "Vollzeit & Teilzeit", "Minijob"];
  const akzeptierteAnfragen = gesendeteAnfragen.filter(a => a.status === "akzeptiert");

  const selectStyle: React.CSSProperties = { width: "100%", padding: "10px 36px 10px 13px", border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: "0.87rem", color: C.text, background: "white", outline: "none", fontFamily: "'Sora', sans-serif", appearance: "none" as any, backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238A96B0' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" };

  return (
    <div>
      <div style={{ marginBottom: 18 }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: C.text }}>Fachkräfte</h2>
        <p style={{ fontSize: "0.82rem", color: C.muted, marginTop: 3 }}>Finde passende Fachkräfte und sende Anfragen.</p>
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 16, background: "white", padding: 4, borderRadius: 12, border: `1.5px solid ${C.border}` }}>
        {[{ key: "suche", label: "Suche" }, { key: "anfragen", label: `Anfragen${akzeptierteAnfragen.length > 0 ? ` (${akzeptierteAnfragen.length})` : ""}` }].map(t => (
          <button key={t.key} onClick={() => setSubTab(t.key as any)} style={{ flex: 1, padding: "9px 8px", borderRadius: 9, border: "none", background: subTab === t.key ? C.navyMid : "transparent", color: subTab === t.key ? "white" : C.muted, fontWeight: 700, fontSize: "0.8rem", cursor: "pointer", fontFamily: "'Sora', sans-serif" }}>
            {t.label}
          </button>
        ))}
      </div>

      {subTab === "suche" && (
        <div>
          <div style={{ background: "white", border: `1.5px solid ${C.border}`, borderRadius: 16, padding: 16, marginBottom: 14 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <select value={filterQual} onChange={e => setFilterQual(e.target.value)} style={selectStyle}>
                <option value="">Alle Qualifikationen</option>
                {qualifikationen.map(q => <option key={q} value={q}>{q}</option>)}
              </select>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <select value={filterBundesland} onChange={e => setFilterBundesland(e.target.value)} style={selectStyle}>
                  <option value="">Alle Bundesländer</option>
                  {bundeslaender.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
                <select value={filterArbeitszeit} onChange={e => setFilterArbeitszeit(e.target.value)} style={selectStyle}>
                  <option value="">Alle Zeiten</option>
                  {arbeitszeiten.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <button onClick={() => loadFachkraefte(filterQual, filterBundesland, filterArbeitszeit)} disabled={searching} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "11px", background: C.navyMid, color: "white", border: "none", borderRadius: 11, fontWeight: 700, fontSize: "0.88rem", cursor: "pointer", fontFamily: "'Sora', sans-serif" }}>
                <Icon.search />{searching ? "Sucht..." : "Suchen"}
              </button>
            </div>
          </div>

          {fachkraefte.length === 0 ? (
            <div style={{ background: "white", border: `1.5px solid ${C.border}`, borderRadius: 18, padding: "40px 24px", textAlign: "center" }}>
              <div style={{ fontSize: "2rem", marginBottom: 12 }}>🔍</div>
              <div style={{ fontWeight: 700, color: C.text }}>Keine Ergebnisse</div>
              <div style={{ color: C.muted, fontSize: "0.84rem", marginTop: 6 }}>Versuche andere Filter.</div>
            </div>
          ) : fachkraefte.map(fk => {
            const anonym = fk.anonym || fk.username;
            const name = anonym ? fk.username : `${fk.vorname || ""} ${fk.nachname || ""}`.trim();
            const initials = name ? name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) : "FK";
            const status = getAnfrageStatus(fk.id);
            const bereitsAngefragt = hatBereitsAngefragt(fk.id);
            return (
              <div key={fk.id} style={{ background: "white", border: `1.5px solid ${status === "akzeptiert" ? "#A7F3D0" : C.border}`, borderRadius: 16, padding: 16, marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: anonym ? `linear-gradient(135deg, ${C.navyMid}, ${C.blue})` : "#ECFDF5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.92rem", fontWeight: 800, color: anonym ? "white" : C.green, flexShrink: 0 }}>
                    {anonym ? "?" : initials}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 800, color: C.text, fontSize: "0.92rem" }}>{name}</div>
                    {anonym && <div style={{ fontSize: "0.68rem", color: C.blue, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginTop: 1 }}>Anonym</div>}
                    <div style={{ fontSize: "0.77rem", color: C.muted, marginTop: 2 }}>{fk.qualifikation}</div>
                  </div>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 10 }}>
                  {fk.bundesland && <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: C.surface, borderRadius: 99, padding: "3px 9px", fontSize: "0.71rem", color: C.muted, fontWeight: 600 }}><Icon.pin />{fk.bundesland}</span>}
                  {fk.arbeitszeit && <span style={{ background: C.surface, borderRadius: 99, padding: "3px 9px", fontSize: "0.71rem", color: C.muted, fontWeight: 600 }}>{fk.arbeitszeit}</span>}
                  {fk.erfahrung_jahre && <span style={{ background: C.surface, borderRadius: 99, padding: "3px 9px", fontSize: "0.71rem", color: C.muted, fontWeight: 600 }}>{fk.erfahrung_jahre} Jahre</span>}
                </div>
                {fk.beschreibung && <div style={{ fontSize: "0.8rem", color: "#6B7897", lineHeight: 1.6, borderTop: `1px solid ${C.border}`, paddingTop: 10, marginBottom: 10 }}>{fk.beschreibung.length > 120 ? fk.beschreibung.slice(0, 120) + "…" : fk.beschreibung}</div>}
                {bereitsAngefragt ? (
                  <div>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 99, fontSize: "0.77rem", fontWeight: 700, background: status === "akzeptiert" ? "#ECFDF5" : status === "abgelehnt" ? C.surface : "#EFF6FF", color: status === "akzeptiert" ? C.green : status === "abgelehnt" ? C.muted : C.blue }}>
                      {status === "akzeptiert" ? <><Icon.checkSm /> Akzeptiert</> : status === "abgelehnt" ? "Abgelehnt" : "⏳ Ausstehend"}
                    </span>
                    {status === "akzeptiert" && (
                      <div style={{ marginTop: 10, padding: "12px 13px", background: "#ECFDF5", borderRadius: 11, fontSize: "0.82rem" }}>
                        <div style={{ fontWeight: 700, color: C.green, marginBottom: 5 }}>Kontaktdaten freigegeben</div>
                        {(fk.vorname || fk.nachname) && <div style={{ color: C.text, marginBottom: 3 }}>👤 {fk.vorname} {fk.nachname}</div>}
                        {fk.email && <div style={{ marginBottom: 3 }}><a href={`mailto:${fk.email}`} style={{ color: C.blue, fontWeight: 600 }}>{fk.email}</a></div>}
                        {fk.telefon && <div style={{ color: C.text }}>📞 {fk.telefon}</div>}
                      </div>
                    )}
                  </div>
                ) : (
                  <button onClick={() => { setSelectedFachkraft(fk); setNachricht(""); setAnfrageSuccess(null); }} style={{ width: "100%", padding: "10px", borderRadius: 11, border: "none", background: C.green, color: "white", fontWeight: 700, cursor: "pointer", fontFamily: "'Sora', sans-serif", fontSize: "0.86rem" }}>
                    Anfrage senden
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {subTab === "anfragen" && (
        gesendeteAnfragen.length === 0 ? (
          <div style={{ background: "white", border: `1.5px solid ${C.border}`, borderRadius: 18, padding: "40px 24px", textAlign: "center" }}>
            <div style={{ fontSize: "2rem", marginBottom: 12 }}>📤</div>
            <div style={{ fontWeight: 700, color: C.text }}>Noch keine Anfragen gesendet</div>
          </div>
        ) : gesendeteAnfragen.map(anfrage => (
          <div key={anfrage.id} style={{ background: "white", border: `1.5px solid ${anfrage.status === "akzeptiert" ? "#A7F3D0" : anfrage.status === "abgelehnt" ? C.border : "#BFDBFE"}`, borderRadius: 16, padding: 16, marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, gap: 8, flexWrap: "wrap" }}>
              <div style={{ fontWeight: 700, color: C.text, fontSize: "0.9rem" }}>Anfrage an Fachkraft</div>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 99, fontSize: "0.72rem", fontWeight: 700, background: anfrage.status === "akzeptiert" ? "#ECFDF5" : anfrage.status === "abgelehnt" ? C.surface : "#EFF6FF", color: anfrage.status === "akzeptiert" ? C.green : anfrage.status === "abgelehnt" ? C.muted : C.blue }}>
                {anfrage.status === "akzeptiert" ? <><Icon.checkSm /> Akzeptiert</> : anfrage.status === "abgelehnt" ? "Abgelehnt" : "⏳ Ausstehend"}
              </span>
            </div>
            {anfrage.nachricht && <div style={{ fontSize: "0.8rem", color: C.muted, lineHeight: 1.6, marginBottom: 8, fontStyle: "italic" }}>"{anfrage.nachricht}"</div>}
            <div style={{ fontSize: "0.72rem", color: C.muted, marginBottom: 10 }}>{new Date(anfrage.created_at).toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" })}</div>
            {anfrage.status === "akzeptiert" && (
              <div style={{ marginBottom: 10, background: "#ECFDF5", borderRadius: 10, padding: "9px 12px", fontSize: "0.79rem", color: "#065F46", fontWeight: 600 }}>
                ✓ Akzeptiert – Du kannst dieser Fachkraft jetzt im Nachrichten-Tab schreiben.
              </div>
            )}
            <button onClick={() => handleAnfrageLoeschen(anfrage.id)} style={{ display: "flex", alignItems: "center", gap: 6, width: "100%", padding: "9px", borderRadius: 10, border: "1.5px solid #FED7D7", background: "#FFF5F5", color: C.red, fontWeight: 700, fontSize: "0.8rem", cursor: "pointer", fontFamily: "'Sora', sans-serif", justifyContent: "center" }}>
              <Icon.trash />Anfrage löschen
            </button>
          </div>
        ))
      )}

      {selectedFachkraft && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,36,66,0.6)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(4px)" }} onClick={e => { if (e.target === e.currentTarget) { setSelectedFachkraft(null); setAnfrageSuccess(null); } }}>
          <div style={{ background: "white", borderRadius: "24px 24px 0 0", padding: "24px 20px 32px", width: "100%", maxWidth: 560, maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ width: 36, height: 4, background: C.border, borderRadius: 2, margin: "0 auto 20px" }} />
            {anfrageSuccess === "ok" ? (
              <div style={{ textAlign: "center", padding: "16px 0" }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#ECFDF5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", color: C.green }}><Icon.checkLg /></div>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: "1.3rem", color: C.text, marginBottom: 8 }}>Anfrage gesendet!</div>
                <div style={{ color: C.muted, fontSize: "0.84rem", marginBottom: 20 }}>Die Fachkraft wird benachrichtigt.</div>
                <button onClick={() => { setSelectedFachkraft(null); setAnfrageSuccess(null); }} style={{ width: "100%", padding: "13px", borderRadius: 12, border: "none", background: C.navyMid, color: "white", fontWeight: 700, cursor: "pointer", fontFamily: "'Sora', sans-serif" }}>Schließen</button>
              </div>
            ) : anfrageSuccess === "bereits" ? (
              <div style={{ textAlign: "center", padding: "16px 0" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: 14 }}>ℹ️</div>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: "1.2rem", color: C.text, marginBottom: 20 }}>Bereits angefragt</div>
                <button onClick={() => { setSelectedFachkraft(null); setAnfrageSuccess(null); }} style={{ width: "100%", padding: "13px", borderRadius: 12, border: "none", background: C.navyMid, color: "white", fontWeight: 700, cursor: "pointer", fontFamily: "'Sora', sans-serif" }}>Schließen</button>
              </div>
            ) : (
              <>
                <div style={{ fontSize: "0.7rem", fontWeight: 800, color: C.muted, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 12 }}>Anfrage senden an</div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18, padding: "13px", background: C.surface, borderRadius: 13 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 11, background: `linear-gradient(135deg, ${C.navyMid}, ${C.blue})`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 800, fontSize: "0.9rem", flexShrink: 0 }}>
                    {selectedFachkraft.username ? "?" : `${selectedFachkraft.vorname?.[0] || ""}${selectedFachkraft.nachname?.[0] || ""}`}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, color: C.text, fontSize: "0.9rem" }}>{selectedFachkraft.username || `${selectedFachkraft.vorname} ${selectedFachkraft.nachname}`}</div>
                    <div style={{ fontSize: "0.77rem", color: C.muted, marginTop: 2 }}>{selectedFachkraft.qualifikation}</div>
                  </div>
                </div>
                <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 8 }}>Nachricht (optional)</label>
                <textarea value={nachricht} onChange={e => setNachricht(e.target.value)} rows={4} placeholder="Stell deine Einrichtung kurz vor..." style={{ width: "100%", padding: "11px 13px", borderRadius: 11, border: `1.5px solid ${C.border}`, fontSize: "0.86rem", fontFamily: "'Sora', sans-serif", resize: "vertical", outline: "none", color: C.text, marginBottom: 14 }} />
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setSelectedFachkraft(null)} style={{ flex: 1, padding: "13px", borderRadius: 11, border: `1.5px solid ${C.border}`, background: "white", color: C.muted, fontWeight: 700, cursor: "pointer", fontFamily: "'Sora', sans-serif" }}>Abbrechen</button>
                  <button onClick={handleAnfrageSenden} disabled={sendingAnfrage} style={{ flex: 2, padding: "13px", borderRadius: 11, border: "none", background: sendingAnfrage ? C.border : C.green, color: "white", fontWeight: 700, cursor: sendingAnfrage ? "not-allowed" : "pointer", fontFamily: "'Sora', sans-serif" }}>
                    {sendingAnfrage ? "Wird gesendet..." : "Anfrage senden"}
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

// ── Main Dashboard ─────────────────────────────────────────────────────────────
export default function Dashboard() {
  const router = useRouter();
  const [arbeitgeber, setArbeitgeber] = useState<Arbeitgeber | null>(null);
  const [form, setForm] = useState<Arbeitgeber | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("uebersicht");
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => { loadDashboard(); }, []);

  const loadDashboard = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { router.push("/login"); return; }
    const { data } = await supabase.from("arbeitgeber").select("*").eq("email", session.user.email).single();
    setArbeitgeber(data); setForm(data); setLoading(false);
  };

  const handleLogout = async () => { await supabase.auth.signOut(); router.push("/login"); };
  const set = (key: keyof Arbeitgeber, value: string) => setForm(f => f ? ({ ...f, [key]: value }) : f);

  const handleSave = async () => {
    if (!form || !arbeitgeber) return;
    setSaving(true); setSaveError(""); setSaveSuccess(false);
    const { error } = await supabase.from("arbeitgeber").update({ einrichtung_name: form.einrichtung_name, einrichtungstyp: form.einrichtungstyp, traeger: form.traeger, beschreibung: form.beschreibung, strasse: form.strasse, hausnummer: form.hausnummer, plz: form.plz, ort: form.ort, bundesland: form.bundesland, ansprech_name: form.ansprech_name, ansprech_rolle: form.ansprech_rolle, telefon: form.telefon, stellen_anzahl: form.stellen_anzahl }).eq("email", arbeitgeber.email);
    setSaving(false);
    if (error) setSaveError("Fehler: " + error.message);
    else { setArbeitgeber({ ...arbeitgeber, ...form }); setEditMode(false); setSaveSuccess(true); setTimeout(() => setSaveSuccess(false), 3000); }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Sind Sie sicher? Ihr Account und alle Daten werden unwiderruflich gelöscht.")) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const res = await fetch("/api/account/delete", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: session.user.email, rolle: "arbeitgeber" }) });
    if (res.ok) { await supabase.auth.signOut(); router.push("/"); }
    else alert("Fehler beim Löschen. Bitte kontaktiere uns unter hallo@kitabridge.de");
  };

  const handleKuendigung = async () => {
    if (!window.confirm("Möchten Sie Ihr Abo wirklich kündigen?")) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const res = await fetch("/api/stripe/kuendigung", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: session.user.email }) });
    if (res.ok) { alert("Ihr Abo wurde erfolgreich gekündigt."); loadDashboard(); }
    else alert("Fehler beim Kündigen. Bitte kontaktieren Sie uns unter hallo@kitabridge.de");
  };

  const isAktiv = arbeitgeber?.status === "aktiv" || arbeitgeber?.status === "bestätigt" || arbeitgeber?.status === "bestaetigt";

  const fieldStyle: React.CSSProperties = { width: "100%", padding: "10px 13px", border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: "0.87rem", color: C.text, background: "white", outline: "none", fontFamily: "'Sora', sans-serif" };
  const selectFieldStyle: React.CSSProperties = { ...fieldStyle, appearance: "none" as any, backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238A96B0' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", paddingRight: 36 };
  const labelStyle: React.CSSProperties = { display: "block", fontSize: "0.72rem", fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 6 };

  const navItems: { key: Tab; label: string; icon: () => JSX.Element }[] = [
    { key: "uebersicht", label: "Übersicht", icon: Icon.home },
    { key: "fachkraefte", label: "Fachkräfte", icon: Icon.search },
    { key: "nachrichten", label: "Nachrichten", icon: Icon.chat },
    { key: "visitenkarte", label: "Visitenkarte", icon: Icon.eye },
    { key: "profil", label: "Profil", icon: Icon.user },
  ];

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C.surface, fontFamily: "'Sora', sans-serif" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <div style={{ width: 40, height: 40, border: `3px solid ${C.border}`, borderTopColor: C.navyMid, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <span style={{ fontSize: "0.85rem", color: C.muted, fontWeight: 600 }}>Einen Moment...</span>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: C.surface, fontFamily: "'Sora', sans-serif", display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=Fraunces:ital,wght@0,700;0,800;1,700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { -webkit-font-smoothing: antialiased; }
        input:focus, select:focus, textarea:focus { border-color: ${C.blue} !important; box-shadow: 0 0 0 3px rgba(36,113,163,0.12) !important; outline: none; }
        button { font-family: 'Sora', sans-serif; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 99px; }

        /* Desktop sidebar nav */
        .nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 10px; border: none; background: transparent; color: ${C.muted}; font-size: 0.84rem; font-weight: 600; cursor: pointer; width: 100%; text-align: left; transition: all 0.15s; }
        .nav-item:hover { background: rgba(26,63,111,0.06); color: ${C.navyMid}; }
        .nav-item.active { background: ${C.navyMid}; color: white; }
        .nav-item.active svg { stroke: white; }

        /* Bottom nav mobile */
        .bottom-nav { display: none; position: fixed; bottom: 0; left: 0; right: 0; background: white; border-top: 1.5px solid ${C.border}; z-index: 100; padding: 6px 0 env(safe-area-inset-bottom, 6px); }
        .bottom-nav-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 6px 4px; border: none; background: none; cursor: pointer; color: ${C.muted}; font-size: 0.6rem; font-weight: 700; font-family: 'Sora', sans-serif; transition: color 0.15s; }
        .bottom-nav-item.active { color: ${C.navyMid}; }
        .bottom-nav-item.active svg { stroke: ${C.navyMid}; }

        /* Desktop layout */
        .dashboard-layout { display: flex; gap: 24px; flex: 1; width: 100%; }
        .sidebar { width: 240px; flex-shrink: 0; display: flex; flex-direction: column; gap: 6px; }
        .main-content { flex: 1; min-width: 0; padding-bottom: 24px; }

        /* Mobile overrides */
        @media (max-width: 768px) {
          .sidebar { display: none; }
          .bottom-nav { display: flex; }
          .main-content { padding-bottom: 80px; }
          .dashboard-layout { padding: 16px !important; }
          .desktop-header-name { display: none; }
        }

        .quick-link { display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-radius: 12px; background: white; border: 1.5px solid ${C.border}; color: ${C.text}; font-weight: 600; font-size: 0.86rem; cursor: pointer; transition: all 0.15s; text-decoration: none; }
        .quick-link:hover { border-color: ${C.blue}; color: ${C.navyMid}; }
        .section-header { font-size: 0.7rem; font-weight: 800; color: ${C.muted}; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 14px; padding-bottom: 10px; border-bottom: 1px solid ${C.border}; }
      `}</style>

      {/* TOP NAV */}
      <header style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(247,249,252,0.95)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 2 }}>
            <span style={{ fontFamily: "'Fraunces', serif", fontSize: "1.25rem", fontWeight: 800, color: C.navy }}>Kita</span>
            <span style={{ fontFamily: "'Fraunces', serif", fontSize: "1.25rem", fontWeight: 800, color: C.green }}>Bridge</span>
          </a>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className="desktop-header-name" style={{ fontSize: "0.82rem", color: C.muted, fontWeight: 500 }}>{arbeitgeber?.einrichtung_name}</span>
            <button onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: 9, border: `1.5px solid ${C.border}`, background: "white", color: C.muted, fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" }}>
              <Icon.logout />Abmelden
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-layout" style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 20px" }}>

        {/* SIDEBAR (Desktop only) */}
        <aside className="sidebar">
          <div style={{ background: "white", border: `1.5px solid ${C.border}`, borderRadius: 18, padding: 18, marginBottom: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 13, background: `linear-gradient(135deg, ${C.navyMid}, ${C.blue})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", color: "white", flexShrink: 0 }}>🏫</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 700, color: C.text, fontSize: "0.86rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{arbeitgeber?.einrichtung_name || "Einrichtung"}</div>
                <div style={{ fontSize: "0.72rem", color: C.muted, marginTop: 1 }}>{arbeitgeber?.einrichtungstyp || "Kita"}</div>
              </div>
            </div>
            <div style={{ padding: "9px 12px", background: isAktiv ? "#ECFDF5" : "#FFFBEB", borderRadius: 10, border: `1px solid ${isAktiv ? "#A7F3D0" : "#FDE68A"}` }}>
              <div style={{ fontSize: "0.74rem", fontWeight: 800, color: isAktiv ? "#065F46" : "#92400E" }}>
                {isAktiv ? "✓ Konto aktiv" : "⏳ In Prüfung"}
              </div>
            </div>
          </div>

          <nav style={{ background: "white", border: `1.5px solid ${C.border}`, borderRadius: 18, padding: 8 }}>
            {navItems.map(item => (
              <button key={item.key} className={`nav-item${activeTab === item.key ? " active" : ""}`} onClick={() => setActiveTab(item.key)}>
                <item.icon />{item.label}
              </button>
            ))}
          </nav>

          <div style={{ background: `linear-gradient(135deg, ${C.navy}, ${C.navyMid})`, borderRadius: 16, padding: "16px 18px", marginTop: 2 }}>
            <div style={{ fontSize: "0.65rem", fontWeight: 800, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>Ihr Plan</div>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: "1.5rem", fontWeight: 800, color: "white", marginBottom: 2 }}>299 €</div>
            <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.5)", marginBottom: 14 }}>pro Monat, zzgl. MwSt.</div>
            {["Alle Profile", "Direktkontakt", "Keine Provision", "Monatlich kündbar"].map(f => (
              <div key={f} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5, fontSize: "0.76rem", color: "rgba(255,255,255,0.75)" }}>
                <span style={{ color: "#4ADE80" }}><Icon.checkSm /></span>{f}
              </div>
            ))}
            {arbeitgeber?.stripe_subscription_id && (
              <button onClick={handleKuendigung} style={{ marginTop: 12, width: "100%", padding: "8px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.6)", borderRadius: 8, fontSize: "0.74rem", fontWeight: 600, cursor: "pointer", fontFamily: "'Sora', sans-serif" }}>
                Abo kündigen
              </button>
            )}
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="main-content">

          {!isAktiv && (
            <div style={{ background: "#FFFBEB", border: "1.5px solid #FDE68A", borderRadius: 14, padding: "14px 16px", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontWeight: 800, color: "#92400E", marginBottom: 3, fontSize: "0.86rem" }}>Konto noch nicht aktiv</div>
                <div style={{ color: "#78350F", fontSize: "0.79rem" }}>Die Zahlung steht noch aus oder Ihr Account wird geprüft.</div>
              </div>
              <a href="/bezahlung" style={{ background: C.amber, color: "white", padding: "9px 16px", borderRadius: 10, fontWeight: 700, textDecoration: "none", fontSize: "0.84rem", whiteSpace: "nowrap", flexShrink: 0 }}>Jetzt bezahlen</a>
            </div>
          )}

          {/* ÜBERSICHT */}
          {activeTab === "uebersicht" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ background: `linear-gradient(135deg, ${C.navy} 0%, ${C.navyMid} 55%, #1B5E98 100%)`, borderRadius: 20, padding: "24px 22px", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: -50, right: -50, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.03)", pointerEvents: "none" }} />
                <div style={{ position: "relative" }}>
                  <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 5 }}>Willkommen zurück</div>
                  <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "1.5rem", fontWeight: 800, color: "white", lineHeight: 1.2, marginBottom: 14 }}>
                    Hallo, {arbeitgeber?.ansprech_name?.split(" ")[0] || ""}! 👋
                  </h1>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {arbeitgeber?.einrichtung_name && <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.1)", borderRadius: 99, padding: "3px 10px", fontSize: "0.71rem", color: "rgba(255,255,255,0.75)", fontWeight: 600 }}><Icon.building />{arbeitgeber.einrichtung_name}</span>}
                    {arbeitgeber?.ort && <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.1)", borderRadius: 99, padding: "3px 10px", fontSize: "0.71rem", color: "rgba(255,255,255,0.75)", fontWeight: 600 }}><Icon.pin />{arbeitgeber.ort}</span>}
                    {arbeitgeber?.stellen_anzahl && <span style={{ background: "rgba(255,255,255,0.1)", borderRadius: 99, padding: "3px 10px", fontSize: "0.71rem", color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>{arbeitgeber.stellen_anzahl} offen</span>}
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                {[
                  { label: "Typ", value: arbeitgeber?.einrichtungstyp || "–", bg: "#EFF6FF", color: C.blue },
                  { label: "Standort", value: arbeitgeber?.ort || "–", bg: "#F0FDF4", color: C.green },
                  { label: "Stellen", value: arbeitgeber?.stellen_anzahl || "–", bg: "#FFF7ED", color: C.amber },
                ].map(s => (
                  <div key={s.label} style={{ background: s.bg, borderRadius: 14, padding: "14px 12px" }}>
                    <div style={{ fontSize: "0.88rem", fontWeight: 800, color: s.color, marginBottom: 3, wordBreak: "break-word" }}>{s.value}</div>
                    <div style={{ fontSize: "0.67rem", color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>{s.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <button className="quick-link" onClick={() => setActiveTab("fachkraefte")}><span style={{ color: C.blue }}><Icon.search /></span>Fachkräfte</button>
                <button className="quick-link" onClick={() => setActiveTab("nachrichten")}><span style={{ color: C.navyMid }}><Icon.chat /></span>Nachrichten</button>
                <button className="quick-link" onClick={() => setActiveTab("visitenkarte")}><span style={{ color: C.green }}><Icon.eye /></span>Visitenkarte</button>
                <button className="quick-link" onClick={() => setActiveTab("profil")}><span style={{ color: C.muted }}><Icon.edit /></span>Profil</button>
              </div>

              
            </div>
          )}

          {activeTab === "fachkraefte" && <FachkraefteTab arbeitgeber={arbeitgeber!} />}
          {activeTab === "nachrichten" && <NachrichtenTab arbeitgeber={arbeitgeber!} />}

          {/* VISITENKARTE */}
          {activeTab === "visitenkarte" && (
            <div>
              <div style={{ marginBottom: 18 }}>
                <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: C.text }}>Visitenkarte</h2>
                <p style={{ fontSize: "0.82rem", color: C.muted, marginTop: 3 }}>So sehen Fachkräfte Ihre Einrichtung.</p>
              </div>
              <div style={{ background: "white", border: `1.5px solid ${C.border}`, borderRadius: 18, overflow: "hidden" }}>
                <div style={{ background: `linear-gradient(135deg, ${C.navy} 0%, ${C.navyMid} 55%, #1B5E98 100%)`, padding: "24px 22px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(255,255,255,0.12)", border: "2px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", flexShrink: 0 }}>🏫</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "white", fontFamily: "'Fraunces', serif" }}>{arbeitgeber?.einrichtung_name}</div>
                      <div style={{ fontSize: "0.79rem", color: "rgba(255,255,255,0.55)", marginTop: 2 }}>{arbeitgeber?.einrichtungstyp}</div>
                    </div>
                    <span style={{ background: isAktiv ? "rgba(22,163,74,0.25)" : "rgba(255,255,255,0.1)", border: `1px solid ${isAktiv ? "rgba(22,163,74,0.4)" : "rgba(255,255,255,0.2)"}`, borderRadius: 99, padding: "3px 10px", fontSize: "0.68rem", fontWeight: 800, color: "white", whiteSpace: "nowrap" }}>
                      {isAktiv ? "✓ Aktiv" : "⏳ Prüfung"}
                    </span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {arbeitgeber?.ort && <span style={{ background: "rgba(255,255,255,0.1)", borderRadius: 99, padding: "3px 10px", fontSize: "0.72rem", color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>📍 {arbeitgeber.ort}</span>}
                    {arbeitgeber?.bundesland && <span style={{ background: "rgba(255,255,255,0.1)", borderRadius: 99, padding: "3px 10px", fontSize: "0.72rem", color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>{arbeitgeber.bundesland}</span>}
                    {arbeitgeber?.traeger && <span style={{ background: "rgba(255,255,255,0.1)", borderRadius: 99, padding: "3px 10px", fontSize: "0.72rem", color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>{arbeitgeber.traeger}</span>}
                    {arbeitgeber?.stellen_anzahl && <span style={{ background: "rgba(255,255,255,0.1)", borderRadius: 99, padding: "3px 10px", fontSize: "0.72rem", color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>💼 {arbeitgeber.stellen_anzahl}</span>}
                  </div>
                </div>
                <div style={{ padding: 20 }}>
                  {arbeitgeber?.beschreibung && <p style={{ color: "#4B5563", lineHeight: 1.75, fontSize: "0.88rem", marginBottom: 18 }}>{arbeitgeber.beschreibung}</p>}
                  {arbeitgeber?.ansprech_name && (
                    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 13, background: C.surface, borderRadius: 12 }}>
                      <div style={{ width: 38, height: 38, borderRadius: 10, background: `linear-gradient(135deg, ${C.navyMid}, ${C.blue})`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 800, flexShrink: 0 }}>{arbeitgeber.ansprech_name[0]}</div>
                      <div>
                        <div style={{ fontWeight: 700, color: C.text, fontSize: "0.86rem" }}>{arbeitgeber.ansprech_name}</div>
                        {arbeitgeber.ansprech_rolle && <div style={{ fontSize: "0.74rem", color: C.muted }}>{arbeitgeber.ansprech_rolle}</div>}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* PROFIL */}
          {activeTab === "profil" && form && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <div>
                  <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: C.text }}>Mein Profil</h2>
                  <p style={{ fontSize: "0.82rem", color: C.muted, marginTop: 3 }}>Informationen zu Ihrer Einrichtung.</p>
                </div>
                {!editMode ? (
                  <button onClick={() => setEditMode(true)} style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 14px", borderRadius: 10, border: `1.5px solid ${C.border}`, background: "white", color: C.text, fontWeight: 700, fontSize: "0.82rem", cursor: "pointer" }}>
                    <Icon.edit />Bearbeiten
                  </button>
                ) : (
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => { setEditMode(false); setForm(arbeitgeber); }} style={{ padding: "8px 12px", borderRadius: 10, border: `1.5px solid ${C.border}`, background: "white", color: C.muted, fontWeight: 700, fontSize: "0.82rem", cursor: "pointer" }}>Abbrechen</button>
                    <button onClick={handleSave} disabled={saving} style={{ padding: "8px 14px", borderRadius: 10, border: "none", background: C.green, color: "white", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer" }}>{saving ? "..." : "Speichern"}</button>
                  </div>
                )}
              </div>

              {saveSuccess && <div style={{ padding: "12px 15px", background: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: 10, color: "#065F46", fontSize: "0.84rem", fontWeight: 600, marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}><Icon.check />Profil erfolgreich gespeichert!</div>}

              <div style={{ background: "white", border: `1.5px solid ${C.border}`, borderRadius: 18, padding: 20 }}>
                {!editMode ? (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
                    {([["Einrichtung", arbeitgeber?.einrichtung_name], ["Einrichtungstyp", arbeitgeber?.einrichtungstyp], ["Träger", arbeitgeber?.traeger], ["Ansprechpartner", arbeitgeber?.ansprech_name], ["Rolle", arbeitgeber?.ansprech_rolle], ["E-Mail", arbeitgeber?.email], ["Telefon", arbeitgeber?.telefon], ["Adresse", `${arbeitgeber?.strasse || ""} ${arbeitgeber?.hausnummer || ""}, ${arbeitgeber?.plz || ""} ${arbeitgeber?.ort || ""}`], ["Bundesland", arbeitgeber?.bundesland], ["Offene Stellen", arbeitgeber?.stellen_anzahl], ["Status", formatStatus(arbeitgeber?.status)]] as [string, string | undefined][]).filter(([, v]) => v).map(([k, v]) => (
                      <div key={k} style={{ padding: "12px 0", borderBottom: `1px solid ${C.border}` }}>
                        <div style={{ fontSize: "0.68rem", fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 3 }}>{k}</div>
                        <div style={{ color: C.text, fontWeight: 600, fontSize: "0.85rem", wordBreak: "break-word" }}>{v}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <div className="section-header">Einrichtung</div>
                    <div><label style={labelStyle}>Name der Einrichtung</label><input style={fieldStyle} value={form.einrichtung_name || ""} onChange={e => set("einrichtung_name", e.target.value)} /></div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      <div><label style={labelStyle}>Einrichtungstyp</label><select style={selectFieldStyle} value={form.einrichtungstyp || ""} onChange={e => set("einrichtungstyp", e.target.value)}><option value="">– wählen –</option>{["Krippe (0-3 Jahre)", "Kindergarten (3-6 Jahre)", "Kita (0-6 Jahre)", "Hort (6-12 Jahre)", "Integrationskita", "Waldkita", "Montessori Kita", "Betriebskita"].map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                      <div><label style={labelStyle}>Träger</label><select style={selectFieldStyle} value={form.traeger || ""} onChange={e => set("traeger", e.target.value)}><option value="">– wählen –</option>{["Öffentlich (kommunal)", "AWO", "Caritas", "Diakonie", "DRK", "Paritätischer Wohlfahrtsverband", "Privat / Eigenträger", "Sonstiger freier Träger"].map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                    </div>
                    <div><label style={labelStyle}>Beschreibung</label><textarea style={{ ...fieldStyle, resize: "vertical" }} rows={4} value={form.beschreibung || ""} onChange={e => set("beschreibung", e.target.value)} /></div>

                    <div className="section-header" style={{ marginTop: 4 }}>Adresse</div>
                    <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr", gap: 10 }}>
                      <div><label style={labelStyle}>Straße</label><input style={fieldStyle} value={form.strasse || ""} onChange={e => set("strasse", e.target.value)} /></div>
                      <div><label style={labelStyle}>Nr.</label><input style={fieldStyle} value={form.hausnummer || ""} onChange={e => set("hausnummer", e.target.value)} /></div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 10 }}>
                      <div><label style={labelStyle}>PLZ</label><input style={fieldStyle} value={form.plz || ""} onChange={e => set("plz", e.target.value)} /></div>
                      <div><label style={labelStyle}>Ort</label><input style={fieldStyle} value={form.ort || ""} onChange={e => set("ort", e.target.value)} /></div>
                    </div>
                    <div><label style={labelStyle}>Bundesland</label><select style={selectFieldStyle} value={form.bundesland || ""} onChange={e => set("bundesland", e.target.value)}><option value="">– wählen –</option>{["Baden-Württemberg","Bayern","Berlin","Brandenburg","Bremen","Hamburg","Hessen","Mecklenburg-Vorpommern","Niedersachsen","Nordrhein-Westfalen","Rheinland-Pfalz","Saarland","Sachsen","Sachsen-Anhalt","Schleswig-Holstein","Thüringen"].map(b => <option key={b} value={b}>{b}</option>)}</select></div>

                    <div className="section-header" style={{ marginTop: 4 }}>Ansprechpartner</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      <div><label style={labelStyle}>Name</label><input style={fieldStyle} value={form.ansprech_name || ""} onChange={e => set("ansprech_name", e.target.value)} /></div>
                      <div><label style={labelStyle}>Rolle</label><select style={selectFieldStyle} value={form.ansprech_rolle || ""} onChange={e => set("ansprech_rolle", e.target.value)}><option value="">– wählen –</option>{["Kita-Leitung","Stellv. Leitung","Träger-Geschäftsführung","HR / Personal","Sonstiges"].map(r => <option key={r} value={r}>{r}</option>)}</select></div>
                    </div>
                    <div><label style={labelStyle}>Telefon</label><input style={fieldStyle} value={form.telefon || ""} onChange={e => set("telefon", e.target.value)} /></div>
                    <div><label style={labelStyle}>Offene Stellen</label><select style={selectFieldStyle} value={form.stellen_anzahl || ""} onChange={e => set("stellen_anzahl", e.target.value)}><option value="">– wählen –</option>{["1 Stelle","2-3 Stellen","4-5 Stellen","6-10 Stellen","Mehr als 10 Stellen"].map(s => <option key={s} value={s}>{s}</option>)}</select></div>

                    {saveError && <div style={{ padding: "12px 15px", background: "#FFF5F5", border: "1px solid #FED7D7", borderRadius: 10, color: "#9B1C1C", fontSize: "0.84rem" }}>{saveError}</div>}
                  </div>
                )}

                <div style={{ marginTop: 24, padding: 18, background: "#FFF5F5", border: "1.5px solid #FED7D7", borderRadius: 14 }}>
                  <div style={{ fontWeight: 800, color: "#9B1C1C", marginBottom: 6, fontSize: "0.9rem" }}>Account löschen</div>
                  <div style={{ color: "#7F1D1D", fontSize: "0.79rem", lineHeight: 1.65, marginBottom: 12 }}>Ihr Account und alle Daten werden unwiderruflich gelöscht.</div>
                  <button onClick={handleDeleteAccount} style={{ background: C.red, color: "white", border: "none", padding: "11px 20px", borderRadius: 10, fontWeight: 700, fontSize: "0.84rem", cursor: "pointer", fontFamily: "'Sora', sans-serif", width: "100%" }}>Account unwiderruflich löschen</button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* BOTTOM NAV (Mobile only) */}
      <nav className="bottom-nav">
        {navItems.map(item => (
          <button key={item.key} className={`bottom-nav-item${activeTab === item.key ? " active" : ""}`} onClick={() => setActiveTab(item.key)}>
            <item.icon />
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}