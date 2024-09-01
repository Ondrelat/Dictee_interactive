'use client'
import { useState, useEffect, useRef } from 'react';
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
    const containerRef = useRef<HTMLDivElement>(null);
    const lastDivRef = useRef(null);

    useEffect(() => {
        if (activeLevel) {
            setFilteredDictations(initialDictations.filter(dictee => dictee.level === activeLevel));
            setIsExpanded(true);
        } else {
            setFilteredDictations(initialDictations);
            setIsExpanded(false);
        }
    }, [activeLevel, initialDictations]);

    const handleLevelChange = (level: string) => {
        if (level !== activeLevel) {
            setActiveLevel(level);
        } else {
            setActiveLevel('');
        }
    };

    return (
        <div>
            <div ref={lastDivRef}></div>
            <div id="LevelSelector" className="relative flex-grow flex">
                <div
                    ref={containerRef}
                    className={`
                    fixed bottom-0 left-0 w-full
                    transition-all duration-700 ease-in-out
                    shadow-lg rounded-t-2xl flex flex-col bg-[#222B42] overflow-hidden
                    ${isExpanded
                            ? 'max-h-[80vh] overflow-y-auto'
                            : 'max-h-80 lg:max-h-32'}
                `}
                >
                    <hr className="hidden lg:block absolute inset-0 h-1 my-8 bg-gray-200 border-0 dark:bg-gray-700 z-0" />
                    <div className="w-max mx-auto relative z-10">
                        <p className="font-butterfly-kids text-white text-4xl mt-4 mb-4 text-center bg-[#222B42] px-4">
                            Sélectionner votre niveau
                        </p>
                    </div>
                    <StarterDictationLevel onLevelChange={handleLevelChange} />
                    <div className={`mt-4 lg:mt-8 px-4 ${isExpanded ? 'block' : 'hidden'}`}>
                        <div className="lg:grid lg:grid-cols-3 lg:gap-6">
                            {filteredDictations.map((dictee) => (
                                <div key={dictee.id} className="mb-4 lg:mb-0">
                                    <CardDictation initialDictationData={dictee} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}