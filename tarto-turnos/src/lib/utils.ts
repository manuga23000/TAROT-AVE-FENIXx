import type { Config } from "./types";

function parseMinutes(horaInicio: string, horaFin: string) {
  const [hi, mi] = horaInicio.split(":").map(Number);
  const [hf, mf] = horaFin.split(":").map(Number);
  const start = hi * 60 + mi;
  let end = hf * 60 + mf;
  if (end <= start) end += 24 * 60;
  return { start, end };
}

export function generarSlots(
  fecha: string,
  config: Config,
  ocupados: string[],
): string[] {
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
