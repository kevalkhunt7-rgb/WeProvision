import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Starfield({ count = 1200 }) {
  const pointsRef = useRef();

  // Generate particle positions, colors, and random seeds
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const palette = [
      new THREE.Color('#F472B6'), // Soft Pink
      new THREE.Color('#C084FC'), // Lavender
      new THREE.Color('#A855F7'), // Electric Purple
      new THREE.Color('#542548'), // Deep Wine
      new THREE.Color('#FFFFFF')  // Pure White highlight
    ];

    for (let i = 0; i < count; i++) {
      const radius = 10 + Math.random() * 25;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      const color = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }

    return [pos, col];
  }, [count]);

  // Floating continuous rotation
  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.03;
      pointsRef.current.rotation.x += delta * 0.015;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        vertexColors
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default function Atmosphere() {
  const lightRef = useRef();

  useFrame((state) => {
    if (lightRef.current) {
      const time = state.clock.getElapsedTime();
      lightRef.current.position.x = Math.sin(time * 0.5) * 6;
      lightRef.current.position.y = Math.cos(time * 0.3) * 4;
    }
  });

  return (
    <>
      {/* Sci-Fi Scene Fog with exact color #170F25 */}
      <fog attach="fog" args={['#170F25', 8, 28]} />

      {/* Background Color */}
      <color attach="background" args={['#170F25']} />

      {/* Ambient & Cinematic Multi-Color Point Lights */}
      <ambientLight intensity={0.4} color="#30204A" />

      {/* Primary Key Light - Soft Pink (#F472B6) */}
      <pointLight
        position={[8, 8, 8]}
        intensity={2.5}
        color="#F472B6"
        distance={25}
        decay={2}
      />

      {/* Secondary Rim Light - Electric Purple (#A855F7) */}
      <pointLight
        position={[-8, -5, 5]}
        intensity={2.2}
        color="#A855F7"
        distance={25}
        decay={2}
      />

      {/* Deep Atmosphere Fill Light - Deep Wine (#542548) */}
      <pointLight
        position={[0, -8, -5]}
        intensity={3.0}
        color="#542548"
        distance={30}
        decay={1.8}
      />

      {/* Floating Dynamic Accent Light */}
      <pointLight
        ref={lightRef}
        position={[0, 5, 3]}
        intensity={1.8}
        color="#C084FC"
        distance={20}
        decay={2}
      />

      {/* GPU Particle Starfield */}
      <Starfield count={1500} />
    </>
  );
}
