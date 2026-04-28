/* ══════════════════════════════════════
   SIDEBAR
══════════════════════════════════════ */
const lsb      = document.getElementById('sidebar');
const mainWrap = document.getElementById('mainWrap');
const overlay  = document.getElementById('overlay');
const mob      = () => window.innerWidth < 1024;

function openSidebar(){
  if(mob()){lsb.classList.remove('lsb-hidden');lsb.classList.add('lsb-open');overlay.classList.add('show')}
  else{lsb.classList.remove('lsb-hidden');mainWrap.classList.remove('sb-closed');mainWrap.classList.add('sb-open')}
}
function closeSidebar(){
  if(mob()){lsb.classList.remove('lsb-open');lsb.classList.add('lsb-hidden');overlay.classList.remove('show')}
  else{lsb.classList.add('lsb-hidden');mainWrap.classList.remove('sb-open');mainWrap.classList.add('sb-closed')}
}
function toggleSidebar(){lsb.classList.contains('lsb-hidden')?openSidebar():closeSidebar()}

window.addEventListener('resize',()=>{
  if(!mob()){overlay.classList.remove('show');if(!lsb.classList.contains('lsb-hidden')){mainWrap.classList.add('sb-open');mainWrap.classList.remove('sb-closed')}}
});

/* ══════════════════════════════════════
   SECTION SWITCHING
══════════════════════════════════════ */
function switchSection(name){
  document.querySelectorAll('.pg').forEach(p=>p.classList.remove('active'));
  const t=document.getElementById('section-'+name);
  if(t)t.classList.add('active');
  document.querySelectorAll('.lsb-item').forEach(l=>l.classList.toggle('active',l.dataset.section===name));
  if(mob())closeSidebar();
  window.scrollTo({top:0,behavior:'smooth'});
}
document.querySelectorAll('.lsb-item').forEach(l=>{
  l.addEventListener('click',e=>{e.preventDefault();switchSection(l.dataset.section)});
});

/* Sidebar tag items (categories) */
document.querySelectorAll('.lsb-tag-item').forEach(t=>{
  t.addEventListener('click',e=>{
    e.preventDefault();
    switchSection('home');
    if(mob())closeSidebar();
  });
});

/* ══════════════════════════════════════
   SEARCH
══════════════════════════════════════ */
document.getElementById('searchInput').addEventListener('input', function(){
  const q = this.value.trim().toLowerCase();
  if(!q) return;
  switchSection('home');
});

/* ══════════════════════════════════════
   CONTACT FORM
══════════════════════════════════════ */
function handleFormSubmit(e){
  e.preventDefault();
  showToast('Message sent! We will contact you shortly.');
  e.target.reset();
}

/* ══════════════════════════════════════
   PORTFOLIO DATA
══════════════════════════════════════ */
const portfolioData = [
  {
    title: 'Fashion Brand Protection Across Three Countries',
    cat: 'Trademark', catClass: 'cat-trademark',
    img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=700&q=80',
    client: 'A leading Bangladeshi fashion retail brand',
    challenge: 'A competitor began using a confusingly similar trademark in Bangladesh, India, and the UAE simultaneously, causing brand dilution and customer confusion.',
    solution: 'We filed for trademark injunctions in all three jurisdictions simultaneously, secured interim relief within 30 days, and coordinated with associate firms in India and UAE.',
    outcome: 'Injunctions granted in all three countries within 8 months. Competitor rebranded. Client\'s trademark rights fully enforced internationally.',
    tags: ['Trademark Enforcement','Multi-Jurisdiction','Bangladesh','India','UAE']
  },
  {
    title: 'Pharmaceutical Innovation Patent',
    cat: 'Patent', catClass: 'cat-patent',
    img: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=700&q=80',
    client: 'A Bangladeshi pharmaceutical manufacturing company',
    challenge: 'Protecting a novel drug formulation before the country\'s LDC patent waiver period ended, while navigating TRIPS compliance complexities.',
    solution: 'Drafted comprehensive patent specifications, filed at DPDT, and simultaneously filed PCT application for international protection in key export markets.',
    outcome: 'Patent granted in Bangladesh within 18 months. PCT application pending in 14 countries. Client\'s innovation legally protected through 2043.',
    tags: ['Pharmaceutical Patent','PCT','TRIPS','Bangladesh','DPDT']
  },
  {
    title: 'Consumer Product Design Registration',
    cat: 'Design', catClass: 'cat-design',
    img: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=700&q=80',
    client: 'A home appliances manufacturer',
    challenge: 'Protecting the unique visual design of a new kitchen appliance range before market launch, with competitors already filing similar designs.',
    solution: 'Expedited design search, prepared detailed drawings and design specifications, filed urgent design application with DPDT within 48 hours of brief.',
    outcome: 'Design registration obtained. Filed Hague System application for protection in 8 additional markets. Competitor design application opposed successfully.',
    tags: ['Design Registration','Hague System','DPDT','Product Design']
  },
  {
    title: 'Madrid Protocol — 12 Countries in One Filing',
    cat: 'Trademark', catClass: 'cat-trademark',
    img: 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=700&q=80',
    client: 'An export-oriented garments brand',
    challenge: 'Client needed trademark protection in 12 countries across Europe, Middle East, and Southeast Asia before expanding internationally, with limited budget.',
    solution: 'Advised on Madrid Protocol route via DPDT as office of origin. Managed single international application designating all 12 territories simultaneously.',
    outcome: 'Trademark registered in all 12 countries at 60% lower cost than individual national filings. Client successfully expanded to 8 new markets.',
    tags: ['Madrid Protocol','WIPO','International Trademark','12 Countries']
  },
  {
    title: 'Trademark Infringement — Successful Litigation',
    cat: 'Litigation', catClass: 'cat-portfolio',
    img: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=700&q=80',
    client: 'An FMCG brand established in Bangladesh',
    challenge: 'A counterfeit manufacturer was producing and distributing identical products using the client\'s registered trademark across 6 districts of Bangladesh.',
    solution: 'Secured Anton Piller order for seizure of counterfeit goods, filed criminal and civil infringement actions, coordinated with law enforcement for raids.',
    outcome: 'Counterfeit goods worth BDT 45 million seized. Criminal prosecution ongoing. Client awarded damages of BDT 8 million in civil suit. Brand protected.',
    tags: ['Trademark Infringement','IP Litigation','Anton Piller','Bangladesh Courts']
  },
  {
    title: 'Fintech Software & Technology Patent Portfolio',
    cat: 'Patent', catClass: 'cat-patent',
    img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=700&q=80',
    client: 'A Bangladeshi fintech startup (Series A stage)',
    challenge: 'Building a comprehensive patent portfolio to protect proprietary payment technology before Series B fundraising and international expansion.',
    solution: 'Conducted full IP audit, identified 6 patentable innovations, drafted and filed patent applications, and advised on trade secret strategy for non-patentable IP.',
    outcome: '3 patents granted, 3 pending. IP portfolio valued at USD 2.4 million by investors. Client successfully raised Series B of USD 8 million.',
    tags: ['Software Patent','Fintech','IP Portfolio','Bangladesh','Startup']
  },
  {
    title: 'Brand IP Audit & Restructuring',
    cat: 'Trademark', catClass: 'cat-trademark',
    img: 'https://images.unsplash.com/photo-1618556450991-2f1af64e8191?w=700&q=80',
    client: 'A major garments export company (500+ employees)',
    challenge: 'Company had accumulated trademarks, copyrights, and designs in multiple names over 20 years with no centralized IP strategy, creating legal risk.',
    solution: 'Comprehensive 3-month IP audit, identified 40+ IP assets, consolidated into proper legal entities, filed missing registrations, created IP management policy.',
    outcome: 'Full IP portfolio organized and protected. 12 new registrations filed. Annual IP maintenance cost reduced by 35%. Legal risk significantly mitigated.',
    tags: ['IP Audit','Brand Strategy','Trademark','Copyright','Portfolio Management']
  },
  {
    title: 'Cloud ERP Software Copyright Registration',
    cat: 'Copyright', catClass: 'cat-design',
    img: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=700&q=80',
    client: 'A SaaS company providing ERP solutions',
    challenge: 'Protecting source code, UI/UX designs, and documentation for a cloud-based ERP platform used by 200+ businesses, as a competitor launched a near-identical product.',
    solution: 'Filed copyright registration for all software components, issued cease and desist to competitor, filed infringement action supported by registered copyright evidence.',
    outcome: 'Copyright registered. Competitor withdrew infringing software within 60 days. Settlement secured. Client\'s IP rights formally established.',
    tags: ['Software Copyright','Copyright Registration','IP Enforcement','SaaS']
  }
];

/* ══════════════════════════════════════
   PORTFOLIO RIBBON
══════════════════════════════════════ */
const track       = document.getElementById('ribbonTrack');
const viewport    = document.getElementById('ribbonViewport');
const dotsWrap    = document.getElementById('ribbonDots');
const CARDS_VISIBLE = () => window.innerWidth <= 640 ? 1 : window.innerWidth <= 1023 ? 2 : 3;
let currentSlide  = 0;
let totalSlides   = 0;

function buildDots(){
  dotsWrap.innerHTML = '';
  totalSlides = Math.ceil(portfolioData.length / CARDS_VISIBLE());
  for(let i=0;i<totalSlides;i++){
    const b=document.createElement('button');
    b.className='ribbon-dot'+(i===currentSlide?' active':'');
    b.onclick=()=>goToSlide(i);
    dotsWrap.appendChild(b);
  }
}

function goToSlide(n){
  currentSlide = Math.max(0, Math.min(n, totalSlides-1));
  const cardW  = track.querySelector('.ribbon-card').offsetWidth + 18;
  track.style.transform = `translateX(-${currentSlide * CARDS_VISIBLE() * cardW}px)`;
  dotsWrap.querySelectorAll('.ribbon-dot').forEach((d,i)=>d.classList.toggle('active', i===currentSlide));
}

function ribbonScroll(dir){
  goToSlide(currentSlide + dir);
}

window.addEventListener('resize', ()=>{ buildDots(); goToSlide(0); });
buildDots();

/* Auto-advance ribbon */
let ribbonTimer = setInterval(()=>{ goToSlide(currentSlide+1 < totalSlides ? currentSlide+1 : 0); }, 4500);
viewport.addEventListener('mouseenter', ()=>clearInterval(ribbonTimer));
viewport.addEventListener('mouseleave', ()=>{ ribbonTimer=setInterval(()=>{ goToSlide(currentSlide+1 < totalSlides ? currentSlide+1 : 0); },4500); });

/* ══════════════════════════════════════
   PORTFOLIO MODAL — Single item
══════════════════════════════════════ */
function openPortfolio(idx){
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
        <p><strong style="color:#059669">${d.outcome}</strong></p>
      </div>
      <div class="modal-tags">
        ${d.tags.map(t=>`<span>${t}</span>`).join('')}
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
  document.body.style.overflow='hidden';
}

function closePortfolio(){
  document.getElementById('portfolioModal').classList.remove('open');
  document.body.style.overflow='';
}
function closeModal(e){ if(e.target===e.currentTarget) closePortfolio(); }

/* ══════════════════════════════════════
   ALL PORTFOLIOS MODAL
══════════════════════════════════════ */
function openAllPortfolios(){
  const grid=document.getElementById('allPortfoliosGrid');
  grid.innerHTML=portfolioData.map((d,i)=>`
    <div class="ap-card" onclick="openPortfolioFromAll(${i})">
      <img src="${d.img}" alt="${d.title}"/>
      <div class="ap-card-body">
        <span class="modal-cat ${d.catClass}" style="font-size:9.5px;padding:2px 8px">${d.cat}</span>
        <h4>${d.title}</h4>
        <p>${d.client}</p>
      </div>
    </div>
  `).join('');
  document.getElementById('allPortfoliosModal').classList.add('open');
  document.body.style.overflow='hidden';
}
function openPortfolioFromAll(idx){
  closeAllPortfolios();
  setTimeout(()=>openPortfolio(idx),100);
}
function closeAllPortfolios(){
  document.getElementById('allPortfoliosModal').classList.remove('open');
  document.body.style.overflow='';
}
function closeAllModal(e){ if(e.target===e.currentTarget) closeAllPortfolios(); }

/* ══════════════════════════════════════
   TOAST
══════════════════════════════════════ */
function showToast(msg){
  const t=document.getElementById('toast');
  document.getElementById('toastMsg').textContent=msg;
  t.classList.remove('hidden');
  setTimeout(()=>t.classList.add('hidden'),3500);
}

/* ══════════════════════════════════════
   KEYBOARD SHORTCUTS
══════════════════════════════════════ */
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){
    closePortfolio();closeAllPortfolios();
    if(mob())closeSidebar();
  }
});
