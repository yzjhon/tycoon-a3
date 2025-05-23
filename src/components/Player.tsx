
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
        newPosition.y = Math.min(460, position.y + step);
        newDirection = 'down';
        break;
      case 'a':
        newPosition.x = Math.max(0, position.x - step);
        newDirection = 'left';
        break;
      case 'd':
        newPosition.x = Math.min(460, position.x + step);
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
      className="absolute w-10 h-10 transition-all duration-150 z-10"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div className="w-full h-full bg-pixel-orange border-2 border-pixel-dark rounded-sm animate-bounce-pixel">
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-xs font-retro text-white">
            {direction === 'up' && '↑'}
            {direction === 'down' && '↓'}
            {direction === 'left' && '←'}
            {direction === 'right' && '→'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Player;
