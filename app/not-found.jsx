import Link from "next/link";

export const metadata = {
  title: "Seite nicht gefunden – KitaBridge",
};

export default function NotFound() {
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Logo */}
        <div style={styles.logo}>KitaBridge</div>

        {/* 404 */}
        <div style={styles.errorCode}>404</div>

        {/* Trennlinie */}
        <div style={styles.divider} />

        {/* Text */}
        <h1 style={styles.title}>Seite nicht gefunden</h1>
        <p style={styles.text}>
          Die Seite, die Sie suchen, existiert leider nicht oder wurde verschoben.
        </p>

        {/* Buttons */}
        <div style={styles.buttons}>
          <Link href="/" style={styles.primaryBtn}>
            Zur Startseite
          </Link>
          <Link href="/suche" style={styles.secondaryBtn}>
            Fachkräfte suchen
          </Link>
        </div>

        {/* Hilfe-Links */}
        <div style={styles.links}>
          <Link href="/login" style={styles.link}>Arbeitgeber Login</Link>
          <span style={styles.dot}>·</span>
          <Link href="/Registrieren" style={styles.link}>Als Fachkraft registrieren</Link>
          <span style={styles.dot}>·</span>
          <Link href="/impressum" style={styles.link}>Impressum</Link>
        </div>
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
  container: {
    textAlign: "center",
    maxWidth: "480px",
    width: "100%",
  },
  logo: {
    fontSize: "22px",
    fontWeight: "800",
    color: "#2563eb",
    letterSpacing: "-0.5px",
    marginBottom: "40px",
  },
  errorCode: {
    fontSize: "120px",
    fontWeight: "900",
    color: "#2563eb",
    lineHeight: 1,
    opacity: 0.15,
    marginBottom: "-20px",
    letterSpacing: "-4px",
  },
  divider: {
    width: "48px",
    height: "4px",
    backgroundColor: "#2563eb",
    borderRadius: "2px",
    margin: "0 auto 24px",
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
    margin: "0 0 32px",
  },
  buttons: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: "32px",
  },
  primaryBtn: {
    backgroundColor: "#2563eb",
    color: "#ffffff",
    padding: "12px 28px",
    borderRadius: "10px",
    fontWeight: "700",
    fontSize: "15px",
    textDecoration: "none",
    display: "inline-block",
  },
  secondaryBtn: {
    backgroundColor: "#ffffff",
    color: "#2563eb",
    border: "2px solid #2563eb",
    padding: "10px 28px",
    borderRadius: "10px",
    fontWeight: "600",
    fontSize: "15px",
    textDecoration: "none",
    display: "inline-block",
  },
  links: {
    display: "flex",
    gap: "8px",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
  },
  link: {
    fontSize: "13px",
    color: "#6b7280",
    textDecoration: "underline",
  },
  dot: {
    color: "#d1d5db",
    fontSize: "13px",
  },
};
