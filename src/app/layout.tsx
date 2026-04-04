import type { Metadata } from "next";
import { Cinzel, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Tarot Ave Fenix | Lectura de Tarot y Guia Espiritual",
  description:
    "Renace, sana y encontra tu camino. Lectura de tarot, armonizacion espiritual, videncia natural y limpiezas energeticas. 31 anios de experiencia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${cinzel.variable} ${cormorant.variable} antialiased`}
    >
      <body className="min-h-screen bg-[#06040e]">{children}</body>
    </html>
  );
}
