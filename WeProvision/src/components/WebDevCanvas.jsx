import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Float, Environment, Svg } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

// Selected 3D Assets
const ASSETS = {
  laptop: '/3dModels/macbook_pro_m3_16_inch_2024.glb',
  laptopAlt: '/3dModels/web dev.glb',
  react: '/3dModels/react_logo.glb',
  tailwind: '/3dModels/tailwind_css_logo__3d_model.glb',
  nextjsSvg: '/3dModels/icons8-next.js.svg',
  nodejs: '/3dModels/node.js_logo__3d_model.glb',
  mongodb: '/3dModels/mongodb_logo__3d_model.glb',
};

// Preload GLTF assets
[
  ASSETS.laptop,
  ASSETS.react,
  ASSETS.tailwind,
  ASSETS.nodejs,
  ASSETS.mongodb,
].forEach((path) => {
  try {
    useGLTF.preload(path);
  } catch (e) { }
});

/* ============================================================
 * MODEL LOADERS WITH SCENE CLONING
 * ============================================================ */
function LaptopModel({ scale = 0.08 }) {
  const { scene } = useGLTF(ASSETS.laptop);
  const cloned = useMemo(() => scene.clone(true), [scene]);
  return <primitive object={cloned} scale={scale} />;
}

function ReactLogoModel({ scale = 0.3 }) {
  const { scene } = useGLTF(ASSETS.react);
  const cloned = useMemo(() => scene.clone(true), [scene]);
  return <primitive object={cloned} scale={scale} />;
}

function TailwindLogoModel({ scale = 10 }) {
  const { scene } = useGLTF(ASSETS.tailwind);
  const cloned = useMemo(() => scene.clone(true), [scene]);
  return <primitive object={cloned} scale={scale} />;
}

function NodejsLogoModel({ scale = 15 }) {
  const { scene } = useGLTF(ASSETS.nodejs);
  const cloned = useMemo(() => scene.clone(true), [scene]);
  return <primitive object={cloned} scale={scale} />;
}

function MongodbLogoModel({ scale = 15 }) {
  const { scene } = useGLTF(ASSETS.mongodb);
  const cloned = useMemo(() => scene.clone(true), [scene]);
  return <primitive object={cloned} scale={scale} />;
}

function NextJsBadge({ scale = 0.8 }) {
  return (
    <group scale={scale}>
      {/* Cylinder Coin/Badge Base */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.45, 0.45, 0.08, 32]} />
        <meshStandardMaterial
          color="#0e071a"
          metalness={0.9}
          roughness={0.1}
          emissive="#c084fc"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Front Side SVG */}
      <group position={[-0.3, 0.3, 0.05]} scale={0.012}>
        <Svg src={ASSETS.nextjsSvg} />
      </group>

      {/* Back Side SVG (Flipped 180° on Y-Axis) */}
      <group position={[0.3, 0.3, -0.05]} rotation={[0, Math.PI, 0]} scale={0.012}>
        <Svg src={ASSETS.nextjsSvg} />
      </group>
    </group>
  );
}

/* ============================================================
 * ROTATING TECH BADGE WITH FLOAT WRAPPER
 * ============================================================ */
function TechBadge({ children, animRef }) {
  const rotationGroup = useRef();

  useFrame((_, delta) => {
    if (rotationGroup.current) {
      rotationGroup.current.rotation.y += delta * 0.8;
    }
  });

  return (
    <group ref={animRef}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.25}>
        <group ref={rotationGroup}>{children}</group>
      </Float>
    </group>
  );
}

/* ============================================================
 * 3D SCENE CHOREOGRAPHY
 * ============================================================ */
function SceneContent({ pageRef }) {
  const laptopAnimRef = useRef();

  // Logo Target Refs
  const reactRef = useRef();
  const tailwindRef = useRef();
  const nextjsRef = useRef();
  const nodejsRef = useRef();
  const mongodbRef = useRef();

  useGSAP(
    () => {
      if (!pageRef?.current) return;

      const laptop = laptopAnimRef.current;
      const reactLogo = reactRef.current;
      const tailwindLogo = tailwindRef.current;
      const nextjsLogo = nextjsRef.current;
      const nodejsLogo = nodejsRef.current;
      const mongodbLogo = mongodbRef.current;

      if (!laptop || !reactLogo || !tailwindLogo || !nextjsLogo || !nodejsLogo || !mongodbLogo) return;

      // ============================================================
      // 1. EXACT HERO STARTING STATE
      // ============================================================
      gsap.set(laptop.position, { x: 1.3, y: -0.7, z: 0 });
      gsap.set(laptop.rotation, { x: 0.12, y: -0.4, z: 0 });
      gsap.set(laptop.scale, { x: 0.85, y: 0.85, z: 0.85 });

      const allLogos = [reactLogo, tailwindLogo, nextjsLogo, nodejsLogo, mongodbLogo];
      allLogos.forEach((logo) => {
        if (logo) {
          gsap.set(logo.scale, { x: 0, y: 0, z: 0 });
          gsap.set(logo.position, { x: 1.3, y: -0.3, z: 0 });
        }
      });

      // ============================================================
      // 2. MASTER TIMELINE WITH SMOOTH SCRUB
      // ============================================================
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pageRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.0, // Smooth 1-second drag dampening
        },
      });

      // ============================================================
      // STAGE 1: HERO -> FRONTEND (Triggers between 0.20 and 0.45)
      // ============================================================
      tl.to(
        laptop.position,
        { x: 1.85, y: -0.15, z: 0, ease: 'power1.inOut', duration: 0.25 },
        0.20
      )
        .to(
          laptop.rotation,
          { x: 0.08, y: -0.45, z: 0, ease: 'power1.inOut', duration: 0.25 },
          0.20
        )

        // 1. React Logo (Top of the middle gap)
        .fromTo(
          reactLogo.position,
          { x: 1.7, y: 0.45, z: 0.1 },
          { x: 0.2, y: 0.85, z: 0.85, ease: 'back.out(1.5)', duration: 0.18 },
          0.22
        )
        .fromTo(
          reactLogo.scale,
          { x: 0, y: 0, z: 0 },
          { x: 0.32, y: 0.32, z: 0.32, ease: 'back.out(1.5)', duration: 0.18 },
          0.22
        )

        // 2. Tailwind Logo (Center of the gap - Scaled Up)
        .fromTo(
          tailwindLogo.position,
          { x: 1.7, y: 0.35, z: 0.1 },
          { x: 0.45, y: 0.05, z: 0.95, ease: 'back.out(1.5)', duration: 0.18 },
          0.25
        )
        .fromTo(
          tailwindLogo.scale,
          { x: 0, y: 0, z: 0 },
          { x: 0.48, y: 0.48, z: 0.48, ease: 'back.out(1.5)', duration: 0.18 },
          0.25
        )

        // 3. Next.js Badge (Bottom of the gap)
        .fromTo(
          nextjsLogo.position,
          { x: 1.7, y: 0.25, z: 0.1 },
          { x: 0.2, y: -0.75, z: 0.85, ease: 'back.out(1.5)', duration: 0.17 },
          0.28
        )
        .fromTo(
          nextjsLogo.scale,
          { x: 0, y: 0, z: 0 },
          { x: 0.65, y: 0.65, z: 0.65, ease: 'back.out(1.5)', duration: 0.17 },
          0.28
        );

      // ============================================================
      // STAGE 2: FRONTEND -> BACKEND (Retraction & Left Screen Ejection)
      // ============================================================

      // 1. Frontend logos retract into right laptop screen & scale down to 0 before laptop shifts
      tl.to(
        [reactLogo.position, tailwindLogo.position, nextjsLogo.position],
        {
          x: 1.7,
          y: 0.35,
          z: 0.1,
          ease: 'power1.inOut',
          duration: 0.02,
        },
        0.48
      )
        .to(
          [reactLogo.scale, tailwindLogo.scale, nextjsLogo.scale],
          {
            x: 0,
            y: 0,
            z: 0,
            ease: 'power1.inOut',
            duration: 0.02,
          },
          0.48
        )

        // 2. Laptop slides from Right (x: 1.85) to Left (x: -1.75) column
        .to(
          laptop.position,
          { x: -1.75, y: -0.15, z: 0, ease: 'power1.inOut', duration: 0.05 },
          0.50
        )
        .to(
          laptop.rotation,
          { x: 0.08, y: 0.45, z: 0, ease: 'power1.inOut', duration: 0.05 },
          0.50
        )

        // 3. Node.js bursts out from left-rotated screen surface (x: -1.55, y: 0.35, z: 0.2) after laptop settles
        .fromTo(
          nodejsLogo.position,
          { x: -1.55, y: 0.35, z: 0.2 },
          { x: -0.3, y: 0.55, z: 0.9, ease: 'back.out(1.5)', duration: 0.14 },
          0.58
        )
        .fromTo(
          nodejsLogo.scale,
          { x: 0, y: 0, z: 0 },
          { x: 0.35, y: 0.35, z: 0.35, ease: 'back.out(1.5)', duration: 0.14 },
          0.58
        )

        // 4. MongoDB bursts out from left-rotated screen surface (x: -1.55, y: 0.35, z: 0.2) after laptop settles
        .fromTo(
          mongodbLogo.position,
          { x: -1.55, y: 0.35, z: 0.2 },
          { x: -0.4, y: -0.55, z: 0.9, ease: 'back.out(1.5)', duration: 0.14 },
          0.60
        )
        .fromTo(
          mongodbLogo.scale,
          { x: 0, y: 0, z: 0 },
          { x: 0.35, y: 0.35, z: 0.35, ease: 'back.out(1.5)', duration: 0.14 },
          0.60
        );

      // ============================================================
      // STAGE 3: BACKEND -> FULL ECOSYSTEM CTA (Triggers 0.78 to 1.00)
      // ============================================================
      tl.to(
        laptop.position,
        { x: 0, y: -0.85, z: -0.3, ease: 'power1.inOut', duration: 0.18 },
        0.78
      )
        .to(
          laptop.rotation,
          { x: 0.2, y: 0, z: 0, ease: 'power1.inOut', duration: 0.18 },
          0.78
        )
        .to(
          laptop.scale,
          { x: 0.8, y: 0.8, z: 0.8, ease: 'power1.inOut', duration: 0.18 },
          0.78
        );

      // React logo emerges from the laptop screen center into top-center peak
      tl.fromTo(
        reactLogo.position,
        { x: -2, y: 0.5, z: 0.1 }, // Starts at laptop screen center
        { x: 0, y: 1.55, z: 0, ease: 'power1.out', duration: 0.12 },
        0.80
      )
        .fromTo(
          reactLogo.scale,
          { x: 0, y: 0, z: 0 },
          { x: 0.35, y: 0.35, z: 0.35, ease: 'power1.out', duration: 0.12 },
          0.80
        )

        // Tailwind logo emerges from laptop screen to Mid-Left
        .fromTo(
          tailwindLogo.position,
          { x: -2, y: 0.5, z: -0.1 }, // Starts at laptop screen center
          { x: -1.0, y: 1.3, z: 0, ease: 'power1.out', duration: 0.12 },
          0.82
        )
        .fromTo(
          tailwindLogo.scale,
          { x: 0, y: 0, z: 0 },
          { x: 0.24, y: 0.24, z: 0.24, ease: 'power1.out', duration: 0.12 },
          0.82
        )

        // Next.js badge emerges from laptop screen to Far Left
        .fromTo(
          nextjsLogo.position,
          { x: -2, y: 0.5, z: -0.1 }, // Starts at laptop screen center
          { x: -2.0, y: 0.7, z: 0, ease: 'power1.out', duration: 0.12 },
          0.84
        )
        .fromTo(
          nextjsLogo.scale,
          { x: 0, y: 0, z: 0 },
          { x: 0.6, y: 0.6, z: 0.6, ease: 'power1.out', duration: 0.12 },
          0.84
        )

        // Node.js (Mid-Right) - transitions from its backend spot
        .to(
          nodejsLogo.position,
          { x: 1.0, y: 1.3, z: 0, ease: 'power1.out', duration: 0.12 },
          0.86
        )
        .to(
          nodejsLogo.scale,
          { x: 0.25, y: 0.25, z: 0.25, ease: 'power1.out', duration: 0.12 },
          0.86
        )

        // MongoDB (Far Right) - transitions from its backend spot
        .to(
          mongodbLogo.position,
          { x: 2.0, y: 0.7, z: 0, ease: 'power1.out', duration: 0.12 },
          0.88
        )
        .to(
          mongodbLogo.scale,
          { x: 0.25, y: 0.25, z: 0.25, ease: 'power1.out', duration: 0.12 },
          0.88
        );
    },
    { scope: pageRef, dependencies: [] }
  );

  return (
    <group>
      {/* Laptop Centerpiece */}
      <group ref={laptopAnimRef}>
        <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
          <LaptopModel />
        </Float>
      </group>

      {/* Badges with Float Wrappers */}
      <TechBadge animRef={reactRef}>
        <ReactLogoModel />
      </TechBadge>
      <TechBadge animRef={tailwindRef}>
        <TailwindLogoModel />
      </TechBadge>
      <TechBadge animRef={nextjsRef}>
        <NextJsBadge />
      </TechBadge>
      <TechBadge animRef={nodejsRef}>
        <NodejsLogoModel />
      </TechBadge>
      <TechBadge animRef={mongodbRef}>
        <MongodbLogoModel />
      </TechBadge>
    </group>
  );
}
/* ============================================================
 * MAIN CANVAS COMPONENT (z-0 pointer-events-none fixed)
 * ============================================================ */
export default function WebDevCanvas({ pageRef }) {
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
      <ambientLight intensity={0.9} />
      <directionalLight position={[8, 12, 6]} intensity={3} color="#00F0FF" />
      <directionalLight position={[-8, -6, -4]} intensity={2.5} color="#EC4899" />
      <pointLight position={[0, 0, 1]} intensity={4} color="#C084FC" distance={7} />

      <Environment preset="city" />

      <Suspense fallback={null}>
        <SceneContent pageRef={pageRef} />
      </Suspense>
    </Canvas>
  );
}