/**
 * App Launcher - Individual SaaS Application Interface
 * Provides seamless access to each SaaS application with unified branding
 */

import React, { useState, useEffect } from 'react';
import { ArrowLeft, ExternalLink, Settings, BarChart3, Zap, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

interface SaaSAppDetails {
    id: string;
    name: string;
    description: string;
    category: string;
    icon: string;
    url: string;
    features: string[];
    usage_stats: {
        sessions_today: number;
        api_calls_today: number;
        uptime: number;
        active_users: number;
    };
}

export const AppLauncher: React.FC<{ appId: string }> = ({ appId }) => {
    const [language, setLanguage] = useState<'bg' | 'en'>('en');
    const [appDetails, setAppDetails] = useState<SaaSAppDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const APPS: Record<string, SaaSAppDetails> = {
        wealth_scanner: {
            id: 'wealth_scanner',
            name: 'Wealth Scanner Pro',
            description: 'AI-powered financial intelligence platform with real-time market analysis',
            category: 'Financial Analytics',
            icon: '🔍',
            url: 'wealth-scanner.aeterna.website',
            features: [
                'Real-time market data aggregation',
                'AI-powered portfolio analysis', 
                'Risk assessment algorithms',
                'Automated trading signals',
                'Tax optimization suggestions',
                'ESG compliance scoring'
            ],
            usage_stats: {
                sessions_today: 47,
                api_calls_today: 12500,
                uptime: 99.98,
                active_users: 1250
            }
        },
        automation_nexus: {
            id: 'automation_nexus',
            name: 'Automation Nexus',
            description: 'Superior automation platform that makes Playwright + Selenium obsolete',
            category: 'Automation & AI',
            icon: '🤖',
            url: 'automation-nexus.aeterna.website',
            features: [
                'AI-powered element detection',
                'Quantum resonance page scanning',
                'Self-healing automation scripts',
                'Multi-browser swarm execution',
                'Natural language automation',
                'Anti-detection stealth technology'
            ],
            usage_stats: {
                sessions_today: 156,
                api_calls_today: 45000,
                uptime: 99.95,
                active_users: 2100
            }
        },
        sector_security: {
            id: 'sector_security',
            name: 'Sector Security Suite',
            description: 'Advanced cybersecurity platform with AI threat detection',
            category: 'Cybersecurity',
            icon: '🛡️',
            url: 'sector-security.aeterna.website',
            features: [
                'Real-time vulnerability scanning',
                'AI-powered threat analysis',
                'Automated penetration testing',
                'Compliance reporting',
                'Incident response automation',
                'Dark web monitoring'
            ],
            usage_stats: {
                sessions_today: 89,
                api_calls_today: 23000,
                uptime: 99.99,
                active_users: 890
            }
        }
    };

    useEffect(() => {
        const app = APPS[appId];
        if (app) {
            setAppDetails(app);
        }
        setIsLoading(false);
    }, [appId]);

    const t = language === 'bg' ? {
        backToDashboard: 'Обратно към Dashboard',
        launchApplication: 'Стартирай Приложението', 
        openInNewTab: 'Отвори в нов tab',
        viewDocumentation: 'Виж Документация',
        applicationStats: 'Статистики на Приложението',
        features: 'Функционалности',
        sessionsToday: 'Сесии днес',
        apiCallsToday: 'API заявки днес',
        uptime: 'Uptime',
        activeUsers: 'Активни потребители'
    } : {
        backToDashboard: 'Back to Dashboard',
        launchApplication: 'Launch Application',
        openInNewTab: 'Open in New Tab', 
        viewDocumentation: 'View Documentation',
        applicationStats: 'Application Statistics',
        features: 'Features',
        sessionsToday: 'Sessions Today',
        apiCallsToday: 'API Calls Today',
        uptime: 'Uptime',
        activeUsers: 'Active Users'
    };

    if (isLoading || !appDetails) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin text-4xl mb-4">⚡</div>
                    <p>Loading application...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
            {/* Header */}
            <nav className="border-b border-white/10 bg-black/20 backdrop-blur p-6">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => window.history.back()}
                            className="p-2 hover:bg-white/10 rounded-lg transition"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        
                        <div className="flex items-center gap-3">
                            <div className="text-3xl">{appDetails.icon}</div>
                            <div>
                                <h1 className="text-xl font-bold">{appDetails.name}</h1>
                                <p className="text-sm text-gray-400">{appDetails.category}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setLanguage('bg')}
                                className={`px-3 py-1 rounded-lg text-sm transition ${language === 'bg' ? 'bg-purple-600' : 'bg-white/10 hover:bg-white/20'}`}
                            >
                                🇧🇬 БГ
                            </button>
                            <button 
                                onClick={() => setLanguage('en')}
                                className={`px-3 py-1 rounded-lg text-sm transition ${language === 'en' ? 'bg-purple-600' : 'bg-white/10 hover:bg-white/20'}`}
                            >
                                🇺🇸 EN
                            </button>
                        </div>
                        
                        <button className="p-2 hover:bg-white/10 rounded-lg transition">
                            <Settings className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-12">
                {/* App Description */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <div className="text-6xl mb-4">{appDetails.icon}</div>
                        <h1 className="text-4xl font-bold mb-4">{appDetails.name}</h1>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto">{appDetails.description}</p>
                    </motion.div>

                    {/* Launch Buttons */}
                    <div className="flex gap-4 justify-center">
                        <button 
                            onClick={() => window.open(`https://${appDetails.url}`, '_blank')}
                            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold text-lg hover:scale-105 transition-transform"
                        >
                            <ExternalLink className="w-5 h-5 inline mr-2" />
                            {t.launchApplication}
                        </button>
                        
                        <button 
                            onClick={() => window.open(`https://${appDetails.url}`, '_blank')}
                            className="px-6 py-4 border border-white/20 rounded-xl font-semibold hover:bg-white/10 transition"
                        >
                            {t.openInNewTab}
                        </button>
                        
                        <button className="px-6 py-4 border border-white/20 rounded-xl font-semibold hover:bg-white/10 transition">
                            {t.viewDocumentation}
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid md:grid-cols-4 gap-6 mb-12">
                    <div className="bg-white/5 rounded-xl border border-white/10 p-6 text-center">
                        <div className="text-2xl font-bold text-blue-400">{appDetails.usage_stats.sessions_today}</div>
                        <div className="text-sm text-gray-400">{t.sessionsToday}</div>
                    </div>
                    
                    <div className="bg-white/5 rounded-xl border border-white/10 p-6 text-center">
                        <div className="text-2xl font-bold text-green-400">
                            {appDetails.usage_stats.api_calls_today.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-400">{t.apiCallsToday}</div>
                    </div>
                    
                    <div className="bg-white/5 rounded-xl border border-white/10 p-6 text-center">
                        <div className="text-2xl font-bold text-emerald-400">{appDetails.usage_stats.uptime}%</div>
                        <div className="text-sm text-gray-400">{t.uptime}</div>
                    </div>
                    
                    <div className="bg-white/5 rounded-xl border border-white/10 p-6 text-center">
                        <div className="text-2xl font-bold text-purple-400">
                            {appDetails.usage_stats.active_users.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-400">{t.activeUsers}</div>
                    </div>
                </div>

                {/* Features */}
                <div>
                    <h2 className="text-3xl font-bold mb-8 text-center">{t.features}</h2>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {appDetails.features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 * index }}
                                className="bg-white/5 rounded-xl border border-white/10 p-6"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                    <h3 className="font-semibold">{feature}</h3>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Call to Action */}
                <div className="text-center mt-16">
                    <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl border border-purple-500/30 p-8">
                        <h3 className="text-2xl font-bold mb-4">
                            {language === 'bg' 
                                ? 'Готови ли сте да започнете?'
                                : 'Ready to get started?'
                            }
                        </h3>
                        
                        <button 
                            onClick={() => window.open(`https://${appDetails.url}`, '_blank')}
                            className="px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold text-lg hover:scale-105 transition-transform"
                        >
                            {language === 'bg' ? '🚀 Стартирай Сега' : '🚀 Launch Now'}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AppLauncher;