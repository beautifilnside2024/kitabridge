"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const NAVY = "#1A3F6F";
const GREEN = "#1E8449";

export default function Nachrichten() {
  const [nachrichten, setNachrichten] = useState([]);
  const [userId, setUserId] = useState(null);
  const [antwort, setAntwort] = useState({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/login"); return; }

      const { data: fachkraft } = await supabase
        .from("fachkraefte")
        .select("id, vorname, email")
        .eq("email", session.user.email)
        .single();

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

    await fetch("/api/nachrichten", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        von_id: userId,
        an_id: msg.von_id,
        von_typ: "fachkraft",
        nachricht: text,
        empfaenger_email: msg.absender_email,
        empfaenger_name: msg.absender_name,
        absender_name: "Fachkraft",
      }),
    });

    setAntwort({ ...antwort, [msg.von_id]: "" });
    const res = await fetch(`/api/nachrichten?user_id=${userId}`);
    setNachrichten(await res.json());
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif", color: NAVY }}>
      Lädt...
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4F9", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>

      <div style={{ background: NAVY, padding: "0 32px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/" style={{ textDecoration: "none", fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700 }}>
          <span style={{ color: "white" }}>Kita</span><span style={{ color: "#4ADE80" }}>Bridge</span>
        </a>
        <a href="/fachkraft/einstellungen" style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem", textDecoration: "none" }}>← Zurück</a>
      </div>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "40px 20px" }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", color: NAVY, marginBottom: 8 }}>Nachrichten</h1>
        <p style={{ color: "#9BA8C0", marginBottom: 32 }}>Hier siehst du alle Nachrichten von Einrichtungen.</p>

        {nachrichten.length === 0 ? (
          <div style={{ background: "white", borderRadius: 20, padding: 40, textAlign: "center", color: "#9BA8C0" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>📭</div>
            <p>Noch keine Nachrichten</p>
          </div>
        ) : (
          nachrichten.map(msg => (
            <div key={msg.id} style={{ background: "white", borderRadius: 20, padding: 24, marginBottom: 16, boxShadow: "0 2px 12px rgba(26,63,111,0.08)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ fontWeight: 700, color: NAVY }}>{msg.von_typ === "arbeitgeber" ? "📢 Einrichtung" : "👤 Du"}</div>
                <div style={{ fontSize: "0.78rem", color: "#9BA8C0" }}>{new Date(msg.erstellt_am).toLocaleDateString("de-DE")}</div>
              </div>
              <p style={{ color: "#444", lineHeight: 1.7, marginBottom: 16 }}>{msg.nachricht}</p>

              {msg.von_typ === "arbeitgeber" && (
                <div>
                  <textarea
                    placeholder="Antwort schreiben..."
                    rows={3}
                    value={antwort[msg.von_id] || ""}
                    onChange={e => setAntwort({ ...antwort, [msg.von_id]: e.target.value })}
                    style={{ width: "100%", padding: "12px 16px", border: "1px solid #E8EDF4", borderRadius: 12, fontSize: "0.9rem", resize: "vertical", fontFamily: "'DM Sans', sans-serif" }}
                  />
                  <button onClick={() => handleAntwort(msg)} style={{ marginTop: 8, padding: "10px 24px", background: NAVY, color: "white", border: "none", borderRadius: 50, fontWeight: 700, cursor: "pointer", fontSize: "0.9rem" }}>
                    Antworten →
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}