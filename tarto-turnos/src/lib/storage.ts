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
  fecha: string;
  hora: string;
  modalidad: "presencial" | "video" | "telefono";
  consulta: string;
  estado: TurnoEstado;
  creadoEn: string;
};

export type Config = {
  diasLaborables: number[];
  horaInicio: string;
  horaFin: string;
  intervaloMin: number;
  diasBloqueados: string[];
  diasDisponibilidad: number;
  modoVacaciones: boolean;
  modalidadesBloqueadas: string[];
  horasBloqueadas: string[];
};

const KEYS = {
  turnos: "marcela.turnos.v1",
  servicios: "marcela.servicios.v1",
  config: "marcela.config.v1",
  auth: "marcela.admin.auth.v1",
};

const SERVICIOS_DEFAULT: Servicio[] = [
  {
    id: "apertura-caminos",
    nombre: "Apertura de caminos",
    duracionMin: 45,
    precio: 15000,
    descripcion:
      "Destrabá lo que está frenando tu energía y abrí espacio a nuevas oportunidades.",
  },
  {
    id: "amor-vinculos",
    nombre: "Amor y vínculos",
    duracionMin: 40,
    precio: 14000,
    descripcion:
      "Claridad sobre parejas, reconciliaciones, vínculos familiares y nuevos encuentros.",
  },
  {
    id: "prosperidad-trabajo",
    nombre: "Prosperidad y trabajo",
    duracionMin: 40,
    precio: 14000,
    descripcion:
      "Decisiones laborales, emprendimientos y abundancia económica.",
  },
  {
    id: "limpieza-energetica",
    nombre: "Limpieza energética",
    duracionMin: 50,
    precio: 16000,
    descripcion:
      "Liberá cargas, energías densas y recuperá tu equilibrio interior.",
  },
  {
    id: "registros-akashicos",
    nombre: "Registros akáshicos",
    duracionMin: 60,
    precio: 20000,
    descripcion:
      "Una lectura profunda de tu alma: propósito, aprendizajes y memoria espiritual.",
  },
  {
    id: "carta-natal",
    nombre: "Carta natal",
    duracionMin: 75,
    precio: 22000,
    descripcion:
      "Mapa astrológico personal: tu esencia, talentos y los ciclos que te marcan.",
  },
];

const CONFIG_DEFAULT: Config = {
  diasLaborables: [1, 2, 3, 4, 5],
  horaInicio: "08:00",
  horaFin: "01:00",
  intervaloMin: 60,
  diasBloqueados: [],
  diasDisponibilidad: 14,
  modoVacaciones: false,
  modalidadesBloqueadas: [],
  horasBloqueadas: [],
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
  getServicios(): Servicio[] {
    return read<Servicio[]>(KEYS.servicios, SERVICIOS_DEFAULT);
  },
  setServicios(servicios: Servicio[]) {
    write(KEYS.servicios, servicios);
  },
  resetServicios() {
    write(KEYS.servicios, SERVICIOS_DEFAULT);
  },

  getConfig(): Config {
    const saved = read<Partial<Config>>(KEYS.config, {});
    return { ...CONFIG_DEFAULT, ...saved };
  },
  setConfig(c: Config) {
    write(KEYS.config, c);
  },

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

function parseMinutes(horaInicio: string, horaFin: string) {
  const [hi, mi] = horaInicio.split(":").map(Number);
  const [hf, mf] = horaFin.split(":").map(Number);
  const start = hi * 60 + mi;
  let end = hf * 60 + mf;
  if (end <= start) end += 24 * 60;
  return { start, end };
}

export function generarSlots(fecha: string, config: Config, ocupados: string[]): string[] {
  const { start, end } = parseMinutes(config.horaInicio, config.horaFin);
  const slots: string[] = [];

  for (let m = start; m + config.intervaloMin <= end + 1; m += config.intervaloMin) {
    const actualMin = m % (24 * 60);
    const hh = String(Math.floor(actualMin / 60)).padStart(2, "0");
    const mm = String(actualMin % 60).padStart(2, "0");
    const slot = `${hh}:${mm}`;
    const slotKey = `${fecha}|${slot}`;
    if (!ocupados.includes(slot) && !(config.horasBloqueadas || []).includes(slotKey)) {
      slots.push(slot);
    }
  }

  const hoy = new Date();
  const hoyStr = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}-${String(hoy.getDate()).padStart(2, "0")}`;
  if (fecha === hoyStr) {
    const minsAhora = hoy.getHours() * 60 + hoy.getMinutes();
    const isOvernight = end > 24 * 60;
    return slots.filter((s) => {
      const [h, mn] = s.split(":").map(Number);
      const slotMins = h * 60 + mn;
      if (isOvernight && slotMins < start) return true;
      return slotMins > minsAhora;
    });
  }
  return slots;
}

export function generarTodosSlots(config: Config): string[] {
  const { start, end } = parseMinutes(config.horaInicio, config.horaFin);
  const slots: string[] = [];

  for (let m = start; m + config.intervaloMin <= end + 1; m += config.intervaloMin) {
    const actualMin = m % (24 * 60);
    const hh = String(Math.floor(actualMin / 60)).padStart(2, "0");
    const mm = String(actualMin % 60).padStart(2, "0");
    slots.push(`${hh}:${mm}`);
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
  return `$${n.toLocaleString("es")}`;
}

export function formatFecha(fecha: string): string {
  const d = new Date(fecha + "T00:00:00");
  return d.toLocaleDateString("es", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}
