import { useState, Suspense, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { AnimatePresence } from "framer-motion";
import { Sparkles, Loader } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { OficinaDetective } from "./OficinaDetective";
import { PanelNavegacion } from "../ui/PanelNavegacion";
import { ExpedienteCV } from "../ui/ExpedienteCV";
import { ExpedienteProyectos } from "../ui/ExpedientesProyectos";
import { LuzDetective, RayoVolumetrico } from "./ComponentesEspeciales";
import { GuiaInteractiva3D } from "./GuiaInteractiva3D";

const VISTAS = {
  INICIO: "INICIO",
  CV: "CV",
  PROYECTOS: "PROYECTOS",
};

export default function Entorno3D({ setModoApp, onOpenContact }) {
  const DEBUG_MODE = false;
  const [vistaActual, setVistaActual] = useState(VISTAS.INICIO);
  const [esDeDia, setEsDeDia] = useState(false);
  const [visionDetective, setVisionDetective] = useState(true);
  const [musicaTrigger, setMusicaTrigger] = useState(0);
  const [itemsInspeccionados, setItemsInspeccionados] = useState(() => new Set());

  const handleItemInspected = useCallback((itemId) => {
    setItemsInspeccionados((prev) => {
      const next = new Set(prev);
      next.add(itemId);
      return next;
    });
  }, []);

  const handleSeleccionarObjetivo = useCallback(
    (id) => {
      handleItemInspected(id);
      if (id === "MONITOR") {
        setModoApp("PLANO");
      } else if (id === "CV") {
        setVistaActual(VISTAS.CV);
      } else if (id === "PROYECTOS") {
        setVistaActual(VISTAS.PROYECTOS);
      } else if (id === "LAMPARA") {
        setEsDeDia((prev) => !prev);
      } else if (id === "PARLANTE") {
        setMusicaTrigger((prev) => prev + 1);
      }
    },
    [handleItemInspected, setModoApp]
  );

  return (
    <div className="w-full h-full relative flex flex-col md:flex-row overflow-hidden">
      <div className="flex-1 w-full h-full bg-[#030305] relative overflow-hidden">
        <Canvas
          shadows
          dpr={[1, 1.5]}
          camera={{
            near: 0.1,
            far: 10,
          }}
        >
          <ambientLight intensity={esDeDia ? 0.2 : 0.02} />
          <hemisphereLight
            skyColor={esDeDia ? "#ffa845" : "#2a3040"}
            groundColor={esDeDia ? "#ffeedd" : "#1a120b"}
            intensity={esDeDia ? 0.6 : 0.25}
          />

          <color attach="background" args={[esDeDia ? "#bfae99" : "#0a0b10"]} />

          <fogExp2
            attach="fog"
            color={esDeDia ? "#bfae99" : "#0a0b10"}
            density={esDeDia ? 0.08 : 0.1}
          />

          {/* ---- ILUMINACIÓN VENTANA ---- */}
          <LuzDetective
            debug={DEBUG_MODE}
            position={[6, 1.8, -1.5]}
            intensity={esDeDia ? 50 : 1.5}
            color={esDeDia ? "#ffa845" : "#8da3d4"}
            angle={0.5}
            penumbra={0.9}
            distance={8}
            castShadow
            shadow-bias={-0.0001}
            shadow-normalBias={0.02}
            shadow-mapSize={[1024, 1024]}
          >
            <object3D attach="target" position={[0, 0, -2]} />
          </LuzDetective>

          <RayoVolumetrico
            debug={DEBUG_MODE}
            position={[4, 1.8, -1.5]}
            target={[0, 0, -2]}
            radioPunta={0.4}
            radioBase={1}
            altura={6}
            color={esDeDia ? "#ffa845" : "#8da3d4"}
            opacity={esDeDia ? 0.2 : 0.08}
          />

          {/* ---- ILUMINACIÓN LÁMPARA ---- */}
          {!esDeDia && (
            <>
              <LuzDetective
                debug={DEBUG_MODE}
                position={[-0.9, 1.25, 0.11]}
                intensity={1.5}
                color="#ffa845"
                angle={0.65}
                penumbra={1}
                distance={4}
                castShadow
                shadow-bias={-0.0001}
                shadow-normalBias={0.02}
                shadow-mapSize={[512, 512]}
              >
                <object3D attach="target" position={[0.15, 0.1, 0.5]} />
              </LuzDetective>

              <pointLight
                position={[-0.9, 1.25, 0.11]}
                intensity={0.5}
                color="#ffa845"
                distance={1}
              />
            </>
          )}

          {/* Polvo en el rayo de la ventana (optimizado para balance visual y framerate) */}
          <Sparkles
            count={esDeDia ? 180 : 80}
            scale={[5, 3, 2]}
            size={1}
            speed={0.3}
            opacity={0.08}
            color={esDeDia ? "#fffae6" : "#a8bdeb"}
            position={[1, 1.8, -1.5]}
          />

          <Suspense fallback={null}>
            <EffectComposer multisampling={0}>
              <Bloom
                luminanceThreshold={0.25}
                luminanceSmoothing={0.8}
                intensity={esDeDia ? 0.15 : 0.3}
                mipmapBlur={true}
              />
              <Vignette
                eskil={false}
                offset={0.1}
                darkness={esDeDia ? 1 : 1.2}
              />
            </EffectComposer>

            <OficinaDetective
              setModoApp={setModoApp}
              vistaActual={vistaActual}
              setVistaActual={setVistaActual}
              vistas={VISTAS}
              toggleDiaNoche={() => setEsDeDia(!esDeDia)}
              visionDetective={visionDetective}
              setVisionDetective={setVisionDetective}
              onItemInspected={handleItemInspected}
              musicaTrigger={musicaTrigger}
            />
          </Suspense>
        </Canvas>
        <Loader />

        {/* --------------------------------------------------------
            GUÍA INTERACTIVA & TUTORIAL ESTILO VIDEOJUEGO (HUD 3D)
            -------------------------------------------------------- */}
        <GuiaInteractiva3D
          visionDetective={visionDetective}
          setVisionDetective={setVisionDetective}
          itemsInspeccionados={itemsInspeccionados}
          onSeleccionarObjetivo={handleSeleccionarObjetivo}
        />
      </div>

      {/* --------------------------------------------------------
          INTERFAZ DE USUARIO: PANEL DE NAVEGACIÓN
          -------------------------------------------------------- */}
      <PanelNavegacion
        vistaActual={vistaActual}
        setVistaActual={setVistaActual}
        vistas={VISTAS}
        onOpenContact={onOpenContact}
      />

      <AnimatePresence>
        {vistaActual === VISTAS.CV && (
          <ExpedienteCV
            isVisible={true}
            cerrarModal={() => setVistaActual(VISTAS.INICIO)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {vistaActual === VISTAS.PROYECTOS && (
          <ExpedienteProyectos
            isVisible={true}
            cerrarModal={() => setVistaActual(VISTAS.INICIO)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
