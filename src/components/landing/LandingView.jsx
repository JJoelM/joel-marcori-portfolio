import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

/**
 * LandingView (Pantalla Inicial Limpia, Concisa y Táctica con Efecto CRT Fisheye):
 * - Copy moderno, directo y sin saturación de texto (Hero de alto impacto).
 * - Estilo por defecto: Cyber Fósforo (Verde consola, terminal Pip-Boy / Hacker).
 * - Easter Egg Detective Noir sutil: accesible únicamente desde el pie de página o escribiendo 'noir' / '1947'.
 * - Cero emojis, tipografía militar / hacker retro y layout 100% responsive en cualquier dispositivo.
 * - 100% internacionalizado mediante JSON.
 */
export function LandingView({ onStart3D, onStartPlano, tier, webglSupported }) {
  const { t } = useTranslation();
  const ui_landing = t("ui_landing", { returnObjects: true }) || {};
  const ui_easter = t("ui_easter_egg", { returnObjects: true }) || {};

  const {
    esNoir,
    easterEggDesbloqueado,
    desbloquearEasterEgg,
    toggleTema,
  } = useTheme();

  return (
    <div className="w-full h-full min-h-full overflow-y-auto flex items-start sm:items-center justify-center p-3 sm:p-6 md:p-8 pt-16 sm:pt-20 pb-12 sm:pb-8 bg-black select-none">
      {/* =========================================================
          EFECTO CRT CONVEXO / OJO DE PEZ (BARREL DISTORTION)
          ========================================================= */}
      {/* 1. Sombra de curvatura de tubo y viñeta radial de lente esférica */}
      <div
        className="fixed inset-0 pointer-events-none z-30 shadow-[inset_0_0_120px_rgba(0,0,0,0.95),inset_0_0_40px_rgba(0,0,0,0.9)]"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, transparent 40%, rgba(0, 0, 0, 0.45) 70%, rgba(0, 0, 0, 0.88) 88%, rgba(0, 0, 0, 0.98) 100%)",
        }}
        aria-hidden="true"
      />

      {/* 2. Líneas de escaneo CRT analógicas perceptibles (3px pitch) */}
      <div
        className="fixed inset-0 pointer-events-none z-30 opacity-[0.10] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.85)_50%)] bg-[length:100%_3px]"
        aria-hidden="true"
      />

      {/* 3. Rejilla de apertura de fósforo / subpíxeles RGB (Aperture Grille CRT) */}
      <div
        className="fixed inset-0 pointer-events-none z-30 opacity-[0.045] bg-[linear-gradient(90deg,rgba(255,0,0,0.35),rgba(0,255,0,0.35)_50%,rgba(0,0,255,0.35))] bg-[length:3px_100%]"
        aria-hidden="true"
      />

      {/* 4. Haz de barrido catódico en bucle continuo de pantalla completa */}
      <div
        className={`fixed top-0 left-0 right-0 h-48 pointer-events-none z-30 animate-crt-scanline ${
          esNoir
            ? "bg-gradient-to-b from-transparent via-amber-400/[0.05] via-white/[0.07] to-transparent"
            : "bg-gradient-to-b from-transparent via-emerald-400/[0.06] via-white/[0.08] to-transparent"
        }`}
        aria-hidden="true"
      />

      {/* 5. Reflejo especular de cristal abombado (CRT glare) */}
      <div
        className="fixed -top-32 -left-32 w-96 h-96 rounded-full pointer-events-none z-30 opacity-[0.045] bg-gradient-to-br from-white to-transparent blur-2xl"
        aria-hidden="true"
      />

      {/* 6. Efecto de persianas venecianas en modo Noir */}
      {esNoir && (
        <div
          className="fixed inset-0 pointer-events-none z-20 opacity-[0.07] bg-[repeating-linear-gradient(180deg,transparent,transparent_20px,rgba(0,0,0,0.8)_20px,rgba(0,0,0,0.8)_40px)]"
          aria-hidden="true"
        />
      )}

      {/* =========================================================
          CHASIS DEL MONITOR CRT // ENTORNO HERO CONCISO
          ========================================================= */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className={`w-full max-w-3xl relative z-10 border-2 sm:border-4 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 my-auto transition-colors duration-500 overflow-hidden ${
          esNoir
            ? "bg-[#100d0a] border-[#8c6747] text-[#faedd9] shadow-[0_0_50px_rgba(180,83,9,0.18),inset_0_0_30px_rgba(0,0,0,0.9)]"
            : "bg-[#060e08] border-[#22c55e] text-[#4ade80] shadow-[0_0_50px_rgba(34,197,94,0.18),inset_0_0_30px_rgba(0,0,0,0.9)]"
        }`}
      >
        {/* =======================================================
            HEADER: ESTADO DEL SISTEMA (LIMPIO, SIN BOTONES GRANDES)
            ======================================================= */}
        <div className="flex items-center justify-between gap-3 border-b-2 pb-2.5 sm:pb-3 mb-4 sm:mb-5 transition-colors duration-500 border-current opacity-90">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full animate-pulse inline-block ${
                esNoir ? "bg-[#d97706]" : "bg-[#22c55e]"
              }`}
            />
            <span className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest">
              {esNoir ? ui_landing.badge_noir : ui_landing.badge_terminal}
            </span>
          </div>

          {/* SÓLO SE MUESTRA EL SWITCH DE TEMA SI FUE PREVIAMENTE DESBLOQUEADO */}
          {easterEggDesbloqueado && (
            <button
              onClick={toggleTema}
              className={`px-2 py-0.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all border cursor-pointer shadow-[2px_2px_0px_#000] active:translate-y-0.5 ${
                esNoir
                  ? "bg-[#2b1f16] hover:bg-[#433022] border-[#bc6c25] text-[#fed7aa]"
                  : "bg-[#0a2312] hover:bg-[#144222] border-[#22c55e] text-[#86efac]"
              }`}
              title={esNoir ? ui_landing.toggle_tema_cyber : ui_landing.toggle_tema_noir}
            >
              {esNoir ? ui_landing.toggle_tema_cyber : ui_landing.toggle_tema_noir}
            </button>
          )}
        </div>

        {/* =======================================================
            TÍTULO E IDENTIDAD HERO (PUNCHY, DIRECTO Y ELEGANTE)
            ======================================================= */}
        <div className="space-y-1.5 sm:space-y-2 mb-5 sm:mb-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span
              className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-wider inline-block ${
                esNoir
                  ? "bg-[#b45309] text-black shadow-[2px_2px_0px_#000]"
                  : "bg-[#22c55e] text-black shadow-[2px_2px_0px_#fff]"
              }`}
            >
              {ui_landing.titulo_intro}
            </span>

            {/* SELLO CONFIDENCIAL EN MODO NOIR */}
            {esNoir && (
              <span className="border border-[#dc2626] text-[#dc2626] font-black px-1.5 py-0.5 text-[9px] uppercase tracking-widest transform -rotate-2 opacity-90">
                {ui_landing.sello_confidencial}
              </span>
            )}
          </div>

          <h1
            className={`text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight leading-tight break-words ${
              esNoir ? "font-serif text-[#fef3c7]" : "font-mono text-white"
            }`}
          >
            Joel Jesús Marcori
          </h1>

          <p
            className={`text-xs sm:text-sm font-bold tracking-wide ${
              esNoir ? "text-[#fde68a]" : "text-[#86efac]"
            }`}
          >
            {ui_landing.subtitulo}
          </p>

          <p
            className={`text-xs sm:text-sm leading-relaxed font-sans opacity-85 pt-1 ${
              esNoir ? "text-[#fef3c7]/80" : "text-zinc-300"
            }`}
          >
            {ui_landing.intro_narrativa}
          </p>
        </div>

        {/* =======================================================
            SELECTOR DUAL DE ENTRADA (DOS MUNDOS, DIRECTO AL GRANO)
            ======================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 mb-5 sm:mb-6">
          {/* MUNDO 1: OFICINA 3D */}
          <motion.div
            whileHover={{ y: -2 }}
            className={`border-2 p-3.5 sm:p-4 flex flex-col justify-between transition-colors shadow-[3px_3px_0px_#000] ${
              esNoir
                ? "bg-[#1c1510] border-[#92400e] hover:border-[#f59e0b]"
                : "bg-[#09150c] border-[#166534] hover:border-[#22c55e]"
            }`}
          >
            <div className="space-y-1.5">
              <div className="text-[10px] font-bold uppercase tracking-wider opacity-75 border-b pb-1 border-current">
                {ui_landing.modo_3d_tag}
              </div>

              <h2
                className={`text-base sm:text-lg font-black uppercase tracking-tight ${
                  esNoir ? "font-serif text-[#fed7aa]" : "font-mono text-white"
                }`}
              >
                {ui_landing.modo_3d_titulo}
              </h2>

              <p className="text-xs font-sans leading-snug opacity-90">
                {ui_landing.modo_3d_desc}
              </p>
            </div>

            <button
              onClick={onStart3D}
              className={`mt-3.5 w-full py-2 px-3 font-black text-xs uppercase tracking-wider border-2 border-black transition-all cursor-pointer shadow-[2px_2px_0px_#000] active:translate-y-0.5 text-center ${
                esNoir
                  ? "bg-[#d97706] hover:bg-[#b45309] text-black hover:text-white"
                  : "bg-[#22c55e] hover:bg-[#16a34a] text-black hover:text-white"
              }`}
            >
              {ui_landing.btn_modo_3d}
            </button>
          </motion.div>

          {/* MUNDO 2: MODO PLANO */}
          <motion.div
            whileHover={{ y: -2 }}
            className={`border-2 p-3.5 sm:p-4 flex flex-col justify-between transition-colors shadow-[3px_3px_0px_#000] ${
              esNoir
                ? "bg-[#1c1510] border-[#92400e] hover:border-[#f59e0b]"
                : "bg-[#09150c] border-[#166534] hover:border-[#22c55e]"
            }`}
          >
            <div className="space-y-1.5">
              <div className="text-[10px] font-bold uppercase tracking-wider opacity-75 border-b pb-1 border-current">
                {ui_landing.modo_plano_tag}
              </div>

              <h2
                className={`text-base sm:text-lg font-black uppercase tracking-tight ${
                  esNoir ? "font-serif text-[#fed7aa]" : "font-mono text-white"
                }`}
              >
                {ui_landing.modo_plano_titulo}
              </h2>

              <p className="text-xs font-sans leading-snug opacity-90">
                {ui_landing.modo_plano_desc}
              </p>
            </div>

            <button
              onClick={onStartPlano}
              className={`mt-3.5 w-full py-2 px-3 font-black text-xs uppercase tracking-wider border-2 border-black transition-all cursor-pointer shadow-[2px_2px_0px_#000] active:translate-y-0.5 text-center ${
                esNoir
                  ? "bg-white hover:bg-[#fed7aa] text-black"
                  : "bg-white hover:bg-[#86efac] text-black"
              }`}
            >
              {ui_landing.btn_modo_plano}
            </button>
          </motion.div>
        </div>

        {/* =======================================================
            FOOTER: TELEMETRÍA Y EASTER EGG SUTIL EN PIE DE PÁGINA
            ======================================================= */}
        <div className="border-t-2 pt-2.5 sm:pt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[10px] sm:text-[11px] font-mono opacity-80 border-current">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <span>
              {ui_landing.telemetria_gpu}:{" "}
              <strong className={webglSupported ? "text-emerald-400" : "text-amber-400"}>
                {webglSupported ? "WEBGL2_OK" : "NO_ACCELERATION"}
              </strong>
            </span>
            <span>|</span>
            <span>
              TIER: <strong>{tier || "HIGH"}</strong>
            </span>
          </div>

          {/* EASTER EGG SUTIL EN PIE DE PÁGINA (Sin emojis, discreta revisión de compilación) */}
          <div className="flex items-center gap-2 text-[10px] opacity-70">
            <span>CRT LENS</span>
            <span>·</span>
            <button
              onClick={desbloquearEasterEgg}
              title={ui_easter.tooltip_pista}
              className="font-mono text-zinc-500 hover:text-amber-400 transition-colors cursor-pointer select-none border-b border-transparent hover:border-amber-400/50"
              aria-label="Technical build revision"
            >
              {ui_easter.pista_secreta || "SYS.REV // 1947"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
