/**
 * ControlDashboard.ts - "The Command Center" (Frontend Adapter)
 * 
 * Adapts the QAntum "Layer 5" Logic for the React Interface.
 * Manages the state of the Sovereign Engine directly from the browser.
 */

// Simple Event Emitter for Browser
type Listener = (...args: any[]) => void;

class SimpleEventEmitter {
  private listeners: { [event: string]: Listener[] } = {};

  on(event: string, fn: Listener) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(fn);
  }

  emit(event: string, ...args: any[]) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(fn => fn(...args));
    }
  }
}

// Types
export type ControlMode = 'FULL_AUTONOMY' | 'HYBRID' | 'MANUAL_UX_OVERRIDE';

export interface DashboardState {
  controlMode: ControlMode;
  systemHealth: 'healthy' | 'degraded' | 'critical';
  activeWorkers: number;
  cpuUsage: number;
  threatLevel: 'safe' | 'caution' | 'warning' | 'danger';
}

export class ControlDashboard extends SimpleEventEmitter {
  private state: DashboardState;
  
  constructor() {
    super();
    this.state = {
      controlMode: 'FULL_AUTONOMY',
      systemHealth: 'healthy',
      activeWorkers: 47,
      cpuUsage: 12, // Idle rust state
      threatLevel: 'safe'
    };
    
    // Start heartbeat
    setInterval(() => this.updateSimulation(), 2000);
  }

  public getState(): DashboardState {
    return { ...this.state };
  }

  public setMode(mode: ControlMode) {
    console.log(`[COMMAND CENTER] Switching to ${mode}`);
    this.state.controlMode = mode;
    this.emit('stateDbCheck', this.state);
    
    // In a real app, this would send a WebSocket message to the Rust Backend
    // socket.emit('admin:setMode', mode);
  }

  private updateSimulation() {
    // Simulate live metrics for the UI
    if (this.state.controlMode === 'FULL_AUTONOMY') {
        this.state.cpuUsage = 40 + Math.random() * 20;
        this.state.activeWorkers = 47 + Math.floor(Math.random() * 5);
    } else {
        this.state.cpuUsage = 10 + Math.random() * 5;
    }
    
    this.emit('metrics', this.state);
  }
}

// Singleton Instance
export const nerveCenter = new ControlDashboard();
