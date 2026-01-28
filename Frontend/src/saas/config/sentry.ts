import * as Sentry from "@sentry/react";

export const initSentry = () => {
    const dsn = import.meta.env.VITE_SENTRY_DSN;
    
    if (dsn && dsn.startsWith('http')) {
        Sentry.init({
            dsn: dsn,
            integrations: [
                Sentry.browserTracingIntegration(),
                Sentry.replayIntegration(),
            ],
            // Performance Monitoring
            tracesSampleRate: 1.0, 
            // Session Replay
            replaysSessionSampleRate: 0.1, 
            replaysOnErrorSampleRate: 1.0,
            
            // User Configuration
            sendDefaultPii: true
        });
        console.log('🛡️ Sentry Initialized');
    } else {
        console.log('ℹ️ Sentry Skipped (No DSN)');
    }
};
