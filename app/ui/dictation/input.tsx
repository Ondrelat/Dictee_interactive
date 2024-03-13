// components/UserInput.js
import { useState } from 'react';
import './input.css';

interface UserInputProps {
  validateSentencePart: () => void;
  dictationText: String;
}

export default function UserInput({ validateSentencePart, dictationText }: UserInputProps) {

  const [input, setInput] = useState('');
  const [stateWordInput, setStateWordInput] = useState('Changing');

  const listWordToGuess = dictationText.split(' ');
  const [currentWordToGuess, setCurrentWordToGuess] = useState<string>(listWordToGuess[0]);

  const [correctWords, setCorrectWords] = useState<string[]>([]);

  const handleInputChange = (currentInput: React.ChangeEvent<HTMLInputElement>) => {
    const newInputValue = currentInput.target.value;
    const LastCaracterInput = newInputValue[newInputValue.length - 1]

    //Un espace sert à valider le mot mais en aucun cas il sert à écrire un mot.
    if (LastCaracterInput !== ' ') {
      setInput(newInputValue);
    }
  };

  const handleKeyUp = (currentInput: React.KeyboardEvent) => {

    if (currentInput.key === ' ') {

      if(input === currentWordToGuess){

        setStateWordInput("correct");
        setCorrectWords([...correctWords, currentWordToGuess]); // Ajoute note mot qu'on à tapé à la liste des mots correct

        const nbCorrectWord = correctWords.length
        const nextWord = listWordToGuess[nbCorrectWord + 1];
        setCurrentWordToGuess(nextWord);

        const lastChar = input.slice(-1);
        console.log("lastChar", lastChar)
        // Si l'utilisateur a tapé une ponctuation avant l'espace, appeler onPunctuation
        if ([".", "!", "?", ",", ";", ":"].includes(lastChar)) {
          console.log("ponctuation")
          validateSentencePart();
        }
        setInput('');
      }
      else{
        setStateWordInput("inCorrect");
      }
        
    }
  };

  return (
    <>
      {/* Affichage de ce que tu tapes et de si c'est juste ou incorrect */}
      <div className="dictation-box">
        <p>
            <span style={{ color: 'green' }}>{correctWords.join(' ')}</span>&nbsp;
            <span style={{
                color: stateWordInput === 'correct' ? 'green' :
                    stateWordInput === 'inCorrect' ? 'red' :
                        'black'
            }}>
                {input}
            </span>
        </p>
      </div>

      {/* Zone pour écrire */}
      <input 
        type="text"
        value={input}
        onChange={handleInputChange}
        onKeyUp={handleKeyUp}
        placeholder="Ecrire la dictée ici"
      />
    </>
  );
}