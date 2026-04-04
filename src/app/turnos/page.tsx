"use client";

import { useState } from "react";
import Link from "next/link";

/* ─── Data ─── */
const WA = "543364034155";
const waLink = (msg: string) =>
  `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;

const serviceOptions = [
  { id: "tarot", icon: "\u{1F0CF}", name: "Lectura de Tarot", duration: "60 min", price: "$8.000" },
  { id: "armonizacion", icon: "\u2728", name: "Armonizaci\u00F3n Espiritual", duration: "45 min", price: "$7.000" },
  { id: "videncia", icon: "\u{1F52E}", name: "Videncia Natural", duration: "45 min", price: "$7.500" },
  { id: "limpieza", icon: "\u{1F54A}\uFE0F", name: "Limpieza Energ\u00E9tica", duration: "60 min", price: "$9.000" },
];

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  "17:00", "17:30", "18:00",
];

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const DAYS = ["Lu", "Ma", "Mi", "Ju", "Vi", "S\u00E1", "Do"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // Monday = 0
}

/* ─── SVG Icons ─── */
function WaIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function ChevronLeft() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

/* ═══════════════════════════════════════
   TURNOS PAGE
   ═══════════════════════════════════════ */
export default function TurnosPage() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", notes: "" });
  const [submitted, setSubmitted] = useState(false);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDay(null);
    setSelectedTime(null);
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDay(null);
    setSelectedTime(null);
  };

  const isDayDisabled = (day: number) => {
    const d = new Date(currentYear, currentMonth, day);
    if (d < new Date(today.getFullYear(), today.getMonth(), today.getDate())) return true;
    if (d.getDay() === 0) return true; // Sunday disabled
    return false;
  };

  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  const currentStep =
    !selectedService ? 1 :
    !selectedDay ? 2 :
    !selectedTime ? 3 : 4;

  const selectedServiceData = serviceOptions.find((s) => s.id === selectedService);

  const handleSubmit = () => {
    if (!selectedServiceData || !selectedDay || !selectedTime) return;

    const msg = `Hola! Quiero agendar un turno:\n\n` +
      `\u{1F4CB} Servicio: ${selectedServiceData.name}\n` +
      `\u{1F4C5} Fecha: ${selectedDay} de ${MONTHS[currentMonth]} ${currentYear}\n` +
      `\u{1F552} Horario: ${selectedTime}\n` +
      `\u{1F464} Nombre: ${formData.name}\n` +
      `\u{1F4F1} Tel\u00E9fono: ${formData.phone}\n` +
      (formData.email ? `\u{1F4E7} Email: ${formData.email}\n` : "") +
      (formData.notes ? `\u{1F4DD} Notas: ${formData.notes}\n` : "") +
      `\n\u00A1Gracias!`;

    window.open(waLink(msg), "_blank");
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto rounded-full border-2 border-green-wa/50 flex items-center justify-center mb-6 bg-green-wa/10">
            <CheckIcon />
          </div>
          <h1
            className="text-3xl sm:text-5xl text-gold-bright font-light mb-4"
            style={{ fontFamily: "var(--font-title)", letterSpacing: "0.04em" }}
          >
            {"\u00A1"}Turno solicitado!
          </h1>
          <p className="text-cream/40 text-lg max-w-md mx-auto mb-2" style={{ fontFamily: "var(--font-body)" }}>
            Te redirigimos a WhatsApp para confirmar tu turno. Si no se abri{"\u00F3"} autom{"\u00E1"}ticamente, hac{"\u00E9"} click abajo.
          </p>
          <p className="text-cream/25 text-sm mb-8">
            Recibi{"\u00E1"}s la confirmaci{"\u00F3"}n por WhatsApp.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href={waLink("Hola! Quiero confirmar mi turno")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            <WaIcon />
            Abrir WhatsApp
          </a>
          <Link href="/" className="btn-ghost">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="py-8 px-6 border-b border-white/5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="text-gold/60 hover:text-gold transition-colors text-sm tracking-[0.2em]"
            style={{ fontFamily: "var(--font-title)" }}
          >
            {"\u2190"} TAROT AVE F{"\u00C9"}NIX
          </Link>
          <h1
            className="text-lg sm:text-xl text-gold-bright/80 tracking-[0.1em]"
            style={{ fontFamily: "var(--font-title)" }}
          >
            AGENDAR TURNO
          </h1>
        </div>
      </header>

      {/* Steps indicator */}
      <div className="py-8 px-6">
        <div className="max-w-3xl mx-auto flex items-center justify-center gap-3 sm:gap-6">
          {[
            { n: 1, label: "Servicio" },
            { n: 2, label: "Fecha" },
            { n: 3, label: "Horario" },
            { n: 4, label: "Datos" },
          ].map((step, i) => (
            <div key={step.n} className="flex items-center gap-3 sm:gap-6">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm transition-all duration-300 ${
                    currentStep === step.n
                      ? "bg-gold/20 border-2 border-gold text-gold-bright"
                      : currentStep > step.n
                      ? "bg-gold/10 border border-gold/30 text-gold/80"
                      : "border border-white/10 text-cream/20"
                  }`}
                  style={{ fontFamily: "var(--font-title)" }}
                >
                  {currentStep > step.n ? <CheckIcon /> : step.n}
                </div>
                <span className={`text-[10px] tracking-[0.15em] uppercase transition-colors ${
                  currentStep >= step.n ? "text-gold/60" : "text-cream/15"
                }`} style={{ fontFamily: "var(--font-title)" }}>
                  {step.label}
                </span>
              </div>
              {i < 3 && (
                <div className={`w-8 sm:w-16 h-px transition-colors ${
                  currentStep > step.n ? "bg-gold/30" : "bg-white/5"
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-20">

        {/* ── STEP 1: Service ── */}
        <div className={`turno-step mb-6 ${currentStep === 1 ? "active" : ""}`}>
          <h2
            className="text-lg sm:text-xl text-gold-bright/80 mb-6"
            style={{ fontFamily: "var(--font-title)", letterSpacing: "0.06em" }}
          >
            1. Eleg{"\u00ED"} tu servicio
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {serviceOptions.map((s) => (
              <div
                key={s.id}
                className={`service-option ${selectedService === s.id ? "selected" : ""}`}
                onClick={() => setSelectedService(s.id)}
              >
                <span className="text-4xl block mb-3">{s.icon}</span>
                <h3
                  className="text-base text-cream/80 mb-1"
                  style={{ fontFamily: "var(--font-title)", letterSpacing: "0.04em", fontSize: "0.85rem" }}
                >
                  {s.name}
                </h3>
                <p className="text-cream/30 text-sm">{s.duration}</p>
                <p className="text-gold/70 text-lg mt-2 font-medium">{s.price}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── STEP 2: Date ── */}
        <div className={`turno-step mb-6 transition-opacity ${currentStep >= 2 ? "active opacity-100" : "opacity-30 pointer-events-none"}`}>
          <h2
            className="text-lg sm:text-xl text-gold-bright/80 mb-6"
            style={{ fontFamily: "var(--font-title)", letterSpacing: "0.06em" }}
          >
            2. Eleg{"\u00ED"} la fecha
          </h2>

          {/* Calendar */}
          <div className="max-w-md mx-auto">
            {/* Month nav */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={prevMonth}
                className="p-2 rounded-full hover:bg-white/5 text-cream/40 hover:text-cream/80 transition-colors"
              >
                <ChevronLeft />
              </button>
              <h3
                className="text-lg text-cream/70 tracking-[0.1em]"
                style={{ fontFamily: "var(--font-title)" }}
              >
                {MONTHS[currentMonth]} {currentYear}
              </h3>
              <button
                onClick={nextMonth}
                className="p-2 rounded-full hover:bg-white/5 text-cream/40 hover:text-cream/80 transition-colors"
              >
                <ChevronRight />
              </button>
            </div>

            {/* Day headers */}
            <div className="calendar-grid mb-2">
              {DAYS.map((d) => (
                <div
                  key={d}
                  className="text-center text-[10px] tracking-[0.15em] uppercase text-cream/25 py-2"
                  style={{ fontFamily: "var(--font-title)" }}
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Days */}
            <div className="calendar-grid">
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="calendar-day empty" />
              ))}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
                <div
                  key={day}
                  className={`calendar-day ${
                    isDayDisabled(day) ? "disabled" : ""
                  } ${selectedDay === day ? "selected" : ""} ${
                    isToday(day) ? "today" : ""
                  }`}
                  onClick={() => {
                    if (!isDayDisabled(day)) {
                      setSelectedDay(day);
                      setSelectedTime(null);
                    }
                  }}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── STEP 3: Time ── */}
        <div className={`turno-step mb-6 transition-opacity ${currentStep >= 3 ? "active opacity-100" : "opacity-30 pointer-events-none"}`}>
          <h2
            className="text-lg sm:text-xl text-gold-bright/80 mb-6"
            style={{ fontFamily: "var(--font-title)", letterSpacing: "0.06em" }}
          >
            3. Eleg{"\u00ED"} el horario
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 max-w-lg mx-auto">
            {timeSlots.map((t) => (
              <div
                key={t}
                className={`time-slot ${selectedTime === t ? "selected" : ""}`}
                onClick={() => setSelectedTime(t)}
              >
                {t}
              </div>
            ))}
          </div>
        </div>

        {/* ── STEP 4: Contact info ── */}
        <div className={`turno-step transition-opacity ${currentStep >= 4 ? "active opacity-100" : "opacity-30 pointer-events-none"}`}>
          <h2
            className="text-lg sm:text-xl text-gold-bright/80 mb-6"
            style={{ fontFamily: "var(--font-title)", letterSpacing: "0.06em" }}
          >
            4. Tus datos
          </h2>

          {/* Summary */}
          {selectedServiceData && selectedDay && selectedTime && (
            <div className="mb-8 p-5 rounded-2xl bg-gold/5 border border-gold/10 max-w-lg mx-auto">
              <p className="text-[10px] uppercase tracking-[0.2em] text-gold/50 mb-3" style={{ fontFamily: "var(--font-title)" }}>
                Resumen de tu turno
              </p>
              <div className="space-y-1.5 text-cream/50" style={{ fontFamily: "var(--font-body)", fontSize: "1.05rem" }}>
                <p><span className="text-gold/70">{selectedServiceData.icon}</span> {selectedServiceData.name} {"\u2014"} {selectedServiceData.price}</p>
                <p>{"\u{1F4C5}"} {selectedDay} de {MONTHS[currentMonth]} {currentYear}</p>
                <p>{"\u{1F552}"} {selectedTime} hs</p>
              </div>
            </div>
          )}

          <div className="max-w-lg mx-auto space-y-4">
            <div>
              <label className="form-label">Nombre completo *</label>
              <input
                type="text"
                className="form-input"
                placeholder="Tu nombre"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label">Tel{"\u00E9"}fono / WhatsApp *</label>
              <input
                type="tel"
                className="form-input"
                placeholder="+54 ..."
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label">Email (opcional)</label>
              <input
                type="email"
                className="form-input"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label">Notas adicionales (opcional)</label>
              <textarea
                className="form-input"
                placeholder="Algo que quieras que sepa antes de la sesi\u00F3n..."
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-4 items-center justify-center">
              <button
                onClick={handleSubmit}
                disabled={!formData.name || !formData.phone}
                className="btn-primary disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-none w-full sm:w-auto"
              >
                <WaIcon />
                Confirmar por WhatsApp
              </button>
            </div>

            <p className="text-center text-cream/15 text-xs mt-4">
              Al confirmar se abrir{"\u00E1"} WhatsApp con los datos de tu turno.
              <br />La confirmaci{"\u00F3"}n final ser{"\u00E1"} por mensaje directo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
