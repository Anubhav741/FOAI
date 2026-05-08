import { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[300px] gap-4 glass-card p-8 text-center">
          <div className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
            <AlertTriangle size={28} />
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-1" style={{ color: 'var(--color-text)' }}>
              Something went wrong
            </h2>
            <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
          </div>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-80"
            style={{ background: 'var(--color-primary)', color: '#fff' }}
          >
            <RefreshCw size={14} />
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
