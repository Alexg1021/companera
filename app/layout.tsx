import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Compañera — Zócalo Health",
  description: "Herramienta de coordinación para promotoras de salud",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
