export function LoadScreen({ savedGames, onLoadGame, onDeleteGame, onReturnToMenu }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  return (
    <div className="screen active">
      <div className="card">
        <h2>📂 Saved Games</h2>
        {savedGames.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-light)' }}>
            No saved games yet. Play a scenario and save your progress!
          </p>
        ) : (
          <div className="saved-games">
            {savedGames.map((save) => (
              <div key={save.id} className="saved-game-item">
                <div>
                  <h4>{save.name}</h4>
                  <div className="meta">
                    Scenario: {save.scenarioData?.title} | Progress: Step {save.progress + 1} | {formatDate(save.date)}
                  </div>
                </div>
                <div className="actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => onLoadGame(save.id)}
                  >
                    Load
                  </button>
                  <button
                    className="btn btn-warning"
                    onClick={() => onDeleteGame(save.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <div style={{ textAlign: 'center' }}>
          <button className="btn btn-primary" onClick={onReturnToMenu}>
            🏠 Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
}
