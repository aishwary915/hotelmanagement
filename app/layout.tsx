import type { Metadata } from "next";
import { Bricolage_Grotesque, Manrope } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-bricolage",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Hotel and restaurant management | Crescent Code, Indore",
    template: "%s | Crescent Code",
  },
  description:
    "A working demo of hotel and restaurant management software by Crescent Code, Indore — for properties from 3 to 60 rooms.",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "Crescent Code",
    title: "Hotel and restaurant management | Crescent Code",
    description: "One screen for every room, table and guest. Try the live demo.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Crescent Code hotel demo",
    description: "PMS and restaurant POS for Indian hotels.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const plausible = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  return (
    <html lang="en" className={`${manrope.variable} ${bricolage.variable}`}>
      <body className="font-sans antialiased">
        {plausible ? (
          <Script
            defer
            data-domain={plausible}
            src="https://plausible.io/js/script.js"
            strategy="afterInteractive"
          />
        ) : null}
        {children}
      </body>
    </html>
  );
}
