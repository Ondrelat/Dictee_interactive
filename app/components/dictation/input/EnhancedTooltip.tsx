import React, { useEffect, useState } from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { motion, AnimatePresence } from 'framer-motion';

interface EnhancedTooltipProps {
  children: React.ReactNode;
  content: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  animationDuration?: number; // Durée de l'animation en secondes
}

/**
 * Composant de tooltip amélioré avec animation et mise en évidence des mots-clés
 */
const EnhancedTooltip: React.FC<EnhancedTooltipProps> = ({
  children,
  content,
  isOpen,
  onOpenChange,
  animationDuration = 5 // Durée par défaut de 5 secondes
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen && content) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen, content]);

  /**
   * Met en évidence les mots-clés dans le texte du tooltip
   */
  const highlightKeyword = (text: string) => {
    const keywords = [
      "majuscule", "accent", "ponctuation", "accord", "consonnes",
      "phrase", "nom propre", "point", "faute"
    ];

    const parts = text.split(new RegExp(`(${keywords.join('|')})`, 'i'));
    return parts.map((part, index) =>
      keywords.some(keyword => part.toLowerCase() === keyword.toLowerCase())
        ? <strong key={index} className="font-bold text-yellow-300">{part}</strong>
        : part
    );
  };

  return (
    <Tooltip.Provider>
      <Tooltip.Root open={isVisible} onOpenChange={onOpenChange}>
        <Tooltip.Trigger asChild>
          {children}
        </Tooltip.Trigger>
        <AnimatePresence>
          {isVisible && content && (
            <Tooltip.Portal forceMount>
              <Tooltip.Content asChild sideOffset={5}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white px-4 py-3 rounded-lg shadow-lg text-sm max-w-xs border border-indigo-400"
                >
                  <p className="font-medium">{highlightKeyword(content)}</p>
                  <motion.div
                    className="absolute inset-x-0 bottom-0 h-1 bg-white rounded-full"
                    initial={{ scaleX: 0, originX: 0 }}
                    animate={{ scaleX: 1, transition: { duration: animationDuration, ease: "linear" } }}
                  />
                  <Tooltip.Arrow className="fill-indigo-500" />
                </motion.div>
              </Tooltip.Content>
            </Tooltip.Portal>
          )}
        </AnimatePresence>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

export default EnhancedTooltip;