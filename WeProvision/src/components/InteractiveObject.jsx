import React, { useRef, useState, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Float, Html, Center } from '@react-three/drei';
import * as THREE from 'three';
import { Sparkles } from 'lucide-react';

// Error Boundary for handling 3D model load errors gracefully
class ModelErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.warn(`Model failed to load for service ${this.props.serviceId}:`, error);
  }

  render() {
    if (this.state.hasError) {
      return <FallbackWireframeMesh color={this.props.color} />;
    }
    return this.props.children;
  }
}

// Inner GLTF model loader
function Model({ url, color }) {
  const { scene } = useGLTF(url);

  // Traverse materials to ensure metallic sci-fi finish
  scene.traverse((child) => {
    if (child.isMesh && child.material) {
      child.material.roughness = 0.3;
      child.material.metalness = 0.8;
    }
  });

  return (
    <Center>
      <primitive object={scene.clone()} />
    </Center>
  );
}

// Geometric wireframe fallback if model loading fails or while loading
function FallbackWireframeMesh({ color = '#F472B6' }) {
  const wireframeRef = useRef();

  useFrame((_, delta) => {
    if (wireframeRef.current) {
      wireframeRef.current.rotation.x += delta * 0.4;
      wireframeRef.current.rotation.y += delta * 0.6;
    }
  });

  return (
    <mesh ref={wireframeRef}>
      <icosahedronGeometry args={[1.2, 1]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.6}
        wireframe
        wireframeLinewidth={2}
      />
    </mesh>
  );
}

export default function InteractiveObject({ service, isActive, onSelect }) {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef();
  const rotationRef = useRef();
  const currentScale = useRef(service.scale || 1.0);

  const baseScale = service.scale || 1.0;
  const targetScale = isActive ? baseScale * 1.35 : hovered ? baseScale * 1.18 : baseScale;

  useFrame((_, delta) => {
    // Continuous idle rotation
    if (rotationRef.current) {
      rotationRef.current.rotation.y += delta * 0.45;
      
      // Tilt slightly on hover
      const targetTilt = hovered && !isActive ? 0.25 : 0;
      rotationRef.current.rotation.x = THREE.MathUtils.lerp(
        rotationRef.current.rotation.x,
        targetTilt,
        delta * 6
      );
    }

    // Smooth Lerp Scale
    if (groupRef.current) {
      currentScale.current = THREE.MathUtils.lerp(
        currentScale.current,
        targetScale,
        delta * 8
      );
      groupRef.current.scale.setScalar(currentScale.current);
    }
  });

  return (
    <Float
      speed={2.2}
      rotationIntensity={0.5}
      floatIntensity={0.8}
    >
      <group
        ref={groupRef}
        position={service.position}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(service.id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <group ref={rotationRef}>
          <ModelErrorBoundary serviceId={service.id} color={service.color}>
            <Suspense fallback={<FallbackWireframeMesh color={service.color} />}>
              <Model url={service.model} color={service.color} />
            </Suspense>
          </ModelErrorBoundary>
        </group>

        {/* Hover HTML Tooltip */}
        {hovered && !isActive && (
          <Html position={[0, 1.8, 0]} center distanceFactor={10} zIndexRange={[10, 0]}>
            <div className="pointer-events-none transition-all duration-300 transform scale-100 flex flex-col items-center">
              <div className="px-4 py-2 rounded-xl bg-[#170F25]/90 backdrop-blur-xl border border-white/20 shadow-[0_0_25px_rgba(168,85,247,0.5)] flex items-center gap-2 whitespace-nowrap">
                <span className="w-2 h-2 rounded-full bg-[#F472B6] animate-ping" />
                <span className="text-xs font-extrabold tracking-wider text-white uppercase font-mono">
                  {service.title}
                </span>
                <Sparkles size={13} className="text-[#C084FC]" />
              </div>
              <span className="text-[10px] font-mono tracking-widest text-[#F472B6] mt-1 bg-[#30204A]/80 px-2 py-0.5 rounded-full border border-white/10">
                CLICK TO ENTER WORLD ✦
              </span>
            </div>
          </Html>
        )}
      </group>
    </Float>
  );
}