import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

useGLTF.preload('/3dModels/workspace.glb');

/**
 * 3D Graphic Design & UI/UX Model Component
 * Handles rendering, idle bobbing, smooth mouse tilt, and GSAP scroll interpolations.
 */
export function DesignModel({
  transformState = {
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: 0.5,
  },
  isMobile = false,
  mobileScale,
  mobilePosition,
  mobileRotation,
}) {
  const groupRef = useRef();

  const { scene } = useGLTF('/3dModels/workspace.glb');

// Clone scene safely & locate robot sub-node for scroll animation
  const { clonedScene, robotNode, baseRobotPos } = useMemo(() => {
    const cloned = scene.clone(true);
    let robot = null;
    let initialPos = new THREE.Vector3(0, 0, 0);

    cloned.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material = child.material.clone();
          child.material.roughness = 0.25;
          child.material.metalness = 0.75;
          child.material.envMapIntensity = 1.6;
        }
      }

      // Locate robot avatar node by name
      if (!robot && (child.name === 'Robot Origin.001_363' || child.name.startsWith('Robot Origin.001') || child.name.startsWith('Robot Origin'))) {
        robot = child;
        initialPos.copy(child.position);
      }
    });

    return { clonedScene: cloned, robotNode: robot, baseRobotPos: initialPos };
  }, [scene]);

  // Smooth frame updates: room stability, pointer tilt, and robot avatar scroll motion
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const pointer = state.pointer;

    if (groupRef.current) {
      const targetPos = isMobile && mobilePosition ? mobilePosition : transformState.position;
      const baseRot = isMobile && mobileRotation ? mobileRotation : transformState.rotation;

      // 1. Idle Floating Bobbing for Room Anchor
      const floatY = Math.sin(time * 1.6) * 0.04;

      // Position lerp for main room
      groupRef.current.position.x = THREE.MathUtils.lerp(
        groupRef.current.position.x,
        targetPos[0],
        0.08
      );
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        targetPos[1] + floatY,
        0.08
      );
      groupRef.current.position.z = THREE.MathUtils.lerp(
        groupRef.current.position.z,
        targetPos[2],
        0.08
      );

      // 2. Pointer Mouse Parallax Tilt
      const targetRotX = baseRot[0] + pointer.y * 0.08;
      const targetRotY = baseRot[1] + pointer.x * 0.12;
      const targetRotZ = baseRot[2];

      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotX,
        0.08
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotY,
        0.08
      );
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z,
        targetRotZ,
        0.08
      );

      // 3. Room Scale Interpolation (Mobile View Override or Scale Multiplier)
      const scaleMult = isMobile ? (mobileScale ?? 0.6) : 1;
      const targetScale = transformState.scale * scaleMult;
      groupRef.current.scale.setScalar(
        THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.08)
      );

      // 4. Floating Robot Sub-Mesh Motion on Scroll
      if (robotNode) {
        const robotPosOffset = transformState.robotPos || [0, 0, 0];
        const robotRotOffset = transformState.robotRot || [0, 0, 0];
        const robotBob = Math.sin(time * 2.4) * 0.08;

        const targetX = baseRobotPos.x + robotPosOffset[0];
        const targetY = baseRobotPos.y + robotPosOffset[1] + robotBob;
        const targetZ = baseRobotPos.z + robotPosOffset[2];

        robotNode.position.x = THREE.MathUtils.lerp(robotNode.position.x, targetX, 0.08);
        robotNode.position.y = THREE.MathUtils.lerp(robotNode.position.y, targetY, 0.08);
        robotNode.position.z = THREE.MathUtils.lerp(robotNode.position.z, targetZ, 0.08);

        robotNode.rotation.x = THREE.MathUtils.lerp(robotNode.rotation.x, robotRotOffset[0], 0.08);
        robotNode.rotation.y = THREE.MathUtils.lerp(robotNode.rotation.y, robotRotOffset[1], 0.08);
        robotNode.rotation.z = THREE.MathUtils.lerp(robotNode.rotation.z, robotRotOffset[2], 0.08);
      }
    }
  });

  return (
    <group ref={groupRef} position={transformState.position} scale={transformState.scale}>
      <primitive object={clonedScene} />

      {/* Indigo, Violet & Magenta Studio Point Lights attached to model */}
      <pointLight position={[0, 2, 1]} color="#6366F1" intensity={4} distance={8} />
      <pointLight position={[-2, -1, -1]} color="#A855F7" intensity={3.5} distance={6} />
      <pointLight position={[2, 1, -1]} color="#EC4899" intensity={3} distance={6} />
    </group>
  );
}

export default DesignModel;
