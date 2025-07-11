
import { useEffect, useState, useCallback } from 'react';

interface PlayerProps {
  position: { x: number; y: number };
  onMove: (newPosition: { x: number; y: number }) => void;
}

const Player = ({ position, onMove }: PlayerProps) => {
  const [direction, setDirection] = useState('down');

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    const step = 20;
    let newPosition = { ...position };
    let newDirection = direction;

    switch (event.key.toLowerCase()) {
      case 'w':
        newPosition.y = Math.max(0, position.y - step);
        newDirection = 'up';
        break;
      case 's':
        newPosition.y = Math.min(420, position.y + step);
        newDirection = 'down';
        break;
      case 'a':
        newPosition.x = Math.max(0, position.x - step);
        newDirection = 'left';
        break;
      case 'd':
        newPosition.x = Math.min(420, position.x + step);
        newDirection = 'right';
        break;
      default:
        return;
    }

    setDirection(newDirection);
    onMove(newPosition);
  }, [position, onMove, direction]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  return (
    <div
      className="absolute w-32 h-32 transition-all duration-150 z-10"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: direction === 'left' ? 'scaleX(-1)' : 'scaleX(1)',
      }}
    >
      <img 
        src="/graphics/player.png"
        alt="Personagem"
        className="w-full h-full object-contain"
        style={{
          imageRendering: 'pixelated',
          filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.4))'
        }}
      />
    </div>
  );
};

export default Player;
