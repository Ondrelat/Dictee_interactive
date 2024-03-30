// components/UserInput.js
import { useState, useEffect } from 'react';
import './input.css';
import Helper from './helper';

interface UserInputProps {
  validateSentencePart: () => void;
  dictationText: String;
}

export default function UserInput({ validateSentencePart, dictationText }: UserInputProps) {

  const [showResponse, setShowResponse] = useState(false);

  const [input, setInput] = useState('');
  const [stateWordInput, setStateWordInput] = useState('Changing');

  const [score, setScore] = useState(100); // Ajout de l'état du score
  const [numberCorrect, setNumberCorrect] = useState(0); // Ajout de l'état du score
  const [numberIncorrect, setNumberIncorrect] = useState(0); // Ajout de l'état du score

  const listWordToGuess = dictationText.split(' ');
  const [currentWordToGuess, setCurrentWordToGuess] = useState<string>(listWordToGuess[0]);

  const [correctWords, setCorrectWords] = useState<string[]>([]);

  const afficherReponse = () => {
    setShowResponse(true); 
    setNumberIncorrect(currentScore => currentScore + 1);
  };

  const handleInputChange = (currentInput: React.ChangeEvent<HTMLInputElement>) => {
    const newInputValue = currentInput.target.value;
    const LastCaracterInput = newInputValue[newInputValue.length - 1]

    //Un espace sert à valider le mot mais en aucun cas il sert à écrire un mot.
    if (LastCaracterInput !== ' ') {
      setInput(newInputValue);
    }
  };

  useEffect(() => {
    if(numberCorrect != 0 || numberIncorrect != 0)
    setScore(numberCorrect * 100 / (numberCorrect + numberIncorrect)); 
  }, [numberCorrect, numberIncorrect]); 

  const handleKeyUp = (currentInput: React.KeyboardEvent) => {

    if (currentInput.key === ' ') {

      if(input === currentWordToGuess){
        setShowResponse(false); 
        setStateWordInput("correct");
        setNumberCorrect(currentScore => currentScore + 1);
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
      }
    }
  };

  return (
    <div className="relative pt-[30vh] flex flex-col w-full h-full">
      
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
      <div>
        <div className="flex">
          <input 
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyUp={handleKeyUp}
            placeholder="Ecrire la dictée ici"
          />

          <button onClick={afficherReponse} className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Afficher la réponse</button>
          {showResponse && <p className="mt-4 text-lg">{currentWordToGuess}</p>} 
        </div>

        {/* Afficher l'Helper*/}
        <div className="absolute w-full">
          {stateWordInput === 'inCorrect' && <Helper wordError={currentWordToGuess} />}
        </div>
      </div>

      {/* Afficher le score */}
      <div className="relative p-2.5 mt-5 bg-[#f0f0f0] border-2 border-[#dcdcdc] rounded-lg shadow-sm text-[#333] text-lg font-bold text-center w-50 inline-block">
        Score : {score.toFixed(2)}% <br></br> Mot juste : <span style={{ color: 'green' }}>{numberCorrect}</span>
        <br></br> Mot faux : <span style={{ color: 'red' }}>{numberIncorrect}</span>
      </div>
      
    </div>
  );
}