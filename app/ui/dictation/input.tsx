// components/UserInput.js
import React, { useState, useEffect } from 'react';
import './input.css';
import Helper from './helper';

interface WordData {
  word: string;
  state: string;
}

interface UserInputProps {
  validateSentencePart: () => void;
  dictationText: String;
}

export default function UserInput({ validateSentencePart, dictationText }: UserInputProps) {
  const [showResponse, setShowResponse] = useState(false);
  const [input, setInput] = useState('');
  const [stateWordInput, setStateWordInput] = useState<string>("correct");
  const [isTyping, setIsTyping] = useState(false);
  const [score, setScore] = useState(100);
  const [numberCorrect, setNumberCorrect] = useState(0);
  const [numberIncorrect, setNumberIncorrect] = useState(0);

  const listWordToGuess = dictationText.split(' ');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [wordDataArray, setWordDataArray] = useState<WordData[]>([]);

  const afficherReponse = () => {
    setIsTyping(false);
    setStateWordInput("incorrect");
    if (!showResponse) {
      setNumberIncorrect(currentScore => currentScore + 1);
    }
    setShowResponse(true);
  };

  const handleInputChange = (currentInput: React.ChangeEvent<HTMLInputElement>) => {
    const newInputValue = currentInput.target.value;
    const LastCaracterInput = newInputValue[newInputValue.length - 1];

    if (LastCaracterInput !== ' ') {
      setInput(newInputValue);
    }
  };

  useEffect(() => {
    if (numberCorrect !== 0 || numberIncorrect !== 0) {
      setScore(numberCorrect * 100 / (numberCorrect + numberIncorrect));
    }
  }, [numberCorrect, numberIncorrect]);

  const handleKeyUp = (currentInput: React.KeyboardEvent) => {
    if (currentInput.key === ' ') {
      handleSpace();
    } else {
      setIsTyping(true);
    }
  };

  const handleSpace = () => {
    setIsTyping(false);
    if (input === listWordToGuess[currentWordIndex]) {
      handleNextWord();
    } else {
      handleReponseFalse();
    }
  };

  const handleReponseFalse = () => {
    setIsTyping(false);
    if (stateWordInput !== "incorrect") {
      setNumberIncorrect(currentScore => currentScore + 1);
    }
    setStateWordInput("incorrect");
  };

  const handleNextWord = () => {
    if (!showResponse) {
      setNumberCorrect(currentScore => currentScore + 1);
    }
    setShowResponse(false);
    setStateWordInput("correct");

    setWordDataArray([...wordDataArray, { word: listWordToGuess[currentWordIndex], state: stateWordInput }]);

    const nextWordIndex = currentWordIndex + 1;
    setCurrentWordIndex(nextWordIndex);

    const lastChar = input.slice(-1);
    if ([".", "!", "?", ",", ";", ":"].includes(lastChar)) {
      validateSentencePart();
    }
    setInput('');
  };

  return (
    <div className="relative pt-[30vh] flex flex-col w-full h-full">
      <div className="dictation-box">
        <p>
          {wordDataArray.map(({ word, state }, index) => (
            <React.Fragment key={index}>
              <span
                style={{
                  color: state === 'correct' ? 'green' : state === 'incorrect' ? 'orange' : 'black',
                }}
              >
                {word}
              </span>{' '}
            </React.Fragment>
          ))}
          <span
            style={{
              color: isTyping ? 'black' :
                stateWordInput === 'correct' ? 'green' :
                  stateWordInput === 'incorrect' ? 'red' : 'black'
            }}
          >
            {input}
          </span>
        </p>
      </div>

      <div>
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyUp={handleKeyUp}
            placeholder="Ecrire la dictée ici"
          />

          <button onClick={afficherReponse} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Afficher la réponse
          </button>
          {showResponse && <p className="mt-4 text-lg">{listWordToGuess[currentWordIndex]}</p>}
        </div>

        <div className="absolute w-full">
          {stateWordInput === 'incorrect' && <Helper wordError={listWordToGuess[currentWordIndex]} />}
        </div>
      </div>

      <div className="relative p-2.5 mt-5 bg-[#f0f0f0] border-2 border-[#dcdcdc] rounded-lg shadow-sm text-[#333] text-lg font-bold text-center w-50 inline-block">
        Score : {score.toFixed(2)}% <br />
        Mot juste : <span style={{ color: 'green' }}>{numberCorrect}</span><br />
        Mot faux : <span style={{ color: 'red' }}>{numberIncorrect}</span>
      </div>
    </div>
  );
}