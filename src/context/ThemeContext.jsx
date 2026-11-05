/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  // El estilo inicial al cargar SIEMPRE es Cyber Fósforo
  const [tema, setTema] = useState("CYBER"); // 'CYBER' | 'NOIR'

  // Easter egg: estrictamente bloqueado al inicio. El botón de cambio de tema NO debe aparecer
  // hasta que el usuario lo desbloquee activamente en la sesión (mediante teclado o pie de página)
  const [easterEggDesbloqueado, setEasterEggDesbloqueado] = useState(false);

  const [modalEasterEggAbierto, setModalEasterEggAbierto] = useState(false);

  const esNoir = tema === "NOIR";

  // Limpiar cualquier residuo previo de localStorage para evitar que aparezca desbloqueado por error
  useEffect(() => {
    try {
      localStorage.removeItem("portfolio_easteregg_noir_unlocked");
      sessionStorage.removeItem("portfolio_easteregg_noir_unlocked");
    } catch {
      // Ignorar en entornos aislados
    }
  }, []);

  const desbloquearEasterEgg = useCallback(() => {
    setEasterEggDesbloqueado(true);
    setTema("NOIR");
    setModalEasterEggAbierto(true);
  }, []);

  const toggleTema = useCallback(() => {
    setTema((prev) => (prev === "NOIR" ? "CYBER" : "NOIR"));
  }, []);

  const cerrarModalEasterEgg = useCallback(() => {
    setModalEasterEggAbierto(false);
  }, []);

  // Listener global de teclado para detectar secuencias secretas ("noir", "1947", "p5")
  useEffect(() => {
    let keyBuffer = "";
    const SECRET_CODES = ["noir", "1947", "p5"];

    const handleKeyDown = (e) => {
      // Ignorar si el usuario está escribiendo en un input o textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.key && e.key.length === 1) {
        keyBuffer += e.key.toLowerCase();
        if (keyBuffer.length > 20) {
          keyBuffer = keyBuffer.slice(-20);
        }

        for (const code of SECRET_CODES) {
          if (keyBuffer.endsWith(code)) {
            desbloquearEasterEgg();
            keyBuffer = "";
            break;
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [desbloquearEasterEgg]);

  const value = {
    tema,
    esNoir,
    easterEggDesbloqueado,
    desbloquearEasterEgg,
    toggleTema,
    setTema,
    modalEasterEggAbierto,
    cerrarModalEasterEgg,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    // Fallback seguro para componentes renderizados fuera del Provider (ej. unit tests)
    return {
      tema: "CYBER",
      esNoir: false,
      easterEggDesbloqueado: false,
      desbloquearEasterEgg: () => {},
      toggleTema: () => {},
      setTema: () => {},
      modalEasterEggAbierto: false,
      cerrarModalEasterEgg: () => {},
    };
  }
  return context;
}
