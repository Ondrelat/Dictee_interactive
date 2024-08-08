'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

interface StarterDictationLevelProps {
  onLevelChange: (level: string) => void;
}

export default function StarterDictationLevel({ onLevelChange }: StarterDictationLevelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeLevel, setActiveLevel] = useState<string>('Débutant');

  useEffect(() => {
    // Update the state based on the level in the URL
    const level = searchParams?.get('level');
    if (level) {
      setActiveLevel(level);
      onLevelChange(level);
    }
  }, [searchParams, onLevelChange]);

  const handleLevelClick = (level: string) => {
    setActiveLevel(level);
    onLevelChange(level);
    router.push(`?level=${level}`, { scroll: false });
  };

  const getButtonClasses = (level: string) => {
    const baseClasses = "w-40 lg:w-80 text-lg font-semibold px-4 lg:py-2 lg:px-16 rounded-full";
    const activeClasses = "bg-[#EEE2CB]";
    const inactiveClasses = "bg-[#BDB3A1]";
    let textColor = "";
    switch (level) {
      case 'Débutant':
        textColor = activeLevel === level ? "text-[#467143]" : "text-[#467143]";
        break;
      case 'Intermédiaire':
        textColor = activeLevel === level ? "text-[#1661A6]" : "text-[#1661A6]";
        break;
      case 'Avancé':
        textColor = activeLevel === level ? "text-[#932929]" : "text-[#932929]";
        break;
      default:
        break;
    }
    return `${baseClasses} ${textColor} ${activeLevel === level ? activeClasses : inactiveClasses}`;
  };

  return (
    <div className="flex h-20 lg:h-30 justify-center items-center gap-x-3 lg:gap-x-16 flex-wrap">
      <button
        onClick={() => handleLevelClick('Débutant')}
        className={getButtonClasses('Débutant')}
      >
        Débutant
      </button>
      <button
        onClick={() => handleLevelClick('Intermédiaire')}
        className={getButtonClasses('Intermédiaire')}
      >
        Intermédiaire
      </button>
      <button
        onClick={() => handleLevelClick('Avancé')}
        className={getButtonClasses('Avancé')}
      >
        Avancé
      </button>
    </div>
  );
}