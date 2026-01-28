import { create } from 'zustand';

export interface HiveVote {
  agent: 'REAPER' | 'GUARDIAN' | 'ORACLE';
  decision: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  reason: string;
}

interface HiveMindState {
  isOscillating: boolean;
  lastConsensus: {
    action: string;
    votes: HiveVote[];
    timestamp: number;
  } | null;
  history: Array<{ action: string; timestamp: number }>;
  
  // Actions
  processConsensus: (symbol: string, obi: number, entropy: number) => Promise<void>;
  toggleOscillation: () => void;
}

export const useHiveMind = create<HiveMindState>((set, get) => ({
  isOscillating: false,
  lastConsensus: null,
  history: [],

  toggleOscillation: () => set((state) => ({ isOscillating: !state.isOscillating })),

  processConsensus: async (symbol, obi, entropy) => {
    // 🔴 REAPER Logic
    const reaperVote: HiveVote = {
      agent: 'REAPER',
      decision: Math.abs(obi) > 0.3 ? (obi > 0 ? 'BUY' : 'SELL') : 'HOLD',
      confidence: 0.9 + Math.random() * 0.1,
      reason: Math.abs(obi) > 0.3 ? `VOLATILITY DETECTED (${obi}). BLOOD IN THE WATER.` : 'Boring market. Sleeping.'
    };

    // 🔵 GUARDIAN Logic
    const guardianVote: HiveVote = {
      agent: 'GUARDIAN',
      decision: entropy > 0.5 ? 'HOLD' : 'BUY',
      confidence: 0.95 + Math.random() * 0.05,
      reason: entropy > 0.5 ? `ENTROPY SPIKE (${entropy.toFixed(2)}). SHIELDS UP!` : 'Sector Clear. Permission to Engage.'
    };

    // 🟣 ORACLE Logic
    const oracleVote: HiveVote = {
      agent: 'ORACLE',
      decision: Math.random() > 0.7 ? 'HOLD' : 'BUY',
      confidence: 0.7 + Math.random() * 0.2,
      reason: 'Pattern matches historical vector delta #8921.'
    };

    const votes = [reaperVote, guardianVote, oracleVote];
    const buys = votes.filter(v => v.decision === 'BUY').length;
    const sells = votes.filter(v => v.decision === 'SELL').length;

    let finalAction = 'STALEMATE_HOLD';
    if (guardianVote.decision === 'HOLD' && guardianVote.confidence > 0.9) {
      finalAction = 'ABORT_RISK_HIGH';
    } else if (buys >= 2) {
      finalAction = 'EXECUTE_BUY';
    } else if (sells >= 2) {
      finalAction = 'EXECUTE_SELL';
    }

    const consensus = {
      action: finalAction,
      votes,
      timestamp: Date.now()
    };

    set((state) => ({
      lastConsensus: consensus,
      history: [ { action: finalAction, timestamp: Date.now() }, ...state.history ].slice(0, 50)
    }));
  }
}));
