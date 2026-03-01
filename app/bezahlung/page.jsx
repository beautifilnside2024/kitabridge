"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const NAVY = "#1A3F6F";
const BLUE = "#2471A3";

function BezahlungInner() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();

  const arbeitgeber_id = searchParams.get("id");
  const email = searchParams.get("email");
  const einrichtung_name = searchParams.get("name");

  const handleBezahlen = async () => {
    setLoading(true);
    setError("");

    if (!arbeitgeber_id || !email) {
      setError("Keine Registrierungsdaten gefunden. Bitte erneut registrieren.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ arbeitgeber_id, email, einrichtung_name }),
      });

      const result = await response.json();

      if (result.url) {
        window.location.href = result.url;
      } else {
        setError("Fehler beim Starten der Zahlung: " + (result.error || "Unbekannter Fehler"));
      }
    } catch (err) {
      setError("Ein unerwarteter Fehler ist aufgetreten: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4F9", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif", padding: "24px" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap'); * { box-sizing: border-box; }`}</style>

      <div style={{ background: "white", borderRadius: 20, boxShadow: "0 4px 24px rgba(26,63,111,0.10)", padding: 40, maxWidth: 480, width: "100%", textAlign: "center" }}>

        {/* Logo */}
        <a href="/" style={{ textDecoration: "none", fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 700, display: "block", marginBottom: 28 }}>
          <span style={{ color: NAVY }}>Kita</span><span style={{ color: "#4ADE80" }}>Bridge</span>
        </a>

        {/* Header */}
        <div style={{ fontSize: "3rem", marginBottom: 12 }}>🎉</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", color: NAVY, margin: "0 0 8px" }}>
          Registrierung erfolgreich!
        </h1>
        {einrichtung_name && (
          <p style={{ color: "#9BA8C0", fontSize: "0.88rem", margin: "0 0 24px" }}>
            {decodeURIComponent(einrichtung_name)}
          </p>
        )}
        <p style={{ color: "#6B7897", fontSize: "0.92rem", margin: "0 0 28px", lineHeight: 1.6 }}>
          Nur noch ein Schritt – aktivieren Sie Ihren Account mit dem Monatsabo.
        </p>

        {/* Preis Box */}
        <div style={{ background: "#F0F7FF", border: "2px solid #BFDBFE", borderRadius: 16, padding: 24, marginBottom: 24, textAlign: "left" }}>
          <div style={{ fontSize: "0.75rem", fontWeight: 700, color: BLUE, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>KitaBridge Arbeitgeber</div>
          <div style={{ fontSize: "2.5rem", fontWeight: 800, color: NAVY, lineHeight: 1 }}>
            299 €<span style={{ fontSize: "1rem", fontWeight: 400, color: "#6B7897" }}> / Monat</span>
          </div>
          <div style={{ fontSize: "0.78rem", color: "#9BA8C0", marginBottom: 16 }}>zzgl. MwSt. · Monatlich kündbar</div>
          <div style={{ height: 1, background: "#BFDBFE", marginBottom: 16 }} />
          {["✅ Zugang zur Fachkräfte-Datenbank","✅ Direktkontakt zu allen Fachkräften","✅ Unbegrenzte Suche & Filter","✅ Keine Provision","✅ Monatlich kündbar"].map(f => (
            <div key={f} style={{ fontSize: "0.88rem", color: "#374151", marginBottom: 8 }}>{f}</div>
          ))}
        </div>

        {/* Fehler */}
        {error && (
          <div style={{ background: "#FFF5F5", border: "1px solid #FED7D7", color: "#DC2626", padding: "12px 16px", borderRadius: 10, fontSize: "0.88rem", marginBottom: 16, textAlign: "left" }}>
            ⚠️ {error}
          </div>
        )}

        {/* Button */}
        <button
          onClick={handleBezahlen}
          disabled={loading}
          style={{ width: "100%", background: loading ? "#9BA8C0" : NAVY, color: "white", border: "none", padding: "16px", borderRadius: 12, fontWeight: 700, fontSize: "1rem", cursor: loading ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif", marginBottom: 12 }}
        >
          {loading ? "Weiterleitung zu Stripe..." : "Jetzt bezahlen →"}
        </button>

        <p style={{ fontSize: "0.78rem", color: "#9BA8C0", margin: 0 }}>
          Sie werden zu Stripe weitergeleitet – sicher & verschlüsselt 🔒
        </p>
      </div>
    </div>
  );
}

export default function BezahlungPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Lädt...</div>}>
      <BezahlungInner />
    </Suspense>
  );
}
