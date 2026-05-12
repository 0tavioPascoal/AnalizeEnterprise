import type { Metadata, Viewport } from "next";

import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rhanalyzer.com"),

  title: {
    default: "RH Analyzer",
    template: "%s • RH Analyzer",
  },

  description:
    "Plataforma inteligente de recrutamento com análise de currículos por IA, pipeline de candidatos e insights operacionais em tempo real.",

  applicationName: "RH Analyzer",

  keywords: [
    "RH",
    "Recrutamento",
    "IA",
    "ATS",
    "Currículos",
    "Análise de candidatos",
    "Hiring",
    "Recruitment AI",
  ],

  authors: [
    {
      name: "Otávio Pascoal",
    },
  ],

  creator: "Otávio Pascoal",

  openGraph: {
    title: "RH Analyzer",
    description:
      "Análise inteligente de candidatos com IA.",
    siteName: "RH Analyzer",
    locale: "pt_BR",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "RH Analyzer",
    description:
      "Plataforma inteligente de recrutamento com IA.",
  },

  icons: {
    icon: [
      {
        url: "/icon.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],

    apple: [
      {
        url: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],

    shortcut: "/favicon.ico",
  },

  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#4f46e5",
  colorScheme: "dark light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
    >
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}

          min-h-screen
          bg-background
          font-sans
          antialiased
        `}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}