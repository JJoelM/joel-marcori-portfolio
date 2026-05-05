import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

const variantsPágina = {
  enter: (direction) => ({
    x: direction > 0 ? 30 : -30,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  exit: (direction) => ({
    x: direction < 0 ? 30 : -30,
    opacity: 0,
    transition: { duration: 0.3, ease: "easeIn" },
  }),
};

export function ExpedienteCV({ isVisible, cerrarModal }) {
  const { t } = useTranslation();
  const expedientesData = t("expedientesData", { returnObjects: true });
  const cvData = t("cvData", { returnObjects: true });
  const ui_cv = t("ui_cv", { returnObjects: true });

  const [[paginaActual, direction], setPaginaActual] = useState([0, 0]);

  const paginate = (newDirection) => {
    const nextIndex = paginaActual + newDirection;
    if (nextIndex >= 0 && nextIndex < cvData.paginas.length) {
      setPaginaActual([nextIndex, newDirection]);
    }
  };

  if (!isVisible) return null;

  const pagina = cvData.paginas[paginaActual];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 bg-black/60 flex justify-center items-center p-4 backdrop-blur-sm pointer-events-auto"
      onClick={cerrarModal}
    >
      {/* CARPETA */}
      <motion.div
        initial={{ opacity: 0, y: 20, rotateX: 10 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="bg-[#f4f1ea] w-full max-w-4xl h-[85vh] flex flex-col p-6 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative font-serif text-gray-800 rounded-sm"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CABECERA FIJA DE LA CARPETA */}
        <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-gray-400 pb-4 mb-6 relative z-10 flex-shrink-0 gap-4">
          {" "}
          <div>
            <h2 className="text-3xl font-bold tracking-widest text-gray-900 uppercase font-sans">
              {cvData.label}
            </h2>
            {/* Sello de Confidencial */}
            <div className="inline-block mt-3 border-2 border-red-700 text-red-700 font-bold px-3 py-0.5 transform -rotate-2 opacity-80 font-sans text-sm tracking-widest">
              {cvData.tag}
            </div>
          </div>
          <div className="flex flex-col items-end gap-3">
            <button
              onClick={cerrarModal}
              className="text-gray-400 hover:text-red-700 font-bold text-2xl transition-colors bg-white px-2 rounded"
            >
              ✕
            </button>
            {/* Pestaña simulada para descargar */}
            <a
              href="/documents/Joel_Marcori_CV_EN.pdf"
              download
              className="bg-gray-800 text-[#f4f1ea] font-sans font-bold px-4 py-2 text-xs hover:bg-gray-700 uppercase tracking-wider shadow-md transition-transform hover:-translate-y-0.5"
            >
              {ui_cv.adjunto}
            </a>
          </div>
        </div>

        {/* CONTENIDO ANIMADO (Las hojas pasando) */}
        <div className="relative flex-grow overflow-hidden mb-4">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={paginaActual}
              custom={direction}
              variants={variantsPágina}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 overflow-y-auto pr-4 space-y-6 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent"
            >
              {/* VISTA 1: INTRO Y FOTO */}
              {pagina.tipo === "INTRO" && (
                <div className="flex flex-col md:flex-row gap-8 md:gap-10">
                  <div className="w-full md:w-1/3 flex flex-col items-center flex-shrink-0">
                    {/* Efecto foto pegada al papel */}
                    <div className="bg-white p-3 pb-8 shadow-md transform -rotate-3 mb-4">
                      <img
                        src={pagina.foto_url}
                        alt="Sujeto"
                        className="w-48 h-48 object-cover contrast-125"
                      />
                    </div>
                    <p className="text-sm font-bold font-sans text-gray-900">
                      {ui_cv.id}{" "}
                      <span className="font-normal">{pagina.id}</span>
                    </p>
                    <p className="text-sm font-bold font-sans text-gray-900">
                      {ui_cv.alias}{" "}
                      <span className="font-normal">{pagina.alias}</span>
                    </p>
                    <p className="text-sm font-bold font-sans text-gray-900">
                      {ui_cv.contacto}{" "}
                    </p>
                    <span className="font-normal">
                      <ul className="space-y-4 text-sm leading-relaxed">
                        {pagina.contacto.map((line, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-gray-500 font-bold">-</span>
                            <span>{line}</span>
                          </li>
                        ))}
                      </ul>
                    </span>
                  </div>

                  <div className="w-full md:w-2/3">
                    <h3 className="text-xl font-bold mb-4 border-b border-gray-300 pb-1 uppercase tracking-widest font-sans text-gray-900">
                      {pagina.titulo}
                    </h3>
                    <ul className="space-y-4 text-base leading-relaxed">
                      {pagina.historial.map((line, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-gray-500 font-bold">-</span>
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* VISTA 2 y 3: EXPERIENCIA / EDUCACIÓN */}
              {(pagina.tipo === "EXPERIENCIA" ||
                pagina.tipo === "EDUCACION") && (
                <div>
                  <h3 className="text-2xl font-bold mb-6 border-b border-gray-300 pb-2 uppercase tracking-widest font-sans text-gray-900">
                    {pagina.titulo}
                  </h3>
                  <div className="space-y-7">
                    {pagina.items.map((item, i) => (
                      <div key={i} className="pl-4 border-l-4 border-gray-400">
                        <h4 className="font-bold text-gray-900 text-lg font-sans">
                          {item.title}
                        </h4>
                        <p className="text-gray-700 mt-1 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* VISTA 4: STACK TÉCNICO */}
              {pagina.tipo === "STACK" && (
                <div>
                  <h3 className="text-2xl font-bold mb-6 border-b border-gray-300 pb-2 uppercase tracking-widest font-sans text-gray-900">
                    {pagina.titulo}
                  </h3>
                  <div className="flex flex-wrap gap-3 mt-4">
                    {pagina.stack.map((tech) => (
                      <span
                        key={tech}
                        className="bg-gray-200 border border-gray-400 text-gray-800 px-4 py-1 text-sm font-bold font-sans shadow-sm"
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

        {/* NAVEGACIÓN INFERIOR */}
        <div className="border-t-2 border-gray-400 pt-4 flex justify-between items-center text-sm font-sans font-bold text-gray-500 flex-shrink-0">
          <button
            onClick={() => paginate(-1)}
            disabled={paginaActual === 0}
            className={`transition-colors ${paginaActual === 0 ? "opacity-30" : "hover:text-gray-900"}`}
          >
            {ui_cv.pag_anterior}
          </button>
          <div className="tracking-widest text-center">
            {ui_cv.hoja} {paginaActual + 1} {ui_cv.de} {cvData.paginas.length}
          </div>
          <button
            onClick={() => paginate(1)}
            disabled={paginaActual === cvData.paginas.length - 1}
            className={`transition-colors ${paginaActual === cvData.paginas.length - 1 ? "opacity-30" : "hover:text-gray-900"}`}
          >
            {ui_cv.pag_siguiente}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
