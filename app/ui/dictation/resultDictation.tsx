import React, { useEffect, useRef, useState, ChangeEvent } from 'react';
import { useDictationContext } from './dictation';
import UserInput from './input';

export default function ResultDictation() {
  const { state } = useDictationContext();

  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div
      className="h-[150px] bg-[#ffffff] p-6 box-border rounded-lg shadow-[0_4px_6px_rgba(0,0,0,0.1),0_1px_3px_rgba(0,0,0,0.08)]"
      onClick={handleClick}
    >
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
          <UserInput ref={inputRef} />
        </p>
      </div>
    </div>
  );
}