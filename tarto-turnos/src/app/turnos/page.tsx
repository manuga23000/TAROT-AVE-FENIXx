"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  addTurno,
  useConfig,
  useServicios,
  useTurnos,
} from "@/lib/store";
import {
  fechaEsValida,
  formatFecha,
  formatPrecio,
  generarSlots,
} from "@/lib/utils";
import type { Modalidad, Servicio, Turno } from "@/lib/types";

const modalidades: { id: Modalidad; label: string; icon: string }[] = [
  { id: "presencial", label: "Presencial", icon: "✦" },
  { id: "video", label: "Videollamada", icon: "▣" },
  { id: "telefono", label: "Teléfono", icon: "✆" },
];

const inputCls =
  "w-full rounded-2xl bg-violet-950/60 border border-violet-300/20 px-4 py-3 text-violet-50 placeholder:text-violet-300/40 focus:outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-500/30 transition";

export default function TurnosPage() {
  const { data: servicios } = useServicios();
  const { data: config, ready: configReady } = useConfig();
  const { data: turnos } = useTurnos();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [servicioId, setServicioId] = useState("");
  const [modalidad, setModalidad] = useState<Modalidad>("video");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [consulta, setConsulta] = useState("");
  const [confirmado, setConfirmado] = useState<Turno | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const servicioSel = servicios.find((s) => s.id === servicioId);

  const modalidadesDisponibles = useMemo(
    () =>
      modalidades.filter(
        (m) => !(config.modalidadesBloqueadas || []).includes(m.id),
      ),
    [config],
  );

  const slotsDisponibles = useMemo(() => {
    if (!fecha) return [];
    if (!fechaEsValida(fecha, config)) return [];
    const ocupados = turnos
      .filter((t) => t.fecha === fecha && t.estado !== "cancelado")
      .map((t) => t.hora);
    return generarSlots(fecha, config, ocupados);
  }, [fecha, config, turnos]);

  const diasSugeridos = useMemo(() => {
    const diasMax = config.diasDisponibilidad || 14;
    const dias: { fecha: string; nombreDia: string; numero: number; mes: string }[] = [];
    const hoy = new Date();
    let i = 0;
    while (dias.length < diasMax && i < 90) {
      const d = new Date(hoy);
      d.setDate(hoy.getDate() + i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      const fechaStr = `${yyyy}-${mm}-${dd}`;
      if (fechaEsValida(fechaStr, config)) {
        dias.push({
          fecha: fechaStr,
          nombreDia: d.toLocaleDateString("es", { weekday: "short" }).replace(".", ""),
          numero: d.getDate(),
          mes: d.toLocaleDateString("es", { month: "short" }).replace(".", ""),
        });
      }
      i++;
    }
    return dias;
  }, [config]);

  async function handleConfirmar() {
    setError("");
    if (!servicioId || !fecha || !hora || !nombre || !telefono) {
      setError("Por favor completá todos los campos obligatorios.");
      return;
    }
    setSubmitting(true);
    try {
      const nuevo = await addTurno({
        nombre: nombre.trim(),
        telefono: telefono.trim(),
        email: email.trim(),
        servicioId,
        fecha,
        hora,
        modalidad,
        consulta: consulta.trim(),
      });
      setConfirmado(nuevo);
    } catch (e) {
      setError("No se pudo registrar el turno. Intentá de nuevo.");
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmado) {
    return (
      <Confirmacion
        turno={confirmado}
        servicio={servicios.find((s) => s.id === confirmado.servicioId)}
      />
    );
  }

  if (configReady && config.modoVacaciones) {
    return <Vacaciones />;
  }

  return (
    <div className="px-5 py-10 md:py-16">
      <div className="mx-auto max-w-3xl">
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <p className="text-xs uppercase tracking-[0.22em] text-violet-300/80">
            Reservar turno
          </p>
          <h1 className="mt-2 font-display text-4xl md:text-5xl text-violet-50">
            Elegí tu lectura
          </h1>
          <p className="mt-3 text-violet-200/70">
            Cuatro pasos rápidos. Recibís la confirmación al instante.
          </p>
        </motion.header>

        <Stepper step={step} />

        <AnimatePresence mode="wait">
          {step === 1 && (
            <StepBox key="s1">
              <div className="space-y-3">
                {servicios.map((s, i) => (
                  <motion.button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setServicioId(s.id);
                      setStep(2);
                    }}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ y: -3 }}
                    className={`w-full text-left glass rounded-3xl p-5 md:p-6 hover:bg-violet-500/10 ${
                      servicioId === s.id ? "ring-2 ring-violet-400" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-display text-2xl text-violet-50">
                          {s.nombre}
                        </h3>
                        <p className="mt-1 text-sm text-violet-200/75">
                          {s.descripcion}
                        </p>
                        <p className="mt-2 text-xs text-violet-300/70">
                          {s.duracionMin} minutos
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-gold font-display text-xl">
                          {formatPrecio(s.precio)}
                        </div>
                        <div className="text-[11px] uppercase tracking-wider text-violet-300/60 mt-1">
                          elegir →
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </StepBox>
          )}

          {step === 2 && (
            <StepBox key="s2">
              <h2 className="font-display text-2xl text-violet-50 mb-4">
                ¿Cómo querés tu lectura?
              </h2>
              {modalidadesDisponibles.length === 0 ? (
                <p className="text-violet-300/70 italic glass rounded-2xl p-6 text-center">
                  No hay modalidades disponibles en este momento.
                </p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-3">
                  {modalidadesDisponibles.map((m, i) => (
                    <motion.button
                      key={m.id}
                      type="button"
                      onClick={() => setModalidad(m.id)}
                      initial={{ opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.06 }}
                      whileHover={{ scale: 1.03 }}
                      className={`glass rounded-2xl p-5 text-center ${
                        modalidad === m.id
                          ? "bg-violet-500/20 ring-2 ring-violet-400"
                          : "hover:bg-violet-500/10"
                      }`}
                    >
                      <div className="text-3xl text-gold">{m.icon}</div>
                      <div className="mt-2 text-violet-50">{m.label}</div>
                    </motion.button>
                  ))}
                </div>
              )}
              <NavBtns
                onBack={() => setStep(1)}
                onNext={() => modalidadesDisponibles.length > 0 && setStep(3)}
                nextDisabled={modalidadesDisponibles.length === 0}
              />
            </StepBox>
          )}

          {step === 3 && (
            <StepBox key="s3">
              <h2 className="font-display text-2xl text-violet-50 mb-4">
                Elegí día y horario
              </h2>
              <div className="flex gap-2 overflow-x-auto pb-3 -mx-5 px-5 snap-x">
                {diasSugeridos.map((d, i) => {
                  const active = fecha === d.fecha;
                  return (
                    <motion.button
                      key={d.fecha}
                      type="button"
                      onClick={() => {
                        setFecha(d.fecha);
                        setHora("");
                      }}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className={`shrink-0 snap-start min-w-[78px] rounded-2xl px-3 py-4 text-center border transition-all ${
                        active
                          ? "bg-gradient-to-b from-violet-500 to-violet-700 border-violet-300 text-white shadow-lg shadow-violet-500/40"
                          : "glass border-transparent text-violet-100 hover:bg-violet-500/10"
                      }`}
                    >
                      <div className="text-[10px] uppercase tracking-wider opacity-80">
                        {d.nombreDia}
                      </div>
                      <div className="text-2xl font-display mt-1">{d.numero}</div>
                      <div className="text-[10px] uppercase opacity-75">{d.mes}</div>
                    </motion.button>
                  );
                })}
              </div>

              {fecha && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6"
                >
                  <p className="text-sm text-violet-300/80 mb-3">
                    Horarios disponibles para{" "}
                    <span className="text-violet-100">{formatFecha(fecha)}</span>
                  </p>
                  {slotsDisponibles.length === 0 ? (
                    <p className="text-violet-300/70 italic">
                      No hay horarios disponibles ese día. Probá con otra fecha.
                    </p>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {slotsDisponibles.map((s, i) => {
                        const active = hora === s;
                        return (
                          <motion.button
                            key={s}
                            type="button"
                            onClick={() => setHora(s)}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.02 }}
                            className={`py-3 rounded-xl text-sm font-medium transition-all ${
                              active
                                ? "bg-gradient-to-r from-violet-400 to-fuchsia-500 text-white shadow-lg shadow-violet-500/30"
                                : "glass text-violet-100 hover:bg-violet-500/10"
                            }`}
                          >
                            {s}
                          </motion.button>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}

              <NavBtns
                onBack={() => setStep(2)}
                onNext={() => fecha && hora && setStep(4)}
                nextDisabled={!fecha || !hora}
              />
            </StepBox>
          )}

          {step === 4 && (
            <StepBox key="s4">
              <h2 className="font-display text-2xl text-violet-50 mb-4">
                Tus datos
              </h2>
              <div className="glass rounded-3xl p-6 md:p-8 space-y-4">
                <Field label="Nombre completo *">
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className={inputCls}
                    placeholder="Tu nombre"
                  />
                </Field>
                <div className="grid md:grid-cols-2 gap-4">
                  <Field label="Teléfono / WhatsApp *">
                    <input
                      type="tel"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      className={inputCls}
                      placeholder="Tu número de WhatsApp"
                    />
                  </Field>
                  <Field label="Email">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={inputCls}
                      placeholder="tu@email.com"
                    />
                  </Field>
                </div>
                <Field label="Contanos brevemente tu consulta (opcional)">
                  <textarea
                    value={consulta}
                    onChange={(e) => setConsulta(e.target.value)}
                    rows={3}
                    className={inputCls + " resize-none"}
                    placeholder="¿Hay algo específico que querés explorar?"
                  />
                </Field>

                <div className="mt-2 rounded-2xl bg-violet-900/40 border border-violet-300/15 p-4 text-sm space-y-1">
                  <p className="text-violet-300/70 uppercase text-[10px] tracking-wider">
                    Resumen
                  </p>
                  <p className="text-violet-100">
                    <strong>{servicioSel?.nombre}</strong> ·{" "}
                    {modalidades.find((m) => m.id === modalidad)?.label}
                  </p>
                  <p className="text-violet-100">
                    {formatFecha(fecha)} a las <strong>{hora} hs</strong>
                  </p>
                  {servicioSel && (
                    <p className="text-gold">{formatPrecio(servicioSel.precio)}</p>
                  )}
                </div>

                {error && (
                  <p className="text-rose-300 text-sm bg-rose-500/10 border border-rose-400/30 rounded-xl p-3">
                    {error}
                  </p>
                )}
              </div>
              <NavBtns
                onBack={() => setStep(3)}
                onNext={handleConfirmar}
                nextLabel={submitting ? "Reservando..." : "Confirmar reserva"}
                nextDisabled={submitting}
              />
            </StepBox>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Vacaciones() {
  return (
    <div className="px-5 py-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-xl glass rounded-3xl p-10 md:p-14 text-center relative overflow-hidden"
      >
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-violet-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-fuchsia-500/20 rounded-full blur-3xl" />
        <div className="relative">
          <div className="text-6xl mb-6">✦</div>
          <h1 className="font-display text-4xl md:text-5xl text-violet-50">
            Estamos en descanso
          </h1>
          <p className="mt-4 text-violet-200/80 text-lg leading-relaxed">
            En este momento no estoy tomando turnos. ¡Pero vuelvo pronto!
            Mientras tanto, podés escribirme por WhatsApp para cualquier
            consulta.
          </p>
          <a
            href="https://wa.me/5493364034155"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 text-white font-medium shadow-lg shadow-emerald-500/30"
          >
            Escribime por WhatsApp
          </a>
        </div>
      </motion.div>
    </div>
  );
}

function StepBox({ children }: { children: React.ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="mt-8"
    >
      {children}
    </motion.section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-wider text-violet-300/80 mb-1.5">
        {label}
      </span>
      {children}
    </label>
  );
}

function Stepper({ step }: { step: number }) {
  const items = ["Lectura", "Modalidad", "Fecha", "Datos"];
  return (
    <ol className="flex items-center justify-between gap-2 max-w-md mx-auto">
      {items.map((label, i) => {
        const n = i + 1;
        const done = step > n;
        const active = step === n;
        return (
          <li key={label} className="flex-1 flex flex-col items-center">
            <motion.div
              animate={{
                scale: active ? 1.1 : 1,
              }}
              transition={{ type: "spring", stiffness: 300 }}
              className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-medium ${
                active
                  ? "bg-gradient-to-br from-violet-400 to-fuchsia-500 text-white shadow-lg shadow-violet-500/40"
                  : done
                    ? "bg-violet-500/40 text-violet-50"
                    : "bg-violet-950/60 border border-violet-300/20 text-violet-300/60"
              }`}
            >
              {done ? "✓" : n}
            </motion.div>
            <span
              className={`mt-1.5 text-[10px] uppercase tracking-wider ${
                active ? "text-violet-100" : "text-violet-300/60"
              }`}
            >
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function NavBtns({
  onBack,
  onNext,
  nextDisabled,
  nextLabel = "Siguiente",
}: {
  onBack: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
}) {
  return (
    <div className="mt-6 flex gap-3">
      <button
        type="button"
        onClick={onBack}
        className="flex-1 sm:flex-none px-6 py-3 rounded-full glass text-violet-100 hover:bg-violet-500/10"
      >
        ← Atrás
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled}
        className="flex-1 px-6 py-3 rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-500 text-white font-medium shadow-lg shadow-violet-500/30 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {nextLabel}
      </button>
    </div>
  );
}

function Confirmacion({
  turno,
  servicio,
}: {
  turno: Turno;
  servicio?: Servicio;
}) {
  return (
    <div className="px-5 py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-xl glass rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
      >
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-violet-500/30 rounded-full blur-3xl" />
        <div className="relative">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: [0, -10, 10, 0] }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-500 flex items-center justify-center text-3xl text-white shadow-lg shadow-violet-500/40"
          >
            ✓
          </motion.div>
          <h1 className="mt-6 font-display text-4xl text-violet-50">
            ¡Turno reservado!
          </h1>
          <p className="mt-3 text-violet-200/80">
            Gracias {turno.nombre.split(" ")[0]}. Te esperamos.
          </p>
          <div className="mt-8 text-left space-y-2 bg-violet-950/40 border border-violet-300/15 rounded-2xl p-5 text-sm">
            <Row label="Lectura" value={servicio?.nombre || "-"} />
            <Row label="Fecha" value={formatFecha(turno.fecha)} />
            <Row label="Hora" value={turno.hora + " hs"} />
            <Row label="Modalidad" value={turno.modalidad} />
            <Row label="Código" value={turno.id.slice(0, 8).toUpperCase()} />
          </div>
          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-500 text-white font-medium shadow-lg shadow-violet-500/40"
          >
            Volver al inicio
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-violet-300/70 uppercase text-[10px] tracking-wider">
        {label}
      </span>
      <span className="text-violet-50 capitalize">{value}</span>
    </div>
  );
}
