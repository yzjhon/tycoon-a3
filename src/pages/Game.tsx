import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Player from '@/components/Player';
import Station from '@/components/Station';
import InvestmentModal from '@/components/InvestmentModal';
import DecisionModal from '@/components/DecisionModal';
import ResultsModal from '@/components/ResultsModal';
import { getRandomQuestions } from '@/data/questions';
import { toast } from 'sonner';

const Game = () => {
  const navigate = useNavigate();
  const [playerPosition, setPlayerPosition] = useState({ x: 240, y: 240 });
  const [capital, setCapital] = useState(50000);
  const [sustainability, setSustainability] = useState(50);
  const [round, setRound] = useState(1);
  const [playerName, setPlayerName] = useState('');
  
  const [currentInvestments, setCurrentInvestments] = useState<{[key: string]: number}>({});
  const [investedStations, setInvestedStations] = useState<string[]>([]);
  const [usedQuestionIds, setUsedQuestionIds] = useState<{[key: string]: number[]}>({});
  
  const [isInvestmentModalOpen, setIsInvestmentModalOpen] = useState(false);
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState('');
  const [currentQuestions, setCurrentQuestions] = useState<any[]>([]);
  
  const [isResultsModalOpen, setIsResultsModalOpen] = useState(false);
  const [roundResults, setRoundResults] = useState({
    profit: 0,
    sustainabilityChange: 0,
    newCapital: 0,
    newSustainability: 0,
  });

  // Timer
  const [timeRemaining, setTimeRemaining] = useState(120);
  const [isTimerActive, setIsTimerActive] = useState(true);

  // Posicionando as estações: produção e inovação na direita mas visíveis
  const stations = [
    { type: 'hr', position: { x: 20, y: 180 } },            // Superior esquerdo
    { type: 'innovation', position: { x: 380, y: 180 } },   // Superior direito (ajustado para ficar visível)
    { type: 'marketing', position: { x: 20, y: 380 } },     // Inferior esquerdo
    { type: 'production', position: { x: 380, y: 380 } },   // Inferior direito (ajustado para ficar visível)
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
    // Agora apenas retorna os valores atuais sem modificações
    // As mudanças vêm apenas das decisões das perguntas
    return {
      profit: 0, // Sem lucro adicional no final da rodada
      sustainabilityChange: 0, // Sem mudança adicional na sustentabilidade
      newCapital: capital, // Mantém o capital atual
      newSustainability: sustainability // Mantém a sustentabilidade atual
    };
  }, [capital, sustainability]);

  const finishRound = useCallback(() => {
    setIsTimerActive(false);
    const results = calculateResults();
    setRoundResults(results);
    setCapital(results.newCapital);
    setSustainability(results.newSustainability);
    
    // Salvar no localStorage
    localStorage.setItem('capital', results.newCapital.toString());
    localStorage.setItem('sustainability', results.newSustainability.toString());
    localStorage.setItem('round', (round + 1).toString());
    
    setIsResultsModalOpen(true);
  }, [calculateResults, round]);

  // timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isTimerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      // termina o turno quando acaba o tempo
      setIsTimerActive(false);
      if (Object.keys(currentInvestments).length > 0) {
        finishRound();
      } else {
        toast.warning("Tempo esgotado! Você precisa fazer pelo menos um investimento.");
        setTimeRemaining(30); // não fazer nada poderia ser uma opção mas preferem deixar assim
        setIsTimerActive(true);
      }
    }
    
    return () => clearInterval(interval);
  }, [isTimerActive, timeRemaining, currentInvestments, finishRound]);

  const handleStationInteract = useCallback((stationType: string) => {
    // Verificar se a estação já recebeu investimento nesta rodada
    if (investedStations.includes(stationType)) {
      toast.warning(`Você já investiu em ${stationNames[stationType]} nesta rodada!`);
      return;
    }
    
    setSelectedStation(stationType);
    setIsInvestmentModalOpen(true);
  }, [investedStations]);

  const handleInvestment = useCallback((amount: number) => {
    const newCapital = capital - amount;
    setCapital(newCapital);
    
    setCurrentInvestments(prev => ({
      ...prev,
      [selectedStation]: (prev[selectedStation] || 0) + amount
    }));

    // Adicionar a estação à lista de estações que já receberam investimento
    setInvestedStations(prev => [...prev, selectedStation]);

    localStorage.setItem('capital', newCapital.toString());
    toast.success(`Investimento de R$ ${amount.toLocaleString()} realizado em ${stationNames[selectedStation]}!`);
    
    // Após o investimento, abrir decisões
    const questions = getRandomQuestions(selectedStation, usedQuestionIds[selectedStation] || []);
    setCurrentQuestions(questions);
    setIsDecisionModalOpen(true);
  }, [capital, selectedStation, usedQuestionIds]);

  const handleDecision = useCallback((impact: { money: number; sustainability: number }) => {

    const investmentAmount = currentInvestments[selectedStation] || 0;
    // player recebe o valor incial +- impacto da pergunta
    const finalReturn = investmentAmount + impact.money;
    
    // Aplicar impacto das decisões
    const newCapital = capital + finalReturn;
    const newSustainability = Math.max(0, Math.min(100, sustainability + impact.sustainability));
    
    setCapital(newCapital);
    setSustainability(newSustainability);
    
    // Marcar perguntas como usadas
    const questionIds = currentQuestions.map(q => q.id);
    setUsedQuestionIds(prev => ({
      ...prev,
      [selectedStation]: [...(prev[selectedStation] || []), ...questionIds]
    }));
    
    localStorage.setItem('capital', newCapital.toString());
    localStorage.setItem('sustainability', newSustainability.toString());
    
    const impactMessage = `Retorno: R$ ${Math.round(finalReturn).toLocaleString()} (${investmentAmount.toLocaleString()} + ${impact.money >= 0 ? '+' : ''}${impact.money.toLocaleString()}) / Sustentabilidade ${impact.sustainability >= 0 ? '+' : ''}${impact.sustainability}%`;
    toast.success(impactMessage);
  }, [capital, sustainability, currentQuestions, selectedStation, currentInvestments]);

  const handleResultsClose = useCallback(() => {
    setIsResultsModalOpen(false);
    setCurrentInvestments({});
    setInvestedStations([]); // Resetar estações investidas para a nova rodada
    
    if (round >= 3) {
      navigate('/game-over');
    } else {
      setRound(r => r + 1);
      setTimeRemaining(120);
      setIsTimerActive(true);
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
      if (isNear && !investedStations.includes(station.type)) { // Verificar se não foi investido ainda
        return station.type;
      }
    }
    return null;
  }, [playerPosition, stations, investedStations]);

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
      // Verificar se está perto de uma estação mas já investiu nela
      const nearStation = stations.find(station => 
        Math.abs(playerPosition.x - station.position.x) < 50 && 
        Math.abs(playerPosition.y - station.position.y) < 50
      );
      
      if (nearStation && investedStations.includes(nearStation.type)) {
        toast.warning(`Você já investiu em ${stationNames[nearStation.type]} nesta rodada!`);
      } else {
        toast.info("Aproxime-se de uma estação disponível para abrir o menu de investimento.");
      }
    }
  }, [getInteractableStation, playerPosition, stations, investedStations]);
  
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
                backgroundImage: 'url(/graphics/background.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
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
                  isDisabled={investedStations.includes(station.type)} // Nova prop para indicar se está desabilitada
                />
              ))}
            </div>
          </div>

          {/* Painel lateral */}
          <div className="w-full lg:w-80 space-y-4">
            <div className="pixel-card">
              <h3 className="font-retro text-sm text-pixel-dark mb-4">Controles</h3>
              <div className="font-pixel text-xs text-pixel-dark space-y-2">
                <p><strong>WASD:</strong> Mover personagem</p>
                <p><strong>Aproxime-se</strong> das estações e <strong>clique nelas</strong> ou no botão abaixo para investir</p>
                <p><strong>Limite:</strong> Apenas 1 investimento por área por rodada</p>
                <p>Você tem 2 minutos para fazer seus investimentos</p>
                <p>Invista em pelo menos uma estação antes de finalizar</p>
                <p><strong>Novo:</strong> Após cada investimento, você tomará decisões que afetam os resultados!</p>
              </div>
            </div>

            <div className="pixel-card">
              <h3 className="font-retro text-sm text-pixel-dark mb-4">Investimentos Atuais</h3>
              <div className="space-y-2">
                {Object.entries(currentInvestments).map(([stationType, amount]) => (
                  <div key={stationType} className="flex justify-between font-pixel text-xs text-pixel-dark">
                    <span className="capitalize">{stationNames[stationType] || stationType}:</span>
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
              className="pixel-button w-full text-lg py-4"
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

      <DecisionModal
        isOpen={isDecisionModalOpen}
        stationType={selectedStation}
        questions={currentQuestions}
        onClose={() => setIsDecisionModalOpen(false)}
        onDecision={handleDecision}
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
