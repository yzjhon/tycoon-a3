
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Player from '@/components/Player';
import Station from '@/components/Station';
import InvestmentModal from '@/components/InvestmentModal';
import DecisionModal from '@/components/DecisionModal';
import ResultsModal from '@/components/ResultsModal';
import { getRandomQuestions } from '@/data/questions';

const Game = () => {
  const [capital, setCapital] = useState(50000);
  const [sustainability, setSustainability] = useState(50);
  const [round, setRound] = useState(1);
  const [selectedStation, setSelectedStation] = useState('');
  const [isInvestmentModalOpen, setIsInvestmentModalOpen] = useState(false);
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);
  const [isResultsModalOpen, setIsResultsModalOpen] = useState(false);
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [usedQuestionIds, setUsedQuestionIds] = useState({});
  const [investedStations, setInvestedStations] = useState([]);
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });
  const [gameResults, setGameResults] = useState({
    profit: 0,
    sustainabilityChange: 0,
    newCapital: 0,
    newSustainability: 0,
  });

  const { toast } = useToast();

  const stationNames = {
    production: 'Produção',
    innovation: 'Inovação', 
    marketing: 'Marketing',
    hr: 'Recursos Humanos',
  };

  useEffect(() => {
    const savedCapital = localStorage.getItem('capital');
    const savedSustainability = localStorage.getItem('sustainability');
    const savedRound = localStorage.getItem('round');

    if (savedCapital) setCapital(parseInt(savedCapital));
    if (savedSustainability) setSustainability(parseInt(savedSustainability));
    if (savedRound) setRound(parseInt(savedRound));
  }, []);

  const handlePlayerMove = useCallback((newPosition: { x: number; y: number }) => {
    setPlayerPosition(newPosition);
  }, []);

  const handleStationClick = useCallback((stationType: string) => {
    if (investedStations.includes(stationType)) {
      toast({
        title: "Erro",
        description: `Você já investiu em ${stationNames[stationType]} nesta rodada!`,
        variant: "destructive"
      });
      return;
    }
    
    setSelectedStation(stationType);
    setIsInvestmentModalOpen(true);
  }, [investedStations, toast, stationNames]);

  const handleInvestment = useCallback((amount: number) => {
    const newCapital = capital - amount;
    setCapital(newCapital);
    
    // Adicionar estação à lista de investidas
    setInvestedStations(prev => [...prev, selectedStation]);

    localStorage.setItem('capital', newCapital.toString());
    toast({
      title: "Sucesso",
      description: `Investimento de R$ ${amount.toLocaleString()} realizado em ${stationNames[selectedStation]}!`
    });
    
    // Após o investimento, abrir o modal de decisões
    const questions = getRandomQuestions(selectedStation, usedQuestionIds[selectedStation] || []);
    setCurrentQuestions(questions);
    setIsInvestmentModalOpen(false);
    setIsDecisionModalOpen(true);
  }, [capital, selectedStation, usedQuestionIds, toast, stationNames]);

  const handleDecision = useCallback((impact: { money: number; sustainability: number }) => {
    // Aplicar impacto das decisões imediatamente
    const newCapital = capital + impact.money;
    const newSustainability = Math.max(0, Math.min(100, sustainability + impact.sustainability));
    
    setCapital(newCapital);
    setSustainability(newSustainability);
    
    // Salvar no localStorage
    localStorage.setItem('capital', newCapital.toString());
    localStorage.setItem('sustainability', newSustainability.toString());
    
    // Atualizar perguntas usadas
    const questionIds = currentQuestions.map(q => q.id);
    setUsedQuestionIds(prev => ({
      ...prev,
      [selectedStation]: [...(prev[selectedStation] || []), ...questionIds]
    }));

    toast({
      title: "Sucesso",
      description: `Decisões aplicadas! Capital: R$ ${newCapital.toLocaleString()}, Sustentabilidade: ${newSustainability}%`
    });
    
    setIsDecisionModalOpen(false);
  }, [capital, sustainability, currentQuestions, selectedStation, toast]);

  const handleFinishRound = useCallback(() => {
    // Não calcular mais resultados - apenas mostrar os valores atuais
    setGameResults({
      profit: 0, // Não há mais lucro/prejuízo calculado no final
      sustainabilityChange: 0, // Não há mais mudança calculada no final
      newCapital: capital, // Mostrar o capital atual
      newSustainability: sustainability, // Mostrar a sustentabilidade atual
    });

    setIsResultsModalOpen(true);
  }, [capital, sustainability]);

  const handleNextRound = useCallback(() => {
    const newRound = round + 1;
    setRound(newRound);
    localStorage.setItem('round', newRound.toString());
    
    // Reset invested stations para a nova rodada
    setInvestedStations([]);
    
    // Reset used questions a cada 3 rodadas
    if (newRound % 3 === 1) {
      setUsedQuestionIds({});
    }
    
    setIsResultsModalOpen(false);
    toast({
      title: "Nova Rodada",
      description: `Rodada ${newRound} iniciada!`
    });
  }, [round, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pixel-blue/20 to-pixel-yellow/20 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-retro text-3xl text-pixel-dark mb-4">
            Simulador Empresarial Sustentável
          </h1>
          <div className="pixel-card bg-pixel-light/90 inline-block">
            <p className="font-pixel text-sm text-pixel-dark">
              Rodada {round} - Tome decisões estratégicas para sua empresa!
            </p>
          </div>
        </div>

        <Player position={playerPosition} onMove={handlePlayerMove} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Station 
            type="production" 
            position={{ x: 0, y: 0 }}
            playerPosition={playerPosition}
            onInteract={() => handleStationClick('production')}
            isDisabled={investedStations.includes('production')}
          />
          <Station 
            type="innovation" 
            position={{ x: 0, y: 0 }}
            playerPosition={playerPosition}
            onInteract={() => handleStationClick('innovation')}
            isDisabled={investedStations.includes('innovation')}
          />
          <Station 
            type="marketing" 
            position={{ x: 0, y: 0 }}
            playerPosition={playerPosition}
            onInteract={() => handleStationClick('marketing')}
            isDisabled={investedStations.includes('marketing')}
          />
          <Station 
            type="hr" 
            position={{ x: 0, y: 0 }}
            playerPosition={playerPosition}
            onInteract={() => handleStationClick('hr')}
            isDisabled={investedStations.includes('hr')}
          />
        </div>

        <div className="text-center">
          <Button
            onClick={handleFinishRound}
            className="pixel-button text-lg px-8 py-4"
            disabled={investedStations.length === 0}
          >
            Finalizar Rodada
          </Button>
          {investedStations.length === 0 && (
            <p className="font-pixel text-xs text-pixel-dark/70 mt-2">
              Faça pelo menos um investimento para finalizar a rodada
            </p>
          )}
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
        results={gameResults}
        round={round}
        onClose={handleNextRound}
      />
    </div>
  );
};

export default Game;
