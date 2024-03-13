'use client'

import React, { useState } from 'react';
import UserInput from './input';
import Audio from './audio';
import { Dictation } from '@/app/lib/definitions';
import './dictation.css';
import Image from 'next/image'

interface Props {
  initialDictationData: Dictation;
}

export default function Dictations({ initialDictationData }: Props) {
    const [audioIndex, setAudioIndex] = useState(1);

    const handleNextAudio = () => {
      setAudioIndex(prevIndex => prevIndex + 1);
    };

    console.log("parent react")
    //Ajouter le check que le mot est juste
    //Ajouter la couleur
    //Reset la couleur
    //className="absolute left-1/2 top-1/3 transform -translate-x-1/2 -translate-y-1/2 p-1.25 border-2 border-black rounded-full text-base"

    return (
        <>
          <main>
            <div className='audioAndImageContainer'>
              <div style={{ position: 'relative' }} >
                <Image src="/images/micro.jpg" width={500} height={460} alt="Image de microphone pour l'audio de la dictée" />
                <div style={{ position: 'absolute', left: '50%', top: '50%', transform:'translate(-50%, -85%)' }}>
                  <Audio dictation={initialDictationData} audioIndex={audioIndex} />
                </div>
              </div>
            </div>
            <div className='inputContainer'>
              <UserInput dictationText={initialDictationData.text} validateSentencePart={handleNextAudio} />
            </div>
          </main>
        </>
    );
}
