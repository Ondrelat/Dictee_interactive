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

  //Commun qu'à ce fichier
  const [typeError, setTypeError] = useState<string>("");
  const listWordToGuess = dictationText.split(' ');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  const handleInputChange = (currentInput: React.ChangeEvent<HTMLInputElement>) => {
    const newInputValue = currentInput.target.value;
    const LastCaracterInput = newInputValue[newInputValue.length - 1];

    if (LastCaracterInput === ' ') {
      handleSpace();
    } else {
      //On affiche la valeur de l'input que si le dernier caractère sur tout la chaine de caractère qu'on ait en train de tapé est un espace{
      setState({ ...state, input: newInputValue, isTyping: true });
      setTypeError("");
    }
  };

  const handleKeyDown = (currentInput: React.KeyboardEvent<HTMLInputElement>) => {
    if (currentInput.code === 'Enter' || currentInput.key === 'Enter') {
      handleSpace();
    }
  };

  const handleSpace = () => {
    setState({
      ...state,
      isTyping: false,
    });

    if (state.input === listWordToGuess[currentWordIndex]) {
      var currentState: string = state.stateWordInput.valueOf();
      handleNextWord(currentState);
    } else {
      handleReponseFalse();
    }
  }

  const handleNextWord = (paramState: string | null) => {
    if (paramState !== "incorrect") {
      setState(prevState => ({ ...prevState, numberCorrect: prevState.numberCorrect + 1 }));
    }

    setState(prevState => ({
      ...prevState,
      input: '',
      wordDataArray: [
        ...prevState.wordDataArray,
        { word: listWordToGuess[currentWordIndex], state: paramState! },
      ],
      stateWordInput: "correct",
      currentWordToGuess: listWordToGuess[currentWordIndex + 1],
    }));

    setCurrentWordIndex(prevIndex => prevIndex + 1);

    const lastChar = state.input.slice(-1);
    if ([".", "!", "?", ",", ";", ":"].includes(lastChar)) {
      validateSentencePart();
    }

    if (currentWordIndex + 1 === listWordToGuess.length) {
      // La dictée est terminée, afficher la pop-up
      setShowPopup(true);
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
    if (state.input.toLowerCase() === listWordToGuess[currentWordIndex].toLowerCase()) {
      setTypeError("Majuscule");
      setState(prevState => ({
        ...prevState,
        stateWordInput: "ErrorMajuscule",
      }));
      return
    }

    // Vérification de la ponctuation 
    const expectedPunctuation = listWordToGuess[currentWordIndex].replace(/[.,!?;:]/g, '');
    if (state.input === expectedPunctuation) {
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

  const handleLevelClick = (level: string) => {
    setShowPopup(false);
    window.location.href = `/dictee?level=${level}`;
  };

  return (
    <>
      <div className="flex">
        <input
          autoCapitalize="none"
          type="text"
          value={state.input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Ecrire la dictée ici"
        />
        <button
          className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded relative group"
          onClick={DonnerLaReponse}
        >
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Donner la réponse
          </span>
          <span className="absolute top-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Aide : donne la réponse mais compte le mot en erreur
          </span>
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
                <div className="mt-4 flex flex-col items-center">
                  <p className="mb-2">Choisir une nouvelle dictée de niveau :</p>
                  <div className="flex space-x-4">
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                      onClick={() => handleLevelClick('Débutant')}
                    >
                      Débutant
                    </button>
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
                      onClick={() => handleLevelClick('Intermédiaire')}
                    >
                      Intermédiaire
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}