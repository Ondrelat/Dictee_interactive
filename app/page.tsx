import type { Metadata } from "next";
import StarterDictationLevel from './startDictationLevel';
import CardDictation from './card';
import Image from 'next/image';
import '@/app/fontButterfly.css';
import '@/app/globals.css';
import { getAllDictations } from '@/app/lib/data_prisma';

export const metadata: Metadata = {
  title: "Dictée Interactive",
  description: "Avec Dictée Interactive, améliorez votre orthographe grâce à des dictées avec correction en temps réel et des aides interactives personnalisées.",
  keywords: "dictée interactive, Orthographe, audio en ligne, Correction en temps réel",
  icons: {
    icon: "/favicon.ico",
  },
};



export default async function Page() {
  const dictationByLevel = await getAllDictations();
  return (
    <>
      <div id="BookHeader" className="book-mobile-bg flex-2 flex flex-col">
        <h1 className="font-butterfly-kids mt-10 leading-10 mx-4 text-center text-36px">
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
      <div id="LevelSelector" className="flex-grow flex">

        <div className="relative shadow-lg rounded-t-2xl flex-1 flex flex-col bg-[#222B42]">
          <p className="font-butterfly-kids text-white text-4xl mt-4 mb-4 text-center">Séléctionner votre niveau</p>
          <StarterDictationLevel />
          {dictationByLevel.map((dictee) => (
            <CardDictation key={dictee.id} initialDictationData={dictee} />
          ))}

          {/*
          <div className="bg-white m-8 h-20 rounded-2xl">
            <p className="font-bold text-xl my-2 mx-4">Title</p>
            <p className="font-bold text-xl my-2 mx-4"></p>
          </div>
          */}
          <div className="flex-grow bg-[#222B42]"></div>
          {/*Permet d'etendre le background jusqu'en bas de l'écran*/}
          <div className="flex-grow bg-[#222B42]"></div>
        </div>

      </div>
    </ >
  );
}