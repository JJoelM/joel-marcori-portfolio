import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

const variantsPágina = {
  enter: (direction) => ({
    x: direction > 0 ? 25 : -25,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.35, ease: "easeOut" },
  },
  exit: (direction) => ({
    x: direction < 0 ? 25 : -25,
    opacity: 0,
    transition: { duration: 0.25, ease: "easeIn" },
  }),
};

export function ExpedienteCV({ isVisible, cerrarModal }) {
  const { t } = useTranslation();
  const cvData = t("cvData", { returnObjects: true }) || { paginas: [] };
  const ui_cv = t("ui_cv", { returnObjects: true }) || {};

  const [[paginaActual, direction], setPaginaActual] = useState([0, 0]);

  const paginate = (newDirection) => {
    const nextIndex = paginaActual + newDirection;
    if (nextIndex >= 0 && nextIndex < (cvData.paginas || []).length) {
      setPaginaActual([nextIndex, newDirection]);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isVisible) {
        cerrarModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isVisible, cerrarModal]);

  if (!isVisible || !cvData.paginas) return null;

  const pagina = cvData.paginas[paginaActual] || {};

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/85 flex justify-center items-center p-2.5 sm:p-4 md:p-6 backdrop-blur-sm pointer-events-auto select-none sm:select-text"
      onClick={cerrarModal}
      role="dialog"
      aria-modal="true"
    >
      {/* CARPETA DE INVESTIGACIÓN (EXPEDIENTE MANILA NOIR) */}
      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 15, scale: 0.98 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="bg-[#f4f1ea] w-full max-w-4xl h-[92vh] sm:h-[86vh] flex flex-col p-3.5 sm:p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative font-serif text-gray-800 rounded-sm overflow-hidden border border-gray-400/60"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CABECERA DE LA CARPETA (RESPONSIVE COMPACTA) */}
        <div className="flex justify-between items-start border-b-2 border-gray-400 pb-2.5 sm:pb-3 mb-3 sm:mb-5 relative z-10 flex-shrink-0 gap-3">
          <div className="min-w-0 flex-1">
            <h2 className="text-base sm:text-2xl font-black tracking-wider text-gray-900 uppercase font-sans truncate">
              {cvData.label}
            </h2>
            {/* Sello Confidencial estilo tinta roja */}
            <div className="inline-block mt-1 sm:mt-1.5 border border-red-700 text-red-700 font-black px-2 py-0.5 transform -rotate-1 opacity-85 font-sans text-[10px] sm:text-xs tracking-widest">
              {cvData.tag}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Botón Descargar CV Oficial */}
            <a
              href="/CV - Marcori, Joel Jesús.pdf"
              target="_blank"
              rel="noreferrer"
              className="bg-gray-900 hover:bg-black text-[#f4f1ea] font-sans font-bold px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs uppercase tracking-wider shadow-sm transition-transform active:translate-y-0.5"
            >
              {ui_cv.adjunto || "PDF CV"}
            </a>

            {/* Botón Cerrar */}
            <button
              onClick={cerrarModal}
              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-zinc-700 hover:text-red-600 hover:bg-red-50 font-bold text-lg sm:text-xl transition-colors bg-white border border-zinc-300 shadow-xs rounded-sm cursor-pointer"
              aria-label="Cerrar Expediente"
            >
              ✕
            </button>
          </div>
        </div>

        {/* CONTENIDO PRINCIPAL ANIMADO */}
        <div className="relative flex-grow overflow-hidden mb-2.5 sm:mb-3">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={paginaActual}
              custom={direction}
              variants={variantsPágina}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 overflow-y-auto pr-1 sm:pr-3 space-y-4 sm:space-y-6 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {/* HOJA 1: INTRODUCCIÓN Y FOTO POLAROID */}
              {pagina.tipo === "INTRO" && (
                <div className="flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-8 pb-4">
                  {/* FOTO POLAROID & FICHA DE CONTACTO */}
                  <div className="w-full md:w-5/12 flex flex-col items-center sm:items-start flex-shrink-0">
                    <div className="bg-white p-2 sm:p-2.5 pb-6 sm:pb-8 shadow-md transform -rotate-1 sm:-rotate-2 border border-gray-300/80 mb-3 sm:mb-4 mx-auto sm:mx-0">
                      <img
                        src={pagina.foto_url}
                        alt="Sujeto Investigado"
                        className="w-32 h-32 sm:w-40 sm:h-40 object-cover contrast-125 border border-gray-200"
                      />
                      <div className="text-center mt-2 font-mono text-[10px] text-gray-500 uppercase tracking-widest">
                        REG // #1947-JM
                      </div>
                    </div>

                    <div className="w-full space-y-1 text-xs font-sans text-gray-800">
                      <p className="font-bold text-gray-900">
                        {ui_cv.id}{" "}
                        <span className="font-normal">{pagina.id}</span>
                      </p>
                      <p className="font-bold text-gray-900">
                        {ui_cv.alias}{" "}
                        <span className="font-normal">{pagina.alias}</span>
                      </p>
                      <div className="pt-1.5">
                        <span className="font-bold text-gray-900 block mb-1">
                          {ui_cv.contacto}
                        </span>
                        <ul className="space-y-1 text-[11px] leading-tight text-gray-700">
                          {(pagina.contacto || []).map((line, i) => (
                            <li key={i} className="flex gap-1.5 break-all">
                              <span className="text-gray-500 font-bold">•</span>
                              <span>{line}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* RESUMEN NARRATIVO */}
                  <div className="w-full md:w-7/12">
                    <h3 className="text-base sm:text-xl font-black mb-2.5 sm:mb-3 border-b border-gray-300 pb-1 uppercase tracking-wider font-sans text-gray-900">
                      {pagina.titulo}
                    </h3>
                    <ul className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm leading-relaxed text-gray-800">
                      {(pagina.historial || []).map((line, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-red-700 font-bold text-sm">►</span>
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* HOJA 2 & 3: EXPERIENCIA / EDUCACIÓN */}
              {(pagina.tipo === "EXPERIENCIA" || pagina.tipo === "EDUCACION") && (
                <div className="pb-4">
                  <h3 className="text-base sm:text-xl font-black mb-3 sm:mb-4 border-b border-gray-300 pb-1 uppercase tracking-wider font-sans text-gray-900">
                    {pagina.titulo}
                  </h3>
                  <div className="space-y-3.5 sm:space-y-5">
                    {(pagina.items || []).map((item, i) => (
                      <div
                        key={i}
                        className="pl-3 sm:pl-4 border-l-2 sm:border-l-4 border-gray-400 bg-white/40 p-2 sm:p-3 rounded-r-xs"
                      >
                        <h4 className="font-bold text-gray-900 text-xs sm:text-base font-sans">
                          {item.title}
                        </h4>
                        <p className="text-gray-700 mt-1 text-xs sm:text-sm leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* HOJA 4: STACK TÉCNICO */}
              {pagina.tipo === "STACK" && (
                <div className="pb-4">
                  <h3 className="text-base sm:text-xl font-black mb-3 sm:mb-4 border-b border-gray-300 pb-1 uppercase tracking-wider font-sans text-gray-900">
                    {pagina.titulo}
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(pagina.stack || []).map((tech) => (
                      <span
                        key={tech}
                        className="bg-white border border-gray-400 text-gray-800 px-2.5 py-1 text-xs font-bold font-sans shadow-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* NAVEGACIÓN INFERIOR DE PÁGINAS (TÁCTIL & ERGONÓMICA) */}
        <div className="border-t-2 border-gray-400 pt-2.5 sm:pt-3 flex justify-between items-center text-xs font-sans font-bold text-gray-700 flex-shrink-0">
          <button
            onClick={() => paginate(-1)}
            disabled={paginaActual === 0}
            className={`px-3 py-1.5 min-h-[34px] border border-gray-400 bg-white shadow-xs rounded-sm transition-all uppercase tracking-wider ${
              paginaActual === 0
                ? "opacity-30 cursor-not-allowed"
                : "hover:bg-gray-100 cursor-pointer active:translate-y-0.5"
            }`}
          >
            {ui_cv.pag_anterior || "◄ Anterior"}
          </button>

          <div className="tracking-widest text-[11px] sm:text-xs font-mono font-bold text-gray-600">
            {ui_cv.hoja} {paginaActual + 1} {ui_cv.de} {cvData.paginas.length}
          </div>

          <button
            onClick={() => paginate(1)}
            disabled={paginaActual === cvData.paginas.length - 1}
            className={`px-3 py-1.5 min-h-[34px] border border-gray-400 bg-white shadow-xs rounded-sm transition-all uppercase tracking-wider ${
              paginaActual === cvData.paginas.length - 1
                ? "opacity-30 cursor-not-allowed"
                : "hover:bg-gray-100 cursor-pointer active:translate-y-0.5"
            }`}
          >
            {ui_cv.pag_siguiente || "Siguiente ►"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
