import { getRandomDictationByLevel, getDictationById } from '@/app/lib/data_prisma';
import Dictation from '@/app/ui/dictation/dictation';
import type { Metadata } from "next";
interface PageProps {
    searchParams: { level?: string; id?: string; };
}

export const metadata: Metadata = {
    title: "Dictée Intéractive",
    description: "Et si on apprenait les règles d'orthographe pendant la dictée ?",
    keywords: "Dictée, Orthographe, Dictée interactive, Apprendre l'orthographe, Règle d'orthographe",
};

export default async function DictationPage({
    searchParams,
}: {
    searchParams?: { [key: string]: string | undefined };
}) {
    const level = typeof searchParams?.level === 'string' ? searchParams.level : 'Débutant';
    const id = typeof searchParams?.id === 'string' ? searchParams.id : undefined;

    let initialDictationData;

    if (id) {
        initialDictationData = await getDictationById(id);
    } else {
        initialDictationData = await getRandomDictationByLevel(level);
    }

    if (initialDictationData) {
        return (
            <>
                <Dictation initialDictationData={initialDictationData} />
            </>
        );
    } else {
        return <p>Erreur lors de la récupération de la dictée</p>;
    }
}