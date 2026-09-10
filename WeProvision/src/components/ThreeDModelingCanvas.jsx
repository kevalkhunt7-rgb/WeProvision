import React, { useRef, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations, Float, Environment } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

// Model Asset Paths with robust fallback support
const ASSETS = {
  suitcase: '/3dModels/suitcase.glb',
  drone: '/3dModels/cyber-drone.glb',
  house: '/3dModels/house.glb',
};

// Preload GLTF assets
[ASSETS.suitcase, ASSETS.drone, ASSETS.house].forEach((path) => {
  try {
    useGLTF.preload(path);
  } catch (e) { }
});

/* ============================================================
 * MODEL LOADERS WITH SINGLE-PLAY ANIMATION (PLAY ONCE)
 * ============================================================ */
function SuitcaseModel({ scale = 0.5 }) {
  const groupRef = useRef();
  const { scene, animations } = useGLTF(ASSETS.suitcase);
  const { actions } = useAnimations(animations, groupRef);

  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      Object.keys(actions).forEach((key) => {
        const action = actions[key];
        if (action) {
          action.reset();
          action.setLoop(THREE.LoopOnce, 1);
          action.clampWhenFinished = true;
          action.play();
        }
      });
    }
  }, [actions]);

  return (
    <group ref={groupRef}>
      <primitive object={scene} scale={scale} />
    </group>
  );
}

function CyberDroneModel({ scale = 1 }) {
  const groupRef = useRef();
  const { scene, animations } = useGLTF(ASSETS.drone);
  const { actions } = useAnimations(animations, groupRef);

  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      Object.keys(actions).forEach((key) => {
        const action = actions[key];
        if (action) {
          action.reset();
          action.setLoop(THREE.LoopOnce, 1);
          action.clampWhenFinished = true;
          action.play();
        }
      });
    }
  }, [actions]);

  return (
    <group ref={groupRef}>
      <primitive object={scene} scale={scale} />
    </group>
  );
}

function HouseModel({ scale = 0.2
}) {
  const groupRef = useRef();
  const { scene, animations } = useGLTF(ASSETS.house);
  const { actions } = useAnimations(animations, groupRef);

  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      Object.keys(actions).forEach((key) => {
        const action = actions[key];
        if (action) {
          action.reset();
          action.setLoop(THREE.LoopOnce, 1);
          action.clampWhenFinished = true;
          action.play();
        }
      });
    }
  }, [actions]);

  return (
    <group ref={groupRef}>
      <primitive object={scene} scale={scale} />
    </group>
  );
}

/* ============================================================
 * 3D SCENE CHOREOGRAPHY & GSAP SCROLLTIMELINE
 * ============================================================ */
function SceneContent({ pageRef }) {
  const suitcaseRef = useRef();
  const droneRef = useRef();
  const houseRef = useRef();

  useGSAP(
    () => {
      if (!pageRef?.current) return;

      const suitcase = suitcaseRef.current;
      const drone = droneRef.current;
      const house = houseRef.current;

      if (!suitcase || !drone || !house) return;

      // ============================================================
      // 1. SECTION 1: HERO INITIAL STATE (Suitcase Model on Right Side)
      // Suitcase acts as main hero element on the right side of the screen.
      // Drone starts nestled deep INSIDE the open purple metallic suitcase tray cavity.
      // House model is completely hidden (scale 0) during Stage 1 & 2.
      // ============================================================
      gsap.set(suitcase.position, { x: 1.5, y: -0.9, z: 0 });
      gsap.set(suitcase.rotation, { x: 0.5, y: -0.2, z: 0.1 });
      gsap.set(suitcase.scale, { x: 1.1, y: 1.1, z: 1.1 });

      // Drone starts small tucked deep INSIDE the open metallic suitcase tray cavity
      gsap.set(drone.position, { x: -1.35, y: -0.9, z: 10 });
      gsap.set(drone.rotation, { x: 0.1, y: -0.5, z: 0.1 });
      gsap.set(drone.scale, { x: 0.10, y: 0.10, z: 0.10 });

      // House Model starts completely hidden (scale 0)
      gsap.set(house.position, { x: 0, y: -1.0, z: -3.0 });
      gsap.set(house.rotation, { x: 0.05, y: 0.2, z: 0 });
      gsap.set(house.scale, { x: 0, y: 0, z: 0 });

      // ============================================================
      // 2. MASTER SCRUBBED SCROLL TIMELINE (0.00 -> 1.00)
      // ============================================================
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pageRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.1, // Near-instant 1:1 scroll synchronization (removes 1.2s lag)
          fastScrollEnd: true,
        },
      });

      // ============================================================
      // STAGE 1 -> STAGE 2: HERO TO DRONE FOCUS (0.00 -> 0.33)
      // Phase 1: Drone lifts straight UP out of its initial position inside the suitcase tray.
      // Phase 2: Drone flies across to right column & expands to 0.65x while suitcase moves upside off-screen.
      // ============================================================

      // Phase 1: Vertical Takeoff Launch straight out from initial position inside suitcase tray
      tl.fromTo(
        drone.position,
        { x: 1.35, y: -0.06, z: 0.5 },
        { x: 1.35, y: 0.75, z: 0.8, ease: 'power2.out', duration: 0.12 },
        0.02
      )
        .fromTo(
          drone.scale,
          { x: 0.10, y: 0.10, z: 0.10 },
          { x: 0.25, y: 0.25, z: 0.25, ease: 'power2.out', duration: 0.12 },
          0.02
        )
        .to(
          drone.rotation,
          { x: -0.15, y: -0.2, z: 0.05, ease: 'power2.out', duration: 0.12 },
          0.02
        )

        // Phase 2: Flies across to Section 2 right column (x: 3.0) & scales to sleek size (0.38) angled nicely away from card
        .to(
          drone.position,
          { x: 2.0, y: 0.0, z: 1.0, ease: 'power1.inOut', duration: 0.18 },
          0.14
        )
        .to(
          drone.scale,
          { x: 0.38, y: 0.38, z: 0.38, ease: 'power1.inOut', duration: 0.18 },
          0.14
        )
        .to(
          drone.rotation,
          { x: 0.1, y: Math.PI * 1.7, z: -0.1, ease: 'power1.inOut', duration: 0.18 },
          0.14
        )

        // Suitcase moves upside off-screen smoothly during Phase 2
        .to(
          suitcase.position,
          { x: 1.5, y: 4.5, z: -3.0, ease: 'power1.inOut', duration: 0.20 },
          0.10
        )
        .to(
          suitcase.rotation,
          { x: -0.4, y: Math.PI * 0.5, z: -0.2, ease: 'power1.inOut', duration: 0.20 },
          0.10
        )
        .to(
          suitcase.scale,
          { x: 0, y: 0, z: 0, ease: 'power1.inOut', duration: 0.20 },
          0.10
        );

      // ============================================================
      // STAGE 2 -> STAGE 3: SECTION 3 "INSIDE THE ENVIRONMENT" (0.45 -> 0.72)
      // 1. House Model remains SCALE 0 in Section 2, ONLY emerging at 0.48 when Section 3 enters!
      // 2. Drone flies HIGH OVERHEAD (y: 0.85) above the Section 3 card box across to left (x: -0.8),
      //    then swoops down into the left House Model (x: -1.7, y: -0.4) and shrinks to 0 inside!
      // ============================================================
      tl.fromTo(
        house.position,
        { x: -1.7, y: -0.5, z: -0.5 },
        { x: -1.7, y: -0.5, z: -0.5, ease: 'none', duration: 0.24 },
        0.48
      )
        .fromTo(
          house.scale,
          { x: 0, y: 0, z: 0 },
          { x: 0.60, y: 0.60, z: 0.60, ease: 'power1.out', duration: 0.18 },
          0.48
        )
        .fromTo(
          house.rotation,
          { x: 0.1, y: -0.2, z: 0 },
          { x: 0.1, y: 0.2, z: 0, ease: 'power1.out', duration: 0.24 },
          0.48
        )

        // Phase 1: Drone flies HIGH OVERHEAD (y: 0.85) above the Section 3 card top border across to left (x: -0.8)
        .to(
          drone.position,
          { x: -0.8, y: 0.50, z: 1.2, ease: 'power1.out', duration: 0.14 },
          0.45
        )
        .to(
          drone.scale,
          { x: 0.20, y: 0.20, z: 0.20, ease: 'power1.out', duration: 0.14 },
          0.45
        )

        // Phase 2: Drone swoops down into the House Model on the empty left side (x: -1.7, y: -0.4) & disappears inside (scale -> 0)
        .to(
          drone.position,
          { x: -1.7, y: -0.4, z: -0.2, ease: 'power1.in', duration: 0.30 },
          0.59
        )
        .to(
          drone.scale,
          { x: 0, y: 0, z: 0, ease: 'power2.in', duration: 0.13 },
          0.59
        )
        .to(
          drone.rotation,
          { x: -0.1, y: Math.PI * 3.5, z: 0.1, ease: 'power1.inOut', duration: 0.27 },
          0.45
        );

      // ============================================================
      // STAGE 3 -> STAGE 4: SECTION 4 "WELCOME INSIDE" (0.70 -> 1.00)
      // House model scales up gracefully on scroll to fill the upper background.
      // ============================================================
      tl.to(
        house.position,
        { x: 0, y: 0.3, z: 1.5, ease: 'power1.inOut', duration: 0.30 },
        0.70
      )
        .to(
          house.scale,
          { x: 2.2, y: 2.2, z: 2.2, ease: 'power1.inOut', duration: 0.30 },
          0.70
        )
        .to(
          house.rotation,
          { x: 0.1, y: Math.PI * 0.4, z: 0, ease: 'power1.inOut', duration: 0.30 },
          0.70
        );
    },
    { scope: pageRef, dependencies: [] }
  );

  return (
    <group>
      {/* Suitcase Model in Hero & Environment */}
      <group ref={suitcaseRef}>

        <SuitcaseModel />

      </group>

      {/* Cyber Drone */}
      <group ref={droneRef}>
        <Float speed={2} rotationIntensity={0.15} floatIntensity={0.25}>
          <CyberDroneModel />
        </Float>
      </group>

      {/* House Model (Deep Zoom Climax) */}
      <group ref={houseRef}>
        <HouseModel />
      </group>
    </group>
  );
}

/* ============================================================
 * MAIN CANVAS COMPONENT (Fixed Background Layer - z-0)
 * ============================================================ */
export default function ThreeDModelingCanvas({ pageRef }) {
  return (
    <Canvas
      style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 6.5], fov: 38 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
      }}
    >
      <ambientLight intensity={1.0} color="#1f1435" />
      <directionalLight position={[8, 12, 6]} intensity={3.5} color="#00F0FF" />
      <directionalLight position={[-8, -6, -4]} intensity={2.8} color="#EC4899" />
      <pointLight position={[0, 0, 2]} intensity={4.5} color="#C084FC" distance={8} />

      <Environment preset="city" />

      <Suspense fallback={null}>
        <SceneContent pageRef={pageRef} />
      </Suspense>
    </Canvas>
  );
}
