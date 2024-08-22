import { getRandomDictationByLevel, getDictationById } from '@/app/lib/data_prisma';
import Dictation from '@/app/ui/dictation/dictation';
import '@/app/globals.css';
import type { Metadata } from "next";
import { getAllDictations } from '@/app/lib/data_prisma';
import DictationList from './dictationList';
import Image from 'next/image';


interface PageProps {
  searchParams: { level?: string; id?: string; };
}

export const metadata: Metadata = {
  title: "Dictée aléatoire",
  description: "Prêt pour lancer une dictée aléatoire ? Une correction en temps réel, et des aides vous seront proposées",
  keywords: "Dictée aléatoire, aide interactive",
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | undefined };
}) {
  const level = typeof searchParams?.level === 'string' ? searchParams.level : 'Débutant';
  const id = typeof searchParams?.id === 'string' ? searchParams.id : undefined;

  let initialDictationData;

  const allDictations = await getAllDictations();

  if (id) {
    initialDictationData = await getDictationById(id);
  } else {
    initialDictationData = await getRandomDictationByLevel(level);
  }

  if (initialDictationData) {
    return (
      <>
        <div className="w-2/3 mx-auto">
          <Dictation initialDictationData={initialDictationData} />
        </div>

        <div className="absolute z-[-10] bottom-80 lg:bottom-32 left-1/2 lg:left-3/4 transform -translate-x-1/2">
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
  } else {
    return (
      <>
        <p>Erreur lors de la récupération de la dictée</p>
      </>
    );
  }
}
