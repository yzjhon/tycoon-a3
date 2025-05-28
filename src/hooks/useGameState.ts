
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const useGameState = () => {
  const navigate = useNavigate();
  const [playerPosition, setPlayerPosition] = useState({ x: 240, y: 240 });
  const [capital, setCapital] = useState(50000);
  const [sustainability, setSustainability] = useState(50);
  const [round, setRound] = useState(1);
  const [playerName, setPlayerName] = useState('');
  const [currentInvestments, setCurrentInvestments] = useState<{[key: string]: number}>({});
  const [isInvestmentModalOpen, setIsInvestmentModalOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState('');
  const [isResultsModalOpen, setIsResultsModalOpen] = useState(false);
  const [roundResults, setRoundResults] = useState({
    profit: 0,
    sustainabilityChange: 0,
    newCapital: 0,
    newSustainability: 0,
  });

  useEffect(() => {
    const name = localStorage.getItem('playerName');
    if (!name) {
      navigate('/register');
      return;
    }
    
    setPlayerName(name);
    setCapital(parseInt(localStorage.getItem('capital') || '50000'));
    setSustainability(parseInt(localStorage.getItem('sustainability') || '50'));
    setRound(parseInt(localStorage.getItem('round') || '1'));
  }, [navigate]);

  const calculateResults = useCallback(() => {
    const investments = currentInvestments;
    const totalInvestment = Object.values(investments).reduce((sum, amount) => sum + amount, 0);
    
    if (totalInvestment === 0) {
      return {
        profit: -5000,
        sustainabilityChange: -10,
        newCapital: capital - 5000,
        newSustainability: Math.max(0, sustainability - 10)
      };
    }

    const baseMultiplier = 0.5 + Math.random();
    const sustainabilityBonus = sustainability / 100;
    const balanceBonus = Object.keys(investments).length / 4;
    
    const totalMultiplier = baseMultiplier + sustainabilityBonus + balanceBonus;
    const profit = Math.round(totalInvestment * totalMultiplier - totalInvestment);
    
    let sustainabilityChange = 0;
    if (investments.innovation) sustainabilityChange += 5;
    if (investments.hr) sustainabilityChange += 3;
    if (investments.production && !investments.innovation) sustainabilityChange -= 3;
    if (investments.marketing && !investments.hr) sustainabilityChange -= 2;
    
    sustainabilityChange += Math.round((Math.random() - 0.5) * 10);
    
    const newCapitalCalculated = capital + profit;
    const newSustainabilityCalculated = Math.max(0, Math.min(100, sustainability + sustainabilityChange));
    
    return {
      profit,
      sustainabilityChange,
      newCapital: newCapitalCalculated,
      newSustainability: newSustainabilityCalculated
    };
  }, [currentInvestments, capital, sustainability]);

  const handleInvestment = useCallback((amount: number) => {
    const newCapital = capital - amount;
    setCapital(newCapital);
    
    setCurrentInvestments(prev => ({
      ...prev,
      [selectedStation]: (prev[selectedStation] || 0) + amount
    }));

    localStorage.setItem('capital', newCapital.toString());
  }, [capital, selectedStation]);

  const handleResultsClose = useCallback(() => {
    setIsResultsModalOpen(false);
    setCurrentInvestments({});
    
    if (round >= 3) {
      navigate('/game-over');
    } else {
      setRound(r => r + 1);
    }
  }, [navigate, round]);

  return {
    playerPosition,
    setPlayerPosition,
    capital,
    setCapital,
    sustainability,
    setSustainability,
    round,
    setRound,
    playerName,
    currentInvestments,
    setCurrentInvestments,
    isInvestmentModalOpen,
    setIsInvestmentModalOpen,
    selectedStation,
    setSelectedStation,
    isResultsModalOpen,
    setIsResultsModalOpen,
    roundResults,
    setRoundResults,
    calculateResults,
    handleInvestment,
    handleResultsClose
  };
};
