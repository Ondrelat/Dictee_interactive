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

  const removePunctuation = (str: string): string => {
    return str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
  };

  const removeAccents = (str: string): string => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  console.log(state.typeError);

  useEffect(() => {
    console.log("Effect triggered. TypeError:", state.typeError, "CurrentWord:", state.currentWordToGuess);

    setIsLoading(true);
    setHelperData(null);

    if (state.stateWordInput === 'correct') {
      console.log("Word is correct, resetting helper");
      setIsLoading(false);
      return;
    }

    if (typeof state.currentWordToGuess === 'string' && state.currentWordToGuess && state.typeError === "Word") {
      const lowercaseWord = state.currentWordToGuess.toLowerCase();
      console.log("Fetching helper data for word:", lowercaseWord);

      // Recherche insensible à la casse
      const typeAide = Object.entries(wordtoHelper as { [key: string]: string[] })
        .find(([key]) => key.toLowerCase() === lowercaseWord)?.[1];

      if (typeAide) {
        const data = (helperDataJson as unknown as { [key: string]: HelperData })?.[typeAide[0]];
        console.log("Helper data found:", data);
        setHelperData(data || null);
      } else {
        const WordGuessPonctuationless = removePunctuation(state.currentWordToGuess);
        console.log("state.currentWordToGuess.endsWith('s')" + WordGuessPonctuationless.endsWith('s'), !state.input.endsWith('s'))
        console.log(state.currentWordToGuess)
        console.log(state.currentWordToGuess)
        if (WordGuessPonctuationless.endsWith('s') && !state.input.endsWith('s')) {
          setHelperData({
            title: 'Attentions aux accords',
            descriptions: [{
              title: '',
              type: '',
              text: "N'oubliez pas d'accorder les mots",
              exemple: ''
            }],
          });
        }
        else if (removeAccents(WordGuessPonctuationless) == state.input) {
          setHelperData({
            title: 'Attentions aux accents',
            descriptions: [{
              title: '',
              type: '',
              text: "Il y a probablement un problème d'accent",
              exemple: ''
            }],
          });
        }

        else if (state.input == WordGuessPonctuationless && state.input != state.currentWordToGuess) {
          setHelperData({
            title: 'Attention aux ponctuations',
            descriptions: [{
              title: '',
              type: '',
              text: 'Vérifiez bien la ponctuation à la fin de la phrase.',
              exemple: ''
            }],
          });
        }


        else {
          console.log("No helper data found for this word");
          setHelperData(null);
        }
      }
    } else if (state.typeError === "Majuscule") {
      setHelperData({
        title: 'Attention aux majuscules',
        descriptions: [{
          title: 'Majuscule',
          type: '',
          text: "N'oubliez pas la majuscule au début de la phrase.",
          exemple: ''
        }],
      });
    } else if (state.typeError === "Ponctuation") {
      setHelperData({
        title: 'Attention aux ponctuations',
        descriptions: [{
          title: 'Ponctuation',
          type: '',
          text: 'Vérifiez bien la ponctuation à la fin de la phrase.',
          exemple: ''
        }],
      });
    }

    setIsLoading(false);
  }, [state.currentWordToGuess, state.typeError, state.stateWordInput, state.input]);


  if (isLoading) {
    return <p className="text-gray-500">Chargement de l aide...</p>;
  } else if (helperData && !state.isTyping) {
    return (
      <div className="helper-bubble bg-white text-gray-800 p-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out border border-gray-200 max-w-3xl w-full">
        {helperData.descriptions && Array.isArray(helperData.descriptions) && (
          <ul className="divide-y divide-gray-200">
            {helperData.descriptions.map((description, index) => (
              <li key={index} className="group py-4 first:pt-0 last:pb-0">
                <div className="flex gap-3">
                  <div className="w-1/6 flex flex-col items-center justify-start pt-1">
                    <h4 className="text-sm font-semibold text-blue-600 mb-1 text-center break-words">{description.title}</h4>
                    {description.type && (
                      <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 font-medium rounded-full whitespace-normal text-center">{description.type}</span>
                    )}
                  </div>
                  <div className="w-5/6">
                    <p className="text-sm text-gray-700 leading-snug">{description.text}</p>
                    {description.exemple && (
                      <p className="text-xs text-gray-600 italic leading-tight mt-0.5">
                        <span className="font-medium not-italic">Ex :</span> {description.exemple}
                      </p>
                    )}
                    {description.astuce && (
                      <p className="text-xs text-gray-600 leading-tight mt-1">
                        <span className="font-medium">Astuce :</span> {description.astuce}
                      </p>
                    )}
                    {description.exemple2 && (
                      <p className="text-xs text-gray-600 italic leading-tight mt-0.5">
                        <span className="font-medium not-italic">Ex 2 :</span> {description.exemple2}
                      </p>
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
}