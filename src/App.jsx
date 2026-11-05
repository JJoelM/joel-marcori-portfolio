import { useState, useEffect, lazy, Suspense } from "react";
import { VistaPlana } from "./components/flat/PlainView";
import { LandingView } from "./components/landing/LandingView";
import { CommsDeckModal } from "./components/ui/CommsDeckModal";
import { EasterEggModal } from "./components/ui/EasterEggModal";
import { useTranslation } from "react-i18next";
import "./i18n";
import LanguageSelector from "./components/ui/LanguageSelector";
import { usePerformanceGuard } from "./hooks/usePerformanceGuard";
import { ThemeProvider, useTheme } from "./context/ThemeContext";

const Entorno3D = lazy(() => import("./components/3d/Entorno3d"));

function AppContent() {
  const [modoApp, setModoApp] = useState("LANDING");
  const [isContactOpen, setIsContactOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const ui_global = t("ui_global", { returnObjects: true }) || {};
  const ui_landing = t("ui_landing", { returnObjects: true }) || {};
  const ui_contacto = t("ui_contacto", { returnObjects: true }) || {};
  const ui_easter = t("ui_easter_egg", { returnObjects: true }) || {};

  const { esNoir, easterEggDesbloqueado, toggleTema } = useTheme();

  const {
    tier,
    fps,
    webglSupported,
    fallbackTriggered,
    fallbackReason,
    dismissFallbackNotice,
  } = usePerformanceGuard({
    initialMode: "3D",
    fpsThreshold: 25,
    consecutiveLowFramesLimit: 60,
    enableWatchdog: true,
  });

  useEffect(() => {
    if (i18n.language) {
      document.documentElement.lang = i18n.language.split("-")[0];
    }
  }, [i18n.language]);

  // Si se dispara el fallback automático por caída de FPS sostenida o fallo de WebGL
  const modoActivo = fallbackTriggered && modoApp === "3D" ? "PLANO" : modoApp;

  const handleDismissFallback = () => {
    setModoApp("PLANO");
    dismissFallbackNotice();
  };

  const intentarModo3D = () => {
    if (!webglSupported) {
      alert("WebGL no está disponible en este dispositivo. Se abrirá el Modo Plano optimizado.");
      setModoApp("PLANO");
      return;
    }
    setModoApp("3D");
  };

  return (
    <div
      className={`w-screen h-screen bg-black overflow-hidden font-mono relative transition-colors duration-500 ${
        esNoir ? "text-[#fde68a]" : "text-green-400"
      }`}
    >
      {/* SELECTOR DE IDIOMA GLOBAL */}
      <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-[150]">
        <LanguageSelector />
      </div>

      {/* =========================================================
          HUD SWITCH FLOTANTE SIEMPRE VISIBLE & TELEMETRÍA EN VIVO
          ========================================================= */}
      <nav
        aria-label="Controles Rápidos HUD"
        className="absolute top-3 sm:top-4 left-3 sm:left-4 z-[140] max-w-[calc(100vw-7.5rem)] sm:max-w-none flex flex-wrap items-center gap-1.5 sm:gap-2 pointer-events-auto"
      >
        {/* BOTÓN VOLVER A INICIO (SI NO ESTÁ EN LANDING) */}
        {modoActivo !== "LANDING" && (
          <button
            onClick={() => setModoApp("LANDING")}
            className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-black/85 hover:bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-colors shadow-[2px_2px_0px_#000] cursor-pointer"
            title={ui_landing.hud_tooltip}
            aria-label={ui_landing.hud_switch_inicio || "Volver al inicio"}
          >
            {ui_landing.hud_switch_inicio || "[⌂ INICIO]"}
          </button>
        )}

        {/* SWITCH DIRECTO ENTRE MODO 3D Y MODO PLANO */}
        {modoActivo === "3D" && (
          <button
            onClick={() => setModoApp("PLANO")}
            className={`px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all shadow-[2px_2px_0px_#000] cursor-pointer border ${
              esNoir
                ? "bg-[#2b1b11] hover:bg-[#b45309] hover:text-black border-[#b45309] text-[#fde68a]"
                : "bg-[#142e1b] hover:bg-[#22c55e] hover:text-black border-[#22c55e] text-[#4ade80]"
            }`}
            title={ui_landing.hud_tooltip}
            aria-label={ui_landing.hud_switch_plano || "Cambiar a Modo Plano"}
          >
            {ui_landing.hud_switch_plano || "[◧ MODO PLANO]"}
          </button>
        )}

        {modoActivo === "PLANO" && (
          <button
            onClick={intentarModo3D}
            className={`px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all shadow-[2px_2px_0px_#000] cursor-pointer border ${
              esNoir
                ? "bg-[#2b1b11] hover:bg-[#b45309] hover:text-black border-[#b45309] text-[#fde68a]"
                : "bg-[#142e1b] hover:bg-[#22c55e] hover:text-black border-[#22c55e] text-[#4ade80]"
            }`}
            title={ui_landing.hud_tooltip}
            aria-label={ui_landing.hud_switch_3d || "Cambiar a Modo 3D"}
          >
            {ui_landing.hud_switch_3d || "[◰ MODO 3D]"}
          </button>
        )}

        {/* BOTÓN CONTACTO RÁPIDO (VISIBLE EN HUD EN DESKTOP; EN MÓVIL DISPONIBLE DENTRO DE EXPEDIENTES / MODO PLANO) */}
        <button
          onClick={() => setIsContactOpen(true)}
          className={`hidden sm:inline-block px-2.5 sm:px-3 py-1 sm:py-1.5 bg-black/85 text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-colors shadow-[2px_2px_0px_#000] cursor-pointer border ${
            esNoir
              ? "hover:bg-[#b45309] hover:text-black border-[#b45309]/70 text-[#fde68a]"
              : "hover:bg-[#22c55e] hover:text-black border-[#22c55e]/70 text-[#4ade80]"
          }`}
          title={ui_contacto.titulo || "Contacto Rápido"}
          aria-label={ui_contacto.titulo || "Contacto Rápido"}
        >
          {ui_global.btn_contacto || "[ CONTACTAR ]"}
        </button>

        {/* TOGGLE GLOBAL DE TEMA SI SE DESBLOQUEÓ EL EASTER EGG (EN DESKTOP) */}
        {easterEggDesbloqueado && (
          <button
            onClick={toggleTema}
            className={`hidden sm:inline-block px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all shadow-[2px_2px_0px_#000] cursor-pointer border ${
              esNoir
                ? "bg-[#321c10] hover:bg-[#433022] border-[#bc6c25] text-[#fed7aa]"
                : "bg-[#0a2312] hover:bg-[#144222] border-[#22c55e] text-[#86efac]"
            }`}
            title="Alternar entre temas globales"
            aria-label="Alternar entre temas globales"
          >
            {esNoir ? ui_easter.btn_toggle_cyber : ui_easter.btn_toggle_noir}
          </button>
        )}

        {/* MONITOR DE FPS EN VIVO & TIER DE GPU (SOLO VISIBLE EN DESARROLLO LOCAL) */}
        {import.meta.env.DEV && modoActivo === "3D" && (
          <div
            className="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-black/80 border border-zinc-800 text-[11px] font-mono text-zinc-400 select-none shadow-[2px_2px_0px_#000]"
            title="Detección de rendimiento activo (Solo Entorno Dev)"
          >
            <span className="text-zinc-500">FPS:</span>
            <span
              className={`font-bold ${
                fps >= 50
                  ? "text-emerald-400"
                  : fps >= 25
                  ? "text-amber-400"
                  : "text-rose-400"
              }`}
            >
              {fps}
            </span>
            <span className="text-zinc-600">|</span>
            <span className="text-zinc-500">TIER:</span>
            <span className={esNoir ? "text-amber-400 font-bold" : "text-emerald-400 font-bold"}>
              {tier}
            </span>
          </div>
        )}
      </nav>

      {/* =========================================================
          BANNER DE FALLBACK CUANDO SE DISPARA POR BAJO RENDIMIENTO
          ========================================================= */}
      {fallbackTriggered && (
        <div
          role="alert"
          className={`absolute top-16 left-1/2 -translate-x-1/2 z-[110] max-w-lg w-[90%] bg-zinc-950 border-2 p-3 shadow-[4px_4px_0px_#000] flex items-center justify-between gap-3 text-xs text-white ${
            esNoir ? "border-[#b45309]" : "border-[#22c55e]"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className={esNoir ? "text-[#f59e0b] font-bold text-sm" : "text-[#22c55e] font-bold text-sm"}>
              [!]
            </span>
            <span>
              <strong>[PERF_WATCHDOG]:</strong>{" "}
              {fallbackReason || "Rendimiento reducido detectado. Modo plano activado."}
            </span>
          </div>
          <button
            onClick={handleDismissFallback}
            className="px-2 py-1 bg-black border border-zinc-600 hover:border-white text-zinc-300 text-[10px] font-bold uppercase transition-colors cursor-pointer"
          >
            [ OK ]
          </button>
        </div>
      )}

      {/* =========================================================
          PANTALLA DE INICIO CON CRT OJO DE PEZ & DUALIDAD NOIR / CYBER
          ========================================================= */}
      {modoActivo === "LANDING" && (
        <LandingView
          onStart3D={intentarModo3D}
          onStartPlano={() => setModoApp("PLANO")}
          tier={tier}
          webglSupported={webglSupported}
        />
      )}

      {/* =========================================================
          MODO PLANO TÁCTICO // CASOS B2B & TECHNICAL ART
          ========================================================= */}
      {modoActivo === "PLANO" && (
        <div id="modo-plano-container" className="w-full h-full overflow-y-auto relative pt-12 sm:pt-0">
          <VistaPlana
            onSwitchTo3D={intentarModo3D}
            setModoApp={setModoApp}
            onOpenContact={() => setIsContactOpen(true)}
          />
        </div>
      )}

      {/* =========================================================
          MODO 3D INMERSIVO (ESCENA ORIGINAL RESTAURADA Y OPTIMIZADA)
          ========================================================= */}
      {modoActivo === "3D" && (
        <div className="w-full h-full relative">
          <Suspense
            fallback={
              <div className="w-full h-full flex items-center justify-center bg-[#030305]">
                <span className="animate-pulse">{ui_global.cargando}</span>
              </div>
            }
          >
            <Entorno3D
              setModoApp={setModoApp}
              onOpenContact={() => setIsContactOpen(true)}
            />
          </Suspense>
        </div>
      )}

      {/* MODAL UNIVERSAL DE CONTACTO RÁPIDO // COMMS DECK */}
      <CommsDeckModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      {/* MODAL EASTER EGG // ARCHIVO SECRETO NOIR DESBLOQUEADO */}
      <EasterEggModal />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
