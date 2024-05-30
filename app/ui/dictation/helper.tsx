// Helper.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDictationContext } from './dictation';

interface HelperData {
  title: string;
  description: { text: string }[] | null;
}

interface HelperProps {
  typeError: string;
}

export default function Helper({ typeError }: HelperProps) {
  const { state } = useDictationContext();
  const [helperData, setHelperData] = useState<HelperData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (state.stateWordInput === 'correct') {
      setIsLoading(false);
      setHelperData(null);
      return;
    }
    setHelperData(null);
    if (state.currentWordToGuess && typeError === "Word") {
      setIsLoading(true);
      axios
        .get(
          process.env.NEXT_PUBLIC_BASE_URL +
            `/api/helpers?query=${state.currentWordToGuess}`
        )
        .then((response) => {
          setHelperData(response.data[0].helper);
          setIsLoading(false);
          setError(null);
        })
        .catch((error) => {
          console.error('Erreur lors de la récupération de l aide', error);
          setError(error);
          setIsLoading(false);
        });
    }
    if (typeError === "Majuscule") {
      setHelperData({
        title: 'Attention aux majuscules',
        description: null,
      });
      setIsLoading(false);
    }
    if (typeError === "Ponctuation") {
      console.log("setting error for ponctuation")
      setHelperData({
        title: 'Attention aux ponctuations',
        description: null,
      });
      setIsLoading(false);
    }
    console.log("helperData" + helperData);
    console.log("state.stateWordInput" + state.stateWordInput);
    console.log("state.typeError" + state.typeError)
  }, [state.currentWordToGuess, typeError]);

  if (isLoading) {
    return <p className="text-gray-500">Chargement de l aide...</p>;
  } else if (helperData && !state.isTyping) {
    return (
      <div className="helper-bubble bg-blue-100 text-blue-800 px-4 py-3 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-2">{helperData.title}</h3>
        {helperData.description && Array.isArray(helperData.description) && (
          <ul className="list-disc pl-5 space-y-1">
            {helperData.description.map((description, index) => (
              <li key={index}>
                <span dangerouslySetInnerHTML={{ __html: description.text }} />
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
  return null;
}