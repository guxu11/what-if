import { getAllScenarios } from '../data/scenarios';

export function MenuScreen({ onSelectScenario, onShowLoadScreen }) {
  const scenarios = getAllScenarios();

  const handleMouseEnter = () => {
    if (window.playSoundEffect) {
      window.playSoundEffect('hover');
    }
  };

  return (
    <div className="screen active">
      <div className="card">
        <h2>Choose Your Scenario</h2>
        <p>Select a life crossroads to explore, or create your own.</p>

        <div className="scenario-grid">
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
            onClick={() => onSelectScenario('custom')}
            onMouseEnter={handleMouseEnter}
          >
            <div className="icon">🎨</div>
            <h3>Create Your Own</h3>
            <p>Define your own crossroads and explore the possibilities</p>
            <span className="tag">Custom</span>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button
            className="btn btn-secondary"
            onClick={onShowLoadScreen}
            onMouseEnter={handleMouseEnter}
          >
            📂 Load Saved Game
          </button>
        </div>
      </div>
    </div>
  );
}
