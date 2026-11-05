import { useState, useEffect, useRef, useCallback } from 'react';

function detectHardwareCapabilities() {
  if (typeof window === 'undefined') {
    return {
      webglSupported: true,
      tier: 'HIGH',
      fallbackTriggered: false,
      fallbackReason: null,
    };
  }

  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) {
      return {
        webglSupported: false,
        tier: 'FALLBACK',
        fallbackTriggered: true,
        fallbackReason: 'WebGL no soportado o deshabilitado en este navegador',
      };
    }
  } catch {
    return {
      webglSupported: false,
      tier: 'FALLBACK',
      fallbackTriggered: true,
      fallbackReason: 'Error al inicializar contexto gráfico WebGL',
    };
  }

  const cores = navigator.hardwareConcurrency || 4;
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

  let initialTier = 'HIGH';
  if (cores <= 2 || isMobile) {
    initialTier = 'MEDIUM';
  }

  return {
    webglSupported: true,
    tier: initialTier,
    fallbackTriggered: false,
    fallbackReason: null,
  };
}

/**
 * Hook para monitorizar el rendimiento en tiempo real y gestionar el fallback progresivo entre 3D y Modo Plano.
 * Detecta:
 * - Soporte de WebGL / WebGL2 en el render inicial
 * - Concurrencia de hardware (núcleos de CPU) y dispositivo móvil
 * - Caídas continuadas de FPS (< 25 FPS) durante la ejecución en 3D
 */
export function usePerformanceGuard(options = {}) {
  const {
    fpsThreshold = 25,
    consecutiveLowFramesLimit = 60,
    enableWatchdog = true,
    initialMode = '3D',
  } = options;

  const [hardware] = useState(() => detectHardwareCapabilities());
  const [mode, setMode] = useState(() => (hardware.webglSupported ? initialMode : 'FLAT'));
  const [tier, setTier] = useState(hardware.tier);
  const [fps, setFps] = useState(60);
  const [webglSupported] = useState(hardware.webglSupported);
  const [fallbackTriggered, setFallbackTriggered] = useState(hardware.fallbackTriggered);
  const [fallbackReason, setFallbackReason] = useState(hardware.fallbackReason);

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(0);
  const lowFpsCountRef = useRef(0);
  const animFrameIdRef = useRef(null);

  // Watchdog en tiempo real de FPS (solo corre cuando el modo es '3D')
  useEffect(() => {
    if (!enableWatchdog || mode !== '3D' || !webglSupported) {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      return;
    }

    let isSubscribed = true;
    lastTimeRef.current = performance.now();
    frameCountRef.current = 0;
    lowFpsCountRef.current = 0;

    const tick = (now) => {
      if (!isSubscribed) return;

      frameCountRef.current++;
      const delta = now - lastTimeRef.current;

      // Calcular FPS cada 500ms
      if (delta >= 500) {
        const currentFps = Math.round((frameCountRef.current * 1000) / delta);
        setFps(currentFps);

        if (currentFps < fpsThreshold) {
          lowFpsCountRef.current += 1;
          if (lowFpsCountRef.current >= Math.ceil(consecutiveLowFramesLimit / 30)) {
            setFallbackTriggered(true);
            setFallbackReason(
              `Rendimiento 3D inestable (< ${fpsThreshold} FPS). Activando modo optimizado.`
            );
            setTier('FALLBACK');
            setMode('FLAT');
            return;
          }
        } else {
          lowFpsCountRef.current = Math.max(0, lowFpsCountRef.current - 1);
        }

        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }

      animFrameIdRef.current = requestAnimationFrame(tick);
    };

    animFrameIdRef.current = requestAnimationFrame(tick);

    return () => {
      isSubscribed = false;
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [enableWatchdog, mode, fpsThreshold, consecutiveLowFramesLimit, webglSupported]);

  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === '3D' ? 'FLAT' : '3D'));
  }, []);

  const dismissFallbackNotice = useCallback(() => {
    setFallbackTriggered(false);
  }, []);

  return {
    mode,
    setMode,
    toggleMode,
    tier,
    fps,
    webglSupported,
    fallbackTriggered,
    fallbackReason,
    dismissFallbackNotice,
  };
}
