/* ── SIDEBAR ── */
const sidebar  = document.getElementById('sidebar');
const mainWrap = document.getElementById('mainWrap');
const overlay  = document.getElementById('overlay');
const mobile   = () => window.innerWidth < 1024;

function openSidebar(){
  if(mobile()){sidebar.classList.remove('sb-hidden');sidebar.classList.add('sb-open');overlay.classList.add('show')}
  else{sidebar.classList.remove('sb-hidden');mainWrap.classList.remove('closed');mainWrap.classList.add('open')}
}
function closeSidebar(){
  if(mobile()){sidebar.classList.remove('sb-open');sidebar.classList.add('sb-hidden');overlay.classList.remove('show')}
  else{sidebar.classList.add('sb-hidden');mainWrap.classList.remove('open');mainWrap.classList.add('closed')}
}
function toggleSidebar(){sidebar.classList.contains('sb-hidden')?openSidebar():closeSidebar()}

window.addEventListener('resize',()=>{
  if(!mobile()){overlay.classList.remove('show');if(!sidebar.classList.contains('sb-hidden')){mainWrap.classList.add('open');mainWrap.classList.remove('closed')}}
});

/* ── SECTION SWITCHING ── */
function switchSection(name){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  const t=document.getElementById('section-'+name);
  if(t)t.classList.add('active');
  document.querySelectorAll('.sb-nav-item').forEach(l=>l.classList.toggle('active',l.dataset.section===name));
  if(mobile())closeSidebar();
  window.scrollTo({top:0,behavior:'smooth'});
}

document.querySelectorAll('.sb-nav-item').forEach(l=>{
  l.addEventListener('click',e=>{e.preventDefault();switchSection(l.dataset.section)});
});

/* ── TAG FILTER ── */
document.querySelectorAll('.sb-tag-item').forEach(t=>{
  t.addEventListener('click',e=>{
    e.preventDefault();switchSection('home');
    const map={trademark:'trademark',patent:'patent',design:'design',portfolio:'portfolio','core-team':'core-team'};
    setTimeout(()=>{const k=map[t.dataset.filter]||'all';setTab(k);filterCards(k)},60);
  });
});

/* ── TABS ── */
document.querySelectorAll('.cat-tab').forEach(btn=>{
  btn.addEventListener('click',()=>{setTab(btn.dataset.tab);filterCards(btn.dataset.tab)});
});
function setTab(k){document.querySelectorAll('.cat-tab').forEach(b=>b.classList.toggle('active',b.dataset.tab===k))}

function filterByTab(cat){setTab(cat);filterCards(cat);return false}

/* ── FILTER ── */
function filterCards(tab){
  const hero=document.getElementById('featuredPost');
  const magCards=document.querySelectorAll('.mag-card');
  const magRow=document.getElementById('magRow');
  const rows=document.querySelectorAll('#postFeed .post-row');
  const noRes=document.getElementById('noResults');
  let n=0;

  if(hero){const s=tab==='all'||hero.dataset.category===tab;hero.style.display=s?'':'none';if(s)n++}

  let magVisible=0;
  magCards.forEach(c=>{const s=tab==='all'||c.dataset.category===tab;c.style.display=s?'':'none';if(s)magVisible++});
  if(magRow)magRow.style.display=magVisible>0?'':'none';
  n+=magVisible;

  rows.forEach(r=>{const s=tab==='all'||r.dataset.category===tab;r.style.display=s?'':'none';if(s)n++});
  noRes.classList.toggle('hidden',n>0);
}

/* ── SEARCH ── */
function handleSearch(val){
  const q=val.trim().toLowerCase();
  const all=[document.getElementById('featuredPost'),...document.querySelectorAll('.mag-card'),...document.querySelectorAll('#postFeed .post-row')].filter(Boolean);
  const noRes=document.getElementById('noResults');
  const magRow=document.getElementById('magRow');
  if(!q){all.forEach(el=>el.style.display='');if(magRow)magRow.style.display='';noRes.classList.add('hidden');return}
  let n=0,magV=0;
  all.forEach(el=>{const s=el.innerText.toLowerCase().includes(q);el.style.display=s?'':'none';if(s)n++;if(s&&el.classList.contains('mag-card'))magV++});
  if(magRow)magRow.style.display=magV>0?'':'none';
  noRes.classList.toggle('hidden',n>0);
}

/* ── FORM ── */
function handleFormSubmit(e){e.preventDefault();showToast('Message sent! We will contact you shortly.');e.target.reset()}

/* ── TOAST ── */
function showToast(msg){
  const t=document.getElementById('toast');
  document.getElementById('toastMsg').textContent=msg;
  t.classList.remove('hidden');
  setTimeout(()=>t.classList.add('hidden'),3500);
}

/* ── KEYBOARD ── */
document.addEventListener('keydown',e=>{
  const tag=document.activeElement.tagName;
  if(e.key==='/'&&tag!=='INPUT'&&tag!=='TEXTAREA'){e.preventDefault();document.getElementById('searchInput').focus()}
  if(e.key==='Escape'){document.getElementById('searchInput').blur();if(mobile())closeSidebar()}
});

/* ── SCROLL ANIMATIONS ── */
const io=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){e.target.style.opacity='1';e.target.style.transform='translateY(0)';io.unobserve(e.target)}
  });
},{threshold:0.07});

document.querySelectorAll('.mag-card,.post-row,.svc-card,.team-card,.test-card,.cl-card,.rsb-widget,.g-item').forEach((el,i)=>{
  el.style.opacity='0';el.style.transform='translateY(16px)';
  el.style.transition=`opacity .45s ease ${i*.04}s,transform .45s ease ${i*.04}s,box-shadow .22s,translateY .22s`;
  io.observe(el);
});
