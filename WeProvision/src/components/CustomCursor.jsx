import React, { useEffect, useRef, useState } from 'react';
import { RotateCw } from 'lucide-react';

/**
 * CustomCursor
 *
 * A velocity-aware teardrop cursor: a circle at rest that morphs into a
 * trailing droplet shape as it accelerates, always oriented along the
 * direction of travel. Distinguishes text fields (thin caret), interactive
 * elements (expanded ring), and 3D canvases (rotate affordance).
 *
 * Design notes:
 * - The rAF-driven transform is applied via inline style, never via a CSS
 *   `transition`, so the two animation systems don't fight each other.
 *   CSS transitions are reserved for state changes (size, shape, glow).
 * - Respects prefers-reduced-motion by disabling the custom cursor entirely
 *   and falling back to the system cursor.
 */
export default function CustomCursor() {
  const cursorRef = useRef(null);
  const iconRef = useRef(null);
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState('default'); // 'default' | 'interactive' | 'text' | 'model'
  const [isMouseDown, setIsMouseDown] = useState(false);

  const isMouseDownRef = useRef(false);
  const modeRef = useRef('default');
  const mouseRef = useRef({
    x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0,
    y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0,
  });
  const posRef = useRef({
    x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0,
    y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0,
  });
  const clickScaleRef = useRef(1);

  useEffect(() => {
    const coarsePointer = window.matchMedia('(hover: none), (pointer: coarse)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const isMobileViewport = window.matchMedia('(max-width: 1023px)');

    if (coarsePointer.matches || reducedMotion.matches || 'ontouchstart' in window || isMobileViewport.matches) {
      setEnabled(false);
      document.body.classList.remove('custom-cursor-active');
      return; // leave the system cursor untouched on touch & mobile viewports
    }

    setEnabled(true);
    document.body.classList.add('custom-cursor-active');

    let animationFrameId;

    const handleMouseMove = (e) => {
      if (e.clientX !== undefined && e.clientY !== undefined) {
        mouseRef.current.x = e.clientX;
        mouseRef.current.y = e.clientY;
      }
    };

    const handleMouseDown = (e) => {
      if (e && e.clientX !== undefined && e.clientY !== undefined) {
        mouseRef.current.x = e.clientX;
        mouseRef.current.y = e.clientY;
      }
      isMouseDownRef.current = true;
      setIsMouseDown(true);
    };

    const handleMouseUp = () => {
      isMouseDownRef.current = false;
      setIsMouseDown(false);
    };

    const handleMouseLeaveWindow = () => {
      if (cursorRef.current) cursorRef.current.style.opacity = '0';
    };

    const handleMouseEnterWindow = () => {
      if (cursorRef.current) cursorRef.current.style.opacity = '1';
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target) return;

      const isCanvas =
        target.tagName === 'CANVAS' ||
        target.closest('canvas') ||
        target.closest('[data-cursor="3d"]') ||
        target.closest('.canvas-container') ||
        target.closest('[data-3d-model="true"]') ||
        (typeof target.className === 'string' &&
          (target.className.includes('canvas') || target.className.includes('webgl')));

      if (isCanvas) {
        setMode('model');
        modeRef.current = 'model';
        return;
      }

      const isTextField =
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable ||
        (target.tagName === 'INPUT' &&
          ['text', 'email', 'search', 'password', 'url', 'number', 'tel'].includes(target.type));

      if (isTextField) {
        setMode('text');
        modeRef.current = 'text';
        return;
      }

      const isInteractive =
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.tagName === 'SELECT' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('.cursor-pointer') ||
        target.getAttribute('role') === 'button' ||
        (typeof target.className === 'string' && target.className.includes('cursor-pointer'));

      const newMode = isInteractive ? 'interactive' : 'default';
      setMode(newMode);
      modeRef.current = newMode;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('pointermove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeaveWindow);
    document.addEventListener('mouseenter', handleMouseEnterWindow);

    const lerp = (start, end, amount) => (1 - amount) * start + amount * end;

    const render = () => {
      posRef.current.x = lerp(posRef.current.x, mouseRef.current.x, 0.2);
      posRef.current.y = lerp(posRef.current.y, mouseRef.current.y, 0.2);

      const dx = mouseRef.current.x - posRef.current.x;
      const dy = mouseRef.current.y - posRef.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);

      // 0 at rest -> 1 at full stretch. Drives both the scale and the
      // border-radius morph from circle to trailing teardrop.
      const stretch = Math.min(dist * 0.02, 1);
      const baseScaleX = 1 + stretch * 0.6;
      const baseScaleY = 1 / Math.sqrt(baseScaleX);

      // Smooth click scale active animation inside rAF loop so position transform is never overwritten
      const targetClickScale = isMouseDownRef.current && modeRef.current !== 'model' ? 0.85 : 1.0;
      clickScaleRef.current = lerp(clickScaleRef.current, targetClickScale, 0.3);

      const finalScaleX = baseScaleX * clickScaleRef.current;
      const finalScaleY = baseScaleY * clickScaleRef.current;

      // Morph: leading edge stays round, trailing edge pinches to a point.
      const round = 50 - stretch * 20;
      const point = 50 + stretch * 35;
      const borderRadius = `${point}% ${round}% ${round}% ${point}% / 50% 50% 50% 50%`;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0) translate(-50%, -50%) rotate(${angle}deg) scale(${finalScaleX}, ${finalScaleY})`;
        cursorRef.current.style.borderRadius = borderRadius;
      }
      if (iconRef.current) {
        // Counter-rotate the icon so it stays upright regardless of travel angle.
        iconRef.current.style.transform = `rotate(${-angle}deg)`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('pointermove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeaveWindow);
      document.removeEventListener('mouseenter', handleMouseEnterWindow);
      cancelAnimationFrame(animationFrameId);
      document.body.classList.remove('custom-cursor-active');
    };
  }, []);

  if (!enabled) return null;

  const sizeByMode = {
    default: 'w-6 h-6',
    interactive: 'w-12 h-12',
    text: 'w-[3px] h-6',
    model: isMouseDown ? 'w-24 h-24' : 'w-20 h-20',
  };

  const glowByMode = {
    default: 'shadow-[0_0_16px_rgba(255,255,255,0.6)]',
    interactive: 'shadow-[0_0_24px_rgba(255,255,255,0.85)]',
    text: 'shadow-none',
    model: isMouseDown
      ? 'shadow-[0_0_44px_rgba(192,132,252,0.9)] bg-purple-100'
      : 'shadow-[0_0_32px_rgba(255,255,255,0.9)]',
  };

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className={[
        'custom-cursor-element fixed top-0 left-0 pointer-events-none z-[9999] rounded-full select-none',
        'bg-white mix-blend-difference flex items-center justify-center',
        // Only size, shadow, background are transitioned —
        // never transform or border-radius, which the rAF loop owns.
        'transition-[width,height,box-shadow,background-color] duration-200 ease-out',
        sizeByMode[mode],
        glowByMode[mode],
      ].join(' ')}
      style={{ pointerEvents: 'none', willChange: 'transform', transformOrigin: 'center center' }}
    >
      
    </div>
  );
}