import type { Metadata } from "next";
import Image from 'next/image';
import '@/app/fontButterfly.css';
import '@/app/globals.css';
import { getAllDictations } from '@/app/lib/data_prisma';
import DictationList from './dictationList';

export const metadata: Metadata = {
  // ... (votre metadata reste inchangée)
};

export default async function Page() {
  const allDictations = await getAllDictations();

  return (
    <>
      <div id="Title" className="z-[20] relative flex-1 flex flex-row justify-center lg:items-center pb-40">
        <h1 className="w-full lg:w-1/2 flex-1 font-butterfly-kids text-center text-36px lg:text-6xl font-semibold mx-4 lg:mx-16 mt-10 lg:mt-0 lg:mt-0">
          Et si on apprenait les règles d&#39;orthographe pendant la dictée ?
        </h1>
        <div className="lg:flex-1"></div>


      </div>
      <div className="absolute z-[10] bottom-80 lg:bottom-32 left-1/2 lg:left-3/4 transform -translate-x-1/2">
        <Image
          src="/images/bigman.png"
          alt="Description of image"
          width={400}
          height={500}
          className="max-w-[200px] md:max-w-[200px] lg:max-w-[400px]"
          style={{ maxHeight: '50vh' }}  // Limite la hauteur à 50% de la hauteur de la vue
        />
      </div>
      <div className="absolute z-[20]">
        <DictationList initialDictations={allDictations} />
      </div>

    </>
  );
}