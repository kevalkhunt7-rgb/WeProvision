import React, { useRef, useMemo, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, PerspectiveCamera, Stars } from '@react-three/drei';
import * as THREE from 'three';

/* ============================================================
 * RESPONSIVE QUALITY TIER
 * Scales particle counts / effect intensity by viewport width.
 * ============================================================ */
function useQualityTier() {
  const getTier = () => {
    if (typeof window === 'undefined') return 'desktop';
    const w = window.innerWidth;
    if (w < 640) return 'mobile';
    if (w < 1200) return 'tablet';
    return 'desktop';
  };
  const [tier, setTier] = useState(getTier);
  useEffect(() => {
    let raf = null;
    const onResize = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        setTier(getTier());
        raf = null;
      });
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return tier;
}

const QUALITY = {
  mobile: { particleMult: 0.32, portalScale: 0.72, arcs: false, dof: false },
  tablet: { particleMult: 0.62, portalScale: 0.88, arcs: true, dof: false },
  desktop: { particleMult: 1, portalScale: 1, arcs: true, dof: true },
};

/* ============================================================
 * MESH LOOKUP HELPER
 * Traverses a loaded GLTF scene graph to find a mesh by
 * matching keywords against node names, instead of guessing.
 * ============================================================ */
function findMeshByKeywords(root, keywords) {
  let found = null;
  root.traverse((child) => {
    if (found || !child.isMesh) return;
    const name = (child.name || '').toLowerCase();
    if (keywords.some((k) => name.includes(k))) found = child;
  });
  return found;
}

const BUTTON_KEYWORDS = ['button', 'btn', 'trigger', 'trig', 'press', 'action'];
const ENGINE_KEYWORDS = ['engine', 'thruster', 'exhaust', 'nozzle', 'jet', 'boost'];

/* ============================================================
 * SHARED GLSL SNIPPETS
 * ============================================================ */
const noiseGLSL = `
  float hash(vec2 p) { return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    float a = hash(i), b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }
`;

/* ============================================================
 * PORTAL CORE SHADER
 * Fresnel-ish rim glow + swirling noise, driven by uProgress
 * (0..1 scroll-derived, deterministic) and uTime (decorative).
 * ============================================================ */
const portalCoreVert = `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vViewDir = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;
const portalCoreFrag = `
  uniform float uTime;
  uniform float uProgress;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  ${noiseGLSL}
  void main() {
    float fresnel = pow(1.0 - clamp(dot(vNormal, vViewDir), 0.0, 1.0), 2.2);
    float swirl = noise(vNormal.xy * 4.0 + uTime * 0.6) * 0.5 + 0.5;
    vec3 col = mix(uColorA, uColorB, swirl);
    float glow = fresnel * 1.4 + swirl * 0.3;
    float alpha = clamp(glow * uProgress, 0.0, 1.0);
    gl_FragColor = vec4(col * (1.2 + fresnel), alpha);
  }
`;

/* ============================================================
 * HOLOGRAM TERRAIN SHADER
 * Grid lines + scanline sweep + soft edge falloff.
 * ============================================================ */
const holoVert = `
  varying vec2 vUv;
  varying float vElevation;
  uniform float uTime;
  ${noiseGLSL}
  void main() {
    vUv = uv;
    vec3 pos = position;
    float elevation = noise(uv * 6.0 + uTime * 0.05) * 0.18;
    pos.z += elevation;
    vElevation = elevation;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;
const holoFrag = `
  uniform float uTime;
  uniform float uOpacity;
  uniform vec3 uColor;
  varying vec2 vUv;
  varying float vElevation;
  void main() {
    vec2 grid = abs(fract(vUv * 22.0 - 0.5) - 0.5) / fwidth(vUv * 22.0);
    float line = min(grid.x, grid.y);
    float gridMask = 1.0 - min(line, 1.0);

    float scan = smoothstep(0.0, 0.02, 0.02 - abs(fract(vUv.y * 2.0 - uTime * 0.25) - 0.5) + 0.48);

    float edge = smoothstep(0.0, 0.15, vUv.x) * smoothstep(1.0, 0.85, vUv.x)
               * smoothstep(0.0, 0.15, vUv.y) * smoothstep(1.0, 0.85, vUv.y);

    float flicker = 0.94 + 0.06 * sin(uTime * 30.0 + vUv.x * 10.0);

    float intensity = (gridMask * 0.6 + scan * 0.5 + vElevation * 1.2) * edge * flicker;
    gl_FragColor = vec4(uColor * (1.0 + intensity), intensity * uOpacity);
  }
`;

/* ============================================================
 * SCENE PIPELINE
 * ============================================================ */
function ScenePipeline({ scrollProgress, quality }) {
  const controllerRef = useRef();
  const droneRef = useRef();
  const tableRef = useRef();
  const cameraRigRef = useRef();
  const { camera } = useThree();

  const smoothP = useRef(0);
  const prevSmoothP = useRef(0);
  const prevDronePos = useRef(new THREE.Vector3());
  const droneSpeed = useRef(0);
  const droneYawAccumulator = useRef(0);

  const controller = useGLTF('/3dModels/gameController.glb');
  const portalGltf = useGLTF('/3dModels/nether_portal.glb');
  const drone = useGLTF('/3dModels/drone.glb');
  const table = useGLTF('/3dModels/hologram.glb');

  // ---- Mesh discovery (run once per loaded model) ----
  const buttonMeshRef = useRef(null);
  const buttonBasePos = useRef(new THREE.Vector3());
  const engineAnchor = useRef(new THREE.Vector3(0, -0.3, 0)); // fallback bottom offset

  useEffect(() => {
    const btn = findMeshByKeywords(controller.scene, BUTTON_KEYWORDS);
    if (btn) {
      buttonMeshRef.current = btn;
      buttonBasePos.current.copy(btn.position);
    } else {
      buttonMeshRef.current = null;
    }
  }, [controller]);

  useEffect(() => {
    const engine = findMeshByKeywords(drone.scene, ENGINE_KEYWORDS);
    if (engine) {
      engineAnchor.current.copy(engine.position);
    } else {
      // Fallback: use bounding box bottom-center of the drone model
      const box = new THREE.Box3().setFromObject(drone.scene);
      const center = box.getCenter(new THREE.Vector3());
      engineAnchor.current.set(center.x, box.min.y, center.z);
    }
  }, [drone]);

  /* ---------------- Particle geometry setup (allocated once) ---------------- */
  const pMult = quality.particleMult;

  // Energy burst (controller button press)

  // Portal particle field
  const portalParticleCount = Math.max(20, Math.round(90 * pMult));
  const portalParticles = useMemo(() => {
    const radii = new Float32Array(portalParticleCount);
    const angles = new Float32Array(portalParticleCount);
    const speeds = new Float32Array(portalParticleCount);
    const heights = new Float32Array(portalParticleCount);
    for (let i = 0; i < portalParticleCount; i++) {
      radii[i] = 0.5 + Math.random() * 0.9;
      angles[i] = Math.random() * Math.PI * 2;
      speeds[i] = 0.4 + Math.random() * 1.1;
      heights[i] = (Math.random() - 0.5) * 0.6;
    }
    const positions = new Float32Array(portalParticleCount * 3);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return { radii, angles, speeds, heights, positions, geometry };
  }, [portalParticleCount]);
  const portalParticlesRef = useRef();

  // Flying Pink Dust Particles System
  const pinkDustCount = Math.max(30, Math.round(120 * pMult));
  const pinkDust = useMemo(() => {
    const initials = new Float32Array(pinkDustCount * 3);
    const speeds = new Float32Array(pinkDustCount);
    const sways = new Float32Array(pinkDustCount);
    for (let i = 0; i < pinkDustCount; i++) {
      initials[i * 3] = (Math.random() - 0.5) * 1.8;
      initials[i * 3 + 1] = (Math.random() - 0.5) * 2.4;
      initials[i * 3 + 2] = Math.random() * 2.5;
      speeds[i] = 0.35 + Math.random() * 0.75;
      sways[i] = Math.random() * Math.PI * 2;
    }
    const positions = new Float32Array(pinkDustCount * 3);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return { initials, speeds, sways, positions, geometry };
  }, [pinkDustCount]);
  const pinkDustParticlesRef = useRef();

  // Drone thruster trail particles
  const thrustCount = Math.max(10, Math.round(36 * pMult));
  const thrust = useMemo(() => {
    const offsets = new Float32Array(thrustCount); // 0..1 along trail
    const spread = new Float32Array(thrustCount * 2);
    for (let i = 0; i < thrustCount; i++) {
      offsets[i] = i / thrustCount;
      spread[i * 2] = (Math.random() - 0.5) * 0.06;
      spread[i * 2 + 1] = (Math.random() - 0.5) * 0.06;
    }
    const positions = new Float32Array(thrustCount * 3);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return { offsets, spread, positions, geometry };
  }, [thrustCount]);
  const thrustParticlesRef = useRef();

  // Hologram ambient particles
  const holoParticleCount = Math.max(10, Math.round(40 * pMult));
  const holoParticles = useMemo(() => {
    const base = new Float32Array(holoParticleCount * 3);
    for (let i = 0; i < holoParticleCount; i++) {
      base[i * 3] = (Math.random() - 0.5) * 1.6;
      base[i * 3 + 1] = Math.random() * 1.1;
      base[i * 3 + 2] = (Math.random() - 0.5) * 1.6;
    }
    const positions = new Float32Array(holoParticleCount * 3);
    positions.set(base);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return { base, positions, geometry };
  }, [holoParticleCount]);
  const holoParticlesRef = useRef();

  /* ---------------- Reused materials / geometries ---------------- */
  const glowSpriteMat = useMemo(
    () =>
      new THREE.PointsMaterial({
        size: 0.045,
        color: '#7DE8FF',
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
      }),
    []
  );
  const portalParticleMat = useMemo(
    () =>
      new THREE.PointsMaterial({
        size: 0.035,
        color: '#B98CFF',
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    []
  );
  const pinkDustMat = useMemo(
    () =>
      new THREE.PointsMaterial({
        size: 0.02,
        color: '#F472B6',
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
      }),
    []
  );
  const thrustParticleMat = useMemo(
    () =>
      new THREE.PointsMaterial({
        size: 0.02,
        color: '#FFB347',
        transparent: true,
        opacity: 2,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    []
  );
  const holoParticleMat = useMemo(
    () =>
      new THREE.PointsMaterial({
        size: 0.02,
        color: '#5FE1FF',
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    []
  );

  const outerRingGeo = useMemo(() => new THREE.TorusGeometry(0.95, 0.045, 12, 64), []);
  const innerRingGeo = useMemo(() => new THREE.TorusGeometry(0.68, 0.03, 10, 48), []);
  const energyRingGeo = useMemo(() => new THREE.TorusGeometry(0.8, 0.012, 8, 48), []);
  const coreGeo = useMemo(() => new THREE.SphereGeometry(0.5, 32, 32), []);

  const outerRingMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: '#8B5CF6', transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending }),
    []
  );
  const innerRingMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: '#22D3EE', transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending }),
    []
  );
  const energyRingMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: '#F0ABFC', transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending }),
    []
  );
  const coreMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: portalCoreVert,
        fragmentShader: portalCoreFrag,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        uniforms: {
          uTime: { value: 0 },
          uProgress: { value: 0 },
          uColorA: { value: new THREE.Color('#22D3EE') },
          uColorB: { value: new THREE.Color('#C084FC') },
        },
      }),
    []
  );

  const flameCoreGeo = useMemo(() => new THREE.ConeGeometry(0.045, 0.22, 10, 1, true), []);


  const flameOuterGeo = useMemo(() => new THREE.ConeGeometry(0.075, 0.32, 10, 1, true), []);
  const flameCoreMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: '#FFF3B0', transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }),
    []
  );
  const flameOuterMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: '#FF7A1A', transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }),
    []
  );

  const holoPlaneGeo = useMemo(() => new THREE.PlaneGeometry(1.6, 1.6, 48, 48), []);
  const holoMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: holoVert,
        fragmentShader: holoFrag,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        uniforms: {
          uTime: { value: 0 },
          uOpacity: { value: 0 },
          uColor: { value: new THREE.Color('#3FD9FF') },
        },
      }),
    []
  );
  const rayGeo = useMemo(() => new THREE.CylinderGeometry(0.01, 0.01, 1.4, 6, 1, true), []);
  const rayMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: '#5FE1FF', transparent: true, opacity: 0.18, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }),
    []
  );

  /* ---------------- refs for imperative parts ---------------- */
  const portalGroupRef = useRef();
  const portalLightRef = useRef();
  const portalRimLightRef = useRef();
  const outerRingRef = useRef();
  const innerRingRef = useRef();
  const energyRingRef = useRef();
  const coreRef = useRef();
  const thrusterGroupRef = useRef();
  const flameCoreRef = useRef();
  const flameOuterRef = useRef();
  const holoMeshRef = useRef();
  const raysGroupRef = useRef();

  useEffect(() => {
    return () => {
      // Dispose reusable resources on unmount
      [
        outerRingGeo, innerRingGeo, energyRingGeo, coreGeo, flameCoreGeo, flameOuterGeo,
        holoPlaneGeo, rayGeo, portalParticles.geometry, thrust.geometry, holoParticles.geometry,
      ].forEach((g) => g && g.dispose());
      [
        outerRingMat, innerRingMat, energyRingMat, coreMat, flameCoreMat, flameOuterMat,
        holoMat, rayMat, glowSpriteMat, portalParticleMat, thrustParticleMat, holoParticleMat,
      ].forEach((m) => m && m.dispose());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ============================================================
   * MAIN ANIMATION LOOP — everything below is derived from `p`
   * (scrubbed scroll progress), so it stays in sync scrolling
   * forward OR backward. `time` is only used for decorative
   * jitter/flicker layered on top of the deterministic motion.
   * ============================================================ */
  useFrame((state, delta) => {
    smoothP.current = THREE.MathUtils.damp(smoothP.current, scrollProgress.current, 6, delta);
    const p = smoothP.current;
    const dP = p - prevSmoothP.current;
    prevSmoothP.current = p;
    const time = state.clock.getElapsedTime();

    coreMat.uniforms.uTime.value = time;
    holoMat.uniforms.uTime.value = time;

    /* ---------- CAMERA: parallax, subtle shake, FOV breathing ---------- */
    const pressJoltCam = Math.sin(THREE.MathUtils.clamp((p - 0.14) / 0.08, 0, 1) * Math.PI) * 0.2;
    if (cameraRigRef.current) {
      const shakeEnvelope = pressJoltCam; // strongest right at the button press
      cameraRigRef.current.position.y =
        Math.sin(p * Math.PI) * 0.15 + (Math.sin(time * 40) * 0.02 * shakeEnvelope);
      cameraRigRef.current.position.x =
        Math.sin(p * Math.PI * 2) * 0.1 + (Math.cos(time * 47) * 0.018 * shakeEnvelope);
    }
    if (camera.isPerspectiveCamera) {
      const portalFov = THREE.MathUtils.smoothstep(p, 0.18, 0.5) * (1 - THREE.MathUtils.smoothstep(p, 0.5, 0.62));
      camera.fov = 45 + portalFov * 4;
      camera.updateProjectionMatrix();
    }

    /* ============================================================
     * PHASE 1 — 0.00 -> 0.28  CONTROLLER TRIGGER
     * ============================================================ */
    if (controllerRef.current) {
      if (p < 0.28) {
        controllerRef.current.visible = true;
        const normP = p / 0.26;
        const pressJolt = pressJoltCam;

        controllerRef.current.position.set(1.5 - normP * 0.4, -0.30 - pressJolt * 0.3, -normP * 1.5);
        controllerRef.current.rotation.set(
          0.8 + pressJolt + normP * 0.6,
          -0.6 + normP * 1.8 + Math.sin(time * 0.5) * 0.06,
          normP * 0.4
        );
        const dissolve = THREE.MathUtils.smoothstep(p, 0.22, 0.28);
        controllerRef.current.scale.setScalar(1.35 * (1 - normP * 0.6) * (1 - dissolve * 0.4));

        // Fade materials instead of hard-hiding, to sell a "dissolve"
        controllerRef.current.traverse((child) => {
          if (child.isMesh && child.material) {
            const mats = Array.isArray(child.material) ? child.material : [child.material];
            mats.forEach((m) => {
              if (m.transparent === undefined) return;
              m.transparent = true;
              m.opacity = 1 - dissolve;
            });
          }
        });

        // Physical button press: compress inward, mechanical bounce back
        if (buttonMeshRef.current) {
          const pressT = THREE.MathUtils.clamp((p - 0.14) / 0.06, 0, 1);
          const bounce = Math.sin(pressT * Math.PI) * (1 - pressT * 0.3);
          buttonMeshRef.current.position.set(
            buttonBasePos.current.x,
            buttonBasePos.current.y - bounce * 0.03,
            buttonBasePos.current.z - bounce * 0.02
          );
          buttonMeshRef.current.scale.set(1, 1 - bounce * 0.12, 1);
        }
      } else {
        controllerRef.current.visible = false;
      }
    }

    /* ---------- Energy burst from controller (button press aftermath) ---------- */
    /* ============================================================
     * PHASE 2 — 0.16 -> 0.60 NETHER PORTAL (SECTION 2: WHY CHOOSE US)
     * ============================================================ */
    const portalActive = p >= 0.16 && p < 0.60;
    if (portalGroupRef.current) {
      portalGroupRef.current.visible = portalActive;
      if (portalActive) {
        const normP = (p - 0.22) / 0.36;
        const growEnv = Math.sin(THREE.MathUtils.clamp(normP, 0, 1) * Math.PI); // 0 -> 1 -> 0
        const openEnv = THREE.MathUtils.smoothstep(normP, 0, 0.35); // forming -> full
        const scale = 0.3;

        // Smooth slide-in entrance animation as user scrolls into view
        const enterProgress = THREE.MathUtils.clamp((p - 0.16) / 0.12, 0, 1);
        const slideEase = 1 - Math.pow(1 - enterProgress, 3); // smooth cubic ease-out
        const portalX = THREE.MathUtils.lerp(-9.0, -3.5, slideEase);

        // Smooth opacity transition (fades in on enter, fades out on exit)
        const enterOpacity = slideEase;
        const exitOpacity = 1 - THREE.MathUtils.smoothstep(p, 0.52, 0.60);
        const portalOpacity = THREE.MathUtils.clamp(enterOpacity * exitOpacity, 0, 1);

        // Positioned cleanly on the LEFT side, sliding smoothly from off-screen left (-9.0) to final position (-3.5)
        portalGroupRef.current.position.set(portalX, -1, -0.1);
        portalGroupRef.current.scale.setScalar(scale);
        portalGroupRef.current.rotation.set(0, 0.5, 0);

        // Apply smooth opacity to all meshes in the Nether Portal GLTF model
        portalGroupRef.current.traverse((child) => {
          if (child.isMesh && child.material) {
            const mats = Array.isArray(child.material) ? child.material : [child.material];
            mats.forEach((m) => {
              m.transparent = true;
              m.opacity = portalOpacity;
            });
          }
        });

        if (portalParticlesRef.current) {
          const pos = portalParticles.positions;
          for (let i = 0; i < portalParticleCount; i++) {
            const a = portalParticles.angles[i] + time * portalParticles.speeds[i];
            const r = portalParticles.radii[i] * (0.6 + openEnv * 0.4);
            pos[i * 3] = Math.cos(a) * r;
            pos[i * 3 + 1] = portalParticles.heights[i] + Math.sin(time * 2 + i) * 0.05;
            pos[i * 3 + 2] = Math.sin(a) * r * 0.3;
          }
          portalParticles.geometry.attributes.position.needsUpdate = true;
          portalParticleMat.opacity = 0.85 * openEnv * portalOpacity;
        }

        // Flying Pink Dust Particles Animation (drifting outward from portal)
        if (pinkDustParticlesRef.current) {
          const pos = pinkDust.positions;
          for (let i = 0; i < pinkDustCount; i++) {
            const speed = pinkDust.speeds[i];
            const sway = pinkDust.sways[i];
            let z = (pinkDust.initials[i * 3 + 2] + time * speed * 0.5) % 2.5;
            let x = pinkDust.initials[i * 3] + Math.sin(time * 2.2 + sway) * 0.14;
            let y = pinkDust.initials[i * 3 + 1] + Math.cos(time * 1.6 + sway) * 0.10 + (z * 0.12);

            pos[i * 3] = x;
            pos[i * 3 + 1] = y;
            pos[i * 3 + 2] = z;
          }
          pinkDust.geometry.attributes.position.needsUpdate = true;
          pinkDustMat.opacity = 0.85 * openEnv * portalOpacity;
        }

        // Dynamic Pulsing Lights on Portal Walls & Arch
        if (portalLightRef.current) {
          const pulse = Math.sin(time * 8) * 3 + 8;
          portalLightRef.current.intensity = pulse * openEnv * portalOpacity;
        }
        if (portalRimLightRef.current) {
          const pulse2 = Math.cos(time * 8) * 2 + 5;
          portalRimLightRef.current.intensity = pulse2 * openEnv * portalOpacity;
        }
      }
    }

    /* ============================================================
     * PHASE 3 — 0.22 -> 0.68  DRONE EMERGES & ROTATES IN SYNC WITH CONTENT
     * ============================================================ */
    if (droneRef.current) {
      if (p >= 0.22) {
        droneRef.current.visible = true;
        const currentPos = droneRef.current.position;

        // Target rightside position for drone (clearance from content cards)
        const targetX = 1.8;
        const targetY = 0.0;
        const targetZ = 0.6;
        const targetScale = 0.55;

        if (p < 0.60) {
          // Drone emerges from portal (0.22 -> 0.54) without 360-degree rotation
          const emergeP = THREE.MathUtils.clamp((p - 0.22) / 0.32, 0, 1);
          const bank = Math.sin(emergeP * Math.PI) * 0.15; // dynamic banking arc

          // Drone emerges out of Nether Portal at (-2.8, -0.1, -0.8) and flies smoothly across to target position
          currentPos.set(
            THREE.MathUtils.lerp(-2.8, targetX, emergeP),
            THREE.MathUtils.lerp(-0.1, targetY, emergeP) + Math.sin(time * 2) * 0.08,
            THREE.MathUtils.lerp(-0.8, targetZ, emergeP) + Math.sin(emergeP * Math.PI) * 0.3
          );

          // Flight yaw: stable forward-facing orientation along movement direction while exiting portal
          const flightYaw = Math.PI * 0.95;

          // Rotation ONLY starts smoothly when entering content area (smooth step from p=0.40 to 0.52)
          const rotateEase = THREE.MathUtils.smoothstep(p, 0.40, 0.52);

          // Accumulate rotation velocity smoothly without phase jumps or sudden jerks
          if (rotateEase > 0) {
            droneYawAccumulator.current += delta * 1.2 * rotateEase;
          } else {
            droneYawAccumulator.current = THREE.MathUtils.damp(droneYawAccumulator.current, 0, 4, delta);
          }

          const yaw = flightYaw + droneYawAccumulator.current;
          const pitch = 0.10 + Math.sin(time * 1.5) * 0.05 + bank * 0.2;
          const roll = -0.08 - (1 - rotateEase) * bank + Math.sin(time * 2.2) * 0.05;

          droneRef.current.rotation.set(pitch, yaw, roll);

          // Drone scales up smoothly from 0.01 inside portal to target size
          droneRef.current.scale.setScalar(THREE.MathUtils.lerp(0.01, targetScale, emergeP));
        } else {
          const dockP = THREE.MathUtils.clamp((p - 0.60) / 0.28, 0, 1);

          currentPos.set(
            THREE.MathUtils.lerp(targetX, 0, dockP),
            THREE.MathUtils.lerp(targetY, -0.65, dockP),
            THREE.MathUtils.lerp(targetZ, -0.1, dockP)
          );

          // Continue rotation smoothly during docking transition
          droneYawAccumulator.current += delta * 1.2;

          droneRef.current.rotation.set(
            THREE.MathUtils.lerp(0.10, 0.4, dockP),
            Math.PI * 0.95 + droneYawAccumulator.current,
            THREE.MathUtils.lerp(-0.08, -0.4, Math.min(dockP * 1.4, 1)) // banks left into dock
          );
          droneRef.current.scale.setScalar(THREE.MathUtils.lerp(targetScale, 0.16, dockP));
        }

        // Finite-difference speed estimate (no per-frame allocation)
        const dx = currentPos.x - prevDronePos.current.x;
        const dy = currentPos.y - prevDronePos.current.y;
        const dz = currentPos.z - prevDronePos.current.z;
        const instSpeed = delta > 0 ? Math.sqrt(dx * dx + dy * dy + dz * dz) / delta : 0;
        droneSpeed.current = THREE.MathUtils.damp(droneSpeed.current, instSpeed, 5, delta);
        prevDronePos.current.copy(currentPos);
      } else {
        droneRef.current.visible = false;
      }
    }

    /* ---------- Drone thruster fire (child of drone, follows orientation) ---------- */
    if (thrusterGroupRef.current) {
      const thrusterActive = p >= 0.28;
      thrusterGroupRef.current.visible = thrusterActive;
      if (thrusterActive) {
        const intensity = THREE.MathUtils.clamp(0.35 + droneSpeed.current * 0.9, 0.35, 1.6);
        const flicker = 1 + Math.sin(time * 40) * 0.08;
        if (flameCoreRef.current) {
          flameCoreRef.current.scale.set(1, intensity * flicker, 1);
          flameCoreMat.opacity = 0.9 * Math.min(intensity, 1);
        }
        if (flameOuterRef.current) {
          flameOuterRef.current.scale.set(1, intensity * 1.3 * flicker, 1);
          flameOuterMat.opacity = 0.5 * Math.min(intensity, 1);
        }
        if (thrustParticlesRef.current) {
          const pos = thrust.positions;
          for (let i = 0; i < thrustCount; i++) {
            const t = (thrust.offsets[i] + time * 0.6) % 1;
            pos[i * 3] = thrust.spread[i * 2] * (1 + t);
            pos[i * 3 + 1] = -t * 0.35 * intensity;
            pos[i * 3 + 2] = thrust.spread[i * 2 + 1] * (1 + t);
          }
          thrust.geometry.attributes.position.needsUpdate = true;
          thrustParticleMat.opacity = 0.8 * Math.min(intensity, 1);
        }
      }
    }

    /* ============================================================
     * PHASE 4 — 0.64 -> 1.0  HOLOGRAM DOCKING
     * ============================================================ */
    if (tableRef.current) {
      if (p >= 0.64) {
        tableRef.current.visible = true;
        const normP = (p - 0.64) / 0.36;

        tableRef.current.position.set(0, THREE.MathUtils.lerp(-2.8, -1.25, normP), 0);
        tableRef.current.rotation.set(0.38, time * 0.25, 0);
        tableRef.current.scale.setScalar(THREE.MathUtils.lerp(0.3, 1.15, normP));

        holoMat.uniforms.uOpacity.value = THREE.MathUtils.smoothstep(normP, 0.15, 0.5);

        if (raysGroupRef.current) {
          raysGroupRef.current.children.forEach((ray, i) => {
            ray.material.opacity = 0.12 + Math.sin(time * 3 + i) * 0.06 * normP;
          });
        }

        if (holoParticlesRef.current) {
          const pos = holoParticles.positions;
          const base = holoParticles.base;
          for (let i = 0; i < holoParticleCount; i++) {
            pos[i * 3] = base[i * 3] + Math.sin(time * 0.8 + i) * 0.05;
            pos[i * 3 + 1] = base[i * 3 + 1] + (Math.sin(time * 0.5 + i * 2) + 1) * 0.05;
            pos[i * 3 + 2] = base[i * 3 + 2] + Math.cos(time * 0.7 + i) * 0.05;
          }
          holoParticles.geometry.attributes.position.needsUpdate = true;
          holoParticleMat.opacity = 0.7 * normP;
        }
      } else {
        tableRef.current.visible = false;
        holoMat.uniforms.uOpacity.value = 0;
      }
    }
  });

  return (
    <>
      <group ref={cameraRigRef}>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={45} />
      </group>

      <Stars radius={45} depth={50} count={Math.round(2200 * pMult)} factor={3.5} saturation={1} fade speed={1.2} />

      {/* ---------- PHASE 1: Controller ---------- */}
      <primitive ref={controllerRef} object={controller.scene} />


      {/* ---------- PHASE 2: Nether Portal 3D Model + Wall Lights + Flying Pink Dust ---------- */}
      <group ref={portalGroupRef}>
        {/* Dynamic Pulsing Wall Lights */}
        <pointLight ref={portalLightRef} color="#E879F9" intensity={8} distance={7} decay={1.4} position={[7, 8.5, 7]} />
        <pointLight ref={portalLightRef} color="#E879F9" intensity={8} distance={7} decay={1} position={[2, -0.5, 7]} />
        <pointLight ref={portalLightRef} color="#E879F9" intensity={8} distance={7} decay={1} position={[2, 7.5, 7]} />
        <pointLight ref={portalLightRef} color="#E879F9" intensity={8} distance={7} decay={1} position={[7, -0.5, 6]} />
        {/* <pointLight ref={portalLightRef} color="#E879F9" intensity={0} distance={0} decay={0} position={[4.5, 4.5, 6]} /> */}
        <pointLight ref={portalRimLightRef} color="#F472B6" intensity={5} distance={5} decay={1.8} position={[10, 8, 3]} />

        {/* Portal 3D GLTF Model */}
        <primitive object={portalGltf.scene} />

        {/* Blue/Purple Swirling Ring Particles */}
        <points ref={portalParticlesRef} geometry={portalParticles.geometry} material={portalParticleMat} position={[5, 4, 0]} />

        {/* Flying Pink Dust Particle Animation */}
        <points ref={pinkDustParticlesRef} geometry={pinkDust.geometry} material={pinkDustMat} position={[5, 4, 0]} />
      </group>

      {/* ---------- PHASE 3: Drone + thruster ---------- */}
      <primitive ref={droneRef} object={drone.scene}>
        <group ref={thrusterGroupRef} position={engineAnchor.current}>
          {/* <mesh ref={flameCoreRef} geometry={flameCoreGeo} material={flameCoreMat} position={[0, -0.11, 0]} />
          <mesh ref={flameCoreRef} geometry={flameCoreGeo} material={flameCoreMat} position={[1.5, 0.1, 0]} />
          <mesh ref={flameOuterRef} geometry={flameOuterGeo} material={flameOuterMat} position={[1.5, 0.1, 0]} />
          <mesh ref={flameOuterRef} geometry={flameOuterGeo} material={flameOuterMat} position={[0, -0.2, 0]} /> */}
          <points ref={thrustParticlesRef} geometry={thrust.geometry} material={thrustParticleMat} />
        </group>
      </primitive>

      {/* ---------- PHASE 4: Holographic table + terrain ---------- */}
      <primitive ref={tableRef} object={table.scene}>
        <mesh ref={holoMeshRef} geometry={holoPlaneGeo} material={holoMat} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.55, 0]} />
        <group ref={raysGroupRef}>
          {[0, 1, 2, 3].map((i) => (
            <mesh
              key={i}
              geometry={rayGeo}
              material={rayMat.clone()}
              position={[Math.cos((i / 4) * Math.PI * 2) * 0.5, 1.1, Math.sin((i / 4) * Math.PI * 2) * 0.5]}
            />
          ))}
        </group>
        <points ref={holoParticlesRef} geometry={holoParticles.geometry} material={holoParticleMat} />
      </primitive>
    </>
  );
}

export default function GameDevCanvas({ scrollProgress }) {
  const tier = useQualityTier();
  const quality = QUALITY[tier];

  return (
    <Canvas
      style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
      dpr={tier === 'mobile' ? [1, 1.5] : [1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[8, 12, 6]} intensity={3} color="#00F0FF" />
      <directionalLight position={[-8, -6, -4]} intensity={2.5} color="#EC4899" />
      <pointLight position={[0, 0, 1]} intensity={4} color="#C084FC" distance={7} />

      <Suspense fallback={null}>
        <ScenePipeline scrollProgress={scrollProgress} quality={quality} />
      </Suspense>

      {/*
        Optional real bloom: if @react-three/postprocessing is already a
        dependency in this project, swap the emissive/additive glow above
        for a proper bloom pass by uncommenting below:

        import { EffectComposer, Bloom } from '@react-three/postprocessing';
        ...
        <EffectComposer>
          <Bloom
            intensity={tier === 'mobile' ? 0.5 : 1.1}
            luminanceThreshold={0.15}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
        </EffectComposer>
      */}
    </Canvas>
  );
}