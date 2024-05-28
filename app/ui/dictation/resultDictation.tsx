import React, { useEffect, useRef, useState, ChangeEvent } from 'react';
import { useDictationContext } from './dictation';
import UserInput from './input';

export default function ResultDictation() {
  const { state } = useDictationContext();

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="">
      <div className="relative flex flex-col w-full h-full">
        <p>
          {state.wordDataArray.map(({ word, state: wordState }, index) => (
            <React.Fragment key={index}>
              {wordState === 'incorrect' ? (
                <span style={{ color: 'orange' }}>{word}</span>
              ) : (
                word.split('').map((char, charIndex) => {
                  let color = 'green';
                  if (
                    (wordState === 'ErrorMajuscule' && /[A-Z]/.test(char)) ||
                    (wordState === 'ErrorPonctuation' && /[.,!?;:]/.test(char))
                  ) {
                    color = 'orange';
                  }
                  return (
                    <span key={charIndex} style={{ color }}>
                      {char}
                    </span>
                  );
                })
              )}{' '}
            </React.Fragment>
          ))}
        <UserInput />
        </p>
      </div>
    </div>
  );
}