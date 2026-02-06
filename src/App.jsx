import { useState, useEffect } from "react";
import { useTranslation } from "./i18n/useTranslation";
import { useGameState } from "./hooks/useGameState";
import { getScenario } from "./data/scenarios";
import { LanguageSelector } from "./components/LanguageSelector";
import { MenuScreen } from "./components/MenuScreen";
import { GameScreen } from "./components/GameScreen";
import { LoadScreen } from "./components/LoadScreen";
import { CustomScenarioModal } from "./components/CustomScenarioModal";
import { SaveModal } from "./components/SaveModal";
import { Toast } from "./components/Toast";
import { AnimatedBackground } from "./components/AnimatedBackground";
import { AudioPlayer } from "./components/AudioPlayer";
import { TitleScreen } from "./components/TitleScreen";
import { Confetti } from "./components/Confetti";
import { SoundEffects } from "./components/SoundEffects";

function App() {
  const { t, language, detectAndSetLanguage } = useTranslation();
  const [customScenario, setCustomScenario] = useState(null);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [showTitle, setShowTitle] = useState(true);
  const [triggerConfetti, setTriggerConfetti] = useState(0);
  const [epicMode, setEpicMode] = useState(false);

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
    copyInsight,
  } = useGameState();

  // Auto-detect language from user input
  useEffect(() => {
    if (pathHistory.length > 0) {
      const lastChoice = pathHistory[pathHistory.length - 1];
      detectAndSetLanguage(lastChoice.choice);
    }
  }, [pathHistory, detectAndSetLanguage]);

  const handleStartGame = () => {
    if (window.playSoundEffect) {
      window.playSoundEffect("success");
    }
    setShowTitle(false);
  };

  const handleSelectScenario = scenarioId => {
    if (window.playSoundEffect) {
      window.playSoundEffect("choice");
    }
    if (scenarioId === "custom") {
      setShowCustomModal(true);
    } else {
      selectScenario(scenarioId);
    }
  };

  const handleMakeChoice = choice => {
    if (window.playSoundEffect) {
      window.playSoundEffect("click");
    }
    makeChoice(choice);
  };

  const handleCreateCustomScenario = scenario => {
    // Temporarily add the custom scenario to the scenarios object
    const scenarios = require("./data/scenarios").scenarios;
    scenarios[scenario.id] = scenario;
    selectScenario(scenario.id);
  };

  const handleSave = () => {
    setShowSaveModal(true);
  };

  const handleSaveGame = saveName => {
    const success = saveGame(saveName);
    if (success) {
      if (window.playSoundEffect) {
        window.playSoundEffect("save");
      }
      showToast(t("toast.success") + "! " + "Game saved successfully!", "success");
    } else {
      showToast(t("toast.error") + "! " + "Failed to save game", "error");
    }
  };

  const handleLoadGame = saveId => {
    if (window.playSoundEffect) {
      window.playSoundEffect("success");
    }
    const success = loadGame(saveId);
    if (success) {
      showToast(t("toast.success") + "! " + "Game loaded successfully!", "success");
    } else {
      showToast(t("toast.error") + "! " + "Failed to load game", "error");
    }
  };

  const handleDeleteGame = saveId => {
    if (window.confirm("Are you sure you want to delete this saved game?")) {
      deleteGame(saveId);
      showToast("Game deleted!", "info");
    }
  };

  const handleCopyInsight = () => {
    const success = copyInsight();
    if (success) {
      if (window.playSoundEffect) {
        window.playSoundEffect("success");
      }
      showToast(t("toast.success") + "! " + "Insight copied to clipboard!", "success");
    } else {
      showToast(t("toast.error") + "! " + "Failed to copy. Please select manually.", "error");
    }
  };

  const showToast = (message, type = "info") => {
    setToast({ message, type });
  };

  const handleToastClose = () => {
    setToast(null);
  };

  // Trigger confetti when game completes
  useEffect(() => {
    if (isComplete && triggerConfetti === 0) {
      setTriggerConfetti(triggerConfetti + 1);
      if (window.playSoundEffect) {
        window.playSoundEffect("insight");
      }
    }
  }, [isComplete, triggerConfetti]);

  const toggleEpicMode = () => {
    setEpicMode(!epicMode);
  };

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
            <div className="header-content">
              <div>
                <h1>{t("app.title")}</h1>
                <p className="subtitle">{t("app.subtitle")}</p>
              </div>
              <div className="header-controls">
                <LanguageSelector />
                <button
                  className={`epic-toggle ${epicMode ? "active" : ""}`}
                  onClick={toggleEpicMode}
                  title={epicMode ? t("epic.enabled") : t("epic.disabled")}
                >
                  {epicMode ? "⚔️" : "📖"} {t("epic.mode")}
                </button>
              </div>
            </div>
          </header>

          {currentScreen === "menu" && (
            <MenuScreen
              onSelectScenario={handleSelectScenario}
              onShowLoadScreen={() => setCurrentScreen("load")}
              epicMode={epicMode}
            />
          )}

          {currentScreen === "game" && (
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

          {currentScreen === "load" && (
            <LoadScreen
              savedGames={savedGames}
              onLoadGame={handleLoadGame}
              onDeleteGame={handleDeleteGame}
              onReturnToMenu={() => setCurrentScreen("menu")}
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

          {toast && <Toast message={toast.message} type={toast.type} onClose={handleToastClose} />}
        </div>
      )}

      {isComplete && <Confetti trigger={triggerConfetti} />}
    </>
  );
}

export default App;
