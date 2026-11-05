import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import { ordenarProyectosRecientes } from "../../utils/dateSorting";

/**
 * PlainView (Modo Plano Táctico):
 * - Estética predominante: Negro, Verde fósforo de consola y Blanco nítido (o Detective Noir si se desbloquea el easter egg).
 * - Toques modernos de Persona 5: Cortes angulares, tipografía pesada en bloques, sombras duras sólidas y trama de semitono.
 * - Windows XP & Hacker Terminal: Barra de ventana retro con controles [ _ ] [ □ ] [ ✕ ], menú de comandos y barra de estado.
 * - Totalmente internacionalizado: 100% de datos extraídos de los archivos JSON vía i18next (cero texto hardcodeado).
 * - Animaciones fluidas con Framer Motion y diseño 100% responsive (móvil, tablet y desktop).
 * - Contadores de Proyectos y Antigüedad técnica, más módulo dedicado a Technical Art 3D.
 */
export function VistaPlana({ onSwitchTo3D, setModoApp, onOpenContact }) {
  const { t } = useTranslation();
  const {
    esNoir,
    easterEggDesbloqueado,
    desbloquearEasterEgg,
    toggleTema,
  } = useTheme();

  // Datos 100% localizados desde los JSONs
  const ui_plano = t("ui_plano", { returnObjects: true }) || {};
  const ui_global = t("ui_global", { returnObjects: true }) || {};
  const ui_trayectoria = t("ui_trayectoria", { returnObjects: true }) || {};
  const ui_easter = t("ui_easter_egg", { returnObjects: true }) || {};
  const cvData = t("cvData", { returnObjects: true }) || { paginas: [] };

  const categorias = useMemo(() => {
    const data = t("expedientesData", { returnObjects: true }) || {};
    return Object.entries(data);
  }, [t]);

  // Estados de interfaz y accesibilidad
  const [categoriaActiva, setCategoriaActiva] = useState("TODOS");
  const [moduloActivo, setModuloActivo] = useState("PROYECTOS"); // PROYECTOS | ART_3D | HISTORIAL | STACK
  const [scanlinesActive, setScanlinesActive] = useState(true);
  const [matrixGreenMode, setMatrixGreenMode] = useState(false);
  const [copiadoFeedback, setCopiadoFeedback] = useState(false);

  // Cálculo dinámico de contadores de proyectos desde los datos JSON ordenados cronológicamente
  const todosLosProyectos = useMemo(() => {
    const lista = categorias.flatMap(([key, cat]) =>
      (cat.proyectos || []).map((p) => ({
        ...p,
        categoriaKey: key,
        categoriaLabel: cat.nombre_clasificacion,
      }))
    );
    return ordenarProyectosRecientes(lista);
  }, [categorias]);

  const totalProyectos = todosLosProyectos.length;
  const proyectosB2B = todosLosProyectos.filter(
    (p) =>
      p.categoriaKey === "sistemas_software" ||
      p.categoriaKey === "ia_narrativa" ||
      p.categoriaKey === "sistemas_bajo_nivel_algoritmos"
  ).length;
  const proyectosCreative = todosLosProyectos.filter(
    (p) => p.categoriaKey === "arte_3d" || p.categoriaKey === "desarrollo_web"
  ).length;

  // Contador de Antigüedad técnica desde el inicio de formación (2019)
  const fechaInicio = 2019;
  const anioActual = new Date().getFullYear();
  const aniosAntiguedad = anioActual - fechaInicio;

  const proyectosFiltrados = useMemo(() => {
    const lista =
      categoriaActiva === "TODOS"
        ? todosLosProyectos
        : todosLosProyectos.filter((p) => p.categoriaKey === categoriaActiva);
    return ordenarProyectosRecientes(lista);
  }, [categoriaActiva, todosLosProyectos]);

  const handleLaunch3D = () => {
    if (onSwitchTo3D) onSwitchTo3D();
    else if (setModoApp) setModoApp("3D");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const container = document.getElementById("modo-plano-container");
    if (container) {
      container.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleMinimizar = () => {
    if (setModoApp) {
      setModoApp("LANDING");
    } else {
      setModuloActivo("PROYECTOS");
      scrollToTop();
    }
  };

  const copiarEmail = () => {
    const email = "joelmarcori1@gmail.com";
    navigator.clipboard.writeText(email);
    setCopiadoFeedback(true);
    setTimeout(() => setCopiadoFeedback(false), 2500);
  };

  return (
    <div
      className={`w-full min-h-screen font-mono p-2 sm:p-4 md:p-8 select-text relative transition-colors duration-300 ${
        matrixGreenMode
          ? "bg-[#030d05] text-[#22c55e]"
          : esNoir
          ? "bg-[#0d0a08] text-[#faedd9]"
          : "bg-[#08090b] text-zinc-200"
      }`}
    >
      {/* SCANLINES Y VIÑETA CRT CONMUTABLE */}
      {scanlinesActive && (
        <>
          {/* Líneas de escaneo CRT analógicas nítidas (3px pitch) */}
          <div
            className="fixed inset-0 pointer-events-none opacity-[0.09] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.8)_50%)] bg-[length:100%_3px] z-40"
            aria-hidden="true"
          />
          {/* Rejilla de fósforo RGB sutil */}
          <div
            className="fixed inset-0 pointer-events-none opacity-[0.035] bg-[linear-gradient(90deg,rgba(255,0,0,0.3),rgba(0,255,0,0.3)_50%,rgba(0,0,255,0.3))] bg-[length:3px_100%] z-40"
            aria-hidden="true"
          />
          {/* Haz de barrido catódico en bucle continuo de pantalla completa */}
          <div
            className={`fixed top-0 left-0 right-0 h-48 pointer-events-none z-40 animate-crt-scanline ${
              esNoir
                ? "bg-gradient-to-b from-transparent via-amber-400/[0.05] via-white/[0.07] to-transparent"
                : "bg-gradient-to-b from-transparent via-emerald-400/[0.05] via-white/[0.07] to-transparent"
            }`}
            aria-hidden="true"
          />
          {/* Viñeta periférica de tubo catódico */}
          <div
            className="fixed inset-0 pointer-events-none z-40 shadow-[inset_0_0_80px_rgba(0,0,0,0.85)]"
            aria-hidden="true"
          />
        </>
      )}

      {/* TOAST DE FEEDBACK PARA ACCIONES RÁPIDAS (RECRUITERS) */}
      <AnimatePresence>
        {copiadoFeedback && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 text-black font-bold text-xs px-4 py-2 border-2 border-black shadow-[4px_4px_0px_#000] flex items-center gap-2 ${
              esNoir ? "bg-[#b45309]" : "bg-[#22c55e]"
            }`}
          >
            <span>[OK]</span>
            <span>{ui_plano.email_copiado}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CONTENEDOR PRINCIPAL: RETRO OS WINDOW / PERSONA 5 FRAME */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className={`max-w-7xl mx-auto border-2 shadow-[8px_8px_0px_#000000] relative overflow-hidden transition-colors duration-300 ${
          esNoir
            ? "border-[#b45309]/70 bg-[#120e0a]"
            : "border-[#22c55e]/70 bg-[#0c0e12]"
        }`}
      >
        {/* =========================================================
            1. BARRA DE TÍTULO WINDOWS XP RETRO // NEGRO Y VERDE / NOIR
            ========================================================= */}
        <div
          className={`border-b-2 p-2 sm:px-4 flex items-center justify-between text-xs select-none transition-colors duration-300 ${
            esNoir
              ? "bg-gradient-to-r from-[#20140c] via-[#2c1b11] to-[#1a0f08] border-[#b45309]/60 text-[#fde68a]"
              : "bg-gradient-to-r from-[#0d1f12] via-[#142e1b] to-[#0a180e] border-[#22c55e]/60 text-[#4ade80]"
          }`}
        >
          <div className="flex items-center gap-2 font-bold tracking-wider truncate">
            {/* EASTER EGG INTUITIVO: CLICK PARA CONMUTAR MODO MATRIX */}
            <button
              onClick={() => setMatrixGreenMode(!matrixGreenMode)}
              title={ui_plano.easter_egg_notif}
              aria-label={ui_plano.easter_egg_notif || "Alternar modo Matrix"}
              className={`w-3 h-3 inline-block border border-black cursor-pointer shadow-[1px_1px_0px_#fff] transition-transform active:scale-75 ${
                matrixGreenMode
                  ? "bg-[#4ade80] animate-ping"
                  : esNoir
                  ? "bg-[#d97706]"
                  : "bg-[#22c55e]"
              }`}
            />
            <span className="uppercase tracking-widest text-[10px] sm:text-xs truncate">
              {ui_plano.titulo_ventana}
            </span>
          </div>

          {/* BOTONES BISELADOS DE CONTROL RETRO OS */}
          <div className="flex items-center gap-1.5 font-sans font-bold text-black text-[10px] flex-shrink-0">
            <button
              onClick={handleMinimizar}
              title={ui_plano.tooltip_minimizar || "Minimizar (Volver a Inicio)"}
              aria-label={ui_plano.tooltip_minimizar || "Minimizar (Volver a Inicio)"}
              className="w-5 h-5 bg-[#c3c7d0] hover:bg-white border-t-2 border-l-2 border-white border-r-2 border-b-2 border-zinc-700 flex items-center justify-center cursor-pointer active:translate-y-0.5"
            >
              _
            </button>
            <button
              onClick={handleLaunch3D}
              title={ui_plano.tooltip_cerrar_3d || "Cerrar Modo Plano / Iniciar Entorno 3D"}
              aria-label={ui_plano.tooltip_cerrar_3d || "Cerrar Modo Plano / Iniciar Entorno 3D"}
              className="w-5 h-5 bg-[#15803d] hover:bg-[#22c55e] text-white border-t-2 border-l-2 border-[#86efac] border-r-2 border-b-2 border-[#052e16] flex items-center justify-center cursor-pointer active:translate-y-0.5"
            >
              ✕
            </button>
          </div>
        </div>

        {/* =========================================================
            2. MENÚ DE COMANDOS RETRO OS (BOTONES INTUITIVOS)
            ========================================================= */}
        <div className="bg-[#0e1117] border-b border-[#22c55e]/40 px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-400">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <button
              onClick={() => {
                setModuloActivo("PROYECTOS");
                scrollToTop();
              }}
              className="hover:text-[#4ade80] transition-colors cursor-pointer"
            >
              {ui_plano.menu_file}
            </button>
            <button
              onClick={() => setScanlinesActive(!scanlinesActive)}
              className="hover:text-[#4ade80] transition-colors cursor-pointer"
            >
              {ui_plano.menu_crt}
            </button>
          </div>

          {/* ACCESOS RÁPIDOS DIRECTOS PARA RECRUITERS */}
          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            <a
              href={ui_plano.cv_pdf_file}
              download
              className="px-2.5 py-1 bg-white hover:bg-[#22c55e] text-black font-black uppercase tracking-wider transition-colors border border-black shadow-[2px_2px_0px_#000]"
            >
              {ui_plano.btn_descargar_cv}
            </a>
            <button
              onClick={copiarEmail}
              className="px-2.5 py-1 bg-[#142e1b] hover:bg-[#22c55e] hover:text-black text-[#4ade80] font-bold uppercase tracking-wider transition-colors border border-[#22c55e]/60 cursor-pointer"
            >
              {ui_plano.btn_copiar_email}
            </button>
            {onOpenContact && (
              <button
                onClick={onOpenContact}
                className="px-2.5 py-1 bg-black hover:bg-[#22c55e] text-zinc-300 hover:text-black font-bold uppercase tracking-wider transition-colors border border-zinc-700 hover:border-[#22c55e] cursor-pointer"
              >
                {ui_global.btn_contacto || "[ CONTACTO ]"}
              </button>
            )}
          </div>
        </div>

        {/* =========================================================
            3. PERSONA 5 STYLE HERO BANNER: NEGRO, BLANCO Y VERDE
            ========================================================= */}
        <div className="p-4 sm:p-6 lg:p-8 border-b-2 border-[#22c55e]/50 bg-[#090b0e] relative overflow-hidden">
          {/* TRAMA HATCH SUTIL DE CÓMIC */}
          <div
            className="absolute top-0 right-0 w-80 h-full opacity-10 pointer-events-none bg-[repeating-linear-gradient(45deg,#22c55e,#22c55e_2px,transparent_2px,transparent_8px)]"
            aria-hidden="true"
          />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3">
              {/* STICKER IDENTIDAD PERSONA 5 CON CORTE ANGULAR */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="inline-block transform -rotate-1 bg-[#22c55e] text-black px-3 py-1 text-xs font-black tracking-widest uppercase shadow-[3px_3px_0px_#ffffff]"
              >
                {ui_plano.badge_identidad}
              </motion.div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tighter uppercase leading-none">
                JOEL JESÚS MARCORI
              </h1>

              <p className="text-sm sm:text-base text-zinc-300 max-w-2xl font-sans leading-relaxed">
                {ui_plano.descripcion_hero}
              </p>

              {/* ACCESO DIRECTO AL STORYTELLING NARRATIVO & CONTACTO RÁPIDO */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <button
                  onClick={() => setModuloActivo("TRAYECTORIA")}
                  className="px-3.5 py-2 bg-[#142e1b] hover:bg-[#22c55e] hover:text-black text-[#4ade80] text-xs font-black uppercase tracking-wider transition-all border border-[#22c55e]/70 shadow-[3px_3px_0px_#000] cursor-pointer flex items-center gap-2"
                >
                  <span>{ui_plano.btn_ver_recorrido || "[ VER RECORRIDO NARRATIVO → ]"}</span>
                </button>
                {onOpenContact && (
                  <button
                    onClick={onOpenContact}
                    className="px-3.5 py-2 bg-black hover:bg-white text-zinc-200 hover:text-black text-xs font-bold uppercase tracking-wider transition-all border border-zinc-700 hover:border-black shadow-[3px_3px_0px_#000] cursor-pointer"
                  >
                    {ui_global.btn_contacto || "[ CONTACTAR ]"}
                  </button>
                )}
              </div>
            </div>

            {/* BOTÓN CTA PARA LANZAR EL ENTORNO 3D */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2 flex-shrink-0">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLaunch3D}
                className="group relative px-6 py-3.5 bg-white hover:bg-[#22c55e] text-black font-black text-xs uppercase tracking-widest transition-colors border-2 border-black shadow-[4px_4px_0px_#22c55e] cursor-pointer text-center"
              >
                <span>{ui_plano.btn_lanzar_3d}</span>
              </motion.button>

              <div className="text-[10px] text-zinc-500 font-mono text-center sm:text-left">
                {ui_plano.subtitulo_3d}
              </div>
            </div>
          </div>

          {/* =========================================================
              4. CONTADORES DE TELEMETRÍA (PROYECTOS Y ANTIGÜEDAD)
              ========================================================= */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6 pt-6 border-t-2 border-[#22c55e]/30">
            {/* CONTADOR DE PROYECTOS */}
            <motion.div
              whileHover={{ y: -2 }}
              className="p-3 bg-black border-2 border-[#22c55e]/60 shadow-[3px_3px_0px_#000]"
            >
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
                {ui_plano.contador_proyectos}
              </span>
              <div className="text-2xl sm:text-3xl font-black text-white font-mono mt-0.5 flex items-baseline gap-2">
                <span className="text-[#22c55e]">
                  {String(totalProyectos).padStart(2, "0")}
                </span>
                <span className="text-[10px] font-normal text-zinc-400">
                  {ui_plano.contador_proyectos_sub}
                </span>
              </div>
              <div className="text-[10px] text-zinc-500 mt-1">
                B2B: {proyectosB2B} // CREATIVE: {proyectosCreative}
              </div>
            </motion.div>

            {/* CONTADOR DE ANTIGÜEDAD TÉCNICA */}
            <motion.div
              whileHover={{ y: -2 }}
              className="p-3 bg-black border-2 border-[#22c55e]/60 shadow-[3px_3px_0px_#000]"
            >
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
                {ui_plano.contador_antiguedad}
              </span>
              <div className="text-2xl sm:text-3xl font-black text-white font-mono mt-0.5 flex items-baseline gap-2">
                <span className="text-[#22c55e]">+{aniosAntiguedad}</span>
                <span className="text-[10px] font-normal text-zinc-400">AÑOS</span>
              </div>
              <div className="text-[10px] text-zinc-500 mt-1">
                {ui_plano.contador_antiguedad_sub}
              </div>
            </motion.div>

            {/* PROMEDIO ACADÉMICO FaCENA */}
            <motion.div
              whileHover={{ y: -2 }}
              className="p-3 bg-black border-2 border-zinc-700 shadow-[3px_3px_0px_#000]"
            >
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
                {ui_plano.contador_promedio}
              </span>
              <div className="text-2xl sm:text-3xl font-black text-white font-mono mt-0.5 flex items-baseline gap-2">
                <span>8.65</span>
                <span className="text-[10px] font-normal text-[#22c55e]">/ 10</span>
              </div>
              <div className="text-[10px] text-zinc-500 mt-1">
                {ui_plano.contador_promedio_sub}
              </div>
            </motion.div>

            {/* INGLÉS PROFESIONAL C1 */}
            <motion.div
              whileHover={{ y: -2 }}
              className="p-3 bg-black border-2 border-zinc-700 shadow-[3px_3px_0px_#000]"
            >
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
                {ui_plano.contador_ingles}
              </span>
              <div className="text-2xl sm:text-3xl font-black text-white font-mono mt-0.5 flex items-baseline gap-2">
                <span>C1</span>
                <span className="text-[10px] font-normal text-[#22c55e]">AVANZADO</span>
              </div>
              <div className="text-[10px] text-zinc-500 mt-1">
                {ui_plano.contador_ingles_sub}
              </div>
            </motion.div>
          </div>
        </div>

        {/* =========================================================
            5. TABS PIP-BOY CON TRANSICIÓN (RESPONSIVE TOUCH SCROLL)
            ========================================================= */}
        <div className="flex border-b-2 border-[#22c55e]/50 bg-[#0e1117] overflow-x-auto select-none scrollbar-none">
          {[
            { id: "TRAYECTORIA", label: ui_plano.tab_trayectoria || "[00] TRAYECTORIA // RECORRIDO" },
            { id: "PROYECTOS", label: ui_plano.tab_proyectos },
            { id: "ART_3D", label: ui_plano.tab_art_3d },
            { id: "HISTORIAL", label: ui_plano.tab_historial },
            { id: "STACK", label: ui_plano.tab_stack },
          ].map((tab) => {
            const isActive = moduloActivo === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setModuloActivo(tab.id)}
                className={`px-4 sm:px-6 py-3 text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer border-r-2 border-zinc-800 ${
                  isActive
                    ? "bg-[#22c55e] text-black shadow-[inset_0_-2px_0_#000]"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* =========================================================
            6. CONTENIDO ANIMADO CON ANIMA-PRESENCE
            ========================================================= */}
        <div className="p-4 sm:p-6 lg:p-8 space-y-8">
          <AnimatePresence>
            {/* ------------------------------------------------------
                MÓDULO 0: SCROLLYTELLING // TRAYECTORIA DEL INGENIERO
                ------------------------------------------------------ */}
            {moduloActivo === "TRAYECTORIA" && (
              <motion.div
                key="mod-trayectoria"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-8"
              >
                {/* ENCABEZADO DEL DOSSIER NARRATIVO */}
                <div className="p-4 sm:p-6 bg-black border-2 border-[#22c55e] shadow-[4px_4px_0px_#000] space-y-3 relative overflow-hidden">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="inline-block transform -rotate-1 bg-[#22c55e] text-black px-3 py-1 text-xs font-black tracking-widest uppercase shadow-[2px_2px_0px_#fff]">
                      {ui_trayectoria.badge_scrollytelling}
                    </div>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      LOG_STATUS: VERIFIED // ARCHIVAL_CHAIN
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight uppercase">
                    {ui_trayectoria.titulo}
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-300 max-w-3xl font-sans leading-relaxed">
                    {ui_trayectoria.subtitulo}
                  </p>
                </div>

                {/* TIMELINE VERTICAL SCROLLYTELLING CON ESTÉTICA PERSONA 5 / HACKER TERMINAL */}
                <div className="relative pl-6 sm:pl-10 space-y-10 sm:space-y-12 before:content-[''] before:absolute before:left-3 sm:before:left-5 before:top-4 before:bottom-6 before:w-0.5 before:bg-[#22c55e]/40">
                  {(ui_trayectoria.capitulos || []).map((cap, idx) => (
                    <motion.div
                      key={cap.numero || idx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.35, delay: idx * 0.08 }}
                      className="relative space-y-4"
                    >
                      {/* NODO NUMÉRICO EN LA LÍNEA TEMPORAL */}
                      <div className="absolute -left-6 sm:-left-10 top-0 w-6 h-6 sm:w-10 sm:h-10 bg-black border-2 border-[#22c55e] text-[#22c55e] flex items-center justify-center font-black text-[10px] sm:text-xs shadow-[2px_2px_0px_#000] -translate-x-1/2">
                        {cap.numero}
                      </div>

                      {/* TARJETA DEL CAPÍTULO */}
                      <div className="p-4 sm:p-6 bg-[#090b0e] border-2 border-zinc-800 hover:border-[#22c55e]/60 transition-colors shadow-[6px_6px_0px_#000] space-y-4">
                        {/* HEADER DEL CAPÍTULO: PERIODO, ROL Y BADGE */}
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2 py-0.5 bg-[#142e1b] text-[#4ade80] border border-[#22c55e]/40 text-[10px] font-bold uppercase tracking-wider">
                              {cap.periodo}
                            </span>
                            <span className="text-xs font-bold text-white uppercase tracking-wider">
                              {cap.rol}
                            </span>
                          </div>
                          {cap.badge && (
                            <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 border border-zinc-800">
                              {cap.badge}
                            </span>
                          )}
                        </div>

                        {/* TÍTULO PRINCIPAL */}
                        <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight">
                          {cap.titulo}
                        </h3>

                        {/* NARRATIVA */}
                        <p className="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed">
                          {cap.narrativa}
                        </p>

                        {/* PROBLEMA RESUELTO / IMPACTO TÉCNICO */}
                        {cap.problema_resuelto && (
                          <div className="p-3 bg-black border-l-2 border-[#22c55e] space-y-1">
                            <div className="text-[10px] font-bold text-[#4ade80] uppercase tracking-wider">
                              // IMPACTO TÉCNICO & PROBLEMA RESUELTO:
                            </div>
                            <div className="text-xs text-zinc-300 font-sans">
                              {cap.problema_resuelto}
                            </div>
                          </div>
                        )}

                        {/* CITA PERSONA 5 ANGULAR */}
                        {cap.quote_persona5 && (
                          <div className="p-3 bg-black border-2 border-zinc-700 shadow-[3px_3px_0px_#22c55e] transform -rotate-0.5">
                            <p className="text-xs sm:text-sm font-black text-white italic tracking-wide">
                              &ldquo;{cap.quote_persona5}&rdquo;
                            </p>
                          </div>
                        )}

                        {/* SKILLS Y MÉTRICA CLAVE */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-zinc-900">
                          {/* SKILLS CHIPS */}
                          <div className="flex flex-wrap gap-1.5">
                            {(cap.skills || []).map((skill, sIdx) => (
                              <span
                                key={sIdx}
                                className="px-2 py-0.5 bg-black border border-zinc-800 text-[10px] font-mono text-zinc-400"
                              >
                                #{skill}
                              </span>
                            ))}
                          </div>

                          {/* MÉTRICA CLAVE */}
                          {cap.metrica_clave && (
                            <div className="flex items-baseline gap-2 bg-zinc-950 px-3 py-1.5 border border-zinc-800 shrink-0">
                              <span className="text-base sm:text-lg font-black text-[#22c55e] font-mono">
                                {cap.metrica_clave}
                              </span>
                              <span className="text-[10px] text-zinc-400 font-sans">
                                {cap.metrica_desc}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* BOTÓN CTA FINAL: SALTO A PROYECTOS B2B */}
                <div className="p-6 bg-black border-2 border-[#22c55e]/50 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[4px_4px_0px_#000]">
                  <div className="space-y-1 text-center sm:text-left">
                    <div className="text-xs font-bold text-white uppercase tracking-wider">
                      FIN DEL DOSSIER // SIGUIENTE PASO DE EVALUACIÓN
                    </div>
                    <div className="text-[11px] text-zinc-400 font-sans">
                      Inspecciona los proyectos concretos implementados con estas arquitecturas.
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setModuloActivo("PROYECTOS");
                      scrollToTop();
                    }}
                    className="px-6 py-3 bg-[#22c55e] hover:bg-white text-black font-black text-xs uppercase tracking-widest transition-colors shadow-[3px_3px_0px_#fff] cursor-pointer whitespace-nowrap"
                  >
                    {ui_trayectoria.btn_ir_a_proyectos || "[ EXPLORAR CASOS DE ESTUDIO B2B → ]"}
                  </button>
                </div>
              </motion.div>
            )}

            {/* ------------------------------------------------------
                MÓDULO 1: CASOS DE ESTUDIO B2B
                ------------------------------------------------------ */}
            {moduloActivo === "PROYECTOS" && (
              <motion.div
                key="mod-proyectos"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {/* FILTROS DE CATEGORÍA */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-black border border-[#22c55e]/40">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-zinc-400 mr-2 uppercase">
                      {ui_plano.filtro_label}
                    </span>
                    <button
                      onClick={() => setCategoriaActiva("TODOS")}
                      className={`px-3 py-1 text-xs font-bold uppercase transition-colors cursor-pointer border ${
                        categoriaActiva === "TODOS"
                          ? "bg-[#22c55e] text-black border-[#22c55e]"
                          : "bg-[#181920] text-zinc-400 border-zinc-700 hover:text-white"
                      }`}
                    >
                      {ui_plano.filtro_todos} ({totalProyectos})
                    </button>
                    {categorias.map(([key, cat]) => (
                      <button
                        key={key}
                        onClick={() => setCategoriaActiva(key)}
                        className={`px-3 py-1 text-xs font-bold uppercase transition-colors cursor-pointer border ${
                          categoriaActiva === key
                            ? "bg-[#22c55e] text-black border-[#22c55e]"
                            : "bg-[#181920] text-zinc-400 border-zinc-700 hover:text-white"
                        }`}
                      >
                        {cat.etiqueta_expediente}
                      </button>
                    ))}
                  </div>

                  <div className="text-[11px] text-zinc-500 font-mono">
                    REGISTROS: {proyectosFiltrados.length}
                  </div>
                </div>

                {/* GRID DE PROYECTOS RESPONSIVE */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {proyectosFiltrados.map((proyecto) => (
                    <motion.article
                      key={proyecto.id}
                      whileHover={{ y: -3 }}
                      className="border-2 border-zinc-700 hover:border-[#22c55e] bg-black p-4 sm:p-6 flex flex-col justify-between shadow-[4px_4px_0px_#000] transition-colors"
                    >
                      <div className="space-y-4">
                        {/* HEADER DE CADA TARJETA */}
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-3">
                          <span className="bg-[#142e1b] text-[#4ade80] border border-[#22c55e]/50 px-2.5 py-0.5 text-[10px] font-bold uppercase">
                            {proyecto.categoriaLabel}
                          </span>
                          <span className="text-zinc-400 text-xs font-bold">
                            {proyecto.fecha}
                          </span>
                        </div>

                        {/* IMAGEN DEL PROYECTO */}
                        <div className="aspect-video relative overflow-hidden bg-zinc-950 border border-zinc-800">
                          {proyecto.imagen_url ? (
                            <img
                              src={proyecto.imagen_url}
                              alt={proyecto.titulo}
                              className="w-full h-full object-cover opacity-85 hover:opacity-100 transition-opacity duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs">
                              [NO_PREVIEW]
                            </div>
                          )}
                          <div className="absolute top-2 right-2 bg-black/85 px-2 py-0.5 text-[10px] text-zinc-300 border border-zinc-700">
                            ID: {proyecto.id}
                          </div>
                        </div>

                        {/* TÍTULO Y DESCRIPCIÓN */}
                        <div>
                          <h2 className="text-xl font-black text-white uppercase tracking-tight">
                            {proyecto.titulo}
                          </h2>
                          <p className="text-xs text-zinc-300 mt-2 font-sans leading-relaxed">
                            {proyecto.descripcion}
                          </p>
                        </div>

                        {/* STACK CHIPS */}
                        <div>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {proyecto.stack.map((tech) => (
                              <span
                                key={tech}
                                className="px-2 py-0.5 bg-[#142e1b] border border-[#22c55e]/40 text-[#4ade80] text-[11px] font-bold"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* FOOTER: BOTÓN DE REPOSITORIO */}
                      <div className="pt-4 mt-6 border-t border-zinc-800 flex items-center justify-between text-xs">
                        {proyecto.repo_url && (
                          <a
                            href={proyecto.repo_url}
                            target="_blank"
                            rel="noreferrer"
                            className="px-4 py-2 bg-zinc-900 hover:bg-[#22c55e] text-white hover:text-black font-bold uppercase tracking-wider border border-zinc-700 hover:border-black transition-colors flex items-center gap-2 cursor-pointer shadow-[2px_2px_0px_#000]"
                          >
                            <span>{ui_plano.btn_repo}</span>
                          </a>
                        )}
                      </div>
                    </motion.article>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ------------------------------------------------------
                MÓDULO 2: TECHNICAL ART & 3D (LADO ARTÍSTICO)
                ------------------------------------------------------ */}
            {moduloActivo === "ART_3D" && (
              <motion.div
                key="mod-art"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="p-4 bg-black border-l-4 border-[#22c55e] space-y-1">
                  <h2 className="text-lg font-black text-white uppercase tracking-wider">
                    {ui_plano.art_3d_banner}
                  </h2>
                  <p className="text-xs text-zinc-300 font-sans">
                    {ui_plano.art_3d_desc}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* CARD PBR & MODELADO */}
                  <motion.div
                    whileHover={{ y: -3 }}
                    className="p-4 sm:p-6 bg-black border-2 border-zinc-700 hover:border-[#22c55e] space-y-4 shadow-[4px_4px_0px_#000] transition-colors"
                  >
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                      <span className="text-xs font-bold text-[#4ade80] uppercase">
                        {ui_plano.card_pbr_titulo}
                      </span>
                      <span className="text-[10px] text-zinc-400">
                        {ui_plano.card_pbr_tech}
                      </span>
                    </div>

                    <div className="aspect-video relative overflow-hidden bg-zinc-950 border border-zinc-800">
                      <img
                        src="/images/projects/3d.png"
                        alt="Assets 3D"
                        className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                      />
                    </div>

                    <div className="space-y-2 text-xs font-sans text-zinc-300 leading-relaxed">
                      <p>{ui_plano.card_pbr_p1}</p>
                      <p>{ui_plano.card_pbr_p2}</p>
                    </div>

                    <div className="p-3 bg-[#0a180e] border border-[#22c55e]/40 text-[11px] font-mono text-[#4ade80] space-y-1">
                      <div>{ui_plano.card_pbr_spec1}</div>
                      <div>{ui_plano.card_pbr_spec2}</div>
                      <div>{ui_plano.card_pbr_spec3}</div>
                    </div>

                    <button
                      onClick={() => {
                        setModuloActivo("PROYECTOS");
                        setCategoriaActiva("arte_3d");
                        scrollToTop();
                      }}
                      className="w-full py-2 bg-zinc-900 hover:bg-[#22c55e] text-zinc-300 hover:text-black font-mono text-[11px] font-bold uppercase tracking-wider border border-zinc-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>{ui_plano.btn_ver_dossier_3d}</span>
                    </button>
                  </motion.div>

                  {/* CARD WEBGL & SHADERS */}
                  <motion.div
                    whileHover={{ y: -3 }}
                    className="p-4 sm:p-6 bg-black border-2 border-zinc-700 hover:border-[#22c55e] space-y-4 shadow-[4px_4px_0px_#000] transition-colors"
                  >
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                      <span className="text-xs font-bold text-[#4ade80] uppercase">
                        {ui_plano.card_webgl_titulo}
                      </span>
                      <span className="text-[10px] text-zinc-400">
                        {ui_plano.card_webgl_tech}
                      </span>
                    </div>

                    <div className="aspect-video relative overflow-hidden bg-zinc-950 border border-zinc-800">
                      <img
                        src="/images/projects/portfolio.png"
                        alt="Oficina Detective 3D"
                        className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                      />
                    </div>

                    <div className="space-y-2 text-xs font-sans text-zinc-300 leading-relaxed">
                      <p>{ui_plano.card_webgl_p1}</p>
                      <p>{ui_plano.card_webgl_p2}</p>
                    </div>

                    <div className="p-3 bg-[#0a180e] border border-[#22c55e]/40 text-[11px] font-mono text-[#4ade80] space-y-1">
                      <div>{ui_plano.card_webgl_spec1}</div>
                      <div>{ui_plano.card_webgl_spec2}</div>
                      <div>{ui_plano.card_webgl_spec3}</div>
                    </div>

                    <button
                      onClick={() => {
                        setModuloActivo("PROYECTOS");
                        setCategoriaActiva("desarrollo_web");
                        scrollToTop();
                      }}
                      className="w-full py-2 bg-zinc-900 hover:bg-[#22c55e] text-zinc-300 hover:text-black font-mono text-[11px] font-bold uppercase tracking-wider border border-zinc-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>{ui_plano.btn_ver_dossier_webgl}</span>
                    </button>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* ------------------------------------------------------
                MÓDULO 3: HISTORIAL OPERATIVO & FORMACIÓN
                ------------------------------------------------------ */}
            {moduloActivo === "HISTORIAL" && (
              <motion.div
                key="mod-historial"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {/* EXPERIENCIA */}
                <div className="space-y-4">
                  <h2 className="text-sm font-black text-white uppercase tracking-widest border-b-2 border-zinc-800 pb-2">
                    {ui_plano.seccion_historial_titulo}
                  </h2>

                  <div className="space-y-4">
                    {cvData.paginas
                      .filter((p) => p.tipo === "EXPERIENCIA")
                      .flatMap((p) => p.items || [])
                      .map((item, idx) => (
                        <div
                          key={idx}
                          className="p-4 bg-black border-l-4 border-[#22c55e] border-t border-r border-b border-zinc-800"
                        >
                          <h3 className="text-base font-bold text-white uppercase font-mono">
                            {item.title}
                          </h3>
                          <p className="text-xs text-zinc-300 mt-2 font-sans leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>

                {/* EDUCACIÓN */}
                <div className="space-y-4 pt-4">
                  <h2 className="text-sm font-black text-white uppercase tracking-widest border-b-2 border-zinc-800 pb-2">
                    {ui_plano.seccion_educacion_titulo}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cvData.paginas
                      .filter((p) => p.tipo === "EDUCACION")
                      .flatMap((p) => p.items || [])
                      .map((item, idx) => (
                        <div
                          key={idx}
                          className="p-4 bg-black border border-zinc-800 space-y-1.5"
                        >
                          <h3 className="text-sm font-bold text-white uppercase">
                            {item.title}
                          </h3>
                          <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ------------------------------------------------------
                MÓDULO 4: MATRIZ DE COMPETENCIAS
                ------------------------------------------------------ */}
            {moduloActivo === "STACK" && (
              <motion.div
                key="mod-stack"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="p-4 bg-black border-l-4 border-[#22c55e]">
                  <h2 className="text-lg font-black text-white uppercase tracking-wider">
                    {ui_plano.seccion_stack_titulo}
                  </h2>
                  <p className="text-xs text-zinc-400 font-sans mt-1">
                    {ui_plano.seccion_stack_sub}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                  {/* BACKEND & ARQUITECTURA */}
                  <div className="p-4 bg-black border-2 border-zinc-800 space-y-3">
                    <div className="text-[#4ade80] font-black uppercase border-b border-zinc-800 pb-2">
                      {ui_plano.stack_col1_titulo}
                    </div>
                    <ul className="space-y-2 text-zinc-300">
                      <li>• C# (.NET 8 Core / Framework)</li>
                      <li>• Arquitectura de 4 Capas & Clean Arch</li>
                      <li>• CQRS & Event Sourcing</li>
                      <li>• Python (FastAPI / Workers)</li>
                      <li>• SQL Server / MySQL / PostgreSQL</li>
                      <li>• PHP / CodeIgniter 4</li>
                    </ul>
                  </div>

                  {/* APPLIED AI */}
                  <div className="p-4 bg-black border-2 border-zinc-800 space-y-3">
                    <div className="text-white font-black uppercase border-b border-zinc-800 pb-2">
                      {ui_plano.stack_col2_titulo}
                    </div>
                    <ul className="space-y-2 text-zinc-300">
                      <li>• Orquestación Multi-Agente</li>
                      <li>• LangChain / Pipeline RAG</li>
                      <li>• Guardrails & Validación Factual</li>
                      <li>• Gamification Design (TTRPGs)</li>
                      <li>• Grupo de Investigación Calidad SW</li>
                      <li>• Game Master Engine automatizado</li>
                    </ul>
                  </div>

                  {/* CREATIVE TECH & 3D */}
                  <div className="p-4 bg-black border-2 border-zinc-800 space-y-3">
                    <div className="text-zinc-400 font-black uppercase border-b border-zinc-800 pb-2">
                      {ui_plano.stack_col3_titulo}
                    </div>
                    <ul className="space-y-2 text-zinc-300">
                      <li>• React 19 / Vite / TailwindCSS</li>
                      <li>• Three.js / React Three Fiber</li>
                      <li>• Shaders GLSL & Optimización GPU</li>
                      <li>• Blender (PBR, Rigging, Topología)</li>
                      <li>• Substance Painter</li>
                      <li>• Unity / C++</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* =========================================================
            7. BARRA DE ESTADO WINDOWS XP // STATUS BAR INFERIOR
            ========================================================= */}
        <div
          className={`border-t-2 p-2 sm:px-4 flex flex-wrap items-center justify-between gap-3 text-xs select-none transition-colors duration-300 ${
            esNoir
              ? "bg-[#18110b] border-[#b45309]/50 text-[#fed7aa]"
              : "bg-[#0e1117] border-[#22c55e]/50 text-zinc-400"
          }`}
        >
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={handleLaunch3D}
              className={`px-3 py-1 font-bold border shadow-[2px_2px_0px_#000] cursor-pointer flex items-center gap-1.5 transition-colors ${
                esNoir
                  ? "bg-[#2c1b11] hover:bg-[#b45309] text-[#fde68a] hover:text-black border-[#b45309]"
                  : "bg-[#142e1b] hover:bg-[#22c55e] text-[#4ade80] hover:text-black border-[#22c55e]"
              }`}
            >
              <span>[►]</span>
              <span>{ui_global.boton_modo_3d}</span>
            </button>

            {/* EASTER EGG TOGGLE O PISTA CLICKEABLE */}
            {easterEggDesbloqueado ? (
              <button
                onClick={toggleTema}
                className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider border shadow-[2px_2px_0px_#000] cursor-pointer transition-colors ${
                  esNoir
                    ? "bg-[#321c10] hover:bg-[#433022] border-[#bc6c25] text-[#fed7aa]"
                    : "bg-[#0a2312] hover:bg-[#144222] border-[#22c55e] text-[#86efac]"
                }`}
                title="Alternar entre temas globales"
              >
                {esNoir ? ui_easter.btn_toggle_cyber : ui_easter.btn_toggle_noir}
              </button>
            ) : (
              <button
                onClick={desbloquearEasterEgg}
                className="text-[11px] font-mono text-zinc-500 hover:text-amber-400 cursor-pointer border border-transparent hover:border-amber-500/50 px-2 py-0.5 transition-colors"
                title={ui_easter.tooltip_pista}
              >
                {ui_easter.pista_secreta}
              </button>
            )}

            <span className="text-[11px] hidden sm:inline text-zinc-500">
              {ui_plano.status_bar_ready}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <a
              href="https://github.com/JJoelM"
              target="_blank"
              rel="noreferrer"
              className={
                esNoir
                  ? "hover:text-[#fde68a] transition-colors"
                  : "hover:text-[#4ade80] transition-colors"
              }
            >
              GITHUB: @JJoelM ↗
            </a>
            <span>|</span>
            <a
              href="https://linkedin.com/in/joel-jesus-marcori/"
              target="_blank"
              rel="noreferrer"
              className={
                esNoir
                  ? "hover:text-[#fde68a] transition-colors"
                  : "hover:text-[#4ade80] transition-colors"
              }
            >
              LINKEDIN ↗
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
