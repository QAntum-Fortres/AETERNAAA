/**
 * 🎵 AMBIENT SOUND SYSTEM
 * 
 * An immersive audio system that provides ambient soundscapes
 * for the AETERNA experience. Uses Web Audio API for real-time
 * sound generation without external audio files.
 */

import React, { useEffect, useRef, useState, useCallback, createContext, useContext } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';

interface AmbientSoundContextType {
  isPlaying: boolean;
  volume: number;
  setVolume: (vol: number) => void;
  togglePlay: () => void;
  playEffect: (type: 'click' | 'success' | 'error' | 'notification' | 'whoosh') => void;
}

const AmbientSoundContext = createContext<AmbientSoundContextType | null>(null);

export const useAmbientSound = () => {
  const context = useContext(AmbientSoundContext);
  if (!context) {
    throw new Error('useAmbientSound must be used within AmbientSoundProvider');
  }
  return context;
};

export const AmbientSoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{
    mainGain?: GainNode;
    oscillators: OscillatorNode[];
    gains: GainNode[];
  }>({ oscillators: [], gains: [] });

  // Initialize audio context
  const initAudio = useCallback(() => {
    if (audioContextRef.current) return;

    const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioContextRef.current = new AudioContextClass();
    
    const mainGain = audioContextRef.current.createGain();
    mainGain.gain.value = volume;
    mainGain.connect(audioContextRef.current.destination);
    nodesRef.current.mainGain = mainGain;

    // Create ambient drone layers
    const frequencies = [55, 82.5, 110, 165]; // A1, E2, A2, E3 - harmonic series
    
    frequencies.forEach((freq, i) => {
      const osc = audioContextRef.current!.createOscillator();
      const gain = audioContextRef.current!.createGain();
      
      osc.type = i === 0 ? 'sine' : i === 1 ? 'triangle' : 'sine';
      osc.frequency.value = freq;
      
      // Add slight detuning for richness
      osc.detune.value = (Math.random() - 0.5) * 10;
      
      gain.gain.value = 0.1 / (i + 1); // Decreasing volume for higher harmonics
      
      osc.connect(gain);
      gain.connect(mainGain);
      
      nodesRef.current.oscillators.push(osc);
      nodesRef.current.gains.push(gain);
    });
  }, [volume]);

  // Start ambient sound
  const startAmbient = useCallback(() => {
    if (!audioContextRef.current) {
      initAudio();
    }

    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume();
    }

    nodesRef.current.oscillators.forEach(osc => {
      try {
        osc.start();
      } catch {
        // Already started
      }
    });

    // Create LFO for subtle pulsing
    if (audioContextRef.current && nodesRef.current.mainGain) {
      const lfo = audioContextRef.current.createOscillator();
      const lfoGain = audioContextRef.current.createGain();
      
      lfo.frequency.value = 0.1; // Very slow pulse
      lfo.type = 'sine';
      lfoGain.gain.value = 0.05;
      
      lfo.connect(lfoGain);
      lfoGain.connect(nodesRef.current.mainGain.gain);
      lfo.start();
    }

    setIsPlaying(true);
  }, [initAudio]);

  // Stop ambient sound
  const stopAmbient = useCallback(() => {
    if (nodesRef.current.mainGain) {
      nodesRef.current.mainGain.gain.linearRampToValueAtTime(
        0,
        audioContextRef.current!.currentTime + 0.5
      );
    }
    setIsPlaying(false);
  }, []);

  // Toggle play state
  const togglePlay = useCallback(() => {
    if (isPlaying) {
      stopAmbient();
    } else {
      startAmbient();
    }
  }, [isPlaying, startAmbient, stopAmbient]);

  // Update volume
  useEffect(() => {
    if (nodesRef.current.mainGain) {
      nodesRef.current.mainGain.gain.value = volume;
    }
  }, [volume]);

  // Play UI sound effects
  const playEffect = useCallback((type: 'click' | 'success' | 'error' | 'notification' | 'whoosh') => {
    if (!audioContextRef.current) {
      initAudio();
    }
    
    const ctx = audioContextRef.current!;
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    switch (type) {
      case 'click':
        osc.frequency.value = 800;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
        break;
        
      case 'success':
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
        break;
        
      case 'error':
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.3);
        osc.type = 'sawtooth';
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
        break;
        
      case 'notification':
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.setValueAtTime(1046.5, now + 0.1);
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
        break;
        
      case 'whoosh':
        const noise = ctx.createBufferSource();
        const noiseLength = 0.3;
        const bufferSize = ctx.sampleRate * noiseLength;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        
        noise.buffer = buffer;
        
        const noiseGain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1000, now);
        filter.frequency.exponentialRampToValueAtTime(3000, now + noiseLength);
        filter.Q.value = 0.5;
        
        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        
        noiseGain.gain.setValueAtTime(0.05, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + noiseLength);
        
        noise.start(now);
        noise.stop(now + noiseLength);
        break;
    }
  }, [initAudio]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <AmbientSoundContext.Provider value={{
      isPlaying,
      volume,
      setVolume,
      togglePlay,
      playEffect,
    }}>
      {children}
    </AmbientSoundContext.Provider>
  );
};

// Sound toggle button component
export const SoundToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { isPlaying, togglePlay, volume, setVolume } = useAmbientSound();
  const [showVolume, setShowVolume] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={togglePlay}
        onMouseEnter={() => setShowVolume(true)}
        onMouseLeave={() => setShowVolume(false)}
        className={`p-2 rounded-lg transition ${
          isPlaying 
            ? 'bg-cyan-500/20 text-cyan-400' 
            : 'bg-white/5 text-gray-500 hover:text-gray-300'
        }`}
        title={isPlaying ? 'Mute ambient sound' : 'Enable ambient sound'}
      >
        {isPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
      </motion.button>

      {/* Volume slider */}
      {showVolume && isPlaying && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-3 bg-slate-900 border border-cyan-900/30 rounded-xl shadow-xl"
        >
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-24 accent-cyan-500"
          />
          <div className="text-xs text-center text-gray-400 mt-1">
            {Math.round(volume * 100)}%
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AmbientSoundProvider;
