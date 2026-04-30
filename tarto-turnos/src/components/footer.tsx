import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative z-10 mt-16 border-t border-violet-300/15 bg-violet-950/40 backdrop-blur-xl">
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
          <p className="text-xs uppercase tracking-[0.2em] text-violet-300/70">Navegación</p>
          <ul className="mt-3 space-y-2 text-sm text-violet-100/90">
            <li><Link href="/" className="hover:text-violet-300">Inicio</Link></li>
            <li><Link href="/turnos" className="hover:text-violet-300">Reservar turno</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-violet-300/70">Contacto</p>
          <ul className="mt-3 space-y-2 text-sm text-violet-100/90">
            <li>
              <a
                href="https://wa.me/5493364034155"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-violet-300"
              >
                WhatsApp
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com/tarot.avefenix"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-violet-300"
              >
                Instagram: @tarot.avefenix
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-violet-300/10 py-5 text-center text-xs text-violet-300/60">
        © {new Date().getFullYear()} Tarot Ave Fénix · Hecho con intención
      </div>
    </footer>
  );
}
