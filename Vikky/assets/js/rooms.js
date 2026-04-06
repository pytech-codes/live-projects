gsap.registerPlugin(ScrollTrigger);

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function applyFilters() {
  const type = document.getElementById('roomType')?.value || 'all';
  const price = document.getElementById('price')?.value || 'any';
  const guests = document.getElementById('guests2')?.value || '2';

  const maxPrice = price === 'any' ? Infinity : Number(price);
  const guestsNum = Number(guests);

  const rooms = document.querySelectorAll('.room');
  rooms.forEach((room) => {
    const roomType = room.getAttribute('data-type');
    const roomPrice = Number(room.getAttribute('data-price'));
    const roomGuests = Number(room.getAttribute('data-guests'));

    const matchesType = type === 'all' || roomType === type;
    const matchesPrice = roomPrice <= maxPrice;
    const matchesGuests = roomGuests >= guestsNum;

    room.style.display = matchesType && matchesPrice && matchesGuests ? '' : 'none';
  });
}

document.getElementById('applyFilters')?.addEventListener('click', applyFilters);

if (!prefersReduced) {
  gsap.from('.brand, .nav a', {
    y: -10,
    opacity: 0,
    duration: 0.7,
    stagger: 0.06,
    ease: 'power2.out'
  });

  gsap.from('.rooms-title, .rooms-sub, .filters', {
    y: 16,
    opacity: 0,
    duration: 0.8,
    stagger: 0.12,
    ease: 'power2.out'
  });

  gsap.from('.room', {
    scrollTrigger: {
      trigger: '.rooms',
      start: 'top 80%'
    },
    y: 18,
    opacity: 0,
    duration: 0.7,
    stagger: 0.10,
    ease: 'power2.out'
  });
}
