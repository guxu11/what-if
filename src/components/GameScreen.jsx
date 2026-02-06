import { useTranslation } from "../i18n/useTranslation";
import { getScenario } from "../data/scenarios";

export function GameScreen({
  currentScenario,
  currentNode,
  pathHistory,
  progress,
  insight,
  isComplete,
  onMakeChoice,
  onSave,
  onReturnToMenu,
  onCopyInsight,
  onStartNewGame,
}) {
  const { t } = useTranslation();
  const scenario = getScenario(currentScenario);

  if (!scenario) return null;

  const totalSteps = 3;
  const progressPercent = Math.min((progress / totalSteps) * 100, 100);

  const handleMouseEnter = () => {
    if (window.playSoundEffect) {
      window.playSoundEffect("hover");
    }
  };

  return (
    <div className="screen active">
      <div className={`game-area theme-${currentScenario}`}>
        <div className="game-header">
          <div>
            <h2>{scenario.title}</h2>
            <p className="scenario-title">{scenario.description}</p>
          </div>
          <div className="actions">
            <button className="btn btn-secondary" onClick={onSave} onMouseEnter={handleMouseEnter}>
              💾 {t("game.save")}
            </button>
            <button
              className="btn btn-warning"
              onClick={onReturnToMenu}
              onMouseEnter={handleMouseEnter}
            >
              🏠 {t("game.return")}
            </button>
          </div>
        </div>

        <div className="progress">
          <div className="progress-bar" style={{ width: `${progressPercent}%` }}></div>
        </div>

        {pathHistory.length > 0 && (
          <div className="path-history">
            <h3>{t("game.history")}</h3>
            {pathHistory.map((item, index) => (
              <div key={index} className="path-item">
                <strong>
                  {t("story.chapter")} {index + 1}:
                </strong>{" "}
                {item.choice}
              </div>
            ))}
          </div>
        )}

        {!isComplete ? (
          <>
            <div id="narrative-container">
              <div className="narrative">
                {currentNode?.text?.split("\n").map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            </div>

            <div className="choices">
              {currentNode?.choices?.map((choice, index) => (
                <button
                  key={index}
                  className="choice-btn"
                  onClick={() => onMakeChoice(choice)}
                  onMouseEnter={handleMouseEnter}
                >
                  <strong>{index + 1}.</strong> {choice.text}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="insight-container">
            <div className="insight-summary">
              <h3>💡 {t("game.insight")}</h3>
              <div className="insight-content">
                <p>
                  <strong>{t("game.history")}:</strong>
                </p>
                {pathHistory.map((item, index) => (
                  <p key={index}>
                    {index + 1}. {item.choice}
                  </p>
                ))}
                <hr style={{ margin: "20px 0", border: "none", borderTop: "1px solid #ddd" }} />
                <p>
                  <strong>💡 {t("game.insight")}:</strong>
                </p>
                <p>
                  {insight?.split("\n").map((line, index) => (
                    <span key={index}>
                      {line}
                      <br />
                    </span>
                  ))}
                </p>
                <hr style={{ margin: "20px 0", border: "none", borderTop: "1px solid #ddd" }} />
                <p>
                  <em>
                    Remember: The paths we imagine are just that - imagination. What matters most is
                    not road not taken, but how fully we walk the one we're on. Live in the present.
                    No regrets. ✨
                  </em>
                </p>
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <button
                className="btn btn-primary"
                onClick={onCopyInsight}
                onMouseEnter={handleMouseEnter}
              >
                📋 {t("game.copy")}
              </button>
              <button
                className="btn btn-success"
                onClick={onStartNewGame}
                onMouseEnter={handleMouseEnter}
              >
                🔄 {t("game.new")}
              </button>
              <button
                className="btn btn-secondary"
                onClick={onReturnToMenu}
                onMouseEnter={handleMouseEnter}
              >
                🏠 {t("game.return")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
