'use client';
import React, { useState, useContext, createContext, useEffect } from 'react';
import UserInput from './input';
import Audio from './audio';
import { dictation } from '@prisma/client';
import './dictation.css';
import Score from './score';
import ResultDictation from './resultDictation';
import Link from 'next/link';
import DifficultySelector from './DifficultySelector';


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
  timer: string;
  onDictationFinished: boolean;
  correctPercentage: number
  baseScore:number
  audioIndex:number
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
    baseScore:baseScore,
    audioIndex:1
  };
};

const DictationContext = createContext<{
  state: DictationState;
  setState: React.Dispatch<React.SetStateAction<DictationState>>;
}>({
  state: getInitialState('', 'Débutant'),
  setState: () => null,
});

export function useDictationContext() {
  return useContext(DictationContext);
}

export default function Dictations({ initialDictationData }: Props) {
  const [state, setState] = useState<DictationState>(
    getInitialState(initialDictationData.text, initialDictationData.level)
  );
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

  

  return (
<DictationContext.Provider value={{ state, setState }}>
<div className="bg-white py-8 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-500 mb-2">Dictée tirée aléatoirement</p>
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl sm:tracking-tight">
              {initialDictationData.title}
            </h1>
            {initialDictationData.excerpt && (
              <p className="text-xl text-gray-600 mt-2">{initialDictationData.excerpt}</p>
            )}
            <div className="mt-3 flex items-center flex-wrap">
              <span className="mr-4">
                <span className="text-sm font-medium text-gray-500 mr-1">Niveau:</span>
                <span className="text-sm font-semibold text-gray-800">{initialDictationData.level}</span>
              </span>
              {duration && (
                <span className="text-gray-500 text-sm">
                  <i className="far fa-clock mr-1"></i> {duration}
                </span>
              )}
            </div>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <DifficultySelector />
          </div>
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
            <UserInput dictationText={initialDictationData.text} />
          </div>
          <div id="score">
            <Score dictationName={initialDictationData.title} dictationId={initialDictationData.id} />
          </div>

        </div>
      </main>
    </DictationContext.Provider>
  );
}