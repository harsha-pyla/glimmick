/* ============================================================
   GLIMMICK — Root Layout
   
   Loads fonts (Fredoka display + Inter body + Geist Mono),
   sets up SEO metadata, and wraps pages in the AppShell.
   ============================================================ */

import type { Metadata } from "next";
import { Fredoka, Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/AppShell";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "GLIMMICK — Play Tiny, Original Browser Games",
  description:
    "GLIMMICK is home to small, original, addictive browser games and experiments. Play for free, no downloads needed.",
  keywords: [
    "browser games",
    "online games",
    "free games",
    "indie games",
    "web games",
    "GLIMMICK",
  ],
  authors: [{ name: "GLIMMICK" }],
  openGraph: {
    title: "GLIMMICK — Play Tiny, Original Browser Games",
    description:
      "Small, original, addictive browser games and experiments. Play for free!",
    siteName: "GLIMMICK",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fredoka.variable} ${inter.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col bg-paper text-ink font-body antialiased" suppressHydrationWarning>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
