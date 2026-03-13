"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface Fachkraft {
  id: string; email: string; username?: string; vorname?: string; nachname?: string;
  telefon?: string; wohnort?: string; bundesland?: string; qualifikation?: string;
  zusatzqualifikation?: string; uniabschluss?: string; deutsch?: string; englisch?: string;
  weitere_sprachen?: string; erfahrung_jahre?: number; kita_alter?: string;
  beschreibung?: string; verfuegbar_ab?: string; arbeitszeit?: string;
  aktiv_suchend?: boolean; status?: string;
}
interface Anfrage {
  id: string; fachkraft_id: string; kita_email: string; kita_name: string;
  nachricht?: string; status: "ausstehend" | "akzeptiert" | "abgelehnt"; created_at: string;
}
interface Nachricht {
  id: string; von_id: string; an_id: string; von_typ: string; nachricht: string; erstellt_am: string;
}

type Tab = "uebersicht" | "anfragen" | "nachrichten" | "profil" | "konto";

const C = {
  navy: "#0F2442", navyMid: "#1A3F6F", blue: "#2471A3", blueLight: "#3B8FCC",
  green: "#16A34A", greenLight: "#22C55E", red: "#DC2626", amber: "#D97706",
  surface: "#F7F9FC", border: "#E4EAF4", muted: "#8A96B0", text: "#1C2B4A",
};

const Icon = {
  home: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  inbox: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>,
  chat: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  user: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  settings: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>,
  logout: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  check: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  x: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  send: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  shield: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  pin: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  clock: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  zap: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  flag: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>,
};

export default function FachkraftDashboard() {
  const router = useRouter();
  const [fachkraft, setFachkraft] = useState<Fachkraft | null>(null);
  const [loading, setLoading] = useState(true);
  const [anfragen, setAnfragen] = useState<Anfrage[]>([]);
  const [anfrageLoading, setAnfrageLoading] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("uebersicht");
  const [form, setForm] = useState<Fachkraft | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [nachrichten, setNachrichten] = useState<Nachricht[]>([]);
  const [arbeitgeberMap, setArbeitgeberMap] = useState<Record<string, any>>({});
  const [antwort, setAntwort] = useState<Record<string, string>>({});
  const [sendingMsg, setSendingMsg] = useState<string | null>(null);
  const [msgSent, setMsgSent] = useState<Record<string, boolean>>({});
  const [meldungModal, setMeldungModal] = useState<{ partnerId: string; partnerName: string } | null>(null);
  const [meldungText, setMeldungText] = useState("");
  const [meldungGesendet, setMeldungGesendet] = useState(false);
  const [meldungSending, setMeldungSending] = useState(false);

  useEffect(() => { loadDashboard(); }, []);

  const loadDashboard = async () => {
    let session = (await supabase.auth.getSession()).data.session;
    if (!session) {
      await new Promise(r => setTimeout(r, 800));
      session = (await supabase.auth.getSession()).data.session;
    }
    if (!session) { router.push("/login?rolle=fachkraft"); return; }
    const { data } = await supabase.from("fachkraefte").select("*").eq("email", session.user.email).single();
    if (!data) { router.push("/login?rolle=fachkraft"); return; }
    setFachkraft(data); setForm(data); setLoading(false);
    loadAnfragen(data.id); loadNachrichten(data.id);
  };

  const loadAnfragen = async (id: string) => {
    const { data } = await supabase.from("anfragen").select("*").eq("fachkraft_id", id).order("created_at", { ascending: false });
    setAnfragen(data || []);
  };

  const loadNachrichten = async (fachkraftId: string) => {
    const res = await fetch(`/api/nachrichten?user_id=${fachkraftId}`);
    const msgs = await res.json();
    setNachrichten(msgs || []);
    const ids = [...new Set((msgs || []).map((m: Nachricht) => m.von_id === fachkraftId ? m.an_id : m.von_id))].filter(id => id !== fachkraftId) as string[];
    if (ids.length > 0) {
      const { data: ag } = await supabase.from("arbeitgeber").select("id, einrichtung_name, email").in("id", ids);
      const map: Record<string, any> = {};
      (ag || []).forEach((a: any) => { map[a.id] = a; });
      setArbeitgeberMap(map);
    }
  };

  const handleAnfrage = async (anfrageId: string, action: "akzeptiert" | "abgelehnt") => {
    setAnfrageLoading(anfrageId);
    await supabase.from("anfragen").update({ status: action }).eq("id", anfrageId);
    const anfrage = anfragen.find(a => a.id === anfrageId);
    if (anfrage && action === "akzeptiert" && fachkraft) {
      await fetch("/api/send-email", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "anfrage_akzeptiert", data: { kita_email: anfrage.kita_email, kita_name: anfrage.kita_name, fachkraft_name: `${fachkraft.vorname || fachkraft.username} ${fachkraft.nachname || ""}`.trim(), fachkraft_email: fachkraft.email, fachkraft_telefon: fachkraft.telefon } }),
      });
    }
    await loadAnfragen(fachkraft!.id);
    setAnfrageLoading(null);
  };

  const handleAntwort = async (partnerId: string) => {
    const text = antwort[partnerId];
    if (!text?.trim() || !fachkraft) return;
    setSendingMsg(partnerId);
    const ag = arbeitgeberMap[partnerId];
    await fetch("/api/nachrichten", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ von_id: fachkraft.id, an_id: partnerId, von_typ: "fachkraft", nachricht: text, empfaenger_email: ag?.email || "", empfaenger_name: ag?.einrichtung_name || "Einrichtung", absender_name: fachkraft.vorname || fachkraft.username || "Fachkraft" }),
    });
    setAntwort(prev => ({ ...prev, [partnerId]: "" }));
    setMsgSent(prev => ({ ...prev, [partnerId]: true }));
    setTimeout(() => setMsgSent(prev => ({ ...prev, [partnerId]: false })), 2000);
    setSendingMsg(null);
    await loadNachrichten(fachkraft.id);
  };

  const handleMeldungSenden = async () => {
    if (!meldungModal || !fachkraft) return;
    setMeldungSending(true);
    await fetch("/api/send-email", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "missbrauch_meldung", data: { melder_email: fachkraft.email, melder_name: fachkraft.vorname || fachkraft.username || "Fachkraft", verdaechtige_kita: meldungModal.partnerName, verdaechtige_kita_id: meldungModal.partnerId, beschreibung: meldungText } }),
    });
    setMeldungSending(false);
    setMeldungGesendet(true);
    setMeldungText("");
  };

  const handleSave = async () => {
    if (!form || !fachkraft) return;
    setSaving(true); setSaveError(""); setSaveSuccess(false);
    const { error } = await supabase.from("fachkraefte").update({
      vorname: form.vorname, nachname: form.nachname, telefon: form.telefon, wohnort: form.wohnort,
      bundesland: form.bundesland, qualifikation: form.qualifikation, zusatzqualifikation: form.zusatzqualifikation,
      uniabschluss: form.uniabschluss, deutsch: form.deutsch, englisch: form.englisch,
      weitere_sprachen: form.weitere_sprachen, erfahrung_jahre: form.erfahrung_jahre,
      kita_alter: form.kita_alter, beschreibung: form.beschreibung,
      verfuegbar_ab: form.verfuegbar_ab, arbeitszeit: form.arbeitszeit,
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

  const offeneAnfragen = anfragen.filter(a => a.status === "ausstehend");
  const bearbeiteteAnfragen = anfragen.filter(a => a.status !== "ausstehend");
  const displayName = fachkraft?.vorname && fachkraft?.nachname ? `${fachkraft.vorname} ${fachkraft.nachname}` : fachkraft?.username || "Fachkraft";
  const initials = fachkraft?.vorname && fachkraft?.nachname ? `${fachkraft.vorname[0]}${fachkraft.nachname[0]}`.toUpperCase() : (fachkraft?.username?.[0] || "F").toUpperCase();

  const getKonversationen = () => {
    if (!fachkraft) return {} as Record<string, Nachricht[]>;
    const map: Record<string, Nachricht[]> = {};
    nachrichten.forEach(msg => {
      const pid = msg.von_id === fachkraft.id ? msg.an_id : msg.von_id;
      if (!map[pid]) map[pid] = [];
      map[pid].push(msg);
    });
    return map;
  };
  const konversationen = getKonversationen();
  const ungelesene = nachrichten.filter(m => m.von_id !== fachkraft?.id && m.von_typ === "arbeitgeber").length;

  const navItems: { key: Tab; label: string; icon: () => JSX.Element; badge?: number }[] = [
    { key: "uebersicht", label: "Übersicht", icon: Icon.home },
    { key: "anfragen", label: "Anfragen", icon: Icon.inbox, badge: offeneAnfragen.length || undefined },
    { key: "nachrichten", label: "Nachrichten", icon: Icon.chat, badge: ungelesene || undefined },
    { key: "profil", label: "Mein Profil", icon: Icon.user },
    { key: "konto", label: "Konto", icon: Icon.settings },
  ];

  const Field = ({ label, name, type = "text", options }: { label: string; name: keyof Fachkraft; type?: string; options?: string[] }) => (
    <div>
      <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 6 }}>{label}</label>
      {options ? (
        <select value={(form as any)?.[name] || ""} onChange={e => setForm(f => ({ ...f!, [name]: e.target.value }))} style={fieldStyle}>
          <option value="">— Bitte wählen —</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} value={(form as any)?.[name] || ""} onChange={e => setForm(f => ({ ...f!, [name]: e.target.value }))} style={fieldStyle} />
      )}
    </div>
  );

  const fieldStyle: React.CSSProperties = {
    width: "100%", padding: "10px 13px", border: `1.5px solid ${C.border}`,
    borderRadius: 10, fontSize: "0.88rem", color: C.text, background: "white",
    outline: "none", fontFamily: "inherit", appearance: "none" as any,
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C.surface, fontFamily: "'Sora', sans-serif" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <div style={{ width: 40, height: 40, border: `3px solid ${C.border}`, borderTopColor: C.navyMid, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <span style={{ fontSize: "0.85rem", color: C.muted, fontWeight: 600 }}>Einen Moment...</span>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
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
        select { -webkit-appearance: none; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238A96B0' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; padding-right: 36px !important; }
        ::-webkit-scrollbar { width: 4px; height: 4px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 99px; }
        .nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 10px; border: none; background: transparent; color: ${C.muted}; font-size: 0.84rem; font-weight: 600; cursor: pointer; width: 100%; text-align: left; transition: all 0.15s; position: relative; }
        .nav-item:hover { background: rgba(26,63,111,0.06); color: ${C.navyMid}; }
        .nav-item.active { background: ${C.navyMid}; color: white; }
        .nav-item.active svg { stroke: white; }
        .badge { min-width: 18px; height: 18px; border-radius: 9px; padding: 0 5px; font-size: 0.65rem; font-weight: 800; display: flex; align-items: center; justify-content: center; background: #EF4444; color: white; margin-left: auto; }
        .nav-item.active .badge { background: rgba(255,255,255,0.25); }
        .stat-box { background: white; border: 1.5px solid ${C.border}; border-radius: 16px; padding: 20px; flex: 1; }
        .anfrage-card { background: white; border: 1.5px solid ${C.border}; border-radius: 16px; padding: 22px; margin-bottom: 12px; transition: box-shadow 0.2s; }
        .anfrage-card:hover { box-shadow: 0 4px 20px rgba(15,36,66,0.08); }
        .btn-primary { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 20px; background: ${C.navyMid}; color: white; border: none; border-radius: 11px; font-weight: 700; font-size: 0.88rem; cursor: pointer; transition: all 0.15s; width: 100%; }
        .btn-primary:hover { background: ${C.navy}; }
        .btn-primary:disabled { background: ${C.border}; color: ${C.muted}; cursor: not-allowed; }
        .btn-ghost { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 20px; background: white; color: ${C.text}; border: 1.5px solid ${C.border}; border-radius: 11px; font-weight: 600; font-size: 0.88rem; cursor: pointer; transition: all 0.15s; width: 100%; }
        .btn-ghost:hover { border-color: #C0CCDF; background: ${C.surface}; }
        .btn-green { background: ${C.green}; color: white; border: none; border-radius: 11px; padding: 11px 20px; font-weight: 700; font-size: 0.85rem; cursor: pointer; flex: 1; transition: all 0.15s; font-family: 'Sora', sans-serif; }
        .btn-green:hover { background: #15803D; }
        .msg-bubble-me { background: ${C.navyMid}; color: white; border-radius: 16px 16px 4px 16px; }
        .msg-bubble-them { background: white; color: ${C.text}; border-radius: 16px 16px 16px 4px; border: 1.5px solid ${C.border}; }
        .toggle-track { width: 48px; height: 26px; border-radius: 13px; cursor: pointer; position: relative; transition: background 0.3s; flex-shrink: 0; }
        .toggle-thumb { position: absolute; top: 3px; width: 20px; height: 20px; border-radius: 50%; background: white; box-shadow: 0 1px 4px rgba(0,0,0,0.2); transition: left 0.25s cubic-bezier(.4,0,.2,1); }
        .quick-link { display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-radius: 12px; background: white; border: 1.5px solid ${C.border}; text-decoration: none; color: ${C.text}; font-weight: 600; font-size: 0.86rem; cursor: pointer; transition: all 0.15s; }
        .quick-link:hover { border-color: ${C.blue}; color: ${C.navyMid}; }
        .chip { display: inline-flex; align-items: center; gap: 5px; padding: 4px 12px; border-radius: 99px; font-size: 0.73rem; font-weight: 600; }
        @media (max-width: 768px) { .sidebar { display: none !important; } .main-content { margin-left: 0 !important; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.4} }
      `}</style>

      <header style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(247,249,252,0.9)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 2 }}>
            <span style={{ fontFamily: "'Fraunces', serif", fontSize: "1.3rem", fontWeight: 800, color: C.navy }}>Kita</span>
            <span style={{ fontFamily: "'Fraunces', serif", fontSize: "1.3rem", fontWeight: 800, color: C.green }}>Bridge</span>
          </a>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {offeneAnfragen.length > 0 && (
              <div style={{ background: "#FEF3C7", color: C.amber, border: "1px solid #FDE68A", borderRadius: 99, padding: "3px 10px", fontSize: "0.72rem", fontWeight: 800 }}>
                {offeneAnfragen.length} neue Anfrage{offeneAnfragen.length > 1 ? "n" : ""}
              </div>
            )}
            <button onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 9, border: `1.5px solid ${C.border}`, background: "white", color: C.muted, fontSize: "0.82rem", fontWeight: 600, cursor: "pointer" }}>
              <Icon.logout />Abmelden
            </button>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px", display: "flex", gap: 24, flex: 1, width: "100%" }}>

        <aside className="sidebar" style={{ width: 240, flexShrink: 0, display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ background: "white", border: `1.5px solid ${C.border}`, borderRadius: 18, padding: 20, marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <div style={{ width: 46, height: 46, borderRadius: 14, background: `linear-gradient(135deg, ${C.navyMid}, ${C.blue})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", fontWeight: 800, color: "white", flexShrink: 0 }}>{initials}</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 700, color: C.text, fontSize: "0.9rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{displayName}</div>
                <div style={{ fontSize: "0.73rem", color: C.muted, marginTop: 1 }}>{fachkraft?.qualifikation || "Fachkraft"}</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", background: C.surface, borderRadius: 10 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: C.text }}>Aktiv auf Suche</div>
                <div style={{ fontSize: "0.68rem", color: C.muted, marginTop: 1 }}>{fachkraft?.aktiv_suchend ? "Sichtbar für Kitas" : "Nicht sichtbar"}</div>
              </div>
              <div className="toggle-track" style={{ background: fachkraft?.aktiv_suchend ? C.green : C.border }} onClick={async () => {
                if (!fachkraft) return;
                const neu = !fachkraft.aktiv_suchend;
                await supabase.from("fachkraefte").update({ aktiv_suchend: neu }).eq("email", fachkraft.email);
                setFachkraft({ ...fachkraft, aktiv_suchend: neu });
              }}>
                <div className="toggle-thumb" style={{ left: fachkraft?.aktiv_suchend ? 25 : 3 }} />
              </div>
            </div>
          </div>
          <nav style={{ background: "white", border: `1.5px solid ${C.border}`, borderRadius: 18, padding: 8 }}>
            {navItems.map(item => (
              <button key={item.key} className={`nav-item${activeTab === item.key ? " active" : ""}`} onClick={() => setActiveTab(item.key)}>
                <item.icon />{item.label}
                {item.badge ? <span className="badge">{item.badge}</span> : null}
              </button>
            ))}
          </nav>
          <div style={{ padding: "12px 14px", borderRadius: 12, background: fachkraft?.status === "bestaetigt" ? "#ECFDF5" : "#FFF8ED", border: `1px solid ${fachkraft?.status === "bestaetigt" ? "#A7F3D0" : "#FDE68A"}`, display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
            <div style={{ color: fachkraft?.status === "bestaetigt" ? C.green : C.amber }}>
              {fachkraft?.status === "bestaetigt" ? <Icon.shield /> : <Icon.clock />}
            </div>
            <div>
              <div style={{ fontSize: "0.73rem", fontWeight: 800, color: fachkraft?.status === "bestaetigt" ? "#065F46" : "#92400E" }}>{fachkraft?.status === "bestaetigt" ? "Verifiziert" : "In Prüfung"}</div>
              <div style={{ fontSize: "0.66rem", color: C.muted, marginTop: 1 }}>{fachkraft?.status === "bestaetigt" ? "Profil bestätigt" : "Wird geprüft"}</div>
            </div>
          </div>
        </aside>

        <main className="main-content" style={{ flex: 1, minWidth: 0 }}>

          {/* ── ÜBERSICHT ── */}
          {activeTab === "uebersicht" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ background: `linear-gradient(135deg, ${C.navy} 0%, ${C.navyMid} 55%, #1B5E98 100%)`, borderRadius: 22, padding: "28px 30px", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: -60, right: -60, width: 220, height: 220, borderRadius: "50%", background: "rgba(255,255,255,0.03)", pointerEvents: "none" }} />
                <div style={{ position: "relative" }}>
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>Willkommen zurück</div>
                  <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "1.7rem", fontWeight: 800, color: "white", lineHeight: 1.15, marginBottom: 16 }}>
                    Hallo, {fachkraft?.vorname || fachkraft?.username || "Fachkraft"} 👋
                  </h1>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {fachkraft?.wohnort && <span className="chip" style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.75)" }}><Icon.pin />{fachkraft.wohnort}</span>}
                    {fachkraft?.arbeitszeit && <span className="chip" style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.75)" }}><Icon.zap />{fachkraft.arbeitszeit}</span>}
                    {fachkraft?.erfahrung_jahre && <span className="chip" style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.75)" }}><Icon.clock />{fachkraft.erfahrung_jahre} Jahre Erfahrung</span>}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                {[
                  { label: "Offene Anfragen", value: offeneAnfragen.length, accent: offeneAnfragen.length > 0 ? C.red : C.navyMid, bg: offeneAnfragen.length > 0 ? "#FFF5F5" : "#F0F4FF" },
                  { label: "Angenommen", value: anfragen.filter(a => a.status === "akzeptiert").length, accent: C.green, bg: "#F0FDF4" },
                  { label: "Nachrichten", value: nachrichten.length, accent: C.blue, bg: "#EFF6FF" },
                ].map(s => (
                  <div key={s.label} className="stat-box" style={{ background: s.bg, border: "none" }}>
                    <div style={{ fontSize: "1.9rem", fontWeight: 800, color: s.accent, fontFamily: "'Fraunces', serif", lineHeight: 1 }}>{s.value}</div>
                    <div style={{ fontSize: "0.7rem", color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginTop: 5 }}>{s.label}</div>
                  </div>
                ))}
              </div>
              {offeneAnfragen.length > 0 && (
                <div style={{ background: "#FFFBEB", border: "1.5px solid #FDE68A", borderRadius: 16, padding: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.amber, animation: "pulse 1.5s infinite" }} />
                    <span style={{ fontWeight: 800, color: "#92400E", fontSize: "0.88rem" }}>{offeneAnfragen.length} neue Anfrage{offeneAnfragen.length > 1 ? "n" : ""} warten auf dich</span>
                  </div>
                  {offeneAnfragen.slice(0, 2).map(a => (
                    <div key={a.id} style={{ padding: "10px 14px", background: "white", borderRadius: 10, marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #FDE68A" }}>
                      <span style={{ fontWeight: 600, color: C.text, fontSize: "0.85rem" }}>{a.kita_name}</span>
                      <span style={{ fontSize: "0.72rem", color: C.muted }}>{new Date(a.created_at).toLocaleDateString("de-DE", { day: "2-digit", month: "short" })}</span>
                    </div>
                  ))}
                  <button className="btn-primary" style={{ marginTop: 8 }} onClick={() => setActiveTab("anfragen")}>Alle Anfragen ansehen</button>
                </div>
              )}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <button className="quick-link" onClick={() => setActiveTab("nachrichten")}>
                  <span style={{ color: C.blue }}><Icon.chat /></span>
                  Nachrichten {nachrichten.length > 0 && <span style={{ marginLeft: "auto", background: C.blue, color: "white", borderRadius: 99, padding: "1px 8px", fontSize: "0.68rem", fontWeight: 800 }}>{nachrichten.length}</span>}
                </button>
                <button className="quick-link" onClick={() => setActiveTab("profil")}>
                  <span style={{ color: C.navyMid }}><Icon.user /></span>Profil bearbeiten
                </button>
                <a href="/kontakt" className="quick-link" style={{ gridColumn: "1/-1" }}>
                  <span style={{ color: C.muted }}><Icon.settings /></span>Support kontaktieren
                </a>
              </div>

              {/* ── Missbrauch Banner mit Button ── */}
              <div style={{ background: "#EFF6FF", border: "1.5px solid #BFDBFE", borderRadius: 14, padding: "14px 16px", display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ color: C.blue, flexShrink: 0 }}><Icon.shield /></span>
                <div style={{ flex: 1, fontSize: "0.8rem", color: "#1E40AF", lineHeight: 1.5 }}>
                  <strong>Fairness-Hinweis:</strong> Falls eine Einrichtung dir Stellen anbietet die nicht zu ihrem Account gehören, melde es uns. Wir behandeln alle Hinweise vertraulich. 🙏
                </div>
                <button
                  onClick={() => { setMeldungModal({ partnerId: "", partnerName: "Unbekannte Einrichtung" }); setMeldungGesendet(false); setMeldungText(""); }}
                  style={{ display: "flex", alignItems: "center", gap: 5, padding: "8px 14px", borderRadius: 9, border: "1.5px solid #FED7D7", background: "#FFF5F5", color: C.red, fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Sora', sans-serif", flexShrink: 0, whiteSpace: "nowrap" }}
                >
                  <Icon.flag />Melden
                </button>
              </div>
            </div>
          )}

          {/* ── ANFRAGEN ── */}
          {activeTab === "anfragen" && (
            <div>
              <div style={{ marginBottom: 22 }}>
                <h2 style={{ fontSize: "1.15rem", fontWeight: 800, color: C.text }}>Anfragen</h2>
                <p style={{ fontSize: "0.82rem", color: C.muted, marginTop: 3 }}>Kitas, die Interesse an deinem Profil haben.</p>
              </div>
              {anfragen.length === 0 ? (
                <div style={{ background: "white", border: `1.5px solid ${C.border}`, borderRadius: 18, padding: "50px 24px", textAlign: "center" }}>
                  <div style={{ fontSize: "2rem", marginBottom: 12 }}>📭</div>
                  <div style={{ fontWeight: 700, color: C.text, marginBottom: 6 }}>Noch keine Anfragen</div>
                  <div style={{ color: C.muted, fontSize: "0.84rem" }}>Sobald eine Kita Interesse hat, erscheint die Anfrage hier.</div>
                </div>
              ) : (
                <>
                  {offeneAnfragen.length > 0 && (
                    <div style={{ marginBottom: 28 }}>
                      <div style={{ fontSize: "0.7rem", fontWeight: 800, color: C.blue, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 12 }}>Offen · {offeneAnfragen.length}</div>
                      {offeneAnfragen.map(anfrage => (
                        <div key={anfrage.id} className="anfrage-card" style={{ borderLeft: `4px solid ${C.blue}` }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                            <div>
                              <div style={{ fontWeight: 800, color: C.text, fontSize: "1rem" }}>{anfrage.kita_name}</div>
                              <div style={{ fontSize: "0.74rem", color: C.muted, marginTop: 3 }}>{new Date(anfrage.created_at).toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" })}</div>
                            </div>
                            <span className="chip" style={{ background: "#EFF6FF", color: C.blue }}>Neu</span>
                          </div>
                          {anfrage.nachricht && (
                            <div style={{ background: C.surface, borderRadius: 10, padding: "11px 14px", marginBottom: 12, fontSize: "0.85rem", color: "#4B5563", lineHeight: 1.7, borderLeft: `3px solid ${C.border}`, fontStyle: "italic" }}>
                              "{anfrage.nachricht}"
                            </div>
                          )}
                          <div style={{ background: "#FFFBEB", borderRadius: 9, padding: "9px 12px", marginBottom: 14, fontSize: "0.76rem", color: "#92400E", fontWeight: 500 }}>
                            🔒 Kontaktdaten werden erst nach deiner Zustimmung freigegeben.
                          </div>
                          <div style={{ display: "flex", gap: 8 }}>
                            <button className="btn-green" onClick={() => handleAnfrage(anfrage.id, "akzeptiert")} disabled={anfrageLoading === anfrage.id}>
                              {anfrageLoading === anfrage.id ? "..." : <><Icon.check /> Annehmen</>}
                            </button>
                            <button className="btn-ghost" onClick={() => handleAnfrage(anfrage.id, "abgelehnt")} disabled={anfrageLoading === anfrage.id} style={{ flex: 1, fontSize: "0.85rem" }}>
                              {anfrageLoading === anfrage.id ? "..." : <><Icon.x /> Ablehnen</>}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {bearbeiteteAnfragen.length > 0 && (
                    <div>
                      <div style={{ fontSize: "0.7rem", fontWeight: 800, color: C.muted, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 12 }}>Bearbeitet · {bearbeiteteAnfragen.length}</div>
                      {bearbeiteteAnfragen.map(anfrage => (
                        <div key={anfrage.id} className="anfrage-card" style={{ borderLeft: `4px solid ${anfrage.status === "akzeptiert" ? C.green : C.border}` }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                              <div style={{ fontWeight: 700, color: C.text }}>{anfrage.kita_name}</div>
                              <div style={{ fontSize: "0.73rem", color: C.muted, marginTop: 2 }}>{new Date(anfrage.created_at).toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" })}</div>
                            </div>
                            <span className="chip" style={{ background: anfrage.status === "akzeptiert" ? "#ECFDF5" : "#F9FAFB", color: anfrage.status === "akzeptiert" ? C.green : C.muted }}>
                              {anfrage.status === "akzeptiert" ? <><Icon.check /> Angenommen</> : <><Icon.x /> Abgelehnt</>}
                            </span>
                          </div>
                          {anfrage.status === "akzeptiert" && (
                            <div style={{ marginTop: 12, padding: "9px 12px", background: "#ECFDF5", borderRadius: 9, fontSize: "0.78rem", color: "#065F46", fontWeight: 600 }}>
                              ✓ Die Kita hat deine Kontaktdaten erhalten.
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
              <div style={{ marginBottom: 22 }}>
                <h2 style={{ fontSize: "1.15rem", fontWeight: 800, color: C.text }}>Nachrichten</h2>
                <p style={{ fontSize: "0.82rem", color: C.muted, marginTop: 3 }}>Deine Unterhaltungen mit Kitas.</p>
              </div>
              {Object.keys(konversationen).length === 0 ? (
                <div style={{ background: "white", border: `1.5px solid ${C.border}`, borderRadius: 18, padding: "50px 24px", textAlign: "center" }}>
                  <div style={{ fontSize: "2rem", marginBottom: 12 }}>💬</div>
                  <div style={{ fontWeight: 700, color: C.text, marginBottom: 6 }}>Noch keine Nachrichten</div>
                  <div style={{ color: C.muted, fontSize: "0.84rem" }}>Wenn eine Kita dir schreibt, erscheint es hier.</div>
                </div>
              ) : Object.entries(konversationen).map(([partnerId, msgs]) => {
                const ag = arbeitgeberMap[partnerId];
                const agName = ag?.einrichtung_name || "Einrichtung";
                const sorted = [...msgs].sort((a, b) => new Date(a.erstellt_am).getTime() - new Date(b.erstellt_am).getTime());
                return (
                  <div key={partnerId} style={{ background: "white", border: `1.5px solid ${C.border}`, borderRadius: 18, padding: 22, marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, paddingBottom: 14, borderBottom: `1px solid ${C.border}` }}>
                      <span style={{ fontWeight: 800, color: C.text, fontSize: "0.95rem" }}>{agName}</span>
                      <button onClick={() => { setMeldungModal({ partnerId, partnerName: agName }); setMeldungGesendet(false); setMeldungText(""); }} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 8, border: "1.5px solid #FED7D7", background: "#FFF5F5", color: C.red, fontSize: "0.72rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Sora', sans-serif" }}>
                        <Icon.flag />Missbrauch melden
                      </button>
                    </div>
                    <div style={{ marginBottom: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                      {sorted.map(msg => (
                        <div key={msg.id} style={{ display: "flex", justifyContent: msg.von_id === fachkraft!.id ? "flex-end" : "flex-start" }}>
                          <div className={msg.von_id === fachkraft!.id ? "msg-bubble-me" : "msg-bubble-them"} style={{ maxWidth: "78%", padding: "10px 14px", fontSize: "0.87rem", lineHeight: 1.6 }}>
                            <div>{msg.nachricht}</div>
                            <div style={{ fontSize: "0.68rem", opacity: 0.55, marginTop: 5 }}>{new Date(msg.erstellt_am).toLocaleString("de-DE", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {msgSent[partnerId] ? (
                      <div style={{ color: C.green, fontWeight: 700, fontSize: "0.83rem", padding: "10px 0", display: "flex", alignItems: "center", gap: 6 }}><Icon.check /> Gesendet!</div>
                    ) : (
                      <div style={{ display: "flex", gap: 8 }}>
                        <textarea placeholder={`Antwort an ${agName}...`} rows={2} value={antwort[partnerId] || ""} onChange={e => setAntwort(prev => ({ ...prev, [partnerId]: e.target.value }))} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAntwort(partnerId); } }} style={{ flex: 1, padding: "10px 13px", border: `1.5px solid ${C.border}`, borderRadius: 11, fontSize: "0.86rem", resize: "none", fontFamily: "'Sora', sans-serif", outline: "none" }} />
                        <button onClick={() => handleAntwort(partnerId)} disabled={sendingMsg === partnerId || !antwort[partnerId]?.trim()} style={{ padding: "0 18px", background: C.navyMid, color: "white", border: "none", borderRadius: 11, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: (!antwort[partnerId]?.trim()) ? 0.4 : 1 }}>
                          <Icon.send />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* ── PROFIL ── */}
          {activeTab === "profil" && form && (
            <div>
              <div style={{ marginBottom: 22 }}>
                <h2 style={{ fontSize: "1.15rem", fontWeight: 800, color: C.text }}>Mein Profil</h2>
                <p style={{ fontSize: "0.82rem", color: C.muted, marginTop: 3 }}>Diese Informationen sehen Kitas auf deiner Visitenkarte.</p>
              </div>
              <div style={{ background: "white", border: `1.5px solid ${C.border}`, borderRadius: 18, padding: 26 }}>
                <div style={{ marginBottom: 28 }}>
                  <div style={{ fontSize: "0.72rem", fontWeight: 800, color: C.muted, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 16, paddingBottom: 10, borderBottom: `1px solid ${C.border}` }}>Persönliches</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 16px" }}>
                    <Field label="Vorname" name="vorname" /><Field label="Nachname" name="nachname" />
                    <Field label="Telefon" name="telefon" type="tel" /><Field label="Wohnort" name="wohnort" />
                  </div>
                  <div style={{ marginTop: 14 }}><Field label="Bundesland" name="bundesland" options={["Baden-Württemberg","Bayern","Berlin","Brandenburg","Bremen","Hamburg","Hessen","Mecklenburg-Vorpommern","Niedersachsen","Nordrhein-Westfalen","Rheinland-Pfalz","Saarland","Sachsen","Sachsen-Anhalt","Schleswig-Holstein","Thüringen"]} /></div>
                </div>
                <div style={{ marginBottom: 28 }}>
                  <div style={{ fontSize: "0.72rem", fontWeight: 800, color: C.muted, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 16, paddingBottom: 10, borderBottom: `1px solid ${C.border}` }}>Qualifikation</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <Field label="Qualifikation" name="qualifikation" options={["Staatlich anerkannte/r Erzieher/in","Kindheitspädagoge/in","Sozialpädagoge/in","Heilpädagoge/in","Sozialarbeiter/in","Pädagogische Fachkraft (ausländischer Abschluss)","Quereinstieg","Sonstiges"]} />
                    <Field label="Zusatzqualifikation" name="zusatzqualifikation" />
                    <Field label="Hochschulabschluss" name="uniabschluss" />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
                      <Field label="Berufserfahrung (Jahre)" name="erfahrung_jahre" type="number" />
                      <Field label="Altersgruppe Kita" name="kita_alter" options={["Krippe (0-3 Jahre)","Kindergarten (3-6 Jahre)","Hort (6-12 Jahre)","Alle Altersgruppen"]} />
                    </div>
                  </div>
                </div>
                <div style={{ marginBottom: 28 }}>
                  <div style={{ fontSize: "0.72rem", fontWeight: 800, color: C.muted, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 16, paddingBottom: 10, borderBottom: `1px solid ${C.border}` }}>Sprachen</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 16px" }}>
                    <Field label="Deutsch" name="deutsch" options={["Muttersprache","Sehr gut (C1/C2)","Gut (B1/B2)","Grundkenntnisse (A1/A2)"]} />
                    <Field label="Englisch" name="englisch" options={["Muttersprache","Sehr gut (C1/C2)","Gut (B1/B2)","Grundkenntnisse (A1/A2)","Keine"]} />
                  </div>
                  <div style={{ marginTop: 14 }}><Field label="Weitere Sprachen" name="weitere_sprachen" /></div>
                </div>
                <div style={{ marginBottom: 28 }}>
                  <div style={{ fontSize: "0.72rem", fontWeight: 800, color: C.muted, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 16, paddingBottom: 10, borderBottom: `1px solid ${C.border}` }}>Verfügbarkeit</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
                    <Field label="Verfügbar ab" name="verfuegbar_ab" type="date" />
                    <Field label="Arbeitszeit" name="arbeitszeit" options={["Vollzeit","Teilzeit","Vollzeit & Teilzeit","Minijob"]} />
                  </div>
                </div>
                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 8 }}>Über mich</label>
                  <textarea value={form.beschreibung || ""} onChange={e => setForm(f => ({ ...f!, beschreibung: e.target.value }))} rows={4} placeholder="Beschreibe dich kurz — was macht dich als Fachkraft aus?" style={{ ...fieldStyle, resize: "vertical" }} />
                </div>
                {saveError && <div style={{ marginBottom: 12, padding: "12px 16px", background: "#FFF5F5", border: "1px solid #FED7D7", borderRadius: 10, color: "#9B1C1C", fontSize: "0.84rem" }}>{saveError}</div>}
                {saveSuccess && <div style={{ marginBottom: 12, padding: "12px 16px", background: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: 10, color: "#065F46", fontSize: "0.84rem", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}><Icon.check /> Profil erfolgreich gespeichert!</div>}
                <button className="btn-primary" onClick={handleSave} disabled={saving}>{saving ? "Wird gespeichert..." : "Änderungen speichern"}</button>
              </div>
            </div>
          )}

          {/* ── KONTO ── */}
          {activeTab === "konto" && (
            <div>
              <div style={{ marginBottom: 22 }}>
                <h2 style={{ fontSize: "1.15rem", fontWeight: 800, color: C.text }}>Konto</h2>
                <p style={{ fontSize: "0.82rem", color: C.muted, marginTop: 3 }}>Deine Account-Einstellungen.</p>
              </div>
              <div style={{ background: "white", border: `1.5px solid ${C.border}`, borderRadius: 18, padding: 24, marginBottom: 16 }}>
                <div style={{ fontSize: "0.7rem", fontWeight: 800, color: C.muted, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 14 }}>E-Mail-Adresse</div>
                <div style={{ padding: "12px 16px", background: C.surface, borderRadius: 10, color: C.text, fontWeight: 600, fontSize: "0.9rem", border: `1.5px solid ${C.border}` }}>{fachkraft?.email}</div>
              </div>
             
              <div style={{ background: "#FFF5F5", border: "1.5px solid #FED7D7", borderRadius: 18, padding: 24 }}>
                <div style={{ fontWeight: 800, color: "#9B1C1C", fontSize: "0.95rem", marginBottom: 6 }}>Account löschen</div>
                <div style={{ color: "#7F1D1D", fontSize: "0.82rem", lineHeight: 1.7, marginBottom: 18 }}>Dein Account und alle gespeicherten Daten werden unwiderruflich und dauerhaft gelöscht.</div>
                <button onClick={handleDeleteAccount} style={{ background: C.red, color: "white", border: "none", padding: "11px 20px", borderRadius: 10, fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", fontFamily: "'Sora', sans-serif", width: "100%" }}>Account unwiderruflich löschen</button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ── MISSBRAUCH MODAL ── */}
      {meldungModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,36,66,0.6)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(4px)" }} onClick={e => { if (e.target === e.currentTarget) { setMeldungModal(null); setMeldungGesendet(false); } }}>
          <div style={{ background: "white", borderRadius: "24px 24px 0 0", padding: "24px 20px 32px", width: "100%", maxWidth: 560 }}>
            <div style={{ width: 36, height: 4, background: C.border, borderRadius: 2, margin: "0 auto 20px" }} />
            {meldungGesendet ? (
              <div style={{ textAlign: "center", padding: "16px 0" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>🙏</div>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: "1.3rem", color: C.text, marginBottom: 8 }}>Vielen Dank!</div>
                <div style={{ color: C.muted, fontSize: "0.84rem", lineHeight: 1.6, marginBottom: 20 }}>Deine Meldung wurde an KitaBridge übermittelt. Wir prüfen den Fall vertraulich und melden uns falls nötig bei dir.</div>
                <button onClick={() => { setMeldungModal(null); setMeldungGesendet(false); }} style={{ width: "100%", padding: "13px", borderRadius: 12, border: "none", background: C.navyMid, color: "white", fontWeight: 700, cursor: "pointer", fontFamily: "'Sora', sans-serif" }}>Schließen</button>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ color: C.red }}><Icon.flag /></span>
                  <div style={{ fontFamily: "'Fraunces', serif", fontSize: "1.15rem", fontWeight: 800, color: C.text }}>Missbrauch melden</div>
                </div>
                <div style={{ fontSize: "0.8rem", color: C.muted, lineHeight: 1.6, marginBottom: 16 }}>
                  Du meldest einen möglichen Missbrauch durch <strong style={{ color: C.text }}>{meldungModal.partnerName}</strong>. Deine Meldung wird vertraulich behandelt.
                </div>
                <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 8 }}>Was ist passiert?</label>
                <textarea value={meldungText} onChange={e => setMeldungText(e.target.value)} rows={4} placeholder="z.B. Die Einrichtung hat mir Stellen in anderen Kitas angeboten, die nicht zu ihrem Account gehören..." style={{ width: "100%", padding: "11px 13px", borderRadius: 11, border: `1.5px solid ${C.border}`, fontSize: "0.86rem", fontFamily: "'Sora', sans-serif", resize: "none", outline: "none", color: C.text, marginBottom: 14 }} />
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setMeldungModal(null)} style={{ flex: 1, padding: "13px", borderRadius: 11, border: `1.5px solid ${C.border}`, background: "white", color: C.muted, fontWeight: 700, cursor: "pointer", fontFamily: "'Sora', sans-serif" }}>Abbrechen</button>
                  <button onClick={handleMeldungSenden} disabled={meldungSending || !meldungText.trim()} style={{ flex: 2, padding: "13px", borderRadius: 11, border: "none", background: meldungSending || !meldungText.trim() ? C.border : C.red, color: "white", fontWeight: 700, cursor: meldungSending || !meldungText.trim() ? "not-allowed" : "pointer", fontFamily: "'Sora', sans-serif" }}>
                    {meldungSending ? "Wird gesendet..." : "Meldung absenden"}
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