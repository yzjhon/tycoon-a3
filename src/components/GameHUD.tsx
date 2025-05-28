
interface GameHUDProps {
  playerName: string;
  capital: number;
  sustainability: number;
  round: number;
  timeRemaining: number;
  formatTime: (seconds: number) => string;
}

const GameHUD = ({ playerName, capital, sustainability, round, timeRemaining, formatTime }: GameHUDProps) => {
  return (
    <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
      <div className="pixel-card bg-pixel-light/90">
        <div className="font-pixel text-sm text-pixel-dark">
          <span className="font-retro">Jogador:</span> {playerName}
        </div>
      </div>
      
      <div className="flex gap-4">
        <div className="pixel-card bg-pixel-light/90">
          <div className="font-pixel text-sm text-pixel-dark">
            <span className="font-retro">Capital:</span> R$ {capital.toLocaleString()}
          </div>
        </div>
        
        <div className="pixel-card bg-pixel-light/90">
          <div className="font-pixel text-sm text-pixel-dark">
            <span className="font-retro">Sustentabilidade:</span> {sustainability}%
          </div>
        </div>
        
        <div className="pixel-card bg-pixel-light/90 relative">
          <div className="font-pixel text-sm text-pixel-dark">
            <span className="font-retro">Rodada:</span> {round}/3
          </div>
        </div>

        <div className={`pixel-card ${timeRemaining < 30 ? 'bg-pixel-red/90' : 'bg-pixel-light/90'} relative`}>
          <div className="font-pixel text-sm text-pixel-dark">
            <span className="font-retro">Tempo:</span> {formatTime(timeRemaining)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameHUD;
