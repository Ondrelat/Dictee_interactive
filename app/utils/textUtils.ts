/**
 * Fonctions utilitaires pour la manipulation de texte
 */

/**
 * Supprime la ponctuation d'une chaîne
 */
export const removePunctuation = (str: string): string => {
    return str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
  };
  
  /**
   * Supprime les accents d'une chaîne
   */
  export const removeAccents = (str: string): string => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };
  
  /**
   * Supprime le 's' final d'un mot
   */
  export const removeFinalS = (word: string): string => {
    return word.endsWith('s') ? word.slice(0, -1) : word;
  };
  
  /**
   * Supprime le 'es' final d'un mot
   */
  export const removeFinalES = (word: string): string => {
    return word.endsWith('es') ? word.slice(0, -2) : word;
  };
  
  /**
   * Supprime le 'e' final d'un mot
   */
  export const removeFinalE = (word: string): string => {
    return word.endsWith('e') ? word.slice(0, -1) : word;
  };
  
  /**
   * Vérifie s'il manque un 'e' avant le 's' final
   */
  export const checkMissingEBeforeS = (correct: string, input: string): boolean => {
    return correct.endsWith('es') && input.endsWith('s') && !input.endsWith('es');
  };
  
  /**
   * Vérifie les erreurs de consonnes doubles
   */
  export const checkDoubleConsonantError = (correct: string, input: string): boolean => {
    const doubleConsonants = ['mm', 'nn', 'tt', 'll', 'ss', 'rr', 'cc', 'ff', 'pp'];
    for (let dc of doubleConsonants) {
      if (correct.includes(dc) && !input.includes(dc)) {
        return true; // Il manque une double consonne
      }
      if (!correct.includes(dc) && input.includes(dc)) {
        return true; // Il y a une double consonne en trop
      }
    }
    return false;
  };
  
  /**
   * Normalise un mot en remplaçant "oe" par "œ"
   */
  export const normalizeWord = (word: string): string => {
    return word.replace(/oe/g, "œ");
  };
  
  /**
   * Supprime les marqueurs spéciaux (#) d'un mot
   */
  export const removeMarkers = (word: string): string => {
    return word.replace(/^#|#$/g, '');
  };