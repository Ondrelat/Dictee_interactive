// components/UserInput.js
import React, { useState} from 'react';
import './input.css';
import { useDictationContext } from './dictation';
import Helper from './helper'

interface UserInputProps {
  validateSentencePart: () => void;
  dictationText: String;
}

export default function UserInput({ validateSentencePart, dictationText }: UserInputProps) {

  

  const { state, setState } = useDictationContext();

    //Commun qu'à se fichier
  const [typeError, setTypeError] = useState<string>("");
  const listWordToGuess = dictationText.split(' ');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  const handleInputChange = (currentInput: React.ChangeEvent<HTMLInputElement>) => {
    const newInputValue = currentInput.target.value;
    const LastCaracterInput = newInputValue[newInputValue.length - 1];
    if (LastCaracterInput !== ' ') {
      setState({...state, input: newInputValue});
      setTypeError("");
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

    setState({
      ...state,
      isTyping: false,
      currentWordToGuess: listWordToGuess[currentWordIndex]
    });
    
    //Si une erreur de majuscule
    if (state.input.toLowerCase() === listWordToGuess[currentWordIndex].toLowerCase() && state.input !== listWordToGuess[currentWordIndex]){
      console.log("maj")
      setTypeError("Majuscule");
      setState(prevState => ({
        ...prevState,
        stateWordInput:"ErrorMajuscule",
      }));
      return
    }

        // Vérification de la ponctuation
    const inputPunctuation = state.input.replace(/[^.,!?;:]/g, '');
    const expectedPunctuation = listWordToGuess[currentWordIndex].replace(/[^.,!?;:]/g, '');

    if (inputPunctuation !== expectedPunctuation) {
      console.log("ponctuation");
      setTypeError("Ponctuation");
      setState(prevState => ({
        ...prevState,
        stateWordInput: "ErrorPonctuation",
      }));
      return;
    }

    if (state.input === listWordToGuess[currentWordIndex] ) {
      handleNextWord(null);
    } else {
      handleReponseFalse();
    }
  }
  

  const handleNextWord = (paramState: string | null) => {
    if (!state.showResponse) {
      setState(prevState => ({...prevState, numberCorrect: prevState.numberCorrect + 1}));
    }

    var currentState: string = state.stateWordInput.valueOf();
    if(paramState)
      var currentState = "incorrect";

    
    setState(prevState => ({
      ...prevState,
      showResponse: false,
      input: '',
      wordDataArray: [
        ...prevState.wordDataArray,
        { word: listWordToGuess[currentWordIndex], state: currentState },
      ],
      stateWordInput:"correct",
    }));

    setCurrentWordIndex(prevIndex => prevIndex + 1);

    const lastChar = state.input.slice(-1);
    if ([".", "!", "?", ",", ";", ":"].includes(lastChar)) {
      validateSentencePart();
    }
  };

  const handleReponseFalse = () => {
    setState(prevState => ({
      ...prevState,
      stateWordInput: "incorrect",
      isTyping: false,
      numberIncorrect: state.isTyping !== false ? prevState.numberIncorrect + 1 : prevState.numberIncorrect,
    }));
  };

  const DonnerLaReponse = () => {
    setState(prevState => ({...prevState, stateWordInput: "incorrect"}));
    handleNextWord("incorrect");

  };

  console.log()

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

        <button onClick={DonnerLaReponse} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Donner la réponse
        </button>
        {state.showResponse && <p className="mt-4 text-lg">{listWordToGuess[currentWordIndex]}</p>}
      </div>
      {/* Relative pour bien prendre en compte la bonne largeur, et élment enfant en absolute pour passer dessus le score */}
      <div className="relative">
        {(state.stateWordInput === 'incorrect' || typeError !== '') && <Helper typeError={typeError} />}
      </div>
    </>
  );
}