import { Outlines, useCursor, Html } from "@react-three/drei";
import React, { useState } from "react";

/**
 * ObjetoInteractivo:
 * Malla 3D enriquecida con soporte para:
 * - Modo Visión Detective (outlines constantes sutiles para invitar a la exploración).
 * - Feedback táctil con cursor reactivo y realce en blanco puro al hacer hover.
 * - Tooltip 3D contextual renderizado mediante Drei Html.
 */
export default function ObjetoInteractivo({
  geometry,
  material,
  onClick,
  children,
  mostrarOutline = true,
  outlineColor = "#22c55e",
  label,
  tooltipText,
  badgePosition = [0, 0.25, 0],
}) {
  const [hovered, setHovered] = useState(false);

  useCursor(hovered);

  return (
    <mesh
      geometry={geometry}
      {...(material ? { material } : {})}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
      }}
      onClick={onClick}
    >
      {children}

      {/* OUTLINES: Blanco nítido en hover, color táctico en Visión Detective */}
      {hovered ? (
        <Outlines thickness={1.8} color="#ffffff" />
      ) : mostrarOutline ? (
        <Outlines thickness={1.1} color={outlineColor} />
      ) : null}

      {/* BADGE TÁCTICO FLOTANTE EN HOVER */}
      {hovered && label && (
        <Html
          position={badgePosition}
          center
          pointerEvents="none"
        >
          <div className="bg-[#090b0e]/95 border border-[#22c55e] px-2.5 py-1 text-center font-mono shadow-[3px_3px_0px_#000] select-none pointer-events-none transform -translate-y-2">
            <div className="text-[10px] font-black text-white uppercase tracking-wider flex items-center gap-1 justify-center">
              <span className="w-1.5 h-1.5 bg-[#22c55e] inline-block animate-pulse" />
              <span>{label}</span>
            </div>
            {tooltipText && (
              <div className="text-[8px] text-[#4ade80] font-mono tracking-tight mt-0.5">
                {tooltipText}
              </div>
            )}
          </div>
        </Html>
      )}
    </mesh>
  );
}
