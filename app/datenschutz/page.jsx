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

          {/* 1 */}
          <h2 style={{ color: NAVY, fontSize: "1.1rem", marginBottom: 12 }}>1. Verantwortlicher</h2>
          <p style={{ color: "#444", lineHeight: 1.8, marginBottom: 24 }}>
            Jennefer Rahman<br/>
            Heusenstammer Weg 69<br/>
            63071 Offenbach am Main<br/>
            E-Mail: <a href="mailto:hallo@kitabridge.com" style={{ color: BLUE }}>hallo@kitabridge.com</a>
          </p>

          {/* 2 */}
          <h2 style={{ color: NAVY, fontSize: "1.1rem", marginBottom: 12 }}>2. Erhebung und Verarbeitung personenbezogener Daten</h2>
          <p style={{ color: "#444", lineHeight: 1.8, marginBottom: 12 }}>
            Wir erheben und verarbeiten personenbezogene Daten nur, soweit dies zur Bereitstellung unserer Dienstleistungen erforderlich ist und eine Rechtsgrundlage nach der DSGVO vorliegt. Dies umfasst insbesondere:
          </p>
          <ul style={{ color: "#444", lineHeight: 2, marginBottom: 24, paddingLeft: 24 }}>
            <li>Name und Vorname</li>
            <li>E-Mail-Adresse</li>
            <li>Telefonnummer</li>
            <li>Berufliche Qualifikationen, Zertifikate und Kontaktdaten, die Sie bei der Registrierung angeben</li>
            <li>Technische Nutzungsdaten (z. B. IP-Adresse, Browser-Typ, Zugriffszeiten) – soweit technisch erforderlich</li>
          </ul>

          {/* 3 */}
          <h2 style={{ color: NAVY, fontSize: "1.1rem", marginBottom: 12 }}>3. Zweck der Datenverarbeitung</h2>
          <p style={{ color: "#444", lineHeight: 1.8, marginBottom: 24 }}>
            Die von Ihnen angegebenen Daten werden ausschließlich für folgende Zwecke verwendet:
          </p>
          <ul style={{ color: "#444", lineHeight: 2, marginBottom: 24, paddingLeft: 24 }}>
            <li>Vermittlung zwischen pädagogischen Fachkräften und Kita-Einrichtungen</li>
            <li>Bereitstellung und Verwaltung Ihres Nutzerkontos</li>
            <li>Kommunikation im Rahmen der Plattformnutzung</li>
          </ul>
          <p style={{ color: "#444", lineHeight: 1.8, marginBottom: 24 }}>
            Fachkräfte-Profile werden ausschließlich für verifizierte Arbeitgeber sichtbar gemacht. Eine Weitergabe an unbefugte Dritte erfolgt nicht.
          </p>

          {/* 4 */}
          <h2 style={{ color: NAVY, fontSize: "1.1rem", marginBottom: 12 }}>4. Rechtsgrundlage</h2>
          <p style={{ color: "#444", lineHeight: 1.8, marginBottom: 12 }}>
            Die Verarbeitung Ihrer Daten erfolgt auf Grundlage der folgenden Rechtsgrundlagen der DSGVO:
          </p>
          <ul style={{ color: "#444", lineHeight: 2, marginBottom: 24, paddingLeft: 24 }}>
            <li><strong>Art. 6 Abs. 1 lit. b DSGVO</strong> – Verarbeitung zur Erfüllung eines Vertrags oder vorvertraglicher Maßnahmen</li>
            <li><strong>Art. 6 Abs. 1 lit. a DSGVO</strong> – Verarbeitung auf Grundlage Ihrer ausdrücklichen Einwilligung</li>
            <li><strong>Art. 6 Abs. 1 lit. f DSGVO</strong> – Verarbeitung zur Wahrung berechtigter Interessen (z. B. IT-Sicherheit, Missbrauchsprävention)</li>
          </ul>

          {/* 5 */}
          <h2 style={{ color: NAVY, fontSize: "1.1rem", marginBottom: 12 }}>5. Datenspeicherung und Drittanbieter</h2>
          <p style={{ color: "#444", lineHeight: 1.8, marginBottom: 24 }}>
            Ihre Daten werden auf Servern von <strong>Supabase</strong> (<a href="https://supabase.com" target="_blank" rel="noopener noreferrer" style={{ color: BLUE }}>supabase.com</a>) gespeichert. Die Server befinden sich innerhalb der Europäischen Union. Supabase verarbeitet Daten gemäß der DSGVO und stellt entsprechende Garantien durch einen Auftragsverarbeitungsvertrag (AVV) bereit.
          </p>
          <p style={{ color: "#444", lineHeight: 1.8, marginBottom: 24 }}>
            Eine Übermittlung Ihrer Daten in Drittländer außerhalb der EU findet nicht statt, sofern keine ausdrückliche Einwilligung vorliegt oder eine gesetzliche Verpflichtung besteht.
          </p>

          {/* 6 */}
          <h2 style={{ color: NAVY, fontSize: "1.1rem", marginBottom: 12 }}>6. Speicherdauer</h2>
          <p style={{ color: "#444", lineHeight: 1.8, marginBottom: 24 }}>
            Ihre personenbezogenen Daten werden nur so lange gespeichert, wie es für die Erfüllung der genannten Zwecke erforderlich ist oder gesetzliche Aufbewahrungspflichten bestehen. Nach Löschung Ihres Kontos werden Ihre Daten innerhalb von 30 Tagen unwiderruflich gelöscht, sofern keine gesetzlichen Aufbewahrungsfristen entgegenstehen.
          </p>

          {/* 7 */}
          <h2 style={{ color: NAVY, fontSize: "1.1rem", marginBottom: 12 }}>7. Ihre Rechte</h2>
          <p style={{ color: "#444", lineHeight: 1.8, marginBottom: 12 }}>
            Als betroffene Person haben Sie gegenüber uns folgende Rechte:
          </p>
          <ul style={{ color: "#444", lineHeight: 2, marginBottom: 12, paddingLeft: 24 }}>
            <li><strong>Auskunft</strong> (Art. 15 DSGVO) – Sie können Auskunft über die von uns gespeicherten Daten verlangen.</li>
            <li><strong>Berichtigung</strong> (Art. 16 DSGVO) – Sie können die Korrektur unrichtiger Daten verlangen.</li>
            <li><strong>Löschung</strong> (Art. 17 DSGVO) – Sie können die Löschung Ihrer Daten verlangen („Recht auf Vergessenwerden").</li>
            <li><strong>Einschränkung der Verarbeitung</strong> (Art. 18 DSGVO) – Sie können die Einschränkung der Verarbeitung verlangen.</li>
            <li><strong>Datenübertragbarkeit</strong> (Art. 20 DSGVO) – Sie können Ihre Daten in einem gängigen Format erhalten.</li>
            <li><strong>Widerspruch</strong> (Art. 21 DSGVO) – Sie können der Verarbeitung Ihrer Daten jederzeit widersprechen.</li>
            <li><strong>Widerruf der Einwilligung</strong> (Art. 7 Abs. 3 DSGVO) – Eine erteilte Einwilligung kann jederzeit ohne Angabe von Gründen widerrufen werden.</li>
          </ul>
          <p style={{ color: "#444", lineHeight: 1.8, marginBottom: 12 }}>
            Zur Ausübung Ihrer Rechte wenden Sie sich bitte an:{" "}
            <a href="mailto:hallo@kitabridge.com" style={{ color: BLUE }}>hallo@kitabridge.com</a>
          </p>
          <p style={{ color: "#444", lineHeight: 1.8, marginBottom: 24 }}>
            Zusätzlich haben Sie das Recht, sich bei der zuständigen Datenschutz-Aufsichtsbehörde zu beschweren. In Hessen ist dies der{" "}
            <a href="https://datenschutz.hessen.de" target="_blank" rel="noopener noreferrer" style={{ color: BLUE }}>
              Hessische Beauftragte für Datenschutz und Informationsfreiheit (HBDI)
            </a>.
          </p>

          {/* 8 */}
          <h2 style={{ color: NAVY, fontSize: "1.1rem", marginBottom: 12 }}>8. Cookies</h2>
          <p style={{ color: "#444", lineHeight: 1.8, marginBottom: 24 }}>
            Unsere Website verwendet ausschließlich technisch notwendige Cookies, die für die Authentifizierung und den sicheren Betrieb der Plattform erforderlich sind. Diese Cookies werden nicht für Tracking- oder Werbezwecke eingesetzt und erfordern keine gesonderte Einwilligung gemäß § 25 Abs. 2 TTDSG.
          </p>

          {/* 9 */}
          <h2 style={{ color: NAVY, fontSize: "1.1rem", marginBottom: 12 }}>9. Datensicherheit</h2>
          <p style={{ color: "#444", lineHeight: 1.8, marginBottom: 24 }}>
            Wir setzen technische und organisatorische Maßnahmen ein, um Ihre Daten gegen unbefugten Zugriff, Verlust oder Manipulation zu schützen. Die Übertragung erfolgt verschlüsselt über HTTPS/TLS.
          </p>

          {/* 10 */}
          <h2 style={{ color: NAVY, fontSize: "1.1rem", marginBottom: 12 }}>10. Kontakt Datenschutz</h2>
          <p style={{ color: "#444", lineHeight: 1.8, marginBottom: 24 }}>
            Bei Fragen zum Datenschutz oder zur Ausübung Ihrer Rechte wenden Sie sich an:{" "}
            <a href="mailto:hallo@kitabridge.com" style={{ color: BLUE }}>hallo@kitabridge.com</a>
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