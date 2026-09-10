import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

/**
 * ZoomSection - A reusable scroll-driven zoom & fade section component.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Main visual content to zoom
 * @param {React.ReactNode} [props.overlayContent] - Content floating above zoomed visual
 * @param {React.ReactNode} [props.bgContent] - Background content layer
 * @param {number} [props.scaleTo=1.8] - Target scale factor for central visual
 * @param {number} [props.fadeStart=0.65] - Scrub progress threshold when fade starts
 * @param {string} [props.pinDistance="120%"] - Scroll distance while pinned
 * @param {string} [props.className=""] - Container classes
 * @param {number} [props.zIndex=10] - CSS z-index stack height
 * @param {number} [props.scrub=1] - GSAP scrub value
 * @param {boolean} [props.markers=true] - Enable visual ScrollTrigger debug markers
 */
const ZoomSection = ({
  children,
  overlayContent,
  bgContent,
  scaleTo = 1.8,
  fadeStart = 0.65,
  pinDistance = '120%',
  className = '',
  zIndex = 10,
  scrub = 1,
  markers = true,
}) => {
  const sectionRef = useRef(null);
  const zoomTargetRef = useRef(null);
  const overlayRef = useRef(null);
  const bgRef = useRef(null);

  useGSAP(
    () => {
      const sectionEl = sectionRef.current;
      const zoomTargetEl = zoomTargetRef.current;
      const overlayEl = overlayRef.current;
      const bgEl = bgRef.current;

      if (!sectionEl || !zoomTargetEl) return;

      const mm = gsap.matchMedia();

      // DESKTOP & TABLET: Pinned scroll-driven zoom & fade
      mm.add('(min-width: 769px)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionEl,
            start: 'top top',
            end: `+=${pinDistance}`,
            pin: true,
            scrub: scrub,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            markers: markers, // Debug markers enabled
          },
        });

        // 1. Central Visual Zoom
        tl.to(
          zoomTargetEl,
          {
            scale: scaleTo,
            ease: 'power1.inOut',
            duration: 1,
          },
          0
        );

        // 2. Fade out visual near end of scrub
        tl.to(
          zoomTargetEl,
          {
            opacity: 0,
            ease: 'power2.in',
            duration: 1 - fadeStart,
          },
          fadeStart
        );

        // 3. Background subtle zoom/parallax
        if (bgEl) {
          tl.to(
            bgEl,
            {
              scale: 1.15,
              opacity: 0.2,
              ease: 'none',
              duration: 1,
            },
            0
          );
        }

        // 4. Overlay Parallax & Fade Out
        if (overlayEl) {
          tl.to(
            overlayEl,
            {
              y: -80,
              scale: 0.95,
              opacity: 0,
              ease: 'power1.in',
              duration: 0.5,
            },
            fadeStart - 0.1 > 0 ? fadeStart - 0.1 : 0
          );
        }
      });

      // MOBILE FALLBACK (<768px): Scroll-linked animation without pinning
      mm.add('(max-width: 768px)', () => {
        gsap.fromTo(
          zoomTargetEl,
          { scale: 0.95, opacity: 0.8 },
          {
            scale: 1.15,
            opacity: 1,
            scrollTrigger: {
              trigger: sectionEl,
              start: 'top 80%',
              end: 'bottom 20%',
              scrub: true,
              markers: markers,
            },
          }
        );

        if (overlayEl) {
          gsap.to(overlayEl, {
            y: -20,
            scrollTrigger: {
              trigger: sectionEl,
              start: 'top 70%',
              end: 'bottom 30%',
              scrub: true,
            },
          });
        }
      });

      // Force instant refresh of calculations
      ScrollTrigger.refresh();

      return () => {
        mm.revert();
      };
    },
    { scope: sectionRef, dependencies: [scaleTo, fadeStart, pinDistance, scrub, markers] }
  );

  return (
    <section
      ref={sectionRef}
      style={{ zIndex }}
      className={`relative w-full h-screen bg-[#07050e] text-white flex flex-col items-center justify-center ${className}`}
    >
      {/* Background Layer */}
      {bgContent && (
        <div
          ref={bgRef}
          className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden will-change-transform transform-gpu"
        >
          {bgContent}
        </div>
      )}

      {/* Main Zoom Visual Container */}
      <div
        ref={zoomTargetRef}
        className="relative z-10 w-full h-full flex items-center justify-center p-4 sm:p-8 will-change-transform transform-gpu origin-center overflow-hidden"
        style={{
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
        }}
      >
        {children}
      </div>

      {/* Foreground / Overlay Text Content */}
      {overlayContent && (
        <div
          ref={overlayRef}
          className="absolute inset-x-0 bottom-12 sm:bottom-16 z-20 pointer-events-none flex flex-col items-center justify-center text-center px-6 will-change-transform transform-gpu"
        >
          {overlayContent}
        </div>
      )}
    </section>
  );
};

export default ZoomSection;
