/* ===== SIDEBAR ===== */
const sidebar   = document.getElementById('sidebar');
const mainWrap  = document.getElementById('mainWrap');
const overlay   = document.getElementById('overlay');
const isMobile  = () => window.innerWidth < 1024;

function openSidebar() {
  if (isMobile()) {
    sidebar.classList.remove('sb-hidden');
    sidebar.classList.add('sb-open');
    overlay.classList.add('show');
  } else {
    sidebar.classList.remove('sb-hidden');
    mainWrap.classList.remove('sb-closed');
    mainWrap.classList.add('sb-open');
  }
}

function closeSidebar() {
  if (isMobile()) {
    sidebar.classList.remove('sb-open');
    sidebar.classList.add('sb-hidden');
    overlay.classList.remove('show');
  } else {
    sidebar.classList.add('sb-hidden');
    mainWrap.classList.remove('sb-open');
    mainWrap.classList.add('sb-closed');
  }
}

function toggleSidebar() {
  const hidden = sidebar.classList.contains('sb-hidden');
  hidden ? openSidebar() : closeSidebar();
}

window.addEventListener('resize', () => {
  if (!isMobile()) {
    overlay.classList.remove('show');
    if (!sidebar.classList.contains('sb-hidden')) {
      mainWrap.classList.add('sb-open');
      mainWrap.classList.remove('sb-closed');
    }
  }
});

/* ===== SECTION SWITCHING ===== */
function switchSection(name) {
  document.querySelectorAll('.pg').forEach(s => s.classList.remove('active'));
  const t = document.getElementById('section-' + name);
  if (t) t.classList.add('active');
  document.querySelectorAll('.nav-link').forEach(l => l.classList.toggle('active', l.dataset.section === name));
  if (isMobile()) closeSidebar();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelectorAll('.nav-link').forEach(l => {
  l.addEventListener('click', e => { e.preventDefault(); switchSection(l.dataset.section); });
});

/* ===== TAG FILTER (sidebar tags) ===== */
document.querySelectorAll('.tag-link').forEach(t => {
  t.addEventListener('click', e => {
    e.preventDefault();
    switchSection('home');
    const map = { trademark:'trademark', patent:'patent', design:'design', portfolio:'portfolio', gallery:'gallery' };
    setTimeout(() => {
      const k = map[t.dataset.filter] || 'all';
      setTab(k); filterCards(k);
    }, 60);
  });
});

/* ===== RIGHT SIDEBAR CATEGORY FILTER ===== */
function filterByTag(cat) {
  switchSection('home');
  setTimeout(() => { setTab(cat); filterCards(cat); }, 60);
  return false;
}

/* ===== TABS ===== */
document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => {
    setTab(btn.dataset.tab);
    filterCards(btn.dataset.tab);
  });
});

function setTab(key) {
  document.querySelectorAll('.tab').forEach(b => b.classList.toggle('active', b.dataset.tab === key));
}

/* ===== FILTER CARDS ===== */
function filterCards(tab) {
  const featured = document.getElementById('featuredPost');
  const items    = document.querySelectorAll('#postList .post-item');
  const noRes    = document.getElementById('noResults');
  let n = 0;

  if (featured) {
    const show = tab === 'all' || featured.dataset.category === tab;
    featured.style.display = show ? '' : 'none';
    if (show) n++;
  }
  items.forEach(item => {
    const show = tab === 'all' || item.dataset.category === tab;
    item.style.display = show ? '' : 'none';
    if (show) n++;
  });
  noRes.classList.toggle('hidden', n > 0);
}

/* ===== SEARCH ===== */
function handleSearch(val) {
  const q = val.trim().toLowerCase();
  const featured = document.getElementById('featuredPost');
  const items    = document.querySelectorAll('#postList .post-item');
  const noRes    = document.getElementById('noResults');
  let n = 0;

  if (!q) {
    if (featured) featured.style.display = '';
    items.forEach(i => (i.style.display = ''));
    noRes.classList.add('hidden');
    return;
  }
  [featured, ...items].forEach(el => {
    if (!el) return;
    const show = el.innerText.toLowerCase().includes(q);
    el.style.display = show ? '' : 'none';
    if (show) n++;
  });
  noRes.classList.toggle('hidden', n > 0);
}

/* ===== FORM ===== */
function handleFormSubmit(e) {
  e.preventDefault();
  showToast('Message sent! We will contact you shortly.');
  e.target.reset();
}

/* ===== TOAST ===== */
function showToast(msg) {
  const t = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  t.classList.remove('hidden');
  setTimeout(() => t.classList.add('hidden'), 3500);
}

/* ===== KEYBOARD SHORTCUTS ===== */
document.addEventListener('keydown', e => {
  const tag = document.activeElement.tagName;
  if (e.key === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA') {
    e.preventDefault(); document.getElementById('searchInput').focus();
  }
  if (e.key === 'Escape') {
    document.getElementById('searchInput').blur();
    if (isMobile()) closeSidebar();
  }
});

/* ===== SCROLL ENTRANCE ANIMATION ===== */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll(
  '.post-item, .post-featured, .svc-card, .tm-card, .test-card, .cl-card, .rs-widget'
).forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(14px)';
  el.style.transition = `opacity .4s ease ${i * 0.03}s, transform .4s ease ${i * 0.03}s, box-shadow .22s, translateY .22s`;
  io.observe(el);
});
