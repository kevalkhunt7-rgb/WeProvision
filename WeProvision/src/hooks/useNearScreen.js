import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook to detect when an element is approaching the viewport.
 * Used for lazy-loading heavy 3D canvases and models only when the section is near.
 */
export function useNearScreen({ rootMargin = '80px 0px', once = false } = {}) {
  const [isNear, setIsNear] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setIsNear(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsNear(true);
          if (once) {
            observer.disconnect();
          }
        } else if (!once) {
          setIsNear(false);
        }
      },
      { rootMargin }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [rootMargin, once]);

  return [ref, isNear];
}
