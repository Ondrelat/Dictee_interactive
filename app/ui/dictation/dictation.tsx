'use client'

import React, { useState, useContext, createContext } from 'react';
import UserInput from './input';
import Audio from './audio';
import { dictation } from '@prisma/client'
import './dictation.css';
import Image from 'next/image'
import Helper from './helper'
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
  showResponse: boolean;
  wordDataArray: WordData[];
  stateWordInput: String;
  currentWordToGuess: String;
}

const initialState: DictationState = {
  input: '',
  isTyping: false,
  score: 100,
  numberCorrect: 0,
  numberIncorrect: 0,
  showResponse: false,
  wordDataArray: [],
  stateWordInput: 'correct',
  currentWordToGuess: ''
};

const DictationContext = createContext<{
  state: DictationState;
  setState: React.Dispatch<React.SetStateAction<DictationState>>;
}>({
  state: initialState,
  setState: () => null,
});

export function useDictationContext() {
  return useContext(DictationContext);
}

export default function Dictations({ initialDictationData }: Props) {

  const [state, setState] = useState<DictationState>(initialState);
    const [audioIndex, setAudioIndex] = useState(1);


    const handleNextAudio = () => {
      setAudioIndex(prevIndex => prevIndex + 1);
    };

    // Il faut passer en double flex, et arrêter avec le result en absolute
    return (

      <DictationContext.Provider value={{ state, setState }}>
        <main>
        <div className="flex xl:flex-row flex-col mt-[20vh] justify-center items-center">
          <div id="audio" className="xl:flex-1 flex xl:justify-end mr-5 xl-mb-0 mb-10">
              <div className="relative mt-10">
                <Audio dictation={initialDictationData} audioIndexParam={audioIndex} />
                <div style={{ position: 'absolute', zIndex:-1, transform: 'translate(-0%, -50%)' }} >
                  <Image src="/images/micro.jpg" width={500} height={460} alt="Image de microphone pour l'audio de la dictée" className="responsive-image" />
                </div>
              </div>
            </div>
            <div className="dictation-box w-4/5 xl:w-1/3">
              <ResultDictation />
            </div>
            <div className="flex-1 "></div>
          </div>

          <div className="flex flex-col items-center justify-center">

            <div id="input" className="w-4/5 xl:w-3/5">
              <UserInput dictationText={initialDictationData.text} validateSentencePart={handleNextAudio} />
              {state.stateWordInput === 'incorrect' && <Helper />}
            </div>

            <div id="score" className="">
              <Score />
            </div>

          </div>

        </main>
      </DictationContext.Provider>
    );
}
