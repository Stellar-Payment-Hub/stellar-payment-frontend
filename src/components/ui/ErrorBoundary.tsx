import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RotateCcw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div
          className="card"
          data-testid="error-boundary-fallback"
          style={{
            margin: '1.5rem',
            padding: '2rem',
            textAlign: 'center',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            background: 'rgba(239, 68, 68, 0.05)',
          }}
        >
          <AlertOctagon size={36} className="text-danger" style={{ margin: '0 auto 0.75rem auto' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem' }}>
            Application Encountered an Unexpected Error
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem', maxWidth: '450px', margin: '0 auto 1rem auto' }}>
            {this.state.error?.message || 'An unexpected runtime error occurred.'}
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={this.handleReset}
            data-testid="error-boundary-retry-btn"
          >
            <RotateCcw size={15} /> Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
