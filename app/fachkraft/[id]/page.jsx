"use client";
import { useEffect, useState, Suspense } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

const NAVY = "#1A3F6F";
const GREEN = "#1E8449";
const BLUE = "#2471A3";

function FachkraftVisitenkarteInner() {
  const { id } = useParams();
  const [fachkraft, setFachkraft] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    supabase.from("fachkraefte").select("*").eq("id", id).single()
      .then(({ data }) => { setFachkraft(data); setLoading(false); });
  }, [id]);

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F0F4F9", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ color: NAVY }}>Lädt...</div>
    </div>
  );

  if (!fachkraft) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F0F4F9", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ color: NAVY }}>Profil nicht gefunden.</div>
    </div>
  );

  const displayName = fachkraft.username || `${fachkraft.vorname || ""} ${fachkraft.nachname || ""}`.trim();

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4F9", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap'); * { box-sizing: border-box; }`}</style>

      <div style={{ background: NAVY, padding: "0 24px", height: 56, display: "flex", alignItems: "center" }}>
        <a href="/" style={{ textDecoration: "none", fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 700 }}>
          <span style={{ color: "white" }}>Kita</span><span style={{ color: "#4ADE80" }}>Bridge</span>
        </a>
      </div>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "24px 16px" }}>

        <div style={{ background: `linear-gradient(135deg, #0a2e1a 0%, ${GREEN} 60%, #27AE60 100%)`, borderRadius: 24, padding: "28px", marginBottom: 20, position: "relative", overflow: "hidden", boxShadow: "0 16px 48px rgba(30,132,73,0.35)" }}>
          <div style={{ position: "absolute", top: -50, right: -50, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -30, left: "30%", width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />

          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16, position: "relative" }}>
            <div style={{ width: 60, height: 60, borderRadius: 16, background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: fachkraft.username ? "1.6rem" : "1.3rem", fontWeight: 800, color: "white", flexShrink: 0 }}>
              {fachkraft.username ? "🦸" : (`${fachkraft.vorname?.[0] || ""}${fachkraft.nachname?.[0] || ""}`).toUpperCase() || "👤"}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "white", fontFamily: "'Playfair Display', serif", lineHeight: 1.1 }}>{displayName}</div>
              {fachkraft.username && <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.5)", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginTop: 2 }}>Anonym-Modus</div>}
              <div style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.65)", marginTop: 2 }}>{fachkraft.qualifikation || "Pädagogische Fachkraft"}</div>
            </div>
            <div style={{ background: fachkraft.status === "bestaetigt" ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 50, padding: "4px 12px", fontSize: "0.7rem", fontWeight: 800, color: "white", textTransform: "uppercase", letterSpacing: 1, whiteSpace: "nowrap" }}>
              {fachkraft.status === "bestaetigt" ? "✓ Verifiziert" : "⏳ In Prüfung"}
            </div>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, position: "relative" }}>
            {fachkraft.wohnort && <span style={{ background: "rgba(255,255,255,0.12)", borderRadius: 50, padding: "3px 11px", fontSize: "0.75rem", color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>📍 {fachkraft.wohnort}</span>}
            {fachkraft.bundesland && <span style={{ background: "rgba(255,255,255,0.12)", borderRadius: 50, padding: "3px 11px", fontSize: "0.75rem", color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>🗺 {fachkraft.bundesland}</span>}
            {fachkraft.arbeitszeit && <span style={{ background: "rgba(255,255,255,0.12)", borderRadius: 50, padding: "3px 11px", fontSize: "0.75rem", color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>⏱ {fachkraft.arbeitszeit}</span>}
            {fachkraft.erfahrung_jahre && <span style={{ background: "rgba(255,255,255,0.12)", borderRadius: 50, padding: "3px 11px", fontSize: "0.75rem", color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>⭐ {fachkraft.erfahrung_jahre} Jahre</span>}
            {fachkraft.verfuegbar_ab && <span style={{ background: "rgba(255,255,255,0.12)", borderRadius: 50, padding: "3px 11px", fontSize: "0.75rem", color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>📅 ab {new Date(fachkraft.verfuegbar_ab).toLocaleDateString("de-DE", { month: "long", year: "numeric" })}</span>}
          </div>
        </div>

        <div style={{ background: "white", borderRadius: 18, padding: "20px", marginBottom: 16, boxShadow: "0 2px 12px rgba(26,63,111,0.07)" }}>
          <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "#9BA8C0", textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>Qualifikationen & Erfahrung</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {fachkraft.qualifikation && <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem" }}><span style={{ color: "#9BA8C0", fontWeight: 600 }}>Qualifikation</span><span style={{ color: NAVY, fontWeight: 700 }}>{fachkraft.qualifikation}</span></div>}
            {fachkraft.zusatzqualifikation && <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem" }}><span style={{ color: "#9BA8C0", fontWeight: 600 }}>Zusatz</span><span style={{ color: NAVY, fontWeight: 700 }}>{fachkraft.zusatzqualifikation}</span></div>}
            {fachkraft.uniabschluss && <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem" }}><span style={{ color: "#9BA8C0", fontWeight: 600 }}>Hochschule</span><span style={{ color: NAVY, fontWeight: 700 }}>{fachkraft.uniabschluss}</span></div>}
            {fachkraft.kita_alter && <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem" }}><span style={{ color: "#9BA8C0", fontWeight: 600 }}>Altersgruppe</span><span style={{ color: NAVY, fontWeight: 700 }}>{Array.isArray(fachkraft.kita_alter) ? fachkraft.kita_alter.join(", ") : fachkraft.kita_alter}</span></div>}
            {fachkraft.deutsch && <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem" }}><span style={{ color: "#9BA8C0", fontWeight: 600 }}>Deutsch</span><span style={{ color: NAVY, fontWeight: 700 }}>{fachkraft.deutsch}</span></div>}
            {fachkraft.englisch && fachkraft.englisch !== "Keine" && <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem" }}><span style={{ color: "#9BA8C0", fontWeight: 600 }}>Englisch</span><span style={{ color: NAVY, fontWeight: 700 }}>{fachkraft.englisch}</span></div>}
            {fachkraft.weitere_sprachen && <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem" }}><span style={{ color: "#9BA8C0", fontWeight: 600 }}>Weitere Sprachen</span><span style={{ color: NAVY, fontWeight: 700 }}>{fachkraft.weitere_sprachen}</span></div>}
          </div>
        </div>

        {fachkraft.beschreibung && (
          <div style={{ background: "white", borderRadius: 18, padding: "20px", marginBottom: 16, boxShadow: "0 2px 12px rgba(26,63,111,0.07)" }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "#9BA8C0", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Über mich</div>
            <p style={{ color: "#444", lineHeight: 1.75, fontSize: "0.9rem", margin: 0 }}>{fachkraft.beschreibung}</p>
          </div>
        )}

        <div style={{ background: fachkraft.aktiv_suchend ? "#EAF7EF" : "#F8F8F8", borderRadius: 14, padding: "12px 16px", textAlign: "center", fontSize: "0.85rem", fontWeight: 600, color: fachkraft.aktiv_suchend ? GREEN : "#9BA8C0" }}>
          {fachkraft.aktiv_suchend ? "✅ Aktiv auf Jobsuche" : "⏸ Derzeit nicht auf Jobsuche"}
        </div>
      </div>
    </div>
  );
}

export default function FachkraftVisitenkarte() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Lädt...</div>}>
      <FachkraftVisitenkarteInner />
    </Suspense>
  );
}
