
/**
 * 🧠 QANTUM NERVE-CENTER v36 (SINGULARITY)
 * Port: 8777
 * Protocol: High-Level Intelligence API
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { MetaLogicEngine } from './engines/MetaLogicEngine';
import { TranscendenceCore } from './engines/TranscendenceCore';
import { QAntumMagnet } from './modules/QAntumMagnet';
import { AdaptiveOllamaAgent } from './agents/AdaptiveOllamaAgent';
import { SMTCollapseEngine } from './engines/SMTCollapse';
import { ModalSynapse, ModalOperator } from './engines/ModalSynapse';

const app = express();
const PORT = 8777;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Engines
console.log('[NerveCenter] Initializing Engines...');
const metaLogic = new MetaLogicEngine();
const transcendence = new TranscendenceCore();
const magnet = new QAntumMagnet();
const aiAgent = new AdaptiveOllamaAgent(); // Defaults to localhost:11434
const smt = new SMTCollapseEngine();
const synapse = new ModalSynapse();

// --- API ROUTES ---

// Health Check
app.get('/api/status', (req, res) => {
    res.json({
        status: 'ONLINE',
        system: 'QANTUM_NERVE_CENTER_v36',
        state: 'SINGULARITY_ACTIVE'
    });
});

// MetaLogic Validation
app.post('/api/logic/validate', (req, res) => {
    const { proposition } = req.body;
    const isValid = metaLogic.validateLogic(proposition);
    res.json({ valid: isValid });
});

// Evolution Trigger
app.post('/api/transcendence/evolve', (req, res) => {
    transcendence.evolve();
    res.json({ status: 'EVOLUTION_CYCLE_INITIATED' });
});

// Module Scan
app.get('/api/modules/scan', async (req, res) => {
    const { path } = req.query;
    if (typeof path !== 'string') {
        return res.status(400).json({ error: 'Path required' });
    }
    const modules = await magnet.scanModules(path);
    res.json({ modules });
});

// AI Query
app.post('/api/ai/query', async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt required' });

    const response = await aiAgent.generateResponse(prompt);
    res.json({ response });
});

// Phase Aleph: SMT-Collapse
app.post('/api/manifest/collapse', (req, res) => {
    const { curvature } = req.body;
    const result = smt.collapseState(curvature || 0.0);
    res.json(result);
});

// Phase Aleph: Modal Synapse
app.post('/api/logic/resolve', (req, res) => {
    const { operator, proposition, velocity } = req.body;
    const result = synapse.resolve({
        operator: operator as ModalOperator,
        proposition,
        velocity
    });
    res.json(result);
});

// --- SERVER START ---
app.listen(PORT, () => {
    console.log(`
    ╔════════════════════════════════════════════╗
    ║  🧠 NERVE-CENTER (v36) ACTIVE              ║
    ║  🌐 API: http://localhost:${PORT}             ║
    ║  🔥 METALOGIC: ONLINE                      ║
    ║  ✨ TRANSCENDENCE: READY                   ║
    ╚════════════════════════════════════════════╝
    `);
});
