const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
app.use(cors());
const PORT = 3000;
const API_URL = 'http://192.168.1.10:8080';

// const API_URL = 'http://192.168.1.9:8080';

// Serve the index.html file and any static assets
app.use(express.static(__dirname));

// Proxy all /api requests to the backend server
// This bypasses CORS because the browser sees the request going to the same origin (localhost:3000)
// and the server-to-server request from Node.js to the backend is not subject to CORS.
app.use('/api', (req, res, next) => {
  req.url = '/api' + req.url;
  next();
}, createProxyMiddleware({
  target: API_URL,
  changeOrigin: true,
  logLevel: 'debug',
}));

// Send index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Dashboard server running at http://localhost:${PORT}`);
  console.log(`🔄 Proxying API requests to ${API_URL}`);
});
