import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useDictationContext } from './dictation';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import './score.css';

interface BestScore {
  id: string;
  score: number;
  timer: string;
  pourcentage: number;
  correct_words: number;
  incorrect_words: number;
}

interface TopScore {
  id: string;
  score: number;
  timer: string;
  pourcentage: number;
  correct_words: number;
  incorrect_words: number;
  userId: string;
  'user.id': string;
  'user.name': string;
}

interface ScoreProps {
  dictationName: String;
  dictationId: String;
}

export default function Score({ dictationName, dictationId }: ScoreProps) {
  const { state, setState } = useDictationContext();
  const [pourcentage, setPourcentage] = useState(100);
  const { data: session } = useSession();
  const scoreSubmittedRef = useRef(false);
  const [bestScore, setBestScore] = useState<BestScore | null>(null);
  const [topScores, setTopScores] = useState<TopScore[]>([]);



  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.email) {
        console.error("L'utilisateur n'est pas connecté ou l'adresse e-mail est manquante.");
        return;
      }

      try {
        // Récupérer le meilleur score de l'utilisateur
        const bestScoreResponse = await fetch(`/api/bestScore?email=${encodeURIComponent(session.user.email)}&dictationId=${encodeURIComponent(dictationId.toString())}`);
        if (bestScoreResponse.ok) {
          const bestScoreData: { bestScore: BestScore | null } = await bestScoreResponse.json();
          setBestScore(bestScoreData.bestScore);
        } else {
          console.error('Erreur lors de la récupération du meilleur score');
        }

        // Récupérer le top 10 du classement
        const topScoresResponse = await fetch(`/api/thisDictationClassement?dictationId=${encodeURIComponent(dictationId.toString())}`);
        if (topScoresResponse.ok) {
          const topScoresData: { topScores: TopScore[] } = await topScoresResponse.json();
          setTopScores(topScoresData.topScores);
        } else {
          console.error('Erreur lors de la récupération du top 10 du classement');
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [session?.user?.email, dictationId]);

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
    <div className="score-container">
      <div className="current-score">
        <h2>Score actuel</h2>
        <p>Note : {20 - state.numberIncorrect}</p>
        <p>Score : {state.score}</p>
        <p>Temps : {state.timer} secondes</p>
        <p>Mots justes : <span className="correct-words">{state.numberCorrect}</span></p>
        <p>Mots faux : <span className="incorrect-words">{state.numberIncorrect}</span></p>
        <p>Précision : {Math.floor(state.correctPercentage)}%</p>
      </div>


      <div className="best-score">
        <h2>Mon meilleur score</h2>
        {bestScore ? (
          <>
            <p>Score : {bestScore.score}</p>
            <p>Mots justes : <span className="correct-words">{bestScore.correct_words}</span></p>
            <p>Mots faux : <span className="incorrect-words">{bestScore.incorrect_words}</span></p>
            <p>Précision : {Math.floor(bestScore.pourcentage)}%</p>
            <p>Temps : {bestScore.timer} secondes</p>
          </>
        ) : (
          <p>Aucun meilleur score enregistré. </p>
        )}
      </div>

      <div className="top-scores">
        <h2>Top 10 des meilleurs scores : {dictationName} </h2>
        {topScores.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Rang</th>
                <th>Utilisateur</th>
                <th>Temps</th>
                <th>Précision</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {topScores.map((score, index) => (
                <tr key={score.id}>
                  <td>{index + 1}</td>
                  <td>{score['user.name'] || 'Anonyme'}</td>
                  <td>{score.timer}</td>
                  <td>{Math.floor(score.pourcentage)}%</td>
                  <td>{score.score} points</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Aucun score enregistré pour cette dictée</p>
        )}
      </div>
    </div>
  );
}