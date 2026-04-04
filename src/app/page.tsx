"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

/* ─── Data ─── */
const WA = "543364034155";
const waLink = (msg: string) =>
  `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;

const services = [
  {
    icon: "\u{1F0CF}",
    title: "Lectura de Tarot",
    sub: "Pasado \u00B7 Presente \u00B7 Futuro",
    text: "Una tirada profunda donde exploramos las energ\u00EDas que te rodean. Sesiones de aproximadamente 1 hora en un espacio de escucha, intuici\u00F3n y conexi\u00F3n real.",
    tags: ["Presencial", "Videollamada", "Por fotos"],
  },
  {
    icon: "\u2728",
    title: "Armonizaci\u00F3n Espiritual",
    sub: "Energ\u00EDa \u00B7 Sanaci\u00F3n \u00B7 Equilibrio",
    text: "Liber\u00E1 las cargas emocionales y energ\u00E9ticas que te pesan. Restaur\u00E1 tu equilibrio interior y conect\u00E1 con la paz que merec\u00E9s.",
    tags: ["Limpieza profunda", "Chakras", "Aura"],
  },
  {
    icon: "\u{1F52E}",
    title: "Videncia Natural",
    sub: "Don natural \u00B7 31 a\u00F1os",
    text: "Canalizo mensajes y visiones con un don natural que me acompa\u00F1a desde siempre. Respuestas claras sobre tu presente y lo que viene.",
    tags: ["Intuitiva", "Espiritual", "Gu\u00EDas"],
  },
  {
    icon: "\u{1F54A}\uFE0F",
    title: "Limpiezas y Protecciones",
    sub: "Liberaci\u00F3n \u00B7 Renovaci\u00F3n \u00B7 Paz",
    text: "Liber\u00E1te de energ\u00EDas negativas y bloqueos. Renac\u00E9 como el Ave F\u00E9nix con protecciones personalizadas para tu camino.",
    tags: ["Energ\u00E9ticas", "Personalizadas", "Emocional"],
  },
];

const testimonials = [
  {
    name: "Mar\u00EDa L.",
    text: "\u201CMe cambi\u00F3 la vida. Nunca pens\u00E9 que una sesi\u00F3n pudiera darme tanta claridad y paz interior. La recomiendo de coraz\u00F3n.\u201D",
    stars: 5,
  },
  {
    name: "Carolina R.",
    text: "\u201CIncre\u00EDble la precisi\u00F3n y la calidez con la que me gui\u00F3. Sent\u00ED una conexi\u00F3n genuina desde el primer momento.\u201D",
    stars: 5,
  },
  {
    name: "Luciana M.",
    text: "\u201CLa limpieza energ\u00E9tica fue transformadora. Me sent\u00ED liviana y renovada. Ya agend\u00E9 mi pr\u00F3xima sesi\u00F3n.\u201D",
    stars: 5,
  },
];

/* ─── Stars (deterministic) ─── */
function seededRandom(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

const stars = Array.from({ length: 120 }, (_, i) => ({
  id: i,
  top: `${seededRandom(i * 3 + 1) * 100}%`,
  left: `${seededRandom(i * 3 + 2) * 100}%`,
  size: seededRandom(i * 3 + 3) * 2.5 + 0.5,
  dur: `${seededRandom(i * 3 + 4) * 4 + 2}s`,
  delay: `${seededRandom(i * 3 + 5) * 5}s`,
}));

const particles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: `${seededRandom(i * 7 + 10) * 100}%`,
  dur: `${seededRandom(i * 7 + 11) * 6 + 5}s`,
  delay: `${seededRandom(i * 7 + 12) * 8}s`,
  size: seededRandom(i * 7 + 13) * 3 + 1,
}));

/* ─── SVG Icons ─── */
function WaIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function IgIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg className="w-5 h-5 fill-gold-bright" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

/* ─── Divider ─── */
function Divider() {
  return (
    <div className="divider">
      <div className="gold-line w-20 sm:w-36" />
      <span className="text-gold/40 text-xs spin-slow">{"\u2726"}</span>
      <div className="gold-line w-20 sm:w-36" />
    </div>
  );
}

/* ═══════════════════════════════════════
   PAGE
   ═══════════════════════════════════════ */

export default function Home() {
  const sectionsRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  /* Scroll listener for navbar */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Intersection observer for fade-in */
  useEffect(() => {
    const els = sectionsRef.current?.querySelectorAll(".fade-section");
    if (!els) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div ref={sectionsRef} className="relative">
      {/* ── NAVBAR ── */}
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="navbar-inner">
          <a href="#" className="nav-logo">TAROT AVE F{"\u00C9"}NIX</a>
          <ul className="nav-links">
            <li><a href="#servicios">Servicios</a></li>
            <li><a href="#experiencia">Sobre m{"\u00ED"}</a></li>
            <li><a href="#testimonios">Testimonios</a></li>
            <li><a href="#contacto">Contacto</a></li>
            <li><Link href="/turnos" className="nav-cta">Agendar turno</Link></li>
          </ul>
          <button
            className={`menu-btn ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <a href="#servicios" onClick={closeMenu}>SERVICIOS</a>
        <a href="#experiencia" onClick={closeMenu}>SOBRE M{"\u00CD"}</a>
        <a href="#testimonios" onClick={closeMenu}>TESTIMONIOS</a>
        <a href="#contacto" onClick={closeMenu}>CONTACTO</a>
        <Link href="/turnos" onClick={closeMenu} className="mt-4">
          <span className="btn-gold">AGENDAR TURNO</span>
        </Link>
      </div>

      {/* ── COSMIC BACKGROUND ── */}
      <div className="fixed inset-0 -z-10 cosmos" aria-hidden="true">
        <div
          className="nebula"
          style={{ top: "-15%", left: "-10%", width: "70vw", height: "70vw", background: "rgba(100, 40, 160, 0.15)" }}
        />
        <div
          className="nebula"
          style={{ top: "40%", right: "-15%", width: "55vw", height: "55vw", background: "rgba(180, 60, 110, 0.08)", animationDelay: "5s", animationDirection: "alternate-reverse" }}
        />
        <div
          className="nebula"
          style={{ bottom: "-10%", left: "25%", width: "50vw", height: "40vw", background: "rgba(70, 30, 140, 0.12)", animationDelay: "10s" }}
        />
        {stars.map((s) => (
          <span
            key={s.id}
            className="star"
            style={{ top: s.top, left: s.left, width: s.size, height: s.size, "--dur": s.dur, "--delay": s.delay } as React.CSSProperties}
          />
        ))}
      </div>

      {/* ══════════════════════════════════
          HERO
          ══════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20">
        {/* Glow orbs */}
        <div
          className="absolute w-[600px] h-[600px] rounded-full blur-[180px] opacity-15 pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(200,162,78,0.5), rgba(216,112,154,0.3), transparent)" }}
          aria-hidden="true"
        />

        {/* Rising particles */}
        {particles.map((p) => (
          <span
            key={p.id}
            className="particle"
            style={{
              left: p.left,
              bottom: "10%",
              width: p.size,
              height: p.size,
              "--p-dur": p.dur,
              "--p-delay": p.delay,
            } as React.CSSProperties}
          />
        ))}

        <div className="relative z-10 flex flex-col items-center max-w-5xl">
          {/* Pre-title */}
          <p className="section-label mb-8">
            {"\u2726"}&ensp;Gu{"\u00ED"}a Espiritual&ensp;{"\u00B7"}&ensp;Argentina&ensp;{"\u2726"}
          </p>

          {/* TITLE */}
          <h1 className="title-main text-[3.5rem] sm:text-[6rem] lg:text-[8.5rem] xl:text-[10rem]">
            TAROT
          </h1>
          <h1
            className="title-gradient text-[2.8rem] sm:text-[4.5rem] lg:text-[6.5rem] xl:text-[8rem] -mt-2 sm:-mt-4 lg:-mt-6"
            style={{ fontFamily: "var(--font-title)", fontWeight: 400, letterSpacing: "0.08em", lineHeight: 1 }}
          >
            AVE F{"\u00C9"}NIX
          </h1>

          {/* Divider */}
          <div className="flex items-center gap-5 mt-8 mb-8">
            <div className="gold-line w-16 sm:w-28" />
            <span className="text-gold/50 text-sm float">{"\u2727"}</span>
            <div className="gold-line w-16 sm:w-28" />
          </div>

          {/* Tagline */}
          <p
            className="text-2xl sm:text-3xl lg:text-4xl text-cream/65 font-light leading-relaxed tracking-wide max-w-xl"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Renac{"\u00E9"}, san{"\u00E1"} y encontr{"\u00E1"} tu camino.
          </p>
          <p
            className="text-base sm:text-lg text-pink-soft/35 mt-3 tracking-wider"
            style={{ fontFamily: "var(--font-body)" }}
          >
            El universo tiene un mensaje para vos.
          </p>

          {/* Experience badge */}
          <div className="mt-12 px-10 py-4 rounded-full border border-gold/25 bg-gold/5 backdrop-blur-sm pulse-ring">
            <span
              className="text-gold-bright text-base sm:text-lg tracking-[0.15em]"
              style={{ fontFamily: "var(--font-title)" }}
            >
              31 A{"\u00D1"}OS DE EXPERIENCIA
            </span>
          </div>

          {/* CTAs */}
          <div className="mt-16 flex flex-col sm:flex-row gap-5 items-center">
            <a
              href={waLink("Hola! Quiero consultar sobre una lectura de tarot \u{1F52E}")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              <WaIcon />
              Escribime ahora
            </a>
            <Link href="/turnos" className="btn-ghost">
              Agendar turno
            </Link>
          </div>
        </div>

        {/* Scroll arrow */}
        <div className="absolute bottom-10 bounce-arrow text-gold/25 text-3xl select-none">
          {"\u2193"}
        </div>
      </section>

      {/* ══════════════════════════════════
          QUOTE
          ══════════════════════════════════ */}
      <section className="quote-section fade-section">
        <div className="max-w-4xl mx-auto text-center px-6 py-20 sm:py-24">
          <p className="section-label mb-6">
            {"\u2726"}&ensp;Amor&ensp;{"\u00B7"}&ensp;Destino&ensp;{"\u00B7"}&ensp;Decisiones&ensp;{"\u2726"}
          </p>
          <blockquote
            className="text-3xl sm:text-5xl lg:text-6xl italic text-cream/55 leading-snug font-light"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {"\u201C"}{"\u00BF"}Necesit{"\u00E1"}s una se{"\u00F1"}al?
            <br className="hidden sm:block" />
            <span className="text-gold-bright/70"> El universo siempre tiene un mensaje para vos.</span>{"\u201D"}
          </blockquote>
        </div>
      </section>

      {/* ══════════════════════════════════
          SERVICES
          ══════════════════════════════════ */}
      <section id="servicios" className="relative py-28 sm:py-36 px-6 fade-section">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-6">
            <p className="section-label">
              {"\u2726"}&ensp;Mis servicios&ensp;{"\u2726"}
            </p>
            <h2 className="section-title text-4xl sm:text-6xl lg:text-7xl">
              {"\u00BF"}En qu{"\u00E9"} puedo ayudarte?
            </h2>
          </div>

          <Divider />

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mt-8">
            {services.map((s) => (
              <div key={s.title} className="card group">
                <div className="relative z-10 flex flex-col items-center">
                  <span className="text-6xl leading-none mb-4">{s.icon}</span>
                  <h3
                    className="text-2xl sm:text-3xl text-gold-bright/90 mb-1"
                    style={{ fontFamily: "var(--font-title)", letterSpacing: "0.03em" }}
                  >
                    {s.title}
                  </h3>
                  <p className="text-xs text-pink-soft/45 tracking-[0.2em] uppercase mb-5">
                    {s.sub}
                  </p>

                  <p
                    className="text-cream/45 text-lg sm:text-xl leading-relaxed mb-6"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {s.text}
                  </p>

                  <div className="flex flex-wrap justify-center gap-2 mb-7">
                    {s.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-4 py-1.5 rounded-full border border-gold/12 text-gold/45 tracking-wider"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <a
                    href={waLink(`Hola! Me interesa consultar sobre ${s.title} \u{1F52E}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-base text-gold/55 hover:text-gold-bright transition-colors tracking-wider uppercase group-hover:text-gold-bright"
                  >
                    <WaIcon className="w-5 h-5" />
                    Consultar
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          STATS
          ══════════════════════════════════ */}
      <section className="py-16 px-6 fade-section">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { num: "31+", label: "A\u00F1os de experiencia" },
              { num: "5K+", label: "Consultas realizadas" },
              { num: "100%", label: "Confidencialidad" },
              { num: "4.9", label: "Valoraci\u00F3n" },
            ].map((s) => (
              <div key={s.label} className="stat-item">
                <div className="stat-number">{s.num}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          EXPERIENCE / ABOUT
          ══════════════════════════════════ */}
      <section id="experiencia" className="relative py-28 px-6 overflow-hidden fade-section">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(200,162,78,0.05), transparent 70%)" }}
          aria-hidden="true"
        />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <p className="section-label">{"\u2726"}&ensp;Sobre m{"\u00ED"}&ensp;{"\u2726"}</p>
          <h2 className="section-title text-4xl sm:text-6xl lg:text-7xl mb-8">
            Tu gu{"\u00ED"}a espiritual
          </h2>
          <p
            className="text-2xl sm:text-3xl text-cream/45 font-light leading-relaxed max-w-2xl mx-auto mb-12"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Acompa{"\u00F1"}{"\u00E9"} a miles de personas a encontrar respuestas, claridad y paz interior.
            Cada consulta es un espacio {"\u00FA"}nico, confidencial y lleno de empat{"\u00ED"}a.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Lecturas personalizadas",
              "Videncia intuitiva",
              "Conexi\u00F3n espiritual",
              "Acompa\u00F1amiento con empat\u00EDa",
            ].map((t) => (
              <span
                key={t}
                className="text-sm sm:text-base px-6 py-3 rounded-full border border-gold/12 text-cream/35 bg-gold/3 tracking-wider"
              >
                {"\u2726"} {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          TESTIMONIALS
          ══════════════════════════════════ */}
      <section id="testimonios" className="py-28 sm:py-36 px-6 fade-section">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-6">
            <p className="section-label">{"\u2726"}&ensp;Testimonios&ensp;{"\u2726"}</p>
            <h2 className="section-title text-4xl sm:text-6xl lg:text-7xl">
              Lo que dicen quienes confiaron
            </h2>
          </div>

          <Divider />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {testimonials.map((t) => (
              <div key={t.name} className="testimonial-card">
                <div className="flex justify-center gap-1 mb-5">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <StarIcon key={i} />
                  ))}
                </div>
                <p
                  className="text-cream/50 text-xl leading-relaxed mb-6"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {t.text}
                </p>
                <p
                  className="text-gold/60 text-base tracking-[0.15em]"
                  style={{ fontFamily: "var(--font-title)" }}
                >
                  {t.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          CTA BANNER
          ══════════════════════════════════ */}
      <section className="py-20 px-6 fade-section">
        <div className="max-w-3xl mx-auto text-center">
          <div
            className="relative rounded-3xl overflow-hidden p-12 sm:p-16"
            style={{
              background: "linear-gradient(135deg, rgba(120,80,160,0.15), rgba(200,162,78,0.08), rgba(216,112,154,0.1))",
              border: "1px solid rgba(200, 162, 78, 0.15)",
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(circle at 50% 50%, rgba(200,162,78,0.06), transparent 70%)" }}
            />
            <div className="relative z-10">
              <h2
                className="text-3xl sm:text-5xl text-gold-bright font-light mb-5"
                style={{ fontFamily: "var(--font-title)", letterSpacing: "0.04em" }}
              >
                {"\u00BF"}List{"\u00E1"} para tu lectura?
              </h2>
              <p className="text-cream/40 text-xl sm:text-2xl mb-10 max-w-md mx-auto" style={{ fontFamily: "var(--font-body)" }}>
                Agend{"\u00E1"} tu turno online y eleg{"\u00ED"} el d{"\u00ED"}a y horario que mejor te quede.
              </p>
              <Link href="/turnos" className="btn-gold">
                AGENDAR MI TURNO
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          CONTACT
          ══════════════════════════════════ */}
      <section id="contacto" className="relative py-28 sm:py-36 px-6 fade-section">
        <div className="max-w-2xl mx-auto text-center">
          <p className="section-label">{"\u2726"}&ensp;Contacto&ensp;{"\u2726"}</p>
          <h2 className="section-title text-4xl sm:text-6xl lg:text-7xl mb-6">
            Empez{"\u00E1"} tu proceso hoy
          </h2>
          <p
            className="text-xl sm:text-2xl text-cream/35 font-light leading-relaxed mb-14 max-w-lg mx-auto"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Escribime y agendamos tu sesi{"\u00F3"}n.
            <br />
            Atiendo de manera virtual o presencial.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
            <a
              href={waLink("Hola! Quiero agendar una consulta \u{1F52E}")}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-link contact-wa"
            >
              <WaIcon className="w-8 h-8" />
              <div>
                <div className="text-xs uppercase tracking-[0.2em] opacity-60">WhatsApp</div>
                <div className="text-xl font-medium">+54 336 4034155</div>
              </div>
            </a>

            <a
              href="https://instagram.com/tarot.avefenix"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-link contact-ig"
            >
              <IgIcon className="w-8 h-8" />
              <div>
                <div className="text-xs uppercase tracking-[0.2em] opacity-60">Instagram</div>
                <div className="text-xl font-medium">@tarot.avefenix</div>
              </div>
            </a>
          </div>

          <Divider />

          <p className="text-cream/15 text-sm tracking-[0.3em] uppercase mt-2">
            Consultas abiertas {"\u2014"} virtual o presencial
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════
          FOOTER
          ══════════════════════════════════ */}
      <footer className="border-t border-white/5 py-14 px-6">
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-8 text-center">
          <div>
            <p
              className="text-gold/75 text-lg sm:text-xl tracking-[0.2em]"
              style={{ fontFamily: "var(--font-title)" }}
            >
              TAROT AVE F{"\u00C9"}NIX
            </p>
            <p className="text-cream/15 text-sm mt-2 tracking-wider">
              {"\u00A9"} {new Date().getFullYear()} {"\u00B7"} Renac{"\u00E9"}, san{"\u00E1"} y encontr{"\u00E1"} tu camino
            </p>
          </div>
          <nav className="flex flex-wrap justify-center gap-8 text-base text-cream/20">
            <a href="#servicios" className="hover:text-gold transition-colors tracking-wider">
              Servicios
            </a>
            <a href="#testimonios" className="hover:text-gold transition-colors tracking-wider">
              Testimonios
            </a>
            <a href="#contacto" className="hover:text-gold transition-colors tracking-wider">
              Contacto
            </a>
            <Link href="/turnos" className="hover:text-gold transition-colors tracking-wider">
              Turnos
            </Link>
            <Link href="/admin" className="hover:text-gold transition-colors tracking-wider">
              Admin
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
