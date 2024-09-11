import type { Metadata } from "next";
import { getAllDictations } from '@/app/lib/data_prisma';
import DictationList from './dictationList';
import Image from 'next/image';

export const metadata: Metadata = {
  title: "Accueil - Dictées",
  description: "Et si on apprenait les règles d'orthographe pendant la dictée ?",
  keywords: "Dictée, apprentissage, français",
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function HomePage() {
  const allDictations = await getAllDictations();

  return (
    <main className="flex flex-col flex-1 lg:justify-center items-center p-6 sm:p-12">
      <h1 className="font-butterfly-kids mt-2 leading-snug mx-4 text-center text-36px font-semibold 
                     lg:absolute lg:top-1/2 lg:left-1/4 lg:transform lg:-translate-y-1/2 lg:-translate-x-1/2 
                     lg:text-center lg:w-1/2 lg:mt-0 lg:mx-0 lg:p-12">
        Et si on apprenait les règles d&apos;orthographe pendant la dictée ?
      </h1>

      <div className="w-2/3 mx-auto z-[10]">
        <DictationList initialDictations={allDictations} />
      </div>

      <div className="absolute bottom-60 lg:bottom-40 left-1/2 lg:left-3/4 transform -translate-x-1/2">
        <Image
          src="/images/bigman.png"
          alt="Description of image"
          width={400}
          height={500}
          className="max-w-[200px] md:max-w-[200px] lg:max-w-[400px]"
          style={{ maxHeight: '50vh' }}
        />
      </div>
    </main>
  );
}