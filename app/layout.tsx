import type { Metadata, Viewport } from "next";
import NextTopLoader from "nextjs-toploader";
import AppShell from "@/components/app-shell";
import "./globals.css";

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
  themeColor: "#1D9E75",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-neutral-100">
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
