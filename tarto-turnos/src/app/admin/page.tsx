"use client";

import { useEffect, useMemo, useState } from "react";
import {
  storage,
  formatFecha,
  formatPrecio,
  type Turno,
  type Servicio,
  type Config,
  type TurnoEstado,
} from "@/lib/storage";

type Tab = "turnos" | "servicios" | "config" | "stats";

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
            Panel de Marcela
          </h1>
          <p className="mt-2 text-center text-sm text-violet-200/70">
            Ingresá tu contraseña local
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
              className="w-full rounded-2xl bg-violet-950/60 border border-violet-300/20 px-4 py-3 text-violet-50 placeholder:text-violet-300/40 focus:outline-none focus:border-violet-300"
              placeholder="••••••••"
            />
            {pwdError && (
              <p className="text-rose-300 text-sm bg-rose-500/10 border border-rose-400/30 rounded-xl p-2.5">
                {pwdError}
              </p>
            )}
            <button
              type="submit"
              className="w-full px-6 py-3 rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-500 text-white font-medium shadow-lg shadow-violet-500/30"
            >
              Entrar
            </button>
            <p className="text-[11px] text-center text-violet-300/50 mt-2">
              Pista local: <code>marcela30</code>
            </p>
          </form>
        </div>
      </div>
    );
  }

  return <AdminPanel onLogout={() => { storage.logout(); setAuthed(false); setPwd(""); }} />;
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
    <div className="px-5 py-8 md:py-12">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-violet-300/80">
              Panel
            </p>
            <h1 className="font-display text-3xl md:text-4xl text-violet-50">
              Bienvenida, Marcela
            </h1>
          </div>
          <button
            onClick={onLogout}
            className="px-4 py-2 text-sm rounded-full glass text-violet-100 hover:bg-violet-500/10"
          >
            Salir
          </button>
        </header>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto -mx-5 px-5 pb-2">
          {(
            [
              ["turnos", "Turnos"],
              ["stats", "Resumen"],
              ["servicios", "Lecturas"],
              ["config", "Configuración"],
            ] as const
          ).map(([id, label]) => {
            const active = tab === id;
            return (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`shrink-0 px-5 py-2.5 rounded-full text-sm transition-all ${
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

        <div className="mt-6">
          {tab === "turnos" && <TurnosTab turnos={turnos} servicios={servicios} onChange={refresh} />}
          {tab === "stats" && <StatsTab turnos={turnos} servicios={servicios} />}
          {tab === "servicios" && <ServiciosTab servicios={servicios} onChange={refresh} />}
          {tab === "config" && <ConfigTab config={config} onChange={refresh} />}
        </div>
      </div>
    </div>
  );
}

/* ---------- TURNOS ---------- */

function TurnosTab({
  turnos,
  servicios,
  onChange,
}: {
  turnos: Turno[];
  servicios: Servicio[];
  onChange: () => void;
}) {
  const [filtro, setFiltro] = useState<TurnoEstado | "todos">("todos");
  const [busqueda, setBusqueda] = useState("");

  const lista = useMemo(() => {
    return [...turnos]
      .sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora))
      .filter((t) => filtro === "todos" || t.estado === filtro)
      .filter((t) =>
        busqueda
          ? (t.nombre + t.telefono + t.email).toLowerCase().includes(busqueda.toLowerCase())
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
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre, teléfono o email..."
          className="flex-1 rounded-2xl bg-violet-950/60 border border-violet-300/20 px-4 py-3 text-violet-50 placeholder:text-violet-300/40 focus:outline-none focus:border-violet-300"
        />
        <select
          value={filtro}
          onChange={(e) => setFiltro(e.target.value as TurnoEstado | "todos")}
          className="rounded-2xl bg-violet-950/60 border border-violet-300/20 px-4 py-3 text-violet-50"
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
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-display text-xl text-violet-50">{t.nombre}</h3>
                      <EstadoBadge estado={t.estado} />
                    </div>
                    <p className="text-sm text-violet-200/80 mt-1">
                      {servicio?.nombre || "Lectura"} · {t.modalidad}
                    </p>
                    <p className="text-sm text-violet-200/70 mt-1">
                      📅 {formatFecha(t.fecha)} — <strong className="text-violet-100">{t.hora} hs</strong>
                    </p>
                    <p className="text-sm text-violet-200/70 mt-1">
                      ✆ {t.telefono} {t.email && <span className="text-violet-300/60"> · {t.email}</span>}
                    </p>
                    {t.consulta && (
                      <p className="mt-2 text-sm italic text-violet-200/70 bg-violet-900/30 rounded-xl p-3">
                        “{t.consulta}”
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap sm:flex-col gap-2 sm:w-44">
                    <select
                      value={t.estado}
                      onChange={(e) => cambiarEstado(t.id, e.target.value as TurnoEstado)}
                      className="flex-1 sm:flex-none rounded-xl bg-violet-950/60 border border-violet-300/20 px-3 py-2 text-sm text-violet-50"
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="confirmado">Confirmado</option>
                      <option value="completado">Completado</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                    <button
                      onClick={() => eliminar(t.id)}
                      className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200 hover:bg-rose-500/20"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
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
    <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${styles[estado]}`}>
      {estado}
    </span>
  );
}

/* ---------- STATS ---------- */

function StatsTab({ turnos, servicios }: { turnos: Turno[]; servicios: Servicio[] }) {
  const total = turnos.length;
  const pendientes = turnos.filter((t) => t.estado === "pendiente").length;
  const confirmados = turnos.filter((t) => t.estado === "confirmado").length;
  const completados = turnos.filter((t) => t.estado === "completado").length;

  const ingresoEstimado = turnos
    .filter((t) => t.estado === "completado" || t.estado === "confirmado")
    .reduce((acc, t) => acc + (servicios.find((s) => s.id === t.servicioId)?.precio || 0), 0);

  const proximos = [...turnos]
    .filter((t) => t.estado !== "cancelado")
    .filter((t) => new Date(t.fecha + "T" + t.hora) >= new Date())
    .sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora))
    .slice(0, 5);

  // Distribución por servicio
  const porServicio = servicios.map((s) => ({
    nombre: s.nombre,
    cantidad: turnos.filter((t) => t.servicioId === s.id).length,
  }));
  const maxCant = Math.max(1, ...porServicio.map((p) => p.cantidad));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <KPI label="Total de turnos" value={total.toString()} icon="✦" />
        <KPI label="Pendientes" value={pendientes.toString()} icon="◷" />
        <KPI label="Confirmados" value={confirmados.toString()} icon="✓" />
        <KPI label="Ingresos estimados" value={formatPrecio(ingresoEstimado)} icon="✺" small />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="glass rounded-3xl p-6">
          <h3 className="font-display text-xl text-violet-50 mb-4">Próximos turnos</h3>
          {proximos.length === 0 ? (
            <p className="text-violet-200/70 text-sm">No hay próximos turnos.</p>
          ) : (
            <ul className="space-y-2.5">
              {proximos.map((t) => (
                <li key={t.id} className="flex justify-between items-center text-sm bg-violet-900/30 rounded-xl px-4 py-3">
                  <div>
                    <div className="text-violet-50 font-medium">{t.nombre}</div>
                    <div className="text-violet-300/70 text-xs">{formatFecha(t.fecha)}</div>
                  </div>
                  <div className="text-gold font-display text-lg">{t.hora}</div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="glass rounded-3xl p-6">
          <h3 className="font-display text-xl text-violet-50 mb-4">Lecturas más pedidas</h3>
          <ul className="space-y-3">
            {porServicio.map((p) => (
              <li key={p.nombre}>
                <div className="flex justify-between text-sm text-violet-100 mb-1">
                  <span>{p.nombre}</span>
                  <span className="text-violet-300/70">{p.cantidad}</span>
                </div>
                <div className="h-2 rounded-full bg-violet-950/60 overflow-hidden">
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
    </div>
  );
}

function KPI({ label, value, icon, small }: { label: string; value: string; icon: string; small?: boolean }) {
  return (
    <div className="glass rounded-3xl p-5">
      <div className="text-gold text-2xl">{icon}</div>
      <div className={`mt-2 font-display text-violet-50 ${small ? "text-xl" : "text-3xl"}`}>{value}</div>
      <div className="text-[11px] uppercase tracking-wider text-violet-300/70 mt-1">{label}</div>
    </div>
  );
}

/* ---------- SERVICIOS ---------- */

function ServiciosTab({ servicios, onChange }: { servicios: Servicio[]; onChange: () => void }) {
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
      <div className="flex justify-end mb-4">
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
          className="px-5 py-2.5 rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-500 text-white font-medium shadow-lg shadow-violet-500/30 text-sm"
        >
          + Nueva lectura
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {servicios.map((s) => (
          <div key={s.id} className="glass rounded-2xl p-5">
            <div className="flex justify-between items-start gap-3">
              <div>
                <h3 className="font-display text-xl text-violet-50">{s.nombre}</h3>
                <p className="text-xs text-violet-300/70 mt-0.5">{s.duracionMin} min</p>
              </div>
              <div className="text-gold font-display text-lg">{formatPrecio(s.precio)}</div>
            </div>
            <p className="mt-2 text-sm text-violet-200/80">{s.descripcion}</p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setEditando(s)}
                className="flex-1 rounded-xl glass text-violet-100 px-3 py-2 text-sm hover:bg-violet-500/10"
              >
                Editar
              </button>
              <button
                onClick={() => eliminar(s.id)}
                className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200 hover:bg-rose-500/20"
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md glass rounded-3xl p-6 bg-violet-950/80">
        <h3 className="font-display text-2xl text-violet-50 mb-4">Editar lectura</h3>
        <div className="space-y-3">
          <input
            value={s.nombre}
            onChange={(e) => setS({ ...s, nombre: e.target.value })}
            placeholder="Nombre"
            className="w-full rounded-2xl bg-violet-950/60 border border-violet-300/20 px-4 py-3 text-violet-50"
          />
          <textarea
            value={s.descripcion}
            onChange={(e) => setS({ ...s, descripcion: e.target.value })}
            placeholder="Descripción"
            rows={3}
            className="w-full rounded-2xl bg-violet-950/60 border border-violet-300/20 px-4 py-3 text-violet-50 resize-none"
          />
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs uppercase text-violet-300/80">Duración (min)</span>
              <input
                type="number"
                value={s.duracionMin}
                onChange={(e) => setS({ ...s, duracionMin: Number(e.target.value) })}
                className="mt-1 w-full rounded-2xl bg-violet-950/60 border border-violet-300/20 px-4 py-2.5 text-violet-50"
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase text-violet-300/80">Precio</span>
              <input
                type="number"
                value={s.precio}
                onChange={(e) => setS({ ...s, precio: Number(e.target.value) })}
                className="mt-1 w-full rounded-2xl bg-violet-950/60 border border-violet-300/20 px-4 py-2.5 text-violet-50"
              />
            </label>
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <button onClick={onClose} className="flex-1 px-5 py-2.5 rounded-full glass text-violet-100">
            Cancelar
          </button>
          <button
            onClick={() => onSave(s)}
            className="flex-1 px-5 py-2.5 rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-500 text-white font-medium"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- CONFIG ---------- */

function ConfigTab({ config, onChange }: { config: Config; onChange: () => void }) {
  const [c, setC] = useState<Config>(config);
  const [diaBloqueo, setDiaBloqueo] = useState("");

  useEffect(() => setC(config), [config]);

  function save() {
    storage.setConfig(c);
    onChange();
    alert("Configuración guardada");
  }

  function toggleDia(d: number) {
    setC((prev) => ({
      ...prev,
      diasLaborables: prev.diasLaborables.includes(d)
        ? prev.diasLaborables.filter((x) => x !== d)
        : [...prev.diasLaborables, d].sort(),
    }));
  }

  const dias = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  return (
    <div className="glass rounded-3xl p-6 md:p-8 space-y-6">
      <div>
        <h3 className="font-display text-xl text-violet-50 mb-3">Días laborables</h3>
        <div className="flex gap-2 flex-wrap">
          {dias.map((d, i) => {
            const active = c.diasLaborables.includes(i);
            return (
              <button
                key={d}
                onClick={() => toggleDia(i)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
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

      <div className="grid sm:grid-cols-3 gap-4">
        <label className="block">
          <span className="text-xs uppercase text-violet-300/80">Hora inicio</span>
          <input
            type="time"
            value={c.horaInicio}
            onChange={(e) => setC({ ...c, horaInicio: e.target.value })}
            className="mt-1 w-full rounded-2xl bg-violet-950/60 border border-violet-300/20 px-4 py-2.5 text-violet-50"
          />
        </label>
        <label className="block">
          <span className="text-xs uppercase text-violet-300/80">Hora fin</span>
          <input
            type="time"
            value={c.horaFin}
            onChange={(e) => setC({ ...c, horaFin: e.target.value })}
            className="mt-1 w-full rounded-2xl bg-violet-950/60 border border-violet-300/20 px-4 py-2.5 text-violet-50"
          />
        </label>
        <label className="block">
          <span className="text-xs uppercase text-violet-300/80">Intervalo (min)</span>
          <input
            type="number"
            min={15}
            step={15}
            value={c.intervaloMin}
            onChange={(e) => setC({ ...c, intervaloMin: Number(e.target.value) })}
            className="mt-1 w-full rounded-2xl bg-violet-950/60 border border-violet-300/20 px-4 py-2.5 text-violet-50"
          />
        </label>
      </div>

      <div>
        <h3 className="font-display text-xl text-violet-50 mb-3">Días bloqueados</h3>
        <div className="flex gap-2">
          <input
            type="date"
            value={diaBloqueo}
            onChange={(e) => setDiaBloqueo(e.target.value)}
            className="rounded-2xl bg-violet-950/60 border border-violet-300/20 px-4 py-2.5 text-violet-50"
          />
          <button
            onClick={() => {
              if (diaBloqueo && !c.diasBloqueados.includes(diaBloqueo)) {
                setC({ ...c, diasBloqueados: [...c.diasBloqueados, diaBloqueo].sort() });
                setDiaBloqueo("");
              }
            }}
            className="px-5 rounded-2xl glass text-violet-100 hover:bg-violet-500/10"
          >
            + Agregar
          </button>
        </div>
        {c.diasBloqueados.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {c.diasBloqueados.map((d) => (
              <span
                key={d}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-sm text-violet-100"
              >
                {d}
                <button
                  onClick={() => setC({ ...c, diasBloqueados: c.diasBloqueados.filter((x) => x !== d) })}
                  className="text-rose-300 hover:text-rose-200"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="pt-2 flex justify-end">
        <button
          onClick={save}
          className="px-7 py-3 rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-500 text-white font-medium shadow-lg shadow-violet-500/30"
        >
          Guardar configuración
        </button>
      </div>
    </div>
  );
}
