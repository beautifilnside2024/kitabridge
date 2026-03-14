"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

const C = {
  navy: "#0F2442", navyMid: "#1A3F6F", blue: "#2471A3",
  green: "#16A34A", surface: "#F7F9FC", border: "#E4EAF4", muted: "#8A96B0", text: "#1C2B4A",
};

function WartePage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(135deg, #EEF2F8 0%, #F7F9FC 50%, #EAF0F8 100%)`, fontFamily: "'Sora', sans-serif", display: "flex", flexDirection: "column" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Fraunces:wght@700;800&display=swap'); *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }`}</style>

      <header style={{ background: "rgba(247,249,252,0.9)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${C.border}`, padding: "0 24px", height: 60, display: "flex", alignItems: "center" }}>
        <a href="/" style={{ textDecoration: "none" }}>
          <span style={{ fontFamily: "'Fraunces', serif", fontSize: "1.3rem", fontWeight: 800, color: C.navy }}>Kita</span>
          <span style={{ fontFamily: "'Fraunces', serif", fontSize: "1.3rem", fontWeight: 800, color: C.green }}>Bridge</span>
        </a>
      </header>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 20px" }}>
        <div style={{ background: "white", borderRadius: 24, padding: "48px 36px", maxWidth: 480, width: "100%", border: `1.5px solid ${C.border}`, boxShadow: "0 8px 40px rgba(15,36,66,0.1)", textAlign: "center" }}>

          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: "2rem" }}>
            🌱
          </div>

          <div style={{ fontFamily: "'Fraunces', serif", fontSize: "1.6rem", fontWeight: 800, color: C.text, marginBottom: 12, lineHeight: 1.2 }}>
            Registrierung erfolgreich!
          </div>

          <div style={{ color: C.muted, fontSize: "0.9rem", lineHeight: 1.8, marginBottom: 28 }}>
            Vielen Dank für Ihr Interesse an KitaBridge. Wir sammeln derzeit noch Fachkräfte für unseren Pool.
            <br /><br />
            Sobald <strong style={{ color: C.navyMid }}>5.000 Fachkräfte</strong> registriert sind, werden wir Sie unter
            {email && <strong style={{ color: C.navyMid }}> {email}</strong>} sofort benachrichtigen.
          </div>

          <div style={{ background: "#EFF6FF", border: "1.5px solid #BFDBFE", borderRadius: 14, padding: "16px 20px", marginBottom: 28 }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 800, color: C.blue, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8 }}>Was passiert als nächstes?</div>
            {[
              "Ihr Account ist bereits angelegt",
              "Wir sammeln 5.000 Fachkräfte",
              "Sie erhalten eine E-Mail wenn es losgeht",
              "Dann können Sie sofort suchen & kontaktieren",
            ].map((step, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8, textAlign: "left" }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: C.navyMid, color: "white", fontSize: "0.7rem", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
                <div style={{ fontSize: "0.84rem", color: C.text, lineHeight: 1.5 }}>{step}</div>
              </div>
            ))}
          </div>

          <a href="/" style={{ display: "block", padding: "13px", borderRadius: 12, background: C.navyMid, color: "white", fontWeight: 700, fontSize: "0.9rem", textDecoration: "none" }}>
            Zurück zur Startseite
          </a>

          <div style={{ marginTop: 16, fontSize: "0.78rem", color: C.muted }}>
            Fragen? <a href="mailto:hallo@kitabridge.com" style={{ color: C.blue, fontWeight: 600, textDecoration: "none" }}>hallo@kitabridge.com</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Warteliste() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Lädt...</div>}>
      <WartePage />
    </Suspense>
  );
}