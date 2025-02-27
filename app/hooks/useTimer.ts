import { useEffect } from 'react';
import { DictationState } from '../context/DictationContext';

/**
 * Hook pour gérer le timer de la dictée
 */
export const useTimer = (
  timerStarted: boolean,
  setState: React.Dispatch<React.SetStateAction<DictationState>>
) => {
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (timerStarted) {
      timer = setInterval(() => {
        setState((prevState) => {
          const [hours, minutes, seconds] = prevState.timer.split(':').map(Number);
          const totalSeconds = hours * 3600 + minutes * 60 + seconds + 1;
          
          const newHours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
          const newMinutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
          const newSeconds = (totalSeconds % 60).toString().padStart(2, '0');
          
          return { ...prevState, timer: `${newHours}:${newMinutes}:${newSeconds}` };
        });
      }, 1000);
    }

    // Nettoyage du timer lors du démontage du composant
    return () => {
      clearInterval(timer);
    };
  }, [timerStarted, setState]);
};

export default useTimer;