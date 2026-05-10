export type TurnoEstado = "pendiente" | "confirmado" | "cancelado" | "completado";

export type Modalidad = "presencial" | "video" | "telefono";

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
  modalidad: Modalidad;
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

export const SERVICIOS_DEFAULT: Servicio[] = [
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
    descripcion: "Decisiones laborales, emprendimientos y abundancia económica.",
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

export const CONFIG_DEFAULT: Config = {
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
