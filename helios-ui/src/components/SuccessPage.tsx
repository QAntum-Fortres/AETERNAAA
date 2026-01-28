/**
 * Success Page - Post-payment confirmation
 * Shows client their purchased SaaS applications and next steps
 */

import React, { useEffect, useState } from 'react';
import { CheckCircle, ArrowRight, Smartphone, Globe, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface PurchasedPlan {
    id: string;
    name: string;
    price: number;
    currency: string;
    apps: string[];
    features: string[];
}

interface SaaSApp {
    id: string;
    name: string;
    description: string;
    icon: string;
    url: string;
}

const AVAILABLE_APPS: SaaSApp[] = [
    {
        id: 'wealth_scanner',
        name: 'Wealth Scanner Pro',
        description: 'AI-powered financial intelligence platform',
        icon: '🔍',
        url: 'wealth-scanner.aeterna.website'
    },
    {
        id: 'sector_security',
        name: 'Sector Security Suite', 
        description: 'Advanced cybersecurity with AI threat detection',
        icon: '🛡️',
        url: 'sector-security.aeterna.website'
    },
    {
        id: 'network_optimizer',
        name: 'Network Optimizer Pro',
        description: 'Intelligent network performance optimization',
        icon: '🌐',
        url: 'network-optimizer.aeterna.website'
    },
    {
        id: 'valuation_gate',
        name: 'Valuation Gate AI',
        description: 'Ultimate asset valuation platform',
        icon: '💎',
        url: 'valuation-gate.aeterna.website'
    },
    {
        id: 'automation_nexus',
        name: 'Automation Nexus',
        description: 'Superior automation platform',
        icon: '🤖',
        url: 'automation-nexus.aeterna.website'
    },
    {
        id: 'intelligence_core',
        name: 'Intelligence Core',
        description: 'Multi-modal AI platform',
        icon: '🧠',
        url: 'intelligence-core.aeterna.website'
    }
];

export const SuccessPage: React.FC = () => {
    const [language, setLanguage] = useState<'bg' | 'en'>('en');
    const [purchasedPlan, setPurchasedPlan] = useState<PurchasedPlan | null>(null);
    const [clientApps, setClientApps] = useState<SaaSApp[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Get URL parameters to determine purchased plan
        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get('session_id');
        const planId = urlParams.get('plan') || 'galactic_core';
        
        // Mock purchased plan data
        const mockPlan: PurchasedPlan = {
            id: planId,
            name: planId === 'galactic_core' ? 'Galactic Core' : 'Node Access',
            price: planId === 'galactic_core' ? 499 : 29,
            currency: 'EUR',
            apps: planId === 'galactic_core' 
                ? ['wealth_scanner', 'sector_security', 'network_optimizer', 'valuation_gate', 'automation_nexus', 'intelligence_core']
                : ['wealth_scanner'],
            features: planId === 'galactic_core'
                ? ['Unlimited API access', '24/7 support', 'All SaaS apps', 'Telegram control', 'AI training']
                : ['Basic API access', 'Community support', '1 SaaS app']
        };

        setPurchasedPlan(mockPlan);
        
        // Get available apps for this plan
        const apps = AVAILABLE_APPS.filter(app => mockPlan.apps.includes(app.id));
        setClientApps(apps);
        
        setIsLoading(false);
    }, []);

    const t = language === 'bg' ? {
        title: 'Плащането Успешно!',
        subtitle: 'Добре дошли в AETERNA.WEBSITE',
        planPurchased: 'Закупен план',
        accessGranted: 'Достъп предоставен до',
        yourApps: 'Вашите SaaS Приложения',
        launchApp: 'Стартирай',
        telegramSetup: 'Настройка на Telegram',
        telegramInstructions: 'За mobile control, изпратете код 967408 на @AETERNAABot в Telegram',
        nextSteps: 'Следващи стъпки',
        step1: 'Разгледайте вашите SaaS приложения',
        step2: 'Настройте Telegram за mobile достъп',
        step3: 'Започнете да генерирате приходи',
        goToDashboard: 'Отидете в Dashboard',
        support: 'Имате въпроси? Свържете се с поддръжката',
        documentation: 'Документация и API'
    } : {
        title: 'Payment Successful!',
        subtitle: 'Welcome to AETERNA.WEBSITE',
        planPurchased: 'Plan purchased',
        accessGranted: 'Access granted to',
        yourApps: 'Your SaaS Applications', 
        launchApp: 'Launch',
        telegramSetup: 'Telegram Setup',
        telegramInstructions: 'For mobile control, send code 967408 to @AETERNAABot in Telegram',
        nextSteps: 'Next Steps',
        step1: 'Explore your SaaS applications',
        step2: 'Set up Telegram for mobile access',
        step3: 'Start generating revenue',
        goToDashboard: 'Go to Dashboard',
        support: 'Questions? Contact support',
        documentation: 'Documentation & API'
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin text-4xl mb-4">⚡</div>
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
            {/* Language Toggle */}
            <div className="fixed top-4 right-4 z-50 flex gap-2">
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

            <div className="max-w-4xl mx-auto px-6 py-12">
                {/* Success Header */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center mb-12"
                >
                    <div className="text-6xl mb-6">✅</div>
                    <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                        {t.title}
                    </h1>
                    <p className="text-xl text-gray-300 mb-8">{t.subtitle}</p>
                    
                    {purchasedPlan && (
                        <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-6 max-w-md mx-auto">
                            <h3 className="text-lg font-semibold text-green-400 mb-2">{t.planPurchased}:</h3>
                            <div className="text-2xl font-bold">{purchasedPlan.name}</div>
                            <div className="text-green-300">€{purchasedPlan.price}/{language === 'bg' ? 'месец' : 'month'}</div>
                            <div className="text-sm text-gray-400 mt-2">
                                {t.accessGranted} {purchasedPlan.apps.length} SaaS приложения
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* SaaS Applications */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-12"
                >
                    <h2 className="text-3xl font-bold mb-8 text-center">{t.yourApps}</h2>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {clientApps.map((app, index) => (
                            <motion.div
                                key={app.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 + index * 0.1 }}
                                className="bg-white/5 rounded-xl border border-white/10 p-6 hover:border-green-500/50 transition"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="text-3xl">{app.icon}</div>
                                    <div>
                                        <h3 className="font-bold text-lg">{app.name}</h3>
                                        <p className="text-sm text-gray-400">{app.description}</p>
                                    </div>
                                </div>
                                
                                <div className="space-y-3">
                                    <button 
                                        onClick={() => window.open(`https://${app.url}`, '_blank')}
                                        className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg font-semibold hover:opacity-90 transition flex items-center justify-center gap-2"
                                    >
                                        <ArrowRight className="w-4 h-4" />
                                        {t.launchApp}
                                    </button>
                                    
                                    <div className="text-xs text-gray-500 text-center">
                                        {app.url}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Telegram Setup */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-6 mb-12"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <Smartphone className="w-6 h-6 text-purple-400" />
                        <h3 className="text-xl font-bold text-purple-400">{t.telegramSetup}</h3>
                    </div>
                    
                    <p className="text-gray-300 mb-4">{t.telegramInstructions}</p>
                    
                    <div className="bg-purple-600/30 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-purple-300">967408</div>
                        <div className="text-sm text-gray-400">@AETERNAABot</div>
                    </div>
                </motion.div>

                {/* Next Steps */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mb-12"
                >
                    <h2 className="text-3xl font-bold mb-8 text-center">{t.nextSteps}</h2>
                    
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-white/5 rounded-xl border border-white/10 p-6 text-center">
                            <Globe className="w-8 h-8 text-blue-400 mx-auto mb-4" />
                            <h3 className="font-semibold mb-2">1. {t.step1}</h3>
                            <p className="text-sm text-gray-400">{language === 'bg' 
                                ? 'Кликнете "Стартирай" на всяко приложение за достъп'
                                : 'Click "Launch" on each application to access'
                            }</p>
                        </div>
                        
                        <div className="bg-white/5 rounded-xl border border-white/10 p-6 text-center">
                            <Smartphone className="w-8 h-8 text-purple-400 mx-auto mb-4" />
                            <h3 className="font-semibold mb-2">2. {t.step2}</h3>
                            <p className="text-sm text-gray-400">{language === 'bg'
                                ? 'Изпратете 967408 в Telegram за mobile control'
                                : 'Send 967408 in Telegram for mobile control'
                            }</p>
                        </div>
                        
                        <div className="bg-white/5 rounded-xl border border-white/10 p-6 text-center">
                            <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-4" />
                            <h3 className="font-semibold mb-2">3. {t.step3}</h3>
                            <p className="text-sm text-gray-400">{language === 'bg'
                                ? 'Използвайте AI automation за бизнес оптимизация'
                                : 'Use AI automation for business optimization'
                            }</p>
                        </div>
                    </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="text-center space-y-4"
                >
                    <button 
                        onClick={() => window.location.href = '/dashboard'}
                        className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold text-lg hover:scale-105 transition-transform mr-4"
                    >
                        <Globe className="w-5 h-5 inline mr-2" />
                        {t.goToDashboard}
                    </button>
                    
                    <div className="text-sm text-gray-400 space-x-4">
                        <button className="hover:text-purple-400 transition">{t.support}</button>
                        <span>•</span>
                        <button className="hover:text-purple-400 transition">{t.documentation}</button>
                    </div>
                </motion.div>

                {/* Platform Benefits */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="mt-16 border-t border-white/10 pt-12"
                >
                    <div className="text-center">
                        <h3 className="text-xl font-bold mb-6">
                            {language === 'bg' 
                                ? 'Защо избрахте AETERNA.WEBSITE?'
                                : 'Why you chose AETERNA.WEBSITE?'
                            }
                        </h3>
                        
                        <div className="grid md:grid-cols-2 gap-6 text-sm">
                            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg p-4">
                                <strong className="text-green-400">
                                    {language === 'bg' ? '€1,500+ спестени месечно' : '€1,500+ saved monthly'}
                                </strong>
                                <p className="text-gray-400 mt-2">
                                    {language === 'bg' 
                                        ? 'Вместо 20+ различни SaaS tools'
                                        : 'Instead of 20+ different SaaS tools'
                                    }
                                </p>
                            </div>
                            
                            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-4">
                                <strong className="text-purple-400">
                                    {language === 'bg' ? '12 уникални features' : '12 unique features'}
                                </strong>
                                <p className="text-gray-400 mt-2">
                                    {language === 'bg'
                                        ? 'Които не съществуват другаде'
                                        : 'That don\'t exist elsewhere'
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default SuccessPage;