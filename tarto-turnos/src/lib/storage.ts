"use client";

export type TurnoEstado = "pendiente" | "confirmado" | "cancelado" | "completado";

export type Servicio = {
  id: string;
  nombre: string;
  duracionMin: number;
  precio: number;
  descripcion: string;
};

export type Turno = {
  id: string;
  nombre: string;
  telefono: string;
  email: string;
  servicioId: string;
  fecha: string; // YYYY-MM-DD
  hora: string; // HH:mm
  modalidad: "presencial" | "video" | "telefono";
  consulta: string;
  estado: TurnoEstado;
  creadoEn: string; // ISO
};

export type Config = {
  diasLaborables: number[]; // 0=domingo .. 6=sabado
  horaInicio: string; // HH:mm
  horaFin: string; // HH:mm
  intervaloMin: number;
  diasBloqueados: string[]; // YYYY-MM-DD
};

const KEYS = {
  turnos: "marcela.turnos.v1",
  servicios: "marcela.servicios.v1",
  config: "marcela.config.v1",
  auth: "marcela.admin.auth.v1",
};

const SERVICIOS_DEFAULT: Servicio[] = [
  {
    id: "lectura-general",
    nombre: "Lectura general",
    duracionMin: 45,
    precio: 15000,
    descripcion: "Una mirada amplia sobre el momento que estás atravesando: amor, trabajo, salud y familia.",
  },
  {
    id: "lectura-amor",
    nombre: "Tarot del amor",
    duracionMin: 40,
    precio: 14000,
    descripcion: "Respuestas sobre vínculos, parejas, reconciliaciones y nuevas relaciones.",
  },
  {
    id: "lectura-trabajo",
    nombre: "Trabajo y dinero",
    duracionMin: 40,
    precio: 14000,
    descripcion: "Decisiones laborales, emprendimientos y prosperidad económica.",
  },
  {
    id: "consulta-express",
    nombre: "Consulta express",
    duracionMin: 20,
    precio: 8000,
    descripcion: "Una pregunta puntual con respuesta clara y directa.",
  },
];

const CONFIG_DEFAULT: Config = {
  diasLaborables: [1, 2, 3, 4, 5, 6],
  horaInicio: "10:00",
  horaFin: "20:00",
  intervaloMin: 60,
  diasBloqueados: [],
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("marcela:storage", { detail: { key } }));
}

export const storage = {
  // Servicios
  getServicios(): Servicio[] {
    return read<Servicio[]>(KEYS.servicios, SERVICIOS_DEFAULT);
  },
  setServicios(servicios: Servicio[]) {
    write(KEYS.servicios, servicios);
  },
  resetServicios() {
    write(KEYS.servicios, SERVICIOS_DEFAULT);
  },

  // Config
  getConfig(): Config {
    return read<Config>(KEYS.config, CONFIG_DEFAULT);
  },
  setConfig(c: Config) {
    write(KEYS.config, c);
  },

  // Turnos
  getTurnos(): Turno[] {
    return read<Turno[]>(KEYS.turnos, []);
  },
  addTurno(t: Omit<Turno, "id" | "creadoEn" | "estado">): Turno {
    const turnos = storage.getTurnos();
    const nuevo: Turno = {
      ...t,
      id: crypto.randomUUID(),
      creadoEn: new Date().toISOString(),
      estado: "pendiente",
    };
    write(KEYS.turnos, [...turnos, nuevo]);
    return nuevo;
  },
  updateTurno(id: string, patch: Partial<Turno>) {
    const turnos = storage.getTurnos().map((t) => (t.id === id ? { ...t, ...patch } : t));
    write(KEYS.turnos, turnos);
  },
  deleteTurno(id: string) {
    write(
      KEYS.turnos,
      storage.getTurnos().filter((t) => t.id !== id),
    );
  },
  clearTurnos() {
    write(KEYS.turnos, []);
  },

  // Auth (local password — solo para uso local)
  isAuthed(): boolean {
    return read<boolean>(KEYS.auth, false);
  },
  login(password: string): boolean {
    if (password === "marcela30") {
      write(KEYS.auth, true);
      return true;
    }
    return false;
  },
  logout() {
    write(KEYS.auth, false);
  },
};

export function generarSlots(fecha: string, config: Config, ocupados: string[]): string[] {
  const [hi, mi] = config.horaInicio.split(":").map(Number);
  const [hf, mf] = config.horaFin.split(":").map(Number);
  const start = hi * 60 + mi;
  const end = hf * 60 + mf;
  const slots: string[] = [];
  for (let m = start; m + config.intervaloMin <= end + 1; m += config.intervaloMin) {
    const hh = String(Math.floor(m / 60)).padStart(2, "0");
    const mm = String(m % 60).padStart(2, "0");
    const slot = `${hh}:${mm}`;
    if (!ocupados.includes(slot)) slots.push(slot);
  }
  // Si la fecha es hoy, ocultar los pasados
  const hoy = new Date();
  const yyyy = hoy.getFullYear();
  const mmHoy = String(hoy.getMonth() + 1).padStart(2, "0");
  const ddHoy = String(hoy.getDate()).padStart(2, "0");
  const hoyStr = `${yyyy}-${mmHoy}-${ddHoy}`;
  if (fecha === hoyStr) {
    const minsAhora = hoy.getHours() * 60 + hoy.getMinutes();
    return slots.filter((s) => {
      const [h, m] = s.split(":").map(Number);
      return h * 60 + m > minsAhora;
    });
  }
  return slots;
}

export function fechaEsValida(fecha: string, config: Config): boolean {
  const d = new Date(fecha + "T00:00:00");
  if (Number.isNaN(d.getTime())) return false;
  if (config.diasBloqueados.includes(fecha)) return false;
  return config.diasLaborables.includes(d.getDay());
}

export function formatPrecio(n: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatFecha(fecha: string): string {
  const d = new Date(fecha + "T00:00:00");
  return d.toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
