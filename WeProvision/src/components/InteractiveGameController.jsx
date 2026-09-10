import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { Trophy, RotateCcw } from 'lucide-react';

// ==========================================
// 1. 3D GLB CONTROLLER WITH DIRECT CLICK INTERACTION
// ==========================================
//
// FIX NOTES:
// - The model was "laying down" because most GLB exporters (Blender, etc.)
//   use a Z-up axis, while three.js is Y-up. BASE_ROTATION below rotates
//   the group so the controller stands upright and faces the camera.
//   Tweak these three numbers (in radians) until it looks right for your
//   specific .glb — start with X only, that's almost always the culprit.
// - The old code fully re-oriented the model on every mouse move using
//   state.pointer, which made it feel like the model was "spinning away"
//   from your cursor when you tried to click a button on it. That's been
//   replaced with a much smaller, subtle hover tilt that's layered ON TOP
//   of the fixed base rotation, so clicking stays predictable.
const BASE_ROTATION = { x: 1, y: 0, z: 0 }; // <-- adjust this first
const ENABLE_MOUSE_TILT = true; // set to false to kill cursor-follow entirely
const MOUSE_TILT_STRENGTH = 0.08; // was 0.35 — much smaller now

function ControllerModel({ onAction, activeAction }) {
  const { scene } = useGLTF('/3dModels/gameController.glb');
  const groupRef = useRef();

  // Subtle hover tilt layered on top of the fixed base rotation.
  // This no longer overrides the model's resting orientation — it just
  // nudges it slightly, so the controller stays front-facing and
  // clickable instead of chasing the cursor around.
  useFrame((state) => {
    if (!groupRef.current) return;

    if (!ENABLE_MOUSE_TILT) {
      groupRef.current.rotation.x = BASE_ROTATION.x;
      groupRef.current.rotation.y = BASE_ROTATION.y;
      groupRef.current.rotation.z = BASE_ROTATION.z;
      return;
    }

    const tiltX = state.pointer.y * MOUSE_TILT_STRENGTH;
    const tiltY = state.pointer.x * MOUSE_TILT_STRENGTH;

    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      BASE_ROTATION.x - tiltX,
      0.08
    );
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      BASE_ROTATION.y + tiltY,
      0.08
    );
    groupRef.current.rotation.z = BASE_ROTATION.z;
  });

  // Handle Raycast click on controller meshes
  const handleClick = (e) => {
    e.stopPropagation();
    const pointX = e.point.x;
    const pointY = e.point.y;
    const meshName = (e.object.name || '').toLowerCase();

    // Determine action by mesh name or click coordinates
    if (meshName.includes('left') || pointX < -0.4) {
      onAction('LEFT');
    } else if (meshName.includes('right') || (pointX > -0.4 && pointX < 0.1)) {
      onAction('RIGHT');
    } else if (meshName.includes('a') || meshName.includes('button') || pointX >= 0.1) {
      onAction('JUMP');
    } else {
      onAction('JUMP');
    }
  };

  return (
   <group
  ref={groupRef}
  position={[0, -0.4, 0]}
  scale={1.5}
  rotation={[BASE_ROTATION.x, BASE_ROTATION.y, BASE_ROTATION.z]}
>
  <primitive
    object={scene}
    onPointerDown={handleClick}
    className="cursor-pointer"
  />
</group>
  );
}

// ==========================================
// 2. RETRO MARIO-STYLE ARCADE CANVAS
// ==========================================
function MarioArcade({ activeAction, triggerAction }) {
  const canvasRef = useRef(null);

  // Game World State
  const [gameState, setGameState] = useState({
    score: 0,
    coins: 0,
    lives: 3,
    gameOver: false,
    gameWon: false,
  });

  const stateRef = useRef({
    player: {
      x: 40,
      y: 120,
      vx: 0,
      vy: 0,
      w: 16,
      h: 22,
      isGrounded: false,
      facing: 'right',
    },
    cameraX: 0,
    enemies: [
      { x: 180, y: 138, w: 16, h: 14, vx: -0.8, alive: true },
      { x: 340, y: 138, w: 16, h: 14, vx: -0.8, alive: true },
      { x: 500, y: 138, w: 16, h: 14, vx: -0.8, alive: true },
    ],
    coins: [
      { x: 120, y: 100, collected: false },
      { x: 136, y: 100, collected: false },
      { x: 230, y: 70, collected: false },
      { x: 280, y: 70, collected: false },
      { x: 420, y: 90, collected: false },
      { x: 436, y: 90, collected: false },
    ],
    platforms: [
      // Floor sections
      { x: 0, y: 152, w: 260, h: 30 },
      { x: 290, y: 152, w: 220, h: 30 }, // Gap between 260 and 290
      { x: 540, y: 152, w: 260, h: 30 },
      // Floating Question/Brick Blocks
      { x: 110, y: 115, w: 48, h: 14, type: 'brick' },
      { x: 220, y: 90, w: 64, h: 14, type: 'brick' },
      { x: 370, y: 105, w: 32, h: 14, type: 'pipe' },
      { x: 410, y: 115, w: 48, h: 14, type: 'brick' },
      // Flagpole Goal
      { x: 680, y: 40, w: 10, h: 112, type: 'flag' },
    ],
    keys: { left: false, right: false, jump: false },
    gameOver: false,
    gameWon: false,
  });

  // Sync virtual & controller button inputs to the game engine
  useEffect(() => {
    if (!activeAction) return;

    if (activeAction === 'LEFT') {
      stateRef.current.keys.left = true;
      setTimeout(() => { stateRef.current.keys.left = false; }, 180);
    } else if (activeAction === 'RIGHT') {
      stateRef.current.keys.right = true;
      setTimeout(() => { stateRef.current.keys.right = false; }, 180);
    } else if (activeAction === 'JUMP') {
      const p = stateRef.current.player;
      if (p.isGrounded) {
        p.vy = -7.2; // Jump impulse
        p.isGrounded = false;
      }
    }
  }, [activeAction]);

  // Physical Keyboard listener for PC testing (Arrow keys / WASD / Space)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') stateRef.current.keys.left = true;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') stateRef.current.keys.right = true;
      if ((e.code === 'ArrowUp' || e.code === 'Space' || e.code === 'KeyW')) {
        const p = stateRef.current.player;
        if (p.isGrounded) {
          p.vy = -7.2;
          p.isGrounded = false;
        }
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') stateRef.current.keys.left = false;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') stateRef.current.keys.right = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Main Mario Loop (Physics, Collisions, Canvas Render)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const gameLoop = () => {
      const state = stateRef.current;
      const { player, platforms, enemies, coins, keys } = state;

      if (!state.gameOver && !state.gameWon) {
        // --- 1. Movement & Gravity ---
        if (keys.left) {
          player.vx = -2.8;
          player.facing = 'left';
        } else if (keys.right) {
          player.vx = 2.8;
          player.facing = 'right';
        } else {
          player.vx *= 0.75; // Friction
        }

        player.vy += 0.38; // Gravity
        player.x += player.vx;
        player.y += player.vy;

        // --- 2. Platform Collisions ---
        player.isGrounded = false;
        platforms.forEach((plat) => {
          if (
            player.x + player.w > plat.x &&
            player.x < plat.x + plat.w &&
            player.y + player.h >= plat.y &&
            player.y + player.h <= plat.y + 12 &&
            player.vy >= 0
          ) {
            // Landing on top
            player.y = plat.y - player.h;
            player.vy = 0;
            player.isGrounded = true;

            // Check if reached flagpole
            if (plat.type === 'flag') {
              state.gameWon = true;
              setGameState((prev) => ({ ...prev, gameWon: true, score: prev.score + 1000 }));
            }
          }
        });

        // --- 3. Pit Death ---
        if (player.y > 190) {
          state.gameOver = true;
          setGameState((prev) => ({ ...prev, gameOver: true }));
        }

        // --- 4. Coin Collect ---
        coins.forEach((c) => {
          if (!c.collected && Math.hypot(player.x + 8 - c.x, player.y + 8 - c.y) < 16) {
            c.collected = true;
            setGameState((prev) => ({ ...prev, coins: prev.coins + 1, score: prev.score + 100 }));
          }
        });

        // --- 5. Enemy AI & Stomping ---
        enemies.forEach((enemy) => {
          if (!enemy.alive) return;
          enemy.x += enemy.vx;
          if (enemy.x < 150 || enemy.x > 580) enemy.vx *= -1; // Patrol reverse

          // Check collision with player
          if (
            player.x + player.w > enemy.x &&
            player.x < enemy.x + enemy.w &&
            player.y + player.h > enemy.y &&
            player.y < enemy.y + enemy.h
          ) {
            if (player.vy > 0 && player.y + player.h < enemy.y + 10) {
              // Mario stomps Goomba
              enemy.alive = false;
              player.vy = -5; // Bounce off
              setGameState((prev) => ({ ...prev, score: prev.score + 200 }));
            } else {
              // Player hit by enemy
              state.gameOver = true;
              setGameState((prev) => ({ ...prev, gameOver: true }));
            }
          }
        });

        // --- 6. Smooth Camera Follow ---
        state.cameraX += ((player.x - 120) - state.cameraX) * 0.1;
        state.cameraX = Math.max(0, Math.min(state.cameraX, 420));
      }

      // ==========================================
      // DRAW GAME GRAPHICS (Pixel Art Style)
      // ==========================================
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Sky gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      skyGrad.addColorStop(0, '#5c94fc');
      skyGrad.addColorStop(1, '#92bcfc');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(-Math.floor(state.cameraX), 0);

      // Draw Distant Clouds / Hills
      ctx.fillStyle = '#ffffff60';
      ctx.beginPath();
      ctx.arc(80, 50, 20, 0, Math.PI * 2);
      ctx.arc(105, 45, 25, 0, Math.PI * 2);
      ctx.arc(130, 50, 20, 0, Math.PI * 2);
      ctx.fill();

      // Draw Platforms & Bricks
      platforms.forEach((plat) => {
        if (plat.type === 'brick') {
          ctx.fillStyle = '#d06000';
          ctx.fillRect(plat.x, plat.y, plat.w, plat.h);
          ctx.strokeStyle = '#682000';
          ctx.lineWidth = 1;
          ctx.strokeRect(plat.x, plat.y, plat.w, plat.h);
        } else if (plat.type === 'pipe') {
          ctx.fillStyle = '#00a800';
          ctx.fillRect(plat.x, plat.y, plat.w, plat.h);
          ctx.fillStyle = '#00e000';
          ctx.fillRect(plat.x - 2, plat.y, plat.w + 4, 6);
        } else if (plat.type === 'flag') {
          // Flagpole
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(plat.x + 4, plat.y, 3, plat.h);
          // Red Flag
          ctx.fillStyle = '#e52521';
          ctx.beginPath();
          ctx.moveTo(plat.x + 4, plat.y + 5);
          ctx.lineTo(plat.x - 18, plat.y + 15);
          ctx.lineTo(plat.x + 4, plat.y + 25);
          ctx.fill();
        } else {
          // Normal Ground with grass top
          ctx.fillStyle = '#7a3e14';
          ctx.fillRect(plat.x, plat.y, plat.w, plat.h);
          ctx.fillStyle = '#00a800';
          ctx.fillRect(plat.x, plat.y, plat.w, 4);
        }
      });

      // Draw Coins
      coins.forEach((c) => {
        if (c.collected) return;
        ctx.fillStyle = '#fcd116';
        ctx.beginPath();
        ctx.arc(c.x, c.y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#c68a00';
        ctx.stroke();
      });

      // Draw Enemies (Goombas)
      enemies.forEach((enemy) => {
        if (!enemy.alive) return;
        ctx.fillStyle = '#9c4a00';
        ctx.beginPath();
        ctx.arc(enemy.x + 8, enemy.y + 7, 7, Math.PI, 0); // round head
        ctx.lineTo(enemy.x + 16, enemy.y + 14);
        ctx.lineTo(enemy.x, enemy.y + 14);
        ctx.fill();
        // Eyes
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(enemy.x + 4, enemy.y + 5, 2, 4);
        ctx.fillRect(enemy.x + 10, enemy.y + 5, 2, 4);
      });

      // Draw Mario Character
      ctx.fillStyle = '#e52521'; // Mario Red Shirt/Hat
      ctx.fillRect(player.x + 2, player.y, 12, 6); // Hat
      ctx.fillStyle = '#0026e6'; // Blue Overalls
      ctx.fillRect(player.x + 3, player.y + 6, 10, 10);
      // Face
      ctx.fillStyle = '#fcd8a8';
      ctx.fillRect(player.x + (player.facing === 'right' ? 6 : 2), player.y + 4, 6, 5);
      // Shoes
      ctx.fillStyle = '#603000';
      ctx.fillRect(player.x + 1, player.y + 16, 6, 6);
      ctx.fillRect(player.x + 9, player.y + 16, 6, 6);

      ctx.restore();

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const restartGame = () => {
    stateRef.current = {
      player: { x: 40, y: 120, vx: 0, vy: 0, w: 16, h: 22, isGrounded: false, facing: 'right' },
      cameraX: 0,
      enemies: [
        { x: 180, y: 138, w: 16, h: 14, vx: -0.8, alive: true },
        { x: 340, y: 138, w: 16, h: 14, vx: -0.8, alive: true },
        { x: 500, y: 138, w: 16, h: 14, vx: -0.8, alive: true },
      ],
      coins: [
        { x: 120, y: 100, collected: false },
        { x: 136, y: 100, collected: false },
        { x: 230, y: 70, collected: false },
        { x: 280, y: 70, collected: false },
        { x: 420, y: 90, collected: false },
        { x: 436, y: 90, collected: false },
      ],
      platforms: stateRef.current.platforms,
      keys: { left: false, right: false, jump: false },
      gameOver: false,
      gameWon: false,
    };
    setGameState({ score: 0, coins: 0, lives: 3, gameOver: false, gameWon: false });
  };

  return (
    <div className="w-full max-w-lg bg-[#140b25] border border-[#A855F7]/40 rounded-3xl p-4 shadow-[0_0_50px_rgba(168,85,247,0.25)] relative overflow-hidden">
      {/* Top HUD */}
      <div className="flex justify-between items-center px-3 mb-2 font-mono text-xs text-[#F472B6]">
        <div className="flex items-center gap-2">
          <span className="text-white font-bold tracking-widest uppercase">MARIO 3D ENGINE</span>
        </div>
        <div className="flex items-center gap-4 text-white">
          <span>COINS: <strong className="text-yellow-400">🪙 {gameState.coins}</strong></span>
          <span>SCORE: <strong className="text-[#C084FC]">{gameState.score}</strong></span>
        </div>
      </div>

      {/* Main Canvas Viewport */}
      <div className="relative w-full h-[180px] sm:h-[200px] rounded-2xl overflow-hidden border border-white/10">
        <canvas
          ref={canvasRef}
          width={380}
          height={180}
          className="w-full h-full object-cover [image-rendering:pixelated]"
        />

        {/* Game Over Screen */}
        {gameState.gameOver && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
            <span className="text-red-500 font-extrabold text-sm tracking-widest font-mono">GAME OVER</span>
            <button
              onClick={restartGame}
              className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#9333EA] to-[#EC4899] text-white text-xs font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(236,72,153,0.5)] hover:scale-105 transition-all"
            >
              <RotateCcw size={13} /> Try Again
            </button>
          </div>
        )}

        {/* Victory Screen */}
        {gameState.gameWon && (
          <div className="absolute inset-0 bg-[#0f0724]/90 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
            <Trophy size={32} className="text-yellow-400 animate-bounce" />
            <span className="text-emerald-400 font-extrabold text-sm tracking-widest font-mono">COURSE CLEARED!</span>
            <button
              onClick={restartGame}
              className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#9333EA] to-[#EC4899] text-white text-xs font-bold flex items-center gap-1.5"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 3. MAIN WRAPPER CONTAINER
// ==========================================
export default function InteractiveGameController() {
  const [activeAction, setActiveAction] = useState(null);

  const triggerAction = useCallback((action) => {
    setActiveAction(action);
    setTimeout(() => setActiveAction(null), 150);
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center">
      {/* 2D Mario Arcade Stage */}
      <MarioArcade activeAction={activeAction} triggerAction={triggerAction} />

      {/* 3D Clickable Hardware Controller */}
      <div className="w-full h-[360px] sm:h-[400px] relative cursor-pointer mt-2">
        <Canvas camera={{ position: [0, 1.4, 3.4], fov: 42 }}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 6, 5]} intensity={2.2} color="#F472B6" />
          <pointLight position={[-4, 3, -2]} intensity={2} color="#A855F7" />
          <spotLight position={[0, 4, 3]} intensity={2.5} color="#38BDF8" angle={0.6} />

          <ControllerModel onAction={triggerAction} activeAction={activeAction} />

          <ContactShadows
            position={[0, -1.1, 0]}
            opacity={0.7}
            scale={6.5}
            blur={2.2}
            far={4}
            color="#A855F7"
          />
        </Canvas>
      </div>

      {/* Controller Buttons Below 3D Controller */}
     
    </div>
  );
}