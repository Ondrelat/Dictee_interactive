'use client'
import { dictation } from '@prisma/client';

interface Props {
    initialDictationData: dictation;
}

export default function cardDictation({ initialDictationData }: Props) {

    const handleStartDictationById = () => {
        window.location.href = `/dictee?id=${initialDictationData.id}`;
    };

    const getLevelClass = (level: string) => {
        switch (level) {
            case 'Débutant':
                return 'bg-green-200 text-green-800';
            case 'Intermédiaire':
                return 'bg-blue-200 text-blue-800';
            case 'Avancé':
                return 'bg-red-200 text-red-800';
            default:
                return '';
        }
    };

    return (
        <div
            className="bg-white rounded-lg shadow-md p-4 mb-4 mt-4 mx-4 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            onClick={() => {/* Handle click event */ }}
        >
            <div className="flex items-center">
                <span className={`${getLevelClass(initialDictationData.level)} text-sm font-semibold mr-2 px-2 py-1 rounded`}>
                    {initialDictationData.level}
                </span>
                <span className="text-2xl font-extrabold text-left mr-4">{initialDictationData.title}</span>

            </div>
            <div className="flex justify-between items-center text-gray-700">
                <span className="text-sm font-medium">{initialDictationData.excerpt}</span>
                <span className="flex items-center text-sm">
                    <svg className="h-5 w-5 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    {initialDictationData.audio_duration_minutes}:{initialDictationData.audio_duration_seconds}
                </span>
            </div>
            <button
                onClick={() => handleStartDictationById()}
                className="mt-4 w-full text-lg font-semibold px-4 rounded-full bg-[#EEE2CB]"
            >
                Lancer la dictée
            </button>
        </div>
    );
}
