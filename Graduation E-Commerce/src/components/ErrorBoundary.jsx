import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gray-50 py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-red-600 mb-2">Something went wrong</h2>
                            <p className="text-gray-600 mb-4">{this.state.error?.message}</p>
                            <p className="text-gray-500 text-sm mb-8">
                                <code className="bg-gray-100 p-2 rounded">{this.state.error?.toString()}</code>
                            </p>
                            <button
                                onClick={() => window.location.reload()}
                                className="inline-block px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                            >
                                Reload Page
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
