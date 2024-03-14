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
            <div style={{ position: 'absolute', width: '100%' }}>
              <div style={{ width: '20%', left: '20%', top:'18%', position: 'relative', paddingBottom: '20%' }}>
                <Image src="/images/micro.jpg" layout="fill" objectFit="contain" alt="Image de microphone pour l'audio de la dictée" />
                <div style={{ position: 'absolute', left: '50%', top: '50%', transform:'translate(-50%, -100%)' }}>
                  <Audio dictation={initialDictationData} audioIndex={audioIndex} />
                </div>
              </div>
            </div>
            <div className='flex flex-col'>
              <UserInput dictationText={initialDictationData.text} validateSentencePart={handleNextAudio} />
            </div>
          </main>
        </>
    );
}
