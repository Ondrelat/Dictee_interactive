import { useMemo } from 'react';
import * as TextUtils from '@/app/utils/textUtils';

interface WordComparisonProps {
  currentInput: string;
  currentWordToGuess: string;
  previousWord?: string;
}

interface WordComparisonResult {
  isCorrect: boolean;
  errorMessage: string | null;
}

/**
 * Hook personnalisé pour comparer les mots et générer des messages d'erreur appropriés
 */
export const useWordComparison = ({ 
  currentInput, 
  currentWordToGuess, 
  previousWord 
}: WordComparisonProps): WordComparisonResult => {
  
  return useMemo(() => {
    // Si l'input est vide, ne pas faire de comparaison
    if (!currentInput) {
      return { isCorrect: false, errorMessage: null };
    }

    // Normalisation des mots pour la comparaison
    const normalizedInput = TextUtils.normalizeWord(currentInput);
    const tempNormalizedWordToGuess = TextUtils.normalizeWord(currentWordToGuess);
    const normalizedWordToGuess = TextUtils.removeMarkers(tempNormalizedWordToGuess);

    // Vérifier si c'est exactement correct
    if (normalizedInput === normalizedWordToGuess) {
      return { isCorrect: true, errorMessage: null };
    }

    // Préparation pour l'analyse des erreurs
    const wordGuessPunctuationless = TextUtils.removePunctuation(currentWordToGuess);
    const inputPunctuationless = TextUtils.removePunctuation(currentInput);
    
    const wordGuessAccentless = TextUtils.removeAccents(currentWordToGuess);
    const wordGuessAccentPunctless = TextUtils.removeAccents(wordGuessPunctuationless);
    const inputPunctuationAccentless = TextUtils.removeAccents(inputPunctuationless);
    
    // Détection du type d'erreur
    let errorMessage = null;

    // 1. Erreur de majuscule
    if (currentInput === currentWordToGuess.toLowerCase()) {
      if (!previousWord || previousWord.endsWith('.') || previousWord.endsWith('!') || previousWord.endsWith('?')) {
        errorMessage = "Une phrase commence toujours par une majuscule";
      } else {
        errorMessage = "Un nom propre commence toujours par une majuscule";
      }
    }
    // 2. Erreur de doubles consonnes
    else if (TextUtils.checkDoubleConsonantError(wordGuessAccentPunctless, inputPunctuationAccentless)) {
      errorMessage = 'Attention aux doubles consonnes. (mm, tt, ss, pp...)';
    }
    // 3. Erreur d'accord
    else if ((wordGuessAccentPunctless.endsWith("s") && inputPunctuationAccentless === TextUtils.removeFinalS(wordGuessAccentPunctless)) ||
      (wordGuessAccentPunctless.endsWith("es") && inputPunctuationAccentless === TextUtils.removeFinalES(wordGuessAccentPunctless)) ||
      (wordGuessAccentPunctless.endsWith("e") && inputPunctuationAccentless === TextUtils.removeFinalE(wordGuessAccentPunctless)) ||
      TextUtils.checkMissingEBeforeS(wordGuessPunctuationless, wordGuessAccentPunctless)) {
      errorMessage = "Il y a probablement une faute d'accord";
    }
    // 4. Erreur d'accent
    else if (wordGuessAccentless === currentInput) {
      errorMessage = "Il y a probablement un problème d'accent";
    }
    // 5. Erreur de ponctuation
    else if (currentInput === wordGuessPunctuationless && currentInput !== currentWordToGuess) {
      if (currentWordToGuess.endsWith('.') || currentWordToGuess.endsWith('!') || currentWordToGuess.endsWith('?')) {
        errorMessage = 'Une phrase se finit toujours par un point';
      } else {
        errorMessage = 'Attention aux ponctuations (,;:)';
      }
    }

    return { 
      isCorrect: false, 
      errorMessage 
    };
  }, [currentInput, currentWordToGuess, previousWord]);
};