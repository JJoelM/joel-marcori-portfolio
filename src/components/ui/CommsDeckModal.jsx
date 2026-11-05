import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

/**
 * CommsDeckModal:
 * Modal flotante universal de contacto rápido accesible en ambos modos (3D y Plano).
 * Diseñado con dualidad armónica Cyber Fósforo y Detective Noir con cortes angulares Persona 5.
 * Facilita el contacto inmediato a reclutadores técnicos, HR managers y clientes.
 * 100% internacionalizado mediante JSON.
 */
export function CommsDeckModal({ isOpen, onClose }) {
  const { t } = useTranslation();
  const ui_contacto = t("ui_contacto", { returnObjects: true }) || {};
  const [copiado, setCopiado] = useState(false);
  const { esNoir } = useTheme();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const email = "joelmarcori1@gmail.com";

  const handleCopiarEmail = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(email);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 select-none"
        onClick={onClose}
        aria-modal="true"
        role="dialog"
      >
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 15 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
          className={`w-full max-w-xl max-h-[90vh] flex flex-col font-mono shadow-[8px_8px_0px_#000000] relative overflow-hidden border-2 transition-colors duration-300 ${
            esNoir
              ? "bg-[#100d0a] border-[#b45309] text-[#faedd9]"
              : "bg-[#090b0e] border-[#22c55e] text-zinc-200"
          }`}
        >
          {/* HEADER WINDOWS XP / TERMINAL */}
          <div
            className={`border-b-2 p-3 sm:px-4 flex items-center justify-between text-xs shrink-0 transition-colors duration-300 ${
              esNoir
                ? "bg-[#29170e] border-[#b45309]/60 text-[#fde68a]"
                : "bg-[#142e1b] border-[#22c55e]/60 text-[#4ade80]"
            }`}
          >
            <div className="flex items-center gap-2 font-bold tracking-wider truncate">
              <span
                className={`w-2.5 h-2.5 inline-block shadow-[1px_1px_0px_#fff] ${
                  esNoir ? "bg-[#d97706]" : "bg-[#22c55e]"
                }`}
              />
              <span className="truncate uppercase">{ui_contacto.titulo}</span>
            </div>
            <button
              onClick={onClose}
              aria-label={ui_contacto.btn_cerrar || "Cerrar ventana de contacto"}
              className={`px-2 py-0.5 bg-black font-bold uppercase transition-colors border cursor-pointer ${
                esNoir
                  ? "hover:bg-[#b45309] text-white hover:text-black border-[#b45309]/60"
                  : "hover:bg-[#22c55e] text-white hover:text-black border-[#22c55e]/60"
              }`}
            >
              {ui_contacto.btn_cerrar || "[ ✕ ]"}
            </button>
          </div>

          {/* CONTENIDO DEL DESPACHO DE CONTACTO */}
          <div className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1">
            {/* BADGE PERSONA 5 DISPONIBILIDAD */}
            <div className="space-y-2">
              <div
                className={`inline-flex items-center gap-2 transform -rotate-1 px-3 py-1 text-xs font-black tracking-widest uppercase shadow-[3px_3px_0px_#fff] text-black ${
                  esNoir ? "bg-[#b45309]" : "bg-[#22c55e]"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-black animate-ping" />
                <span>{ui_contacto.badge_disponibilidad}</span>
              </div>
              <p
                className={`text-xs font-sans leading-relaxed ${
                  esNoir ? "text-[#fef3c7]/80" : "text-zinc-300"
                }`}
              >
                {ui_contacto.subtitulo}
              </p>
              <div
                className={`text-[11px] font-mono border-l-2 pl-3 py-0.5 ${
                  esNoir
                    ? "text-[#fde68a] border-[#b45309]"
                    : "text-zinc-400 border-[#22c55e]"
                }`}
              >
                {ui_contacto.roles_buscados}
              </div>
            </div>

            {/* SECCIÓN EMAIL PRINCIPAL */}
            <div className="p-4 bg-black border-2 border-zinc-800 space-y-3 shadow-[4px_4px_0px_#000]">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className={`font-bold ${esNoir ? "text-[#fde68a]" : "text-[#4ade80]"}`}>
                  CANAL PRINCIPAL // EMAIL:
                </span>
                <span className="text-[10px] text-zinc-500">DIRECT DISPATCH</span>
              </div>

              <div className="text-base sm:text-lg font-black text-white font-mono select-all tracking-wider break-all">
                {email}
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <a
                  href={`mailto:${email}?subject=%5BPropuesta%20B2B%20%2F%20Contacto%5D%20-%20Joel%20Marcori`}
                  className={`flex-1 min-w-[160px] py-2.5 px-3 font-black text-xs uppercase tracking-wider text-center border border-black shadow-[2px_2px_0px_#fff] transition-colors text-black ${
                    esNoir
                      ? "bg-[#b45309] hover:bg-[#d97706]"
                      : "bg-[#22c55e] hover:bg-[#16a34a]"
                  }`}
                >
                  {ui_contacto.btn_enviar_email}
                </a>

                <button
                  onClick={handleCopiarEmail}
                  className="py-2.5 px-3 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider border border-zinc-700 transition-colors cursor-pointer"
                >
                  {copiado ? ui_contacto.email_copiado : ui_contacto.btn_copiar_email}
                </button>
              </div>
            </div>

            {/* ENLACES RÁPIDOS PROFESIONALES */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <a
                href="https://linkedin.com/in/joel-jesus-marcori/"
                target="_blank"
                rel="noreferrer"
                className={`p-3 bg-black border border-zinc-800 transition-colors flex items-center justify-between group ${
                  esNoir
                    ? "hover:bg-[#20140c] hover:border-[#b45309]"
                    : "hover:bg-[#142e1b] hover:border-[#22c55e]"
                }`}
              >
                <div>
                  <span className="text-zinc-400 block text-[10px]">RED PROFESIONAL</span>
                  <span
                    className={`text-white font-bold ${
                      esNoir ? "group-hover:text-[#fde68a]" : "group-hover:text-[#4ade80]"
                    }`}
                  >
                    {ui_contacto.linkedin_label}
                  </span>
                </div>
                <span
                  className={`text-zinc-500 ${
                    esNoir ? "group-hover:text-[#f59e0b]" : "group-hover:text-[#22c55e]"
                  }`}
                >
                  ↗
                </span>
              </a>

              <a
                href="https://github.com/JJoelM"
                target="_blank"
                rel="noreferrer"
                className={`p-3 bg-black border border-zinc-800 transition-colors flex items-center justify-between group ${
                  esNoir
                    ? "hover:bg-[#20140c] hover:border-[#b45309]"
                    : "hover:bg-[#142e1b] hover:border-[#22c55e]"
                }`}
              >
                <div>
                  <span className="text-zinc-400 block text-[10px]">REPOSITORIOS DE CÓDIGO</span>
                  <span
                    className={`text-white font-bold ${
                      esNoir ? "group-hover:text-[#fde68a]" : "group-hover:text-[#4ade80]"
                    }`}
                  >
                    {ui_contacto.github_label}
                  </span>
                </div>
                <span
                  className={`text-zinc-500 ${
                    esNoir ? "group-hover:text-[#f59e0b]" : "group-hover:text-[#22c55e]"
                  }`}
                >
                  ↗
                </span>
              </a>
            </div>

            {/* BOTÓN DESCARGAR CV OFICIAL EN PDF */}
            <a
              href="/CV - Marcori, Joel Jesús.pdf"
              target="_blank"
              rel="noreferrer"
              className="block w-full py-3 px-4 bg-white hover:bg-zinc-200 text-black font-black text-xs uppercase tracking-wider text-center border-2 border-black shadow-[4px_4px_0px_#000] active:translate-y-0.5 transition-all"
            >
              {ui_contacto.btn_descargar_cv}
            </a>

            <p className="text-[10px] text-zinc-500 font-mono text-center">
              {ui_contacto.nota_respuesta}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
