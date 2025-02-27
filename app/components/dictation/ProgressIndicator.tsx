import React from 'react';

interface ProgressIndicatorProps {
  numberCorrect: number;
  numberIncorrect: number;
}

/**
 * Composant pour afficher la progression de la dictée
 */
const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  numberCorrect,
  numberIncorrect
}) => {
  return (
    <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
      <span>
        Mots justes : <strong className="text-green-600">{numberCorrect}</strong>
      </span>
      <span>
        Mots faux : <strong className="text-red-600">{numberIncorrect}</strong>
      </span>
    </div>
  );
};

export default ProgressIndicator;