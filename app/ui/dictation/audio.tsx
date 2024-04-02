
import { dictation } from '@prisma/client'
import React, { useRef, useLayoutEffect, useState, useEffect} from 'react';
import './audio.css';

interface AudioProps {
    dictation: dictation;
    audioIndexParam: number;
  }
  
export default function Audio({ dictation, audioIndexParam }: AudioProps) {
    const [audioIndex, setAudioIndex] = useState(audioIndexParam);
    const audioRef = useRef<HTMLAudioElement>(null);

    // Construction de l'URL du fichier audio avec encodage des caractères TESTs
    const audioSrc = `${dictation.audio_url}/${dictation.title}_partie_${audioIndex}.mp3`;
    const firstUpdate = useRef(true);

    useEffect(() => {
        setAudioIndex(audioIndexParam); // Mise à jour de l'état local lorsque la prop externe change
      }, [audioIndexParam]); 
    
    const handleNextAudio = () => {
        setAudioIndex(prevIndex => prevIndex + 1);
      };

    const handlePreviousAudio = () => {
        setAudioIndex(prevIndex => prevIndex - 1);
      };

    useLayoutEffect(() => {
        // Vérifiez en plus si playAudio est true avant de jouer l'audio
        console.log("firstUpdate", firstUpdate)
        if (!firstUpdate.current) {
            console.log("audioRef", audioRef)
            if (audioRef.current) {
                audioRef.current.play();
            }
        }else{
            firstUpdate.current = false;
        }
      }, [audioIndex, firstUpdate]); 

    if (dictation && dictation.audio_url) {
        return (
            <div className="flex items-center justify-center space-x-2">
                <button className="arrow left" onClick={handlePreviousAudio} ></button>
                <audio src={audioSrc} controls ref={audioRef} className="border-2 border-black rounded-full text-base" />
                <button className="arrow right" onClick={handleNextAudio} ></button>
            </div>
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

