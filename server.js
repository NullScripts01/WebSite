require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const API_URL = process.env.API_URL || 'http://localhost:3001';

// Serve a página principal injetando a API_URL
app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Null Hub</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #080a0e;
      --surface: #0f1117;
      --border: #1a1d2e;
      --accent: #6c5ce7;
      --accent2: #00cec9;
      --text: #e2e8f0;
      --muted: #4a5568;
      --active: #00cec9;
      --maintenance: #fdcb6e;
      --discontinued: #e17055;
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      background: var(--bg);
      color: var(--text);
      font-family: 'Syne', sans-serif;
      min-height: 100vh;
    }

    body::before {
      content: '';
      position: fixed;
      inset: 0;
      background-image:
        linear-gradient(rgba(108,92,231,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(108,92,231,0.04) 1px, transparent 1px);
      background-size: 32px 32px;
      pointer-events: none;
      z-index: 0;
    }

    .container {
      max-width: 1100px;
      margin: 0 auto;
      padding: 0 20px;
      position: relative;
      z-index: 1;
    }

    /* HEADER */
    header {
      padding: 40px 0 28px;
      border-bottom: 1px solid var(--border);
      margin-bottom: 40px;
    }

    .header-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 16px;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .logo-icon {
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, var(--accent), var(--accent2));
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
    }

    .logo h1 {
      font-size: 20px;
      font-weight: 800;
      letter-spacing: -0.5px;
    }

    .logo h1 span { color: var(--accent); }

    .stats {
      display: flex;
      gap: 20px;
    }

    .stat-value {
      font-family: 'Space Mono', monospace;
      font-size: 18px;
      font-weight: 700;
      color: var(--accent2);
    }

    .stat-label {
      font-size: 10px;
      color: var(--muted);
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    /* FILTERS */
    .filter-bar {
      display: flex;
      gap: 8px;
      margin-bottom: 28px;
      flex-wrap: wrap;
    }

    .filter-btn {
      padding: 7px 16px;
      border-radius: 6px;
      border: 1px solid var(--border);
      background: var(--surface);
      color: var(--muted);
      font-family: 'Syne', sans-serif;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .filter-btn:hover { border-color: var(--accent); color: var(--text); }
    .filter-btn.active { background: var(--accent); border-color: var(--accent); color: #fff; }

    /* GRID */
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 16px;
    }

    /* CARD */
    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      overflow: hidden;
      transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
      animation: fadeIn 0.4s ease both;
    }

    .card:hover {
      transform: translateY(-3px);
      border-color: var(--accent);
      box-shadow: 0 6px 24px rgba(108,92,231,0.12);
    }

    .card-img {
      width: 100%;
      height: 150px;
      object-fit: cover;
      background: var(--border);
      display: block;
    }

    .card-placeholder {
      width: 100%;
      height: 150px;
      background: linear-gradient(135deg, #13161f, #0a0c12);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 36px;
    }

    .card-body { padding: 16px 18px; }

    .card-head {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 10px;
      gap: 8px;
    }

    .card-name {
      font-size: 15px;
      font-weight: 800;
      line-height: 1.2;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 3px 9px;
      border-radius: 20px;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      white-space: nowrap;
      flex-shrink: 0;
    }

    .badge.active    { background: rgba(0,206,201,0.1); color: var(--active); }
    .badge.maintenance { background: rgba(253,203,110,0.1); color: var(--maintenance); }
    .badge.discontinued { background: rgba(225,112,85,0.1); color: var(--discontinued); }

    .badge-dot {
      width: 5px; height: 5px;
      border-radius: 50%;
      background: currentColor;
    }

    .badge.active .badge-dot { animation: pulse 2s infinite; }

    .card-place {
      font-family: 'Space Mono', monospace;
      font-size: 10px;
      color: var(--muted);
      margin-bottom: 12px;
    }

    .features {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      margin-bottom: 14px;
    }

    .feature {
      padding: 2px 9px;
      background: rgba(108,92,231,0.1);
      border: 1px solid rgba(108,92,231,0.2);
      border-radius: 4px;
      font-size: 10px;
      color: #a29bfe;
      font-weight: 600;
    }

    .card-foot {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 12px;
      border-top: 1px solid var(--border);
    }

    .version {
      font-family: 'Space Mono', monospace;
      font-size: 10px;
      color: var(--muted);
    }

    /* LOADING / EMPTY */
    .loading, .empty {
      text-align: center;
      padding: 80px 0;
      color: var(--muted);
      grid-column: 1/-1;
    }

    .spinner {
      width: 32px; height: 32px;
      border: 3px solid var(--border);
      border-top-color: var(--accent);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 14px;
    }

    footer {
      margin-top: 60px;
      padding: 24px 0;
      border-top: 1px solid var(--border);
      text-align: center;
      color: var(--muted);
      font-size: 12px;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(12px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.3; } }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="header-inner">
        <div class="logo">
          <div class="logo-icon">⚡</div>
          <h1>Null<span>Hub</span></h1>
        </div>
        <div class="stats">
          <div>
            <div class="stat-value" id="totalCount">—</div>
            <div class="stat-label">Scripts</div>
          </div>
          <div>
            <div class="stat-value" id="activeCount">—</div>
            <div class="stat-label">Ativos</div>
          </div>
        </div>
      </div>
    </header>

    <div class="filter-bar">
      <button class="filter-btn active" data-filter="all">Todos</button>
      <button class="filter-btn" data-filter="active">🟢 Ativo</button>
      <button class="filter-btn" data-filter="maintenance">🟡 Manutenção</button>
      <button class="filter-btn" data-filter="discontinued">🔴 Descontinuado</button>
    </div>

    <div id="grid" class="grid">
      <div class="loading">
        <div class="spinner"></div>
        <p>Carregando scripts...</p>
      </div>
    </div>

    <footer>Null Hub © ${new Date().getFullYear()}</footer>
  </div>

  <script>
    const API = '${API_URL}';
    let all = [];

    const statusLabel = {
      active: 'Active',
      maintenance: 'Maintenance',
      discontinued: 'Discontinued'
    };

    async function load() {
      try {
        const res = await fetch(API + '/api/list');
        const data = await res.json();
        if (!data.success) throw new Error(data.error);
        all = data.scripts || [];
        document.getElementById('totalCount').textContent = all.length;
        document.getElementById('activeCount').textContent = all.filter(s => s.status === 'active').length;
        render(all);
      } catch (e) {
        document.getElementById('grid').innerHTML =
          '<div class="empty"><p>⚠️ Erro ao carregar: ' + e.message + '</p></div>';
      }
    }

    function render(scripts) {
      const grid = document.getElementById('grid');
      if (!scripts.length) {
        grid.innerHTML = '<div class="empty"><p>📭 Nenhum script encontrado.</p></div>';
        return;
      }
      grid.innerHTML = scripts.map((s, i) => card(s, i)).join('');
    }

    function card(s, i) {
      const delay = (i % 12) * 50;
      const label = statusLabel[s.status] || s.status;
      const img = s.image
        ? \`<img class="card-img" src="\${s.image}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\"card-placeholder\\">⚡</div>'">\`
        : '<div class="card-placeholder">⚡</div>';
      const feats = (s.features || []).slice(0, 5)
        .map(f => \`<span class="feature">\${f}</span>\`).join('');

      return \`
        <div class="card" style="animation-delay:\${delay}ms">
          \${img}
          <div class="card-body">
            <div class="card-head">
              <span class="card-name">\${s.name}</span>
              <span class="badge \${s.status}">
                <span class="badge-dot"></span>\${label}
              </span>
            </div>
            <div class="card-place">🎮 \${s.placeId}</div>
            <div class="features">\${feats}</div>
            <div class="card-foot">
              <span class="version">v\${s.version || '1'}</span>
            </div>
          </div>
        </div>\`;
    }

    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const f = btn.dataset.filter;
        render(f === 'all' ? all : all.filter(s => s.status === f));
      });
    });

    load();
    setInterval(load, 30000);
  </script>
</body>
</html>`);
});

app.listen(PORT, () => {
  console.log(`✅ Site rodando na porta ${PORT}`);
  console.log(`📡 Consumindo API: ${API_URL}`);
});
