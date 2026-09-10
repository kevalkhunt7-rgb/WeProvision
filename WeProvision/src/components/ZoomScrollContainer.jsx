import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const ZoomScrollContainer = ({
  children,
  scrollDistancePerPanel = 65,
  scrubSpeed = 0.1,
  holdDuration = 0.25,
}) => {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      const panels = gsap.utils.toArray('.zoom-panel');
      const totalPanels = panels.length;
      if (totalPanels <= 1) return;

      panels.forEach((panel, i) => {
        gsap.set(panel, {
          zIndex: i === 0 ? 10 : 1,
          autoAlpha: i === 0 ? 1 : 0,
          scale: i === 0 ? 1 : 0.9,
          pointerEvents: i === 0 ? 'auto' : 'none',
        });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: () => `+=${totalPanels * scrollDistancePerPanel}%`,
          pin: true,
          pinSpacing: true,
          scrub: scrubSpeed,
          anticipatePin: 1,
          fastScrollEnd: true,
          invalidateOnRefresh: true,
        },
      });

      const promote = (el) => { el.style.willChange = 'transform, opacity'; };
      const demote = (el) => { el.style.willChange = 'auto'; };

      panels.forEach((panel, i) => {
        if (i === totalPanels - 1) return;

        const nextPanel = panels[i + 1];
        const stepLabel = `step_${i}`;

        // Gap for "reading" the current panel — no dummy tween, just a time offset
        tl.addLabel(stepLabel, holdDuration > 0 ? `+=${holdDuration}` : '>');

        // Incoming panel: elevate + promote to its own layer just before it animates
        tl.set(nextPanel, { zIndex: 10 + i + 1, onComplete: () => promote(nextPanel) }, stepLabel);

        tl.fromTo(
          nextPanel,
          { scale: 0.9, autoAlpha: 0 },
          {
            scale: 1,
            autoAlpha: 1,
            ease: 'power2.out',
            duration: 1,
            onComplete: () => {
              nextPanel.style.pointerEvents = 'auto';
              demote(nextPanel);
            },
          },
          stepLabel
        );

        // Outgoing panel: pointerEvents disabled immediately (folded into the tween start)
        tl.to(
          panel,
          {
            scale: 1.35,
            autoAlpha: 0,
            pointerEvents: 'none',
            ease: 'power2.in',
            duration: 0.9,
            onStart: () => promote(panel),
            onComplete: () => {
              panel.style.zIndex = 1;
              demote(panel);
            },
          },
          stepLabel
        );
      });

      if (holdDuration > 0) {
        tl.to({}, { duration: holdDuration });
      }
    },
    { scope: containerRef, dependencies: [scrollDistancePerPanel, scrubSpeed, holdDuration] }
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-[#07050e] selection:bg-[#F472B6]"
    >
      {React.Children.map(children, (child, index) => (
        <div
          key={index}
          className="zoom-panel absolute inset-0 w-full h-full flex items-center justify-center"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

export default ZoomScrollContainer;