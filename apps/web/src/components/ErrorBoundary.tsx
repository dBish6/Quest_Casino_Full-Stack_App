import { Component } from "react";
import { logger } from "@qc/utils";
import { Error } from "@views/errors";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error("Application error:\n", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Error
          status={500}
          title="Application Error"
          description="An unexpected application error occurred. Sorry! Please try to refresh."
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
