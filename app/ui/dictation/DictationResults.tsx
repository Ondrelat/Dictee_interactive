// components/DictationResults.js
import React from 'react';
import { useSession } from 'next-auth/react';
import { LoginButton } from '@/src/auth/LoginButton';
import DifficultySelector from './DifficultySelector';

interface DictationResultsProps {
  scoreBeforeAugmentation: number;
  scoreBonusPercentage: number;
  finalScore: number;
  timer: string;
  correctWords: number;
  incorrectWords: number;
  correctPercentage: number;
  onClose: () => void;
}

const DictationResults: React.FC<DictationResultsProps> = ({
  scoreBeforeAugmentation,
  scoreBonusPercentage,
  finalScore,
  timer,
  correctWords,
  incorrectWords,
  correctPercentage,
  onClose,
}) => {
  const { data: session } = useSession();

  return (
    <div className="popup-overlay">
      <div className="popup-container max-w-md mx-auto bg-white rounded-xl shadow-xl">
        <div className="px-10 py-8">
          <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">Résultats de la dictée</h2>
          <div className="mb-10">
            <div className="flex justify-between items-center mb-4">
              <p className="text-lg font-semibold text-gray-700">Précision</p>
              <p className="text-5xl font-bold text-blue-500">{correctPercentage}%</p>
            </div>
            <div className="h-3 bg-gray-200 rounded-full">
              <div
                className="h-3 bg-blue-500 rounded-full"
                style={{ width: `${correctPercentage}%` }}
              ></div>
            </div>
          </div>
          <div className="flex justify-between mb-10">
            <div className="text-center">
              <p className="text-lg font-semibold mb-2 text-gray-700">Mots corrects</p>
              <p className="text-4xl font-bold text-green-500">{correctWords}</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold mb-2 text-gray-700">Mots incorrects</p>
              <p className="text-4xl font-bold text-red-500">{incorrectWords}</p>
            </div>
          </div>
          <div className="bg-gray-100 rounded-lg p-6 mb-10">
            <div className="flex justify-between items-center mb-3">
              <p className="text-base font-semibold text-gray-700">Score initial</p>
              <p className="text-2xl font-bold text-blue-500">{scoreBeforeAugmentation}</p>
            </div>
            <div className="flex justify-between items-center mb-3">
              <p className="text-base font-semibold text-gray-700">Bonus temps</p>
              <p className="text-2xl text-green-500">+{scoreBonusPercentage}%</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-base font-semibold text-gray-700">Score final</p>
              <p className="text-2xl font-bold text-blue-500">{finalScore}</p>
            </div>
          </div>
          <div className="text-center mb-10">
            <p className="text-lg font-semibold text-gray-700">Temps</p>
            <p className="text-3xl text-gray-800">{timer}</p>
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