import React from 'react';

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null, errorInfo: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Ошибка в React:', error, errorInfo);
    window.parent.postMessage({
      type: 'reactError',
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    }, '*');
  }

  render() {
    const TS = Date.now();
    if (this.state.hasError) {
      return <h1 data-easytag={`${TS}-src/ErrorBoundary.js-fallback`}>Что-то пошло не так.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
