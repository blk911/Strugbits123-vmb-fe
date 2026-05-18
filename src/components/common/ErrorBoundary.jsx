import React from "react";

/**
 * Catches render errors in child tree so the rest of the app can keep running.
 * Must remain a class component (React has no hooks equivalent yet).
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    const { children, title = "Something went wrong" } = this.props;
    if (this.state.hasError) {
      const message =
        this.state.error?.message || "An unexpected error occurred.";
      return (
        <div
          className="rounded-[8px] border border-red-200 bg-red-50/90 p-6 font-poppins text-[#333232] shadow-sm"
          role="alert"
        >
          <h2 className="font-studio-serif text-xl font-semibold text-red-900">
            {title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-red-800/95">{message}</p>
          <button
            type="button"
            onClick={this.handleRetry}
            className="mt-4 inline-flex min-h-10 items-center justify-center rounded-[4px] border border-red-300/80 bg-white px-4 text-sm font-bold text-red-900 transition hover:bg-red-100/60"
          >
            Try again
          </button>
        </div>
      );
    }
    return children;
  }
}
