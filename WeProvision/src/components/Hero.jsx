import React, { useEffect, useRef, Suspense } from 'react';
import { ArrowRight } from 'lucide-react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useAnimations, Float, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { useNearScreen } from '../hooks/useNearScreen';

useGLTF.preload('/3dModels/robot.glb');

/* =========================================================
   3D ROBOT MODEL (Responsive Scale & Position)
========================================================= */

export function RobotModel() {
  const groupRef = useRef();
  const { scene, animations } = useGLTF('/3dModels/robot.glb');
  const { actions } = useAnimations(animations, groupRef);
  const { size } = useThree();

  // Desktop threshold matching Tailwind's lg breakpoint (1024px)
  const isDesktop = size.width >= 1024;

  // Discrete coordinates: adjust these numbers directly
  const desktopConfig = {
    scale: 1.8,
    position: [-0.2, -1.5, 0],
  };

  const mobileConfig = {
    scale: 1.35,
    position: [0, -1.1, 0],
  };

  const currentConfig = isDesktop ? desktopConfig : mobileConfig;

  const mouse = useRef(new THREE.Vector2(0, 0));
  const smoothMouse = useRef(new THREE.Vector2(0, 0));

  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      Object.keys(actions).forEach((key) => {
        const action = actions[key];
        if (action) {
          action.setLoop(THREE.LoopRepeat, Infinity);
          action.clampWhenFinished = false;
          action.reset().play();
        }
      });
    }
  }, [actions]);

  useEffect(() => {
    const handleMouseMove = (event) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;

    smoothMouse.current.x = THREE.MathUtils.lerp(
      smoothMouse.current.x,
      mouse.current.x,
      0.05
    );
    smoothMouse.current.y = THREE.MathUtils.lerp(
      smoothMouse.current.y,
      mouse.current.y,
      0.05
    );

    const mx = smoothMouse.current.x;
    const my = smoothMouse.current.y;

    groupRef.current.rotation.y = mx * 0.4 + Math.sin(state.clock.elapsedTime * 0.6) * 0.15;
    groupRef.current.rotation.x = -my * 0.25;
  });

  return (
    <Float
      speed={2}
      rotationIntensity={0.3}
      floatIntensity={0.5}
      floatingRange={[-0.15, 0.15]}
    >
      <group
        ref={groupRef}
        position={currentConfig.position}
        scale={currentConfig.scale}
      >
        <primitive object={scene} />
      </group>
    </Float>
  );
}

export const DigitalCore = RobotModel;

/* =========================================================
   HERO
========================================================= */

export default function HeroSection() {
  const [sectionRef, isNear] = useNearScreen({ rootMargin: '250px 0px', once: false });

  return (
    <section
      ref={sectionRef}
      id="home"
      className="
        relative
        w-full
        min-h-screen
        lg:h-screen
        lg:min-h-[650px]
        flex
        flex-col
        lg:flex-row
        items-center
        justify-center
        lg:justify-start
        overflow-hidden
        bg-black
        pt-20
        pb-12
        lg:py-0
      "
    >
      {/* Background Overlays */}
      <div
        className="
          absolute
          inset-0
          z-[1]
          bg-gradient-to-b
          lg:bg-gradient-to-r
          from-[#05030b]
          via-[#0b0819]/90
          to-[#09020f]/50
          pointer-events-none
        "
      />

      {/* Bottom fade */}
      <div
        className="
          absolute
          inset-x-0
          bottom-0
          h-32
          lg:h-48
          z-[2]
          bg-gradient-to-t
          from-black
          to-transparent
          pointer-events-none
        "
      />

      {/* Purple atmospheric glow */}
      <div
        className="
          absolute
          right-1/2
          translate-x-1/2
          lg:translate-x-0
          lg:right-[10%]
          top-[10%]
          lg:top-[25%]
          w-[300px]
          sm:w-[450px]
          lg:w-[500px]
          h-[300px]
          sm:h-[450px]
          lg:h-[500px]
          rounded-full
          bg-purple-600/20
          blur-[100px]
          lg:blur-[140px]
          z-[1]
          pointer-events-none
        "
      />

      {/* Pink atmospheric glow */}
      <div
        className="
          absolute
          right-1/2
          translate-x-1/2
          lg:translate-x-0
          lg:right-[25%]
          top-[30%]
          lg:top-[45%]
          w-[240px]
          sm:w-[320px]
          lg:w-[350px]
          h-[240px]
          sm:h-[320px]
          lg:h-[350px]
          rounded-full
          bg-pink-500/15
          blur-[80px]
          lg:blur-[120px]
          z-[1]
          pointer-events-none
        "
      />

      {/* 3D Robot Canvas */}
      <div
        className="
          relative
          order-1
          w-full
          h-[360px]
          sm:h-[420px]
          z-[5]

          lg:order-none
          lg:absolute
          lg:z-[4]
          lg:right-[-2%]
          lg:top-1/2
          lg:-translate-y-1/2
          lg:w-[63vw]
          lg:h-[85vh]
          lg:min-w-[550px]

          pointer-events-none
        "
      >
        <Canvas
          frameloop={isNear ? 'always' : 'never'}
          camera={{
            position: [0, 0, 7],
            fov: 45,
          }}
          dpr={[1, 1.5]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
        >
          <ambientLight intensity={1.5} />
          <directionalLight position={[5, 5, 5]} intensity={2.5} color="#c084fc" />
          <directionalLight position={[-5, 3, -2]} intensity={1.8} color="#38bdf8" />
          <pointLight position={[0, 2, 3]} intensity={2} color="#ec4899" />
          <Environment preset="city" />

          <Suspense fallback={null}>
            <RobotModel />
          </Suspense>

          <ContactShadows
            position={[0, -2.2, 0]}
            opacity={0.6}
            scale={10}
            blur={2.5}
            far={5}
            color="#000000"
          />
        </Canvas>
      </div>

      {/* Text & Content */}
      <div
        className="
          relative
          order-2
          lg:order-none
          z-10
          max-w-8xl
          w-full
          mx-auto
          px-6
          sm:px-12
          md:px-16
          lg:px-20
          text-center
          lg:text-left
          flex
          flex-col
          items-center
          lg:items-start
          justify-center
          pointer-events-none
        "
      >
        {/* Eyebrow */}
        <div
          className="
            mb-4
            lg:mb-5
            flex
            items-center
            justify-center
            lg:justify-start
            gap-3
            pointer-events-auto
          "
        >
          <span
            className="
              hidden
              sm:inline-block
              w-8
              h-[1px]
              bg-gradient-to-r
              from-purple-500
              to-pink-500
            "
          />

          <span
            className="
              text-xs
              sm:text-sm
              font-medium
              tracking-[0.25em]
              sm:tracking-[0.3em]
              uppercase
              text-purple-300
            "
          >
            Digital Innovation Studio
          </span>
        </div>

        {/* Main Heading */}
        <h1
          className="
            text-3xl
            sm:text-5xl
            md:text-6xl
            lg:text-[63px]
            font-extrabold
            text-white
            tracking-tight
            leading-[1.15]
            lg:leading-[1.08]
            mb-4
            lg:mb-6
          "
        >
          Transforming Ideas into
          <br className="hidden sm:inline" />{' '}
          <span
            className="
              bg-clip-text
              text-transparent
              bg-gradient-to-r
              from-[#C084FC]
              via-[#F472B6]
              to-[#E879F9]
              drop-shadow-[0_0_35px_rgba(244,114,182,0.6)]
            "
          >
            Digital Realities
          </span>
        </h1>

        {/* Description */}
        <p
          className="
            max-w-md
            sm:max-w-lg
            lg:max-w-xl
            text-sm
            sm:text-base
            md:text-lg
            text-zinc-300
            font-normal
            leading-relaxed
            mb-8
            lg:mb-10
          "
        >
          We build immersive digital experiences through
          AR/VR, game development, web development,
          UI/UX design, 3D modeling, and next-generation
          interactive technologies.
        </p>

        {/* Buttons */}
        <div
          className="
            flex
            flex-col
            sm:flex-row
            items-center
            justify-center
            lg:justify-start
            gap-3
            sm:gap-6
            w-full
            sm:w-auto
            pointer-events-auto
          "
        >
          {/* Primary */}
          <a
            href="#services"
            className="
              w-full
              sm:w-auto
              group
              px-7
              py-3
              rounded-full
              text-sm
              font-semibold
              text-white
              bg-gradient-to-r
              from-[#9333EA]
              to-[#EC4899]
              hover:opacity-90
              transition-all
              duration-300
              flex
              items-center
              justify-center
              gap-2
              shadow-[0_0_25px_rgba(236,72,153,0.5)]
            "
          >
            <span>Explore Our Services</span>
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </a>

          {/* Secondary */}
          <a
            href="#contact"
            className="
              w-full
              sm:w-auto
              group
              px-7
              py-3
              rounded-full
              text-sm
              font-semibold
              text-white
              bg-black/30
              backdrop-blur-md
              border
              border-white/30
              hover:border-white/60
              hover:bg-white/10
              transition-all
              duration-300
              flex
              items-center
              justify-center
              gap-2
            "
          >
            <span>Get In Touch</span>
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </a>
        </div>
      </div>

      {/* Scroll Indicator (Desktop Only) */}
      <div
        className="
          hidden
          lg:flex
          absolute
          bottom-8
          left-1/2
          -translate-x-1/2
          z-10
          flex-col
          items-center
          gap-2
          text-white/40
        "
      >
        <span
          className="
            text-[9px]
            tracking-[0.35em]
            uppercase
          "
        >
          Scroll
        </span>

        <div
          className="
            w-[1px]
            h-10
            bg-gradient-to-b
            from-purple-400
            to-transparent
          "
        />
      </div>
    </section>
  );
}