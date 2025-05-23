
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const GameOver = () => {
  const navigate = useNavigate();
  const [gameData, setGameData] = useState({
    playerName: '',
    totalProfit: 0,
    finalSustainability: 0,
    finalCapital: 0,
  });

  useEffect(() => {
    const playerName = localStorage.getItem('playerName') || '';
    const finalCapital = parseInt(localStorage.getItem('capital') || '50000');
    const finalSustainability = parseInt(localStorage.getItem('sustainability') || '50');
    const totalProfit = finalCapital - 50000;

    setGameData({
      playerName,
      totalProfit,
      finalSustainability,
      finalCapital,
    });
  }, []);

  const getPerformanceFeedback = () => {
    const { totalProfit, finalSustainability } = gameData;
    
    if (totalProfit > 20000 && finalSustainability > 70) {
      return {
        title: "Excelente!",
        message: "Você é um verdadeiro EcoEmpreendedor! Lucro alto e sustentabilidade exemplar!",
        color: "text-pixel-green"
      };
    } else if (totalProfit > 10000 && finalSustainability > 50) {
      return {
        title: "Muito Bom!",
        message: "Boa gestão! Você equilibrou lucro e sustentabilidade com sucesso.",
        color: "text-pixel-blue"
      };
    } else if (totalProfit > 0) {
      return {
        title: "Bom Trabalho!",
        message: "Você conseguiu lucro, mas pode melhorar a sustentabilidade.",
        color: "text-pixel-yellow"
      };
    } else {
      return {
        title: "Tente Novamente!",
        message: "A gestão empresarial é desafiadora. Continue praticando!",
        color: "text-pixel-red"
      };
    }
  };

  const feedback = getPerformanceFeedback();

  const playAgain = () => {
    navigate('/home');
  };

  const newPlayer = () => {
    localStorage.clear();
    navigate('/register');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pixel-purple to-pixel-dark flex items-center justify-center p-4">
      <div className="pixel-card max-w-2xl w-full text-center">
        <h1 className="font-retro text-3xl text-pixel-dark mb-4 animate-pixel-glow">
          Fim de Jogo
        </h1>
        
        <div className="pixel-card bg-pixel-light/50 mb-6">
          <h2 className="font-pixel text-lg text-pixel-dark mb-4">
            Parabéns, {gameData.playerName}!
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="pixel-card bg-pixel-blue/20">
              <h3 className="font-retro text-sm text-pixel-dark mb-2">Capital Final</h3>
              <p className="font-pixel text-lg text-pixel-dark">
                R$ {gameData.finalCapital.toLocaleString()}
              </p>
            </div>
            
            <div className="pixel-card bg-pixel-green/20">
              <h3 className="font-retro text-sm text-pixel-dark mb-2">Lucro Total</h3>
              <p className={`font-pixel text-lg ${gameData.totalProfit >= 0 ? 'text-pixel-green' : 'text-pixel-red'}`}>
                {gameData.totalProfit >= 0 ? '+' : ''}R$ {gameData.totalProfit.toLocaleString()}
              </p>
            </div>
            
            <div className="pixel-card bg-pixel-yellow/20">
              <h3 className="font-retro text-sm text-pixel-dark mb-2">Sustentabilidade</h3>
              <p className="font-pixel text-lg text-pixel-dark">
                {gameData.finalSustainability}%
              </p>
            </div>
          </div>
        </div>

        <div className="pixel-card bg-pixel-purple/20 mb-8">
          <h3 className={`font-retro text-lg ${feedback.color} mb-4`}>
            {feedback.title}
          </h3>
          <p className="font-pixel text-sm text-pixel-dark">
            {feedback.message}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={playAgain}
            className="pixel-button px-8 py-4"
          >
            Jogar Novamente
          </Button>
          
          <Button
            onClick={newPlayer}
            className="pixel-button bg-pixel-purple hover:bg-pixel-purple/80 px-8 py-4"
          >
            Novo Jogador
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GameOver;
