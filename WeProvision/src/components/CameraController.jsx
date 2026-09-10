import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import * as THREE from 'three';

export default function CameraController({ activeService, services }) {
  const { camera } = useThree();

  // Store current target position and lookAt point for smooth interpolation
  const targetPos = useRef(new THREE.Vector3(0, 0, 9));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    const selectedService = services.find((s) => s.id === activeService);

    if (selectedService) {
      // Service object selected -> Animate camera to service focus position
      const [px, py, pz] = selectedService.cameraTarget || [
        selectedService.position[0],
        selectedService.position[1],
        selectedService.position[2] + 3.5,
      ];
      const [lx, ly, lz] = selectedService.lookAtTarget || selectedService.position;

      gsap.to(targetPos.current, {
        x: px,
        y: py,
        z: pz,
        duration: 1.6,
        ease: 'power3.inOut',
      });

      gsap.to(targetLookAt.current, {
        x: lx,
        y: ly,
        z: lz,
        duration: 1.6,
        ease: 'power3.inOut',
      });
    } else {
      // Return to Central Hub View
      gsap.to(targetPos.current, {
        x: 0,
        y: 0,
        z: 9,
        duration: 1.8,
        ease: 'power3.inOut',
      });

      gsap.to(targetLookAt.current, {
        x: 0,
        y: 0,
        z: 0,
        duration: 1.8,
        ease: 'power3.inOut',
      });
    }
  }, [activeService, services]);

  useFrame((state, delta) => {
    // Subtle Mouse Parallax when idle in central hub view
    let parallaxX = 0;
    let parallaxY = 0;

    if (!activeService) {
      parallaxX = state.pointer.x * 0.6;
      parallaxY = state.pointer.y * 0.4;
    }

    // Smooth camera position lerp
    camera.position.x = THREE.MathUtils.lerp(
      camera.position.x,
      targetPos.current.x + parallaxX,
      delta * 4
    );
    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y,
      targetPos.current.y + parallaxY,
      delta * 4
    );
    camera.position.z = THREE.MathUtils.lerp(
      camera.position.z,
      targetPos.current.z,
      delta * 4
    );

    // Smooth lookAt target lerp
    currentLookAt.current.lerp(targetLookAt.current, delta * 5);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
