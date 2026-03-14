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

          {/* § 1 */}
          <h2 style={{ color: NAVY, fontSize: "1.1rem", marginBottom: 12 }}>§ 1 Geltungsbereich</h2>
          <p style={{ color: "#444", lineHeight: 1.8, marginBottom: 24 }}>
            Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Nutzer der Online-Plattform KitaBridge, erreichbar unter <a href="https://www.kitabridge.com" style={{ color: BLUE }}>www.kitabridge.com</a>, betrieben von:
          </p>
          <p style={{ color: "#444", lineHeight: 1.8, marginBottom: 24 }}>
            KitaBridge, Inhaber: Jennefer Rahman<br/>
            Heusenstammer Weg 69<br/>
            63071 Offenbach am Main<br/>
            E-Mail: <a href="mailto:hallo@kitabridge.com" style={{ color: BLUE }}>hallo@kitabridge.com</a>
          </p>
          <p style={{ color: "#444", lineHeight: 1.8, marginBottom: 24 }}>
            Mit der Registrierung oder Nutzung der Plattform erkennen Sie diese AGB an. Abweichende Bedingungen der Nutzer werden nicht anerkannt, es sei denn, KitaBridge stimmt diesen ausdrücklich schriftlich zu.
          </p>

          {/* § 2 */}
          <h2 style={{ color: NAVY, fontSize: "1.1rem", marginBottom: 12 }}>§ 2 Leistungsbeschreibung</h2>
          <p style={{ color: "#444", lineHeight: 1.8, marginBottom: 24 }}>
            KitaBridge ist eine Online-Plattform zur Vermittlung von pädagogischen Fachkräften an Kindertageseinrichtungen (Kitas) und vergleichbare Einrichtungen. Die Plattform bietet:
          </p>
          <ul style={{ color: "#444", lineHeight: 2, marginBottom: 24, paddingLeft: 24 }}>
            <li>Fachkräften: kostenlose Registrierung und Erstellung eines persönlichen Profils</li>
            <li>Arbeitgebern (Kitas, Träger): kostenpflichtigen Zugang zur Fachkräfte-Datenbank</li>
          </ul>
          <p style={{ color: "#444", lineHeight: 1.8, marginBottom: 24 }}>
            KitaBridge ist ausschließlich Vermittler und wird nicht Vertragspartei eines etwaigen Arbeitsverhältnisses zwischen Fachkraft und Arbeitgeber. Es besteht kein Anspruch auf das Zustandekommen eines Arbeitsverhältnisses.
          </p>

          {/* § 3 */}
          <h2 style={{ color: NAVY, fontSize: "1.1rem", marginBottom: 12 }}>§ 3 Registrierung und Nutzerkonto</h2>
          <p style={{ color: "#444", lineHeight: 1.8, marginBottom: 12 }}>
            Die Registrierung auf KitaBridge setzt voraus:
          </p>
          <ul style={{ color: "#444", lineHeight: 2, marginBottom: 24, paddingLeft: 24 }}>
            <li>Vollständige und wahrheitsgemäße Angaben bei der Registrierung</li>
            <li>Volljährigkeit (mind. 18 Jahre) bzw. Vertretungsberechtigung bei juristischen Personen</li>
            <li>Akzeptanz dieser AGB sowie der Datenschutzerklärung</li>
          </ul>
          <p style={{ color: "#444", lineHeight: 1.8, marginBottom: 24 }}>
            KitaBridge behält sich das Recht vor, Registrierungen ohne Angabe von Gründen abzulehnen oder bestehende Konten bei Verstößen gegen diese AGB zu sperren oder zu löschen. Zugangsdaten sind vertraulich zu behandeln und dürfen nicht an Dritte weitergegeben werden.
          </p>

          {/* § 4 */}
          <h2 style={{ color: NAVY, fontSize: "1.1rem", marginBottom: 12 }}>§ 4 Preise und Zahlung</h2>
          <p style={{ color: "#444", lineHeight: 1.8, marginBottom: 12 }}>
            Für Arbeitgeber gilt folgendes Preismodell:
          </p>
          <ul style={{ color: "#444", lineHeight: 2, marginBottom: 24, paddingLeft: 24 }}>
            <li>Monatlicher Zugang zur Fachkräfte-Datenbank: <strong>299,00 EUR zzgl. der gesetzlichen Mehrwertsteuer</strong></li>
            <li>Das Abonnement verlängert sich automatisch um einen weiteren Monat, sofern es nicht fristgerecht gekündigt wird</li>
            <li>Eine Vermittlungsprovision wird nicht erhoben</li>
          </ul>
          <p style={{ color: "#444", lineHeight: 1.8, marginBottom: 24 }}>
            Die Zahlung erfolgt im Voraus per Rechnung oder einem weiteren angebotenen Zahlungsmittel. Bei Zahlungsverzug behält sich KitaBridge vor, den Zugang bis zum Ausgleich der offenen Forderung zu sperren.
          </p>

          {/* § 5 */}
          <h2 style={{ color: NAVY, fontSize: "1.1rem", marginBottom: 12 }}>§ 5 Pflichten der Nutzer</h2>
          <p style={{ color: "#444", lineHeight: 1.8, marginBottom: 12 }}>
            Alle Nutzer verpflichten sich:
          </p>
          <ul style={{ color: "#444", lineHeight: 2, marginBottom: 24, paddingLeft: 24 }}>
            <li>Ausschließlich wahrheitsgemäße und aktuelle Angaben zu machen</li>
            <li>Keine rechtswidrigen, diskriminierenden oder irreführenden Inhalte zu veröffentlichen</li>
            <li>Kontaktdaten von Fachkräften ausschließlich für legitime Einstellungszwecke zu verwenden</li>
            <li>Die Plattform nicht für Spam, Werbung oder automatisierte Zugriffe zu missbrauchen</li>
            <li>Keine Inhalte zu veröffentlichen, die Rechte Dritter (z. B. Urheberrecht, Persönlichkeitsrecht) verletzen</li>
          </ul>
          <p style={{ color: "#444", lineHeight: 1.8, marginBottom: 24 }}>
            Bei Verstößen gegen diese Pflichten ist KitaBridge berechtigt, das betreffende Konto ohne vorherige Ankündigung zu sperren und ggf. rechtliche Schritte einzuleiten.
          </p>

          {/* § 6 */}
          <h2 style={{ color: NAVY, fontSize: "1.1rem", marginBottom: 12 }}>§ 6 Verfügbarkeit und Gewährleistung</h2>
          <p style={{ color: "#444", lineHeight: 1.8, marginBottom: 24 }}>
            KitaBridge ist bemüht, die Plattform dauerhaft und störungsfrei bereitzustellen, übernimmt jedoch keine Garantie für eine ununterbrochene Verfügbarkeit. Wartungsarbeiten, technische Störungen oder höhere Gewalt können zu vorübergehenden Einschränkungen führen. KitaBridge übernimmt keine Garantie für den Erfolg einer Vermittlung und haftet nicht für die Richtigkeit der von Nutzern eingegebenen Daten.
          </p>

          {/* § 7 */}
          <h2 style={{ color: NAVY, fontSize: "1.1rem", marginBottom: 12 }}>§ 7 Haftungsbeschränkung</h2>
          <p style={{ color: "#444", lineHeight: 1.8, marginBottom: 24 }}>
            KitaBridge haftet unbeschränkt bei Vorsatz und grober Fahrlässigkeit sowie bei Verletzung von Leben, Körper und Gesundheit. Im Übrigen haftet KitaBridge nur bei der Verletzung wesentlicher Vertragspflichten (Kardinalpflichten), deren Erfüllung die ordnungsgemäße Durchführung des Vertrags überhaupt erst ermöglicht. In diesen Fällen ist die Haftung auf den vertragstypisch vorhersehbaren Schaden begrenzt. Eine weitergehende Haftung ist ausgeschlossen.
          </p>

          {/* § 8 */}
          <h2 style={{ color: NAVY, fontSize: "1.1rem", marginBottom: 12 }}>§ 8 Kündigung</h2>
          <p style={{ color: "#444", lineHeight: 1.8, marginBottom: 24 }}>
            Alle Nutzer – sowohl Fachkräfte als auch Arbeitgeber – können ihr Konto jederzeit durch Selbstlöschung in den Einstellungen kündigen. Mit der Löschung des Accounts endet die Nutzungsberechtigung. Bereits gezahlte Beträge für den laufenden Abrechnungszeitraum werden nicht erstattet.
          </p>

          {/* § 9 */}
          <h2 style={{ color: NAVY, fontSize: "1.1rem", marginBottom: 12 }}>§ 9 Datenschutz</h2>
          <p style={{ color: "#444", lineHeight: 1.8, marginBottom: 24 }}>
            Die Erhebung und Verarbeitung personenbezogener Daten erfolgt gemäß unserer <a href="/datenschutz" style={{ color: BLUE }}>Datenschutzerklärung</a>, die Bestandteil dieser AGB ist.
          </p>

          {/* § 10 */}
          <h2 style={{ color: NAVY, fontSize: "1.1rem", marginBottom: 12 }}>§ 10 Änderungen der AGB</h2>
          <p style={{ color: "#444", lineHeight: 1.8, marginBottom: 24 }}>
            KitaBridge behält sich vor, diese AGB mit einer Ankündigungsfrist von mindestens 30 Tagen zu ändern. Änderungen werden per E-Mail oder durch einen deutlichen Hinweis auf der Plattform mitgeteilt. Widerspricht ein Nutzer den geänderten AGB nicht innerhalb von 30 Tagen nach Bekanntgabe, gelten die neuen AGB als akzeptiert. Auf dieses Widerspruchsrecht wird im Rahmen der Ankündigung ausdrücklich hingewiesen.
          </p>

          {/* § 11 */}
          <h2 style={{ color: NAVY, fontSize: "1.1rem", marginBottom: 12 }}>§ 11 Anwendbares Recht und Gerichtsstand</h2>
          <p style={{ color: "#444", lineHeight: 1.8, marginBottom: 24 }}>
            Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts (CISG). Gerichtsstand für alle Streitigkeiten aus oder im Zusammenhang mit diesen AGB ist Offenbach am Main, sofern der Nutzer Kaufmann, juristische Person des öffentlichen Rechts oder öffentlich-rechtliches Sondervermögen ist. Verbraucher können auch am allgemeinen Gerichtsstand ihres Wohnsitzes klagen.
          </p>

          {/* § 12 */}
          <h2 style={{ color: NAVY, fontSize: "1.1rem", marginBottom: 12 }}>§ 12 Salvatorische Klausel</h2>
          <p style={{ color: "#444", lineHeight: 1.8, marginBottom: 24 }}>
            Sollten einzelne Bestimmungen dieser AGB unwirksam oder undurchführbar sein oder werden, bleibt die Wirksamkeit der übrigen Bestimmungen davon unberührt. Die unwirksame Bestimmung wird durch eine wirksame ersetzt, die dem wirtschaftlichen Zweck der unwirksamen Bestimmung am nächsten kommt.
          </p>

          {/* § 13 – NEU: Faire Nutzung & Hinweisgebersystem */}
          <h2 style={{ color: NAVY, fontSize: "1.1rem", marginBottom: 12 }}>§ 13 Faire Nutzung und Hinweisgebersystem</h2>
          <p style={{ color: "#444", lineHeight: 1.8, marginBottom: 16 }}>
            <strong>Account-Bindung an eine Einrichtung:</strong> Ein Account bei KitaBridge berechtigt ausschließlich zur Nutzung für eine einzige Einrichtung an einem Standort. Die Weitergabe von Zugangsdaten sowie die Nutzung eines Accounts für mehrere Einrichtungen, Standorte oder Träger ist ausdrücklich untersagt. Bei einem Verstoß ist KitaBridge berechtigt, den Account ohne Vorankündigung und ohne Rückerstattung bereits geleisteter Zahlungen zu sperren. Darüber hinaus behält sich KitaBridge das Recht vor, entstandene Schäden geltend zu machen.
          </p>
          <p style={{ color: "#444", lineHeight: 1.8, marginBottom: 24 }}>
            <strong>Hinweisgebersystem für Fachkräfte:</strong> Als registrierte Fachkraft auf KitaBridge bist du Teil einer fairen und vertrauensvollen Community. Wenn eine Einrichtung dich über KitaBridge kontaktiert und dabei Stellen in anderen Einrichtungen anbietet, die nicht dem registrierten Account entsprechen, bitten wir dich, dies umgehend an{" "}
            <a href="mailto:hallo@kitabridge.de" style={{ color: BLUE }}>hallo@kitabridge.de</a> zu melden. Gleiches gilt für jegliches Verhalten, das gegen die fairen Nutzungsbedingungen von KitaBridge verstößt. Deine Meldung hilft uns, die Plattform fair und sicher für alle zu halten. Alle Hinweise werden vertraulich behandelt.
          </p>

          {/* § 14 (ehem. § 13) */}
          <h2 style={{ color: NAVY, fontSize: "1.1rem", marginBottom: 12 }}>§ 14 Kontakt</h2>
          <p style={{ color: "#444", lineHeight: 1.8, marginBottom: 24 }}>
            Bei Fragen zu diesen AGB wenden Sie sich an:{" "}
            <a href="mailto:hallo@kitabridge.com" style={{ color: BLUE }}>hallo@kitabridge.com</a>
          </p>

          <div style={{ marginTop: 40, paddingTop: 24, borderTop: "1px solid #E8EDF4", display: "flex", gap: 24 }}>
            <a href="/impressum" style={{ color: BLUE, textDecoration: "none", fontSize: "0.85rem", fontWeight: 600 }}>Impressum</a>
            <a href="/datenschutz" style={{ color: BLUE, textDecoration: "none", fontSize: "0.85rem", fontWeight: 600 }}>Datenschutz</a>
          </div>
        </div>
      </div>
    </div>
  );
}