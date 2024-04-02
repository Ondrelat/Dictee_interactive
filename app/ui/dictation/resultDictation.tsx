import React from 'react';
import { useDictationContext } from './dictation';

export default function ResultDictation() {
  const { state } = useDictationContext();

  return (
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
      </p>
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
    </div>
  );
}
