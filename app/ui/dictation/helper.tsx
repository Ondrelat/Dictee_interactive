import React, { useEffect, useState } from 'react';
import { useDictationContext } from './dictation';
import helperDataJson from '@/app/lib/data/helperData.json';
import wordtoHelper from '@/app/lib/data/wordToHelper.json';

interface Description {
  title: string;
  type: string;
  text: string;
  exemple: string;
  astuce?: string;
  exemple2?: string;
}

interface HelperData {
  title: string;
  descriptions: Description[] | null;
}

interface HelperProps {
  typeError: string;
}

export default function Helper({ typeError }: HelperProps) {
  const { state } = useDictationContext();
  const [helperData, setHelperData] = useState<HelperData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("Effect triggered. TypeError:", typeError, "CurrentWord:", state.currentWordToGuess);

    setIsLoading(true);
    setHelperData(null);

    if (state.stateWordInput === 'correct') {
      console.log("Word is correct, resetting helper");
      setIsLoading(false);
      return;
    }

    if (typeof state.currentWordToGuess === 'string' && state.currentWordToGuess && typeError === "Word") {
      console.log("Fetching helper data for word:", state.currentWordToGuess);
      const typeAide = (wordtoHelper as { [key: string]: string[] })?.[state.currentWordToGuess];
      if (typeAide) {
        const data = (helperDataJson as unknown as { [key: string]: HelperData })?.[typeAide[0]];
        console.log("Helper data found:", data);
        setHelperData(data || null);
      } else {
        console.log("No helper data found for this word");
      }
    } else if (typeError === "Majuscule") {
      setHelperData({
        title: 'Attention aux majuscules',
        descriptions: null,
      });
    } else if (typeError === "Ponctuation") {
      setHelperData({
        title: 'Attention aux ponctuations',
        descriptions: null,
      });
    }

    setIsLoading(false);
  }, [state.currentWordToGuess, typeError, state.stateWordInput]);

  console.log("Rendering. IsLoading:", isLoading, "HelperData:", helperData);

  if (isLoading) {
    return <p className="text-gray-500">Chargement de l&apos;aide...</p>;
  }

  if (!helperData || state.isTyping) {
    return null;
  }

  return (
    <div className="helper-bubble bg-white text-gray-800 p-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out border border-gray-200 max-w-3xl w-full">
      {helperData.descriptions && Array.isArray(helperData.descriptions) && (
        <ul className="divide-y divide-gray-200">
          {helperData.descriptions.map((description, index) => (
            <li key={index} className="group py-4 first:pt-0 last:pb-0">
              <div className="flex gap-3">
                <div className="w-1/6 flex flex-col items-center justify-start pt-1">
                  <h4 className="text-sm font-semibold text-blue-600 mb-1 text-center">{description.title}</h4>
                  <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 font-medium rounded-full whitespace-nowrap">{description.type}</span>
                </div>
                <div className="w-5/6">
                  <div className="mb-2">
                    <p className="text-sm text-gray-700 leading-snug">{description.text}</p>
                    <p className="text-xs text-gray-600 italic leading-tight mt-0.5"><span className="font-medium not-italic">Ex :</span> {description.exemple}</p>
                  </div>
                  {(description.astuce || description.exemple2) && (
                    <div>
                      {description.astuce && (
                        <p className="text-xs text-gray-600 leading-tight"><span className="font-medium">Astuce :</span> {description.astuce}</p>
                      )}
                      {description.exemple2 && (
                        <p className="text-xs text-gray-600 italic leading-tight mt-0.5"><span className="font-medium not-italic">Ex 2 :</span> {description.exemple2}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}