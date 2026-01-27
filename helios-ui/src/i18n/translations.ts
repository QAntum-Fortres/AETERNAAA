/**
 * Internationalization for AETERNA.WEBSITE
 * Bulgarian + English support
 */

export interface Translation {
  // Navigation
  nav_overview: string;
  nav_apps: string;
  nav_analytics: string;
  nav_account: string;
  nav_dashboard: string;
  nav_money: string;
  nav_saas_hub: string;
  
  // Hero section
  hero_title: string;
  hero_subtitle: string;
  hero_description: string;
  cta_explore: string;
  cta_demo: string;
  cta_telegram: string;
  
  // Platform stats
  stats_title: string;
  stat_revenue: string;
  stat_users: string;
  stat_apps: string;
  stat_uptime: string;
  stat_automations: string;
  stat_ai_queries: string;
  
  // Features
  feature_quantum_title: string;
  feature_quantum_desc: string;
  feature_ai_title: string;
  feature_ai_desc: string;
  feature_api_title: string;
  feature_api_desc: string;
  feature_security_title: string;
  feature_security_desc: string;
  feature_analytics_title: string;
  feature_analytics_desc: string;
  feature_optimization_title: string;
  feature_optimization_desc: string;
  
  // SaaS Applications
  saas_wealth_scanner: string;
  saas_sector_security: string;
  saas_network_optimizer: string;
  saas_valuation_gate: string;
  saas_automation_nexus: string;
  saas_intelligence_core: string;
  
  // Common actions
  action_launch: string;
  action_view_details: string;
  action_subscribe: string;
  action_learn_more: string;
  action_get_started: string;
  
  // Status messages
  status_online: string;
  status_operational: string;
  status_connecting: string;
  status_error: string;
  
  // Telegram commands
  telegram_welcome: string;
  telegram_status_cmd: string;
  telegram_revenue_cmd: string;
  telegram_deploy_cmd: string;
  telegram_crypto_cmd: string;
  telegram_optimize_cmd: string;
}

export const translations: Record<'bg' | 'en', Translation> = {
  bg: {
    // Navigation
    nav_overview: 'Преглед',
    nav_apps: 'SaaS Приложения', 
    nav_analytics: 'Аналитика',
    nav_account: 'Акаунт',
    nav_dashboard: 'Dashboard',
    nav_money: 'Пари',
    nav_saas_hub: 'SaaS Hub',
    
    // Hero section
    hero_title: 'AETERNA.WEBSITE',
    hero_subtitle: 'Последната SaaS Платформа Която Ще Ви Трябва Някога',
    hero_description: 'Единна платформа. Всички инструменти. Превъзходна над всичко на пазара. AETERNA комбинира AI, автоматизация, аналитика и сигурност по начин, по който никоя друга платформа не може.',
    cta_explore: 'Разгледай Платформата',
    cta_demo: 'Виж Демо',
    cta_telegram: '📱 Telegram: 967408',
    
    // Platform stats  
    stats_title: 'Статистики на Платформата',
    stat_revenue: 'Общи Приходи',
    stat_users: 'Общо Потребители',
    stat_apps: 'Активни Приложения', 
    stat_uptime: 'Uptime',
    stat_automations: 'Автоматизации',
    stat_ai_queries: 'AI Заявки',
    
    // Features
    feature_quantum_title: 'Quantum Предсказание',
    feature_quantum_desc: 'Предсказва действията на потребителите преди те да ги направят използвайки quantum алгоритми',
    feature_ai_title: 'Cross-App AI Intelligence',
    feature_ai_desc: 'AI се учи от ВСИЧКИ ваши SaaS приложения и създава интелигентни връзки между тях',
    feature_api_title: 'Мгновено API Създаване', 
    feature_api_desc: 'Посочете към всеки website/приложение и получете работещо API мгновено чрез AI анализ',
    feature_security_title: 'Quantum Security Mesh',
    feature_security_desc: 'Quantum-заплетена сигурност която прави хакването математически невъзможно',
    feature_analytics_title: 'Multi-Dimensional Analytics',
    feature_analytics_desc: 'Анализирайте данни през време, пространство, вероятност и quantum измерения',
    feature_optimization_title: 'Autonomous Business Optimization',
    feature_optimization_desc: 'AI непрекъснато оптимизира целия ви бизнес без човешка намеса',
    
    // SaaS Applications
    saas_wealth_scanner: 'Wealth Scanner Pro - AI платформа за финансова интелигентност',
    saas_sector_security: 'Sector Security Suite - Разширена киберсигурност с AI откриване на заплахи',
    saas_network_optimizer: 'Network Optimizer Pro - Интелигентна оптимизация на мрежовата производителност',
    saas_valuation_gate: 'Valuation Gate AI - Платформа за оценка на активи с quantum AI',
    saas_automation_nexus: 'Automation Nexus - Превъзходна автоматизация която прави Playwright + Selenium остарели',
    saas_intelligence_core: 'Intelligence Core - Multi-modal AI платформа за enterprise решения',
    
    // Common actions
    action_launch: 'Стартирай',
    action_view_details: 'Виж Детайли',
    action_subscribe: 'Абонирай се',
    action_learn_more: 'Научи Повече',
    action_get_started: 'Започни',
    
    // Status messages
    status_online: 'Онлайн',
    status_operational: 'Всички Системи Оперативни',
    status_connecting: 'Свързване...',
    status_error: 'Грешка',
    
    // Telegram commands
    telegram_welcome: 'Добре дошли в AETERNA.WEBSITE command center, Архитект.',
    telegram_status_cmd: 'Статус на системата',
    telegram_revenue_cmd: 'Dashboard за приходи',
    telegram_deploy_cmd: 'Deploy приложения',
    telegram_crypto_cmd: 'Binance crypto активи',
    telegram_optimize_cmd: 'Оптимизирай всички системи'
  },
  
  en: {
    // Navigation
    nav_overview: 'Overview',
    nav_apps: 'SaaS Applications',
    nav_analytics: 'Analytics', 
    nav_account: 'Account',
    nav_dashboard: 'Dashboard',
    nav_money: 'Money',
    nav_saas_hub: 'SaaS Hub',
    
    // Hero section
    hero_title: 'AETERNA.WEBSITE',
    hero_subtitle: 'The Last SaaS Platform You\'ll Ever Need',
    hero_description: 'One platform. Every tool. Superior to everything on the market. AETERNA combines AI, automation, analytics, and security in ways no other platform can.',
    cta_explore: 'Explore Platform',
    cta_demo: 'Watch Demo',
    cta_telegram: '📱 Telegram: 967408',
    
    // Platform stats
    stats_title: 'Platform Statistics',
    stat_revenue: 'Total Revenue',
    stat_users: 'Total Users',
    stat_apps: 'Active Apps',
    stat_uptime: 'Uptime',
    stat_automations: 'Automations',
    stat_ai_queries: 'AI Queries',
    
    // Features
    feature_quantum_title: 'Quantum Prediction',
    feature_quantum_desc: 'Predicts user actions before they happen using quantum algorithms',
    feature_ai_title: 'Cross-App AI Intelligence',
    feature_ai_desc: 'AI learns from ALL your SaaS apps and creates intelligent connections between them',
    feature_api_title: 'Instant API Reverse Engineering',
    feature_api_desc: 'Point to any website/app and get a working API instantly through AI analysis',
    feature_security_title: 'Quantum Security Mesh',
    feature_security_desc: 'Quantum-entangled security that makes hacking mathematically impossible',
    feature_analytics_title: 'Multi-Dimensional Analytics',
    feature_analytics_desc: 'Analyze data across time, space, probability, and quantum dimensions',
    feature_optimization_title: 'Autonomous Business Optimization',
    feature_optimization_desc: 'AI continuously optimizes your entire business without human intervention',
    
    // SaaS Applications
    saas_wealth_scanner: 'Wealth Scanner Pro - AI-powered financial intelligence platform',
    saas_sector_security: 'Sector Security Suite - Advanced cybersecurity with AI threat detection',
    saas_network_optimizer: 'Network Optimizer Pro - Intelligent network performance optimization',
    saas_valuation_gate: 'Valuation Gate AI - Ultimate asset valuation platform with quantum AI',
    saas_automation_nexus: 'Automation Nexus - Superior automation platform that makes Playwright + Selenium obsolete',
    saas_intelligence_core: 'Intelligence Core - Multi-modal AI platform for enterprise solutions',
    
    // Common actions
    action_launch: 'Launch',
    action_view_details: 'View Details', 
    action_subscribe: 'Subscribe',
    action_learn_more: 'Learn More',
    action_get_started: 'Get Started',
    
    // Status messages
    status_online: 'Online',
    status_operational: 'All Systems Operational',
    status_connecting: 'Connecting...',
    status_error: 'Error',
    
    // Telegram commands
    telegram_welcome: 'Welcome to AETERNA.WEBSITE command center, Architect.',
    telegram_status_cmd: 'System status and health',
    telegram_revenue_cmd: 'Revenue dashboard',
    telegram_deploy_cmd: 'Deploy applications', 
    telegram_crypto_cmd: 'Binance crypto assets',
    telegram_optimize_cmd: 'Optimize all systems'
  }
};

export const useTranslation = (language: 'bg' | 'en' = 'en') => {
  return {
    t: (key: keyof Translation): string => {
      return translations[language][key] || key;
    },
    language,
    setLanguage: (newLang: 'bg' | 'en') => {
      // This would update the current language in state management
      localStorage.setItem('aeterna_language', newLang);
    }
  };
};

export const getCurrentLanguage = (): 'bg' | 'en' => {
  return (localStorage.getItem('aeterna_language') as 'bg' | 'en') || 'en';
};