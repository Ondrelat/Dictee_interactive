// DictationContent.tsx
'use client';

import { useState, useEffect } from 'react';
import StarterDictationLevel from './startDictationLevel';
import CardDictation from './card';
import { dictation } from '@prisma/client';

interface Props {
    initialDictations: dictation[];
}

export default function DictationList({ initialDictations }: Props) {
    const [activeLevel, setActiveLevel] = useState<string>('');
    const [filteredDictations, setFilteredDictations] = useState<dictation[]>([]);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        setFilteredDictations(initialDictations.filter(dictee => dictee.level === activeLevel));
    }, [activeLevel, initialDictations]);

    const handleLevelChange = (level: string) => {
        if (level !== activeLevel) {
            setActiveLevel(level);
            setIsExpanded(true); // Set isExpanded to true only when a new level is selected
        }
        if (level == '') {
            setActiveLevel('');
            setIsExpanded(false);
        }
    };

    return (
        <div id="LevelSelector" className="flex-grow flex">
            <div
                className={`${isExpanded ? 'fixed top-[20%] left-0' : 'relative top-0 left-0'
                    } w-full shadow-lg rounded-t-2xl flex-1 flex flex-col bg-[#222B42] transition-all duration-500 ease-in-out`}
                style={{
                    transitionProperty: 'top, left, width, height, transform',
                }}
            >
                <hr className="hidden lg:block absolute inset-0 h-1 my-8 bg-gray-200 border-0 dark:bg-gray-700 z-0"></hr>
                <div className="w-max mx-auto relative z-10">
                    <p className="font-butterfly-kids text-white text-4xl mt-4 mb-4 text-center bg-[#222B42] px-4">Sélectionner votre niveau</p>
                </div>
                <StarterDictationLevel onLevelChange={handleLevelChange} />
                {filteredDictations.map((dictee) => (
                    <CardDictation key={dictee.id} initialDictationData={dictee} />
                ))}
                <div className="flex-grow bg-[#222B42] min-h-screen"></div>
            </div>
        </div>
    );
}