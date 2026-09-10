import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Html } from '@react-three/drei';
import * as THREE from 'three';
import DesignModel from './DesignModel';

/**
 * ---------------------------------------------------------------------------
 * SECTION TRANSFORM SCRIPT CONFIGURATION
 * ---------------------------------------------------------------------------
 * Controls 3D model transformation targets per scroll section:
 * Section 0 (Hero): pos: [0, 0, 0], rot: [0, 0, 0]
 * Section 1 (Brand Identity): pos: [1.8, -0.2, 0.5], rot: [0.3, 0.8, 0]
 * Section 2 (UI/UX Design): pos: [-1.6, 0.3, 1.2], rot: [-0.2, 1.8, 0.1]
 * Section 3 (Motion & 3D): pos: [1.4, -0.4, -0.2], rot: [0.5, 3.2, -0.2]
 * Section 4 (Final CTA): pos: [0, 0.2, -0.5], rot: [0, 6.28, 0]
 * ---------------------------------------------------------------------------
 */
export const SECTION_CONFIGS = [
  // Section 0: Hero (Workspace room anchored at Hero spot, Robot at origin)
  {
    name: '00-Hero',
    position: [1.8, -0.8, 0],
    rotation: [0.15, -2.2, 0],
    scale: 0.4,
    robotPos: [0, 0, 0],
    robotRot: [0, 0, 0],
  },
  // Section 1: Brand Identity & Logos (Room anchored, Robot glides smoothly forward left into view)
  {
    name: '01-BrandIdentity',
    position: [1.8, -0.8, 0],
    rotation: [0.15, -2.2, 0],
    scale: 0.4,
    robotPos: [-3.5, 1.2, 2.5],
    robotRot: [0.1, 0.6, 0],
  },
  // Section 2: UI/UX & Product Design (Room anchored, Robot floats left focusing interface)
  {
    name: '02-UIUXDesign',
    position: [1.8, -0.8, 0],
    rotation: [0.15, -2.2, 0],
    scale: 0.4,
    robotPos: [-7.2, 1.6, 3.5],
    robotRot: [0.2, 1.2, -0.1],
  },
  // Section 3: Motion & 3D Visuals (Room anchored, Robot floats up right with dynamic rotation)
  {
    name: '03-Motion3D',
    position: [1.8, -0.8, 0],
    rotation: [0.15, -2.2, 0],
    scale: 0.4,
    robotPos: [-1.8, 2.4, 2.8],
    robotRot: [0.3, 2.2, 0.15],
  },
  // Section 4: Final CTA & Deliverables (Room anchored, Robot hovers gracefully above contact card)
  {
    name: '04-FinalCTA',
    position: [1.8, -0.8, 0],
    rotation: [0.15, -2.2, 0],
    scale: 0.4,
    robotPos: [-4.2, 1.2, 2.0],
    robotRot: [0, 0, 0],
  },
];

/**
 * Ambient Design Particles
 */
function DesignParticles({ isMobile }) {
  const count = isMobile ? 35 : 90;
  const pointsRef = useRef();

  const { positions } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return { positions: pos };
  }, [count]);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);

  const mat = useMemo(() => {
    return new THREE.PointsMaterial({
      size: isMobile ? 0.04 : 0.035,
      color: '#A855F7',
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, [isMobile]);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
    }
  });

  return <points ref={pointsRef} geometry={geo} material={mat} />;
}

/**
 * Minimalist Loading Skeleton Fallback
 */
function CanvasLoader() {
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center space-y-3 bg-[#0a0518]/90 p-5 rounded-2xl border border-purple-500/30 backdrop-blur-xl shadow-[0_0_30px_rgba(168,85,247,0.25)]">
        <div className="w-9 h-9 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-mono tracking-widest text-purple-300 uppercase font-semibold">
          Initializing 3D Studio Canvas...
        </span>
      </div>
    </Html>
  );
}

/**
 * Main 3D Design Canvas Viewport Component
 */
export function DesignCanvas({ transformState = SECTION_CONFIGS[0], isMobile = false }) {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.25,
        }}
        className="w-full h-full"
      >
        {/* Studio Directional & Ambient Lights */}
        <ambientLight intensity={1.2} color="#170f2e" />
        <directionalLight position={[8, 12, 6]} intensity={3.5} color="#FFFFFF" castShadow />
        <directionalLight position={[-8, 6, -4]} intensity={3.8} color="#6366F1" />
        <pointLight position={[0, -2, 2]} intensity={2.5} color="#EC4899" distance={8} />

        {/* Ambient Floating Dust */}
        <DesignParticles isMobile={isMobile} />

        {/* 3D Model Asset */}
        <Suspense fallback={<CanvasLoader />}>
          <DesignModel transformState={transformState} isMobile={isMobile} />
        </Suspense>

        {/* Environment Reflection Preset */}
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}

export default DesignCanvas;
