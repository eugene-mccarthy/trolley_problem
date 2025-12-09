// ============================================
// MORAL WEIGHTS EXPLORER - BACKEND SERVER
// ============================================
// This is a simple Node.js server that:
// 1. Serves the static HTML file
// 2. Collects and stores responses with IP tracking
// 3. Provides an admin endpoint to view all data

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Configuration
const PORT = process.env.PORT || 3000;
const DATA_FILE = 'responses.json';
const ADMIN_KEY = process.env.ADMIN_KEY || 'your-secret-admin-key-change-this';

// Initialize data file
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ responses: [] }, null, 2));
}

// Helper to get client IP
function getClientIP(req) {
    return req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
           req.headers['x-real-ip'] ||
           req.connection?.remoteAddress ||
           req.socket?.remoteAddress ||
           'unknown';
}

// Load responses
function loadResponses() {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        return { responses: [] };
    }
}

// Save responses
function saveResponses(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Create server
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Serve static HTML
    if (pathname === '/' || pathname === '/index.html') {
        fs.readFile('index.html', 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error loading page');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
        return;
    }

    // API: Submit response
    if (pathname === '/api/submit' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const submission = JSON.parse(body);
                const data = loadResponses();
                
                const record = {
                    id: Date.now().toString(36) + Math.random().toString(36).substr(2, 9),
                    timestamp: new Date().toISOString(),
                    ip: getClientIP(req),
                    userAgent: req.headers['user-agent'] || 'unknown',
                    sessionId: submission.sessionId,
                    scenarioId: submission.scenarioId,
                    choice: submission.choice,
                    scenario: submission.scenario
                };
                
                data.responses.push(record);
                saveResponses(data);
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, id: record.id }));
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        });
        return;
    }

    // API: Submit full session
    if (pathname === '/api/session' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const session = JSON.parse(body);
                const data = loadResponses();
                
                const record = {
                    id: Date.now().toString(36) + Math.random().toString(36).substr(2, 9),
                    timestamp: new Date().toISOString(),
                    ip: getClientIP(req),
                    userAgent: req.headers['user-agent'] || 'unknown',
                    sessionId: session.sessionId,
                    sessionStart: session.sessionStart,
                    totalResponses: session.responses?.length || 0,
                    responses: session.responses,
                    type: 'full_session'
                };
                
                data.responses.push(record);
                saveResponses(data);
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, id: record.id }));
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        });
        return;
    }

    // API: Admin - Get all responses
    if (pathname === '/api/admin/responses' && req.method === 'GET') {
        const key = parsedUrl.query.key;
        if (key !== ADMIN_KEY) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Unauthorized' }));
            return;
        }
        
        const data = loadResponses();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
        return;
    }

    // API: Admin - Get stats
    if (pathname === '/api/admin/stats' && req.method === 'GET') {
        const key = parsedUrl.query.key;
        if (key !== ADMIN_KEY) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Unauthorized' }));
            return;
        }
        
        const data = loadResponses();
        const uniqueIPs = new Set(data.responses.map(r => r.ip));
        const uniqueSessions = new Set(data.responses.map(r => r.sessionId));
        
        const stats = {
            totalRecords: data.responses.length,
            uniqueIPs: uniqueIPs.size,
            uniqueSessions: uniqueSessions.size,
            firstRecord: data.responses[0]?.timestamp || null,
            lastRecord: data.responses[data.responses.length - 1]?.timestamp || null
        };
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(stats));
        return;
    }

    // API: Admin - Download CSV
    if (pathname === '/api/admin/csv' && req.method === 'GET') {
        const key = parsedUrl.query.key;
        if (key !== ADMIN_KEY) {
            res.writeHead(401, { 'Content-Type': 'text/plain' });
            res.end('Unauthorized');
            return;
        }
        
        const data = loadResponses();
        const rows = [['id', 'timestamp', 'ip', 'sessionId', 'scenarioId', 'choice', 'optionA', 'optionB'].join(',')];
        
        data.responses.forEach(r => {
            if (r.type === 'full_session' && r.responses) {
                r.responses.forEach(resp => {
                    rows.push([
                        r.id,
                        r.timestamp,
                        r.ip,
                        r.sessionId,
                        resp.scenarioId,
                        resp.choice,
                        resp.scenario?.optionA?.text || '',
                        resp.scenario?.optionB?.text || ''
                    ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(','));
                });
            } else {
                rows.push([
                    r.id,
                    r.timestamp,
                    r.ip,
                    r.sessionId,
                    r.scenarioId,
                    r.choice,
                    r.scenario?.optionA?.text || '',
                    r.scenario?.optionB?.text || ''
                ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(','));
            }
        });
        
        res.writeHead(200, {
            'Content-Type': 'text/csv',
            'Content-Disposition': 'attachment; filename="moral-weights-responses.csv"'
        });
        res.end(rows.join('\n'));
        return;
    }

    // 404
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
});

server.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║         MORAL WEIGHTS EXPLORER - SERVER RUNNING            ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║  Server:     http://localhost:${PORT}                        ║
║                                                            ║
║  Endpoints:                                                ║
║  • GET  /              - Main application                  ║
║  • POST /api/submit    - Submit single response            ║
║  • POST /api/session   - Submit full session               ║
║  • GET  /api/admin/responses?key=XXX  - All data (JSON)    ║
║  • GET  /api/admin/stats?key=XXX      - Statistics         ║
║  • GET  /api/admin/csv?key=XXX        - Download CSV       ║
║                                                            ║
║  Admin Key: ${ADMIN_KEY.substring(0, 20)}...                          ║
║  (Set ADMIN_KEY env var to change)                         ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
    `);
});