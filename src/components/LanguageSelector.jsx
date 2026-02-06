import { useTranslation } from "../i18n/useTranslation";

const supportedLanguages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "pt", name: "Português", flag: "🇧🇷" },
];

export function LanguageSelector() {
  const { language, autoDetect, changeLanguage, enableAutoDetect, t } = useTranslation();

  return (
    <div className="language-selector">
      <label htmlFor="language-select">
        <span className="label-icon">🌐</span>
        {t("language.select")}:
      </label>
      <select
        id="language-select"
        value={autoDetect ? "auto" : language}
        onChange={e => {
          if (e.target.value === "auto") {
            enableAutoDetect();
          } else {
            changeLanguage(e.target.value);
          }
        }}
        className="language-select"
      >
        <option value="auto">{t("language.auto")}</option>
        {supportedLanguages.map(lang => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
      {autoDetect && (
        <span className="auto-indicator" title="Auto-detection enabled">
          ✨
        </span>
      )}
    </div>
  );
}
