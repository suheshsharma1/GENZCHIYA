import React from 'react';

type ErrorBoundaryProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('AppErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div style={{ padding: 24, fontFamily: 'sans-serif', color: '#b00020', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fef2f2' }}>
          <div style={{ maxWidth: 560, width: '100%', background: 'white', borderRadius: 16, padding: 32, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid #fecaca' }}>
            <h1 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12, color: '#991b1b' }}>⚠️ Something went wrong</h1>
            <p style={{ fontSize: 14, color: '#7f1d1d', marginBottom: 16, lineHeight: 1.6 }}>
              {this.state.error?.message || 'An unexpected error occurred.'}
            </p>
            <pre style={{ whiteSpace: 'pre-wrap', marginTop: 12, fontSize: 11, background: '#fef2f2', padding: 12, borderRadius: 8, color: '#991b1b' }}>
              {this.state.error?.stack}
            </pre>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              style={{ marginTop: 16, padding: '10px 20px', cursor: 'pointer', background: '#b91c1c', color: 'white', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 14 }}
            >
              Try again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
