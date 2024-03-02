
import { Dictation } from '@/app/lib/definitions';
import React, { useRef } from 'react';

interface AudioProps {
    audioIndex: number;
    dictation: Dictation;
  }
  

export default function Audio({ audioIndex, dictation }: AudioProps) {
    console.log("dictation.audiourl", dictation.audiourl)
    const audioRef = useRef(null);
    // Construction de l'URL du fichier audio avec encodage des caractères
    const audioSrc = `${dictation.audiourl}/${encodeURIComponent(dictation.title.toString())}_partie_${audioIndex}.mp3`;


    if (dictation && dictation.audiourl) {
        return (
            <div>
                <audio src={audioSrc} controls ref={audioRef} />
            </div>
        );
    } else {
        // Si dictation ou dictation.audiourl est indéfini, renvoie un composant de remplacement ou un message d'erreur
        return (
            <div>
                <p>Le chemin du fichier audio n est pas disponible.</p>
            </div>
        );
    }
}

