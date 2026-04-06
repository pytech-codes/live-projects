gsap.registerPlugin(ScrollTrigger);

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReduced) {
  gsap.from('.hero-kicker', {
    y: -12,
    opacity: 0,
    duration: 0.7,
    ease: 'power2.out'
  });

  gsap.from('.hero-title', {
    y: -18,
    opacity: 0,
    duration: 0.9,
    delay: 0.1,
    ease: 'power2.out'
  });

  gsap.from('.booking', {
    x: 28,
    opacity: 0,
    duration: 0.9,
    delay: 0.2,
    ease: 'power2.out'
  });

  gsap.from('.feature', {
    scrollTrigger: {
      trigger: '.features',
      start: 'top 80%'
    },
    y: 18,
    opacity: 0,
    duration: 0.7,
    stagger: 0.12,
    ease: 'power2.out'
  });

  gsap.from('.welcome-title, .welcome-text, .welcome .btn', {
    scrollTrigger: {
      trigger: '.welcome',
      start: 'top 80%'
    },
    y: 14,
    opacity: 0,
    duration: 0.7,
    stagger: 0.12,
    ease: 'power2.out'
  });

  gsap.from('.card', {
    scrollTrigger: {
      trigger: '.cards',
      start: 'top 80%'
    },
    y: 18,
    opacity: 0,
    duration: 0.7,
    stagger: 0.12,
    ease: 'power2.out'
  });
}
