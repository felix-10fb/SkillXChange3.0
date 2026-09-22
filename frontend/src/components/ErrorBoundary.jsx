import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("React Error Boundary Caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#110B22',
          color: '#FAF6F0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          textAlign: 'center',
          fontFamily: 'sans-serif'
        }}>
          <div style={{
            background: 'rgba(222, 94, 68, 0.15)',
            border: '1px solid #DE5E44',
            padding: '2rem',
            borderRadius: '20px',
            maxWidth: '500px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }}>
            <h2 style={{ color: '#DE5E44', fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 'bold' }}>
              SkillXChange Application Notice
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#C4B9E3', marginBottom: '1.5rem' }}>
              {this.state.error?.message || "An error occurred while loading the page."}
            </p>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = '/';
              }}
              style={{
                backgroundColor: '#DE5E44',
                color: '#FFFFFF',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '12px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Reset & Reload Platform
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
