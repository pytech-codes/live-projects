gsap.registerPlugin(ScrollTrigger);

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReduced) {
  gsap.from('.brand, .nav a', {
    y: -10,
    opacity: 0,
    duration: 0.7,
    stagger: 0.06,
    ease: 'power2.out'
  });

  gsap.from('.page-title, .page-sub, .panel', {
    y: 16,
    opacity: 0,
    duration: 0.8,
    stagger: 0.12,
    ease: 'power2.out'
  });
}
