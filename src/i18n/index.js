// Internationalization module exports

export { TranslationProvider, useTranslation, withTranslation } from "./useTranslation";
export { translate, getTranslation, translations, supportedLanguages } from "./translations";
export {
  detectLanguage,
  getBrowserLanguage,
  getSupportedLanguages,
  isLanguageSupported,
} from "./languageDetection";
