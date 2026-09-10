import React, { useRef, useMemo, useEffect, useState, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useAnimations, Environment, Html, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Sparkles, ArrowRight, Palette, Brush, Layout, Eye } from 'lucide-react';
import { useNearScreen } from '../hooks/useNearScreen';

useGLTF.preload('/3dModels/phoenix_bird.glb');

/* ============================================================
 * RESPONSIVE HELPER HOOK
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
 * AMBIENT DESIGN DUST PARTICLES
 * ============================================================ */
function ParticleDust({ isMobile }) {
  const count = isMobile ? 35 : 80;
  const pointsRef = useRef();

  const { positions } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 9;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 9;
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
      size: isMobile ? 0.045 : 0.038,
      color: '#EC4899',
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, [isMobile]);

  return <points ref={pointsRef} geometry={geo} material={mat} />;
}

/* ============================================================
 * 3D GRAPHICS PHOENIX BIRD MODEL (RESPONSIVE CONFIG)
 * ============================================================ */
function GraphicsShowcaseModel() {
  const groupRef = useRef();
  const { scene, animations } = useGLTF('/3dModels/phoenix_bird.glb');
  const { actions } = useAnimations(animations, groupRef);
  const { size } = useThree();

  const isDesktop = size.width >= 1024;

  // Discrete position and scale parameters
  const desktopConfig = {
    scale: 0.0033,
    position: [0, -0.2, 0],
    rotation: [0.1, -0.4, 0],
  };

  const mobileConfig = {
    scale: 0.0040,
    position: [1, -0.7, 0],
    rotation: [0.1, -0.3, 0],
  };

  const currentConfig = isDesktop ? desktopConfig : mobileConfig;

  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      Object.values(actions).forEach((action) => {
        if (action) {
          action.setLoop(THREE.LoopRepeat, Infinity);
          action.clampWhenFinished = false;
          action.reset().play();
        }
      });
    }
  }, [actions]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();

    // Floating bobbing effect anchored to current baseline position
    groupRef.current.position.y = currentConfig.position[1] + Math.sin(time * 1.5) * 0.1;
  });

  return (
    <group
      ref={groupRef}
      position={currentConfig.position}
      rotation={currentConfig.rotation}
    >
      <primitive object={scene} scale={currentConfig.scale} />
      <pointLight position={[0, 2, 1]} color="#EC4899" intensity={4.5} distance={8} />
      <pointLight position={[-2, -1, -1]} color="#A855F7" intensity={3.5} distance={6} />
      <pointLight position={[2, 1, -1]} color="#F59E0B" intensity={3.5} distance={6} />
    </group>
  );
}

/* Loader Fallback for 3D Canvas */
function CanvasLoader() {
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center space-y-2 bg-[#1a0a14]/90 p-4 rounded-xl border border-pink-500/30 backdrop-blur-md whitespace-nowrap">
        <div className="w-7 h-7 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-[11px] font-mono text-pink-300">Loading 3D Creative Model...</span>
      </div>
    </Html>
  );
}

/* ============================================================
 * MAIN GRAPHICS SECTION COMPONENT
 * ============================================================ */
export default function GraphicsCom() {
  const [sectionRef, isNear] = useNearScreen({ rootMargin: '250px 0px', once: false });
  const { isMobile } = useViewportInfo();

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen bg-[#07050e] text-white selection:bg-pink-500 selection:text-white py-16 sm:py-24 overflow-visible"
    >
      {/* Top and Bottom Section Blending Overlay Masks */}
      <div className="absolute top-0 inset-x-0 h-36 bg-gradient-to-b from-[#07050e] via-[#07050e]/60 to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 inset-x-0 h-36 bg-gradient-to-t from-[#07050e] via-[#07050e]/60 to-transparent pointer-events-none z-10" />

      {/* Background Radial Lights */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] bg-gradient-to-tr from-[#ec4899]/15 via-[#a855f7]/15 to-[#f59e0b]/10 blur-[190px] rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(#ec4899_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.05]" />
      </div>

      <div className="relative z-10 max-w-[1900px] mx-auto px-6 sm:px-12 flex flex-col min-h-[90vh]">
        {/* 2-COLUMN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center w-full my-auto gap-8 lg:gap-12">
          
          {/* 3D PHOENIX MODEL CANVAS (Mobile: Order 1 / Desktop: Order 1, Left) */}
          <div className="lg:col-span-7 w-full h-[360px] sm:h-[480px] lg:h-[800px] relative flex items-center justify-center bg-transparent overflow-hidden lg:overflow-visible order-1 lg:order-1">
            <div className="absolute inset-0 w-full h-full bg-transparent overflow-visible">
              <Canvas
                frameloop={isNear ? 'always' : 'never'}
                dpr={[1, 1.5]}
                gl={{
                  antialias: true,
                  powerPreference: 'high-performance',
                  alpha: true,
                  toneMapping: THREE.ACESFilmicToneMapping,
                  toneMappingExposure: 1.2,
                }}
                camera={{ position: [0, 0, 5.0], fov: 45 }}
                className="w-full h-full overflow-visible"
              >
                <ambientLight intensity={1.1} color="#2A1B4E" />
                <directionalLight position={[6, 8, 6]} intensity={2.8} color="#FFFFFF" castShadow />
                <directionalLight position={[-6, 4, -4]} intensity={3.5} color="#EC4899" />
                <pointLight position={[3, -2, -2]} intensity={3.5} color="#A855F7" />
                <pointLight position={[0, 2, 2]} intensity={2.0} color="#F59E0B" distance={6} />

                <ParticleDust isMobile={isMobile} />

                <Suspense fallback={<CanvasLoader />}>
                  <GraphicsShowcaseModel />
                </Suspense>

                <OrbitControls
                  enableZoom={false}
                  enablePan={false}
                  enableDamping={true}
                  dampingFactor={0.05}
                  rotateSpeed={0.8}
                  autoRotate={true}
                  autoRotateSpeed={0.6}
                  minPolarAngle={Math.PI / 2}
                  maxPolarAngle={Math.PI / 2}
                  makeDefault
                />

                <Environment preset="studio" />
              </Canvas>
            </div>
          </div>

          {/* CONTENT TEXT (Mobile: Order 2 / Desktop: Order 2, Right) */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6 text-center lg:text-left items-center lg:items-start order-2 lg:order-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-pink-950/80 border border-pink-500/40 text-[#EC4899] font-mono text-xs font-bold tracking-wider w-fit shadow-[0_0_15px_rgba(236,72,153,0.2)]">
              <Sparkles size={14} />
              <span>CREATIVE GRAPHICS & UI/UX STUDIO</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-[1.12]">
              Immersive 3D Visuals & Next-Gen{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#EC4899] via-[#A855F7] to-[#F59E0B]">
                UI/UX Design Systems
              </span>
            </h1>

            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-xl">
              Elevate your brand presence with high-impact 3D graphics, motion design, and user-centric UI/UX design systems. We craft visually stunning visual identities, interactive prototypes, and photorealistic digital assets tailored for web, mobile, and metaverse platforms.
            </p>

            {/* Core Features & Tech Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 w-full text-left">
              <div className="p-4 rounded-xl bg-[#130d24]/80 border border-pink-500/20 backdrop-blur-md hover:border-pink-500/40 transition-all">
                <div className="flex items-center gap-3 text-pink-400 font-bold text-sm mb-1.5">
                  <Palette size={18} className="text-[#EC4899]" />
                  <span>3D Motion & Assets</span>
                </div>
                <p className="text-xs text-zinc-400 leading-normal">
                  High-fidelity 3D modeling, texturing, character design, and product render animations.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#130d24]/80 border border-purple-500/20 backdrop-blur-md hover:border-purple-500/40 transition-all">
                <div className="flex items-center gap-3 text-purple-400 font-bold text-sm mb-1.5">
                  <Layout size={18} className="text-[#A855F7]" />
                  <span>UI/UX Design Systems</span>
                </div>
                <p className="text-xs text-zinc-400 leading-normal">
                  Figma design systems, interactive wireframes, micro-interactions, and visual prototypes.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#130d24]/80 border border-amber-500/20 backdrop-blur-md hover:border-amber-500/40 transition-all">
                <div className="flex items-center gap-3 text-amber-400 font-bold text-sm mb-1.5">
                  <Brush size={18} className="text-[#F59E0B]" />
                  <span>Brand Identity & Design</span>
                </div>
                <p className="text-xs text-zinc-400 leading-normal">
                  Custom brand guidelines, logo suites, marketing visuals, and vector graphics.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#130d24]/80 border border-pink-500/20 backdrop-blur-md hover:border-pink-500/40 transition-all">
                <div className="flex items-center gap-3 text-pink-400 font-bold text-sm mb-1.5">
                  <Eye size={18} className="text-[#EC4899]" />
                  <span>Interactive 3D Web Visuals</span>
                </div>
                <p className="text-xs text-zinc-400 leading-normal">
                  WebGL shaders, Three.js interactive graphics, and real-time canvas animation effects.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4 w-full sm:w-auto">
              <Link
                to="/services/graphics-designing"
                className="w-full sm:w-auto group inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#ec4899] via-[#a855f7] to-[#f59e0b] text-white font-bold text-xs tracking-wider uppercase shadow-[0_0_25px_rgba(236,72,153,0.35)] hover:shadow-[0_0_35px_rgba(236,72,153,0.6)] hover:scale-[1.03] transition-all"
              >
                <span>Explore Creative Design</span>
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-[#130d24]/90 border border-white/15 hover:border-pink-500/40 text-zinc-200 hover:text-white font-semibold text-xs tracking-wider uppercase shadow-lg hover:scale-[1.03] transition-all backdrop-blur-md"
              >
                Request Design Quote
              </a>
            </div>

            {/* Metrics Footer */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10 w-full max-w-xl">
              <div>
                <div className="text-2xl font-extrabold text-white">4K+</div>
                <div className="text-[10px] text-zinc-400 uppercase tracking-wider mt-0.5">Photorealistic Assets</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#EC4899] to-[#F59E0B]">
                  100%
                </div>
                <div className="text-[10px] text-zinc-400 uppercase tracking-wider mt-0.5">Pixel-Perfect UI</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-white">80+</div>
                <div className="text-[10px] text-zinc-400 uppercase tracking-wider mt-0.5">Design Systems</div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}