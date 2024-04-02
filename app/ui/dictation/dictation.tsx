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

    return (
      <DictationContext.Provider value={{ state, setState }}>
          <main>
          {/* 
            <div id="DicteeContainer" className="flex flex-col items-center">
              <div id="text-dictee-container" className="bg-green-500">text</div>
              <div id="input-and-play-audio" className="bg-red-500">test</div>
              <div id="helper" className="bg-blue-500">helper</div>
            </div>
          */}
            <div className="flex flex-col xl:flex-row">
              <div className="flex justify-center xl:flex-1 z-10 ">
                  <Audio dictation={initialDictationData} audioIndexParam={audioIndex} />
                    <div style={{ position: 'absolute', zIndex:-1, transform: 'translate(0%, -50%)' }} >
                      <Image src="/images/micro.jpg" width={500} height={460} alt="Image de microphone pour l'audio de la dictée" className="responsive-image" />
                    </div>
              </div>
              <div className="xl:flex-1"></div>
              <div className="xl:flex-1"></div>
            </div>
            <div className="flex flex-col xl:flex-row h-2/5">
              <div className="xl:flex-1"></div>
                <div className="flex flex-grow bg-lightred-200 xl:flex-2 z-20">
                  <div className="dictation-box">
                    <ResultDictation />
                    <div>
                      <UserInput dictationText={initialDictationData.text} validateSentencePart={handleNextAudio} />
                      {state.stateWordInput === 'incorrect' && <Helper />}
                    </div>
                    <Score />

                  </div>
                </div>
              <div className="xl:flex-1"></div>
            </div>
          
          </main>
          </DictationContext.Provider>
        
    );
}
