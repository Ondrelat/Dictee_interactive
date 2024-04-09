// components/UserInput.js
import React, { useState, useEffect } from 'react';
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
  const [showPopup, setShowPopup] = useState(false);

  const handleInputChange = (currentInput: React.ChangeEvent<HTMLInputElement>) => {
    const newInputValue = currentInput.target.value;
    const LastCaracterInput = newInputValue[newInputValue.length - 1];
    if (LastCaracterInput !== ' ') {
      setState({...state, input: newInputValue});
      setTypeError("");
    }
  };

  const handleKeyUp = (currentInput: React.KeyboardEvent) => {
    if (currentInput.key === 'Enter' || currentInput.code === 'Enter' || currentInput.key === ' ' || currentInput.code === 'Space' || currentInput.code === 'Space' || currentInput.keyCode == 32) {
      handleSpace();
    } else {
      setState({ ...state, isTyping: true });
    }
  };


  const handleSpace = () => {

    setState({
      ...state,
      isTyping: false,
    });


    if (state.input === listWordToGuess[currentWordIndex] ) {
      var currentState: string = state.stateWordInput.valueOf();
      handleNextWord(currentState);
    } else {
          

      handleReponseFalse();
    }
  }
  

  const handleNextWord = (paramState: string | null) => {

    if (paramState != "incorrect") {
      setState(prevState => ({...prevState, numberCorrect: prevState.numberCorrect + 1}));
    }

    if (currentWordIndex + 1 === listWordToGuess.length) {
      // La dictée est terminée, afficher la pop-up
      setShowPopup(true);
    } else {
    
      setState(prevState => ({
        ...prevState,
        input: '',
        wordDataArray: [
          ...prevState.wordDataArray,
          { word: listWordToGuess[currentWordIndex], state: paramState! },
        ],
        stateWordInput:"correct",
        currentWordToGuess:listWordToGuess[currentWordIndex+1]
      }));

      setCurrentWordIndex(prevIndex => prevIndex + 1);

      const lastChar = state.input.slice(-1);
      if ([".", "!", "?", ",", ";", ":"].includes(lastChar)) {
        validateSentencePart();
      }
    }
  };

  const handleNewDictation = () => {
    // Réinitialiser l'état pour commencer une nouvelle dictée
    setState({
      input: '',
      isTyping: false,
      wordDataArray: [],
      numberCorrect: 0,
      numberIncorrect: 0,
      stateWordInput: "correct",
      currentWordToGuess: listWordToGuess[0],
      score: 0, // Ajoutez la propriété score ici
    });
    setCurrentWordIndex(0);
    setShowPopup(false);
  };

  const handleReponseFalse = () => {
      //Si une erreur de majuscule
      if (state.input.toLowerCase() === listWordToGuess[currentWordIndex].toLowerCase()){
        setTypeError("Majuscule");
        setState(prevState => ({
          ...prevState,
          stateWordInput:"ErrorMajuscule",
        }));
        return
      }

      // Vérification de la ponctuations 
      const expectedPunctuation = listWordToGuess[currentWordIndex].replace(/[.,!?;:]/g, '');
      if (state.input == expectedPunctuation) {
        setTypeError("Ponctuation");
        setState(prevState => ({
          ...prevState,
          stateWordInput: "ErrorPonctuation",
        }));
        return;
      }

      setTypeError("Word");
    setState(prevState => ({
      ...prevState,
      stateWordInput: "incorrect",
      isTyping: false,
      numberIncorrect: prevState.numberIncorrect + 1
    }));
  };

  const DonnerLaReponse = () => {
    handleNextWord("incorrect");
    setState(prevState => ({
      ...prevState,
      isTyping: false,
      numberIncorrect: prevState.numberIncorrect + 1
    }));

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

        <button onClick={DonnerLaReponse} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Donner la réponse
        </button>
      </div>
      {/* Relative pour bien prendre en compte la bonne largeur, et élment enfant en absolute pour passer dessus le score */}
      <div className="relative">
        {(state.stateWordInput === 'incorrect' || typeError !== '') && <Helper typeError={typeError} />}
      </div>
      {showPopup && (
      <div className="popup-overlay">
        <div className="popup-container">
          <div className="popup-content">
            <p>Voulez-vous faire une autre dictée ?</p>
            <div className="popup-buttons">
              <button onClick={handleNewDictation}>Oui</button>
              <button onClick={() => setShowPopup(false)}>Non</button>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
}