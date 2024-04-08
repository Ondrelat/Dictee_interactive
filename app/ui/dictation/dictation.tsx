'use client'
import React, { useState, useContext, createContext } from 'react';
import UserInput from './input';
import Audio from './audio';
import { dictation } from '@prisma/client';
import './dictation.css';
import Score from './score';
import ResultDictation from './resultDictation';

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

  const handleNextAudio = () => {
    setAudioIndex((prevIndex) => prevIndex + 1);
  };

  return (
    <DictationContext.Provider value={{ state, setState }}>
      <div className="flex-col mt-20 justify-center">
        <h1 className="text-3xl font-semibold text-center text-gray-800 tracking-wide px-4 py-2 rounded-md title">
          {initialDictationData.title}
        </h1>
        <h3 className="text-center">
          Niveau : <span style={{ color: 'green' }}>Facile</span>
        </h3>
      </div>
      <main>
        <div className="flex xl:flex-row flex-col mt-[10vh] justify-center items-center">
          <div id="audio" className="xl:flex-1 flex xl:justify-end mr-5 xl-mb-0 mb-10 mt-10">
            <Audio
              dictation={initialDictationData}
              audioIndexParam={audioIndex}
              totalParts={9}
            />
          </div>
          <div className="dictation-box w-4/5 xl:w-1/3">
            <ResultDictation />
          </div>
          <div className="flex-1"></div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <div id="input" className="w-4/5 xl:w-3/5">
            <UserInput
              dictationText={initialDictationData.text}
              validateSentencePart={handleNextAudio}
            />
          </div>
          <div id="score">
            <Score />
          </div>
        </div>
      </main>
    </DictationContext.Provider>
  );
}