
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ResultsModalProps {
  isOpen: boolean;
  results: {
    profit: number;
    sustainabilityChange: number;
    newCapital: number;
    newSustainability: number;
  };
  round: number;
  onClose: () => void;
}

const ResultsModal = ({ isOpen, results, round, onClose }: ResultsModalProps) => {
  const { profit, sustainabilityChange, newCapital, newSustainability } = results;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="pixel-card border-4 border-pixel-dark bg-pixel-light max-w-md">
        <DialogHeader>
          <DialogTitle className="font-retro text-lg text-pixel-dark text-center">
            Resultados da Rodada {round}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="pixel-card bg-pixel-yellow/20">
            <div className="space-y-2 font-pixel text-sm">
              <div className="flex justify-between">
                <span className="text-pixel-dark">
                  {profit >= 0 ? 'Lucro:' : 'Prejuízo:'}
                </span>
                <span className={`font-bold ${profit >= 0 ? 'text-pixel-green' : 'text-pixel-red'}`}>
                  {profit >= 0 ? '+' : ''}R$ {profit.toLocaleString()}
                </span>
              </div>
              
              <div className={`flex justify-between ${sustainabilityChange >= 0 ? 'text-pixel-green' : 'text-pixel-red'}`}>
                <span>Sustentabilidade:</span>
                <span className="font-bold">
                  {sustainabilityChange >= 0 ? '+' : ''}{sustainabilityChange}%
                </span>
              </div>
            </div>
          </div>

          <div className="pixel-card bg-pixel-blue/20">
            <div className="space-y-2 font-pixel text-sm text-pixel-dark">
              <div className="flex justify-between">
                <span>Novo Capital:</span>
                <span className="font-bold">R$ {newCapital.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Sustentabilidade:</span>
                <span className="font-bold">{newSustainability}%</span>
              </div>
            </div>
          </div>

          <Button
            onClick={onClose}
            className="pixel-button w-full"
          >
            Continuar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResultsModal;
