import { Component } from "react";

// Shows a readable message instead of a blank white page if any component crashes.
export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("App crashed:", error, info?.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div style={{ maxWidth: 640, margin: "15vh auto", padding: 24, fontFamily: "system-ui, sans-serif" }}>
        <h1 style={{ fontSize: 24, marginBottom: 8 }}>Something went wrong</h1>
        <p style={{ color: "rgb(var(--slate-600))", marginBottom: 16 }}>The page hit an error. Try reloading. If it keeps happening, open the browser console (F12) for details.</p>
        <pre style={{ background: "rgb(var(--soft))", color: "rgb(var(--ink))", padding: 12, borderRadius: 8, overflow: "auto", fontSize: 13 }}>{String(this.state.error?.message || this.state.error)}</pre>
        <button onClick={() => window.location.reload()} style={{ marginTop: 16, padding: "10px 18px", borderRadius: 8, background: "#3B5BFF", color: "#fff", border: 0, cursor: "pointer" }}>Reload</button>
      </div>
    );
  }
}
