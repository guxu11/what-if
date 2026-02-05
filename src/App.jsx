import { useState } from 'react';
import { useGameState } from './hooks/useGameState';
import { getScenario } from './data/scenarios';
import { MenuScreen } from './components/MenuScreen';
import { GameScreen } from './components/GameScreen';
import { LoadScreen } from './components/LoadScreen';
import { CustomScenarioModal } from './components/CustomScenarioModal';
import { SaveModal } from './components/SaveModal';
import { Toast } from './components/Toast';

function App() {
  const [customScenario, setCustomScenario] = useState(null);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [toast, setToast] = useState(null);

  const {
    currentScreen,
    currentScenario,
    currentNode,
    pathHistory,
    progress,
    insight,
    isComplete,
    savedGames,
    setCurrentScreen,
    selectScenario,
    makeChoice,
    resetGame,
    saveGame,
    loadGame,
    deleteGame,
    copyInsight
  } = useGameState();

  const handleSelectScenario = (scenarioId) => {
    if (scenarioId === 'custom') {
      setShowCustomModal(true);
    } else {
      selectScenario(scenarioId);
    }
  };

  const handleCreateCustomScenario = (scenario) => {
    // Temporarily add the custom scenario to the scenarios object
    const scenarios = require('./data/scenarios').scenarios;
    scenarios[scenario.id] = scenario;
    selectScenario(scenario.id);
  };

  const handleSave = () => {
    setShowSaveModal(true);
  };

  const handleSaveGame = (saveName) => {
    const success = saveGame(saveName);
    if (success) {
      showToast('Game saved successfully!', 'success');
    } else {
      showToast('Failed to save game', 'error');
    }
  };

  const handleLoadGame = (saveId) => {
    const success = loadGame(saveId);
    if (success) {
      showToast('Game loaded successfully!', 'success');
    } else {
      showToast('Failed to load game', 'error');
    }
  };

  const handleDeleteGame = (saveId) => {
    if (window.confirm('Are you sure you want to delete this saved game?')) {
      deleteGame(saveId);
      showToast('Game deleted!', 'info');
    }
  };

  const handleCopyInsight = () => {
    const success = copyInsight();
    if (success) {
      showToast('Insight copied to clipboard!', 'success');
    } else {
      showToast('Failed to copy. Please select manually.', 'error');
    }
  };

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const handleToastClose = () => {
    setToast(null);
  };

  return (
    <div className="container">
      <header>
        <h1>🌟 What-If Game</h1>
        <p className="subtitle">Explore alternate paths. Discover yourself. Live in the present.</p>
      </header>

      {currentScreen === 'menu' && (
        <MenuScreen
          onSelectScenario={handleSelectScenario}
          onShowLoadScreen={() => setCurrentScreen('load')}
        />
      )}

      {currentScreen === 'game' && (
        <GameScreen
          currentScenario={currentScenario}
          currentNode={currentNode}
          pathHistory={pathHistory}
          progress={progress}
          insight={insight}
          isComplete={isComplete}
          onMakeChoice={makeChoice}
          onSave={handleSave}
          onReturnToMenu={resetGame}
          onCopyInsight={handleCopyInsight}
          onStartNewGame={resetGame}
        />
      )}

      {currentScreen === 'load' && (
        <LoadScreen
          savedGames={savedGames}
          onLoadGame={handleLoadGame}
          onDeleteGame={handleDeleteGame}
          onReturnToMenu={() => setCurrentScreen('menu')}
        />
      )}

      <CustomScenarioModal
        isOpen={showCustomModal}
        onClose={() => setShowCustomModal(false)}
        onCreateScenario={handleCreateCustomScenario}
      />

      <SaveModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={handleSaveGame}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={handleToastClose}
        />
      )}
    </div>
  );
}

export default App;
