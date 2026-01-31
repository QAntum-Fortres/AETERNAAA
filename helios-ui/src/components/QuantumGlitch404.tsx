/**
 * 🔮 QUANTUM GLITCH 404 PAGE
 * 
 * A visually stunning 404 error page with quantum glitch effects,
 * reality distortion animations, and an immersive "lost in the void" experience.
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, RefreshCw, AlertTriangle, Compass, Sparkles } from 'lucide-react';

const GLITCH_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`ÆΩΨ∞∂∆◊';
const VOID_MESSAGES = [
  "You've fallen between dimensions...",
  "Reality matrix corrupted at this node...",
  "Quantum coherence lost in transit...",
  "This timeline does not exist...",
  "The void has consumed this path...",
  "Entropy won here. Finding alternate route...",
];

const GlitchText: React.FC<{ text: string; intensity?: number }> = ({ 
  text, 
  intensity = 0.3 
}) => {
  const [glitchedText, setGlitchedText] = useState(text);
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < intensity) {
        const chars = text.split('');
        const glitchCount = Math.floor(Math.random() * 3) + 1;
        
        for (let i = 0; i < glitchCount; i++) {
          const pos = Math.floor(Math.random() * chars.length);
          chars[pos] = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
        }
        
        setGlitchedText(chars.join(''));
        
        // Restore original after brief moment
        setTimeout(() => setGlitchedText(text), 50 + Math.random() * 100);
      }
    }, 100);
    
    return () => clearInterval(interval);
  }, [text, intensity]);
  
  return <span>{glitchedText}</span>;
};

const VoidParticle: React.FC<{ delay: number }> = ({ delay }) => {
  const randomX = Math.random() * 100;
  const randomDuration = 3 + Math.random() * 4;
  
  return (
    <motion.div
      className="absolute w-1 h-1 bg-cyan-400 rounded-full"
      style={{ left: `${randomX}%` }}
      initial={{ opacity: 0, y: '100vh' }}
      animate={{ 
        opacity: [0, 1, 1, 0],
        y: '-100vh',
      }}
      transition={{
        duration: randomDuration,
        delay,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );
};

const ScanLine: React.FC = () => (
  <motion.div
    className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50"
    initial={{ top: '-10%' }}
    animate={{ top: '110%' }}
    transition={{
      duration: 3,
      repeat: Infinity,
      ease: 'linear',
    }}
  />
);

export const QuantumGlitch404: React.FC<{
  onNavigateHome?: () => void;
  onRetry?: () => void;
}> = ({ onNavigateHome, onRetry }) => {
  const [voidMessage, setVoidMessage] = useState(VOID_MESSAGES[0]);
  const [showPortal, setShowPortal] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Cycle through void messages
  useEffect(() => {
    const interval = setInterval(() => {
      setVoidMessage(VOID_MESSAGES[Math.floor(Math.random() * VOID_MESSAGES.length)]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Static noise canvas effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let animationId: number;

    const drawNoise = () => {
      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() * 255;
        data[i] = value * 0.1;     // R
        data[i + 1] = value * 0.5; // G (cyan tint)
        data[i + 2] = value * 0.5; // B (cyan tint)
        data[i + 3] = 8;           // Alpha (very subtle)
      }

      ctx.putImageData(imageData, 0, 0);
      animationId = requestAnimationFrame(drawNoise);
    };

    drawNoise();

    return () => cancelAnimationFrame(animationId);
  }, []);

  const handleNavigateHome = () => {
    setShowPortal(true);
    setTimeout(() => {
      if (onNavigateHome) {
        onNavigateHome();
      } else {
        window.location.href = '/';
      }
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-[#020205] overflow-hidden">
      {/* Noise overlay */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none mix-blend-screen"
      />

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <VoidParticle key={i} delay={i * 0.2} />
        ))}
      </div>

      {/* Scan lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <ScanLine />
      </div>

      {/* Grid overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 245, 255, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 245, 255, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-radial from-transparent via-transparent to-black/90" />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        {/* Glitchy 404 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative mb-8"
        >
          {/* Glitch shadows */}
          <motion.div
            className="absolute inset-0 text-9xl font-bold font-mono text-red-500 opacity-70"
            animate={{
              x: [-2, 2, -1, 1, 0],
              y: [1, -1, 2, -2, 0],
            }}
            transition={{
              duration: 0.2,
              repeat: Infinity,
              repeatDelay: 2,
            }}
          >
            404
          </motion.div>
          <motion.div
            className="absolute inset-0 text-9xl font-bold font-mono text-cyan-500 opacity-70"
            animate={{
              x: [2, -2, 1, -1, 0],
              y: [-1, 1, -2, 2, 0],
            }}
            transition={{
              duration: 0.2,
              repeat: Infinity,
              repeatDelay: 2,
              delay: 0.05,
            }}
          >
            404
          </motion.div>
          
          {/* Main text */}
          <h1 className="text-9xl font-bold font-mono text-white relative">
            <GlitchText text="404" intensity={0.2} />
          </h1>
        </motion.div>

        {/* Error icon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            <AlertTriangle className="w-16 h-16 text-yellow-500" />
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500"
        >
          <GlitchText text="REALITY BREACH DETECTED" intensity={0.15} />
        </motion.h2>

        {/* Void message */}
        <motion.p
          key={voidMessage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-xl text-gray-400 mb-8 font-mono"
        >
          {voidMessage}
        </motion.p>

        {/* Status indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex gap-4 mb-12 text-sm font-mono"
        >
          <div className="flex items-center gap-2 text-red-400">
            <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            PAGE_NOT_FOUND
          </div>
          <div className="flex items-center gap-2 text-yellow-400">
            <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
            QUANTUM_DRIFT: 42.7%
          </div>
          <div className="flex items-center gap-2 text-cyan-400">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            RECOVERY_AVAILABLE
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0, 245, 255, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNavigateHome}
            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-xl font-semibold text-white transition"
          >
            <Home className="w-5 h-5" />
            Return to Reality
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRetry || (() => window.location.reload())}
            className="flex items-center gap-2 px-8 py-4 border border-cyan-500/30 rounded-xl font-semibold text-cyan-400 hover:bg-cyan-500/10 transition"
          >
            <RefreshCw className="w-5 h-5" />
            Quantum Retry
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-8 py-4 border border-white/10 rounded-xl font-semibold text-gray-400 hover:bg-white/5 transition"
          >
            <Compass className="w-5 h-5" />
            Explore Multiverse
          </motion.button>
        </motion.div>

        {/* Coordinates */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-xs font-mono text-gray-600"
        >
          <p>COORDINATES: {window.location.pathname}</p>
          <p>DIMENSION: PRIMARY | TIMELINE: CURRENT | ENTROPY: ELEVATED</p>
        </motion.div>
      </div>

      {/* Portal effect when navigating */}
      <AnimatePresence>
        {showPortal && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 50 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Glitch line effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute left-0 right-0 h-px bg-cyan-400"
            style={{ top: `${20 + i * 20}%` }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{
              scaleX: [0, 1, 0],
              opacity: [0, 0.5, 0],
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 0.5,
              delay: i * 0.3 + Math.random() * 2,
              repeat: Infinity,
              repeatDelay: 3 + Math.random() * 5,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default QuantumGlitch404;
