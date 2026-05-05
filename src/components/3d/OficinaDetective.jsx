import React, {
  useMemo,
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
} from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { easing } from "maath";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import ObjetoInteractivo from "./ObjetoInteractivo";

export function OficinaDetective({
  setModoApp,
  vistaActual,
  setVistaActual,
  vistas,
  toggleDiaNoche,
}) {
  const { nodes, materials } = useGLTF("/models/OficinaDetective.glb");
  const texturaMonitor = useTexture("/images/plain_mode.png");
  // -----------------------------------------------
  // SONIDO
  // -----------------------------------------------
  const clickSound = useMemo(() => new Audio("/sounds/click_sound.mp3"), []);
  const staticSound = useMemo(
    () => new Audio("/sounds/detective_band_music.mp3"),
    [],
  );

  const [musicaSonando, setMusicaSonando] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    // Clona el audio solo la primera vez y lo guarda
    if (!audioRef.current) {
      audioRef.current = staticSound.cloneNode(true);
      audioRef.current.volume = 0.6;
      audioRef.current.loop = true;
    }

    // Limpia el audio
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [staticSound]);

  // Función que maneja la lógica del clic
  const manejarClickMusica = (e) => {
    e.stopPropagation();
    if (!audioRef.current) return;

    if (musicaSonando) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setMusicaSonando(!musicaSonando);
  };

  // -----------------------------------------------
  // CÁMARA
  // -----------------------------------------------
  const targetLookAt = useRef(new THREE.Vector3(0, 1, 0));
  const { camera } = useThree();

  useLayoutEffect(() => {
    const inicio = puntosInteres[vistas.INGRESO];
    camera.position.set(...inicio.position);
    targetLookAt.current.set(...inicio.lookAt);
    camera.lookAt(targetLookAt.current);
  }, []);

  const puntosInteres = useMemo(
    () => ({
      [vistas.INGRESO]: {
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
    [vistas],
  );

  useFrame((state, delta) => {
    const { position, lookAt } =
      puntosInteres[vistaActual] || puntosInteres[vistas.INICIO];
    // Lerp
    easing.damp3(state.camera.position, position, 0.4, delta);
    // LookAt
    easing.damp3(targetLookAt.current, lookAt, 0.4, delta);

    state.camera.lookAt(targetLookAt.current);
  });

  // -----------------------------------------------
  // IMAGEN DEL MONITOR
  // -----------------------------------------------
  texturaMonitor.colorSpace = THREE.SRGBColorSpace;
  texturaMonitor.flipY = false;

  return (
    // Dispose={null} evita que React borre el modelo de la memoria si el componente se desmonta
    <group dispose={null}>
      <mesh
        geometry={nodes.Mesa.geometry}
        material={materials["Material.1001"]}
        castShadow
        receiveShadow
      ></mesh>

      {/* -----------------------------------------------
        MONITOR
        -----------------------------------------------
      */}
      <ObjetoInteractivo
        geometry={nodes.Pantalla.geometry}
        onClick={(e) => {
          e.stopPropagation();
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
        EXPEDIENTES
        -----------------------------------------------
      */}
      <ObjetoInteractivo
        geometry={nodes.ExpedienteCentral001.geometry}
        material={materials["Material.1001"]}
        onClick={(e) => {
          e.stopPropagation();
          setVistaActual(vistas.CV);
        }}
      ></ObjetoInteractivo>

      <ObjetoInteractivo
        geometry={nodes.ExpedienteProyectos001.geometry}
        material={materials["Material.1001"]}
        onClick={(e) => {
          e.stopPropagation();
          setVistaActual(vistas.PROYECTOS);
        }}
      ></ObjetoInteractivo>

      {/* -----------------------------------------------
        LÁMPARA
        -----------------------------------------------
      */}
      <ObjetoInteractivo
        geometry={nodes.Lamp.geometry}
        material={materials["Material.1001"]}
        onClick={(e) => {
          e.stopPropagation();
          clickSound.cloneNode(true).play();
          toggleDiaNoche();
        }}
      ></ObjetoInteractivo>

      {/* -----------------------------------------------
        PARLANTE
        -----------------------------------------------
      */}
      <ObjetoInteractivo
        geometry={nodes.Parlante.geometry}
        material={materials["Material.1001"]}
        onClick={manejarClickMusica}
      ></ObjetoInteractivo>
    </group>
  );
}
useGLTF.preload("/models/OficinaDetective.glb");
