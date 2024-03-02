'use client'

import React, { useState } from 'react';
import UserInput from './input';
import Audio from './audio';
import { Dictation } from '@/app/lib/definitions';

interface Props {
  initialDictation: Dictation; // Assurez-vous que le type Dictation correspond à la structure de vos données
}

export default function Dictations({ initialDictation }: Props) {
    const [audioIndex, setAudioIndex] = useState(1);

    const UserInputPunctuation = () => {
      setAudioIndex(prevIndex => prevIndex + 1);
    };

    return (
        <div>
          {/* Passer initialDictation à Audio */}
          <Audio audioIndex={audioIndex} dictation={initialDictation} />
          <UserInput onPunctuation={UserInputPunctuation} />
        </div>
    );
}
