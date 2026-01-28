import { v4 as uuidv4 } from 'uuid';

/**
 * Structured Logger with Correlation ID and Masking
 */

type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

interface LogContext {
  correlationId?: string;
  userId?: string;
  [key: string]: any;
}

export class Logger {
  private context: LogContext;

  constructor(context: LogContext = {}) {
    this.context = {
      correlationId: context.correlationId || uuidv4(),
      ...context
    };
  }

  private maskSensitiveData(data: any): any {
    if (!data) return data;
    if (typeof data === 'string') {
      // Basic masking for things that look like cards or secrets
      // This is a simplified regex example
      if (data.match(/sk_live_[a-zA-Z0-9]+/)) return '[REDACTED API KEY]';
      return data;
    }

    if (Array.isArray(data)) {
      return data.map(item => this.maskSensitiveData(item));
    }

    if (typeof data === 'object') {
      const masked: any = {};
      for (const key in data) {
        if (key.match(/password|secret|token|card|cvv|iban/i)) {
          masked[key] = '***REDACTED***';
        } else {
          masked[key] = this.maskSensitiveData(data[key]);
        }
      }
      return masked;
    }

    return data;
  }

  private log(level: LogLevel, message: string, meta?: any) {
    const timestamp = new Date().toISOString();
    const payload = {
      timestamp,
      level,
      message,
      context: this.context,
      meta: this.maskSensitiveData(meta)
    };

    // In production, you might send this to ELK/Datadog/Sentry
    if (level === 'ERROR') {
      console.error(JSON.stringify(payload));
    } else if (level === 'WARN') {
      console.warn(JSON.stringify(payload));
    } else {
       console.log(JSON.stringify(payload));
    }
  }

  info(message: string, meta?: any) {
    this.log('INFO', message, meta);
  }

  warn(message: string, meta?: any) {
    this.log('WARN', message, meta);
  }

  error(message: string, meta?: any) {
    this.log('ERROR', message, meta);
  }

  // Create a child logger that inherits context
  child(extraContext: LogContext): Logger {
    return new Logger({ ...this.context, ...extraContext });
  }
}

export const logger = new Logger();
