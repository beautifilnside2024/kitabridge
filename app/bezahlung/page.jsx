"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BezahlungPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Arbeitgeber-Daten aus localStorage holen (werden bei Registrierung gespeichert)
  const getArbeitgeberData = () => {
    try {
      const data = localStorage.getItem("kitabridge_pending_arbeitgeber");
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  };

  const handleBezahlen = async () => {
    setLoading(true);
    setError("");

    const data = getArbeitgeberData();

    if (!data) {
      setError("Keine Registrierungsdaten gefunden. Bitte erneut registrieren.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          arbeitgeber_id: data.id,
          email: data.email,
          einrichtung_name: data.einrichtung_name,
        }),
      });

      const result = await response.json();

      if (result.url) {
        window.location.href = result.url;
      } else {
        setError("Fehler beim Starten der Zahlung. Bitte versuchen Sie es erneut.");
      }
    } catch (err) {
      setError("Ein unerwarteter Fehler ist aufgetreten.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logo}>KitaBridge</div>

        {/* Header */}
        <div style={styles.header}>
          <div style={styles.checkIcon}>🎉</div>
          <h1 style={styles.title}>Registrierung erfolgreich!</h1>
          <p style={styles.subtitle}>
            Nur noch ein Schritt – aktivieren Sie Ihren Account mit dem Monatsabo.
          </p>
        </div>

        {/* Preis Box */}
        <div style={styles.priceBox}>
          <div style={styles.priceLabel}>KitaBridge Arbeitgeber</div>
          <div style={styles.price}>
            299 €<span style={styles.pricePer}> / Monat</span>
          </div>
          <div style={styles.priceNote}>zzgl. MwSt. · Monatlich kündbar</div>

          <div style={styles.divider} />

          <div style={styles.features}>
            <div style={styles.feature}>✅ Zugang zur Fachkräfte-Datenbank</div>
            <div style={styles.feature}>✅ Unbegrenzte Kontaktanfragen</div>
            <div style={styles.feature}>✅ Profil in der Arbeitgeber-Liste</div>
            <div style={styles.feature}>✅ Monatlich kündbar</div>
          </div>
        </div>

        {/* Fehler */}
        {error && <div style={styles.error}>{error}</div>}

        {/* Button */}
        <button
          onClick={handleBezahlen}
          disabled={loading}
          style={{
            ...styles.btn,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Weiterleitung zu Stripe..." : "Jetzt bezahlen →"}
        </button>

        <p style={styles.hint}>
          Sie werden zu Stripe weitergeleitet – sicher & verschlüsselt 🔒
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Segoe UI', sans-serif",
    padding: "24px",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    padding: "40px",
    maxWidth: "480px",
    width: "100%",
    textAlign: "center",
  },
  logo: {
    fontSize: "20px",
    fontWeight: "800",
    color: "#2563eb",
    marginBottom: "28px",
  },
  header: {
    marginBottom: "28px",
  },
  checkIcon: {
    fontSize: "48px",
    marginBottom: "12px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#111827",
    margin: "0 0 8px",
  },
  subtitle: {
    fontSize: "15px",
    color: "#6b7280",
    margin: 0,
    lineHeight: "1.5",
  },
  priceBox: {
    backgroundColor: "#f0f7ff",
    border: "2px solid #bfdbfe",
    borderRadius: "12px",
    padding: "24px",
    marginBottom: "24px",
    textAlign: "left",
  },
  priceLabel: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#2563eb",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: "8px",
  },
  price: {
    fontSize: "42px",
    fontWeight: "800",
    color: "#111827",
    lineHeight: 1,
  },
  pricePer: {
    fontSize: "18px",
    fontWeight: "400",
    color: "#6b7280",
  },
  priceNote: {
    fontSize: "12px",
    color: "#9ca3af",
    marginTop: "4px",
    marginBottom: "16px",
  },
  divider: {
    height: "1px",
    backgroundColor: "#bfdbfe",
    marginBottom: "16px",
  },
  features: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  feature: {
    fontSize: "14px",
    color: "#374151",
  },
  error: {
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#dc2626",
    padding: "12px 16px",
    borderRadius: "8px",
    fontSize: "14px",
    marginBottom: "16px",
    textAlign: "left",
  },
  btn: {
    backgroundColor: "#2563eb",
    color: "#ffffff",
    border: "none",
    padding: "14px 32px",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "700",
    width: "100%",
    marginBottom: "12px",
  },
  hint: {
    fontSize: "12px",
    color: "#9ca3af",
    margin: 0,
  },
};
