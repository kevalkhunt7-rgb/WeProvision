import React, { useRef, useEffect, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Box, Layers, Palette, ShieldCheck } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations, Float, Environment, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useNearScreen } from '../hooks/useNearScreen';

useGLTF.preload('/3dModels/walking-robot.glb');

function WalkingRobotModel() {
  const groupRef = useRef();
  const { scene, animations } = useGLTF('/3dModels/walking-robot.glb');
  const { actions } = useAnimations(animations, groupRef);

  useEffect(() => {
    if (actions) {
      // Stop all actions first to prevent unwanted blending
      Object.keys(actions).forEach((key) => {
        actions[key]?.stop();
      });

      // Target walk animation clip, or fallback to the first available clip
      const targetAction =
        actions['walk'] ||
        (Object.keys(actions).length > 0 ? actions[Object.keys(actions)[0]] : null);

      if (targetAction) {
        targetAction.setLoop(THREE.LoopRepeat, Infinity);
        targetAction.clampWhenFinished = false;
        targetAction.reset().fadeIn(0.2).play();
      }
    }

    return () => {
      // Cleanup: stop animation when unmounting
      if (actions) {
        Object.keys(actions).forEach((key) => actions[key]?.stop());
      }
    };
  }, [actions]);

  return (
    <group ref={groupRef} position={[0, -1.5, 0]}>
      <primitive object={scene} scale={0.015} />
    </group>
  );
}

/* ============================================================
 * MAIN 3D MODELING SECTION COMPONENT (3D WALKING ROBOT SHOWCASE)
 * ============================================================ */
export default function ThreeDModelingCom() {
  const [sectionRef, isNear] = useNearScreen({ rootMargin: '250px 0px', once: false });

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen bg-[#07050e] text-white selection:bg-purple-500 selection:text-white py-16 sm:py-24 overflow-visible"
    >
      {/* Top and Bottom Section Blending Overlay Masks */}
      <div className="absolute top-0 inset-x-0 h-36 bg-gradient-to-b from-[#07050e] via-[#07050e]/60 to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 inset-x-0 h-36 bg-gradient-to-t from-[#07050e] via-[#07050e]/60 to-transparent pointer-events-none z-10" />

      {/* Cyber Neon Background Radial Lights */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] bg-gradient-to-tr from-[#ec4899]/20 via-[#9333ea]/20 to-[#06b6d4]/15 blur-[190px] rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(#a855f7_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.07]" />
      </div>

      <div className="relative z-10 max-w-[1900px] mx-auto px-6 sm:px-12 flex flex-col min-h-[90vh]">

        {/* 2-COLUMN GRID (LEFT: 3D WALKING ROBOT MODEL | RIGHT: CONTENT) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center w-full my-auto gap-8 lg:gap-12">

          {/* LEFT COLUMN: 3D WALKING ROBOT MODEL */}
          <div className="lg:col-span-7 w-full h-[380px] sm:h-[520px] lg:h-[650px] relative flex items-center justify-center bg-transparent overflow-hidden order-2 lg:order-1 isolate">
            <Canvas
              frameloop={isNear ? 'always' : 'never'}
              camera={{ position: [0, 0, 5.5], fov: 42 }}
              dpr={[1, 1.5]}
              gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
              className="w-full h-full"
            >
              <ambientLight intensity={1.2} color="#1f1435" />
              <directionalLight position={[8, 12, 6]} intensity={3.5} color="#00F0FF" />
              <directionalLight position={[-8, -6, -4]} intensity={2.8} color="#EC4899" />
              <pointLight position={[0, 0, 2]} intensity={4.5} color="#C084FC" distance={8} />

              <Environment preset="city" />

              <Float speed={2.5} rotationIntensity={0.3} floatIntensity={0.5}>
                <Suspense fallback={null}>
                  <WalkingRobotModel />
                </Suspense>
              </Float>

              <OrbitControls
                enableZoom={false}
                enableRotate={true}
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
            </Canvas>
          </div>

          {/* RIGHT COLUMN: CONTENT TEXT */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6 text-left order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-purple-950/80 border border-purple-500/40 text-[#A855F7] font-mono text-xs font-bold tracking-wider w-fit shadow-[0_0_15px_rgba(168,85,247,0.2)]">
              <Sparkles size={14} />
              <span>3D MODELING & CGI STUDIO</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-[1.12]">
              Crafting Photorealistic &{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#A855F7] via-[#EC4899] to-[#06B6D4]">
                Interactive 3D Assets
              </span>
            </h1>

            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-xl">
              We design enterprise 3D models, complex asset pipelines, and interactive WebGL experiences with PBR materials, custom shaders, and real-time GPU optimization.
            </p>

            {/* Core Features & Pipeline Card */}
            <div className="p-5 rounded-2xl bg-[#120a24]/90 border border-purple-500/30 backdrop-blur-xl shadow-2xl space-y-3 max-w-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-[#A855F7] tracking-wider uppercase">
                  3D SUITE & ASSET PIPELINE
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                  CGI & Real-Time
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-zinc-200">
                  <Box size={14} className="text-purple-400 shrink-0" />
                  <span>Blender / Maya</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-zinc-200">
                  <Layers size={14} className="text-pink-400 shrink-0" />
                  <span>ZBrush Sculpting</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-zinc-200">
                  <Palette size={14} className="text-cyan-400 shrink-0" />
                  <span>Substance PBR</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-zinc-200">
                  <ShieldCheck size={14} className="text-purple-400 shrink-0" />
                  <span>GLTF / WebGL</span>
                </div>
              </div>

              <p className="text-zinc-400 text-xs leading-relaxed pt-1">
                High-fidelity geometry baking, low-poly topology optimization, and real-time interactive model rendering for web, AR, and game engines.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/services/3d-modeling"
                className="group inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#9333ea] via-[#c026d3] to-[#ec4899] text-white font-bold text-xs tracking-wider uppercase shadow-[0_0_25px_rgba(192,38,211,0.35)] hover:shadow-[0_0_35px_rgba(192,38,211,0.6)] hover:scale-[1.03] transition-all"
              >
                <span>Explore 3D Assets</span>
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-[#130d24]/90 border border-white/15 hover:border-purple-500/40 text-zinc-200 hover:text-white font-semibold text-xs tracking-wider uppercase shadow-lg hover:scale-[1.03] transition-all backdrop-blur-md"
              >
                Request 3D Demo
              </a>
            </div>

            {/* Stat Highlights */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10 max-w-xl">
              <div>
                <div className="text-2xl font-extrabold text-white">4K / 8K</div>
                <div className="text-[10px] text-zinc-400 uppercase tracking-wider mt-0.5">PBR Textures</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#A855F7] to-[#06B6D4]">
                  CGI Render
                </div>
                <div className="text-[10px] text-zinc-400 uppercase tracking-wider mt-0.5">Photorealistic Visuals</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-white">100+</div>
                <div className="text-[10px] text-zinc-400 uppercase tracking-wider mt-0.5">Custom 3D Models</div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
