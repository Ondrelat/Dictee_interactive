// Helper.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDictationContext } from './dictation';
import helperDataJson from '@/app/lib/data/helperData.json';
import wordtoHelper from '@/app/lib/data/wordToHelper.json';

interface HelperData {
  title: string;
  descriptions: { text: string }[] | null;
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
      const typeAide = (wordtoHelper as { [key: string]: string[] })[String(state.currentWordToGuess)] || null;
      console.log(typeAide)
      if (typeAide) {
        const helperData = (helperDataJson as unknown as { [key: string]: HelperData })[typeAide[0]] || null;

        console.log(helperData)
        setHelperData(helperData)
        setIsLoading(false);
      }
    }
    if (typeError === "Majuscule") {
      setHelperData({
        title: 'Attention aux majuscules',
        descriptions: null,
      });
      setIsLoading(false);
    }
    if (typeError === "Ponctuation") {
      console.log("setting error for ponctuation")
      setHelperData({
        title: 'Attention aux ponctuations',
        descriptions: null,
      });
      setIsLoading(false);
    }

  }, [state.currentWordToGuess, typeError]);

  if (isLoading) {
    return <p className="text-gray-500">Chargement de l aide...</p>;
  } else if (helperData && !state.isTyping) {
    return (
      <div className="helper-bubble bg-blue-100 text-blue-800 px-4 py-3 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-2">{helperData.title}</h3>
        {helperData.descriptions && Array.isArray(helperData.descriptions) && (
          <ul className="list-disc pl-5 space-y-1">
            {helperData.descriptions.map((description, index) => (
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