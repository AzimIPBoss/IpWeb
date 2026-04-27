/* ===== SIDEBAR TOGGLE ===== */
const sidebar      = document.getElementById('sidebar');
const mainWrapper  = document.getElementById('mainWrapper');
const overlay      = document.getElementById('overlay');
const isMobile     = () => window.innerWidth < 1024;

function openSidebar() {
  sidebar.classList.remove('collapsed');
  if (isMobile()) {
    sidebar.classList.add('open');
    overlay.classList.remove('hidden');
  } else {
    mainWrapper.classList.remove('sidebar-closed');
    mainWrapper.classList.add('sidebar-open');
  }
}

function closeSidebar() {
  if (isMobile()) {
    sidebar.classList.remove('open');
    overlay.classList.add('hidden');
  } else {
    sidebar.classList.add('collapsed');
    mainWrapper.classList.remove('sidebar-open');
    mainWrapper.classList.add('sidebar-closed');
  }
}

function toggleSidebar() {
  if (isMobile()) {
    const isOpen = sidebar.classList.contains('open');
    isOpen ? closeSidebar() : openSidebar();
  } else {
    const isCollapsed = sidebar.classList.contains('collapsed');
    isCollapsed ? openSidebar() : closeSidebar();
  }
}

/* On resize, fix state */
window.addEventListener('resize', () => {
  if (!isMobile()) {
    overlay.classList.add('hidden');
    sidebar.classList.remove('open');
    /* If sidebar was forced open on mobile, restore desktop state */
    if (!sidebar.classList.contains('collapsed')) {
      mainWrapper.classList.add('sidebar-open');
      mainWrapper.classList.remove('sidebar-closed');
    }
  }
});

/* ===== SECTION SWITCHING ===== */
function switchSection(name) {
  document.querySelectorAll('.section-page').forEach(s => s.classList.remove('active'));
  const target = document.getElementById('section-' + name);
  if (target) target.classList.add('active');

  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.section === name);
  });

  if (isMobile()) closeSidebar();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* Nav link clicks */
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
    switchSection('home');
    const map = { trademark: 'trademark', patent: 'patent', design: 'design', portfolio: 'portfolio', gallery: 'gallery' };
    const tabKey = map[tag.dataset.filter] || 'all';
    setTimeout(() => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tabKey));
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
  const featured  = document.getElementById('featuredPost');
  const allCards  = document.querySelectorAll('#articleGrid .art-card');
  const noResults = document.getElementById('noResults');
  let visible = 0;

  /* Featured post */
  const featCat = featured ? featured.dataset.category : '';
  const showFeat = tab === 'all' || featCat === tab;
  if (featured) featured.style.display = showFeat ? '' : 'none';
  if (showFeat) visible++;

  /* Article cards */
  allCards.forEach(card => {
    const show = tab === 'all' || card.dataset.category === tab;
    card.style.display = show ? '' : 'none';
    if (show) visible++;
  });

  noResults.classList.toggle('hidden', visible > 0);
}

/* ===== SEARCH ===== */
function handleSearch(val) {
  const q = val.trim().toLowerCase();
  const featured  = document.getElementById('featuredPost');
  const allCards  = document.querySelectorAll('#articleGrid .art-card');
  const noResults = document.getElementById('noResults');

  /* Reset tab highlights */
  if (!q) {
    if (featured) featured.style.display = '';
    allCards.forEach(c => (c.style.display = ''));
    noResults.classList.add('hidden');
    return;
  }

  let visible = 0;
  if (featured) {
    const show = featured.innerText.toLowerCase().includes(q);
    featured.style.display = show ? '' : 'none';
    if (show) visible++;
  }
  allCards.forEach(card => {
    const show = card.innerText.toLowerCase().includes(q);
    card.style.display = show ? '' : 'none';
    if (show) visible++;
  });
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
  document.getElementById('toastMsg').textContent = msg;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 3500);
}

/* ===== KEYBOARD SHORTCUT: / = focus search ===== */
document.addEventListener('keydown', e => {
  const active = document.activeElement.tagName;
  if (e.key === '/' && active !== 'INPUT' && active !== 'TEXTAREA') {
    e.preventDefault();
    document.getElementById('searchInput').focus();
  }
  if (e.key === 'Escape') {
    document.getElementById('searchInput').blur();
    if (isMobile()) closeSidebar();
  }
});

/* ===== CARD ENTRANCE ANIMATION ===== */
const animObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      animObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll(
  '.art-card, .featured-post, .service-card, .team-card, .testimonial-card, .client-card'
).forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(16px)';
  el.style.transition = `opacity 0.4s ease ${i * 0.04}s, transform 0.4s ease ${i * 0.04}s, box-shadow 0.22s ease, translateY 0.22s ease`;
  animObserver.observe(el);
});
