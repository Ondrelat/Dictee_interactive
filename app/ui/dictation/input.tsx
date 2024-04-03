// components/UserInput.js
import React, { useState} from 'react';
import './input.css';
import { useDictationContext } from './dictation';
import Helper from './helper'

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
  const [stateWordInputLocal, setStateWordInput] = useState<string>("correct");
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
    if (state.input.toLowerCase() === listWordToGuess[currentWordIndex].toLowerCase() && state.input !== listWordToGuess[currentWordIndex]){
      return
    }
    if (state.input === listWordToGuess[currentWordIndex] ) {
      handleNextWord();
    } else {
      console.log("hear")
      handleReponseFalse();
    }
    console.log("state" + state.stateWordInput)
  }
  

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
        { word: listWordToGuess[currentWordIndex], state: stateWordInputLocal },
      ],
      stateWordInput:stateWordInputLocal,
    }));
    setStateWordInput("correct")

    setCurrentWordIndex(prevIndex => prevIndex + 1);

    const lastChar = state.input.slice(-1);
    if ([".", "!", "?", ",", ";", ":"].includes(lastChar)) {
      validateSentencePart();
    }
  };

  const handleReponseFalse = () => {
    setStateWordInput("incorrect");
    setState(prevState => ({
      ...prevState,
      stateWordInput: "incorrect",
      isTyping: false,
      numberIncorrect: state.isTyping !== false ? prevState.numberIncorrect + 1 : prevState.numberIncorrect,
    }));
  };

  const afficherReponse = () => {
    setStateWordInput("incorrect");
    setState(prevState => ({...prevState, stateWordInput: stateWordInputLocal}));
    if (!state.showResponse) {
      setState(prevState => ({...prevState, numberIncorrect: prevState.numberIncorrect + 1}));
    }
    setState({...state, showResponse: true});
  };

  return (
    <>
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
      {/* Relative pour bien prendre en compte la bonne largeur, et élment enfant en absolute pour passer dessus le score */}
      <div className="relative">
        {state.stateWordInput === 'incorrect' && <Helper />}
      </div>
    </>
  );
}