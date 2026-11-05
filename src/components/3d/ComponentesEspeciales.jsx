import { useRef, useLayoutEffect, useMemo } from "react";
import * as THREE from "three";
import { useHelper } from "@react-three/drei";

// --- LUZ CON HELPER  ---

export function LuzDetective({ debug, ...props }) {
  const lightRef = useRef();
  useHelper(debug ? lightRef : null, THREE.SpotLightHelper, "cyan");
  return <spotLight ref={lightRef} {...props} />;
}

// --- SHADER VOLUMÉTRICO OPTIMIZADO ---

export function RayoVolumetrico({
  debug,
  position,
  target = [0, 0, 0],
  radioPunta = 0.1,
  radioBase = 1.5,
  altura = 3,
  color = "#8da3d4",
  opacity = 0.08,
}) {
  const groupRef = useRef();

  // El grupo apunta al objetivo vectorial
  useLayoutEffect(() => {
    if (groupRef.current) {
      groupRef.current.lookAt(new THREE.Vector3(...target));
    }
  }, [target]);

  // Uniforms GPU estables
  const uniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: opacity },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Actualización reactiva sin recrear el material
  useLayoutEffect(() => {
    uniforms.uColor.value.set(color);
    uniforms.uOpacity.value = opacity;
  }, [color, opacity, uniforms]);

  return (
    <group ref={groupRef} position={position}>
      {debug && <axesHelper args={[2]} />}

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, altura / 2]}>
        {/* Optimización de geometría: 18 segmentos radiales en lugar de 32 (ahorro del 44% de vértices) */}
        <cylinderGeometry args={[radioPunta, radioBase, altura, 18, 1, true]} />

        <shaderMaterial
          transparent={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          uniforms={uniforms}
          vertexShader={`
            varying vec3 vNormal;
            varying vec3 vPosition;
            varying vec2 vUv;

            void main() {
              vUv = uv;
              vNormal = normalMatrix * normal;
              vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
              vPosition = mvPosition.xyz;
              gl_Position = projectionMatrix * mvPosition;
            }
          `}
          fragmentShader={`
            precision mediump float;

            varying vec3 vNormal;
            varying vec3 vPosition;
            varying vec2 vUv;
            uniform vec3 uColor;
            uniform float uOpacity;

            void main() {
              vec3 viewDir = normalize(-vPosition);
              vec3 normal = normalize(vNormal);
              float fresnel = abs(dot(viewDir, normal));

              // Optimización matemática: sustitución de pow(fresnel, 2.5) por operaciones ALU directas
              float fresnel2 = fresnel * fresnel;
              float fresnelOpt = fresnel2 * sqrt(max(0.0, fresnel));

              float verticalFade = smoothstep(0.0, 0.7, vUv.y);
              float finalAlpha = fresnelOpt * verticalFade * uOpacity;

              gl_FragColor = vec4(uColor, finalAlpha);
            }
          `}
        />
      </mesh>
    </group>
  );
}
