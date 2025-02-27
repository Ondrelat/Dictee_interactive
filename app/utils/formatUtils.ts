/**
 * Formate une durée en minutes et secondes en chaîne de caractères MM:SS
 */
export const formatDuration = (minutes: number | null, seconds: number | null): string | null => {
    if (minutes === null || seconds === null) {
      return null;
    }
    
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    
    return `${formattedMinutes}:${formattedSeconds}`;
  };
  
  /**
   * Détermine la classe CSS à utiliser en fonction de l'état du mot
   */
  export const getWordStateClassName = (state: string): string => {
    let className = "inline-block px-1 py-0.5 rounded m-0.5 ";
    
    switch (state) {
      case "correct":
        return className + "bg-green-100";
      case "incorrect":
      case "forced":
        return className + "bg-red-100";
      case "ErrorMajuscule":
      case "ErrorPonctuation":
        return className + "bg-yellow-100";
      default:
        return className + "bg-gray-100";
    }
  };
  
  /**
   * Détermine la classe CSS à utiliser en fonction du niveau de difficulté
   */
  export const getLevelClassName = (level: string): string => {
    switch (level) {
      case 'Débutant':
        return 'bg-green-100 text-green-800';
      case 'Intermédiaire':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };