'use client'

export default function StarterDictationLevel() {
  const handleLevelClick = (level: string) => {
    window.location.href = `/dictee?level=${level}`;
  };

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6">
        <button
        onClick={() => handleLevelClick('Débutant')}
        className="bg-emerald-400 hover:bg-emerald-500 text-white text-lg font-semibold py-3 px-4 rounded-lg shadow-md transition duration-300"
        >
        Débutant
        </button>
        <button
        onClick={() => handleLevelClick('Facile')}
        className="bg-green-400 hover:bg-green-500 text-white text-lg font-semibold py-3 px-4 rounded-lg shadow-md transition duration-300"
        >
        Facile
        </button>
        <button
        onClick={() => handleLevelClick('Intermédiaire')}
        className="bg-sky-400 hover:bg-sky-500 text-white text-lg font-semibold py-3 px-4 rounded-lg shadow-md transition duration-300"
        >
        Intermédiaire
        </button>
        <button
        onClick={() => handleLevelClick('Avancé')}
        className="bg-orange-400 hover:bg-orange-500 text-white text-lg font-semibold py-3 px-4 rounded-lg shadow-md transition duration-300"
        >
        Avancé
        </button>
  </div>
  );
}