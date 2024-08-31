'use client';
import React, { useState, useContext, createContext, useEffect, useCallback } from 'react';
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
    console.log("handleNextWord" + nextWordIndex)
    console.log("state.stateWordInput" + state.stateWordInput);

    const noDiesCurrentWordIndex = listWordToGuess[currentWordIndex].replace(/^#|#$/g, '');

    setState(prevState => ({
      ...prevState,
      input: '',
      wordDataArray: [
        ...prevState.wordDataArray,
        { word: noDiesCurrentWordIndex, state: paramState! },
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
    console.log("state.input.toLowerCase() " + state.input.toLowerCase())
    console.log("listWordToGuess[currentWordIndex].toLowerCase()" + listWordToGuess[state.currentWordIndex].toLowerCase())
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
      console.log("erreurPonctuation");
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
              <div className="absolute top-[0] right-0">
                <ShowResponse />
              </div>

            </div>

            <div className="absolute">
              <Helper typeError={state.typeError} />
            </div>

            <Audio dictation={initialDictationData} audioIndexParam={state.audioIndex} />



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