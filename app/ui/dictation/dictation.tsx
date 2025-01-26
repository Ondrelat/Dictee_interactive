'use client';
import React, { useState, useContext, createContext, useEffect, useCallback, useRef } from 'react';
import Audio from './audio';
import { dictation } from '@prisma/client';
import './dictation.css';
import ResultInputDictation from './resultInputDictation';
import Helper from './helper';
import { Clock, BookOpen, RefreshCw, ArrowRight } from 'lucide-react';
import { LoginButton } from '@/src/auth/LoginButton';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import axios from 'axios';

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
  const { data: session } = useSession();
  const scoreSubmittedRef = useRef(false);
  const lastIncorrectWord = useRef<number>();

  const submitFinalScore = useCallback(async () => {
    if (scoreSubmittedRef.current) return; // Si le score a déjà été soumis, on ne fait rien

    scoreSubmittedRef.current = true; // Marquer le score comme soumis avant la soumission

    const pourcentage = (state.numberCorrect / (state.numberCorrect + state.numberIncorrect)) * 100;
    const scoreData = {
      score: state.score,
      correct_words: state.numberCorrect,
      incorrect_words: state.numberIncorrect,
      pourcentage: pourcentage,
      timer: state.timer,
      userEmail: session?.user?.email,
      dictationId: initialDictationData.id,
      note: 20 - state.numberIncorrect,
    };

    console.log('Données envoyées à l\'API :', scoreData);

    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_BASE_URL + '/api/score', scoreData);
      if (response.status === 200) {
        console.log('Score enregistré avec succès');
        // Effectuez les actions nécessaires après l'enregistrement réussi du score
      } else {
        console.error('Erreur lors de l\'enregistrement du score');
        console.error('Réponse de l\'API :', response.data);
        // Gérez les erreurs d'enregistrement du score
      }
    } catch (error) {
      console.error('Erreur lors de la requête à l\'API :', error);
      // Gérez les erreurs de requête à l'API
    }
  }, [state.score, state.numberCorrect, state.numberIncorrect, session?.user?.email, state.timer, initialDictationData.id]);

  useEffect(() => {
    if (state.onDictationFinished && !scoreSubmittedRef.current) {
      submitFinalScore();
    }
  }, [state.onDictationFinished, submitFinalScore]);

  const formatDuration = (minutes: number | null, seconds: number | null) => {
    if (minutes !== null && seconds !== null) {
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
      return `${formattedMinutes}:${formattedSeconds}`;
    }
    return null;
  };
  const duration = formatDuration(initialDictationData.audio_duration_minutes, initialDictationData.audio_duration_seconds);

  const handleNextWord = (paramState: string | null) => {
    var correctWords = state.numberCorrect
    var incorrectWords = state.numberIncorrect;
    if (paramState === "forced") {
      // Do nothing
    }
    else if (paramState === "incorrect") {
      // Do nothing
    } else {
      correctWords += 1;
    }
    var nextWordIndex = state.currentWordIndex + 1;
    var currentWordIndex = state.currentWordIndex;
    console.log("handleNextWord" + nextWordIndex)
    console.log("state.stateWordInput" + state.stateWordInput);

    const noDiesCurrentWordIndex = listWordToGuess[currentWordIndex].replace(/^#|#$/g, '');

    const lastChar = state.currentWordToGuess.slice(-1);
    if ([".", "!", "?", ",", ";", ":"].includes(lastChar)) {
      setState(prevState => ({
        ...prevState,
        audioIndex: state.audioIndex + 1,
      }));
    }

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
      }));
    }, 1000);
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



  const renderDictationText = () => {
    return state.wordDataArray.map((wordData, index) => {
      let className = "inline-block px-1 py-0.5 rounded m-0.5 ";
      switch (wordData.state) {
        case "correct":
          className += "bg-green-100";
          break;
        case "incorrect":
        case "forced":
          className += "bg-red-100";
          break;
        case "ErrorMajuscule":
        case "ErrorPonctuation":
          className += "bg-yellow-100";
          break;
        default:
          className += "bg-gray-100";
      }
      return (
        <span key={index} className={className}>
          {wordData.word}
        </span>
      );
    });
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

    const wordIndex = state.currentWordIndex;
    const isNewIncorrectWord = lastIncorrectWord.current !== wordIndex
    console.log("lastIncorrectWord" + lastIncorrectWord + "wordIndex" + wordIndex)

    setState(prevState => ({
      ...prevState,
      stateWordInput: "incorrect",
      typeError: "Word",
      isTyping: false,
      numberIncorrect: isNewIncorrectWord ? prevState.numberIncorrect + 1 : prevState.numberIncorrect
    }));

    if (isNewIncorrectWord) {
      console.log("Je le met à jours");
      lastIncorrectWord.current = state.currentWordIndex;
    }
  };

  const handleRestartDictation = () => {
    setState(getInitialState(initialDictationData.text));
  };

  const renderLoginOption = () => {
    if (session) return null;

    return (
      <div className="text-center py-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600 mb-2">Connectez-vous pour enregistrer votre score</p>
        <LoginButton />
      </div>
    );
  };

  const renderSingleLineResults = () => {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm text-sm flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="font-semibold">Dictée terminée</span>
          <span className="font-bold text-blue-600">Score : {Math.floor(state.correctPercentage)}%</span>
          <span className="text-green-600">{state.numberCorrect} mots justes</span>
          <span className="text-red-600">{state.numberIncorrect} mots faux</span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleRestartDictation}
            className="flex items-center px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
          >
            <RefreshCw size={12} className="mr-1" />
            Recommencer
          </button>
          <Link href="/" className="flex items-center px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition duration-300">
            <ArrowRight size={12} className="mr-1" />
            Nouvelle dictée
          </Link>
        </div>
      </div>
    );
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

            {!state.onDictationFinished ? (
              <>
                <div className="relative mb-4">
                  <ResultInputDictation />
                </div>

                <div className="absolute">
                  <Helper typeError={state.typeError} />
                </div>

                <Audio dictation={initialDictationData} audioIndexParam={state.audioIndex} />

                <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
                  <span>Mots justes : <strong className="text-green-600">{state.numberCorrect}</strong></span>
                  <span>Mots faux : <strong className="text-red-600">{state.numberIncorrect}</strong></span>
                </div>
              </>
            ) : (
              <div className="space-y-6">
                {renderSingleLineResults()}
                <div className="bg-white p-4 rounded-lg border border-gray-200 text-sm leading-relaxed">
                  {renderDictationText()}
                </div>
                {renderLoginOption()}
              </div>
            )}
          </div>
        </div>
      </main>
    </DictationContext.Provider>
  );
}