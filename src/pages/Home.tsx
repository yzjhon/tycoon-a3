
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

const Home = () => {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState('');

  useEffect(() => {
    const name = localStorage.getItem('playerName');
    if (!name) {
      navigate('/register');
    } else {
      setPlayerName(name);
    }
  }, [navigate]);

  const startGame = () => {
    // Inicializar dados do jogo
    localStorage.setItem('capital', '50000');
    localStorage.setItem('sustainability', '50');
    localStorage.setItem('round', '1');
    localStorage.setItem('investments', JSON.stringify({}));
    navigate('/game');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pixel-green to-pixel-blue flex items-center justify-center p-4">
      <div className="pixel-card max-w-2xl w-full text-center">
        <h1 className="font-retro text-3xl text-pixel-dark mb-4 animate-pixel-glow">
          EcoEmpreendedor
        </h1>
        
        <h2 className="font-pixel text-lg text-pixel-dark mb-8">
          Mini Simulador Financeiro
        </h2>

        <div className="pixel-card bg-pixel-yellow/20 mb-8">
          <p className="font-pixel text-pixel-dark mb-4">
            Bem-vindo, <span className="text-pixel-blue font-bold">{playerName}</span>!
          </p>
          
          <div className="text-left space-y-2 font-pixel text-sm text-pixel-dark">
            <p>💰 <strong>Capital Inicial:</strong> R$ 50.000</p>
            <p>🌱 <strong>Sustentabilidade:</strong> 50%</p>
            <p>🎯 <strong>Objetivo:</strong> Gerir sua empresa por 3 rodadas</p>
          </div>
        </div>

        <div className="pixel-card bg-pixel-light/50 mb-8 text-left">
          <h3 className="font-retro text-sm text-pixel-dark mb-4">Como Jogar:</h3>
          <div className="font-pixel text-xs text-pixel-dark space-y-2">
            <p>• Use <strong>WASD</strong> para mover seu personagem</p>
            <p>• Visite as 4 estações para fazer investimentos</p>
            <p>• Cada investimento afeta lucro e sustentabilidade</p>
            <p>• Complete 3 rodadas para ver seu resultado final</p>
          </div>
        </div>

        <Button
          onClick={startGame}
          className="pixel-button text-lg px-8 py-4 animate-bounce-pixel"
        >
          Iniciar Jogo
        </Button>
      </div>
    </div>
  );
};

export default Home;
