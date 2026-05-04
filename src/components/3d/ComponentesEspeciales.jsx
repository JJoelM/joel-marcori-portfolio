import { useRef, useLayoutEffect, useMemo } from "react";
import * as THREE from "three";
import { useHelper } from "@react-three/drei";

// --- LUZ CON HELPER  ---

export function LuzDetective({ debug, ...props }) {
  const lightRef = useRef(); // Si debug es true, añade el helper de SpotLight (color cian)
  useHelper(debug ? lightRef : null, THREE.SpotLightHelper, "cyan");
  return <spotLight ref={lightRef} {...props} />;
}

// --- SHADER VOLUMÉTRICA  ---

export function RayoVolumetrico({
  debug,
  position,
  target = [0, 0, 0],
  radioPunta = 0.1,
  radioBase = 1.5,
  altura = 3,
  color,
  opacity,
}) {
  const groupRef = useRef();

  // El grupo mira al objetivo
  useLayoutEffect(() => {
    if (groupRef.current) {
      groupRef.current.lookAt(new THREE.Vector3(...target));
    }
  }, [target]);

  // Crea el objeto de variables GPU una sola vez en la vida del componente
  const uniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: opacity },
    }),
    [] // El array vacío es para que no se vuelva a crear
  );

  // Se actualizan los valores cuando las props cambian
  useLayoutEffect(() => {
    uniforms.uColor.value.set(color);
    uniforms.uOpacity.value = opacity;
  }, [color, opacity, uniforms]);

  return (
    <group ref={groupRef} position={position}>
      {debug && <axesHelper args={[2]} />}

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, altura / 2]}>
        <cylinderGeometry args={[radioPunta, radioBase, altura, 32, 1, true]} />

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
              vNormal = normalize(normalMatrix * normal);
              vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
              vPosition = mvPosition.xyz;
              gl_Position = projectionMatrix * mvPosition;
            }
          `}
          fragmentShader={`
            varying vec3 vNormal;
            varying vec3 vPosition;
            varying vec2 vUv;
            uniform vec3 uColor;
            uniform float uOpacity;

            void main() {
              vec3 viewDir = normalize(-vPosition);
              float fresnel = abs(dot(viewDir, vNormal));
              fresnel = pow(fresnel, 2.5);

              float verticalFade = smoothstep(0.0, 0.7, vUv.y);
              float finalAlpha = fresnel * verticalFade * uOpacity;

              gl_FragColor = vec4(uColor, finalAlpha);
            }
          `}
        />
      </mesh>
    </group>
  );
}
