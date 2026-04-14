const API_URL = typeof API_URL_PLACEHOLDER !== 'undefined' ? API_URL_PLACEHOLDER : 'https://api-production-2d56.up.railway.app';
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  $$('[data-animate]').forEach(el => observer.observe(el));
}

function initAccordion() {
  $$('.accordion-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const content = btn.nextElementSibling;
      const icon = btn.querySelector('svg');
      const isActive = content.classList.contains('active');
      $$('.accordion-content').forEach(c => c.classList.remove('active'));
      $$('.accordion-toggle svg').forEach(i => i.style.transform = 'rotate(0deg)');
      if (!isActive) { content.classList.add('active'); icon.style.transform = 'rotate(180deg)'; }
    });
  });
}

function initFilters() {
  let currentFilter = 'all';
  $$('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.filter-btn').forEach(b => { b.classList.remove('bg-primary', 'text-white'); b.classList.add('glass-card', 'hover:bg-white/10'); });
      btn.classList.remove('glass-card', 'hover:bg-white/10'); btn.classList.add('bg-primary', 'text-white');
      currentFilter = btn.dataset.filter; renderScripts(window.scripts || [], currentFilter);
    });
  });
}

function renderScripts(scripts, filter = 'all') {
  const grid = $('#scripts-grid');
  const filtered = filter === 'all' ? scripts : scripts.filter(s => s.status === filter);
  if (filtered.length === 0) { grid.innerHTML = '<div class="col-span-full glass-card p-6 text-center"><p class="text-gray-400">Nenhum script encontrado com este filtro.</p></div>'; return; }
  const statusConfig = { active: { label: '🟢 Ativo', class: 'status-active' }, maintenance: { label: '🟡 Manutenção', class: 'status-maintenance' }, discontinued: { label: '🔴 Descontinuado', class: 'status-discontinued' } };
  grid.innerHTML = filtered.map((script, index) => {
    const status = statusConfig[script.status] || statusConfig.active;
    return `<div class="glass-card p-6 hover:neon-glow transition-all duration-300" style="animation-delay:${index*0.1}s">
      <div class="flex items-center justify-between mb-4"><span class="status-badge ${status.class}">${status.label}</span><span class="text-gray-500 text-sm">v${script.version||'1.0.0'}</span></div>
      <h3 class="text-xl font-bold mb-2">${script.name}</h3><p class="text-gray-400 text-sm mb-4">${script.description}</p>
      <div class="flex items-center justify-between"><span class="text-primary font-bold">R$ ${typeof script.price==='number'?script.price.toFixed(2).replace('.',','):'0,00'}</span>
      <button class="btn-primary text-sm px-4 py-2">${script.status==='active'?'Comprar':'Saiba Mais'}</button></div></div>`;
  }).join('');
}
async function fetchScripts() {
  try {
    const response = await fetch(`${API_URL}/api/scripts`);
    if (!response.ok) throw new Error('Falha na requisição');
    const scripts = await response.json();
    window.scripts = scripts; renderScripts(scripts, 'all'); updateApiStatus('online');
  } catch (error) {
    console.error('Erro ao buscar scripts:', error);
    window.scripts = [
      { id: '1', name: 'Auto Click Pro', description: 'Automatização avançada de cliques', version: '2.4.1', price: 29.90, status: 'active' },
      { id: '2', name: 'Stream Manager', description: 'Gerenciamento para streams ao vivo', version: '1.8.3', price: 49.90, status: 'active' },
      { id: '3', name: 'Media Downloader', description: 'Download de mídia em alta velocidade', version: '3.1.0', price: 39.90, status: 'active' },
      { id: '4', name: 'Chat Bot Elite', description: 'Bot de chat inteligente com IA', version: '2.0.0', price: 59.90, status: 'maintenance' },
      { id: '5', name: 'Analytics Dashboard', description: 'Painel de análise de dados', version: '1.5.2', price: 79.90, status: 'active' },
      { id: '6', name: 'Security Suite', description: 'Proteção contra ameaças', version: '4.2.1', price: 99.90, status: 'active' }
    ];
    renderScripts(window.scripts, 'all'); updateApiStatus('fallback');
  }
}

function updateApiStatus(status) {
  const dot = $('#api-status-dot'), text = $('#api-status-text');
  if (status === 'online') { dot.className = 'w-2 h-2 bg-green-500 rounded-full animate-pulse'; text.className = 'text-sm text-green-400'; text.textContent = 'LIVE — Powered by NullHub API'; }
  else if (status === 'fallback') { dot.className = 'w-2 h-2 bg-yellow-500 rounded-full animate-pulse'; text.className = 'text-sm text-yellow-400'; text.textContent = 'MODO DEMO — API indisponível'; }
  else { dot.className = 'w-2 h-2 bg-red-500 rounded-full'; text.className = 'text-sm text-red-400'; text.textContent = 'OFFLINE — Tentando reconectar...'; }
}

async function checkApiHealth() {
  try { const response = await fetch(`${API_URL}/health`); if (response.ok) { updateApiStatus('online'); return await response.json(); } }
  catch { updateApiStatus('fallback'); }
  return null;
}

function initSmoothScroll() {
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => { e.preventDefault(); const target = $(anchor.getAttribute('href')); if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
  });
}

function initNavbarScroll() {
  const nav = $('nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) { nav.style.background = 'rgba(10,10,15,0.95)'; nav.style.backdropFilter = 'blur(10px)'; }
    else { nav.style.background = 'rgba(255,255,255,0.03)'; nav.style.backdropFilter = 'blur(10px)'; }
  });
}

function initMobileMenu() {
  const menuBtn = document.createElement('button');
  menuBtn.className = 'md:hidden p-2';  menuBtn.innerHTML = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>`;
  const nav = $('nav .max-w-7xl > div');
  nav.insertBefore(menuBtn, nav.lastElementChild);
  const mobileMenu = document.createElement('div');
  mobileMenu.className = 'md:hidden hidden py-4 border-t border-white/10';
  mobileMenu.innerHTML = `<a href="#home" class="block py-3 text-gray-300 hover:text-white">Início</a><a href="#scripts" class="block py-3 text-gray-300 hover:text-white">Scripts</a><a href="#features" class="block py-3 text-gray-300 hover:text-white">Recursos</a><a href="#pricing" class="block py-3 text-gray-300 hover:text-white">Planos</a><a href="#faq" class="block py-3 text-gray-300 hover:text-white">FAQ</a><button class="btn-primary w-full mt-4">Login</button>`;
  nav.appendChild(mobileMenu);
  let isOpen = false;
  menuBtn.addEventListener('click', () => {
    isOpen = !isOpen; mobileMenu.classList.toggle('hidden');
    menuBtn.innerHTML = isOpen ? `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>` : `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>`;
  });
  mobileMenu.querySelectorAll('a').forEach(link => { link.addEventListener('click', () => { mobileMenu.classList.add('hidden'); menuBtn.innerHTML = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>`; }); });
}

async function init() {
  $('#year').textContent = new Date().getFullYear();
  initScrollAnimations(); initAccordion(); initFilters(); initSmoothScroll(); initNavbarScroll(); initMobileMenu();
  await checkApiHealth(); await fetchScripts();
  console.log('✅ NullHub initialized'); console.log(`📡 API: ${API_URL}`);
}

document.addEventListener('DOMContentLoaded', init);
