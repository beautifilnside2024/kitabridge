"use client";

import { useState, useEffect } from "react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // immer aktiv
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem("kitabridge_cookie_consent");
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const saveConsent = (consentData) => {
    localStorage.setItem("kitabridge_cookie_consent", JSON.stringify({
      ...consentData,
      timestamp: new Date().toISOString(),
    }));
    setVisible(false);

    // Google Analytics aktivieren wenn zugestimmt
    if (consentData.analytics && typeof window !== "undefined" && window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: "granted",
      });
    }
  };

  const acceptAll = () => {
    saveConsent({ necessary: true, analytics: true, marketing: true });
  };

  const acceptNecessary = () => {
    saveConsent({ necessary: true, analytics: false, marketing: false });
  };

  const saveCustom = () => {
    saveConsent(preferences);
  };

  if (!visible) return null;

  return (
    <>
      <div style={styles.overlay} />
      <div style={styles.banner}>
        <div style={styles.inner}>
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.iconWrapper}>
              <span style={styles.icon}>🍪</span>
            </div>
            <div>
              <h2 style={styles.title}>Wir nutzen Cookies</h2>
              <p style={styles.subtitle}>
                Für eine optimale Nutzung von KitaBridge und zur Verbesserung unserer Dienste.
              </p>
            </div>
          </div>

          {/* Text */}
          <p style={styles.text}>
            Wir verwenden Cookies und ähnliche Technologien auf unserer Website. Einige davon sind
            technisch notwendig, andere helfen uns, diese Website und Ihre Erfahrung zu verbessern.
            Personenbezogene Daten können verarbeitet werden (z. B. IP-Adressen). Weitere
            Informationen finden Sie in unserer{" "}
            <a href="/datenschutz" style={styles.link}>
              Datenschutzerklärung
            </a>
            .
          </p>

          {/* Details-Bereich */}
          {showDetails && (
            <div style={styles.detailsBox}>
              {/* Notwendig */}
              <div style={styles.categoryRow}>
                <div style={styles.categoryInfo}>
                  <span style={styles.categoryName}>✅ Technisch notwendig</span>
                  <span style={styles.categoryDesc}>
                    Supabase Auth, Session-Management – immer aktiv
                  </span>
                </div>
                <div style={styles.toggleDisabled}>Immer aktiv</div>
              </div>

              {/* Analytics */}
              <div style={styles.categoryRow}>
                <div style={styles.categoryInfo}>
                  <span style={styles.categoryName}>📊 Analyse & Statistik</span>
                  <span style={styles.categoryDesc}>
                    Google Analytics – hilft uns die Website zu verbessern
                  </span>
                </div>
                <label style={styles.toggleWrapper}>
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) =>
                      setPreferences({ ...preferences, analytics: e.target.checked })
                    }
                    style={styles.checkbox}
                  />
                  <span style={{
                    ...styles.toggleSlider,
                    backgroundColor: preferences.analytics ? "#2563eb" : "#d1d5db",
                  }} />
                </label>
              </div>

              {/* Marketing */}
              <div style={styles.categoryRow}>
                <div style={styles.categoryInfo}>
                  <span style={styles.categoryName}>💳 Zahlungsabwicklung</span>
                  <span style={styles.categoryDesc}>
                    Stripe – sichere Zahlungsabwicklung für Abonnements
                  </span>
                </div>
                <label style={styles.toggleWrapper}>
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={(e) =>
                      setPreferences({ ...preferences, marketing: e.target.checked })
                    }
                    style={styles.checkbox}
                  />
                  <span style={{
                    ...styles.toggleSlider,
                    backgroundColor: preferences.marketing ? "#2563eb" : "#d1d5db",
                  }} />
                </label>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div style={styles.actions}>
            <div style={styles.leftActions}>
              <button
                onClick={() => setShowDetails(!showDetails)}
                style={styles.detailsBtn}
              >
                {showDetails ? "Details verbergen ▲" : "Details anzeigen ▼"}
              </button>
              {showDetails && (
                <button onClick={saveCustom} style={styles.saveBtn}>
                  Auswahl speichern
                </button>
              )}
            </div>
            <div style={styles.rightActions}>
              <button onClick={acceptNecessary} style={styles.necessaryBtn}>
                Nur notwendige
              </button>
              <button onClick={acceptAll} style={styles.acceptBtn}>
                Alle akzeptieren
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    height: "4px",
    background: "linear-gradient(90deg, #2563eb, #60a5fa)",
    zIndex: 9998,
  },
  banner: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#ffffff",
    borderTop: "1px solid #e5e7eb",
    boxShadow: "0 -4px 24px rgba(0,0,0,0.10)",
    zIndex: 9999,
    fontFamily: "'Segoe UI', sans-serif",
  },
  inner: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "20px 24px",
  },
  header: {
    display: "flex",
    alignItems: "flex-start",
    gap: "14px",
    marginBottom: "10px",
  },
  iconWrapper: {
    fontSize: "28px",
    lineHeight: 1,
    marginTop: "2px",
  },
  icon: {
    display: "block",
  },
  title: {
    margin: 0,
    fontSize: "17px",
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    margin: "2px 0 0",
    fontSize: "13px",
    color: "#6b7280",
  },
  text: {
    fontSize: "13.5px",
    color: "#374151",
    margin: "0 0 16px",
    lineHeight: "1.6",
  },
  link: {
    color: "#2563eb",
    textDecoration: "underline",
    cursor: "pointer",
  },
  detailsBox: {
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    padding: "12px 16px",
    marginBottom: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  categoryRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
  },
  categoryInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  categoryName: {
    fontSize: "13.5px",
    fontWeight: "600",
    color: "#1e293b",
  },
  categoryDesc: {
    fontSize: "12px",
    color: "#64748b",
  },
  toggleDisabled: {
    fontSize: "12px",
    color: "#2563eb",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },
  toggleWrapper: {
    position: "relative",
    display: "inline-block",
    width: "44px",
    height: "24px",
    cursor: "pointer",
    flexShrink: 0,
  },
  checkbox: {
    opacity: 0,
    width: 0,
    height: 0,
    position: "absolute",
  },
  toggleSlider: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: "34px",
    transition: "0.3s",
    display: "block",
  },
  actions: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "10px",
  },
  leftActions: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  rightActions: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  detailsBtn: {
    background: "none",
    border: "none",
    color: "#6b7280",
    fontSize: "13px",
    cursor: "pointer",
    padding: "8px 0",
    textDecoration: "underline",
  },
  saveBtn: {
    backgroundColor: "#f1f5f9",
    border: "1px solid #cbd5e1",
    color: "#334155",
    fontSize: "13px",
    fontWeight: "600",
    padding: "8px 16px",
    borderRadius: "8px",
    cursor: "pointer",
  },
  necessaryBtn: {
    backgroundColor: "#ffffff",
    border: "2px solid #2563eb",
    color: "#2563eb",
    fontSize: "13.5px",
    fontWeight: "600",
    padding: "8px 18px",
    borderRadius: "8px",
    cursor: "pointer",
  },
  acceptBtn: {
    backgroundColor: "#2563eb",
    border: "2px solid #2563eb",
    color: "#ffffff",
    fontSize: "13.5px",
    fontWeight: "700",
    padding: "8px 22px",
    borderRadius: "8px",
    cursor: "pointer",
  },
};
