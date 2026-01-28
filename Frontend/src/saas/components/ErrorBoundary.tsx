import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logger } from '../utils/logger';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class SaaSErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('Uncaught error in SaaS Component:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-6 m-4 bg-red-50 border border-red-200 rounded-lg max-w-lg mx-auto font-sans">
          <h2 className="text-xl font-bold text-red-800 mb-2">System Interruption</h2>
          <p className="text-red-600 mb-4">
            The Sovereign Interface encountered a critical anomaly. 
            The resilience protocol has isolated the fault.
          </p>
          <div className="bg-white p-3 rounded border border-red-100 text-sm font-mono text-gray-700 overflow-auto max-h-32">
            {this.state.error?.message || 'Unknown Error'}
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800 transition-colors"
          >
            Reinitialize System
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
