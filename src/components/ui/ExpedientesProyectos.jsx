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

export function ExpedienteProyectos({ isVisible, cerrarModal }) {
  const { t } = useTranslation();
  const expedientesData = t("expedientesData", { returnObjects: true });
  const cvData = t("cvData", { returnObjects: true });
  const ui_modal = t("ui_modal", {returnObjects: true}) ;

  // Manejo de estado interno de categorías
  const categoriasKeys = Object.keys(expedientesData);
  const [[categoriaIndex, direction], setCategoriaIndex] = useState([0, 0]);

  if (!isVisible || categoriasKeys.length === 0) return null;

  const cambiarCategoria = (nuevoIndex) => {
    if (nuevoIndex === categoriaIndex) return;
    const dir = nuevoIndex > categoriaIndex ? 1 : -1;
    setCategoriaIndex([nuevoIndex, dir]);
  };

  const categoriaActiva = categoriasKeys[categoriaIndex];
  const dataCarpeta = expedientesData[categoriaActiva];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 bg-black/60 flex justify-center items-center p-4 backdrop-blur-sm pointer-events-auto"
      onClick={cerrarModal}
    >
      <div
        className="w-full max-w-6xl h-[85vh] relative flex flex-col md:flex-row shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MARCAPÁGINAS / PESTAÑAS */}
        <div className="flex md:flex-col overflow-x-auto md:overflow-visible flex-shrink-0 z-10 bg-gray-900 md:bg-transparent scrollbar-none">
          {categoriasKeys.map((key, index) => {
            const isActive = index === categoriaIndex;
            const nombreArea = expedientesData[key].nombre_clasificacion;

            return (
              <button
                key={key}
                onClick={() => cambiarCategoria(index)}
                className={`
                  whitespace-nowrap md:whitespace-normal px-6 py-4 text-left font-sans font-bold text-sm uppercase tracking-widest transition-all duration-300
                  md:rounded-l-lg md:border-l-8 md:my-1
                  ${
                    isActive
                      ? "bg-[#f4f1ea] text-gray-900 border-b-4 border-b-gray-900 md:border-b-0 md:border-l-gray-900 md:translate-x-1"
                      : "bg-gray-800 text-gray-400 border-b-4 border-b-transparent md:border-b-0 md:border-l-transparent hover:bg-gray-700"
                  }
                `}
              >
                {nombreArea}
              </button>
            );
          })}
        </div>

        {/* CARPETA */}
        <motion.div
          initial={{ opacity: 0, y: 20, rotateX: 10 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="flex-grow bg-[#f4f1ea] p-8 md:p-12 relative font-serif text-gray-800 flex flex-col overflow-hidden md:rounded-r-lg"
        >
          {/* CABECERA FIJA DE LA CARPETA */}
          <div className="flex justify-between items-start border-b-2 border-gray-400 pb-4 mb-8 flex-shrink-0 relative z-20">
            <div>
              <h2 className="text-sm font-bold tracking-widest text-gray-500 uppercase font-sans mb-1">
                {ui_modal.registros_archivo}
              </h2>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 uppercase font-sans">
                {dataCarpeta.etiqueta_expediente}
              </h3>
            </div>
            <button
              onClick={cerrarModal}
              className="text-gray-400 hover:text-red-700 font-bold text-2xl transition-colors bg-white px-2 rounded"
            >
              ✕
            </button>
          </div>

          {/* LISTA DE PROYECTOS */}
          <div className="relative flex-grow overflow-hidden">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={categoriaActiva}
                custom={direction}
                variants={variantsPágina}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 overflow-y-auto pr-4 space-y-12 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent"
              >
                {dataCarpeta.proyectos.map((proyecto, index) => (
                  <article key={proyecto.id} className="relative">
                    {index > 0 && (
                      <hr className="border-t border-gray-300 border-dashed my-10" />
                    )}

                    <div className="flex flex-col xl:flex-row gap-8">
                      {/* COLUMNA DE LA FOTO */}
                      <div className="w-full xl:w-2/5 flex-shrink-0">
                        <div className="bg-white p-3 pb-10 shadow-md transform rotate-1 hover:rotate-0 transition-transform duration-300">
                          <div className="aspect-video relative overflow-hidden bg-gray-200">
                            {proyecto.imagen_url ? (
                              <img
                                src={proyecto.imagen_url}
                                alt={proyecto.titulo}
                                className="w-full h-full object-cover contrast-125 transition-all duration-500"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 font-sans text-sm font-bold">
                                {ui_modal.imagen_no_dispomible}
                              </div>
                            )}
                          </div>
                          <div className="text-center mt-4 font-sans text-xs font-bold text-gray-500 uppercase tracking-widest">
                            {ui_modal.ref} {proyecto.id} //{" "}
                            {proyecto.fecha.split(" ").pop()}
                          </div>
                        </div>
                      </div>

                      {/* COLUMNA DE DATOS */}
                      <div className="w-full xl:w-3/5 flex flex-col justify-center">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-2xl font-bold font-sans text-gray-900 uppercase">
                            {proyecto.titulo}
                          </h4>
                        </div>

                        <p className="text-sm font-bold text-red-700 mb-4 font-sans tracking-wider">
                          {ui_modal.fecha_reporte}:{" "}
                          <span className="text-gray-600">
                            {proyecto.fecha}
                          </span>
                        </p>

                        <p className="text-base text-gray-700 leading-relaxed mb-6">
                          {proyecto.descripcion}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-6">
                          {proyecto.stack.map((tech) => (
                            <span
                              key={tech}
                              className="bg-transparent border border-gray-400 text-gray-600 px-3 py-1 text-xs font-bold font-sans"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>

                        {proyecto.repo_url && (
                          <a
                            href={proyecto.repo_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-block self-start border-2 border-gray-800 text-gray-800 font-sans font-bold px-6 py-2 text-sm hover:bg-gray-800 hover:text-[#f4f1ea] transition-colors uppercase tracking-widest"
                          >
                            {ui_modal.acceder_registro}
                          </a>
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
