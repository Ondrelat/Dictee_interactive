'use client'

import React, { useState } from 'react';
import UserInput from './input';
import Audio from './audio';
import { dictation } from '@prisma/client'
import './dictation.css';
import Image from 'next/image'

interface Props {
  initialDictationData: dictation;
}

export default function Dictations({ initialDictationData }: Props) {
    const [audioIndex, setAudioIndex] = useState(1);

    const handleNextAudio = () => {
      setAudioIndex(prevIndex => prevIndex + 1);
    };

    return (
        <>
          <main>
            <div className="flex flex-col xl:flex-row h-2/5">
              <div className="flex flex-grow justify-center items-center bg-lightblue-200 xl:flex-1 z-10 relative">
                <div className="relative responsive-position" style={{ position: 'relative', top: '10%', left: '30%' }}>
                  <Image src="/images/micro.jpg" width={500} height={460} alt="Image de microphone pour l'audio de la dictée" className="responsive-image" />
                  <div style={{ position: 'absolute', left: '50%', top: '40%', transform: 'translate(-50%, -50%)' }} >
                    <Audio dictation={initialDictationData} audioIndexParam={audioIndex} />
                  </div>
                </div>
              </div>
              <div className="flex flex-grow justify-center items-center bg-lightred-200 xl:flex-2 z-20">
                <UserInput
                  dictationText={initialDictationData.text}
                  validateSentencePart={handleNextAudio}
                />
              </div>
              <div className="flex flex-grow justify-center items-center bg-lightgreen-200 xl:flex-1"></div>
            </div>
          </main>
        </>
    );
}
