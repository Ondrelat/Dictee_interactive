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
      console.log(audioIndex);
    };

    //Ajouter le check que le mot est juste test
    //Ajouter la couleur
    //Reset la couleur
    //className="absolute left-1/2 top-1/3 transform -translate-x-1/2 -translate-y-1/2 p-1.25 border-2 border-black rounded-full text-base"

    return (
        <>
          <main>
            <div className="flex h-2/5 flex-row">
              <div className="flex flex-grow justify-center items-center bg-lightblue-200 flex-1 z-1">
                  <div style={{ position: 'relative', top:"10%", left:"30%" }} >
                    <Image src="/images/micro.jpg" width={500} height={460} alt="Image de microphone pour l'audio de la dictée" />
                    <div style={{ position: 'absolute', left: '50%', top: '40%', transform:'translate(-50%, -50%)' }}>
                      <Audio dictation={initialDictationData} audioIndex={audioIndex} />
                    </div>
                  </div>
              </div>
              <div className="flex flex-grow justify-center items-center bg-lightred-200 flex-2 z-2">
                  <UserInput dictationText={initialDictationData.text} validateSentencePart={handleNextAudio} />
              </div>
              <div className="flex flex-grow justify-center items-center bg-lightgreen-200 flex-1"></div>
            </div>
          </main>
        </>
    );
}
