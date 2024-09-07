import React, { useEffect, useRef, useState } from 'react';
import './input.css';
import { useDictationContext } from './dictation';
import { useSession } from 'next-auth/react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { motion, AnimatePresence } from 'framer-motion';

interface EnhancedTooltipProps {
  children: React.ReactNode;
  content: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  animationDuration?: number; // Nouvelle prop pour la durée de l'animation
}

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


interface UserInputProps {
  ref: React.RefObject<HTMLInputElement>;
}

const UserInput = React.forwardRef<HTMLInputElement, UserInputProps>((props, ref) => {
  const { state, setState, handleNextWord, handleReponseFalse } = useDictationContext();
  const { data: session } = useSession();
  const [showPlaceholder, setShowPlaceholder] = useState(false);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipContent, setTooltipContent] = useState('');
  const [errorCount, setErrorCount] = useState(0);
  const [tooltipDuration, setTooltipDuration] = useState(5000);

  const listWordToGuess = state.dictationText.split(' ');

  const removePunctuation = (str: string): string => {
    return str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
  };

  const removeAccents = (str: string): string => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  function removeFinalS(word: string): string {
    return word.endsWith('s') ? word.slice(0, -1) : word;
  }

  function removeFinalES(word: string): string {
    return word.endsWith('es') ? word.slice(0, -2) : word;
  }

  function removeFinalE(word: string): string {
    return word.endsWith('e') ? word.slice(0, -1) : word;
  }

  const checkMissingEBeforeS = (correct: string, input: string): boolean => {
    return correct.endsWith('es') && input.endsWith('s') && !input.endsWith('es');
  };

  const checkDoubleConsonantError = (correct: string, input: string): boolean => {
    const doubleConsonants = ['mm', 'nn', 'tt', 'll', 'ss', 'rr', 'cc', 'ff', 'pp'];
    for (let dc of doubleConsonants) {
      if (correct.includes(dc) && !input.includes(dc)) {
        return true; // Il manque une double consonne
      }
      if (!correct.includes(dc) && input.includes(dc)) {
        return true; // Il y a une double consonne en trop
      }
    }
    return false;
  };

  useEffect(() => {
    if (state.currentWordIndex === listWordToGuess.length) {
      setState(prevState => ({
        ...prevState,
        timerStarted: false,
      }));
    }
  }, [state.currentWordIndex, listWordToGuess.length, setState]);

  useEffect(() => {
    if (state.currentWordIndex === 0 && state.input === "") {
      setShowPlaceholder(true);
    } else {
      if (showPlaceholder === true) setShowPlaceholder(false);
    }

    const refObj = ref as React.MutableRefObject<HTMLInputElement>;
    const measureSpan = measureRef.current;

    if (refObj && refObj.current && measureSpan) {
      if (showPlaceholder) {
        refObj.current.style.width = 'auto';
      } else {
        measureSpan.textContent = state.input || '\u00A0';
        const width = measureSpan.getBoundingClientRect().width;
        refObj.current.style.width = `${width}px`;
      }
    }
  }, [state.input, showPlaceholder, state.currentWordIndex, ref]);

  const handleInputChange = (currentInput: React.ChangeEvent<HTMLInputElement>) => {
    const newInputValue = currentInput.target.value;
    const LastCaracterInput = newInputValue[newInputValue.length - 1];

    if (LastCaracterInput === ' ') {
      handleSpace();
    } else if (newInputValue.includes(' ')) {
      showTooltipMessage("Veuillez valider le premier mot avant d'en écrire un deuxième");
    }
    else {
      setState({ ...state, input: newInputValue, isTyping: true });

      if (newInputValue.length === 1 && !state.timerStarted) {
        setState(prevState => ({
          ...prevState,
          timerStarted: true,
        }));
      }
    }
  };

  const handleKeyDown = (currentInput: React.KeyboardEvent<HTMLInputElement>) => {
    if (currentInput.code === 'Enter' || currentInput.key === 'Enter') {
      handleSpace();
    }
  };

  const handleSpace = () => {
    setState({
      ...state,
      isTyping: false,
    });
    if (compareWords(state.input, listWordToGuess[state.currentWordIndex])) {
      var currentState: string = state.stateWordInput.valueOf();
      handleNextWord(currentState);
      setErrorCount(0);
      setTooltipContent('');
    } else {
      handleToolTipHelp();
      handleReponseFalse();
      setErrorCount(prevCount => prevCount + 1);
      if (errorCount + 1 >= 3) {
        showCorrectAnswerTooltip(listWordToGuess[state.currentWordIndex]);
        handleNextWord('forced');
        setErrorCount(0);
      }
    }
  };

  const showTooltipMessage = (message: string, isCorrect: boolean = false) => {
    const duration = isCorrect ? 1000 : 5000; // 1 seconde pour les réponses correctes, 5 secondes pour les erreurs
    setTooltipContent(message);
    setShowTooltip(true);
    setTooltipDuration(duration);

    // Réinitialiser le tooltip après la durée spécifiée
    setTimeout(() => {
      setShowTooltip(false);
      setTooltipContent('');
    }, duration);
  };




  const showCorrectAnswerTooltip = (correctWord: string) => {
    showTooltipMessage(`La réponse correcte était : ${correctWord}`);
  };

  const compareWords = (word1: string, word2: string): boolean => {
    const normalizedWord1 = word1.replace(/oe/g, "œ");
    const tempNormalizedWord2 = word2.replace(/oe/g, "œ");

    const normalizedWord2 = tempNormalizedWord2.replace(/^#|#$/g, '');
    if (tempNormalizedWord2.includes('#') && normalizedWord1 === normalizedWord2) {
      setState(prevState => ({
        ...prevState,
        audioIndex: state.audioIndex + 1,
      }));
    }

    return normalizedWord1 === normalizedWord2;
  };

  const handleToolTipHelp = () => {
    let helperContent = '';
    const WordGuessPonctuationless = removePunctuation(state.currentWordToGuess.toString());
    const InputPonctuationless = removePunctuation(state.input);

    const WordGuessAccentless = removeAccents(state.currentWordToGuess.toString());

    const WordGuessAccentPonctless = removeAccents(WordGuessPonctuationless);
    const InputPonctuationAccentless = removeAccents(InputPonctuationless);
    const SansAccordS = removeFinalS(WordGuessAccentPonctless);
    const SansAccordES = removeFinalES(WordGuessAccentPonctless);
    const SansAccordE = removeFinalE(WordGuessAccentPonctless);

    const prevWord: string | undefined = state.wordDataArray[state.wordDataArray.length - 1]?.word;

    if (state.input === state.currentWordToGuess.toLowerCase()) {
      if (!prevWord || prevWord.endsWith('.') || prevWord.endsWith('!') || prevWord.endsWith('?')) {
        helperContent = "Une phrase commence toujours par une majuscule";
      }
      else {
        helperContent = "Un nom propre commence toujours par une majuscule";
      }
    }

    if (checkDoubleConsonantError(WordGuessAccentPonctless, InputPonctuationAccentless)) {
      helperContent = 'Attention aux doubles consonnes. (mm, tt, ss, pp...)';
    }
    else if ((WordGuessAccentPonctless.endsWith("s") && InputPonctuationAccentless == SansAccordS) ||
      (WordGuessAccentPonctless.endsWith("es") && InputPonctuationAccentless == SansAccordES) ||
      (WordGuessAccentPonctless.endsWith("e") && InputPonctuationAccentless == SansAccordE) ||
      checkMissingEBeforeS(WordGuessPonctuationless, WordGuessAccentPonctless)) {
      helperContent = "Il y a probablement une faute d'accord";
    }
    else if (WordGuessAccentless === state.input) {
      helperContent = "Il y a probablement un problème d'accent";
    }
    else if (state.input == WordGuessPonctuationless && state.input != state.currentWordToGuess) {
      if (state.currentWordToGuess.endsWith('.') || state.currentWordToGuess.endsWith('!') || state.currentWordToGuess.endsWith('?')) {
        helperContent = 'Une phrase se finit toujours par un point';
      } else {
        helperContent = 'Attention aux ponctuations (,;:)';
      }
    }

    if (helperContent) {
      showTooltipMessage(helperContent);
    }
  };

  return (
    <EnhancedTooltip
      content={tooltipContent}
      isOpen={showTooltip}
      onOpenChange={setShowTooltip}
      animationDuration={tooltipDuration / 1000} // Convertir en secondes pour l'animation
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
            color: state.isTyping
              ? 'black'
              : state.stateWordInput === 'correct'
                ? 'green'
                : state.stateWordInput === 'incorrect' || state.stateWordInput === 'ErrorMajuscule' || state.stateWordInput === 'ErrorPonctuation'
                  ? 'red'
                  : 'black',
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