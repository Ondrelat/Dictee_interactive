'use client';

import { dictation } from '@prisma/client';


interface HeadBandProp {
  dictation: dictation;
  duration: string | null
}

export default function headBand({ dictation, duration }: HeadBandProp) {

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-center">
        <div className="flex-1 min-w-0 text-center">
          <h1 className="text-xl font-bold text-gray-900">{dictation.title}</h1>
          {dictation.excerpt && (
            <p className="text-base text-gray-600">{dictation.excerpt}</p>
          )}
          <div className="flex items-center justify-center mt-1">
            <span className="text-sm font-medium text-gray-500 mr-1">Niveau:</span>
            <span className={
              dictation.level === 'Débutant'
                ? 'text-sm font-semibold text-emerald-400'
                : dictation.level === 'Facile'
                  ? 'text-sm font-semibold text-green-400'
                  : dictation.level === 'Intermédiaire'
                    ? 'text-sm font-semibold text-sky-400'
                    : dictation.level === 'Avancé'
                      ? 'text-sm font-semibold text-orange-400'
                      : 'text-sm font-semibold text-gray-800'
            }>{dictation.level}</span>
            {duration && (
              <span className="text-gray-500 text-sm ml-4 flex items-center">
                <i className="far fa-clock mr-1"></i> {duration}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="absolute right-0 top-0 mt-4 md:mt-0">

      </div>
    </div>
  );
}
