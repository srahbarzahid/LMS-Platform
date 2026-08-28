import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";

// Polyfill performance observer entries to guarantee valid entry objects with startTime
if (typeof window !== "undefined") {
  const sanitizeEntries = (entries) =>
    Array.isArray(entries) ? entries.filter((e) => e && typeof e.startTime !== "undefined") : entries;

  if (window.performance) {
    ["getEntries", "getEntriesByType", "getEntriesByName"].forEach((method) => {
      const orig = window.performance[method];
      if (typeof orig === "function") {
        window.performance[method] = function (...args) {
          return sanitizeEntries(orig.apply(this, args));
        };
      }
    });
  }

  if (window.PerformanceObserverEntryList) {
    ["getEntries", "getEntriesByType", "getEntriesByName"].forEach((method) => {
      const orig = window.PerformanceObserverEntryList.prototype[method];
      if (typeof orig === "function") {
        window.PerformanceObserverEntryList.prototype[method] = function (...args) {
          return sanitizeEntries(orig.apply(this, args));
        };
      }
    });
  }

  // Suppress non-application browser extension / VM observer script errors
  window.addEventListener(
    "error",
    (event) => {
      if (
        event.message?.includes("startTime") ||
        event.message?.includes("reportAllChanges") ||
        (event.filename && event.filename.includes("anonymous"))
      ) {
        event.preventDefault();
        event.stopPropagation();
      }
    },
    true
  );

  window.addEventListener("unhandledrejection", (event) => {
    if (
      event.reason?.message?.includes("startTime") ||
      event.reason?.stack?.includes("reportAllChanges")
    ) {
      event.preventDefault();
    }
  });
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </ThemeProvider>
  </StrictMode>
);
