import { useState } from 'react';
import Link from 'next/link';

interface DifficultySelectorProps {
  onClose: () => void;
}

const DifficultySelector = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleLevelClick = (level: string) => {
    window.location.href = `/dictee?level=${level}`;
  };
  return (
    <div>
      <button
        onClick={openModal}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <i className="fas fa-cog mr-2"></i>
        Changer de dictée
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Choisir un niveau de difficulté</h2>
            <div className="space-y-4">
              <button
                onClick={() => handleLevelClick('Débutant')}
                className="block w-full bg-emerald-400 hover:bg-emerald-500 text-white font-semibold py-2 px-4 rounded"
              >
                Débutant
              </button>
              <button
                onClick={() => handleLevelClick('Facile')}
                className="block w-full bg-sky-400 hover:bg-sky-500 text-white font-semibold py-2 px-4 rounded"
              >
                Facile
              </button>
              <button
                onClick={() => handleLevelClick('Intermédiaire')}
                className="block w-full bg-orange-400 hover:bg-orange-500 text-white font-semibold py-2 px-4 rounded"
              >
                Intermédiaire
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DifficultySelector;