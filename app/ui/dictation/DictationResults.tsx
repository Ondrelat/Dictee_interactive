// components/DictationResults.js
import React from 'react';
import { useSession } from 'next-auth/react';
import { LoginButton } from '@/src/auth/LoginButton';
import DifficultySelector from './DifficultySelector';
import { useDictationContext } from './dictation';

interface DictationResultsProps {
  onClose: () => void;
}

const DictationResults: React.FC<DictationResultsProps> = ({
  onClose,


}) => {
  const { data: session } = useSession();
  const { state, setState } = useDictationContext();

  return (
    <div className="popup-overlay">
      <div className="popup-container max-w-md mx-auto bg-white rounded-xl shadow-xl">
        <div className="px-10 py-8">
          <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">Résultats de la dictée</h2>
          <div className="mb-10">
            <div className="flex justify-between items-center mb-4">
              <p className="text-lg font-semibold text-gray-700">Précision</p>
              <p className="text-5xl font-bold text-blue-500">{Math.floor(state.correctPercentage)}%</p>
            </div>
            <div className="h-3 bg-gray-200 rounded-full">
              <div
                className="h-3 bg-blue-500 rounded-full"
                style={{ width: `${state.correctPercentage}%` }}
              ></div>
            </div>
          </div>
          <div className="flex justify-between mb-10">
            <div className="text-center">
              <p className="text-lg font-semibold mb-2 text-gray-700">Mots corrects</p>
              <p className="text-4xl font-bold text-green-500">{state.numberCorrect}</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold mb-2 text-gray-700">Mots incorrects</p>
              <p className="text-4xl font-bold text-red-500">{state.numberIncorrect}</p>
            </div>
          </div>
          <div className="bg-gray-100 rounded-lg p-6 mb-10">
            <div className="flex justify-between items-center mb-3">
              <p className="text-base font-semibold text-gray-700">Score initial</p>
              <p className="text-2xl font-bold text-blue-500">{state.scoreBeforeAugmentation}</p>
            </div>
            <div className="flex justify-between items-center mb-3">
              <p className="text-base font-semibold text-gray-700">Bonus temps</p>
              <p className="text-2xl text-green-500">+{state.scoreBonusPercentage}%</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-base font-semibold text-gray-700">Score final</p>
              <p className="text-2xl font-bold text-blue-500">{state.finalScore}</p>
            </div>
          </div>
          <div className="text-center mb-10">
            <p className="text-lg font-semibold text-gray-700">Temps</p>
            <p className="text-3xl text-gray-800">{state.timer}</p>
          </div>
        </div>
        <div className="bg-gray-100 px-10 py-6 rounded-b-xl">
          <p className="mb-6 text-base font-semibold text-gray-700 text-center">
            Choisir une nouvelle dictée :
          </p>
          <div className="flex justify-center">
            <DifficultySelector />
          </div>
        </div>
        {!session && (
          <div className="mt-10 text-center px-10 pb-10">
            <p className="text-lg font-semibold mb-6 text-gray-700">
              Connectez-vous pour enregistrer votre score
            </p>
            <LoginButton />
          </div>
        )}
      </div>
    </div>
  );
};

export default DictationResults;