const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const PORT = 3000;
const API_URL = 'http://13.200.242.254:8080/';

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
}));

// Send index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Dashboard server running at http://localhost:${PORT}`);
  console.log(`🔄 Proxying API requests to ${API_URL}`);
});
