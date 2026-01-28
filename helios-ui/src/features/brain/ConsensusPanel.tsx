import React from 'react';
import { useHiveMind } from './useHiveMind';
import { cn } from '../../lib/utils';
import { Shield, Target, Zap } from 'lucide-react';

export const ConsensusPanel: React.FC = () => {
    const { lastConsensus } = useHiveMind();
    
    if (!lastConsensus) return (
        <div className="h-full flex items-center justify-center text-cyan-500/30 font-mono italic">
            Waiting for Signal Oscillation...
        </div>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 h-full overflow-y-auto">
            {lastConsensus.votes.map((vote) => (
                <div 
                    key={vote.agent}
                    className={cn(
                        "p-4 rounded-xl border transition-all duration-500",
                        vote.agent === 'REAPER' && "bg-rose-500/5 border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.05)]",
                        vote.agent === 'GUARDIAN' && "bg-emerald-500/5 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]",
                        vote.agent === 'ORACLE' && "bg-indigo-500/5 border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.05)]"
                    )}
                >
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                             {vote.agent === 'REAPER' && <Zap className="w-5 h-5 text-rose-500" />}
                             {vote.agent === 'GUARDIAN' && <Shield className="w-5 h-5 text-emerald-500" />}
                             {vote.agent === 'ORACLE' && <Target className="w-5 h-5 text-indigo-500" />}
                             <span className={cn(
                                 "font-black tracking-widest text-sm",
                                 vote.agent === 'REAPER' && "text-rose-500",
                                 vote.agent === 'GUARDIAN' && "text-emerald-500",
                                 vote.agent === 'ORACLE' && "text-indigo-500"
                             )}>{vote.agent}</span>
                        </div>
                        <div className="text-[10px] uppercase font-bold text-gray-500">
                            Conf: {(vote.confidence * 100).toFixed(0)}%
                        </div>
                    </div>

                    <div className={cn(
                        "text-2xl font-black mb-2",
                        vote.decision === 'BUY' && "text-emerald-400",
                        vote.decision === 'SELL' && "text-rose-400",
                        vote.decision === 'HOLD' && "text-amber-400"
                    )}>
                        {vote.decision}
                    </div>

                    <p className="text-[10px] text-gray-400 leading-tight font-mono uppercase italic">
                        "{vote.reason}"
                    </p>
                </div>
            ))}

            <div className="col-span-full mt-2 p-3 bg-white/5 border border-white/10 rounded-lg flex justify-between items-center px-6">
                <span className="text-[10px] font-bold uppercase text-gray-500 tracking-tighter">Current Status</span>
                <span className={cn(
                    "text-lg font-black tracking-[0.2em] italic",
                    lastConsensus.action.includes('EXECUTE') ? "text-cyan-400 animate-pulse" : "text-amber-500"
                )}>
                    {lastConsensus.action}
                </span>
            </div>
        </div>
    );
};
