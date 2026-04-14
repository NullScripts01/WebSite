require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const API_URL = process.env.API_URL || 'https://api-production-2d56.up.railway.app';

// ✅ Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Health Check para Railway (CRÍTICO!)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    api: API_URL
  });
});

// ✅ Rota principal - serve index.html com API_URL injetado
app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, 'public', 'index.html');
  
  fs.readFile(indexPath, 'utf8', (err, data) => {
    if (err) {
      console.error('❌ Erro ao ler index.html:', err);
      return res.status(500).send('Erro ao carregar a página');
    }
    // Injeta API_URL no HTML
    const html = data.replace(/API_URL_PLACEHOLDER/g, API_URL);
    res.send(html);
  });
});

// ✅ Fallback para SPA routing
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'public', 'index.html');
  fs.readFile(indexPath, 'utf8', (err, data) => {
    if (err) return res.status(404).send('Not found');
    res.send(data.replace(/API_URL_PLACEHOLDER/g, API_URL));
  });
});

// ✅ Listen em 0.0.0.0 para conexões externas no Railway
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Site rodando na porta ${PORT}`);
  console.log(`📡 Consumindo API: ${API_URL}`);
});
