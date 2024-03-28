import { getDictationById } from '@/app/lib/data_prisma';
import Dictation from '@/app/ui/dictation/dictation';
import '@/app/globals.css';

export default async function Page() {

  const initialDictationData = await getDictationById('club17az5000ic0ngm0fys7qp');

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
