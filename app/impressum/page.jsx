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
          <h1 style={{ fontFamily: "'Playfair Display', serif", color: NAVY, fontSize: "2rem", marginBottom: 32 }}>Impressum</h1>

          <h2 style={{ color: NAVY, fontSize: "1.1rem", marginBottom: 12 }}>Angaben gemäß § 5 TMG</h2>
          <p style={{ color: "#444", lineHeight: 1.8, marginBottom: 24 }}>
            Jennefer Rahman<br/>
            Heusenstammer Weg 69<br/>
            63071 Offenbach am Main<br/>
            Deutschland
          </p>

          <h2 style={{ color: NAVY, fontSize: "1.1rem", marginBottom: 12 }}>Kontakt</h2>
          <p style={{ color: "#444", lineHeight: 1.8, marginBottom: 24 }}>
            E-Mail: <a href="mailto:kitabridge@protonmail.com" style={{ color: BLUE }}>kitabridge@protonmail.com</a>
          </p>

          <h2 style={{ color: NAVY, fontSize: "1.1rem", marginBottom: 12 }}>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
          <p style={{ color: "#444", lineHeight: 1.8, marginBottom: 24 }}>
            Jennefer Rahman<br/>
            Heusenstammer Weg 69<br/>
            63071 Offenbach am Main
          </p>

          <h2 style={{ color: NAVY, fontSize: "1.1rem", marginBottom: 12 }}>Haftungsausschluss</h2>
          <p style={{ color: "#444", lineHeight: 1.8, marginBottom: 24 }}>
            Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.
          </p>

          <h2 style={{ color: NAVY, fontSize: "1.1rem", marginBottom: 12 }}>Urheberrecht</h2>
          <p style={{ color: "#444", lineHeight: 1.8, marginBottom: 24 }}>
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
          </p>

          <div style={{ marginTop: 40, paddingTop: 24, borderTop: "1px solid #E8EDF4", display: "flex", gap: 24 }}>
            <a href="/datenschutz" style={{ color: BLUE, textDecoration: "none", fontSize: "0.85rem", fontWeight: 600 }}>Datenschutzerklärung</a>
            <a href="/agb" style={{ color: BLUE, textDecoration: "none", fontSize: "0.85rem", fontWeight: 600 }}>AGB</a>
          </div>
        </div>
      </div>
    </div>
  );
}
