import type { Servicio, Turno } from "./types";
import { formatFecha, formatPrecio } from "./utils";

const PHONE = process.env.NEXT_PUBLIC_CALLMEBOT_PHONE ?? "";
const APIKEY = process.env.NEXT_PUBLIC_CALLMEBOT_APIKEY ?? "";

function buildMensaje(turno: Turno, servicio?: Servicio): string {
  const lineas = [
    "🔮 *Nuevo turno reservado*",
    "",
    `👤 ${turno.nombre}`,
    `📞 ${turno.telefono}`,
    turno.email ? `✉️ ${turno.email}` : null,
    "",
    `🃏 ${servicio?.nombre ?? "Lectura"}`,
    `🎥 Modalidad: ${turno.modalidad}`,
    `📅 ${formatFecha(turno.fecha)}`,
    `🕐 ${turno.hora} hs`,
    servicio ? `💰 ${formatPrecio(servicio.precio)}` : null,
    turno.consulta ? `\n📝 "${turno.consulta}"` : null,
  ].filter(Boolean);
  return lineas.join("\n");
}

export async function notificarNuevoTurno(turno: Turno, servicio?: Servicio) {
  if (!PHONE || !APIKEY) return;
  const mensaje = buildMensaje(turno, servicio);
  const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(
    PHONE,
  )}&text=${encodeURIComponent(mensaje)}&apikey=${encodeURIComponent(APIKEY)}`;
  try {
    await fetch(url, { method: "GET", mode: "no-cors" });
  } catch (e) {
    console.error("Error notificando turno:", e);
  }
}
