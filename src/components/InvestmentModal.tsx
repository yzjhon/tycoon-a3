
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface InvestmentModalProps {
  isOpen: boolean;
  stationType: string;
  onClose: () => void;
  onInvest: (amount: number) => void;
  currentCapital: number;
}

const InvestmentModal = ({ isOpen, stationType, onClose, onInvest, currentCapital }: InvestmentModalProps) => {
  const [customAmount, setCustomAmount] = useState('');

  const stationNames = {
    production: 'Produção',
    innovation: 'Inovação',
    marketing: 'Marketing',
    hr: 'RH',
  };

  const handleInvest = (amount: number) => {
    if (amount <= currentCapital) {
      onInvest(amount);
      setCustomAmount('');
      onClose();
    }
  };

  const handleCustomInvest = () => {
    const amount = parseInt(customAmount);
    if (amount > 0 && amount <= currentCapital) {
      handleInvest(amount);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="pixel-card border-4 border-pixel-dark bg-pixel-light max-w-md">
        <DialogHeader>
          <DialogTitle className="font-retro text-lg text-pixel-dark text-center">
            Estação: {stationNames[stationType as keyof typeof stationNames]}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-center">
            <p className="font-pixel text-sm text-pixel-dark mb-2">
              Capital disponível: R$ {currentCapital.toLocaleString()}
            </p>
            <p className="font-pixel text-xs text-pixel-dark/70">
              Quanto deseja investir?
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {[5000, 10000, 15000].map((amount) => (
              <Button
                key={amount}
                onClick={() => handleInvest(amount)}
                disabled={amount > currentCapital}
                className="pixel-button disabled:opacity-50"
              >
                R$ {amount.toLocaleString()}
              </Button>
            ))}
          </div>

          <div className="space-y-2">
            <p className="font-pixel text-xs text-pixel-dark text-center">
              Ou digite um valor:
            </p>
            <div className="flex gap-2">
              <Input
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="Valor personalizado"
                className="pixel-input flex-1"
                max={currentCapital}
                min={0}
              />
              <Button
                onClick={handleCustomInvest}
                disabled={!customAmount || parseInt(customAmount) > currentCapital || parseInt(customAmount) <= 0}
                className="pixel-button"
              >
                OK
              </Button>
            </div>
          </div>

          <Button
            onClick={onClose}
            variant="outline"
            className="w-full pixel-button bg-pixel-red hover:bg-pixel-red/80"
          >
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvestmentModal;
