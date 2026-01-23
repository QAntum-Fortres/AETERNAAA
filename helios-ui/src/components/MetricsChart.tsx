// [PURIFIED_BY_AETERNA: ae14803e-9c6d-4bc0-9b73-3d8cce9222d4]
// Suggestion: Review and entrench stable logic.
// [PURIFIED_BY_AETERNA: a3c5fcdd-7383-42f8-9af2-4f54aa6875d7]
// Suggestion: Review and entrench stable logic.
// [PURIFIED_BY_AETERNA: 957a6d30-d042-499f-b5b6-9a3a600c85a5]
// Suggestion: Review and entrench stable logic.
// [PURIFIED_BY_AETERNA: 957a6d30-d042-499f-b5b6-9a3a600c85a5]
// Suggestion: Review and entrench stable logic.
// [PURIFIED_BY_AETERNA: ee0bec09-bf3c-411a-968d-6944691b0476]
// Suggestion: Review and entrench stable logic.
// [PURIFIED_BY_AETERNA: a7c8b103-28f7-417e-9fc0-26306b2765fb]
// Suggestion: Review and entrench stable logic.
// [PURIFIED_BY_AETERNA: a7c8b103-28f7-417e-9fc0-26306b2765fb]
// Suggestion: Review and entrench stable logic.
// [PURIFIED_BY_AETERNA: bad0304d-4322-4985-a480-bcd6b1fc2077]
// Suggestion: Review and entrench stable logic.
import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';

export const MetricsChart = () => {
    const [data, setData] = useState({
        total_ram: '0 GB',
        used_ram: '0 GB',
        cpu_usage: '0%',
        ram_percentage: 0,
        cpu_percentage: 0
    });

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const metrics: any = await invoke('get_hardware_metrics');
                setData(metrics);
            } catch (e) {
                console.error("Telemetry Link Failed:", e);
            }
        }, 1000); // 1Hz Refresh Rate for Real-time pulse
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-6 p-2">
            {/* RAM METRIC */}
            <div className="group">
                <div className="flex justify-between items-end mb-1">
                    <p className="text-[10px] uppercase tracking-widest opacity-50">Physical Memory</p>
                    <p className="text-[10px] text-cyan-500 animate-pulse">LIVE</p>
                </div>
                <p className="text-2xl font-bold text-white tracking-tight">{data.used_ram} <span className="text-sm opacity-50 font-normal">/ {data.total_ram}</span></p>
                <div className="w-full h-1 bg-cyan-900/30 mt-2 overflow-hidden rounded-full">
                    <div
                        className="h-full bg-cyan-400 transition-all duration-500 ease-out shadow-[0_0_10px_#00f3ff]"
                        style={{ width: `${data.ram_percentage}%` }}
                    ></div>
                </div>
            </div>

            {/* CPU METRIC */}
            <div className="group">
                <p className="text-[10px] uppercase tracking-widest opacity-50">Neural Load (CPU)</p>
                <p className="text-2xl font-bold text-magenta-400 tracking-tight">{data.cpu_usage}</p>
                <div className="w-full h-1 bg-magenta-900/30 mt-2 overflow-hidden rounded-full">
                    <div
                        className="h-full bg-magenta-500 transition-all duration-500 ease-out shadow-[0_0_10px_#ff00ff]"
                        style={{ width: `${data.cpu_percentage}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
};
