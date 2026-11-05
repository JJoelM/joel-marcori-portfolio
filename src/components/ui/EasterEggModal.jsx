import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

export function EasterEggModal() {
  const { t } = useTranslation();
  const ui_easter = t("ui_easter_egg", { returnObjects: true }) || {};
  const { modalEasterEggAbierto, cerrarModalEasterEgg, setTema } = useTheme();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && modalEasterEggAbierto) {
        cerrarModalEasterEgg();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modalEasterEggAbierto, cerrarModalEasterEgg]);

  if (!modalEasterEggAbierto) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[220] bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 select-none"
        onClick={cerrarModalEasterEgg}
        role="dialog"
        aria-modal="true"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg bg-[#140e0a] border-4 border-[#b45309] text-[#faedd9] font-mono shadow-[0_0_60px_rgba(180,83,9,0.35),8px_8px_0px_#000] p-5 sm:p-7 relative overflow-hidden"
        >
          {/* Persianas y líneas analógicas decorativas */}
          <div
            className="absolute inset-0 pointer-events-none opacity-10 bg-[repeating-linear-gradient(180deg,transparent,transparent_15px,rgba(0,0,0,0.9)_15px,rgba(0,0,0,0.9)_30px)]"
            aria-hidden="true"
          />

          {/* Sello confidencial */}
          <div className="flex items-center justify-between border-b-2 border-[#92400e] pb-3 mb-4">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#f59e0b] bg-[#321c10] px-2 py-0.5 border border-[#b45309]">
              {ui_easter.modal_badge}
            </span>
            <span className="border-2 border-[#dc2626] text-[#dc2626] font-black px-2 py-0.5 text-[10px] tracking-widest transform -rotate-3">
              SECRET // #1947
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-serif font-black uppercase tracking-tight text-[#fef3c7] mb-3 leading-snug">
            {ui_easter.modal_titulo}
          </h2>

          <p className="text-xs sm:text-sm font-sans leading-relaxed text-[#faedd9]/90 mb-3">
            {ui_easter.modal_desc}
          </p>

          <p className="text-xs font-mono text-[#fde68a] bg-[#29170e] p-2.5 border border-[#78350f] mb-6">
            {ui_easter.modal_instruccion}
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                setTema("NOIR");
                cerrarModalEasterEgg();
              }}
              className="flex-1 py-2.5 px-4 bg-[#b45309] hover:bg-[#d97706] text-black font-black text-xs uppercase tracking-wider transition-all border-2 border-black shadow-[3px_3px_0px_#000] active:translate-y-0.5 cursor-pointer text-center"
            >
              {ui_easter.btn_aplicar_noir}
            </button>
            <button
              onClick={() => {
                setTema("CYBER");
                cerrarModalEasterEgg();
              }}
              className="flex-1 py-2.5 px-4 bg-black/80 hover:bg-zinc-900 text-zinc-300 hover:text-white font-bold text-xs uppercase tracking-wider transition-all border border-zinc-700 shadow-[3px_3px_0px_#000] active:translate-y-0.5 cursor-pointer text-center"
            >
              {ui_easter.btn_quedar_cyber}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
