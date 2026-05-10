"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState, useSyncExternalStore } from "react";
import { bootAnalytics } from "@/lib/firebase";

const SESSION_KEY = "marcela.splash.shown";

const subscribe = () => () => {};
const clientInitial = () => sessionStorage.getItem(SESSION_KEY) === null;
const serverInitial = () => false;

export function Splash() {
  const initiallyShow = useSyncExternalStore(
    subscribe,
    clientInitial,
    serverInitial,
  );
  const [hide, setHide] = useState(false);

  useEffect(() => {
    bootAnalytics();
    if (!initiallyShow) return;
    const t = window.setTimeout(() => {
      sessionStorage.setItem(SESSION_KEY, "1");
      setHide(true);
    }, 1900);
    return () => window.clearTimeout(t);
  }, [initiallyShow]);

  const visible = initiallyShow && !hide;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.7, ease: "easeInOut" } }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          aria-hidden
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#3a1170_0%,_#15091f_55%,_#0a0414_100%)]" />

          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 40 }, (_, i) => {
              const x = (i * 73) % 100;
              const y = (i * 137) % 100;
              const delay = (i % 9) * 0.12;
              return (
                <motion.span
                  key={i}
                  className="absolute h-1 w-1 rounded-full bg-violet-100"
                  style={{ left: `${x}%`, top: `${y}%` }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0.2] }}
                  transition={{
                    duration: 2,
                    delay,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                />
              );
            })}
          </div>

          <div className="relative flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.6, opacity: 0, rotate: -12 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <motion.div
                className="absolute inset-0 rounded-full bg-violet-500/40 blur-3xl"
                animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 2.4, repeat: Infinity }}
              />

              <motion.div
                className="absolute -inset-6 rounded-full border border-violet-300/30"
                animate={{ rotate: 360 }}
                transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
              >
                <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-gold shadow-[0_0_10px_2px_rgba(243,210,122,0.7)]" />
                <span className="absolute top-1/2 -right-1 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-violet-200/80" />
                <span className="absolute -bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-fuchsia-300/80" />
              </motion.div>

              <motion.div
                className="absolute -inset-12 rounded-full border border-violet-300/15"
                animate={{ rotate: -360 }}
                transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
              />

              <div className="relative h-32 w-32 md:h-40 md:w-40 rounded-full overflow-hidden ring-2 ring-violet-300/40 shadow-[0_0_60px_-10px_rgba(163,91,255,0.8)]">
                <Image
                  src="/logo.png"
                  alt="Tarot Ave Fénix"
                  fill
                  sizes="160px"
                  className="object-cover"
                  priority
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mt-8 text-center"
            >
              <p className="text-[10px] uppercase tracking-[0.4em] text-violet-300/80">
                Tarot · Guía espiritual
              </p>
              <h1 className="mt-2 font-display text-4xl md:text-5xl text-violet-50 tracking-wide">
                Ave <span className="italic text-shimmer">Fénix</span>
              </h1>
            </motion.div>

            <motion.div
              className="mt-8 h-px w-44 bg-gradient-to-r from-transparent via-violet-300/60 to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
            />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="mt-4 text-xs italic text-violet-200/70"
            >
              &ldquo;Lo que buscás también te está buscando&rdquo;
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
