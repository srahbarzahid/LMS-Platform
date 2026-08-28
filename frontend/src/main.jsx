import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";

// Suppress non-application browser extension / VM observer script errors
if (typeof window !== "undefined") {
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
