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
      setHelperData({
        title: 'Attention aux ponctuations',
        description: null,
      });
      setIsLoading(false);
    }
  }, [state.currentWordToGuess, typeError]);

  if (isLoading) {
    if (error) {
      return <p className="text-red-500">Erreur lors du chargement de l aide.</p>;
    }
    return <p className="text-gray-500">Chargement de l aide...</p>;
  } else if (helperData && !state.isTyping) {
    return (
        <div className="absolute z-50 top-full mt-2 left-1/2 transform -translate-x-1/2 max-w-md w-full animate-fade-in">
          <div className="relative bg-blue-100 text-blue-900 px-4 py-3 rounded-lg shadow-lg border-l-4 border-blue-500">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-blue-100"></div>
            <h3 className="text-xl font-semibold mb-2">{helperData.title}</h3>
            {helperData.description && Array.isArray(helperData.description) && (
              <ul className="list-disc pl-5 space-y-1">
                {helperData.description.map((description, index) => (
                  <li key={index}>
                    <section
                      className="text-base"
                      dangerouslySetInnerHTML={{ __html: description.text }}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      );
  }
  return null;
}