import { Component, type ErrorInfo, type ReactNode } from "react"

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#F0FFF9]">
          <h1 className="text-2xl font-bold text-[#038E7D] mb-4">Oops, there was an error</h1>
          <p className="text-[#025E52] mb-4">
            Something went wrong. Please try refreshing the page or contact support if the problem persists.
          </p>
          <button
            className="px-4 py-2 bg-[#038E7D] text-white rounded hover:bg-[#025E52] transition-colors"
            onClick={() => this.setState({ hasError: false })}
          >
            Try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
