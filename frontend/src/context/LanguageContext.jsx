import React, { createContext, useContext, useState, useEffect } from "react";
import { translations } from "../i18n/translations";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem("app_language") || "English";
  });

  const changeLanguage = (newLang) => {
    if (!newLang) return;
    setLanguageState(newLang);
    localStorage.setItem("app_language", newLang);
    document.documentElement.setAttribute("lang", newLang.toLowerCase());
    document.documentElement.setAttribute("dir", newLang === "Arabic" ? "rtl" : "ltr");
    window.dispatchEvent(new Event("languageChange"));
  };

  useEffect(() => {
    const handleGlobalLanguageChange = () => {
      const savedLang = localStorage.getItem("app_language") || "English";
      setLanguageState(savedLang);
      document.documentElement.setAttribute("lang", savedLang.toLowerCase());
      document.documentElement.setAttribute("dir", savedLang === "Arabic" ? "rtl" : "ltr");
    };

    // Apply initial direction and lang
    document.documentElement.setAttribute("lang", language.toLowerCase());
    document.documentElement.setAttribute("dir", language === "Arabic" ? "rtl" : "ltr");

    window.addEventListener("languageChange", handleGlobalLanguageChange);
    return () => window.removeEventListener("languageChange", handleGlobalLanguageChange);
  }, [language]);

  /**
   * Translate function `t(key, fallback)`
   */
  const t = (key, fallback = "") => {
    const langDict = translations[language] || translations["English"];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    // Fallback to English dictionary if key missing in target language
    if (translations["English"] && translations["English"][key]) {
      return translations["English"][key];
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export const useTranslation = () => {
  const { t, language } = useLanguage();
  return { t, language };
};
