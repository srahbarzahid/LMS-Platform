import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(undefined);

const ThemeProvider = ({ children }) => {
  const getIsDark = () => {
    const savedTheme = localStorage.getItem("app_theme") || localStorage.getItem("theme");
    return savedTheme === "Dark" || savedTheme === "dark" || (savedTheme === "System" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
  };

  const [theme, setTheme] = useState(() => (getIsDark() ? "dark" : "light"));

  useEffect(() => {
    const handleThemeChange = () => {
      const isDark = getIsDark();
      setTheme(isDark ? "dark" : "light");
      if (isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    handleThemeChange();
    window.addEventListener("themeChange", handleThemeChange);
    return () => window.removeEventListener("themeChange", handleThemeChange);
  }, []);

  const toggleTheme = async () => {
    const nextTheme = theme === "dark" ? "Light" : "Dark";
    localStorage.setItem("app_theme", nextTheme);
    localStorage.setItem("theme", nextTheme.toLowerCase());
    setTheme(nextTheme.toLowerCase());
    if (nextTheme === "Dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    window.dispatchEvent(new Event("themeChange"));

    try {
      const token = localStorage.getItem("token");
      if (token) {
        await fetch("/api/instructor/settings/preferences", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ theme: nextTheme })
        });
      }
    } catch (e) {
      // Background save, ignore network issues
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export { ThemeProvider, useTheme };
