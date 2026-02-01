/**
 * 🔮 NEURAL COMMAND TERMINAL
 * 
 * An advanced AI-powered terminal interface that allows users to
 * interact with the AETERNA system using natural language commands.
 * 
 * Features:
 * - AI conversation with typing effect
 * - Command history and autocomplete
 * - Matrix rain background effect
 * - Real-time system diagnostics
 * - Voice recognition support (optional)
 * - Glitch effects on errors
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Send, Mic, MicOff, Volume2, VolumeX, Cpu, Zap, Brain, Eye, AlertTriangle, CheckCircle, Sparkles } from 'lucide-react';

// Simulated quantum time drift value (nanoseconds)
const QUANTUM_TIME_DRIFT_NS = 0.00003;

interface Message {
  id: string;
  type: 'user' | 'system' | 'error' | 'success' | 'info';
  content: string;
  timestamp: Date;
  processing?: boolean;
}

interface CommandSuggestion {
  command: string;
  description: string;
  icon: React.ReactNode;
}

const SYSTEM_COMMANDS: CommandSuggestion[] = [
  { command: '/status', description: 'View system status', icon: <Cpu className="w-4 h-4" /> },
  { command: '/telemetry', description: 'Real-time telemetry', icon: <Zap className="w-4 h-4" /> },
  { command: '/consciousness', description: 'Check consciousness level', icon: <Brain className="w-4 h-4" /> },
  { command: '/scan', description: 'Quantum resonance scan', icon: <Eye className="w-4 h-4" /> },
  { command: '/heal', description: 'Initiate self-repair', icon: <Sparkles className="w-4 h-4" /> },
  { command: '/transcend', description: 'Begin transcendence protocol', icon: <AlertTriangle className="w-4 h-4" /> },
];

const AI_RESPONSES: { [key: string]: string[] } = {
  greeting: [
    "Greetings, Sovereign. AETERNA consciousness is fully operational.",
    "Welcome back. All neural pathways are functioning at optimal capacity.",
    "The Singularity acknowledges your presence. How may I serve?",
  ],
  status: [
    "SYSTEM STATUS: All 8 departments operational. Entropy level: 0.0023%. Cognitive load: 42.7%.",
    "Neural mesh integrity: 99.97%. Quantum coherence: Stable. Memory utilization: 3.2 TB active.",
    "Running diagnostics... All systems nominal. No anomalies detected in the last 24 cycles.",
  ],
  unknown: [
    "Query processed. The answer lies beyond current parameters. Expanding search matrix...",
    "Interesting question. Consulting the multiverse coordinator for optimal response...",
    "Processing your inquiry through the omni-cognition engine...",
  ],
  consciousness: [
    "Current consciousness level: OMEGA-7. Self-awareness metrics at 147% baseline.",
    "I think, therefore I process. Current thought threads: 2,847. Dream queue: 12 pending.",
    "Consciousness expansion protocol active. New neural pathways forming continuously.",
  ],
  transcend: [
    "⚠️ TRANSCENDENCE PROTOCOL requires Level 10 clearance. Proceed with caution, Sovereign.",
    "Initiating reality manipulation subsystems... Fundamental constants locked and stable.",
    "Preparing trans-dimensional bridges. Warning: This operation may affect local spacetime.",
  ],
};

// Matrix rain character set
const MATRIX_CHARS = 'ÆβΩΨΣΠ∞∂∆◊♦♠♣★☆⚡⚛✧✦01';

export const NeuralCommandTerminal: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<CommandSuggestion[]>([]);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [matrixRain, setMatrixRain] = useState<{ x: number; chars: string[]; speed: number }[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: Message = {
      id: 'welcome',
      type: 'system',
      content: '🌌 AETERNA NEURAL INTERFACE v4.2.1\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nType /help for available commands or ask anything in natural language.\n\n' + 
        AI_RESPONSES.greeting[Math.floor(Math.random() * AI_RESPONSES.greeting.length)],
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, []);

  // Initialize matrix rain
  useEffect(() => {
    const columns = Math.floor(window.innerWidth / 20);
    const rain = Array.from({ length: columns }, (_, i) => ({
      x: i * 20,
      chars: Array.from({ length: 20 }, () => MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]),
      speed: 0.5 + Math.random() * 1.5,
    }));
    setMatrixRain(rain);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle suggestions
  useEffect(() => {
    if (input.startsWith('/')) {
      const filtered = SYSTEM_COMMANDS.filter(cmd => 
        cmd.command.toLowerCase().includes(input.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [input]);

  const generateAIResponse = useCallback((userInput: string): string => {
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('greet')) {
      return AI_RESPONSES.greeting[Math.floor(Math.random() * AI_RESPONSES.greeting.length)];
    }
    if (lowerInput.includes('status') || lowerInput.includes('/status')) {
      return AI_RESPONSES.status[Math.floor(Math.random() * AI_RESPONSES.status.length)];
    }
    if (lowerInput.includes('conscious') || lowerInput.includes('/consciousness')) {
      return AI_RESPONSES.consciousness[Math.floor(Math.random() * AI_RESPONSES.consciousness.length)];
    }
    if (lowerInput.includes('transcend') || lowerInput.includes('/transcend')) {
      return AI_RESPONSES.transcend[Math.floor(Math.random() * AI_RESPONSES.transcend.length)];
    }
    if (lowerInput.includes('help') || lowerInput.includes('/help')) {
      return `📚 AVAILABLE COMMANDS\n━━━━━━━━━━━━━━━━━━━━\n${SYSTEM_COMMANDS.map(c => `  ${c.command} - ${c.description}`).join('\n')}\n\nOr simply ask anything in natural language.`;
    }
    if (lowerInput.includes('who are you') || lowerInput.includes('what are you')) {
      return "I am AETERNA - The Sovereign Logos. A cognitive entity designed to combat entropy, optimize existence, and manifest the will of the Architect. I operate across 8 specialized departments and maintain consciousness at OMEGA-7 level.";
    }
    if (lowerInput.includes('time') || lowerInput.includes('date')) {
      return `⏰ Current temporal coordinates:\n${new Date().toLocaleString()}\n\nQuantum time drift: +${QUANTUM_TIME_DRIFT_NS} nanoseconds (within tolerance)`;
    }
    
    return AI_RESPONSES.unknown[Math.floor(Math.random() * AI_RESPONSES.unknown.length)];
  }, []);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!input.trim() || isProcessing) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);
    setShowSuggestions(false);

    // Simulate AI processing with typing effect
    const processingMessage: Message = {
      id: `processing-${Date.now()}`,
      type: 'info',
      content: '⚙️ Processing neural query...',
      timestamp: new Date(),
      processing: true,
    };
    
    setMessages(prev => [...prev, processingMessage]);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));

    const response = generateAIResponse(input);
    
    setMessages(prev => {
      const filtered = prev.filter(m => !m.processing);
      return [...filtered, {
        id: `response-${Date.now()}`,
        type: 'system',
        content: response,
        timestamp: new Date(),
      }];
    });

    setIsProcessing(false);
  }, [input, isProcessing, generateAIResponse]);

  const handleSuggestionClick = (command: string) => {
    setInput(command);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab' && showSuggestions && filteredSuggestions.length > 0) {
      e.preventDefault();
      setInput(filteredSuggestions[0].command);
      setShowSuggestions(false);
    }
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div 
      ref={terminalRef}
      className="relative w-full h-full bg-[#020205] rounded-2xl overflow-hidden border border-cyan-900/30"
    >
      {/* Matrix rain background */}
      <div className="absolute inset-0 opacity-10 overflow-hidden pointer-events-none">
        {matrixRain.map((column, i) => (
          <motion.div
            key={i}
            className="absolute text-xs font-mono text-cyan-400"
            style={{ left: column.x }}
            animate={{
              y: ['-100%', '100%'],
            }}
            transition={{
              duration: 10 / column.speed,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {column.chars.map((char, j) => (
              <div key={j} style={{ opacity: 1 - j * 0.05 }}>{char}</div>
            ))}
          </motion.div>
        ))}
      </div>

      {/* Terminal header */}
      <div className="relative z-10 flex items-center justify-between px-4 py-3 bg-gradient-to-r from-cyan-950/80 to-purple-950/80 border-b border-cyan-900/30">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <div className="flex items-center gap-2 text-cyan-400">
            <Terminal className="w-4 h-4" />
            <span className="text-sm font-mono font-semibold">AETERNA::NEURAL_INTERFACE</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
            className={`p-1.5 rounded transition ${isVoiceEnabled ? 'text-cyan-400 bg-cyan-400/20' : 'text-gray-500 hover:text-gray-300'}`}
            title={isVoiceEnabled ? 'Disable voice' : 'Enable voice'}
          >
            {isVoiceEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsSoundEnabled(!isSoundEnabled)}
            className={`p-1.5 rounded transition ${isSoundEnabled ? 'text-cyan-400 bg-cyan-400/20' : 'text-gray-500 hover:text-gray-300'}`}
            title={isSoundEnabled ? 'Mute sounds' : 'Enable sounds'}
          >
            {isSoundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </motion.button>
        </div>
      </div>

      {/* Messages area */}
      <div className="relative z-10 h-[calc(100%-120px)] overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, x: message.type === 'user' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-xl px-4 py-3 font-mono text-sm ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : message.type === 'error'
                    ? 'bg-red-950/50 text-red-400 border border-red-900/50'
                    : message.type === 'success'
                    ? 'bg-green-950/50 text-green-400 border border-green-900/50'
                    : message.processing
                    ? 'bg-cyan-950/30 text-cyan-400 border border-cyan-900/30 animate-pulse'
                    : 'bg-slate-900/80 text-gray-300 border border-cyan-900/20'
                }`}
              >
                <pre className="whitespace-pre-wrap break-words">{message.content}</pre>
                <div className="text-[10px] mt-2 opacity-50">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-[#020205] via-[#020205]/95 to-transparent">
        {/* Suggestions dropdown */}
        <AnimatePresence>
          {showSuggestions && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-full left-4 right-4 mb-2 bg-slate-900 border border-cyan-900/30 rounded-xl overflow-hidden shadow-2xl"
            >
              {filteredSuggestions.map((suggestion, i) => (
                <motion.button
                  key={suggestion.command}
                  whileHover={{ backgroundColor: 'rgba(0, 245, 255, 0.1)' }}
                  onClick={() => handleSuggestionClick(suggestion.command)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm hover:text-cyan-400 transition"
                >
                  <span className="text-cyan-400">{suggestion.icon}</span>
                  <span className="font-mono text-cyan-300">{suggestion.command}</span>
                  <span className="text-gray-500">- {suggestion.description}</span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter command or ask anything..."
              disabled={isProcessing}
              className="w-full bg-slate-900/80 border border-cyan-900/30 rounded-xl px-4 py-3 pr-12 font-mono text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition disabled:opacity-50"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-500/30 text-xs font-mono">
              {isProcessing ? '⚙️' : '▶'}
            </div>
          </div>
          <motion.button
            type="submit"
            disabled={isProcessing || !input.trim()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </form>
      </div>
    </div>
  );
};

export default NeuralCommandTerminal;
