import type { Metadata, Viewport } from "next";
import { Geist, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/nav-bar";
import { Footer } from "@/components/footer";
import { Splash } from "@/components/splash";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Tarot Ave Fénix · Lecturas espirituales",
  description:
    "Lecturas de tarot y guía espiritual con Ave Fénix. Alineá tu energía y transformá tu vida. Modalidad virtual o presencial. Reservá tu turno online.",
};

export const viewport: Viewport = {
  themeColor: "#2a0d4a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative overflow-x-hidden">
        <Splash />
        <StarsBackdrop />
        <NavBar />
        <main className="flex-1 flex flex-col relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

function StarsBackdrop() {
  const stars = Array.from({ length: 60 }, (_, i) => ({
    x: (i * 73) % 100,
    y: (i * 137) % 100,
    size: (i % 3) + 1,
    delay: (i % 7) * 0.4,
  }));
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 opacity-60">
        {stars.map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-violet-100 animate-twinkle"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
      </div>
      <div className="absolute -top-40 -right-40 w-[28rem] h-[28rem] rounded-full bg-violet-600/25 blur-3xl" />
      <div className="absolute top-1/2 -left-32 w-[24rem] h-[24rem] rounded-full bg-violet-400/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[20rem] h-[20rem] rounded-full bg-fuchsia-500/15 blur-3xl" />
    </div>
  );
}
