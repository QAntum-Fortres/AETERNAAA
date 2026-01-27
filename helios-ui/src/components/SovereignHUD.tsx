import { useState, useEffect, useRef } from 'react';
import {
    Home, MessageSquare, Terminal as TerminalIcon, GitBranch, Cpu, Zap, Shield, Atom, Dna, Globe,
    Menu, X, Search, Bell, Settings, Send, 
    Trash, Link as LinkIcon, User, Activity, ShoppingBag, DollarSign
} from 'lucide-react';
import { useSovereignStore } from '../core/socket/NativeWebSocket';
import { useSovereignAPI } from '../hooks/useSovereignAPI';
import { motion, AnimatePresence } from 'framer-motion';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { MetricsChart } from './MetricsChart';
import { NeuralMeshCanvas } from './NeuralMeshCanvas';
import { GlobalState } from '../types/sovereign';
import MoneyDashboard from './MoneyDashboard';

// --- SUBCOMPONENTS ---

const StatusBadge = ({ health }: { health: number }) => (
    <div className="flex items-center gap-2 text-xs">
        <span className={`w-2 h-2 rounded-full ${health > 90 ? 'bg-[var(--neon-green)] animate-pulse' : 'bg-[var(--neon-red)]'}`} />
        <span style={{ color: health > 90 ? 'var(--neon-green)' : 'var(--neon-red)' }}>
            {health > 90 ? 'Systems Operational' : 'Critical Warning'}
        </span>
    </div>
);

const NavItem = ({ icon: Icon, label, active, onClick, color }: { icon: any, label: string, active: boolean, onClick: () => void, color?: string }) => (
    <div
        onClick={onClick}
        className={`
            flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all relative overflow-hidden group
            ${active ? 'bg-white/5 text-white border-l-2 border-white' : 'text-gray-500 hover:text-white hover:bg-white/5'}
        `}
    >
        <Icon size={18} className={`transition-colors duration-300 ${active ? 'text-white' : 'text-gray-600 group-hover:text-gray-300'}`} style={{ color: active && color ? `var(${color})` : undefined }} />
        <span className={`font-bold text-xs uppercase tracking-widest transition-all ${active ? 'opacity-100 translate-x-1' : 'opacity-70'}`}>{label}</span>
    </div>
);

const StatCard = ({ label, value, color }: { label: string, value: string, color: string }) => (
    <div className="bg-[#0a0a12] border border-[#2a2a50] p-5 rounded-xl hover:border-[var(--neon-cyan)]/50 transition-all group relative overflow-hidden backdrop-blur-sm">
        <div className="relative z-10 flex justify-between items-end">
            <div>
                <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-bold">{label}</div>
                <div className="text-2xl font-black font-mono tracking-tighter" style={{ color }}>{value}</div>
            </div>
            <div className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:rotate-12 transition-transform`}>
                <Zap size={14} className="text-gray-700 group-hover:text-white" />
            </div>
        </div>
    </div>
);

// --- MAIN COMPONENT ---

type Page = 'dashboard' | 'chat' | 'terminal' | 'skilltree' | 'market' | 'intelligence' | 'omega' | 'physics' | 'fortress' | 'biology' | 'guardians' | 'reality' | 'chemistry' | 'money';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export const SovereignHUD = () => {
    const { metrics, isConnected } = useSovereignStore();
    const { runRefactor, generateAssets, createCheckoutSession } = useSovereignAPI();
    const [globalState, setGlobalState] = useState<GlobalState | null>(null);
    const [activePage, setActivePage] = useState<Page>('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isThinking, setIsThinking] = useState(false);

    useEffect(() => {
        const unlisten = listen('state-update', (event: any) => {
            setGlobalState(event.payload);
        });
        return () => { unlisten.then(f => f()); };
    }, []);

    const [messages, setMessages] = useState<Message[]>([
        { id: '1', role: 'assistant', content: "🧬 ВРЪЗКАТА Е УСТАНОВЕНА. QAntum Singularity е онлайн. Готов за аналитичен пробив (PROBE) или еволюционен цикъл (FEEDBACK).", timestamp: new Date() }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [terminalOutput, setTerminalOutput] = useState<string[]>([
        "QAntum Terminal v35.0 - Singular Command Interface",
        "Type 'help' for available commands",
        "System initialized successfully."
    ]);
    const [terminalInput, setTerminalInput] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);
    const terminalEndRef = useRef<HTMLDivElement>(null);

    const integrity = Math.max(0, 100 - (metrics.entropy * 100));

    useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
    useEffect(() => { terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [terminalOutput]);

    const handleSendMessage = async () => {
        if (!inputMessage.trim() || isThinking) return;
        const userMsgContent = inputMessage;
        const userMsg: Message = { id: Date.now().toString(), role: 'user', content: userMsgContent, timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setInputMessage('');
        setIsThinking(true);

        try {
            const response = await invoke<string>('process_probe', { input: userMsgContent });
            setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: response, timestamp: new Date() }]);
        } catch (err) {
            setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: `[ERROR]: Neural Link Failure: ${err}`, timestamp: new Date() }]);
        } finally {
            setIsThinking(false);
        }
    };

    const handleTerminalCommand = async (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            const commandValue = terminalInput.trim();
            if (!commandValue || isThinking) return;
            setTerminalOutput(prev => [...prev, `quantum@empire:~$ ${commandValue}`]);
            setTerminalInput('');
            setIsThinking(true);

            if (commandValue.startsWith('SCRIBE REFACTOR')) {
                setTerminalOutput(prev => [...prev, "🛠️  SCRIBE: INITIATING AUTO-REFACTORING ON 100,000 FILES...", "⏳ [VERITAS]: ANALYZING IMPACT..."]);
                try {
                    const report = await runRefactor();
                    setTerminalOutput(prev => [
                        ...prev,
                        `✅ [SCRIBE]: PURGE COMPLETE. ${report.report.actions_performed} redundant findings merged.`,
                        `💎 [EQUITY]: +€${report.report.equity_yield.toLocaleString(undefined, { minimumFractionDigits: 2 })} Technical Debt Recovered.`
                    ]);
                } catch (err) {
                    setTerminalOutput(prev => [...prev, `[ERROR]: SURGERY FAILED: ${err}`]);
                } finally {
                    setIsThinking(false);
                }
                return;
            }

            if (commandValue.startsWith('GENERATE ASSETS') || commandValue.startsWith('SCRIBE GENERATE')) {
                setTerminalOutput(prev => [...prev, "🏭 SCRIBE: TRANSMUTING LOGIC GEMS INTO ASSETS...", "⏳ [ORACLE]: CALCULATING MARKET VALUE..."]);
                try {
                    const res = await generateAssets();
                    setTerminalOutput(prev => [
                        ...prev,
                        `✨ [GENERATOR]: ASSET TRANSMUTED: ${res.asset}`,
                        `🚀 [MARKET]: Micro-SaaS deployed to /assets/sovereign_saas/${res.asset}`
                    ]);
                    setTimeout(() => setActivePage('market'), 1500);
                } catch (err) {
                    setTerminalOutput(prev => [...prev, `[ERROR]: TRANSMUTATION FAILED: ${err}`]);
                } finally {
                    setIsThinking(false);
                }
                return;
            }

            try {
                const output = await invoke<string>('process_mind_command', { input: commandValue });
                setTerminalOutput(prev => [...prev, output]);
            } catch (err) {
                setTerminalOutput(prev => [...prev, `[ERROR]: System Call Failure - ${err}`]);
            } finally {
                setIsThinking(false);
            }
        }
    };

    const handleDeploy = async (productId: string) => {
        try {
            const session = await createCheckoutSession(productId);
            if (session.checkout_url) window.location.href = session.checkout_url;
        } catch (err) {
            console.error("Checkout Failed:", err);
        }
    };

    return (
        <div className="flex h-screen w-full overflow-hidden bg-[var(--quantum-void)] text-gray-200 font-[var(--font-body)]">
            <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-[280px] bg-[#0a0a12]/95 backdrop-blur border-r border-[#2a2a50] transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <div className="p-6 border-b border-[#2a2a50]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--neon-cyan)] to-[var(--neon-purple)] flex items-center justify-center text-xl shadow-[0_0_20px_rgba(0,245,255,0.3)] animate-pulse">🧠</div>
                        <div>
                            <div className="font-[var(--font-display)] font-bold text-white tracking-widest">QAntum</div>
                            <div className="text-[10px] text-[var(--neon-cyan)] uppercase tracking-tighter">Singular Core</div>
                        </div>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
                    <div className="space-y-1">
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest px-3 mb-2 opacity-50">Main Module</div>
                        <NavItem icon={Home} label="Dashboard" active={activePage === 'dashboard'} onClick={() => setActivePage('dashboard')} />
                        <NavItem icon={MessageSquare} label="Chat AI" active={activePage === 'chat'} onClick={() => setActivePage('chat')} />
                        <NavItem icon={TerminalIcon} label="Terminal" active={activePage === 'terminal'} onClick={() => setActivePage('terminal')} />
                        <NavItem icon={ShoppingBag} label="Market" active={activePage === 'market'} onClick={() => setActivePage('market')} color="--neon-gold" />
                        <NavItem icon={DollarSign} label="Money" active={activePage === 'money'} onClick={() => setActivePage('money')} color="--neon-green" />
                        <NavItem icon={GitBranch} label="Skill Tree" active={activePage === 'skilltree'} onClick={() => setActivePage('skilltree')} />
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest px-3 mb-2 opacity-50">Departments</div>
                        <NavItem icon={Cpu} label="Intelligence" active={activePage === 'intelligence'} onClick={() => setActivePage('intelligence')} color="--dept-intelligence" />
                        <NavItem icon={Zap} label="Omega" active={activePage === 'omega'} onClick={() => setActivePage('omega')} color="--dept-omega" />
                        <NavItem icon={Atom} label="Physics" active={activePage === 'physics'} onClick={() => setActivePage('physics')} color="--dept-physics" />
                        <NavItem icon={Shield} label="Fortress" active={activePage === 'fortress'} onClick={() => setActivePage('fortress')} color="--dept-fortress" />
                        <NavItem icon={Dna} label="Biology" active={activePage === 'biology'} onClick={() => setActivePage('biology')} color="--dept-biology" />
                        <NavItem icon={Globe} label="Reality" active={activePage === 'reality'} onClick={() => setActivePage('reality')} color="--dept-reality" />
                        <NavItem icon={LinkIcon} label="Chemistry" active={activePage === 'chemistry'} onClick={() => setActivePage('chemistry')} color="--dept-chemistry" />
                    </div>
                </div>
                <div className="p-4 border-t border-[#2a2a50]">
                    <StatusBadge health={integrity} />
                </div>
            </aside>

            <main className="flex-1 flex flex-col relative overflow-hidden bg-transparent">
                <header className="h-[70px] bg-[#0a0a12]/40 backdrop-blur-md border-b border-[#2a2a50]/50 flex items-center justify-between px-8 relative z-30">
                    <div className="flex items-center gap-4">
                        <button title="Toggle Sidebar" onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden text-gray-400 hover:text-white transition-colors">
                            {sidebarOpen ? <X /> : <Menu />}
                        </button>
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input title="Search Modules" type="text" placeholder="Search modules... (Ctrl+K)" className="bg-[var(--quantum-void)] border border-[#2a2a50] rounded-md py-1.5 pl-10 pr-4 text-sm w-64 focus:border-[var(--neon-cyan)] outline-none transition-all placeholder:opacity-30" />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0a0a12] border border-[#2a2a50] rounded-full shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
                            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                            <span className="text-[10px] font-mono font-bold tracking-widest text-gray-400">{isConnected ? 'ONLINE' : 'OFFLINE'}</span>
                        </div>
                        <button title="Notifications" className="text-gray-400 hover:text-white transition-colors relative">
                            <Bell size={18} />
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-[var(--neon-purple)] rounded-full animate-ping" />
                        </button>
                        <button title="Settings" className="text-gray-400 hover:text-white transition-colors"><Settings size={18} /></button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8 scrollbar-hide bg-[linear-gradient(to_bottom,transparent,#020205)]">
                    <AnimatePresence mode="wait">
                        {activePage === 'dashboard' && (
                            <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                                <div className="grid grid-cols-12 gap-8">
                                    <div className="col-span-12 lg:col-span-8 p-8 rounded-2xl bg-[#0a0a12] border border-[#2a2a50] relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon-cyan)]/5 to-[var(--neon-purple)]/5 pointer-events-none" />
                                        <div className="relative z-10">
                                            <h2 className="text-5xl font-[var(--font-display)] font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500 tracking-tighter uppercase italic">
                                                ${globalState ? globalState.liquid_equity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '2,104,500,000.00'}
                                            </h2>
                                            <p className="text-[10px] tracking-[1em] text-[var(--neon-purple)] font-bold opacity-70 mb-8">SOVEREIGN LIQUID EQUITY</p>
                                            <div className="flex gap-4">
                                                <button onClick={() => setActivePage('chat')} className="px-6 py-3 bg-[var(--neon-cyan)] text-black font-black rounded-lg hover:brightness-125 transition-all flex items-center gap-2 uppercase text-xs tracking-widest transform hover:scale-105"><MessageSquare size={16} /> Neural Link</button>
                                                <button onClick={() => setActivePage('terminal')} className="px-6 py-3 bg-[#1a1a3a] border border-[#2a2a50] text-white font-bold rounded-lg hover:border-[var(--neon-cyan)] transition-all flex items-center gap-2 uppercase text-xs tracking-widest transform hover:scale-105"><TerminalIcon size={16} /> Direct Access</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-12 lg:col-span-4 rounded-2xl bg-[#0a0a12] border border-[#2a2a50] overflow-hidden group relative">
                                        <NeuralMeshCanvas />
                                    </div>
                                </div>
                                <div className="grid grid-cols-12 gap-6">
                                    <div className="col-span-12 md:col-span-8 p-6 rounded-xl bg-[#0a0a12] border border-[#2a2a50]">
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="text-xs font-bold text-cyan-500 tracking-widest uppercase flex items-center gap-2"> <Activity size={14} /> Entropy Pulse</h3>
                                            <div className="text-[10px] text-gray-600 font-mono">SAMPLING: {globalState ? (Number(globalState.total_nodes) / 1e9).toFixed(1) : "2.1"}B NODES</div>
                                        </div>
                                        <div className="h-64"><MetricsChart /></div>
                                    </div>
                                    <div className="col-span-12 md:col-span-4 space-y-6">
                                        <StatCard label="Vectors Ingested" value={globalState ? `${(Number(globalState.total_nodes) / 1e9).toFixed(1)}B` : "2.1B"} color="var(--neon-cyan)" />
                                        <StatCard label="Logical Entropy" value={globalState ? globalState.entropy.toFixed(4) : (metrics.entropy * 10).toFixed(4)} color="var(--neon-red)" />
                                        <StatCard label="Axiom Compliance" value="1001/1001" color="var(--neon-green)" />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activePage === 'chat' && (
                            <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-[calc(100vh-140px)] gap-4">
                                <div className="flex-1 bg-[#0a0a12]/50 backdrop-blur border border-[#2a2a50] rounded-2xl flex flex-col overflow-hidden shadow-2xl">
                                    <div className="p-4 border-b border-[#2a2a50] flex justify-between items-center bg-[#1a1a3a]/20">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--neon-cyan)] to-[var(--neon-purple)] flex items-center justify-center shadow-[0_0_15px_rgba(0,245,255,0.4)]">🧠</div>
                                            <div>
                                                <h3 className="font-bold text-sm tracking-wide">SOVEREIGN_BRAIN_LINK</h3>
                                                <div className="text-[10px] text-[var(--neon-green)] flex items-center gap-1 font-bold uppercase"><span className="w-1.5 h-1.5 bg-[var(--neon-green)] rounded-full animate-pulse"></span> Synchronized</div>
                                            </div>
                                        </div>
                                        <button title="Clear Log" className="p-2 hover:bg-white/10 rounded-lg transition-colors"><Trash size={16} className="text-gray-500" /></button>
                                    </div>
                                    <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                                        {messages.map((msg) => (
                                            <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                                <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center transform hover:rotate-12 transition-transform ${msg.role === 'assistant' ? 'bg-gradient-to-br from-[var(--neon-cyan)]/20 to-[var(--neon-purple)]/20 border border-[var(--neon-cyan)]/30' : 'bg-[#2a2a50] border border-gray-700'}`}>
                                                    {msg.role === 'assistant' ? '🧠' : <User size={20} className="text-gray-400" />}
                                                </div>
                                                <div className={`p-4 rounded-2xl max-w-[75%] text-sm leading-relaxed tracking-tight ${msg.role === 'assistant' ? 'bg-[#1a1a3a]/40 border border-[#2a2a50] text-cyan-50 shadow-lg' : 'bg-cyan-600 text-white font-medium shadow-[0_5px_15px_rgba(0,0,0,0.3)]'}`}>
                                                    {msg.content}
                                                </div>
                                            </div>
                                        ))}
                                        {isThinking && <div className="flex gap-4"><div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--neon-cyan)] to-[var(--neon-purple)] animate-pulse flex items-center justify-center">🧠</div><div className="p-4 rounded-2xl bg-[#1a1a3a]/40 border border-[#2a2a50] text-cyan-200 text-sm italic">Thinking...</div></div>}
                                        <div ref={chatEndRef} />
                                    </div>
                                    <div className="p-6 border-t border-[#2a2a50] bg-[#020205]/80 backdrop-blur-xl">
                                        <div className="flex gap-3">
                                            <input title="Neural Prompt" type="text" disabled={isThinking} value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Pulsing Command..." className="flex-1 bg-black/50 border border-[#2a2a50] rounded-xl py-4 px-5 focus:border-[var(--neon-cyan)] outline-none text-white transition-all text-sm" />
                                            <button title="Send" onClick={handleSendMessage} disabled={isThinking} className="p-4 bg-[var(--neon-cyan)] text-black rounded-xl active:scale-95 shadow-[0_0_20px_rgba(0,245,255,0.3)]"><Send size={20} /></button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activePage === 'terminal' && (
                            <motion.div key="terminal" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="h-[calc(100vh-140px)]">
                                <div className="h-full bg-black border border-[#1a1a3a] rounded-xl flex flex-col font-mono text-sm overflow-hidden border-t-4 border-t-cyan-900 shadow-2xl">
                                    <div className="bg-[#0a0a12] p-2 flex items-center justify-between border-b border-[#1a1a3a]">
                                        <div className="flex gap-1.5 ml-2"><div className="w-3 h-3 rounded-full bg-[#ff5f56]/50"></div><div className="w-3 h-3 rounded-full bg-[#ffbd2e]/50"></div><div className="w-3 h-3 rounded-full bg-[#27c93f]/50"></div></div>
                                        <div className="text-gray-600 text-[10px] font-bold uppercase">quantum@empire: /vsh/core</div>
                                        <div className="w-2 h-2 rounded-full bg-cyan-900 animate-pulse mr-2" />
                                    </div>
                                    <div className="flex-1 p-6 overflow-y-auto space-y-2 text-cyan-500/80 scrollbar-hide">
                                        {terminalOutput.map((line, i) => <div key={i} className={`break-all ${line.startsWith('>') ? 'text-white font-bold' : ''}`}>{line}</div>)}
                                        <div ref={terminalEndRef} />
                                    </div>
                                    <div className="p-4 border-t border-[#1a1a3a] bg-[#05050a] flex gap-3 items-center">
                                        <span className="text-[var(--neon-cyan)] font-black">λ</span>
                                        <input title="Terminal Input" type="text" autoFocus disabled={isThinking} value={terminalInput} onChange={(e) => setTerminalInput(e.target.value)} onKeyDown={handleTerminalCommand} className="flex-1 bg-transparent border-none outline-none text-white tracking-widest" placeholder="Enter system instruction..." />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activePage === 'market' && (
                            <motion.div key="market" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="h-full flex flex-col gap-6">
                                <div className="flex justify-between items-center">
                                    <div><h2 className="text-3xl font-[var(--font-display)] font-black text-white italic tracking-tighter uppercase">Sovereign Market</h2><p className="text-[10px] text-[var(--neon-gold)] tracking-widest mt-1 uppercase">Generated Assets</p></div>
                                    <div className="px-4 py-2 bg-[#0a0a12] border border-[#2a2a50] rounded-lg flex items-center gap-2"><span className="text-xs text-gray-500 font-bold uppercase">Estimated MRR:</span><span className="text-lg font-bold text-[var(--neon-green)]">€10,420.00</span></div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="p-6 bg-[#0a0a12] border border-[#2a2a50] rounded-xl hover:border-[var(--neon-gold)] transition-all group">
                                        <div className="flex justify-between items-start mb-4"><div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center border border-gray-800"><Cpu className="text-gray-500 group-hover:text-[var(--neon-gold)]" /></div><div className="px-2 py-1 bg-green-900/20 border border-green-900/50 rounded text-[10px] text-green-400 font-bold">READY</div></div>
                                        <h3 className="text-lg font-bold text-white mb-2">Omni-Scraper V1</h3>
                                        <div className="flex justify-between items-center pt-4 border-t border-[#2a2a50]">
                                            <span className="text-xl font-bold text-white">€49.99</span>
                                            <button onClick={() => handleDeploy('Omni-Scraper V1')} className="px-4 py-2 bg-white text-black text-xs font-bold rounded hover:bg-[var(--neon-gold)] transition-colors uppercase">Deploy</button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activePage === 'money' && (
                            <motion.div key="money" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="h-full overflow-auto">
                                <MoneyDashboard />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};
