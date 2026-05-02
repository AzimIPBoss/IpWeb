/* ══════════════════════════════════════
   ADMIN DATA LOADER
   Reads localStorage saved by admin.html
   and applies changes to the live site.
══════════════════════════════════════ */
function loadAdminData() {

  /* ── Contact Info ── */
  const ci = JSON.parse(localStorage.getItem('ipsbd_contact') || 'null');
  if (ci) {
    /* Use querySelectorAll to update EVERY element with each id (handles duplicates) */
    const setAll = (id, val) => {
      if (!val) return;
      document.querySelectorAll('#' + id).forEach(el => el.textContent = val);
    };
    setAll('contact-addr',  ci.addr);
    setAll('contact-phone', ci.phone);
    setAll('contact-email', ci.email);
    setAll('contact-hours', ci.hours);
    setAll('contact-map',   ci.addr);
  }

  /* ── Portfolio ── */
  const pd = JSON.parse(localStorage.getItem('ipsbd_portfolio') || 'null');
  if (pd && pd.length) {
    /* Patch portfolioData in place so slides & modals use admin data */
    portfolioData.length = 0;
    pd.forEach((item, i) => {
      portfolioData.push({
        title:     item.title     || '',
        cat:       item.cat       || 'Trademark',
        catClass:  'cat-' + (item.cat || 'trademark').toLowerCase().replace(/\s+/g,'-'),
        img:       item.img       || 'https://picsum.photos/seed/ip0/700/420',
        shortDesc: item.desc      || '',
        outcome:   item.outcome   || '',
        client:    item.client    || '',
        challenge: item.challenge || '',
        solution:  item.solution  || '',
        result:    item.outcome   || '',
        tags:      [item.cat]
      });
    });
    buildSlides();  /* rebuild slider with new data */
    /* Tell Swiper to re-read the updated slides */
    try { portfolioSwiper.destroy(true, true); } catch(e) {}
    setTimeout(() => {
      const ps = new Swiper('.portfolioSwiper', {
        effect:'coverflow', grabCursor:true, centeredSlides:true,
        loop:true, slidesPerView:1.3, spaceBetween:24, speed:900,
        coverflowEffect:{rotate:45,stretch:0,depth:220,modifier:1,slideShadows:true},
        autoplay:{delay:3500,disableOnInteraction:false,pauseOnMouseEnter:true},
        navigation:{nextEl:'.portfolio-next',prevEl:'.portfolio-prev'},
        pagination:{el:'.portfolio-pagination',clickable:true,dynamicBullets:true},
      });
    }, 100);
  }

  /* ── Testimonials ── */
  const td = JSON.parse(localStorage.getItem('ipsbd_testi') || 'null');
  if (td && td.length) {
    /* Update the auto-scroll testimonials column */
    const wrap = document.getElementById('testiScroll');
    if (wrap) {
      wrap.innerHTML = td.map(t => `
        <div class="testi-item">
          <div class="ti-stars">${'★'.repeat(t.stars||5)}</div>
          <p>"${t.text}"</p>
          <div class="ti-author">
            <div class="ti-av" style="background:#1d4ed8">${(t.name||'?')[0]}</div>
            <div><strong>${t.name}</strong><span>${t.company}</span></div>
          </div>
        </div>`).join('');
      /* Duplicate for infinite scroll */
      wrap.innerHTML += wrap.innerHTML;
    }
  }

  /* ── Notifications from admin push ── */
  const an = JSON.parse(localStorage.getItem('ipsbd_notifs') || 'null');
  if (an && an.length) {
    an.forEach(n => {
      const sectionMap = {
        home:'all', patent:'patent', trademark:'trademark',
        blogs:'blogs', portfolios:'portfolios', 'core-team':'core-team',
        services:'services', contact:'contact', gallery:'gallery'
      };
      notifications.unshift({
        icon: n.icon || 'fa-bell',
        bg: '#dbeafe', ic: '#1d4ed8',
        text: n.text,
        time: n.time || 'Just now',
        unread: true,
        go: () => {
          if (['patent','trademark','blogs','portfolios','core-team'].includes(n.sec)) switchTab(n.sec);
          else switchSection(n.sec || 'home');
        }
      });
    });
    localStorage.removeItem('ipsbd_notifs'); /* clear after loading */
    renderNotifications();
  }
}

/* ── Reload admin data whenever user returns to this tab / page ── */
window.addEventListener('storage', e => {
  /* Fires when another tab writes to localStorage */
  if (e.key && e.key.startsWith('ipsbd_')) loadAdminData();
});
document.addEventListener('visibilitychange', () => {
  /* Fires when user switches back to this browser tab */
  if (!document.hidden) loadAdminData();
});
window.addEventListener('pageshow', () => {
  /* Fires when user navigates back (browser back button) */
  loadAdminData();
});

/* ══════════════════════════════════════
   LOGO → HOME
   Clicking logo always goes to Home tab
══════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  const logoLink = document.getElementById('logoLink');
  if (logoLink) {
    logoLink.addEventListener('click', e => {
      e.preventDefault();
      /* Reset to home section + home tab */
      switchSection('home');
      switchTab('all');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});

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
   GOOGLE-STYLE SEARCH
   Shows result links → click → navigate to page
══════════════════════════════════════ */
const SEARCH_INDEX = [
  {title:'Trademark Registration',desc:'Register brand under Trademarks Act 2009 at DPDT',icon:'fa-trademark',bg:'#dbeafe',ic:'#1d4ed8',go:()=>switchSection('services')},
  {title:'Patent Registration',desc:'Protect inventions under Bangladesh Patents & Designs Act 1911',icon:'fa-flask',bg:'#d1fae5',ic:'#065f46',go:()=>switchSection('services')},
  {title:'Design Registration',desc:'Protect visual aspects of products under design law',icon:'fa-pen-ruler',bg:'#ede9fe',ic:'#5b21b6',go:()=>switchSection('services')},
  {title:'Copyright Registration',desc:'Register creative works under Bangladesh Copyright Act 2000',icon:'fa-copyright',bg:'#fef3c7',ic:'#92400e',go:()=>switchSection('services')},
  {title:'IP Litigation & Enforcement',desc:'Enforce IP rights through Bangladesh courts',icon:'fa-gavel',bg:'#ccfbf1',ic:'#0f766e',go:()=>switchSection('services')},
  {title:'International IP — Madrid Protocol',desc:'Protect trademark in 130+ countries via WIPO',icon:'fa-globe',bg:'#ffe4e6',ic:'#9f1239',go:()=>switchSection('services')},
  {title:'Patent Articles & Info',desc:'Browse patent services and guides',icon:'fa-flask',bg:'#d1fae5',ic:'#065f46',go:()=>switchTab('patent')},
  {title:'Trademark Articles & Info',desc:'Browse trademark services and guides',icon:'fa-trademark',bg:'#dbeafe',ic:'#1d4ed8',go:()=>switchTab('trademark')},
  {title:'Portfolio / Case Studies',desc:'View all our IP case studies and outcomes',icon:'fa-folder-open',bg:'#fef3c7',ic:'#92400e',go:()=>switchTab('portfolios')},
  {title:'IP Blogs',desc:'Read IP law articles and industry updates',icon:'fa-newspaper',bg:'#f0fdf4',ic:'#15803d',go:()=>switchTab('blogs')},
  {title:'Core Team',desc:'Meet our IP attorneys and legal specialists',icon:'fa-users',bg:'#ede9fe',ic:'#5b21b6',go:()=>switchTab('core-team')},
  {title:'About IPServiceBD',desc:'Bangladesh IP law firm founded in 2007 — professional, personalized, prompt',icon:'fa-building-columns',bg:'#f1f5f9',ic:'#475569',go:()=>switchSection('about')},
  {title:'Our Clients & Testimonials',desc:'Trusted by 200+ businesses across Bangladesh',icon:'fa-handshake',bg:'#d1fae5',ic:'#065f46',go:()=>switchSection('clients')},
  {title:'Contact Us',desc:'Free consultation with our IP experts',icon:'fa-envelope',bg:'#f1f5f9',ic:'#475569',go:()=>switchSection('contact')},
  {title:'DPDT — Bangladesh IP Registry',desc:'Department of Patents, Designs and Trade Marks, Dhaka',icon:'fa-building-government',bg:'#dbeafe',ic:'#1d4ed8',go:()=>switchSection('services')},
  {title:'WIPO — Madrid Protocol',desc:'International trademark filing system covering 130+ countries',icon:'fa-globe',bg:'#ffe4e6',ic:'#9f1239',go:()=>switchSection('services')},
  {title:'PCT — Patent Cooperation Treaty',desc:'International patent protection in 150+ countries',icon:'fa-flask',bg:'#d1fae5',ic:'#065f46',go:()=>switchSection('services')},
  {title:'Providing IP services since 2007',desc:'IPServiceBD — specialized IP law firm across Bangladesh',icon:'fa-star',bg:'#fef9c3',ic:'#b45309',go:()=>switchSection('about')},
  {title:'What Our Clients Say',desc:'Client testimonials and success stories',icon:'fa-star',bg:'#fef9c3',ic:'#b45309',go:()=>switchSection('clients')},
  {title:'Gallery — Office & Events',desc:'Photos of our office, team events and milestones',icon:'fa-images',bg:'#fef3c7',ic:'#92400e',go:()=>switchSection('gallery')},
];

function handleSearch(val) {
  const q  = val.trim().toLowerCase();
  const dd = document.getElementById('searchDropdown');
  const cl = document.getElementById('searchClear');
  if (cl) cl.classList.toggle('hidden', !val);
  if (!q) { if (dd) dd.classList.add('hidden'); return; }

  const hits = SEARCH_INDEX.filter(d =>
    d.title.toLowerCase().includes(q) || d.desc.toLowerCase().includes(q)
  );
  if (!dd) return;

  if (hits.length === 0) {
    dd.innerHTML = `<div class="sd-empty">No results for &ldquo;${escH(val)}&rdquo;</div>`;
  } else {
    dd.innerHTML = `<div class="sd-section">Results</div>` +
      hits.slice(0, 8).map((d, i) => {
        const idx = SEARCH_INDEX.indexOf(d);
        return `<div class="sd-item" data-idx="${idx}">
          <div class="sd-icon" style="background:${d.bg};color:${d.ic}">
            <i class="fa-solid ${d.icon}"></i>
          </div>
          <div class="sd-text">
            <h4>${escH(d.title)}</h4>
            <p>${escH(d.desc)}</p>
          </div>
          <i class="fa-solid fa-arrow-right" style="color:#cbd5e1;font-size:11px;margin-left:auto;flex-shrink:0"></i>
        </div>`;
      }).join('');

    /* Attach click handlers after HTML is built — avoids any quote issues */
    dd.querySelectorAll('.sd-item[data-idx]').forEach(el => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.dataset.idx, 10);
        SEARCH_INDEX[idx]?.go?.();
        dd.classList.add('hidden');
        const inp = document.getElementById('searchInput');
        if (inp) inp.value = '';
        if (cl) cl.classList.add('hidden');
      });
    });
  }
  dd.classList.remove('hidden');
}

function clearSearch() {
  const inp = document.getElementById('searchInput');
  if (inp) inp.value = '';
  document.getElementById('searchDropdown')?.classList.add('hidden');
  document.getElementById('searchClear')?.classList.add('hidden');
}

function escH(s) { return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

document.addEventListener('click', e => {
  const dd = document.getElementById('searchDropdown');
  const wr = document.getElementById('searchWrap');
  if (dd && wr && !wr.contains(e.target)) dd.classList.add('hidden');
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { clearSearch(); document.getElementById('searchInput')?.blur(); }
});

/* ══════════════════════════════════════
   DYNAMIC NOTIFICATION BELL
   Notifications auto-add when chat messages arrive
══════════════════════════════════════ */
const notifications = [
  { icon:'fa-newspaper',  bg:'#dbeafe', ic:'#1d4ed8', text:'New Blog: Trademark Registration Guide 2025', time:'Just now',  unread:true,  go:()=>switchTab('blogs') },
  { icon:'fa-flask',      bg:'#d1fae5', ic:'#065f46', text:'Patent Update: PCT Deadline Alert — May 30', time:'2 hrs ago', unread:true,  go:()=>switchTab('patent') },
  { icon:'fa-folder-open',bg:'#fef3c7', ic:'#92400e', text:'New Case Study: Fashion Brand Protection',   time:'Yesterday', unread:false, go:()=>switchTab('portfolios') },
];

function renderNotifications() {
  const list = document.getElementById('notifList');
  const dot  = document.getElementById('bellDot');
  if (!list) return;
  const unread = notifications.filter(n=>n.unread).length;
  if (dot) dot.classList.toggle('hidden', unread===0);
  list.innerHTML = notifications.map((n,i) => `
    <div class="notif-item ${n.unread?'unread':''}" onclick="notifGo(${i})">
      <div class="notif-icon" style="background:${n.bg};color:${n.ic}">
        <i class="fa-solid ${n.icon}"></i>
      </div>
      <div><p>${n.text}</p><small>${n.time}</small></div>
    </div>`).join('') ||
    '<div style="padding:20px;text-align:center;color:#94a3b8;font-size:13px">No notifications</div>';
}

function notifGo(idx) {
  notifications[idx].unread = false;
  renderNotifications();
  document.getElementById('notifDropdown').classList.add('hidden');
  notifications[idx].go?.();
}

function addNotification(text, icon, bg, ic, go) {
  notifications.unshift({ icon, bg, ic, text, time:'Just now', unread:true, go });
  renderNotifications();
}

function toggleNotif() {
  const dd = document.getElementById('notifDropdown');
  dd.classList.toggle('hidden');
  if (!dd.classList.contains('hidden')) renderNotifications();
}

function markAllRead() {
  notifications.forEach(n => n.unread = false);
  renderNotifications();
  document.getElementById('notifDropdown').classList.add('hidden');
}

renderNotifications();

document.addEventListener('click', e => {
  const dd  = document.getElementById('notifDropdown');
  const btn = document.getElementById('notifBtn');
  if (dd && btn && !dd.contains(e.target) && !btn.contains(e.target)) {
    dd.classList.add('hidden');
  }
});

/* ── Duplicate news ticker items for seamless infinite scroll ── */
window.addEventListener('load', () => {
  const ticker = document.getElementById('newsTicker');
  if (ticker) {
    ticker.innerHTML += ticker.innerHTML; // duplicate for loop
  }
  const testi = document.getElementById('testiScroll');
  if (testi) {
    testi.innerHTML += testi.innerHTML; // duplicate for loop
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

  /* Add notification for new message */
  addNotification('New message in Chat: "' + msg.slice(0,40) + (msg.length>40?'…':'') + '"',
    'fa-comment', '#d1fae5', '#065f46',
    () => document.getElementById('chatInput')?.focus()
  );

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
      <img src="${d.img}" alt="${d.title}" loading="eager" referrerpolicy="no-referrer" onerror="this.style.background='#e2e8f0';this.style.minHeight='120px'"/>
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
        <img src="${d.img}" alt="${d.title}" loading="eager" referrerpolicy="no-referrer" onerror="this.style.background='#e2e8f0';this.style.minHeight='120px'"/>
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
    img:       'https://picsum.photos/seed/ip1/700/420',
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
    img:       'https://picsum.photos/seed/ip2/700/420',
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
    img:       'https://picsum.photos/seed/ip3/700/420',
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
    img:       'https://picsum.photos/seed/ip4/700/420',
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
    img:       'https://picsum.photos/seed/ip5/700/420',
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
    img:       'https://picsum.photos/seed/ip6/700/420',
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
    img:       'https://picsum.photos/seed/ip7/700/420',
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
    img:       'https://picsum.photos/seed/ip8/700/420',
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
        <img src="${d.img}" alt="${d.title}" loading="eager" referrerpolicy="no-referrer" onerror="this.style.background='#e2e8f0';this.style.minHeight='120px'"/>
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

  /* Autoplay */
  autoplay: {
    delay:             3500,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
    waitForTransition: true,
  },

  /* Arrows */
  navigation: {
    nextEl: '.portfolio-next',
    prevEl: '.portfolio-prev',
  },

  /* ── Strictly one slide per click ──
     Lock arrows for the full transition duration after each click.
     This prevents queuing a second slide if clicked rapidly. ── */
  on: {
    navigationNext() {
      /* Block both directions during transition */
      this.allowSlideNext = false;
      this.allowSlidePrev = false;
      /* Reset autoplay timer so it doesn't also fire right after */
      this.autoplay.stop();
      this.autoplay.start();
      /* Unlock after transition finishes (speed + small buffer) */
      setTimeout(() => {
        this.allowSlideNext = true;
        this.allowSlidePrev = true;
      }, this.params.speed + 100);
    },
    navigationPrev() {
      this.allowSlideNext = false;
      this.allowSlidePrev = false;
      this.autoplay.stop();
      this.autoplay.start();
      setTimeout(() => {
        this.allowSlideNext = true;
        this.allowSlidePrev = true;
      }, this.params.speed + 100);
    },
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

/* Load any data saved by admin panel */
loadAdminData();
