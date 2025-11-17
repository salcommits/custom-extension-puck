import React from 'react';
import { initializeBlock } from '@airtable/blocks/interface/ui';
import ExtensionRoot from './app/ExtensionRoot';
import './style.css';
import '@measured/puck/puck.css';

// Error boundary for the entire app
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-gray50 dark:bg-gray-gray800 p-4">
          <div className="bg-white dark:bg-gray-gray700 rounded-lg p-6 max-w-lg shadow-xl">
            <h1 className="text-2xl font-bold text-red-red mb-2">Something went wrong</h1>
            <p className="text-gray-gray600 dark:text-gray-gray300 mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-blue text-white rounded-md hover:bg-blue-blueDark1"
            >
              Reload Extension
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <ExtensionRoot />
    </ErrorBoundary>
  );
}

initializeBlock({ interface: () => <App /> });

