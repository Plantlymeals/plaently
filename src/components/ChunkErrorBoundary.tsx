import { Component, ReactNode } from "react";
import {
  getChunkErrorMessage,
  isChunkLoadError,
  reloadOnceForChunkError,
} from "@/lib/chunkReload";

type ChunkErrorBoundaryProps = {
  children: ReactNode;
};

type ChunkErrorBoundaryState = {
  hasError: boolean;
  isChunkError: boolean;
  message: string;
};

class ChunkErrorBoundary extends Component<
  ChunkErrorBoundaryProps,
  ChunkErrorBoundaryState
> {
  state: ChunkErrorBoundaryState = {
    hasError: false,
    isChunkError: false,
    message: "",
  };

  static getDerivedStateFromError(error: unknown): ChunkErrorBoundaryState {
    return {
      hasError: true,
      isChunkError: isChunkLoadError(error),
      message: getChunkErrorMessage(error),
    };
  }

  componentDidCatch(error: unknown) {
    reloadOnceForChunkError(error);
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const title = this.state.isChunkError
      ? "Updating PLÄNTLY"
      : "Something went wrong";

    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
        <section className="w-full max-w-md space-y-4 text-center">
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="text-sm text-muted-foreground">
            {this.state.isChunkError
              ? "The newest version is loading. If it does not continue automatically, refresh the page."
              : this.state.message || "Please refresh the page."}
          </p>
          <button
            type="button"
            className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            onClick={() => window.location.reload()}
          >
            Refresh
          </button>
        </section>
      </main>
    );
  }
}

export default ChunkErrorBoundary;