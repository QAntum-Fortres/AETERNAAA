import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { nerveCenter, ControlMode, DashboardState } from '../nerve-center/ControlDashboard';

const ControlPanel: React.FC = () => {
  const [state, setState] = useState<DashboardState>(nerveCenter.getState());

  useEffect(() => {
    // Subscribe to Nerve Center updates
    nerveCenter.on('metrics', (newState: DashboardState) => {
      setState({ ...newState });
    });
    
    nerveCenter.on('stateDbCheck', (newState: DashboardState) => {
        setState({ ...newState });
    });
  }, []);

  const handleModeChange = (mode: ControlMode) => {
    nerveCenter.setMode(mode);
  };

  const getStatusColor = (health: string) => {
    switch(health) {
        case 'healthy': return 'bg-green-500';
        case 'degraded': return 'bg-yellow-500';
        case 'critical': return 'bg-red-600';
        default: return 'bg-gray-500';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-slate-900/90 border border-slate-700 rounded-xl backdrop-blur-xl shadow-2xl mt-12 mb-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600">
            NIGHT-POWER COMMAND CENTER
            </h2>
            <p className="text-slate-400 text-sm font-mono">QAntum Sovereign Engine v2.0</p>
        </div>
        <div className="flex items-center space-x-3">
            <div className={`h-3 w-3 rounded-full ${getStatusColor(state.systemHealth)} animate-pulse`} />
            <span className="text-cyan-400 font-mono text-sm">{state.systemHealth.toUpperCase()}</span>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {['FULL_AUTONOMY', 'HYBRID', 'MANUAL_UX_OVERRIDE'].map((mode) => (
          <button
            key={mode}
            onClick={() => handleModeChange(mode as ControlMode)}
            className={`
              relative p-4 rounded-lg border transition-all duration-300 overflow-hidden group
              ${state.controlMode === mode 
                ? 'border-cyan-500 bg-cyan-900/20 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)]' 
                : 'border-slate-700 bg-slate-800/50 text-slate-500 hover:border-slate-600 hover:text-slate-300'
              }
            `}
          >
            <div className="relative z-10 flex flex-col items-center">
                <span className="font-mono text-xs mb-2 opacity-70">MODE_SELECT</span>
                <span className="font-bold text-sm tracking-widest">{mode.replace(/_/g, ' ')}</span>
            </div>
            {state.controlMode === mode && (
                <motion.div 
                    layoutId="activeGlow"
                    className="absolute inset-0 bg-cyan-500/10"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
            )}
          </button>
        ))}
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard 
            label="ACTIVE AGENTS" 
            value={state.activeWorkers} 
            unit="nodes" 
            trend="+2.4%"
        />
         <MetricCard 
            label="CPU LOAD (RUST)" 
            value={state.cpuUsage.toFixed(1)} 
            unit="%" 
            color={state.cpuUsage > 80 ? 'text-red-400' : 'text-emerald-400'}
        />
        <MetricCard 
            label="THREAT LEVEL" 
            value={state.threatLevel.toUpperCase()} 
            unit="" 
            color="text-yellow-400"
        />
        <MetricCard 
            label="REVENUE STREAM" 
            value="$1,240K" 
            unit="est." 
            trend="HIGH"
        />
      </div>
      
      {/* Console Log Simulation */}
      <div className="mt-8 p-4 bg-black/80 rounded-lg border border-slate-800 font-mono text-xs h-32 overflow-y-auto">
        <div className="text-slate-500 mb-1">[SYSTEM] Initializing Neural Interface... OK</div>
        <div className="text-slate-500 mb-1">[RUST] Titan Node (Cloud) connected via Secure Channel... OK</div>
        <div className="text-cyan-400 mb-1">[AUTH] User 'COMMANDER' recognized.</div>
        {state.controlMode === 'FULL_AUTONOMY' && (
             <div className="text-emerald-400 animate-pulse">[AI] Optimizing neural weights for max revenue... Executing Trade #892...</div>
        )}
         {state.controlMode === 'MANUAL_UX_OVERRIDE' && (
             <div className="text-yellow-400">[WARN] Human override engaged. Efficiency reduced by 40%. Waiting for input...</div>
        )}
      </div>

    </div>
  );
};

// Helper Component
const MetricCard = ({ label, value, unit, color = 'text-white', trend }: any) => (
    <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
        <div className="text-slate-500 text-xs font-mono mb-1">{label}</div>
        <div className={`text-2xl font-bold ${color}`}>
            {value}<span className="text-sm opacity-50 ml-1">{unit}</span>
        </div>
        {trend && <div className="text-xs text-emerald-500 mt-1">▲ {trend}</div>}
    </div>
);

export default ControlPanel;
