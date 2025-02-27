import React, { useEffect, useRef, useState } from 'react';
import './input.css';
import { useSession } from 'next-auth/react';
import { useDictationContext } from '@/app/context/DictationContext';
import EnhancedTooltip from './EnhancedTooltip';
import { useTooltip } from '@/app/hooks/useTooltip';
import { useWordComparison } from '@/app/hooks/useWordComparison';
import { normalizeWord, removeMarkers } from '@/app/utils/textUtils';

interface UserInputProps {
  ref: React.RefObject<HTMLInputElement>;
}

/**
 * Composant d'entrée utilisateur pour une application de dictée
 */
const UserInput = React.forwardRef<HTMLInputElement, UserInputProps>((props, ref) => {
  // Contexte et état global
  const { state, setState, handleNextWord, handleReponseFalse } = useDictationContext();
  const { data: session } = useSession();
  
  // État local
  const [showPlaceholder, setShowPlaceholder] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const measureRef = useRef<HTMLSpanElement>(null);
  
  // Custom hooks
  const { 
    showTooltip, 
    tooltipContent, 
    tooltipDuration,
    showTooltipMessage,
    hideTooltip 
  } = useTooltip();
  
  // Liste des mots à deviner
  const listWordToGuess = state.dictationText.split(' ');
  
  // Détermine si le mot actuel correspond au mot à deviner
  const compareWords = (word1: string, word2: string): boolean => {
    // Vérifier que les deux mots existent
    if (!word1 || !word2) return false;
    
    const normalizedWord1 = normalizeWord(word1);
    const tempNormalizedWord2 = normalizeWord(word2);
    const normalizedWord2 = removeMarkers(tempNormalizedWord2);
    
    // Gestion des mots marqués (avec #)
    if (tempNormalizedWord2.includes('#') && normalizedWord1 === normalizedWord2) {
      setState(prevState => ({
        ...prevState,
        audioIndex: prevState.audioIndex + 1,
      }));
    }

    return normalizedWord1 === normalizedWord2;
  };

  // Affiche la réponse correcte après 3 tentatives
  const showCorrectAnswerTooltip = (correctWord: string) => {
    const cleanedWord = correctWord.replace(/#/g, '');
    showTooltipMessage(`La réponse correcte était : ${cleanedWord}`);
  };

  // Obtenir le mot à deviner actuel de manière sécurisée
  const currentWordToGuess = state.currentWordToGuess ? state.currentWordToGuess.toString() : '';
  
  // Comparaison de mots pour l'aide contextuelle
  const { errorMessage } = useWordComparison({
    currentInput: state.input,
    currentWordToGuess,
    previousWord: state.wordDataArray.length > 0 
      ? state.wordDataArray[state.wordDataArray.length - 1]?.word 
      : undefined
  });

  // Affiche l'aide contextuelle
  const handleToolTipHelp = () => {
    if (errorMessage) {
      showTooltipMessage(errorMessage);
    }
  };

  // Gère la soumission d'un mot
  const handleSpace = () => {
    setState(prevState => ({
      ...prevState,
      isTyping: false,
    }));
    
    // Vérifier si nous sommes à la fin de la dictée
    if (state.currentWordIndex >= listWordToGuess.length) {
      return; // Ne rien faire si nous sommes à la fin
    }
    
    if (compareWords(state.input, listWordToGuess[state.currentWordIndex])) {
      // Mot correct
      const currentState = state.stateWordInput.valueOf();
      handleNextWord(currentState);
      setErrorCount(0);
    } else {
      // Mot incorrect
      handleToolTipHelp();
      handleReponseFalse();
      
      // Mettre à jour le compteur d'erreurs
      const newErrorCount = errorCount + 1;
      setErrorCount(newErrorCount);
      
      // Après 3 tentatives, montrer la réponse et passer au mot suivant
      if (newErrorCount >= 3) {
        showCorrectAnswerTooltip(listWordToGuess[state.currentWordIndex]);
        handleNextWord('forced');
        if (listWordToGuess[state.currentWordIndex]?.endsWith('#')) {
          setState(prevState => ({
            ...prevState,
            audioIndex: prevState.audioIndex + 1,
          }));
        }
        setErrorCount(0);
      }
    }
  };

  // Gère les changements dans le champ de saisie
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newInputValue = event.target.value;
    const lastCharacterInput = newInputValue[newInputValue.length - 1];
    
    // Si la dictée est terminée, ne rien faire
    if (state.currentWordIndex >= listWordToGuess.length) {
      return;
    }
    
    // Si l'utilisateur tape un espace, valider le mot
    if (lastCharacterInput === ' ') {
      handleSpace();
    } 
    // Empêcher d'entrer plusieurs mots à la fois
    else if (newInputValue.includes(' ')) {
      showTooltipMessage("Veuillez valider le premier mot avant d'en écrire un deuxième");
    }
    else {
      // Mettre à jour l'input et l'état de la saisie
      setState(prevState => ({
        ...prevState,
        input: newInputValue,
        isTyping: true,
        // Démarrer le timer au premier caractère saisi
        timerStarted: newInputValue.length === 1 ? true : prevState.timerStarted
      }));
    }
  };

  // Gère la touche Entrée pour soumettre un mot
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === 'Enter' || event.key === 'Enter') {
      handleSpace();
    }
  };

  // Effet pour arrêter le timer quand la dictée est complète
  useEffect(() => {
    if (state.currentWordIndex >= listWordToGuess.length) {
      setState(prevState => ({
        ...prevState,
        timerStarted: false,
      }));
    }
  }, [state.currentWordIndex, listWordToGuess.length, setState]);

  // Effet pour gérer l'affichage du placeholder et le redimensionnement de l'input
  useEffect(() => {
    // Gestion du placeholder
    if (state.currentWordIndex === 0 && state.input === "") {
      setShowPlaceholder(true);
    } else if (showPlaceholder) {
      setShowPlaceholder(false);
    }

    // Redimensionnement dynamique de l'input
    const inputElement = ref as React.MutableRefObject<HTMLInputElement>;
    const measureSpan = measureRef.current;

    if (inputElement?.current && measureSpan) {
      if (showPlaceholder) {
        inputElement.current.style.width = 'auto';
      } else {
        measureSpan.textContent = state.input || '\u00A0';
        const width = measureSpan.getBoundingClientRect().width;
        inputElement.current.style.width = `${width}px`;
      }
    }
  }, [state.input, showPlaceholder, state.currentWordIndex, ref]);

  // Déterminer la couleur du texte en fonction de l'état
  const getInputColor = () => {
    if (state.isTyping) return 'black';
    if (state.stateWordInput === 'correct') return 'green';
    if (state.stateWordInput && ['incorrect', 'ErrorMajuscule', 'ErrorPonctuation'].includes(state.stateWordInput.toString())) return 'red';
    return 'black';
  };

  return (
    <EnhancedTooltip
      content={tooltipContent}
      isOpen={showTooltip}
      onOpenChange={(open) => open ? showTooltipMessage(tooltipContent) : hideTooltip()}
      animationDuration={tooltipDuration / 1000}
    >
      <span className="inline-block">
        <input
          ref={ref}
          autoCapitalize="none"
          type="text"
          value={state.input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={showPlaceholder ? "Écrivez la dictée ici" : ""}
          className="custom-input"
          style={{
            border: 'none',
            background: 'transparent',
            outline: 'none',
            width: showPlaceholder ? 'auto' : undefined,
            color: getInputColor(),
          }}
        />
        <span
          ref={measureRef}
          style={{
            position: 'absolute',
            visibility: 'hidden',
            whiteSpace: 'pre',
            font: 'inherit'
          }}
        />
      </span>
    </EnhancedTooltip>
  );
});

UserInput.displayName = 'UserInput';

export default UserInput;