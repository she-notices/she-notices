
document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.querySelector('.menu-toggle');
  const links = document.querySelector('.links');

  if (menuBtn && links) {
    menuBtn.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(open));
    });

    links.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        links.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const cards = [...document.querySelectorAll('.card[data-category]')];
  const filterButtons = [...document.querySelectorAll('.filter')];
  const searchInput = document.querySelector('#article-search');
  const emptyState = document.querySelector('#empty-state');
  let activeFilter = 'all';

  function updateCards() {
    const query = (searchInput?.value || '').trim().toLowerCase();
    let visibleCount = 0;

    cards.forEach(card => {
      const categories = (card.dataset.category || '').split(' ');
      const title = (card.dataset.title || '').toLowerCase();
      const matchesFilter = activeFilter === 'all' || categories.includes(activeFilter);
      const matchesSearch = !query || title.includes(query);
      const visible = matchesFilter && matchesSearch;

      card.hidden = !visible;
      if (visible) visibleCount++;
    });

    if (emptyState) emptyState.hidden = visibleCount !== 0;
  }

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      button.classList.add('active');
      activeFilter = button.dataset.filter || 'all';
      updateCards();
    });
  });

  searchInput?.addEventListener('input', updateCards);

  const topButton = document.querySelector('.back-to-top');
  if (topButton) {
    const updateTopButton = () => topButton.classList.toggle('show', window.scrollY > 600);
    window.addEventListener('scroll', updateTopButton, { passive: true });
    updateTopButton();
    topButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('visible'));
  }
});
