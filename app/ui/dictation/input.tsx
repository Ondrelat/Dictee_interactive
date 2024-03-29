// components/UserInput.js
import { useState } from 'react';
import './input.css';
import Helper from './helper';

interface UserInputProps {
  validateSentencePart: () => void;
  dictationText: String;
}

export default function UserInput({ validateSentencePart, dictationText }: UserInputProps) {

  const [input, setInput] = useState('');
  const [stateWordInput, setStateWordInput] = useState('Changing');

  const [score, setScore] = useState(100); // Ajout de l'état du score
  const [numberCorrect, setNumberCorrect] = useState(0); // Ajout de l'état du score
  const [numberIncorrect, setNumberIncorrect] = useState(0); // Ajout de l'état du score

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
        setNumberCorrect(currentScore => currentScore + 1);
        setScore(numberCorrect * 100 / (numberCorrect + numberIncorrect)); 

        setCorrectWords([...correctWords, currentWordToGuess]); // Ajoute note mot qu'on à tapé à la liste des mots correct

        const nbCorrectWord = correctWords.length
        const nextWord = listWordToGuess[nbCorrectWord + 1];
        setCurrentWordToGuess(nextWord);
        
        const lastChar = input.slice(-1);
        // Si l'utilisateur a tapé une ponctuation avant l'espace, appeler onPunctuation
        if ([".", "!", "?", ",", ";", ":"].includes(lastChar)) {
          validateSentencePart();
        }
        setInput('');
      }
      else{
        setStateWordInput("inCorrect");
        setNumberIncorrect(currentScore => currentScore + 1);
        setScore(numberCorrect * 100 / (numberCorrect + numberIncorrect)); 
      }
    }
  };

  return (
    <>
      <div className="scoreBox">Score : {score.toFixed(2)}% <br></br> Mot juste : <span style={{ color: 'green' }}>{numberCorrect}</span><br></br> Mot faux : <span style={{ color: 'red' }}>{numberIncorrect}</span></div> {/* Affichage du score */}  
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
      <div>
        {stateWordInput === 'inCorrect' && <Helper wordError={currentWordToGuess} />}
      </div>
    </>
  );
}