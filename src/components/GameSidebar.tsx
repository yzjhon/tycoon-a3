
import { Button } from '@/components/ui/button';

interface GameSidebarProps {
  currentInvestments: {[key: string]: number};
  interactableStationType: string | null;
  round: number;
  onInvestButtonClick: () => void;
  onFinishRound: () => void;
}

const GameSidebar = ({ 
  currentInvestments, 
  interactableStationType, 
  round,
  onInvestButtonClick,
  onFinishRound 
}: GameSidebarProps) => {
  const stationNames: { [key: string]: string } = {
    production: 'Produção',
    innovation: 'Inovação',
    marketing: 'Marketing',
    hr: 'RH',
  };

  return (
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
        onClick={onInvestButtonClick}
        className="pixel-button w-full text-sm py-3"
        disabled={!interactableStationType}
      >
        {interactableStationType 
          ? `Investir em ${stationNames[interactableStationType] || interactableStationType}` 
          : "Aproxime-se para investir"}
      </Button>

      <Button
        onClick={onFinishRound}
        className="pixel-button w-full text-lg py-4 animate-bounce-pixel"
        disabled={Object.keys(currentInvestments).length === 0}
      >
        Finalizar Rodada {round}
      </Button>
    </div>
  );
};

export default GameSidebar;
