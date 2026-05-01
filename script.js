/* ══════════════════════════════════════
   SIDEBAR TOGGLE
══════════════════════════════════════ */
const lsb      = document.getElementById('sidebar');
const mainWrap = document.getElementById('mainWrap');
const overlay  = document.getElementById('overlay');
const mob      = () => window.innerWidth < 1024;

function openSidebar() {
  if (mob()) { lsb.classList.remove('lsb-hidden'); lsb.classList.add('lsb-open'); overlay.classList.add('show'); }
  else       { lsb.classList.remove('lsb-hidden'); mainWrap.classList.remove('sb-closed'); mainWrap.classList.add('sb-open'); }
}
function closeSidebar() {
  if (mob()) { lsb.classList.remove('lsb-open'); lsb.classList.add('lsb-hidden'); overlay.classList.remove('show'); }
  else       { lsb.classList.add('lsb-hidden'); mainWrap.classList.remove('sb-open'); mainWrap.classList.add('sb-closed'); }
}
function toggleSidebar() { lsb.classList.contains('lsb-hidden') ? openSidebar() : closeSidebar(); }

window.addEventListener('resize', () => {
  if (!mob()) { overlay.classList.remove('show'); if (!lsb.classList.contains('lsb-hidden')) { mainWrap.classList.add('sb-open'); mainWrap.classList.remove('sb-closed'); } }
});

/* ══════════════════════════════════════
   SEARCH — highlight matching words on visible page
   Works like browser Ctrl+F
══════════════════════════════════════ */
let currentMatchIdx = 0;

function handleSearch(val) {
  removeHighlights();

  const q        = val.trim();
  const clearBtn = document.getElementById('searchClear');
  const counter  = document.getElementById('searchCount');

  clearBtn.classList.toggle('hidden', !val);

  if (!q || q.length < 1) {
    counter.classList.add('hidden');
    return;
  }

  /* Root: search only inside whatever is currently visible */
  const root = document.querySelector('.tab-pane.active')
            || document.querySelector('.pg.active')
            || document.body;

  /* Walk all text nodes inside root */
  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT,
    { acceptNode(node) {
        const tag = node.parentElement?.tagName || '';
        if (['SCRIPT','STYLE','MARK','INPUT','TEXTAREA','BUTTON'].includes(tag))
          return NodeFilter.FILTER_REJECT;
        if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
    }}
  );

  const regex = new RegExp(`(${escRe(q)})`, 'gi');
  const nodesToReplace = [];

  while (walker.nextNode()) {
    if (regex.test(walker.currentNode.nodeValue)) {
      nodesToReplace.push(walker.currentNode);
    }
    regex.lastIndex = 0;
  }

  /* Replace text nodes: wrap matches with <mark class="sh"> */
  nodesToReplace.forEach(node => {
    const frag = document.createDocumentFragment();
    node.nodeValue.split(new RegExp(`(${escRe(q)})`, 'gi')).forEach(part => {
      if (part.toLowerCase() === q.toLowerCase()) {
        const m = document.createElement('mark');
        m.className = 'sh';
        m.textContent = part;
        frag.appendChild(m);
      } else {
        frag.appendChild(document.createTextNode(part));
      }
    });
    node.parentNode.replaceChild(frag, node);
  });

  /* Count & show result */
  const marks = document.querySelectorAll('mark.sh');
  const count = marks.length;

  if (count === 0) {
    counter.textContent = 'No match';
    counter.classList.remove('hidden');
    counter.style.color = '#ef4444';
    return;
  }

  counter.textContent = `${count} match${count>1?'es':''}`;
  counter.classList.remove('hidden');
  counter.style.color = '';

  /* Highlight first match as "current" (orange) and scroll to it */
  currentMatchIdx = 0;
  marks[0].classList.add('sh-current');
  marks[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/* Navigate matches with Enter key */
document.getElementById('searchInput')?.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const marks = document.querySelectorAll('mark.sh');
    if (!marks.length) return;
    marks[currentMatchIdx]?.classList.remove('sh-current');
    currentMatchIdx = (currentMatchIdx + 1) % marks.length;
    marks[currentMatchIdx].classList.add('sh-current');
    marks[currentMatchIdx].scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  if (e.key === 'Escape') { clearSearch(); e.target.blur(); }
});

function removeHighlights() {
  document.querySelectorAll('mark.sh').forEach(m => {
    m.parentNode.replaceChild(document.createTextNode(m.textContent), m);
  });
  /* Merge adjacent text nodes */
  document.body.normalize();
}

function clearSearch() {
  removeHighlights();
  const inp = document.getElementById('searchInput');
  if (inp) inp.value = '';
  document.getElementById('searchClear')?.classList.add('hidden');
  document.getElementById('searchCount')?.classList.add('hidden');
}

function escRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/* ══════════════════════════════════════
   NOTIFICATION BELL
══════════════════════════════════════ */
function toggleNotif() {
  const dd = document.getElementById('notifDropdown');
  dd.classList.toggle('hidden');
}

function markAllRead() {
  document.querySelectorAll('.notif-item.unread').forEach(n => n.classList.remove('unread'));
  document.getElementById('bellDot').classList.add('hidden');
  document.getElementById('notifDropdown').classList.add('hidden');
}

/* Close notification dropdown on outside click */
document.addEventListener('click', e => {
  const wrap = document.getElementById('notifDropdown');
  const btn  = document.getElementById('notifBtn');
  if (wrap && !wrap.contains(e.target) && !btn.contains(e.target)) {
    wrap.classList.add('hidden');
  }
});

/* ══════════════════════════════════════
   SIDEBAR CHAT
══════════════════════════════════════ */
const chatReplies = [
  { keys: ['trademark','brand','logo','register'],
    reply: 'We can help with trademark registration in Bangladesh and internationally via the Madrid Protocol. Would you like to know more about the process?' },
  { keys: ['patent','invention','product'],
    reply: 'Our patent attorneys can guide you through the full filing process at DPDT, including PCT international applications. What type of invention do you have?' },
  { keys: ['design','appearance','visual'],
    reply: 'Design registration protects the look of your product. We handle both local (DPDT) and international (Hague System) design filings. Tell us more about your product.' },
  { keys: ['copyright','music','software','book','art'],
    reply: 'We register copyrights for literary, artistic, musical, and software works under the Bangladesh Copyright Act 2000. What type of work would you like to protect?' },
  { keys: ['cost','price','fee','charge','how much'],
    reply: 'Our fees depend on the type of service. Please use the Contact page or call us for a detailed quote — we offer a free first consultation! 😊' },
  { keys: ['hello','hi','hey','good morning','good afternoon','assalamu'],
    reply: 'Hello! 👋 Welcome to IPServiceBD. How can we assist you with your intellectual property needs today?' },
  { keys: ['contact','call','phone','email','office'],
    reply: 'You can reach us at info@ipservicebd.com or visit our Contact page for the full details. We\'re available Sun–Thu, 9AM–6PM.' },
  { keys: ['urgent','fast','quick','emergency'],
    reply: 'We understand urgency in IP matters! Please contact us directly at info@ipservicebd.com and mention it\'s urgent — our team will prioritise your case.' },
];

const defaultReplies = [
  'Thank you for your message! Our IP specialists will get back to you shortly. You can also visit our Contact page for immediate assistance.',
  'Great question! For detailed advice, please use our Contact page or email info@ipservicebd.com — a consultation is free!',
  'We\'re here to help with all your IP needs. Could you tell us more so we can point you to the right service?',
];

function sendChat() {
  const input = document.getElementById('chatInput');
  const msg = input.value.trim();
  if (!msg) return;

  const box = document.getElementById('chatMessages');
  const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  /* User bubble */
  box.innerHTML += `
    <div class="chat-msg user">
      <div class="chat-bubble">${msg}</div>
      <span class="chat-time">You · ${now}</span>
    </div>`;

  input.value = '';
  box.scrollTop = box.scrollHeight;

  /* Typing indicator */
  const typingId = 'typing-' + Date.now();
  box.innerHTML += `
    <div class="chat-msg agent chat-typing" id="${typingId}">
      <div class="chat-bubble">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      </div>
    </div>`;
  box.scrollTop = box.scrollHeight;

  /* Auto-reply after delay */
  setTimeout(() => {
    const typingEl = document.getElementById(typingId);
    if (typingEl) typingEl.remove();

    const lower = msg.toLowerCase();
    let reply = defaultReplies[Math.floor(Math.random() * defaultReplies.length)];
    for (const r of chatReplies) {
      if (r.keys.some(k => lower.includes(k))) { reply = r.reply; break; }
    }

    box.innerHTML += `
      <div class="chat-msg agent">
        <div class="chat-bubble">${reply}</div>
        <span class="chat-time">IPServiceBD Team · ${new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'})}</span>
      </div>`;
    box.scrollTop = box.scrollHeight;
  }, 1400);
}

/* ══════════════════════════════════════
   HOME TABS — each leads to a section
══════════════════════════════════════ */
/* ── TAB PANE SWITCHING ── */
function switchTab(tabKey) {
  /* Highlight the correct tab button */
  document.querySelectorAll('.htab').forEach(b => b.classList.toggle('active', b.dataset.tab === tabKey));

  /* All tab panes live inside section-home — make sure it's visible */
  switchSection('home');

  /* Show matching pane, hide others */
  document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
  const pane = document.getElementById('tab-' + tabKey);
  if (pane) pane.classList.add('active');

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelectorAll('.htab').forEach(btn => {
  btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});

/* Build portfolio grid inside Portfolio tab */
function buildPortGrid() {
  const grid = document.getElementById('portGrid');
  if (!grid || grid.children.length > 0) return;
  grid.innerHTML = portfolioData.map((d, i) => `
    <div class="pg-card" onclick="openPortfolio(${i})">
      <img src="${d.img}" alt="${d.title}" loading="lazy"/>
      <div class="pg-card-body">
        <span class="bc-cat ${d.catClass}" style="margin-bottom:6px">${d.cat}</span>
        <h4>${d.title}</h4>
        <p>${d.shortDesc}</p>
        <p class="pg-outcome"><i class="fa-solid fa-circle-check"></i> ${d.outcome}</p>
      </div>
    </div>
  `).join('');
}

/* Build second swiper for Portfolio tab */
let portfolioSwiper2;
function initPortfolioSwiper2() {
  if (portfolioSwiper2) return;
  const wrap = document.getElementById('swiperSlides2');
  if (!wrap) return;
  wrap.innerHTML = portfolioData.map((d, i) => `
    <div class="swiper-slide port-slide" onclick="openPortfolio(${i})">
      <div class="port-slide-img">
        <img src="${d.img}" alt="${d.title}" loading="lazy"/>
        <span class="port-slide-badge ${d.catClass}">${d.cat}</span>
        <span class="port-slide-view">View Case <i class="fa-solid fa-arrow-right fa-xs"></i></span>
      </div>
      <div class="port-slide-body">
        <h4>${d.title}</h4>
        <p>${d.shortDesc}</p>
        <div class="port-slide-footer">
          <span class="port-slide-outcome"><i class="fa-solid fa-circle-check"></i>${d.outcome}</span>
          <span class="port-slide-arrow"><i class="fa-solid fa-arrow-right fa-xs"></i></span>
        </div>
      </div>
    </div>
  `).join('');

  portfolioSwiper2 = new Swiper('.portfolioSwiper2', {
    effect: 'coverflow', grabCursor: true, centeredSlides: true,
    loop: true, slidesPerView: 1.3, spaceBetween: 24, speed: 900,
    coverflowEffect: { rotate: 45, stretch: 0, depth: 220, modifier: 1, slideShadows: true },
    autoplay: { delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true },
    navigation: { nextEl: '.portfolio-next2', prevEl: '.portfolio-prev2' },
    pagination: { el: '.portfolio-pagination2', clickable: true, dynamicBullets: true },
    breakpoints: {
      480: { slidesPerView: 1.3 }, 768: { slidesPerView: 1.5 },
      1024: { slidesPerView: 1.7 }, 1280: { slidesPerView: 1.9 },
    },
  });
}

/* When Portfolio tab is clicked, build its content */
document.querySelector('[data-tab="portfolios"]')?.addEventListener('click', () => {
  setTimeout(() => { buildPortGrid(); initPortfolioSwiper2(); }, 50);
});

/* ══════════════════════════════════════
   SECTION SWITCHING
══════════════════════════════════════ */
function switchSection(name) {
  document.querySelectorAll('.pg').forEach(p => p.classList.remove('active'));
  const t = document.getElementById('section-' + name);
  if (t) t.classList.add('active');
  document.querySelectorAll('.lsb-item').forEach(l => l.classList.toggle('active', l.dataset.section === name));
  /* If going home, preserve whichever tab pane is active (don't reset) */
  if (name !== 'home') {
    /* Deactivate all home tab buttons when on another page */
    document.querySelectorAll('.htab').forEach(b => b.classList.remove('active'));
  }
  if (mob()) closeSidebar();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
document.querySelectorAll('.lsb-item').forEach(l => {
  l.addEventListener('click', e => { e.preventDefault(); switchSection(l.dataset.section); });
});
document.querySelectorAll('.lsb-tag-item').forEach(t => {
  t.addEventListener('click', e => { e.preventDefault(); switchSection('home'); if (mob()) closeSidebar(); });
});

/* ══════════════════════════════════════
   PORTFOLIO DATA
   ► To add a new case: copy one object below and fill in the fields.
   ► To remove: delete its object from the array.
   ► The slider and modals auto-update — no other code to touch.
══════════════════════════════════════ */
const portfolioData = [
  {
    title:     'Fashion Brand Protection Across Three Countries',
    cat:       'Trademark',
    catClass:  'cat-trademark',
    img:       'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=700&q=80',
    shortDesc: 'International trademark defence across Bangladesh, India & UAE.',
    outcome:   'Injunctions in 3 countries in 8 months',
    client:    'A leading Bangladeshi fashion retail brand',
    challenge: 'A competitor began using a confusingly similar trademark in Bangladesh, India, and the UAE simultaneously, causing brand dilution and customer confusion.',
    solution:  'Filed for trademark injunctions in all three jurisdictions simultaneously, secured interim relief within 30 days, and coordinated with associate firms in India and UAE.',
    result:    'Injunctions granted in all three countries within 8 months. Competitor rebranded. Client\'s trademark rights fully enforced internationally.',
    tags:      ['Trademark Enforcement', 'Multi-Jurisdiction', 'Bangladesh', 'India', 'UAE']
  },
  {
    title:     'Pharmaceutical Innovation Patent',
    cat:       'Patent',
    catClass:  'cat-patent',
    img:       'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=700&q=80',
    shortDesc: 'Patent protection for a novel drug formulation in Bangladesh.',
    outcome:   'Patent granted, PCT in 14 countries',
    client:    'A Bangladeshi pharmaceutical manufacturing company',
    challenge: 'Protecting a novel drug formulation before the country\'s LDC patent waiver ended, while navigating TRIPS compliance complexities.',
    solution:  'Drafted comprehensive patent specifications, filed at DPDT, and simultaneously filed PCT application for international protection in key export markets.',
    result:    'Patent granted in Bangladesh within 18 months. PCT pending in 14 countries. Client\'s innovation protected through 2043.',
    tags:      ['Pharmaceutical Patent', 'PCT', 'TRIPS', 'Bangladesh', 'DPDT']
  },
  {
    title:     'Consumer Product Design Registration',
    cat:       'Design',
    catClass:  'cat-design',
    img:       'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=700&q=80',
    shortDesc: 'Design protection for a leading home appliance brand.',
    outcome:   'Registered in BD + 8 export markets',
    client:    'A home appliances manufacturer',
    challenge: 'Protecting the unique visual design of a new kitchen appliance range before market launch, with competitors already filing similar designs.',
    solution:  'Expedited design search, prepared detailed drawings, filed urgent design application at DPDT within 48 hours, then Hague System for 8 additional markets.',
    result:    'Design registration obtained. Hague System filed for 8 markets. Competitor design application opposed successfully.',
    tags:      ['Design Registration', 'Hague System', 'DPDT', 'Product Design']
  },
  {
    title:     'Madrid Protocol — 12 Countries in One Filing',
    cat:       'Trademark',
    catClass:  'cat-trademark',
    img:       'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=700&q=80',
    shortDesc: 'Single WIPO filing securing trademark in 12 territories.',
    outcome:   '60% cost saving vs. individual filings',
    client:    'An export-oriented garments brand',
    challenge: 'Client needed trademark protection in 12 countries across Europe, Middle East, and Southeast Asia before international expansion, with a limited budget.',
    solution:  'Advised on Madrid Protocol route via DPDT as office of origin. Managed single international application designating all 12 territories simultaneously.',
    result:    'Trademark registered in all 12 countries at 60% lower cost than individual national filings. Client expanded to 8 new markets successfully.',
    tags:      ['Madrid Protocol', 'WIPO', 'International Trademark', '12 Countries']
  },
  {
    title:     'Trademark Infringement — Successful Litigation',
    cat:       'Litigation',
    catClass:  'cat-portfolio',
    img:       'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=700&q=80',
    shortDesc: 'Counterfeit operation stopped, BDT 8M damages awarded.',
    outcome:   'BDT 8M damages + full brand protection',
    client:    'An FMCG brand established in Bangladesh',
    challenge: 'A counterfeit manufacturer was producing and distributing identical products using the client\'s registered trademark across 6 districts of Bangladesh.',
    solution:  'Secured Anton Piller order for seizure of counterfeit goods, filed criminal and civil infringement actions, coordinated with law enforcement for raids.',
    result:    'Counterfeit goods worth BDT 45M seized. Criminal prosecution ongoing. Client awarded BDT 8M in damages. Brand fully protected.',
    tags:      ['Trademark Infringement', 'IP Litigation', 'Anton Piller', 'Bangladesh Courts']
  },
  {
    title:     'Fintech Software & Technology Patent Portfolio',
    cat:       'Patent',
    catClass:  'cat-patent',
    img:       'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=700&q=80',
    shortDesc: 'Patent portfolio built for a fintech startup pre-Series B.',
    outcome:   'IP valued USD 2.4M, raised USD 8M Series B',
    client:    'A Bangladeshi fintech startup (Series A stage)',
    challenge: 'Building a comprehensive patent portfolio to protect proprietary payment technology before Series B fundraising and international expansion.',
    solution:  'Conducted full IP audit, identified 6 patentable innovations, drafted and filed applications, advised on trade secret strategy for non-patentable IP.',
    result:    '3 patents granted, 3 pending. IP portfolio valued at USD 2.4M. Client raised Series B of USD 8M.',
    tags:      ['Software Patent', 'Fintech', 'IP Portfolio', 'Startup']
  },
  {
    title:     'Complete Brand IP Audit & Restructuring',
    cat:       'Trademark',
    catClass:  'cat-trademark',
    img:       'https://images.unsplash.com/photo-1618556450991-2f1af64e8191?w=700&q=80',
    shortDesc: 'IP audit and consolidation for a garments export company.',
    outcome:   '35% reduction in annual IP maintenance cost',
    client:    'A major garments export company (500+ employees)',
    challenge: 'Company had accumulated IP in multiple names over 20 years with no centralized strategy, creating significant legal risk.',
    solution:  'Comprehensive 3-month IP audit, identified 40+ IP assets, consolidated into proper legal entities, filed missing registrations, created IP management policy.',
    result:    'Full IP portfolio organized and protected. 12 new registrations filed. Annual maintenance cost reduced 35%. Legal risk mitigated.',
    tags:      ['IP Audit', 'Brand Strategy', 'Trademark', 'Copyright', 'Portfolio Management']
  },
  {
    title:     'Cloud ERP Software Copyright Registration',
    cat:       'Copyright',
    catClass:  'cat-design',
    img:       'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=700&q=80',
    shortDesc: 'Copyright registered, competitor product withdrawn in 60 days.',
    outcome:   'Competitor withdrew. Settlement secured.',
    client:    'A SaaS company providing ERP solutions',
    challenge: 'Protecting source code, UI/UX, and documentation for a cloud ERP platform, as a competitor launched a near-identical product.',
    solution:  'Filed copyright registration for all software components, issued cease and desist, filed infringement action supported by registered copyright evidence.',
    result:    'Copyright registered. Competitor withdrew infringing software within 60 days. Settlement secured. Client\'s IP rights formally established.',
    tags:      ['Software Copyright', 'Copyright Registration', 'IP Enforcement', 'SaaS']
  }
];

/* ══════════════════════════════════════
   BUILD SWIPER SLIDES FROM DATA
══════════════════════════════════════ */
function buildSlides() {
  const wrap = document.getElementById('swiperSlides');
  if (!wrap) return;
  wrap.innerHTML = portfolioData.map((d, i) => `
    <div class="swiper-slide port-slide" onclick="openPortfolio(${i})">
      <div class="port-slide-img">
        <img src="${d.img}" alt="${d.title}" loading="lazy"/>
        <span class="port-slide-badge ${d.catClass}">${d.cat}</span>
        <span class="port-slide-view">View Case <i class="fa-solid fa-arrow-right fa-xs"></i></span>
      </div>
      <div class="port-slide-body">
        <h4>${d.title}</h4>
        <p>${d.shortDesc}</p>
        <div class="port-slide-footer">
          <span class="port-slide-outcome"><i class="fa-solid fa-circle-check"></i>${d.outcome}</span>
          <span class="port-slide-arrow"><i class="fa-solid fa-arrow-right fa-xs"></i></span>
        </div>
      </div>
    </div>
  `).join('');
}
buildSlides();

/* ══════════════════════════════════════
   INIT SWIPER — 3D Coverflow
   Continuous motion + center card full, sides smaller & tilted
══════════════════════════════════════ */
const portfolioSwiper = new Swiper('.portfolioSwiper', {

  effect:         'coverflow',
  grabCursor:     true,
  centeredSlides: true,
  loop:           true,
  slidesPerView:  1.3,
  spaceBetween:   24,

  /* Smooth, relaxed speed — not sudden */
  speed: 900,

  coverflowEffect: {
    rotate:       45,
    stretch:      0,
    depth:        220,
    modifier:     1,
    slideShadows:  true,
  },

  /* Autoplay with proper delay so arrows work clearly */
  autoplay: {
    delay:                3500,
    disableOnInteraction: false,
    pauseOnMouseEnter:    true,
  },

  /* Arrows — working navigation */
  navigation: {
    nextEl: '.portfolio-next',
    prevEl: '.portfolio-prev',
  },

  pagination: {
    el:             '.portfolio-pagination',
    clickable:      true,
    dynamicBullets: true,
  },

  keyboard: { enabled: true },

  breakpoints: {
    480:  { slidesPerView: 1.3, spaceBetween: 20 },
    768:  { slidesPerView: 1.5, spaceBetween: 24 },
    1024: { slidesPerView: 1.7, spaceBetween: 28 },
    1280: { slidesPerView: 1.9, spaceBetween: 30 },
  },
});

/* ══════════════════════════════════════
   PORTFOLIO MODAL — Single item
══════════════════════════════════════ */
function openPortfolio(idx) {
  const d = portfolioData[idx];
  document.getElementById('modalContent').innerHTML = `
    <img src="${d.img}" alt="${d.title}" class="modal-hero-img"/>
    <div class="modal-body">
      <span class="modal-cat ${d.catClass}">${d.cat}</span>
      <h2 class="modal-title">${d.title}</h2>
      <div class="modal-section">
        <div class="modal-section-title">Client</div>
        <p>${d.client}</p>
      </div>
      <div class="modal-section">
        <div class="modal-section-title">Challenge</div>
        <p>${d.challenge}</p>
      </div>
      <div class="modal-section">
        <div class="modal-section-title">Our Solution</div>
        <p>${d.solution}</p>
      </div>
      <div class="modal-section">
        <div class="modal-section-title">Outcome</div>
        <p><strong style="color:#059669">${d.result}</strong></p>
      </div>
      <div class="modal-tags">
        ${d.tags.map(t => `<span>${t}</span>`).join('')}
      </div>
    </div>
    <div class="modal-footer">
      <button class="modal-btn modal-btn-secondary" onclick="closePortfolio()">← Back</button>
      <button class="modal-btn modal-btn-primary" onclick="switchSection('contact');closePortfolio()">
        <i class="fa-solid fa-paper-plane"></i> Discuss Your Case
      </button>
    </div>
  `;
  document.getElementById('portfolioModal').classList.add('open');
  document.body.style.overflow = 'hidden';
  portfolioSwiper.autoplay.stop();
}

function closePortfolio() {
  document.getElementById('portfolioModal').classList.remove('open');
  document.body.style.overflow = '';
  portfolioSwiper.autoplay.start();
}
function closeModal(e) { if (e.target === e.currentTarget) closePortfolio(); }

/* ══════════════════════════════════════
   ALL PORTFOLIOS MODAL
══════════════════════════════════════ */
function openAllPortfolios() {
  const grid = document.getElementById('allPortfoliosGrid');
  grid.innerHTML = portfolioData.map((d, i) => `
    <div class="ap-card" onclick="openPortfolioFromAll(${i})">
      <img src="${d.img}" alt="${d.title}"/>
      <div class="ap-card-body">
        <span class="modal-cat ${d.catClass}" style="font-size:9.5px;padding:2px 8px;margin-bottom:6px;display:inline-block">${d.cat}</span>
        <h4>${d.title}</h4>
        <p>${d.shortDesc}</p>
        <p style="font-size:11px;color:#059669;font-weight:600;margin-top:6px"><i class="fa-solid fa-circle-check"></i> ${d.outcome}</p>
      </div>
    </div>
  `).join('');
  document.getElementById('allPortfoliosModal').classList.add('open');
  document.body.style.overflow = 'hidden';
  portfolioSwiper.autoplay.stop();
}
function openPortfolioFromAll(idx) {
  closeAllPortfolios();
  setTimeout(() => openPortfolio(idx), 120);
}
function closeAllPortfolios() {
  document.getElementById('allPortfoliosModal').classList.remove('open');
  document.body.style.overflow = '';
  portfolioSwiper.autoplay.start();
}
function closeAllModal(e) { if (e.target === e.currentTarget) closeAllPortfolios(); }

/* ══════════════════════════════════════
   CONTACT FORM
══════════════════════════════════════ */
function handleFormSubmit(e) {
  e.preventDefault();
  showToast('Message sent! We will contact you shortly.');
  e.target.reset();
}

/* ══════════════════════════════════════
   TOAST
══════════════════════════════════════ */
function showToast(msg) {
  const t = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  t.classList.remove('hidden');
  setTimeout(() => t.classList.add('hidden'), 3500);
}

/* ══════════════════════════════════════
   KEYBOARD
══════════════════════════════════════ */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closePortfolio(); closeAllPortfolios(); if (mob()) closeSidebar(); }
});
