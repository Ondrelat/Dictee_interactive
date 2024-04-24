import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useDictationContext } from './dictation';
import axios from 'axios';
import { useSession } from 'next-auth/react';

interface ScoreProps {
  dictationLevel: String;
  dictationId: String;
}

export default function Score({ dictationLevel, dictationId }: ScoreProps) {
  const { state, setState } = useDictationContext();
  const [pourcentage, setPourcentage] = useState(100);
  const [baseScore, setBaseScore] = useState(1000);
  const { data: session } = useSession();
  const scoreSubmittedRef = useRef(false);

  useEffect(() => {
    if (state.numberCorrect !== 0 || state.numberIncorrect !== 0) {
      const totalWords = state.numberCorrect + state.numberIncorrect;
      const correctPercentage = (state.numberCorrect * 100) / totalWords;
      const finalScore = Math.floor(baseScore * Math.pow(correctPercentage / 100, 1.5));
      setPourcentage(correctPercentage);
      setState(prevState => ({ ...prevState, score: finalScore }));
    }
  }, [state.numberCorrect, state.numberIncorrect, setState, baseScore]);

  const submitFinalScore = useCallback(async () => {
    if (scoreSubmittedRef.current) return; // Si le score a déjà été soumis, on ne fait rien

    scoreSubmittedRef.current = true; // Marquer le score comme soumis avant la soumission

    const pourcentage = (state.numberCorrect / (state.numberCorrect + state.numberIncorrect)) * 100;
    const scoreData = {
      score: state.score,
      correct_words: state.numberCorrect,
      incorrect_words: state.numberIncorrect,
      pourcentage: pourcentage,
      timer: state.timer,
      userEmail: session?.user?.email,
      dictationId: dictationId,
      note: 20 - state.numberIncorrect,
    };

    console.log('Données envoyées à l\'API :', scoreData);

    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_BASE_URL + '/api/score', scoreData);
      if (response.status === 200) {
        console.log('Score enregistré avec succès');
        // Effectuez les actions nécessaires après l'enregistrement réussi du score
      } else {
        console.error('Erreur lors de l\'enregistrement du score');
        console.error('Réponse de l\'API :', response.data);
        // Gérez les erreurs d'enregistrement du score
      }
    } catch (error) {
      console.error('Erreur lors de la requête à l\'API :', error);
      // Gérez les erreurs de requête à l'API
    }
  }, [state.score, state.numberCorrect, state.numberIncorrect, session?.user?.email, state.timer, dictationId]);

  useEffect(() => {
    if (state.onDictationFinished && !scoreSubmittedRef.current) {
      submitFinalScore();
    }
  }, [state.onDictationFinished, submitFinalScore]);

  return (
    <div className="relative p-2.5 mt-5 bg-[#f0f0f0] border-2 border-[#dcdcdc] rounded-lg shadow-sm text-[#333] text-lg font-bold text-center w-50 inline-block">
      Note : {20 - state.numberIncorrect} <br />
      Pourcentage : {Math.floor(pourcentage)}% <br />
      Score : {state.score} <br />
      Mots justes : <span style={{ color: 'green' }}>{state.numberCorrect}</span> <br />
      Mots faux : <span style={{ color: 'red' }}>{state.numberIncorrect}</span>
    </div>
  );
}