import { useState, useRef } from "react";
import { useTranslation } from "../i18n/useTranslation";

export function GLMStoryScreen({
  onStartStory,
  currentStory,
  choices,
  storyHistory,
  isComplete,
  insight,
  isLoading,
  error,
  language,
  onMakeChoice,
  onGenerateEnding,
  onReset,
  onReturnToMenu,
  onSetLanguage
}) {
  const { t } = useTranslation();
  const [inputScenario, setInputScenario] = useState("");
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showEndingPrompt, setShowEndingPrompt] = useState(false);
  const scrollRef = useRef(null);

  const handleStart = async (e) => {
    e.preventDefault();
    if (!inputScenario.trim()) return;

    await onStartStory(inputScenario);
  };

  const handleChoiceClick = async (choice) => {
    setSelectedChoice(choice);
    await onMakeChoice(choice.text || choice);
    setSelectedChoice(null);
  };

  const handleGenerateEnding = async () => {
    await onGenerateEnding(insight || currentStory);
    setShowEndingPrompt(false);
  };

  const handleReturnToMenu = () => {
    if (storyHistory.length > 0 && !isComplete && !showEndingPrompt) {
      if (window.confirm(t("game.return") + "? Your progress will be saved.")) {
        onReset();
        onReturnToMenu();
      }
    } else {
      onReset();
      onReturnToMenu();
    }
  };

  const handleLanguageChange = (newLanguage) => {
    onSetLanguage(newLanguage);
  };

  // Auto-scroll when story updates
  if (scrollRef.current && currentStory) {
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }

  if (!currentStory && !isLoading) {
    // Initial state - show input form
    return (
      <div className="screen active">
        <div className="card glm-intro">
          <div className="glm-header">
            <div className="glm-icon">🤖</div>
            <h2>AI-Powered Story</h2>
            <p>Enter any scenario in any language. AI will create an epic, soul-stirring story just for you.</p>
          </div>

          <form onSubmit={handleStart} className="glm-form">
            <div className="form-group">
              <label htmlFor="scenario-input">What story would you like to explore?</label>
              <textarea
                id="scenario-input"
                value={inputScenario}
                onChange={(e) => setInputScenario(e.target.value)}
                placeholder="Example: A young farmer discovers they have royal blood and must decide whether to claim the throne or stay with their simple life..."
                rows={5}
                className="glm-textarea"
              />
            </div>

            <div className="form-group">
              <label htmlFor="language-select">Story Language</label>
              <select
                id="language-select"
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="glm-select"
              >
                <option value="en">🇬🇧 English</option>
                <option value="es">🇪🇸 Español</option>
                <option value="fr">🇫🇷 Français</option>
                <option value="de">🇩🇪 Deutsch</option>
                <option value="zh">🇨🇳 中文</option>
                <option value="ja">🇯🇵 日本語</option>
                <option value="pt">🇧🇷 Português</option>
              </select>
            </div>

            <div className="glm-tips">
              <p><strong>Tips:</strong></p>
              <ul>
                <li>Write in any language - AI will generate in the same language</li>
                <li>Be specific for more detailed stories</li>
                <li>Or keep it open-ended for creative surprises</li>
                <li>Your choices shape the story uniquely</li>
              </ul>
            </div>

            <div className="glm-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleReturnToMenu}
              >
                ← {t("game.return")}
              </button>
              <button
                type="submit"
                className="btn btn-primary glm-start-btn"
                disabled={!inputScenario.trim() || isLoading}
              >
                {isLoading ? "✨ Creating..." : "🚀 Begin Story"}
              </button>
            </div>
          </form>

          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Story in progress
  return (
    <div className="screen active">
      <div className="card glm-story">
        <div className="glm-story-header">
          <button
            className="btn btn-secondary glm-back-btn"
            onClick={handleReturnToMenu}
          >
            ← {t("game.return")}
          </button>
          <div className="glm-language-badge">
            {language === 'en' && '🇬🇧 English'}
            {language === 'es' && '🇪🇸 Español'}
            {language === 'fr' && '🇫🇷 Français'}
            {language === 'de' && '🇩🇪 Deutsch'}
            {language === 'zh' && '🇨🇳 中文'}
            {language === 'ja' && '🇯🇵 日本語'}
            {language === 'pt' && '🇧🇷 Português'}
          </div>
        </div>

        <div className="glm-story-content" ref={scrollRef}>
          {storyHistory.map((event, index) => (
            <div key={index} className={`story-event ${event.type}`}>
              {event.type === 'choice' && (
                <div className="choice-event">
                  <div className="choice-label">You chose:</div>
                  <div className="choice-text">{event.content}</div>
                </div>
              )}
              {event.type === 'story' && (
                <div className="story-text">{event.content}</div>
              )}
              {event.type === 'ending' && (
                <div className="ending-text">
                  <div className="ending-label">✨ Your Journey's End ✨</div>
                  <div className="ending-content">{event.content}</div>
                </div>
              )}
            </div>
          ))}

          {currentStory && !isComplete && (
            <div className="story-text current-story">
              {currentStory}
            </div>
          )}

          {isComplete && insight && (
            <div className="ending-section">
              <div className="ending-label">✨ Your Journey's End ✨</div>
              <div className="ending-content">{insight}</div>
              <div className="ending-actions">
                <button
                  className="btn btn-primary"
                  onClick={handleReturnToMenu}
                >
                  {t("menu.start")}
                </button>
              </div>
            </div>
          )}
        </div>

        {isLoading && (
          <div className="glm-loading">
            <div className="loading-spinner"></div>
            <p>✨ Crafting your story...</p>
          </div>
        )}

        {!isComplete && !isLoading && choices.length > 0 && (
          <div className="glm-choices">
            <div className="choices-label">{t("choice.make")}</div>
            <div className="choices-grid">
              {choices.map((choice, index) => (
                <button
                  key={index}
                  className={`btn choice-btn ${selectedChoice === choice ? 'selected' : ''}`}
                  onClick={() => handleChoiceClick(choice)}
                  disabled={isLoading}
                >
                  {choice.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {!isComplete && !isLoading && choices.length === 0 && (
          <div className="glm-end-actions">
            <p>Would you like to end this story and receive a final reflection?</p>
            <div className="actions-grid">
              <button
                className="btn btn-secondary"
                onClick={() => setShowEndingPrompt(true)}
              >
                ✨ End Story & Get Reflection
              </button>
              <button
                className="btn btn-secondary"
                onClick={handleReturnToMenu}
              >
                ← {t("game.return")}
              </button>
            </div>
          </div>
        )}

        {showEndingPrompt && (
          <div className="glm-ending-prompt">
            <p>Generate a final reflection on your journey?</p>
            <div className="actions-grid">
              <button
                className="btn btn-primary"
                onClick={handleGenerateEnding}
                disabled={isLoading}
              >
                {isLoading ? "✨ Generating..." : "✨ Generate Reflection"}
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowEndingPrompt(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="error-message glm-error">
            ⚠️ {error}
          </div>
        )}
      </div>
    </div>
  );
}
