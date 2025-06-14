
import { Factory, Lamp, Megaphone, Group } from 'lucide-react';

interface StationProps {
  type: 'production' | 'innovation' | 'marketing' | 'hr';
  position: { x: number; y: number };
  playerPosition: { x: number; y: number };
  onInteract: (type: string) => void;
  isDisabled?: boolean; // Nova prop para indicar se a estação está desabilitada
}

const Station = ({ type, position, playerPosition, onInteract, isDisabled = false }: StationProps) => {
  const icons = {
    production: Factory,
    innovation: Lamp,
    marketing: Megaphone,
    hr: Group,
  };

  const colors = {
    production: 'bg-pixel-red',
    innovation: 'bg-pixel-yellow',
    marketing: 'bg-pixel-purple',
    hr: 'bg-pixel-green',
  };

  const names = {
    production: 'PRODUÇÃO',
    innovation: 'INOVAÇÃO',
    marketing: 'MARKETING',
    hr: 'RH',
  };

  const IconComponent = icons[type];
  const isNear = Math.abs(playerPosition.x - position.x) < 50 && 
                 Math.abs(playerPosition.y - position.y) < 50;

  return (
    <div
      className="absolute"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div 
        className={`w-16 h-16 ${isDisabled ? 'bg-gray-400' : colors[type]} border-4 border-pixel-dark rounded-sm 
                   flex items-center justify-center ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}
                   ${isNear && !isDisabled ? 'animate-pixel-glow scale-110' : ''}
                   ${isDisabled ? 'opacity-50' : ''}
                   transition-all duration-300`}
        onClick={() => isNear && !isDisabled && onInteract(type)}
      >
        <IconComponent className={`w-8 h-8 ${isDisabled ? 'text-gray-600' : 'text-white'}`} />
      </div>
      
      <div className="text-center mt-2">
        <div className="bg-black px-2 py-1 rounded-sm">
          <span className={`font-pixel text-xs text-white`}>
            {names[type]}
          </span>
        </div>
        {isDisabled && (
          <div className="text-xs font-pixel text-gray-500 mt-1">
            ✓ Investido
          </div>
        )}
      </div>
      
      {isNear && !isDisabled && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
          <span className="bg-pixel-dark text-white px-2 py-1 rounded text-xs font-pixel">
            Clique para investir
          </span>
        </div>
      )}
      
      {isNear && isDisabled && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
          <span className="bg-gray-600 text-white px-2 py-1 rounded text-xs font-pixel">
            Já investido
          </span>
        </div>
      )}
    </div>
  );
};

export default Station;
