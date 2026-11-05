import React from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext";

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const { esNoir } = useTheme();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const currentLng = i18n.language.split("-")[0] || "es";

  return (
    <div
      className={`flex border-2 bg-black p-0.5 shadow-[2px_2px_0px_#000] pointer-events-auto select-none transition-colors duration-300 ${
        esNoir ? "border-[#b45309]" : "border-[#22c55e]"
      }`}
    >
      <button
        onClick={() => changeLanguage("en")}
        aria-label="Switch language to English"
        className={`px-2.5 sm:px-3 py-1 font-mono text-xs font-bold transition-all cursor-pointer ${
          currentLng === "en"
            ? esNoir
              ? "bg-[#b45309] text-black font-black"
              : "bg-[#22c55e] text-black font-black"
            : esNoir
            ? "text-[#fde68a] hover:bg-[#2e1d13]"
            : "text-[#4ade80] hover:bg-[#142e1b]"
        }`}
      >
        EN
      </button>
      <div className="w-0.5 bg-zinc-800 mx-px" />
      <button
        onClick={() => changeLanguage("es")}
        aria-label="Cambiar idioma a Español"
        className={`px-2.5 sm:px-3 py-1 font-mono text-xs font-bold transition-all cursor-pointer ${
          currentLng === "es"
            ? esNoir
              ? "bg-[#b45309] text-black font-black"
              : "bg-[#22c55e] text-black font-black"
            : esNoir
            ? "text-[#fde68a] hover:bg-[#2e1d13]"
            : "text-[#4ade80] hover:bg-[#142e1b]"
        }`}
      >
        ES
      </button>
    </div>
  );
};

export default LanguageSelector;
