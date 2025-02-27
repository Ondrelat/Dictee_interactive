'use client';

import React, { createContext, useContext } from 'react';

/**
 * Interface pour les données d'un mot dans la dictée
 */
export interface WordData {
  word: string;
  state: string;
}

/**
 * Interface pour l'état de la dictée
 */
export interface DictationState {
  dictationText: string;
  input: string;
  isTyping: boolean;
  score: number;
  numberCorrect: number;
  numberIncorrect: number;
  wordDataArray: WordData[];
  stateWordInput: string;
  currentWordToGuess: string;
  timer: string;
  onDictationFinished: boolean;
  correctPercentage: number;
  baseScore: number;
  audioIndex: number;
  scoreBeforeAugmentation: number;
  scoreBonusPercentage: number;
  finalScore: number;
  typeError: string;
  currentWordIndex: number;
  timerStarted: boolean;
}

/**
 * Interface pour le contexte de dictée
 */
export interface DictationContextType {
  state: DictationState;
  setState: React.Dispatch<React.SetStateAction<DictationState>>;
  handleNextWord: (paramState: string | null) => void;
  handleReponseFalse: () => void;
}

/**
 * État initial de la dictée
 * @param dictationText Texte de la dictée
 */
export const getInitialState = (dictationText: string): DictationState => {
  const baseScore = 1000;

  return {
    input: '',
    isTyping: false,
    score: baseScore,
    numberCorrect: 0,
    numberIncorrect: 0,
    wordDataArray: [],
    stateWordInput: 'correct',
    currentWordToGuess: dictationText.split(' ')[0],
    timer: '00:00:00',
    onDictationFinished: false,
    correctPercentage: 100,
    baseScore: baseScore,
    audioIndex: 1,
    scoreBeforeAugmentation: 0,
    scoreBonusPercentage: 0,
    finalScore: 0,
    dictationText: dictationText,
    typeError: '',
    currentWordIndex: 0,
    timerStarted: false,
  };
};

// Valeur par défaut du contexte
const defaultContextValue: DictationContextType = {
  state: getInitialState(''),
  setState: () => null,
  handleNextWord: () => null,
  handleReponseFalse: () => null,
};

// Création du contexte
const DictationContext = createContext<DictationContextType>(defaultContextValue);

/**
 * Hook pour utiliser le contexte de dictée
 */
export const useDictationContext = () => useContext(DictationContext);

/**
 * Fournisseur du contexte de dictée
 */
export const DictationProvider: React.FC<{
  children: React.ReactNode;
  value: DictationContextType;
}> = ({ children, value }) => {
  return (
    <DictationContext.Provider value={value}>
      {children}
    </DictationContext.Provider>
  );
};

export default DictationContext;