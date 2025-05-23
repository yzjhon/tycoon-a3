
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar se já tem um jogador cadastrado
    const playerName = localStorage.getItem('playerName');
    if (playerName) {
      navigate('/home');
    } else {
      navigate('/register');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pixel-blue to-pixel-purple">
      <div className="pixel-card text-center">
        <h1 className="font-retro text-2xl text-pixel-dark animate-pixel-glow">
          Carregando EcoEmpreendedor...
        </h1>
      </div>
    </div>
  );
};

export default Index;
