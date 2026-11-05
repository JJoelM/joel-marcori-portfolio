import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ordenarProyectosRecientes } from "../../utils/dateSorting";

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

export function ExpedienteProyectos({ isVisible, cerrarModal }) {
  const { t } = useTranslation();
  const expedientesData = t("expedientesData", { returnObjects: true }) || {};
  const ui_modal = t("ui_modal", { returnObjects: true }) || {};

  const categoriasKeys = Object.keys(expedientesData);
  const [[categoriaIndex, direction], setCategoriaIndex] = useState([0, 0]);

  const categoriaActiva = categoriasKeys[categoriaIndex] || categoriasKeys[0];
  const dataCarpeta = expedientesData[categoriaActiva] || { proyectos: [] };
  const proyectosOrdenados = useMemo(() => {
    return ordenarProyectosRecientes(dataCarpeta.proyectos || []);
  }, [dataCarpeta.proyectos]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isVisible) {
        cerrarModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isVisible, cerrarModal]);

  if (!isVisible || categoriasKeys.length === 0) return null;

  const cambiarCategoria = (nuevoIndex) => {
    if (nuevoIndex === categoriaIndex) return;
    const dir = nuevoIndex > categoriaIndex ? 1 : -1;
    setCategoriaIndex([nuevoIndex, dir]);
  };

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
      <div
        className="w-full max-w-5xl h-[92vh] sm:h-[86vh] relative flex flex-col md:flex-row shadow-[0_20px_50px_rgba(0,0,0,0.6)] rounded-sm overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* PESTAÑAS / MARCAPÁGINAS (RESPONSIVE: STRIP HORIZONTAL EN MÓVIL, COLUMNA EN DESKTOP) */}
        <div className="flex md:flex-col overflow-x-auto md:overflow-y-auto flex-shrink-0 z-10 bg-zinc-950 md:bg-zinc-900 border-b-2 md:border-b-0 md:border-r-2 border-zinc-700 scrollbar-none md:w-48 lg:w-56">
          {categoriasKeys.map((key, index) => {
            const isActive = index === categoriaIndex;
            const nombreArea = expedientesData[key]?.nombre_clasificacion || key;

            return (
              <button
                key={key}
                onClick={() => cambiarCategoria(index)}
                className={`
                  whitespace-nowrap md:whitespace-normal px-3.5 sm:px-4 py-2 sm:py-3.5 text-left font-sans font-bold text-[11px] sm:text-xs uppercase tracking-wider transition-all cursor-pointer flex-shrink-0
                  md:border-l-4 md:my-0.5
                  ${
                    isActive
                      ? "bg-[#f4f1ea] text-gray-900 border-b-2 md:border-b-0 md:border-l-red-700 shadow-xs"
                      : "bg-transparent text-zinc-400 border-b-2 border-transparent md:border-b-0 md:border-l-transparent hover:text-white hover:bg-zinc-800"
                  }
                `}
              >
                {nombreArea}
              </button>
            );
          })}
        </div>

        {/* CARPETA PRINCIPAL DE CASOS (MANILA NOIR) */}
        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 15, scale: 0.98 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="flex-grow bg-[#f4f1ea] p-3.5 sm:p-6 md:p-8 relative font-serif text-gray-800 flex flex-col overflow-hidden"
        >
          {/* CABECERA DE LA CARPETA */}
          <div className="flex justify-between items-start border-b-2 border-gray-400 pb-2.5 sm:pb-3 mb-3 sm:mb-5 flex-shrink-0 relative z-20 gap-3">
            <div className="min-w-0 flex-1">
              <span className="text-[10px] sm:text-xs font-bold tracking-widest text-gray-600 uppercase font-mono block">
                {ui_modal.registros_archivo || "REGISTROS DE ARCHIVO"}
              </span>
              <h3 className="text-base sm:text-xl md:text-2xl font-black text-gray-900 uppercase font-sans truncate">
                {dataCarpeta.etiqueta_expediente}
              </h3>
            </div>

            {/* BOTÓN CERRAR */}
            <button
              onClick={cerrarModal}
              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-zinc-700 hover:text-red-600 hover:bg-red-50 font-bold text-lg sm:text-xl transition-colors bg-white border border-zinc-300 shadow-xs rounded-sm cursor-pointer flex-shrink-0"
              aria-label="Cerrar Expediente"
            >
              ✕
            </button>
          </div>

          {/* LISTA DE PROYECTOS SCROLLEABLE */}
          <div className="relative flex-grow overflow-hidden">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={categoriaActiva}
                custom={direction}
                variants={variantsPágina}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 overflow-y-auto pr-1 sm:pr-3 space-y-6 sm:space-y-8 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent"
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                {proyectosOrdenados.map((proyecto, index) => (
                  <article key={proyecto.id || index} className="relative pb-4">
                    {index > 0 && (
                      <hr className="border-t border-gray-300 border-dashed my-5 sm:my-8" />
                    )}

                    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                      {/* COLUMNA DE LA FOTO POLAROID */}
                      <div className="w-full lg:w-5/12 flex-shrink-0">
                        <div className="bg-white p-2 sm:p-2.5 pb-6 sm:pb-8 shadow-md border border-gray-300/80 max-w-sm mx-auto lg:max-w-none transform sm:rotate-1 hover:rotate-0 transition-transform">
                          <div className="aspect-video relative overflow-hidden bg-gray-200 border border-gray-300">
                            {proyecto.imagen_url ? (
                              <img
                                src={proyecto.imagen_url}
                                alt={proyecto.titulo}
                                className="w-full h-full object-cover contrast-110"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 font-sans text-xs font-bold">
                                {ui_modal.imagen_no_disponible || "[REGISTRO_GRÁFICO]"}
                              </div>
                            )}
                          </div>
                          <div className="text-center mt-2.5 font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                            {ui_modal.ref || "REF:"} {proyecto.id} // {proyecto.fecha ? proyecto.fecha.split(" ").pop() : "ARCHIVED"}
                          </div>
                        </div>
                      </div>

                      {/* COLUMNA DE DATOS TÉCNICOS */}
                      <div className="w-full lg:w-7/12 flex flex-col justify-between">
                        <div>
                          <h4 className="text-sm sm:text-lg font-black font-sans text-gray-900 uppercase leading-snug">
                            {proyecto.titulo}
                          </h4>

                          <p className="text-xs font-bold text-red-700 mb-2 font-mono tracking-wider">
                            {ui_modal.fecha_reporte || "FECHA:"}{" "}
                            <span className="text-gray-600 font-normal">
                              {proyecto.fecha}
                            </span>
                          </p>

                          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-3 sm:mb-4 font-sans">
                            {proyecto.descripcion}
                          </p>

                          {/* STACK TÉCNICO */}
                          <div className="flex flex-wrap gap-1.5 mb-3 sm:mb-4">
                            {(proyecto.stack || []).map((tech) => (
                              <span
                                key={tech}
                                className="bg-white border border-gray-400 text-gray-700 px-2 py-0.5 text-[10px] sm:text-xs font-bold font-sans rounded-xs shadow-2xs"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* ENLACE AL REGISTRO TÉCNICO / REPO */}
                        {proyecto.repo_url && (
                          <div className="pt-1">
                            <a
                              href={proyecto.repo_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-block border-2 border-gray-900 bg-gray-900 hover:bg-black text-[#f4f1ea] font-sans font-bold px-3 sm:px-4 py-1.5 text-xs transition-colors uppercase tracking-wider shadow-sm active:translate-y-0.5"
                            >
                              {ui_modal.acceder_registro || "Acceder al Registro Técnico →"}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
