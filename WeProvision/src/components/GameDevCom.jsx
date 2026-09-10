import React, { useRef, useEffect, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations, Float, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { useNearScreen } from '../hooks/useNearScreen';

useGLTF.preload('/3dModels/astro_bot.glb');

/* ============================================================
 * 3D ASTRO BOT MODEL COMPONENT FOR GAME DEV SHOWCASE
 * ============================================================ */
function AstroBotModel() {
  const groupRef = useRef();
  const { scene, animations } = useGLTF('/3dModels/astro_bot.glb');
  const { actions } = useAnimations(animations, groupRef);

  const mouse = useRef(new THREE.Vector2(0, 0));
  const smoothMouse = useRef(new THREE.Vector2(0, 0));

  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      Object.values(actions).forEach((action) => {
        if (action) {
          action.setLoop(THREE.LoopRepeat, Infinity);
          action.clampWhenFinished = false;
          action.enabled = true;
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

    window.addEventListener('mousemove', handleMouseMove);
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

    groupRef.current.rotation.y = mx * 0.4 + Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    groupRef.current.rotation.x = -my * 0.2;
  });

  return (
    <Float
      speed={2}
      rotationIntensity={0.3}
      floatIntensity={0.5}
      floatingRange={[-0.2, 0.2]}
    >
      <group ref={groupRef} position={[0, 0.1, 0]} scale={1}>
        <primitive object={scene} />
      </group>
    </Float>
  );
}

export default function GameDevCom() {
  const [sectionRef, isNear] = useNearScreen({ rootMargin: '250px 0px', once: false });

  return (
    <section ref={sectionRef} className="relative w-full min-h-screen bg-[#07050e] text-white flex items-center justify-center overflow-hidden px-6 lg:px-20 py-12 z-0">
      {/* Top and Bottom Section Blending Overlay Masks */}
      <div className="absolute top-0 inset-x-0 h-36 bg-gradient-to-b from-[#07050e] via-[#07050e]/60 to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 inset-x-0 h-36 bg-gradient-to-t from-[#07050e] via-[#07050e]/60 to-transparent pointer-events-none z-10" />

      <div className="w-full max-w-8xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        {/* LEFT SIDE: 3D Astro Bot Canvas */}
        <div className="w-full h-[320px] sm:h-[450px] lg:h-[680px] relative flex flex-col items-center justify-center overflow-hidden isolate z-0">
          <Canvas
            frameloop={isNear ? 'always' : 'never'}
            dpr={[1, 1.5]}
            camera={{ position: [0, 0, 7], fov: 45 }}
            className="w-full h-full"
          >
            <ambientLight intensity={1.5} />
            <directionalLight position={[5, 8, 5]} intensity={2.5} color="#c084fc" />
            <directionalLight position={[-5, 3, -2]} intensity={1.8} color="#38bdf8" />
            <pointLight position={[0, 2, 3]} intensity={2} color="#ec4899" />
            <Environment preset="city" />

            <Suspense fallback={null}>
              <AstroBotModel />
            </Suspense>

            <ContactShadows
              position={[0, -2.5, 0]}
              opacity={0.6}
              scale={10}
              blur={2.5}
              far={5}
              color="#000000"
            />
          </Canvas>
        </div>

        {/* RIGHT SIDE: Text Content */}
        <div className="flex flex-col mt-0 lg:-mt-30 items-start text-left z-10">

          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-[1px] bg-[#d946ef]"></span>
            <span className="text-xs lg:text-sm font-semibold tracking-widest text-[#d946ef] uppercase">
              Elite Game Development Studio
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-2">
            Crafting Next-Gen
          </h1>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight bg-gradient-to-r from-[#c084fc] via-[#f472b6] to-[#fb7185] bg-clip-text text-transparent mb-6 drop-shadow-[0_0_35px_rgba(217,70,239,0.3)]">
            Interactive Gaming Worlds
          </h2>

          <p className="text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl mb-8">
            We specialize in AAA-quality game development using Unreal Engine and Unity. From high-octane mechanics and stunning visual shaders to captivating level design and multiplayer networking, we bring epic game concepts to life.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link to="/services/game-development" className="group relative inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-white font-medium text-sm sm:text-base bg-gradient-to-r from-purple-600 to-pink-500 shadow-[0_0_20px_rgba(217,70,239,0.4)] hover:shadow-[0_0_30px_rgba(217,70,239,0.7)] transition-all duration-300">
              Explore Our Games
              <span className="transform group-hover:translate-x-1 transition-transform duration-200">→</span>
            </Link>

            <button className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-white font-medium text-sm sm:text-base border border-gray-700 hover:border-gray-500 bg-black/30 backdrop-blur-sm transition-all duration-300">
              Start Project
              <span className="transform group-hover:translate-x-1 transition-transform duration-200">→</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}