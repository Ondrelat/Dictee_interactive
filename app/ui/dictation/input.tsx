// components/UserInput.js
import { useState } from 'react';

interface UserInputProps {
  onPunctuation: () => void;
}

export default function UserInput({ onPunctuation }: UserInputProps) {
  const [input, setInput] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === ' ') {
      // Si l'utilisateur a tapé une ponctuation avant l'espace, appeler onPunctuation
      const lastChar = input.slice(-2, -1);
      if ([".", "!", "?", ",", ";", ":"].includes(lastChar)) {
        onPunctuation();
      }
      setInput('');
    }
  };

  return (
    <input
      type="text"
      value={input}
      onChange={handleInputChange}
      onKeyUp={handleKeyUp}
      placeholder="Ecrire la dictée ici"
    />
  );
}