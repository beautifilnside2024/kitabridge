"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const NAVY = "#1A3F6F";
const BLUE = "#2471A3";
const GREEN = "#1E8449";

export default function FachkraftEinstellungen() {
  const router = useRouter();
  const [fachkraft, setFachkraft] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfil();
  }, []);

  const loadProfil = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push("/login");
      return;
    }

    const { data } = await supabase
      .from("fachkraefte")
      .select("*")
      .eq("email", session.user.email)
      .single();

    if (!data) {
      router.push("/dashboard");
      return;
    }

    setFachkraft(data);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleDeleteAccount = async () => {
    const bestaetigung = window.confirm(
      "Bist du sicher? Dein Account und alle deine Daten werden unwiderruflich gelöscht."
    );
    if (!bestaetigung) return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const res = await fetch("/api/account/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: session.user.email, rolle: "fachkraft" }),
    });

    if (res.ok) {
      await supabase.auth.signOut();
      alert("Dein Account wurde erfolgreich gelöscht.");
      router.push("/");
    } else {
      alert("Fehler beim Löschen. Bitte kontaktiere uns unter kitabridge@protonmail.com");
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F0F4F9", fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ color: NAVY }}>Lädt...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4F9", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap'); * { box-sizing: border-box; }`}</style>

      {/* Header */}
      <div style={{ background: NAVY, padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <a href="/" style={{ textDecoration: "none", fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700 }}>
          <span style={{ color: "white" }}>Kita</span><span style={{ color: "#4ADE80" }}>Bridge</span>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem" }}>{fachkraft?.vorname} {fachkraft?.nachname}</span>
          <button onClick={handleLogout} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "white", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: "0.85rem", fontFamily: "'DM Sans', sans-serif" }}>
            Ausloggen
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "40px 24px" }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", color: NAVY, marginBottom: 8 }}>
          Willkommen, {fachkraft?.vorname}! 👋
        </h1>
        <p style={{ color: "#9BA8C0", fontSize: "0.9rem", marginBottom: 32 }}>Hier kannst du dein Konto verwalten.</p>

        {/* Profil */}
        <div style={{ background: "white", borderRadius: 20, padding: 28, boxShadow: "0 2px 12px rgba(26,63,111,0.08)", marginBottom: 24 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: NAVY, marginBottom: 20 }}>Mein Profil</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
            {[
              ["Name", `${fachkraft?.vorname} ${fachkraft?.nachname}`],
              ["E-Mail", fachkraft?.email],
              ["Qualifikation", fachkraft?.qualifikation],
              ["Wohnort", fachkraft?.wohnort],
              ["Verfügbar ab", fachkraft?.verfuegbar_ab],
              ["Arbeitszeit", fachkraft?.arbeitszeit],
              ["Status", fachkraft?.status],
            ].map(([k, v]) => v ? (
              <div key={k} style={{ padding: "12px 0", borderBottom: "1px solid #F0F4F9" }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#9BA8C0", textTransform: "uppercase", marginBottom: 4 }}>{k}</div>
                <div style={{ color: NAVY, fontWeight: 600, fontSize: "0.92rem" }}>
                  {k === "Status" ? (
                    <span style={{ background: v === "bestaetigt" ? "#EAF7EF" : "#FFF7ED", color: v === "bestaetigt" ? GREEN : "#92400E", padding: "3px 12px", borderRadius: 50, fontSize: "0.8rem", fontWeight: 700 }}>
                      {v === "bestaetigt" ? "✅ Freigegeben" : v === "neu" ? "⏳ In Prüfung" : v}
                    </span>
                  ) : v}
                </div>
              </div>
            ) : null)}
          </div>
          <div style={{ marginTop: 20, padding: 14, background: "#F0F4F9", borderRadius: 10, fontSize: "0.84rem", color: "#6B7897" }}>
            Um deine Profildaten zu ändern, schreib uns: <a href="mailto:kitabridge@protonmail.com" style={{ color: BLUE }}>kitabridge@protonmail.com</a>
          </div>
        </div>

        {/* Account löschen */}
        <div style={{ background: "white", borderRadius: 20, padding: 28, boxShadow: "0 2px 12px rgba(26,63,111,0.08)" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: NAVY, marginBottom: 20 }}>Konto-Einstellungen</h2>
          <div style={{ padding: 20, background: "#FFF5F5", border: "1px solid #FED7D7", borderRadius: 12 }}>
            <div style={{ fontWeight: 700, color: "#9B1C1C", marginBottom: 6, fontSize: "0.95rem" }}>⚠️ Account löschen</div>
            <div style={{ color: "#7F1D1D", fontSize: "0.84rem", marginBottom: 14 }}>
              Dein Account und alle deine Daten werden unwiderruflich gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.
            </div>
            <button
              onClick={handleDeleteAccount}
              style={{ background: "#DC2626", color: "white", border: "none", padding: "10px 20px", borderRadius: 8, fontWeight: 700, fontSize: "0.88rem", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
            >
              Account unwiderruflich löschen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}