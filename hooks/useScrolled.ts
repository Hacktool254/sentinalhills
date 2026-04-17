'use client';

import { useState, useEffect } from 'react';

export function useScrolled(threshold = 10) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Return early during SSR
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      setScrolled(window.scrollY > threshold);
    };

    // Check on mount as well
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return scrolled;
}
