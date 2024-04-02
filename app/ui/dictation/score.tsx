

import React, { useEffect } from 'react';
import { useDictationContext } from './dictation';

export default function Score() {
  const { state, setState } = useDictationContext();
  useEffect(() => {
    if (state.numberCorrect !== 0 || state.numberIncorrect !== 0) {
      setState(prevState => ({
        ...prevState,
        score: (state.numberCorrect * 100) / (state.numberCorrect + state.numberIncorrect),
      }));
    }
  }, [state.numberCorrect, state.numberIncorrect, setState]);
  
  return (
    <div className="relative p-2.5 mt-5 bg-[#f0f0f0] border-2 border-[#dcdcdc] rounded-lg shadow-sm text-[#333] text-lg font-bold text-center w-50 inline-block">
      Score : {state.score.toFixed(2)}%
      <br />
      Mots justes : <span style={{ color: 'green' }}>{state.numberCorrect}</span>
      <br />
      Mots faux : <span style={{ color: 'red' }}>{state.numberIncorrect}</span>
    </div>
  );
}

