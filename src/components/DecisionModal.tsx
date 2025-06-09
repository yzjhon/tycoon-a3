
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface Decision {
  text: string;
  impact: {
    money: number;
    sustainability: number;
  };
  isCorrect: boolean;
}

interface Question {
  id: number;
  question: string;
  options: Decision[];
}

interface DecisionModalProps {
  isOpen: boolean;
  stationType: string;
  questions: Question[];
  onClose: () => void;
  onDecision: (impact: { money: number; sustainability: number }) => void;
}

const DecisionModal = ({ isOpen, stationType, questions, onClose, onDecision }: DecisionModalProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [decisions, setDecisions] = useState<{ money: number; sustainability: number }[]>([]);

  const stationNames = {
    production: 'Produção',
    innovation: 'Inovação',
    marketing: 'Marketing',
    hr: 'Recursos Humanos',
  };

  const currentQuestion = questions[currentQuestionIndex];

  const handleNext = () => {
    if (!selectedOption) return;
    
    const optionIndex = parseInt(selectedOption);
    const selectedDecision = currentQuestion.options[optionIndex];
    const newDecisions = [...decisions, selectedDecision.impact];
    setDecisions(newDecisions);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption('');
    } else {
      // Calcular impacto total
      const totalImpact = newDecisions.reduce(
        (acc, decision) => ({
          money: acc.money + decision.money,
          sustainability: acc.sustainability + decision.sustainability,
        }),
        { money: 0, sustainability: 0 }
      );
      
      onDecision(totalImpact);
      handleClose();
    }
  };

  const handleClose = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption('');
    setDecisions([]);
    onClose();
  };

  if (!currentQuestion) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="pixel-card border-4 border-pixel-dark bg-pixel-light max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-retro text-lg text-pixel-dark text-center">
            {stationNames[stationType as keyof typeof stationNames]} - Pergunta {currentQuestionIndex + 1}/{questions.length}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="pixel-card bg-pixel-yellow/20 p-4">
            <p className="font-pixel text-sm text-pixel-dark text-center">
              {currentQuestion.question}
            </p>
          </div>

          <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="pixel-card bg-pixel-blue/10 p-3">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <label 
                    htmlFor={`option-${index}`} 
                    className="font-pixel text-sm text-pixel-dark cursor-pointer flex-1"
                  >
                    <div className="flex justify-between items-center">
                      <span>{option.text}</span>
                      <span className={`text-xs ${option.impact.money >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {option.impact.money >= 0 ? '+' : ''}R$ {option.impact.money.toLocaleString()} / 
                        Sust. {option.impact.sustainability >= 0 ? '+' : ''}{option.impact.sustainability}%
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            ))}
          </RadioGroup>

          <div className="flex justify-between">
            <div className="font-pixel text-xs text-pixel-dark">
              Progresso: {currentQuestionIndex + 1} de {questions.length}
            </div>
            <Button
              onClick={handleNext}
              disabled={!selectedOption}
              className="pixel-button"
            >
              {currentQuestionIndex < questions.length - 1 ? 'Próxima' : 'Finalizar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DecisionModal;
