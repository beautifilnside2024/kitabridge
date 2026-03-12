"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";

const NAVY = "#1A3F6F";
const BLUE = "#2471A3";
const GREEN = "#1E8449";

function ErfolgInner() {
  const [countdown, setCountdown] = useState(5);
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/dashboard");
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4F9", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif", padding: "24px" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap'); * { box-sizing: border-box; }`}</style>

      <div style={{ background: "white", borderRadius: 20, boxShadow: "0 4px 24px rgba(26,63,111,0.10)", padding: 40, maxWidth: 480, width: "100%", textAlign: "center" }}>

        <a href="/" style={{ textDecoration: "none", fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 700, display: "block", marginBottom: 28 }}>
          <span style={{ color: NAVY }}>Kita</span><span style={{ color: "#4ADE80" }}>Bridge</span>
        </a>

        <div style={{ fontSize: "4rem", marginBottom: 16 }}>🎉</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", color: NAVY, margin: "0 0 12px" }}>
          Zahlung erfolgreich!
        </h1>
        <p style={{ color: "#6B7897", fontSize: "0.92rem", margin: "0 0 24px", lineHeight: 1.6 }}>
          Herzlich willkommen bei KitaBridge! Ihr Account ist jetzt aktiv.
        </p>

        <div style={{ background: "#EAF7EF", border: "1px solid #BBF7D0", borderRadius: 12, padding: 16, marginBottom: 24 }}>
          <div style={{ color: GREEN, fontWeight: 700, fontSize: "0.9rem", marginBottom: 4 }}>✅ Account aktiviert</div>
          <div style={{ color: "#444", fontSize: "0.85rem", lineHeight: 1.6 }}>
            Sie haben jetzt vollen Zugang zur Fachkräfte-Datenbank.<br />
            Stripe schickt Ihnen eine Rechnung per E-Mail.
          </div>
        </div>

        <button
          onClick={() => router.push("/dashboard")}
          style={{ width: "100%", background: `linear-gradient(135deg, ${NAVY}, ${BLUE})`, color: "white", border: "none", padding: "16px", borderRadius: 12, fontWeight: 700, fontSize: "1rem", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginBottom: 12 }}
        >
          Zum Dashboard →
        </button>

        <p style={{ fontSize: "0.78rem", color: "#9BA8C0", margin: 0 }}>
          Automatische Weiterleitung in {countdown} Sekunden...
        </p>
      </div>
    </div>
  );
}

export default function BezahlungErfolgPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Lädt...</div>}>
      <ErfolgInner />
    </Suspense>
  );
}
