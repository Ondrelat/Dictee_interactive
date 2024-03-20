import { getDictationById } from '@/app/lib/data_prisma';
import Dictation from '@/app/ui/dictation/dictation';
import '@/app/globals.css';

export default async function Page() {

  const initialDictationData = await getDictationById('cltyk5yvm000anfm71dsdlc6e');

  if(initialDictationData)
    return (
      <>
        <Dictation initialDictationData={initialDictationData} />
      </>
    );
  else
  return (
    <>
      <p>Erreur lors de la récupération de la dictée</p>
    </>
  );
}
