import React from 'react';
import Link from 'next/link';
import fs from 'fs/promises';
import path from 'path';
import { Metadata } from 'next';

interface RuleData {
    title: string;
    descriptions: Array<{
        title: string;
        type: string;
        text: string;
        exemple?: string;
        astuce?: string;
        exemple2?: string;
    }>;
}

export const metadata: Metadata = {
    title: 'Règles Grammaticales | Améliorez votre français',
    description: 'Découvrez notre liste complète de règles grammaticales françaises. Améliorez votre écriture et votre compréhension du français.',
};


async function getRules() {
    const filePath = path.join(process.cwd(), 'app', 'lib', 'data', 'helperData.json');
    const jsonData = await fs.readFile(filePath, 'utf8');
    const rulesData: Record<string, RuleData> = JSON.parse(jsonData);
    return Object.entries(rulesData);
}

export default async function Page() {
    const rules = await getRules();

    return (
        <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold text-center text-blue-800 mb-8">
                    Apprennez les règle d&apos;orthographe de la langue française
                </h1>
                <div className="max-w-3xl mx-auto">
                    <ul className="bg-white shadow-lg rounded-lg overflow-hidden">
                        {rules.map(([id, rule], index) => (
                            <li key={id} className={index !== 0 ? "border-t border-gray-200" : ""}>
                                <Link href={`/regle/${id}`} className="block hover:bg-blue-50 transition-colors duration-150 ease-in-out">
                                    <div className="p-4 flex justify-between items-center">
                                        <span className="text-lg text-gray-800 font-medium">{rule.title}</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}