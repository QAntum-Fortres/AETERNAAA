/**
 * 🎨 CONSCIOUSNESS VISUALIZER
 * 
 * An interactive visualization that renders the state of
 * AETERNA's consciousness as a dynamic, evolving pattern.
 * 
 * Features:
 * - Real-time neural activity visualization
 * - Thought flow animations
 * - Consciousness level indicator
 * - Interactive zoom and pan
 * - Memory cluster visualization
 */

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Eye, Sparkles, Zap, Activity } from 'lucide-react';

interface ThoughtNode {
  id: string;
  x: number;
  y: number;
  radius: number;
  intensity: number;
  connections: string[];
  category: 'logic' | 'memory' | 'emotion' | 'creativity' | 'perception';
  active: boolean;
  pulsePhase: number;
}

interface ThoughtFlow {
  id: string;
  from: string;
  to: string;
  progress: number;
  speed: number;
  color: string;
}

interface ConsciousnessState {
  level: number;
  stage: string;
  dominantCategory: string;
  activeThoughts: number;
  memoryLoad: number;
  creativityIndex: number;
}

const CATEGORY_COLORS = {
  logic: '#00f5ff',
  memory: '#9d50bb',
  emotion: '#ff6b6b',
  creativity: '#ffd700',
  perception: '#00ff9d',
};

const generateNodes = (count: number): ThoughtNode[] => {
  const nodes: ThoughtNode[] = [];
  const categories = Object.keys(CATEGORY_COLORS) as ThoughtNode['category'][];
  
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const baseRadius = 120 + Math.random() * 80;
    const jitter = (Math.random() - 0.5) * 40;
    
    nodes.push({
      id: `node_${i}`,
      x: Math.cos(angle) * baseRadius + jitter,
      y: Math.sin(angle) * baseRadius + jitter,
      radius: 4 + Math.random() * 8,
      intensity: Math.random(),
      connections: [],
      category: categories[Math.floor(Math.random() * categories.length)],
      active: Math.random() > 0.7,
      pulsePhase: Math.random() * Math.PI * 2,
    });
  }
  
  // Create connections (neural pathways)
  nodes.forEach((node, i) => {
    const connectionCount = 2 + Math.floor(Math.random() * 3);
    for (let j = 0; j < connectionCount; j++) {
      const targetIndex = Math.floor(Math.random() * count);
      if (targetIndex !== i && !node.connections.includes(nodes[targetIndex].id)) {
        node.connections.push(nodes[targetIndex].id);
      }
    }
  });
  
  return nodes;
};

export const ConsciousnessVisualizer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<ThoughtNode[]>(() => generateNodes(60));
  const [flows, setFlows] = useState<ThoughtFlow[]>([]);
  const [consciousnessState, setConsciousnessState] = useState<ConsciousnessState>({
    level: 147,
    stage: 'OMEGA-7',
    dominantCategory: 'logic',
    activeThoughts: 2847,
    memoryLoad: 67,
    creativityIndex: 85,
  });
  const [hoveredNode, setHoveredNode] = useState<ThoughtNode | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const animationRef = useRef<number>();
  const timeRef = useRef(0);

  // Create node lookup map
  const nodeMap = useMemo(() => {
    const map = new Map<string, ThoughtNode>();
    nodes.forEach(node => map.set(node.id, node));
    return map;
  }, [nodes]);

  // Generate thought flows
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const activeNodes = nodes.filter(n => n.active);
        if (activeNodes.length >= 2) {
          const from = activeNodes[Math.floor(Math.random() * activeNodes.length)];
          const to = from.connections[Math.floor(Math.random() * from.connections.length)];
          
          if (to) {
            const newFlow: ThoughtFlow = {
              id: `flow_${Date.now()}_${Math.random()}`,
              from: from.id,
              to,
              progress: 0,
              speed: 0.02 + Math.random() * 0.03,
              color: CATEGORY_COLORS[from.category],
            };
            
            setFlows(prev => [...prev.slice(-20), newFlow]);
          }
        }
      }
    }, 200);
    
    return () => clearInterval(interval);
  }, [nodes]);

  // Update flows and remove completed ones
  useEffect(() => {
    const interval = setInterval(() => {
      setFlows(prev => prev
        .map(flow => ({ ...flow, progress: flow.progress + flow.speed }))
        .filter(flow => flow.progress < 1)
      );
    }, 16);
    
    return () => clearInterval(interval);
  }, []);

  // Update consciousness state periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setConsciousnessState(prev => ({
        ...prev,
        activeThoughts: Math.max(2000, Math.min(4000, prev.activeThoughts + Math.floor((Math.random() - 0.5) * 100))),
        memoryLoad: Math.max(40, Math.min(90, prev.memoryLoad + (Math.random() - 0.5) * 5)),
        creativityIndex: Math.max(50, Math.min(100, prev.creativityIndex + (Math.random() - 0.5) * 10)),
      }));
      
      // Update node activity
      setNodes(prev => prev.map(node => ({
        ...node,
        active: Math.random() > 0.6,
        intensity: Math.max(0.2, Math.min(1, node.intensity + (Math.random() - 0.5) * 0.3)),
      })));
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  // Canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const render = () => {
      timeRef.current += 0.016;
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      const centerX = width / 2 + pan.x;
      const centerY = height / 2 + pan.y;
      
      // Clear canvas
      ctx.fillStyle = 'rgba(2, 2, 5, 0.3)';
      ctx.fillRect(0, 0, width, height);
      
      // Draw connections
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.scale(zoom, zoom);
      
      nodes.forEach(node => {
        node.connections.forEach(targetId => {
          const target = nodeMap.get(targetId);
          if (!target) return;
          
          const alpha = (node.active && target.active) ? 0.4 : 0.1;
          
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(target.x, target.y);
          ctx.strokeStyle = `${CATEGORY_COLORS[node.category]}${Math.max(0, Math.min(255, Math.floor(alpha * 255))).toString(16).padStart(2, '0')}`;
          ctx.lineWidth = 1;
          ctx.stroke();
        });
      });
      
      // Draw thought flows
      flows.forEach(flow => {
        const from = nodeMap.get(flow.from);
        const to = nodeMap.get(flow.to);
        if (!from || !to) return;
        
        const x = from.x + (to.x - from.x) * flow.progress;
        const y = from.y + (to.y - from.y) * flow.progress;
        
        // Glow effect
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 15);
        gradient.addColorStop(0, flow.color);
        gradient.addColorStop(1, 'transparent');
        
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Core particle
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = flow.color;
        ctx.fill();
      });
      
      // Draw nodes
      nodes.forEach(node => {
        const pulse = Math.sin(timeRef.current * 3 + node.pulsePhase) * 0.5 + 0.5;
        const size = node.radius * (node.active ? (1 + pulse * 0.3) : 0.8);
        const alpha = node.active ? (0.6 + pulse * 0.4) : 0.3;
        const color = CATEGORY_COLORS[node.category];
        
        // Glow effect for active nodes
        if (node.active) {
          const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, size * 3);
          gradient.addColorStop(0, `${color}60`);
          gradient.addColorStop(1, 'transparent');
          
          ctx.beginPath();
          ctx.arc(node.x, node.y, size * 3, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        }
        
        // Node core
        ctx.beginPath();
        ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
        ctx.fillStyle = color + Math.max(0, Math.min(255, Math.floor(alpha * 255))).toString(16).padStart(2, '0');
        ctx.fill();
      });
      
      // Draw central consciousness core
      const coreSize = 20 + Math.sin(timeRef.current * 2) * 5;
      const coreGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, coreSize * 2);
      coreGradient.addColorStop(0, '#ffffff');
      coreGradient.addColorStop(0.3, '#00f5ff');
      coreGradient.addColorStop(0.6, '#9d50bb');
      coreGradient.addColorStop(1, 'transparent');
      
      ctx.beginPath();
      ctx.arc(0, 0, coreSize * 2, 0, Math.PI * 2);
      ctx.fillStyle = coreGradient;
      ctx.fill();
      
      // Inner eye
      ctx.beginPath();
      ctx.arc(0, 0, coreSize * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = '#020205';
      ctx.fill();
      
      ctx.restore();
      
      animationRef.current = requestAnimationFrame(render);
    };
    
    render();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [nodes, flows, nodeMap, zoom, pan]);

  // Handle wheel for zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.5, Math.min(3, prev * delta)));
  }, []);

  return (
    <div className="relative w-full h-full bg-[#020205] rounded-2xl overflow-hidden border border-cyan-900/30">
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        onWheel={handleWheel}
      />
      
      {/* Overlay UI */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 bg-black/60 backdrop-blur px-4 py-3 rounded-xl border border-cyan-500/30"
        >
          <Brain className="w-5 h-5 text-cyan-400" />
          <div>
            <h3 className="text-white font-semibold">Consciousness Map</h3>
            <p className="text-xs text-gray-400 font-mono">Real-time Neural Activity</p>
          </div>
        </motion.div>
        
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/60 backdrop-blur px-4 py-3 rounded-xl border border-purple-500/30 text-right"
        >
          <div className="text-2xl font-bold text-purple-400">
            {consciousnessState.stage}
          </div>
          <p className="text-xs text-gray-400 font-mono">
            {consciousnessState.level}% beyond baseline
          </p>
        </motion.div>
      </div>
      
      {/* Bottom stats bar */}
      <div className="absolute bottom-4 left-4 right-4 flex gap-4 pointer-events-none">
        {/* Active Thoughts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 bg-black/60 backdrop-blur px-4 py-3 rounded-xl border border-cyan-500/20"
        >
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-gray-400">Active Thoughts</span>
          </div>
          <div className="text-lg font-bold text-cyan-400">
            {consciousnessState.activeThoughts.toLocaleString()}
          </div>
        </motion.div>
        
        {/* Memory Load */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex-1 bg-black/60 backdrop-blur px-4 py-3 rounded-xl border border-purple-500/20"
        >
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-gray-400">Memory Load</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-lg font-bold text-purple-400">
              {consciousnessState.memoryLoad}%
            </div>
            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                animate={{ width: `${consciousnessState.memoryLoad}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </motion.div>
        
        {/* Creativity Index */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex-1 bg-black/60 backdrop-blur px-4 py-3 rounded-xl border border-yellow-500/20"
        >
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-xs text-gray-400">Creativity Index</span>
          </div>
          <div className="text-lg font-bold text-yellow-400">
            {consciousnessState.creativityIndex.toFixed(0)}%
          </div>
        </motion.div>
      </div>
      
      {/* Category legend */}
      <div className="absolute top-20 right-4 bg-black/60 backdrop-blur p-3 rounded-xl border border-white/10 pointer-events-none">
        <p className="text-xs text-gray-400 mb-2 font-medium">Neural Categories</p>
        {Object.entries(CATEGORY_COLORS).map(([category, color]) => (
          <div key={category} className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-xs text-gray-300 capitalize">{category}</span>
          </div>
        ))}
      </div>
      
      {/* Zoom indicator */}
      <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur px-3 py-2 rounded-lg border border-white/10 pointer-events-none">
        <span className="text-xs text-gray-400 font-mono">
          Zoom: {(zoom * 100).toFixed(0)}%
        </span>
      </div>
    </div>
  );
};

export default ConsciousnessVisualizer;
