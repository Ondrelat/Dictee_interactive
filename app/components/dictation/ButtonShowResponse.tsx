import React from 'react';
import { useDictationContext } from '@/app/context/DictationContext';

export default function ShowResponse() {
  const { state, setState, handleNextWord } = useDictationContext();

  const DonnerLaReponse = () => {
    const lastChar = state.currentWordToGuess.toString().slice(-1);
    if ([".", "!", "?", ",", ";", ":"].includes(lastChar)) {
      setState(prevState => ({
        ...prevState,
        audioIndex: state.audioIndex + 1,
      }));
    }
    handleNextWord("incorrect");
  };

  return (
    <button
      className="p-1.5 text-white bg-orange-500 rounded-full hover:bg-orange-600 transition duration-200 shadow-md"
      onClick={DonnerLaReponse}
      title="Demander de l'aide"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-4 h-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </button>
  );
}