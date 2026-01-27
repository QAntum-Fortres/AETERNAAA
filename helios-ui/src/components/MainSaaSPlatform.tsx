/**
 * 🌐 AETERNA.WEBSITE - Main SaaS Platform Hub
 * The Ultimate SaaS Experience - Superior to Everything on the Market
 */

import React, { useState, useEffect } from 'react';
import {
  Brain, Zap, Shield, TrendingUp, Users, DollarSign, Globe, 
  Smartphone, Cpu, Database, BarChart3, Settings, Search,
  Play, Pause, RotateCcw, Download, Upload, Share2, Bell,
  Layers, Boxes, Network, Lock, Eye, Rocket, Star, Heart,
  Activity, Workflow, Sliders, Target, CheckCircle, AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SaaSApp {
  id: string;
  name: string;
  description: string;
  category: 'automation' | 'analytics' | 'security' | 'ai' | 'crypto' | 'productivity';
  price: number;
  currency: string;
  interval: string;
  features: string[];
  metrics: {
    activeUsers: number;
    revenue: number;
    uptime: number;
    satisfaction: number;
  };
  status: 'active' | 'launching' | 'maintenance';
  icon: React.ReactNode;
  gradient: string;
  url?: string;
}

interface PlatformStats {
  totalUsers: number;
  totalRevenue: number;
  activeApps: number;
  uptime: number;
  automationTasks: number;
  aiInteractions: number;
}

const SAAS_APPLICATIONS: SaaSApp[] = [
  {
    id: 'wealth_scanner',
    name: 'Wealth Scanner Pro',
    description: 'AI-powered financial intelligence platform with real-time market analysis and portfolio optimization',
    category: 'analytics',
    price: 299,
    currency: 'EUR',
    interval: '/month',
    features: [
      'Real-time market data aggregation',
      'AI-powered portfolio analysis',
      'Risk assessment algorithms',
      'Automated trading signals',
      'Tax optimization suggestions',
      'ESG compliance scoring',
      'Custom alert systems',
      'API integrations (100+ exchanges)'
    ],
    metrics: { activeUsers: 1250, revenue: 45000, uptime: 99.98, satisfaction: 4.9 },
    status: 'active',
    icon: <TrendingUp className="w-6 h-6" />,
    gradient: 'from-green-500 to-emerald-600',
    url: 'wealth-scanner.aeterna.website'
  },
  {
    id: 'sector_security',
    name: 'Sector Security Suite',
    description: 'Advanced cybersecurity platform with AI threat detection and automated incident response',
    category: 'security',
    price: 499,
    currency: 'EUR', 
    interval: '/month',
    features: [
      'Real-time vulnerability scanning',
      'AI-powered threat analysis',
      'Automated penetration testing',
      'Compliance reporting (ISO, SOC2, GDPR)',
      'Incident response automation',
      'Dark web monitoring',
      'Quantum-resistant encryption',
      'Zero-trust architecture implementation'
    ],
    metrics: { activeUsers: 890, revenue: 78000, uptime: 99.99, satisfaction: 4.8 },
    status: 'active',
    icon: <Shield className="w-6 h-6" />,
    gradient: 'from-red-500 to-pink-600',
    url: 'sector-security.aeterna.website'
  },
  {
    id: 'network_optimizer',
    name: 'Network Optimizer Pro',
    description: 'Intelligent network performance optimization with predictive scaling and traffic management',
    category: 'productivity',
    price: 399,
    currency: 'EUR',
    interval: '/month',
    features: [
      'Network performance monitoring',
      'Bandwidth optimization algorithms',
      'Latency reduction protocols',
      'Traffic analysis and routing',
      'Predictive capacity planning',
      'CDN optimization',
      'Load balancer intelligence',
      'Multi-cloud orchestration'
    ],
    metrics: { activeUsers: 1120, revenue: 52000, uptime: 99.97, satisfaction: 4.7 },
    status: 'active',
    icon: <Network className="w-6 h-6" />,
    gradient: 'from-blue-500 to-cyan-600',
    url: 'network-optimizer.aeterna.website'
  },
  {
    id: 'valuation_gate',
    name: 'Valuation Gate AI',
    description: 'Ultimate asset valuation platform powered by quantum AI and multi-dimensional market analysis',
    category: 'ai',
    price: 799,
    currency: 'EUR',
    interval: '/month',
    features: [
      'Quantum AI valuation models',
      'Multi-dimensional market analysis',
      'Real-time asset tracking',
      'Predictive market modeling',
      'Automated due diligence',
      'Investment recommendation engine',
      'Risk-adjusted return calculations',
      'Blockchain asset integration'
    ],
    metrics: { activeUsers: 650, revenue: 95000, uptime: 99.99, satisfaction: 4.9 },
    status: 'active',
    icon: <Brain className="w-6 h-6" />,
    gradient: 'from-purple-500 to-violet-600',
    url: 'valuation-gate.aeterna.website'
  },
  {
    id: 'automation_nexus',
    name: 'Automation Nexus',
    description: 'Superior automation platform that makes Playwright + Selenium obsolete',
    category: 'automation',
    price: 599,
    currency: 'EUR',
    interval: '/month',
    features: [
      'AI-powered element detection (no selectors needed)',
      'Quantum resonance page scanning',
      'Self-healing automation scripts',
      'Multi-browser swarm execution',
      'Natural language automation commands',
      'Visual AI interaction (screenshot-based)',
      'Anti-detection stealth technology',
      'Cross-platform mobile automation'
    ],
    metrics: { activeUsers: 2100, revenue: 125000, uptime: 99.95, satisfaction: 4.8 },
    status: 'launching',
    icon: <Workflow className="w-6 h-6" />,
    gradient: 'from-orange-500 to-red-600',
    url: 'automation-nexus.aeterna.website'
  },
  {
    id: 'intelligence_core',
    name: 'Intelligence Core',
    description: 'Multi-modal AI platform combining vision, language, and reasoning for enterprise solutions',
    category: 'ai',
    price: 899,
    currency: 'EUR',
    interval: '/month',
    features: [
      'Multi-modal AI (text, image, video, audio)',
      'Custom model fine-tuning',
      'Enterprise knowledge bases',
      'Reasoning chain visualization',
      'API rate limiting and scaling',
      'Custom workflow automation',
      'Integration marketplace',
      'White-label deployment'
    ],
    metrics: { activeUsers: 780, revenue: 67000, uptime: 99.96, satisfaction: 4.9 },
    status: 'active',
    icon: <Cpu className="w-6 h-6" />,
    gradient: 'from-indigo-500 to-purple-600',
    url: 'intelligence-core.aeterna.website'
  }
];

export default function MainSaaSPlatform() {
  const [selectedApp, setSelectedApp] = useState<SaaSApp | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'apps' | 'analytics' | 'account'>('overview');
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Load platform statistics
    const platformStats: PlatformStats = {
      totalUsers: SAAS_APPLICATIONS.reduce((sum, app) => sum + app.metrics.activeUsers, 0),
      totalRevenue: SAAS_APPLICATIONS.reduce((sum, app) => sum + app.metrics.revenue, 0),
      activeApps: SAAS_APPLICATIONS.filter(app => app.status === 'active').length,
      uptime: 99.97,
      automationTasks: 2500000,
      aiInteractions: 15600000
    };
    setStats(platformStats);
  }, []);

  const filteredApps = SAAS_APPLICATIONS.filter(app =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.category.includes(searchQuery.toLowerCase())
  );

  const categoryIcons: Record<string, React.ReactNode> = {
    automation: <Workflow className="w-5 h-5" />,
    analytics: <BarChart3 className="w-5 h-5" />,
    security: <Shield className="w-5 h-5" />,
    ai: <Brain className="w-5 h-5" />,
    crypto: <DollarSign className="w-5 h-5" />,
    productivity: <Target className="w-5 h-5" />
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Navigation Header */}
      <nav className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <span className="text-xl font-bold">Æ</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                    AETERNA.WEBSITE
                  </h1>
                  <p className="text-xs text-gray-400">The Ultimate SaaS Platform</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-400">All Systems Operational</span>
              </div>
              <button className="p-2 hover:bg-white/10 rounded-lg transition">
                <Bell className="w-5 h-5" />
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:opacity-90 transition">
                Account
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-8 mt-4">
            {[
              { id: 'overview', label: 'Overview', icon: <Globe className="w-4 h-4" /> },
              { id: 'apps', label: 'SaaS Applications', icon: <Boxes className="w-4 h-4" /> },
              { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
              { id: 'account', label: 'Account', icon: <Users className="w-4 h-4" /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                  activeTab === tab.id 
                    ? 'bg-white/10 text-white border-b-2 border-purple-500' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Hero Section */}
              <div className="text-center py-12">
                <motion.h1 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-6xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent"
                >
                  The Future of SaaS
                </motion.h1>
                <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                  One platform. Every tool. Superior to everything on the market. 
                  AETERNAAA combines AI, automation, analytics, and security in ways no other platform can.
                </p>
                <div className="flex gap-4 justify-center">
                  <button 
                    onClick={() => setActiveTab('apps')}
                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold text-lg hover:scale-105 transition-transform"
                  >
                    Explore Platform
                  </button>
                  <button className="px-8 py-4 border border-white/20 rounded-xl font-semibold text-lg hover:bg-white/10 transition">
                    Watch Demo
                  </button>
                </div>
              </div>

              {/* Platform Stats */}
              {stats && (
                <div className="grid md:grid-cols-6 gap-6 mb-12">
                  <StatCard 
                    icon={<Users />} 
                    label="Total Users" 
                    value={stats.totalUsers.toLocaleString()} 
                    change="+23%" 
                    gradient="from-blue-500 to-cyan-500" 
                  />
                  <StatCard 
                    icon={<DollarSign />} 
                    label="Revenue" 
                    value={`€${(stats.totalRevenue / 1000).toFixed(0)}K`} 
                    change="+35%" 
                    gradient="from-green-500 to-emerald-500" 
                  />
                  <StatCard 
                    icon={<Boxes />} 
                    label="Active Apps" 
                    value={stats.activeApps.toString()} 
                    change="New!" 
                    gradient="from-purple-500 to-violet-500" 
                  />
                  <StatCard 
                    icon={<Activity />} 
                    label="Uptime" 
                    value={`${stats.uptime}%`} 
                    change="SLA" 
                    gradient="from-orange-500 to-red-500" 
                  />
                  <StatCard 
                    icon={<Workflow />} 
                    label="Automations" 
                    value={`${(stats.automationTasks / 1000000).toFixed(1)}M`} 
                    change="+127%" 
                    gradient="from-indigo-500 to-purple-500" 
                  />
                  <StatCard 
                    icon={<Brain />} 
                    label="AI Queries" 
                    value={`${(stats.aiInteractions / 1000000).toFixed(1)}M`} 
                    change="+89%" 
                    gradient="from-pink-500 to-rose-500" 
                  />
                </div>
              )}

              {/* Superiority Features */}
              <div className="grid md:grid-cols-3 gap-8">
                <SuperiorityCard
                  icon={<Brain />}
                  title="Quantum AI Integration"
                  description="Not just AI - quantum-enhanced intelligence that predicts and adapts beyond traditional machine learning"
                  features={['Multi-modal reasoning', 'Quantum state analysis', 'Predictive adaptation', 'Context memory']}
                />
                <SuperiorityCard
                  icon={<Workflow />}
                  title="Automation Beyond Limits"
                  description="Makes Playwright + Selenium obsolete with AI-powered, self-healing automation that thinks like humans"
                  features={['Natural language control', 'Visual AI recognition', 'Self-healing scripts', 'Anti-detection stealth']}
                />
                <SuperiorityCard
                  icon={<Globe />}
                  title="Unified Everything"
                  description="Single platform, single login, infinite capabilities. What takes 20+ SaaS tools elsewhere, we do in one"
                  features={['Universal dashboard', 'Cross-app data flow', 'Unified billing', 'Seamless experience']}
                />
              </div>
            </motion.div>
          )}

          {/* SaaS Applications Tab */}
          {activeTab === 'apps' && (
            <motion.div
              key="apps"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Search and Filters */}
              <div className="flex gap-4 mb-8">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search applications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-purple-500 transition"
                  />
                </div>
                <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500">
                  <option value="">All Categories</option>
                  <option value="automation">Automation</option>
                  <option value="analytics">Analytics</option>
                  <option value="security">Security</option>
                  <option value="ai">AI & ML</option>
                  <option value="productivity">Productivity</option>
                </select>
              </div>

              {/* Applications Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredApps.map((app) => (
                  <SaaSAppCard
                    key={app.id}
                    app={app}
                    onClick={() => setSelectedApp(app)}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && stats && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <h2 className="text-3xl font-bold mb-8">Platform Analytics</h2>
              
              {/* Revenue Chart Placeholder */}
              <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
                <h3 className="text-xl font-semibold mb-6">Revenue Performance</h3>
                <div className="h-64 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Interactive revenue charts will appear here</p>
                    <p className="text-sm">Real-time data from all SaaS applications</p>
                  </div>
                </div>
              </div>

              {/* App Performance Grid */}
              <div className="grid md:grid-cols-3 gap-6">
                {SAAS_APPLICATIONS.map(app => (
                  <div key={app.id} className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${app.gradient}`}>
                        {app.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold">{app.name}</h3>
                        <p className="text-sm text-gray-400">{app.category}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Revenue:</span>
                        <span className="text-green-400">€{app.metrics.revenue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Users:</span>
                        <span>{app.metrics.activeUsers.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Satisfaction:</span>
                        <span className="text-yellow-400">{app.metrics.satisfaction}/5 ⭐</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Uptime:</span>
                        <span className={app.metrics.uptime > 99.95 ? 'text-green-400' : 'text-yellow-400'}>
                          {app.metrics.uptime}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Account Tab */}
          {activeTab === 'account' && (
            <motion.div
              key="account"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <h2 className="text-3xl font-bold mb-8">Account Management</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
                  <h3 className="text-xl font-semibold mb-6">Subscription Details</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Plan:</span>
                      <span className="font-semibold text-purple-400">Galactic Core</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Billing:</span>
                      <span>€499/month</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Next billing:</span>
                      <span>Feb 27, 2026</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className="text-green-400">Active</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
                  <h3 className="text-xl font-semibold mb-6">Usage Statistics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>API Calls:</span>
                      <span>Unlimited</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Apps Accessed:</span>
                      <span>6/6</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Data Processed:</span>
                      <span>2.4TB</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Automations:</span>
                      <span>15,420 runs</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* App Modal */}
      <AnimatePresence>
        {selectedApp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedApp(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl border border-white/20 max-w-4xl w-full max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="flex items-start gap-6 mb-8">
                  <div className={`p-4 rounded-2xl bg-gradient-to-r ${selectedApp.gradient}`}>
                    {selectedApp.icon}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold mb-2">{selectedApp.name}</h2>
                    <p className="text-gray-300 mb-4">{selectedApp.description}</p>
                    <div className="flex items-center gap-6">
                      <span className="text-2xl font-bold">€{selectedApp.price}{selectedApp.interval}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">Category:</span>
                        <span className="px-3 py-1 bg-white/10 rounded-full text-sm capitalize">{selectedApp.category}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedApp(null)}
                    className="p-2 hover:bg-white/10 rounded-lg transition"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Features</h3>
                    <ul className="space-y-3">
                      {selectedApp.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">Performance Metrics</h3>
                    <div className="space-y-4">
                      <MetricBar label="User Satisfaction" value={selectedApp.metrics.satisfaction} max={5} suffix="/5" color="green" />
                      <MetricBar label="Uptime" value={selectedApp.metrics.uptime} max={100} suffix="%" color="blue" />
                      <MetricBar label="Active Users" value={selectedApp.metrics.activeUsers} max={3000} suffix="" color="purple" />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-8 pt-8 border-t border-white/10">
                  <button className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold hover:scale-105 transition-transform">
                    Launch Application
                  </button>
                  <button className="px-6 py-3 border border-white/20 rounded-xl hover:bg-white/10 transition">
                    View Details
                  </button>
                  <button className="px-6 py-3 border border-white/20 rounded-xl hover:bg-white/10 transition">
                    API Docs
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ icon, label, value, change, gradient }: any) {
  return (
    <div className="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition">
      <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${gradient} mb-4`}>
        {icon}
      </div>
      <div className="text-gray-400 text-sm mb-1">{label}</div>
      <div className="text-2xl font-bold mb-2">{value}</div>
      <div className="text-sm text-green-400">{change}</div>
    </div>
  );
}

function SuperiorityCard({ icon, title, description, features }: any) {
  return (
    <div className="bg-white/5 rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition">
      <div className="text-purple-400 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-300 mb-6">{description}</p>
      <ul className="space-y-2">
        {features.map((feature: string, i: number) => (
          <li key={i} className="flex items-center gap-2 text-sm">
            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SaaSAppCard({ app, onClick }: { app: SaaSApp; onClick: () => void }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 transition cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${app.gradient}`}>
          {app.icon}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-1">{app.name}</h3>
          <p className="text-gray-400 text-sm">{app.category}</p>
        </div>
        <div className="flex items-center gap-1">
          {app.status === 'active' && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>}
          {app.status === 'launching' && <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>}
          {app.status === 'maintenance' && <div className="w-2 h-2 bg-red-500 rounded-full"></div>}
          <span className="text-xs text-gray-400 capitalize">{app.status}</span>
        </div>
      </div>

      <p className="text-gray-300 text-sm mb-6 line-clamp-2">{app.description}</p>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Active Users:</span>
          <span className="font-semibold">{app.metrics.activeUsers.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Monthly Revenue:</span>
          <span className="text-green-400 font-semibold">€{app.metrics.revenue.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Satisfaction:</span>
          <span className="text-yellow-400">{app.metrics.satisfaction}/5 ⭐</span>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-2xl font-bold">€{app.price}<span className="text-sm text-gray-400">{app.interval}</span></span>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition group-hover:scale-105">
            View
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-sm hover:opacity-90 transition group-hover:scale-105">
            Launch
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function MetricBar({ label, value, max, suffix, color }: any) {
  const percentage = Math.min((value / max) * 100, 100);
  const colorClasses: Record<string, string> = {
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500'
  };

  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span>{label}</span>
        <span className="font-semibold">{value}{suffix}</span>
      </div>
      <div className="w-full bg-white/10 rounded-full h-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-2 rounded-full ${colorClasses[color]}`}
        />
      </div>
    </div>
  );
}