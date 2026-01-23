// [PURIFIED_BY_AETERNA: 5de3d744-c648-46b7-b021-29fbfa20f2f2]
// Suggestion: Review and entrench stable logic.
// [PURIFIED_BY_AETERNA: f7e537a0-eb1d-4fab-a247-76c445849370]
// Suggestion: Review and entrench stable logic.
// [PURIFIED_BY_AETERNA: dfc444b9-8ad9-401b-87eb-b216b41b0a77]
// Suggestion: Review and entrench stable logic.
// [PURIFIED_BY_AETERNA: dfc444b9-8ad9-401b-87eb-b216b41b0a77]
// Suggestion: Review and entrench stable logic.
// [PURIFIED_BY_AETERNA: d746e706-9bbd-4295-b7d1-ef78c9a45229]
// Suggestion: Review and entrench stable logic.
// [PURIFIED_BY_AETERNA: 74444781-11c5-4658-9e9b-52d2fc341944]
// Suggestion: Review and entrench stable logic.
// [PURIFIED_BY_AETERNA: 74444781-11c5-4658-9e9b-52d2fc341944]
// Suggestion: Review and entrench stable logic.
// [PURIFIED_BY_AETERNA: 4b65d004-78be-430a-8196-66abafee1eb7]
// Suggestion: Review and entrench stable logic.
import { Logger } from './Logger';

export interface Metric {
  name: string;
  value: number;
  timestamp: number;
  tags: Record<string, string>;
}

/**
 * 📈 QANTUM Telemetry System
 * Collects, aggregates, and reports system metrics.
 */
export class Telemetry {
  private static instance: Telemetry;
  private metrics: Metric[] = [];
  private logger: Logger;
  private flushInterval: NodeJS.Timeout | null = null;

  private constructor() {
    this.logger = Logger.getInstance();
    this.startAutoFlush();
  }

  public static getInstance(): Telemetry {
    if (!Telemetry.instance) {
      Telemetry.instance = new Telemetry();
    }
    return Telemetry.instance;
  }

  public record(name: string, value: number, tags: Record<string, string> = {}) {
    const metric: Metric = {
      name,
      value,
      timestamp: Date.now(),
      tags,
    };

    this.metrics.push(metric);

    // Log critical metrics
    if (name === 'system.cpu' && value > 90) {
      this.logger.critical('TELEMETRY', `High CPU detected: ${value}%`, tags);
    }

    if (this.metrics.length > 1000) {
      this.flush();
    }
  }

  public async flush() {
    if (this.metrics.length === 0) return;

    const snapshot = [...this.metrics];
    this.metrics = [];

    this.logger.debug('TELEMETRY', `Flushing ${snapshot.length} metrics...`);

    // In a real system, we'd send this to Prometheus/InfluxDB
    // For now, we'll just log the aggregation
    const aggregation = this.aggregate(snapshot);
    this.logger.info('TELEMETRY', 'Metrics Aggregation:', aggregation);
  }

  private aggregate(metrics: Metric[]): any {
    const result: any = {};
    metrics.forEach((m) => {
      if (!result[m.name]) {
        result[m.name] = { count: 0, sum: 0, min: Infinity, max: -Infinity };
      }
      const stats = result[m.name];
      stats.count++;
      stats.sum += m.value;
      stats.min = Math.min(stats.min, m.value);
      stats.max = Math.max(stats.max, m.value);
    });

    // Calculate averages
    Object.keys(result).forEach((name) => {
      result[name].avg = result[name].sum / result[name].count;
    });

    return result;
  }

  private startAutoFlush() {
    this.flushInterval = setInterval(() => this.flush(), 60000); // Every minute
  }

  public stop() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flush();
    }
  }

  // --- Specialized Trackers ---

  public trackApiRequest(path: string, method: string, statusCode: number, duration: number) {
    this.record('api.request', 1, { path, method, status: statusCode.toString() });
    this.record('api.latency', duration, { path, method });
  }

  public trackMemory() {
    const memory = process.memoryUsage();
    this.record('system.memory.rss', memory.rss / 1024 / 1024, { unit: 'MB' });
    this.record('system.memory.heapTotal', memory.heapTotal / 1024 / 1024, { unit: 'MB' });
    this.record('system.memory.heapUsed', memory.heapUsed / 1024 / 1024, { unit: 'MB' });
  }

  public trackDepartmentHealth(dept: string, status: string) {
    this.record('department.health', status === 'OPERATIONAL' ? 1 : 0, { department: dept });
  }

  public trackEvent(name: string, data: any = {}) {
    this.logger.info('EVENT', `Tracking event: ${name}`, data);
    this.record(`event.${name}`, 1, data);
  }
}
