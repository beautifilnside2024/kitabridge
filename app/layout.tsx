import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import CookieBanner from "@/components/CookieBanner";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: "KitaBridge – Erzieher Jobs & Kita Fachkräfte finden",
    template: "%s | KitaBridge",
  },
  description:
    "KitaBridge verbindet pädagogische Fachkräfte mit Kitas und sozialen Einrichtungen in ganz Deutschland. Kostenlos registrieren. Kein Lebenslauf. Keine Provision.",
  keywords: [
    "Erzieher Jobs",
    "Kita Fachkräfte",
    "Erzieherin gesucht",
    "Kita Stellenangebote Deutschland",
    "Sozialpädagoge Job",
    "Kinderpfleger Stelle",
    "pädagogische Fachkräfte",
    "Kita Job",
    "Erzieher ohne Anschreiben bewerben",
    "Kita Stellen ohne Provision",
  ],
  authors: [{ name: "KitaBridge" }],
  creator: "KitaBridge",
  publisher: "KitaBridge",
  metadataBase: new URL("https://www.kitabridge.de"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "https://www.kitabridge.de",
    siteName: "KitaBridge",
    title: "KitaBridge – Die Plattform für pädagogische Fachkräfte",
    description:
      "Kitas und soziale Einrichtungen finden qualifizierte Fachkräfte. Fachkräfte finden ihren Traumjob. Direkt, transparent, ohne Provision.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "KitaBridge – Die Plattform für pädagogische Fachkräfte in Deutschland",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KitaBridge – Erzieher Jobs & Kita Fachkräfte finden",
    description:
      "Die Plattform für pädagogische Fachkräfte in Deutschland. Kostenlos registrieren.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/icon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/icons/icon-192x192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <head>
        <meta name="application-name" content="KitaBridge" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="KitaBridge" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#1A3F6F" />
        <meta name="msapplication-TileColor" content="#1A3F6F" />
        <meta name="msapplication-tap-highlight" content="no" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
        <CookieBanner />
        <GoogleAnalytics />
      </body>
    </html>
  );
}