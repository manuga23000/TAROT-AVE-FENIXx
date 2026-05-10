"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  FIREBASE_MODE,
  deleteTurno,
  loginAdmin,
  logoutAdmin,
  setConfig,
  setServicios,
  updateTurno,
  useAuthState,
  useConfig,
  useServicios,
  useTurnos,
  addTurno,
} from "@/lib/store";
import {
  fechaEsValida,
  formatFecha,
  formatPrecio,
  generarSlots,
  generarTodosSlots,
} from "@/lib/utils";
import type {
  Config,
  Modalidad,
  Servicio,
  Turno,
  TurnoEstado,
} from "@/lib/types";

type Tab = "turnos" | "servicios" | "config" | "stats";

const inputCls =
  "w-full rounded-2xl bg-violet-950/60 border border-violet-300/20 px-4 py-3 text-violet-50 placeholder:text-violet-300/40 focus:outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-500/30 transition text-base";

export default function AdminPage() {
  const { user, ready } = useAuthState();

  if (!ready) return <AdminLoader />;
  if (!user) return <LoginForm />;
  return <AdminPanel />;
}

function AdminLoader() {
  return (
    <div className="px-5 py-32 flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
        className="h-12 w-12 rounded-full border-2 border-violet-300/20 border-t-violet-300"
      />
    </div>
  );
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const useFirebase = FIREBASE_MODE === "firebase";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    const result = await loginAdmin(useFirebase ? email : pwd, useFirebase ? pwd : undefined);
    if (result) setErr(result);
    setLoading(false);
  }

  return (
    <div className="px-5 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-sm glass rounded-3xl p-8"
      >
        <h1 className="font-display text-3xl text-violet-50 text-center">
          Panel Ave Fénix
        </h1>
        <p className="mt-2 text-center text-sm text-violet-200/70">
          {useFirebase ? "Ingresá con tu cuenta" : "Ingresá tu contraseña"}
        </p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {useFirebase && (
            <input
              type="email"
              autoFocus
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputCls}
              placeholder="email@ejemplo.com"
            />
          )}
          <input
            type="password"
            autoFocus={!useFirebase}
            required
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            className={inputCls}
            placeholder="••••••••"
          />
          {err && (
            <p className="text-rose-300 text-sm bg-rose-500/10 border border-rose-400/30 rounded-xl p-2.5">
              {err}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full px-6 py-3.5 rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-500 text-white font-medium shadow-lg shadow-violet-500/30 text-base disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

function AdminPanel() {
  const [tab, setTab] = useState<Tab>("turnos");
  const { data: turnos } = useTurnos();
  const { data: servicios } = useServicios();
  const { data: config } = useConfig();

  return (
    <div className="px-4 py-6 md:py-10">
      <div className="mx-auto max-w-6xl">
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between gap-4 mb-5"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-violet-300/80">
              Panel
            </p>
            <h1 className="font-display text-2xl md:text-4xl text-violet-50">
              Hola, Marce
            </h1>
          </div>
          <button
            onClick={() => logoutAdmin()}
            className="px-4 py-2.5 text-sm rounded-full glass text-violet-100 hover:bg-violet-500/10"
          >
            Salir
          </button>
        </motion.header>

        <AnimatePresence>
          {config.modoVacaciones && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 rounded-2xl bg-amber-500/15 border border-amber-400/30 p-4 flex items-center gap-3"
            >
              <span className="text-2xl">✦</span>
              <div>
                <p className="text-amber-200 font-medium text-sm">
                  Modo vacaciones activado
                </p>
                <p className="text-amber-200/70 text-xs">
                  Los clientes no pueden reservar turnos
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-2 overflow-x-auto -mx-4 px-4 pb-2">
          {(
            [
              ["turnos", "Turnos"],
              ["stats", "Resumen"],
              ["servicios", "Lecturas"],
              ["config", "Config"],
            ] as const
          ).map(([id, label]) => {
            const active = tab === id;
            return (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`relative shrink-0 px-5 py-3 rounded-full text-sm font-medium ${
                  active ? "text-white" : "glass text-violet-100 hover:bg-violet-500/10"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="admin-tab"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-500 shadow-lg shadow-violet-500/30"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative">{label}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {tab === "turnos" && (
                <TurnosTab
                  turnos={turnos}
                  servicios={servicios}
                  config={config}
                />
              )}
              {tab === "stats" && (
                <StatsTab turnos={turnos} servicios={servicios} />
              )}
              {tab === "servicios" && <ServiciosTab servicios={servicios} />}
              {tab === "config" && <ConfigTab config={config} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function TurnosTab({
  turnos,
  servicios,
  config,
}: {
  turnos: Turno[];
  servicios: Servicio[];
  config: Config;
}) {
  const [filtro, setFiltro] = useState<TurnoEstado | "todos">("todos");
  const [busqueda, setBusqueda] = useState("");
  const [showAgregar, setShowAgregar] = useState(false);

  const lista = useMemo(() => {
    return [...turnos]
      .sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora))
      .filter((t) => filtro === "todos" || t.estado === filtro)
      .filter((t) =>
        busqueda
          ? (t.nombre + t.telefono + t.email)
              .toLowerCase()
              .includes(busqueda.toLowerCase())
          : true,
      );
  }, [turnos, filtro, busqueda]);

  return (
    <div>
      <button
        onClick={() => setShowAgregar(true)}
        className="w-full mb-4 py-4 rounded-2xl bg-gradient-to-r from-violet-400 to-fuchsia-500 text-white font-medium shadow-lg shadow-violet-500/30 text-base"
      >
        + Agregar turno
      </button>

      <div className="flex flex-col gap-4 mb-5">
        <input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre o teléfono..."
          className={inputCls}
        />
        <select
          value={filtro}
          onChange={(e) => setFiltro(e.target.value as TurnoEstado | "todos")}
          className={inputCls}
        >
          <option value="todos">Todos los estados</option>
          <option value="pendiente">Pendientes</option>
          <option value="confirmado">Confirmados</option>
          <option value="completado">Completados</option>
          <option value="cancelado">Cancelados</option>
        </select>
      </div>

      {lista.length === 0 ? (
        <div className="glass rounded-3xl p-10 text-center text-violet-200/70">
          No hay turnos que mostrar.
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.04 } } }}
          className="space-y-3"
        >
          {lista.map((t) => {
            const servicio = servicios.find((s) => s.id === t.servicioId);
            return (
              <motion.article
                key={t.id}
                layout
                variants={{
                  hidden: { opacity: 0, y: 8 },
                  show: { opacity: 1, y: 0 },
                }}
                className="glass rounded-2xl p-5"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-display text-xl text-violet-50">
                        {t.nombre}
                      </h3>
                      <EstadoBadge estado={t.estado} />
                    </div>
                    <p className="text-sm text-violet-200/80 mt-1">
                      {servicio?.nombre || "Lectura"} · {t.modalidad}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-violet-200/70">
                  {formatFecha(t.fecha)} — {t.hora} hs
                </p>
                <p className="text-sm text-violet-200/70 mt-1">
                  {t.telefono}
                  {t.email && (
                    <span className="text-violet-300/60"> · {t.email}</span>
                  )}
                </p>
                {t.consulta && (
                  <p className="mt-2 text-sm italic text-violet-200/70 bg-violet-900/30 rounded-xl p-3">
                    &ldquo;{t.consulta}&rdquo;
                  </p>
                )}
                <div className="mt-3 flex gap-2">
                  <select
                    value={t.estado}
                    onChange={(e) =>
                      updateTurno(t.id, { estado: e.target.value as TurnoEstado })
                    }
                    className="flex-1 rounded-xl bg-violet-950/60 border border-violet-300/20 px-3 py-2.5 text-sm text-violet-50"
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="confirmado">Confirmado</option>
                    <option value="completado">Completado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                  <button
                    onClick={() => {
                      if (confirm("¿Eliminar este turno?")) deleteTurno(t.id);
                    }}
                    className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-2.5 text-sm text-rose-200 hover:bg-rose-500/20"
                  >
                    Eliminar
                  </button>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      )}

      <AnimatePresence>
        {showAgregar && (
          <AgregarTurnoModal
            servicios={servicios}
            config={config}
            turnos={turnos}
            onClose={() => setShowAgregar(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function EstadoBadge({ estado }: { estado: TurnoEstado }) {
  const styles: Record<TurnoEstado, string> = {
    pendiente: "bg-amber-500/15 text-amber-200 border-amber-400/30",
    confirmado: "bg-emerald-500/15 text-emerald-200 border-emerald-400/30",
    completado: "bg-violet-500/15 text-violet-200 border-violet-400/30",
    cancelado: "bg-rose-500/15 text-rose-200 border-rose-400/30",
  };
  return (
    <span
      className={`text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full border ${styles[estado]}`}
    >
      {estado}
    </span>
  );
}

function AgregarTurnoModal({
  servicios,
  config,
  turnos,
  onClose,
}: {
  servicios: Servicio[];
  config: Config;
  turnos: Turno[];
  onClose: () => void;
}) {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [servicioId, setServicioId] = useState(servicios[0]?.id || "");
  const [modalidad, setModalidad] = useState<Modalidad>("video");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [consulta, setConsulta] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const slotsDisponibles = useMemo(() => {
    if (!fecha || !fechaEsValida(fecha, config)) return [];
    const ocupados = turnos
      .filter((t) => t.fecha === fecha && t.estado !== "cancelado")
      .map((t) => t.hora);
    return generarSlots(fecha, config, ocupados);
  }, [fecha, config, turnos]);

  async function handleSave() {
    if (!nombre.trim() || !telefono.trim() || !servicioId || !fecha || !hora) {
      setError("Completá nombre, teléfono, fecha y hora.");
      return;
    }
    setSaving(true);
    try {
      await addTurno({
        nombre: nombre.trim(),
        telefono: telefono.trim(),
        email: "",
        servicioId,
        fecha,
        hora,
        modalidad,
        consulta: consulta.trim(),
      });
      onClose();
    } catch (e) {
      console.error(e);
      setError("No se pudo guardar.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal onClose={onClose} title="Agregar turno">
      <div className="space-y-5">
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre del cliente *"
          className={inputCls}
        />
        <input
          type="tel"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          placeholder="Teléfono / WhatsApp *"
          className={inputCls}
        />
        <select
          value={servicioId}
          onChange={(e) => setServicioId(e.target.value)}
          className={inputCls}
        >
          {servicios.map((s) => (
            <option key={s.id} value={s.id}>
              {s.nombre}
            </option>
          ))}
        </select>

        <div className="grid grid-cols-3 gap-2.5">
          {(["presencial", "video", "telefono"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setModalidad(m)}
              className={`py-3 rounded-xl text-sm capitalize transition-all ${
                modalidad === m
                  ? "bg-gradient-to-r from-violet-400 to-fuchsia-500 text-white"
                  : "glass text-violet-100"
              }`}
            >
              {m === "video" ? "Video" : m === "telefono" ? "Teléfono" : "Presencial"}
            </button>
          ))}
        </div>

        <input
          type="date"
          value={fecha}
          onChange={(e) => {
            setFecha(e.target.value);
            setHora("");
          }}
          className={inputCls}
        />

        {fecha && slotsDisponibles.length > 0 && (
          <div className="grid grid-cols-4 gap-2.5">
            {slotsDisponibles.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setHora(s)}
                className={`py-3 rounded-xl text-sm transition-all ${
                  hora === s
                    ? "bg-gradient-to-r from-violet-400 to-fuchsia-500 text-white"
                    : "glass text-violet-100"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}
        {fecha && slotsDisponibles.length === 0 && (
          <p className="text-violet-300/70 text-sm italic">
            Sin horarios disponibles para esa fecha.
          </p>
        )}

        <textarea
          value={consulta}
          onChange={(e) => setConsulta(e.target.value)}
          placeholder="Nota (opcional)"
          rows={2}
          className={inputCls + " resize-none"}
        />

        {error && (
          <p className="text-rose-300 text-sm bg-rose-500/10 border border-rose-400/30 rounded-xl p-3">
            {error}
          </p>
        )}
      </div>
      <ModalFooter
        onCancel={onClose}
        onSave={handleSave}
        saveLabel={saving ? "Guardando..." : "Guardar"}
        saving={saving}
      />
    </Modal>
  );
}

function StatsTab({
  turnos,
  servicios,
}: {
  turnos: Turno[];
  servicios: Servicio[];
}) {
  const total = turnos.length;
  const pendientes = turnos.filter((t) => t.estado === "pendiente").length;
  const confirmados = turnos.filter((t) => t.estado === "confirmado").length;

  const ingresoEstimado = turnos
    .filter((t) => t.estado === "completado" || t.estado === "confirmado")
    .reduce(
      (acc, t) =>
        acc + (servicios.find((s) => s.id === t.servicioId)?.precio || 0),
      0,
    );

  const proximos = [...turnos]
    .filter((t) => t.estado !== "cancelado")
    .filter((t) => new Date(t.fecha + "T" + t.hora) >= new Date())
    .sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora))
    .slice(0, 5);

  const porServicio = servicios.map((s) => ({
    nombre: s.nombre,
    cantidad: turnos.filter((t) => t.servicioId === s.id).length,
  }));
  const maxCant = Math.max(1, ...porServicio.map((p) => p.cantidad));

  return (
    <div className="space-y-5">
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.06 } } }}
        className="grid gap-3 grid-cols-2"
      >
        <KPI label="Total" value={total.toString()} icon="✦" />
        <KPI label="Pendientes" value={pendientes.toString()} icon="◷" />
        <KPI label="Confirmados" value={confirmados.toString()} icon="✓" />
        <KPI
          label="Ingresos est."
          value={formatPrecio(ingresoEstimado)}
          icon="✺"
          small
        />
      </motion.div>

      <div className="glass rounded-3xl p-5">
        <h3 className="font-display text-xl text-violet-50 mb-4">
          Próximos turnos
        </h3>
        {proximos.length === 0 ? (
          <p className="text-violet-200/70 text-sm">No hay próximos turnos.</p>
        ) : (
          <ul className="space-y-2.5">
            {proximos.map((t) => (
              <li
                key={t.id}
                className="flex justify-between items-center text-sm bg-violet-900/30 rounded-xl px-4 py-3"
              >
                <div>
                  <div className="text-violet-50 font-medium">{t.nombre}</div>
                  <div className="text-violet-300/70 text-xs">
                    {formatFecha(t.fecha)}
                  </div>
                </div>
                <div className="text-gold font-display text-lg">{t.hora}</div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="glass rounded-3xl p-5">
        <h3 className="font-display text-xl text-violet-50 mb-4">
          Lecturas más pedidas
        </h3>
        <ul className="space-y-3">
          {porServicio.map((p) => (
            <li key={p.nombre}>
              <div className="flex justify-between text-sm text-violet-100 mb-1">
                <span>{p.nombre}</span>
                <span className="text-violet-300/70">{p.cantidad}</span>
              </div>
              <div className="h-2.5 rounded-full bg-violet-950/60 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(p.cantidad / maxCant) * 100}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-violet-400 to-fuchsia-500"
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function KPI({
  label,
  value,
  icon,
  small,
}: {
  label: string;
  value: string;
  icon: string;
  small?: boolean;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 12 },
        show: { opacity: 1, y: 0 },
      }}
      className="glass rounded-2xl p-4"
    >
      <div className="text-gold text-xl">{icon}</div>
      <div
        className={`mt-1.5 font-display text-violet-50 ${small ? "text-lg" : "text-2xl"}`}
      >
        {value}
      </div>
      <div className="text-[10px] uppercase tracking-wider text-violet-300/70 mt-0.5">
        {label}
      </div>
    </motion.div>
  );
}

function ServiciosTab({ servicios }: { servicios: Servicio[] }) {
  const [editando, setEditando] = useState<Servicio | null>(null);

  async function save(s: Servicio) {
    const lista = servicios.some((x) => x.id === s.id)
      ? servicios.map((x) => (x.id === s.id ? s : x))
      : [...servicios, s];
    await setServicios(lista);
    setEditando(null);
  }
  async function eliminar(id: string) {
    if (confirm("¿Eliminar esta lectura?")) {
      await setServicios(servicios.filter((s) => s.id !== id));
    }
  }

  return (
    <div>
      <button
        onClick={() =>
          setEditando({
            id: crypto.randomUUID().slice(0, 8),
            nombre: "",
            duracionMin: 30,
            precio: 10000,
            descripcion: "",
          })
        }
        className="w-full mb-4 py-4 rounded-2xl bg-gradient-to-r from-violet-400 to-fuchsia-500 text-white font-medium shadow-lg shadow-violet-500/30 text-base"
      >
        + Nueva lectura
      </button>

      <motion.div
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.04 } } }}
        className="space-y-3"
      >
        {servicios.map((s) => (
          <motion.div
            key={s.id}
            layout
            variants={{
              hidden: { opacity: 0, y: 8 },
              show: { opacity: 1, y: 0 },
            }}
            className="glass rounded-2xl p-5"
          >
            <div className="flex justify-between items-start gap-3">
              <div>
                <h3 className="font-display text-xl text-violet-50">{s.nombre}</h3>
                <p className="text-xs text-violet-300/70 mt-0.5">
                  {s.duracionMin} min
                </p>
              </div>
              <div className="text-gold font-display text-lg">
                {formatPrecio(s.precio)}
              </div>
            </div>
            <p className="mt-2 text-sm text-violet-200/80">{s.descripcion}</p>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => setEditando(s)}
                className="flex-1 rounded-xl glass text-violet-100 px-3 py-2.5 text-sm hover:bg-violet-500/10"
              >
                Editar
              </button>
              <button
                onClick={() => eliminar(s.id)}
                className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-2.5 text-sm text-rose-200 hover:bg-rose-500/20"
              >
                Eliminar
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <AnimatePresence>
        {editando && (
          <ServicioModal
            servicio={editando}
            onClose={() => setEditando(null)}
            onSave={save}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function ServicioModal({
  servicio,
  onSave,
  onClose,
}: {
  servicio: Servicio;
  onSave: (s: Servicio) => Promise<void>;
  onClose: () => void;
}) {
  const [s, setS] = useState(servicio);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    await onSave(s);
    setSaving(false);
  }

  return (
    <Modal
      onClose={onClose}
      title={servicio.nombre ? "Editar lectura" : "Nueva lectura"}
    >
      <div className="space-y-4">
        <input
          value={s.nombre}
          onChange={(e) => setS({ ...s, nombre: e.target.value })}
          placeholder="Nombre"
          className={inputCls}
        />
        <textarea
          value={s.descripcion}
          onChange={(e) => setS({ ...s, descripcion: e.target.value })}
          placeholder="Descripción"
          rows={3}
          className={inputCls + " resize-none"}
        />
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-xs uppercase text-violet-300/80 mb-1 block">
              Duración (min)
            </span>
            <input
              type="number"
              value={s.duracionMin}
              onChange={(e) =>
                setS({ ...s, duracionMin: Number(e.target.value) })
              }
              className={inputCls}
            />
          </label>
          <label className="block">
            <span className="text-xs uppercase text-violet-300/80 mb-1 block">
              Precio
            </span>
            <input
              type="number"
              value={s.precio}
              onChange={(e) => setS({ ...s, precio: Number(e.target.value) })}
              className={inputCls}
            />
          </label>
        </div>
      </div>
      <ModalFooter
        onCancel={onClose}
        onSave={handleSave}
        saveLabel={saving ? "Guardando..." : "Guardar"}
        saving={saving}
      />
    </Modal>
  );
}

function ConfigTab({ config }: { config: Config }) {
  const [c, setC] = useState<Config>(config);
  const [prevConfig, setPrevConfig] = useState(config);
  const [diaBloqueo, setDiaBloqueo] = useState("");
  const [diaSlotBloqueo, setDiaSlotBloqueo] = useState("");
  const [guardado, setGuardado] = useState(false);

  if (config !== prevConfig) {
    setPrevConfig(config);
    setC(config);
  }

  async function save() {
    await setConfig(c);
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2000);
  }

  async function toggleVacaciones() {
    const updated = { ...c, modoVacaciones: !c.modoVacaciones };
    setC(updated);
    await setConfig(updated);
  }

  function toggleDia(d: number) {
    setC((prev) => ({
      ...prev,
      diasLaborables: prev.diasLaborables.includes(d)
        ? prev.diasLaborables.filter((x) => x !== d)
        : [...prev.diasLaborables, d].sort(),
    }));
  }
  function toggleModalidad(m: string) {
    setC((prev) => ({
      ...prev,
      modalidadesBloqueadas: (prev.modalidadesBloqueadas || []).includes(m)
        ? prev.modalidadesBloqueadas.filter((x) => x !== m)
        : [...(prev.modalidadesBloqueadas || []), m],
    }));
  }
  function toggleSlotBloqueo(slot: string) {
    if (!diaSlotBloqueo) return;
    const key = `${diaSlotBloqueo}|${slot}`;
    setC((prev) => ({
      ...prev,
      horasBloqueadas: (prev.horasBloqueadas || []).includes(key)
        ? prev.horasBloqueadas.filter((x) => x !== key)
        : [...(prev.horasBloqueadas || []), key],
    }));
  }

  const todosSlots = useMemo(() => generarTodosSlots(c), [c]);
  const slotsDelDia = useMemo(
    () => (diaSlotBloqueo ? todosSlots : []),
    [diaSlotBloqueo, todosSlots],
  );

  const dias = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const diasDisponibilidadOpciones = [1, 3, 5, 7, 14, 21, 30];

  return (
    <div className="space-y-5">
      <Card>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-xl text-violet-50">
              Modo vacaciones
            </h3>
            <p className="text-sm text-violet-200/70 mt-1">
              Desactiva la reserva de turnos
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={c.modoVacaciones}
            onClick={toggleVacaciones}
            className={`relative inline-flex h-9 w-16 items-center rounded-full transition-colors shrink-0 ${
              c.modoVacaciones
                ? "bg-gradient-to-r from-amber-400 to-amber-600"
                : "bg-violet-950/60 border border-violet-300/20"
            }`}
          >
            <motion.span
              animate={{ x: c.modoVacaciones ? 32 : 4 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className="inline-block h-7 w-7 rounded-full bg-white shadow-md"
            />
          </button>
        </div>
      </Card>

      <Card title="Días de disponibilidad" subtitle="Cuántos días a futuro pueden reservar">
        <div className="flex gap-2.5 flex-wrap">
          {diasDisponibilidadOpciones.map((d) => {
            const active = c.diasDisponibilidad === d;
            return (
              <button
                key={d}
                onClick={() => setC({ ...c, diasDisponibilidad: d })}
                className={`min-w-[48px] px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-gradient-to-r from-violet-400 to-fuchsia-500 text-white shadow-lg shadow-violet-500/30"
                    : "glass text-violet-100 hover:bg-violet-500/10"
                }`}
              >
                {d}
              </button>
            );
          })}
        </div>
      </Card>

      <Card title="Días laborables">
        <div className="flex gap-2.5 flex-wrap">
          {dias.map((d, i) => {
            const active = c.diasLaborables.includes(i);
            return (
              <button
                key={d}
                onClick={() => toggleDia(i)}
                className={`min-w-[52px] px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-gradient-to-r from-violet-400 to-fuchsia-500 text-white shadow-lg shadow-violet-500/30"
                    : "glass text-violet-200 hover:bg-violet-500/10"
                }`}
              >
                {d}
              </button>
            );
          })}
        </div>
      </Card>

      <Card title="Horarios">
        <div className="space-y-4">
          <TimeField
            label="Hora inicio"
            value={c.horaInicio}
            onChange={(v) => setC({ ...c, horaInicio: v })}
          />
          <TimeField
            label="Hora fin"
            value={c.horaFin}
            onChange={(v) => setC({ ...c, horaFin: v })}
          />
          <label className="block">
            <span className="text-xs uppercase text-violet-300/80 mb-1 block">
              Intervalo (minutos)
            </span>
            <input
              type="number"
              min={15}
              step={15}
              value={c.intervaloMin}
              onChange={(e) =>
                setC({ ...c, intervaloMin: Number(e.target.value) })
              }
              className={inputCls}
            />
          </label>
        </div>
      </Card>

      <Card title="Modalidades" subtitle="Desactivá las que no querés ofrecer">
        <div className="space-y-2">
          {[
            { id: "presencial", label: "Presencial" },
            { id: "video", label: "Videollamada" },
            { id: "telefono", label: "Teléfono" },
          ].map((m) => {
            const bloqueada = (c.modalidadesBloqueadas || []).includes(m.id);
            return (
              <button
                key={m.id}
                onClick={() => toggleModalidad(m.id)}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all ${
                  bloqueada
                    ? "glass opacity-50"
                    : "bg-violet-500/15 border border-violet-400/30"
                }`}
              >
                <span className="text-violet-50">{m.label}</span>
                <span
                  className={`inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                    bloqueada
                      ? "bg-violet-950/60 border border-violet-300/20"
                      : "bg-gradient-to-r from-violet-400 to-fuchsia-500"
                  }`}
                >
                  <motion.span
                    animate={{ x: bloqueada ? 4 : 24 }}
                    transition={{ type: "spring", stiffness: 400, damping: 28 }}
                    className="inline-block h-5 w-5 rounded-full bg-white shadow-md"
                  />
                </span>
              </button>
            );
          })}
        </div>
      </Card>

      <Card title="Días bloqueados" subtitle="Bloqueá días específicos">
        <div className="flex gap-2.5">
          <input
            type="date"
            value={diaBloqueo}
            onChange={(e) => setDiaBloqueo(e.target.value)}
            className={inputCls + " flex-1"}
          />
          <button
            onClick={() => {
              if (diaBloqueo && !c.diasBloqueados.includes(diaBloqueo)) {
                setC({
                  ...c,
                  diasBloqueados: [...c.diasBloqueados, diaBloqueo].sort(),
                });
                setDiaBloqueo("");
              }
            }}
            className="px-5 rounded-2xl glass text-violet-100 hover:bg-violet-500/10 shrink-0"
          >
            +
          </button>
        </div>
        {c.diasBloqueados.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {c.diasBloqueados.map((d) => (
              <span
                key={d}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-full glass text-sm text-violet-100"
              >
                {formatFecha(d)}
                <button
                  onClick={() =>
                    setC({
                      ...c,
                      diasBloqueados: c.diasBloqueados.filter((x) => x !== d),
                    })
                  }
                  className="text-rose-300 hover:text-rose-200 text-lg leading-none"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </Card>

      <Card title="Horarios bloqueados" subtitle="Bloqueá horarios específicos de un día">
        <input
          type="date"
          value={diaSlotBloqueo}
          onChange={(e) => setDiaSlotBloqueo(e.target.value)}
          className={inputCls}
        />
        {diaSlotBloqueo && slotsDelDia.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-violet-300/80 mb-2">
              Tocá para bloquear/desbloquear:
            </p>
            <div className="grid grid-cols-4 gap-2.5">
              {slotsDelDia.map((slot) => {
                const key = `${diaSlotBloqueo}|${slot}`;
                const bloqueado = (c.horasBloqueadas || []).includes(key);
                return (
                  <button
                    key={slot}
                    onClick={() => toggleSlotBloqueo(slot)}
                    className={`py-3 rounded-xl text-sm font-medium transition-all ${
                      bloqueado
                        ? "bg-rose-500/20 border border-rose-400/30 text-rose-200 line-through"
                        : "glass text-violet-100 hover:bg-violet-500/10"
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </Card>

      <motion.button
        onClick={save}
        whileTap={{ scale: 0.98 }}
        className={`w-full py-4 rounded-2xl font-medium text-base shadow-lg transition-all ${
          guardado
            ? "bg-emerald-500 text-white shadow-emerald-500/30"
            : "bg-gradient-to-r from-violet-400 to-fuchsia-500 text-white shadow-violet-500/30"
        }`}
      >
        {guardado ? "✓ Guardado" : "Guardar configuración"}
      </motion.button>
    </div>
  );
}

function Card({
  title,
  subtitle,
  children,
}: {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="glass rounded-2xl p-5">
      {title && (
        <h3 className="font-display text-xl text-violet-50 mb-3">{title}</h3>
      )}
      {subtitle && (
        <p className="text-sm text-violet-200/70 -mt-2 mb-3">{subtitle}</p>
      )}
      {children}
    </div>
  );
}

function TimeField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase text-violet-300/80 mb-1 block">
        {label}
      </span>
      <input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputCls}
      />
    </label>
  );
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 32 }}
        className="w-full max-w-lg max-h-[92vh] overflow-y-auto glass rounded-t-3xl sm:rounded-3xl p-6 bg-violet-950/90"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display text-2xl text-violet-50">{title}</h3>
          <button
            onClick={onClose}
            className="h-10 w-10 rounded-full glass flex items-center justify-center text-violet-200 text-xl"
          >
            ×
          </button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}

function ModalFooter({
  onCancel,
  onSave,
  saveLabel,
  saving,
}: {
  onCancel: () => void;
  onSave: () => void;
  saveLabel: string;
  saving?: boolean;
}) {
  return (
    <div className="mt-6 flex gap-3">
      <button
        onClick={onCancel}
        className="flex-1 py-3.5 rounded-full glass text-violet-100 text-base"
      >
        Cancelar
      </button>
      <button
        onClick={onSave}
        disabled={saving}
        className="flex-1 py-3.5 rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-500 text-white font-medium text-base disabled:opacity-50"
      >
        {saveLabel}
      </button>
    </div>
  );
}
