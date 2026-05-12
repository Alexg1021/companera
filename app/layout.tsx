import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import AppShell from "@/components/app-shell";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Compañera — Zócalo Health",
  description: "Herramienta de coordinación para promotoras de salud",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Compañera",
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icon-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#1A2E4A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={jakarta.variable}>
      <body className={`${jakarta.className} min-h-screen bg-neutral-50 text-neutral-900 antialiased`}>
        <NextTopLoader
          color="#1D9E75"
          height={3}
          showSpinner={false}
          shadow={false}
          zIndex={9999}
          crawlSpeed={220}
        />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
