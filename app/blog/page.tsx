"use client";
import Link from "next/link";

const posts = [
  {
    slug: "kita-job-finden-ohne-anschreiben",
    title: "Kita Job finden ohne Anschreiben – so geht's 2026",
    excerpt: "Viele Fachkräfte scheuen den Bewerbungsprozess wegen Anschreiben und Lebenslauf. Wir zeigen, wie es einfacher geht.",
    date: "10. März 2026",
    category: "Für Fachkräfte",
    readTime: "4 min",
  },
  {
    slug: "erzieherinnen-finden-kita",
    title: "Erzieherinnen finden: So besetzen Kitas offene Stellen schnell",
    excerpt: "Der Fachkräftemangel ist real – aber es gibt Wege, qualifizierte Erzieherinnen und Erzieher schnell zu finden.",
    date: "10. März 2026",
    category: "Für Arbeitgeber",
    readTime: "5 min",
  },
  {
    slug: "fachkraeftemangel-kitas-2026",
    title: "Fachkräftemangel in Kitas 2026 – Was Einrichtungen jetzt tun können",
    excerpt: "Der Mangel an pädagogischen Fachkräften wächst. Was steckt dahinter – und was können Einrichtungen konkret tun?",
    date: "10. März 2026",
    category: "Ratgeber",
    readTime: "6 min",
  },
];

const NAVY = "#1A3F6F";
const GREEN = "#1E8449";

export default function BlogPage() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#f9f9f9", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ background: NAVY, padding: "60px 20px 50px", textAlign: "center" }}>
        <p style={{ color: "#fff", opacity: 0.5, fontSize: 13, letterSpacing: 4, textTransform: "uppercase", marginBottom: 16 }}>
          KitaBridge Blog
        </p>
        <h1 style={{ color: "#fff", fontSize: "clamp(32px, 5vw, 52px)", fontFamily: "Playfair Display, serif", fontWeight: 700, margin: 0 }}>
          Wissen für Fachkräfte & Einrichtungen
        </h1>
        <p style={{ color: "#fff", opacity: 0.6, marginTop: 16, fontSize: 18, maxWidth: 560, margin: "16px auto 0" }}>
          Tipps, Ratgeber und News rund um Kita-Jobs, Personalfindung und den pädagogischen Berufsalltag.
        </p>
      </div>

      {/* Posts Grid */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "60px 20px" }}>
        <div style={{ display: "grid", gap: 32 }}>
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
              <div style={{
                background: "#fff",
                borderRadius: 12,
                padding: "36px 40px",
                boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
                borderLeft: `4px solid ${GREEN}`,
                transition: "transform 0.2s, box-shadow 0.2s",
                cursor: "pointer",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 30px rgba(0,0,0,0.1)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 20px rgba(0,0,0,0.06)"; }}
              >
                <div style={{ display: "flex", gap: 12, marginBottom: 14, alignItems: "center" }}>
                  <span style={{ background: GREEN, color: "#fff", fontSize: 12, padding: "4px 12px", borderRadius: 20, fontWeight: 500 }}>
                    {post.category}
                  </span>
                  <span style={{ color: "#999", fontSize: 13 }}>{post.date} · {post.readTime} Lesezeit</span>
                </div>
                <h2 style={{ color: NAVY, fontSize: 22, fontFamily: "Playfair Display, serif", fontWeight: 700, margin: "0 0 12px" }}>
                  {post.title}
                </h2>
                <p style={{ color: "#666", fontSize: 16, lineHeight: 1.6, margin: 0 }}>
                  {post.excerpt}
                </p>
                <p style={{ color: GREEN, fontSize: 14, fontWeight: 600, marginTop: 20 }}>
                  Weiterlesen →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}