'use client';
import React, { useState, useContext, createContext, useEffect } from 'react';
import UserInput from './input';
import Audio from './audio';
import { dictation } from '@prisma/client';
import './dictation.css';
import Score from './score';
import ResultDictation from './resultDictation';
import Link from 'next/link';

interface Props {
  initialDictationData: dictation;
}

interface WordData {
  word: string;
  state: string;
}

interface DictationState {
  input: string;
  isTyping: boolean;
  score: number;
  numberCorrect: number;
  numberIncorrect: number;
  wordDataArray: WordData[];
  stateWordInput: String;
  currentWordToGuess: String;
}

const getInitialState = (dictationText: string): DictationState => ({
  input: '',
  isTyping: false,
  score: 100,
  numberCorrect: 0,
  numberIncorrect: 0,
  wordDataArray: [],
  stateWordInput: 'correct',
  currentWordToGuess: dictationText.split(' ')[0],
});

const DictationContext = createContext<{
  state: DictationState;
  setState: React.Dispatch<React.SetStateAction<DictationState>>;
}>({
  state: getInitialState(''),
  setState: () => null,
});

export function useDictationContext() {
  return useContext(DictationContext);
}

export default function Dictations({ initialDictationData }: Props) {
  const [state, setState] = useState<DictationState>(
    getInitialState(initialDictationData.text)
  );
  const [audioIndex, setAudioIndex] = useState(1);
  const [selectedLevel, setSelectedLevel] = useState(initialDictationData.level);

  const handleNextAudio = () => {
    setAudioIndex((prevIndex) => prevIndex + 1);
  };

  const handleLevelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const level = event.target.value;
    setSelectedLevel(level);
    // Appeler une fonction pour récupérer une nouvelle dictée aléatoire en fonction du niveau sélectionné
    // Mettre à jour l'état avec les données de la nouvelle dictée
  };

  const formatDuration = (minutes: number | null, seconds: number | null) => {
    if (minutes !== null && seconds !== null) {
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
      return `${formattedMinutes}:${formattedSeconds}`;
    }
    return null;
  };
  const duration = formatDuration(initialDictationData.audio_duration_minutes, initialDictationData.audio_duration_seconds);

  

  return (
<DictationContext.Provider value={{ state, setState }}>
  <div className="flex-col mt-20 justify-center">
    <h1 className="text-3xl font-semibold text-center text-gray-800 tracking-wide px-4 py-2 rounded-md title">
      {initialDictationData.title}
    </h1>
    <h3 className="text-center">
      Niveau : <span className={`${initialDictationData.level === 'Intermédiaire' ? 'text-yellow-600' : 'text-green-600'}`}>{initialDictationData.level}</span>
    </h3>
    {duration && (
      <p className="text-center">
        Durée : {duration}
      </p>
    )}
    <div className="mt-4 flex flex-col items-center">
      <p className="mb-2">Choisir une nouvelle dictée de niveau :</p>
      <div className="flex space-x-4">
        <Link href="/dictee?level=Débutant">
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            Débutant
          </button>
        </Link>
        <Link href="/dictee?level=Intermédiaire">
          <button
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
          >
            Intermédiaire
          </button>
        </Link>
      </div>
    </div>
  </div>
      <main>
        <div className="flex xl:flex-row flex-col mt-[10vh] justify-center items-center">
          <div id="audio" className="xl:flex-1 flex xl:justify-end mr-5 xl-mb-0 mb-10 mt-10">
            <Audio dictation={initialDictationData} audioIndexParam={audioIndex} />
          </div>
          <div className="dictation-box w-4/5 xl:w-1/3">
            <ResultDictation />
          </div>
          <div className="flex-1"></div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <div id="input" className="w-4/5 xl:w-3/5">
            <UserInput dictationText={initialDictationData.text} validateSentencePart={handleNextAudio} />
          </div>
          <div id="score">
            <Score />
          </div>

        </div>
      </main>
    </DictationContext.Provider>
  );
}