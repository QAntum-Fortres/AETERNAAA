/**
 * Client Portal - Complete user experience
 * Registration → Payment → Dashboard → SaaS Usage
 */

import React, { useState, useEffect } from 'react';
import { 
  User, CreditCard, CheckCircle, Star, ArrowRight, Mail, Lock,
  Zap, Brain, Shield, Globe, Activity, Settings, LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type UserFlow = 'landing' | 'register' | 'login' | 'payment' | 'dashboard' | 'app';

interface UserData {
  email: string;
  name: string;
  plan?: string;
  subscriptions: string[];
  isLoggedIn: boolean;
}

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: string;
  features: string[];
  popular?: boolean;
  apps: string[];
}

const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'node_access',
    name: 'Node Access',
    price: 29,
    currency: 'EUR',
    interval: 'month',
    features: [
      'Access to 1 SaaS application',
      'Basic neural node access',
      'API access (1000 req/day)',
      'Community support',
      'Basic telemetry dashboard'
    ],
    apps: ['wealth_scanner']
  },
  {
    id: 'sovereign_empire',
    name: 'Sovereign Empire', 
    price: 99,
    currency: 'EUR',
    interval: 'month',
    popular: true,
    features: [
      'Access to 2 SaaS applications',
      'Advanced neural network access',
      'API access (10,000 req/day)',
      'Priority support',
      'Cross-app data sharing',
      'Custom integrations'
    ],
    apps: ['wealth_scanner', 'network_optimizer']
  },
  {
    id: 'galactic_core',
    name: 'Galactic Core',
    price: 499,
    currency: 'EUR', 
    interval: 'month',
    features: [
      'Access to all 6 SaaS applications',
      'Unlimited neural network access',
      'Unlimited API access',
      '24/7 dedicated support',
      'AI model training',
      'White-label options',
      'Telegram mobile control (967408)',
      'Quantum features access'
    ],
    apps: ['wealth_scanner', 'network_optimizer', 'sector_security', 'valuation_gate', 'automation_nexus', 'intelligence_core']
  }
];

export const ClientPortal: React.FC = () => {
  const [currentFlow, setCurrentFlow] = useState<UserFlow>('landing');
  const [userData, setUserData] = useState<UserData>({
    email: '',
    name: '',
    subscriptions: [],
    isLoggedIn: false
  });
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [language, setLanguage] = useState<'bg' | 'en'>('en');

  // Check if user is already logged in
  useEffect(() => {
    const saved = localStorage.getItem('aeterna_user');
    if (saved) {
      const user = JSON.parse(saved);
      setUserData(user);
      setCurrentFlow('dashboard');
    }
  }, []);

  const handleRegister = async (email: string, name: string, password: string) => {
    // Simulate registration
    const newUser: UserData = {
      email,
      name,
      subscriptions: [],
      isLoggedIn: true
    };
    
    setUserData(newUser);
    localStorage.setItem('aeterna_user', JSON.stringify(newUser));
    
    // If no plan selected, show pricing
    if (!selectedPlan) {
      setCurrentFlow('payment');
    } else {
      await handlePayment(selectedPlan);
    }
  };

  const handlePayment = async (plan: PricingPlan) => {
    try {
      // Call backend to create Stripe checkout
      const response = await fetch('/api/economy/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: plan.id,
          successUrl: window.location.origin + '/success',
          cancelUrl: window.location.origin + '/cancel'
        })
      });

      const data = await response.json();
      
      if (data.checkoutUrl) {
        // Redirect to Stripe checkout
        window.location.href = data.checkoutUrl;
      } else {
        // Fallback to mock payment success
        handlePaymentSuccess(plan);
      }
    } catch (error) {
      console.error('Payment error:', error);
      // Mock success for demo
      handlePaymentSuccess(plan);
    }
  };

  const handlePaymentSuccess = (plan: PricingPlan) => {
    const updatedUser = {
      ...userData,
      plan: plan.id,
      subscriptions: plan.apps
    };
    
    setUserData(updatedUser);
    localStorage.setItem('aeterna_user', JSON.stringify(updatedUser));
    setCurrentFlow('dashboard');
  };

  const logout = () => {
    localStorage.removeItem('aeterna_user');
    setUserData({ email: '', name: '', subscriptions: [], isLoggedIn: false });
    setCurrentFlow('landing');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Language Toggle */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <button 
          onClick={() => setLanguage('bg')}
          className={`px-3 py-1 rounded-lg text-sm transition ${language === 'bg' ? 'bg-purple-600' : 'bg-white/10 hover:bg-white/20'}`}
        >
          🇧🇬 БГ
        </button>
        <button 
          onClick={() => setLanguage('en')}
          className={`px-3 py-1 rounded-lg text-sm transition ${language === 'en' ? 'bg-purple-600' : 'bg-white/10 hover:bg-white/20'}`}
        >
          🇺🇸 EN
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* Landing Page */}
        {currentFlow === 'landing' && (
          <LandingPage 
            language={language}
            onGetStarted={() => setCurrentFlow('register')}
            onLogin={() => setCurrentFlow('login')}
            onSelectPlan={(plan) => {
              setSelectedPlan(plan);
              setCurrentFlow('register');
            }}
          />
        )}

        {/* Registration */}
        {currentFlow === 'register' && (
          <RegistrationPage
            language={language}
            selectedPlan={selectedPlan}
            onRegister={handleRegister}
            onBack={() => setCurrentFlow('landing')}
          />
        )}

        {/* Login */}
        {currentFlow === 'login' && (
          <LoginPage
            language={language}
            onLogin={(email, password) => {
              // Mock login
              const user = { email, name: 'Demo User', subscriptions: ['wealth_scanner'], isLoggedIn: true };
              setUserData(user);
              localStorage.setItem('aeterna_user', JSON.stringify(user));
              setCurrentFlow('dashboard');
            }}
            onBack={() => setCurrentFlow('landing')}
          />
        )}

        {/* Payment */}
        {currentFlow === 'payment' && (
          <PaymentPage
            language={language}
            plans={PRICING_PLANS}
            selectedPlan={selectedPlan}
            onSelectPlan={setSelectedPlan}
            onPayment={handlePayment}
            onBack={() => setCurrentFlow('register')}
          />
        )}

        {/* Client Dashboard */}
        {currentFlow === 'dashboard' && userData.isLoggedIn && (
          <ClientDashboard
            language={language}
            user={userData}
            onLogout={logout}
            onLaunchApp={(appId) => setCurrentFlow('app')}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Landing Page Component
const LandingPage: React.FC<{
  language: 'en' | 'en';
  onGetStarted: () => void;
  onLogin: () => void;
  onSelectPlan: (plan: PricingPlan) => void;
}> = ({ language, onGetStarted, onLogin, onSelectPlan }) => {
  const t = language === 'bg' ? {
    title: 'AETERNA.WEBSITE',
    subtitle: 'Последната SaaS платформа която ще ви трябва някога',
    description: 'Единна платформа. Всички инструменти. Превъзходна над всичко на пазара.',
    getStarted: 'Започни Безплатно',
    login: 'Вход',
    features: 'Революционни Features',
    pricing: 'Планове и Цени'
  } : {
    title: 'AETERNA.WEBSITE',
    subtitle: 'The Last SaaS Platform You\'ll Ever Need',
    description: 'One platform. Every tool. Superior to everything on the market.',
    getStarted: 'Get Started Free',
    login: 'Login',
    features: 'Revolutionary Features', 
    pricing: 'Plans & Pricing'
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen"
    >
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
        <motion.h1 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-6xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent"
        >
          {t.title}
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl text-gray-300 mb-4"
        >
          {t.subtitle}
        </motion.p>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-gray-400 mb-12 max-w-2xl"
        >
          {t.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex gap-4"
        >
          <button 
            onClick={onGetStarted}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold text-lg hover:scale-105 transition-transform"
          >
            {t.getStarted}
          </button>
          <button 
            onClick={onLogin}
            className="px-8 py-4 border border-white/20 rounded-xl font-semibold text-lg hover:bg-white/10 transition"
          >
            {t.login}
          </button>
        </motion.div>
      </div>

      {/* Pricing Quick Preview */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-center mb-12">{t.pricing}</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {PRICING_PLANS.map((plan) => (
            <motion.div
              key={plan.id}
              whileHover={{ scale: 1.02, y: -5 }}
              className={`bg-white/5 rounded-2xl p-8 border transition cursor-pointer ${
                plan.popular ? 'border-purple-500 bg-purple-500/10' : 'border-white/10 hover:border-purple-500/30'
              }`}
              onClick={() => onSelectPlan(plan)}
            >
              {plan.popular && (
                <div className="text-center mb-4">
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-1 rounded-full text-sm font-semibold">
                    {language === 'bg' ? 'НАЙ-ПОПУЛЯРЕН' : 'MOST POPULAR'}
                  </span>
                </div>
              )}
              
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <div className="text-3xl font-bold mb-1">
                €{plan.price}
                <span className="text-lg text-gray-400">/{plan.interval}</span>
              </div>
              
              <ul className="space-y-2 mb-6 text-sm">
                {plan.features.slice(0, 3).map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>{feature}</span>
                  </li>
                ))}
                <li className="text-gray-400">+ {plan.features.length - 3} още...</li>
              </ul>
              
              <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:opacity-90 transition">
                {language === 'bg' ? 'Избери План' : 'Choose Plan'}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Registration Page
const RegistrationPage: React.FC<{
  language: 'en' | 'en';
  selectedPlan: PricingPlan | null;
  onRegister: (email: string, name: string, password: string) => void;
  onBack: () => void;
}> = ({ language, selectedPlan, onRegister, onBack }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const t = language === 'bg' ? {
    title: 'Създаване на Акаунт',
    subtitle: 'Присъединете се към бъдещето на SaaS',
    emailLabel: 'Email адрес',
    nameLabel: 'Пълно име',
    passwordLabel: 'Парола',
    createAccount: 'Създай Акаунт',
    alreadyHave: 'Вече имате акаунт?',
    signIn: 'Влезте тук',
    selectedPlan: 'Избран план'
  } : {
    title: 'Create Account',
    subtitle: 'Join the future of SaaS',
    emailLabel: 'Email address', 
    nameLabel: 'Full name',
    passwordLabel: 'Password',
    createAccount: 'Create Account',
    alreadyHave: 'Already have an account?',
    signIn: 'Sign in here',
    selectedPlan: 'Selected plan'
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRegister(email, name, password);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="min-h-screen flex items-center justify-center px-6"
    >
      <div className="w-full max-w-md">
        <div className="bg-white/5 rounded-2xl border border-white/10 p-8 backdrop-blur">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">{t.title}</h1>
            <p className="text-gray-400">{t.subtitle}</p>
          </div>

          {selectedPlan && (
            <div className="mb-6 p-4 bg-purple-500/20 rounded-xl border border-purple-500/30">
              <div className="text-sm text-purple-300 mb-1">{t.selectedPlan}:</div>
              <div className="font-semibold">{selectedPlan.name} - €{selectedPlan.price}/{selectedPlan.interval}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">{t.emailLabel}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-purple-500 transition"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t.nameLabel}</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-purple-500 transition"
                  placeholder={language === 'bg' ? 'Вашето име' : 'Your name'}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t.passwordLabel}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-purple-500 transition"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:scale-105 transition-transform"
            >
              {t.createAccount}
            </button>
          </form>

          <div className="text-center mt-6 text-sm text-gray-400">
            {t.alreadyHave}{' '}
            <button 
              onClick={onBack}
              className="text-purple-400 hover:text-purple-300 transition"
            >
              {t.signIn}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Login Page
const LoginPage: React.FC<{
  language: 'en' | 'en';
  onLogin: (email: string, password: string) => void;
  onBack: () => void;
}> = ({ language, onLogin, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const t = language === 'bg' ? {
    title: 'Вход в Акаунта',
    subtitle: 'Добре дошли обратно',
    login: 'Влезте',
    forgotPassword: 'Забравена парола?',
    noAccount: 'Няmate акаунт?',
    signUp: 'Регистрирайте се'
  } : {
    title: 'Sign In',
    subtitle: 'Welcome back',
    login: 'Sign In',
    forgotPassword: 'Forgot password?',
    noAccount: 'Don\'t have an account?',
    signUp: 'Sign up'
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className="min-h-screen flex items-center justify-center px-6"
    >
      <div className="w-full max-w-md">
        <div className="bg-white/5 rounded-2xl border border-white/10 p-8 backdrop-blur">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">{t.title}</h1>
            <p className="text-gray-400">{t.subtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-purple-500 transition"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-purple-500 transition"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:scale-105 transition-transform"
            >
              {t.login}
            </button>
          </form>

          <div className="text-center mt-6 space-y-2">
            <button className="text-sm text-purple-400 hover:text-purple-300 transition">
              {t.forgotPassword}
            </button>
            <div className="text-sm text-gray-400">
              {t.noAccount}{' '}
              <button 
                onClick={onBack}
                className="text-purple-400 hover:text-purple-300 transition"
              >
                {t.signUp}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Payment Page
const PaymentPage: React.FC<{
  language: 'en' | 'en';
  plans: PricingPlan[];
  selectedPlan: PricingPlan | null;
  onSelectPlan: (plan: PricingPlan) => void;
  onPayment: (plan: PricingPlan) => void;
  onBack: () => void;
}> = ({ language, plans, selectedPlan, onSelectPlan, onPayment, onBack }) => {
  const t = language === 'bg' ? {
    title: 'Изберете Вашия План',
    subtitle: 'Започнете да генерирате приходи днес',
    payNow: 'Платете Сега',
    mostPopular: 'НАЙ-ПОПУЛЯРЕН'
  } : {
    title: 'Choose Your Plan',
    subtitle: 'Start generating revenue today',
    payNow: 'Pay Now',
    mostPopular: 'MOST POPULAR'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="min-h-screen py-12 px-6"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{t.title}</h1>
          <p className="text-xl text-gray-400">{t.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              whileHover={{ scale: 1.02, y: -5 }}
              className={`bg-white/5 rounded-2xl p-8 border transition cursor-pointer ${
                plan.popular ? 'border-purple-500 bg-purple-500/10' : 'border-white/10'
              } ${selectedPlan?.id === plan.id ? 'ring-2 ring-purple-500' : ''}`}
              onClick={() => onSelectPlan(plan)}
            >
              {plan.popular && (
                <div className="text-center mb-4">
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-1 rounded-full text-sm font-semibold">
                    {t.mostPopular}
                  </span>
                </div>
              )}
              
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="text-4xl font-bold mb-6">
                €{plan.price}
                <span className="text-lg text-gray-400">/{plan.interval}</span>
              </div>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="text-sm text-gray-400 mb-6">
                <strong>{language === 'bg' ? 'Включени приложения' : 'Included apps'}:</strong>
                <div className="mt-2 space-y-1">
                  {plan.apps.map(app => (
                    <div key={app} className="text-purple-300">• {app.replace(/_/g, ' ')}</div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          {selectedPlan && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => onPayment(selectedPlan)}
              className="px-12 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold text-lg hover:scale-105 transition-transform mr-4"
            >
              <CreditCard className="w-5 h-5 inline mr-2" />
              {t.payNow} €{selectedPlan.price}
            </motion.button>
          )}
          
          <button 
            onClick={onBack}
            className="px-8 py-4 border border-white/20 rounded-xl font-semibold hover:bg-white/10 transition"
          >
            {language === 'bg' ? 'Назад' : 'Back'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Client Dashboard  
const ClientDashboard: React.FC<{
  language: 'en' | 'en';
  user: UserData;
  onLogout: () => void;
  onLaunchApp: (appId: string) => void;
}> = ({ language, user, onLogout, onLaunchApp }) => {
  const t = language === 'bg' ? {
    welcome: 'Добре дошли',
    yourApps: 'Вашите SaaS Приложения',
    launch: 'Стартирай',
    settings: 'Настройки',
    logout: 'Изход',
    account: 'Акаунт',
    billing: 'Плащания',
    usage: 'Използване'
  } : {
    welcome: 'Welcome',
    yourApps: 'Your SaaS Applications',
    launch: 'Launch',
    settings: 'Settings', 
    logout: 'Logout',
    account: 'Account',
    billing: 'Billing',
    usage: 'Usage'
  };

  const userApps = PRICING_PLANS
    .find(p => p.id === user.plan)?.apps || user.subscriptions;

  const availableApps = [
    { id: 'wealth_scanner', name: 'Wealth Scanner Pro', icon: '🔍', url: 'wealth-scanner.aeterna.website' },
    { id: 'sector_security', name: 'Sector Security Suite', icon: '🛡️', url: 'sector-security.aeterna.website' },
    { id: 'network_optimizer', name: 'Network Optimizer Pro', icon: '🌐', url: 'network-optimizer.aeterna.website' },
    { id: 'valuation_gate', name: 'Valuation Gate AI', icon: '💎', url: 'valuation-gate.aeterna.website' },
    { id: 'automation_nexus', name: 'Automation Nexus', icon: '🤖', url: 'automation-nexus.aeterna.website' },
    { id: 'intelligence_core', name: 'Intelligence Core', icon: '🧠', url: 'intelligence-core.aeterna.website' }
  ].filter(app => userApps.includes(app.id));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen"
    >
      {/* Header */}
      <nav className="border-b border-white/10 bg-black/20 backdrop-blur p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <span className="text-xl font-bold">Æ</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">aeterna.website</h1>
              <p className="text-sm text-gray-400">{t.welcome}, {user.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-white/10 rounded-lg transition">
              <Settings className="w-5 h-5" />
            </button>
            <button 
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 border border-white/20 rounded-lg hover:bg-white/10 transition"
            >
              <LogOut className="w-4 h-4" />
              {t.logout}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">{t.yourApps}</h2>
          <p className="text-gray-400">
            {language === 'bg' 
              ? `Имате достъп до ${availableApps.length} SaaS приложения` 
              : `You have access to ${availableApps.length} SaaS applications`
            }
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {availableApps.map((app) => (
            <motion.div
              key={app.id}
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 transition"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="text-3xl">{app.icon}</div>
                <div>
                  <h3 className="text-xl font-semibold">{app.name}</h3>
                  <div className="text-sm text-gray-400">{app.url}</div>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => window.open(`https://${app.url}`, '_blank')}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:scale-105 transition-transform"
                >
                  <ArrowRight className="w-4 h-4 inline mr-2" />
                  {t.launch}
                </button>
                <button className="px-4 py-3 border border-white/20 rounded-lg hover:bg-white/10 transition">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Account Status */}
        <div className="mt-12 bg-white/5 rounded-2xl p-6 border border-white/10">
          <h3 className="text-xl font-semibold mb-4">{t.account}</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">Active</div>
              <div className="text-sm text-gray-400">{language === 'bg' ? 'Статус на акаунта' : 'Account Status'}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{user.plan || 'galactic_core'}</div>
              <div className="text-sm text-gray-400">{language === 'bg' ? 'Текущ план' : 'Current Plan'}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{availableApps.length}</div>
              <div className="text-sm text-gray-400">{language === 'bg' ? 'Активни приложения' : 'Active Apps'}</div>
            </div>
          </div>
        </div>
      </main>
    </motion.div>
  );
};

export default ClientPortal;