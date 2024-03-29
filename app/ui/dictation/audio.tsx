
import { dictation } from '@prisma/client'
import React, { useRef, useLayoutEffect} from 'react';

interface AudioProps {
    dictation: dictation;
    audioIndex: number;
  }
  
export default function Audio({ dictation, audioIndex }: AudioProps) {

    const audioRef = useRef<HTMLAudioElement>(null);
<<<<<<< HEAD
=======

>>>>>>> dbdev

    // Construction de l'URL du fichier audio avec encodage des caractères TEST
    const audioSrc = `${dictation.audio_url}/${dictation.title}_partie_${audioIndex}.mp3`;
    console.log("test : " + audioSrc)
    const firstUpdate = useRef(true);

    useLayoutEffect(() => {
        // Vérifiez en plus si playAudio est true avant de jouer l'audio
        console.log("firstUpdate", firstUpdate)
        if (!firstUpdate.current) {
            console.log("audioRef", audioRef)
            if (audioRef.current) {
                audioRef.current.play();
            }
<<<<<<< HEAD
        } else {
=======
        }else{
>>>>>>> dbdev
            firstUpdate.current = false;
        }
      }, [audioIndex, firstUpdate]); 

    if (dictation && dictation.audio_url) {
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

