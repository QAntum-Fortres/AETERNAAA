/**
 * QAntum Antigravity Dashboard
 * Enhanced for AETERNA.WEBSITE SaaS Platform
 * Real-time network visualization of all SaaS applications and connections
 */

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface ModuleNode {
    id: string;
    type: 'Core' | 'Security' | 'Product' | 'AI' | 'Analytics' | 'Automation';
    status: '🟢 ALIVE' | '🟡 UNKNOWN' | '🔴 DEAD' | '🚀 LAUNCHING';
    exports: string[];
    loc: number;
    path: string;
    revenue?: number;
    users?: number;
    x?: number;
    y?: number;
    fx?: number;
    fy?: number;
}

interface NetworkLink {
    source: string | ModuleNode;
    target: string | ModuleNode;
    strength?: number;
}

export const AntigravityDashboard: React.FC = () => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [modules, setModules] = useState<ModuleNode[]>([]);
    const [stats, setStats] = useState({
        totalModules: 0,
        aliveCount: 0,
        unknownCount: 0,
        coreCount: 0,
        securityCount: 0,
        productCount: 0
    });

    // Enhanced SaaS platform modules
    const SAAS_MODULES: ModuleNode[] = [
        {
            id: 'wealth_scanner',
            type: 'Analytics',
            status: '🟢 ALIVE',
            exports: ['financial_analysis', 'market_data', 'portfolio_optimization'],
            loc: 15420,
            path: 'wealth-scanner.aeterna.website',
            revenue: 45000,
            users: 1250
        },
        {
            id: 'sector_security',
            type: 'Security', 
            status: '🟢 ALIVE',
            exports: ['vulnerability_scan', 'threat_detection', 'incident_response'],
            loc: 23850,
            path: 'sector-security.aeterna.website',
            revenue: 78000,
            users: 890
        },
        {
            id: 'network_optimizer',
            type: 'Product',
            status: '🟢 ALIVE',
            exports: ['bandwidth_optimization', 'latency_reduction', 'traffic_analysis'],
            loc: 18200,
            path: 'network-optimizer.aeterna.website',
            revenue: 52000,
            users: 1120
        },
        {
            id: 'valuation_gate',
            type: 'AI',
            status: '🟢 ALIVE',
            exports: ['asset_valuation', 'market_prediction', 'risk_analysis'],
            loc: 31250,
            path: 'valuation-gate.aeterna.website',
            revenue: 95000,
            users: 650
        },
        {
            id: 'automation_nexus',
            type: 'Automation',
            status: '🚀 LAUNCHING',
            exports: ['ai_automation', 'quantum_scanning', 'self_healing'],
            loc: 42100,
            path: 'automation-nexus.aeterna.website',
            revenue: 125000,
            users: 2100
        },
        {
            id: 'intelligence_core',
            type: 'AI',
            status: '🟢 ALIVE',
            exports: ['multi_modal_ai', 'reasoning_chains', 'custom_models'],
            loc: 28750,
            path: 'intelligence-core.aeterna.website',
            revenue: 67000,
            users: 780
        },
        {
            id: 'aeterna_core',
            type: 'Core',
            status: '🟢 ALIVE',
            exports: ['unified_auth', 'cross_app_intelligence', 'quantum_prediction'],
            loc: 55000,
            path: 'api.aeterna.website',
            revenue: 0,
            users: 6790
        },
        {
            id: 'payment_gateway',
            type: 'Core',
            status: '🟢 ALIVE',
            exports: ['stripe_integration', 'binance_tracking', 'revenue_analytics'],
            loc: 8500,
            path: 'payments.aeterna.website',
            revenue: 462000,
            users: 6790
        },
        {
            id: 'telegram_uplink',
            type: 'Core',
            status: '🟢 ALIVE',
            exports: ['mobile_commands', 'ai_chat', 'real_time_alerts'],
            loc: 4200,
            path: 'mobile.aeterna.website',
            revenue: 0,
            users: 150
        }
    ];

    useEffect(() => {
        setModules(SAAS_MODULES);
        updateStats(SAAS_MODULES);
        renderGalaxy(SAAS_MODULES);
    }, []);

    const updateStats = (moduleData: ModuleNode[]) => {
        setStats({
            totalModules: moduleData.length,
            aliveCount: moduleData.filter(m => m.status === '🟢 ALIVE').length,
            unknownCount: moduleData.filter(m => m.status === '🟡 UNKNOWN').length,
            coreCount: moduleData.filter(m => m.type === 'Core').length,
            securityCount: moduleData.filter(m => m.type === 'Security').length,
            productCount: moduleData.filter(m => m.type === 'Product').length
        });
    };

    const renderGalaxy = (moduleData: ModuleNode[]) => {
        if (!svgRef.current) return;

        const width = window.innerWidth;
        const height = window.innerHeight;

        // Clear existing content
        d3.select(svgRef.current).selectAll('*').remove();

        const svg = d3.select(svgRef.current)
            .attr('width', width)
            .attr('height', height);

        // Create links based on module relationships
        const links: NetworkLink[] = [];
        moduleData.forEach((source, i) => {
            moduleData.forEach((target, j) => {
                if (i !== j) {
                    // Connect modules of same type
                    if (source.type === target.type) {
                        links.push({ source: source.id, target: target.id, strength: 0.5 });
                    }
                    // Connect Core modules to everything
                    if (source.type === 'Core' || target.type === 'Core') {
                        links.push({ source: source.id, target: target.id, strength: 0.3 });
                    }
                    // Connect AI modules
                    if (source.type === 'AI' && target.type === 'Analytics') {
                        links.push({ source: source.id, target: target.id, strength: 0.7 });
                    }
                }
            });
        });

        // Create force simulation
        const simulation = d3.forceSimulation(moduleData as any)
            .force('link', d3.forceLink(links).id((d: any) => d.id).distance(100))
            .force('charge', d3.forceManyBody().strength(-300))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('collision', d3.forceCollide().radius(30));

        // Create gradient definitions for each module type
        const defs = svg.append('defs');
        const gradients = {
            'Core': ['#8b5cf6', '#a855f7'],
            'Security': ['#ef4444', '#f97316'], 
            'Product': ['#3b82f6', '#06b6d4'],
            'AI': ['#ec4899', '#f59e0b'],
            'Analytics': ['#10b981', '#059669'],
            'Automation': ['#f59e0b', '#ea580c']
        };

        Object.entries(gradients).forEach(([type, colors]) => {
            const gradient = defs.append('radialGradient')
                .attr('id', `gradient-${type}`)
                .attr('cx', '50%')
                .attr('cy', '50%')
                .attr('r', '50%');
            
            gradient.append('stop')
                .attr('offset', '0%')
                .attr('stop-color', colors[0])
                .attr('stop-opacity', 0.8);
            
            gradient.append('stop')
                .attr('offset', '100%')
                .attr('stop-color', colors[1])
                .attr('stop-opacity', 0.4);
        });

        // Draw links
        const link = svg.append('g')
            .selectAll('line')
            .data(links)
            .join('line')
            .attr('stroke', '#0f0')
            .attr('stroke-opacity', 0.3)
            .attr('stroke-width', 1);

        // Draw nodes
        const nodeGroup = svg.append('g')
            .selectAll('g')
            .data(moduleData)
            .join('g')
            .attr('class', 'node')
            .style('cursor', 'pointer');

        // Node circles
        nodeGroup.append('circle')
            .attr('r', (d: ModuleNode) => Math.min(10 + Math.sqrt(d.loc / 100), 25))
            .attr('fill', (d: ModuleNode) => `url(#gradient-${d.type})`)
            .attr('stroke', (d: ModuleNode) => {
                switch (d.status) {
                    case '🟢 ALIVE': return '#10b981';
                    case '🚀 LAUNCHING': return '#f59e0b';
                    case '🟡 UNKNOWN': return '#eab308';
                    default: return '#ef4444';
                }
            })
            .attr('stroke-width', 3);

        // Node labels
        nodeGroup.append('text')
            .text((d: ModuleNode) => d.id.replace(/_/g, ' '))
            .attr('text-anchor', 'middle')
            .attr('dy', '0.35em')
            .attr('font-size', '10px')
            .attr('fill', 'white')
            .attr('font-weight', 'bold');

        // Revenue indicators for SaaS apps
        nodeGroup.filter((d: ModuleNode) => d.revenue && d.revenue > 0)
            .append('text')
            .text((d: ModuleNode) => `€${(d.revenue! / 1000).toFixed(0)}K`)
            .attr('text-anchor', 'middle')
            .attr('dy', '25px')
            .attr('font-size', '8px')
            .attr('fill', '#10b981')
            .attr('font-weight', 'bold');

        // Tooltip
        const tooltip = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .style('position', 'absolute')
            .style('background', 'rgba(0, 0, 0, 0.9)')
            .style('border', '1px solid #0f0')
            .style('padding', '10px')
            .style('border-radius', '5px')
            .style('color', 'white')
            .style('pointer-events', 'none')
            .style('display', 'none')
            .style('z-index', '2000')
            .style('font-size', '11px')
            .style('max-width', '300px');

        // Node interactions
        nodeGroup
            .on('mouseover', function(event: any, d: ModuleNode) {
                tooltip.style('display', 'block')
                    .html(`
                        <strong>${d.id.replace(/_/g, ' ').toUpperCase()}</strong><br/>
                        <strong>Type:</strong> ${d.type}<br/>
                        <strong>Status:</strong> ${d.status}<br/>
                        <strong>LOC:</strong> ${d.loc.toLocaleString()}<br/>
                        ${d.revenue ? `<strong>Revenue:</strong> €${d.revenue.toLocaleString()}/mo<br/>` : ''}
                        ${d.users ? `<strong>Users:</strong> ${d.users.toLocaleString()}<br/>` : ''}
                        <strong>Exports:</strong> ${d.exports.join(', ')}<br/>
                        <small><strong>URL:</strong> ${d.path}</small>
                    `)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 10) + 'px');
                
                // Highlight connected nodes
                d3.select(this).select('circle')
                    .attr('stroke-width', 6)
                    .attr('filter', 'brightness(1.3)');
            })
            .on('mouseout', function() {
                tooltip.style('display', 'none');
                d3.select(this).select('circle')
                    .attr('stroke-width', 3)
                    .attr('filter', 'none');
            })
            .on('click', function(event: any, d: ModuleNode) {
                if (d.path.startsWith('http') || d.path.includes('aeterna.website')) {
                    window.open(`https://${d.path}`, '_blank');
                }
            });

        // Drag functionality
        const drag = d3.drag<any, ModuleNode>()
            .on('start', (event: any, d: ModuleNode) => {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            })
            .on('drag', (event: any, d: ModuleNode) => {
                d.fx = event.x;
                d.fy = event.y;
            })
            .on('end', (event: any, d: ModuleNode) => {
                if (!event.active) simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            });

        nodeGroup.call(drag);

        // Update positions on simulation tick
        simulation.on('tick', () => {
            link
                .attr('x1', (d: any) => d.source.x)
                .attr('y1', (d: any) => d.source.y)
                .attr('x2', (d: any) => d.target.x)
                .attr('y2', (d: any) => d.target.y);

            nodeGroup
                .attr('transform', (d: ModuleNode) => `translate(${d.x}, ${d.y})`);
        });

        // Cleanup
        return () => {
            tooltip.remove();
        };
    };

    // Real-time updates simulation
    useEffect(() => {
        const interval = setInterval(() => {
            setModules(prev => prev.map(module => ({
                ...module,
                // Simulate revenue growth
                revenue: module.revenue ? module.revenue + Math.floor(Math.random() * 1000) : undefined,
                // Simulate user growth
                users: module.users ? module.users + Math.floor(Math.random() * 10) : undefined
            })));
        }, 10000); // Update every 10 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full h-screen bg-black overflow-hidden">
            {/* Header */}
            <div className="absolute top-5 left-5 z-50 bg-black/80 border border-green-500 p-4 backdrop-blur">
                <h1 className="text-xl font-bold text-green-400 mb-2">🌌 AETERNA NETWORK MAP</h1>
                <p className="text-green-300 text-sm">Live SaaS Platform Visualization</p>
                <div className="text-xs text-gray-400 mt-2">
                    Click nodes to visit • Drag to reposition • Hover for details
                </div>
            </div>

            {/* Stats Panel */}
            <div className="absolute top-5 right-5 z-50 bg-black/80 border border-green-500 p-4 backdrop-blur min-w-[250px]">
                <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>Total Modules: <span className="text-green-400 font-bold">{stats.totalModules}</span></div>
                    <div>🟢 ALIVE: <span className="text-green-400 font-bold">{stats.aliveCount}</span></div>
                    <div>🟡 UNKNOWN: <span className="text-yellow-400 font-bold">{stats.unknownCount}</span></div>
                    <div>Core: <span className="text-purple-400 font-bold">{stats.coreCount}</span></div>
                    <div>Security: <span className="text-red-400 font-bold">{stats.securityCount}</span></div>
                    <div>Products: <span className="text-blue-400 font-bold">{stats.productCount}</span></div>
                </div>
                
                <div className="border-t border-gray-600 mt-3 pt-3">
                    <div className="text-xs text-green-400 font-bold">TOTAL REVENUE</div>
                    <div className="text-lg font-bold text-green-400">
                        €{modules.reduce((sum, m) => sum + (m.revenue || 0), 0).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400">/month</div>
                </div>

                <div className="border-t border-gray-600 mt-3 pt-3">
                    <div className="text-xs text-blue-400 font-bold">TOTAL USERS</div>
                    <div className="text-lg font-bold text-blue-400">
                        {modules.reduce((sum, m) => sum + (m.users || 0), 0).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400">active</div>
                </div>
            </div>

            {/* Performance Panel */}
            <div className="absolute bottom-5 left-5 z-50 bg-black/80 border border-green-500 p-4 backdrop-blur">
                <div className="text-xs text-green-400 font-bold mb-2">PLATFORM PERFORMANCE</div>
                <div className="space-y-1 text-xs">
                    <div>Uptime: <span className="text-green-400">99.97%</span></div>
                    <div>Latency: <span className="text-green-400">23ms avg</span></div>
                    <div>Throughput: <span className="text-green-400">2.4M req/min</span></div>
                    <div>Error Rate: <span className="text-green-400">0.03%</span></div>
                </div>
                
                <div className="mt-3 pt-2 border-t border-gray-600">
                    <div className="text-xs text-purple-400">🚀 QUANTUM RESONANCE: 0x4121</div>
                    <div className="text-xs text-cyan-400">🧠 AI PROCESSING: 15.6M queries/day</div>
                </div>
            </div>

            {/* Legend */}
            <div className="absolute bottom-5 right-5 z-50 bg-black/80 border border-green-500 p-4 backdrop-blur">
                <div className="text-xs text-green-400 font-bold mb-2">MODULE TYPES</div>
                <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-purple-600"></div>
                        <span>Core Systems</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-red-500 to-orange-500"></div>
                        <span>Security</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                        <span>Products</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-pink-500 to-yellow-500"></div>
                        <span>AI Systems</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-600"></div>
                        <span>Analytics</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500"></div>
                        <span>Automation</span>
                    </div>
                </div>
                
                <div className="mt-3 pt-2 border-t border-gray-600 text-xs">
                    <div>🟢 Online • 🚀 Launching • 🟡 Unknown • 🔴 Offline</div>
                </div>
            </div>

            {/* SVG Canvas */}
            <svg 
                ref={svgRef}
                className="absolute inset-0 w-full h-full"
                style={{ background: 'radial-gradient(circle at center, #0a0a0a 0%, #000 100%)' }}
            />
        </div>
    );
};

export default AntigravityDashboard;