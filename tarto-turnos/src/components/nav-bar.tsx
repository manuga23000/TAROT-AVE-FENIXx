"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/turnos", label: "Reservar turno" },
  { href: "/admin", label: "Admin" },
];

export function NavBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="sticky top-0 z-50 backdrop-blur-xl bg-violet-900/40 border-b border-violet-300/15"
    >
      <div className="mx-auto max-w-6xl px-5 py-3.5 flex items-center justify-between">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2.5 group"
        >
          <motion.span
            whileHover={{ scale: 1.06, rotate: 4 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative h-11 w-11 rounded-full overflow-hidden ring-1 ring-violet-300/30 glow shrink-0"
          >
            <Image
              src="/logo.png"
              alt="Tarot Ave Fénix"
              fill
              sizes="44px"
              className="object-cover"
              priority
            />
          </motion.span>
          <div className="flex flex-col leading-none">
            <span className="font-display text-xl text-violet-50 tracking-wide">
              Ave Fénix
            </span>
            <span className="text-[10px] uppercase tracking-[0.22em] text-violet-300/80">
              Tarot &amp; Espiritual
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`relative px-4 py-2 rounded-full text-sm transition-colors ${
                  active
                    ? "text-violet-50"
                    : "text-violet-200/80 hover:text-violet-50"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-violet-500/30"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative">{l.label}</span>
              </Link>
            );
          })}
          <Link
            href="/turnos"
            className="ml-2 px-5 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-violet-400 to-fuchsia-500 text-white shadow-lg shadow-violet-500/30 hover:shadow-violet-400/50 transition-shadow"
          >
            Reservar
          </Link>
        </nav>

        <button
          aria-label="Menú"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden h-10 w-10 flex items-center justify-center rounded-full bg-violet-500/20 border border-violet-300/20 text-violet-100"
        >
          {open ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="md:hidden overflow-hidden border-t border-violet-300/15 bg-violet-950/80 backdrop-blur-xl"
          >
            <nav className="px-5 py-4 flex flex-col gap-1">
              {links.map((l, i) => {
                const active = pathname === l.href;
                return (
                  <motion.div
                    key={l.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i }}
                  >
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className={`block px-4 py-3 rounded-2xl text-base ${
                        active
                          ? "bg-violet-500/25 text-violet-50"
                          : "text-violet-200/90"
                      }`}
                    >
                      {l.label}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

function MenuIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
