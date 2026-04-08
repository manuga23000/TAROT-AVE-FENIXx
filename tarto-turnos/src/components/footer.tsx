import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative z-10 mt-16 border-t border-violet-300/15 bg-violet-950/40 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-5 py-10 grid gap-8 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl text-violet-50">Marcela</p>
          <p className="mt-2 text-sm text-violet-200/70 max-w-xs">
            Más de 30 años acompañando con el tarot. Lecturas presenciales,
            por videollamada o teléfono.
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-violet-300/70">Navegación</p>
          <ul className="mt-3 space-y-2 text-sm text-violet-100/90">
            <li><Link href="/" className="hover:text-violet-300">Inicio</Link></li>
            <li><Link href="/turnos" className="hover:text-violet-300">Reservar turno</Link></li>
            <li><Link href="/admin" className="hover:text-violet-300">Panel admin</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-violet-300/70">Contacto</p>
          <ul className="mt-3 space-y-2 text-sm text-violet-100/90">
            <li>WhatsApp: +54 9 11 5555-5555</li>
            <li>Mar – Sáb · 10 a 20 hs</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-violet-300/10 py-5 text-center text-xs text-violet-300/60">
        © {new Date().getFullYear()} Marcela Tarot · Hecho con intención
      </div>
    </footer>
  );
}
