
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface UseGameTimerProps {
  currentInvestments: {[key: string]: number};
  onRoundFinish: () => void;
}

export const useGameTimer = ({ currentInvestments, onRoundFinish }: UseGameTimerProps) => {
  const [timeRemaining, setTimeRemaining] = useState(120);
  const [isTimerActive, setIsTimerActive] = useState(true);

  const finishRound = useCallback(() => {
    setIsTimerActive(false);
    onRoundFinish();
  }, [onRoundFinish]);

  const resetTimer = useCallback(() => {
    setTimeRemaining(120);
    setIsTimerActive(true);
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isTimerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      setIsTimerActive(false);
      if (Object.keys(currentInvestments).length > 0) {
        finishRound();
      } else {
        toast.warning("Tempo esgotado! Você precisa fazer pelo menos um investimento.");
        setTimeRemaining(30);
        setIsTimerActive(true);
      }
    }
    
    return () => clearInterval(interval);
  }, [isTimerActive, timeRemaining, currentInvestments, finishRound]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return {
    timeRemaining,
    isTimerActive,
    finishRound,
    resetTimer,
    formatTime
  };
};
