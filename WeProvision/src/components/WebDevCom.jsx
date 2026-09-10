import React, { useRef, useMemo, useEffect, useState, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { Sparkles, ArrowRight, Cpu, Layers, Zap } from 'lucide-react';
import { useNearScreen } from '../hooks/useNearScreen';

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
 * AMBIENT PARTICLES
 * ============================================================ */
function ParticleDust({ isMobile }) {
  const count = isMobile ? 35 : 75;
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
      color: '#06B6D4',
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
 * STATIC 3D LAPTOP MODEL
 * ============================================================ */
function StaticLaptopModel({ isMobile }) {
  const groupRef = useRef();
  const { scene, animations } = useGLTF('/3dModels/laptop.glb');
  const { actions } = useAnimations(animations, groupRef);

  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        const name = (child.name || '').toLowerCase();
        const matName = (child.material?.name || '').toLowerCase();

        if (name === 'laptop screen' && !child.isMesh) {
          child.rotation.x = 0.05;
        }

        // Target inner laptop screen display mesh
        if (
          child.isMesh &&
          name.includes('laptop screen') &&
          (name.includes('002') || name.includes('003') || matName.includes('002') || matName.includes('003') || matName.includes('material.003'))
        ) {
          child.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color('#0a0614'),
            emissive: new THREE.Color('#06B6D4'),
            emissiveIntensity: 0.4,
            roughness: 0.2,
            metalness: 0.8,
            side: THREE.DoubleSide,
          });
        }
      });
    }
  }, [scene]);

  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      Object.values(actions).forEach((action) => {
        if (action) {
          action.setLoop(THREE.LoopRepeat, Infinity);
          action.clampWhenFinished = false;
          action.reset().fadeIn(0.2).play();
        }
      });
    }
  }, [actions]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();

    // Smooth continuous turntable rotation & floating animation
    groupRef.current.rotation.y += delta * 0.6;
    groupRef.current.position.y = Math.sin(time * 2) * 0.05 - 0.05;
  });

  return (
    <group ref={groupRef} position={[isMobile ? 0 : 0.35, -0.45, 0]} scale={isMobile ? 0.28 : 1.2}>
      <primitive object={scene} />
      <pointLight position={[0, 1.2, 0.4]} color="#06B6D4" intensity={3.5} distance={6} />
    </group>
  );
}

/* ============================================================
 * MAIN WEB DEV SECTION COMPONENT
 * ============================================================ */
export default function WebDevCom() {
  const [sectionRef, isNear] = useNearScreen({ rootMargin: '250px 0px', once: false });
  const { isMobile } = useViewportInfo();

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen bg-[#07050e] text-white selection:bg-[#06B6D4] selection:text-black py-16 sm:py-24 overflow-visible"
    >
      {/* Top and Bottom Section Blending Overlay Masks */}
      <div className="absolute top-0 inset-x-0 h-36 bg-gradient-to-b from-[#07050e] via-[#07050e]/60 to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 inset-x-0 h-36 bg-gradient-to-t from-[#07050e] via-[#07050e]/60 to-transparent pointer-events-none z-10" />

      {/* Background Radial Lights */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] bg-gradient-to-tr from-[#9333ea]/20 via-[#06b6d4]/15 to-[#ec4899]/20 blur-[190px] rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.07]" />
      </div>

      <div className="relative z-10 max-w-[1900px] mx-auto px-6 sm:px-12 flex flex-col min-h-[90vh]">

        {/* 2-COLUMN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center w-full my-auto gap-8">

          {/* LEFT COLUMN: CONTENT TEXT */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-[#06B6D4] font-mono text-xs font-bold tracking-wider w-fit shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <Sparkles size={14} />
              <span>FULL-STACK WEB STUDIO</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-[1.12]">
              Next-Gen Apps Built With{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#06B6D4] via-[#A855F7] to-[#EC4899]">
                MERN & Next.js Ecosystems
              </span>
            </h1>

            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-xl">
              We engineer blazing-fast web applications and high-conversion platforms utilizing React, Next.js, Node.js, and Tailwind CSS to scale your business effortlessly.
            </p>

            {/* Tech Stack Highlights Card */}
            <div className="p-5 rounded-2xl bg-[#120a24]/90 border border-cyan-500/30 backdrop-blur-xl shadow-2xl space-y-3 max-w-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-[#06B6D4] tracking-wider uppercase">
                  CORE TECH STACK
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-500/30">
                  Modern Architecture
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-zinc-200">
                  <Zap size={14} className="text-cyan-400 shrink-0" />
                  <span>Next.js 14+</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-zinc-200">
                  <Layers size={14} className="text-purple-400 shrink-0" />
                  <span>React / MERN</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-zinc-200">
                  <Cpu size={14} className="text-pink-400 shrink-0" />
                  <span>Node / Express</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-zinc-200">
                  <Sparkles size={14} className="text-cyan-400 shrink-0" />
                  <span>Tailwind CSS</span>
                </div>
              </div>

              <p className="text-zinc-400 text-xs leading-relaxed pt-1">
                Server-side rendering (SSR), optimized static generation, and robust REST/GraphQL APIs designed for maximum performance.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/services/web-development"
                className="group inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#9333ea] via-[#c026d3] to-[#ec4899] text-white font-bold text-xs tracking-wider uppercase shadow-[0_0_25px_rgba(192,38,211,0.35)] hover:shadow-[0_0_35px_rgba(192,38,211,0.6)] hover:scale-[1.03] transition-all"
              >
                <span>View Our Tech Stack</span>
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-[#130d24]/90 border border-white/15 hover:border-cyan-500/40 text-zinc-200 hover:text-white font-semibold text-xs tracking-wider uppercase shadow-lg hover:scale-[1.03] transition-all backdrop-blur-md"
              >
                Estimate Project
              </a>
            </div>

            {/* Stat Highlights */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10 max-w-xl">
              <div>
                <div className="text-2xl font-extrabold text-white">100/100</div>
                <div className="text-[10px] text-zinc-400 uppercase tracking-wider mt-0.5">Lighthouse Score</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#06B6D4] to-[#A855F7]">
                  3x Faster
                </div>
                <div className="text-[10px] text-zinc-400 uppercase tracking-wider mt-0.5">Page Load Speeds</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-white">50+</div>
                <div className="text-[10px] text-zinc-400 uppercase tracking-wider mt-0.5">Full-Stack Apps</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 w-full h-[450px] sm:h-[550px] lg:h-[650px] relative flex items-center justify-center bg-transparent overflow-visible">
            <div className="absolute inset-0 w-full h-full bg-transparent pointer-events-auto overflow-visible">
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
                camera={{ position: [0, 0.1, 5.8], fov: 45 }}
                className="w-full h-full overflow-visible"
              >
                <ambientLight intensity={1.2} color="#2A1B4E" />
                <directionalLight position={[6, 9, 6]} intensity={3.0} color="#FFFFFF" castShadow />
                <directionalLight position={[-6, 4, -4]} intensity={4.2} color="#00F0FF" />
                <pointLight position={[4, -3, -2]} intensity={3.8} color="#EC4899" />
                <pointLight position={[0, 2, 2]} intensity={2.2} color="#38BDF8" distance={6} />

                <ParticleDust isMobile={isMobile} />

                <Suspense fallback={null}>
                  <StaticLaptopModel isMobile={isMobile} />
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