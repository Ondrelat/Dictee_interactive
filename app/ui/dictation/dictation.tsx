'use client';
import React, { useState, useContext, createContext, useEffect, useCallback } from 'react';

import Audio from './audio';
import { dictation } from '@prisma/client';
import './dictation.css';
import Score from './score';
import ResultDictation from './resultDictation';
import Link from 'next/link';
import DictationResults from './DictationResults';
import Helper from './helper'
import ShowResponse from './ButtonShowResponse'
import HeadBand from './headband'
import { Clock, BookOpen, HelpCircle } from 'lucide-react';

interface Props {
  initialDictationData: dictation;
}

interface WordData {
  word: string;
  state: string;
}

interface DictationState {
  dictationText: String;
  input: string;
  isTyping: boolean;
  score: number;
  numberCorrect: number;
  numberIncorrect: number;
  wordDataArray: WordData[];
  stateWordInput: String;
  currentWordToGuess: String;
  timer: string;
  onDictationFinished: boolean;
  correctPercentage: number
  baseScore: number
  audioIndex: number
  showPopup: boolean
  scoreBeforeAugmentation: number
  scoreBonusPercentage: number
  finalScore: number
  typeError: string
  currentWordIndex: number
  timerStarted: boolean
}

const getInitialState = (dictationText: string, dictationLevel: string): DictationState => {
  let baseScore = 1000;
  if (dictationLevel === 'Facile') {
    baseScore = 1500;
  }
  if (dictationLevel === 'Intermédiaire') {
    baseScore = 2000;
  }

  return {
    input: '',
    isTyping: false,
    score: baseScore,
    numberCorrect: 0,
    numberIncorrect: 0,
    wordDataArray: [],
    stateWordInput: 'correct',
    currentWordToGuess: dictationText.split(' ')[0],
    timer: '00:00:00',
    onDictationFinished: false,
    correctPercentage: 100,
    baseScore: baseScore,
    audioIndex: 1,
    showPopup: false,
    scoreBeforeAugmentation: 0,
    scoreBonusPercentage: 0,
    finalScore: 0,
    dictationText: dictationText,
    typeError: '',
    currentWordIndex: 0,
    timerStarted: false
  };
};

const DictationContext = createContext<{
  state: DictationState;
  setState: React.Dispatch<React.SetStateAction<DictationState>>;
  handleNextWord: (paramState: string | null) => void;
  handleReponseFalse: () => void;
}>({
  state: getInitialState('', 'Débutant'),
  setState: () => null,
  handleNextWord: () => null,
  handleReponseFalse: () => null,
});

export function useDictationContext() {
  return useContext(DictationContext);
}

export default function Dictations({ initialDictationData }: Props) {


  const [state, setState] = useState<DictationState>(
    getInitialState(initialDictationData.text, initialDictationData.level)
  );
  const listWordToGuess = state.dictationText.split(' ');
  const [audioIndex, setAudioIndex] = useState(1);

  const formatDuration = (minutes: number | null, seconds: number | null) => {
    if (minutes !== null && seconds !== null) {
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
      return `${formattedMinutes}:${formattedSeconds}`;
    }
    return null;
  };
  const duration = formatDuration(initialDictationData.audio_duration_minutes, initialDictationData.audio_duration_seconds);

  const handleClosePopup = () => {
    setState(prevState => ({
      ...prevState,
      showPopup: false,
    }));
  };

  const handleNextWord = (paramState: string | null) => {

    var correctWords = state.numberCorrect
    var incorrectWords = state.numberIncorrect;
    if (paramState !== "incorrect") {
      correctWords += 1;
    } else {
      incorrectWords += 1;
    }
    var nextWordIndex = state.currentWordIndex + 1;
    var currentWordIndex = state.currentWordIndex;

    setState(prevState => ({
      ...prevState,
      input: '',
      wordDataArray: [
        ...prevState.wordDataArray,
        { word: listWordToGuess[currentWordIndex], state: paramState! },
      ],
      stateWordInput: "correct",
      currentWordToGuess: listWordToGuess[nextWordIndex],
      numberCorrect: correctWords,
      numberIncorrect: incorrectWords,
      currentWordIndex: nextWordIndex
    }));

    const lastChar = state.input.slice(-1);
    if ([".", "!", "?", ",", ";", ":"].includes(lastChar)) {
      setState(prevState => ({
        ...prevState,
        audioIndex: state.audioIndex + 1,
      }));
    }

    if (state.currentWordIndex + 1 === listWordToGuess.length) {
      const { correctPercentage, finalScore } = calculateScore(correctWords, incorrectWords)
      handleDictationEnd(correctPercentage, finalScore);
    }

  };

  const handleDictationEnd = (correctPercentage: number, finalScore: number) => {
    console.log("handleDicationEnd");
    const scoreBonusPercentage = calculatePourcentScoreBonus(state.timer);
    const augmentedFinalScore = Math.round(state.score * (scoreBonusPercentage / 100 + 1));
    setTimeout(() => {
      setState(prevState => ({
        ...prevState,
        scoreBeforeAugmentation: finalScore,
        scoreBonusPercentage: scoreBonusPercentage,
        finalScore: augmentedFinalScore,
        onDictationFinished: true,
        score: augmentedFinalScore,
        showPopup: true,
      }));
    }, 1000);


    console.log("timeoutfinit" + state.showPopup);
  };

  const calculatePourcentScoreBonus = (duration: string): number => {
    const maxBonus = 42;
    const minBonus = 1;
    const seconds = parseInt(duration.split(':').slice(2).join(''), 10);
    const minutes = parseInt(duration.split(':').slice(1, 2).join(''), 10);
    const hours = parseInt(duration.split(':').slice(0, 1).join(''), 10);
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;

    const a = 41;
    const b = 0.05;
    const c = 0.6;

    const bonus = a * Math.exp(-b * Math.pow(totalSeconds, c)) + minBonus;
    const roundedBonus = Math.round(bonus);

    return roundedBonus;
  };

  const calculateScore = useCallback((numberCorrect: number, numberIncorrect: number) => {
    let correctPercentage = 0;
    let finalScore = 0;

    if (numberCorrect !== 0 || numberIncorrect !== 0) {
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

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (state.timerStarted) {
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
  }, [state.timerStarted, setState]);

  const handleReponseFalse = () => {
    //console.log("state.input.toLowerCase() " + state.input.toLowerCase())
    //console.log("listWordToGuess[currentWordIndex].toLowerCase()" + listWordToGuess[state.currentWordIndex].toLowerCase())
    //Si une erreur de majuscule
    if (state.input.toLowerCase() === listWordToGuess[state.currentWordIndex].toLowerCase()) {
      setState(prevState => ({
        ...prevState,
        stateWordInput: "ErrorMajuscule",
        typeError: "Majuscule"
      }));
      return
    }

    // Vérification de la ponctuation 
    const expectedPunctuation = listWordToGuess[state.currentWordIndex].replace(/[.,!?;:]/g, '');
    if (state.input === expectedPunctuation) {
      setState(prevState => ({
        ...prevState,
        stateWordInput: "ErrorPonctuation",
        typeError: "Ponctuation"
      }));
      return;
    }

    setState(prevState => ({
      ...prevState,
      stateWordInput: "incorrect",
      typeError: "Word",
      isTyping: false,
      numberIncorrect: prevState.numberIncorrect + 1
    }));

  };
  return (
    <DictationContext.Provider value={{ state, setState, handleNextWord, handleReponseFalse }}>
      <div className="min-h-screen bg-gray-100 py-8 px-4">
        <div className="max-w-3xl mx-auto space-y-4"> {/* Réduit l'espacement et la largeur maximale */}
          {/* En-tête et Audio combinés */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden"> {/* Supprime le padding ici */}
            <div className="p-6 pb-3"> {/* Ajoute le padding ici, réduit en bas */}
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                    <BookOpen className="w-6 h-6 mr-2 text-blue-600" />
                    {initialDictationData.title}
                  </h1>
                  <p className="text-sm text-gray-600 mt-1 italic">{initialDictationData.excerpt}</p>
                </div>
                <div className="flex items-center space-x-2"> {/* Réduit l'espacement */}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${initialDictationData.level === 'Débutant' ? 'bg-green-100 text-green-800' :
                      initialDictationData.level === 'Intermédiaire' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                    }`}>
                    {initialDictationData.level}
                  </span>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>{duration}</span>
                  </div>
                </div>
              </div>
            </div>
            <Audio dictation={initialDictationData} audioIndexParam={state.audioIndex} />
          </div>

          {/* Zone de saisie */}
          <div className="bg-white shadow-md rounded-lg p-4"> {/* Réduit le padding */}
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold">Zone de saisie</h2>
              <ShowResponse />
            </div>
            <ResultDictation />
          </div>

          {/* Helper (visible uniquement en cas d'erreur) */}
          {(state.stateWordInput === 'incorrect' || state.typeError !== '') && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-lg">
              <Helper typeError={state.typeError} />
            </div>
          )}
        </div>

        {state.showPopup && (
          <DictationResults onClose={handleClosePopup} />
        )}
      </div>
    </DictationContext.Provider>
  );
}