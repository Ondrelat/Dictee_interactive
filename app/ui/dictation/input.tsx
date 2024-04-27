// components/UserInput.js
import React, { useState, useEffect, useCallback } from 'react';
import './input.css';
import { useDictationContext } from './dictation';
import Helper from './helper'
import { useSession } from 'next-auth/react';
import DictationResults from './DictationResults';


interface UserInputProps {
  validateSentencePart: () => void;
  dictationText: String;
}

export default function UserInput({ validateSentencePart, dictationText }: UserInputProps) {
  const { state, setState } = useDictationContext();
  const { data: session } = useSession();
  //Commun qu'à ce fichier
  const [typeError, setTypeError] = useState<string>("");
  const listWordToGuess = dictationText.split(' ');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  const [timerStarted, setTimerStarted] = useState(false);
  const [scoreBeforeAugmentation, setScoreBeforeAugmentation] = useState(0);
  const [scoreBonusPercentage, setScoreBonusPercentage] = useState(0);
  const [finalScore, setFinalScore] = useState(0);

  const calculateScore = useCallback((numberCorrect: number, numberIncorrect: number) => {
    let correctPercentage = 0;
    let finalScore = 0;
  
    if (numberCorrect!== 0 || numberIncorrect !== 0) {
      const totalWords = numberCorrect + numberIncorrect;
      correctPercentage = (numberCorrect * 100) / totalWords;
      finalScore = Math.floor(state.baseScore * Math.pow(correctPercentage / 100, 1.5));
    }
  
    return { correctPercentage, finalScore };
  }, [state.baseScore]);
  
  useEffect(() => {
    const { correctPercentage, finalScore } = calculateScore(state.numberCorrect, state.numberIncorrect);
    setState(prevState => ({
      ...prevState,
      score: finalScore,
      correctPercentage: correctPercentage
    }));
  }, [calculateScore, setState, state.numberCorrect, state.numberIncorrect]);
  
  const calculateScoreBonus = (duration: string): number => {
    const seconds = parseInt(duration.split(':').slice(2).join(''), 10);
    const minutes = parseInt(duration.split(':').slice(1, 2).join(''), 10);
    const hours = parseInt(duration.split(':').slice(0, 1).join(''), 10);
  
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  
    const maxBonus = 40; // Bonus maximum en pourcentage
    const minBonus = 1; // Bonus minimum en pourcentage
    const halfLife = 60; // Durée en secondes où le bonus est réduit de moitié
  
    const bonus = maxBonus * Math.exp(-Math.log(2) * totalSeconds / halfLife) + minBonus;
  
    return Math.round(bonus);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
  
    if (timerStarted) {
      timer = setInterval(() => {
        setState(prevState => {
          const [hours, minutes, seconds] = prevState.timer.split(':').map(Number);
          const totalSeconds = hours * 3600 + minutes * 60 + seconds + 1;
          const newHours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
          const newMinutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
          const newSeconds = (totalSeconds % 60).toString().padStart(2, '0');
          return { ...prevState, timer: `${newHours}:${newMinutes}:${newSeconds}` };
        });
      }, 1000);
    }
  
    return () => {
      clearInterval(timer);
    };
  }, [timerStarted, setState]);
  
  useEffect(() => {
    if (currentWordIndex === listWordToGuess.length) {
      setTimerStarted(false);
    }
  }, [currentWordIndex, listWordToGuess.length]);
  
  const handleInputChange = (currentInput: React.ChangeEvent<HTMLInputElement>) => {
    const newInputValue = currentInput.target.value;
    const LastCaracterInput = newInputValue[newInputValue.length - 1];
  
    if (LastCaracterInput === ' ') {
      handleSpace();
    } else {
      setState({ ...state, input: newInputValue, isTyping: true });
      setTypeError("");
  
      if (newInputValue.length === 1 && !timerStarted) {
        setTimerStarted(true);
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

    if (state.input === listWordToGuess[currentWordIndex]) {
      var currentState: string = state.stateWordInput.valueOf();
      handleNextWord(currentState);
    } else {
      handleReponseFalse();
    }
  }

  const handleDictationEnd = (correctPercentage: number, finalScore: number) => {
    setScoreBeforeAugmentation(finalScore)
    const scoreBonusPercentage = calculateScoreBonus(state.timer);
    setScoreBonusPercentage(scoreBonusPercentage);
    const augmentedFinalScore = Math.round(state.score * (scoreBonusPercentage / 100 + 1));
    setFinalScore(augmentedFinalScore)
    console.log("augmentedFinalScore" + augmentedFinalScore)
    console.log("state.score" + state.score)
    setState(prevState => ({
      ...prevState,
      onDictationFinished: true,
      score: augmentedFinalScore
    }));

    // Afficher la pop-up
    setShowPopup(true);
  };

  const handleNextWord = (paramState: string | null) => {
    var correctWords = state.numberCorrect
    var inCorrrectWords = state.numberIncorrect
    if (paramState !== "incorrect") {
      correctWords += 1;
    }

    setState(prevState => ({
      ...prevState,
      input: '',
      wordDataArray: [
        ...prevState.wordDataArray,
        { word: listWordToGuess[currentWordIndex], state: paramState! },
      ],
      stateWordInput: "correct",
      currentWordToGuess: listWordToGuess[currentWordIndex + 1],
      numberCorrect:correctWords
    }));

    setCurrentWordIndex(prevIndex => prevIndex + 1);

    const lastChar = state.input.slice(-1);
    if ([".", "!", "?", ",", ";", ":"].includes(lastChar)) {
      validateSentencePart();
    }

    if (currentWordIndex + 1 === listWordToGuess.length) {
      const { correctPercentage, finalScore } = calculateScore(correctWords, inCorrrectWords)
      handleDictationEnd(correctPercentage, finalScore);
    }
  };
  
  const handleReponseFalse = () => {
    //Si une erreur de majuscule
    if (state.input.toLowerCase() === listWordToGuess[currentWordIndex].toLowerCase()) {
      setTypeError("Majuscule");
      setState(prevState => ({
        ...prevState,
        stateWordInput: "ErrorMajuscule",
      }));
      return
    }

    // Vérification de la ponctuation 
    const expectedPunctuation = listWordToGuess[currentWordIndex].replace(/[.,!?;:]/g, '');
    if (state.input === expectedPunctuation) {
      setTypeError("Ponctuation");
      setState(prevState => ({
        ...prevState,
        stateWordInput: "ErrorPonctuation",
      }));
      return;
    }

    setTypeError("Word");
    setState(prevState => ({
      ...prevState,
      stateWordInput: "incorrect",
      isTyping: false,
      numberIncorrect: prevState.numberIncorrect + 1
    }));
  };

  const DonnerLaReponse = () => {
    handleNextWord("incorrect");
    setState(prevState => ({
      ...prevState,
      isTyping: false,
      numberIncorrect: prevState.numberIncorrect + 1
    }));
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <>
      <div className="flex flex-col items-center mb-8">
        <input
          autoCapitalize="none"
          type="text"
          value={state.input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Écrivez la dictée ici"
          className="w-full px-4 py-3 text-lg border-2 border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          className="mt-4 px-6 py-2 text-white font-semibold bg-blue-500 rounded-md hover:bg-blue-600 transition duration-200"
          onClick={DonnerLaReponse}
        >
          <span className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Aide
          </span>
        </button>
      </div>
      <div className="relative">
        {(state.stateWordInput === 'incorrect' || typeError !== '') && (
          <Helper typeError={typeError} />
        )}
      </div>
      {showPopup && (
        <DictationResults
          scoreBeforeAugmentation={scoreBeforeAugmentation}
          scoreBonusPercentage={scoreBonusPercentage}
          finalScore={finalScore}
          timer={state.timer}
          onClose={handleClosePopup}
      />
    )}
    </>
  );
}