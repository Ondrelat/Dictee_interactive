import React, { useEffect, useState } from 'react';
import { useDictationContext } from './dictation';

interface ScoreProps {
  dictationLevel: String;
}

export default function Score({ dictationLevel }: ScoreProps) {
  const { state, setState } = useDictationContext();
  const [pourcentage, setPourcentage] = useState(100);
  const [baseScore, setBaseScore] = useState(1000);

  useEffect(() => {
    if (state.numberCorrect !== 0 || state.numberIncorrect !== 0) {
      const totalWords = state.numberCorrect + state.numberIncorrect;
      const correctPercentage = (state.numberCorrect * 100) / totalWords;
      const finalScore = Math.floor(baseScore * Math.pow(correctPercentage / 100, 1.5));

      setPourcentage(correctPercentage);
      setState(prevState => ({
        ...prevState,
        score: finalScore,
      }));
    }
  }, [state.numberCorrect, state.numberIncorrect, setState, baseScore]);

  return (
    <div className="relative p-2.5 mt-5 bg-[#f0f0f0] border-2 border-[#dcdcdc] rounded-lg shadow-sm text-[#333] text-lg font-bold text-center w-50 inline-block">
      Note : {20 - state.numberIncorrect}
      <br />
      Pourcentage : {Math.floor(pourcentage)}%
      <br />
      Score : {state.score}
      <br />
      Mots justes : <span style={{ color: 'green' }}>{state.numberCorrect}</span>
      <br />
      Mots faux : <span style={{ color: 'red' }}>{state.numberIncorrect}</span>
    </div>
  );
}