import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, ContactShadows, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// --- Procedural Cyber Controller (Fallback / Standalone) ---
function GamepadMesh() {
  const meshRef = useRef();

  // Subtle floating & responsive mouse tilt
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const mouseX = state.pointer.x * 0.4;
    const mouseY = state.pointer.y * 0.4;

    // Smooth lerp rotation toward cursor + continuous idle hover
    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x,
      Math.sin(t * 0.8) * 0.15 - mouseY,
      0.05
    );
    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y,
      t * 0.3 + mouseX,
      0.05
    );
    meshRef.current.position.y = Math.sin(t * 1.5) * 0.1;
  });

  return (
    <group ref={meshRef} dispose={null} scale={1.4}>
      {/* Main Controller Body */}
      <mesh position={[0, 0, 0]}>
        <capsuleGeometry args={[0.55, 1.4, 16, 32]} />
        <meshStandardMaterial
          color="#0f071e"
          roughness={0.2}
          metalness={0.8}
          wireframe={false}
        />
      </mesh>

      {/* Left Grip Handle */}
      <mesh position={[-0.8, -0.4, 0.1]} rotation={[0, 0, 0.4]}>
        <capsuleGeometry args={[0.25, 0.9, 16, 32]} />
        <meshStandardMaterial color="#1a0b36" roughness={0.3} metalness={0.9} />
      </mesh>

      {/* Right Grip Handle */}
      <mesh position={[0.8, -0.4, 0.1]} rotation={[0, 0, -0.4]}>
        <capsuleGeometry args={[0.25, 0.9, 16, 32]} />
        <meshStandardMaterial color="#1a0b36" roughness={0.3} metalness={0.9} />
      </mesh>

      {/* Neon D-Pad / Glowing Accents */}
      <mesh position={[-0.45, 0.1, 0.45]}>
        <boxGeometry args={[0.25, 0.25, 0.1]} />
        <meshStandardMaterial color="#EC4899" emissive="#EC4899" emissiveIntensity={2} />
      </mesh>

      {/* Action Buttons (Right) */}
      <mesh position={[0.45, 0.15, 0.45]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#A855F7" emissive="#A855F7" emissiveIntensity={3} />
      </mesh>
      <mesh position={[0.6, 0.05, 0.45]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#F472B6" emissive="#F472B6" emissiveIntensity={3} />
      </mesh>

      {/* Cyberpunk Energy Core in Center */}
      <mesh position={[0, 0.1, 0.4]}>
        <sphereGeometry args={[0.18, 32, 32]} />
        <MeshDistortMaterial
          color="#C084FC"
          emissive="#A855F7"
          emissiveIntensity={1.5}
          distort={0.4}
          speed={3}
        />
      </mesh>
    </group>
  );
}

/* 
// --- If using an actual .GLB file from /public/models/controller.glb ---
function ExternalModel() {
  const { scene } = useGLTF('/3dModels/gameController.glb');
  const ref = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    ref.current.rotation.y = t * 0.4 + state.pointer.x * 0.5;
    ref.current.rotation.x = -state.pointer.y * 0.3;
  });

  return <primitive ref={ref} object={scene} scale={2} position={[0, 0, 0]} />;
}
*/

export default function ControllerCanvas() {
  return (
    <div className="w-full h-[450px] md:h-[600px] relative">
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        {/* Cyberpunk Studio Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} color="#F472B6" />
        <pointLight position={[-4, -2, -2]} intensity={2.5} color="#A855F7" />
        <spotLight position={[0, 5, 2]} angle={0.6} penumbra={0.8} intensity={2} color="#38BDF8" />

        {/* Floating Controller with organic physics */}
        <Float speed={2.5} rotationIntensity={0.6} floatIntensity={0.8}>
          <GamepadMesh />
          {/* <ExternalModel /> */}
        </Float>

        {/* Dynamic floor shadow */}
        <ContactShadows
          position={[0, -1.8, 0]}
          opacity={0.6}
          scale={8}
          blur={2.5}
          far={4}
          color="#A855F7"
        />
      </Canvas>
    </div>
  );
}