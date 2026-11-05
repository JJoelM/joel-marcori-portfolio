import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

/**
 * GuiaInteractiva3D:
 * Sistema de objetivos y tutorial interactivo estilo videojuego / L.A. Noire para el Modo 3D.
 * Invita al usuario a explorar las evidencias y objetos del escritorio con checklists y outlines.
 * 100% internacionalizado mediante JSON.
 */
export function GuiaInteractiva3D({
  visionDetective,
  setVisionDetective,
  itemsInspeccionados = new Set(),
  onSeleccionarObjetivo,
  defaultMinimizado = true,
}) {
  const { t } = useTranslation();
  const ui_guia = t("ui_guia_3d", { returnObjects: true }) || {};

  const [minimizado, setMinimizado] = useState(defaultMinimizado);

  const objetivos = [
    {
      id: "MONITOR",
      label: ui_guia.obj_monitor || "Monitor CRT",
      desc: ui_guia.obj_monitor_desc || "Conmutar al Modo Plano Táctico B2B",
      tecla: "1",
    },
    {
      id: "CV",
      label: ui_guia.obj_cv || "Expediente Central",
      desc: ui_guia.obj_cv_desc || "Dossier de Hoja de Vida & Historial (CV)",
      tecla: "2",
    },
    {
      id: "PROYECTOS",
      label: ui_guia.obj_proyectos || "Expediente Lateral",
      desc: ui_guia.obj_proyectos_desc || "Casos de Estudio & Arquitectura Técnica",
      tecla: "3",
    },
    {
      id: "LAMPARA",
      label: ui_guia.obj_lampara || "Lámpara de Mesa",
      desc: ui_guia.obj_lampara_desc || "Alternar iluminación Día / Noche",
      tecla: "L",
    },
    {
      id: "PARLANTE",
      label: ui_guia.obj_parlante || "Radio Vintage",
      desc: ui_guia.obj_parlante_desc || "Música Jazz Noir ambiental",
      tecla: "M",
    },
  ];

  const totalObjetivos = objetivos.length;
  const completados = objetivos.filter((o) => itemsInspeccionados.has(o.id)).length;
  const todoCompletado = completados === totalObjetivos;

  return (
    <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 z-40 max-w-[calc(100vw-1.5rem)] sm:max-w-sm pointer-events-auto font-mono select-none">
      {minimizado ? (
        /* PILL FLOTANTE MINIMIZADA */
        <motion.button
          key="pill-minimizada"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setMinimizado(false)}
          className="px-3 py-2 bg-black/90 hover:bg-[#142e1b] border-2 border-[#22c55e] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-[4px_4px_0px_#000] cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-ping" />
          <span>{ui_guia.btn_expandir || "[ ? GUÍA DE INVESTIGACIÓN ]"}</span>
          <span className="px-1.5 py-0.2 bg-[#22c55e] text-black text-[10px] font-black">
            {completados}/{totalObjetivos}
          </span>
        </motion.button>
      ) : (
        /* TARJETA COMPLETA DE OBJETIVOS ESTILO VIDEOJUEGO */
        <motion.div
          key="panel-completo"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-[#090b0e]/95 border-2 border-[#22c55e] shadow-[6px_6px_0px_#000] text-zinc-300 p-3 sm:p-4 space-y-3 backdrop-blur-sm"
        >
            {/* HEADER CON CORTE PERSONA 5 Y BOTONES DE CONTROL */}
            <div className="flex items-center justify-between gap-2 border-b border-zinc-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="inline-block transform -rotate-1 bg-[#22c55e] text-black px-2 py-0.5 text-[10px] font-black tracking-widest uppercase shadow-[1px_1px_0px_#fff]">
                  {ui_guia.badge_tutorial || "OBJETIVOS"}
                </span>
                <span className="text-xs font-bold text-white tracking-wider">
                  {completados}/{totalObjetivos}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {/* TOGGLE OUTLINES VISIÓN DETECTIVE */}
                <button
                  onClick={() => setVisionDetective(!visionDetective)}
                  className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border transition-colors cursor-pointer ${
                    visionDetective
                      ? "bg-[#142e1b] text-[#4ade80] border-[#22c55e]"
                      : "bg-black text-zinc-400 border-zinc-700 hover:text-white"
                  }`}
                  title="Activar / Desactivar resaltado táctico de objetos con Outlines"
                >
                  {visionDetective
                    ? ui_guia.btn_escaner_on || "[ SCANNER: ON ]"
                    : ui_guia.btn_escaner_off || "[ SCANNER: OFF ]"}
                </button>

                {/* BOTÓN MINIMIZAR */}
                <button
                  onClick={() => setMinimizado(true)}
                  className="w-5 h-5 bg-black hover:bg-zinc-800 text-zinc-400 hover:text-white text-xs font-bold border border-zinc-700 flex items-center justify-center cursor-pointer"
                  title="Minimizar panel de guía"
                >
                  _
                </button>
              </div>
            </div>

            {/* TÍTULO Y SUBTÍTULO DEL EXPEDIENTE */}
            <div className="space-y-0.5">
              <h4 className="text-xs font-black text-white uppercase tracking-tight">
                {ui_guia.titulo_mision}
              </h4>
              <p className="text-[11px] text-zinc-400 font-sans leading-tight">
                {ui_guia.subtitulo_mision}
              </p>
            </div>

            {/* CHECKLIST DE OBJETIVOS INTERACTIVOS */}
            <div className="space-y-1.5 pt-1">
              {objetivos.map((obj) => {
                const yaExaminado = itemsInspeccionados.has(obj.id);
                return (
                  <button
                    key={obj.id}
                    onClick={() => onSeleccionarObjetivo && onSeleccionarObjetivo(obj.id)}
                    className={`w-full text-left p-1.5 border transition-all flex items-start gap-2 cursor-pointer ${
                      yaExaminado
                        ? "bg-[#0d1f12]/80 border-[#22c55e]/50 text-zinc-300"
                        : "bg-black/60 hover:bg-zinc-900 border-zinc-800 hover:border-[#22c55e]/60 text-zinc-400 hover:text-white"
                    }`}
                  >
                    <span
                      className={`font-black text-xs shrink-0 mt-0.5 ${
                        yaExaminado ? "text-[#22c55e]" : "text-zinc-600"
                      }`}
                    >
                      {yaExaminado ? "[✓]" : "[ ]"}
                    </span>
                    <div className="flex-1 truncate">
                      <div className="text-[11px] font-bold uppercase tracking-wider flex items-center justify-between">
                        <span className={yaExaminado ? "text-white" : ""}>{obj.label}</span>
                        <span className="text-[9px] text-zinc-500 font-mono">[{obj.tecla}]</span>
                      </div>
                      <div className="text-[9px] text-zinc-400 font-sans truncate">
                        {obj.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* NOTIFICACIÓN DE COMPLETADO O ATAJOS */}
            {todoCompletado ? (
              <div className="p-1.5 bg-[#22c55e] text-black text-center text-[10px] font-black uppercase tracking-widest shadow-[2px_2px_0px_#fff]">
                {ui_guia.completado || "¡TODAS LAS EVIDENCIAS EXAMINADAS!"}
              </div>
            ) : (
              <div className="text-[9px] text-zinc-500 font-mono border-t border-zinc-800 pt-1.5">
                {ui_guia.atajos_teclado}
              </div>
            )}
          </motion.div>
        )}
    </div>
  );
}
