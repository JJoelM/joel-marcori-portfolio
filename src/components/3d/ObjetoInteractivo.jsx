import {
Outlines,
useCursor
} from "@react-three/drei";
import React, { useState } from "react";

export default function ObjetoInteractivo({
  geometry,
  material,
  onClick,
  children,
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
      {/* Todo se renderiza acá */}
      {children}
      {hovered && <Outlines thickness={1} color="white" />}
    </mesh>
  );
}
