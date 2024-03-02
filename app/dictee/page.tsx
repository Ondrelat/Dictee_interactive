import { getDictationById } from '@/app/lib/data_prisma';
import Dictation from '@/app/ui/dictation/dictation';

export default async function Page() {

  const initialDictation = await getDictationById('1');

  return (
    <div>
      <Dictation initialDictation={initialDictation} />
    </div>
  );
}
