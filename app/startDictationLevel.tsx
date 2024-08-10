'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

interface StarterDictationLevelProps {
  onLevelChange: (level: string) => void;
}

export default function StarterDictationLevel({ onLevelChange }: StarterDictationLevelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname(); // Get the current pathname
  const [activeLevel, setActiveLevel] = useState<string>('');

  useEffect(() => {
    // Update the state based on the level in the URL
    const level = searchParams?.get('level') || '';
    setActiveLevel(level);
    onLevelChange(level);
  }, [searchParams, onLevelChange]);

  const handleLevelClick = (level: string) => {
    if (activeLevel === level) {
      // If the clicked level is already active, deactivate it
      setActiveLevel('');
      onLevelChange('');

      if (searchParams) {
        // Create a new URLSearchParams object to remove the 'level' param
        const params = new URLSearchParams(searchParams.toString());
        params.delete('level');

        // Push the new URL without the 'level' parameter
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      }
    } else {
      // Otherwise, activate the new level
      setActiveLevel(level);
      onLevelChange(level);
      router.push(`${pathname}?level=${level}`, { scroll: false });
    }
  };

  const getButtonClasses = (level: string) => {
    const baseClasses = "w-40 lg:w-80 text-lg font-semibold px-4 lg:py-2 lg:px-16 rounded-full";
    const activeClasses = "bg-[#EEE2CB]";
    const inactiveClasses = "bg-[#BDB3A1]";
    let textColor = "";
    let backgroundColor = inactiveClasses;

    if (activeLevel === level) {
      backgroundColor = activeClasses;
      switch (level) {
        case 'Débutant':
          textColor = "text-[#467143]";
          break;
        case 'Intermédiaire':
          textColor = "text-[#1661A6]";
          break;
        case 'Avancé':
          textColor = "text-[#932929]";
          break;
        default:
          break;
      }
    } else {
      switch (level) {
        case 'Débutant':
          textColor = "text-[#467143]";
          break;
        case 'Intermédiaire':
          textColor = "text-[#1661A6]";
          break;
        case 'Avancé':
          textColor = "text-[#932929]";
          break;
        default:
          break;
      }
    }

    return `${baseClasses} ${textColor} ${backgroundColor}`;
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
