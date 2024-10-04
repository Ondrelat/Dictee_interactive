import Link from 'next/link';
import { notFound } from 'next/navigation';
import fs from 'fs/promises';
import path from 'path';
import { Metadata } from 'next';

interface Description {
    title: string;
    type: string;
    text: string;
    exemple?: string;
    astuce?: string;
    exemple2?: string;
}

interface RuleData {
    title: string;
    descriptions: Description[];
}

interface PageProps {
    params: { id: string }
}

async function getRuleData(id: string): Promise<RuleData> {
    const filePath = path.join(process.cwd(), 'app', 'lib', 'data', 'helperData.json');
    const jsonData = await fs.readFile(filePath, 'utf8');
    const rules: Record<string, RuleData> = JSON.parse(jsonData);
    const rule = rules[id];
    if (!rule) notFound();
    return rule;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const rule = await getRuleData(params.id);
    return {
        title: `${rule.title} | Dictée interactive`,
        description: `Apprenez la règle grammaticale : ${rule.title}. Exemples et astuces pour mieux comprendre et utiliser cette règle.`,
    };
}

function DescriptionCard({ description }: { description: Description }) {
    return (
        <div className="bg-white rounded shadow-sm border border-gray-200 p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold text-gray-800">{description.title}</h2>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                    {description.type}
                </span>
            </div>
            <p className="text-sm text-gray-600 mb-2">{description.text}</p>
            {description.exemple && (
                <div className="bg-gray-50 p-2 rounded mb-2">
                    <h3 className="text-sm font-medium text-gray-700">Exemple :</h3>
                    <p className="text-sm italic text-gray-600">{description.exemple}</p>
                </div>
            )}
            {description.astuce && (
                <div className="bg-yellow-50 p-2 rounded mb-2">
                    <h3 className="text-sm font-medium text-yellow-800">Astuce :</h3>
                    <p className="text-sm text-gray-700">{description.astuce}</p>
                </div>
            )}
            {description.exemple2 && (
                <div className="bg-gray-50 p-2 rounded">
                    <h3 className="text-sm font-medium text-gray-700">Autre exemple :</h3>
                    <p className="text-sm italic text-gray-600">{description.exemple2}</p>
                </div>
            )}
        </div>
    );
}

export default async function RulePage({ params }: PageProps) {
    const rule = await getRuleData(params.id);

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-white shadow">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <h1 className="text-2xl font-bold text-gray-900">{rule.title}</h1>
                </div>
            </div>
            <div className="max-w-4xl mx-auto px-4 py-4">
                <div className="mb-4">
                    {rule.descriptions.map((desc, index) => (
                        <DescriptionCard key={index} description={desc} />
                    ))}
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <Link
                        href="/"
                        className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 transition-colors text-center w-full sm:w-auto"
                    >
                        Pratiquer avec une dictée
                    </Link>
                    <Link
                        href="/regle"
                        className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                    >
                        Retour à la liste des règles
                    </Link>
                </div>
            </div>
        </div>
    );
}