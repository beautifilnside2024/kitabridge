"use client";

const NAVY = "#1A3F6F";
const BLUE = "#2471A3";
const GREEN = "#1E8449";

export default function Datenschutz() {
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
          <h1 style={{ fontFamily: "'Playfair Display', serif", color: NAVY, fontSize: "2rem", marginBottom: 8 }}>Datenschutzerklärung</h1>
          <p style={{ color: "#9BA8C0", fontSize: "0.85rem", marginBottom: 32 }}>Stand: Februar 2026</p>

          <h2 style={{ color: NAVY, fontSize: "1.1rem", marginBottom: 12 }}>1. Verantwortlicher</h2>
          <p style={{ color: "#444", lineHeight: 1.8, marginBottom: 24 }}>
            Jennefer Rahman<br/>
            Heusenstammer Weg 69<br/>
            63071 Offenbach am Main<br/>
            E-Mail: <a href="mailto:kitabridge@protonmail.com" style={{ color: BLUE }}>kitabridge@protonmail.com</a>
          </p>

          <h2 style={{ color: NAVY, fontSize: "1.1rem", marginBottom: 12 }}>2. Erhebung und Verarbeitung personenbezogener Daten</h2>
          <p style={{ color: "#444", lineHeight: 1.8, marginBottom: 24 }}>
            Wir erheben und verarbeiten personenbezogene Daten nur, soweit dies zur Bereitstellung unserer Dienstleistungen erforderlich ist. Dies umfasst insbesondere Name, E-Mail-Adresse, Telefonnummer sowie berufliche Qualifikationen und Kontaktdaten, die Sie bei der Registrierung angeben.
          </p>

          <h2 style={{ color: NAVY, fontSize: "1.1rem", marginBottom: 12 }}>3. Zweck der Datenverarbeitung</h2>
          <p style={{ color: "#444", lineHeight: 1.8, marginBottom: 24 }}>
            Die von Ihnen angegebenen Daten werden ausschließlich zur Vermittlung zwischen Fachkräften und Kita-Einrichtungen verwendet. Fachkräfte-Profile werden nur für verifizierte Arbeitgeber sichtbar gemacht. Eine Weitergabe an Dritte erfolgt nicht.
          </p>

          <h2 style={{ color: NAVY, fontSize: "1.1rem", marginBottom: 12 }}>4. Rechtsgrundlage</h2>
          <p style={{ color: "#444", lineHeight: 1.8, marginBottom: 24 }}>
            Die Verarbeitung Ihrer Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung) sowie Art. 6 Abs. 1 lit. a DSGVO (Einwilligung).
          </p>

          <h2 style={{ color: NAVY, fontSize: "1.1rem", marginBottom: 12 }}>5. Datenspeicherung</h2>
          <p style={{ color: "#444", lineHeight: 1.8, marginBottom: 24 }}>
            Ihre Daten werden auf Servern von Supabase (supabase.com) gespeichert, die sich in der EU befinden. Supabase ist DSGVO-konform.
          </p>

          <h2 style={{ color: NAVY, fontSize: "1.1rem", marginBottom: 12 }}>6. Ihre Rechte</h2>
          <p style={{ color: "#444", lineHeight: 1.8, marginBottom: 24 }}>
            Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung Ihrer personenbezogenen Daten. Wenden Sie sich dazu an: <a href="mailto:kitabridge@protonmail.com" style={{ color: BLUE }}>kitabridge@protonmail.com</a>
          </p>

          <h2 style={{ color: NAVY, fontSize: "1.1rem", marginBottom: 12 }}>7. Cookies</h2>
          <p style={{ color: "#444", lineHeight: 1.8, marginBottom: 24 }}>
            Unsere Website verwendet technisch notwendige Cookies für die Authentifizierung. Es werden keine Tracking- oder Marketing-Cookies eingesetzt.
          </p>

          <h2 style={{ color: NAVY, fontSize: "1.1rem", marginBottom: 12 }}>8. Kontakt Datenschutz</h2>
          <p style={{ color: "#444", lineHeight: 1.8, marginBottom: 24 }}>
            Bei Fragen zum Datenschutz wenden Sie sich an: <a href="mailto:kitabridge@protonmail.com" style={{ color: BLUE }}>kitabridge@protonmail.com</a>
          </p>

          <div style={{ marginTop: 40, paddingTop: 24, borderTop: "1px solid #E8EDF4", display: "flex", gap: 24 }}>
            <a href="/impressum" style={{ color: BLUE, textDecoration: "none", fontSize: "0.85rem", fontWeight: 600 }}>Impressum</a>
            <a href="/agb" style={{ color: BLUE, textDecoration: "none", fontSize: "0.85rem", fontWeight: 600 }}>AGB</a>
          </div>
        </div>
      </div>
    </div>
  );
}
