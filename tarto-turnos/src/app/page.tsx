import Image from "next/image";
import Link from "next/link";

const servicios = [
  {
    titulo: "Apertura de caminos",
    desc: "Destrabá lo que está frenando tu energía y abrí espacio a nuevas oportunidades.",
    icon: "✦",
  },
  {
    titulo: "Amor y vínculos",
    desc: "Claridad sobre parejas, reconciliaciones, vínculos familiares y nuevos encuentros.",
    icon: "♡",
  },
  {
    titulo: "Prosperidad y trabajo",
    desc: "Decisiones laborales, emprendimientos y abundancia económica.",
    icon: "✧",
  },
  {
    titulo: "Limpieza energética",
    desc: "Liberá cargas, energías densas y recuperá tu equilibrio interior.",
    icon: "✺",
  },
];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative px-5 pt-12 pb-20 md:pt-20 md:pb-28">
        <div className="mx-auto max-w-6xl grid gap-12 md:grid-cols-2 items-center">
          <div className="text-center md:text-left">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs uppercase tracking-[0.22em] text-violet-200">
              <span className="h-1.5 w-1.5 rounded-full bg-gold animate-twinkle" />
              Tarot &amp; Guía Espiritual
            </span>
            <h1 className="mt-6 font-display text-5xl md:text-7xl leading-[1.05] text-violet-50">
              Alineá tu energía <br />
              <span className="text-shimmer italic">y transformá</span>
              <br /> tu vida
            </h1>
            <p className="mt-6 text-lg text-violet-100/80 max-w-md mx-auto md:mx-0 leading-relaxed">
              Soy <strong className="text-violet-100">Marce</strong>, tarotista
              y guía espiritual detrás de{" "}
              <strong className="text-violet-100">Ave Fénix</strong>. Te
              acompaño a encontrar respuestas, claridad y un camino que se
              siente propio.{" "}
              <em>Lo que buscás también te está buscando.</em>
            </p>
            <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <Link
                href="/turnos"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-500 text-white font-medium shadow-lg shadow-violet-500/30 hover:shadow-violet-400/60 transition-shadow"
              >
                Reservar mi turno
                <span aria-hidden>→</span>
              </Link>
              <Link
                href="#servicios"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full glass text-violet-100 hover:bg-violet-500/10 transition-colors"
              >
                Ver lecturas
              </Link>
            </div>
            <div className="mt-10 flex items-center gap-6 justify-center md:justify-start text-sm text-violet-200/70">
              <Stat numero="Virtual" label="o presencial" />
              <div className="h-8 w-px bg-violet-300/20" />
              <Stat numero="Años" label="de experiencia" />
              <div className="h-8 w-px bg-violet-300/20" />
              <Stat numero="100%" label="confidencial" />
            </div>
          </div>

          <div className="relative mx-auto md:mx-0 w-full max-w-sm">
            <div className="absolute -inset-8 bg-violet-500/20 blur-3xl rounded-full" />
            <div className="relative animate-float">
              <TarotCard />
            </div>
          </div>
        </div>
      </section>

      {/* SOBRE MARCE */}
      <section className="px-5 py-16">
        <div className="mx-auto max-w-5xl glass rounded-3xl p-8 md:p-14">
          <div className="grid gap-8 md:grid-cols-[auto_1fr] items-center">
            <div className="relative mx-auto h-36 w-36 md:h-44 md:w-44 rounded-full overflow-hidden ring-1 ring-violet-300/30 glow shrink-0">
              <Image
                src="/logo.png"
                alt="Tarot Ave Fénix"
                fill
                sizes="(min-width: 768px) 176px, 144px"
                className="object-cover"
              />
            </div>
            <div className="text-center md:text-left">
              <p className="text-xs uppercase tracking-[0.22em] text-violet-300/80">
                Sobre Marce
              </p>
              <h2 className="mt-2 font-display text-3xl md:text-4xl text-violet-50">
                Tu guía para renacer
              </h2>
              <p className="mt-4 text-violet-100/80 leading-relaxed">
                Como el ave que renace de sus cenizas, mi trabajo busca
                acompañarte en tus procesos de transformación. Con muchos años
                de experiencia en tarot, registros akáshicos y limpiezas
                energéticas, mi forma de leer es honesta, cuidadosa y
                profundamente humana: no vengo a asustar ni a prometer
                milagros, vengo a ayudarte a ver con más claridad lo que ya
                sabés en el fondo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section id="servicios" className="px-5 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.22em] text-violet-300/80">
              Lecturas
            </p>
            <h2 className="mt-2 font-display text-4xl md:text-5xl text-violet-50">
              Encontrá la que{" "}
              <span className="italic text-shimmer">resuena</span> con vos
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {servicios.map((s) => (
              <div
                key={s.titulo}
                className="glass rounded-3xl p-6 transition-transform hover:-translate-y-1 hover:bg-violet-500/10"
              >
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-400/40 to-violet-700/40 flex items-center justify-center text-2xl text-gold">
                  {s.icon}
                </div>
                <h3 className="mt-4 font-display text-2xl text-violet-50">
                  {s.titulo}
                </h3>
                <p className="mt-2 text-sm text-violet-200/80 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section className="px-5 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.22em] text-violet-300/80">
              Contacto
            </p>
            <h2 className="mt-2 font-display text-4xl md:text-5xl text-violet-50">
              Escribime y{" "}
              <span className="italic text-shimmer">conectemos</span>
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 max-w-2xl mx-auto">
            <a
              href="https://wa.me/5493364034155"
              target="_blank"
              rel="noopener noreferrer"
              className="glass rounded-3xl p-8 text-center transition-transform hover:-translate-y-1 hover:bg-violet-500/10"
            >
              <div className="h-16 w-16 mx-auto rounded-2xl bg-gradient-to-br from-emerald-400/30 to-emerald-700/30 flex items-center justify-center text-3xl">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 text-emerald-300">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <h3 className="mt-4 font-display text-2xl text-violet-50">
                WhatsApp
              </h3>
              <p className="mt-2 text-sm text-violet-200/80">
                Escribime directo y coordinamos
              </p>
            </a>
            <a
              href="https://instagram.com/tarot.avefenix"
              target="_blank"
              rel="noopener noreferrer"
              className="glass rounded-3xl p-8 text-center transition-transform hover:-translate-y-1 hover:bg-violet-500/10"
            >
              <div className="h-16 w-16 mx-auto rounded-2xl bg-gradient-to-br from-fuchsia-400/30 to-pink-700/30 flex items-center justify-center text-3xl">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 text-fuchsia-300">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </div>
              <h3 className="mt-4 font-display text-2xl text-violet-50">
                Instagram
              </h3>
              <p className="mt-2 text-sm text-violet-200/80">
                @tarot.avefenix
              </p>
            </a>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="px-5 py-16">
        <div className="mx-auto max-w-4xl glass rounded-3xl p-10 md:p-14 text-center relative overflow-hidden">
          <div className="absolute -top-20 -left-20 w-60 h-60 bg-violet-500/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-fuchsia-500/30 rounded-full blur-3xl" />
          <div className="relative">
            <h2 className="font-display text-4xl md:text-5xl text-violet-50">
              ¿Lista para tu lectura?
            </h2>
            <p className="mt-4 text-violet-100/80 max-w-lg mx-auto">
              Reservá tu turno en menos de un minuto. Elegí el día, la hora y
              la modalidad que mejor te quede.
            </p>
            <Link
              href="/turnos"
              className="mt-8 inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-500 text-white font-medium shadow-lg shadow-violet-500/40"
            >
              Reservar ahora <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function Stat({ numero, label }: { numero: string; label: string }) {
  return (
    <div className="text-center md:text-left">
      <div className="font-display text-2xl text-violet-50">{numero}</div>
      <div className="text-[11px] uppercase tracking-wider text-violet-300/70">
        {label}
      </div>
    </div>
  );
}

function TarotCard() {
  return (
    <div className="relative aspect-[3/5] w-full rounded-3xl bg-gradient-to-br from-violet-700 via-violet-800 to-violet-950 border border-violet-300/30 shadow-2xl shadow-violet-900/50 overflow-hidden">
      <div className="absolute inset-3 rounded-2xl border border-gold/40 p-6 flex flex-col items-center justify-between">
        <div className="text-gold/80 text-xs uppercase tracking-[0.3em]">
          XVII
        </div>
        <svg viewBox="0 0 120 120" className="w-32 h-32 text-gold">
          <g fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="60" cy="60" r="22" />
            <g>
              <line x1="60" y1="20" x2="60" y2="38" />
              <line x1="60" y1="82" x2="60" y2="100" />
              <line x1="20" y1="60" x2="38" y2="60" />
              <line x1="82" y1="60" x2="100" y2="60" />
              <line x1="32" y1="32" x2="44" y2="44" />
              <line x1="76" y1="76" x2="88" y2="88" />
              <line x1="32" y1="88" x2="44" y2="76" />
              <line x1="76" y1="44" x2="88" y2="32" />
            </g>
            <polygon
              points="60,46 63,56 73,56 65,62 68,72 60,66 52,72 55,62 47,56 57,56"
              fill="currentColor"
              fillOpacity="0.4"
            />
          </g>
        </svg>
        <div className="text-gold/90 font-display text-xl tracking-widest">
          La Estrella
        </div>
      </div>
      <div
        className="absolute top-6 right-6 h-2 w-2 bg-gold rounded-full animate-twinkle"
      />
      <div
        className="absolute bottom-10 left-8 h-1.5 w-1.5 bg-gold rounded-full animate-twinkle"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute top-1/3 left-6 h-1 w-1 bg-violet-200 rounded-full animate-twinkle"
        style={{ animationDelay: "2s" }}
      />
    </div>
  );
}
