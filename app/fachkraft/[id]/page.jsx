"use client";
import { useEffect, useState, Suspense } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

const C = {
  navy: "#0F2442", navyMid: "#1A3F6F", blue: "#2471A3",
  green: "#16A34A", greenDark: "#0F6B30", greenLight: "#ECFDF5",
  surface: "#F7F9FC", border: "#E4EAF4", muted: "#8A96B0", text: "#1C2B4A",
};

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
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C.surface, fontFamily: "'Sora', sans-serif" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <div style={{ width: 36, height: 36, border: `3px solid ${C.border}`, borderTopColor: C.green, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <span style={{ fontSize: "0.84rem", color: C.muted, fontWeight: 600 }}>Lädt...</span>
      </div>
    </div>
  );

  if (!fachkraft) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C.surface, fontFamily: "'Sora', sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "2rem", marginBottom: 12 }}>🔍</div>
        <div style={{ fontWeight: 700, color: C.text }}>Profil nicht gefunden.</div>
      </div>
    </div>
  );

  const displayName = fachkraft.username || `${fachkraft.vorname || ""} ${fachkraft.nachname || ""}`.trim();
  const initials = fachkraft.username ? "?" : (`${fachkraft.vorname?.[0] || ""}${fachkraft.nachname?.[0] || ""}`).toUpperCase() || "?";

  const InfoRow = ({ label, value }) => value ? (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "10px 0", borderBottom: `1px solid ${C.border}`, gap: 12 }}>
      <span style={{ fontSize: "0.78rem", fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.4px", flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: "0.87rem", color: C.text, fontWeight: 600, textAlign: "right" }}>{value}</span>
    </div>
  ) : null;

  return (
    <div style={{ minHeight: "100vh", background: C.surface, fontFamily: "'Sora', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Fraunces:wght@700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { -webkit-font-smoothing: antialiased; }
        .chip { display: inline-flex; align-items: center; gap: 5px; padding: 4px 12px; border-radius: 99px; font-size: 0.73rem; font-weight: 600; background: rgba(255,255,255,0.15); color: rgba(255,255,255,0.9); }
      `}</style>

      {/* Header */}
      <header style={{ background: "rgba(247,249,252,0.9)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${C.border}`, padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
        <a href="/" style={{ textDecoration: "none" }}>
          <span style={{ fontFamily: "'Fraunces', serif", fontSize: "1.3rem", fontWeight: 800, color: C.navy }}>Kita</span>
          <span style={{ fontFamily: "'Fraunces', serif", fontSize: "1.3rem", fontWeight: 800, color: C.green }}>Bridge</span>
        </a>
        <a href="/login" style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 9, border: `1.5px solid ${C.border}`, background: "white", color: C.muted, fontSize: "0.82rem", fontWeight: 600, textDecoration: "none" }}>
          Einloggen
        </a>
      </header>

      <div style={{ maxWidth: 620, margin: "0 auto", padding: "28px 16px" }}>

        {/* Hero card — green gradient */}
        <div style={{ background: `linear-gradient(135deg, ${C.greenDark} 0%, ${C.green} 55%, #22C55E 100%)`, borderRadius: 24, padding: "28px 28px 24px", marginBottom: 16, position: "relative", overflow: "hidden", boxShadow: "0 16px 48px rgba(22,163,74,0.3)" }}>
          <div style={{ position: "absolute", top: -60, right: -60, width: 220, height: 220, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -40, left: "35%", width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />

          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 18, position: "relative" }}>
            <div style={{ width: 62, height: 62, borderRadius: 18, background: "rgba(255,255,255,0.18)", border: "2px solid rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", fontWeight: 800, color: "white", flexShrink: 0 }}>
              {initials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: "1.35rem", fontWeight: 800, color: "white", lineHeight: 1.15 }}>{displayName}</div>
              {fachkraft.username && <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.5)", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", marginTop: 2 }}>Anonym-Modus</div>}
              <div style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.7)", marginTop: 3 }}>{fachkraft.qualifikation || "Pädagogische Fachkraft"}</div>
            </div>
            <div style={{ background: fachkraft.status === "bestaetigt" ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 99, padding: "5px 13px", fontSize: "0.68rem", fontWeight: 800, color: "white", textTransform: "uppercase", letterSpacing: "0.5px", whiteSpace: "nowrap", flexShrink: 0 }}>
              {fachkraft.status === "bestaetigt" ? "✓ Verifiziert" : "⏳ In Prüfung"}
            </div>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, position: "relative" }}>
            {fachkraft.wohnort && <span className="chip">📍 {fachkraft.wohnort}</span>}
            {fachkraft.bundesland && <span className="chip">🗺 {fachkraft.bundesland}</span>}
            {fachkraft.arbeitszeit && <span className="chip">⚡ {fachkraft.arbeitszeit}</span>}
            {fachkraft.erfahrung_jahre && <span className="chip">⭐ {fachkraft.erfahrung_jahre} Jahre</span>}
            {fachkraft.verfuegbar_ab && <span className="chip">📅 ab {new Date(fachkraft.verfuegbar_ab).toLocaleDateString("de-DE", { month: "long", year: "numeric" })}</span>}
          </div>
        </div>

        {/* Status banner */}
        <div style={{ background: fachkraft.aktiv_suchend ? C.greenLight : "#F9FAFB", border: `1.5px solid ${fachkraft.aktiv_suchend ? "#A7F3D0" : C.border}`, borderRadius: 14, padding: "12px 18px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: fachkraft.aktiv_suchend ? C.green : C.muted, flexShrink: 0 }} />
          <span style={{ fontSize: "0.86rem", fontWeight: 700, color: fachkraft.aktiv_suchend ? "#065F46" : C.muted }}>
            {fachkraft.aktiv_suchend ? "Aktiv auf Jobsuche" : "Derzeit nicht auf Jobsuche"}
          </span>
        </div>

        {/* Qualifikationen */}
        <div style={{ background: "white", borderRadius: 18, padding: "20px 22px", marginBottom: 16, border: `1.5px solid ${C.border}` }}>
          <div style={{ fontSize: "0.68rem", fontWeight: 800, color: C.muted, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 14 }}>Qualifikation & Erfahrung</div>
          <InfoRow label="Qualifikation" value={fachkraft.qualifikation} />
          <InfoRow label="Zusatz" value={fachkraft.zusatzqualifikation} />
          <InfoRow label="Hochschule" value={fachkraft.uniabschluss} />
          <InfoRow label="Altersgruppe" value={Array.isArray(fachkraft.kita_alter) ? fachkraft.kita_alter.join(", ") : fachkraft.kita_alter} />
        </div>

        {/* Sprachen */}
        {(fachkraft.deutsch || fachkraft.englisch || fachkraft.weitere_sprachen) && (
          <div style={{ background: "white", borderRadius: 18, padding: "20px 22px", marginBottom: 16, border: `1.5px solid ${C.border}` }}>
            <div style={{ fontSize: "0.68rem", fontWeight: 800, color: C.muted, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 14 }}>Sprachen</div>
            <InfoRow label="Deutsch" value={fachkraft.deutsch} />
            {fachkraft.englisch && fachkraft.englisch !== "Keine" && <InfoRow label="Englisch" value={fachkraft.englisch} />}
            <InfoRow label="Weitere" value={fachkraft.weitere_sprachen} />
          </div>
        )}

        {/* Über mich */}
        {fachkraft.beschreibung && (
          <div style={{ background: "white", borderRadius: 18, padding: "20px 22px", marginBottom: 16, border: `1.5px solid ${C.border}` }}>
            <div style={{ fontSize: "0.68rem", fontWeight: 800, color: C.muted, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 12 }}>Über mich</div>
            <p style={{ color: "#4B5563", lineHeight: 1.75, fontSize: "0.9rem" }}>{fachkraft.beschreibung}</p>
          </div>
        )}

        {/* CTA für Kitas */}
        <div style={{ background: `linear-gradient(135deg, ${C.navy} 0%, ${C.navyMid} 100%)`, borderRadius: 18, padding: "22px 24px", textAlign: "center" }}>
          <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.55)", marginBottom: 8, fontWeight: 600 }}>Sie sind eine Kita und suchen Fachkräfte?</div>
          <a href="/arbeitgeber/registrieren" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 24px", background: C.green, color: "white", borderRadius: 11, fontWeight: 700, fontSize: "0.88rem", textDecoration: "none" }}>
            Jetzt registrieren
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </a>
        </div>
      </div>
    </div>
  );
}

export default function FachkraftVisitenkarte() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F7F9FC" }}>
        <div style={{ width: 36, height: 36, border: "3px solid #E4EAF4", borderTopColor: "#16A34A", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    }>
      <FachkraftVisitenkarteInner />
    </Suspense>
  );
}