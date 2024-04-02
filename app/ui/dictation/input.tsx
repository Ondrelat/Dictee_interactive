// components/UserInput.js
import React, { useState} from 'react';
import './input.css';
import { useDictationContext } from './dictation';

interface WordData {
  word: string;
  state: string;
}

interface UserInputProps {
  validateSentencePart: () => void;
  dictationText: String;
}

export default function UserInput({ validateSentencePart, dictationText }: UserInputProps) {

  const { state, setState } = useDictationContext();

    //Commun qu'à se fichier
  const [stateWordInput, setStateWordInput] = useState<string>("correct");
  const listWordToGuess = dictationText.split(' ');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  const handleInputChange = (currentInput: React.ChangeEvent<HTMLInputElement>) => {
    const newInputValue = currentInput.target.value;
    const LastCaracterInput = newInputValue[newInputValue.length - 1];
    if (LastCaracterInput !== ' ') {
      setState({...state, input: newInputValue});
    }
  };

  const handleKeyUp = (currentInput: React.KeyboardEvent) => {
    if (currentInput.key === ' ' || currentInput.code === 'Space' || currentInput.key === 'Enter') {
      handleSpace();
    } else {
      setState({ ...state, isTyping: true });
    }
  };


  const handleSpace = () => {
    setState({ ...state, isTyping: false });
    setState({ ...state, currentWordToGuess: listWordToGuess[currentWordIndex] });
    if (state.input === listWordToGuess[currentWordIndex] ) {
      handleNextWord();
    } else {
      handleReponseFalse();
    }
  };
  

  const handleNextWord = () => {
    if (!state.showResponse) {
      setState(prevState => ({...prevState, numberCorrect: prevState.numberCorrect + 1}));
    }

    setState(prevState => ({
      ...prevState,
      showResponse: false,
      input: '',
      wordDataArray: [
        ...prevState.wordDataArray,
        { word: listWordToGuess[currentWordIndex], state: stateWordInput },
      ],
      stateWordInput:stateWordInput,
    }));
    setStateWordInput("correct")

    setCurrentWordIndex(prevIndex => prevIndex + 1);

    const lastChar = state.input.slice(-1);
    if ([".", "!", "?", ",", ";", ":"].includes(lastChar)) {
      validateSentencePart();
    }
  };

  const afficherReponse = () => {
    setStateWordInput("incorrect");
    setState(prevState => ({...prevState, stateWordInput: stateWordInput}));
    if (!state.showResponse) {
      setState(prevState => ({...prevState, numberIncorrect: prevState.numberIncorrect + 1}));
    }
    setState({...state, showResponse: true});
  };

  const handleReponseFalse = () => {
    if (stateWordInput !== "incorrect") {
      setState(prevState => ({...prevState, numberIncorrect: prevState.numberIncorrect + 1}));
    }
    setStateWordInput("incorrect");
    setState(prevState => ({...prevState, stateWordInput: stateWordInput}));
  };

  return (
    <div className="flex">
      <input
        type="text"
        value={state.input}
        onChange={handleInputChange}
        onKeyUp={handleKeyUp}
        placeholder="Ecrire la dictée ici"
      />

      <button onClick={afficherReponse} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        Afficher la réponse
      </button>
      {state.showResponse && <p className="mt-4 text-lg">{listWordToGuess[currentWordIndex]}</p>}
    </div>
  );
}