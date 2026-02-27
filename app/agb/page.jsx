"use client";

const NAVY = "#1A3F6F";
const BLUE = "#2471A3";
const GREEN = "#1E8449";

export default function AGB() {
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
          <h1 style={{ fontFamily: "'Playfair Display', serif", color: NAVY, fontSize: "2rem", marginBottom: 8 }}>Allgemeine Geschäftsbedingungen</h1>
          <p style={{ color: "#9BA8C0", fontSize: "0.85rem", marginBottom: 32 }}>Stand: Februar 2026</p>

          <h2 style={{ color: NAVY, fontSize: "1.1rem", marginBottom: 12 }}>§ 1 Geltungsbereich</h2>
          <p style={{ color: "#444", lineHeight: 1.8, marginBottom: 24 }}>
            Diese AGB gelten für alle Nutzer der Plattform KitaBridge (kitabridge.vercel.app), betrieben von Jennefer Rahman, Heusenstammer Weg 69, 63067 Offenbach am Main.
          </p>

          <h2 style={{ color: NAVY, fontSize: "1.1rem", marginBottom: 12 }}>§ 2 Leistungsbeschreibung</h2>
          <p style={{ color: "#444", lineHeight: 1.8, marginBottom: 24 }}>
            KitaBridge ist eine Online-Plattform zur Vermittlung von pädagogischen Fachkräften an Kindertageseinrichtungen. Die Plattform ermöglicht Fachkräften die kostenlose Registrierung und Arbeitgebern die kostenpflichtige Suche nach geeignetem Personal.
          </p>

          <h2 style={{ color: NAVY, fontSize: "1.1rem", marginBottom: 12 }}>§ 3 Registrierung und Nutzerkonto</h2>
          <p style={{ color: "#444", lineHeight: 1.8, marginBottom: 24 }}>
            Die Registrierung auf KitaBridge ist kostenlos für Fachkräfte. Arbeitgeber zahlen eine monatliche Gebühr von 299 EUR zzgl. MwSt. Bei der Registrierung sind wahrheitsgemäße Angaben zu machen. KitaBridge behält sich das Recht vor, Profile zu prüfen und ggf. abzulehnen.
          </p>

          <h2 style={{ color: NAVY, fontSize: "1.1rem", marginBottom: 12 }}>§ 4 Preise und Zahlung</h2>
          <p style={{ color: "#444", lineHeight: 1.8, marginBottom: 24 }}>
            Der Zugang zur Fachkräfte-Datenbank für Arbeitgeber kostet 299 EUR pro Monat zzgl. der gesetzlichen Mehrwertsteuer. Das Abonnement ist monatlich kündbar. Eine Provision für vermittelte Stellen wird nicht erhoben.
          </p>

          <h2 style={{ color: NAVY, fontSize: "1.1rem", marginBottom: 12 }}>§ 5 Pflichten der Nutzer</h2>
          <p style={{ color: "#444", lineHeight: 1.8, marginBottom: 24 }}>
            Nutzer verpflichten sich, keine falschen Angaben zu machen, keine rechtswidrigen Inhalte zu veröffentlichen und die Kontaktdaten von Fachkräften ausschließlich für legitime Einstellungszwecke zu verwenden.
          </p>

          <h2 style={{ color: NAVY, fontSize: "1.1rem", marginBottom: 12 }}>§ 6 Haftungsbeschränkung</h2>
          <p style={{ color: "#444", lineHeight: 1.8, marginBottom: 24 }}>
            KitaBridge übernimmt keine Garantie für den Erfolg einer Vermittlung. Die Plattform haftet nicht für die Richtigkeit der von Nutzern eingegebenen Daten. KitaBridge ist lediglich Vermittler und wird nicht Partei des Arbeitsverhältnisses.
          </p>

          <h2 style={{ color: NAVY, fontSize: "1.1rem", marginBottom: 12 }}>§ 7 Kündigung</h2>
          <p style={{ color: "#444", lineHeight: 1.8, marginBottom: 24 }}>
            Nutzer können ihr Konto jederzeit durch Kontaktaufnahme per E-Mail kündigen. Arbeitgeber-Abonnements können monatlich zum Ende des Abrechnungszeitraums gekündigt werden.
          </p>

          <h2 style={{ color: NAVY, fontSize: "1.1rem", marginBottom: 12 }}>§ 8 Anwendbares Recht</h2>
          <p style={{ color: "#444", lineHeight: 1.8, marginBottom: 24 }}>
            Es gilt deutsches Recht. Gerichtsstand ist Offenbach am Main.
          </p>

          <h2 style={{ color: NAVY, fontSize: "1.1rem", marginBottom: 12 }}>§ 9 Kontakt</h2>
          <p style={{ color: "#444", lineHeight: 1.8, marginBottom: 24 }}>
            Bei Fragen zu diesen AGB wenden Sie sich an: <a href="mailto:kitabridge@protonmail.com" style={{ color: BLUE }}>kitabridge@protonmail.com</a>
          </p>

          <div style={{ marginTop: 40, paddingTop: 24, borderTop: "1px solid #E8EDF4", display: "flex", gap: 24 }}>
            <a href="/impressum" style={{ color: BLUE, textDecoration: "none", fontSize: "0.85rem", fontWeight: 600 }}>Impressum</a>
            <a href="/datenschutz" style={{ color: BLUE, textDecoration: "none", fontSize: "0.85rem", fontWeight: 600 }}>Datenschutzerklärung</a>
          </div>
        </div>
      </div>
    </div>
  );
}
