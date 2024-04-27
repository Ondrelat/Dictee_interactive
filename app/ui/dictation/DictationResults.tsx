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
    onClose: () => void;
  }

const DictationResults: React.FC<DictationResultsProps> = ({
    scoreBeforeAugmentation,
    scoreBonusPercentage,
    finalScore,
    timer,
    onClose,
  }) => {
  const { data: session } = useSession();

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Résultats de la dictée
        </h2>
        <div className="popup-content">
          <div className="mb-6">
            <p className="text-xl font-semibold mb-2 text-gray-700">Score :</p>
            <p className="text-4xl font-bold text-blue-500">{scoreBeforeAugmentation}</p>
          </div>
          <div className="mb-6">
            <p className="text-xl font-semibold mb-2 text-gray-700">Temps :</p>
            <p className="text-xl text-gray-800">{timer}</p>
            <p className="text-xl font-semibold text-gray-700">Bonus temps :</p>
            <p className="text-xl text-green-500">+{scoreBonusPercentage}%</p>
          </div>
          <div>
            <p className="text-xl font-semibold mb-2 text-gray-700">Score final :</p>
            <p className="text-4xl font-bold text-blue-500">{finalScore}</p>
          </div>
        </div>
        <div className="popup-buttons">
          <p className="mb-4 text-lg font-semibold text-gray-700">
            Choisir une nouvelle dictée :
          </p>
          <DifficultySelector />
        </div>
        {!session && (
          <div className="mt-8 text-center">
            <p className="text-xl font-semibold mb-4 text-gray-700">
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