"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";

const C = {
  navy: "#0F2442", navyMid: "#1A3F6F", blue: "#2471A3",
  green: "#16A34A", surface: "#F7F9FC", border: "#E4EAF4", muted: "#8A96B0", text: "#1C2B4A",
};

function ErfolgInner() {
  const [countdown, setCountdown] = useState(5);
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(timer); router.push("/dashboard"); }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #EEF2F8 0%, #F7F9FC 50%, #EAF0F8 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Sora', sans-serif", padding: "24px 16px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Fraunces:wght@700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { -webkit-font-smoothing: antialiased; }
        @keyframes pop { 0% { transform: scale(0.8); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div style={{ width: "100%", maxWidth: 440 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <a href="/" style={{ textDecoration: "none" }}>
            <span style={{ fontFamily: "'Fraunces', serif", fontSize: "1.8rem", fontWeight: 800, color: C.navy }}>Kita</span>
            <span style={{ fontFamily: "'Fraunces', serif", fontSize: "1.8rem", fontWeight: 800, color: C.green }}>Bridge</span>
          </a>
        </div>

        {/* Card */}
        <div style={{ background: "white", borderRadius: 24, padding: "36px 28px", border: `1.5px solid ${C.border}`, boxShadow: "0 8px 40px rgba(15,36,66,0.1)", textAlign: "center" }}>

          {/* Icon */}
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#ECFDF5", border: "2px solid #A7F3D0", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: "2rem", animation: "pop 0.4s ease-out" }}>
            🎉
          </div>

          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "1.6rem", fontWeight: 800, color: C.text, marginBottom: 8 }}>
            Zahlung erfolgreich!
          </h1>
          <p style={{ color: C.muted, fontSize: "0.88rem", lineHeight: 1.7, marginBottom: 24 }}>
            Herzlich willkommen bei KitaBridge!<br />Ihr Account ist jetzt aktiv.
          </p>

          {/* Status box */}
          <div style={{ background: "#ECFDF5", border: "1.5px solid #A7F3D0", borderRadius: 14, padding: "16px 18px", marginBottom: 24, textAlign: "left" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.green, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <span style={{ fontWeight: 800, color: "#065F46", fontSize: "0.9rem" }}>Account aktiviert</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                "Voller Zugang zur Fachkräfte-Datenbank",
                "Stripe schickt Ihnen eine Rechnung per E-Mail",
                "Monatlich kündbar im Dashboard",
              ].map(item => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.82rem", color: "#065F46" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={() => router.push("/dashboard")}
            style={{ width: "100%", background: C.navyMid, color: "white", border: "none", padding: "14px", borderRadius: 12, fontWeight: 700, fontSize: "0.95rem", cursor: "pointer", fontFamily: "'Sora', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 14 }}
          >
            Zum Dashboard
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>

          {/* Countdown */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: "0.78rem", color: C.muted }}>
            <div style={{ width: 16, height: 16, border: `2px solid ${C.border}`, borderTopColor: C.muted, borderRadius: "50%", animation: "spin 1s linear infinite" }} />
            Automatische Weiterleitung in {countdown} Sekunden
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

export default function BezahlungErfolgPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F7F9FC" }}>
        <div style={{ width: 36, height: 36, border: "3px solid #E4EAF4", borderTopColor: "#1A3F6F", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    }>
      <ErfolgInner />
    </Suspense>
  );
}