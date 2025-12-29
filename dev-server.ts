import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import executeHandler from './api/kernel/execute';
import metricsHandler from './api/kernel/metrics';
import auditHandler from './api/kernel/audit';
import ingestHandler from './api/observability/ingest';
import summaryHandler from './api/observability/summary';
import streamHandler from './api/observability/stream';
import profilesHandler from './api/outbound/profiles';
import artifactsHandler from './api/outbound/artifacts';
import investorsHandler from './api/outbound/investors';
import sendHandler from './api/outbound/send';
import githubIntegrationHandler from './api/outbound/integrations/github';
import logsHandler from './api/outbound/logs';

// --- Configuration ---
const PORT = 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me-in-prod-slavko-v7';
const IS_PROD = process.env.NODE_ENV === 'production';
const WHITELISTED_EMAILS = [
    'jc@filrougecapital.com',
    'mladen@formatdisc.hr',
    'demo@investor.com',
    // 'alice@example.com' // for testing if needed
];

const app = express();

// --- Middleware ---
app.use(cors({
    origin: 'http://localhost:5173', // Vite dev server
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// --- Helper Functions ---
function signToken(payload: object) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

function verifyToken(token: string) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (e) {
        return null;
    }
}

// --- Handler Adapter ---
// Adapts API route handlers (req, res) to Express
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const adapter = (handler: any) => (req: any, res: any) => {
    return handler(req, res);
};


// --- Authentication Endpoints ---

// POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
    const { email } = req.body;

    if (!email || typeof email !== 'string') {
        return res.status(400).json({ success: false, error: 'Email is required' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (WHITELISTED_EMAILS.includes(normalizedEmail)) {
        // Build user payload
        const user = { email: normalizedEmail, role: 'investor' };

        // Sign JWT
        const token = signToken(user);

        // Set HTTP-only cookie
        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: IS_PROD,
            sameSite: 'lax', // Lax is usually better for top-level navigations, Strict can be too aggressive
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            path: '/'
        });

        console.log(`[AUTH] Successful login for: ${normalizedEmail}`);
        return res.json({ success: true, user });
    } else {
        console.warn(`[AUTH] Failed login attempt for: ${normalizedEmail}`);
        return res.status(401).json({ success: false, error: 'Unauthorized email' });
    }
});

// POST /api/auth/logout
app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('auth_token', { path: '/' });
    return res.json({ success: true });
});

// GET /api/auth/me
app.get('/api/auth/me', (req, res) => {
    const token = req.cookies.auth_token;

    if (!token) {
        return res.status(401).json({ success: false, error: 'No session' });
    }

    const decoded = verifyToken(token);
    if (decoded) {
        return res.json({ success: true, user: decoded });
    } else {
        return res.status(401).json({ success: false, error: 'Invalid token' });
    }
});


// --- API Routes ---
app.all('/api/kernel/execute', adapter(executeHandler));
app.all('/api/kernel/metrics', adapter(metricsHandler));
app.all('/api/kernel/audit', adapter(auditHandler));

// Observability Routes
app.all('/api/observability/ingest', adapter(ingestHandler));
app.all('/api/observability/summary', adapter(summaryHandler));
app.get('/api/observability/stream', streamHandler);

// Outbound Engine Routes
app.all('/api/outbound/profiles', adapter(profilesHandler));
app.all('/api/outbound/artifacts', adapter(artifactsHandler));
app.all('/api/outbound/investors', adapter(investorsHandler));
app.all('/api/outbound/send', adapter(sendHandler));
app.all('/api/outbound/integrations/github', adapter(githubIntegrationHandler));
app.all('/api/outbound/logs', adapter(logsHandler));

app.listen(PORT, () => {
    console.log(`> Local API Server running at http://localhost:${PORT}`);
    console.log(`> Proxied by Vite on port 3000`);
});
