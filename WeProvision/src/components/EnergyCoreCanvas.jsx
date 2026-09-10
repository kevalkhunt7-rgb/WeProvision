import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Float, ContactShadows, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// -----------------------------------------------------------
// 1. Electric Lightning / Current Arcs around the Core
// -----------------------------------------------------------
function ElectricCurrent({ radius = 1.6, count = 6 }) {
  const linesRef = useRef([]);

  const sparks = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      return {
        baseX: Math.cos(angle) * radius,
        baseZ: Math.sin(angle) * radius,
        offset: Math.random() * 10,
      };
    });
  }, [radius, count]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    linesRef.current.forEach((line, i) => {
      if (!line) return;
      // Electric flicker & pulse effect
      const flicker = Math.sin(t * 15 + sparks[i].offset);
      line.material.opacity = flicker > 0.3 ? 0.9 : 0.2;
      line.rotation.y = t * 0.8 + i;
    });
  });

  return (
    <group>
      {sparks.map((spark, i) => {
        const points = [
          new THREE.Vector3(spark.baseX, -1.2, spark.baseZ),
          new THREE.Vector3(spark.baseX * 1.3, 0 + Math.sin(i) * 0.3, spark.baseZ * 1.3),
          new THREE.Vector3(spark.baseX * 0.7, 0.8, spark.baseZ * 0.7),
          new THREE.Vector3(0, 1.8, 0),
        ];
        const curve = new THREE.CatmullRomCurve3(points);
        const geometry = new THREE.TubeGeometry(curve, 20, 0.025, 8, false);

        return (
          <mesh
            key={i}
            geometry={geometry}
            ref={(el) => (linesRef.current[i] = el)}
          >
            <meshStandardMaterial
              color="#00F0FF"
              emissive="#00F0FF"
              emissiveIntensity={4}
              transparent
              opacity={0.8}
              roughness={0.1}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// -----------------------------------------------------------
// 2. Sci-Fi Core Model Loader with Real-time Energy Pulse
// -----------------------------------------------------------
function CoreModel() {
  const { scene } = useGLTF('/3dModels/futuristic_sci-fi_energy_core.glb');
  const coreRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Idle core rotation
    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.4;
    }

    // Traverse materials to animate emissive pulsing
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        if (child.material.emissive) {
          // Dynamic energy current oscillation
          child.material.emissiveIntensity = 1.5 + Math.sin(t * 6) * 1.2;
        }
      }
    });
  });

  return (
    <group ref={coreRef} position={[0, -1, 0]} scale={1.2}>
      <primitive object={scene} />
      <ElectricCurrent radius={1.4} count={8} />
    </group>
  );
}

// -----------------------------------------------------------
// 3. Canvas Container
// -----------------------------------------------------------
export default function EnergyCoreCanvas() {
  return (
    <div className="w-full h-[500px] md:h-[600px] relative">
      <Canvas camera={{ position: [0, 1.5, 4.8], fov: 45 }}>
        {/* Cyberpunk Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 8, 5]} intensity={2.5} color="#00F0FF" />
        <pointLight position={[-4, 2, -2]} intensity={3} color="#F472B6" />
        <pointLight position={[0, 0, 0]} intensity={4} color="#00F0FF" distance={5} />

        <Float speed={2.5} rotationIntensity={0.3} floatIntensity={0.5}>
          <CoreModel />
        </Float>

        <ContactShadows
          position={[0, -1.8, 0]}
          opacity={0.8}
          scale={8}
          blur={2.5}
          far={5}
          color="#00F0FF"
        />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2 + 0.1}
          minPolarAngle={Math.PI / 4}
        />
      </Canvas>
    </div>
  );
}