

import { dictation } from '@prisma/client';


interface HeadBandProp {
  dictation: dictation;
  duration: string | null
}

export default function headBand({ dictation, duration }: HeadBandProp) {

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
      className="ml-auto bg-white rounded-lg shadow-md p-3 shadow-2xl mt-4"
      onClick={() => {/* Handle click event */ }}
    >
      <div className="flex items-center">
        <span className={`${getLevelClass(dictation.level)} text-xs font-semibold mr-2 px-2 py-1 rounded`}>
          {dictation.level}
        </span>
        <span className="text-xl font-extrabold text-left mr-4">{dictation.title}</span>

      </div>
      <div className="flex justify-between items-center text-gray-700">
        <span className="text-xs font-medium">{dictation.excerpt}</span>
        <span className="flex items-center text-sm">
          <svg className="h-5 w-5 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          {dictation.audio_duration_minutes}:{dictation.audio_duration_seconds}
        </span>
      </div>
    </div>
  );

}
