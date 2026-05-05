import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export function VistaPlana() {
  const { t } = useTranslation();
  const expedientesData = t("expedientesData", { returnObjects: true });
  const cvData = t("cvData", { returnObjects: true });
  const ui_cv = t("ui_cv", { returnObjects: true });
  const ui_modal = t("ui_modal", { returnObjects: true });

  const categorias = Object.entries(expedientesData);
  // Estado para controlar si el menú está abierto o cerrado.
  // Por defecto abierto en PC y cerrado en celulares
  const [menuAbierto, setMenuAbierto] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setMenuAbierto(false);
      } else {
        setMenuAbierto(true);
      }
    };

    // Configuración inicial
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12 py-12 pb-24 flex flex-col lg:flex-row gap-12 items-start relative">
      {/* =========================================
          COLUMNA IZQUIERDA: CONTENIDO PRINCIPAL
          ========================================= */}
      <main className="flex-1 w-full flex flex-col gap-16">
        {/* CABECERA */}
        <header className="border-b-4 border-green-800 pb-6">
          <h1 className="text-4xl font-bold tracking-widest text-green-500 uppercase">
            {ui_cv.mensaje_bd}
          </h1>
          <p className="text-green-700 mt-2 font-bold">{ui_cv.mensaje_nivel}</p>
        </header>

        {/* SECCIÓN: CURRÍCULUM VITAE */}
        <section
          id="seccion-cv"
          className="scroll-mt-24 lg:scroll-mt-8 border border-green-900 bg-gray-950/50 p-6 md:p-8"
        >
          <div className="bg-green-900 text-white inline-block px-4 py-1 font-bold mb-8 uppercase tracking-widest">
            {cvData.label} // {cvData.tag}
          </div>

          {/* CABECERA CON ETIQUETA Y FOTO */}
          <div className="flex flex-col md:flex-row gap-8 mb-10 items-start">
            <div className="w-50 flex-shrink-0 flex flex-col font-mono">
              <div className="border border-green-700 p-1 bg-black relative overflow-hidden group">
                {/* Efecto visual: Línea de escaneo sutil */}
                <div className="absolute inset-0 bg-green-500/10 pointer-events-none z-10"></div>

                <img
                  src={cvData.paginas[0].foto_url}
                  alt="[IMG_DATA]"
                  className="w-full aspect-square object-cover contrast-125 opacity-70 group-hover:opacity-100 transition-opacity duration-200"
                />
                <p className="text-green-600 mr-2">
                  {">"} {ui_cv.contacto}
                </p>
                {cvData.paginas[0].contacto.map((item, i) => (
                  <li key={i} className="space-y-2 text-gray-300">
                    <span className="text-green-600 mr-2">{">"}</span>
                    {item}
                  </li>
                ))}
              </div>
            </div>

            {/* DATOS DE TEXTO DEL CV */}
            <div className="flex-1 w-full">
              {cvData.paginas
                .filter((pagina, index) => index === 0)
                .map((pagina, index) => (
                  <div key={index} className="border-l-2 border-green-800 pl-6">
                    <div className="text-white inline-block px-4 py-1 font-bold mb-8 uppercase tracking-widest">
                      {pagina.tipo === "INTRO" && (
                        <div>
                          <h3 className="text-2xl font-bold text-green-400 mb-4 uppercase">
                            {pagina.titulo}
                          </h3>
                          <ul className="space-y-2 text-gray-300">
                            <li>
                              <span className="text-green-600 mr-2">
                                {ui_cv.id}
                              </span>
                              {pagina.id}
                            </li>
                            <li>
                              <span className="text-green-600 mr-2">
                                {ui_cv.alias}
                              </span>
                              {pagina.alias}
                            </li>
                            {pagina.historial.map((item, i) => (
                              <li key={i}>
                                <span className="text-green-600 mr-2">
                                  {">"}
                                </span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="space-y-12">
            {cvData.paginas.map((pagina, index) => (
              <div
                key={`cv-pag-${index}`}
                className="border-l-2 border-green-800 pl-6"
              >
                {(pagina.tipo === "EXPERIENCIA" ||
                  pagina.tipo === "EDUCACION") && (
                  <div>
                    <h3 className="text-2xl font-bold text-green-400 mb-6 uppercase">
                      {pagina.titulo}
                    </h3>
                    <div className="space-y-6">
                      {pagina.items.map((item, i) => (
                        <article key={i}>
                          <h4 className="text-lg font-bold text-white">
                            {item.title}
                          </h4>
                          <p className="text-gray-400 mt-1">{item.desc}</p>
                        </article>
                      ))}
                    </div>
                  </div>
                )}

                {pagina.tipo === "STACK" && (
                  <div>
                    <h3 className="text-2xl font-bold text-green-400 mb-4 uppercase">
                      {pagina.titulo}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {pagina.stack.map((tech) => (
                        <span
                          key={tech}
                          className="border border-green-700 text-green-500 px-3 py-1 text-sm bg-green-950/30 font-bold"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* SECCIONES: PROYECTOS */}
        {categorias.map(([key, categoria]) => (
          <section
            id={`seccion-${key}`}
            key={key}
            className="scroll-mt-24 lg:scroll-mt-8 border border-green-900 bg-gray-950/50 p-6 md:p-8"
          >
            <div className="bg-green-900 text-white inline-block px-4 py-1 font-bold mb-8 uppercase tracking-widest">
              {categoria.etiqueta_expediente}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {categoria.proyectos.map((proyecto) => (
                <article
                  key={proyecto.id}
                  className="flex flex-col group h-full"
                >
                  <div className="relative overflow-hidden border border-green-800 mb-4 aspect-video bg-gray-900 flex-shrink-0">
                    {proyecto.imagen_url ? (
                      <img
                        src={proyecto.imagen_url}
                        alt={proyecto.titulo}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-green-900 font-bold text-sm">
                        {ui_modal.imagen_no_disponible}
                      </div>
                    )}
                  </div>

                  <h3 className="text-xl text-white font-bold mb-1 uppercase">
                    {proyecto.titulo}
                  </h3>
                  <span className="text-xs text-green-600 mb-3 block font-bold">
                    {proyecto.stack.join(" // ")}
                  </span>

                  <p className="text-gray-400 text-sm mb-6 flex-grow">
                    {proyecto.descripcion}
                  </p>

                  {proyecto.repo_url && (
                    <a
                      href={proyecto.repo_url}
                      target="_blank"
                      rel="noreferrer"
                      className="self-start border border-green-500 text-green-500 px-4 py-2 text-sm hover:bg-green-500 hover:text-black transition-colors font-bold tracking-wider"
                    >
                      {ui_modal.acceder_registro}
                    </a>
                  )}
                </article>
              ))}
            </div>
          </section>
        ))}
      </main>

      {/* =========================================
          COLUMNA DERECHA: NAVEGACIÓN
          ========================================= */}
      <aside className="w-full lg:w-72 flex-shrink-0 order-first lg:order-last sticky top-4 z-40 h-fit">
        <nav className="border border-green-500 bg-black shadow-[0_0_15px_rgba(34,197,94,0.2)]">
          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="w-full flex justify-between items-center p-4 bg-gray-950 hover:bg-green-900/40 transition-colors border-b border-green-900 cursor-pointer"
          >
            <span className="text-green-500 font-bold uppercase tracking-widest text-sm">
              ROOT DIRECTORY
            </span>
            <span className="text-green-500 font-bold text-lg leading-none">
              {menuAbierto ? "[-]" : "[+]"}
            </span>
          </button>

          {/* LISTA DE NAVEGACIÓN */}
          {menuAbierto && (
            <div className="p-4 bg-black">
              <ul className="space-y-4 text-sm font-bold">
                <li>
                  <a
                    href="#seccion-cv"
                    onClick={() =>
                      window.innerWidth < 1024 && setMenuAbierto(false)
                    }
                    className="text-gray-400 hover:text-white hover:translate-x-2 transition-transform inline-block"
                  >
                    {">"} {cvData.paginas[0].titulo}
                  </a>
                </li>
                {categorias.map(([key, categoria]) => (
                  <li key={`nav-${key}`}>
                    <a
                      href={`#seccion-${key}`}
                      onClick={() =>
                        window.innerWidth < 1024 && setMenuAbierto(false)
                      }
                      className="text-gray-400 hover:text-white hover:translate-x-2 transition-transform inline-block truncate w-full"
                      title={categoria.etiqueta_expediente}
                    >
                      {">"} {categoria.etiqueta_expediente}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </nav>
      </aside>
    </div>
  );
}
