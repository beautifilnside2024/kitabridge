"use client";

import { useParams } from "next/navigation";

const NAVY = "#1A3F6F";
const GREEN = "#1E8449";
const BLUE = "#2471A3";

const stadtDaten: Record<string, { name: string; bundesland: string; kitas: number; desc: string }> = {
  berlin: { name: "Berlin", bundesland: "Berlin", kitas: 3200, desc: "Als Bundeshauptstadt hat Berlin eine der höchsten Nachfragen nach pädagogischen Fachkräften in ganz Deutschland." },
  hamburg: { name: "Hamburg", bundesland: "Hamburg", kitas: 1800, desc: "Hamburg wächst schnell – und mit der Stadt wächst der Bedarf an qualifizierten Erzieherinnen und Erziehern in Kitas und sozialen Einrichtungen." },
  münchen: { name: "München", bundesland: "Bayern", kitas: 1600, desc: "München ist eine der teuersten Städte Deutschlands – aber auch eine der attraktivsten für Fachkräfte mit guten Gehältern und Lebensqualität." },
  frankfurt: { name: "Frankfurt", bundesland: "Hessen", kitas: 1100, desc: "Frankfurt am Main ist ein internationales Zentrum mit hohem Bedarf an mehrsprachigen pädagogischen Fachkräften." },
  köln: { name: "Köln", bundesland: "Nordrhein-Westfalen", kitas: 1400, desc: "Köln ist eine der größten Städte NRWs mit einem stark wachsenden Bedarf an Kita-Fachkräften." },
  stuttgart: { name: "Stuttgart", bundesland: "Baden-Württemberg", kitas: 900, desc: "Stuttgart und die Region suchen dringend qualifizierte Erzieherinnen, Sozialpädagogen und Heilpädagogen." },
  düsseldorf: { name: "Düsseldorf", bundesland: "Nordrhein-Westfalen", kitas: 950, desc: "Düsseldorf als Landeshauptstadt NRWs bietet viele attraktive Stellen für pädagogische Fachkräfte." },
  leipzig: { name: "Leipzig", bundesland: "Sachsen", kitas: 700, desc: "Leipzig wächst rasant – die Nachfrage nach Kita-Fachkräften steigt jedes Jahr." },
  nürnberg: { name: "Nürnberg", bundesland: "Bayern", kitas: 650, desc: "Nürnberg und die Metropolregion suchen qualifizierte Fachkräfte für Kitas, Krippen und soziale Einrichtungen." },
  bremen: { name: "Bremen", bundesland: "Bremen", kitas: 500, desc: "Bremen bietet gute Arbeitsbedingungen für pädagogische Fachkräfte in einem überschaubaren aber lebendigen Stadtumfeld." },
};

export default function StadtPage() {
  const params = useParams();
  const rawStadt = params?.stadt;
  const stadtKey = typeof rawStadt === "string" ? rawStadt.toLowerCase() : Array.isArray(rawStadt) ? rawStadt[0].toLowerCase() : "";
  const stadt = stadtDaten[stadtKey];

  if (!stadtKey || !stadt) {
    return (
      <div style={{ fontFamily: "'DM Sans', sans-serif", textAlign: "center", padding: "100px 20px" }}>
        <h1 style={{ color: NAVY }}>Stadt nicht gefunden</h1>
        <a href="/" style={{ color: GREEN }}>Zur Startseite</a>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#fff" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');`}</style>

      <nav style={{ background: "#fff", borderBottom: "1px solid #E8EDF4", height: 68, display: "flex", alignItems: "center", padding: "0 40px" }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700 }}>
            <span style={{ color: NAVY }}>Kita</span><span style={{ color: GREEN }}>Bridge</span>
          </span>
        </a>
      </nav>

      <section style={{ background: `linear-gradient(160deg, #F0F4F9 0%, #E8F4FD 50%, #EAF7EF 100%)`, padding: "80px 40px 60px", textAlign: "center" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 900, color: NAVY, lineHeight: 1.15, marginBottom: 20 }}>
            Kita Job in {stadt.name} –<br/><span style={{ color: GREEN }}>Jetzt kostenlos registrieren</span>
          </h1>
          <p style={{ fontSize: "1.1rem", color: "#6B7897", lineHeight: 1.75, maxWidth: 600, margin: "0 auto 36px" }}>
            {stadt.desc}
          </p>
          <a href="/Registrieren" style={{ display: "inline-block", padding: "16px 40px", borderRadius: 50, background: `linear-gradient(135deg, ${GREEN}, #27AE60)`, color: "white", fontWeight: 700, fontSize: "1rem", textDecoration: "none", boxShadow: "0 6px 24px rgba(30,132,73,0.3)" }}>
            Jetzt kostenlos registrieren →
          </a>
          <div style={{ display: "flex", justifyContent: "center", gap: 32, marginTop: 40, flexWrap: "wrap" }}>
            {[["🎓", "100% kostenlos"], ["⚡", "In 5 Min. fertig"], ["🏙️", `${stadt.kitas}+ Kitas in ${stadt.name}`]].map(([icon, text]) => (
              <div key={text as string} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: "1.2rem" }}>{icon}</span>
                <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#6B7897" }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "80px 40px", background: "#fff" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 800, color: NAVY, textAlign: "center", marginBottom: 48 }}>
            So findest du deinen Kita Job in {stadt.name}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 24 }}>
            {[
              { num: "01", icon: "📝", title: "Profil erstellen", desc: `Registriere dich kostenlos in 5 Minuten mit deinen Qualifikationen und Wunsch-Arbeitszeit in ${stadt.name}.` },
              { num: "02", icon: "🔍", title: "Gefunden werden", desc: `Kitas in ${stadt.name} sehen dein Profil und kontaktieren dich direkt.` },
              { num: "03", icon: "🤝", title: "Job starten", desc: "Kein Vermittler, keine Provision. Du kommunizierst direkt mit der Einrichtung." },
            ].map(step => (
              <div key={step.num} style={{ background: "#F8FAFF", borderRadius: 20, padding: 28, textAlign: "center" }}>
                <div style={{ fontSize: "2rem", marginBottom: 12 }}>{step.icon}</div>
                <div style={{ fontSize: "0.7rem", fontWeight: 800, color: GREEN, letterSpacing: 2, marginBottom: 8 }}>{step.num}</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: NAVY, marginBottom: 10 }}>{step.title}</h3>
                <p style={{ color: "#6B7897", fontSize: "0.85rem", lineHeight: 1.7 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "80px 40px", background: `linear-gradient(135deg, ${NAVY} 0%, ${BLUE} 100%)`, textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.2rem", fontWeight: 800, color: "white", marginBottom: 16 }}>
            Bereit für deinen Job in {stadt.name}?
          </h2>
          <a href="/Registrieren" style={{ display: "inline-block", padding: "16px 40px", borderRadius: 50, background: `linear-gradient(135deg, ${GREEN}, #27AE60)`, color: "white", fontWeight: 700, fontSize: "1rem", textDecoration: "none" }}>
            Jetzt kostenlos registrieren →
          </a>
        </div>
      </section>

      <footer style={{ background: "#0D1B2A", color: "rgba(255,255,255,0.5)", padding: "32px 40px", textAlign: "center" }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, marginBottom: 12 }}>
          <span style={{ color: "white" }}>Kita</span><span style={{ color: GREEN }}>Bridge</span>
        </div>
        <p style={{ fontSize: "0.75rem" }}>© 2026 KitaBridge · DSGVO-konform</p>
      </footer>
    </div>
  );
}
