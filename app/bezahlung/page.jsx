"use client";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

const C = {
  navy: "#0F2442", navyMid: "#1A3F6F", blue: "#2471A3",
  green: "#16A34A", surface: "#F7F9FC", border: "#E4EAF4", muted: "#8A96B0", text: "#1C2B4A",
};

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
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #EEF2F8 0%, #F7F9FC 50%, #EAF0F8 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Sora', sans-serif", padding: "24px 16px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Fraunces:wght@700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { -webkit-font-smoothing: antialiased; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div style={{ width: "100%", maxWidth: 460 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <a href="/" style={{ textDecoration: "none" }}>
            <span style={{ fontFamily: "'Fraunces', serif", fontSize: "1.8rem", fontWeight: 800, color: C.navy }}>Kita</span>
            <span style={{ fontFamily: "'Fraunces', serif", fontSize: "1.8rem", fontWeight: 800, color: C.green }}>Bridge</span>
          </a>
        </div>

        {/* Card */}
        <div style={{ background: "white", borderRadius: 24, padding: "32px 28px", border: `1.5px solid ${C.border}`, boxShadow: "0 8px 40px rgba(15,36,66,0.1)" }}>

          {/* Success header */}
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#ECFDF5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: "1.8rem" }}>🎉</div>
            <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "1.5rem", fontWeight: 800, color: C.text, marginBottom: 6 }}>
              Registrierung erfolgreich!
            </h1>
            {einrichtung_name && (
              <div style={{ fontSize: "0.84rem", color: C.muted, fontWeight: 600 }}>
                {decodeURIComponent(einrichtung_name)}
              </div>
            )}
          </div>

          <p style={{ color: C.muted, fontSize: "0.88rem", lineHeight: 1.7, textAlign: "center", marginBottom: 24 }}>
            Nur noch ein Schritt — aktivieren Sie Ihren Account mit dem Monatsabo.
          </p>

          {/* Pricing box */}
          <div style={{ background: `linear-gradient(135deg, ${C.navy} 0%, ${C.navyMid} 60%, #1B5E98 100%)`, borderRadius: 18, padding: "22px 24px", marginBottom: 24, color: "white", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -40, right: -40, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
            <div style={{ fontSize: "0.65rem", fontWeight: 800, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8 }}>KitaBridge Arbeitgeber</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6, marginBottom: 4 }}>
              <span style={{ fontFamily: "'Fraunces', serif", fontSize: "2.2rem", fontWeight: 800, lineHeight: 1 }}>299 €</span>
              <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.55)", marginBottom: 4 }}>/ Monat</span>
            </div>
            <div style={{ fontSize: "0.73rem", color: "rgba(255,255,255,0.45)", marginBottom: 18 }}>zzgl. MwSt. · Monatlich kündbar</div>
            <div style={{ height: 1, background: "rgba(255,255,255,0.1)", marginBottom: 16 }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                "Zugang zur Fachkräfte-Datenbank",
                "Direktkontakt zu allen Fachkräften",
                "Unbegrenzte Suche & Filter",
                "Keine Provision",
                "Monatlich kündbar",
              ].map(f => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: "0.83rem", color: "rgba(255,255,255,0.8)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  {f}
                </div>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{ background: "#FFF5F5", border: "1px solid #FED7D7", color: "#9B1C1C", padding: "12px 15px", borderRadius: 10, fontSize: "0.84rem", marginBottom: 16 }}>
              {error}
            </div>
          )}

          {/* CTA Button */}
          <button
            onClick={handleBezahlen}
            disabled={loading}
            style={{ width: "100%", background: loading ? C.border : C.navyMid, color: loading ? C.muted : "white", border: "none", padding: "14px", borderRadius: 12, fontWeight: 700, fontSize: "0.95rem", cursor: loading ? "not-allowed" : "pointer", fontFamily: "'Sora', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.15s", marginBottom: 12 }}
          >
            {loading ? (
              <>
                <div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                Weiterleitung zu Stripe...
              </>
            ) : (
              <>
                Jetzt bezahlen
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </>
            )}
          </button>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: "0.75rem", color: C.muted }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Sie werden zu Stripe weitergeleitet — sicher &amp; verschlüsselt
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 20, fontSize: "0.75rem", color: C.muted }}>
          <a href="/datenschutz" style={{ color: C.muted, textDecoration: "none", marginRight: 12 }}>Datenschutz</a>
          <a href="/impressum" style={{ color: C.muted, textDecoration: "none" }}>Impressum</a>
        </div>
      </div>
    </div>
  );
}

export default function BezahlungPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F7F9FC" }}>
        <div style={{ width: 36, height: 36, border: "3px solid #E4EAF4", borderTopColor: "#1A3F6F", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    }>
      <BezahlungInner />
    </Suspense>
  );
}