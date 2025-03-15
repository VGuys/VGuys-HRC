const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const calculateHealthRisk = require('./health_risk');

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // Serve frontend files
    if (pathname === '/' || pathname === '/index.html') {
        return fs.readFile('./index.html', (err, data) => {
            if (err) return res.end('Error loading index');
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    }

    if (pathname.endsWith('.js') || pathname.endsWith('.css')) {
        const ext = path.extname(pathname).slice(1);
        const mime = ext === 'js' ? 'application/javascript' : 'text/css';
        return fs.readFile(path.join(__dirname, pathname), (err, data) => {
            if (err) return res.end('File not found');
            res.writeHead(200, { 'Content-Type': mime });
            res.end(data);
        });
    }

    // API endpoint
    if (pathname === '/api/calculate-risk' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const inputData = JSON.parse(body);
                const result = calculateHealthRisk(inputData);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result));
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err.message }));
            }
        });
        return;
    }

    // 404 fallback
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
});

server.listen(1337, () => console.log('Server listening on http://localhost:1337'));
