const fs = require('fs');
const path = require('path');
const http = require('http');
const url = require('url');
const dt = require('./datetime');
const healthRiskCalculator = require('./health_risk');

const server = http.createServer((request, response) => {
    const parsedUrl = url.parse(request.url, true);
    const pathname = parsedUrl.pathname;

    console.log(`Request received: ${request.url}`);

    // Enable CORS
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (request.method === 'OPTIONS') {
        response.writeHead(204);
        response.end();
        return;
    }

    // Serve frontend
    if (pathname === '/' || pathname === '/index.html') {
        fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
            if (err) {
                response.writeHead(500, { 'Content-Type': 'text/plain' });
                response.end('Internal Server Error');
                return;
            }
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.end(data);
        });
        return;
    }

    // Health Risk Calculation API
    if (pathname === '/api/calculate-risk' && request.method === 'POST') {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });

        request.on('end', () => {
            try {
                const inputData = JSON.parse(body);
                const risk = healthRiskCalculator(inputData);
                response.writeHead(200, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify({ risk }));
            } catch (err) {
                response.writeHead(400, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify({ error: 'Invalid input data' }));
            }
        });
        return;
    }

    // 404 fallback
    response.writeHead(404, { 'Content-Type': 'text/plain' });
    response.end('Not Found');
});

const port = process.env.PORT || 1337;
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
