import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scrolls the window to top on route change
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant', // Use 'smooth' if you want a smooth scroll animation
    });
  }, [pathname]);

  return null;
}