"use client";

import { useEffect, useMemo, useState } from "react";
import {
  storage,
  generarSlots,
  generarTodosSlots,
  fechaEsValida,
  formatFecha,
  formatPrecio,
  type Turno,
  type Servicio,
  type Config,
  type TurnoEstado,
} from "@/lib/storage";

type Tab = "turnos" | "servicios" | "config" | "stats";

const inputCls =
  "w-full rounded-2xl bg-violet-950/60 border border-violet-300/20 px-4 py-3 text-violet-50 placeholder:text-violet-300/40 focus:outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-500/30 transition text-base";

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pwd, setPwd] = useState("");
  const [pwdError, setPwdError] = useState("");

  useEffect(() => {
    setAuthed(storage.isAuthed());
  }, []);

  if (!authed) {
    return (
      <div className="px-5 py-20">
        <div className="mx-auto max-w-sm glass rounded-3xl p-8">
          <h1 className="font-display text-3xl text-violet-50 text-center">
            Panel Ave Fénix
          </h1>
          <p className="mt-2 text-center text-sm text-violet-200/70">
            Ingresá tu contraseña
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (storage.login(pwd)) {
                setAuthed(true);
                setPwdError("");
              } else {
                setPwdError("Contraseña incorrecta");
              }
            }}
            className="mt-6 space-y-3"
          >
            <input
              type="password"
              autoFocus
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              className={inputCls}
              placeholder="••••••••"
            />
            {pwdError && (
              <p className="text-rose-300 text-sm bg-rose-500/10 border border-rose-400/30 rounded-xl p-2.5">
                {pwdError}
              </p>
            )}
            <button
              type="submit"
              className="w-full px-6 py-3.5 rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-500 text-white font-medium shadow-lg shadow-violet-500/30 text-base"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <AdminPanel
      onLogout={() => {
        storage.logout();
        setAuthed(false);
        setPwd("");
      }}
    />
  );
}

function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>("turnos");
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [config, setConfig] = useState<Config>(storage.getConfig());

  function refresh() {
    setTurnos(storage.getTurnos());
    setServicios(storage.getServicios());
    setConfig(storage.getConfig());
  }

  useEffect(() => {
    refresh();
    const onChange = () => refresh();
    window.addEventListener("marcela:storage", onChange);
    return () => window.removeEventListener("marcela:storage", onChange);
  }, []);

  return (
    <div className="px-4 py-6 md:py-10">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between gap-4 mb-5">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-violet-300/80">
              Panel
            </p>
            <h1 className="font-display text-2xl md:text-4xl text-violet-50">
              Hola, Marce
            </h1>
          </div>
          <button
            onClick={onLogout}
            className="px-4 py-2.5 text-sm rounded-full glass text-violet-100 hover:bg-violet-500/10"
          >
            Salir
          </button>
        </header>

        {config.modoVacaciones && (
          <div className="mb-4 rounded-2xl bg-amber-500/15 border border-amber-400/30 p-4 flex items-center gap-3">
            <span className="text-2xl">✦</span>
            <div>
              <p className="text-amber-200 font-medium text-sm">
                Modo vacaciones activado
              </p>
              <p className="text-amber-200/70 text-xs">
                Los clientes no pueden reservar turnos
              </p>
            </div>
          </div>
        )}

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
                className={`shrink-0 px-5 py-3 rounded-full text-sm font-medium transition-all ${
                  active
                    ? "bg-gradient-to-r from-violet-400 to-fuchsia-500 text-white shadow-lg shadow-violet-500/30"
                    : "glass text-violet-100 hover:bg-violet-500/10"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="mt-5">
          {tab === "turnos" && (
            <TurnosTab
              turnos={turnos}
              servicios={servicios}
              config={config}
              onChange={refresh}
            />
          )}
          {tab === "stats" && (
            <StatsTab turnos={turnos} servicios={servicios} />
          )}
          {tab === "servicios" && (
            <ServiciosTab servicios={servicios} onChange={refresh} />
          )}
          {tab === "config" && (
            <ConfigTab config={config} onChange={refresh} />
          )}
        </div>
      </div>
    </div>
  );
}

/* ========== TURNOS ========== */

function TurnosTab({
  turnos,
  servicios,
  config,
  onChange,
}: {
  turnos: Turno[];
  servicios: Servicio[];
  config: Config;
  onChange: () => void;
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

  function cambiarEstado(id: string, estado: TurnoEstado) {
    storage.updateTurno(id, { estado });
    onChange();
  }
  function eliminar(id: string) {
    if (confirm("¿Eliminar este turno?")) {
      storage.deleteTurno(id);
      onChange();
    }
  }

  return (
    <div>
      <button
        onClick={() => setShowAgregar(true)}
        className="w-full mb-4 py-4 rounded-2xl bg-gradient-to-r from-violet-400 to-fuchsia-500 text-white font-medium shadow-lg shadow-violet-500/30 text-base"
      >
        + Agregar turno
      </button>

      <div className="flex flex-col gap-3 mb-4">
        <input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre o teléfono..."
          className={inputCls}
        />
        <select
          value={filtro}
          onChange={(e) =>
            setFiltro(e.target.value as TurnoEstado | "todos")
          }
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
        <div className="space-y-3">
          {lista.map((t) => {
            const servicio = servicios.find((s) => s.id === t.servicioId);
            return (
              <article key={t.id} className="glass rounded-2xl p-5">
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
                      cambiarEstado(t.id, e.target.value as TurnoEstado)
                    }
                    className="flex-1 rounded-xl bg-violet-950/60 border border-violet-300/20 px-3 py-2.5 text-sm text-violet-50"
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="confirmado">Confirmado</option>
                    <option value="completado">Completado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                  <button
                    onClick={() => eliminar(t.id)}
                    className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-2.5 text-sm text-rose-200 hover:bg-rose-500/20"
                  >
                    Eliminar
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {showAgregar && (
        <AgregarTurnoModal
          servicios={servicios}
          config={config}
          turnos={turnos}
          onSave={onChange}
          onClose={() => setShowAgregar(false)}
        />
      )}
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

/* ========== AGREGAR TURNO MODAL ========== */

function AgregarTurnoModal({
  servicios,
  config,
  turnos,
  onSave,
  onClose,
}: {
  servicios: Servicio[];
  config: Config;
  turnos: Turno[];
  onSave: () => void;
  onClose: () => void;
}) {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [servicioId, setServicioId] = useState(servicios[0]?.id || "");
  const [modalidad, setModalidad] = useState<
    "presencial" | "video" | "telefono"
  >("video");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [consulta, setConsulta] = useState("");
  const [error, setError] = useState("");

  const slotsDisponibles = useMemo(() => {
    if (!fecha) return [];
    if (!fechaEsValida(fecha, config)) return [];
    const ocupados = turnos
      .filter((t) => t.fecha === fecha && t.estado !== "cancelado")
      .map((t) => t.hora);
    return generarSlots(fecha, config, ocupados);
  }, [fecha, config, turnos]);

  function handleSave() {
    if (!nombre.trim() || !telefono.trim() || !servicioId || !fecha || !hora) {
      setError("Completá nombre, teléfono, fecha y hora.");
      return;
    }
    storage.addTurno({
      nombre: nombre.trim(),
      telefono: telefono.trim(),
      email: "",
      servicioId,
      fecha,
      hora,
      modalidad,
      consulta: consulta.trim(),
    });
    onSave();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg max-h-[92vh] overflow-y-auto glass rounded-t-3xl sm:rounded-3xl p-6 bg-violet-950/90">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display text-2xl text-violet-50">
            Agregar turno
          </h3>
          <button
            onClick={onClose}
            className="h-10 w-10 rounded-full glass flex items-center justify-center text-violet-200 text-xl"
          >
            ×
          </button>
        </div>
        <div className="space-y-4">
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

          <div className="grid grid-cols-3 gap-2">
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
                {m === "video"
                  ? "Video"
                  : m === "telefono"
                    ? "Teléfono"
                    : "Presencial"}
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
            <div className="grid grid-cols-4 gap-2">
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
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 rounded-full glass text-violet-100 text-base"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3.5 rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-500 text-white font-medium text-base"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

/* ========== STATS ========== */

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
      <div className="grid gap-3 grid-cols-2">
        <KPI label="Total" value={total.toString()} icon="✦" />
        <KPI label="Pendientes" value={pendientes.toString()} icon="◷" />
        <KPI label="Confirmados" value={confirmados.toString()} icon="✓" />
        <KPI
          label="Ingresos est."
          value={formatPrecio(ingresoEstimado)}
          icon="✺"
          small
        />
      </div>

      <div className="glass rounded-3xl p-5">
        <h3 className="font-display text-xl text-violet-50 mb-4">
          Próximos turnos
        </h3>
        {proximos.length === 0 ? (
          <p className="text-violet-200/70 text-sm">
            No hay próximos turnos.
          </p>
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
                <div
                  className="h-full bg-gradient-to-r from-violet-400 to-fuchsia-500"
                  style={{ width: `${(p.cantidad / maxCant) * 100}%` }}
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
    <div className="glass rounded-2xl p-4">
      <div className="text-gold text-xl">{icon}</div>
      <div
        className={`mt-1.5 font-display text-violet-50 ${small ? "text-lg" : "text-2xl"}`}
      >
        {value}
      </div>
      <div className="text-[10px] uppercase tracking-wider text-violet-300/70 mt-0.5">
        {label}
      </div>
    </div>
  );
}

/* ========== SERVICIOS ========== */

function ServiciosTab({
  servicios,
  onChange,
}: {
  servicios: Servicio[];
  onChange: () => void;
}) {
  const [editando, setEditando] = useState<Servicio | null>(null);

  function save(s: Servicio) {
    const lista = servicios.some((x) => x.id === s.id)
      ? servicios.map((x) => (x.id === s.id ? s : x))
      : [...servicios, s];
    storage.setServicios(lista);
    setEditando(null);
    onChange();
  }
  function eliminar(id: string) {
    if (confirm("¿Eliminar esta lectura?")) {
      storage.setServicios(servicios.filter((s) => s.id !== id));
      onChange();
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

      <div className="space-y-3">
        {servicios.map((s) => (
          <div key={s.id} className="glass rounded-2xl p-5">
            <div className="flex justify-between items-start gap-3">
              <div>
                <h3 className="font-display text-xl text-violet-50">
                  {s.nombre}
                </h3>
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
          </div>
        ))}
      </div>

      {editando && (
        <ServicioModal
          servicio={editando}
          onClose={() => setEditando(null)}
          onSave={save}
        />
      )}
    </div>
  );
}

function ServicioModal({
  servicio,
  onSave,
  onClose,
}: {
  servicio: Servicio;
  onSave: (s: Servicio) => void;
  onClose: () => void;
}) {
  const [s, setS] = useState(servicio);
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md glass rounded-t-3xl sm:rounded-3xl p-6 bg-violet-950/90">
        <h3 className="font-display text-2xl text-violet-50 mb-4">
          {servicio.nombre ? "Editar lectura" : "Nueva lectura"}
        </h3>
        <div className="space-y-3">
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
          <div className="grid grid-cols-2 gap-3">
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
                onChange={(e) =>
                  setS({ ...s, precio: Number(e.target.value) })
                }
                className={inputCls}
              />
            </label>
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 rounded-full glass text-violet-100 text-base"
          >
            Cancelar
          </button>
          <button
            onClick={() => onSave(s)}
            className="flex-1 py-3.5 rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-500 text-white font-medium text-base"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

/* ========== CONFIG ========== */

function ConfigTab({
  config,
  onChange,
}: {
  config: Config;
  onChange: () => void;
}) {
  const [c, setC] = useState<Config>(config);
  const [diaBloqueo, setDiaBloqueo] = useState("");
  const [diaSlotBloqueo, setDiaSlotBloqueo] = useState("");
  const [guardado, setGuardado] = useState(false);

  useEffect(() => setC(config), [config]);

  function save() {
    storage.setConfig(c);
    onChange();
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2000);
  }

  function toggleVacaciones() {
    const updated = { ...c, modoVacaciones: !c.modoVacaciones };
    setC(updated);
    storage.setConfig(updated);
    onChange();
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

  const slotsDelDia = useMemo(() => {
    if (!diaSlotBloqueo) return [];
    return todosSlots;
  }, [diaSlotBloqueo, todosSlots]);

  const dias = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const diasDisponibilidadOpciones = [1, 3, 5, 7, 14, 21, 30];

  return (
    <div className="space-y-5">
      {/* MODO VACACIONES */}
      <div className="glass rounded-2xl p-5">
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
            <span
              className={`inline-block h-7 w-7 rounded-full bg-white shadow-md transition-transform ${
                c.modoVacaciones ? "translate-x-8" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      {/* DÍAS DE DISPONIBILIDAD */}
      <div className="glass rounded-2xl p-5">
        <h3 className="font-display text-xl text-violet-50 mb-3">
          Días de disponibilidad
        </h3>
        <p className="text-sm text-violet-200/70 mb-3">
          Cuántos días a futuro pueden reservar
        </p>
        <div className="flex gap-2 flex-wrap">
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
      </div>

      {/* DÍAS LABORABLES */}
      <div className="glass rounded-2xl p-5">
        <h3 className="font-display text-xl text-violet-50 mb-3">
          Días laborables
        </h3>
        <div className="flex gap-2 flex-wrap">
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
      </div>

      {/* HORARIOS */}
      <div className="glass rounded-2xl p-5">
        <h3 className="font-display text-xl text-violet-50 mb-3">Horarios</h3>
        <div className="space-y-3">
          <label className="block">
            <span className="text-xs uppercase text-violet-300/80 mb-1 block">
              Hora inicio
            </span>
            <input
              type="time"
              value={c.horaInicio}
              onChange={(e) => setC({ ...c, horaInicio: e.target.value })}
              className={inputCls}
            />
          </label>
          <label className="block">
            <span className="text-xs uppercase text-violet-300/80 mb-1 block">
              Hora fin
            </span>
            <input
              type="time"
              value={c.horaFin}
              onChange={(e) => setC({ ...c, horaFin: e.target.value })}
              className={inputCls}
            />
          </label>
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
      </div>

      {/* MODALIDADES */}
      <div className="glass rounded-2xl p-5">
        <h3 className="font-display text-xl text-violet-50 mb-3">
          Modalidades
        </h3>
        <p className="text-sm text-violet-200/70 mb-3">
          Desactivá las que no querés ofrecer
        </p>
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
                  <span
                    className={`inline-block h-5 w-5 rounded-full bg-white shadow-md transition-transform ${
                      bloqueada ? "translate-x-1" : "translate-x-6"
                    }`}
                  />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* DÍAS BLOQUEADOS */}
      <div className="glass rounded-2xl p-5">
        <h3 className="font-display text-xl text-violet-50 mb-3">
          Días bloqueados
        </h3>
        <p className="text-sm text-violet-200/70 mb-3">
          Bloqueá días específicos
        </p>
        <div className="flex gap-2">
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
      </div>

      {/* HORARIOS BLOQUEADOS */}
      <div className="glass rounded-2xl p-5">
        <h3 className="font-display text-xl text-violet-50 mb-3">
          Horarios bloqueados
        </h3>
        <p className="text-sm text-violet-200/70 mb-3">
          Bloqueá horarios específicos de un día
        </p>
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
            <div className="grid grid-cols-4 gap-2">
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
      </div>

      {/* GUARDAR */}
      <button
        onClick={save}
        className={`w-full py-4 rounded-2xl font-medium text-base shadow-lg transition-all ${
          guardado
            ? "bg-emerald-500 text-white shadow-emerald-500/30"
            : "bg-gradient-to-r from-violet-400 to-fuchsia-500 text-white shadow-violet-500/30"
        }`}
      >
        {guardado ? "✓ Guardado" : "Guardar configuración"}
      </button>
    </div>
  );
}
