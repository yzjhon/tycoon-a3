
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label'; // Importar o Label

const Register = () => {
  const [playerName, setPlayerName] = useState('');
  const [email, setEmail] = useState(''); // Novo estado para e-mail
  const [password, setPassword] = useState(''); // Novo estado para senha
  const navigate = useNavigate();

  const handleStart = () => {
    if (playerName.trim() && email.trim() && password.trim()) { // Verificar todos os campos
      localStorage.setItem('playerName', playerName);
      localStorage.setItem('playerEmail', email); // Salvar e-mail
      localStorage.setItem('playerPassword', password); // Salvar senha (NÃO SEGURO PARA PRODUÇÃO)
      // Idealmente, aqui você faria uma chamada para um backend para registrar o usuário de forma segura.
      // Por agora, estamos apenas simulando o registro localmente.
      navigate('/home');
    }
  };

  const areAllFieldsFilled = () => {
    return playerName.trim() !== '' && email.trim() !== '' && password.trim() !== '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pixel-blue to-pixel-purple flex items-center justify-center p-4">
      <div className="pixel-card max-w-md w-full text-center animate-bounce-pixel">
        <h1 className="font-retro text-2xl text-pixel-dark mb-8 animate-pixel-glow">
          EcoEmpreendedor
        </h1>
        
        <div className="mb-6 space-y-4">
          <div>
            <Label htmlFor="playerName" className="block font-pixel text-pixel-dark mb-2 text-sm text-left">
              Nome do Jogador:
            </Label>
            <Input
              id="playerName"
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Seu nome ou apelido"
              className="pixel-input w-full"
              maxLength={20}
            />
          </div>

          <div>
            <Label htmlFor="email" className="block font-pixel text-pixel-dark mb-2 text-sm text-left">
              E-mail:
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="pixel-input w-full"
            />
          </div>

          <div>
            <Label htmlFor="password" className="block font-pixel text-pixel-dark mb-2 text-sm text-left">
              Senha:
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Crie uma senha"
              className="pixel-input w-full"
            />
             <p className="font-pixel text-xs text-pixel-dark/70 mt-1 text-left">
              Apenas para fins de simulação. Não use senhas reais.
            </p>
          </div>
        </div>

        <Button
          onClick={handleStart}
          disabled={!areAllFieldsFilled()}
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
