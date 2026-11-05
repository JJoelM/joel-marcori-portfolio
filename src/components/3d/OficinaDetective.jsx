import React, {
  useMemo,
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  useCallback,
} from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF, useTexture } from "@react-three/drei";
import { easing } from "maath";
import * as THREE from "three";
import ObjetoInteractivo from "./ObjetoInteractivo";

export function OficinaDetective({
  setModoApp,
  vistaActual,
  setVistaActual,
  vistas,
  toggleDiaNoche,
  visionDetective = true,
  setVisionDetective,
  onItemInspected,
  musicaTrigger = 0,
}) {
  const { nodes, materials } = useGLTF("/models/OficinaDetective.glb");
  const texturaMonitor = useTexture("/images/plain_mode.png");

  // -----------------------------------------------
  // PUNTOS DE INTERÉS DE LA CÁMARA
  // -----------------------------------------------
  const puntosInteres = useMemo(
    () => ({
      [vistas.INGRESO || "INGRESO"]: {
        position: [-0.2, 1.5, 2],
        lookAt: [-0.2, 1, 0],
      },
      [vistas.INICIO]: {
        position: [-0.2, 1.5, 1.2],
        lookAt: [-0.2, 1, 0],
      },
      [vistas.CV]: {
        position: [-0.2, 1, 0.5],
        lookAt: [-0.2, -0.8, -0.5],
      },
      [vistas.PROYECTOS]: {
        position: [-0.75, 1.1, 0.4],
        lookAt: [-0.6, -1, -0.5],
      },
    }),
    [vistas]
  );

  // -----------------------------------------------
  // SONIDO AMBIENTAL & EFECTOS
  // -----------------------------------------------
  const clickSound = useMemo(() => new Audio("/sounds/click_sound.mp3"), []);
  const staticSound = useMemo(
    () => new Audio("/sounds/detective_band_music.mp3"),
    []
  );

  const [musicaSonando, setMusicaSonando] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = staticSound.cloneNode(true);
      audioRef.current.volume = 0.6;
      audioRef.current.loop = true;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [staticSound]);

  const manejarClickMusica = useCallback(
    (e) => {
      if (e && e.stopPropagation) e.stopPropagation();
      if (!audioRef.current) return;

      if (musicaSonando) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {});
      }
      setMusicaSonando((prev) => !prev);
    },
    [musicaSonando]
  );

  // Escuchar disparos externos (por ejemplo, desde la Guía Interactiva 3D)
  const prevTriggerRef = useRef(musicaTrigger);
  useEffect(() => {
    if (musicaTrigger > 0 && musicaTrigger !== prevTriggerRef.current) {
      prevTriggerRef.current = musicaTrigger;
      manejarClickMusica();
    }
  }, [musicaTrigger, manejarClickMusica]);

  // -----------------------------------------------
  // POSICIONAMIENTO Y ANIMACIÓN DE CÁMARA
  // -----------------------------------------------
  const targetLookAt = useRef(new THREE.Vector3(0, 1, 0));
  const { camera } = useThree();

  useLayoutEffect(() => {
    const inicio =
      puntosInteres[vistas.INGRESO] || puntosInteres[vistas.INICIO];
    camera.position.set(...inicio.position);
    targetLookAt.current.set(...inicio.lookAt);
    camera.lookAt(targetLookAt.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame((state, delta) => {
    const { position, lookAt } =
      puntosInteres[vistaActual] || puntosInteres[vistas.INICIO];
    easing.damp3(state.camera.position, position, 0.4, delta);
    easing.damp3(targetLookAt.current, lookAt, 0.4, delta);
    state.camera.lookAt(targetLookAt.current);
  });

  // -----------------------------------------------
  // ATAJOS DE TECLADO ESTILO VIDEOJUEGO
  // -----------------------------------------------
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignorar si el usuario está tipeando en un input
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

      const key = e.key.toLowerCase();
      if (key === "1") {
        if (onItemInspected) onItemInspected("MONITOR");
        setModoApp("PLANO");
      } else if (key === "2") {
        if (onItemInspected) onItemInspected("CV");
        setVistaActual(vistas.CV);
      } else if (key === "3") {
        if (onItemInspected) onItemInspected("PROYECTOS");
        setVistaActual(vistas.PROYECTOS);
      } else if (key === "l") {
        clickSound.currentTime = 0;
        clickSound.play().catch(() => {});
        if (onItemInspected) onItemInspected("LAMPARA");
        toggleDiaNoche();
      } else if (key === "m") {
        if (onItemInspected) onItemInspected("PARLANTE");
        manejarClickMusica();
      } else if (key === "v" && setVisionDetective) {
        setVisionDetective((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    clickSound,
    manejarClickMusica,
    onItemInspected,
    setModoApp,
    setVisionDetective,
    setVistaActual,
    toggleDiaNoche,
    vistas,
  ]);

  // -----------------------------------------------
  // IMAGEN DEL MONITOR
  // -----------------------------------------------
  texturaMonitor.colorSpace = THREE.SRGBColorSpace;
  texturaMonitor.flipY = false;

  return (
    <group dispose={null}>
      {/* MESA PRINCIPAL */}
      <mesh
        geometry={nodes.Mesa.geometry}
        material={materials["Material.1001"]}
        castShadow
        receiveShadow
      />

      {/* -----------------------------------------------
          MONITOR CRT (SWITCH A MODO PLANO)
          ----------------------------------------------- */}
      <ObjetoInteractivo
        geometry={nodes.Pantalla.geometry}
        mostrarOutline={visionDetective}
        outlineColor="#22c55e"
        label="MONITOR CRT"
        tooltipText="[► MODO PLANO TÁCTICO B2B]"
        onClick={(e) => {
          e.stopPropagation();
          if (onItemInspected) onItemInspected("MONITOR");
          setModoApp("PLANO");
        }}
      >
        <meshBasicMaterial
          attach="material"
          map={texturaMonitor}
          toneMapped={false}
          color={[2, 2, 2]}
        />
      </ObjetoInteractivo>

      {/* -----------------------------------------------
          EXPEDIENTE CENTRAL (CV)
          ----------------------------------------------- */}
      <ObjetoInteractivo
        geometry={nodes.ExpedienteCentral001.geometry}
        material={materials["Material.1001"]}
        mostrarOutline={visionDetective}
        outlineColor="#fbbf24"
        label="EXPEDIENTE CV"
        tooltipText="[► HOJA DE VIDA & HISTORIAL]"
        onClick={(e) => {
          e.stopPropagation();
          if (onItemInspected) onItemInspected("CV");
          setVistaActual(vistas.CV);
        }}
      />

      {/* -----------------------------------------------
          EXPEDIENTE PROYECTOS (CASOS DE ESTUDIO)
          ----------------------------------------------- */}
      <ObjetoInteractivo
        geometry={nodes.ExpedienteProyectos001.geometry}
        material={materials["Material.1001"]}
        mostrarOutline={visionDetective}
        outlineColor="#38bdf8"
        label="EXPEDIENTE PROYECTOS"
        tooltipText="[► CASOS DE ESTUDIO B2B]"
        onClick={(e) => {
          e.stopPropagation();
          if (onItemInspected) onItemInspected("PROYECTOS");
          setVistaActual(vistas.PROYECTOS);
        }}
      />

      {/* -----------------------------------------------
          LÁMPARA DE ESCRITORIO (DÍA / NOCHE)
          ----------------------------------------------- */}
      <ObjetoInteractivo
        geometry={nodes.Lamp.geometry}
        material={materials["Material.1001"]}
        mostrarOutline={visionDetective}
        outlineColor="#f59e0b"
        label="LÁMPARA NOIR"
        tooltipText="[► ALTERNAR DÍA / NOCHE]"
        onClick={(e) => {
          e.stopPropagation();
          clickSound.currentTime = 0;
          clickSound.play().catch(() => {});
          if (onItemInspected) onItemInspected("LAMPARA");
          toggleDiaNoche();
        }}
      />

      {/* -----------------------------------------------
          PARLANTE / RADIO VINTAGE (MÚSICA JAZZ NOIR)
          ----------------------------------------------- */}
      <ObjetoInteractivo
        geometry={nodes.Parlante.geometry}
        material={materials["Material.1001"]}
        mostrarOutline={visionDetective}
        outlineColor="#a855f7"
        label="RADIO VINTAGE"
        tooltipText="[► MÚSICA JAZZ NOIR]"
        onClick={(e) => {
          if (onItemInspected) onItemInspected("PARLANTE");
          manejarClickMusica(e);
        }}
      />
    </group>
  );
}

useGLTF.preload("/models/OficinaDetective.glb");
