// components/UserInput.js
import React, { useEffect, useRef, useState } from 'react';
import './input.css';
import { useDictationContext } from './dictation';

import { useSession } from 'next-auth/react';

export default function UserInput() {
  const { state, setState, handleNextWord, handleReponseFalse } = useDictationContext();
  const { data: session } = useSession();
  const [showPlaceholder, setShowPlaceholder] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const listWordToGuess = state.dictationText.split(' ');
 
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
      if (showPlaceholder === true)
        setShowPlaceholder(false);
    }
    if (inputRef.current) {
      const fontSize = window.getComputedStyle(inputRef.current).fontSize;
      const fontSizeValue = parseFloat(fontSize);
      if (showPlaceholder) {
        inputRef.current.style.width = 'auto';
      } else {
        inputRef.current.style.width = state.input ? `${state.input.length * fontSizeValue * 0.6}px` : '17px';
      }
    }
  }, [state.input, showPlaceholder, state.currentWordIndex]);
  
  const handleInputChange = (currentInput: React.ChangeEvent<HTMLInputElement>) => {
    const newInputValue = currentInput.target.value;
    const LastCaracterInput = newInputValue[newInputValue.length - 1];

    if (LastCaracterInput === ' ') {
      handleSpace();
    } else {
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
    console.log("handlespace")
    if (compareWords(state.input, listWordToGuess[state.currentWordIndex])) {
      var currentState: string = state.stateWordInput.valueOf();
      console.log("handleNextWord")
      handleNextWord(currentState);
    } else {
      console.log("handleResponseFalse")
      handleReponseFalse();
    }
  };

  const compareWords = (word1: string, word2: string): boolean => {
    const normalizedWord1 = word1.replace(/oe/g, "œ");
    const normalizedWord2 = word2.replace(/oe/g, "œ");
    return normalizedWord1 === normalizedWord2;
  };
  

  return (
    <>
      <span className="inline-block">
        <input
          ref={inputRef}
          autoCapitalize="none"
          type="text"
          value={state.input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={showPlaceholder ? "Écrivez la dictée ici" : ""}
          className="custom-input"
          style={{ border: 'none', background: 'transparent', outline: 'none', width: showPlaceholder ? 'auto' : undefined }}
        />
      </span>
    </>
  );
}