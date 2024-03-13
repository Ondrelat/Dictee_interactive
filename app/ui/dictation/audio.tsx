
import { Dictation } from '@/app/lib/definitions';
import React, { useRef, useEffect } from 'react';

interface AudioProps {
    dictation: Dictation;
    audioIndex: number;
  }
  
export default function Audio({ dictation, audioIndex }: AudioProps) {
    console.log("dictation.audiourl", dictation.audiourl)
    const audioRef = useRef<HTMLAudioElement>(null);
    const isFirstRender = useRef(true);

    // Construction de l'URL du fichier audio avec encodage des caractères
    const audioSrc = `${dictation.audiourl}/${encodeURIComponent(dictation.title.toString())}_partie_${audioIndex}.mp3`;

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
          } else {
            if (audioRef.current) {
              audioRef.current.play();
            }
          }
      }, [audioIndex]);

    if (dictation && dictation.audiourl) {
        return (
            <>
                <audio src={audioSrc} controls ref={audioRef} className="border-2 border-black rounded-full text-base" />
            </>
        );
    } else {
        // Si dictation ou dictation.audiourl est indéfini, renvoie un composant de remplacement ou un message d'erreur
        return (
            <>
                <p>Le chemin du fichier audio n est pas disponible.</p>
            </>
        );
    }
}

