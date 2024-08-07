'use client'

export default function StarterDictationLevel() {
  const handleLevelClick = (level: string) => {
    window.location.href = `/dictee?level=${level}`;
  };

  return (
    <div className="flex h-20 justify-center items-center gap-x-3 flex-wrap">
      <button
        onClick={() => handleLevelClick('Débutant')}
        className="text-[#467143] w-40 text-lg font-semibold px-4 rounded-full bg-[#EEE2CB]"
      >
        Débutant
      </button>
      <button
        onClick={() => handleLevelClick('Intermédiaire')}
        className="text-[#1661A6] w-40 text-lg font-semibold px-4 rounded-full bg-[#EEE2CB]"
      >
        Intermédiaire
      </button>
      <button
        onClick={() => handleLevelClick('Avancé')}
        className="text-[#932929] w-40 text-lg font-semibold px-4 rounded-full bg-[#EEE2CB]"
      >
        Avancé
      </button>
    </div>
  );
}