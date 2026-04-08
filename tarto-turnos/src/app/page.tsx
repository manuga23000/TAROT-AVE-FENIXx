import Link from "next/link";

const servicios = [
  {
    titulo: "Lectura general",
    desc: "Una mirada amplia sobre amor, trabajo, salud y familia.",
    icon: "✦",
  },
  {
    titulo: "Tarot del amor",
    desc: "Vínculos, parejas, reconciliaciones y nuevos encuentros.",
    icon: "♡",
  },
  {
    titulo: "Trabajo y dinero",
    desc: "Decisiones, emprendimientos y prosperidad económica.",
    icon: "✧",
  },
  {
    titulo: "Consulta express",
    desc: "Una pregunta puntual con respuesta clara y directa.",
    icon: "✺",
  },
];

const testimonios = [
  {
    nombre: "Laura M.",
    texto:
      "Marcela me ayudó en uno de los momentos más difíciles. Sus palabras tienen una claridad y una calidez únicas.",
  },
  {
    nombre: "Pablo R.",
    texto:
      "Fui escéptico al principio. Hoy la consulto cada vez que tengo una decisión importante.",
  },
  {
    nombre: "Sofía T.",
    texto:
      "Una experiencia profundamente sanadora. Su intuición es impresionante.",
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
              Más de 30 años de experiencia
            </span>
            <h1 className="mt-6 font-display text-5xl md:text-7xl leading-[1.05] text-violet-50">
              Las cartas <br />
              <span className="text-shimmer italic">tienen algo</span>
              <br /> para decirte
            </h1>
            <p className="mt-6 text-lg text-violet-100/80 max-w-md mx-auto md:mx-0 leading-relaxed">
              Soy <strong className="text-violet-100">Marcela</strong>, tarotista con
              tres décadas guiando a personas a encontrar respuestas, claridad y un
              camino que se siente propio.
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
              <Stat numero="30+" label="años de oficio" />
              <div className="h-8 w-px bg-violet-300/20" />
              <Stat numero="5.000+" label="consultas" />
              <div className="h-8 w-px bg-violet-300/20" />
              <Stat numero="100%" label="confidencial" />
            </div>
          </div>

          {/* Illustration / card */}
          <div className="relative mx-auto md:mx-0 w-full max-w-sm">
            <div className="absolute -inset-8 bg-violet-500/20 blur-3xl rounded-full" />
            <div className="relative animate-float">
              <TarotCard />
            </div>
          </div>
        </div>
      </section>

      {/* SOBRE MARCELA */}
      <section className="px-5 py-16">
        <div className="mx-auto max-w-5xl glass rounded-3xl p-8 md:p-14">
          <div className="grid gap-8 md:grid-cols-[auto_1fr] items-center">
            <div className="relative mx-auto h-32 w-32 md:h-40 md:w-40 rounded-full bg-gradient-to-br from-violet-300 to-violet-700 flex items-center justify-center glow">
              <span className="font-display text-6xl text-violet-50">M</span>
            </div>
            <div className="text-center md:text-left">
              <p className="text-xs uppercase tracking-[0.22em] text-violet-300/80">
                Sobre Marcela
              </p>
              <h2 className="mt-2 font-display text-3xl md:text-4xl text-violet-50">
                Una vida entera dedicada al tarot
              </h2>
              <p className="mt-4 text-violet-100/80 leading-relaxed">
                Desde muy joven sentí un llamado distinto. Hace más de 30 años
                que estudio, practico y acompaño a personas que llegan buscando
                respuestas. Mi forma de leer las cartas es honesta, cuidadosa y
                profundamente humana: no vengo a asustar ni a prometer milagros,
                vengo a ayudarte a ver con más claridad lo que ya sabés en el
                fondo.
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
              Encontrá la que <span className="italic text-shimmer">resuena</span> con vos
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

      {/* TESTIMONIOS */}
      <section className="px-5 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.22em] text-violet-300/80">
              Testimonios
            </p>
            <h2 className="mt-2 font-display text-4xl md:text-5xl text-violet-50">
              Quienes ya pasaron por una lectura
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {testimonios.map((t) => (
              <figure key={t.nombre} className="glass rounded-3xl p-7">
                <div className="text-gold text-xl">★★★★★</div>
                <blockquote className="mt-3 text-violet-100/85 italic leading-relaxed">
                  “{t.texto}”
                </blockquote>
                <figcaption className="mt-4 text-sm text-violet-300/80">
                  — {t.nombre}
                </figcaption>
              </figure>
            ))}
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
              Reservá tu turno en menos de un minuto. Elegí el día, la hora y la
              modalidad que mejor te quede.
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
        <div className="text-gold/80 text-xs uppercase tracking-[0.3em]">XVII</div>

        {/* Star illustration */}
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
      {/* Sparkles */}
      <div className="absolute top-6 right-6 h-2 w-2 bg-gold rounded-full animate-twinkle" />
      <div className="absolute bottom-10 left-8 h-1.5 w-1.5 bg-gold rounded-full animate-twinkle" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/3 left-6 h-1 w-1 bg-violet-200 rounded-full animate-twinkle" style={{ animationDelay: "2s" }} />
    </div>
  );
}
