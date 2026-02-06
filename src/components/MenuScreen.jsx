import { useTranslation } from "../i18n/useTranslation";
import { getAllScenarios } from "../data/scenarios";
import { createDemonstrationScenario } from "../data/epicScenarios";

export function MenuScreen({ onSelectScenario, onShowLoadScreen, epicMode = false }) {
  const { t } = useTranslation();
  const scenarios = getAllScenarios();

  const handleMouseEnter = () => {
    if (window.playSoundEffect) {
      window.playSoundEffect("hover");
    }
  };

  const handleStartEpicScenario = () => {
    const engine = createDemonstrationScenario();
    // For now, we'll just trigger a custom scenario with the epic data
    // In a full implementation, this would integrate with the narrative engine
    onSelectScenario("epic");
  };

  return (
    <div className="screen active">
      <div className="card">
        <h2>{t("menu.title")}</h2>
        <p>{t("menu.subtitle")}</p>

        {epicMode && (
          <div className="epic-banner">
            <div className="epic-badge">⚔️ EPIC MODE</div>
            <p>
              Experience deeper stories with consequences, state tracking, and multiple endings!
            </p>
          </div>
        )}

        <div className="scenario-grid">
          {epicMode && (
            <div
              className="scenario-card epic-card"
              onClick={handleStartEpicScenario}
              onMouseEnter={handleMouseEnter}
            >
              <div className="icon">🏰</div>
              <h3>The King's Destiny</h3>
              <p>
                A medieval epic of political intrigue, rebellion, and destiny. Multiple chapters,
                10+ endings, and deep state tracking.
              </p>
              <span className="tag epic-tag">EPIC • 8 Chapters</span>
            </div>
          )}

          {scenarios.map(scenario => (
            <div
              key={scenario.id}
              className="scenario-card"
              onClick={() => onSelectScenario(scenario.id)}
              onMouseEnter={handleMouseEnter}
            >
              <div className="icon">{scenario.icon}</div>
              <h3>{scenario.title}</h3>
              <p>{scenario.description}</p>
              <span className="tag">Life Crossroads</span>
            </div>
          ))}

          <div
            className="scenario-card"
            onClick={() => onSelectScenario("custom")}
            onMouseEnter={handleMouseEnter}
          >
            <div className="icon">🎨</div>
            <h3>{t("scenario.custom")}</h3>
            <p>Define your own crossroads and explore the possibilities</p>
            <span className="tag">{t("custom.title")}</span>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "30px" }}>
          <button
            className="btn btn-secondary"
            onClick={onShowLoadScreen}
            onMouseEnter={handleMouseEnter}
          >
            📂 {t("menu.load")}
          </button>
        </div>
      </div>
    </div>
  );
}
