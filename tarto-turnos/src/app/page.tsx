"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import {
  InstagramIcon,
  SOCIAL,
  TikTokIcon,
  WhatsAppIcon,
} from "@/components/social-icons";

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

const contactos = [
  {
    ...SOCIAL.whatsapp,
    label: "WhatsApp",
    sub: "Escribime directo y coordinamos",
    Icon: WhatsAppIcon,
    accent: "from-emerald-400/30 to-emerald-700/30",
    iconColor: "text-emerald-300",
  },
  {
    ...SOCIAL.instagram,
    label: "Instagram",
    sub: SOCIAL.instagram.handle,
    Icon: InstagramIcon,
    accent: "from-fuchsia-400/30 to-pink-700/30",
    iconColor: "text-fuchsia-300",
  },
  {
    ...SOCIAL.tiktok,
    label: "TikTok",
    sub: SOCIAL.tiktok.handle,
    Icon: TikTokIcon,
    accent: "from-violet-400/30 to-violet-700/30",
    iconColor: "text-violet-200",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

export default function Home() {
  return (
    <>
      <section className="relative px-5 pt-12 pb-20 md:pt-20 md:pb-28">
        <div className="mx-auto max-w-6xl grid gap-12 md:grid-cols-2 items-center">
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.12 } } }}
            className="text-center md:text-left"
          >
            <motion.span
              variants={fadeUp}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs uppercase tracking-[0.22em] text-violet-200"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-gold animate-twinkle" />
              Tarot &amp; Guía Espiritual
            </motion.span>
            <motion.h1
              variants={fadeUp}
              className="mt-6 font-display text-5xl md:text-7xl leading-[1.05] text-violet-50"
            >
              Alineá tu energía <br />
              <span className="text-shimmer italic">y transformá</span>
              <br /> tu vida
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="mt-6 text-lg text-violet-100/80 max-w-md mx-auto md:mx-0 leading-relaxed"
            >
              Soy <strong className="text-violet-100">Marce</strong>, tarotista y
              guía espiritual detrás de{" "}
              <strong className="text-violet-100">Ave Fénix</strong>. Te
              acompaño a encontrar respuestas, claridad y un camino que se
              siente propio. <em>Lo que buscás también te está buscando.</em>
            </motion.p>
            <motion.div
              variants={fadeUp}
              className="mt-9 flex flex-col sm:flex-row gap-3 justify-center md:justify-start"
            >
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
            </motion.div>
            <motion.div
              variants={fadeUp}
              className="mt-10 flex items-center gap-6 justify-center md:justify-start text-sm text-violet-200/70"
            >
              <Stat numero="Virtual" label="o presencial" />
              <div className="h-8 w-px bg-violet-300/20" />
              <Stat numero="Años" label="de experiencia" />
              <div className="h-8 w-px bg-violet-300/20" />
              <Stat numero="100%" label="confidencial" />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85, rotate: -6 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="relative mx-auto md:mx-0 w-full max-w-sm"
          >
            <div className="absolute -inset-8 bg-violet-500/20 blur-3xl rounded-full" />
            <div className="relative animate-float">
              <TarotCard />
            </div>
          </motion.div>
        </div>
      </section>

      <Section>
        <div className="mx-auto max-w-5xl glass rounded-3xl p-8 md:p-14">
          <div className="grid gap-8 md:grid-cols-[auto_1fr] items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative mx-auto h-36 w-36 md:h-44 md:w-44 rounded-full overflow-hidden ring-1 ring-violet-300/30 glow shrink-0"
            >
              <Image
                src="/logo.png"
                alt="Tarot Ave Fénix"
                fill
                sizes="(min-width: 768px) 176px, 144px"
                className="object-cover"
              />
            </motion.div>
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
      </Section>

      <Section id="servicios">
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
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={{ show: { transition: { staggerChildren: 0.08 } } }}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {servicios.map((s) => (
              <motion.div
                key={s.titulo}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="glass rounded-3xl p-6 hover:bg-violet-500/10"
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
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      <Section>
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
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={{ show: { transition: { staggerChildren: 0.1 } } }}
            className="grid gap-5 sm:grid-cols-3 max-w-3xl mx-auto"
          >
            {contactos.map(({ href, label, sub, Icon, accent, iconColor }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                variants={fadeUp}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="glass rounded-3xl p-8 text-center hover:bg-violet-500/10"
              >
                <div
                  className={`h-16 w-16 mx-auto rounded-2xl bg-gradient-to-br ${accent} flex items-center justify-center text-3xl`}
                >
                  <Icon className={`h-8 w-8 ${iconColor}`} />
                </div>
                <h3 className="mt-4 font-display text-2xl text-violet-50">
                  {label}
                </h3>
                <p className="mt-2 text-sm text-violet-200/80">{sub}</p>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </Section>

      <Section>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-4xl glass rounded-3xl p-10 md:p-14 text-center relative overflow-hidden"
        >
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
        </motion.div>
      </Section>
    </>
  );
}

function Section({
  children,
  id,
}: {
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="px-5 py-16">
      {children}
    </section>
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
      <div className="absolute top-6 right-6 h-2 w-2 bg-gold rounded-full animate-twinkle" />
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
