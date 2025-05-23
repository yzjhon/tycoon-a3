
import { Factory, Lamp, Megaphone, Group } from 'lucide-react';

interface StationProps {
  type: 'production' | 'innovation' | 'marketing' | 'hr';
  position: { x: number; y: number };
  playerPosition: { x: number; y: number };
  onInteract: (type: string) => void;
}

const Station = ({ type, position, playerPosition, onInteract }: StationProps) => {
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
    production: 'Produção',
    innovation: 'Inovação',
    marketing: 'Marketing',
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
        className={`w-16 h-16 ${colors[type]} border-4 border-pixel-dark rounded-sm 
                   flex items-center justify-center cursor-pointer
                   ${isNear ? 'animate-pixel-glow scale-110' : ''}
                   transition-all duration-300`}
        onClick={() => isNear && onInteract(type)}
      >
        <IconComponent className="w-8 h-8 text-white" />
      </div>
      
      <div className="text-center mt-2">
        <span className="font-pixel text-xs text-pixel-dark">
          {names[type]}
        </span>
      </div>
      
      {isNear && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
          <span className="bg-pixel-dark text-white px-2 py-1 rounded text-xs font-pixel">
            Clique para investir
          </span>
        </div>
      )}
    </div>
  );
};

export default Station;
