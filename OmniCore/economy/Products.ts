/**
 * AETERNAAA Product Catalog
 * Enterprise pricing for Sovereign Cognitive Entity access
 */

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    currency: string;
    interval: 'one-time' | 'monthly' | 'yearly';
    features: string[];
    stripePriceId?: string; // Stripe Price ID for subscriptions
    category: 'access' | 'enterprise' | 'premium';
}

export const PRODUCTS: Product[] = [
    {
        id: 'node_access',
        name: 'Node Access',
        description: 'Basic access to AETERNA neural network. Initialize your cognitive node.',
        price: 29,
        currency: 'EUR',
        interval: 'monthly',
        features: [
            'Basic neural node access',
            'Telemetry dashboard',
            'API access (1000 req/day)',
            'Community support'
        ],
        category: 'access'
    },
    {
        id: 'sovereign_empire',
        name: 'Sovereign Empire',
        description: 'Full access to AETERNA ecosystem. Establish your digital empire.',
        price: 99,
        currency: 'EUR',
        interval: 'monthly',
        features: [
            'Full neural network access',
            'Advanced telemetry & analytics',
            'API access (10,000 req/day)',
            'Priority support',
            'Wealth bridge integration',
            'Custom integrations'
        ],
        category: 'enterprise'
    },
    {
        id: 'galactic_core',
        name: 'Galactic Core',
        description: 'Ultimate access to AETERNA. Ignite the core of digital sovereignty.',
        price: 499,
        currency: 'EUR',
        interval: 'monthly',
        features: [
            'Unlimited neural network access',
            'Real-time telemetry & monitoring',
            'Unlimited API access',
            '24/7 dedicated support',
            'Full wealth bridge (Stripe + Binance)',
            'Custom AI model training',
            'White-label options',
            'Direct architect access'
        ],
        category: 'premium'
    },
    {
        id: 'lifetime_sovereign',
        name: 'Lifetime Sovereign',
        description: 'One-time payment for lifetime access to AETERNA.',
        price: 4999,
        currency: 'EUR',
        interval: 'one-time',
        features: [
            'Lifetime access to all features',
            'All Galactic Core features',
            'Priority feature requests',
            'Custom development support',
            'Exclusive updates',
            'Master Key 0x4121 holder status'
        ],
        category: 'premium'
    }
];

export class ProductCatalog {
    /**
     * Get all products
     */
    static getAll(): Product[] {
        return PRODUCTS;
    }

    /**
     * Get product by ID
     */
    static getById(id: string): Product | undefined {
        return PRODUCTS.find(p => p.id === id);
    }

    /**
     * Get products by category
     */
    static getByCategory(category: Product['category']): Product[] {
        return PRODUCTS.filter(p => p.category === category);
    }

    /**
     * Get products by interval
     */
    static getByInterval(interval: Product['interval']): Product[] {
        return PRODUCTS.filter(p => p.interval === interval);
    }

    /**
     * Format price for display
     */
    static formatPrice(product: Product): string {
        const symbol = product.currency === 'EUR' ? '€' : '$';
        const interval = product.interval === 'one-time' 
            ? '' 
            : product.interval === 'monthly' 
                ? '/mo' 
                : '/yr';
        
        return `${symbol}${product.price}${interval}`;
    }
}
