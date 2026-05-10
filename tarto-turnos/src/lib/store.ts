"use client";

import { useSyncExternalStore } from "react";
import {
  type User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import { getFirebaseAuth, getFirebaseDb, isFirebaseConfigured } from "./firebase";
import {
  CONFIG_DEFAULT,
  type Config,
  SERVICIOS_DEFAULT,
  type Servicio,
  type Turno,
} from "./types";

type Snap<T> = { data: T; ready: boolean };

const KEYS = {
  turnos: "marcela.turnos.v1",
  servicios: "marcela.servicios.v1",
  config: "marcela.config.v1",
  authLocal: "marcela.admin.auth.v1",
};

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "";

function loadLocal<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function saveLocal<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("marcela:storage", { detail: { key } }));
}

class Store<T> {
  current: Snap<T>;
  private subs = new Set<() => void>();
  private start: (push: (v: T) => void) => void;
  private started = false;

  constructor(initial: T, start: (push: (v: T) => void) => void) {
    this.current = { data: initial, ready: false };
    this.start = start;
  }

  private ensureStarted() {
    if (this.started || typeof window === "undefined") return;
    this.started = true;
    this.start((v) => this.push(v));
  }

  push(value: T) {
    this.current = { data: value, ready: true };
    this.subs.forEach((cb) => cb());
  }

  subscribe = (cb: () => void) => {
    this.ensureStarted();
    this.subs.add(cb);
    return () => {
      this.subs.delete(cb);
    };
  };

  getSnapshot = () => this.current;
  getServerSnapshot = () => ({ data: this.current.data, ready: false });
}

const turnosStore = new Store<Turno[]>([], (push) => {
  if (isFirebaseConfigured()) {
    const db = getFirebaseDb();
    if (!db) return;
    onSnapshot(collection(db, "turnos"), (snap) => {
      const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Turno[];
      push(arr);
    });
  } else {
    const sync = () => push(loadLocal<Turno[]>(KEYS.turnos, []));
    sync();
    window.addEventListener("marcela:storage", sync);
    window.addEventListener("storage", sync);
  }
});

const serviciosStore = new Store<Servicio[]>(SERVICIOS_DEFAULT, (push) => {
  if (isFirebaseConfigured()) {
    const db = getFirebaseDb();
    if (!db) return;
    const ref = collection(db, "servicios");
    onSnapshot(ref, async (snap) => {
      if (snap.empty) {
        const batch = writeBatch(db);
        SERVICIOS_DEFAULT.forEach((s) => batch.set(doc(ref, s.id), serviceWithoutId(s)));
        await batch.commit();
        return;
      }
      const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Servicio[];
      push(arr);
    });
  } else {
    const sync = () => push(loadLocal<Servicio[]>(KEYS.servicios, SERVICIOS_DEFAULT));
    sync();
    window.addEventListener("marcela:storage", sync);
    window.addEventListener("storage", sync);
  }
});

const configStore = new Store<Config>(CONFIG_DEFAULT, (push) => {
  if (isFirebaseConfigured()) {
    const db = getFirebaseDb();
    if (!db) return;
    const ref = doc(db, "config", "main");
    onSnapshot(ref, async (snap) => {
      if (!snap.exists()) {
        await setDoc(ref, CONFIG_DEFAULT);
        return;
      }
      push({ ...CONFIG_DEFAULT, ...(snap.data() as Partial<Config>) });
    });
  } else {
    const sync = () =>
      push({ ...CONFIG_DEFAULT, ...loadLocal<Partial<Config>>(KEYS.config, {}) });
    sync();
    window.addEventListener("marcela:storage", sync);
    window.addEventListener("storage", sync);
  }
});

const authStore = new Store<User | null>(null, (push) => {
  if (isFirebaseConfigured()) {
    const auth = getFirebaseAuth();
    if (!auth) return;
    onAuthStateChanged(auth, (user) => push(user));
  } else {
    const fakeUser = (): User =>
      ({ email: "local-admin", uid: "local" }) as unknown as User;
    const sync = () =>
      push(loadLocal<boolean>(KEYS.authLocal, false) ? fakeUser() : null);
    sync();
    window.addEventListener("marcela:storage", sync);
    window.addEventListener("storage", sync);
  }
});

function serviceWithoutId(s: Servicio): Omit<Servicio, "id"> {
  const { id: _id, ...rest } = s;
  void _id;
  return rest;
}
function turnoWithoutId(t: Turno): Omit<Turno, "id"> {
  const { id: _id, ...rest } = t;
  void _id;
  return rest;
}

export function useTurnos() {
  return useSyncExternalStore(
    turnosStore.subscribe,
    turnosStore.getSnapshot,
    turnosStore.getServerSnapshot,
  );
}
export function useServicios() {
  return useSyncExternalStore(
    serviciosStore.subscribe,
    serviciosStore.getSnapshot,
    serviciosStore.getServerSnapshot,
  );
}
export function useConfig() {
  return useSyncExternalStore(
    configStore.subscribe,
    configStore.getSnapshot,
    configStore.getServerSnapshot,
  );
}
export function useAuthState(): { user: User | null; ready: boolean } {
  const snap = useSyncExternalStore(
    authStore.subscribe,
    authStore.getSnapshot,
    authStore.getServerSnapshot,
  );
  return { user: snap.data, ready: snap.ready };
}

export async function addTurno(
  t: Omit<Turno, "id" | "creadoEn" | "estado">,
): Promise<Turno> {
  const nuevo: Turno = {
    ...t,
    id: crypto.randomUUID(),
    creadoEn: new Date().toISOString(),
    estado: "pendiente",
  };
  if (isFirebaseConfigured()) {
    const db = getFirebaseDb()!;
    await setDoc(doc(db, "turnos", nuevo.id), turnoWithoutId(nuevo));
  } else {
    const list = [...turnosStore.current.data, nuevo];
    saveLocal(KEYS.turnos, list);
  }
  return nuevo;
}

export async function updateTurno(id: string, patch: Partial<Turno>) {
  if (isFirebaseConfigured()) {
    const db = getFirebaseDb()!;
    await setDoc(doc(db, "turnos", id), patch, { merge: true });
  } else {
    const list = turnosStore.current.data.map((t) =>
      t.id === id ? { ...t, ...patch } : t,
    );
    saveLocal(KEYS.turnos, list);
  }
}

export async function deleteTurno(id: string) {
  if (isFirebaseConfigured()) {
    const db = getFirebaseDb()!;
    await deleteDoc(doc(db, "turnos", id));
  } else {
    const list = turnosStore.current.data.filter((t) => t.id !== id);
    saveLocal(KEYS.turnos, list);
  }
}

export async function setServicios(servicios: Servicio[]) {
  if (isFirebaseConfigured()) {
    const db = getFirebaseDb()!;
    const ref = collection(db, "servicios");
    const existing = await getDocs(ref);
    const newIds = new Set(servicios.map((s) => s.id));
    const batch = writeBatch(db);
    existing.docs.forEach((d) => {
      if (!newIds.has(d.id)) batch.delete(doc(ref, d.id));
    });
    servicios.forEach((s) => batch.set(doc(ref, s.id), serviceWithoutId(s)));
    await batch.commit();
  } else {
    saveLocal(KEYS.servicios, servicios);
  }
}

export async function setConfig(c: Config) {
  if (isFirebaseConfigured()) {
    const db = getFirebaseDb()!;
    await setDoc(doc(db, "config", "main"), c);
  } else {
    saveLocal(KEYS.config, c);
  }
}

export async function loginAdmin(emailOrPwd: string, password?: string): Promise<string | null> {
  if (isFirebaseConfigured()) {
    const auth = getFirebaseAuth()!;
    const email = emailOrPwd;
    if (ADMIN_EMAIL && email !== ADMIN_EMAIL) return "Usuario no autorizado.";
    if (!password) return "Falta la contraseña.";
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return null;
    } catch (e) {
      const code = (e as { code?: string }).code;
      if (code === "auth/invalid-credential" || code === "auth/wrong-password") {
        return "Usuario o contraseña incorrectos.";
      }
      return "No se pudo iniciar sesión.";
    }
  }
  if (emailOrPwd === "marcela30") {
    saveLocal(KEYS.authLocal, true);
    return null;
  }
  return "Contraseña incorrecta.";
}

export async function logoutAdmin() {
  if (isFirebaseConfigured()) {
    const auth = getFirebaseAuth();
    if (auth) await signOut(auth);
  } else {
    saveLocal(KEYS.authLocal, false);
  }
}

export const FIREBASE_MODE: "firebase" | "local" = isFirebaseConfigured()
  ? "firebase"
  : "local";
