import type { Metadata } from "next";
import StarterDictationLevel from './startDictationLevel';

import '@/app/globals.css';

export const metadata: Metadata = {
  title: "Dictée Interactive",
  description: "Avec Dictée Interactive, améliorez votre orthographe grâce à des dictées avec correction en temps réel et des aides interactives personnalisées.",
  keywords: "Dictée, Orthographe, dictée interactive, dictée audio en ligne, Correction en temps réel, Dictée en temps réel",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-115px)] bg-gray-100">
      <div className="relative max-w-xl mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-sky-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative bg-white shadow-lg rounded-3xl p-8 sm:p-12">
          <h1 className="text-4xl font-bold text-center mb-6">Bienvenue sur Dictée Interactive</h1>
          <p className="text-xl mb-8 text-center">
            Vivez une expérience de dictée innovante. Avec une correction mot à mot, une aide ciblée sur les difficultés et un audio qui s&apos;adapte à votre rythme, progressez de manière interactive et motivante.
          </p>
          <p className="text-xl mb-8 text-center">Choisissez votre niveau et commencez l&apos;aventure :</p>
          <StarterDictationLevel />
        </div>
      </div>
    </div>
  );
}