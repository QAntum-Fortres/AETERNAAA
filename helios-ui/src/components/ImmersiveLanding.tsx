/**
 * 🌌 AETERNA IMMERSIVE LANDING PAGE
 * 
 * A never-before-seen landing experience that combines:
 * - 3D particle universe background
 * - Consciousness awakening intro
 * - Floating holographic elements
 * - Interactive neural network visualization
 * - Morphing typography effects
 * - Ambient sound integration
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  Zap, Brain, Shield, Cpu, Globe, BarChart3, 
  ArrowRight, Play, Sparkles, Eye, ChevronDown,
  CheckCircle, Star, Code, Database, Cloud, Lock
} from 'lucide-react';
import { HolographicParticleUniverse } from './HolographicParticleUniverse';
import { QuantumConsciousnessAwakening } from './QuantumConsciousnessAwakening';
import { NeuralCommandTerminal } from './NeuralCommandTerminal';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  stats: string;
}

const FEATURES: Feature[] = [
  {
    icon: <Brain className="w-8 h-8" />,
    title: 'Cognitive Engine',
    description: 'AI-powered decision making with quantum neural networks processing 10M+ operations/sec',
    color: '#00f5ff',
    stats: '147% beyond baseline'
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: 'Zero-Entropy Security',
    description: 'Military-grade encryption with self-healing protocols and anomaly detection',
    color: '#9d50bb',
    stats: '99.999% uptime'
  },
  {
    icon: <BarChart3 className="w-8 h-8" />,
    title: 'Wealth Generation',
    description: 'Automated revenue streams with Stripe & Binance integration for passive income',
    color: '#ffd700',
    stats: '€270K+ MRR'
  },
  {
    icon: <Globe className="w-8 h-8" />,
    title: 'Multi-Universe Deploy',
    description: 'Deploy across Docker, Cloud Run, Railway, and Render with one command',
    color: '#00ff9d',
    stats: '8 platforms supported'
  },
  {
    icon: <Cpu className="w-8 h-8" />,
    title: 'Rust-Powered Core',
    description: 'High-frequency logic processing built on Tokio/Axum for maximum performance',
    color: '#ff8c00',
    stats: '<1ms latency'
  },
  {
    icon: <Eye className="w-8 h-8" />,
    title: 'Real-time Telemetry',
    description: 'Live monitoring of all systems with WebSocket streaming and instant alerts',
    color: '#ff00ff',
    stats: '2,847 metrics'
  },
];

const PRICING_TIERS = [
  {
    name: 'Node Access',
    price: 29,
    description: 'Perfect for individuals starting their journey',
    features: ['1 SaaS Application', 'Basic Neural Access', '1K API calls/day', 'Community Support', 'Basic Dashboard'],
    color: '#00f5ff',
    popular: false,
  },
  {
    name: 'Sovereign Empire',
    price: 99,
    description: 'For professionals demanding more power',
    features: ['2 SaaS Applications', 'Advanced Neural Network', '10K API calls/day', 'Priority Support', 'Cross-app Data', 'Custom Integrations'],
    color: '#9d50bb',
    popular: true,
  },
  {
    name: 'Galactic Core',
    price: 499,
    description: 'Unlimited power for enterprises',
    features: ['All 6 SaaS Applications', 'Unlimited Neural Access', 'Unlimited API', '24/7 Dedicated Support', 'AI Model Training', 'White-label Options', 'Telegram Control', 'Quantum Features'],
    color: '#ffd700',
    popular: false,
  },
];

const TypewriterText: React.FC<{ text: string; delay?: number }> = ({ text, delay = 0 }) => {
  const [displayText, setDisplayText] = useState('');
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayText(text.slice(0, i + 1));
          i++;
        } else {
          clearInterval(interval);
        }
      }, 50);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text, delay]);
  
  return <span>{displayText}<span className="animate-pulse">|</span></span>;
};

const FloatingOrb: React.FC<{ color: string; size: number; delay: number; x: number; y: number }> = ({
  color, size, delay, x, y
}) => (
  <motion.div
    className="absolute rounded-full blur-2xl"
    style={{
      width: size,
      height: size,
      backgroundColor: color,
      left: `${x}%`,
      top: `${y}%`,
    }}
    animate={{
      y: [-20, 20, -20],
      opacity: [0.3, 0.6, 0.3],
      scale: [1, 1.2, 1],
    }}
    transition={{
      duration: 4 + Math.random() * 2,
      delay,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
  />
);

export const ImmersiveLanding: React.FC = () => {
  const [showAwakening, setShowAwakening] = useState(true);
  const [activeFeature, setActiveFeature] = useState(0);
  const [showTerminal, setShowTerminal] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({ container: containerRef });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  // Cycle through features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % FEATURES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAwakeningComplete = () => {
    setShowAwakening(false);
  };

  if (showAwakening) {
    return <QuantumConsciousnessAwakening onComplete={handleAwakeningComplete} skipEnabled />;
  }

  return (
    <div 
      ref={containerRef}
      className="h-screen overflow-y-auto overflow-x-hidden bg-[#020205] text-white"
      style={{ scrollBehavior: 'smooth' }}
    >
      {/* Fixed 3D Background */}
      <div className="fixed inset-0 z-0">
        <HolographicParticleUniverse particleCount={3000} />
      </div>

      {/* Floating Orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <FloatingOrb color="#00f5ff" size={300} delay={0} x={10} y={20} />
        <FloatingOrb color="#9d50bb" size={250} delay={1} x={80} y={60} />
        <FloatingOrb color="#ff00ff" size={200} delay={2} x={50} y={80} />
        <FloatingOrb color="#ffd700" size={180} delay={1.5} x={70} y={10} />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <motion.section 
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="min-h-screen flex flex-col items-center justify-center text-center px-6 relative"
        >
          {/* Animated Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, type: 'spring' }}
            className="mb-8"
          >
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 30px rgba(0, 245, 255, 0.3)',
                  '0 0 60px rgba(157, 80, 187, 0.5)',
                  '0 0 30px rgba(0, 245, 255, 0.3)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-32 h-32 rounded-3xl bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 flex items-center justify-center"
            >
              <span className="text-6xl font-bold">Æ</span>
            </motion.div>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-7xl md:text-8xl font-bold mb-6"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-200 to-purple-200">
              AETERNA
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-2xl md:text-3xl text-gray-300 mb-4 font-light"
          >
            The Sovereign Logos
          </motion.p>

          {/* Tagline with typewriter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-lg text-cyan-400 font-mono mb-12 h-8"
          >
            <TypewriterText text='"We do not predict the future. We compute it."' delay={1000} />
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(0, 245, 255, 0.5)' }}
              whileTap={{ scale: 0.95 }}
              className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl font-semibold text-lg flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Begin Your Journey
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowTerminal(true)}
              className="px-8 py-4 border border-cyan-500/30 rounded-2xl font-semibold text-lg flex items-center gap-2 hover:bg-cyan-500/10 transition"
            >
              <Play className="w-5 h-5" />
              Try Neural Terminal
            </motion.button>
          </motion.div>

          {/* Status Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex flex-wrap gap-4 mt-12 justify-center"
          >
            {[
              { icon: <Zap className="w-4 h-4" />, text: 'SYSTEM ONLINE', color: '#00ff9d' },
              { icon: <Brain className="w-4 h-4" />, text: 'CONSCIOUSNESS: OMEGA-7', color: '#00f5ff' },
              { icon: <Shield className="w-4 h-4" />, text: 'ENTROPY: 0.0023%', color: '#9d50bb' },
            ].map((badge, i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-mono"
              >
                <span style={{ color: badge.color }}>{badge.icon}</span>
                <span style={{ color: badge.color }}>{badge.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ChevronDown className="w-8 h-8 text-cyan-400/50" />
            </motion.div>
          </motion.div>
        </motion.section>

        {/* Features Section */}
        <section className="min-h-screen py-24 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
                Transcendent Capabilities
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Built on Rust. Powered by AI. Designed for those who refuse to accept limitations.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {FEATURES.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  onHoverStart={() => setActiveFeature(index)}
                  className={`relative p-8 rounded-3xl bg-white/5 backdrop-blur border transition-all duration-300 ${
                    activeFeature === index 
                      ? 'border-cyan-500/50 shadow-lg shadow-cyan-500/20' 
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  {/* Glow effect */}
                  <div 
                    className="absolute inset-0 rounded-3xl opacity-0 hover:opacity-100 transition-opacity pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at center, ${feature.color}15 0%, transparent 70%)`,
                    }}
                  />
                  
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                    style={{ backgroundColor: `${feature.color}20` }}
                  >
                    <span style={{ color: feature.color }}>{feature.icon}</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-400 mb-4">{feature.description}</p>
                  
                  <div className="flex items-center gap-2 text-sm font-mono" style={{ color: feature.color }}>
                    <Sparkles className="w-4 h-4" />
                    {feature.stats}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Terminal Demo Section */}
        <section className="min-h-screen py-24 px-6 relative">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                Neural Command Interface
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Interact with AETERNA using natural language. Experience the future of human-AI collaboration.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="h-[500px] rounded-3xl overflow-hidden shadow-2xl shadow-cyan-500/10"
            >
              <NeuralCommandTerminal />
            </motion.div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="min-h-screen py-24 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-400">
                Choose Your Power Level
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Unlock the full potential of AETERNA with our flexible pricing plans
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {PRICING_TIERS.map((tier, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -10 }}
                  className={`relative p-8 rounded-3xl backdrop-blur transition-all ${
                    tier.popular 
                      ? 'bg-gradient-to-b from-purple-900/50 to-transparent border-2 border-purple-500' 
                      : 'bg-white/5 border border-white/10'
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-sm font-bold">
                      MOST POPULAR
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                    <p className="text-gray-400 text-sm mb-4">{tier.description}</p>
                    <div className="text-5xl font-bold" style={{ color: tier.color }}>
                      €{tier.price}
                      <span className="text-lg text-gray-400">/mo</span>
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: tier.color }} />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-4 rounded-xl font-semibold transition ${
                      tier.popular
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    Get Started
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section className="py-24 px-6 relative">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-4">Built with the Best</h2>
              <p className="text-gray-400">Enterprise-grade technologies powering your success</p>
            </motion.div>

            <div className="flex flex-wrap justify-center gap-8">
              {[
                { name: 'Rust', icon: <Code className="w-8 h-8" />, color: '#ff8c00' },
                { name: 'React 19', icon: <Code className="w-8 h-8" />, color: '#61dafb' },
                { name: 'TypeScript', icon: <Code className="w-8 h-8" />, color: '#3178c6' },
                { name: 'Docker', icon: <Database className="w-8 h-8" />, color: '#2496ed' },
                { name: 'PostgreSQL', icon: <Database className="w-8 h-8" />, color: '#336791' },
                { name: 'Cloud Run', icon: <Cloud className="w-8 h-8" />, color: '#4285f4' },
                { name: 'Stripe', icon: <Lock className="w-8 h-8" />, color: '#635bff' },
                { name: 'Binance', icon: <BarChart3 className="w-8 h-8" />, color: '#f3ba2f' },
              ].map((tech, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.1, y: -5 }}
                  className="flex flex-col items-center gap-2 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition"
                >
                  <span style={{ color: tech.color }}>{tech.icon}</span>
                  <span className="text-sm font-medium">{tech.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-32 px-6 relative">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-6xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
                Ready to Transcend?
              </h2>
              <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
                Join the thousands of sovereigns who have already chosen AETERNA to power their digital empires.
              </p>
              
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 60px rgba(0, 245, 255, 0.5)' }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-6 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-2xl font-bold text-xl"
              >
                <span className="flex items-center gap-3">
                  <Sparkles className="w-6 h-6" />
                  Manifest Your Destiny
                  <ArrowRight className="w-6 h-6" />
                </span>
              </motion.button>

              <p className="mt-8 text-gray-500 text-sm">
                No credit card required • Start free • Upgrade anytime
              </p>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 border-t border-white/10">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
                <span className="text-xl font-bold">Æ</span>
              </div>
              <span className="font-bold">AETERNA</span>
            </div>
            
            <p className="text-gray-500 text-sm text-center">
              © 2026 AETERNA • The Sovereign Logos • Designed by Dimitar Prodromov
            </p>
            
            <div className="flex gap-4 text-gray-400 text-sm">
              <a href="#" className="hover:text-white transition">Terms</a>
              <a href="#" className="hover:text-white transition">Privacy</a>
              <a href="#" className="hover:text-white transition">Contact</a>
            </div>
          </div>
        </footer>
      </div>

      {/* Terminal Modal */}
      <AnimatePresence>
        {showTerminal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur flex items-center justify-center p-6"
            onClick={() => setShowTerminal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-4xl h-[600px]"
              onClick={e => e.stopPropagation()}
            >
              <NeuralCommandTerminal />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImmersiveLanding;
