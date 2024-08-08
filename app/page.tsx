// page.tsx (Server Component)
import type { Metadata } from "next";
import Image from 'next/image';
import '@/app/fontButterfly.css';
import '@/app/globals.css';
import { getAllDictations } from '@/app/lib/data_prisma';
import DictationList from './dictationList'; // Nouveau composant Client

export const metadata: Metadata = {
  title: "Dictée Interactive",
  description: "Avec Dictée Interactive, améliorez votre orthographe grâce à des dictées avec correction en temps réel et des aides interactives personnalisées.",
  keywords: "dictée interactive, Orthographe, audio en ligne, Correction en temps réel",
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function Page() {
  const allDictations = await getAllDictations();

  return (
    <>
      {/*Mobile*/}
      <div className="block lg:hidden">
        <div id="BookHeader" className="book-mobile-bg flex-2 flex flex-col">
          <h1 className="font-butterfly-kids mt-10 leading-10 mx-4 text-center text-36px">
            Et si on apprenait les règles d&#39;orthographe pendant la dictée ?
          </h1>

          <div className="relative mt-8">
            <Image
              src="/images/man.png"
              alt="Description of image"
              width={500}
              height={300}
              className="w-full rounded-3xl"
            />
          </div>
        </div>
        <DictationList initialDictations={allDictations} />
      </div>
      {/*Non mobile*/}
      <div className="hidden lg:block">
        <div id="BookHeader" className="bigbackground-bg flex flex-1 items-center justify-center">
          <h1 className="font-butterfly-kids mx-16 text-center text-6xl font-semibold flex-1">
            Et si on apprenait les règles d&#39;orthographe pendant la dictée ?
          </h1>

          <div className="relative mt-8 flex-1">
            <Image
              src="/images/bigman.png"
              alt="Description of image"
              width={1000}
              height={800}
              className="w-full"
            />
          </div>
        </div>
        <DictationList initialDictations={allDictations} />
      </div>

    </>
  );
}
