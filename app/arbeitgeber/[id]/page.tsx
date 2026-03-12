"use client";
import { useEffect, useState, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

const NAVY = "#1A3F6F";
const BLUE = "#2471A3";

function VisitenkartePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const anfrage_id = searchParams.get("anfrage");
  const [ag, setAg] = useState<any>(null);
  const [anfrage, setAnfrage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    // Prüfe ob gültige Anfrage existiert
    if (!anfrage_id) { setError("Kein Zugriff."); setLoading(false); return; }

    const { data: anfrageData } = await supabase
      .from("anfragen")
      .select("*")
      .eq("id", anfrage_id)
      .single();

    if (!anfrageData) { setError("Ungültige Anfrage."); setLoading(false); return; }
    setAnfrage(anfrageData);

    const { data: agData } = await supabase
      .from("arbeitgeber")
      .select("*")
      .eq("id", params.id)
      .single();

    if (!agData) { setError("Einrichtung nicht gefunden."); setLoading(false); return; }
    setAg(agData);
    setLoading(false);
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F0F4F9" }}>
      <div style={{ color: NAVY, fontFamily: "'DM Sans', sans-serif" }}>Lädt...</div>
    </div>
  );

  if (error) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F0F4F9" }}>
      <div style={{ background: "white", borderRadius: 16, padding: 40, textAlign: "center", maxWidth: 400 }}>
        <div style={{ fontSize: "3rem", marginBottom: 16 }}>🔒</div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", color: NAVY, marginBottom: 8 }}>Kein Zugriff</div>
        <div style={{ color: "#9BA8C0", fontSize: "0.88rem" }}>Diese Visitenkarte ist nur über eine direkte Anfrage zugänglich.</div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(135deg, ${NAVY} 0%, ${BLUE} 100%)`, fontFamily: "'DM Sans', sans-serif", padding: "40px 20px" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap'); * { box-sizing: border-box; }`}</style>

      <div style={{ maxWidth: 560, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <a href="/" style={{ textDecoration: "none", fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 700 }}>
            <span style={{ color: "white" }}>Kita</span><span style={{ color: "#4ADE80" }}>Bridge</span>
          </a>
        </div>

        {/* Karte */}
        <div style={{ background: "white", borderRadius: 24, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>

          {/* Top Banner */}
          <div style={{ background: `linear-gradient(135deg, ${NAVY}, ${BLUE})`, padding: "32px 32px 24px", color: "white" }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: 2, opacity: 0.7, marginBottom: 12 }}>
              Visitenkarte
            </div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 800, marginBottom: 8 }}>
              {ag.einrichtung_name}
            </div>
            <div style={{ opacity: 0.8, fontSize: "0.9rem", display: "flex", gap: 16, flexWrap: "wrap" }}>
              {ag.einrichtungstyp && <span>🏫 {ag.einrichtungstyp}</span>}
              {ag.traeger && <span>🏛 {ag.traeger}</span>}
            </div>
          </div>

          {/* Body */}
          <div style={{ padding: 32 }}>

            {/* Anfrage Nachricht */}
            {anfrage?.nachricht && (
              <div style={{ background: "#F0F7FF", border: "1px solid #BFDBFE", borderRadius: 12, padding: 16, marginBottom: 24 }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: BLUE, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                  📩 Nachricht von {ag.ansprech_name || ag.einrichtung_name}
                </div>
                <div style={{ color: "#374151", fontSize: "0.9rem", lineHeight: 1.7 }}>
                  {anfrage.nachricht}
                </div>
              </div>
            )}

            {/* Infos */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
              {[
                { icon: "📍", label: "Standort", value: ag.plz && ag.ort ? `${ag.plz} ${ag.ort}` : ag.ort },
                { icon: "🗺", label: "Bundesland", value: ag.bundesland },
                { icon: "👥", label: "Offene Stellen", value: ag.stellen_anzahl },
                { icon: "👤", label: "Ansprechpartner", value: ag.ansprech_name },
              ].filter(i => i.value).map(item => (
                <div key={item.label} style={{ background: "#F8FAFF", borderRadius: 12, padding: 14 }}>
                  <div style={{ fontSize: "1.2rem", marginBottom: 6 }}>{item.icon}</div>
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#9BA8C0", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>{item.label}</div>
                  <div style={{ fontSize: "0.88rem", color: NAVY, fontWeight: 600 }}>{item.value}</div>
                </div>
              ))}
            </div>

            {/* Beschreibung */}
            {ag.beschreibung && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#9BA8C0", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Über uns</div>
                <div style={{ color: "#374151", fontSize: "0.9rem", lineHeight: 1.7 }}>{ag.beschreibung}</div>
              </div>
            )}

            {/* Kontakt */}
            {(ag.telefon || ag.email) && (
              <div style={{ background: `linear-gradient(135deg, ${NAVY}, ${BLUE})`, borderRadius: 16, padding: 20, color: "white" }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, opacity: 0.7, marginBottom: 12 }}>Kontakt</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {ag.telefon && (
                    <a href={`tel:${ag.telefon}`} style={{ color: "white", textDecoration: "none", fontSize: "0.9rem", display: "flex", gap: 10, alignItems: "center" }}>
                      <span>📞</span> {ag.telefon}
                    </a>
                  )}
                  {ag.email && (
                    <a href={`mailto:${ag.email}`} style={{ color: "white", textDecoration: "none", fontSize: "0.9rem", display: "flex", gap: 10, alignItems: "center" }}>
                      <span>✉️</span> {ag.email}
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 20, color: "rgba(255,255,255,0.5)", fontSize: "0.78rem" }}>
          Diese Visitenkarte wurde über KitaBridge geteilt
        </div>
      </div>
    </div>
  );
}

export default function ArbeitgeberVisitenkarte() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Lädt...</div>}>
      <VisitenkartePage />
    </Suspense>
  );
}
