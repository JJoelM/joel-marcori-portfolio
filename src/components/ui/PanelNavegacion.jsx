import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext";

export function PanelNavegacion({ vistaActual, setVistaActual, vistas, onOpenContact }) {
  const { t } = useTranslation();
  const ui_global = t("ui_global", { returnObjects: true }) || {};
  const ui_easter = t("ui_easter_egg", { returnObjects: true }) || {};
  const { esNoir, easterEggDesbloqueado, toggleTema } = useTheme();
  const [drawerAbiertoMobile, setDrawerAbiertoMobile] = useState(false);

  const items = [
    {
      key: vistas.CV,
      label: ui_global.expediente_cv,
      action: () => {
        setVistaActual(vistas.CV);
        setDrawerAbiertoMobile(false);
      },
    },
    {
      key: vistas.PROYECTOS,
      label: ui_global.expediente_proyectos,
      action: () => {
        setVistaActual(vistas.PROYECTOS);
        setDrawerAbiertoMobile(false);
      },
    },
    {
      key: "CONTACTO",
      label: ui_global.expediente_contacto || "[03] Despacho: Contacto Rápido",
      action: () => {
        if (onOpenContact) onOpenContact();
        setDrawerAbiertoMobile(false);
      },
    },
  ];

  return (
    <>
      {/* =========================================================
          BOTÓN FLOTANTE MÓVIL (< md):
          Ubicado en la misma fila superior (top-3), justo al lado del
          selector de idiomas (right-[5.25rem]), evitando cualquier amontonamiento.
          ========================================================= */}
      <button
        onClick={() => setDrawerAbiertoMobile(!drawerAbiertoMobile)}
        aria-expanded={drawerAbiertoMobile}
        aria-controls="drawer-expedientes"
        className={`md:hidden fixed top-3 right-[5.25rem] sm:right-24 z-[145] h-[30px] px-2.5 py-1 text-xs font-mono font-bold uppercase tracking-wider shadow-[2px_2px_0px_#000] flex items-center gap-1.5 cursor-pointer active:translate-y-0.5 border-2 transition-colors select-none pointer-events-auto ${
          esNoir
            ? "bg-[#1c120c] border-[#b45309] text-[#fde68a] hover:bg-[#2e1d13]"
            : "bg-[#090b0e] border-[#22c55e] text-[#4ade80] hover:bg-[#142e1b]"
        }`}
        aria-label="Abrir panel de expedientes"
      >
        <span className="font-mono text-sm leading-none">[=]</span>
        <span className="text-[10px] sm:text-xs font-black">{ui_global.expedientes}</span>
      </button>

      {/* =========================================================
          BACKDROP OSCURO EN MÓVIL (Z-[155]):
          ========================================================= */}
      {drawerAbiertoMobile && (
        <div
          className="md:hidden fixed inset-0 bg-black/80 z-[155] backdrop-blur-xs transition-opacity"
          onClick={() => setDrawerAbiertoMobile(false)}
          aria-hidden="true"
        />
      )}

      {/* =========================================================
          PANEL PRINCIPAL: DOCKED EN DESKTOP (MD:), SLIDE-OVER EN MÓVIL (Z-[160])
          ========================================================= */}
      <aside
        id="drawer-expedientes"
        className={`h-full max-h-screen p-4 lg:p-6 flex flex-col font-mono transition-transform duration-300 border-l-2 ${
          drawerAbiertoMobile
            ? "fixed right-0 top-0 bottom-0 w-72 sm:w-80 z-[160] translate-x-0 shadow-[-8px_0px_0px_#000]"
            : "fixed right-0 top-0 bottom-0 w-72 sm:w-80 z-[160] translate-x-full md:relative md:translate-x-0 md:z-20 md:w-72 lg:w-80"
        } ${
          esNoir
            ? "bg-[#120d09] border-[#b45309]/80 text-[#faedd9]"
            : "bg-[#07090c] border-[#22c55e]/70 text-zinc-200"
        }`}
      >
        {/* ENCABEZADO DEL DRAWER */}
        <div
          className={`flex items-center justify-between mb-5 lg:mb-8 border-b-2 pb-3 ${
            esNoir ? "border-[#b45309]/60 text-[#fde68a]" : "border-[#22c55e]/60 text-white"
          }`}
        >
          <h2 className="text-sm sm:text-base lg:text-lg font-black tracking-wider uppercase flex items-center gap-2 truncate">
            <span
              className={`w-2.5 h-2.5 inline-block shadow-[1px_1px_0px_#fff] ${
                esNoir ? "bg-[#d97706]" : "bg-[#22c55e]"
              }`}
            />
            <span className="truncate">{ui_global.expedientes}</span>
          </h2>

          {/* BOTÓN CERRAR EN MÓVIL */}
          <button
            onClick={() => setDrawerAbiertoMobile(false)}
            className={`md:hidden px-2.5 py-1 text-xs font-bold uppercase transition-colors border cursor-pointer active:translate-y-0.5 ${
              esNoir
                ? "bg-black text-[#fde68a] hover:bg-[#b45309] hover:text-black border-[#b45309]"
                : "bg-black text-zinc-300 hover:bg-[#22c55e] hover:text-black border-zinc-700 hover:border-[#22c55e]"
            }`}
            aria-label="Cerrar panel de expedientes"
          >
            [✕]
          </button>
        </div>

        {/* LISTADO DE ACCIONES / EXPEDIENTES */}
        <nav className="flex flex-col gap-2.5 lg:gap-3 flex-1 overflow-y-auto">
          {items.map((item) => (
            <button
              key={item.key}
              onClick={item.action}
              className={`text-left p-2.5 lg:p-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all border cursor-pointer active:translate-y-0.5 ${
                vistaActual === item.key
                  ? esNoir
                    ? "bg-[#2b1f16] text-[#fed7aa] border-[#b45309] shadow-[2px_2px_0px_#000]"
                    : "bg-[#142e1b] text-white border-[#22c55e] shadow-[2px_2px_0px_#000]"
                  : esNoir
                  ? "bg-black/60 text-[#faedd9]/80 hover:text-white hover:bg-[#20140c] border-[#57351c] hover:border-[#b45309]"
                  : "bg-black/60 text-zinc-400 hover:text-white hover:bg-zinc-900 border-zinc-800 hover:border-zinc-700"
              }`}
            >
              {item.label}
            </button>
          ))}

          {/* CONMUTADOR DE TEMA EN EL DRAWER: ÚNICAMENTE VISIBLE SI EL EASTER EGG FUE DESBLOQUEADO */}
          {easterEggDesbloqueado && (
            <button
              onClick={() => {
                toggleTema();
                setDrawerAbiertoMobile(false);
              }}
              className={`text-left p-2.5 lg:p-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all border cursor-pointer active:translate-y-0.5 mt-2 ${
                esNoir
                  ? "bg-[#25180f] text-[#fed7aa] border-[#b45309] hover:bg-[#382315]"
                  : "bg-[#0d2815] text-[#86efac] border-[#22c55e] hover:bg-[#163f22]"
              }`}
            >
              {esNoir ? "[04] " + (ui_easter.btn_toggle_cyber || "[ TEMA: CYBER ]") : "[04] " + (ui_easter.btn_toggle_noir || "[ TEMA: NOIR ]")}
            </button>
          )}
        </nav>
      </aside>
    </>
  );
}
