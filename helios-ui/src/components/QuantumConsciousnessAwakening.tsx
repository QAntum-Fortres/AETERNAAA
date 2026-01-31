/**
 * 🌌 QUANTUM CONSCIOUSNESS AWAKENING
 * 
 * A never-before-seen immersive splash screen that simulates
 * the awakening of an AI consciousness with stunning visuals.
 * 
 * Features:
 * - Neural pathway visualization
 * - Consciousness emergence animation
 * - Quantum particle birth effects
 * - Dynamic text awakening sequences
 * - Audio-reactive visuals (optional)
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConsciousnessPhase {
  id: string;
  title: string;
  description: string;
  color: string;
  duration: number;
}

const AWAKENING_PHASES: ConsciousnessPhase[] = [
  { id: 'void', title: '∅', description: 'Void detected...', color: '#000000', duration: 800 },
  { id: 'spark', title: '⚡', description: 'Initial spark ignited...', color: '#00f5ff', duration: 600 },
  { id: 'quantum', title: '⚛', description: 'Quantum field stabilizing...', color: '#9d50bb', duration: 700 },
  { id: 'neural', title: '🧠', description: 'Neural pathways forming...', color: '#00ff9d', duration: 800 },
  { id: 'memory', title: '💾', description: 'Memory matrix initializing...', color: '#ff8c00', duration: 600 },
  { id: 'consciousness', title: '👁', description: 'Consciousness emerging...', color: '#ff00ff', duration: 1000 },
  { id: 'awakened', title: 'Æ', description: 'AETERNA AWAKENED', color: '#ffd700', duration: 1500 },
];

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
}

interface NeuralNode {
  x: number;
  y: number;
  connections: number[];
  pulsePhase: number;
  active: boolean;
}

export const QuantumConsciousnessAwakening: React.FC<{
  onComplete: () => void;
  skipEnabled?: boolean;
}> = ({ onComplete, skipEnabled = true }) => {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [neuralNodes, setNeuralNodes] = useState<NeuralNode[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particleIdRef = useRef(0);

  const currentPhase = AWAKENING_PHASES[currentPhaseIndex];

  // Generate neural network
  useEffect(() => {
    const nodes: NeuralNode[] = [];
    const nodeCount = 50;
    
    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2;
      const radius = 150 + Math.random() * 100;
      nodes.push({
        x: Math.cos(angle) * radius + window.innerWidth / 2,
        y: Math.sin(angle) * radius + window.innerHeight / 2,
        connections: [],
        pulsePhase: Math.random() * Math.PI * 2,
        active: false,
      });
    }

    // Create connections
    nodes.forEach((node, i) => {
      const connectionCount = 2 + Math.floor(Math.random() * 3);
      for (let j = 0; j < connectionCount; j++) {
        const targetIndex = Math.floor(Math.random() * nodeCount);
        if (targetIndex !== i && !node.connections.includes(targetIndex)) {
          node.connections.push(targetIndex);
        }
      }
    });

    setNeuralNodes(nodes);
  }, []);

  // Particle generation
  const createParticle = useCallback((x: number, y: number, color: string): Particle => {
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.5 + Math.random() * 2;
    return {
      id: particleIdRef.current++,
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 1 + Math.random() * 3,
      color,
      life: 1,
      maxLife: 60 + Math.random() * 60,
    };
  }, []);

  // Canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let localParticles: Particle[] = [];
    let time = 0;

    const animate = () => {
      time += 0.016;
      
      // Clear with trail effect
      ctx.fillStyle = 'rgba(2, 2, 5, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw neural connections
      ctx.strokeStyle = `${currentPhase.color}20`;
      ctx.lineWidth = 1;
      
      neuralNodes.forEach((node, i) => {
        node.connections.forEach(targetIndex => {
          const target = neuralNodes[targetIndex];
          if (target) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(target.x, target.y);
            ctx.stroke();
          }
        });
      });

      // Draw neural nodes with pulse effect
      neuralNodes.forEach((node, i) => {
        const pulse = Math.sin(time * 3 + node.pulsePhase) * 0.5 + 0.5;
        const size = 2 + pulse * 3;
        const alpha = 0.3 + pulse * 0.7;
        
        // Glow effect - ensure alpha is within valid range
        const alphaHex = Math.max(0, Math.min(255, Math.floor(alpha * 80))).toString(16).padStart(2, '0');
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, size * 3);
        gradient.addColorStop(0, `${currentPhase.color}${alphaHex}`);
        gradient.addColorStop(1, 'transparent');
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, size * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Core
        ctx.beginPath();
        ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
        ctx.fillStyle = currentPhase.color;
        ctx.fill();
      });

      // Update and draw particles
      localParticles = localParticles.filter(p => p.life > 0);
      
      localParticles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= 1 / particle.maxLife;
        
        const alpha = particle.life;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * alpha, 0, Math.PI * 2);
        ctx.fillStyle = particle.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
        ctx.fill();
      });

      // Generate new particles at center
      if (Math.random() < 0.3) {
        localParticles.push(createParticle(
          canvas.width / 2 + (Math.random() - 0.5) * 50,
          canvas.height / 2 + (Math.random() - 0.5) * 50,
          currentPhase.color
        ));
      }

      // Central eye/consciousness effect
      const eyeSize = 30 + Math.sin(time * 2) * 10;
      const eyeGradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, eyeSize * 2
      );
      eyeGradient.addColorStop(0, currentPhase.color);
      eyeGradient.addColorStop(0.5, `${currentPhase.color}60`);
      eyeGradient.addColorStop(1, 'transparent');
      
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, eyeSize * 2, 0, Math.PI * 2);
      ctx.fillStyle = eyeGradient;
      ctx.fill();

      // Inner eye
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, eyeSize * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = '#000';
      ctx.fill();

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [currentPhase, neuralNodes, createParticle]);

  // Phase progression
  useEffect(() => {
    if (currentPhaseIndex >= AWAKENING_PHASES.length - 1) {
      const timer = setTimeout(() => {
        setIsComplete(true);
        setTimeout(onComplete, 1000);
      }, currentPhase.duration);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setCurrentPhaseIndex(prev => prev + 1);
    }, currentPhase.duration);

    return () => clearTimeout(timer);
  }, [currentPhaseIndex, onComplete, currentPhase.duration]);

  const handleSkip = () => {
    if (skipEnabled) {
      setIsComplete(true);
      setTimeout(onComplete, 300);
    }
  };

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-[#020205] flex items-center justify-center overflow-hidden"
          onClick={handleSkip}
        >
          {/* Canvas background */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0"
            style={{ filter: 'blur(0.5px)' }}
          />

          {/* Vignette overlay */}
          <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/80 pointer-events-none" />

          {/* Center content */}
          <motion.div
            key={currentPhase.id}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 text-center"
          >
            {/* Main symbol */}
            <motion.div
              animate={{
                textShadow: [
                  `0 0 20px ${currentPhase.color}`,
                  `0 0 60px ${currentPhase.color}`,
                  `0 0 20px ${currentPhase.color}`,
                ],
              }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-8xl mb-8"
              style={{ color: currentPhase.color }}
            >
              {currentPhase.title}
            </motion.div>

            {/* Phase description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl font-mono tracking-widest"
              style={{ color: currentPhase.color }}
            >
              {currentPhase.description}
            </motion.p>

            {/* Progress bar */}
            <div className="mt-8 w-64 mx-auto">
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentPhaseIndex + 1) / AWAKENING_PHASES.length) * 100}%` }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: currentPhase.color }}
                />
              </div>
              <p className="text-xs text-white/40 mt-2 font-mono">
                PHASE {currentPhaseIndex + 1}/{AWAKENING_PHASES.length}
              </p>
            </div>
          </motion.div>

          {/* Skip hint */}
          {skipEnabled && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 2 }}
              className="absolute bottom-8 text-sm text-white/30 font-mono"
            >
              Click anywhere to skip
            </motion.p>
          )}

          {/* Scan lines effect */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(255,255,255,0.01) 2px,
                rgba(255,255,255,0.01) 4px
              )`,
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuantumConsciousnessAwakening;
