"use client";

const NAVY = "#1A3F6F";
const BLUE = "#2471A3";
const GREEN = "#1E8449";

export default function Impressum() {
  return (
    <div style={{ minHeight: "100vh", background: "#F0F4F9", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap'); * { box-sizing: border-box; }`}</style>

      <div style={{ background: "white", borderBottom: "1px solid #E8EDF4", padding: "16px 40px" }}>
        <a href="/" style={{ textDecoration: "none", fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 700 }}>
          <span style={{ color: NAVY }}>Kita</span><span style={{ color: GREEN }}>Bridge</span>
        </a>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ background: "white", borderRadius: 24, padding: 48, boxShadow: "0 2px 12px rgba(26,63,111,0.08)" }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", color: NAVY, fontSize: "2rem", marginBottom: 8 }}>Impressum</h1>
          <p style={{ color: "#9BA8C0", fontSize: "0.85rem", marginBottom: 32 }}>Angaben gemäß § 5 TMG</p>

          <h2 style={{ color: NAVY, fontSize: "1.1rem", marginBottom: 12 }}>Anbieter</h2>
          <p style={{ color: "#444", lineHeight: 1.8, marginBottom: 24 }}>
            KitaBridge<br/>
            Inhaber: Jennefer Rahman<br/>
            Heusenstammer Weg 69<br/>
            63071 Offenbach am Main<br/>
            Deutschland
          </p>

          <h2 style={{ color: NAVY, fontSize: "1.1rem", marginBottom: 12 }}>Kontakt</h2>
          <p style={{ color: "#444", lineHeight: 1.8, marginBottom: 24 }}>
            Telefon: <a href="tel:+4969853104" style={{ color: BLUE }}>069 853104</a><br/>
            E-Mail: <a href="mailto:hallo@kitabridge.com" style={{ color: BLUE }}>hallo@kitabridge.com</a>
          </p>

          <h2 style={{ color: NAVY, fontSize: "1.1rem", marginBottom: 12 }}>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
          <p style={{ color: "#444", lineHeight: 1.8, marginBottom: 24 }}>
            Jennefer Rahman<br/>
            Heusenstammer Weg 69<br/>
            63071 Offenbach am Main
          </p>

          <h2 style={{ color: NAVY, fontSize: "1.1rem", marginBottom: 12 }}>Haftungsausschluss</h2>
          <p style={{ color: "#444", lineHeight: 1.8, marginBottom: 24 }}>
            Die Inhalte dieser Website wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte kann jedoch keine Gewähr übernommen werden. Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen.
          </p>

          <h2 style={{ color: NAVY, fontSize: "1.1rem", marginBottom: 12 }}>Urheberrecht</h2>
          <p style={{ color: "#444", lineHeight: 1.8, marginBottom: 24 }}>
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung der Inhaberin. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.
          </p>

          <div style={{ marginTop: 40, paddingTop: 24, borderTop: "1px solid #E8EDF4", display: "flex", gap: 24 }}>
            <a href="/datenschutz" style={{ color: BLUE, textDecoration: "none", fontSize: "0.85rem", fontWeight: 600 }}>Datenschutz</a>
            <a href="/agb" style={{ color: BLUE, textDecoration: "none", fontSize: "0.85rem", fontWeight: 600 }}>AGB</a>
          </div>
        </div>
      </div>
    </div>
  );
}