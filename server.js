require('dotenv').config();
const express = require('express');

const app = express();
const PORT = process.env.PORT;
const API_URL = (process.env.API_URL || '').replace(/\/$/, ''); // remove barra final se houver

if (!PORT) {
  console.error('❌ Variável PORT não definida pelo Railway!');
  process.exit(1);
}

if (!API_URL) {
  console.error('❌ Variável API_URL não definida!');
  process.exit(1);
}

const year = new Date().getFullYear();

app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Null Hub — Scripts</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;800&display=swap" rel="stylesheet">
  <style>
    :root{
      --bg:#07090d;--surface:#0e1118;--border:#181c2a;
      --accent:#6c5ce7;--accent2:#00cec9;
      --text:#e2e8f0;--muted:#4a5568;
      --active:#00cec9;--maint:#fdcb6e;--disc:#e17055;
    }
    *{margin:0;padding:0;box-sizing:border-box}
    body{background:var(--bg);color:var(--text);font-family:'Syne',sans-serif;min-height:100vh}
    body::before{
      content:'';position:fixed;inset:0;pointer-events:none;z-index:0;
      background-image:
        linear-gradient(rgba(108,92,231,.04) 1px,transparent 1px),
        linear-gradient(90deg,rgba(108,92,231,.04) 1px,transparent 1px);
      background-size:32px 32px;
    }
    .wrap{max-width:1120px;margin:0 auto;padding:0 20px;position:relative;z-index:1}

    /* HEADER */
    header{padding:44px 0 28px;border-bottom:1px solid var(--border);margin-bottom:36px}
    .hrow{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px}
    .logo{display:flex;align-items:center;gap:10px}
    .logo-icon{
      width:38px;height:38px;border-radius:9px;
      background:linear-gradient(135deg,var(--accent),var(--accent2));
      display:flex;align-items:center;justify-content:center;font-size:18px;
    }
    .logo h1{font-size:21px;font-weight:800;letter-spacing:-.5px}
    .logo h1 span{color:var(--accent)}
    .stats{display:flex;gap:24px}
    .stat-val{font-family:'Space Mono',monospace;font-size:20px;font-weight:700;color:var(--accent2)}
    .stat-lbl{font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:1px}

    /* FILTERS */
    .filters{display:flex;gap:8px;margin-bottom:28px;flex-wrap:wrap}
    .fbtn{
      padding:7px 16px;border-radius:6px;border:1px solid var(--border);
      background:var(--surface);color:var(--muted);
      font-family:'Syne',sans-serif;font-size:12px;font-weight:600;
      cursor:pointer;transition:all .18s;
    }
    .fbtn:hover{border-color:var(--accent);color:var(--text)}
    .fbtn.on{background:var(--accent);border-color:var(--accent);color:#fff}

    /* GRID */
    .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px}

    /* CARD */
    .card{
      background:var(--surface);border:1px solid var(--border);
      border-radius:13px;overflow:hidden;
      transition:transform .2s,border-color .2s,box-shadow .2s;
      animation:fadeIn .4s ease both;
    }
    .card:hover{transform:translateY(-4px);border-color:var(--accent);box-shadow:0 8px 28px rgba(108,92,231,.14)}
    .card-img{width:100%;height:152px;object-fit:cover;background:var(--border);display:block}
    .card-ph{
      width:100%;height:152px;
      background:linear-gradient(135deg,#12151e,#090b10);
      display:flex;align-items:center;justify-content:center;font-size:38px;
    }
    .card-body{padding:16px 18px}
    .card-top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:9px;gap:8px}
    .card-name{font-size:15px;font-weight:800;line-height:1.2}
    .badge{
      display:inline-flex;align-items:center;gap:4px;
      padding:3px 9px;border-radius:20px;
      font-size:10px;font-weight:700;text-transform:uppercase;
      letter-spacing:.5px;white-space:nowrap;flex-shrink:0;
    }
    .badge.active{background:rgba(0,206,201,.1);color:var(--active)}
    .badge.maintenance{background:rgba(253,203,110,.1);color:var(--maint)}
    .badge.discontinued{background:rgba(225,112,85,.1);color:var(--disc)}
    .bdot{width:5px;height:5px;border-radius:50%;background:currentColor}
    .badge.active .bdot{animation:pulse 2s infinite}
    .card-place{font-family:'Space Mono',monospace;font-size:10px;color:var(--muted);margin-bottom:11px}
    .feats{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:13px}
    .feat{
      padding:2px 9px;font-size:10px;font-weight:600;color:#a29bfe;
      background:rgba(108,92,231,.1);border:1px solid rgba(108,92,231,.2);border-radius:4px;
    }
    .card-foot{display:flex;align-items:center;justify-content:space-between;padding-top:11px;border-top:1px solid var(--border)}
    .ver{font-family:'Space Mono',monospace;font-size:10px;color:var(--muted)}

    /* STATES */
    .state{text-align:center;padding:80px 0;color:var(--muted);grid-column:1/-1}
    .spinner{
      width:32px;height:32px;border-radius:50%;margin:0 auto 14px;
      border:3px solid var(--border);border-top-color:var(--accent);
      animation:spin .8s linear infinite;
    }
    .state p{font-size:14px}
    .state small{font-size:11px;display:block;margin-top:6px;color:var(--muted)}

    footer{margin-top:64px;padding:24px 0;border-top:1px solid var(--border);text-align:center;color:var(--muted);font-size:12px}

    @keyframes fadeIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
  </style>
</head>
<body>
<div class="wrap">
  <header>
    <div class="hrow">
      <div class="logo">
        <div class="logo-icon">⚡</div>
        <h1>Null<span>Hub</span></h1>
      </div>
      <div class="stats">
        <div><div class="stat-val" id="tot">—</div><div class="stat-lbl">Scripts</div></div>
        <div><div class="stat-val" id="act">—</div><div class="stat-lbl">Ativos</div></div>
      </div>
    </div>
  </header>

  <div class="filters">
    <button class="fbtn on" data-f="all">Todos</button>
    <button class="fbtn" data-f="active">🟢 Ativo</button>
    <button class="fbtn" data-f="maintenance">🟡 Manutenção</button>
    <button class="fbtn" data-f="discontinued">🔴 Descontinuado</button>
  </div>

  <div id="grid" class="grid">
    <div class="state"><div class="spinner"></div><p>Carregando scripts...</p></div>
  </div>

  <footer>Null Hub &copy; ${year}</footer>
</div>

<script>
  const BASE = '${API_URL}';
  let ALL = [];

  const LABEL = {active:'Active',maintenance:'Maintenance',discontinued:'Discontinued'};

  async function load() {
    try {
      // Busca todos os scripts (todos os status + campo image)
      const r = await fetch(BASE + '/api/list');
      if (!r.ok) throw new Error('HTTP ' + r.status);
      const d = await r.json();
      ALL = d.scripts || [];
      document.getElementById('tot').textContent = ALL.length;
      document.getElementById('act').textContent = ALL.filter(s => s.status === 'active').length;
      render(ALL);
    } catch(e) {
      document.getElementById('grid').innerHTML =
        '<div class="state"><p>⚠️ Erro ao carregar</p><small>' + e.message + '</small></div>';
    }
  }

  function render(list) {
    const g = document.getElementById('grid');
    if (!list.length) {
      g.innerHTML = '<div class="state"><p>📭 Nenhum script encontrado.</p></div>';
      return;
    }
    g.innerHTML = list.map((s, i) => {
      const delay = (i % 12) * 50;
      const lbl = LABEL[s.status] || s.status;
      const img = s.image
        ? \`<img class="card-img" src="\${s.image}" loading="lazy" onerror="this.outerHTML='<div class=card-ph>⚡</div>'">\`
        : '<div class="card-ph">⚡</div>';
      const feats = (s.features || []).slice(0, 6).map(f => \`<span class="feat">\${f}</span>\`).join('');
      return \`<div class="card" style="animation-delay:\${delay}ms">
        \${img}
        <div class="card-body">
          <div class="card-top">
            <span class="card-name">\${s.name}</span>
            <span class="badge \${s.status}"><span class="bdot"></span>\${lbl}</span>
          </div>
          <div class="card-place">🎮 \${s.placeId}</div>
          <div class="feats">\${feats}</div>
          <div class="card-foot"><span class="ver">v\${s.version || '1'}</span></div>
        </div>
      </div>\`;
    }).join('');
  }

  document.querySelectorAll('.fbtn').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('.fbtn').forEach(x => x.classList.remove('on'));
      b.classList.add('on');
      const f = b.dataset.f;
      render(f === 'all' ? ALL : ALL.filter(s => s.status === f));
    });
  });

  load();
  setInterval(load, 30000);
</script>
</body>
</html>`);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Site rodando na porta ${PORT}`);
  console.log(`📡 API: ${API_URL}`);
});
