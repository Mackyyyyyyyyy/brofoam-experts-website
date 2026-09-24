// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navMobile = document.querySelector('.nav-mobile');
navToggle.addEventListener('click', () => {
  navMobile.classList.toggle('open');
});
navMobile.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navMobile.classList.remove('open'));
});

// FAQ accordion
document.querySelectorAll('.faq-item').forEach(item => {
  item.querySelector('.faq-q').addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// Project category filter
const tabs = document.querySelectorAll('.filter-tab');
const cards = document.querySelectorAll('.project-card');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const filter = tab.dataset.filter;
    cards.forEach(card => {
      const cats = card.dataset.cat.split(' ');
      card.classList.toggle('hide', filter !== 'all' && !cats.includes(filter));
    });
  });
});

// Simple slide arrows (scroll gallery / project grid into view direction)
document.querySelectorAll('.gallery-arrows').forEach(group => {
  const [prev, next] = group.querySelectorAll('button');
  const track = group.closest('section').querySelector('.gallery-grid, .project-cards');
  if (!track) return;
  const scrollAmt = 320;
  prev.addEventListener('click', () => track.scrollBy({left: -scrollAmt, behavior: 'smooth'}));
  next.addEventListener('click', () => track.scrollBy({left: scrollAmt, behavior: 'smooth'}));
});
