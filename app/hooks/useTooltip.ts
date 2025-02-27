import { useState, useCallback } from 'react';

interface UseTooltipReturn {
  showTooltip: boolean;
  tooltipContent: string;
  tooltipDuration: number;
  showTooltipMessage: (message: string, duration?: number) => void;
  hideTooltip: () => void;
}

/**
 * Hook personnalisé pour gérer l'affichage des tooltips
 */
export const useTooltip = (): UseTooltipReturn => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipContent, setTooltipContent] = useState('');
  const [tooltipDuration, setTooltipDuration] = useState(5000); // 5 secondes par défaut

  const showTooltipMessage = useCallback((message: string, duration = 5000) => {
    setTooltipContent(message);
    setShowTooltip(true);
    setTooltipDuration(duration);

    // Réinitialiser le tooltip après la durée spécifiée
    setTimeout(() => {
      setShowTooltip(false);
      setTooltipContent('');
    }, duration);
  }, []);

  const hideTooltip = useCallback(() => {
    setShowTooltip(false);
    setTooltipContent('');
  }, []);

  return {
    showTooltip,
    tooltipContent,
    tooltipDuration,
    showTooltipMessage,
    hideTooltip
  };
};