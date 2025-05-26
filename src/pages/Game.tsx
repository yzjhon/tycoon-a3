import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Player from '@/components/Player';
import Station from '@/components/Station';
import InvestmentModal from '@/components/InvestmentModal';
import ResultsModal from '@/components/ResultsModal';
import { toast } from 'sonner';

const Game = () => {
  const navigate = useNavigate();
  const [playerPosition, setPlayerPosition] = useState({ x: 240, y: 240 });
  const [capital, setCapital] = useState(50000);
  const [sustainability, setSustainability] = useState(50);
  const [round, setRound] = useState(1);
  const [playerName, setPlayerName] = useState('');
  
  const [currentInvestments, setCurrentInvestments] = useState<{[key: string]: number}>({});
  const [isInvestmentModalOpen, setIsInvestmentModalOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState('');
  const [isResultsModalOpen, setIsResultsModalOpen] = useState(false);
  const [roundResults, setRoundResults] = useState({
    profit: 0,
    sustainabilityChange: 0,
    newCapital: 0,
    newSustainability: 0,
  });

  // Timer state
  const [timeRemaining, setTimeRemaining] = useState(120); // 2 minutes in seconds
  const [isTimerActive, setIsTimerActive] = useState(true);

  const stations = [
    { type: 'production', position: { x: 100, y: 100 } },
    { type: 'innovation', position: { x: 300, y: 100 } },
    { type: 'marketing', position: { x: 100, y: 300 } },
    { type: 'hr', position: { x: 300, y: 300 } },
  ];

  useEffect(() => {
    const name = localStorage.getItem('playerName');
    if (!name) {
      navigate('/register');
      return;
    }
    
    setPlayerName(name);
    setCapital(parseInt(localStorage.getItem('capital') || '50000'));
    setSustainability(parseInt(localStorage.getItem('sustainability') || '50'));
    setRound(parseInt(localStorage.getItem('round') || '1'));
  }, [navigate]);

  const calculateResults = useCallback(() => {
    const investments = currentInvestments;
    const totalInvestment = Object.values(investments).reduce((sum, amount) => sum + amount, 0);
    
    if (totalInvestment === 0) {
      return {
        profit: -5000, // Penalidade por não investir
        sustainabilityChange: -10,
        newCapital: capital - 5000,
        newSustainability: Math.max(0, sustainability - 10)
      };
    }

    // Lógica simplificada baseada em sorte e investimentos
    const baseMultiplier = 0.5 + Math.random(); // 0.5 a 1.5
    const sustainabilityBonus = sustainability / 100;
    const balanceBonus = Object.keys(investments).length / 4; // Bônus por diversificar
    
    const totalMultiplier = baseMultiplier + sustainabilityBonus + balanceBonus;
    const profit = Math.round(totalInvestment * totalMultiplier - totalInvestment);
    
    // Mudança na sustentabilidade
    let sustainabilityChange = 0;
    if (investments.innovation) sustainabilityChange += 5;
    if (investments.hr) sustainabilityChange += 3;
    if (investments.production && !investments.innovation) sustainabilityChange -= 3;
    if (investments.marketing && !investments.hr) sustainabilityChange -= 2;
    
    // Adiciona aleatoriedade
    sustainabilityChange += Math.round((Math.random() - 0.5) * 10);
    
    const newCapitalCalculated = capital + profit;
    const newSustainabilityCalculated = Math.max(0, Math.min(100, sustainability + sustainabilityChange));
    
    return {
      profit,
      sustainabilityChange,
      newCapital: newCapitalCalculated,
      newSustainability: newSustainabilityCalculated
    };
  }, [currentInvestments, capital, sustainability]);

  const finishRound = useCallback(() => {
    setIsTimerActive(false); // Pause the timer
    const results = calculateResults();
    setRoundResults(results);
    setCapital(results.newCapital);
    setSustainability(results.newSustainability);
    
    // Salvar no localStorage
    localStorage.setItem('capital', results.newCapital.toString());
    localStorage.setItem('sustainability', results.newSustainability.toString());
    localStorage.setItem('round', (round + 1).toString());
    
    setIsResultsModalOpen(true);
  }, [calculateResults, round, capital, sustainability]); // Added capital and sustainability dependencies

  // Countdown timer effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isTimerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      // Auto-finish the round when time runs out
      setIsTimerActive(false);
      if (Object.keys(currentInvestments).length > 0) {
        finishRound();
      } else {
        toast.warning("Tempo esgotado! Você precisa fazer pelo menos um investimento.");
        setTimeRemaining(30); // Give an extra 30 seconds
        setIsTimerActive(true);
      }
    }
    
    return () => clearInterval(interval);
  }, [isTimerActive, timeRemaining, currentInvestments, finishRound]);

  const handleStationInteract = useCallback((stationType: string) => {
    setSelectedStation(stationType);
    setIsInvestmentModalOpen(true);
  }, []);

  const handleInvestment = useCallback((amount: number) => {
    const newCapital = capital - amount;
    setCapital(newCapital);
    
    setCurrentInvestments(prev => ({
      ...prev,
      [selectedStation]: (prev[selectedStation] || 0) + amount
    }));

    localStorage.setItem('capital', newCapital.toString());
  }, [capital, selectedStation]);

  const handleResultsClose = useCallback(() => {
    setIsResultsModalOpen(false);
    setCurrentInvestments({});
    
    if (round >= 3) {
      navigate('/game-over');
    } else {
      setRound(r => r + 1);
      setTimeRemaining(120); // Reset timer for new round
      setIsTimerActive(true); // Start timer again
    }
  }, [navigate, round]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const getInteractableStation = useCallback(() => {
    for (const station of stations) {
      const isNear = Math.abs(playerPosition.x - station.position.x) < 50 && 
                     Math.abs(playerPosition.y - station.position.y) < 50;
      if (isNear) {
        return station.type;
      }
    }
    return null;
  }, [playerPosition, stations]);

  const [interactableStationType, setInteractableStationType] = useState<string | null>(null);

  useEffect(() => {
    setInteractableStationType(getInteractableStation());
  }, [playerPosition, getInteractableStation]);

  const handleInvestButtonClick = useCallback(() => {
    const stationType = getInteractableStation();
    if (stationType) {
      setSelectedStation(stationType);
      setIsInvestmentModalOpen(true);
    } else {
      toast.info("Aproxime-se de uma estação para abrir o menu de investimento.");
    }
  }, [getInteractableStation]);
  
  const stationNames: { [key: string]: string } = {
    production: 'Produção',
    innovation: 'Inovação',
    marketing: 'Marketing',
    hr: 'RH',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pixel-green to-pixel-blue p-4">
      <div className="max-w-6xl mx-auto">
        {/* HUD */}
        <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
          <div className="pixel-card bg-pixel-light/90">
            <div className="font-pixel text-sm text-pixel-dark">
              <span className="font-retro">Jogador:</span> {playerName}
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="pixel-card bg-pixel-light/90">
              <div className="font-pixel text-sm text-pixel-dark">
                <span className="font-retro">Capital:</span> R$ {capital.toLocaleString()}
              </div>
            </div>
            
            <div className="pixel-card bg-pixel-light/90">
              <div className="font-pixel text-sm text-pixel-dark">
                <span className="font-retro">Sustentabilidade:</span> {sustainability}%
              </div>
            </div>
            
            <div className="pixel-card bg-pixel-light/90 relative">
              <div className="font-pixel text-sm text-pixel-dark">
                <span className="font-retro">Rodada:</span> {round}/3
              </div>
            </div>

            <div className={`pixel-card ${timeRemaining < 30 ? 'bg-pixel-red/90' : 'bg-pixel-light/90'} relative`}>
              <div className="font-pixel text-sm text-pixel-dark">
                <span className="font-retro">Tempo:</span> {formatTime(timeRemaining)}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          {/* Mapa do jogo */}
          <div className="flex-1">
            <div 
              className="relative border-4 border-pixel-dark rounded-sm overflow-hidden"
              style={{ 
                width: '500px', 
                height: '500px', 
                backgroundImage: `url('/lovable-files/placeholder_images/photo-1498050108023-c5249f4df085.jpg')`, // Updated image
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <Player position={playerPosition} onMove={setPlayerPosition} />
              
              {stations.map((station, index) => (
                <Station
                  key={index}
                  type={station.type as any}
                  position={station.position}
                  playerPosition={playerPosition}
                  onInteract={handleStationInteract}
                />
              ))}
              
              {/* Grid Overlay - Reduced opacity */}
              <div className="absolute inset-0 opacity-5 pointer-events-none">
                {Array.from({ length: 26 }).map((_, i) => (
                  <div
                    key={`v-${i}`}
                    className="absolute w-px bg-pixel-dark"
                    style={{ left: `${i * 20}px`, height: '100%' }}
                  />
                ))}
                {Array.from({ length: 26 }).map((_, i) => (
                  <div
                    key={`h-${i}`}
                    className="absolute h-px bg-pixel-dark"
                    style={{ top: `${i * 20}px`, width: '100%' }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Painel lateral */}
          <div className="w-full lg:w-80 space-y-4">
            <div className="pixel-card">
              <h3 className="font-retro text-sm text-pixel-dark mb-4">Controles</h3>
              <div className="font-pixel text-xs text-pixel-dark space-y-2">
                <p><strong>WASD:</strong> Mover personagem</p>
                <p><strong>Aproxime-se</strong> das estações e <strong>clique nelas</strong> ou no botão abaixo para investir</p>
                <p>Você tem 2 minutos para fazer seus investimentos</p>
                <p>Invista em pelo menos uma estação antes de finalizar</p>
              </div>
            </div>

            <div className="pixel-card">
              <h3 className="font-retro text-sm text-pixel-dark mb-4">Investimentos Atuais</h3>
              <div className="space-y-2">
                {Object.entries(currentInvestments).map(([station, amount]) => (
                  <div key={station} className="flex justify-between font-pixel text-xs text-pixel-dark">
                    <span className="capitalize">{stationNames[station] || station}:</span>
                    <span>R$ {amount.toLocaleString()}</span>
                  </div>
                ))}
                {Object.keys(currentInvestments).length === 0 && (
                  <p className="font-pixel text-xs text-pixel-dark/50">Nenhum investimento ainda</p>
                )}
              </div>
            </div>

            <Button
              onClick={handleInvestButtonClick}
              className="pixel-button w-full text-sm py-3"
              disabled={!interactableStationType}
            >
              {interactableStationType 
                ? `Investir em ${stationNames[interactableStationType] || interactableStationType}` 
                : "Aproxime-se para investir"}
            </Button>

            <Button
              onClick={finishRound}
              className="pixel-button w-full text-lg py-4 animate-bounce-pixel"
              disabled={Object.keys(currentInvestments).length === 0}
            >
              Finalizar Rodada {round}
            </Button>
          </div>
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
        onClose={handleResultsClose}
      />
    </div>
  );
};

export default Game;
