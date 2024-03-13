import { getDictationById } from '@/app/lib/data_prisma';
import Dictation from '@/app/ui/dictation/dictation';
import '@/app/globals.css';

export default async function Page() {

  const initialDictationData = await getDictationById('1');

  return (
    <>
      <Dictation initialDictationData={initialDictationData} />
    </>
  );
}
