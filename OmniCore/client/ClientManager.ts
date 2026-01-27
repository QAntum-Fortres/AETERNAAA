/**
 * Client Manager
 * Complete client lifecycle management for AETERNA.WEBSITE
 */

import { EventEmitter } from 'events';
import { Logger } from '../telemetry/Logger';
import { PaymentGateway } from '../economy/PaymentGateway';
import { ProductCatalog } from '../economy/Products';

export interface Client {
    id: string;
    email: string;
    name: string;
    plan: string;
    status: 'active' | 'suspended' | 'cancelled';
    subscriptions: ClientSubscription[];
    created_at: number;
    last_login: number;
    total_spent: number;
    preferences: ClientPreferences;
}

export interface ClientSubscription {
    app_id: string;
    app_name: string;
    plan_id: string;
    status: 'active' | 'cancelled' | 'paused';
    started_at: number;
    expires_at: number;
    stripe_subscription_id?: string;
    usage_stats: UsageStats;
}

export interface ClientPreferences {
    language: 'bg' | 'en';
    theme: 'dark' | 'light';
    notifications: {
        email: boolean;
        telegram: boolean;
        push: boolean;
    };
    telegram_chat_id?: string;
}

export interface UsageStats {
    api_calls_this_month: number;
    last_activity: number;
    most_used_features: string[];
    total_sessions: number;
}

export class ClientManager extends EventEmitter {
    private logger: Logger;
    private paymentGateway: PaymentGateway;
    private clients: Map<string, Client> = new Map();

    constructor() {
        super();
        this.logger = Logger.getInstance();
        this.paymentGateway = new PaymentGateway();
    }

    /**
     * Register new client
     */
    async registerClient(email: string, name: string, password: string): Promise<Client> {
        this.logger.info('CLIENT', `Registering new client: ${email}`);
        
        // Check if client already exists
        const existingClient = Array.from(this.clients.values()).find(c => c.email === email);
        if (existingClient) {
            throw new Error('Client already exists with this email');
        }

        const client: Client = {
            id: this.generateClientId(),
            email,
            name,
            plan: 'node_access', // Default plan
            status: 'active',
            subscriptions: [],
            created_at: Date.now(),
            last_login: Date.now(),
            total_spent: 0,
            preferences: {
                language: 'bg',
                theme: 'dark',
                notifications: {
                    email: true,
                    telegram: false,
                    push: true
                }
            }
        };

        this.clients.set(client.id, client);
        
        this.emit('client_registered', client);
        this.logger.info('CLIENT', `Client registered successfully: ${client.id}`);
        
        return client;
    }

    /**
     * Process subscription purchase
     */
    async purchaseSubscription(clientId: string, planId: string, paymentMethodId: string): Promise<ClientSubscription> {
        const client = this.clients.get(clientId);
        if (!client) {
            throw new Error('Client not found');
        }

        const product = ProductCatalog.getById(planId);
        if (!product) {
            throw new Error('Product not found');
        }

        this.logger.info('CLIENT', `Processing subscription purchase: ${clientId} -> ${planId}`);

        try {
            // Process payment through Stripe
            const payment = await this.paymentGateway.createPayment(
                product.price,
                product.currency.toLowerCase(),
                'stripe',
                {
                    client_id: clientId,
                    product_id: planId,
                    product_name: product.name
                }
            );

            if (!payment || payment.status !== 'succeeded') {
                throw new Error('Payment processing failed');
            }

            // Create subscription
            const subscription: ClientSubscription = {
                app_id: planId,
                app_name: product.name,
                plan_id: planId,
                status: 'active',
                started_at: Date.now(),
                expires_at: product.interval === 'monthly' 
                    ? Date.now() + (30 * 24 * 60 * 60 * 1000) 
                    : Date.now() + (365 * 24 * 60 * 60 * 1000),
                stripe_subscription_id: payment.id,
                usage_stats: {
                    api_calls_this_month: 0,
                    last_activity: Date.now(),
                    most_used_features: [],
                    total_sessions: 0
                }
            };

            // Add subscription to client
            client.subscriptions.push(subscription);
            client.plan = planId;
            client.total_spent += product.price;
            
            this.clients.set(clientId, client);

            this.emit('subscription_created', { client, subscription });
            this.logger.info('CLIENT', `Subscription created: ${subscription.app_id} for ${clientId}`);

            return subscription;

        } catch (error: any) {
            this.logger.error('CLIENT', `Subscription purchase failed for ${clientId}`, error);
            throw error;
        }
    }

    /**
     * Authenticate client login
     */
    async authenticateClient(email: string, password: string): Promise<Client> {
        this.logger.info('CLIENT', `Authentication attempt: ${email}`);
        
        const client = Array.from(this.clients.values()).find(c => c.email === email);
        if (!client) {
            throw new Error('Client not found');
        }

        // In production, verify password hash
        // For now, mock authentication
        
        client.last_login = Date.now();
        this.clients.set(client.id, client);
        
        this.emit('client_authenticated', client);
        this.logger.info('CLIENT', `Client authenticated: ${client.id}`);
        
        return client;
    }

    /**
     * Get client's accessible SaaS applications
     */
    getClientApps(clientId: string): string[] {
        const client = this.clients.get(clientId);
        if (!client) {
            throw new Error('Client not found');
        }

        // Return apps based on active subscriptions
        return client.subscriptions
            .filter(sub => sub.status === 'active' && sub.expires_at > Date.now())
            .map(sub => sub.app_id);
    }

    /**
     * Update client preferences
     */
    async updateClientPreferences(clientId: string, preferences: Partial<ClientPreferences>): Promise<Client> {
        const client = this.clients.get(clientId);
        if (!client) {
            throw new Error('Client not found');
        }

        client.preferences = { ...client.preferences, ...preferences };
        this.clients.set(clientId, client);

        this.emit('preferences_updated', { clientId, preferences });
        this.logger.info('CLIENT', `Preferences updated for ${clientId}`);

        return client;
    }

    /**
     * Track client usage
     */
    trackClientUsage(clientId: string, appId: string, feature: string): void {
        const client = this.clients.get(clientId);
        if (!client) return;

        const subscription = client.subscriptions.find(sub => sub.app_id === appId);
        if (!subscription) return;

        subscription.usage_stats.api_calls_this_month++;
        subscription.usage_stats.last_activity = Date.now();
        
        if (!subscription.usage_stats.most_used_features.includes(feature)) {
            subscription.usage_stats.most_used_features.push(feature);
        }

        this.clients.set(clientId, client);
    }

    /**
     * Get client by ID
     */
    getClient(clientId: string): Client | undefined {
        return this.clients.get(clientId);
    }

    /**
     * Get client by email
     */
    getClientByEmail(email: string): Client | undefined {
        return Array.from(this.clients.values()).find(c => c.email === email);
    }

    /**
     * Get all clients (admin function)
     */
    getAllClients(): Client[] {
        return Array.from(this.clients.values());
    }

    /**
     * Get client statistics
     */
    getClientStats(): any {
        const clients = Array.from(this.clients.values());
        const activeClients = clients.filter(c => c.status === 'active');
        const totalRevenue = clients.reduce((sum, c) => sum + c.total_spent, 0);
        
        return {
            total_clients: clients.length,
            active_clients: activeClients.length,
            total_revenue: totalRevenue,
            avg_revenue_per_client: totalRevenue / clients.length,
            popular_plans: this.getPopularPlans(clients),
            retention_rate: this.calculateRetentionRate(clients)
        };
    }

    /**
     * Suspend client (admin function)
     */
    async suspendClient(clientId: string, reason: string): Promise<void> {
        const client = this.clients.get(clientId);
        if (!client) {
            throw new Error('Client not found');
        }

        client.status = 'suspended';
        this.clients.set(clientId, client);

        this.emit('client_suspended', { client, reason });
        this.logger.warn('CLIENT', `Client suspended: ${clientId} - ${reason}`);
    }

    /**
     * Cancel client subscription
     */
    async cancelSubscription(clientId: string, subscriptionId: string): Promise<void> {
        const client = this.clients.get(clientId);
        if (!client) {
            throw new Error('Client not found');
        }

        const subscription = client.subscriptions.find(sub => 
            sub.app_id === subscriptionId || sub.stripe_subscription_id === subscriptionId
        );
        
        if (!subscription) {
            throw new Error('Subscription not found');
        }

        subscription.status = 'cancelled';
        this.clients.set(clientId, client);

        this.emit('subscription_cancelled', { client, subscription });
        this.logger.info('CLIENT', `Subscription cancelled: ${subscriptionId} for ${clientId}`);
    }

    // Private methods
    private generateClientId(): string {
        return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private getPopularPlans(clients: Client[]): Record<string, number> {
        const planCounts: Record<string, number> = {};
        
        clients.forEach(client => {
            planCounts[client.plan] = (planCounts[client.plan] || 0) + 1;
        });

        return planCounts;
    }

    private calculateRetentionRate(clients: Client[]): number {
        const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
        const oldClients = clients.filter(c => c.created_at < thirtyDaysAgo);
        const retainedClients = oldClients.filter(c => c.last_login > thirtyDaysAgo);
        
        return oldClients.length > 0 ? retainedClients.length / oldClients.length : 1;
    }
}

export { Client, ClientSubscription, ClientPreferences, UsageStats };