/* ── SIDEBAR ── */
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

/* ── SECTION SWITCH ── */
function switchSection(name){
  document.querySelectorAll('.pg').forEach(p=>p.classList.remove('active'));
  const t=document.getElementById('section-'+name);
  if(t)t.classList.add('active');
  document.querySelectorAll('.lsb-link').forEach(l=>l.classList.toggle('active',l.dataset.section===name));
  if(mob())closeSidebar();
  window.scrollTo({top:0,behavior:'smooth'});
}
document.querySelectorAll('.lsb-link').forEach(l=>{
  l.addEventListener('click',e=>{e.preventDefault();switchSection(l.dataset.section)});
});

/* ── SIDEBAR TAGS ── */
document.querySelectorAll('.lsb-tag').forEach(t=>{
  t.addEventListener('click',e=>{
    e.preventDefault();switchSection('home');
    const m={trademark:'trademark',patent:'patent',design:'design',portfolio:'portfolio','core-team':'core-team'};
    setTimeout(()=>{const k=m[t.dataset.filter]||'all';setActiveTab(k);filterPosts(k)},60);
  });
});

/* ── TABS ── */
document.querySelectorAll('.tab').forEach(btn=>{
  btn.addEventListener('click',()=>{setActiveTab(btn.dataset.tab);filterPosts(btn.dataset.tab)});
});
function setActiveTab(k){document.querySelectorAll('.tab').forEach(b=>b.classList.toggle('active',b.dataset.tab===k))}
function filterTab(cat){setActiveTab(cat);filterPosts(cat);return false}

/* ── FILTER ── */
function filterPosts(tab){
  const posts=document.querySelectorAll('.wp-post');
  const noRes=document.getElementById('noResults');
  let n=0;
  posts.forEach(p=>{const s=tab==='all'||p.dataset.category===tab;p.style.display=s?'':'none';if(s)n++});
  noRes.classList.toggle('hidden',n>0);
}

/* ── SEARCH ── */
function handleSearch(val){
  const q=val.trim().toLowerCase();
  const posts=document.querySelectorAll('.wp-post');
  const noRes=document.getElementById('noResults');
  if(!q){posts.forEach(p=>p.style.display='');noRes.classList.add('hidden');return}
  let n=0;
  posts.forEach(p=>{const s=p.innerText.toLowerCase().includes(q);p.style.display=s?'':'none';if(s)n++});
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
  const tg=document.activeElement.tagName;
  if(e.key==='/'&&tg!=='INPUT'&&tg!=='TEXTAREA'){e.preventDefault();document.getElementById('searchInput').focus()}
  if(e.key==='Escape'&&mob())closeSidebar();
});
