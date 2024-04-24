import { getRandomDictationByLevel, getYourBestScore } from '@/app/lib/data_prisma';
import Dictation from '@/app/ui/dictation/dictation';
import '@/app/globals.css';
interface PageProps {
  searchParams: { level?: string; };
}

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
  //const yourBestScore = await getYourBestScore(session?.user?.email,);
  //console.log("yourBestScore" + yourBestScore)
  //const classement = await getClassement(initialDictationData.id);

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