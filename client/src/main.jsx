import React from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "react-hot-toast";
import App from "./App";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import { MotionConfig } from "framer-motion";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <MotionConfig reducedMotion="user">
          <HelmetProvider>
            <AuthProvider>
              <App />
              <Toaster position="top-right" toastOptions={{ style: { background: "rgb(var(--surface))", color: "rgb(var(--ink))", border: "1px solid rgb(var(--slate-200))" } }} />
            </AuthProvider>
          </HelmetProvider>
        </MotionConfig>
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
