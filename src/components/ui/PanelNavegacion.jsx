import { useTranslation } from "react-i18next";

export function PanelNavegacion({ vistaActual, setVistaActual, vistas }) {
  const { t } = useTranslation();  
  const ui_global = t("ui_global", { returnObjects: true });

  return (
    <div className="w-80 h-full bg-gray-950 border-l border-green-500 p-6 flex flex-col z-10">
      <h2 className="text-xl mb-12 border-b border-green-700 pb-2">
        {ui_global.expedientes}
      </h2>

      <nav className="flex flex-col gap-4">
        {[
          { key: vistas.CV, label: ui_global.expediente_cv },
          {
            key: vistas.PROYECTOS,
            label: ui_global.expediente_proyectos,
          },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setVistaActual(item.key)}
            className={`text-left p-3 transition-colors ${
              vistaActual === item.key
                ? "bg-green-900 text-white"
                : "hover:text-white hover:bg-green-950"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
