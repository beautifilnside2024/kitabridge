"use client";
import { useEffect, useState, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

const C = {
  navy: "#0F2442", navyMid: "#1A3F6F", blue: "#2471A3",
  green: "#16A34A", surface: "#F7F9FC", border: "#E4EAF4", muted: "#8A96B0", text: "#1C2B4A",
};

function VisitenkartePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const anfrage_id = searchParams.get("anfrage");
  const [ag, setAg] = useState<any>(null);
  const [anfrage, setAnfrage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => { load(); }, []);

  const load = async () => {
    if (!anfrage_id) { setError("Kein Zugriff."); setLoading(false); return; }
    const { data: anfrageData } = await supabase.from("anfragen").select("*").eq("id", anfrage_id).single();
    if (!anfrageData) { setError("Ungültige Anfrage."); setLoading(false); return; }
    setAnfrage(anfrageData);
    const { data: agData } = await supabase.from("arbeitgeber").select("*").eq("id", params.id).single();
    if (!agData) { setError("Einrichtung nicht gefunden."); setLoading(false); return; }
    setAg(agData);
    setLoading(false);
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

  if (error) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C.surface, fontFamily: "'Sora', sans-serif", padding: 24 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Fraunces:wght@700;800&display=swap');`}</style>
      <div style={{ background: "white", borderRadius: 22, padding: "40px 32px", textAlign: "center", maxWidth: 380, border: `1.5px solid ${C.border}`, boxShadow: "0 8px 40px rgba(15,36,66,0.1)" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: 16 }}>🔒</div>
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: "1.3rem", fontWeight: 800, color: C.text, marginBottom: 8 }}>Kein Zugriff</div>
        <div style={{ color: C.muted, fontSize: "0.86rem", lineHeight: 1.6 }}>Diese Visitenkarte ist nur über eine direkte Anfrage zugänglich.</div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: C.surface, fontFamily: "'Sora', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Fraunces:wght@700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { -webkit-font-smoothing: antialiased; }
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

      <div style={{ maxWidth: 580, margin: "0 auto", padding: "28px 16px" }}>

        {/* Hero banner */}
        <div style={{ background: `linear-gradient(135deg, ${C.navy} 0%, ${C.navyMid} 55%, #1B5E98 100%)`, borderRadius: 24, padding: "28px 28px 24px", marginBottom: 16, position: "relative", overflow: "hidden", boxShadow: "0 16px 48px rgba(15,36,66,0.28)" }}>
          <div style={{ position: "absolute", top: -60, right: -60, width: 220, height: 220, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -40, left: "35%", width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.03)", pointerEvents: "none" }} />

          <div style={{ fontSize: "0.65rem", fontWeight: 800, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 10, position: "relative" }}>Visitenkarte</div>

          <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 18, position: "relative" }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", flexShrink: 0 }}>🏫</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: "1.4rem", fontWeight: 800, color: "white", lineHeight: 1.15, marginBottom: 6 }}>{ag.einrichtung_name}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {ag.einrichtungstyp && <span style={{ background: "rgba(255,255,255,0.12)", borderRadius: 99, padding: "3px 11px", fontSize: "0.73rem", color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>🏫 {ag.einrichtungstyp}</span>}
                {ag.traeger && <span style={{ background: "rgba(255,255,255,0.12)", borderRadius: 99, padding: "3px 11px", fontSize: "0.73rem", color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>🏛 {ag.traeger}</span>}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, position: "relative" }}>
            {ag.plz && ag.ort && <span style={{ background: "rgba(255,255,255,0.12)", borderRadius: 99, padding: "3px 11px", fontSize: "0.73rem", color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>📍 {ag.plz} {ag.ort}</span>}
            {ag.bundesland && <span style={{ background: "rgba(255,255,255,0.12)", borderRadius: 99, padding: "3px 11px", fontSize: "0.73rem", color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>🗺 {ag.bundesland}</span>}
            {ag.stellen_anzahl && <span style={{ background: "rgba(255,255,255,0.12)", borderRadius: 99, padding: "3px 11px", fontSize: "0.73rem", color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>👥 {ag.stellen_anzahl}</span>}
          </div>
        </div>

        {/* Anfrage Nachricht */}
        {anfrage?.nachricht && (
          <div style={{ background: "white", borderRadius: 18, padding: "20px 22px", marginBottom: 16, border: `1.5px solid ${C.border}` }}>
            <div style={{ fontSize: "0.68rem", fontWeight: 800, color: C.blue, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 12 }}>
              📩 Nachricht von {ag.ansprech_name || ag.einrichtung_name}
            </div>
            <p style={{ color: "#4B5563", fontSize: "0.9rem", lineHeight: 1.75 }}>{anfrage.nachricht}</p>
          </div>
        )}

        {/* Info grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          {[
            { icon: "📍", label: "Standort", value: ag.plz && ag.ort ? `${ag.plz} ${ag.ort}` : ag.ort },
            { icon: "🗺", label: "Bundesland", value: ag.bundesland },
            { icon: "👥", label: "Offene Stellen", value: ag.stellen_anzahl },
            { icon: "👤", label: "Ansprechpartner", value: ag.ansprech_name },
            { icon: "💼", label: "Rolle", value: ag.ansprech_rolle },
          ].filter(i => i.value).map(item => (
            <div key={item.label} style={{ background: "white", borderRadius: 14, padding: "14px 16px", border: `1.5px solid ${C.border}` }}>
              <div style={{ fontSize: "1.1rem", marginBottom: 6 }}>{item.icon}</div>
              <div style={{ fontSize: "0.68rem", fontWeight: 800, color: C.muted, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: "0.87rem", color: C.text, fontWeight: 700 }}>{item.value}</div>
            </div>
          ))}
        </div>

        {/* Beschreibung */}
        {ag.beschreibung && (
          <div style={{ background: "white", borderRadius: 18, padding: "20px 22px", marginBottom: 16, border: `1.5px solid ${C.border}` }}>
            <div style={{ fontSize: "0.68rem", fontWeight: 800, color: C.muted, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 12 }}>Über uns</div>
            <p style={{ color: "#4B5563", fontSize: "0.9rem", lineHeight: 1.75 }}>{ag.beschreibung}</p>
          </div>
        )}

        {/* Kontakt */}
        {(ag.telefon || ag.email) && (
          <div style={{ background: `linear-gradient(135deg, ${C.navy} 0%, ${C.navyMid} 100%)`, borderRadius: 18, padding: "20px 24px" }}>
            <div style={{ fontSize: "0.65rem", fontWeight: 800, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 14 }}>Kontakt</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {ag.telefon && (
                <a href={`tel:${ag.telefon}`} style={{ display: "flex", alignItems: "center", gap: 12, color: "white", textDecoration: "none", padding: "10px 14px", background: "rgba(255,255,255,0.08)", borderRadius: 11 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem", flexShrink: 0 }}>📞</div>
                  <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{ag.telefon}</span>
                </a>
              )}
              {ag.email && (
                <a href={`mailto:${ag.email}`} style={{ display: "flex", alignItems: "center", gap: 12, color: "white", textDecoration: "none", padding: "10px 14px", background: "rgba(255,255,255,0.08)", borderRadius: 11 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem", flexShrink: 0 }}>✉️</div>
                  <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{ag.email}</span>
                </a>
              )}
            </div>
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: 20, fontSize: "0.75rem", color: C.muted }}>
          Diese Visitenkarte wurde über KitaBridge geteilt
        </div>
      </div>
    </div>
  );
}

export default function ArbeitgeberVisitenkarte() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F7F9FC" }}>
        <div style={{ width: 36, height: 36, border: "3px solid #E4EAF4", borderTopColor: "#1A3F6F", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    }>
      <VisitenkartePage />
    </Suspense>
  );
}