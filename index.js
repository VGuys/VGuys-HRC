// var http = require('http');
// var url = require('url');
// var dt = require('./datetime');


// const server = http.createServer((request, response) => {
//     // Write the request to the log. 
//     console.log(request);

// Req 1

// var http = require('http');
// var url = require('url');
// var dt = require('./datetime');

// const server = http.createServer((request, response) => {
//     const parsedUrl = url.parse(request.url, true);
//     const pathname = parsedUrl.pathname;

//     console.log(`Request received: ${request.url}`);

//     if (pathname === '/roll-dice') {
//         // Extract number of sides (default to 6)
//         const sides = parsedUrl.query.sides ? parseInt(parsedUrl.query.sides) : 6;
//         const result = Math.floor(Math.random() * sides) + 1;

//         response.writeHead(200, { 'Content-Type': 'application/json' });
//         response.end(JSON.stringify({ roll: result }));
//         return;
//     }

//     // API Test Page
//     response.writeHead(200, { 'Content-Type': 'text/html' });
//     response.write('<h3>Hello! This is your Dice Roller API</h3>');
//     response.write("Current date and time: " + dt.myDateTime() + "<br><br>");
//     response.write("Test API by adding <code>/roll-dice?sides=6</code> to the URL.");
//     response.end();
// });

// const port = process.env.PORT || 1337;
// server.listen(port, () => {
//     console.log(`Server running at http://localhost:${port}`);
// });

//Req 2
const fs = require('fs');
const path = require('path');
const http = require('http');
const url = require('url');
const dt = require('./datetime');

const server = http.createServer((request, response) => {
    const parsedUrl = url.parse(request.url, true);
    const pathname = parsedUrl.pathname;

    console.log(`Request received: ${request.url}`);

    // Enable CORS for all requests
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight request for CORS
    if (request.method === 'OPTIONS') {
        response.writeHead(204);
        response.end();
        return;
    }

    // Serve index.html for the root path
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

    // Dice Roller API Endpoint
    if (pathname === '/roll-dice') {
        const sides = parsedUrl.query.sides ? parseInt(parsedUrl.query.sides) : 6;
        const result = Math.floor(Math.random() * sides) + 1;

        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ roll: result }));
        return;
    }

    // Default 404 response
    response.writeHead(404, { 'Content-Type': 'text/plain' });
    response.end('Not Found');
});

const port = process.env.PORT || 1337;
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
