"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function BezahlungErfolgPage() {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // Pending-Daten aus localStorage löschen
    localStorage.removeItem("kitabridge_pending_arbeitgeber");

    // Countdown für automatische Weiterleitung
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = "/suche";
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>KitaBridge</div>

        <div style={styles.successIcon}>✅</div>
        <h1 style={styles.title}>Zahlung erfolgreich!</h1>
        <p style={styles.text}>
          Herzlich willkommen bei KitaBridge! Ihr Account ist jetzt aktiv und Sie haben
          vollen Zugang zur Fachkräfte-Datenbank.
        </p>

        <div style={styles.infoBox}>
          <p style={styles.infoText}>
            Sie erhalten in Kürze eine Bestätigungs-E-Mail von Stripe mit Ihrer Rechnung.
          </p>
        </div>

        <Link href="/suche" style={styles.btn}>
          Jetzt Fachkräfte suchen →
        </Link>

        <p style={styles.hint}>
          Automatische Weiterleitung in {countdown} Sekunden...
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
  successIcon: {
    fontSize: "64px",
    marginBottom: "16px",
  },
  title: {
    fontSize: "26px",
    fontWeight: "700",
    color: "#111827",
    margin: "0 0 12px",
  },
  text: {
    fontSize: "15px",
    color: "#6b7280",
    lineHeight: "1.6",
    margin: "0 0 24px",
  },
  infoBox: {
    backgroundColor: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: "10px",
    padding: "16px",
    marginBottom: "24px",
  },
  infoText: {
    fontSize: "14px",
    color: "#166534",
    margin: 0,
  },
  btn: {
    backgroundColor: "#2563eb",
    color: "#ffffff",
    padding: "14px 32px",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "700",
    textDecoration: "none",
    display: "block",
    marginBottom: "16px",
  },
  hint: {
    fontSize: "12px",
    color: "#9ca3af",
    margin: 0,
  },
};
