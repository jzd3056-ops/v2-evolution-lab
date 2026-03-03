const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3456;
const STATE_PATH = path.join(__dirname, '..', 'quant', 'generations', 'gen-0', 'sim-state.json');
const HTML_PATH = path.join(__dirname, 'index.html');

const server = http.createServer(async (req, res) => {
  if (req.url === '/api/state') {
    res.setHeader('Content-Type', 'application/json');
    try {
      const data = fs.readFileSync(STATE_PATH, 'utf8');
      res.end(data);
    } catch (e) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: e.message }));
    }
  } else if (req.url === '/api/price') {
    res.setHeader('Content-Type', 'application/json');
    try {
      const resp = await fetch('https://api.kraken.com/0/public/Ticker?pair=XBTUSD');
      const data = await resp.json();
      const price = parseFloat(data.result.XXBTZUSD.c[0]);
      res.end(JSON.stringify({ price }));
    } catch (e) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: e.message }));
    }
  } else {
    res.setHeader('Content-Type', 'text/html');
    res.end(fs.readFileSync(HTML_PATH, 'utf8'));
  }
});

server.listen(PORT, () => console.log(`Dashboard running on http://0.0.0.0:${PORT}`));
