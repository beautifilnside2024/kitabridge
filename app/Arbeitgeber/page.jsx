"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

const NAVY = "#1A3F6F";
const BLUE = "#2471A3";
const GREEN = "#1E8449";

export default function ArbeitgeberVisitenkarte() {
  const { id } = useParams();
  const [arbeitgeber, setArbeitgeber] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    supabase.from("arbeitgeber").select("*").eq("id", id).single()
      .then(({ data }) => { setArbeitgeber(data); setLoading(false); });
  }, [id]);

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F0F4F9", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ color: NAVY }}>Lädt...</div>
    </div>
  );

  if (!arbeitgeber) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F0F4F9", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ color: NAVY }}>Profil nicht gefunden.</div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4F9", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap'); * { box-sizing: border-box; }`}</style>

      {/* HEADER */}
      <div style={{ background: NAVY, padding: "0 24px", height: 56, display: "flex", alignItems: "center" }}>
        <a href="/" style={{ textDecoration: "none", fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 700 }}>
          <span style={{ color: "white" }}>Kita</span><span style={{ color: "#4ADE80" }}>Bridge</span>
        </a>
      </div>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "24px 16px" }}>

        {/* VISITENKARTE */}
        <div style={{ background: `linear-gradient(135deg, #0D1B2A 0%, ${NAVY} 60%, ${BLUE} 100%)`, borderRadius: 24, padding: "28px 28px", marginBottom: 20, position: "relative", overflow: "hidden", boxShadow: "0 16px 48px rgba(26,63,111,0.35)" }}>
          <div style={{ position: "absolute", top: -50, right: -50, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -30, left: "30%", width: 160, height: 160, borderRadius: "50%", background: "rgba(36,113,163,0.15)", pointerEvents: "none" }} />

          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16, position: "relative" }}>
            <div style={{ width: 60, height: 60, borderRadius: 16, background: "rgba(255,255,255,0.12)", border: "2px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.6rem", flexShrink: 0 }}>
              🏫
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "white", fontFamily: "'Playfair Display', serif", lineHeight: 1.1 }}>{arbeitgeber.einrichtung_name}</div>
              <div style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.55)", marginTop: 2 }}>{arbeitgeber.einrichtungstyp}</div>
            </div>
            <div style={{ background: arbeitgeber.status === "aktiv" || arbeitgeber.status === "bestaetigt" ? "rgba(39,174,96,0.3)" : "rgba(255,255,255,0.1)", border: `1px solid ${arbeitgeber.status === "aktiv" || arbeitgeber.status === "bestaetigt" ? "rgba(39,174,96,0.5)" : "rgba(255,255,255,0.2)"}`, borderRadius: 50, padding: "4px 12px", fontSize: "0.7rem", fontWeight: 800, color: "white", textTransform: "uppercase", letterSpacing: 1, whiteSpace: "nowrap" }}>
              {arbeitgeber.status === "aktiv" || arbeitgeber.status === "bestaetigt" ? "✓ Aktiv" : "⏳ In Prüfung"}
            </div>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, position: "relative" }}>
            {arbeitgeber.ort && <span style={{ background: "rgba(255,255,255,0.1)", borderRadius: 50, padding: "3px 11px", fontSize: "0.75rem", color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>📍 {arbeitgeber.ort}</span>}
            {arbeitgeber.bundesland && <span style={{ background: "rgba(255,255,255,0.1)", borderRadius: 50, padding: "3px 11px", fontSize: "0.75rem", color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>🗺 {arbeitgeber.bundesland}</span>}
            {arbeitgeber.traeger && <span style={{ background: "rgba(255,255,255,0.1)", borderRadius: 50, padding: "3px 11px", fontSize: "0.75rem", color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>🏢 {arbeitgeber.traeger}</span>}
            {arbeitgeber.stellen_anzahl && <span style={{ background: "rgba(255,255,255,0.1)", borderRadius: 50, padding: "3px 11px", fontSize: "0.75rem", color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>💼 {arbeitgeber.stellen_anzahl}</span>}
          </div>
        </div>

        {/* INFOS */}
        <div style={{ background: "white", borderRadius: 18, padding: "20px", marginBottom: 16, boxShadow: "0 2px 12px rgba(26,63,111,0.07)" }}>
          <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "#9BA8C0", textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>Einrichtungsdetails</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {arbeitgeber.einrichtungstyp && <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem" }}><span style={{ color: "#9BA8C0", fontWeight: 600 }}>Typ</span><span style={{ color: NAVY, fontWeight: 700 }}>{arbeitgeber.einrichtungstyp}</span></div>}
            {arbeitgeber.traeger && <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem" }}><span style={{ color: "#9BA8C0", fontWeight: 600 }}>Träger</span><span style={{ color: NAVY, fontWeight: 700 }}>{arbeitgeber.traeger}</span></div>}
            {arbeitgeber.stellen_anzahl && <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem" }}><span style={{ color: "#9BA8C0", fontWeight: 600 }}>Offene Stellen</span><span style={{ color: NAVY, fontWeight: 700 }}>{arbeitgeber.stellen_anzahl}</span></div>}
            {arbeitgeber.strasse && <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem" }}><span style={{ color: "#9BA8C0", fontWeight: 600 }}>Adresse</span><span style={{ color: NAVY, fontWeight: 700 }}>{arbeitgeber.strasse} {arbeitgeber.hausnummer}, {arbeitgeber.plz} {arbeitgeber.ort}</span></div>}
          </div>
        </div>

        {arbeitgeber.beschreibung && (
          <div style={{ background: "white", borderRadius: 18, padding: "20px", marginBottom: 16, boxShadow: "0 2px 12px rgba(26,63,111,0.07)" }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "#9BA8C0", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Über uns</div>
            <p style={{ color: "#444", lineHeight: 1.75, fontSize: "0.9rem", margin: 0 }}>{arbeitgeber.beschreibung}</p>
          </div>
        )}

        {/* Ansprechpartner */}
        {arbeitgeber.ansprech_name && (
          <div style={{ background: "white", borderRadius: 18, padding: "20px", boxShadow: "0 2px 12px rgba(26,63,111,0.07)" }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "#9BA8C0", textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>Ansprechpartner</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: `linear-gradient(135deg, ${NAVY}, ${BLUE})`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 800, fontSize: "0.95rem" }}>
                {arbeitgeber.ansprech_name[0]}
              </div>
              <div>
                <div style={{ fontWeight: 700, color: NAVY }}>{arbeitgeber.ansprech_name}</div>
                {arbeitgeber.ansprech_rolle && <div style={{ fontSize: "0.78rem", color: "#9BA8C0" }}>{arbeitgeber.ansprech_rolle}</div>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}