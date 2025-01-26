import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Méthode non autorisée' });
    }

    const { email } = req.query;

    if (!email || typeof email !== 'string') {
        return res.status(400).json({ message: 'Email manquant ou de type invalide' });
    }

    try {
        const bestScores = await prisma.score.findMany({
            where: {
                user: { email },
            },
            orderBy: [
                { dictation_id: 'asc' },
                { score: 'desc' },
            ],
            distinct: ['dictation_id'],
            select: {
                id: true,
                dictation: {
                    select: {
                        id: true,
                        title: true,
                        level: true,
                    },
                },
                note: true,
                score: true,
                timer: true,
                correct_words: true,
                incorrect_words: true,
                pourcentage: true,
            },
        });

        if (bestScores.length === 0) {
            return res.status(404).json({ message: 'Aucun score trouvé pour cet utilisateur' });
        }

        res.status(200).json({ bestScores });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}