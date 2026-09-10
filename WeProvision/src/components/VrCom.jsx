import React, { useRef, useMemo, useEffect, useState, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Environment, Float, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Sparkles, ArrowRight, Building2, Home, Compass, Layers } from 'lucide-react';
import { useNearScreen } from '../hooks/useNearScreen';

useGLTF.preload('/3dModels/VR-Model.glb');

/* ============================================================
 * RESPONSIVE HELPER HOOK (FOR DOM ELEMENTS)
 * ============================================================ */
function useViewportInfo() {
  const [info, setInfo] = useState(() => {
    if (typeof window === 'undefined') return { isMobile: false, isTablet: false };
    const w = window.innerWidth;
    return { isMobile: w < 640, isTablet: w >= 640 && w < 1024 };
  });

  useEffect(() => {
    const onResize = () => {
      const w = window.innerWidth;
      setInfo({ isMobile: w < 640, isTablet: w >= 640 && w < 1024 });
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return info;
}

/* ============================================================
 * AMBIENT PARTICLES
 * ============================================================ */
function ParticleDust({ isMobile }) {
  const count = isMobile ? 35 : 80;
  const pointsRef = useRef();

  const { positions, speeds, sways } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    const swy = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 9;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 9;
      spd[i] = 0.2 + Math.random() * 0.4;
      swy[i] = Math.random() * Math.PI * 2;
    }
    return { positions: pos, speeds: spd, sways: swy };
  }, [count]);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);

  const mat = useMemo(() => {
    return new THREE.PointsMaterial({
      size: isMobile ? 0.045 : 0.038,
      color: '#10B981',
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, [isMobile]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime();
    pointsRef.current.rotation.y = time * 0.03;
  });

  return <points ref={pointsRef} geometry={geo} material={mat} />;
}

/* ============================================================
 * 3D ARCHITECTURAL SHOWCASE MODEL (INDEPENDENT RESPONSIVE CONFIG)
 * ============================================================ */
function ArchitecturalShowcaseModel() {
  const { scene } = useGLTF('/3dModels/VR-Model.glb');
  const groupRef = useRef();
  const { size } = useThree();

  // Desktop detection threshold (Tailwind 'lg' breakpoint = 1024px)
  const isDesktop = size.width >= 1024;

  // -------------------------------------------------------------
  // DESKTOP VS MOBILE TRANSFORM CONFIGURATION
  // -------------------------------------------------------------
  const desktopConfig = {
    scale: 10,               // Original desktop scale
    position: [0, -0.3, 0],  // Original desktop [x, y, z] position
  };

  const mobileConfig = {
    scale: 9,              // Mobile scale tailored for small viewports
    position: [0.2, -0.15, 0], // Mobile [x, y, z] position centered vertically
  };

  const currentConfig = isDesktop ? desktopConfig : mobileConfig;

  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }
  }, [scene]);

  return (
    <group
      ref={groupRef}
      position={currentConfig.position}
      scale={currentConfig.scale}
    >
      <primitive object={scene} />
      <pointLight position={[0, 2, 1]} color="#10B981" intensity={4.5} distance={8} />
      <pointLight position={[-2, -1, -1]} color="#06B6D4" intensity={3.5} distance={6} />
      <pointLight position={[2, 1, -1]} color="#3B82F6" intensity={3.5} distance={6} />
    </group>
  );
}

/* Loader Fallback for 3D Canvas */
function CanvasLoader() {
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center space-y-2 bg-[#0a1a14]/90 p-4 rounded-xl border border-emerald-500/30 backdrop-blur-md whitespace-nowrap">
        <div className="w-7 h-7 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-[11px] font-mono text-emerald-300">Loading 3D Environment...</span>
      </div>
    </Html>
  );
}

/* ============================================================
 * MAIN ARCHITECTURAL SHOWCASE SECTION COMPONENT
 * ============================================================ */
export default function VrCom() {
  const [sectionRef, isNear] = useNearScreen({ rootMargin: '250px 0px', once: false });
  const { isMobile } = useViewportInfo();

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen bg-[#07050e] text-white selection:bg-emerald-500 selection:text-black py-16 sm:py-24 overflow-visible"
    >
      {/* Top and Bottom Section Blending Overlay Masks */}
      <div className="absolute top-0 inset-x-0 h-36 bg-gradient-to-b from-[#07050e] via-[#07050e]/60 to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 inset-x-0 h-36 bg-gradient-to-t from-[#07050e] via-[#07050e]/60 to-transparent pointer-events-none z-10" />

      {/* Background Radial Lights */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 right-1/4 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] bg-gradient-to-tr from-[#10b981]/15 via-[#06b6d4]/15 to-[#3b82f6]/10 blur-[190px] rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.05]" />
      </div>

      <div className="relative z-10 max-w-[1900px] mx-auto px-6 sm:px-12 flex flex-col min-h-[90vh]">
        {/* 2-COLUMN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center w-full my-auto gap-10 lg:gap-12">
          
          {/* CONTENT TEXT (Mobile: Bottom / Desktop: Left) */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6 text-left order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-[#10B981] font-mono text-xs font-bold tracking-wider w-fit shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <Sparkles size={14} />
              <span>UNITY 3D REAL ESTATE VISUALIZATION</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-[1.12]">
              Interactive 3D Apartments & Houses Powered by{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#10B981] via-[#06B6D4] to-[#3B82F6]">
                Unity Engine
              </span>
            </h1>

            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-xl">
              Empower real estate builders and developers with photorealistic, real-time 3D property walkthroughs. Let home buyers explore floor plans, customize interiors, and experience off-plan apartments in stunning interactive detail.
            </p>

            {/* Core Features & Tech Card */}
            <div className="p-5 rounded-2xl bg-[#0a1a14]/90 border border-emerald-500/30 backdrop-blur-xl shadow-2xl space-y-3 max-w-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-[#10B981] tracking-wider uppercase">
                  BUILDER SOLUTIONS STACK
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                  Unity Pixel Streaming
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-zinc-200">
                  <Building2 size={14} className="text-emerald-400 shrink-0" />
                  <span>Apartment Towers</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-zinc-200">
                  <Home size={14} className="text-cyan-400 shrink-0" />
                  <span>Villas & Houses</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-zinc-200">
                  <Compass size={14} className="text-blue-400 shrink-0" />
                  <span>Interactive Tours</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-zinc-200">
                  <Layers size={14} className="text-emerald-400 shrink-0" />
                  <span>Floor Plan Customizer</span>
                </div>
              </div>

              <p className="text-zinc-400 text-xs leading-relaxed pt-1">
                High-performance WebGL & cloud streaming allows buyers to customize finishes, switch daylight lighting, and inspect room dimensions directly in their browser.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/services/vr-development"
                className="group inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#10b981] via-[#06b6d4] to-[#3b82f6] text-white font-bold text-xs tracking-wider uppercase shadow-[0_0_25px_rgba(16,185,129,0.35)] hover:shadow-[0_0_35px_rgba(16,185,129,0.6)] hover:scale-[1.03] transition-all"
              >
                <span>View Builder Projects</span>
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-[#0c1c17]/90 border border-white/15 hover:border-emerald-500/40 text-zinc-200 hover:text-white font-semibold text-xs tracking-wider uppercase shadow-lg hover:scale-[1.03] transition-all backdrop-blur-md"
              >
                Request Builder Demo
              </a>
            </div>

            {/* Stat Highlights */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10 max-w-xl">
              <div>
                <div className="text-2xl font-extrabold text-white">3.4x</div>
                <div className="text-[10px] text-zinc-400 uppercase tracking-wider mt-0.5">Higher Buyer Engagement</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#10B981] to-[#06B6D4]">
                  WebGL
                </div>
                <div className="text-[10px] text-zinc-400 uppercase tracking-wider mt-0.5">Zero Plugins Needed</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-white">4K Real-Time</div>
                <div className="text-[10px] text-zinc-400 uppercase tracking-wider mt-0.5">Unity Graphics</div>
              </div>
            </div>
          </div>

          {/* 3D MODEL CANVAS (Mobile: Top / Desktop: Right) */}
          <div className="lg:col-span-7 w-full h-[360px] sm:h-[480px] lg:h-[750px] relative flex items-center justify-center bg-transparent overflow-visible order-1 lg:order-2">
            <div className="absolute inset-0 w-full h-full bg-transparent pointer-events-none overflow-visible">
              <Canvas
                frameloop={isNear ? 'always' : 'never'}
                dpr={[1, 1.5]}
                gl={{
                  antialias: true,
                  powerPreference: 'high-performance',
                  alpha: true,
                  toneMapping: THREE.ACESFilmicToneMapping,
                  toneMappingExposure: 1.3,
                }}
                camera={{ position: [0, 0, 5.5], fov: 45 }}
                className="w-full h-full overflow-visible"
              >
                <ambientLight intensity={1.5} color="#0d231b" />
                <directionalLight position={[5, 8, 5]} intensity={3.5} color="#FFFFFF" castShadow />
                <directionalLight position={[-5, 4, -4]} intensity={4.0} color="#10B981" />
                <pointLight position={[3, -2, 2]} intensity={3.0} color="#06B6D4" />

                <ParticleDust isMobile={isMobile} />

                <Suspense fallback={<CanvasLoader />}>
                  <Float speed={1.8} floatIntensity={0.5}>
                    <ArchitecturalShowcaseModel />
                  </Float>
                </Suspense>

                <Environment preset="city" />
              </Canvas>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}