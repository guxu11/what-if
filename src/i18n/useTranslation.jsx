// React hook for internationalization
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { translate, getTranslation } from "./translations";
import { detectLanguage, getBrowserLanguage } from "./languageDetection";

const TranslationContext = createContext(null);

// LocalStorage key for language preference
const LANGUAGE_KEY = "whatif-language";

/**
 * Translation Provider component
 * Wraps the app to provide translation functionality
 */
export function TranslationProvider({ children }) {
  const [language, setLanguage] = useState("en");
  const [autoDetect, setAutoDetect] = useState(true);

  // Load language preference from localStorage on mount
  useEffect(() => {
    const savedLang = localStorage.getItem(LANGUAGE_KEY);
    if (savedLang) {
      setLanguage(savedLang);
    } else {
      // Use browser language as initial preference
      setLanguage(getBrowserLanguage());
    }
  }, []);

  // Save language preference to localStorage when it changes
  useEffect(() => {
    if (!autoDetect) {
      localStorage.setItem(LANGUAGE_KEY, language);
    }
  }, [language, autoDetect]);

  /**
   * Translate a key with optional parameters
   */
  const t = useCallback(
    (key, params = {}) => {
      return getTranslation(key, language, params);
    },
    [language]
  );

  /**
   * Change the current language
   */
  const changeLanguage = useCallback(newLang => {
    setLanguage(newLang);
    setAutoDetect(false);
  }, []);

  /**
   * Enable auto-detection mode
   */
  const enableAutoDetect = useCallback(() => {
    setAutoDetect(true);
  }, []);

  /**
   * Detect language from text and switch to it
   */
  const detectAndSetLanguage = useCallback(
    text => {
      if (autoDetect) {
        const detectedLang = detectLanguage(text);
        if (detectedLang && detectedLang !== language) {
          setLanguage(detectedLang);
        }
      }
      return language;
    },
    [autoDetect, language]
  );

  const value = {
    language,
    autoDetect,
    t,
    translate,
    changeLanguage,
    enableAutoDetect,
    detectAndSetLanguage,
  };

  return <TranslationContext.Provider value={value}>{children}</TranslationContext.Provider>;
}

/**
 * Hook to use the translation context
 * @returns {Object} Translation functions and current language
 */
export function useTranslation() {
  const context = useContext(TranslationContext);

  if (!context) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }

  return context;
}

/**
 * Higher-order component to inject translation props
 */
export function withTranslation(WrappedComponent) {
  return function WithTranslationComponent(props) {
    const translation = useTranslation();

    return <WrappedComponent {...props} {...translation} />;
  };
}
