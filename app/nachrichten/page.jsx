"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const C = {
  navy: "#0F2442", navyMid: "#1A3F6F", blue: "#2471A3",
  green: "#16A34A", surface: "#F7F9FC", border: "#E4EAF4", muted: "#8A96B0", text: "#1C2B4A",
};

export default function Nachrichten() {
  const [nachrichten, setNachrichten] = useState([]);
  const [userId, setUserId] = useState(null);
  const [antwort, setAntwort] = useState({});
  const [sending, setSending] = useState({});
  const [sent, setSent] = useState({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/login"); return; }
      const { data: fachkraft } = await supabase.from("fachkraefte").select("id, vorname, email").eq("email", session.user.email).single();
      if (!fachkraft) { router.push("/login"); return; }
      setUserId(fachkraft.id);
      const res = await fetch(`/api/nachrichten?user_id=${fachkraft.id}`);
      const data = await res.json();
      setNachrichten(data || []);
      setLoading(false);
    };
    load();
  }, []);

  const handleAntwort = async (msg) => {
    const text = antwort[msg.von_id];
    if (!text) return;
    setSending(s => ({ ...s, [msg.von_id]: true }));
    await fetch("/api/nachrichten", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ von_id: userId, an_id: msg.von_id, von_typ: "fachkraft", nachricht: text, empfaenger_email: msg.absender_email, empfaenger_name: msg.absender_name, absender_name: "Fachkraft" }),
    });
    setSending(s => ({ ...s, [msg.von_id]: false }));
    setSent(s => ({ ...s, [msg.von_id]: true }));
    setAntwort(a => ({ ...a, [msg.von_id]: "" }));
    const res = await fetch(`/api/nachrichten?user_id=${userId}`);
    setNachrichten(await res.json());
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
    <div style={{ minHeight: "100vh", background: C.surface, fontFamily: "'Sora', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Fraunces:wght@700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { -webkit-font-smoothing: antialiased; }
        textarea:focus { border-color: ${C.blue} !important; box-shadow: 0 0 0 3px rgba(36,113,163,0.12) !important; outline: none; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* Header */}
      <header style={{ background: "rgba(247,249,252,0.9)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${C.border}`, padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
        <a href="/" style={{ textDecoration: "none" }}>
          <span style={{ fontFamily: "'Fraunces', serif", fontSize: "1.3rem", fontWeight: 800, color: C.navy }}>Kita</span>
          <span style={{ fontFamily: "'Fraunces', serif", fontSize: "1.3rem", fontWeight: 800, color: C.green }}>Bridge</span>
        </a>
        <a href="/fachkraft/dashboard" style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 9, border: `1.5px solid ${C.border}`, background: "white", color: C.muted, fontSize: "0.82rem", fontWeight: 600, textDecoration: "none" }}>
          ← Dashboard
        </a>
      </header>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "32px 20px" }}>

        {/* Title */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "1.6rem", fontWeight: 800, color: C.text, marginBottom: 4 }}>Nachrichten</h1>
          <p style={{ color: C.muted, fontSize: "0.84rem", fontWeight: 500 }}>
            {nachrichten.length > 0 ? `${nachrichten.length} Nachricht${nachrichten.length !== 1 ? "en" : ""} von Einrichtungen` : "Hier siehst du alle Nachrichten von Einrichtungen."}
          </p>
        </div>

        {nachrichten.length === 0 ? (
          <div style={{ background: "white", borderRadius: 22, padding: "52px 32px", textAlign: "center", border: `1.5px solid ${C.border}` }}>
            <div style={{ fontSize: "2.5rem", marginBottom: 14 }}>📭</div>
            <div style={{ fontWeight: 700, color: C.text, marginBottom: 6 }}>Noch keine Nachrichten</div>
            <div style={{ color: C.muted, fontSize: "0.84rem" }}>Wenn Kitas dir schreiben, erscheinen sie hier.</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {nachrichten.map(msg => {
              const isFromAg = msg.von_typ === "arbeitgeber";
              const isSending = sending[msg.von_id];
              const isSent = sent[msg.von_id];
              return (
                <div key={msg.id} style={{ background: "white", borderRadius: 20, border: `1.5px solid ${C.border}`, overflow: "hidden" }}>
                  {/* Message header */}
                  <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: isFromAg ? "#EFF6FF" : C.surface, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", flexShrink: 0 }}>
                        {isFromAg ? "🏫" : "👤"}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: C.text, fontSize: "0.88rem" }}>
                          {isFromAg ? (msg.absender_name || "Einrichtung") : "Du"}
                        </div>
                        <div style={{ fontSize: "0.72rem", color: C.muted, fontWeight: 500 }}>
                          {isFromAg ? "Arbeitgeber" : "Deine Antwort"}
                        </div>
                      </div>
                    </div>
                    <div style={{ fontSize: "0.75rem", color: C.muted, fontWeight: 500, flexShrink: 0 }}>
                      {new Date(msg.erstellt_am).toLocaleDateString("de-DE", { day: "2-digit", month: "short", year: "numeric" })}
                    </div>
                  </div>

                  {/* Message body */}
                  <div style={{ padding: "16px 20px" }}>
                    <p style={{ color: "#4B5563", lineHeight: 1.75, fontSize: "0.9rem", marginBottom: isFromAg ? 18 : 0 }}>{msg.nachricht}</p>

                    {isFromAg && (
                      isSent ? (
                        <div style={{ background: "#ECFDF5", border: "1.5px solid #A7F3D0", borderRadius: 11, padding: "12px 16px", display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 22, height: 22, borderRadius: "50%", background: C.green, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                          </div>
                          <span style={{ fontSize: "0.83rem", fontWeight: 700, color: "#065F46" }}>Antwort gesendet!</span>
                          <button onClick={() => setSent(s => ({ ...s, [msg.von_id]: false }))} style={{ marginLeft: "auto", background: "none", border: "none", color: C.green, fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", fontFamily: "'Sora', sans-serif" }}>Erneut antworten</button>
                        </div>
                      ) : (
                        <div>
                          <textarea
                            placeholder="Antwort schreiben..."
                            rows={3}
                            value={antwort[msg.von_id] || ""}
                            onChange={e => setAntwort(a => ({ ...a, [msg.von_id]: e.target.value }))}
                            style={{ width: "100%", padding: "11px 14px", border: `1.5px solid ${C.border}`, borderRadius: 11, fontSize: "0.87rem", resize: "vertical", fontFamily: "'Sora', sans-serif", color: C.text, marginBottom: 10 }}
                          />
                          <button
                            onClick={() => handleAntwort(msg)}
                            disabled={isSending || !antwort[msg.von_id]}
                            style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 20px", background: !antwort[msg.von_id] ? C.border : C.navyMid, color: !antwort[msg.von_id] ? C.muted : "white", border: "none", borderRadius: 10, fontWeight: 700, cursor: !antwort[msg.von_id] ? "not-allowed" : "pointer", fontSize: "0.85rem", fontFamily: "'Sora', sans-serif", transition: "all 0.15s" }}
                          >
                            {isSending ? (
                              <><div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />Senden...</>
                            ) : (
                              <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>Antworten</>
                            )}
                          </button>
                        </div>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}