import type { Metadata } from "next";
import { getAllDictations } from '@/app/lib/data_prisma';
import DictationList from './dictationList';
import Image from 'next/image';

export default async function HomePage() {
  const allDictations = await getAllDictations();

  return (
    <main>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:h-[calc(100vh-40vh)]">
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="font-space-grotesk leading-snug my-8 lg:my-0 mx-6 lg:mx-24 text-center text-[24px] md:text-[40px] font-semibold">
            Et si on apprenait les règles d&apos;orthographe pendant la dictée ?
          </h1>
          <p className="text-center mx-6 lg:mx-24 text-xl text-gray-600 italic mt-6 font-normal">
            Fini d&apos;attendre la fin de la dictée pour avoir la correction. Ici, on est en temps réel et les aides pour apprendre l&apos;orthographe sont affichées au fur et à mesure.
          </p>
        </div>

        <div className="flex items-center justify-center h-full mt-0 lg:mt-12">
          <video
            width="600"
            height="400"
            autoPlay
            loop
            muted
            playsInline
            poster="/thumbnail.jpg"
            className="lg:max-w-[600px]"
          >
            <source src="/Presentation.mp4" type="video/mp4" />
            Votre navigateur ne supporte pas la balise vidéo.
          </video>
        </div>
      </div>
      <DictationList initialDictations={allDictations} />
    </main>
  );
}