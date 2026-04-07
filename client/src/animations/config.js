// GSAP Animation configurations and utilities
export const animationConfig = {
  duration: {
    fast: 0.2,
    normal: 0.4,
    slow: 0.6,
    slower: 1.0,
  },
  ease: {
    smooth: 'power2.out',
    smoothIn: 'power2.in',
    smoothInOut: 'power2.inOut',
    elastic: 'elastic.out(1, 0.5)',
    back: 'back.out(1.4)',
    bounce: 'bounce.out',
    expo: 'expo.out',
  },
  stagger: {
    fast: 0.05,
    normal: 0.1,
    slow: 0.15,
  },
};

// Predefined animation presets
export const presets = {
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1, duration: 0.6, ease: 'power2.out' },
  },
  slideUp: {
    from: { opacity: 0, y: 60 },
    to: { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
  },
  slideDown: {
    from: { opacity: 0, y: -40 },
    to: { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
  },
  slideLeft: {
    from: { opacity: 0, x: 60 },
    to: { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' },
  },
  slideRight: {
    from: { opacity: 0, x: -60 },
    to: { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' },
  },
  scaleIn: {
    from: { opacity: 0, scale: 0.8 },
    to: { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.4)' },
  },
  rotateIn: {
    from: { opacity: 0, rotation: -5, y: 40 },
    to: { opacity: 1, rotation: 0, y: 0, duration: 0.8, ease: 'power3.out' },
  },
};

// ScrollTrigger default configuration
export const scrollTriggerDefaults = {
  start: 'top 85%',
  end: 'bottom 15%',
  toggleActions: 'play none none reverse',
};

// Counter animation helper
export const counterAnimation = {
  duration: 2,
  ease: 'power2.out',
  snap: { innerText: 1 },
};
