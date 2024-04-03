import React, {useEffect} from 'react';
import { useDictationContext } from './dictation';

export default function ResultDictation() {
  const { state } = useDictationContext();

  //Permet de gérer l'asynchrone est de bien déclancher un rendu quand la valeur change
  useEffect(() => {
  }, [state.stateWordInput]);

  return (
    <div className="">      
      <div className="relative flex flex-col w-full h-full">
        <p>
          {state.wordDataArray.map(({ word, state: wordState }, index) => (
            <React.Fragment key={index}>
              <span
                style={{
                  color:
                    wordState === 'correct'
                      ? 'green'
                      : wordState === 'incorrect'
                      ? 'orange'
                      : 'black',
                }}
              >
                {word}
              </span>{' '}
            </React.Fragment>
          ))}

        <span
          style={{
            color:
              state.isTyping
                ? 'black'
                : state.stateWordInput === 'correct'
                ? 'green'
                : state.stateWordInput === 'incorrect'
                ? 'red'
                : 'black',
          }}
        >
          {state.input}
        </span>
        </p>
      </div>
    </div>
  );
}
