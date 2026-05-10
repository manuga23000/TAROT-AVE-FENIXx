"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  InstagramIcon,
  SOCIAL,
  TikTokIcon,
  WhatsAppIcon,
} from "./social-icons";

const socials = [
  { ...SOCIAL.whatsapp, label: "WhatsApp", Icon: WhatsAppIcon },
  { ...SOCIAL.instagram, label: "Instagram", Icon: InstagramIcon },
  { ...SOCIAL.tiktok, label: "TikTok", Icon: TikTokIcon },
];

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className="relative z-10 mt-16 border-t border-violet-300/15 bg-violet-950/40 backdrop-blur-xl"
    >
      <div className="mx-auto max-w-6xl px-5 py-10 grid gap-8 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl text-violet-50">Tarot Ave Fénix</p>
          <p className="mt-2 text-sm text-violet-200/70 max-w-xs italic">
            &ldquo;Lo que buscás también te está buscando.&rdquo;
          </p>
          <p className="mt-3 text-sm text-violet-200/70 max-w-xs">
            Lecturas y guía espiritual con Marce. Modalidad virtual o presencial.
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-violet-300/70">
            Navegación
          </p>
          <ul className="mt-3 space-y-2 text-sm text-violet-100/90">
            <li>
              <Link href="/" className="hover:text-violet-300 transition-colors">
                Inicio
              </Link>
            </li>
            <li>
              <Link href="/turnos" className="hover:text-violet-300 transition-colors">
                Reservar turno
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-violet-300/70">
            Seguime
          </p>
          <ul className="mt-3 space-y-2.5 text-sm text-violet-100/90">
            {socials.map(({ href, label, handle, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2.5 hover:text-violet-300 transition-colors"
                >
                  <span className="h-8 w-8 rounded-xl glass flex items-center justify-center text-violet-200 group-hover:bg-violet-500/20 transition-colors">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-violet-50 leading-none">{label}</span>
                    <span className="text-[11px] text-violet-300/70">{handle}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-violet-300/10 py-5 text-center text-xs text-violet-300/60">
        © {new Date().getFullYear()} Tarot Ave Fénix · Hecho con intención
      </div>
    </motion.footer>
  );
}
