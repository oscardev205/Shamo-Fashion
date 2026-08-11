// src/app/layout.tsx
// Fichier complet : ThemeScript et ThemeProvider réintégrés.

import type { Metadata } from "next";
import { Poppins, Great_Vibes, Playfair_Display } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/context/CartContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ThemeScript } from "@/components/providers/ThemeScript";
import { SessionProviderWrapper } from "@/components/providers/SessionProviderWrapper";
import { SITE_URL } from "@/lib/seo";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-great-vibes",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Grace Débordée — Shamo Fashion",
    template: "%s | Shamo Fashion",
  },
  description: "Shamo Fashion — costumes, chemises, chaussures et accessoires haut de gamme pour homme. Votre élégance, notre priorité.",
  openGraph: {
    siteName: "Shamo Fashion",
    type: "website",
    locale: "fr_FR",
    title: "Grace Débordée — Shamo Fashion",
    description: "Costumes, chemises, chaussures et accessoires haut de gamme pour homme.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Grace Débordée — Shamo Fashion",
    description: "Votre élégance, notre priorité.",
  },
  robots: { index: true, follow: true },
  verification: {
    google: "zAIjlS9N3dpEevvVw6KRfjJDwcPFcYMiLvAVCE1OYkE",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={`${poppins.variable} ${greatVibes.variable} ${playfair.variable} flex min-h-screen flex-col font-sans antialiased`}>
        <ThemeProvider>
          <SessionProviderWrapper>
            <CartProvider>
              <Header />
              <div className="flex-1">{children}</div>
              <Footer />
            </CartProvider>
          </SessionProviderWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}