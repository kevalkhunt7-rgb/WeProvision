import React, { useRef, useMemo, useLayoutEffect, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Sparkles,
  ArrowRight,
  Palette,
  Layers,
  Brush,
  Eye,
  CheckCircle2,
  Zap,
  Globe,
  Send,
  Calendar,
  ChevronDown,
  Compass,
} from 'lucide-react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

// Preload the three 3D GLB models from /models/ directory
try {
  useGLTF.preload('/models/hero.glb');
  useGLTF.preload('/models/sword.glb');
  useGLTF.preload('/models/color_orb.glb');
} catch (e) {
  console.warn('Preloading models:', e);
}

/* ============================================================
 * 1. HERO.GLB MODEL (Kinetic Rainbow Ring Structure)
 * Section 1: Position x: ~2.0, GLTF animation playback enabled
 * Section 2: Shrinks & recedes deep into background (z: -12)
 * ============================================================ */
function HeroRingModel({ sceneStateRef, isMobile }) {
  const groupRef = useRef();

  let gltf = null;
  try {
    gltf = useGLTF('/models/hero.glb');
  } catch (err) {
    gltf = useGLTF('/3dModels/HERO.glb');
  }

  const { scene, animations } = gltf || {};
  const { actions } = useAnimations(animations || [], groupRef);

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

  useFrame((state, delta) => {
    if (!groupRef.current || !sceneStateRef.current) return;
    const { 
      heroPosX = 0, 
      heroPosY = 0, 
      heroPosZ = 0, 
      heroScale = 1, 
      heroOpacity = 1, 
      heroRotX = 0, 
      heroRotY = 0, // Changed fallback from Math.PI / 2 to 0
      heroRotZ = 0 
    } = sceneStateRef.current;

    const mobileOffsetX = isMobile ? -heroPosX * 0.8 : 0;
    groupRef.current.position.set(heroPosX + mobileOffsetX, heroPosY, heroPosZ);
    groupRef.current.scale.setScalar(heroScale * (isMobile ? 0.65 : 0.5));
    groupRef.current.rotation.set(heroRotX, heroRotY, heroRotZ);

    if (scene) {
      scene.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material.transparent = true;
          child.material.opacity = heroOpacity;
        }
      });
    }
  });

  if (!scene) return null;

  return (
    <group ref={groupRef}>
      {/* Rotate the inner group so it faces the screen directly */}
      <group rotation={[0, -Math.PI / 2, 0]}>
        <primitive object={scene} scale={1.2} />
      </group>
    </group>
  );
}

/* ============================================================
 * 2. SWORD.GLB MODEL (Stylized Fantasy Sword with Crystal Shards)
 * Section 1: Hidden in Section 1 (visible = false, opacity = 0)
 * Section 2: Emerges from aperture, scales to 1.2, swoops to Left (x: ~ -2.0)
 * Section 3: Dissolves into negative space (z: -6, scale: 0)
 * ============================================================ */
function FantasySwordModel({ sceneStateRef, isMobile }) {
  const groupRef = useRef();

  let gltf = null;
  try {
    gltf = useGLTF('/models/sword.glb');
  } catch (err) {
    gltf = useGLTF('/3dModels/SWORD.glb');
  }

  const { scene, animations } = gltf || {};
  const { actions } = useAnimations(animations || [], groupRef);

  // Play built-in GLTF animation actions for sword.glb
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

  useFrame((state, delta) => {
    if (!groupRef.current || !sceneStateRef.current) return;
    const { swordPosX, swordPosY, swordPosZ, swordScale, swordOpacity = 0, swordRotX, swordRotY, swordRotZ } = sceneStateRef.current;

    // Hide model completely in Section 1 so floating shards don't leak into top-right navbar
    const isVisible = swordScale > 0.05 && swordOpacity > 0.01;
    groupRef.current.visible = isVisible;
    if (!isVisible) return;

    const time = state.clock.getElapsedTime();

    // Baseline idle wobble & floating motion for craftsmanship section
    const floatY = Math.sin(time * 1.5) * 0.12;
    const wobbleY = Math.sin(time * 0.8) * 0.12;
    const pivotZ = Math.sin(time * 1.0) * 0.08;

    const mobileOffsetX = isMobile ? -swordPosX * 0.8 : 0;
    groupRef.current.position.set(swordPosX + mobileOffsetX, swordPosY + floatY, swordPosZ);
    groupRef.current.scale.setScalar(swordScale * (isMobile ? 0.65 : 1));
    groupRef.current.rotation.set(swordRotX, swordRotY + wobbleY, swordRotZ + pivotZ);

    if (scene) {
      scene.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material.transparent = true;
          child.material.opacity = swordOpacity;
        }
      });
    }
  });

  if (!scene) return null;

  return (
    <group ref={groupRef} position={[-12.0, 0, -6.0]} scale={0} visible={false}>
      <primitive object={scene} scale={0.5} />
    </group>
  );
}

/* ============================================================
 * 3. COLOR_ORB.GLB MODEL (Glass Bubble Enclosing Star)
 * Section 1 & 2: Hidden in negative space (visible = false)
 * Section 3: Prominent on Right (x: ~1.8, scale: 1.3) with multi-axis idle tumbling & GLTF animation
 * ============================================================ */
function ColorOrbModel({ sceneStateRef, isMobile }) {
  const groupRef = useRef();

  let gltf = null;
  try {
    gltf = useGLTF('/models/color_orb.glb');
  } catch (err) {
    gltf = useGLTF('/3dModels/color_orb.glb');
  }

  const { scene, animations } = gltf || {};
  const { actions, mixer } = useAnimations(animations || [], groupRef);

  // Play built-in GLTF animation actions for color_orb.glb
  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      Object.values(actions).forEach((action) => {
        if (action) {
          action.setLoop(THREE.LoopRepeat, Infinity);
          action.clampWhenFinished = false;
          action.timeScale = 1.0;
          action.reset().play();
        }
      });
    }
  }, [actions]);

  useFrame((state, delta) => {
    if (!groupRef.current || !sceneStateRef.current) return;
    const { orbPosX, orbPosY, orbPosZ, orbScale, orbOpacity = 0 } = sceneStateRef.current;

    const isVisible = orbScale > 0.05 && orbOpacity > 0.01;
    groupRef.current.visible = isVisible;
    if (!isVisible) return;

    if (mixer) {
      mixer.update(delta);
    }

    const time = state.clock.getElapsedTime();
    const floatY = Math.sin(time * 2.0) * 0.1;
    const mobileOffsetX = isMobile ? -orbPosX * 0.8 : 0;

    groupRef.current.position.set(orbPosX + mobileOffsetX, orbPosY + floatY, orbPosZ);
    groupRef.current.scale.setScalar(orbScale * (isMobile ? 0.65 : 1));

    // Multi-axis continuous idle tumbling
    groupRef.current.rotation.x += delta * 0.5;
    groupRef.current.rotation.y += delta * 0.7;
    groupRef.current.rotation.z += delta * 0.3;

    if (scene) {
      scene.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material.transparent = true;
          child.material.opacity = orbOpacity;
        }
      });
    }
  });

  if (!scene) return null;

  return (
    <group ref={groupRef} position={[5.0, -3.0, -6.0]} scale={0} visible={false}>
      <primitive object={scene} scale={0.8 } />
    </group>
  );
}

/* Fallback Wireframes for Suspense Loading */
function Fallback3D() {
  return (
    <mesh position={[0, 0, 0]}>
      <octahedronGeometry args={[1.5, 2]} />
      <meshStandardMaterial color="#ec4899" wireframe transparent opacity={0.5} />
    </mesh>
  );
}

/* ============================================================
 * MAIN GRAPHICS DESIGNING SHOWCASE PAGE COMPONENT
 * ============================================================ */
export default function GraphicsDesigningPage() {
  const pageRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  // Mutable 3D transform coordinates ref scrubbed smoothly by GSAP ScrollTrigger
  const sceneStateRef = useRef({
    // hero.glb (Section 1: Front-facing Hero Ring at x: 2.0)
    heroPosX: 2.0,
    heroPosY: 0.0,
    heroPosZ: 0.0,
    heroScale: 1.0,
    heroOpacity: 1.0,
    heroRotX: 0.0,
    heroRotY: 0.0,
    heroRotZ: 0.0,

    // sword.glb (Section 1: Off-screen on LEFT at x: -12.0)
    swordPosX: -12.0,
    swordPosY: 0,
    swordPosZ: 0,
    swordScale: 0,
    swordOpacity: 0,
    swordRotX: 0,
    swordRotY: 0,
    swordRotZ: 0,

    // color_orb.glb (Section 1 & 2: Hidden off-screen right)
    orbPosX: 6.0,
    orbPosY: -3.0,
    orbPosZ: -6.0,
    orbScale: 0.0,
    orbOpacity: 0.0,
  });

  // Responsive device check
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Synchronize 3D model transforms strictly through a single scrubbed GSAP timeline
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '#scroll-container',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.2,
        },
      });

      // -------------------------------------------------------------
      // STAGE 1 & 2: HERO RING EXITS TO RIGHT, SWORD ENTERS FROM LEFT
      // Timeline 0.0s -> 1.0s
      // 1. hero.glb (Ring) moves off to the RIGHT (+12.0) & disappears
      // 2. sword.glb enters from the LEFT (-12.0 -> -2.2) into Section 2
      // -------------------------------------------------------------
      tl.to(
        sceneStateRef.current,
        {
          // hero.glb (Ring) moves off-screen to the right and vanishes
          heroPosX: 12.0,
          heroPosY: 0.0,
          heroPosZ: -2.0,
          heroScale: 0.0,
          heroOpacity: 0.0,

          // sword.glb enters from off-screen left to Section 2 left anchor (-2.2)
          swordPosX: -2.2,
          swordPosY: -0.5,
          swordPosZ: 0.5,
          swordScale: 0.5,
          swordOpacity: 1.0,
          swordRotX: 0,
          swordRotY: 1,
          swordRotZ: 0.8,

          duration: 1.0,
          ease: 'power2.inOut',
        },
        0
      );

      // -------------------------------------------------------------
      // STAGE 3: SWORD EXITS TO LEFT AT END OF SECTION 2
      // Timeline 1.0s -> 1.8s
      // sword.glb shoots off to the far left (-12.0) & vanishes before Section 3
      // -------------------------------------------------------------
      tl.to(
        sceneStateRef.current,
        {
          swordPosX: -12.0,
          swordPosY: -1.0,
          swordPosZ: -10.0,
          swordScale: 0.0,
          swordOpacity: 0.0,

          duration: 0.8,
          ease: 'power2.in',
        },
        1.0
      );

      // -------------------------------------------------------------
      // STAGE 4: COLOR ORB ENTERS FOR SECTION 3
      // Timeline 1.8s -> 2.6s
      // color_orb.glb enters on Right (x: 1.8)
      // -------------------------------------------------------------
      tl.to(
        sceneStateRef.current,
        {
          orbPosX: 1.8,
          orbPosY: 0.0,
          orbPosZ: 0.5,
          orbScale: 1.3,
          orbOpacity: 1.0,

          duration: 0.8,
          ease: 'power2.out',
        },
        1.8
      );

      // -------------------------------------------------------------
      // STAGE 5: COLOR ORB RECEDES FOR FINAL CTA
      // Timeline 2.6s -> 3.4s
      // -------------------------------------------------------------
      tl.to(
        sceneStateRef.current,
        {
          orbPosX: 6.0,
          orbPosY: -2.0,
          orbPosZ: -8.0,
          orbScale: 0.0,
          orbOpacity: 0.0,

          duration: 0.8,
          ease: 'power2.inOut',
        },
        2.6
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={pageRef}
      className="relative bg-[#0d0e15] text-white selection:bg-[#ec4899] selection:text-white min-h-screen overflow-x-hidden font-sans"
    >
      {/* -----------------------------------------------------------
       * FIXED POSITION CANVAS WRAPPER (pointer-events-none, z-0)
       * Layered beneath scrollable HTML content container
       * ----------------------------------------------------------- */}
      <div className="fixed inset-0 z-0 pointer-events-none w-full h-screen overflow-hidden">
        {/* Ambient Radial Neon Light Glows */}
        <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] bg-gradient-to-tr from-[#ec4899]/15 via-[#a855f7]/15 to-[#6366f1]/15 blur-[200px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[750px] h-[750px] bg-gradient-to-br from-[#6366f1]/15 via-[#a855f7]/15 to-[#f59e0b]/15 blur-[200px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#ec4899_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.04] pointer-events-none" />

        <Canvas
          camera={{ position: [0, 0, 6.0], fov: 45 }}
          dpr={[1, 1.5]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.2,
          }}
          className="w-full h-full"
        >
          {/* Studio Lights & Environment */}
          <ambientLight intensity={1.2} color="#1b1035" />
          <directionalLight position={[8, 12, 6]} intensity={3.5} color="#FFFFFF" castShadow />
          <directionalLight position={[-8, 6, -4]} intensity={3.2} color="#EC4899" />
          <pointLight position={[0, -2, 3]} intensity={3.0} color="#A855F7" distance={10} />
          <pointLight position={[3, 2, 2]} intensity={2.5} color="#F59E0B" distance={8} />

          <Environment preset="studio" />

          {/* 3D GLB Models */}
          <Suspense fallback={<Fallback3D />}>
            <HeroRingModel sceneStateRef={sceneStateRef} isMobile={isMobile} />
            <FantasySwordModel sceneStateRef={sceneStateRef} isMobile={isMobile} />
            <ColorOrbModel sceneStateRef={sceneStateRef} isMobile={isMobile} />
          </Suspense>

          <ContactShadows
            position={[0, -2.5, 0]}
            opacity={0.6}
            scale={12}
            blur={2.5}
            far={6}
            color="#EC4899"
          />
        </Canvas>
      </div>

      {/* -----------------------------------------------------------
       * SCROLLABLE HTML CONTENT CONTAINER (relative z-10, id="scroll-container")
       * Interactive elements re-enable pointer-events-auto
       * ----------------------------------------------------------- */}
      <div id="scroll-container" className="relative z-10 pointer-events-none w-full">

        {/* ============================================================
         * SECTION 1: HERO SECTION (VISUAL IDENTITY & KINETIC RING)
         * Layout: Text content on Left (cols 6); 3D hero.glb on Right (x: ~2.0)
         * ============================================================ */}
        <section className="min-h-screen flex items-center px-6 sm:px-12 max-w-7xl mx-auto py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
            <div className="lg:col-span-6 flex flex-col items-start text-left space-y-6 pointer-events-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-950/80 border border-pink-500/40 text-pink-300 text-xs font-mono font-bold uppercase tracking-widest backdrop-blur-xl shadow-[0_0_20px_rgba(236,72,153,0.3)]">
                <Sparkles size={14} className="animate-pulse text-[#ec4899]" />
                <span>01 // VISUAL IDENTITY &amp; BRAND DESIGN</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-white">
                Kinetic Brand Identities &amp; <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ec4899] via-[#a855f7] to-[#6366f1] drop-shadow-[0_0_35px_rgba(236,72,153,0.3)]">
                  Visual Systems
                </span>
              </h1>

              <p className="text-neutral-400 text-base sm:text-xl leading-relaxed max-w-xl font-normal">
                We craft high-impact brand mark architectures, kinetic graphic language systems, and geometric vector identities that command instant industry authority.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#craftsmanship"
                  className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-[#ec4899] via-[#a855f7] to-[#6366f1] text-white font-bold text-xs tracking-wider uppercase shadow-[0_0_30px_rgba(236,72,153,0.4)] hover:shadow-[0_0_45px_rgba(236,72,153,0.7)] hover:scale-[1.03] transition-all"
                >
                  <span>Explore Craftsmanship</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </a>

                <a
                  href="#contact"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-[#131524]/90 border border-white/10 hover:border-pink-500 text-neutral-200 hover:text-white font-semibold text-xs tracking-wider uppercase shadow-lg hover:scale-[1.03] transition-all backdrop-blur-md"
                >
                  Get Custom Quote
                </a>
              </div>

              {/* Stat Highlights Footer */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10 w-full max-w-xl">
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">100+</div>
                  <div className="text-[10px] sm:text-xs text-pink-400 uppercase tracking-wider font-mono mt-1">Brand Systems</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#ec4899] to-[#a855f7]">4K / 8K</div>
                  <div className="text-[10px] sm:text-xs text-neutral-400 uppercase tracking-wider font-mono mt-1">Vector Assets</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">100%</div>
                  <div className="text-[10px] sm:text-xs text-indigo-400 uppercase tracking-wider font-mono mt-1">Pixel Precision</div>
                </div>
              </div>

             
            </div>
          </div>
        </section>

        {/* ============================================================
         * SECTION 2: PRECISION / CRAFTSMANSHIP SECTION (FANTASY SWORD)
         * Layout: Text/Card on Right (cols 6); 3D sword.glb on Left (x: ~ -2.0)
         * ============================================================ */}
        <section id="craftsmanship" className="min-h-screen flex items-center px-6 sm:px-12 max-w-7xl mx-auto py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
            <div className="lg:col-start-7 lg:col-span-6 flex flex-col items-start text-left space-y-6 pointer-events-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-purple-950/80 border border-purple-500/40 text-purple-300 font-mono text-xs font-bold tracking-wider w-fit shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                <Compass size={14} />
                <span>02 // SHARP PRECISION &amp; CRAFTSMANSHIP</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                Razor-Sharp Vectors &amp; <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#a855f7] via-[#ec4899] to-[#6366f1]">
                  Master Typography
                </span>
              </h2>

              <p className="text-neutral-400 text-sm sm:text-base leading-relaxed max-w-xl">
                Like a forged blade, every vector path, bezier curve, and typographic ligature is sculpted with mathematical precision and uncompromising detail.
              </p>

              {/* Glassmorphism Feature Card */}
              <div className="backdrop-blur-xl bg-[#131524]/80 border border-purple-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-4 w-full">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs font-mono font-semibold text-purple-400 tracking-wider uppercase">
                    VECTOR CRAFTSMANSHIP SPECS
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-pink-950/80 text-pink-300 border border-pink-500/30">
                    Sub-Pixel Detail
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider">Custom Ligatures &amp; Typography</h3>
                      <p className="text-xs text-neutral-400 mt-0.5">Custom type design, kerning architecture, and editorial layout grids.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-pink-400 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider">High-Precision Vector Illustration</h3>
                      <p className="text-xs text-neutral-400 mt-0.5">Infinite resolution scalable graphics, marketing icons, and technical schematics.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider">Color Harmony &amp; Print Systems</h3>
                      <p className="text-xs text-neutral-400 mt-0.5">Pantone, CMYK, and digital RGB color spaces with verified print fidelity.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
         * SECTION 3: DIMENSIONAL ART & PACKAGING (COLOR ORB)
         * Layout: Text/CTA on Left (cols 6); 3D color_orb.glb on Right (x: ~1.8)
         * ============================================================ */}
        <section className="min-h-screen flex items-center px-6 sm:px-12 max-w-7xl mx-auto py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
            <div className="lg:col-span-6 flex flex-col items-start text-left space-y-6 pointer-events-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-pink-950/80 border border-pink-500/40 text-pink-300 font-mono text-xs font-bold tracking-wider w-fit shadow-[0_0_15px_rgba(236,72,153,0.2)]">
                <Eye size={14} />
                <span>03 // DIMENSIONAL ART &amp; PACKAGING</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                3D Packaging &amp; <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ec4899] via-[#a855f7] to-[#f59e0b]">
                  Photorealistic Art
                </span>
              </h2>

              <p className="text-neutral-400 text-sm sm:text-base leading-relaxed max-w-xl">
                Break the 2D boundary with glass refractive shaders, 3D packaging mockups, spatial marketing graphics, and immersive digital product visualization.
              </p>

              {/* Capabilities Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full pt-2">
                <div className="backdrop-blur-xl bg-[#131524]/80 border border-pink-500/20 rounded-2xl p-5 shadow-xl space-y-2">
                  <div className="flex items-center gap-2 text-pink-400 font-bold text-sm">
                    <Brush size={16} />
                    <span>3D Product Mockups</span>
                  </div>
                  <p className="text-xs text-neutral-400">Photorealistic glass, metallic, and foil packaging renders.</p>
                </div>

                <div className="backdrop-blur-xl bg-[#131524]/80 border border-purple-500/20 rounded-2xl p-5 shadow-xl space-y-2">
                  <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                    <Layers size={16} />
                    <span>Key visual Materials</span>
                  </div>
                  <p className="text-xs text-neutral-400">High-resolution campaign visual assets for global brand launches.</p>
                </div>

                <div className="backdrop-blur-xl bg-[#131524]/80 border border-indigo-500/20 rounded-2xl p-5 shadow-xl space-y-2">
                  <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                    <Zap size={16} />
                    <span>Motion Showreels</span>
                  </div>
                  <p className="text-xs text-neutral-400">Dynamic 2D/3D motion graphics for social reels and product reveals.</p>
                </div>

                <div className="backdrop-blur-xl bg-[#131524]/80 border border-amber-500/20 rounded-2xl p-5 shadow-xl space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                    <Globe size={16} />
                    <span>WebGL &amp; Canvas Shaders</span>
                  </div>
                  <p className="text-xs text-neutral-400">Interactive web graphics optimized for high-speed digital experiences.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
         * SECTION 4: FINAL CTA & PROJECT DISCOVERY
         * Centered Showcase Layout
         * ============================================================ */}
        <section id="contact" className="min-h-screen flex items-center justify-center px-6 sm:px-12 max-w-5xl mx-auto py-24">
          <div className="w-full flex flex-col items-center text-center p-8 sm:p-14 rounded-3xl backdrop-blur-2xl bg-gradient-to-b from-[#131524]/90 via-[#0d0e15]/90 to-[#0d0e15]/90 border border-pink-500/40 shadow-[0_0_60px_rgba(236,72,153,0.25)] space-y-8 pointer-events-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-950/80 border border-pink-500/40 text-pink-300 text-xs font-mono font-bold uppercase tracking-widest shadow-lg">
              <Sparkles size={14} className="text-[#ec4899] animate-pulse" />
              <span>04 // START YOUR DESIGN TRANSFORMATION</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              Ready to Sculpt Your <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ec4899] via-[#a855f7] to-[#6366f1]">
                Brand Architecture?
              </span>
            </h2>

            <p className="text-neutral-300 text-sm sm:text-lg leading-relaxed max-w-2xl mx-auto font-light">
              Collaborate with our 3D graphics &amp; brand design studio to launch unforgettable visual identities, scalable UI systems, and spatial motion assets.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-5 pt-2">
              <Link
                to="/contact"
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-[#ec4899] via-[#a855f7] to-[#6366f1] text-white font-bold text-xs tracking-wider uppercase shadow-[0_0_35px_rgba(236,72,153,0.5)] hover:shadow-[0_0_50px_rgba(236,72,153,0.8)] hover:scale-[1.03] transition-all"
              >
                <Send size={16} />
                <span>Start Design Project</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#131524]/90 border border-white/20 hover:border-pink-400 text-neutral-200 hover:text-white font-semibold text-xs tracking-wider uppercase shadow-lg hover:scale-[1.03] transition-all backdrop-blur-md"
              >
                <Calendar size={16} className="text-pink-400" />
                <span>Book Discovery Call</span>
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
