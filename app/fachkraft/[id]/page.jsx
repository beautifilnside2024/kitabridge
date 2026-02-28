"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const NAVY = "#1A3F6F";
const BLUE = "#2471A3";
const GREEN = "#1E8449";

export default function FachkraftProfil() {
  const { id } = useParams();
  const router = useRouter();
  const [fachkraft, setFachkraft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const load = async () => {
      // Prüfen ob eingeloggt
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }

      // Fachkraft laden
      const { data, error } = await supabase
        .from("fachkraefte")
        .select("*")
        .eq("id", id)
        .eq("status", "bestaetigt")
        .single();

      if (error || !data) {
        setNotFound(true);
      } else {
        setFachkraft(data);
      }
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={{ textAlign: "center", color: "#9BA8C0", paddingTop: 100, fontFamily: "'DM Sans', sans-serif" }}>
          Lädt...
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div style={styles.page}>
        <div style={{ textAlign: "center", paddingTop: 100, fontFamily: "'DM Sans', sans-serif" }}>
          <div style={{ fontSize: "3rem", marginBottom: 16 }}>🔍</div>
          <h2 style={{ color: NAVY, marginBottom: 12 }}>Profil nicht gefunden</h2>
          <p style={{ color: "#9BA8C0", marginBottom: 24 }}>Dieses Profil existiert nicht oder wurde noch nicht freigegeben.</p>
          <a href="/suche" style={styles.btnPrimary}>Zurück zur Suche</a>
        </div>
      </div>
    );
  }

  const initials = `${fachkraft.vorname?.[0] || ""}${fachkraft.nachname?.[0] || ""}`.toUpperCase();

  return (
    <div style={styles.page}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap'); * { box-sizing: border-box; }`}</style>

      {/* Header */}
      <div style={{ background: NAVY, padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/" style={{ textDecoration: "none", fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700 }}>
          <span style={{ color: "white" }}>Kita</span><span style={{ color: "#4ADE80" }}>Bridge</span>
        </a>
        <a href="/suche" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none", fontSize: "0.88rem", fontFamily: "'DM Sans', sans-serif" }}>
          ← Zurück zur Suche
        </a>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "40px 24px" }}>

        {/* Profil Header */}
        <div style={{ background: "white", borderRadius: 24, padding: 36, boxShadow: "0 4px 24px rgba(26,63,111,0.08)", marginBottom: 24, display: "flex", gap: 28, alignItems: "flex-start", flexWrap: "wrap" }}>
          {/* Avatar */}
          <div style={{ width: 80, height: 80, borderRadius: 20, background: `linear-gradient(135deg, ${NAVY}, ${BLUE})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem", fontWeight: 700, color: "white", fontFamily: "'DM Sans', sans-serif", flexShrink: 0 }}>
            {initials}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 8 }}>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 700, color: NAVY, margin: 0 }}>
                {fachkraft.vorname} {fachkraft.nachname}
              </h1>
              <span style={{ background: "#EAF7EF", color: GREEN, padding: "4px 14px", borderRadius: 50, fontSize: "0.78rem", fontWeight: 700 }}>
                ✓ Geprüftes Profil
              </span>
            </div>
            <div style={{ fontSize: "1rem", color: "#6B7897", fontFamily: "'DM Sans', sans-serif", marginBottom: 16 }}>
              {fachkraft.qualifikation}
            </div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {fachkraft.bundesland && (
                <span style={styles.badge}>📍 {fachkraft.bundesland}</span>
              )}
              {fachkraft.verfuegbar_ab && (
                <span style={styles.badge}>📅 Verfügbar ab {fachkraft.verfuegbar_ab}</span>
              )}
              {fachkraft.arbeitszeit && (
                <span style={styles.badge}>⏰ {fachkraft.arbeitszeit}</span>
              )}
            </div>
          </div>

          {/* Kontakt Button */}
          <div style={{ flexShrink: 0 }}>
            <a href={`mailto:${fachkraft.email}`} style={styles.btnPrimary}>
              ✉ Kontakt aufnehmen
            </a>
            {fachkraft.telefon && (
              <div style={{ textAlign: "center", marginTop: 10, fontSize: "0.82rem", color: "#9BA8C0", fontFamily: "'DM Sans', sans-serif" }}>
                📞 {fachkraft.telefon}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, alignItems: "start" }}>

          {/* Links – Details */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

            {/* Über mich */}
            {fachkraft.beschreibung && (
              <div style={styles.card}>
                <h2 style={styles.cardTitle}>Über mich</h2>
                <p style={{ color: "#444", lineHeight: 1.8, fontSize: "0.92rem", fontFamily: "'DM Sans', sans-serif" }}>
                  {fachkraft.beschreibung}
                </p>
              </div>
            )}

            {/* Qualifikationen */}
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Qualifikationen</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Qualifikation</span>
                  <span style={styles.infoValue}>{fachkraft.qualifikation || "-"}</span>
                </div>
                {fachkraft.zusatzqualifikation && (
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Zusatzqualifikation</span>
                    <span style={styles.infoValue}>{fachkraft.zusatzqualifikation}</span>
                  </div>
                )}
                {fachkraft.uniabschluss && (
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Hochschulabschluss</span>
                    <span style={styles.infoValue}>{fachkraft.uniabschluss}</span>
                  </div>
                )}
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Berufserfahrung</span>
                  <span style={styles.infoValue}>{fachkraft.erfahrung_jahre || "-"}</span>
                </div>
                {fachkraft.kita_alter && fachkraft.kita_alter.length > 0 && (
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Altersgruppen</span>
                    <span style={styles.infoValue}>{fachkraft.kita_alter.join(", ")}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Sprachen */}
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Sprachkenntnisse</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {fachkraft.deutsch && (
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>🇩🇪 Deutsch</span>
                    <span style={{ ...styles.infoValue, background: "#EAF7EF", color: GREEN, padding: "3px 12px", borderRadius: 50, fontSize: "0.8rem", fontWeight: 700 }}>{fachkraft.deutsch}</span>
                  </div>
                )}
                {fachkraft.englisch && (
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>🇬🇧 Englisch</span>
                    <span style={{ ...styles.infoValue, background: "#EEF2FF", color: "#4F46E5", padding: "3px 12px", borderRadius: 50, fontSize: "0.8rem", fontWeight: 700 }}>{fachkraft.englisch}</span>
                  </div>
                )}
                {fachkraft.weitere_sprachen && (
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Weitere</span>
                    <span style={styles.infoValue}>{fachkraft.weitere_sprachen}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Rechts – Kurzinfo */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Kurzinfo</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  ["Wohnort", fachkraft.wohnort],
                  ["Geburtsland", fachkraft.geburtsland],
                  ["Bundesland", fachkraft.bundesland],
                  ["Verfügbar ab", fachkraft.verfuegbar_ab],
                  ["Arbeitszeit", fachkraft.arbeitszeit],
                ].map(([k, v]) => v ? (
                  <div key={k} style={styles.infoRow}>
                    <span style={styles.infoLabel}>{k}</span>
                    <span style={styles.infoValue}>{v}</span>
                  </div>
                ) : null)}
              </div>
            </div>

            {/* Kontakt Box */}
            <div style={{ background: `linear-gradient(135deg, ${NAVY}, ${BLUE})`, borderRadius: 20, padding: 24, color: "white", textAlign: "center" }}>
              <div style={{ fontSize: "2rem", marginBottom: 12 }}>✉</div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", marginBottom: 8 }}>
                Interesse an diesem Profil?
              </h3>
              <p style={{ fontSize: "0.82rem", opacity: 0.8, marginBottom: 20, lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>
                Kontaktieren Sie diese Fachkraft direkt – ohne Vermittler und ohne Provision.
              </p>
              <a href={`mailto:${fachkraft.email}`} style={{ display: "block", background: "white", color: NAVY, padding: "12px 20px", borderRadius: 10, fontWeight: 700, textDecoration: "none", fontSize: "0.9rem", fontFamily: "'DM Sans', sans-serif" }}>
                Jetzt kontaktieren
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#F0F4F9",
    fontFamily: "'DM Sans', sans-serif",
  },
  card: {
    background: "white",
    borderRadius: 20,
    padding: 28,
    boxShadow: "0 4px 24px rgba(26,63,111,0.08)",
  },
  cardTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "1.1rem",
    fontWeight: 700,
    color: NAVY,
    marginBottom: 20,
    paddingBottom: 12,
    borderBottom: "1px solid #F0F4F9",
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "6px 0",
    borderBottom: "1px solid #F8FAFF",
  },
  infoLabel: {
    fontSize: "0.82rem",
    fontWeight: 600,
    color: "#9BA8C0",
  },
  infoValue: {
    fontSize: "0.88rem",
    color: "#1a1a2e",
    fontWeight: 500,
    textAlign: "right",
    maxWidth: "60%",
  },
  badge: {
    background: "#F0F4F9",
    color: "#6B7897",
    padding: "5px 14px",
    borderRadius: 50,
    fontSize: "0.8rem",
    fontWeight: 600,
    fontFamily: "'DM Sans', sans-serif",
  },
  btnPrimary: {
    display: "inline-block",
    background: `linear-gradient(135deg, ${NAVY}, ${BLUE})`,
    color: "white",
    padding: "12px 24px",
    borderRadius: 10,
    fontWeight: 700,
    textDecoration: "none",
    fontSize: "0.9rem",
    fontFamily: "'DM Sans', sans-serif",
    boxShadow: "0 4px 16px rgba(26,63,111,0.28)",
  },
};
