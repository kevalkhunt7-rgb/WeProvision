import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

useGLTF.preload('/3dModels/VR-Model.glb');

/**
 * 3D VR Headset Model Component
 * Handles model rendering, submesh explosion for optics showcase,
 * idle floating, and smooth mouse tilt layering.
 */
export function VRHeadsetModel({
  transformState = {
    position: [0, 0, 0],
    rotation: [0.1, -0.3, 0],
    scale: 9,
    exploded: 0,
  },
  isMobile = false,
}) {
  const groupRef = useRef();
  const innerRef = useRef();
  const frontVisorRef = useRef();
  const opticsGlowRef = useRef();

  const { scene } = useGLTF('/3dModels/VR-Model.glb');

  // Clone scene safely & locate specific sub-nodes for exploded view animation
  const { clonedScene, frontNode } = useMemo(() => {
    const cloned = scene.clone(true);
    let front = null;

    cloned.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        
        // Enhance materials with sleek cyber metallic & specular highlights
        if (child.material) {
          child.material = child.material.clone();
          child.material.roughness = 0.25;
          child.material.metalness = 0.85;
          child.material.envMapIntensity = 1.8;
        }
      }

      // Identify outer visor / front component by name
      if (child.name === 'Object_4' || child.name === 'Object_4.001') {
        front = child;
      }
    });

    return { clonedScene: cloned, frontNode: front };
  }, [scene]);

  // Smooth frame updates for mouse tilt, idle floating & exploded view translation
  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const pointer = state.pointer;

    if (groupRef.current) {
      const lerpSpeed = 0.10;
      // 1. Idle Floating (Sine wave on Y position)
      const floatY = Math.sin(time * 1.8) * 0.08;
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        transformState.position[1] + floatY,
        lerpSpeed
      );

      groupRef.current.position.x = THREE.MathUtils.lerp(
        groupRef.current.position.x,
        transformState.position[0],
        lerpSpeed
      );

      groupRef.current.position.z = THREE.MathUtils.lerp(
        groupRef.current.position.z,
        transformState.position[2],
        lerpSpeed
      );

      // 2. Mouse Parallax Tilt
      const targetRotX = transformState.rotation[0] + pointer.y * 0.12;
      const targetRotY = transformState.rotation[1] + pointer.x * 0.18;
      const targetRotZ = transformState.rotation[2];

      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotX,
        lerpSpeed
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotY,
        lerpSpeed
      );
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z,
        targetRotZ,
        lerpSpeed
      );

      // 3. Smooth Scale Interpolation
      const targetScale = transformState.scale * (isMobile ? 0.45 : 1);
      groupRef.current.scale.setScalar(
        THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, lerpSpeed)
      );
    }

    // 4. Exploded View Translation for Optics & Display Section
    if (frontNode) {
      const explodeOffset = (transformState.exploded || 0) * 12.0;
      frontNode.position.z = THREE.MathUtils.lerp(
        frontNode.position.z,
        explodeOffset,
        0.1
      );
    }

    // 5. Optics Internal Emissive Light Pulse
    if (opticsGlowRef.current) {
      const pulse = Math.sin(time * 3) * 0.3 + 1.2;
      opticsGlowRef.current.intensity = (transformState.exploded || 0) * 8.0 * pulse;
    }
  });

  return (
    <group ref={groupRef} position={transformState.position} scale={transformState.scale}>
      <group ref={innerRef}>
        <primitive object={clonedScene} />

        {/* Glowing Optics Lens Emissive Core for Exploded View */}
        <pointLight
          ref={opticsGlowRef}
          position={[0, 0, 0.5]}
          color="#00F0FF"
          intensity={0}
          distance={6}
        />

        {/* Dynamic Accent Lights directly attached to headset */}
        <pointLight position={[0, 1.5, 1]} color="#00F0FF" intensity={3.5} distance={8} />
        <pointLight position={[-1.5, -0.5, -0.5]} color="#A855F7" intensity={2.8} distance={6} />
        <pointLight position={[1.5, 0.5, -0.5]} color="#EC4899" intensity={2.5} distance={6} />
      </group>
    </group>
  );
}

export default VRHeadsetModel;
