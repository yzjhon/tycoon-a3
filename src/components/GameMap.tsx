
import Player from './Player';
import Station from './Station';

interface GameMapProps {
  playerPosition: { x: number; y: number };
  onPlayerMove: (newPosition: { x: number; y: number }) => void;
  onStationInteract: (stationType: string) => void;
}

const GameMap = ({ playerPosition, onPlayerMove, onStationInteract }: GameMapProps) => {
  const stations = [
    { type: 'hr', position: { x: 100, y: 100 } },
    { type: 'innovation', position: { x: 380, y: 100 } },
    { type: 'marketing', position: { x: 100, y: 380 } },
    { type: 'production', position: { x: 380, y: 380 } },
  ];

  return (
    <div className="flex-1">
      <div 
        className="relative border-4 border-pixel-dark rounded-sm overflow-hidden bg-pixel-light"
        style={{ 
          width: '500px', 
          height: '500px', 
        }}
      >
        <Player position={playerPosition} onMove={onPlayerMove} />
        
        {stations.map((station, index) => (
          <Station
            key={index}
            type={station.type as any}
            position={station.position}
            playerPosition={playerPosition}
            onInteract={onStationInteract}
          />
        ))}
        
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          {Array.from({ length: 26 }).map((_, i) => (
            <div
              key={`v-${i}`}
              className="absolute w-px bg-pixel-dark"
              style={{ left: `${i * 20}px`, height: '100%' }}
            />
          ))}
          {Array.from({ length: 26 }).map((_, i) => (
            <div
              key={`h-${i}`}
              className="absolute h-px bg-pixel-dark"
              style={{ top: `${i * 20}px`, width: '100%' }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameMap;
