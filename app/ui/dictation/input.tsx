import React, { useEffect, useRef, useState } from 'react';
import './input.css';
import { useDictationContext } from './dictation';
import { useSession } from 'next-auth/react';
import * as Tooltip from '@radix-ui/react-tooltip';

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
  const [isTooltipFading, setIsTooltipFading] = useState(false);
  const [errorCount, setErrorCount] = useState(0);

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


  // Time start
  useEffect(() => {
    if (state.currentWordIndex === listWordToGuess.length) {
      setState(prevState => ({
        ...prevState,
        timerStarted: false,
      }));
    }
  }, [state.currentWordIndex, listWordToGuess.length, setState]);

  // Input placing
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

  // Logique input
  const handleInputChange = (currentInput: React.ChangeEvent<HTMLInputElement>) => {

    //Faire en sorte que la variable soit plus propre
    const newInputValue = currentInput.target.value;

    // Pour avoir le dernier caractère
    const LastCaracterInput = newInputValue[newInputValue.length - 1];

    if (LastCaracterInput === ' ') {
      handleSpace();
    } else if (newInputValue.includes(' ')) {
      setShowTooltip(true);
      setTooltipContent("Veuillez valider le premier mot avant d'en écrire un deuxième");
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
    if (tooltipContent) {
      setIsTooltipFading(true);
      setTimeout(() => {
        setShowTooltip(false);
        setTooltipContent('');
        setIsTooltipFading(false);
      }, 1000);
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

  const showCorrectAnswerTooltip = (correctWord: string) => {
    setTooltipContent(`La réponse correcte était : ${correctWord}`);
    setShowTooltip(true);
    setIsTooltipFading(false);

    setTimeout(() => {
      setIsTooltipFading(true);
      setTimeout(() => {
        setShowTooltip(false);
        setTooltipContent('');
        setIsTooltipFading(false);
      }, 1000);
    }, 2000);
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

  useEffect(() => {
    if (showTooltip && !isTooltipFading) {
      const timer = setTimeout(() => {
        setIsTooltipFading(true);
        setTimeout(() => {
          setShowTooltip(false);
          setTooltipContent('');
          setIsTooltipFading(false);
        }, 1000);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showTooltip, isTooltipFading]);

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
    console.log("prevWord", prevWord);

    if (state.currentWordToGuess !== state.input.toUpperCase()) {
      if (!prevWord || prevWord.endsWith('.') || prevWord.endsWith('!') || prevWord.endsWith('?')) {
        helperContent = "Une phrase commence toujours pas une majuscule";
      }
      else {
        helperContent = "Un nom propre commence toujours pas une majuscule";
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
      setTooltipContent(helperContent);
      setShowTooltip(true);
      setIsTooltipFading(false);
    } else {
      setShowTooltip(false);
      setTooltipContent('');
    }

  };


  return (
    <Tooltip.Provider>
      <Tooltip.Root open={showTooltip}>
        <Tooltip.Trigger asChild>
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
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="bg-red-500 text-white px-3 py-2 rounded shadow-lg text-sm"
            sideOffset={5}
          >
            {tooltipContent}
            <Tooltip.Arrow className="fill-red-500" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
});

UserInput.displayName = 'UserInput';

export default UserInput;