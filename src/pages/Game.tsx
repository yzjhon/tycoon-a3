
import { useState, useEffect, useCallback } from 'react';
import InvestmentModal from '@/components/InvestmentModal';
import ResultsModal from '@/components/ResultsModal';
import GameHUD from '@/components/GameHUD';
import GameMap from '@/components/GameMap';
import GameSidebar from '@/components/GameSidebar';
import { useGameState } from '@/hooks/useGameState';
import { useGameTimer } from '@/hooks/useGameTimer';
import { toast } from 'sonner';

const Game = () => {
  const gameState = useGameState();
  const {
    playerPosition,
    setPlayerPosition,
    capital,
    sustainability,
    round,
    playerName,
    currentInvestments,
    isInvestmentModalOpen,
    setIsInvestmentModalOpen,
    selectedStation,
    setSelectedStation,
    isResultsModalOpen,
    roundResults,
    setRoundResults,
    setSustainability,
    setCapital,
    calculateResults,
    handleInvestment,
    handleResultsClose
  } = gameState;

  const finishRound = useCallback(() => {
    const results = calculateResults();
    setRoundResults(results);
    setCapital(results.newCapital);
    setSustainability(results.newSustainability);
    
    localStorage.setItem('capital', results.newCapital.toString());
    localStorage.setItem('sustainability', results.newSustainability.toString());
    localStorage.setItem('round', (round + 1).toString());
    
    setIsInvestmentModalOpen(false);
  }, [calculateResults, round, setRoundResults, setCapital, setSustainability, setIsInvestmentModalOpen]);

  const timer = useGameTimer({
    currentInvestments,
    onRoundFinish: finishRound
  });

  const stations = [
    { type: 'hr', position: { x: 100, y: 100 } },
    { type: 'innovation', position: { x: 380, y: 100 } },
    { type: 'marketing', position: { x: 100, y: 380 } },
    { type: 'production', position: { x: 380, y: 380 } },
  ];

  const getInteractableStation = useCallback(() => {
    for (const station of stations) {
      const isNear = Math.abs(playerPosition.x - station.position.x) < 50 && 
                     Math.abs(playerPosition.y - station.position.y) < 50;
      if (isNear) {
        return station.type;
      }
    }
    return null;
  }, [playerPosition]);

  const [interactableStationType, setInteractableStationType] = useState<string | null>(null);

  useEffect(() => {
    setInteractableStationType(getInteractableStation());
  }, [playerPosition, getInteractableStation]);

  const handleStationInteract = useCallback((stationType: string) => {
    setSelectedStation(stationType);
    setIsInvestmentModalOpen(true);
  }, [setSelectedStation, setIsInvestmentModalOpen]);

  const handleInvestButtonClick = useCallback(() => {
    const stationType = getInteractableStation();
    if (stationType) {
      setSelectedStation(stationType);
      setIsInvestmentModalOpen(true);
    } else {
      toast.info("Aproxime-se de uma estação para abrir o menu de investimento.");
    }
  }, [getInteractableStation, setSelectedStation, setIsInvestmentModalOpen]);

  const handleResultsCloseWithTimer = useCallback(() => {
    handleResultsClose();
    if (round < 3) {
      timer.resetTimer();
    }
  }, [handleResultsClose, round, timer]);

  useEffect(() => {
    if (roundResults.profit !== 0 && !isResultsModalOpen) {
      setIsInvestmentModalOpen(true);
    }
  }, [roundResults, isResultsModalOpen, setIsInvestmentModalOpen]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pixel-green to-pixel-blue p-4">
      <div className="max-w-6xl mx-auto">
        <GameHUD
          playerName={playerName}
          capital={capital}
          sustainability={sustainability}
          round={round}
          timeRemaining={timer.timeRemaining}
          formatTime={timer.formatTime}
        />

        <div className="flex flex-col lg:flex-row gap-4">
          <GameMap
            playerPosition={playerPosition}
            onPlayerMove={setPlayerPosition}
            onStationInteract={handleStationInteract}
          />

          <GameSidebar
            currentInvestments={currentInvestments}
            interactableStationType={interactableStationType}
            round={round}
            onInvestButtonClick={handleInvestButtonClick}
            onFinishRound={timer.finishRound}
          />
        </div>
      </div>

      <InvestmentModal
        isOpen={isInvestmentModalOpen}
        stationType={selectedStation}
        onClose={() => setIsInvestmentModalOpen(false)}
        onInvest={handleInvestment}
        currentCapital={capital}
      />

      <ResultsModal
        isOpen={isResultsModalOpen}
        results={roundResults}
        round={round}
        onClose={handleResultsCloseWithTimer}
      />
    </div>
  );
};

export default Game;
