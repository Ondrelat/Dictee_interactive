'use client';
import React, { useState, useContext, createContext, useEffect } from 'react';
import Audio from './audio';
import { dictation } from '@prisma/client';
import './dictation.css';
import ResultInputDictation from './resultInputDictation';
import DictationResults from './DictationResults';
import Helper from './helper';
import ShowResponse from './ButtonShowResponse';
import { Clock, BookOpen } from 'lucide-react';

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
const getInitialState = (dictationText: string): DictationState => {
  let baseScore = 1000;

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
  state: getInitialState(''),
  setState: () => null,
  handleNextWord: () => null,
  handleReponseFalse: () => null,
});

export function useDictationContext() {
  return useContext(DictationContext);
}

export default function Dictations({ initialDictationData }: Props) {
  const [state, setState] = useState<DictationState>(
    getInitialState(initialDictationData.text)
  );
  const listWordToGuess = state.dictationText.split(' ');

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
    let correctWords = state.numberCorrect;
    let incorrectWords = state.numberIncorrect;
    if (paramState !== "incorrect") {
      correctWords += 1;
    } else {
      incorrectWords += 1;
    }
    let nextWordIndex = state.currentWordIndex + 1;
    let currentWordIndex = state.currentWordIndex;

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

    if (state.currentWordIndex + 1 === listWordToGuess.length) {
      handleDictationEnd();
    }
  };

  const handleDictationEnd = () => {
    setTimeout(() => {
      setState(prevState => ({
        ...prevState,
        onDictationFinished: true,
        showPopup: true,
      }));
    }, 1000);
  };

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
      <main className="flex-grow flex flex-col items-center mt-8 px-4 min-h-screen">
        <div className="w-full max-w-3xl bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <BookOpen className="text-blue-600 mr-2" size={24} />
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{initialDictationData.title}</h2>
                  <p className="text-sm text-gray-600">{initialDictationData.excerpt}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${initialDictationData.level === 'Débutant' ? 'bg-green-100 text-green-800' :
                  initialDictationData.level === 'Intermédiaire' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                  {initialDictationData.level}
                </span>
                <span className="text-gray-600 text-sm flex items-center">
                  <Clock size={14} className="mr-1" />
                  {duration}
                </span>
              </div>
            </div>

            <div className="relative mb-4">
              <ResultInputDictation />
              <div className="absolute top-2 right-2">
                <ShowResponse />
              </div>
            </div>

            <Audio dictation={initialDictationData} audioIndexParam={state.audioIndex} />

            {(state.stateWordInput === 'incorrect' || state.typeError !== '') && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-lg mt-4 transition-all">
                <Helper typeError={state.typeError} />
              </div>
            )}

            <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
              <span>Mots justes : <strong className="text-green-600">{state.numberCorrect}</strong></span>
              <span>Mots faux : <strong className="text-red-600">{state.numberIncorrect}</strong></span>
            </div>
          </div>
        </div>
      </main>

      {state.showPopup && <DictationResults onClose={handleClosePopup} />}
    </DictationContext.Provider>
  );
}