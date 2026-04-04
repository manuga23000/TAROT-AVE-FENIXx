"use client";

import { useState } from "react";
import Link from "next/link";

/* ─── Mock Data ─── */
const mockTurnos = [
  { id: 1, name: "Mar\u00EDa L\u00F3pez", phone: "+54 336 4112233", service: "Lectura de Tarot", date: "2026-04-07", time: "10:00", status: "confirmed" as const, email: "maria@mail.com" },
  { id: 2, name: "Carolina Ruiz", phone: "+54 341 5223344", service: "Armonizaci\u00F3n Espiritual", date: "2026-04-07", time: "14:30", status: "pending" as const, email: "" },
  { id: 3, name: "Luciana Mart\u00EDnez", phone: "+54 336 6334455", service: "Limpieza Energ\u00E9tica", date: "2026-04-08", time: "11:00", status: "confirmed" as const, email: "luciana@mail.com" },
  { id: 4, name: "Sof\u00EDa Garc\u00EDa", phone: "+54 342 7445566", service: "Videncia Natural", date: "2026-04-08", time: "16:00", status: "pending" as const, email: "" },
  { id: 5, name: "Ana Torres", phone: "+54 336 8556677", service: "Lectura de Tarot", date: "2026-04-09", time: "09:00", status: "confirmed" as const, email: "ana@mail.com" },
  { id: 6, name: "Paula Fern\u00E1ndez", phone: "+54 341 2334455", service: "Armonizaci\u00F3n Espiritual", date: "2026-04-05", time: "15:00", status: "completed" as const, email: "paula@mail.com" },
  { id: 7, name: "Valentina Paz", phone: "+54 336 5667788", service: "Limpieza Energ\u00E9tica", date: "2026-04-04", time: "10:30", status: "completed" as const, email: "" },
  { id: 8, name: "Camila Sosa", phone: "+54 342 9887766", service: "Lectura de Tarot", date: "2026-04-04", time: "17:00", status: "completed" as const, email: "camila@mail.com" },
];

const statusLabels = {
  pending: "Pendiente",
  confirmed: "Confirmado",
  completed: "Completado",
};

const statusBadgeClass = {
  pending: "badge-pending",
  confirmed: "badge-confirmed",
  completed: "badge-completed",
};

type View = "dashboard" | "turnos" | "clientes";

/* ─── Icons ─── */
function DashboardIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  );
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("es-AR", { day: "numeric", month: "short" });
}

/* ═══════════════════════════════════════
   ADMIN PAGE
   ═══════════════════════════════════════ */
export default function AdminPage() {
  const [view, setView] = useState<View>("dashboard");
  const [filter, setFilter] = useState<string>("all");

  const pendingCount = mockTurnos.filter((t) => t.status === "pending").length;
  const confirmedCount = mockTurnos.filter((t) => t.status === "confirmed").length;
  const completedCount = mockTurnos.filter((t) => t.status === "completed").length;
  const totalRevenue = mockTurnos.filter((t) => t.status === "completed").length * 8000;

  const filteredTurnos = filter === "all" ? mockTurnos : mockTurnos.filter((t) => t.status === filter);

  const uniqueClients = Array.from(
    new Map(mockTurnos.map((t) => [t.phone, { name: t.name, phone: t.phone, email: t.email, sessions: mockTurnos.filter((x) => x.phone === t.phone).length, lastService: t.service }])).values()
  );

  return (
    <div className="min-h-screen">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <Link
          href="/"
          className="text-gold/60 hover:text-gold text-xs tracking-[0.2em] transition-colors mb-8 block"
          style={{ fontFamily: "var(--font-title)" }}
        >
          {"\u2190"} TAROT AVE F{"\u00C9"}NIX
        </Link>

        <p
          className="text-[10px] tracking-[0.2em] uppercase text-cream/20 mb-4 px-4"
          style={{ fontFamily: "var(--font-title)" }}
        >
          Panel Admin
        </p>

        <nav className="space-y-1 flex-1">
          <div
            className={`sidebar-link ${view === "dashboard" ? "active" : ""}`}
            onClick={() => setView("dashboard")}
          >
            <DashboardIcon />
            Dashboard
          </div>
          <div
            className={`sidebar-link ${view === "turnos" ? "active" : ""}`}
            onClick={() => setView("turnos")}
          >
            <CalendarIcon />
            Turnos
            {pendingCount > 0 && (
              <span className="ml-auto text-[10px] bg-gold/20 text-gold-bright px-2 py-0.5 rounded-full" style={{ fontFamily: "var(--font-title)" }}>
                {pendingCount}
              </span>
            )}
          </div>
          <div
            className={`sidebar-link ${view === "clientes" ? "active" : ""}`}
            onClick={() => setView("clientes")}
          >
            <UsersIcon />
            Clientes
          </div>
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5">
          <p className="text-cream/15 text-[10px] tracking-wider px-4">
            Sistema de turnos v1.0
            <br />
            Sin funcionalidad backend
          </p>
        </div>
      </aside>

      {/* Main content */}
      <main className="admin-main">
        {/* ── DASHBOARD ── */}
        {view === "dashboard" && (
          <div>
            <div className="mb-8">
              <h1
                className="text-2xl sm:text-3xl text-gold-bright/80 mb-2"
                style={{ fontFamily: "var(--font-title)", letterSpacing: "0.06em" }}
              >
                Dashboard
              </h1>
              <p className="text-cream/30 text-lg" style={{ fontFamily: "var(--font-body)" }}>
                Bienvenida. Ac{"\u00E1"} pod{"\u00E9"}s ver el resumen de tu actividad.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              <div className="admin-stat">
                <p className="text-[10px] uppercase tracking-[0.15em] text-cream/25 mb-2" style={{ fontFamily: "var(--font-title)" }}>
                  Turnos pendientes
                </p>
                <p className="stat-number text-2xl">{pendingCount}</p>
                <p className="text-cream/20 text-sm mt-1">Por confirmar</p>
              </div>
              <div className="admin-stat">
                <p className="text-[10px] uppercase tracking-[0.15em] text-cream/25 mb-2" style={{ fontFamily: "var(--font-title)" }}>
                  Confirmados
                </p>
                <p className="stat-number text-2xl">{confirmedCount}</p>
                <p className="text-cream/20 text-sm mt-1">Pr{"\u00F3"}ximas sesiones</p>
              </div>
              <div className="admin-stat">
                <p className="text-[10px] uppercase tracking-[0.15em] text-cream/25 mb-2" style={{ fontFamily: "var(--font-title)" }}>
                  Completados
                </p>
                <p className="stat-number text-2xl">{completedCount}</p>
                <p className="text-cream/20 text-sm mt-1">Este mes</p>
              </div>
              <div className="admin-stat">
                <p className="text-[10px] uppercase tracking-[0.15em] text-cream/25 mb-2" style={{ fontFamily: "var(--font-title)" }}>
                  Ingresos estimados
                </p>
                <p className="stat-number text-2xl">${totalRevenue.toLocaleString("es-AR")}</p>
                <p className="text-cream/20 text-sm mt-1">Sesiones completadas</p>
              </div>
            </div>

            {/* Recent turnos */}
            <div className="mb-6">
              <h2
                className="text-lg text-gold-bright/60 mb-4"
                style={{ fontFamily: "var(--font-title)", letterSpacing: "0.08em" }}
              >
                PR{"\u00D3"}XIMOS TURNOS
              </h2>
              <div className="rounded-2xl border border-white/5 overflow-hidden bg-white/[0.01]">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Cliente</th>
                      <th>Servicio</th>
                      <th>Fecha</th>
                      <th>Hora</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockTurnos
                      .filter((t) => t.status !== "completed")
                      .sort((a, b) => a.date.localeCompare(b.date))
                      .slice(0, 5)
                      .map((t) => (
                        <tr key={t.id}>
                          <td className="!opacity-90 !text-cream/80">{t.name}</td>
                          <td>{t.service}</td>
                          <td>{formatDate(t.date)}</td>
                          <td>{t.time}</td>
                          <td>
                            <span className={`badge ${statusBadgeClass[t.status]}`}>
                              {statusLabels[t.status]}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick actions */}
            <div>
              <h2
                className="text-lg text-gold-bright/60 mb-4"
                style={{ fontFamily: "var(--font-title)", letterSpacing: "0.08em" }}
              >
                ACCIONES R{"\u00C1"}PIDAS
              </h2>
              <div className="flex flex-wrap gap-3">
                <button
                  className="btn-ghost text-sm py-3 px-6"
                  onClick={() => setView("turnos")}
                >
                  Ver todos los turnos
                </button>
                <button
                  className="btn-ghost text-sm py-3 px-6"
                  onClick={() => setView("clientes")}
                >
                  Ver clientes
                </button>
                <Link href="/turnos" className="btn-ghost text-sm py-3 px-6">
                  Agendar turno manual
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ── TURNOS LIST ── */}
        {view === "turnos" && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
              <div>
                <h1
                  className="text-2xl sm:text-3xl text-gold-bright/80 mb-2"
                  style={{ fontFamily: "var(--font-title)", letterSpacing: "0.06em" }}
                >
                  Turnos
                </h1>
                <p className="text-cream/30 text-lg" style={{ fontFamily: "var(--font-body)" }}>
                  {mockTurnos.length} turnos en total
                </p>
              </div>

              {/* Filters */}
              <div className="flex gap-2">
                {[
                  { key: "all", label: "Todos" },
                  { key: "pending", label: "Pendientes" },
                  { key: "confirmed", label: "Confirmados" },
                  { key: "completed", label: "Completados" },
                ].map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setFilter(f.key)}
                    className={`text-xs px-4 py-2 rounded-full border transition-all ${
                      filter === f.key
                        ? "border-gold/40 bg-gold/10 text-gold-bright"
                        : "border-white/8 text-cream/25 hover:text-cream/50 hover:border-white/15"
                    }`}
                    style={{ fontFamily: "var(--font-title)", letterSpacing: "0.08em" }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/5 overflow-hidden bg-white/[0.01]">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Tel{"\u00E9"}fono</th>
                    <th>Servicio</th>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTurnos
                    .sort((a, b) => a.date.localeCompare(b.date))
                    .map((t) => (
                      <tr key={t.id}>
                        <td className="!opacity-90 !text-cream/80">{t.name}</td>
                        <td>{t.phone}</td>
                        <td>{t.service}</td>
                        <td>{formatDate(t.date)}</td>
                        <td>{t.time}</td>
                        <td>
                          <span className={`badge ${statusBadgeClass[t.status]}`}>
                            {statusLabels[t.status]}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {filteredTurnos.length === 0 && (
              <div className="text-center py-16 text-cream/20">
                <p className="text-lg">No hay turnos con este filtro</p>
              </div>
            )}
          </div>
        )}

        {/* ── CLIENTES ── */}
        {view === "clientes" && (
          <div>
            <div className="mb-8">
              <h1
                className="text-2xl sm:text-3xl text-gold-bright/80 mb-2"
                style={{ fontFamily: "var(--font-title)", letterSpacing: "0.06em" }}
              >
                Clientes
              </h1>
              <p className="text-cream/30 text-lg" style={{ fontFamily: "var(--font-body)" }}>
                {uniqueClients.length} clientes registrados
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {uniqueClients.map((c) => (
                <div key={c.phone} className="admin-stat">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-cream/80 text-lg" style={{ fontFamily: "var(--font-body)" }}>
                        {c.name}
                      </p>
                      <p className="text-cream/25 text-sm">{c.phone}</p>
                    </div>
                    <span className="text-[10px] px-3 py-1 rounded-full bg-gold/8 text-gold/60 border border-gold/10" style={{ fontFamily: "var(--font-title)", letterSpacing: "0.1em" }}>
                      {c.sessions} {c.sessions === 1 ? "sesi\u00F3n" : "sesiones"}
                    </span>
                  </div>
                  {c.email && (
                    <p className="text-cream/20 text-sm mb-2">{c.email}</p>
                  )}
                  <p className="text-cream/30 text-sm">
                    {"\u00DA"}ltimo: {c.lastService}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
