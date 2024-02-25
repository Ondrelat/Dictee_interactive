import { fetchDictationById } from '@/app/lib/data';
import Input from './components/input';

export default async function Page() {

    const dictation = await fetchDictationById('7');
  
    return (
      <div>
        <div><Input dictation={dictation}/></div>
      </div>
    );
}
