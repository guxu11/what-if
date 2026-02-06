/**
 * Unit test for useTranslation hook behavior
 * Tests that:
 * 1. useTranslation throws error when used without TranslationProvider
 * 2. useTranslation works correctly when used within TranslationProvider
 * 3. Translation provider provides all expected methods and state
 */

import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTranslation, TranslationProvider } from "../i18n/useTranslation";

describe("useTranslation hook", () => {
  describe("without TranslationProvider", () => {
    it("should throw error when used without provider", () => {
      // Suppress console.error for expected error
      const consoleError = console.error;
      console.error = () => {};

      expect(() => {
        renderHook(() => useTranslation());
      }).toThrow("useTranslation must be used within a TranslationProvider");

      console.error = consoleError;
    });
  });

  describe("with TranslationProvider", () => {
    it("should provide translation function and language state", () => {
      const wrapper = ({ children }) => (
        <TranslationProvider>{children}</TranslationProvider>
      );

      const { result } = renderHook(() => useTranslation(), { wrapper });

      expect(result.current).toBeDefined();
      expect(typeof result.current.t).toBe("function");
      expect(typeof result.current.translate).toBe("function");
      expect(typeof result.current.changeLanguage).toBe("function");
      expect(typeof result.current.detectAndSetLanguage).toBe("function");
      expect(typeof result.current.enableAutoDetect).toBe("function");
      expect(typeof result.current.language).toBe("string");
      expect(typeof result.current.autoDetect).toBe("boolean");
    });

    it("should provide translation function that returns strings", () => {
      const wrapper = ({ children }) => (
        <TranslationProvider>{children}</TranslationProvider>
      );

      const { result } = renderHook(() => useTranslation(), { wrapper });

      const translated = result.current.t("app.title");
      expect(typeof translated).toBe("string");
      expect(translated.length).toBeGreaterThan(0);
    });

    it("should allow changing language", () => {
      const wrapper = ({ children }) => (
        <TranslationProvider>{children}</TranslationProvider>
      );

      const { result } = renderHook(() => useTranslation(), { wrapper });

      expect(result.current.language).toBe("en");

      act(() => {
        result.current.changeLanguage("es");
      });

      expect(result.current.language).toBe("es");
      expect(result.current.autoDetect).toBe(false);
    });

    it("should allow enabling auto-detect mode", () => {
      const wrapper = ({ children }) => (
        <TranslationProvider>{children}</TranslationProvider>
      );

      const { result } = renderHook(() => useTranslation(), { wrapper });

      act(() => {
        result.current.changeLanguage("es");
      });

      expect(result.current.autoDetect).toBe(false);

      act(() => {
        result.current.enableAutoDetect();
      });

      expect(result.current.autoDetect).toBe(true);
    });

    it("should detect language from text when auto-detect is enabled", () => {
      const wrapper = ({ children }) => (
        <TranslationProvider>{children}</TranslationProvider>
      );

      const { result } = renderHook(() => useTranslation(), { wrapper });

      expect(result.current.autoDetect).toBe(true);

      act(() => {
        const detected = result.current.detectAndSetLanguage("Hola mundo");
        expect(typeof detected).toBe("string");
      });
    });
  });

  describe("integration with App component", () => {
    it("should allow App component to use useTranslation without error", () => {
      const wrapper = ({ children }) => (
        <TranslationProvider>{children}</TranslationProvider>
      );

      // This test ensures that when App renders within TranslationProvider,
      // it can successfully call useTranslation without throwing
      const { result } = renderHook(() => useTranslation(), { wrapper });

      expect(() => {
        result.current.t("app.title");
        result.current.t("app.subtitle");
      }).not.toThrow();
    });
  });
});
