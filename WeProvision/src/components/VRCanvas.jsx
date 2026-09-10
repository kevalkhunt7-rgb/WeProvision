import React, { useRef, useMemo, useLayoutEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Html } from '@react-three/drei';
import * as THREE from 'three';
import VRHeadsetModel from './VRHeadsetModel';

/**
 * Cyber Floating Particle Field
 * Renders ambient floating spatial dust with cyan & violet additive blending.
 */
function SpatialParticleField({ isMobile }) {
  const count = isMobile ? 40 : 110;
  const pointsRef = useRef();

  // -------------------------------------------------------------
  // PARTICLE POSITIONS: Generates random spatial coordinates
  // -------------------------------------------------------------
  const { positions } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;
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
      size: isMobile ? 0.04 : 0.035, // Adjusts particle point size per device
      color: '#00F0FF',
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, [isMobile]);

  // -------------------------------------------------------------
  // CONTINUOUS ROTATION: Ambient idle rotation on the Y-axis
  // -------------------------------------------------------------
  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.025;
    }
  });

  return <points ref={pointsRef} geometry={geo} material={mat} />;
}

/**
 * Canvas Loader Fallback
 */
function CanvasLoader() {
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center space-y-3 bg-[#0a0518]/90 p-5 rounded-2xl border border-cyan-500/30 backdrop-blur-xl shadow-[0_0_30px_rgba(0,240,255,0.2)]">
        <div className="w-9 h-9 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-mono tracking-widest text-cyan-300 uppercase font-semibold">
          Initializing Spatial VR Viewport...
        </span>
      </div>
    </Html>
  );
}

/**
 * ---------------------------------------------------------------------------
 * SCROLL TRANSFORM SCRIPT / SECTION CONFIGURATIONS
 * ---------------------------------------------------------------------------
 * Manage the 3D model's scale, position [x, y, z], rotation [x, y, z],
 * and exploded view state for each section right here!
 *
 * Section 01: Hero
 * Section 02: Hardware & Architecture
 * Section 03: Optics & Display (Exploded Visor Engine)
 * Section 04: 6DoF Spatial Interaction
 * Section 05: Final Call-To-Action
 * ---------------------------------------------------------------------------
 */
export const SECTION_CONFIGS = [
  // 01. HERO SECTION (Far Right column area, 100% clear of left text)
  {
    section: '01-Hero',
    position: [2.7, -0.1, 0],
    rotation: [0.12, -0.4, 0],
    scale: 6.2,
    exploded: 0,
  },
  // 02. HARDWARE & ARCHITECTURE (Far Right side - safely clear of 2-column tech cards)
  {
    section: '02-Hardware',
    position: [2.7, 0, -0.2],
    rotation: [0.25, 1.4, -0.15],
    scale: 6.2,
    exploded: 0,
  },
  // 03. OPTICS & DISPLAY (Far Left column area, pushed back in Z to avoid text clipping)
  {
    section: '03-Optics',
    position: [-2.7, -0.1, -0.5],
    rotation: [0, -1.3, 0],
    scale: 6.0,
    exploded: 1,
  },
  // 04. 6DOF SPATIAL INTERACTION (Far Left column alignment, 100% clear of right text)
  {
    section: '04-Spatial',
    position: [-2.7, -0.1, -0.2],
    rotation: [-0.2, -1.25, 0.2],
    scale: 6.0,
    exploded: 0,
  },
  // 05. FINAL CTA SECTION (Centered in upper viewport above lower CTA card)
  {
    section: '05-FinalCTA',
    position: [0, 1.05, 0],
    rotation: [0.2, 0, 0],
    scale: 6.5,
    exploded: 0,
  },
];

/**
 * 3D VR Canvas Master Viewport
 */
export function VRCanvas({ transformState = SECTION_CONFIGS[0], isMobile = false }) {
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
        {/* Ambient & Studio Directional Lighting System */}
        <ambientLight intensity={1.2} color="#150a2a" />
        <directionalLight position={[8, 12, 6]} intensity={3.5} color="#FFFFFF" castShadow />
        <directionalLight position={[-8, 6, -4]} intensity={3.8} color="#00F0FF" />
        <pointLight position={[0, -2, 2]} intensity={2.5} color="#EC4899" distance={8} />

        {/* Ambient Spatial Particles */}
        <SpatialParticleField isMobile={isMobile} />

        {/* Scaled & Positioned 3D VR Headset Asset */}
        <Suspense fallback={<CanvasLoader />}>
          <VRHeadsetModel transformState={transformState} isMobile={isMobile} />
        </Suspense>

        {/* Environment Reflection Preset */}
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}

export default VRCanvas;