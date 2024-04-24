import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { email, dictationId } = req.query;

  if (!email || !dictationId || typeof email !== 'string' || typeof dictationId !== 'string') {
    return res.status(400).json({ message: 'Email ou dictationId manquant ou de type invalide' });
  }

  try {
    const bestScore = await prisma.score.findFirst({
      where: {
        user: { email },
        dictation_id: dictationId,
      },
      orderBy: {
        score: 'desc',
      },
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

    if (!bestScore) {
      return res.status(404).json({ message: 'Aucun score trouvé pour cet utilisateur et cette dictée' });
    }

    res.status(200).json({ bestScore });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}