import { getRandomDictationByLevel, getYourBestScore } from '@/app/lib/data_prisma';
import Dictation from '@/app/ui/dictation/dictation';
import '@/app/globals.css';
import type { Metadata } from "next";

interface PageProps {
  searchParams: { level?: string; };
}

export const metadata: Metadata = {
  title: "Dictée aléatoire",
  description: "Prêt pour lancer une dictée aléatoire ? Une correction en temps réel, et des aides vous serons proposer",
  keywords: "Dictée aléatoire, aide intéractive",
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
  console.log(level);

  const initialDictationData = await getRandomDictationByLevel(level);

  if (initialDictationData) {
    return (
      <>
        <Dictation initialDictationData={initialDictationData} />
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