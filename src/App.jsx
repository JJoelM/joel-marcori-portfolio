import { useState, useEffect, lazy, Suspense } from "react";
import { VistaPlana } from "./components/flat/PlainView";
import { useTranslation } from "react-i18next";
import "./i18n";
import LanguageSelector from "./components/ui/LanguageSelector";
const Entorno3D = lazy(() => import("./components/3d/Entorno3d"));

export default function App() {
  const [modoApp, setModoApp] = useState("LANDING"); 
  const { t, i18n } = useTranslation();
  const ui_global = t("ui_global", { returnObjects: true });

  useEffect(() => {
    document.documentElement.lang = i18n.language.split("-")[0];
  }, [i18n.language]);

  return (
    <div className="w-screen h-screen bg-black overflow-hidden font-mono text-green-400">
      <div className="absolute top-6 right-6 z-[100]">
        <LanguageSelector />
      </div>
      {modoApp === "LANDING" && (
        <div className="w-full h-full flex flex-col items-center justify-center relative z-50">
          <h1 className="text-4xl md:text-6xl mb-4 text-center">
            Joel Jesus Marcori
          </h1>
          <p className="text-sm md:text-base mb-8 opacity-80">
            Software Engineer, Technical Artist & Tools Programmer
          </p>

          <div className="flex gap-4">
            <button
              onClick={() => setModoApp("PLANO")}
              className="border border-green-500 px-6 py-3 hover:bg-green-900 transition-colors"
            >
              {ui_global.boton_modo_plano}
            </button>
            <button
              onClick={() => setModoApp("3D")}
              className="border border-green-500 px-6 py-3 hover:bg-green-900 transition-colors"
            >
              {ui_global.boton_modo_3d}
            </button>
          </div>
        </div>
      )}

      {modoApp === "PLANO" && (
        <div className="w-full h-full overflow-y-auto relative">
          <button
            onClick={() => setModoApp("LANDING")}
            className="absolute top-4 left-4 z-50 bg-gray-900 border border-green-500 px-4 py-2 hover:bg-green-900 transition-colors text-xs"
          >
            {ui_global.boton_volver}
          </button>
          <VistaPlana />
        </div>
      )}

      {modoApp === "3D" && (
        <div className="w-full h-full relative">
          <button
            onClick={() => setModoApp("PLANO")}
            className="absolute top-4 left-4 z-50 bg-gray-900 border border-green-500 px-4 py-2 hover:bg-green-900 transition-colors text-xs"
          >
            {ui_global.boton_modo_plano}
          </button>

          {/* Suspense atrapa la carga mientras se descarga el archivo 3D de la red */}
          <Suspense
            fallback={
              <div className="w-full h-full flex items-center justify-center">
                <span className="animate-pulse">{ui_global.cargando}</span>
              </div>
            }
          >
            <Entorno3D setModoApp={setModoApp} />
          </Suspense>
        </div>
      )}
    </div>
  );
}