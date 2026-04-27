/* ===== SIDEBAR TOGGLE (MOBILE) ===== */
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const isOpen = !sidebar.classList.contains('-translate-x-full');
  if (isOpen) {
    sidebar.classList.add('-translate-x-full');
    overlay.classList.add('hidden');
  } else {
    sidebar.classList.remove('-translate-x-full');
    overlay.classList.remove('hidden');
  }
}

/* ===== SECTION SWITCHING ===== */
function switchSection(name) {
  // Hide all sections
  document.querySelectorAll('.section-page').forEach(s => s.classList.remove('active'));
  // Show target
  const target = document.getElementById('section-' + name);
  if (target) target.classList.add('active');

  // Update nav links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.section === name);
  });

  // Close sidebar on mobile after navigation
  if (window.innerWidth < 1024) toggleSidebar();

  // Scroll to top of content
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ===== NAV LINK CLICKS ===== */
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    switchSection(link.dataset.section);
  });
});

/* ===== TAG FILTER ===== */
document.querySelectorAll('.tag-link').forEach(tag => {
  tag.addEventListener('click', e => {
    e.preventDefault();
    const filter = tag.dataset.filter;

    // Go to home section
    switchSection('home');

    // Map tag filter to tab
    const tabMap = { trademark: 'trademark', patent: 'patent', design: 'design', 'case-study': 'portfolio', gallery: 'gallery' };
    const tabKey = tabMap[filter] || 'all';

    setTimeout(() => {
      document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabKey);
      });
      filterCards(tabKey);
    }, 50);
  });
});

/* ===== TAB SWITCHING ===== */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filterCards(btn.dataset.tab);
  });
});

/* ===== CARD FILTERING ===== */
function filterCards(tab) {
  const allCards = document.querySelectorAll('[data-category]');
  const noResults = document.getElementById('noResults');
  let visible = 0;

  allCards.forEach(card => {
    const cat = card.dataset.category;
    const show = tab === 'all' || cat === tab ||
      (tab === 'core-team' && cat === 'core-team') ||
      (tab === 'portfolio' && cat === 'portfolio');

    card.style.display = show ? '' : 'none';
    if (show) visible++;
  });

  // Featured row visibility
  const featuredRow = document.getElementById('featuredRow');
  if (tab !== 'all') {
    const bigCard = featuredRow.querySelector('[data-category]');
    if (bigCard && bigCard.dataset.category !== tab) {
      featuredRow.style.display = 'none';
    } else {
      featuredRow.style.display = '';
    }
  } else {
    featuredRow.style.display = '';
  }

  noResults.classList.toggle('hidden', visible > 0);
}

/* ===== SEARCH ===== */
function handleSearch(val) {
  const query = val.trim().toLowerCase();
  const allCards = document.querySelectorAll('[data-category]');
  const noResults = document.getElementById('noResults');

  if (!query) {
    allCards.forEach(c => (c.style.display = ''));
    document.getElementById('featuredRow').style.display = '';
    noResults.classList.add('hidden');
    return;
  }

  let visible = 0;
  allCards.forEach(card => {
    const text = card.innerText.toLowerCase();
    const show = text.includes(query);
    card.style.display = show ? '' : 'none';
    if (show) visible++;
  });

  document.getElementById('featuredRow').style.display = visible > 0 ? '' : 'none';
  noResults.classList.toggle('hidden', visible > 0);
}

/* ===== CONTACT FORM ===== */
function handleFormSubmit(e) {
  e.preventDefault();
  showToast('Message sent! We will contact you shortly.');
  e.target.reset();
}

/* ===== TOAST ===== */
function showToast(msg) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  toastMsg.textContent = msg;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 3500);
}

/* ===== LAZY LOAD IMAGES (Intersection Observer) ===== */
if ('IntersectionObserver' in window) {
  const imgs = document.querySelectorAll('img[loading="lazy"]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        observer.unobserve(img);
      }
    });
  }, { rootMargin: '100px' });
  imgs.forEach(img => observer.observe(img));
}

/* ===== KEYBOARD SHORTCUT: / to focus search ===== */
document.addEventListener('keydown', e => {
  if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
    e.preventDefault();
    document.getElementById('searchInput').focus();
  }
  if (e.key === 'Escape') {
    document.getElementById('searchInput').blur();
    if (window.innerWidth < 1024) {
      const sidebar = document.getElementById('sidebar');
      if (!sidebar.classList.contains('-translate-x-full')) toggleSidebar();
    }
  }
});

/* ===== SMOOTH CARD ENTRANCE ANIMATION ===== */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.card-big, .card-small, .card-regular, .service-card, .team-card, .testimonial-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(18px)';
  el.style.transition = 'opacity 0.4s ease, transform 0.4s ease, box-shadow 0.22s ease';
  observer.observe(el);
});
