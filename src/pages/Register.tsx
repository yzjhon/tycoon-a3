
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Register = () => {
  const [playerName, setPlayerName] = useState('');
  const navigate = useNavigate();

  const handleStart = () => {
    if (playerName.trim()) {
      localStorage.setItem('playerName', playerName);
      navigate('/home');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pixel-blue to-pixel-purple flex items-center justify-center p-4">
      <div className="pixel-card max-w-md w-full text-center animate-bounce-pixel">
        <h1 className="font-retro text-2xl text-pixel-dark mb-8 animate-pixel-glow">
          EcoEmpreendedor
        </h1>
        
        <div className="mb-6">
          <p className="font-pixel text-pixel-dark mb-4 text-sm">
            Digite seu nome para começar:
          </p>
          
          <Input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Nome do jogador"
            className="pixel-input w-full mb-4"
            maxLength={20}
          />
        </div>

        <Button
          onClick={handleStart}
          disabled={!playerName.trim()}
          className="pixel-button w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Começar
        </Button>

        <div className="mt-6 text-xs font-pixel text-pixel-dark/70">
          Um simulador de gestão por turnos
        </div>
      </div>
    </div>
  );
};

export default Register;
