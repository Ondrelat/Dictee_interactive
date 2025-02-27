import { useCallback } from 'react';

/**
 * Hook pour calculer le score et le pourcentage de réussite
 */
export const useScoreCalculation = (baseScore: number) => {
  /**
   * Calcule le score et le pourcentage de mots corrects
   */
  const calculateScore = useCallback((numberCorrect: number, numberIncorrect: number) => {
    let correctPercentage = 0;
    let finalScore = 0;

    if (numberCorrect !== 0 || numberIncorrect !== 0) {
      const totalWords = numberCorrect + numberIncorrect;
      correctPercentage = (numberCorrect * 100) / totalWords;
      finalScore = Math.floor(baseScore * Math.pow(correctPercentage / 100, 1.5));
    }

    return { correctPercentage, finalScore };
  }, [baseScore]);

  /**
   * Calcule le bonus de score basé sur le temps écoulé
   */
  const calculateScoreBonus = useCallback((duration: string): number => {
    const maxBonus = 42;
    const minBonus = 1;
    
    // Conversion du format HH:MM:SS en secondes
    const [hours, minutes, seconds] = duration.split(':').map(Number);
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;

    // Formule de calcul du bonus (décroissance exponentielle)
    const a = 41;
    const b = 0.05;
    const c = 0.6;

    const bonus = a * Math.exp(-b * Math.pow(totalSeconds, c)) + minBonus;
    return Math.round(bonus);
  }, []);

  return {
    calculateScore,
    calculateScoreBonus
  };
};

export default useScoreCalculation;