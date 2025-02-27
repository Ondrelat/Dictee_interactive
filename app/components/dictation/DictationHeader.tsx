import React from 'react';
import { BookOpen, Clock } from 'lucide-react';
import { dictation } from '@prisma/client';
import { formatDuration, getLevelClassName } from '../../utils/formatUtils';

interface DictationHeaderProps {
  dictation: dictation;
}

/**
 * Composant d'en-tête pour afficher les informations de la dictée
 */
const DictationHeader: React.FC<DictationHeaderProps> = ({ dictation }) => {
  const duration = formatDuration(
    dictation.audio_duration_minutes, 
    dictation.audio_duration_seconds
  );
  
  const levelClassName = getLevelClassName(dictation.level);

  return (
    <div className="flex justify-between items-start mb-4">
      {/* Titre et extrait */}
      <div className="flex items-center">
        <BookOpen className="text-blue-600 mr-2" size={24} />
        <div>
          <h2 className="text-xl font-bold text-gray-800">{dictation.title}</h2>
          <p className="text-sm text-gray-600">{dictation.excerpt}</p>
        </div>
      </div>
      
      {/* Niveau et durée */}
      <div className="flex items-center space-x-2">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${levelClassName}`}>
          {dictation.level}
        </span>
        {duration && (
          <span className="text-gray-600 text-sm flex items-center">
            <Clock size={14} className="mr-1" />
            {duration}
          </span>
        )}
      </div>
    </div>
  );
};

export default DictationHeader;