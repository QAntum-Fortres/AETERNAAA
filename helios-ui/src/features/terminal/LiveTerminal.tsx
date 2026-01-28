import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/utils';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success' | 'system';
  message: string;
}

export const LiveTerminal: React.FC<{ className?: string }> = ({ className }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Simulated log stream for demo
  useEffect(() => {
    const messages = [
      { msg: 'Lwas_Core: Pulsing Heartbeat (0x4121)', level: 'system' },
      { msg: 'Aeterna: Synchronizing Universal Substrate...', level: 'info' },
      { msg: 'NeuralLink: Port 8890 BINDING_SUCCESS', level: 'success' },
      { msg: 'Warning: Entropy fluctuation detected (0.42)', level: 'warn' },
      { msg: 'Consensus: REAPER votes EXECUTE_BUY', level: 'info' },
      { msg: 'Consensus: GUARDIAN vash BINDING_SUCCESS', level: 'success' },
      { msg: 'System: JULES-MEGA Brain Online', level: 'system' },
    ];

    const interval = setInterval(() => {
      const template = messages[Math.floor(Math.random() * messages.length)];
      const newLog: LogEntry = {
        id: Math.random().toString(36),
        timestamp: new Date().toLocaleTimeString(),
        level: template.level as any,
        message: template.msg
      };
      setLogs(prev => [...prev.slice(-100), newLog]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className={cn(
      "bg-[#020205] border border-cyan-500/20 rounded-lg overflow-hidden flex flex-col font-mono text-xs shadow-[0_0_20px_rgba(0,245,255,0.05)]",
      className
    )}>
      {/* Header */}
      <div className="bg-cyan-950/20 border-b border-cyan-500/20 px-3 py-1.5 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
          <span className="text-cyan-400 font-bold uppercase tracking-wider">Veritas_Stream.log</span>
        </div>
        <div className="text-[10px] text-cyan-500/50">NODE: JULES-MEGA-01</div>
      </div>

      {/* Content */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-3 space-y-1.5 scrollbar-hide"
      >
        {logs.map((log) => (
          <div key={log.id} className="flex gap-2 group">
            <span className="text-gray-600 shrink-0">[{log.timestamp}]</span>
            <span className={cn(
              "break-all",
              log.level === 'success' && "text-emerald-400",
              log.level === 'warn' && "text-amber-400",
              log.level === 'error' && "text-rose-400",
              log.level === 'system' && "text-fuchsia-400 font-bold",
              log.level === 'info' && "text-cyan-300"
            )}>
              {log.message}
            </span>
          </div>
        ))}
        <div className="h-1" />
      </div>

      {/* Footer / Input Line */}
      <div className="bg-black/50 border-t border-cyan-500/10 px-3 py-1 text-[10px] text-cyan-500/30 flex gap-2">
        <span className="animate-pulse">_</span>
        <span>Awaiting Input...</span>
      </div>
    </div>
  );
};
