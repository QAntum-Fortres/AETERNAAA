/**
 * SaaS API Endpoints
 * API за управление на SaaS платформата
 */

import { Router } from 'express';
import { SaaSOrchestrator } from '../saas/SaaSOrchestrator';
import { Logger } from '../telemetry/Logger';

export class SaaSAPI {
    private router: Router;
    private orchestrator: SaaSOrchestrator;
    private logger: Logger;

    constructor() {
        this.router = Router();
        this.orchestrator = new SaaSOrchestrator();
        this.logger = Logger.getInstance();
        
        this.setupRoutes();
    }

    private setupRoutes() {
        // Get all SaaS applications
        this.router.get('/saas', (req, res) => {
            const apps = this.orchestrator.getAllApplications();
            res.json({
                applications: apps,
                count: apps.length,
                total_revenue: apps.reduce((sum, app) => sum + app.revenue_generated, 0)
            });
        });

        // Get specific SaaS application
        this.router.get('/saas/:id', (req, res) => {
            const app = this.orchestrator.getApplication(req.params.id);
            if (!app) {
                return res.status(404).json({ error: 'SaaS application not found' });
            }
            res.json(app);
        });

        // Get SaaS platform metrics
        this.router.get('/saas/metrics/overview', (req, res) => {
            const metrics = this.orchestrator.getMetrics();
            const superiority = this.orchestrator.demonstrateSuperiorCapabilities();
            
            res.json({
                ...metrics,
                platform_superiority: superiority,
                platform_status: 'BRUTAL_OPERATIONAL'
            });
        });

        // Create checkout for SaaS application
        this.router.post('/saas/:id/checkout', async (req, res) => {
            try {
                const { customerEmail } = req.body;
                const checkoutUrl = await this.orchestrator.createSaaSCheckout(req.params.id, customerEmail);
                
                res.json({
                    checkout_url: checkoutUrl,
                    application: this.orchestrator.getApplication(req.params.id)
                });
            } catch (error: any) {
                this.logger.error('SAAS_API', 'Checkout creation failed', error);
                res.status(500).json({ error: error.message });
            }
        });

        // Execute automation workflow
        this.router.post('/saas/automation/execute', async (req, res) => {
            try {
                const { workflow_name } = req.body;
                const result = await this.orchestrator.executeWorkflow(workflow_name || 'default');
                
                res.json(result);
            } catch (error: any) {
                this.logger.error('SAAS_API', 'Workflow execution failed', error);
                res.status(500).json({ error: error.message });
            }
        });

        // Generate new SaaS from automation task
        this.router.post('/saas/generate', async (req, res) => {
            try {
                const { task, pricing } = req.body;
                const new_app = await this.orchestrator.generateSaaSFromAutomation(task, pricing);
                
                res.json({
                    success: true,
                    application: new_app,
                    message: 'SaaS application generated and deployed'
                });
            } catch (error: any) {
                this.logger.error('SAAS_API', 'SaaS generation failed', error);
                res.status(500).json({ error: error.message });
            }
        });

        // Optimize all SaaS applications
        this.router.post('/saas/optimize', async (req, res) => {
            try {
                await this.orchestrator.optimizeApplications();
                const updated_metrics = this.orchestrator.getMetrics();
                
                res.json({
                    success: true,
                    message: 'All SaaS applications optimized',
                    metrics: updated_metrics
                });
            } catch (error: any) {
                this.logger.error('SAAS_API', 'Optimization failed', error);
                res.status(500).json({ error: error.message });
            }
        });
    }

    getRouter(): Router {
        return this.router;
    }
}