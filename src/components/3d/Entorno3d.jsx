import { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { AnimatePresence } from "framer-motion";
import { Sparkles, Loader } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { OficinaDetective } from "./OficinaDetective";
import { PanelNavegacion } from "../ui/PanelNavegacion";
import { ExpedienteCV } from "../ui/ExpedienteCV";
import { ExpedienteProyectos } from "../ui/ExpedientesProyectos";
import { LuzDetective, RayoVolumetrico } from "./ComponentesEspeciales";

const VISTAS = {
  INICIO: "INICIO",
  CV: "CV",
  PROYECTOS: "PROYECTOS",
};

export default function Entorno3D({ setModoApp }) {
  const DEBUG_MODE = false;
  const [vistaActual, setVistaActual] = useState(VISTAS.INICIO);
  const [esDeDia, setEsDeDia] = useState(false);

  return (
    <div className="w-full h-full relative flex">
      <div className="flex-grow h-full bg-[#030305]">
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
                shadow-mapSize={[1024, 1024]}
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

          {/* ---- FOCO TABLERO ---- */}
          <LuzDetective
            debug={DEBUG_MODE}
            position={[0, 3.15, -2.4]}
            angle={1.5}
            penumbra={esDeDia ? 0.9 : 0.5}
            intensity={esDeDia ? 20 : 10}
            color={esDeDia ? "#ffe8b5" : "#ffd48a"}
            distance={4}
            castShadow
            shadow-bias={-0.0006}
            shadow-normalBias={0.06}
            shadow-mapSize={[1024, 1024]}
          >
            <object3D
              attach="target"
              position={esDeDia ? [-0.2, 0, 0.8] : [0, 0, -3]}
            />
          </LuzDetective>

          {/* --------------------------------------------------------
              PARTÍCULAS Y POST-PROCESADO
              -------------------------------------------------------- */}
          <Sparkles
            count={150}
            scale={4}
            size={1.5}
            speed={0.2}
            opacity={0.05}
            color={esDeDia ? "#fffae6" : "#ffd48a"}
            position={[0, 1.5, 0]}
          />

          {!esDeDia && (
            <Sparkles
              count={30}
              scale={[1.2, 1.5, 1.2]} // Confinado al área del escritorio
              size={1}
              speed={0.1} // Flota suavemente
              opacity={0.15}
              color="#ffc87f" // Tono que coincide con la bombilla
              position={[-0.8, 1.4, 0.3]} // Centrado en la luz de la lámpara
            />
          )}

          {/* Polvo en el rayo de la ventana */}
          <Sparkles
            count={esDeDia ? 300 : 100}
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
                luminanceThreshold={0.2}
                luminanceSmoothing={0.9}
                intensity={esDeDia ? 0.15 : 0.3}
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
            />
          </Suspense>
        </Canvas>
        <Loader />
      </div>

      {/* --------------------------------------------------------
          INTERFAZ DE USUARIO
          -------------------------------------------------------- */}
      <PanelNavegacion
        vistaActual={vistaActual}
        setVistaActual={setVistaActual}
        vistas={VISTAS}
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
