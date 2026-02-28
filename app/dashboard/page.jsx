"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const NAVY = "#1A3F6F";
const BLUE = "#2471A3";
const GREEN = "#1E8449";

export default function Dashboard() {
  const router = useRouter();
  const [arbeitgeber, setArbeitgeber] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("uebersicht");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push("/login");
      return;
    }

    const { data } = await supabase
      .from("arbeitgeber")
      .select("*")
      .eq("email", session.user.email)
      .single();

    setArbeitgeber(data);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleDeleteAccount = async () => {
    const bestaetigung = window.confirm(
      "Sind Sie sicher? Ihr Account und alle Daten werden unwiderruflich gelöscht. Ihr Abonnement wird sofort gekündigt."
    );
    if (!bestaetigung) return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const res = await fetch("/api/account/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: session.user.email, rolle: "arbeitgeber" }),
    });

    if (res.ok) {
      await supabase.auth.signOut();
      alert("Ihr Account wurde erfolgreich gelöscht.");
      router.push("/");
    } else {
      alert("Fehler beim Löschen. Bitte kontaktieren Sie uns unter kitabridge@protonmail.com");
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F0F4F9", fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ color: NAVY }}>Lädt...</div>
      </div>
    );
  }

  const isAktiv = arbeitgeber?.status === "aktiv";

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4F9", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap'); * { box-sizing: border-box; }`}</style>

      {/* Header */}
      <div style={{ background: NAVY, padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <a href="/" style={{ textDecoration: "none", fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700 }}>
          <span style={{ color: "white" }}>Kita</span><span style={{ color: "#4ADE80" }}>Bridge</span>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem" }}>{arbeitgeber?.einrichtung_name}</span>
          <button onClick={handleLogout} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "white", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: "0.85rem", fontFamily: "'DM Sans', sans-serif" }}>
            Ausloggen
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>

        {/* Status Banner */}
        {!isAktiv && (
          <div style={{ background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: 16, padding: 20, marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
            <div>
              <div style={{ fontWeight: 700, color: "#92400E", marginBottom: 4 }}>⚠️ Konto noch nicht aktiv</div>
              <div style={{ color: "#78350F", fontSize: "0.88rem" }}>Ihr Account wird gerade geprüft oder die Zahlung steht noch aus. Nach Aktivierung haben Sie vollen Zugang zu allen Fachkräfte-Profilen.</div>
            </div>
            <a href="/bezahlung" style={{ background: "#EA580C", color: "white", padding: "10px 20px", borderRadius: 10, fontWeight: 700, textDecoration: "none", fontSize: "0.88rem", whiteSpace: "nowrap", fontFamily: "'DM Sans', sans-serif" }}>
              Jetzt bezahlen
            </a>
          </div>
        )}

        {isAktiv && (
          <div style={{ background: "#EAF7EF", border: "1px solid #BBF7D0", borderRadius: 16, padding: 16, marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: "1.2rem" }}>✅</span>
            <span style={{ color: GREEN, fontWeight: 700, fontSize: "0.9rem" }}>Konto aktiv – Sie haben vollen Zugang zu allen Fachkräfte-Profilen</span>
          </div>
        )}

        {/* Willkommen */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", color: NAVY, marginBottom: 4 }}>
            Willkommen, {arbeitgeber?.ansprech_name?.split(" ")[0] || ""}! 👋
          </h1>
          <p style={{ color: "#9BA8C0", fontSize: "0.9rem" }}>{arbeitgeber?.einrichtung_name} · {arbeitgeber?.ort}</p>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 28, background: "white", borderRadius: 12, padding: 4, width: "fit-content", boxShadow: "0 2px 8px rgba(26,63,111,0.08)" }}>
          {[
            { key: "uebersicht", label: "Übersicht" },
            { key: "profil", label: "Mein Profil" },
            { key: "suche", label: "Fachkräfte suchen" },
          ].map(tab => (
            <button key={tab.key} onClick={() => tab.key === "suche" ? router.push("/suche") : setActiveTab(tab.key)} style={{ padding: "9px 20px", borderRadius: 9, border: "none", background: activeTab === tab.key ? NAVY : "transparent", color: activeTab === tab.key ? "white" : "#6B7897", fontWeight: 600, fontSize: "0.88rem", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Übersicht */}
        {activeTab === "uebersicht" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 28 }}>
              {[
                { icon: "👥", label: "Offene Stellen", value: arbeitgeber?.stellen_anzahl || "-" },
                { icon: "📍", label: "Standort", value: arbeitgeber?.ort || "-" },
                { icon: "🏢", label: "Einrichtungstyp", value: arbeitgeber?.einrichtungstyp || "-" },
              ].map(stat => (
                <div key={stat.label} style={{ background: "white", borderRadius: 16, padding: 24, boxShadow: "0 2px 12px rgba(26,63,111,0.08)" }}>
                  <div style={{ fontSize: "1.8rem", marginBottom: 8 }}>{stat.icon}</div>
                  <div style={{ fontSize: "0.78rem", color: "#9BA8C0", fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>{stat.label}</div>
                  <div style={{ fontSize: "1rem", fontWeight: 700, color: NAVY }}>{stat.value}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={{ background: "white", borderRadius: 20, padding: 28, boxShadow: "0 2px 12px rgba(26,63,111,0.08)" }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: NAVY, marginBottom: 16 }}>Schnellzugriff</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <a href="/suche" style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 10, background: "#F8FAFF", textDecoration: "none", color: NAVY, fontWeight: 600, fontSize: "0.9rem" }}>
                    <span>🔍</span> Fachkräfte suchen
                  </a>
                  <button onClick={() => setActiveTab("profil")} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 10, background: "#F8FAFF", border: "none", color: NAVY, fontWeight: 600, fontSize: "0.9rem", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", textAlign: "left" }}>
                    <span>✏️</span> Profil bearbeiten
                  </button>
                  <a href="/kontakt" style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 10, background: "#F8FAFF", textDecoration: "none", color: NAVY, fontWeight: 600, fontSize: "0.9rem" }}>
                    <span>✉️</span> Support kontaktieren
                  </a>
                </div>
              </div>

              <div style={{ background: `linear-gradient(135deg, ${NAVY}, ${BLUE})`, borderRadius: 20, padding: 28, color: "white" }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", marginBottom: 12 }}>Ihr Plan</h3>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 700, marginBottom: 4 }}>299 EUR</div>
                <div style={{ opacity: 0.7, fontSize: "0.82rem", marginBottom: 20 }}>pro Monat, zzgl. MwSt.</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {["Alle Fachkräfte-Profile", "Direktkontakt", "Keine Provision", "Monatlich kündbar"].map(f => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.85rem" }}>
                      <span style={{ color: "#4ADE80" }}>✓</span> {f}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profil Tab */}
        {activeTab === "profil" && (
          <div style={{ background: "white", borderRadius: 20, padding: 32, boxShadow: "0 2px 12px rgba(26,63,111,0.08)" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: NAVY, marginBottom: 24 }}>Mein Profil</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
              {[
                ["Einrichtung", arbeitgeber?.einrichtung_name],
                ["Einrichtungstyp", arbeitgeber?.einrichtungstyp],
                ["Träger", arbeitgeber?.traeger],
                ["Ansprechpartner", arbeitgeber?.ansprech_name],
                ["Rolle", arbeitgeber?.ansprech_rolle],
                ["E-Mail", arbeitgeber?.email],
                ["Telefon", arbeitgeber?.telefon],
                ["Adresse", `${arbeitgeber?.strasse} ${arbeitgeber?.hausnummer}, ${arbeitgeber?.plz} ${arbeitgeber?.ort}`],
                ["Bundesland", arbeitgeber?.bundesland],
                ["Offene Stellen", arbeitgeber?.stellen_anzahl],
                ["Status", arbeitgeber?.status],
              ].map(([k, v]) => v ? (
                <div key={k} style={{ padding: "14px 0", borderBottom: "1px solid #F0F4F9" }}>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#9BA8C0", textTransform: "uppercase", marginBottom: 4 }}>{k}</div>
                  <div style={{ color: NAVY, fontWeight: 600, fontSize: "0.92rem" }}>{v}</div>
                </div>
              ) : null)}
            </div>

            <div style={{ marginTop: 24, padding: 16, background: "#F0F4F9", borderRadius: 12, fontSize: "0.85rem", color: "#6B7897" }}>
              Um Ihre Profildaten zu ändern, kontaktieren Sie uns unter <a href="mailto:kitabridge@protonmail.com" style={{ color: BLUE }}>kitabridge@protonmail.com</a>
            </div>

            {/* Account löschen */}
            <div style={{ marginTop: 32, padding: 20, background: "#FFF5F5", border: "1px solid #FED7D7", borderRadius: 12 }}>
              <div style={{ fontWeight: 700, color: "#9B1C1C", marginBottom: 6, fontSize: "0.95rem" }}>⚠️ Account löschen</div>
              <div style={{ color: "#7F1D1D", fontSize: "0.84rem", marginBottom: 14 }}>
                Ihr Account und alle Ihre Daten werden unwiderruflich gelöscht. Ihr Stripe-Abonnement wird sofort gekündigt.
              </div>
              <button
                onClick={handleDeleteAccount}
                style={{ background: "#DC2626", color: "white", border: "none", padding: "10px 20px", borderRadius: 8, fontWeight: 700, fontSize: "0.88rem", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
              >
                Account unwiderruflich löschen
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}