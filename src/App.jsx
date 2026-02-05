import { useState } from 'react';
import { useGameState } from './hooks/useGameState';
import { getScenario } from './data/scenarios';
import { MenuScreen } from './components/MenuScreen';
import { GameScreen } from './components/GameScreen';
import { LoadScreen } from './components/LoadScreen';
import { CustomScenarioModal } from './components/CustomScenarioModal';
import { SaveModal } from './components/SaveModal';
import { Toast } from './components/Toast';
import { AnimatedBackground } from './components/AnimatedBackground';
import { AudioPlayer } from './components/AudioPlayer';
import { TitleScreen } from './components/TitleScreen';
import { Confetti } from './components/Confetti';
import { SoundEffects } from './components/SoundEffects';

function App() {
  const [customScenario, setCustomScenario] = useState(null);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [showTitle, setShowTitle] = useState(true);
  const [triggerConfetti, setTriggerConfetti] = useState(0);

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

  const handleStartGame = () => {
    if (window.playSoundEffect) {
      window.playSoundEffect('success');
    }
    setShowTitle(false);
  };

  const handleSelectScenario = (scenarioId) => {
    if (window.playSoundEffect) {
      window.playSoundEffect('choice');
    }
    if (scenarioId === 'custom') {
      setShowCustomModal(true);
    } else {
      selectScenario(scenarioId);
    }
  };

  const handleMakeChoice = (choice) => {
    if (window.playSoundEffect) {
      window.playSoundEffect('click');
    }
    makeChoice(choice);
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
      if (window.playSoundEffect) {
        window.playSoundEffect('save');
      }
      showToast('Game saved successfully!', 'success');
    } else {
      showToast('Failed to save game', 'error');
    }
  };

  const handleLoadGame = (saveId) => {
    if (window.playSoundEffect) {
      window.playSoundEffect('success');
    }
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
      if (window.playSoundEffect) {
        window.playSoundEffect('success');
      }
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

  // Trigger confetti when game completes
  useState(() => {
    if (isComplete && triggerConfetti === 0) {
      setTriggerConfetti(triggerConfetti + 1);
      if (window.playSoundEffect) {
        window.playSoundEffect('insight');
      }
    }
  });

  return (
    <>
      <SoundEffects />
      <AnimatedBackground />
      <AudioPlayer />

      {showTitle ? (
        <TitleScreen onStart={handleStartGame} />
      ) : (
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
              onMakeChoice={handleMakeChoice}
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
      )}

      {isComplete && <Confetti trigger={triggerConfetti} />}
    </>
  );
}

export default App;
