'use client'

import React, { useState, useEffect, useRef, useCallback, KeyboardEvent, ChangeEventHandler } from 'react';

export default function UserInput() {

    // Mot à taper
    const [sentence, setSentence] = useState('');
    const [title, setTitle] = useState('');

    const words = sentence.split(' ');

    const [wordError, setWordError] = useState('');
    const [correctWords, setCorrectWords] = useState<string[]>([]);

    const [stateWordInput, setStateWordInput] = useState('Changing');

    // Saisie de l'utilisateur
    const [userInput, setUserInput] = useState('');
    // La dernière saisie utilisateur pour détecter qu'il essaie de changer quelque chose
    const [prevInput, setPrevInput] = useState('');


    const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === ' ') {
          // La logique à exécuter lorsque la touche Espace est pressée
          const currentWord = words[correctWords.length];
    
          // Si mon mot est correct
          if (userInput.trim().toLowerCase() === currentWord.toLowerCase()) {
            setCorrectWords([...correctWords, currentWord]); // On va au prochain mot à compléter
            setUserInput(''); // Réinitialiser l'entrée pour le prochain mot
    
            setStateWordInput('correct'); // Pour enlever le fait que les inputs soient en rouge
            if (correctWords.length + 1 === words.length) {
              console.log('Complete sentence typed correctly');
            }
          } else {
            console.log('Mot incorrect');
    
            setStateWordInput('inCorrect');
    
            setWordError(words[correctWords.length]);
          }
        }
        setPrevInput(userInput);
      };

    const [typedText, setTypedText] = useState<string>('');

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setTypedText(e.target.value);
    };
  
    return (
      <div>
        {/* Zone pour écrire */}
        <div className="ZoneInputAndHelp">
            <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyUp={handleKeyUp}
                placeholder="Ecrire la dictée ici"
            />
        </div>
      </div>
    );
}

