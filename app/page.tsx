import type { Metadata } from "next";
import StarterDictationLevel from './startDictationLevel';
import Image from 'next/image';
import '@/app/fontButterfly.css';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: "Dictée Interactive",
  description: "Avec Dictée Interactive, améliorez votre orthographe grâce à des dictées avec correction en temps réel et des aides interactives personnalisées.",
  keywords: "dictée interactive, Orthographe, audio en ligne, Correction en temps réel",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function Page() {
  return (
    <>
      <div id="BookHeader" className="book-mobile-bg flex-1">
        <h1 className="font-butterfly-kids mt-2 leading-10 mx-2 text-center text-36px">
          Et si on apprenait les règles d’orthographe pendant la dictée ?
        </h1>

        <div className="relative mt-8">
          <Image
            src="/images/man.png"
            alt="Description of image"
            width={500} // Provide appropriate width
            height={300} // Provide appropriate height
            className="w-full rounded-3xl"
          />
        </div>

      </div>
      <div id="LevelSelector" className="flex-grow">
        <div className="relative shadow-lg rounded-2xl p-6" style={{ backgroundColor: '#222B42' }}>
          <p className="font-butterfly-kids text-white text-4xl mb-8 text-center">Séléctionner votre niveau</p>
          <StarterDictationLevel />
        </div>

      </div>
    </ >
  );
}