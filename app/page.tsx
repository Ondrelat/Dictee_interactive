'use client';

import '@/app/globals.css';

export default function Page() {
  const handleLevelClick = (level: string) => {
    window.location.href = `/dictee?level=${level}`;
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-115px)] bg-gray-100">
      <div className="relative max-w-xl mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-sky-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative bg-white shadow-lg rounded-3xl p-8 sm:p-12">
          <h1 className="text-4xl font-bold text-center mb-6">Bienvenue sur Dictée Interactive</h1>
          <p className="text-xl mb-8 text-center">
            Vivez une expérience de dictée innovante. Avec une correction mot à mot, une aide ciblée sur les difficultés et un audio qui s&apos;adapte à votre rythme, progressez de manière interactive et motivante.
          </p>
          <p className="text-xl mb-8 text-center">Choisissez votre niveau et commencez l&apos;aventure :</p>
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
        </div>
      </div>
    </div>
  );
}